// Compatibility bootstrap: API Key shortcut removed; load Vertex Voice instead.
(function () {
    "use strict";

    // Remove any stale API Key shortcut that an old cached script may have inserted.
    const staleApiButton = document.getElementById("vertexApiKeyCenterBtn");
    if (staleApiButton) staleApiButton.remove();

    if (document.getElementById("vertexVoiceScript")) return;

    const script = document.createElement("script");
    script.id = "vertexVoiceScript";
    script.src = "ai-voice.js?v=20260904-1";
    script.defer = true;
    document.body.appendChild(script);
})();
