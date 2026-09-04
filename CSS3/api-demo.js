(function(){
  "use strict";

  const $=id=>document.getElementById(id);
  let busy=false;
  let client=null;
  const history=[];

  function show(el){el&&el.classList.remove("hidden")}
  function hide(el){el&&el.classList.add("hidden")}

  async function ensureClient(){
    if(client)return client;
    if(!window.VertexAuth||typeof window.VertexAuth.ensureSupabase!=="function"){
      throw new Error("auth_not_ready");
    }
    client=await window.VertexAuth.ensureSupabase();
    const {data}=await client.auth.getSession();
    if(!data||!data.session){
      window.location.replace("login.html");
      throw new Error("not_logged_in");
    }
    return client;
  }

  function message(role,text,meta){
    hide($("welcome"));
    const wrap=document.createElement("article");
    wrap.className="message "+role;

    const avatar=document.createElement("div");
    avatar.className="avatar";
    avatar.textContent=role==="assistant"?"V":"أنت";

    const content=document.createElement("div");
    const bubble=document.createElement("div");
    bubble.className="bubble";
    bubble.textContent=text;
    content.appendChild(bubble);

    if(meta){
      const metaEl=document.createElement("div");
      metaEl.className="message-meta";
      metaEl.textContent=meta;
      content.appendChild(metaEl);
    }

    if(role==="assistant"){
      wrap.appendChild(avatar);
      wrap.appendChild(content);
    }else{
      wrap.appendChild(content);
      wrap.appendChild(avatar);
    }

    $("messages").appendChild(wrap);
    requestAnimationFrame(()=>wrap.scrollIntoView({behavior:"smooth",block:"end"}));
    return {wrap,bubble};
  }

  function typingMessage(){
    hide($("welcome"));
    const wrap=document.createElement("article");
    wrap.className="message assistant";
    wrap.innerHTML='<div class="avatar">V</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>';
    $("messages").appendChild(wrap);
    requestAnimationFrame(()=>wrap.scrollIntoView({behavior:"smooth",block:"end"}));
    return wrap;
  }

  function autoGrow(){
    const box=$("promptInput");
    box.style.height="auto";
    box.style.height=Math.min(box.scrollHeight,140)+"px";
  }

  async function sendPrompt(prefill){
    if(busy)return;

    const box=$("promptInput");
    if(prefill)box.value=prefill;
    const prompt=box.value.trim();
    if(!prompt)return;

    busy=true;
    $("sendBtn").disabled=true;
    message("user",prompt);
    history.push({role:"user",content:prompt});
    box.value="";
    autoGrow();
    const typing=typingMessage();

    try{
      const c=await ensureClient();
      const {data,error}=await c.functions.invoke("vertex-ai",{
        body:{
          messages:history.slice(-20),
          memories:[],
          assistantName:"Vertex AI"
        }
      });

      typing.remove();

      if(error)throw error;
      if(!data||typeof data.reply!=="string"||!data.reply.trim()){
        throw new Error("empty_ai_reply");
      }

      const reply=data.reply.trim();
      history.push({role:"assistant",content:reply});
      message("assistant",reply,"Vertex AI");
    }catch(error){
      typing.remove();
      const msg=String(error&&error.message?error.message:error||"").toLowerCase();
      if(msg.includes("jwt")||msg.includes("401")||msg.includes("unauthorized")||msg.includes("not_logged_in")){
        message("assistant","انتهت جلسة الدخول. سجّل الدخول من جديد ثم حاول مرة ثانية.");
        setTimeout(()=>window.location.replace("login.html"),900);
      }else if(msg.includes("network")||msg.includes("failed to fetch")){
        message("assistant","تعذر الاتصال بخدمة Vertex AI. تأكد من الإنترنت وحاول مرة ثانية.");
      }else{
        message("assistant","تعذر الحصول على رد من Vertex AI الآن. حاول مرة ثانية بعد قليل.");
      }
    }finally{
      busy=false;
      $("sendBtn").disabled=false;
      box.focus();
    }
  }

  async function init(){
    try{
      await ensureClient();
    }catch(error){
      if(String(error&&error.message||error)!=="not_logged_in"){
        console.error("Vertex demo auth error:",error);
      }
    }

    $("sendBtn").addEventListener("click",()=>sendPrompt());
    $("promptInput").addEventListener("input",autoGrow);
    $("promptInput").addEventListener("keydown",e=>{
      if(e.key==="Enter"&&!e.shiftKey){
        e.preventDefault();
        sendPrompt();
      }
    });

    document.querySelectorAll("[data-prompt]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        $("promptInput").value=btn.dataset.prompt||"";
        autoGrow();
        $("promptInput").focus();
      });
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
