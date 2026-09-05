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

  function renderLineChart(targetId, values, labels, options) {
    const root = document.getElementById(targetId);
    root.innerHTML = "";

    const list = Array.isArray(values) ? values.map(function (v) { return Number(v || 0); }) : [];
    if (!list.length) {
      const div = document.createElement("div");
      div.className = "chart-empty";
      div.textContent = "تظهر البيانات هنا بعد بدء تسجيل المستخدمين.";
      root.appendChild(div);
      return;
    }

    const opts = options || {};
    const width = Number(opts.width || 960);
    const height = Number(opts.height || 300);
    const left = 54;
    const right = 26;
    const top = 28;
    const bottom = 48;
    const chartW = width - left - right;
    const chartH = height - top - bottom;
    const maxValue = Math.max.apply(null, list.concat([1]));
    const count = Math.max(1, list.length - 1);

    function x(i) {
      return left + (chartW * i / count);
    }

    function y(v) {
      return top + chartH - (chartH * v / maxValue);
    }

    const points = list.map(function (v, i) {
      return x(i).toFixed(1) + "," + y(v).toFixed(1);
    }).join(" ");

    const areaPoints = left + "," + (top + chartH) + " " + points + " " + (left + chartW) + "," + (top + chartH);
    const gridValues = [0, .25, .5, .75, 1];
    const cssClass = opts.cssClass || "annual-chart";
    const ariaLabel = opts.ariaLabel || "الرسم البياني للمستخدمين";
    const labelEvery = Number(opts.labelEvery || 1);

    let svg = '<svg class="' + cssClass + '" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + ariaLabel + '">';
    svg += '<defs><linearGradient id="vertexChartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#35a7ff"/><stop offset="100%" stop-color="#2367ff" stop-opacity="0"/></linearGradient></defs>';

    gridValues.forEach(function (ratio) {
      const gy = top + chartH - (chartH * ratio);
      const label = Math.round(maxValue * ratio);
      svg += '<line class="chart-grid-line" x1="' + left + '" y1="' + gy + '" x2="' + (left + chartW) + '" y2="' + gy + '"></line>';
      svg += '<text class="chart-axis-text" x="' + (left - 10) + '" y="' + (gy + 4) + '" text-anchor="end">' + fmt(label) + '</text>';
    });

    svg += '<polygon class="chart-area" points="' + areaPoints + '"></polygon>';
    svg += '<polyline class="chart-line" points="' + points + '"></polyline>';

    list.forEach(function (value, i) {
      const px = x(i);
      const py = y(value);
      const label = labels[i] || "";
      svg += '<circle class="chart-point" cx="' + px + '" cy="' + py + '" r="4.5"><title>' + label + ': ' + fmt(value) + ' مستخدم</title></circle>';

      if (opts.showValues) {
        svg += '<text class="chart-value" x="' + px + '" y="' + Math.max(15, py - 12) + '" text-anchor="middle">' + fmt(value) + '</text>';
      }

      if (i % labelEvery === 0 || i === list.length - 1) {
        svg += '<text class="chart-axis-text" x="' + px + '" y="' + (height - 18) + '" text-anchor="middle">' + label + '</text>';
      }
    });

    svg += '</svg>';
    root.innerHTML = svg;
  }

  function render30DayChart(items) {
    const byDate = new Map();
    if (Array.isArray(items)) {
      items.forEach(function (item) {
        byDate.set(String(item.date || ""), Number(item.users || 0));
      });
    }

    const values = [];
    const labels = [];
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    for (let offset = 29; offset >= 0; offset -= 1) {
      const d = new Date(todayUtc.getTime() - offset * 86400000);
      const key = d.toISOString().slice(0, 10);
      values.push(byDate.get(key) || 0);
      labels.push(d.toLocaleDateString("ar-SA-u-ca-gregory", {
        day: "numeric",
        month: "short",
        timeZone: "UTC"
      }));
    }

    renderLineChart("dailyChart", values, labels, {
      width: 1180,
      height: 300,
      cssClass: "daily-chart",
      ariaLabel: "عدد المستخدمين المختلفين خلال آخر 30 يوم",
      labelEvery: 3,
      showValues: false
    });
  }

  function renderAnnualChart(items) {
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const values = new Array(12).fill(0);

    if (Array.isArray(items)) {
      items.forEach(function (item) {
        const monthIndex = Number(item.month) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          values[monthIndex] = Number(item.users || 0);
        }
      });
    }

    renderLineChart("monthlyChart", values, monthNames, {
      width: 960,
      height: 300,
      cssClass: "annual-chart",
      ariaLabel: "عدد المستخدمين المختلفين خلال السنة",
      labelEvery: 1,
      showValues: true
    });
  }

  async function load() {
    loading.classList.remove("hidden");
    loading.classList.remove("error");
    loading.textContent = "جاري التحقق من صلاحية الإدارة وتحميل الإحصائيات…";
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
      document.getElementById("yearViews").textContent = fmt(data.year_unique_visitors);
      document.getElementById("yearLabel").textContent = "سنة " + fmt(data.year);
      document.getElementById("monthlyTitle").textContent = "المستخدمون خلال السنة - " + fmt(data.year);
      document.getElementById("yearVisitors").textContent = "إجمالي مشاهدات السنة: " + fmt(data.year_views);

      rows("topPages", data.top_pages, "لا توجد صفحات مسجلة بعد.");
      rows("devices", data.devices, "لا توجد بيانات أجهزة بعد.");
      rows("referrers", data.referrers, "لا توجد مصادر دخول بعد.");

      render30DayChart(data.daily);
      renderAnnualChart(data.monthly);

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
