// ==========================================
// Vertex AI image generation
// Cloudflare Workers AI via Supabase
// ==========================================

(function () {
    "use strict";

    const DB_NAME = "vertex-ai-media";
    const STORE_NAME = "images";
    const IMAGE_MARKER = /\[\[VERTEX_IMAGE:([a-zA-Z0-9_-]+)\]\]/g;
    let imageGenerationBusy = false;

    function isImageRequest(text) {
        const value = String(text || "").trim().toLowerCase();

        const arabic = /(?:انشئ|أنشئ|اصنع|سوي|سوِ|سوّي|ارسم|ولد|ولّد|صمم|صمّم).{0,25}(?:صورة|صوره|صور|رسمة|رسمه)/u;
        const arabicReverse = /(?:صورة|صوره|صور|رسمة|رسمه).{0,25}(?:انشئ|أنشئ|اصنع|سوي|ارسم|ولد|ولّد|صمم|صمّم)/u;
        const english = /(?:create|generate|make|draw|design).{0,24}(?:image|picture|photo|illustration)/i;

        return arabic.test(value) || arabicReverse.test(value) || english.test(value);
    }

    function makeId() {
        return (
            Date.now().toString(36) +
            Math.random().toString(36).slice(2, 10)
        );
    }

    function openDatabase() {
        return new Promise(function (resolve, reject) {
            const request = indexedDB.open(DB_NAME, 1);

            request.onupgradeneeded = function () {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error);
            };
        });
    }

    async function saveImage(id, dataUrl) {
        const db = await openDatabase();

        await new Promise(function (resolve, reject) {
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put(dataUrl, id);
            tx.oncomplete = resolve;
            tx.onerror = function () {
                reject(tx.error);
            };
        });

        db.close();
    }

    async function loadImage(id) {
        const db = await openDatabase();

        const result = await new Promise(function (resolve, reject) {
            const tx = db.transaction(STORE_NAME, "readonly");
            const request = tx.objectStore(STORE_NAME).get(id);
            request.onsuccess = function () {
                resolve(request.result || null);
            };
            request.onerror = function () {
                reject(request.error);
            };
        });

        db.close();
        return result;
    }

    function installStyles() {
        if (document.getElementById("vertexImageStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "vertexImageStyles";
        style.textContent = `
            .vertex-image-card {
                margin-top: 12px;
                width: min(100%, 620px);
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.09);
                border-radius: 15px;
                background: #0b1018;
            }

            .vertex-image-card img {
                display: block;
                width: 100%;
                height: auto;
                max-height: 650px;
                object-fit: contain;
                background: #070a0f;
            }

            .vertex-image-toolbar {
                padding: 9px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                direction: rtl;
            }

            .vertex-image-toolbar span {
                color: #8594aa;
                font-size: 10px;
            }

            .vertex-image-download {
                padding: 7px 10px;
                border: 1px solid rgba(255,255,255,0.09);
                border-radius: 8px;
                background: #172130;
                color: #d9ecff;
                cursor: pointer;
                font-size: 10px;
            }

            .vertex-image-generating {
                opacity: 0.85;
            }
        `;
        document.head.appendChild(style);
    }

    function cleanMarkerFromText(element, id) {
        if (!element) return;

        const marker = "[[VERTEX_IMAGE:" + id + "]]";
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT
        );
        const nodes = [];

        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        nodes.forEach(function (node) {
            if (node.nodeValue && node.nodeValue.includes(marker)) {
                node.nodeValue = node.nodeValue
                    .replace(marker, "")
                    .replace(/\n{3,}/g, "\n\n");
            }
        });
    }

    function downloadDataUrl(dataUrl, filename) {
        const anchor = document.createElement("a");
        anchor.href = dataUrl;
        anchor.download = filename || "vertex-image.jpg";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    async function renderStoredImage(messageElement, id) {
        if (
            !messageElement ||
            messageElement.dataset.vertexImageRendered === id
        ) {
            return;
        }

        const messageText = messageElement.querySelector(".message-text");
        cleanMarkerFromText(messageText, id);

        const dataUrl = await loadImage(id).catch(function () {
            return null;
        });

        if (!dataUrl || !messageElement.isConnected) {
            return;
        }

        messageElement.dataset.vertexImageRendered = id;

        const messageContent = messageElement.querySelector(".message-content");
        if (!messageContent) return;

        const card = document.createElement("div");
        card.className = "vertex-image-card";

        const img = document.createElement("img");
        img.src = dataUrl;
        img.alt = "صورة أنشأها Vertex AI";
        img.loading = "lazy";

        const toolbar = document.createElement("div");
        toolbar.className = "vertex-image-toolbar";

        const label = document.createElement("span");
        label.textContent = "Vertex AI • FLUX";

        const downloadButton = document.createElement("button");
        downloadButton.type = "button";
        downloadButton.className = "vertex-image-download";
        downloadButton.textContent = "⬇️ تحميل الصورة";
        downloadButton.addEventListener("click", function () {
            downloadDataUrl(dataUrl, "vertex-image-" + id + ".jpg");
        });

        toolbar.appendChild(label);
        toolbar.appendChild(downloadButton);
        card.appendChild(img);
        card.appendChild(toolbar);

        const actions = messageContent.querySelector(".message-actions");
        if (actions) {
            messageContent.insertBefore(card, actions);
        }
        else {
            messageContent.appendChild(card);
        }
    }

    function scanForImages(root) {
        const scope = root && root.querySelectorAll ? root : document;
        const messages = [];

        if (
            root &&
            root.nodeType === Node.ELEMENT_NODE &&
            root.matches &&
            root.matches(".message.assistant")
        ) {
            messages.push(root);
        }

        scope
            .querySelectorAll(".message.assistant")
            .forEach(function (message) {
                messages.push(message);
            });

        messages.forEach(function (message) {
            const text = message.querySelector(".message-text");
            if (!text) return;

            const source = text.textContent || "";
            const regex = new RegExp(IMAGE_MARKER.source, "g");
            let match;

            while ((match = regex.exec(source)) !== null) {
                renderStoredImage(message, match[1]);
            }
        });
    }

    async function getSupabaseClient() {
        if (
            window.VertexAuth &&
            typeof window.VertexAuth.ensureSupabase === "function"
        ) {
            return await window.VertexAuth.ensureSupabase();
        }

        if (
            typeof window.supabaseClient !== "undefined" &&
            window.supabaseClient &&
            window.supabaseClient.functions
        ) {
            return window.supabaseClient;
        }

        throw new Error("supabase_not_ready");
    }

    function addAssistantText(text) {
        if (typeof window.addMessage === "function") {
            window.addMessage("assistant", text);
        }
        if (typeof window.renderChat === "function") {
            window.renderChat();
        }
    }

    function addUserText(text) {
        if (typeof window.addMessage === "function") {
            window.addMessage("user", text);
        }
        if (typeof window.renderChat === "function") {
            window.renderChat();
        }
    }

    function showGeneratingIndicator() {
        const container = document.getElementById("messagesContainer");
        if (!container) return null;

        const element = document.createElement("article");
        element.className = "message assistant vertex-image-generating";
        element.innerHTML = `
            <div class="message-avatar">V</div>
            <div class="message-content">
                <div class="message-header">
                    <strong>Vertex AI</strong>
                    <span>ينشئ صورة...</span>
                </div>
                <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
        `;
        container.appendChild(element);

        const chat = document.getElementById("chatView");
        if (chat) {
            chat.scrollTop = chat.scrollHeight;
        }

        return element;
    }

    async function generateImageFromPrompt(text) {
        if (imageGenerationBusy) {
            return;
        }

        imageGenerationBusy = true;
        const input = document.getElementById("messageInput");
        const button = document.getElementById("sendBtn");

        if (input) {
            input.value = "";
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }

        if (button) {
            button.disabled = true;
        }

        addUserText(text);
        const indicator = showGeneratingIndicator();

        try {
            const client = await getSupabaseClient();
            const result = await client.functions.invoke("vertex-image", {
                body: { prompt: text }
            });

            if (result.error) {
                throw result.error;
            }

            const data = result.data || {};

            if (
                typeof data.image_data_url !== "string" ||
                !data.image_data_url.startsWith("data:image/")
            ) {
                if (data.code === "missing_cloudflare_credentials") {
                    throw new Error("missing_cloudflare_credentials");
                }
                throw new Error(data.code || "empty_image");
            }

            const id = makeId();
            await saveImage(id, data.image_data_url);

            if (indicator) indicator.remove();
            addAssistantText(
                "🖼️ تم إنشاء الصورة.\n[[VERTEX_IMAGE:" + id + "]]"
            );

            setTimeout(function () {
                scanForImages(document);
            }, 100);
        }
        catch (error) {
            console.error("Vertex image generation failed:", error);
            if (indicator) indicator.remove();

            const message = String(
                error && error.message ? error.message : error || ""
            ).toLowerCase();

            if (message.includes("missing_cloudflare_credentials")) {
                addAssistantText(
                    "⚙️ توليد الصور جاهز في Vertex AI، لكن بيانات Cloudflare لم تُضف إلى Supabase بعد."
                );
            }
            else if (message.includes("429")) {
                addAssistantText(
                    "⏳ وصلت خدمة الصور إلى حد الاستخدام المؤقت. جرّب بعد قليل."
                );
            }
            else {
                addAssistantText(
                    "⚠️ تعذر إنشاء الصورة الآن. تأكد من إعداد Cloudflare ثم حاول مرة أخرى."
                );
            }
        }
        finally {
            imageGenerationBusy = false;
            if (button) {
                button.disabled = false;
            }
            if (input) {
                input.focus();
            }
        }
    }

    function interceptImageSend(event) {
        const input = document.getElementById("messageInput");
        if (!input) return;

        const text = input.value.trim();
        if (!text || !isImageRequest(text)) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        generateImageFromPrompt(text);
    }

    function start() {
        installStyles();

        const sendButton = document.getElementById("sendBtn");
        const input = document.getElementById("messageInput");

        if (sendButton) {
            sendButton.addEventListener(
                "click",
                interceptImageSend,
                true
            );
        }

        if (input) {
            input.addEventListener(
                "keydown",
                function (event) {
                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {
                        interceptImageSend(event);
                    }
                },
                true
            );
        }

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        scanForImages(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        scanForImages(document);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    }
    else {
        start();
    }
})();
