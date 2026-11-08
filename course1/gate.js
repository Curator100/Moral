/* ===== Ninja course gate: WhatsApp number must have an active grant in Supabase (tm_course_access) ===== */
(function(){
var SB='https://egsklbezrommbtyjyvak.supabase.co',
KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc2tsYmV6cm9tbWJ0eWp5dmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzA1NDYsImV4cCI6MjA5OTEwNjU0Nn0.g2r1gWeBg4RXQTsikure9wQJTXC0aNUw2p2V99-cZl4',
COURSE='ninja',LS='tm_course_wa';
var bnD='০১২৩৪৫৬৭৮৯';
var DEV_LS='tm_course_dev';
function dev(){try{var d=localStorage.getItem(DEV_LS);if(!d){d=(self.crypto&&crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36)).replace(/-/g,'').slice(0,32);localStorage.setItem(DEV_LS,d)}return d}catch(e){return ''}}
function sid(){try{var s=sessionStorage.getItem('tm_course_sid');if(!s){s=Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);sessionStorage.setItem('tm_course_sid',s)}return s}catch(e){return 'n'+Math.random().toString(36).slice(2,8)}}
/* ---- usage tracker: events are queued and sent in batches to tm_course_track ---- */
var Q=[],TW='';
function flush(final){
  if(!Q.length||!TW)return;var b=Q.splice(0,40);
  try{fetch(SB+'/rest/v1/rpc/tm_course_track',{method:'POST',keepalive:true,headers:{'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify({p_whatsapp:TW,p_device:dev(),p_sid:sid(),p_events:b})}).then(function(r){if(!r.ok&&!final)Q=b.concat(Q).slice(0,200)}).catch(function(){if(!final)Q=b.concat(Q).slice(0,200)})}catch(e){}
}
window.TMC={t:function(ev,mod,val,meta){Q.push({event:ev,module:mod==null?null:mod,value:val==null?null:Math.round(val*10)/10,meta:meta||null});if(Q.length>=15)flush()},flush:flush};
setInterval(flush,10000);addEventListener('pagehide',function(){flush(true)});
function norm(s){return String(s||'').replace(/[০-৯]/g,function(d){return bnD.indexOf(d)}).replace(/\D/g,'')}
function get(){try{return localStorage.getItem(LS)||''}catch(e){return ''}}
function put(v){try{v?localStorage.setItem(LS,v):localStorage.removeItem(LS)}catch(e){}}
async function check(wa){
  var r=await fetch(SB+'/rest/v1/rpc/tm_course_gate',{method:'POST',headers:{'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify({p_whatsapp:wa,p_course:COURSE,p_device:dev()})});
  if(!r.ok)throw new Error('http '+r.status);
  return r.json();
}
function start(wa){TW=wa;var s=document.createElement('script');s.src='course.js';document.body.appendChild(s)}
function lockScreen(){
  var o=document.getElementById('gate');if(o)o.remove();
  o=document.createElement('div');o.id='gate';
  o.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;background:#12231b;color:#f6f2e9;font:400 16px/1.7 "Hind Siliguri",system-ui,sans-serif';
  o.innerHTML='<div style="width:100%;max-width:400px;text-align:center"><div style="width:72px;height:72px;margin:0 auto 16px;display:grid;place-items:center;border-radius:22px;background:rgba(232,165,138,.12);border:1px solid rgba(232,165,138,.55);font-size:34px">🔒</div><div style="color:#e4cf9e;font-weight:700;letter-spacing:.16em;font-size:12px;text-transform:uppercase;margin-bottom:12px">Tuition Media · প্রিমিয়াম কোর্স</div><h1 style="font:700 22px/1.4 \'Noto Serif Bengali\',serif;margin:0 0 12px">এই ডিভাইস থেকে কোর্স দেখা যাচ্ছে না</h1><p style="margin:0 0 20px;color:rgba(246,242,233,.85)">আপনি একাধিক ডিভাইস দিয়ে কোর্সটি দেখার চেষ্টা করছেন, যা আমাদের নীতির বিরোধী। আপনার আগের ডিভাইস দিয়ে কোর্সটি দেখুন অথবা আমাদের অ্যাডমিনের সাথে যোগাযোগ করুন।</p><button id="gretry" style="width:100%;padding:14px;border-radius:12px;background:#c9a96a;color:#1a1a14;font-weight:700;font-size:16px;font-family:inherit;cursor:pointer;border:0">আবার চেষ্টা করুন</button></div>';
  document.body.appendChild(o);
  o.querySelector('#gretry').onclick=function(){location.reload()};
}
function overlay(msg){
  var o=document.createElement('div');o.id='gate';
  o.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;background:#12231b;color:#f6f2e9;font:400 16px/1.6 "Hind Siliguri",system-ui,sans-serif';
  o.innerHTML='<form id="gf" style="width:100%;max-width:380px;text-align:center"><div style="width:72px;height:72px;margin:0 auto 14px;display:grid;place-items:center;border-radius:22px;background:linear-gradient(145deg,rgba(228,207,158,.2),rgba(201,169,106,.06));border:1px solid rgba(201,169,106,.5);box-shadow:0 8px 28px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.14)"><span style="width:40px;height:40px;display:block"><svg style=\"width:40px;height:40px\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><defs><linearGradient id=\"pg3\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#F4DFA0\"/><stop offset=\".55\" stop-color=\"#C9A96A\"/><stop offset=\"1\" stop-color=\"#9C7A36\"/></linearGradient></defs><path d=\"M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z\" fill=\"url(#pg3)\" stroke=\"#7A5C20\" stroke-width=\"1\" stroke-linejoin=\"round\"/><circle cx=\"3\" cy=\"8\" r=\"1.4\" fill=\"#F4DFA0\"/><circle cx=\"12\" cy=\"5\" r=\"1.4\" fill=\"#F4DFA0\"/><circle cx=\"21\" cy=\"8\" r=\"1.4\" fill=\"#F4DFA0\"/><path d=\"M6 16.5h12\" stroke=\"#7A5C20\" stroke-width=\"1\" stroke-linecap=\"round\" opacity=\".6\"/></svg></span></div><div style="color:#e4cf9e;font-weight:700;letter-spacing:.16em;font-size:12px;text-transform:uppercase;margin-bottom:12px">Tuition Media · প্রিমিয়াম কোর্স</div><h1 style="font:700 24px/1.35 \'Noto Serif Bengali\',serif;margin:0 0 8px">কোর্সে ঢুকতে আপনার WhatsApp নম্বর দিন</h1><p style="margin:0 0 18px;color:rgba(246,242,233,.66)">যে নম্বর দিয়ে Tuition Media-তে আছেন, সেই নম্বর লিখুন।</p><input id="gw" type="tel" inputmode="numeric" autocomplete="tel" placeholder="01XXXXXXXXX" style="width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(246,242,233,.25);background:rgba(246,242,233,.06);color:#f6f2e9;font:600 18px Manrope,system-ui,sans-serif;text-align:center;letter-spacing:.04em;-webkit-user-select:text;user-select:text"><div id="ge" style="min-height:24px;margin:10px 0;color:#e8a58a;font-size:14px"></div><button id="gb2" type="submit" style="width:100%;padding:14px;border-radius:12px;background:#c9a96a;color:#1a1a14;font-weight:700;font-size:16px;font-family:inherit;cursor:pointer;border:0">কোর্সে ঢুকুন</button></form>';
  document.body.appendChild(o);
  var f=o.querySelector('#gf'),i=o.querySelector('#gw'),e=o.querySelector('#ge'),b=o.querySelector('#gb2');
  if(msg)e.textContent=msg;
  f.onsubmit=async function(ev){
    ev.preventDefault();var wa=norm(i.value);
    if(wa.length<10){e.textContent='সঠিক নম্বর লিখুন।';return}
    b.disabled=true;b.textContent='যাচাই হচ্ছে…';e.textContent='';
    try{var g=await check(wa);
      if(g&&g.ok){put(wa);o.remove();start(wa)}
      else if(g&&g.reason==='ip_locked'){put(wa);lockScreen()}
      else{e.textContent='এই নম্বরে কোর্সের এক্সেস নেই। এক্সেস পেতে Tuition Media টিমের সাথে যোগাযোগ করুন।'}
    }catch(x){e.textContent='ইন্টারনেট বা সার্ভারে সমস্যা। আবার চেষ্টা করুন।'}
    b.disabled=false;b.textContent='কোর্সে ঢুকুন';
  };
  setTimeout(function(){i.focus()},50);
}
async function boot(){
  var m=(location.hash||'').match(/[#&]w=([^&]+)/),wa=m?norm(decodeURIComponent(m[1])):get();
  if(m){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
  var had=wa.length>=10;
  if(had){
    try{var g=await check(wa);
      if(g&&g.ok){put(wa);start(wa);return}
      if(g&&g.reason==='ip_locked'){put(wa);lockScreen();return}
      put('');overlay('এই নম্বরে কোর্সের এক্সেস নেই।');return;
    }catch(x){overlay('ইন্টারনেট বা সার্ভারে সমস্যা। আবার চেষ্টা করুন।');return}
  }
  overlay('');
}
boot();
})();
