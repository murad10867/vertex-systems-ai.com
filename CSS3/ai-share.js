// Vertex AI response sharing
(function () {
    "use strict";

    if (window.__vertexShareInstalled) return;
    window.__vertexShareInstalled = true;

    const SITE_URL = "https://murad10867.github.io/www.vertex-systems-ai.com/ai.html";

    function getMessageText(messageEl) {
        const textEl = messageEl.querySelector(".message-text");
        return textEl ? textEl.innerText.trim() : "";
    }

    async function shareMessage(button, messageEl) {
        const messageText = getMessageText(messageEl);
        if (!messageText) return;

        const shareText = `${messageText}\n\nجرب Vertex AI:\n${SITE_URL}`;
        const originalText = button.textContent;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Vertex AI",
                    text: messageText,
                    url: SITE_URL
                });
                button.textContent = "✅ تمت المشاركة";
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareText);
                button.textContent = "✅ تم النسخ";
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = shareText;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
                button.textContent = "✅ تم النسخ";
            }
        } catch (error) {
            if (error && error.name === "AbortError") return;
            button.textContent = "تعذر المشاركة";
        }

        setTimeout(function () {
            button.textContent = originalText;
        }, 1600);
    }

    function addShareButton(messageEl) {
        if (!messageEl || messageEl.classList.contains("user")) return;

        const actions = messageEl.querySelector(".message-actions");
        if (!actions || actions.querySelector(".share-message-btn")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "message-action-btn share-message-btn";
        button.textContent = "↗️ مشاركة";
        button.setAttribute("aria-label", "مشاركة رد Vertex AI");

        button.addEventListener("click", function () {
            shareMessage(button, messageEl);
        });

        actions.appendChild(button);
    }

    function scanMessages(root) {
        const scope = root && root.querySelectorAll ? root : document;
        scope.querySelectorAll(".message.assistant").forEach(addShareButton);
    }

    scanMessages(document);

    const target = document.getElementById("messagesContainer") || document.body;
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (!(node instanceof Element)) return;
                if (node.matches && node.matches(".message.assistant")) {
                    addShareButton(node);
                }
                scanMessages(node);
            });
        });
    });

    observer.observe(target, { childList: true, subtree: true });
})();
