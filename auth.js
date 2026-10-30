/* AVG ANIMES - login e sincronização (Supabase). Carrega depois do script.js. */
(function(){
"use strict";
var C=window.AVG_CONFIG,btn=document.getElementById("acc");
if(!btn||!C||!C.url||!C.key||!window.supabase)return; // sem config: o botão nem aparece
var sb=window.supabase.createClient(C.url,C.key),user=null,applying=false,timer=null;
btn.hidden=false;

/* ---------- janela ---------- */
var ov=document.createElement("div");ov.className="overlay";ov.id="aov";
ov.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="at"><div class="mbody authbox"><button class="close" aria-label="Fechar" style="position:absolute;top:10px;right:12px">×</button><h2 id="at"></h2><div id="ab"></div><p id="am" class="authmsg" role="status" aria-live="polite"></p></div></div>';
document.body.appendChild(ov);
var $=function(i){return document.getElementById(i)};
function msg(t,ok){var m=$("am");m.textContent=t||"";m.className="authmsg"+(ok?" ok":"")}
function open(){ov.classList.add("open")}
function close(){ov.classList.remove("open")}
ov.addEventListener("click",function(e){if(e.target===ov||e.target.closest(".close"))close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
btn.onclick=function(){user?viewAccount():viewForm("in");open()};

function field(id,label,type,ac){return '<label class="af">'+label+'<input id="'+id+'" type="'+type+'" autocomplete="'+ac+'" required></label>'}
function viewForm(mode){
  var up=mode==="up",rec=mode==="rec";
  $("at").textContent=up?"Criar conta":rec?"Recuperar senha":"Entrar";
  $("ab").innerHTML='<form id="af" novalidate>'+field("ae","E-mail","email","email")+
    (rec?"":field("ap","Senha"+(up?" (mín. 8, com letras e números)":""),"password",up?"new-password":"current-password"))+
    '<button class="abtn" type="submit">'+(up?"Criar conta":rec?"Enviar link":"Entrar")+'</button></form><p class="alinks">'+
    (mode==="in"?'<a href="#" data-m="up">Criar conta</a> · <a href="#" data-m="rec">Esqueci a senha</a>':'<a href="#" data-m="in">Já tenho conta</a>')+'</p>';
  msg("");
  $("af").onsubmit=function(e){e.preventDefault();submit(mode)};
  $("ab").onclick=function(e){var a=e.target.closest("[data-m]");if(a){e.preventDefault();viewForm(a.dataset.m)}};
}
function viewNewPass(){
  $("at").textContent="Nova senha";
  $("ab").innerHTML='<form id="af" novalidate>'+field("ap","Nova senha (mín. 8, com letras e números)","password","new-password")+'<button class="abtn" type="submit">Salvar senha</button></form>';
  $("af").onsubmit=function(e){e.preventDefault();var p=$("ap").value;if(!okPass(p))return msg("A senha precisa ter 8 ou mais caracteres, com letras e números.");
    sb.auth.updateUser({password:p}).then(function(r){if(r.error)return msg("Não foi possível salvar. Peça um novo link.");msg("Senha alterada!",1);setTimeout(close,1200)})};
  msg("");open();
}
function viewAccount(){
  $("at").textContent="Sua conta";
  $("ab").innerHTML='<p>Conectado como <b id="aem"></b>.</p><p class="note">Seus favoritos, assistidos, assistindo e notas ficam salvos na conta.</p><button class="abtn" id="aout">Sair</button> <button class="abtn danger" id="adel">Apagar minha conta</button>';
  $("aem").textContent=user.email;msg("");
  $("aout").onclick=function(){sb.auth.signOut()};
  $("adel").onclick=function(){
    if(!confirm("Apagar a conta e todos os dados salvos nela? Isso não pode ser desfeito."))return;
    sb.rpc("delete_user").then(function(r){if(r.error)return msg("Não foi possível apagar. Tente de novo.");sb.auth.signOut();close()})};
}
function okPass(p){return p.length>=8&&/[A-Za-z]/.test(p)&&/\d/.test(p)}
function submit(mode){
  var em=$("ae").value.trim(),pw=$("ap")?$("ap").value:"";
  if(!/^\S+@\S+\.\S+$/.test(em))return msg("Digite um e-mail válido.");
  var back=location.origin+location.pathname;
  if(mode==="rec")return sb.auth.resetPasswordForEmail(em,{redirectTo:back}).then(function(){msg("Se o e-mail existir, enviamos um link para criar nova senha.",1)});
  if(mode==="up"){
    if(!okPass(pw))return msg("A senha precisa ter 8 ou mais caracteres, com letras e números.");
    return sb.auth.signUp({email:em,password:pw,options:{emailRedirectTo:back}}).then(function(r){
      if(r.error)return msg("Não foi possível criar a conta: "+r.error.message);
      msg("Quase lá! Enviamos um e-mail de confirmação. Abra o link e depois entre.",1)});
  }
  sb.auth.signInWithPassword({email:em,password:pw}).then(function(r){
    if(r.error)return msg(/confirm/i.test(r.error.message)?"Confirme seu e-mail antes de entrar.":"E-mail ou senha incorretos.");
    close()});
}

/* ---------- sincronização ---------- */
function snap(){return{favs:[...favs],seen:[...seen],watching:[...watching],rate:rate}}
function union(a,b){return[...new Set([].concat(a||[],b||[]))]}
function sync(){
  sb.from("user_data").select("data").eq("user_id",user.id).maybeSingle().then(function(r){
    if(r.error)return;
    var d=(r.data&&r.data.data)||{};
    applying=true;
    union(d.favs,[...favs]).forEach(function(i){favs.add(i)});
    union(d.seen,[...seen]).forEach(function(i){seen.add(i)});
    union(d.watching,[...watching]).forEach(function(i){watching.add(i)});
    Object.assign(rate,d.rate||{},rate);
    saveFavs();saveSeen();saveWatch();saveRate();
    applying=false;
    renderTabs();renderGrid(1);updateProg();
    push();
  });
}
function push(){
  if(!user)return;
  sb.from("user_data").upsert({user_id:user.id,data:snap(),updated_at:new Date().toISOString()}).then(function(){});
}
// percebe quando o site salva uma marcação no aparelho e envia para a conta
var KEYS={favs:1,seen:1,watching:1,rate:1},orig=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){orig.call(this,k,v);
  if(user&&!applying&&KEYS[k]){clearTimeout(timer);timer=setTimeout(push,1200)}};

sb.auth.onAuthStateChange(function(ev,s){
  var was=user&&user.id;user=s?s.user:null;
  btn.textContent=user?"Conta":"Entrar";
  if(ev==="PASSWORD_RECOVERY")return viewNewPass();
  if(user&&user.id!==was)sync();
});
})();
