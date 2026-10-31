/* ANIHUB - login e sincronização (Supabase). Carrega depois do script.js. */
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
btn.onclick=function(){user?viewAccount("p"):viewForm("in");open()};

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
var PRE=[["星","#6a5cff","#c06bff"],["月","#1d4ed8","#38bdf8"],["火","#dc2626","#fb923c"],["風","#059669","#6ee7b7"],["雷","#ca8a04","#fde047"],["桜","#db2777","#f9a8d4"],["龍","#7c3aed","#22d3ee"],["狐","#ea580c","#fbbf24"],["猫","#475569","#cbd5e1"],["剣","#0f172a","#64748b"],["魂","#4f46e5","#a78bfa"],["夢","#0d9488","#a3e635"]],dr=null,tabNow="p",csel=null,TOP=["Attack on Titan", "Death Note", "Fullmetal Alchemist: Brotherhood", "One Punch Man", "Demon Slayer", "Sword Art Online", "My Hero Academia", "Hunter x Hunter (2011)", "Naruto", "Tokyo Ghoul", "Your Name", "Jujutsu Kaisen", "Steins;Gate", "Naruto Shippuden", "One Piece", "No Game No Life", "A Silent Voice", "Code Geass", "Re:Zero", "Your Lie in April"],NC=["","#ff6b6b","#ffa94d","#ffd43b","#69db7c","#38d9a9","#4dabf7","#9775fa","#f783ac"];
function md(){return user.user_metadata||{}}
function nm(){return md().display_name||user.email.split("@")[0]}
function avUrl(){var u=md().avatar_url||"";return u.indexOf(C.url+"/storage/v1/object/public/avatars/")===0?u:""}
function presetOf(m){var n=m.avatar_preset;return Number.isInteger(n)&&PRE[n]?PRE[n]:null}
function paint(el,p){el.textContent=p[0];el.style.background="linear-gradient(135deg,"+p[1]+","+p[2]+")"}
function animeImg(){var t=md().avatar_anime;return t&&TOP.indexOf(t)>-1&&typeof IMG!=="undefined"&&IMG[t]?IMG[t]:""}
function ncol(){var n=md().name_color;return Number.isInteger(n)&&n>0&&NC[n]?NC[n]:""}
function avEl(big){var u=avUrl(),ai=animeImg(),p=presetOf(md()),el;
  if(!u&&ai){el=document.createElement("img");el.src=ai;el.alt=""}
  else if(u){el=document.createElement("img");el.src=u;el.alt="";el.referrerPolicy="no-referrer"}
  else{el=document.createElement("span");
    if(p)paint(el,p);else{el.textContent=nm().charAt(0).toUpperCase();var h=0;for(var i=0;i<user.id.length;i++)h=(h*31+user.id.charCodeAt(i))%360;el.style.background="hsl("+h+",55%,45%)"}}
  el.className=big?"avt big":"avt";return el}
function paintBtn(){btn.textContent="";if(user){btn.appendChild(avEl(0));var sp=document.createElement("span");sp.textContent=nm().slice(0,14);if(ncol())sp.style.color=ncol();btn.appendChild(sp)}else btn.textContent="Entrar"}
function cropSquare(file,cb,fail){
  createImageBitmap(file).then(function(bm){var n=Math.min(bm.width,bm.height),c=document.createElement("canvas");c.width=c.height=256;
    c.getContext("2d").drawImage(bm,(bm.width-n)/2,(bm.height-n)/2,n,n,0,0,256,256);c.toBlob(function(b){b?cb(b):fail()},"image/jpeg",.85)}).catch(fail)}
function keep(){if($("adn"))dr={n:$("adn").value,b:$("abio").value,f:$("afa").value,c:csel}}
function upd(data,okMsg){return sb.auth.updateUser({data:data}).then(function(x){if(x.error){msg("Não foi possível salvar.");return}user=x.data.user;paintBtn();viewAccount();msg(okMsg,1)})}
function badge(t,el){el.textContent="";var a=A.find(function(x){return x.t===t});if(!a)return;
  var k=document.createElement("span");k.className="avt";k.textContent=a.k||"★";k.style.background="linear-gradient(135deg,"+a.c[0]+","+a.c[1]+")";
  el.appendChild(k);el.appendChild(document.createTextNode(a.t))}
