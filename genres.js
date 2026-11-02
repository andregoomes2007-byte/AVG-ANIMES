/* ZANIME - janela de gêneros: escolhe um gênero (menu) ou vários ao mesmo tempo (filtro). Carrega depois do script.js. */
(function(){
"use strict";
var ov=document.createElement("div");ov.className="overlay";ov.id="gov";
ov.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="gt"><div class="mbody authbox"><button class="close" aria-label="Fechar" style="position:absolute;top:10px;right:12px">×</button><h2 id="gt"></h2><p class="note" id="gn"></p><div class="gchips" id="gc"></div><div class="gact" id="gact" hidden><button class="abtn" id="gok" type="button">Mostrar animes</button><button class="lnk" id="gclr" type="button">Limpar</button></div></div></div>';
document.body.appendChild(ov);
var multi=false,sel=[],$=function(i){return document.getElementById(i)};
function close(){ov.classList.remove("open")}
function scrollList(){var c=$("count");if(c&&c.scrollIntoView)c.scrollIntoView({behavior:"smooth",block:"start"})}
function pick(n){tab=n;lim=60;renderTabs();renderGrid(1);close();scrollList()}
function build(){
  var box=$("gc");box.textContent="";
  var items=multi?Object.keys(PAL):["Todos"].concat(Object.keys(PAL));
  items.forEach(function(n){
    var c=n==="Todos"?A.length:A.filter(function(a){return a.g.indexOf(n)>-1}).length;
    var b=document.createElement("button");b.type="button";b.className="tab";b.style.setProperty("--c",n==="Todos"?"#FFD23F":PAL[n][0]);
    if(multi)b.setAttribute("aria-pressed",sel.indexOf(n)>-1?"true":"false");else if(n===tab)b.setAttribute("aria-current","true");
    b.appendChild(document.createElement("i"));b.appendChild(document.createTextNode(n+" ("+c+")"));
    b.onclick=function(){
      if(!multi)return pick(n);
      var k=sel.indexOf(n);k>-1?sel.splice(k,1):sel.push(n);b.setAttribute("aria-pressed",k>-1?"false":"true")};
    box.appendChild(b)});
}
function openPicker(m){
  multi=!!m;sel=multi?gsel.slice():[];
  $("gt").textContent=multi?"Escolha um ou mais gêneros":"Escolha um gênero";
  $("gn").textContent=multi?"O anime precisa ter todos os gêneros marcados.":"";
  $("gact").hidden=!multi;build();ov.classList.add("open");
  var f=$("gc").querySelector("button");if(f)f.focus();
}
$("gok").onclick=function(){gsel=sel.slice();lim=60;renderTabs();renderGrid(1);close();scrollList()};
$("gclr").onclick=function(){sel=[];build()};
ov.addEventListener("click",function(e){if(e.target===ov||e.target.closest(".close"))close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
// botão "Gêneros" do menu: captura o clique antes do código antigo (que só rolava a página)
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-nav=gen]");if(!b)return;e.stopPropagation();openPicker(false)},true);
// filtro de vários gêneros
$("gmulti").onclick=function(){openPicker(true)};
// botão "Gêneros" da tela de boas-vindas: entra no catálogo e abre a lista
document.querySelectorAll(".w-go").forEach(function(b){if(b.textContent.trim()==="Gêneros")b.addEventListener("click",function(){setTimeout(function(){openPicker(false)},450)})});
})();
