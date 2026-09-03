// ==========================================
// Vertex AI Project Mode v2 patch
// Faster project analysis + read-only audit mode
// ==========================================

(function () {
    "use strict";

    let currentPlan = null;
    let installed = false;

    async function getClient() {
        if (
            window.VertexAuth &&
            typeof window.VertexAuth.ensureSupabase === "function"
        ) {
            return await window.VertexAuth.ensureSupabase();
        }

        if (window.supabaseClient && window.supabaseClient.functions) {
            return window.supabaseClient;
        }

        throw new Error("supabase_not_ready");
    }

    async function invoke(functionName, body) {
        const client = await getClient();
        const result = await client.functions.invoke(functionName, {
            body: body
        });

        if (result.error) {
            let details = null;

            try {
                if (
                    result.error.context &&
                    typeof result.error.context.json === "function"
                ) {
                    details = await result.error.context.json();
                }
            }
            catch (error) {}

            const err = new Error(
                details && (details.error || details.message)
                    ? (details.error || details.message)
                    : (result.error.message || "project_mode_error")
            );

            if (details && details.code) {
                err.code = details.code;
            }

            throw err;
        }

        return result.data || {};
    }

    function showError(message) {
        const box = document.getElementById("vertexProjectError");
        if (!box) return;
        box.textContent = String(message || "حصل خطأ في Project Mode.");
        box.classList.add("show");
    }

    function clearError() {
        const box = document.getElementById("vertexProjectError");
        if (!box) return;
        box.textContent = "";
        box.classList.remove("show");
    }

    function setBusy(button, busy, text) {
        if (!button) return;

        if (busy) {
            if (!button.dataset.v2OriginalText) {
                button.dataset.v2OriginalText = button.textContent;
            }
            button.disabled = true;
            button.textContent = text || "جاري التنفيذ...";
        }
        else {
            button.disabled = false;
            if (button.dataset.v2OriginalText) {
                button.textContent = button.dataset.v2OriginalText;
            }
        }
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, "&#096;");
    }

    function selectedRepo() {
        const select = document.getElementById("vertexRepoSelect");
        return select ? select.value.trim() : "";
    }

    function renderPlan(data) {
        const wrapper = document.getElementById("vertexProjectPlan");
        const summary = document.getElementById("vertexProjectPlanSummary");
        const files = document.getElementById("vertexProjectFiles");
        const applyButton = document.getElementById("vertexApplyPlanBtn");
        const cancelButton = document.getElementById("vertexCancelPlanBtn");

        if (!wrapper || !summary || !files) return;

        const analysisOnly = Boolean(data.analysis_only);
        summary.textContent = analysisOnly
            ? "🔎 نتيجة تحليل المشروع — لم يتم تعديل أي ملف:\n\n" + String(data.summary || "")
            : "Vertex AI جهز خطة تعديل ولم يغير المشروع حتى الآن:\n\n" + String(data.summary || "");

        files.innerHTML = "";

        if (analysisOnly) {
            const analyzed = Array.isArray(data.files_analyzed)
                ? data.files_analyzed
                : [];

            analyzed.slice(0, 12).forEach(function (path) {
                const row = document.createElement("div");
                row.className = "vertex-project-file";
                row.innerHTML = `
                    <span>🔍</span>
                    <div>
                        <code>${escapeHtml(path)}</code>
                        <small>تمت قراءة الملف أثناء التحليل</small>
                    </div>
                `;
                files.appendChild(row);
            });

            if (applyButton) applyButton.style.display = "none";
            if (cancelButton) cancelButton.style.display = "none";
            currentPlan = null;
        }
        else {
            const operations = Array.isArray(data.operations)
                ? data.operations
                : [];

            operations.forEach(function (operation) {
                const row = document.createElement("div");
                row.className = "vertex-project-file";

                const icon = operation.action === "create"
                    ? "➕"
                    : operation.action === "delete"
                        ? "🗑️"
                        : "✏️";

                row.innerHTML = `
                    <span>${icon}</span>
                    <div>
                        <code>${escapeHtml(operation.path || "")}</code>
                        <small>${escapeHtml(operation.reason || operation.action || "")}</small>
                    </div>
                `;
                files.appendChild(row);
            });

            if (applyButton) applyButton.style.display = "inline-flex";
            if (cancelButton) cancelButton.style.display = "inline-flex";
            currentPlan = data;
        }

        wrapper.classList.add("show");
    }

    async function preparePlan() {
        clearError();
        currentPlan = null;

        const repo = selectedRepo();
        const textarea = document.getElementById("vertexProjectInstruction");
        const button = document.getElementById("vertexPreparePlanBtn");
        const planElement = document.getElementById("vertexProjectPlan");
        const resultElement = document.getElementById("vertexProjectResult");
        const instruction = textarea ? textarea.value.trim() : "";

        if (!repo) {
            showError("اختر المشروع أولًا.");
            return;
        }

        if (instruction.length < 3) {
            showError("اكتب وش تبغى Vertex AI يسوي في المشروع.");
            return;
        }

        if (planElement) planElement.classList.remove("show");
        if (resultElement) resultElement.classList.remove("show");

        setBusy(button, true, "🤖 يقرأ الملفات ويحلل المشروع...");

        try {
            const data = await invoke("vertex-github-plan", {
                repo: repo,
                instruction: instruction
            });

            renderPlan(data);
        }
        catch (error) {
            if (error && error.code === "project_ai_rate_limit") {
                showError("Gemini وصل للحد المؤقت الآن. انتظر قليلًا ثم جرّب مرة ثانية.");
            }
            else if (error && error.code === "project_ai_timeout") {
                showError("تحليل المشروع أخذ وقتًا طويلًا. جرّب طلبًا أضيق مثل: افحص تسجيل الدخول فقط.");
            }
            else if (error && error.code === "empty_plan") {
                showError("تم فهم المشروع لكن ما قدر يجهز تعديل آمن. وضّح التغيير المطلوب أكثر.");
            }
            else {
                showError(error.message || "تعذر تحليل المشروع.");
            }
        }
        finally {
            setBusy(button, false);
        }
    }

    async function applyPlan() {
        clearError();

        if (!currentPlan || !currentPlan.plan_id) {
            showError("جهز خطة تعديل أولًا.");
            return;
        }

        const button = document.getElementById("vertexApplyPlanBtn");
        const resultElement = document.getElementById("vertexProjectResult");

        setBusy(button, true, "ينشئ فرع آمن ويطبق التعديلات...");

        try {
            const data = await invoke("vertex-github", {
                action: "apply",
                plan_id: currentPlan.plan_id,
                confirm: true,
                mode: "pr"
            });

            if (resultElement) {
                let html = "✅ تم تطبيق التغييرات في فرع منفصل، وليس مباشرة على الفرع الأساسي.";

                if (data.pull_request_url) {
                    html += `<br><a href="${escapeAttribute(data.pull_request_url)}" target="_blank" rel="noopener noreferrer">فتح Pull Request في GitHub ↗</a>`;
                }
                else if (data.commit_url) {
                    html += `<br><a href="${escapeAttribute(data.commit_url)}" target="_blank" rel="noopener noreferrer">فتح التعديل في GitHub ↗</a>`;
                }

                if (data.warning) {
                    html += `<br><br>⚠️ ${escapeHtml(data.warning)}`;
                }

                resultElement.innerHTML = html;
                resultElement.classList.add("show");
            }

            const planElement = document.getElementById("vertexProjectPlan");
            if (planElement) planElement.classList.remove("show");
            currentPlan = null;
        }
        catch (error) {
            if (error && error.code === "stale_plan") {
                showError("المشروع تغير بعد تجهيز الخطة. جهز الخطة مرة ثانية قبل التطبيق.");
            }
            else {
                showError(error.message || "تعذر تطبيق التعديلات.");
            }
        }
        finally {
            setBusy(button, false);
        }
    }

    async function cancelPlan() {
        if (!currentPlan || !currentPlan.plan_id) return;

        const button = document.getElementById("vertexCancelPlanBtn");
        setBusy(button, true, "جاري الإلغاء...");

        try {
            await invoke("vertex-github", {
                action: "cancel_plan",
                plan_id: currentPlan.plan_id
            });
        }
        catch (error) {}
        finally {
            currentPlan = null;
            const wrapper = document.getElementById("vertexProjectPlan");
            if (wrapper) wrapper.classList.remove("show");
            setBusy(button, false);
        }
    }

    function replaceButton(id, handler) {
        const oldButton = document.getElementById(id);
        if (!oldButton || oldButton.dataset.vertexProjectV2 === "1") return false;

        const newButton = oldButton.cloneNode(true);
        newButton.dataset.vertexProjectV2 = "1";
        oldButton.replaceWith(newButton);
        newButton.addEventListener("click", handler);
        return true;
    }

    function install() {
        if (installed) return;

        const modal = document.getElementById("vertexProjectModal");
        if (!modal) {
            setTimeout(install, 80);
            return;
        }

        replaceButton("vertexPreparePlanBtn", preparePlan);
        replaceButton("vertexApplyPlanBtn", applyPlan);
        replaceButton("vertexCancelPlanBtn", cancelPlan);

        installed = true;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setTimeout(install, 0);
        });
    }
    else {
        setTimeout(install, 0);
    }
})();
