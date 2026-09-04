(function(){
  "use strict";

  const ENDPOINT="https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-api";
  const $=id=>document.getElementById(id);

  function show(el){el&&el.classList.remove("hidden")}
  function hide(el){el&&el.classList.add("hidden")}

  function setStatus(type,message){
    const box=$("statusBox");
    box.className="status "+type;
    box.textContent=message;
    show(box);
  }

  async function send(){
    const key=$("apiKeyInput").value.trim();
    const prompt=$("promptInput").value.trim();
    const btn=$("sendBtn");

    hide($("responseCard"));

    if(!key){
      setStatus("error","الصق مفتاح Vertex API أولًا.");
      $("apiKeyInput").focus();
      return;
    }

    if(!key.startsWith("vx_live_")){
      setStatus("error","هذا لا يبدو كمفتاح Vertex API صالح.");
      $("apiKeyInput").focus();
      return;
    }

    if(!prompt){
      setStatus("error","اكتب سؤالًا أولًا.");
      $("promptInput").focus();
      return;
    }

    btn.disabled=true;
    btn.textContent="جاري الاتصال بـ Vertex AI...";
    setStatus("loading","يتم الآن إرسال طلب API حقيقي...");

    try{
      const response=await fetch(ENDPOINT,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":key
        },
        body:JSON.stringify({prompt})
      });

      const data=await response.json().catch(()=>({}));

      if(!response.ok){
        const code=data?.error?.code||"api_error";
        const message=data?.error?.message||("HTTP "+response.status);
        throw new Error(code+": "+message);
      }

      $("replyText").textContent=data.reply||"تم الاتصال بنجاح، لكن لم يصل نص رد.";
      $("metaText").textContent="HTTP 200 • model: "+(data.model||"unknown")+" • request: "+(data.request_id||data.id||"-");
      setStatus("success","✅ نجح اتصال Vertex AI API — HTTP 200");
      show($("responseCard"));
    }catch(error){
      setStatus("error","❌ فشل الطلب: "+(error?.message||"حدث خطأ غير معروف"));
    }finally{
      btn.disabled=false;
      btn.textContent="▶ إرسال إلى Vertex AI";
    }
  }

  async function copyReply(){
    const value=$("replyText").textContent||"";
    if(!value)return;
    try{
      await navigator.clipboard.writeText(value);
      const btn=$("copyReplyBtn");
      const old=btn.textContent;
      btn.textContent="✓ تم النسخ";
      setTimeout(()=>btn.textContent=old,1200);
    }catch{
      alert("تعذر النسخ تلقائيًا.");
    }
  }

  function init(){
    $("sendBtn").addEventListener("click",send);
    $("promptInput").addEventListener("keydown",e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==="Enter")send();
    });
    $("toggleKeyBtn").addEventListener("click",()=>{
      const input=$("apiKeyInput");
      const hidden=input.type==="password";
      input.type=hidden?"text":"password";
      $("toggleKeyBtn").textContent=hidden?"إخفاء":"إظهار";
    });
    $("copyReplyBtn").addEventListener("click",copyReply);

    window.addEventListener("beforeunload",()=>{
      $("apiKeyInput").value="";
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
