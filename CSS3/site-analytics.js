// Vertex Systems AI - first-party + Mixpanel analytics
(function () {
    "use strict";

    const ENDPOINT =
        "https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-analytics";

    // Mixpanel project token is a public client-side identifier, not a secret.
    const MIXPANEL_TOKEN = "1539d11e2295";
    const MIXPANEL_API_HOST = "https://api-eu.mixpanel.com";

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

    async function sessionInfo() {
        try {
            if (!window.supabaseClient || !window.supabaseClient.auth) {
                return { token: null, user: null };
            }

            const result = await window.supabaseClient.auth.getSession();
            const session = result && result.data ? result.data.session : null;

            return {
                token: session ? session.access_token : null,
                user: session ? session.user : null
            };
        } catch (_) {
            return { token: null, user: null };
        }
    }

    async function sendFirstPartyAnalytics(info) {
        const headers = { "Content-Type": "application/json" };
        if (info && info.token) headers.Authorization = "Bearer " + info.token;

        fetch(ENDPOINT, {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            keepalive: true,
            headers: headers,
            body: JSON.stringify(payload)
        }).catch(function () {
            // Analytics must never affect the user experience.
        });
    }

    function loadMixpanel(info) {
        if (window.mixpanel && typeof window.mixpanel.init === "function") {
            initMixpanel(info);
            return;
        }

        const existing = document.querySelector('script[data-vertex-mixpanel="1"]');
        if (existing) return;

        const script = document.createElement("script");
        script.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
        script.async = true;
        script.dataset.vertexMixpanel = "1";
        script.onload = function () {
            initMixpanel(info);
        };
        script.onerror = function () {
            // Mixpanel failure must never affect Vertex.
        };
        document.head.appendChild(script);
    }

    function initMixpanel(info) {
        try {
            if (!window.mixpanel || typeof window.mixpanel.init !== "function") return;
            if (window.__vertexMixpanelReady) return;

            window.mixpanel.init(MIXPANEL_TOKEN, {
                api_host: MIXPANEL_API_HOST,
                persistence: "localStorage",
                track_pageview: false,
                debug: false
            });

            window.__vertexMixpanelReady = true;

            if (info && info.user && info.user.id) {
                window.mixpanel.identify(info.user.id);
                window.mixpanel.people.set({
                    "Registered User": true
                });
            }

            window.mixpanel.track("Page Viewed", {
                "Page Path": payload.page_path,
                "Page Title": payload.page_title,
                "Device Type": payload.device_type,
                "Referrer Host": payload.referrer_host || "direct",
                "Language": payload.language || "unknown",
                "Signed In": !!(info && info.user)
            });

            const path = String(payload.page_path || "").toLowerCase();
            if (/\/ai\.html$/.test(path)) {
                window.mixpanel.track("Vertex AI Opened", {
                    "Signed In": !!(info && info.user)
                });
            }
        } catch (_) {
            // Analytics must never affect the user experience.
        }
    }

    async function send() {
        const info = await sessionInfo();
        sendFirstPartyAnalytics(info);
        loadMixpanel(info);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", send, { once: true });
    } else {
        send();
    }
})();