function stats(){var sv=[...seen],g={},ser=0,fil=0,eps=0;
  sv.forEach(function(i){var a=A[i];if(!a)return;a.f==="Filme"?fil++:ser++;(a.g||[]).forEach(function(x){g[x]=(g[x]||0)+1});if(a.f!=="Filme"&&typeof a.ep==="number")eps+=a.ep});
  var rs=Object.values(rate).map(Number).filter(Boolean),avg=rs.length?(rs.reduce(function(x,y){return x+y},0)/rs.length).toFixed(1).replace(".",",")+" de 5":"-";
  var top=Object.keys(g).map(function(k){return[k,g[k]]}).sort(function(x,y){return y[1]-x[1]}).slice(0,4),mx=top.length?top[0][1]:1,pc=Math.round(seen.size/A.length*100);
  function r(l,v){return'<div><dt>'+l+'</dt><dd>'+v+'</dd></div>'}
  return'<div class="abig"><b>'+seen.size+'</b><span>animes assistidos</span></div>'+
   '<dl class="akv">'+r("Séries",ser)+r("Filmes",fil)+r("Favoritos",favs.size)+r("Assistindo agora",watching.size)+r("Animes avaliados",rs.length)+r("Sua nota média",avg)+r("Episódios (aprox.)",eps)+'</dl>'+
   '<h3 class="sh">Gêneros que você mais assiste</h3>'+(top.length?top.map(function(t){return'<div class="agb"><span>'+t[0]+'</span><i style="width:'+Math.round(t[1]/mx*100)+'%"></i><em>'+t[1]+'</em></div>'}).join(""):'<p class="note">Marque o olhinho em alguns animes e volte aqui.</p>')}
