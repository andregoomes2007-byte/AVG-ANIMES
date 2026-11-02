/* ZANIME - capas em alta qualidade na janela de detalhes e no banner. Carrega depois do script.js. */
(function(){
"use strict";
// o MyAnimeList guarda uma versão grande de cada capa: o mesmo endereço com "l" antes do .jpg
function bigUrl(u){return u?u.replace(/\.jpg(\?.*)?$/i,"l.jpg"):""}
// mostra a imagem pequena na hora e troca pela grande quando ela terminar de carregar
function upgrade(el,a){if(typeof CAPA!=="undefined"&&CAPA[a.t])return;var u=bigUrl(a.img);if(!u||!el)return;
  var t=new Image();t.referrerPolicy="no-referrer";t.onload=function(){if(el.isConnected)el.src=u};t.src=u}
// monta o layout em duas colunas: capa inteira à esquerda, informações e ações à direita
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function enhanceModal(){
  try{var a=A[cur],m=document.getElementById("modal"),h=m.querySelector(".mhead"),body=m.querySelector(".mbody");
    if(!a||!h||!body)return;
    var art=h.querySelector("img,svg"),close=h.querySelector(".close"),title=h.querySelector("h2");
    var top=el("div","mtop"),box=el("div","mposter"),info=el("div","minfo"),act=el("div","mact");
    top.style.setProperty("--c0",(a.c&&a.c[0])||"transparent");
    if(art)box.appendChild(art);
    info.appendChild(title);
    var mm=el("p","mmeta");[a.y,a.s,epTxt(a)].filter(Boolean).forEach(function(t){mm.appendChild(el("span",null,t))});info.appendChild(mm);
    if(a.mr){var sc=el("div","mscore");sc.appendChild(el("b",null,"★ "+a.mr));sc.appendChild(el("span",null,a.mk?"#"+a.mk+" no ranking do MyAnimeList":"nota no MyAnimeList"));info.appendChild(sc)}
    var tg=el("div","tags");(a.g||[]).forEach(function(g){tg.appendChild(el("span",null,g))});info.appendChild(tg);
    body.querySelectorAll(":scope > .stars, :scope > .fav").forEach(function(n){act.appendChild(n)});
    top.appendChild(close);top.appendChild(box);top.appendChild(info);top.appendChild(act);
    m.insertBefore(top,h);h.remove();
    if(art&&art.tagName==="IMG")upgrade(art,a)}catch(e){}}
function enhanceHero(){
  try{var a=A[FEAT[hi]],im=document.querySelector("#hero .hero-cover img");if(a&&im)upgrade(im,a)}catch(e){}}
var od=window.drawModal,oh=window.drawHero;
if(typeof od==="function")window.drawModal=function(){od.apply(this,arguments);enhanceModal()};
if(typeof oh==="function"){window.drawHero=function(){oh.apply(this,arguments);enhanceHero()};enhanceHero()}
})();
