// Vertex API Key Center shortcut
(function () {
    "use strict";

    function install() {
        if (document.getElementById("vertexApiKeyCenterBtn")) return;

        const footer = document.querySelector(".sidebar-footer");
        if (!footer) {
            setTimeout(install, 120);
            return;
        }

        const button = document.createElement("button");
        button.id = "vertexApiKeyCenterBtn";
        button.type = "button";
        button.className = "sidebar-action";
        button.innerHTML = "<span>🔑</span> API Key <span class=\"side-badge\">DEV</span>";
        button.addEventListener("click", function () {
            window.location.href = "api-key.html";
        });

        const projectsButton = document.getElementById("projectsBtn");
        if (projectsButton) {
            footer.insertBefore(button, projectsButton);
        } else {
            footer.appendChild(button);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install);
    } else {
        install();
    }
})();
