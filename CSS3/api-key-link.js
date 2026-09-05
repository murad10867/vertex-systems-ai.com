// Compatibility bootstrap: API Key shortcut removed; load Vertex Voice instead.
(function () {
    "use strict";

    // Remove any stale API Key shortcut that an old cached script may have inserted.
    const staleApiButton = document.getElementById("vertexApiKeyCenterBtn");
    if (staleApiButton) staleApiButton.remove();

    function loadNaturalVoiceTuning() {
        if (document.getElementById("vertexNaturalVoiceScript")) return;
        const tuning = document.createElement("script");
        tuning.id = "vertexNaturalVoiceScript";
        tuning.src = "ai-voice-natural.js?v=20260905-1";
        document.body.appendChild(tuning);
    }

    if (document.getElementById("vertexVoiceScript")) {
        loadNaturalVoiceTuning();
        return;
    }

    const script = document.createElement("script");
    script.id = "vertexVoiceScript";
    script.src = "ai-voice.js?v=20260904-1";
    script.onload = loadNaturalVoiceTuning;
    script.defer = true;
    document.body.appendChild(script);
})();
