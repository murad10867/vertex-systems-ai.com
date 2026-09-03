// ==========================================
// Vertex AI rich responses
// Clickable links + code blocks + downloads
// Real Excel .xlsx generation
// ==========================================

(function () {
    "use strict";

    const timers = new WeakMap();
    let xlsxLoaderPromise = null;

    function installStyles() {
        if (document.getElementById("vertexRichStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "vertexRichStyles";
        style.textContent = `
            .message-text {
                white-space: pre-wrap;
                overflow-wrap: anywhere;
            }

            .vertex-message-link {
                color: #65b8ff;
                text-decoration: underline;
                text-underline-offset: 3px;
                overflow-wrap: anywhere;
            }

            .vertex-message-link:hover {
                color: #9bd2ff;
            }

            .vertex-code-card {
                margin: 12px 0;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.09);
                border-radius: 12px;
                background: #080c12;
                direction: ltr;
                text-align: left;
                white-space: normal;
            }

            .vertex-code-toolbar {
                min-height: 38px;
                padding: 7px 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                border-bottom: 1px solid rgba(255,255,255,0.07);
                background: #101722;
                color: #8da0b8;
                font-size: 11px;
            }

            .vertex-code-copy-btn {
                padding: 6px 9px;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 7px;
                background: #182131;
                color: #d5e9ff;
                font-size: 10px;
                cursor: pointer;
            }

            .vertex-code-block {
                margin: 0;
                padding: 14px;
                overflow: auto;
                white-space: pre;
                tab-size: 4;
                color: #e8edf5;
                font-family: Consolas, Monaco, monospace;
                font-size: 12px;
                line-height: 1.65;
            }

            .download-generated-file-btn {
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .download-generated-file-btn.vertex-excel-btn {
                border-color: rgba(72, 187, 120, 0.28);
            }
        `;
        document.head.appendChild(style);
    }

    function normalizeLanguage(language) {
        return String(language || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9#+._-]/g, "");
    }

    function appendLinkedText(parent, text) {
        let source = String(text || "");

        source = source.replace(
            /(^|\n)\s*(?:FILE|File|file|ملف)\s*:\s*([^\n]+)/g,
            "$1📄 $2"
        );

        const pattern = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"']+)/g;
        let cursor = 0;
        let match;

        while ((match = pattern.exec(source)) !== null) {
            if (match.index > cursor) {
                parent.appendChild(
                    document.createTextNode(
                        source.slice(cursor, match.index)
                    )
                );
            }

            const label = match[1] || "";
            let url = match[2] || match[3] || "";
            let trailing = "";

            if (!match[2]) {
                const trailingMatch = url.match(/[.,!?،؛:]+$/u);
                if (trailingMatch) {
                    trailing = trailingMatch[0];
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

            if (trailing) {
                parent.appendChild(
                    document.createTextNode(trailing)
                );
            }

            cursor = pattern.lastIndex;
        }

        if (cursor < source.length) {
            parent.appendChild(
                document.createTextNode(source.slice(cursor))
            );
        }
    }

    function inferFilename(language, index) {
        const lang = normalizeLanguage(language);
        const map = {
            html: "index.html",
            css: "style.css",
            javascript: "script.js",
            js: "script.js",
            typescript: "script.ts",
            ts: "script.ts",
            jsx: "component.jsx",
            tsx: "component.tsx",
            python: "main.py",
            py: "main.py",
            json: "data.json",
            markdown: "README.md",
            md: "README.md",
            text: "vertex.txt",
            txt: "vertex.txt",
            csv: "data.csv",
            xlsx: "vertex-workbook.xlsx",
            excel: "vertex-workbook.xlsx",
            spreadsheet: "vertex-workbook.xlsx",
            xml: "data.xml",
            sql: "query.sql",
            yaml: "config.yaml",
            yml: "config.yml",
            bash: "script.sh",
            sh: "script.sh",
            java: "Main.java",
            c: "main.c",
            cpp: "main.cpp",
            csharp: "Program.cs",
            cs: "Program.cs",
            php: "index.php",
            ruby: "main.rb",
            rb: "main.rb",
            go: "main.go",
            rust: "main.rs",
            rs: "main.rs"
        };

        const base = map[lang] || "vertex-file.txt";

        if (index === 0) {
            return base;
        }

        const dot = base.lastIndexOf(".");
        if (dot === -1) {
            return base + "-" + (index + 1);
        }

        return (
            base.slice(0, dot) +
            "-" +
            (index + 1) +
            base.slice(dot)
        );
    }

    function sanitizeFilename(name, fallback) {
        let clean = String(name || "")
            .trim()
            .replace(/["'`]/g, "")
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
            .replace(/\s+/g, " ")
            .slice(0, 100);

        if (!clean || clean === "." || clean === "..") {
            clean = fallback || "vertex-file.txt";
        }

        return clean;
    }

    function extractGeneratedFiles(text) {
        const source = String(text || "");
        const files = [];
        const fence = /```([^\n`]*)\n?([\s\S]*?)```/g;
        let match;
        let index = 0;

        while (
            (match = fence.exec(source)) !== null &&
            files.length < 8
        ) {
            const language = normalizeLanguage(match[1]);
            const content = String(match[2] || "").replace(/\n$/, "");
            const prefix = source.slice(
                Math.max(0, match.index - 180),
                match.index
            );
            const named = prefix.match(
                /(?:^|\n)\s*(?:FILE|File|file|ملف)\s*:\s*([^\n]+)\s*$/
            );
            const fallback = inferFilename(language, index);
            let name = sanitizeFilename(
                named ? named[1] : "",
                fallback
            );

            if (
                (language === "xlsx" || language === "excel" || language === "spreadsheet") &&
                !/\.xlsx$/i.test(name)
            ) {
                name = name.replace(/\.[^.]+$/, "") + ".xlsx";
            }

            if (content.trim()) {
                files.push({
                    name: name,
                    content: content,
                    language: language
                });
                index++;
            }
        }

        return files;
    }

    function mimeTypeForFilename(name) {
        const lower = String(name || "").toLowerCase();

        if (lower.endsWith(".html") || lower.endsWith(".htm")) {
            return "text/html;charset=utf-8";
        }
        if (lower.endsWith(".css")) {
            return "text/css;charset=utf-8";
        }
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) {
            return "text/javascript;charset=utf-8";
        }
        if (lower.endsWith(".json")) {
            return "application/json;charset=utf-8";
        }
        if (lower.endsWith(".csv")) {
            return "text/csv;charset=utf-8";
        }
        if (lower.endsWith(".xml")) {
            return "application/xml;charset=utf-8";
        }

        return "text/plain;charset=utf-8";
    }

    function loadXLSX() {
        if (window.XLSX) {
            return Promise.resolve(window.XLSX);
        }

        if (xlsxLoaderPromise) {
            return xlsxLoaderPromise;
        }

        xlsxLoaderPromise = new Promise(function (resolve, reject) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
            script.async = true;
            script.onload = function () {
                if (window.XLSX) {
                    resolve(window.XLSX);
                }
                else {
                    reject(new Error("xlsx_library_missing"));
                }
            };
            script.onerror = function () {
                reject(new Error("xlsx_library_failed"));
            };
            document.head.appendChild(script);
        });

        return xlsxLoaderPromise;
    }

    function cleanSheetName(name, fallback) {
        const value = String(name || fallback || "Sheet1")
            .replace(/[\\/?*\[\]:]/g, "-")
            .trim()
            .slice(0, 31);
        return value || fallback || "Sheet1";
    }

    function parseExcelPayload(content) {
        const source = String(content || "").trim();

        try {
            const parsed = JSON.parse(source);

            if (parsed && Array.isArray(parsed.sheets)) {
                return parsed.sheets
                    .filter(function (sheet) {
                        return sheet && Array.isArray(sheet.rows);
                    })
                    .slice(0, 20)
                    .map(function (sheet, index) {
                        return {
                            name: cleanSheetName(sheet.name, "Sheet" + (index + 1)),
                            rows: sheet.rows.slice(0, 5000).map(function (row) {
                                return Array.isArray(row)
                                    ? row.slice(0, 100).map(function (cell) {
                                        if (cell === null || typeof cell === "undefined") return "";
                                        if (["string", "number", "boolean"].includes(typeof cell)) return cell;
                                        return String(cell);
                                    })
                                    : [String(row ?? "")];
                            })
                        };
                    });
            }

            if (Array.isArray(parsed)) {
                return [{ name: "Sheet1", rows: parsed }];
            }
        }
        catch (error) {
            // Fallback to CSV/TSV below.
        }

        return null;
    }

    async function downloadExcelFile(file, button) {
        const originalText = button ? button.textContent : "";

        if (button) {
            button.disabled = true;
            button.textContent = "⏳ تجهيز Excel...";
        }

        try {
            const XLSX = await loadXLSX();
            let workbook;
            const sheets = parseExcelPayload(file.content);

            if (sheets && sheets.length) {
                workbook = XLSX.utils.book_new();

                sheets.forEach(function (sheet) {
                    const worksheet = XLSX.utils.aoa_to_sheet(sheet.rows);

                    if (sheet.rows.length) {
                        const maxColumns = sheet.rows.reduce(function (max, row) {
                            return Math.max(max, Array.isArray(row) ? row.length : 0);
                        }, 0);

                        worksheet["!cols"] = Array.from({ length: maxColumns }, function (_, colIndex) {
                            let width = 10;
                            sheet.rows.slice(0, 200).forEach(function (row) {
                                const value = Array.isArray(row) ? row[colIndex] : "";
                                width = Math.max(width, Math.min(40, String(value ?? "").length + 2));
                            });
                            return { wch: width };
                        });
                    }

                    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
                });
            }
            else {
                workbook = XLSX.read(file.content, {
                    type: "string",
                    raw: false
                });
            }

            if (!workbook || !Array.isArray(workbook.SheetNames) || !workbook.SheetNames.length) {
                throw new Error("empty_workbook");
            }

            XLSX.writeFile(workbook, file.name, {
                bookType: "xlsx",
                compression: true
            });
        }
        catch (error) {
            console.error("Vertex Excel download failed:", error);
            alert("تعذر تجهيز ملف Excel. جرّب طلب الملف من Vertex AI مرة أخرى.");
        }
        finally {
            if (button) {
                button.disabled = false;
                button.textContent = originalText || ("⬇️ " + file.name);
            }
        }
    }

    function downloadFile(file, button) {
        const isExcel = /\.xlsx$/i.test(file.name) ||
            ["xlsx", "excel", "spreadsheet"].includes(file.language);

        if (isExcel) {
            downloadExcelFile(file, button);
            return;
        }

        const blob = new Blob(
            [file.content],
            { type: mimeTypeForFilename(file.name) }
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = file.name;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1500);
    }

    function addDownloadButtons(messageElement, source) {
        if (
            !messageElement ||
            messageElement.classList.contains("user")
        ) {
            return;
        }

        const actions = messageElement.querySelector(
            ".message-actions"
        );

        if (!actions) {
            return;
        }

        actions
            .querySelectorAll(".download-generated-file-btn")
            .forEach(function (button) {
                button.remove();
            });

        const files = extractGeneratedFiles(source);

        files.forEach(function (file) {
            const button = document.createElement("button");
            const isExcel = /\.xlsx$/i.test(file.name) ||
                ["xlsx", "excel", "spreadsheet"].includes(file.language);

            button.type = "button";
            button.className =
                "message-action-btn download-generated-file-btn" +
                (isExcel ? " vertex-excel-btn" : "");
            button.textContent = (isExcel ? "📊 " : "⬇️ ") + file.name;
            button.title = isExcel
                ? "تنزيل ملف Excel حقيقي"
                : "تحميل " + file.name;

            button.addEventListener(
                "click",
                function () {
                    downloadFile(file, button);
                }
            );

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
            if (match.index > cursor) {
                appendLinkedText(
                    element,
                    source.slice(cursor, match.index)
                );
            }

            const language =
                normalizeLanguage(match[1]) || "code";
            const codeText = String(match[2] || "")
                .replace(/\n$/, "");

            const card = document.createElement("div");
            card.className = "vertex-code-card";

            const toolbar = document.createElement("div");
            toolbar.className = "vertex-code-toolbar";

            const label = document.createElement("span");
            label.textContent = ["xlsx", "excel", "spreadsheet"].includes(language)
                ? "Excel workbook data"
                : language;

            const copyButton = document.createElement("button");
            copyButton.type = "button";
            copyButton.className = "vertex-code-copy-btn";
            copyButton.textContent = "📋 نسخ الكود";

            copyButton.addEventListener(
                "click",
                function () {
                    navigator.clipboard
                        .writeText(codeText)
                        .catch(function () {});
                }
            );

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

        if (cursor < source.length) {
            appendLinkedText(
                element,
                source.slice(cursor)
            );
        }

        addDownloadButtons(
            element.closest(".message"),
            source
        );
    }

    function scheduleEnhancement(element) {
        if (
            !element ||
            element.dataset.vertexRichEnhanced === "1"
        ) {
            return;
        }

        const oldTimer = timers.get(element);
        if (oldTimer) {
            clearTimeout(oldTimer);
        }

        const timer = setTimeout(function () {
            if (
                element.dataset.vertexRichEnhanced === "1" ||
                !element.isConnected
            ) {
                return;
            }

            const source = element.textContent || "";

            if (!source.trim()) {
                return;
            }

            renderRichContent(element, source);
        }, 220);

        timers.set(element, timer);
    }

    function scan(root) {
        if (!root) {
            return;
        }

        if (
            root.nodeType === Node.ELEMENT_NODE &&
            root.matches &&
            root.matches(".message-text")
        ) {
            scheduleEnhancement(root);
        }

        if (root.querySelectorAll) {
            root
                .querySelectorAll(".message-text")
                .forEach(scheduleEnhancement);
        }
    }

    function start() {
        installStyles();
        scan(document);

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "characterData") {
                    const parent = mutation.target.parentElement;
                    if (
                        parent &&
                        parent.classList.contains("message-text")
                    ) {
                        scheduleEnhancement(parent);
                    }
                    return;
                }

                mutation.addedNodes.forEach(function (node) {
                    scan(node);
                });

                const target = mutation.target;
                if (
                    target &&
                    target.nodeType === Node.ELEMENT_NODE &&
                    target.classList &&
                    target.classList.contains("message-text")
                ) {
                    scheduleEnhancement(target);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    }
    else {
        start();
    }
})();
