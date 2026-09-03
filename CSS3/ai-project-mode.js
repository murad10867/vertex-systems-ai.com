// ==========================================
// Vertex AI Project Mode
// Secure GitHub project reading + AI change plans
// ==========================================

(function () {
    "use strict";

    let clientPromise = null;
    let currentPlan = null;
    let connected = false;
    let githubLogin = "";

    function getClient() {
        if (clientPromise) return clientPromise;

        clientPromise = (async function () {
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
        })();

        return clientPromise;
    }

    async function invoke(body) {
        const client = await getClient();
        const result = await client.functions.invoke("vertex-github", {
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

    function installStyles() {
        if (document.getElementById("vertexProjectModeStyles")) return;

        const style = document.createElement("style");
        style.id = "vertexProjectModeStyles";
        style.textContent = `
            .vertex-project-modal {
                position: fixed;
                inset: 0;
                z-index: 10050;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
                direction: rtl;
            }

            .vertex-project-modal.open {
                display: flex;
            }

            .vertex-project-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.72);
                backdrop-filter: blur(5px);
            }

            .vertex-project-panel {
                position: relative;
                width: min(760px, 100%);
                max-height: min(830px, 92vh);
                overflow: auto;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 20px;
                background: #0a111d;
                color: #eaf2ff;
                box-shadow: 0 30px 90px rgba(0,0,0,0.45);
            }

            .vertex-project-header {
                position: sticky;
                top: 0;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                padding: 18px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.08);
                background: rgba(10,17,29,0.96);
                backdrop-filter: blur(10px);
            }

            .vertex-project-title h2 {
                margin: 0 0 4px;
                font-size: 18px;
            }

            .vertex-project-title p {
                margin: 0;
                color: #8594aa;
                font-size: 11px;
            }

            .vertex-project-close {
                width: 38px;
                height: 38px;
                border: 1px solid rgba(255,255,255,0.09);
                border-radius: 10px;
                background: #131d2b;
                color: #dbeaff;
                cursor: pointer;
            }

            .vertex-project-body {
                padding: 20px;
            }

            .vertex-project-status {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 16px;
                padding: 12px 14px;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 13px;
                background: #0e1724;
            }

            .vertex-project-status strong {
                font-size: 12px;
            }

            .vertex-project-status span {
                color: #8da0b8;
                font-size: 11px;
            }

            .vertex-project-section {
                margin-top: 14px;
                padding: 16px;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 15px;
                background: #0c1420;
            }

            .vertex-project-section h3 {
                margin: 0 0 7px;
                font-size: 14px;
            }

            .vertex-project-section > p {
                margin: 0 0 13px;
                color: #8b9ab0;
                font-size: 11px;
                line-height: 1.8;
            }

            .vertex-project-grid {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 9px;
            }

            .vertex-project-input,
            .vertex-project-select,
            .vertex-project-textarea {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid rgba(255,255,255,0.09);
                border-radius: 10px;
                outline: none;
                background: #080f19;
                color: #eef5ff;
                font: inherit;
                font-size: 12px;
            }

            .vertex-project-input,
            .vertex-project-select {
                min-height: 42px;
                padding: 0 12px;
            }

            .vertex-project-textarea {
                min-height: 115px;
                padding: 12px;
                resize: vertical;
                line-height: 1.7;
            }

            .vertex-project-btn {
                min-height: 42px;
                padding: 0 15px;
                border: 1px solid rgba(255,255,255,0.09);
                border-radius: 10px;
                background: #172437;
                color: #e6f1ff;
                cursor: pointer;
                font-weight: 700;
                font-size: 11px;
            }

            .vertex-project-btn:hover {
                background: #20314a;
            }

            .vertex-project-btn.primary {
                border-color: rgba(72, 150, 255, 0.28);
                background: #17437a;
            }

            .vertex-project-btn.success {
                border-color: rgba(72, 187, 120, 0.28);
                background: #155438;
            }

            .vertex-project-btn.danger {
                border-color: rgba(255, 100, 100, 0.22);
                background: #47202a;
            }

            .vertex-project-btn:disabled {
                opacity: 0.55;
                cursor: wait;
            }

            .vertex-project-token-help {
                margin: 10px 0 0;
                padding: 10px 12px;
                border-radius: 10px;
                background: rgba(62, 115, 180, 0.1);
                color: #a9bad0;
                font-size: 10px;
                line-height: 1.8;
            }

            .vertex-project-token-help a,
            .vertex-project-result a {
                color: #69b9ff;
            }

            .vertex-project-meta {
                display: none;
                margin-top: 10px;
                padding: 10px 12px;
                border-radius: 10px;
                background: #101b2a;
                color: #9aabc1;
                font-size: 10px;
                line-height: 1.8;
            }

            .vertex-project-meta.show {
                display: block;
            }

            .vertex-project-plan {
                display: none;
                margin-top: 14px;
            }

            .vertex-project-plan.show {
                display: block;
            }

            .vertex-project-plan-summary {
                padding: 12px;
                border-radius: 10px;
                background: #111c2b;
                color: #c9d7e8;
                font-size: 11px;
                line-height: 1.8;
            }

            .vertex-project-files {
                display: grid;
                gap: 7px;
                margin: 10px 0;
            }

            .vertex-project-file {
                display: flex;
                gap: 9px;
                align-items: flex-start;
                padding: 9px 10px;
                border: 1px solid rgba(255,255,255,0.07);
                border-radius: 9px;
                background: #09111c;
                font-size: 10px;
            }

            .vertex-project-file code {
                color: #d7eaff;
                direction: ltr;
                overflow-wrap: anywhere;
            }

            .vertex-project-file small {
                display: block;
                margin-top: 3px;
                color: #778aa3;
            }

            .vertex-project-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 12px;
            }

            .vertex-project-result {
                display: none;
                margin-top: 12px;
                padding: 12px;
                border-radius: 10px;
                background: rgba(54, 170, 110, 0.1);
                color: #bce8cf;
                font-size: 11px;
                line-height: 1.8;
            }

            .vertex-project-result.show {
                display: block;
            }

            .vertex-project-error {
                display: none;
                margin-top: 10px;
                padding: 10px 12px;
                border-radius: 10px;
                background: rgba(210, 70, 85, 0.12);
                color: #ffc5cb;
                font-size: 10px;
                line-height: 1.7;
            }

            .vertex-project-error.show {
                display: block;
            }

            .vertex-project-sidebar-btn {
                border-color: rgba(88, 167, 255, 0.15) !important;
            }

            @media (max-width: 620px) {
                .vertex-project-modal {
                    padding: 8px;
                }

                .vertex-project-panel {
                    max-height: 96vh;
                    border-radius: 15px;
                }

                .vertex-project-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function createModal() {
        if (document.getElementById("vertexProjectModal")) return;

        const modal = document.createElement("div");
        modal.id = "vertexProjectModal";
        modal.className = "vertex-project-modal";

        modal.innerHTML = `
            <div class="vertex-project-backdrop" data-project-close></div>

            <section class="vertex-project-panel" role="dialog" aria-modal="true">
                <header class="vertex-project-header">
                    <div class="vertex-project-title">
                        <h2>🛠️ Project Mode</h2>
                        <p>Vertex AI يقرأ المشروع ويجهز التعديلات قبل تنفيذها</p>
                    </div>
                    <button class="vertex-project-close" type="button" data-project-close>✕</button>
                </header>

                <div class="vertex-project-body">
                    <div class="vertex-project-status">
                        <div>
                            <strong id="vertexGithubStatusTitle">GitHub غير مربوط</strong>
                            <span id="vertexGithubStatusText">اربط حسابك للبدء</span>
                        </div>
                        <button id="vertexGithubDisconnectBtn" class="vertex-project-btn danger" type="button" style="display:none;">
                            فصل GitHub
                        </button>
                    </div>

                    <section id="vertexGithubConnectSection" class="vertex-project-section">
                        <h3>🔐 ربط GitHub</h3>
                        <p>
                            استخدم Fine-grained Personal Access Token بصلاحية المشاريع التي تختارها فقط.
                            التوكن يُرسل إلى Supabase عبر HTTPS ويُحفظ مشفرًا، ولا يُحفظ في المتصفح.
                        </p>

                        <div class="vertex-project-grid">
                            <input
                                id="vertexGithubTokenInput"
                                class="vertex-project-input"
                                type="password"
                                autocomplete="off"
                                placeholder="الصق GitHub token هنا — لا ترسله في المحادثة"
                            >
                            <button id="vertexGithubConnectBtn" class="vertex-project-btn primary" type="button">
                                ربط GitHub
                            </button>
                        </div>

                        <div class="vertex-project-token-help">
                            عند إنشاء التوكن اختر <b>Only select repositories</b>، ثم فعّل:
                            <b>Contents → Read and write</b> و
                            <b>Pull requests → Read and write</b>.
                            <br>
                            <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">
                                فتح صفحة إنشاء Fine-grained token في GitHub ↗
                            </a>
                        </div>
                    </section>

                    <section id="vertexProjectWorkSection" class="vertex-project-section" style="display:none;">
                        <h3>📁 اختر المشروع</h3>
                        <p>اختر مستودعًا من حسابك، ثم خل Vertex AI يقرأه قبل أي تعديل.</p>

                        <div class="vertex-project-grid">
                            <select id="vertexRepoSelect" class="vertex-project-select">
                                <option value="">تحميل المشاريع...</option>
                            </select>
                            <button id="vertexInspectRepoBtn" class="vertex-project-btn" type="button">
                                قراءة المشروع
                            </button>
                        </div>

                        <div id="vertexRepoMeta" class="vertex-project-meta"></div>

                        <div style="height:14px"></div>

                        <h3>🤖 وش تبغى أعدل؟</h3>
                        <textarea
                            id="vertexProjectInstruction"
                            class="vertex-project-textarea"
                            placeholder="مثال: أصلح مشكلة تسجيل الدخول، وخلي زر الدخول أوضح بدون ما تغير باقي التصميم."
                            maxlength="5000"
                        ></textarea>

                        <div class="vertex-project-actions">
                            <button id="vertexPreparePlanBtn" class="vertex-project-btn primary" type="button">
                                ✨ جهز التعديلات
                            </button>
                        </div>

                        <div id="vertexProjectPlan" class="vertex-project-plan">
                            <div id="vertexProjectPlanSummary" class="vertex-project-plan-summary"></div>
                            <div id="vertexProjectFiles" class="vertex-project-files"></div>

                            <div class="vertex-project-actions">
                                <button id="vertexApplyPlanBtn" class="vertex-project-btn success" type="button">
                                    ✅ موافق — طبّق في فرع آمن وافتح Pull Request
                                </button>
                                <button id="vertexCancelPlanBtn" class="vertex-project-btn danger" type="button">
                                    إلغاء الخطة
                                </button>
                            </div>
                        </div>

                        <div id="vertexProjectResult" class="vertex-project-result"></div>
                        <div id="vertexProjectError" class="vertex-project-error"></div>
                    </section>
                </div>
            </section>
        `;

        document.body.appendChild(modal);

        modal
            .querySelectorAll("[data-project-close]")
            .forEach(function (element) {
                element.addEventListener("click", closeModal);
            });
    }

    function createSidebarButton() {
        if (document.getElementById("vertexProjectModeBtn")) return;

        const footer = document.querySelector(".sidebar-footer");
        if (!footer) return;

        const button = document.createElement("button");
        button.id = "vertexProjectModeBtn";
        button.type = "button";
        button.className = "sidebar-action vertex-project-sidebar-btn";
        button.innerHTML = `<span>🛠️</span> Project Mode <span class="side-badge">AI</span>`;
        button.addEventListener("click", openModal);

        const projectsButton = document.getElementById("projectsBtn");

        if (projectsButton) {
            footer.insertBefore(button, projectsButton);
        }
        else {
            footer.appendChild(button);
        }
    }

    function openModal() {
        const modal = document.getElementById("vertexProjectModal");
        if (!modal) return;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        clearError();
        refreshStatus();
    }

    function closeModal() {
        const modal = document.getElementById("vertexProjectModal");
        if (!modal) return;
        modal.classList.remove("open");
        document.body.style.overflow = "";
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
            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
            }
            button.disabled = true;
            button.textContent = text || "جاري التنفيذ...";
        }
        else {
            button.disabled = false;
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    function updateConnectedUI() {
        const title = document.getElementById("vertexGithubStatusTitle");
        const text = document.getElementById("vertexGithubStatusText");
        const connectSection = document.getElementById("vertexGithubConnectSection");
        const workSection = document.getElementById("vertexProjectWorkSection");
        const disconnectButton = document.getElementById("vertexGithubDisconnectBtn");

        if (connected) {
            if (title) title.textContent = "✅ GitHub مربوط";
            if (text) text.textContent = githubLogin ? ("@" + githubLogin) : "جاهز";
            if (connectSection) connectSection.style.display = "none";
            if (workSection) workSection.style.display = "block";
            if (disconnectButton) disconnectButton.style.display = "inline-flex";
        }
        else {
            if (title) title.textContent = "GitHub غير مربوط";
            if (text) text.textContent = "اربط حسابك للبدء";
            if (connectSection) connectSection.style.display = "block";
            if (workSection) workSection.style.display = "none";
            if (disconnectButton) disconnectButton.style.display = "none";
        }
    }

    async function refreshStatus() {
        try {
            const data = await invoke({ action: "status" });
            connected = Boolean(data.connected);
            githubLogin = String(data.login || "");
            updateConnectedUI();

            if (connected) {
                await loadRepos();
            }
        }
        catch (error) {
            connected = false;
            updateConnectedUI();
            showError("تعذر التحقق من اتصال GitHub. جرّب تحديث الصفحة.");
        }
    }

    async function connectGithub() {
        clearError();

        const input = document.getElementById("vertexGithubTokenInput");
        const button = document.getElementById("vertexGithubConnectBtn");
        const token = input ? input.value.trim() : "";

        if (!token) {
            showError("الصق GitHub token أولًا.");
            return;
        }

        setBusy(button, true, "جاري الربط...");

        try {
            const data = await invoke({
                action: "connect",
                token: token
            });

            if (input) input.value = "";
            connected = true;
            githubLogin = String(data.login || "");
            currentPlan = null;
            updateConnectedUI();
            await loadRepos();
        }
        catch (error) {
            if (input) input.value = "";
            showError(
                error && error.code === "github_token_rejected"
                    ? "GitHub رفض التوكن. تأكد أنه Fine-grained token صحيح ولم تنتهِ صلاحيته."
                    : (error.message || "تعذر ربط GitHub.")
            );
        }
        finally {
            setBusy(button, false);
        }
    }

    async function disconnectGithub() {
        const button = document.getElementById("vertexGithubDisconnectBtn");
        setBusy(button, true, "جاري الفصل...");
        clearError();

        try {
            await invoke({ action: "disconnect" });
            connected = false;
            githubLogin = "";
            currentPlan = null;
            updateConnectedUI();
        }
        catch (error) {
            showError(error.message || "تعذر فصل GitHub.");
        }
        finally {
            setBusy(button, false);
        }
    }

    async function loadRepos() {
        const select = document.getElementById("vertexRepoSelect");
        if (!select) return;

        select.innerHTML = `<option value="">جاري تحميل المشاريع...</option>`;

        try {
            const data = await invoke({ action: "list_repos" });
            const repos = Array.isArray(data.repos) ? data.repos : [];

            select.innerHTML = `<option value="">اختر مستودع GitHub</option>`;

            repos.forEach(function (repo) {
                const option = document.createElement("option");
                option.value = repo.full_name;
                option.textContent =
                    (repo.private ? "🔒 " : "🌐 ") + repo.full_name;
                select.appendChild(option);
            });

            if (!repos.length) {
                select.innerHTML = `<option value="">لا توجد مستودعات متاحة للتوكن</option>`;
            }
        }
        catch (error) {
            select.innerHTML = `<option value="">تعذر تحميل المشاريع</option>`;
            showError(
                "تعذر قراءة مستودعات GitHub. تأكد أن التوكن أعطيته وصولًا إلى المستودع المطلوب."
            );
        }
    }

    function selectedRepo() {
        const select = document.getElementById("vertexRepoSelect");
        return select ? select.value.trim() : "";
    }

    async function inspectRepo() {
        clearError();
        const repo = selectedRepo();
        const button = document.getElementById("vertexInspectRepoBtn");
        const meta = document.getElementById("vertexRepoMeta");

        if (!repo) {
            showError("اختر المشروع أولًا.");
            return;
        }

        setBusy(button, true, "يقرأ المشروع...");

        try {
            const data = await invoke({
                action: "inspect",
                repo: repo
            });

            if (meta) {
                meta.innerHTML =
                    `<b>${escapeHtml(data.repo || repo)}</b><br>` +
                    `الفرع الأساسي: ${escapeHtml(data.branch || "-")} • ` +
                    `عدد الملفات: ${Number(data.file_count || 0)}` +
                    (data.private ? " • 🔒 خاص" : " • 🌐 عام");
                meta.classList.add("show");
            }
        }
        catch (error) {
            showError(error.message || "تعذر قراءة المشروع.");
        }
        finally {
            setBusy(button, false);
        }
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
            showError("اكتب وش التعديل اللي تبغاه في المشروع.");
            return;
        }

        if (planElement) planElement.classList.remove("show");
        if (resultElement) resultElement.classList.remove("show");

        setBusy(button, true, "🤖 Vertex AI يقرأ ويحلل المشروع...");

        try {
            const data = await invoke({
                action: "plan",
                repo: repo,
                instruction: instruction
            });

            currentPlan = data;
            renderPlan(data);
        }
        catch (error) {
            if (error && error.code === "empty_plan") {
                showError("ما قدرت أجهز تعديل آمن من الملفات الحالية. وضّح المطلوب أكثر وجرب من جديد.");
            }
            else {
                showError(error.message || "تعذر تجهيز التعديلات.");
            }
        }
        finally {
            setBusy(button, false);
        }
    }

    function renderPlan(data) {
        const wrapper = document.getElementById("vertexProjectPlan");
        const summary = document.getElementById("vertexProjectPlanSummary");
        const files = document.getElementById("vertexProjectFiles");

        if (!wrapper || !summary || !files) return;

        summary.textContent =
            "Vertex AI جهز خطة تعديل ولم يغير المشروع حتى الآن: " +
            String(data.summary || "");

        files.innerHTML = "";

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

        wrapper.classList.add("show");
    }

    async function applyPlan() {
        clearError();

        if (!currentPlan || !currentPlan.plan_id) {
            showError("جهز خطة التعديل أولًا.");
            return;
        }

        const button = document.getElementById("vertexApplyPlanBtn");
        const resultElement = document.getElementById("vertexProjectResult");

        setBusy(button, true, "ينشئ فرع آمن ويطبق التعديلات...");

        try {
            const data = await invoke({
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
                showError("المشروع تغير بعد تجهيز الخطة. اضغط «جهز التعديلات» مرة ثانية حتى ما نكتب فوق تغييرات جديدة.");
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
            await invoke({
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

    function bindEvents() {
        const connect = document.getElementById("vertexGithubConnectBtn");
        const disconnect = document.getElementById("vertexGithubDisconnectBtn");
        const inspect = document.getElementById("vertexInspectRepoBtn");
        const prepare = document.getElementById("vertexPreparePlanBtn");
        const apply = document.getElementById("vertexApplyPlanBtn");
        const cancel = document.getElementById("vertexCancelPlanBtn");
        const select = document.getElementById("vertexRepoSelect");

        if (connect) connect.addEventListener("click", connectGithub);
        if (disconnect) disconnect.addEventListener("click", disconnectGithub);
        if (inspect) inspect.addEventListener("click", inspectRepo);
        if (prepare) prepare.addEventListener("click", preparePlan);
        if (apply) apply.addEventListener("click", applyPlan);
        if (cancel) cancel.addEventListener("click", cancelPlan);

        if (select) {
            select.addEventListener("change", function () {
                currentPlan = null;
                const meta = document.getElementById("vertexRepoMeta");
                const plan = document.getElementById("vertexProjectPlan");
                const result = document.getElementById("vertexProjectResult");
                if (meta) meta.classList.remove("show");
                if (plan) plan.classList.remove("show");
                if (result) result.classList.remove("show");
            });
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                const modal = document.getElementById("vertexProjectModal");
                if (modal && modal.classList.contains("open")) {
                    closeModal();
                }
            }
        });
    }

    function start() {
        installStyles();
        createModal();
        createSidebarButton();
        bindEvents();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    }
    else {
        start();
    }
})();
