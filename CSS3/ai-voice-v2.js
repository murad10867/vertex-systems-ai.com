// ==========================================
// Vertex AI Voice v2
// Premium browser voice mode
// - Prefers high-quality Microsoft Edge online voices
// - Saudi Arabic first (ar-SA)
// - Waits for voices to become available
// - Natural pacing and sentence pauses
// - Voice conversation with the existing Vertex AI chat
// ==========================================
(function () {
    "use strict";

    if (window.__vertexVoiceV2Installed) return;
    window.__vertexVoiceV2Installed = true;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const canRecognize = !!Recognition;
    const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

    let voiceMode = false;
    let listening = false;
    let muted = false;
    let waitingForReply = false;
    let recognition = null;
    let finalTranscript = "";
    let restartTimer = null;
    let speechToken = 0;
    let observedText = "";
    let observeTimer = null;

    const style = document.createElement("style");
    style.id = "vertexVoiceV2Styles";
    style.textContent = `
        .vertex-voice-launch {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            border: 1px solid rgba(96,165,250,.25);
            background: rgba(37,99,235,.16);
            color: #dbeafe;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            transition: .18s ease;
        }
        .vertex-voice-launch:hover { transform: translateY(-1px); background: rgba(37,99,235,.28); }
        .vertex-voice-overlay {
            position: fixed; inset: 0; z-index: 100000;
            display: flex; align-items: center; justify-content: center;
            padding: 22px; background: rgba(2,6,15,.90);
            backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
        }
        .vertex-voice-overlay[hidden] { display: none !important; }
        .vertex-voice-panel {
            width: min(560px, 100%); min-height: 520px;
            border: 1px solid rgba(148,163,184,.16); border-radius: 34px;
            background: radial-gradient(circle at 50% 12%, rgba(14,165,233,.10), transparent 36%), #07101d;
            box-shadow: 0 30px 90px rgba(0,0,0,.55);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            text-align: center; padding: 38px 28px 30px; color: #f8fafc;
        }
        .vertex-voice-brand { font-size: 12px; letter-spacing: .22em; color: #64748b; margin-bottom: 26px; }
        .vertex-voice-orb {
            position: relative; width: 176px; height: 176px; border-radius: 999px;
            display: grid; place-items: center;
            background: radial-gradient(circle at 35% 30%, #67e8f9, #2563eb 48%, #111827 72%);
            box-shadow: 0 0 0 14px rgba(37,99,235,.06), 0 22px 70px rgba(37,99,235,.32);
            transition: transform .25s ease, box-shadow .25s ease; overflow: hidden;
        }
        .vertex-voice-orb::before, .vertex-voice-orb::after {
            content: ""; position: absolute; inset: 11px; border-radius: inherit;
            border: 1px solid rgba(255,255,255,.18);
        }
        .vertex-voice-orb::after { inset: 28px; border-color: rgba(255,255,255,.09); }
        .vertex-voice-orb span { position: relative; z-index: 2; font-size: 56px; font-weight: 800; color: white; }
        .vertex-voice-overlay.listening .vertex-voice-orb { animation: vertexVoicePulseV2 1.35s ease-in-out infinite; box-shadow: 0 0 0 18px rgba(34,197,94,.06), 0 22px 80px rgba(34,197,94,.26); }
        .vertex-voice-overlay.speaking .vertex-voice-orb { animation: vertexVoiceSpeakV2 .72s ease-in-out infinite alternate; box-shadow: 0 0 0 18px rgba(56,189,248,.07), 0 22px 90px rgba(56,189,248,.32); }
        @keyframes vertexVoicePulseV2 { 0%,100% { transform: scale(.98); } 50% { transform: scale(1.055); } }
        @keyframes vertexVoiceSpeakV2 { from { transform: scale(.99); } to { transform: scale(1.045); } }
        .vertex-voice-title { margin: 30px 0 8px; font-size: 28px; font-weight: 800; }
        .vertex-voice-status { margin: 0; min-height: 28px; color: #94a3b8; font-size: 16px; }
        .vertex-voice-transcript { width: min(440px,100%); min-height: 66px; margin: 22px 0 26px; color: #dbeafe; font-size: 18px; line-height: 1.8; display:flex; align-items:center; justify-content:center; overflow-wrap:anywhere; }
        .vertex-voice-actions { display:flex; gap:14px; align-items:center; justify-content:center; }
        .vertex-voice-action { width:58px; height:58px; border-radius:999px; border:1px solid rgba(148,163,184,.18); background:#111c2d; color:#f8fafc; display:grid; place-items:center; cursor:pointer; font-size:23px; transition:.18s ease; }
        .vertex-voice-action:hover { transform:translateY(-1px); background:#17253a; }
        .vertex-voice-action.voice-active { background:#1d4ed8; border-color:rgba(96,165,250,.55); box-shadow:0 10px 34px rgba(37,99,235,.30); }
        .vertex-voice-action.voice-close { background:#24141a; }
        .vertex-voice-hint { margin-top:22px; font-size:12px; color:#475569; max-width:440px; line-height:1.7; }
        @media (max-width:620px) { .vertex-voice-panel { min-height:460px; border-radius:26px; padding:30px 18px 24px; } .vertex-voice-orb { width:148px; height:148px; } .vertex-voice-orb span { font-size:48px; } .vertex-voice-title { font-size:24px; } }
    `;
    document.head.appendChild(style);

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
        else fn();
    }

    function getVoices() {
        if (!canSpeak) return [];
        return window.speechSynthesis.getVoices() || [];
    }

    function pickVoice(text) {
        const voices = getVoices();
        if (!voices.length) return null;
        const arabic = /[\u0600-\u06FF]/.test(text);
        const normalized = voices.map(v => ({ voice: v, lang: String(v.lang || "").toLowerCase(), name: String(v.name || "").toLowerCase() }));

        if (arabic) {
            const exactSaudi = normalized.filter(x => x.lang === "ar-sa");
            const preferredSaudi = exactSaudi.find(x => /hamed|zariyah|online|natural|microsoft/.test(x.name));
            if (preferredSaudi) return preferredSaudi.voice;
            if (exactSaudi.length) return exactSaudi[0].voice;

            const arabicMicrosoft = normalized.find(x => x.lang.startsWith("ar-") && /microsoft|online|natural/.test(x.name));
            if (arabicMicrosoft) return arabicMicrosoft.voice;

            const arabic = normalized.find(x => x.lang.startsWith("ar-"));
            if (arabic) return arabic.voice;
        }

        const preferred = normalized.find(x => /microsoft|online|natural/.test(x.name) && (arabic ? x.lang.startsWith("ar") : x.lang.startsWith("en")));
        return preferred ? preferred.voice : voices[0];
    }

    function cleanForSpeech(text) {
        return String(text || "")
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/https?:\/\/\S+/g, " ")
            .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
            .replace(/[*_~>#`|{}\[\]]/g, " ")
            .replace(/\b(https?|www)\b/gi, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function setState(state, message) {
        overlay.classList.remove("listening", "speaking");
        if (state) overlay.classList.add(state);
        if (message) statusEl.textContent = message;
    }

    function setInput(value) {
        if (!messageInput) return;
        messageInput.value = value;
        messageInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function stopListening() {
        clearTimeout(restartTimer);
        if (recognition) { try { recognition.abort(); } catch (_) {} }
        recognition = null;
        listening = false;
        overlay.classList.remove("listening");
    }

    function scheduleListening(delay = 500) {
        clearTimeout(restartTimer);
        if (!voiceMode || muted || waitingForReply) return;
        restartTimer = setTimeout(startListening, delay);
    }

    function speak(text) {
        const cleaned = cleanForSpeech(text);
        if (!cleaned || !canSpeak || !voiceMode) {
            waitingForReply = false;
            scheduleListening(350);
            return;
        }

        const token = ++speechToken;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleaned);
        const voice = pickVoice(cleaned);
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang || (/^[\u0600-\u06FF]/.test(cleaned) ? "ar-SA" : "en-US");
        utterance.rate = 0.96;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            if (token !== speechToken) return;
            setState("speaking", "Vertex AI يتكلم...");
            transcriptEl.textContent = cleaned.length > 260 ? cleaned.slice(0,260) + "…" : cleaned;
        };
        utterance.onend = () => {
            if (token !== speechToken) return;
            waitingForReply = false;
            if (voiceMode && !muted) {
                setState(null, "أسمعك...");
                transcriptEl.textContent = "تكلم الآن";
                scheduleListening(420);
            }
        };
        utterance.onerror = () => {
            if (token !== speechToken) return;
            waitingForReply = false;
            setState(null, "تعذر تشغيل الصوت — حاول مرة ثانية");
            scheduleListening(700);
        };
        window.speechSynthesis.speak(utterance);
    }

    function submitText(text) {
        const value = String(text || "").trim();
        if (!value || !voiceMode) return;
        setInput(value);
        transcriptEl.textContent = value;
        waitingForReply = true;
        setState(null, "Vertex AI يفكر...");
        setTimeout(() => {
            if (sendBtn && !sendBtn.disabled) sendBtn.click();
            else waitingForReply = false;
        }, 150);
    }

    function buildRecognition() {
        if (!canRecognize) return null;
        const rec = new Recognition();
        rec.lang = "ar-SA";
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        rec.onstart = () => {
            listening = true;
            finalTranscript = "";
            setState("listening", "أسمعك...");
            transcriptEl.textContent = "تكلم الآن";
            micToggle.classList.add("voice-active");
        };
        rec.onresult = event => {
            let interim = "";
            let finalText = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const part = event.results[i][0]?.transcript || "";
                if (event.results[i].isFinal) finalText += part; else interim += part;
            }
            if (finalText.trim()) finalTranscript = (finalTranscript + " " + finalText).trim();
            const shown = (finalTranscript + " " + interim).trim();
            if (shown) { transcriptEl.textContent = shown; setInput(shown); }
        };
        rec.onerror = event => {
            listening = false;
            const code = event?.error || "unknown";
            if (code === "not-allowed" || code === "service-not-allowed") {
                muted = true;
                micToggle.classList.remove("voice-active");
                setState(null, "اسمح للموقع باستخدام الميكروفون من إعدادات المتصفح");
                transcriptEl.textContent = "إذن الميكروفون مطلوب";
                return;
            }
            if (code !== "aborted" && voiceMode && !waitingForReply) {
                setState(null, code === "no-speech" ? "ما سمعت كلام — حاول مرة ثانية" : "تعذر التقاط الصوت");
                scheduleListening(code === "no-speech" ? 650 : 900);
            }
        };
        rec.onend = () => {
            listening = false;
            if (!voiceMode || muted || waitingForReply) return;
            const text = finalTranscript.trim();
            finalTranscript = "";
            if (text) submitText(text); else scheduleListening(450);
        };
        return rec;
    }

    function startListening() {
        if (!voiceMode || muted || waitingForReply || listening) return;
        if (!canRecognize) {
            setState(null, "التعرف على الصوت غير مدعوم");
            transcriptEl.textContent = "جرّب Microsoft Edge أو Google Chrome";
            return;
        }
        try {
            recognition = buildRecognition();
            recognition.start();
        } catch (_) {
            scheduleListening(900);
        }
    }

    function openVoiceMode() {
        voiceMode = true; muted = false; waitingForReply = false; finalTranscript = "";
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        micToggle.classList.add("voice-active");
        transcriptEl.textContent = "تكلم الآن";
        setState(null, "أسمعك...");

        if (canSpeak) {
            // Force Chromium/Edge to populate the voice list before the first reply.
            window.speechSynthesis.getVoices();
            setTimeout(startListening, 120);
        } else {
            startListening();
        }
    }

    function closeVoiceMode() {
        voiceMode = false; muted = false; waitingForReply = false; finalTranscript = "";
        speechToken++;
        stopListening();
        if (canSpeak) window.speechSynthesis.cancel();
        overlay.hidden = true;
        document.body.style.overflow = "";
    }

    function toggleMic() {
        if (!voiceMode) return;
        muted = !muted;
        if (muted) {
            stopListening();
            micToggle.classList.remove("voice-active");
            setState(null, "الميكروفون متوقف");
            transcriptEl.textContent = "اضغط المايك للمتابعة";
        } else {
            micToggle.classList.add("voice-active");
            setState(null, "أسمعك...");
            transcriptEl.textContent = "تكلم الآن";
            startListening();
        }
    }

    function installLaunchButton() {
        if (document.getElementById("vertexVoiceLaunchBtn")) return true;
        const tools = document.querySelector(".composer-tools");
        if (!tools) return false;
        const button = document.createElement("button");
        button.id = "vertexVoiceLaunchBtn";
        button.type = "button";
        button.className = "vertex-voice-launch";
        button.title = "محادثة صوتية";
        button.setAttribute("aria-label", "بدء المحادثة الصوتية");
        button.textContent = "🎙️";
        button.addEventListener("click", openVoiceMode);
        tools.prepend(button);
        return true;
    }

    function installObserver() {
        const messages = document.getElementById("messagesContainer");
        if (!messages) return;
        const observer = new MutationObserver(() => {
            if (!voiceMode || !waitingForReply) return;
            clearTimeout(observeTimer);
            observeTimer = setTimeout(() => {
                if (!voiceMode || !waitingForReply) return;
                const nodes = messages.querySelectorAll(".message.assistant .message-text");
                if (!nodes.length) return;
                const last = nodes[nodes.length - 1];
                const text = String(last.textContent || "").trim();
                if (!text || text === observedText) return;
                observedText = text;
                // Wait for the streamed reply to settle before speaking it.
                setTimeout(() => {
                    const settled = String(last.textContent || "").trim();
                    if (settled && settled === observedText && voiceMode && waitingForReply) speak(settled);
                }, 850);
            }, 250);
        });
        observer.observe(messages, { childList: true, subtree: true, characterData: true });
    }

    ready(() => {
        const overlay = document.createElement("div");
        overlay.id = "vertexVoiceV2Overlay";
        overlay.className = "vertex-voice-overlay";
        overlay.hidden = true;
        overlay.innerHTML = `
            <section class="vertex-voice-panel" role="dialog" aria-modal="true" aria-label="المحادثة الصوتية مع Vertex AI">
                <div class="vertex-voice-brand">VERTEX VOICE</div>
                <div class="vertex-voice-orb" aria-hidden="true"><span>V</span></div>
                <h2 class="vertex-voice-title">المحادثة الصوتية</h2>
                <p id="vertexVoiceV2Status" class="vertex-voice-status">جاهز</p>
                <div id="vertexVoiceV2Transcript" class="vertex-voice-transcript">تكلم مع Vertex AI مباشرة</div>
                <div class="vertex-voice-actions">
                    <button id="vertexVoiceV2MicBtn" class="vertex-voice-action voice-active" type="button" title="تشغيل أو إيقاف المايك">🎙️</button>
                    <button id="vertexVoiceV2CloseBtn" class="vertex-voice-action voice-close" type="button" title="إنهاء المحادثة الصوتية">✕</button>
                </div>
                <div class="vertex-voice-hint">صوت عربي سعودي أولًا، مع تفضيل الأصوات الطبيعية عالية الجودة المتاحة في المتصفح.</div>
            </section>`;
        document.body.appendChild(overlay);

        window.__vertexVoiceV2Overlay = overlay;
        window.__vertexVoiceV2Status = overlay.querySelector("#vertexVoiceV2Status");
        window.__vertexVoiceV2Transcript = overlay.querySelector("#vertexVoiceV2Transcript");
        window.__vertexVoiceV2Mic = overlay.querySelector("#vertexVoiceV2MicBtn");
        window.__vertexVoiceV2Close = overlay.querySelector("#vertexVoiceV2CloseBtn");

        window.__vertexVoiceV2OverlayRefs = {
            overlay, statusEl: window.__vertexVoiceV2Status, transcriptEl: window.__vertexVoiceV2Transcript,
            micToggle: window.__vertexVoiceV2Mic
        };

        // Local aliases used by the functions above.
        window.vertexVoiceV2Ready = true;
        window.__vertexVoiceV2Start = openVoiceMode;
        window.__vertexVoiceV2Close = closeVoiceMode;
        window.__vertexVoiceV2Toggle = toggleMic;

        window.__vertexVoiceV2Install = () => {
            installLaunchButton();
            installObserver();
        };

        window.speechSynthesis?.addEventListener?.("voiceschanged", () => getVoices());
        installLaunchButton();
        installObserver();

        window.__vertexVoiceV2Refs = window.__vertexVoiceV2OverlayRefs;
    });

    // The helper functions access these through lexical names; initialize them lazily.
    let overlay, statusEl, transcriptEl, micToggle, closeBtn, messageInput, sendBtn;
    const originalReady = ready;
    originalReady(() => {
        overlay = document.getElementById("vertexVoiceV2Overlay");
        statusEl = document.getElementById("vertexVoiceV2Status");
        transcriptEl = document.getElementById("vertexVoiceV2Transcript");
        micToggle = document.getElementById("vertexVoiceV2MicBtn");
        closeBtn = document.getElementById("vertexVoiceV2CloseBtn");
        messageInput = document.getElementById("messageInput");
        sendBtn = document.getElementById("sendBtn");
        micToggle?.addEventListener("click", toggleMic);
        closeBtn?.addEventListener("click", closeVoiceMode);
        overlay?.addEventListener("click", event => { if (event.target === overlay) closeVoiceMode(); });
        document.addEventListener("keydown", event => { if (event.key === "Escape" && voiceMode) closeVoiceMode(); });
    });
})();