function viewAccount(tab){
  if(tab)tabNow=tab;
  $("at").textContent="Sua conta";var m=md();
  var head='<div class="atabs"><button type="button" data-tab="p" class="'+(tabNow==="p"?"on":"")+'">Perfil</button><button type="button" data-tab="e" class="'+(tabNow==="e"?"on":"")+'">Estatísticas</button></div>';
  if(tabNow==="e"){keep();$("ab").innerHTML=head+stats()}
  else{
    var d=dr||{n:m.display_name||"",b:m.bio||"",f:m.fav_anime||"",c:Number.isInteger(m.name_color)?m.name_color:0};dr=null;csel=d.c||0;
    $("ab").innerHTML=head+'<div class="awho"><span id="avh"></span><div><div class="awn" id="wn"></div><div class="awb" id="wb"></div><div class="fb" id="fb"></div></div></div>'+
    '<p class="alk"><button class="lnk" id="apic" type="button">Enviar foto</button><button class="lnk" id="arm" type="button">Remover foto</button><input id="afile" type="file" accept="image/jpeg,image/png,image/webp" hidden></p>'+
    '<h3 class="sh">Capas de anime</h3><div class="pre" id="pre"></div>'+
    '<label class="af">Nome de exibição<input id="adn" maxlength="30" autocomplete="nickname"></label><div class="ncs" id="ncs" role="group" aria-label="Cor do nome"></div>'+
    '<label class="af">Sobre você<textarea id="abio" maxlength="140" rows="2"></textarea></label>'+
    '<label class="af">Anime favorito<input id="afa" list="adl" maxlength="80" placeholder="Digite para buscar" autocomplete="off"></label><datalist id="adl"></datalist>'+
    '<button class="abtn" id="asave" type="button">Salvar perfil</button>'+
    '<div class="afoot"><span>Conectado como <b id="aem"></b></span><button class="lnk" id="aout" type="button">Sair</button><button class="lnk danger" id="adel" type="button">Apagar conta</button></div>';
    $("avh").appendChild(avEl(1));$("adn").value=d.n;$("abio").value=d.b;$("afa").value=d.f;$("aem").textContent=user.email;badge(d.f,$("fb"));
    $("wn").textContent=d.n||nm();$("wb").textContent=d.b;
    $("adn").oninput=function(){$("wn").textContent=this.value.trim()||nm()};$("abio").oninput=function(){$("wb").textContent=this.value};
    A.forEach(function(x){var o=document.createElement("option");o.value=x.t;$("adl").appendChild(o)});
    TOP.forEach(function(t){var b=document.createElement("button");b.type="button";b.className="pre1"+(m.avatar_anime===t&&!avUrl()?" on":"");b.title=t;b.setAttribute("aria-label",t);
      if(typeof IMG!=="undefined"&&IMG[t]){var im=document.createElement("img");im.src=IMG[t];im.alt="";b.appendChild(im)}else b.textContent=t.charAt(0);
      b.onclick=function(){keep();sb.storage.from("avatars").remove([user.id+"/avatar.jpg"]).then(function(){upd({avatar_anime:t,avatar_url:null,avatar_preset:null},"Avatar atualizado!")})};$("pre").appendChild(b)});
    NC.forEach(function(c,i){var b=document.createElement("button");b.type="button";b.className="nc"+(i===csel?" on":"");b.setAttribute("aria-label",i?"Cor "+i:"Cor padrão");if(c)b.style.background=c;else b.textContent="A";
      b.onclick=function(){csel=i;$("wn").style.color=c;document.querySelectorAll(".nc").forEach(function(x,j){x.classList.toggle("on",j===i)})};$("ncs").appendChild(b)});
    $("wn").style.color=NC[csel]||"";
    $("afa").oninput=function(){badge(this.value,$("fb"))};
    $("apic").onclick=function(){$("afile").click()};
    $("afile").onchange=function(){var f=this.files[0];if(!f)return;
      if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>8e6)return msg("Escolha uma foto JPG, PNG ou WebP de até 8 MB.");
      keep();msg("Enviando foto...",1);
      cropSquare(f,function(blob){
        sb.storage.from("avatars").upload(user.id+"/avatar.jpg",blob,{upsert:true,contentType:"image/jpeg"}).then(function(r){
          if(r.error)return msg("Não foi possível enviar a foto.");
          var url=sb.storage.from("avatars").getPublicUrl(user.id+"/avatar.jpg").data.publicUrl+"?v="+Date.now();
          upd({avatar_url:url,avatar_preset:null,avatar_anime:null},"Foto atualizada!")})
      },function(){msg("Não consegui ler essa imagem.")})};
    $("arm").onclick=function(){keep();sb.storage.from("avatars").remove([user.id+"/avatar.jpg"]).then(function(){upd({avatar_url:null,avatar_preset:null,avatar_anime:null},"Foto removida.")})};
    $("asave").onclick=function(){var n=$("adn").value.trim().slice(0,30),b=$("abio").value.trim().slice(0,140),f=$("afa").value.trim();
      if(f&&!A.some(function(x){return x.t===f}))return msg("Escolha um anime da lista de sugestões.");
      sb.auth.updateUser({data:{display_name:n||null,bio:b||null,fav_anime:f||null,name_color:csel||null}}).then(function(x){if(x.error)return msg("Não foi possível salvar.");user=x.data.user;paintBtn();msg("Perfil salvo!",1)})};
    $("aout").onclick=function(){sb.auth.signOut()};
    $("adel").onclick=function(){
      if(!confirm("Apagar a conta e todos os dados salvos nela, inclusive a foto? Isso não pode ser desfeito."))return;
      sb.storage.from("avatars").remove([user.id+"/avatar.jpg"]).then(function(){
        sb.rpc("delete_user").then(function(r){if(r.error)return msg("Não foi possível apagar. Tente de novo.");sb.auth.signOut();close()})})};
  }
  document.querySelectorAll(".atabs button").forEach(function(t){t.onclick=function(){keep();viewAccount(t.dataset.tab)}});
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
  paintBtn();
  if(ev==="PASSWORD_RECOVERY")return viewNewPass();
  if(user&&user.id!==was)sync();
});
})();
