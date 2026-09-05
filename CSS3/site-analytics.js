// Vertex Systems AI - privacy-friendly page analytics
(function () {
    "use strict";

    const ENDPOINT =
        "https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-analytics";

    function uuid() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (c) {
            const n = Number(c);
            const r = window.crypto && window.crypto.getRandomValues
                ? window.crypto.getRandomValues(new Uint8Array(1))[0]
                : Math.floor(Math.random() * 256);
            return (n ^ (r & (15 >> (n / 4)))).toString(16);
        });
    }

    function storageId(storage, key) {
        try {
            let value = storage.getItem(key);
            if (!value) {
                value = uuid();
                storage.setItem(key, value);
            }
            return value;
        } catch (_) {
            return uuid();
        }
    }

    function deviceType() {
        const ua = navigator.userAgent || "";
        const width = Math.max(
            document.documentElement ? document.documentElement.clientWidth : 0,
            window.innerWidth || 0
        );

        if (/ipad|tablet|playbook|silk/i.test(ua) || (width >= 700 && width <= 1100 && /android|mobile/i.test(ua))) {
            return "tablet";
        }

        if (/mobi|android|iphone|ipod/i.test(ua) || width < 700) {
            return "mobile";
        }

        return "desktop";
    }

    function referrerHost() {
        try {
            if (!document.referrer) return null;
            const host = new URL(document.referrer).hostname;
            return host === location.hostname ? "direct/internal" : host;
        } catch (_) {
            return null;
        }
    }

    const payload = {
        page_path: location.pathname,
        page_title: document.title || null,
        visitor_id: storageId(localStorage, "vertexVisitorId"),
        session_id: storageId(sessionStorage, "vertexSessionId"),
        device_type: deviceType(),
        referrer_host: referrerHost(),
        language: navigator.language || null,
        screen_width: Math.round(window.screen && window.screen.width ? window.screen.width : window.innerWidth || 0)
    };

    function send() {
        fetch(ENDPOINT, {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(function () {
            // Analytics must never affect the user experience.
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", send, { once: true });
    } else {
        send();
    }
})();
