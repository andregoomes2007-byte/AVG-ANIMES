/* ANIHUB - janela de escolha de gênero (botão "Gêneros"). Carrega depois do script.js. */
(function(){
"use strict";
var ov=document.createElement("div");ov.className="overlay";ov.id="gov";
ov.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="gt"><div class="mbody authbox"><button class="close" aria-label="Fechar" style="position:absolute;top:10px;right:12px">×</button><h2 id="gt">Escolha um gênero</h2><div class="gchips" id="gc"></div></div></div>';
document.body.appendChild(ov);
function close(){ov.classList.remove("open")}
function pick(n){tab=n;lim=60;renderTabs();renderGrid(1);close();
  var c=document.getElementById("count");if(c&&c.scrollIntoView)c.scrollIntoView({behavior:"smooth",block:"start"})}
function openPicker(){
  var box=document.getElementById("gc");box.textContent="";
  [["Todos",A.length]].concat(Object.keys(PAL).map(function(n){return[n,A.filter(function(a){return a.g.indexOf(n)>-1}).length]})).forEach(function(p){
    var b=document.createElement("button");b.type="button";b.className="tab";b.style.setProperty("--c",p[0]==="Todos"?"#FFD23F":PAL[p[0]][0]);
    if(p[0]===tab)b.setAttribute("aria-current","true");
    b.appendChild(document.createElement("i"));b.appendChild(document.createTextNode(p[0]+" ("+p[1]+")"));
    b.onclick=function(){pick(p[0])};box.appendChild(b)});
  ov.classList.add("open");var f=box.querySelector("button");if(f)f.focus();
}
ov.addEventListener("click",function(e){if(e.target===ov||e.target.closest(".close"))close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
// botão "Gêneros" do menu: captura o clique antes do código antigo (que só rolava a página)
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-nav=gen]");if(!b)return;e.stopPropagation();openPicker()},true);
// botão "Gêneros" da tela de boas-vindas: entra no catálogo e abre a lista
document.querySelectorAll(".w-go").forEach(function(b){if(b.textContent.trim()==="Gêneros")b.addEventListener("click",function(){setTimeout(openPicker,450)})});
})();
