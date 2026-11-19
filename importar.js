/* ANIMES Z - importar a lista do MyAnimeList. Carrega depois do script.js.
   O arquivo é lido só no seu aparelho: nada é enviado para fora. */
(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
// nomes que o MyAnimeList usa (em japonês) -> nome deste catálogo (em inglês)
var APELIDOS={
  "Shingeki no Kyojin":"Attack on Titan",
  "Kimetsu no Yaiba":"Demon Slayer",
  "Kimetsu no Yaiba Movie: Mugen Train":"Demon Slayer: Mugen Train",
  "Boku no Hero Academia":"My Hero Academia",
  "Sousou no Frieren":"Frieren: Além do Fim da Jornada",
  "Kimi no Na wa.":"Your Name",
  "Tenki no Ko":"Weathering with You",
  "Byousoku 5 Centimeter":"5 Centimeters per Second",
  "Koe no Katachi":"A Silent Voice",
  "Shigatsu wa Kimi no Uso":"Your Lie in April",
  "Sen to Chihiro no Kamikakushi":"Spirited Away",
  "Tonari no Totoro":"My Neighbor Totoro",
  "Mononoke Hime":"Princess Mononoke",
  "Howl no Ugoku Shiro":"Howl's Moving Castle",
  "Majo no Takkyuubin":"Kiki's Delivery Service",
  "Tenkuu no Shiro Laputa":"Castle in the Sky",
  "Kaze Tachinu":"The Wind Rises",
  "Hotaru no Haka":"Grave of the Fireflies",
  "Kono Subarashii Sekai ni Shukufuku wo!":"Konosuba",
  "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen":"Kaguya-sama: Love Is War",
  "Ookami Kodomo no Ame to Yuki":"Wolf Children",
  "Toki wo Kakeru Shoujo":"The Girl Who Leapt Through Time",
  "Suzume no Tojimari":"Suzume",
  "Gekijouban Jujutsu Kaisen 0":"Jujutsu Kaisen 0",
  "Kuroko no Basket":"Kuroko's Basketball",
  "Haikyuu!!":"Haikyu!!",
  "Shokugeki no Souma":"Food Wars!",
  "Nanatsu no Taizai":"The Seven Deadly Sins",
  "Ansatsu Kyoushitsu":"Assassination Classroom",
  "Tensei shitara Slime Datta Ken":"That Time I Got Reincarnated as a Slime",
  "Mushoku Tensei: Isekai Ittara Honki Dasu":"Mushoku Tensei",
  "Tate no Yuusha no Nariagari":"The Rising of the Shield Hero",
  "Re:Zero kara Hajimeru Isekai Seikatsu":"Re:Zero",
  "Hagane no Renkinjutsushi":"Fullmetal Alchemist (2003)",
  "Kaijuu 8-gou":"Kaiju No. 8",
  "Dungeon Meshi":"Delicious in Dungeon",
  "Kusuriya no Hitorigoto":"The Apothecary Diaries",
  "Ore dake Level Up na Ken":"Solo Leveling",
  "Houseki no Kuni":"Land of the Lustrous",
  "Mahoutsukai no Yome":"The Ancient Magus' Bride",
  "Natsume Yuujinchou":"Natsume's Book of Friends",
  "Yuru Camp△":"Yuru Camp",
  "Ouran Koukou Host Club":"Ouran High School Host Club",
  "Fruits Basket":"Fruits Basket (2019)",
  "Ookami to Koushinryou":"Spice and Wolf",
  "Bishoujo Senshi Sailor Moon":"Sailor Moon",
  "Mahou Shoujo Madoka★Magica":"Puella Magi Madoka Magica",
  "Tengen Toppa Gurren Lagann":"Gurren Lagann",
  "Kidou Senshi Gundam":"Mobile Suit Gundam",
  "Code Geass: Hangyaku no Lelouch":"Code Geass",
  "Bakemonogatari":"Monogatari Series",
  "Enen no Shouboutai":"Fire Force",
  "Shuumatsu no Valkyrie":"Record of Ragnarok",
  "Jigokuraku":"Hell's Paradise",
  "Ao no Exorcist":"Blue Exorcist",
  "Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai":"Rascal Does Not Dream of Bunny Girl Senpai",
  "Yahari Ore no Seishun Love Come wa Machigatteiru.":"My Teen Romantic Comedy SNAFU",
  "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e":"Classroom of the Elite",
  "Gotoubun no Hanayome":"The Quintessential Quintuplets",
  "Kanojo, Okarishimasu":"Rent-a-Girlfriend",
  "Komi-san wa, Comyushou desu.":"Komi Can't Communicate",
  "Boku no Kokoro no Yabai Yatsu":"The Dangers in My Heart",
  "Skip to Loafer":"Skip and Loafer",
  "Yakusoku no Neverland":"The Promised Neverland",
  "Boku dake ga Inai Machi":"Erased",
  "Kiseijuu: Sei no Kakuritsu":"Parasyte: The Maxim",
  "Zankyou no Terror":"Terror in Resonance",
  "Higurashi no Naku Koro ni":"Higurashi: When They Cry",
  "Kobayashi-san Chi no Maidragon":"Miss Kobayashi's Dragon Maid",
  "Gochuumon wa Usagi Desu ka?":"Is the Order a Rabbit?",
  "Hataraku Saibou":"Cells at Work!",
  "Bungou Stray Dogs":"Bungo Stray Dogs",
  "Kuroshitsuji":"Black Butler",
  "Owari no Seraph":"Seraph of the End",
  "Jibaku Shounen Hanako-kun":"Toilet-Bound Hanako-kun",
  "Youjo Senki":"Saga of Tanya the Evil",
  "Hataraku Maou-sama!":"The Devil Is a Part-Timer!",
  "Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka":"Is It Wrong to Try to Pick Up Girls in a Dungeon?",
  "Suzumiya Haruhi no Yuuutsu":"The Melancholy of Haruhi Suzumiya",
  "Keroro Gunsou":"Sgt. Frog",
  "Toaru Majutsu no Index":"A Certain Magical Index",
  "Toaru Kagaku no Railgun":"A Certain Scientific Railgun",
  "Naruto: Shippuuden":"Naruto Shippuden",
  "Meitantei Conan":"Detective Conan",
  "Gekkan Shoujo Nozaki-kun":"Monthly Girls' Nozaki-kun",
  "Saiki Kusuo no Psi-nan":"The Disastrous Life of Saiki K.",
  "Yuu Yuu Hakusho":"Yu Yu Hakusho",
  "Yuu☆Gi☆Ou!":"Yu-Gi-Oh!",
  "Pocket Monsters":"Pokémon",
  "Tennis no Ouji-sama":"The Prince of Tennis",
  "Rurouni Kenshin: Meiji Kenkaku Romantan":"Rurouni Kenshin",
  "Kami no Tou":"Tower of God",
  "Futari wa Precure":"Pretty Cure",
  "Gintama°":"Gintama",
  "Gintama.":"Gintama",
  "Mobile Suit Gundam: The Witch from Mercury":"Gundam: The Witch from Mercury",
  "Kidou Senshi Gundam: Suisei no Majo":"Gundam: The Witch from Mercury",
  "Mobile Suit Gundam: Iron-Blooded Orphans":"Gundam: Iron-Blooded Orphans",
  "Kidou Senshi Gundam: Tekketsu no Orphans":"Gundam: Iron-Blooded Orphans",
  "Mushishi Zoku Shou":"Mushishi",
  "Nisekoi:":"Nisekoi",
  "Fullmetal Alchemist":"Fullmetal Alchemist (2003)"
};
function norm(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/&/g," and ").replace(/[^a-z0-9]+/g,"")}
var idx=null,alias=null;
function montar(){
  if(idx)return;idx={};alias={};var dup={};
  A.forEach(function(a,i){if(a.hid)return;var k=norm(a.t);idx[k]=i;
    var sem=norm(a.t.replace(/\s*\(\d{4}\)\s*$/,""));if(sem!==k){if(sem in dup||(sem in idx&&idx[sem]!==i))dup[sem]=1;else idx[sem]=i}});
  Object.keys(dup).forEach(function(k){if(idx[k]!==undefined&&norm(A[idx[k]].t)!==k)delete idx[k]});
  Object.keys(APELIDOS).forEach(function(k){var i=idx[norm(APELIDOS[k])];if(i!==undefined)alias[norm(k)]=i});
}
function semTemporada(t){
  return t.replace(/\b(\d+(st|nd|rd|th)|first|second|third|fourth|fifth|final)\s+season\b/gi,"").replace(/\bseason\s*\d+\b/gi,"").replace(/\b(part|cour)\s*\d+\b/gi,"").replace(/\s+(ii|iii|iv|vi)$/i,"").replace(/\s{2,}/g," ").trim()
}
function achar(titulo){
  montar();
  var tentativas=[titulo,semTemporada(titulo)],ci=titulo.split(/:\s|\s-\s/)[0];
  if(ci&&ci!==titulo){tentativas.push(ci);tentativas.push(semTemporada(ci))}
  for(var n=0;n<tentativas.length;n++){var k=norm(tentativas[n]);if(!k)continue;if(idx[k]!==undefined)return idx[k];if(alias[k]!==undefined)return alias[k]}
  return null;
}
function lerStatus(v){v=String(v||"").trim().toLowerCase();
  if(v==="completed"||v==="2")return"C";if(v==="watching"||v==="currently watching"||v==="1")return"W";
  if(v==="plan to watch"||v==="6")return"P";return"X"}
