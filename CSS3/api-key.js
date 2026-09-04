(function(){
  "use strict";

  let client = null;
  let keys = [];
  const API_ENDPOINT = "https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-api";
  const $ = id => document.getElementById(id);

  function show(el){ if(el) el.classList.remove("hidden"); }
  function hide(el){ if(el) el.classList.add("hidden"); }

  function setError(message){
    const box = $("createError");
    if(!box) return;
    box.textContent = message || "";
    message ? show(box) : hide(box);
  }

  async function getClient(){
    if(client) return client;
    if(window.VertexAuth && typeof window.VertexAuth.ensureSupabase === "function"){
      client = await window.VertexAuth.ensureSupabase();
      return client;
    }
    throw new Error("supabase_not_ready");
  }

  async function invoke(body){
    const c = await getClient();
    const result = await c.functions.invoke("vertex-api-keys", { body });
    if(result.error){
      let details = null;
      try{
        if(result.error.context && typeof result.error.context.json === "function"){
          details = await result.error.context.json();
        }
      }catch(e){}
      const err = new Error(details && (details.error || details.message) ? details.error || details.message : result.error.message || "api_key_error");
      if(details && details.code) err.code = details.code;
      throw err;
    }
    return result.data || {};
  }

  function fmtDate(value){
    if(!value) return "لم يُستخدم بعد";
    try{
      return new Date(value).toLocaleString("ar-SA", { dateStyle:"medium", timeStyle:"short" });
    }catch(e){
      return value;
    }
  }

  function renderStats(){
    const active = keys.filter(k => !k.revoked_at);
    $("activeKeysCount").textContent = active.length;
    $("requests24h").textContent = keys.reduce((n,k) => n + Number(k.requests_24h || 0), 0);
    $("totalRequests").textContent = keys.reduce((n,k) => n + Number(k.total_requests || 0), 0);
  }

  function renderKeys(){
    const list = $("keysList");
    list.innerHTML = "";
    if(!keys.length){
      list.innerHTML = '<div class="empty-keys">ما عندك مفاتيح API حتى الآن.</div>';
      return;
    }

    keys.forEach(k => {
      const row = document.createElement("article");
      row.className = "key-row" + (k.revoked_at ? " revoked" : "");
      const state = k.revoked_at ? "ملغى" : "نشط";
      row.innerHTML = `<div class="key-main"><strong>${escapeHtml(k.name || "API Key")}</strong><span class="key-prefix">${escapeHtml(k.key_prefix || "")}••••••••••</span><div class="key-meta">الحالة: ${state} • آخر استخدام: ${escapeHtml(fmtDate(k.last_used_at))}<br>طلبات 24 ساعة: ${Number(k.requests_24h || 0)} / ${Number(k.daily_limit || 100)} • إجمالي الطلبات: ${Number(k.total_requests || 0)}</div></div>${k.revoked_at ? "" : `<button class="revoke-btn" type="button" data-revoke="${escapeAttr(k.id)}">إلغاء المفتاح</button>`}`;
      list.appendChild(row);
    });

    list.querySelectorAll("[data-revoke]").forEach(btn => btn.addEventListener("click", () => revokeKey(btn.dataset.revoke, btn)));
  }

  async function loadKeys(){
    const btn = $("refreshBtn");
    if(btn){ btn.disabled = true; btn.textContent = "جاري التحديث..."; }
    try{
      const data = await invoke({ action:"list" });
      keys = Array.isArray(data.keys) ? data.keys : [];
      renderStats();
      renderKeys();
    }catch(e){
      const list = $("keysList");
      if(list) list.innerHTML = '<div class="empty-keys">تعذر تحميل المفاتيح الآن.</div>';
    }finally{
      if(btn){ btn.disabled = false; btn.textContent = "↻ تحديث"; }
    }
  }

  async function createKey(){
    setError("");
    const input = $("keyNameInput");
    const btn = $("createKeyBtn");
    const name = (input.value || "").trim();
    if(!name){
      setError("اكتب اسمًا للمفتاح أولًا.");
      input.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = "جاري الإنشاء...";
    try{
      const data = await invoke({ action:"create", name });
      input.value = "";
      showNewKey(data.api_key || "");
      await loadKeys();
    }catch(e){
      setError(e.code === "key_limit" ? "وصلت إلى الحد الأقصى للمفاتيح النشطة. ألغِ مفتاحًا قديمًا أولًا." : e.message || "تعذر إنشاء المفتاح.");
    }finally{
      btn.disabled = false;
      btn.textContent = "＋ إنشاء مفتاح";
    }
  }

  async function revokeKey(id, btn){
    if(!confirm("هل تريد إلغاء هذا المفتاح؟ أي مشروع يستخدمه سيتوقف عن العمل فورًا.")) return;
    btn.disabled = true;
    btn.textContent = "جاري الإلغاء...";
    try{
      await invoke({ action:"revoke", id });
      await loadKeys();
    }catch(e){
      alert(e.message || "تعذر إلغاء المفتاح.");
      btn.disabled = false;
      btn.textContent = "إلغاء المفتاح";
    }
  }

  function showNewKey(value){
    $("newApiKey").textContent = value;
    $("savedKeyCheck").checked = false;
    $("closeKeyModalBtn").disabled = true;
    show($("keyModal"));
    document.body.style.overflow = "hidden";
  }

  function closeModal(){
    hide($("keyModal"));
    $("newApiKey").textContent = "";
    document.body.style.overflow = "";
  }

  async function copyText(value, button){
    try{
      await navigator.clipboard.writeText(value);
      if(button){
        const old = button.textContent;
        button.textContent = "✓ تم النسخ";
        setTimeout(() => button.textContent = old, 1300);
      }
    }catch(e){
      alert("تعذر النسخ تلقائيًا. انسخ النص يدويًا.");
    }
  }

  function escapeHtml(v){
    return String(v || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function escapeAttr(v){
    return escapeHtml(v).replace(/`/g,"&#096;");
  }

  function wireDocs(){
    document.querySelectorAll(".code-tab").forEach(tab => tab.addEventListener("click", () => {
      document.querySelectorAll(".code-tab").forEach(x => x.classList.remove("active"));
      document.querySelectorAll(".code-card").forEach(x => x.classList.remove("active"));
      tab.classList.add("active");
      const card = $(tab.dataset.code);
      if(card) card.classList.add("active");
    }));

    document.querySelectorAll("[data-copy-target]").forEach(btn => btn.addEventListener("click", () => copyText($(btn.dataset.copyTarget).textContent, btn)));
    document.querySelectorAll("[data-copy-code]").forEach(btn => btn.addEventListener("click", () => copyText($(btn.dataset.copyCode).textContent, btn)));
  }

  function setTestStatus(message, isError){
    const el = $("testStatus");
    if(!el) return;
    el.textContent = message;
    el.style.color = isError ? "#ffb8c2" : "";
  }

  async function runLiveTest(){
    const keyInput = $("testApiKeyInput");
    const promptInput = $("testPromptInput");
    const btn = $("testApiBtn");
    const responseWrap = $("testResponseWrap");
    const responseText = $("testResponseText");

    const apiKey = (keyInput.value || "").trim();
    const prompt = (promptInput.value || "").trim();

    hide(responseWrap);
    responseText.textContent = "";

    if(!apiKey.startsWith("vx_live_") || apiKey.length < 30){
      setTestStatus("الصق مفتاح Vertex API الصحيح الذي يبدأ بـ vx_live_", true);
      keyInput.focus();
      return;
    }

    if(!prompt){
      setTestStatus("اكتب رسالة للاختبار أولًا.", true);
      promptInput.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = "جاري الاتصال...";
    setTestStatus("يتم الآن إرسال طلب حقيقي إلى Vertex AI API...", false);

    try{
      const response = await fetch(API_ENDPOINT, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":apiKey
        },
        body:JSON.stringify({ prompt })
      });

      const data = await response.json().catch(() => ({}));
      show(responseWrap);
      responseText.textContent = JSON.stringify(data, null, 2);

      if(!response.ok){
        const code = data && data.error && data.error.code ? data.error.code : `HTTP_${response.status}`;
        setTestStatus(`فشل الاختبار: ${code}`, true);
        return;
      }

      setTestStatus(`✅ نجح الاتصال الحقيقي — HTTP ${response.status} — النموذج: ${data.model || "Vertex AI"}`, false);
      await loadKeys();
    }catch(e){
      show(responseWrap);
      responseText.textContent = String(e && e.message ? e.message : e);
      setTestStatus("تعذر الاتصال بالـ API. تحقق من الشبكة ثم جرّب مرة ثانية.", true);
    }finally{
      btn.disabled = false;
      btn.textContent = "▶ إرسال اختبار";
    }
  }

  function toggleTestKey(){
    const input = $("testApiKeyInput");
    const btn = $("toggleTestKeyBtn");
    if(input.type === "password"){
      input.type = "text";
      btn.textContent = "إخفاء";
    }else{
      input.type = "password";
      btn.textContent = "إظهار";
    }
  }

  async function init(){
    wireDocs();

    $("createKeyBtn").addEventListener("click", createKey);
    $("keyNameInput").addEventListener("keydown", e => { if(e.key === "Enter") createKey(); });
    $("refreshBtn").addEventListener("click", loadKeys);
    $("copyNewKeyBtn").addEventListener("click", () => copyText($("newApiKey").textContent, $("copyNewKeyBtn")));
    $("savedKeyCheck").addEventListener("change", () => { $("closeKeyModalBtn").disabled = !$("savedKeyCheck").checked; });
    $("closeKeyModalBtn").addEventListener("click", closeModal);

    if($("testApiBtn")) $("testApiBtn").addEventListener("click", runLiveTest);
    if($("toggleTestKeyBtn")) $("toggleTestKeyBtn").addEventListener("click", toggleTestKey);
    if($("testPromptInput")) $("testPromptInput").addEventListener("keydown", e => { if(e.key === "Enter") runLiveTest(); });

    try{
      const c = await getClient();
      const { data } = await c.auth.getSession();
      hide($("loadingState"));
      if(!data || !data.session){
        show($("loginState"));
        return;
      }
      show($("dashboard"));
      await loadKeys();
    }catch(e){
      hide($("loadingState"));
      show($("loginState"));
    }
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();