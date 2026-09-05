// Vertex Admin analytics dashboard
(function () {
  "use strict";

  const ENDPOINT = "https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-admin-analytics";
  const SUPABASE_USERS_URL = "https://supabase.com/dashboard/project/fkpjawyuyzgtjceymnal/auth/users";

  const loading = document.getElementById("loading");
  const denied = document.getElementById("denied");
  const dashboard = document.getElementById("dashboard");
  const refreshBtn = document.getElementById("refreshBtn");
  const activeUsersPanel = document.getElementById("activeUsersPanel");
  const activeUsersTitle = document.getElementById("activeUsersTitle");
  const activeUsersCount = document.getElementById("activeUsersCount");
  const activeUsersStatus = document.getElementById("activeUsersStatus");
  const activeUsersList = document.getElementById("activeUsersList");
  const closeUsersBtn = document.getElementById("closeUsersBtn");

  let currentSession = null;
  let currentYear = new Date().getUTCFullYear();

  function fmt(n) {
    return new Intl.NumberFormat("ar-SA").format(Number(n || 0));
  }

  function fmtDate(value) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString("ar-SA");
    } catch (_) {
      return "—";
    }
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

  async function getSession() {
    if (currentSession) return currentSession;
    const result = await supabaseClient.auth.getSession();
    currentSession = result && result.data ? result.data.session : null;
    return currentSession;
  }

  async function adminRequest(body) {
    const session = await getSession();
    if (!session) {
      window.location.replace("login.html");
      throw new Error("no_session");
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + session.access_token
      },
      body: JSON.stringify(body || {})
    });

    if (response.status === 401) {
      window.location.replace("login.html");
      throw new Error("unauthorized");
    }
    if (response.status === 403) throw new Error("forbidden");
    if (!response.ok) throw new Error("request_failed");
    return response.json();
  }

  function renderLineChart(targetId, values, labels, keys, options) {
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

    let svg = '<svg class="' + cssClass + '" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + esc(ariaLabel) + '">';
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
      const key = keys && keys[i] ? keys[i] : "";
      svg += '<circle class="chart-point" data-index="' + i + '" cx="' + px + '" cy="' + py + '" r="5"><title>' + esc(label) + ': ' + fmt(value) + ' حساب مسجل — اضغط لعرض المستخدمين</title></circle>';

      if (opts.showValues) {
        svg += '<text class="chart-value" x="' + px + '" y="' + Math.max(15, py - 12) + '" text-anchor="middle">' + fmt(value) + '</text>';
      }

      if (i % labelEvery === 0 || i === list.length - 1) {
        svg += '<text class="chart-axis-text" x="' + px + '" y="' + (height - 18) + '" text-anchor="middle">' + esc(label) + '</text>';
      }
    });

    svg += '</svg>';
    root.innerHTML = svg;

    root.querySelectorAll(".chart-point").forEach(function (point) {
      point.addEventListener("click", function () {
        const i = Number(point.getAttribute("data-index"));
        const key = keys && keys[i] ? keys[i] : "";
        const label = labels && labels[i] ? labels[i] : key;
        if (key && opts.period) loadActiveUsers(opts.period, key, label);
      });
    });
  }

  function render30DayChart(items) {
    const byDate = new Map();
    if (Array.isArray(items)) {
      items.forEach(function (item) {
        byDate.set(String(item.date || ""), Number(item.registered_users || 0));
      });
    }

    const values = [];
    const labels = [];
    const keys = [];
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    for (let offset = 29; offset >= 0; offset -= 1) {
      const d = new Date(todayUtc.getTime() - offset * 86400000);
      const key = d.toISOString().slice(0, 10);
      keys.push(key);
      values.push(byDate.get(key) || 0);
      labels.push(d.toLocaleDateString("ar-SA-u-ca-gregory", {
        day: "numeric",
        month: "short",
        timeZone: "UTC"
      }));
    }

    renderLineChart("dailyChart", values, labels, keys, {
      width: 1180,
      height: 300,
      cssClass: "daily-chart",
      ariaLabel: "الحسابات المسجلة النشطة خلال آخر 30 يوم",
      labelEvery: 3,
      showValues: false,
      period: "day"
    });
  }

  function renderAnnualChart(items, year) {
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const values = new Array(12).fill(0);
    const keys = monthNames.map(function (_, i) {
      return String(year) + "-" + String(i + 1).padStart(2, "0");
    });

    if (Array.isArray(items)) {
      items.forEach(function (item) {
        const monthIndex = Number(item.month) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          values[monthIndex] = Number(item.registered_users || 0);
        }
      });
    }

    renderLineChart("monthlyChart", values, monthNames, keys, {
      width: 960,
      height: 300,
      cssClass: "annual-chart",
      ariaLabel: "الحسابات المسجلة النشطة خلال السنة",
      labelEvery: 1,
      showValues: true,
      period: "month"
    });
  }

  function renderActiveUsers(users) {
    activeUsersList.innerHTML = "";
    if (!Array.isArray(users) || !users.length) {
      activeUsersStatus.textContent = "لا توجد حسابات مسجلة مرتبطة بهذه الفترة بعد.";
      return;
    }

    activeUsersStatus.textContent = "";
    users.forEach(function (user) {
      const row = document.createElement("div");
      row.className = "user-row";

      const identity = document.createElement("div");
      const email = document.createElement("div");
      email.className = "user-email";
      email.textContent = user.email || "بدون بريد";
      const created = document.createElement("div");
      created.className = "user-meta";
      created.textContent = "تاريخ التسجيل: " + fmtDate(user.created_at);
      identity.append(email, created);

      const last = document.createElement("div");
      last.className = "user-meta";
      last.textContent = "آخر دخول: " + fmtDate(user.last_sign_in_at);

      const link = document.createElement("a");
      link.className = "manage-link";
      link.href = SUPABASE_USERS_URL;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "إدارة الحساب";

      row.append(identity, last, link);
      activeUsersList.appendChild(row);
    });
  }

  async function loadActiveUsers(period, key, label) {
    activeUsersPanel.classList.remove("hidden");
    activeUsersTitle.textContent = period === "day" ? "مستخدمو " + label : "مستخدمو شهر " + label;
    activeUsersCount.textContent = "";
    activeUsersStatus.textContent = "جاري تحميل الحسابات المسجلة…";
    activeUsersList.innerHTML = "";
    activeUsersPanel.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const data = await adminRequest({ action: "active_users", period: period, key: key });
      activeUsersCount.textContent = fmt(data.count) + " حساب مسجل";
      renderActiveUsers(data.users);
    } catch (error) {
      activeUsersStatus.textContent = error && error.message === "forbidden"
        ? "هذه البيانات متاحة لحساب الإدارة فقط."
        : "تعذر تحميل المستخدمين الآن.";
    }
  }

  async function load() {
    loading.classList.remove("hidden");
    loading.classList.remove("error");
    loading.textContent = "جاري التحقق من صلاحية الإدارة وتحميل الإحصائيات…";
    denied.classList.add("hidden");
    dashboard.classList.add("hidden");
    refreshBtn.disabled = true;

    try {
      const data = await adminRequest({});
      currentYear = Number(data.year || currentYear);

      document.getElementById("totalViews").textContent = fmt(data.total_views);
      document.getElementById("uniqueVisitors").textContent = fmt(data.registered_users_30);
      document.getElementById("todayViews").textContent = fmt(data.today_views);
      document.getElementById("todayVisitors").textContent = fmt(data.today_registered_users);
      document.getElementById("yearViews").textContent = fmt(data.year_registered_users);
      document.getElementById("yearLabel").textContent = "سنة " + fmt(data.year);
      document.getElementById("monthlyTitle").textContent = "الحسابات المسجلة خلال السنة - " + fmt(data.year);
      document.getElementById("yearVisitors").textContent = "إجمالي الزوار المختلفين هذه السنة: " + fmt(data.year_unique_visitors) + " • المشاهدات: " + fmt(data.year_views);

      rows("topPages", data.top_pages, "لا توجد صفحات مسجلة بعد.");
      rows("devices", data.devices, "لا توجد بيانات أجهزة بعد.");
      rows("referrers", data.referrers, "لا توجد مصادر دخول بعد.");

      render30DayChart(data.daily);
      renderAnnualChart(data.monthly, currentYear);

      document.getElementById("generatedAt").textContent =
        "آخر تحديث: " + new Date(data.generated_at).toLocaleString("ar-SA");

      loading.classList.add("hidden");
      dashboard.classList.remove("hidden");
    } catch (error) {
      if (error && error.message === "forbidden") {
        loading.classList.add("hidden");
        denied.classList.remove("hidden");
      } else {
        loading.textContent = "تعذر تحميل الإحصائيات الآن. جرّب التحديث بعد قليل.";
        loading.classList.add("error");
      }
    } finally {
      refreshBtn.disabled = false;
    }
  }

  refreshBtn.addEventListener("click", function () {
    currentSession = null;
    load();
  });

  closeUsersBtn.addEventListener("click", function () {
    activeUsersPanel.classList.add("hidden");
  });

  load();
})();
