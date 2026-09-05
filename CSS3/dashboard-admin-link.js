// Show Vertex Admin only for authorized admin accounts.
(function () {
  "use strict";

  const ENDPOINT = "https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-admin-analytics";
  let attempts = 0;

  function client() {
    if (window.supabaseClient && window.supabaseClient.auth) return window.supabaseClient;
    try {
      if (typeof supabaseClient !== "undefined" && supabaseClient && supabaseClient.auth) return supabaseClient;
    } catch (_) {}
    return null;
  }

  async function check() {
    const c = client();
    if (!c) {
      if (++attempts < 40) setTimeout(check, 250);
      return;
    }

    try {
      const result = await c.auth.getSession();
      const session = result && result.data && result.data.session;
      if (!session) return;

      const response = await fetch(ENDPOINT, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.access_token
        },
        body: "{}"
      });

      if (!response.ok) return;

      const bottom = document.querySelector(".sidebar-bottom");
      const logout = document.getElementById("logoutBtn");
      if (!bottom || document.getElementById("vertexAdminBtn")) return;

      const button = document.createElement("button");
      button.id = "vertexAdminBtn";
      button.className = "side-action";
      button.textContent = "🛡️ الإدارة الخاصة";
      button.addEventListener("click", function () {
        window.location.href = "admin-analytics.html";
      });

      if (logout) bottom.insertBefore(button, logout);
      else bottom.appendChild(button);
    } catch (_) {
      // Non-admin or temporary network errors stay invisible.
    }
  }

  check();
})();