function texto(no,tag){var e=no.getElementsByTagName(tag)[0];return e?e.textContent:""}
function lerXml(txt){
  var doc=new DOMParser().parseFromString(txt,"text/xml");
  if(doc.getElementsByTagName("parsererror").length)throw new Error("xml");
  var nos=doc.getElementsByTagName("anime"),lista=[];
  for(var n=0;n<nos.length;n++){var no=nos[n],t=texto(no,"series_title");if(!t)continue;
    lista.push({t:t,st:lerStatus(texto(no,"my_status")),nota:+texto(no,"my_score")||0,ep:+texto(no,"my_watched_episodes")||0})}
  return lista;
}
function lerArquivo(f){
  return f.arrayBuffer().then(function(buf){
    var b=new Uint8Array(buf),gz=b.length>2&&b[0]===0x1f&&b[1]===0x8b;
    if(!gz)return new TextDecoder("utf-8").decode(b);
    if(typeof DecompressionStream==="undefined")throw new Error("gz");
    return new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
  });
}
/* junta as linhas da lista que caem no mesmo anime do catálogo */
function casar(lista){
  var por={},fora=[],ign=0;
  lista.forEach(function(x){
    if(x.st==="X"){ign++;return}
    var i=achar(x.t);if(i===null){if(fora.indexOf(x.t)<0)fora.push(x.t);return}
    var r=por[i]||(por[i]={C:false,W:false,P:false,nota:0,ep:0});
    r[x.st]=true;r.nota=Math.max(r.nota,x.nota);r.ep=Math.max(r.ep,x.ep);
  });
  return{por:por,fora:fora,ign:ign,total:lista.length};
}
function resumo(m){
  var c=0,w=0,p=0,n=0;
  Object.keys(m.por).forEach(function(k){var r=m.por[k],i=+k;
    if(r.C&&!seen.has(i))c++;else if(!r.C&&r.W&&!seen.has(i)&&!watching.has(i))w++;else if(!r.C&&!r.W&&r.P&&!seen.has(i)&&!watching.has(i)&&!later.has(i))p++;
    if(r.nota>0&&!rate[i])n++});
  return{c:c,w:w,p:p,n:n,achados:Object.keys(m.por).length};
}
function aplicar(m){
  Object.keys(m.por).forEach(function(k){var r=m.por[k],i=+k;
    if(r.C){if(!seen.has(i))seen.add(i);watching.delete(i);dropLater(i)}
    else if(r.W){if(!seen.has(i)){watching.add(i);dropLater(i);if(r.ep>0){var t=epTotal(i);prog[i]=[t?Math.min(r.ep,t):r.ep,Math.floor(Date.now()/1000)]}}}
    else if(r.P){if(!seen.has(i)&&!watching.has(i))later.add(i)}
    if(r.nota>0&&!rate[i])rate[i]=Math.max(1,Math.min(5,Math.round(r.nota/2)));
  });
  saveSeen();saveWatch();saveLater();saveRate();saveProg();
  renderTabs();renderGrid(1);updateProg();
}
/* ---------- janela ---------- */
var ov=document.createElement("div");ov.className="overlay";ov.id="iov";
ov.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="it"><div class="mbody authbox"><button class="close" aria-label="Fechar" style="position:absolute;top:10px;right:12px">×</button><h2 id="it">Importar do MyAnimeList</h2><p class="note">Traga a sua lista de lá sem digitar nada. O arquivo é lido só no seu aparelho e não é enviado para lugar nenhum.</p><ol class="isteps"><li>No MyAnimeList, abra <a href="https://myanimelist.net/panel.php?go=export" target="_blank" rel="noopener">Exportar minha lista</a> e baixe o arquivo da lista de <b>animes</b> (termina em .xml.gz).</li><li>Escolha esse arquivo aqui:</li></ol><input type="file" id="ifile" accept=".xml,.gz,application/gzip,application/x-gzip,text/xml,application/xml"><div id="ires" aria-live="polite"></div></div></div>';
document.body.appendChild(ov);
var pend=null;
function fechar(){ov.classList.remove("open")}
function erro(t){$("ires").innerHTML='<p class="ierr"></p>';$("ires").firstChild.textContent=t}
function mostrar(m){
  var r=resumo(m);pend=m;
  var h='<p class="ires-t"><b>'+r.achados+'</b> dos '+m.total+' itens da sua lista foram encontrados no catálogo.</p>';
  h+='<ul class="ires-l"><li><b>'+r.c+'</b> vão para <b>Assistidos</b></li><li><b>'+r.w+'</b> para <b>Assistindo</b> (com o episódio em que você parou)</li><li><b>'+r.p+'</b> para <b>Assistir mais tarde</b></li><li><b>'+r.n+'</b> notas (a nota de 10 vira estrelas de 1 a 5)</li></ul>';
  h+='<p class="note">Nada do que você já marcou aqui é apagado. Temporadas diferentes viram um anime só.</p>';
  if(m.fora.length){h+='<details class="ires-f"><summary>'+m.fora.length+' não encontrados (nomes diferentes ou fora do catálogo)</summary><ul></ul></details>'}
  h+='<div class="ires-b"><button type="button" class="fav on" id="iok"'+(r.achados?"":" disabled")+'>Importar agora</button><button type="button" class="fav" id="icancel">Cancelar</button></div>';
  $("ires").innerHTML=h;
  var ul=$("ires").querySelector(".ires-f ul");
  if(ul)m.fora.slice(0,150).forEach(function(t){var li=document.createElement("li");li.textContent=t;ul.appendChild(li)});
  $("icancel").onclick=fechar;
  $("iok").onclick=function(){aplicar(pend);$("ires").innerHTML='<p class="ires-t">Pronto! Sua lista foi importada.</p><div class="ires-b"><button type="button" class="fav on" id="ifim">Ver minha lista</button></div>';$("ifim").onclick=function(){fechar();tab="Assistidos";lim=60;renderTabs();renderGrid(1)}};
}
$("ifile").addEventListener("change",function(e){
  var f=e.target.files&&e.target.files[0];if(!f)return;
  $("ires").textContent="Lendo o arquivo...";
  lerArquivo(f).then(function(txt){
    var lista=lerXml(txt);
    if(!lista.length)return erro("Não encontrei animes nesse arquivo. Confira se é a lista de animes (e não a de mangás).");
    mostrar(casar(lista));
  }).catch(function(err){
    erro(err&&err.message==="gz"?"Este navegador não abre arquivos .gz. Descompacte o arquivo e escolha o .xml.":"Não consegui ler esse arquivo. Use o arquivo exportado pelo MyAnimeList (.xml.gz ou .xml).");
  });
});
ov.addEventListener("click",function(e){if(e.target===ov||e.target.closest(".close"))fechar()});
document.addEventListener("keydown",function(e){if(e.key==="Escape")fechar()});
$("imp").addEventListener("click",function(){$("ifile").value="";$("ires").textContent="";ov.classList.add("open");var c=ov.querySelector(".close");if(c)c.focus()});
window.__importar={achar:achar,lerXml:lerXml,casar:casar,resumo:resumo};
})();
