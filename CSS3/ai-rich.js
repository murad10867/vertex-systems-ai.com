// ==========================================
// Vertex AI rich responses
// Clickable links + real Office file downloads
// Excel .xlsx + Word .docx + PowerPoint .pptx
// ==========================================

(function () {
    "use strict";

    const timers = new WeakMap();
    let xlsxLoaderPromise = null;
    let docxLoaderPromise = null;
    let pptxLoaderPromise = null;

    function installStyles() {
        if (document.getElementById("vertexRichStyles")) return;

        const style = document.createElement("style");
        style.id = "vertexRichStyles";
        style.textContent = `
            .message-text { white-space: pre-wrap; overflow-wrap: anywhere; }
            .vertex-message-link { color: #65b8ff; text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }
            .vertex-message-link:hover { color: #9bd2ff; }
            .vertex-code-card { margin: 12px 0; overflow: hidden; border: 1px solid rgba(255,255,255,.09); border-radius: 12px; background: #080c12; direction: ltr; text-align: left; white-space: normal; }
            .vertex-code-toolbar { min-height: 38px; padding: 7px 10px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid rgba(255,255,255,.07); background: #101722; color: #8da0b8; font-size: 11px; }
            .vertex-code-copy-btn { padding: 6px 9px; border: 1px solid rgba(255,255,255,.08); border-radius: 7px; background: #182131; color: #d5e9ff; font-size: 10px; cursor: pointer; }
            .vertex-code-block { margin: 0; padding: 14px; overflow: auto; white-space: pre; tab-size: 4; color: #e8edf5; font-family: Consolas, Monaco, monospace; font-size: 12px; line-height: 1.65; }
            .download-generated-file-btn { max-width: 270px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .vertex-excel-btn { border-color: rgba(72,187,120,.28) !important; }
            .vertex-word-btn { border-color: rgba(66,133,244,.30) !important; }
            .vertex-ppt-btn { border-color: rgba(230,105,55,.30) !important; }
        `;
        document.head.appendChild(style);
    }

    function normalizeLanguage(language) {
        return String(language || "").trim().toLowerCase().replace(/[^a-z0-9#+._-]/g, "");
    }

    function appendLinkedText(parent, text) {
        let source = String(text || "").replace(
            /(^|\n)\s*(?:FILE|File|file|ملف)\s*:\s*([^\n]+)/g,
            "$1📄 $2"
        );

        const pattern = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"']+)/g;
        let cursor = 0;
        let match;

        while ((match = pattern.exec(source)) !== null) {
            if (match.index > cursor) parent.appendChild(document.createTextNode(source.slice(cursor, match.index)));

            const label = match[1] || "";
            let url = match[2] || match[3] || "";
            let trailing = "";

            if (!match[2]) {
                const tail = url.match(/[.,!?،؛:]+$/u);
                if (tail) {
                    trailing = tail[0];
                    url = url.slice(0, -trailing.length);
                }
            }

            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.className = "vertex-message-link";
            link.textContent = label || url;
            parent.appendChild(link);
            if (trailing) parent.appendChild(document.createTextNode(trailing));
            cursor = pattern.lastIndex;
        }

        if (cursor < source.length) parent.appendChild(document.createTextNode(source.slice(cursor)));
    }

    function inferFilename(language, index) {
        const lang = normalizeLanguage(language);
        const map = {
            html: "index.html", css: "style.css", javascript: "script.js", js: "script.js",
            typescript: "script.ts", ts: "script.ts", jsx: "component.jsx", tsx: "component.tsx",
            python: "main.py", py: "main.py", json: "data.json", markdown: "README.md", md: "README.md",
            text: "vertex.txt", txt: "vertex.txt", csv: "data.csv",
            xlsx: "vertex-workbook.xlsx", excel: "vertex-workbook.xlsx", spreadsheet: "vertex-workbook.xlsx",
            docx: "vertex-document.docx", word: "vertex-document.docx", document: "vertex-document.docx",
            pptx: "vertex-presentation.pptx", powerpoint: "vertex-presentation.pptx", presentation: "vertex-presentation.pptx",
            xml: "data.xml", sql: "query.sql", yaml: "config.yaml", yml: "config.yml",
            bash: "script.sh", sh: "script.sh", java: "Main.java", c: "main.c", cpp: "main.cpp",
            csharp: "Program.cs", cs: "Program.cs", php: "index.php", ruby: "main.rb", rb: "main.rb",
            go: "main.go", rust: "main.rs", rs: "main.rs"
        };
        const base = map[lang] || "vertex-file.txt";
        if (index === 0) return base;
        const dot = base.lastIndexOf(".");
        return dot === -1 ? base + "-" + (index + 1) : base.slice(0, dot) + "-" + (index + 1) + base.slice(dot);
    }

    function sanitizeFilename(name, fallback) {
        let clean = String(name || "").trim().replace(/["'`]/g, "").replace(/[<>:"/\\|?*\x00-\x1F]/g, "-").replace(/\s+/g, " ").slice(0, 100);
        if (!clean || clean === "." || clean === "..") clean = fallback || "vertex-file.txt";
        return clean;
    }

    function officeKind(file) {
        const name = String(file && file.name || "").toLowerCase();
        const lang = normalizeLanguage(file && file.language);
        if (/\.xlsx$/i.test(name) || ["xlsx", "excel", "spreadsheet"].includes(lang)) return "excel";
        if (/\.docx$/i.test(name) || ["docx", "word", "document"].includes(lang)) return "word";
        if (/\.pptx$/i.test(name) || ["pptx", "powerpoint", "presentation"].includes(lang)) return "powerpoint";
        return "generic";
    }

    function enforceOfficeExtension(name, language) {
        const lang = normalizeLanguage(language);
        if (["xlsx", "excel", "spreadsheet"].includes(lang) && !/\.xlsx$/i.test(name)) return name.replace(/\.[^.]+$/, "") + ".xlsx";
        if (["docx", "word", "document"].includes(lang) && !/\.docx$/i.test(name)) return name.replace(/\.[^.]+$/, "") + ".docx";
        if (["pptx", "powerpoint", "presentation"].includes(lang) && !/\.pptx$/i.test(name)) return name.replace(/\.[^.]+$/, "") + ".pptx";
        return name;
    }

    function extractGeneratedFiles(text) {
        const source = String(text || "");
        const files = [];
        const fence = /```([^\n`]*)\n?([\s\S]*?)```/g;
        let match;
        let index = 0;

        while ((match = fence.exec(source)) !== null && files.length < 8) {
            const language = normalizeLanguage(match[1]);
            const content = String(match[2] || "").replace(/\n$/, "");
            const prefix = source.slice(Math.max(0, match.index - 180), match.index);
            const named = prefix.match(/(?:^|\n)\s*(?:FILE|File|file|ملف)\s*:\s*([^\n]+)\s*$/);
            const fallback = inferFilename(language, index);
            let name = sanitizeFilename(named ? named[1] : "", fallback);
            name = enforceOfficeExtension(name, language);

            if (content.trim()) {
                files.push({ name, content, language });
                index++;
            }
        }
        return files;
    }

    function mimeTypeForFilename(name) {
        const lower = String(name || "").toLowerCase();
        if (/\.html?$/.test(lower)) return "text/html;charset=utf-8";
        if (lower.endsWith(".css")) return "text/css;charset=utf-8";
        if (/\.(js|mjs)$/.test(lower)) return "text/javascript;charset=utf-8";
        if (lower.endsWith(".json")) return "application/json;charset=utf-8";
        if (lower.endsWith(".csv")) return "text/csv;charset=utf-8";
        if (lower.endsWith(".xml")) return "application/xml;charset=utf-8";
        return "text/plain;charset=utf-8";
    }

    function loadScriptOnce(url, check, getPromise, setPromise) {
        if (check()) return Promise.resolve(check());
        const existing = getPromise();
        if (existing) return existing;

        const promise = new Promise(function (resolve, reject) {
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            script.onload = function () {
                const value = check();
                value ? resolve(value) : reject(new Error("library_missing"));
            };
            script.onerror = function () { reject(new Error("library_failed")); };
            document.head.appendChild(script);
        });
        setPromise(promise);
        return promise;
    }

    function loadXLSX() {
        return loadScriptOnce(
            "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
            function () { return window.XLSX || null; },
            function () { return xlsxLoaderPromise; },
            function (p) { xlsxLoaderPromise = p; }
        );
    }

    function loadDOCX() {
        return loadScriptOnce(
            "https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js",
            function () { return window.docx || null; },
            function () { return docxLoaderPromise; },
            function (p) { docxLoaderPromise = p; }
        );
    }

    function loadPPTX() {
        return loadScriptOnce(
            "https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js",
            function () { return window.PptxGenJS || null; },
            function () { return pptxLoaderPromise; },
            function (p) { pptxLoaderPromise = p; }
        );
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1800);
    }

    function cleanSheetName(name, fallback) {
        const value = String(name || fallback || "Sheet1").replace(/[\\/?*\[\]:]/g, "-").trim().slice(0, 31);
        return value || fallback || "Sheet1";
    }

    function parseExcelPayload(content) {
        const source = String(content || "").trim();
        try {
            const parsed = JSON.parse(source);
            if (parsed && Array.isArray(parsed.sheets)) {
                return parsed.sheets.filter(function (s) { return s && Array.isArray(s.rows); }).slice(0, 20).map(function (sheet, index) {
                    return {
                        name: cleanSheetName(sheet.name, "Sheet" + (index + 1)),
                        rows: sheet.rows.slice(0, 5000).map(function (row) {
                            return Array.isArray(row) ? row.slice(0, 100).map(function (cell) {
                                if (cell === null || typeof cell === "undefined") return "";
                                return ["string", "number", "boolean"].includes(typeof cell) ? cell : String(cell);
                            }) : [String(row ?? "")];
                        })
                    };
                });
            }
            if (Array.isArray(parsed)) return [{ name: "Sheet1", rows: parsed }];
        } catch (_) {}
        return null;
    }

    async function downloadExcelFile(file, button) {
        const old = button ? button.textContent : "";
        if (button) { button.disabled = true; button.textContent = "⏳ تجهيز Excel..."; }
        try {
            const XLSX = await loadXLSX();
            const sheets = parseExcelPayload(file.content);
            let workbook;
            if (sheets && sheets.length) {
                workbook = XLSX.utils.book_new();
                sheets.forEach(function (sheet) {
                    const ws = XLSX.utils.aoa_to_sheet(sheet.rows);
                    const maxCols = sheet.rows.reduce(function (m, r) { return Math.max(m, Array.isArray(r) ? r.length : 0); }, 0);
                    ws["!cols"] = Array.from({ length: maxCols }, function (_, ci) {
                        let width = 10;
                        sheet.rows.slice(0, 200).forEach(function (row) { width = Math.max(width, Math.min(40, String((row || [])[ci] ?? "").length + 2)); });
                        return { wch: width };
                    });
                    XLSX.utils.book_append_sheet(workbook, ws, sheet.name);
                });
            } else {
                workbook = XLSX.read(file.content, { type: "string", raw: false });
            }
            if (!workbook || !workbook.SheetNames || !workbook.SheetNames.length) throw new Error("empty_workbook");
            XLSX.writeFile(workbook, file.name, { bookType: "xlsx", compression: true });
        } catch (error) {
            console.error("Vertex Excel download failed:", error);
            alert("تعذر تجهيز ملف Excel. جرّب طلبه من Vertex AI مرة أخرى.");
        } finally {
            if (button) { button.disabled = false; button.textContent = old || ("📊 " + file.name); }
        }
    }

    function parseWordPayload(content) {
        const source = String(content || "").trim();
        try {
            const parsed = JSON.parse(source);
            if (parsed && typeof parsed === "object") return parsed;
        } catch (_) {}
        return { title: "Vertex AI Document", paragraphs: source.split(/\n{2,}/).filter(Boolean) };
    }

    function hasArabic(text) {
        return /[\u0600-\u06FF]/.test(String(text || ""));
    }

    async function downloadWordFile(file, button) {
        const old = button ? button.textContent : "";
        if (button) { button.disabled = true; button.textContent = "⏳ تجهيز Word..."; }
        try {
            const d = await loadDOCX();
            const payload = parseWordPayload(file.content);
            const children = [];
            const addParagraph = function (text, options) {
                const value = String(text ?? "");
                const rtl = hasArabic(value);
                const paragraphOptions = Object.assign({
                    children: [new d.TextRun({ text: value, bold: !!(options && options.bold), size: options && options.size })],
                    bidirectional: rtl,
                    alignment: rtl ? d.AlignmentType.RIGHT : d.AlignmentType.LEFT,
                    spacing: { after: 160 }
                }, options && options.heading ? { heading: options.heading } : {});
                children.push(new d.Paragraph(paragraphOptions));
            };

            if (payload.title) addParagraph(payload.title, { bold: true, size: 34, heading: d.HeadingLevel.TITLE });

            if (Array.isArray(payload.paragraphs)) {
                payload.paragraphs.slice(0, 300).forEach(function (p) {
                    if (p && typeof p === "object") {
                        const level = Number(p.heading || 0);
                        const heading = level === 1 ? d.HeadingLevel.HEADING_1 : level === 2 ? d.HeadingLevel.HEADING_2 : level === 3 ? d.HeadingLevel.HEADING_3 : undefined;
                        addParagraph(p.text ?? "", { bold: !!p.bold || !!heading, heading });
                    } else addParagraph(p, {});
                });
            }

            if (Array.isArray(payload.sections)) {
                payload.sections.slice(0, 80).forEach(function (section) {
                    if (!section) return;
                    if (section.heading) addParagraph(section.heading, { bold: true, heading: d.HeadingLevel.HEADING_1 });
                    (Array.isArray(section.paragraphs) ? section.paragraphs : []).slice(0, 100).forEach(function (p) { addParagraph(p, {}); });
                    (Array.isArray(section.bullets) ? section.bullets : []).slice(0, 100).forEach(function (b) {
                        const value = String(b ?? "");
                        children.push(new d.Paragraph({
                            children: [new d.TextRun(value)],
                            bullet: { level: 0 },
                            bidirectional: hasArabic(value),
                            alignment: hasArabic(value) ? d.AlignmentType.RIGHT : d.AlignmentType.LEFT,
                            spacing: { after: 100 }
                        }));
                    });
                });
            }

            if (!children.length) addParagraph("Vertex AI", {});
            const doc = new d.Document({ sections: [{ properties: {}, children }] });
            const blob = await d.Packer.toBlob(doc);
            downloadBlob(blob, file.name);
        } catch (error) {
            console.error("Vertex Word download failed:", error);
            alert("تعذر تجهيز ملف Word. جرّب طلبه من Vertex AI مرة أخرى.");
        } finally {
            if (button) { button.disabled = false; button.textContent = old || ("📝 " + file.name); }
        }
    }

    function parsePowerPointPayload(content) {
        const source = String(content || "").trim();
        try {
            const parsed = JSON.parse(source);
            if (parsed && Array.isArray(parsed.slides)) return parsed;
        } catch (_) {}
        return { slides: [{ title: "Vertex AI", body: source }] };
    }

    async function downloadPowerPointFile(file, button) {
        const old = button ? button.textContent : "";
        if (button) { button.disabled = true; button.textContent = "⏳ تجهيز PowerPoint..."; }
        try {
            const PptxGenJS = await loadPPTX();
            const payload = parsePowerPointPayload(file.content);
            const pptx = new PptxGenJS();
            pptx.layout = "LAYOUT_WIDE";
            pptx.author = "Vertex AI";
            pptx.subject = String(payload.subject || "Generated by Vertex AI");
            pptx.title = String(payload.title || "Vertex AI Presentation");
            pptx.company = "Vertex Systems AI";
            pptx.lang = hasArabic(JSON.stringify(payload)) ? "ar-SA" : "en-US";

            payload.slides.slice(0, 40).forEach(function (item, index) {
                const slide = pptx.addSlide();
                const title = String(item && item.title || ("Slide " + (index + 1)));
                const subtitle = String(item && item.subtitle || "");
                const bullets = item && Array.isArray(item.bullets) ? item.bullets.map(String) : [];
                const body = String(item && item.body || "");
                const rtl = hasArabic(title + subtitle + bullets.join(" ") + body);

                slide.addText(title, {
                    x: 0.65, y: 0.45, w: 12.0, h: 0.75,
                    fontSize: 28, bold: true, margin: 0.04,
                    align: rtl ? "right" : "left", valign: "mid"
                });

                if (subtitle) {
                    slide.addText(subtitle, {
                        x: 0.7, y: 1.28, w: 11.9, h: 0.55,
                        fontSize: 16, margin: 0.03,
                        align: rtl ? "right" : "left", valign: "mid"
                    });
                }

                const contentText = bullets.length ? bullets.map(function (b) { return "• " + b; }).join("\n") : body;
                if (contentText) {
                    slide.addText(contentText, {
                        x: 0.8, y: subtitle ? 2.0 : 1.55, w: 11.7, h: subtitle ? 4.8 : 5.25,
                        fontSize: 20, margin: 0.08,
                        align: rtl ? "right" : "left", valign: "top"
                    });
                }
            });

            if (!payload.slides.length) pptx.addSlide().addText("Vertex AI", { x: 1, y: 1, w: 10, h: 1, fontSize: 30 });
            await pptx.writeFile({ fileName: file.name, compression: true });
        } catch (error) {
            console.error("Vertex PowerPoint download failed:", error);
            alert("تعذر تجهيز ملف PowerPoint. جرّب طلبه من Vertex AI مرة أخرى.");
        } finally {
            if (button) { button.disabled = false; button.textContent = old || ("📽️ " + file.name); }
        }
    }

    function downloadFile(file, button) {
        const kind = officeKind(file);
        if (kind === "excel") return void downloadExcelFile(file, button);
        if (kind === "word") return void downloadWordFile(file, button);
        if (kind === "powerpoint") return void downloadPowerPointFile(file, button);

        const blob = new Blob([file.content], { type: mimeTypeForFilename(file.name) });
        downloadBlob(blob, file.name);
    }

    function addDownloadButtons(messageElement, source) {
        if (!messageElement || messageElement.classList.contains("user")) return;
        const actions = messageElement.querySelector(".message-actions");
        if (!actions) return;

        actions.querySelectorAll(".download-generated-file-btn").forEach(function (button) { button.remove(); });
        const files = extractGeneratedFiles(source);

        files.forEach(function (file) {
            const button = document.createElement("button");
            const kind = officeKind(file);
            const icon = kind === "excel" ? "📊 " : kind === "word" ? "📝 " : kind === "powerpoint" ? "📽️ " : "⬇️ ";
            const extraClass = kind === "excel" ? " vertex-excel-btn" : kind === "word" ? " vertex-word-btn" : kind === "powerpoint" ? " vertex-ppt-btn" : "";

            button.type = "button";
            button.className = "message-action-btn download-generated-file-btn" + extraClass;
            button.textContent = icon + file.name;
            button.title = kind === "generic" ? "تحميل " + file.name : "تنزيل ملف " + (kind === "excel" ? "Excel" : kind === "word" ? "Word" : "PowerPoint") + " حقيقي";
            button.addEventListener("click", function () { downloadFile(file, button); });
            actions.appendChild(button);
        });
    }

    function renderRichContent(element, source) {
        const fence = /```([^\n`]*)\n?([\s\S]*?)```/g;
        let cursor = 0;
        let match;

        element.dataset.vertexRichEnhanced = "1";
        element.innerHTML = "";

        while ((match = fence.exec(source)) !== null) {
            if (match.index > cursor) appendLinkedText(element, source.slice(cursor, match.index));

            const language = normalizeLanguage(match[1]) || "code";
            const codeText = String(match[2] || "").replace(/\n$/, "");
            const card = document.createElement("div");
            card.className = "vertex-code-card";
            const toolbar = document.createElement("div");
            toolbar.className = "vertex-code-toolbar";
            const label = document.createElement("span");
            label.textContent = ["xlsx", "excel", "spreadsheet"].includes(language) ? "Excel workbook data" : ["docx", "word", "document"].includes(language) ? "Word document data" : ["pptx", "powerpoint", "presentation"].includes(language) ? "PowerPoint data" : language;
            const copyButton = document.createElement("button");
            copyButton.type = "button";
            copyButton.className = "vertex-code-copy-btn";
            copyButton.textContent = "📋 نسخ";
            copyButton.addEventListener("click", function () { navigator.clipboard.writeText(codeText).catch(function () {}); });
            toolbar.appendChild(label);
            toolbar.appendChild(copyButton);

            const pre = document.createElement("pre");
            pre.className = "vertex-code-block";
            const code = document.createElement("code");
            code.textContent = codeText;
            pre.appendChild(code);
            card.appendChild(toolbar);
            card.appendChild(pre);
            element.appendChild(card);
            cursor = fence.lastIndex;
        }

        if (cursor < source.length) appendLinkedText(element, source.slice(cursor));
        addDownloadButtons(element.closest(".message"), source);
    }

    function scheduleEnhancement(element) {
        if (!element || element.dataset.vertexRichEnhanced === "1") return;
        const oldTimer = timers.get(element);
        if (oldTimer) clearTimeout(oldTimer);

        const timer = setTimeout(function () {
            if (element.dataset.vertexRichEnhanced === "1" || !element.isConnected) return;
            const source = element.textContent || "";
            if (source.trim()) renderRichContent(element, source);
        }, 220);
        timers.set(element, timer);
    }

    function scan(root) {
        if (!root) return;
        if (root.nodeType === Node.ELEMENT_NODE && root.matches && root.matches(".message-text")) scheduleEnhancement(root);
        if (root.querySelectorAll) root.querySelectorAll(".message-text").forEach(scheduleEnhancement);
    }

    function start() {
        installStyles();
        scan(document);
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "characterData") {
                    const parent = mutation.target.parentElement;
                    if (parent && parent.classList.contains("message-text")) scheduleEnhancement(parent);
                    return;
                }
                mutation.addedNodes.forEach(function (node) { scan(node); });
                const target = mutation.target;
                if (target && target.nodeType === Node.ELEMENT_NODE && target.classList && target.classList.contains("message-text")) scheduleEnhancement(target);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
})();
