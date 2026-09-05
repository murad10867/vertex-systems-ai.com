// Vertex Systems AI - simple growth/share controls
(function () {
    "use strict";

    const SITE_URL = "https://murad10867.github.io/www.vertex-systems-ai.com/";

    if (document.getElementById("vertexSiteShareBtn")) return;

    const style = document.createElement("style");
    style.textContent = `
        #vertexSiteShareBtn {
            position: fixed;
            left: 18px;
            bottom: 18px;
            z-index: 9999;
            border: 1px solid rgba(96,165,250,.35);
            background: linear-gradient(135deg,#2563eb,#0ea5e9);
            color: #fff;
            border-radius: 16px;
            padding: 12px 16px;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 14px 35px rgba(2,132,199,.28);
            backdrop-filter: blur(10px);
            transition: transform .2s ease, box-shadow .2s ease;
        }
        #vertexSiteShareBtn:hover { transform: translateY(-2px); box-shadow: 0 18px 42px rgba(2,132,199,.36); }
        #vertexSiteShareBtn:active { transform: translateY(0); }
        #vertexShareToast {
            position: fixed;
            left: 18px;
            bottom: 76px;
            z-index: 10000;
            background: #08111f;
            color: #e2e8f0;
            border: 1px solid #243244;
            border-radius: 12px;
            padding: 10px 13px;
            opacity: 0;
            transform: translateY(8px);
            pointer-events: none;
            transition: .2s ease;
            box-shadow: 0 12px 30px rgba(0,0,0,.28);
        }
        #vertexShareToast.show { opacity: 1; transform: translateY(0); }
        @media (max-width: 640px) {
            #vertexSiteShareBtn { left: 12px; bottom: 12px; padding: 11px 14px; border-radius: 14px; }
            #vertexShareToast { left: 12px; bottom: 68px; }
        }
    `;
    document.head.appendChild(style);

    const btn = document.createElement("button");
    btn.id = "vertexSiteShareBtn";
    btn.type = "button";
    btn.setAttribute("aria-label", "مشاركة Vertex Systems AI");
    btn.textContent = "↗️ شارك Vertex";

    const toast = document.createElement("div");
    toast.id = "vertexShareToast";
    toast.textContent = "تم نسخ رابط Vertex ✅";

    document.body.appendChild(btn);
    document.body.appendChild(toast);

    function showToast(text) {
        toast.textContent = text;
        toast.classList.add("show");
        window.setTimeout(function () { toast.classList.remove("show"); }, 1800);
    }

    btn.addEventListener("click", async function () {
        const data = {
            title: "Vertex Systems AI",
            text: "جرّب Vertex AI — ذكاء اصطناعي عربي بالصوت والصور والبرمجة.",
            url: SITE_URL
        };

        try {
            if (navigator.share) {
                await navigator.share(data);
                return;
            }
        } catch (err) {
            if (err && err.name === "AbortError") return;
        }

        try {
            await navigator.clipboard.writeText(SITE_URL);
            showToast("تم نسخ رابط Vertex ✅");
        } catch (_) {
            window.prompt("انسخ رابط Vertex:", SITE_URL);
        }
    });
})();
