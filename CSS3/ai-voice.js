// ==========================================
// Vertex AI Voice Mode
// Browser speech recognition + speech synthesis
// ==========================================
(function () {
    "use strict";

    if (window.__vertexVoiceInstalled) return;
    window.__vertexVoiceInstalled = true;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const canRecognize = !!SpeechRecognition;
    const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

    let voiceMode = false;
    let listening = false;
    let muted = false;
    let waitingForReply = false;
    let recognition = null;
    let finalTranscript = "";
    let replyTimer = null;
    let lastSpokenText = "";
    let restartTimer = null;

    const css = `
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
        .vertex-voice-launch:hover {
            transform: translateY(-1px);
            background: rgba(37,99,235,.28);
            border-color: rgba(96,165,250,.45);
        }
        .vertex-voice-overlay {
            position: fixed;
            inset: 0;
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 22px;
            background: rgba(2,6,15,.90);
            backdrop-filter: blur(22px);
            -webkit-backdrop-filter: blur(22px);
        }
        .vertex-voice-overlay[hidden] { display: none !important; }
        .vertex-voice-panel {
            width: min(560px, 100%);
            min-height: 520px;
            border: 1px solid rgba(148,163,184,.16);
            border-radius: 34px;
            background: radial-gradient(circle at 50% 12%, rgba(14,165,233,.10), transparent 36%), #07101d;
            box-shadow: 0 30px 90px rgba(0,0,0,.55);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 38px 28px 30px;
            color: #f8fafc;
        }
        .vertex-voice-brand {
            font-size: 12px;
            letter-spacing: .22em;
            color: #64748b;
            margin-bottom: 26px;
        }
        .vertex-voice-orb {
            position: relative;
            width: 176px;
            height: 176px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            background: radial-gradient(circle at 35% 30%, #67e8f9, #2563eb 48%, #111827 72%);
            box-shadow: 0 0 0 14px rgba(37,99,235,.06), 0 22px 70px rgba(37,99,235,.32);
            transition: transform .25s ease, box-shadow .25s ease;
            overflow: hidden;
        }
        .vertex-voice-orb::before,
        .vertex-voice-orb::after {
            content: "";
            position: absolute;
            inset: 11px;
            border-radius: inherit;
            border: 1px solid rgba(255,255,255,.18);
        }
        .vertex-voice-orb::after {
            inset: 28px;
            border-color: rgba(255,255,255,.09);
        }
        .vertex-voice-orb span {
            position: relative;
            z-index: 2;
            font-size: 56px;
            font-weight: 800;
            color: white;
            text-shadow: 0 8px 30px rgba(0,0,0,.3);
        }
        .vertex-voice-overlay.listening .vertex-voice-orb {
            animation: vertexVoicePulse 1.35s ease-in-out infinite;
            box-shadow: 0 0 0 18px rgba(34,197,94,.06), 0 22px 80px rgba(34,197,94,.26);
        }
        .vertex-voice-overlay.speaking .vertex-voice-orb {
            animation: vertexVoiceSpeak .72s ease-in-out infinite alternate;
            box-shadow: 0 0 0 18px rgba(56,189,248,.07), 0 22px 90px rgba(56,189,248,.32);
        }
        @keyframes vertexVoicePulse {
            0%,100% { transform: scale(.98); }
            50% { transform: scale(1.055); }
        }
        @keyframes vertexVoiceSpeak {
            from { transform: scale(.99) rotate(-1deg); }
            to { transform: scale(1.045) rotate(1deg); }
        }
        .vertex-voice-title {
            margin: 30px 0 8px;
            font-size: 28px;
            font-weight: 800;
        }
        .vertex-voice-status {
            margin: 0;
            min-height: 28px;
            color: #94a3b8;
            font-size: 16px;
        }
        .vertex-voice-transcript {
            width: min(440px, 100%);
            min-height: 66px;
            margin: 22px 0 26px;
            color: #dbeafe;
            font-size: 18px;
            line-height: 1.8;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-wrap: anywhere;
        }
        .vertex-voice-actions {
            display: flex;
            gap: 14px;
            align-items: center;
            justify-content: center;
        }
        .vertex-voice-action {
            width: 58px;
            height: 58px;
            border-radius: 999px;
            border: 1px solid rgba(148,163,184,.18);
            background: #111c2d;
            color: #f8fafc;
            display: grid;
            place-items: center;
            cursor: pointer;
            font-size: 23px;
            transition: .18s ease;
        }
        .vertex-voice-action:hover { transform: translateY(-1px); background: #17253a; }
        .vertex-voice-action.voice-active {
            background: #1d4ed8;
            border-color: rgba(96,165,250,.55);
            box-shadow: 0 10px 34px rgba(37,99,235,.30);
        }
        .vertex-voice-action.voice-close { background: #24141a; }
        .vertex-voice-action.voice-close:hover { background: #3a1822; }
        .vertex-voice-hint {
            margin-top: 22px;
            font-size: 12px;
            color: #475569;
        }
        @media (max-width: 620px) {
            .vertex-voice-panel { min-height: 460px; border-radius: 26px; padding: 30px 18px 24px; }
            .vertex-voice-orb { width: 148px; height: 148px; }
            .vertex-voice-orb span { font-size: 48px; }
            .vertex-voice-title { font-size: 24px; }
        }
    `;

    const style = document.createElement("style");
    style.id = "vertexVoiceStyles";
    style.textContent = css;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "vertexVoiceOverlay";
    overlay.className = "vertex-voice-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <section class="vertex-voice-panel" role="dialog" aria-modal="true" aria-label="المحادثة الصوتية مع Vertex AI">
            <div class="vertex-voice-brand">VERTEX VOICE</div>
            <div class="vertex-voice-orb" aria-hidden="true"><span>V</span></div>
            <h2 class="vertex-voice-title">المحادثة الصوتية</h2>
            <p id="vertexVoiceStatus" class="vertex-voice-status">جاهز</p>
            <div id="vertexVoiceTranscript" class="vertex-voice-transcript">تكلم مع Vertex AI مباشرة</div>
            <div class="vertex-voice-actions">
                <button id="vertexVoiceMicBtn" class="vertex-voice-action voice-active" type="button" title="تشغيل أو إيقاف المايك">🎙️</button>
                <button id="vertexVoiceCloseBtn" class="vertex-voice-action voice-close" type="button" title="إنهاء المحادثة الصوتية">✕</button>
            </div>
            <div class="vertex-voice-hint">يستخدم إذن الميكروفون في المتصفح. تقدر تقفل وضع الصوت في أي وقت.</div>
        </section>
    `;
    document.body.appendChild(overlay);

    const statusEl = overlay.querySelector("#vertexVoiceStatus");
    const transcriptEl = overlay.querySelector("#vertexVoiceTranscript");
    const micToggle = overlay.querySelector("#vertexVoiceMicBtn");
    const closeBtn = overlay.querySelector("#vertexVoiceCloseBtn");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const messagesContainer = document.getElementById("messagesContainer");

    function setState(state, message) {
        overlay.classList.remove("listening", "speaking");
        if (state) overlay.classList.add(state);
        if (message) statusEl.textContent = message;
    }

    function setInputValue(value) {
        if (!messageInput) return;
        messageInput.value = value;
        messageInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function cleanupForSpeech(text) {
        return String(text || "")
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/https?:\/\/\S+/g, " ")
            .replace(/[#>*_~\[\]{}|]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function chooseVoice(text) {
        if (!canSpeak) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || !voices.length) return null;
        const hasArabic = /[\u0600-\u06FF]/.test(text);
        const preferred = hasArabic
            ? ["ar-SA", "ar_AE", "ar-EG", "ar"]
            : ["en-US", "en-GB", "en"];

        for (const lang of preferred) {
            const found = voices.find(v => String(v.lang || "").toLowerCase().startsWith(lang.toLowerCase().replace("_", "-")));
            if (found) return found;
        }
        return voices[0] || null;
    }

    function scheduleRestart(delay) {
        clearTimeout(restartTimer);
        if (!voiceMode || muted || waitingForReply) return;
        restartTimer = setTimeout(startListening, delay || 450);
    }

    function speak(text) {
        const cleaned = cleanupForSpeech(text);
        if (!cleaned) {
            waitingForReply = false;
            scheduleRestart(350);
            return;
        }

        if (!canSpeak) {
            transcriptEl.textContent = cleaned;
            setState(null, "وصل الرد — الصوت غير مدعوم في هذا المتصفح");
            waitingForReply = false;
            scheduleRestart(600);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleaned);
        const voice = chooseVoice(cleaned);
        if (voice) utterance.voice = voice;
        utterance.lang = voice && voice.lang ? voice.lang : (/[\u0600-\u06FF]/.test(cleaned) ? "ar-SA" : "en-US");
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = function () {
            setState("speaking", "Vertex AI يتكلم...");
            transcriptEl.textContent = cleaned.length > 240 ? cleaned.slice(0, 240) + "…" : cleaned;
        };
        utterance.onend = function () {
            waitingForReply = false;
            lastSpokenText = cleaned;
            if (voiceMode && !muted) {
                setState(null, "أسمعك...");
                transcriptEl.textContent = "تكلم الآن";
                scheduleRestart(450);
            }
        };
        utterance.onerror = function () {
            waitingForReply = false;
            setState(null, "تعذر تشغيل الصوت، لكن تقدر تكمل المحادثة");
            scheduleRestart(650);
        };
        window.speechSynthesis.speak(utterance);
    }

    function submitRecognizedText(text) {
        const value = String(text || "").trim();
        if (!value || !voiceMode) return;
        transcriptEl.textContent = value;
        setInputValue(value);
        waitingForReply = true;
        setState(null, "Vertex AI يفكر...");
        setTimeout(function () {
            if (sendBtn && !sendBtn.disabled) sendBtn.click();
        }, 180);
    }

    function buildRecognition() {
        if (!canRecognize) return null;
        const rec = new SpeechRecognition();
        rec.lang = "ar-SA";
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        rec.onstart = function () {
            listening = true;
            finalTranscript = "";
            setState("listening", "أسمعك...");
            transcriptEl.textContent = "تكلم الآن";
            micToggle.classList.add("voice-active");
        };

        rec.onresult = function (event) {
            let interim = "";
            let finalText = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const piece = event.results[i][0] ? event.results[i][0].transcript : "";
                if (event.results[i].isFinal) finalText += piece;
                else interim += piece;
            }
            if (finalText.trim()) finalTranscript = (finalTranscript + " " + finalText).trim();
            const shown = (finalTranscript + " " + interim).trim();
            if (shown) {
                transcriptEl.textContent = shown;
                setInputValue(shown);
            }
        };

        rec.onerror = function (event) {
            listening = false;
            const code = event && event.error ? event.error : "unknown";
            if (code === "not-allowed" || code === "service-not-allowed") {
                muted = true;
                micToggle.classList.remove("voice-active");
                setState(null, "اسمح للموقع باستخدام الميكروفون من إعدادات المتصفح");
                transcriptEl.textContent = "إذن الميكروفون مطلوب";
                return;
            }
            if (code === "no-speech") {
                setState(null, "ما سمعت كلام — حاول مرة ثانية");
                scheduleRestart(650);
                return;
            }
            setState(null, "تعذر تشغيل الميكروفون الآن");
            scheduleRestart(1000);
        };

        rec.onend = function () {
            listening = false;
            if (!voiceMode || muted) return;
            const text = finalTranscript.trim();
            if (text) {
                finalTranscript = "";
                submitRecognizedText(text);
            } else if (!waitingForReply) {
                scheduleRestart(500);
            }
        };
        return rec;
    }

    function startListening() {
        if (!voiceMode || muted || waitingForReply || listening) return;
        if (!canRecognize) {
            setState(null, "التعرف على الصوت غير مدعوم في هذا المتصفح");
            transcriptEl.textContent = "جرّب Microsoft Edge أو Google Chrome";
            return;
        }
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        try {
            recognition = buildRecognition();
            recognition.start();
        } catch (error) {
            setState(null, "تعذر بدء الميكروفون");
            scheduleRestart(900);
        }
    }

    function stopListening() {
        clearTimeout(restartTimer);
        if (recognition) {
            try { recognition.abort(); } catch (_) {}
        }
        recognition = null;
        listening = false;
        overlay.classList.remove("listening");
    }

    function openVoiceMode() {
        voiceMode = true;
        muted = false;
        waitingForReply = false;
        finalTranscript = "";
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        micToggle.classList.add("voice-active");
        transcriptEl.textContent = "تكلم الآن";
        setState(null, "أسمعك...");
        startListening();
    }

    function closeVoiceMode() {
        voiceMode = false;
        muted = false;
        waitingForReply = false;
        finalTranscript = "";
        stopListening();
        clearTimeout(replyTimer);
        if (canSpeak) window.speechSynthesis.cancel();
        overlay.hidden = true;
        document.body.style.overflow = "";
        setState(null, "جاهز");
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

    // Add voice button beside the composer controls.
    function installLaunchButton() {
        if (document.getElementById("vertexVoiceLaunchBtn")) return;
        const composerTools = document.querySelector(".composer-tools");
        if (!composerTools) {
            setTimeout(installLaunchButton, 120);
            return;
        }
        const button = document.createElement("button");
        button.id = "vertexVoiceLaunchBtn";
        button.type = "button";
        button.className = "vertex-voice-launch";
        button.title = "محادثة صوتية";
        button.setAttribute("aria-label", "بدء المحادثة الصوتية");
        button.textContent = "🎙️";
        button.addEventListener("click", openVoiceMode);
        composerTools.prepend(button);
    }

    // Detect the completed assistant response while voice mode is active.
    if (messagesContainer) {
        const observer = new MutationObserver(function () {
            if (!voiceMode || !waitingForReply) return;
            clearTimeout(replyTimer);
            replyTimer = setTimeout(function () {
                if (!voiceMode || !waitingForReply) return;
                const assistants = messagesContainer.querySelectorAll(".message.assistant .message-text");
                if (!assistants.length) return;
                const last = assistants[assistants.length - 1];
                const text = String(last.textContent || "").trim();
                if (!text || cleanupForSpeech(text) === lastSpokenText) return;
                speak(text);
            }, 1150);
        });
        observer.observe(messagesContainer, { childList: true, subtree: true, characterData: true });
    }

    micToggle.addEventListener("click", toggleMic);
    closeBtn.addEventListener("click", closeVoiceMode);
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) closeVoiceMode();
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && voiceMode) closeVoiceMode();
    });

    // Load available voices on Chromium/Safari.
    if (canSpeak) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.addEventListener?.("voiceschanged", function () {
            window.speechSynthesis.getVoices();
        });
    }

    installLaunchButton();
})();
