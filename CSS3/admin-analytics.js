// Vertex Admin analytics dashboard
(function () {
  "use strict";

  const ENDPOINT = "https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-admin-analytics";

  const loading = document.getElementById("loading");
  const denied = document.getElementById("denied");
  const dashboard = document.getElementById("dashboard");
  const refreshBtn = document.getElementById("refreshBtn");

  function fmt(n) {
    return new Intl.NumberFormat("ar-SA").format(Number(n || 0));
  }

  function rows(targetId, items, emptyText) {
    const root = document.getElementById(targetId);
    root.innerHTML = "";
    if (!Array.isArray(items) || !items.length) {
      const div = document.createElement("div");
      div.className = "mini";
      div.textContent = emptyText || "لا توجد بيانات بعد.";
      root.appendChild(div);
      return;
    }

    items.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "row";
      const name = document.createElement("span");
      name.textContent = item.name || "غير معروف";
      const value = document.createElement("strong");
      value.textContent = fmt(item.value);
      row.append(name, value);
      root.appendChild(row);
    });
  }

  function bars(items) {
    const root = document.getElementById("dailyBars");
    root.innerHTML = "";
    const list = Array.isArray(items) ? items.slice(-14) : [];
    if (!list.length) {
      const div = document.createElement("div");
      div.className = "mini";
      div.textContent = "تظهر البيانات هنا بعد بدء تسجيل الزيارات.";
      root.appendChild(div);
      return;
    }

    const max = Math.max.apply(null, list.map(function (x) { return Number(x.views || 0); }).concat([1]));
    list.forEach(function (item) {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = Math.max(5, Math.round((Number(item.views || 0) / max) * 100)) + "%";
      bar.title = item.date + " • " + fmt(item.views) + " زيارة";
      root.appendChild(bar);
    });
  }

  async function load() {
    loading.classList.remove("hidden");
    denied.classList.add("hidden");
    dashboard.classList.add("hidden");
    refreshBtn.disabled = true;

    const { data: sessionData } = await supabaseClient.auth.getSession();
    const session = sessionData && sessionData.session;
    if (!session) {
      window.location.replace("login.html");
      return;
    }

    try {
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

      if (response.status === 401) {
        window.location.replace("login.html");
        return;
      }

      if (response.status === 403) {
        loading.classList.add("hidden");
        denied.classList.remove("hidden");
        return;
      }

      if (!response.ok) throw new Error("stats_failed");

      const data = await response.json();
      document.getElementById("totalViews").textContent = fmt(data.total_views);
      document.getElementById("uniqueVisitors").textContent = fmt(data.unique_visitors);
      document.getElementById("todayViews").textContent = fmt(data.today_views);
      document.getElementById("todayVisitors").textContent = fmt(data.today_unique_visitors);

      rows("topPages", data.top_pages, "لا توجد صفحات مسجلة بعد.");
      rows("devices", data.devices, "لا توجد بيانات أجهزة بعد.");
      rows("referrers", data.referrers, "لا توجد مصادر دخول بعد.");
      bars(data.daily);

      document.getElementById("generatedAt").textContent =
        "آخر تحديث: " + new Date(data.generated_at).toLocaleString("ar-SA");

      loading.classList.add("hidden");
      dashboard.classList.remove("hidden");
    } catch (_) {
      loading.textContent = "تعذر تحميل الإحصائيات الآن. جرّب التحديث بعد قليل.";
      loading.classList.add("error");
    } finally {
      refreshBtn.disabled = false;
    }
  }

  refreshBtn.addEventListener("click", load);
  load();
})();
