(function(){
  "use strict";

  const ENDPOINT="https://fkpjawyuyzgtjceymnal.supabase.co/functions/v1/vertex-api";
  const $=id=>document.getElementById(id);
  let apiKey="";
  let busy=false;

  function show(el){el&&el.classList.remove("hidden")}
  function hide(el){el&&el.classList.add("hidden")}

  function openKeyModal(){
    $("keyError").textContent="";
    hide($("keyError"));
    $("apiKeyInput").value=apiKey;
    show($("keyModal"));
    setTimeout(()=>$("apiKeyInput").focus(),40);
  }

  function closeKeyModal(){
    hide($("keyModal"));
    $("apiKeyInput").value="";
  }

  function saveKey(){
    const value=$("apiKeyInput").value.trim();
    if(!value.startsWith("vx_live_")||value.length<30){
      $("keyError").textContent="الصق مفتاح Vertex API الصحيح أولًا.";
      show($("keyError"));
      return;
    }
    apiKey=value;
    $("openKeyBtn").textContent="✓ المفتاح مربوط";
    $("openKeyBtn").classList.add("connected");
    closeKeyModal();
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
    box.style.height=Math.min(box.scrollHeight,160)+"px";
  }

  async function sendPrompt(prefill){
    if(busy)return;
    const box=$("promptInput");
    if(prefill)box.value=prefill;
    const prompt=box.value.trim();
    if(!prompt)return;
    if(!apiKey){openKeyModal();return;}

    busy=true;
    $("sendBtn").disabled=true;
    message("user",prompt);
    box.value="";
    autoGrow();
    const typing=typingMessage();

    try{
      const response=await fetch(ENDPOINT,{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey},
        body:JSON.stringify({prompt})
      });
      const data=await response.json().catch(()=>({}));
      typing.remove();

      if(!response.ok){
        const code=data?.error?.code||"api_error";
        const msg=data?.error?.message||("HTTP "+response.status);
        message("assistant","تعذر تنفيذ الطلب: "+msg,"HTTP "+response.status+" • "+code);
        if(response.status===401){
          apiKey="";
          $("openKeyBtn").textContent="🔑 ربط المفتاح";
          $("openKeyBtn").classList.remove("connected");
        }
        return;
      }

      message(
        "assistant",
        data.reply||"تم الاتصال بنجاح، لكن لم يصل نص رد.",
        "HTTP 200 • "+(data.model||"Vertex AI")
      );
    }catch(error){
      typing.remove();
      message("assistant","صار خطأ في الاتصال بالـ API. حاول مرة ثانية.",error?.message||"network_error");
    }finally{
      busy=false;
      $("sendBtn").disabled=false;
      box.focus();
    }
  }

  function init(){
    $("openKeyBtn").addEventListener("click",openKeyModal);
    $("saveKeyBtn").addEventListener("click",saveKey);
    $("cancelKeyBtn").addEventListener("click",closeKeyModal);
    $("modalBackdrop").addEventListener("click",closeKeyModal);
    $("toggleKeyBtn").addEventListener("click",()=>{
      const input=$("apiKeyInput");
      const isHidden=input.type==="password";
      input.type=isHidden?"text":"password";
      $("toggleKeyBtn").textContent=isHidden?"إخفاء":"إظهار";
    });
    $("apiKeyInput").addEventListener("keydown",e=>{
      if(e.key==="Enter")saveKey();
    });

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

    window.addEventListener("beforeunload",()=>{apiKey="";$("apiKeyInput").value="";});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
