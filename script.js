/* ZANIME: código do site. Os dados ficam em dados.js e as imagens em imagens.js (carregados antes deste arquivo). */
const tabs=["Todos","Favoritos","Assistidos","Assistindo","Ação","Aventura","Comédia","Drama","Fantasia","Romance","Sci-Fi","Suspense","Terror","Esporte","Slice of Life","Mecha","Sobrenatural"];
let tab="Todos",query="",favs=new Set(),sortBy="az",fmt="",yr="",lim=60,minr=0,stt="",len="",gsel=[];
try{favs=new Set(JSON.parse(localStorage.getItem("favs")||"[]"))}catch(e){}
let seen=new Set();
try{seen=new Set(JSON.parse(localStorage.getItem("seen")||"[]"))}catch(e){}
const saveSeen=()=>{try{localStorage.setItem("seen",JSON.stringify([...seen]))}catch(e){}};
let watching=new Set(),rate={};
try{watching=new Set(JSON.parse(localStorage.getItem("watching")||"[]"));rate=JSON.parse(localStorage.getItem("rate")||"{}")}catch(e){}
const saveWatch=()=>{try{localStorage.setItem("watching",JSON.stringify([...watching]))}catch(e){}};
const saveRate=()=>{try{localStorage.setItem("rate",JSON.stringify(rate))}catch(e){}};
const dec=y=>y>=2020?"2020":y>=2010?"2010":y>=2000?"2000":y>=1990?"1990":"1980";
const saveFavs=()=>{try{localStorage.setItem("favs",JSON.stringify([...favs]))}catch(e){}};
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const $=id=>document.getElementById(id);

const extraOn=()=>!!(minr||stt||len||gsel.length);
function lenOk(a){const n=a.ep;if(a.f==="Filme"||typeof n!=="number"||n<1)return false;return len==="curto"?n<=13:len==="medio"?n>=14&&n<=26:n>=27}
function syncFilters(){const on=!!(extraOn()||fmt||yr);$("clr").hidden=!on;$("gcount").textContent=gsel.length?" ("+gsel.length+")":""}
// "Parecidos": pontua gêneros em comum (os mais raros valem mais), mesmo estúdio, mesmo formato, ano e nota próximos
const GN={};A.forEach(a=>a.g.forEach(g=>{GN[g]=(GN[g]||0)+1}));
function similares(i,n){const a=A[i];
return A.map((b,j)=>{if(j===i)return null;let s=0;
for(const g of a.g)if(b.g.includes(g))s+=Math.log(A.length/GN[g]);
if(!s)return null;
s/=Math.sqrt(a.g.length*b.g.length);
if(a.s&&b.s===a.s)s+=.8;if(a.f===b.f)s+=.5;
if(a.y&&b.y)s+=Math.max(0,1-Math.abs(a.y-b.y)/20)*.6;
if(a.mr&&b.mr)s+=Math.max(0,1-Math.abs(a.mr-b.mr)/2)*.4+(b.mr-7)*.08;
return{j,s}}).filter(Boolean).sort((x,y)=>y.s-x.s).slice(0,n)}
function similarHtml(i){const r=similares(i,8);
return r.length?`<div class="simgrid">${r.map(({j})=>{const b=A[j];return `<button class="sim" data-open="${j}"><div class="simc">${art(b)}</div><span class="simt">${b.t}</span><span class="sims">${b.y}${b.mr?" · ★ "+b.mr:""}</span></button>`}).join("")}</div>`:`<p class="note">Ainda não encontrei títulos parecidos.</p>`}
function list(){
const q=norm(query.trim());
return A.map((a,i)=>({a,i})).filter(({a,i})=>{
if(tab==="Favoritos"&&!favs.has(i))return false;
if(tab==="Assistidos"&&!seen.has(i))return false;
if(fmt&&a.f!==fmt)return false;
if(tab==="Assistindo"&&!watching.has(i))return false;
if(yr&&dec(a.y)!==yr)return false;
if(minr&&!(a.mr>=minr))return false;
if(stt&&a.stt!==stt)return false;
if(len&&!lenOk(a))return false;
if(gsel.length&&!gsel.every(g=>a.g.includes(g)))return false;
if(!["Todos","Favoritos","Assistidos","Assistindo"].includes(tab)&&!a.g.includes(tab))return false;
return !q||norm([a.t,a.s,a.sin,...a.g].join(" ")).includes(q);
});
}
const PAL={"Ação":["#FF5A36","#7A0E2E","#FFD23F"],"Aventura":["#14B8A6","#134E6B","#FFC857"],"Comédia":["#FFD23F","#FF6FAE","#6C5CE7"],"Drama":["#6C63FF","#1B1F5E","#F4A6C0"],"Fantasia":["#A855F7","#312E81","#67E8F9"],"Romance":["#FF8FB1","#B5179E","#FFE5EC"],"Sci-Fi":["#22D3EE","#0B1A4A","#F72585"],"Suspense":["#475569","#0F172A","#F43F5E"],"Terror":["#7F1D1D","#0A0A0F","#E5E7EB"],"Esporte":["#FB923C","#1D4ED8","#FEF3C7"],"Slice of Life":["#86EFAC","#38BDF8","#FDE68A"],"Mecha":["#94A3B8","#1E293B","#FB923C"],"Sobrenatural":["#8B5CF6","#064E3B","#A7F3D0"]};
function hsh(s){let n=2166136261;for(const c of s){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function artSvg(a){
if(typeof IMG!=="undefined"&&IMG[a.t])return `<img src="${IMG[a.t]}" alt="">`;
const r=rng(hsh(a.t)),g=a.g[0],p=PAL[g]||PAL["Aventura"],ac=a.g[1]&&PAL[a.g[1]]?PAL[a.g[1]][2]:p[2];
const R=(x,y)=>+(x+r()*(y-x)).toFixed(1),id="g"+hsh(a.t);
const sx=R(80,220),sy=R(80,170),sr=R(34,64);
let s=`<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs><rect width="300" height="400" fill="url(#${id})"/>`;
const sun=`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${p[2]}" opacity=".9"/>`;
const stars=n=>{let o="";for(let i=0;i<n;i++)o+=`<circle cx="${R(0,300)}" cy="${R(0,260)}" r="${R(.8,2.4)}" fill="#fff" opacity="${R(.4,.9)}"/>`;return o};
switch(g){
case"Ação":for(let i=0;i<20;i++){const t=i/20*6.283;s+=`<path d="M${sx} ${sy}L${sx+Math.cos(t)*500} ${sy+Math.sin(t)*500}L${sx+Math.cos(t+.1)*500} ${sy+Math.sin(t+.1)*500}Z" fill="${p[2]}" opacity=".18"/>`}s+=sun;break;
case"Aventura":s+=sun;for(let k=0;k<3;k++){let d=`M0 400V${R(250,300)}`;for(let x=40;x<=300;x+=R(40,70))d+=`L${x} ${R(200+k*35,270+k*30)}`;s+=`<path d="${d}L300 400Z" fill="${p[1]}" opacity="${.3+k*.25}"/>`}break;
case"Comédia":s+=sun;for(let i=0;i<26;i++){const c=[p[1],ac,"#fff",p[2]][i%4],x=R(0,300),y=R(0,400);s+=i%3?`<circle cx="${x}" cy="${y}" r="${R(5,18)}" fill="${c}" opacity=".75"/>`:`<rect x="${x}" y="${y}" width="${R(10,22)}" height="${R(6,12)}" rx="3" fill="${c}" opacity=".75" transform="rotate(${R(0,180)} ${x} ${y})"/>`}break;
case"Drama":s+=sun;for(let i=0;i<30;i++){const x=R(-20,320),y=R(0,380);s+=`<path d="M${x} ${y}l-14 ${R(30,60)}" stroke="#fff" stroke-width="1.4" opacity=".22"/>`}break;
case"Fantasia":s+=stars(30)+sun;for(let k=0;k<3;k++){const x=R(30,250),h=R(50,110);s+=`<path d="M${x} 400L${x+14} ${400-h}L${x+28} 400Z" fill="${ac}" opacity=".5"/>`}break;
case"Romance":s+=sun;for(let i=0;i<16;i++){const x=R(0,300),y=R(0,400);s+=`<ellipse cx="${x}" cy="${y}" rx="7" ry="14" fill="${i%2?"#fff":p[2]}" opacity="${R(.4,.8)}" transform="rotate(${R(0,180)} ${x} ${y})"/>`}break;
case"Sci-Fi":s+=stars(40)+sun+`<ellipse cx="${sx}" cy="${sy}" rx="${sr*1.7}" ry="${sr*.35}" fill="none" stroke="${ac}" stroke-width="3" transform="rotate(-18 ${sx} ${sy})"/>`;for(let i=1;i<9;i++)s+=`<path d="M0 ${300+i*i*1.8+i*6}H300" stroke="${p[0]}" opacity=".5"/>`;for(let i=-6;i<=6;i++)s+=`<path d="M${150+i*12} 300L${150+i*60} 400" stroke="${p[0]}" opacity=".4"/>`;break;
case"Suspense":for(let y=0;y<400;y+=24)s+=`<rect y="${y}" width="300" height="9" fill="#fff" opacity=".1"/>`;s+=`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="none" stroke="${p[2]}" stroke-width="6"/><circle cx="${sx}" cy="${sy}" r="${sr*.38}" fill="${p[2]}"/>`;break;
case"Terror":s+=sun;for(let i=0;i<14;i++)s+=`<path d="M${R(0,300)} 0V${R(40,200)}" stroke="#B91C1C" stroke-width="${R(2,5)}" opacity=".6"/>`;{let d="M0 400V340";for(let x=0;x<=300;x+=20)d+=`L${x+10} ${R(300,350)}L${x+20} 345`;s+=`<path d="${d}V400Z" fill="#000" opacity=".6"/>`}break;
case"Esporte":for(let i=1;i<6;i++)s+=`<circle cx="${sx}" cy="${sy}" r="${sr+i*22}" fill="none" stroke="${p[2]}" stroke-width="3" opacity="${.5-i*.07}"/>`;s+=sun;for(let i=0;i<3;i++)s+=`<path d="M${-40+i*110} 400L${60+i*110} 220L${90+i*110} 220L${-10+i*110} 400Z" fill="#fff" opacity=".12"/>`;break;
case"Slice of Life":s+=sun;for(let i=0;i<3;i++)s+=`<circle cx="${R(20,280)}" cy="${R(40,200)}" r="${R(14,26)}" fill="#fff" opacity=".55"/>`;for(let k=0;k<2;k++)s+=`<ellipse cx="${R(60,240)}" cy="380" rx="${R(150,210)}" ry="${R(70,110)}" fill="${k?p[0]:ac}" opacity=".55"/>`;break;
case"Mecha":s+=sun;for(let i=0;i<7;i++){const x=R(0,260),y=R(0,340),w=R(30,90),h=R(20,70);s+=`<path d="M${x} ${y}h${w}l${R(8,20)} ${h}h-${w}z" fill="${i%2?p[2]:"#fff"}" opacity=".16"/>`}for(let i=0;i<5;i++)s+=`<path d="M0 ${R(0,400)}H300" stroke="${p[2]}" opacity=".3"/>`;break;
default:s+=sun+stars(14);for(let i=0;i<6;i++)s+=`<path d="M${R(0,300)} 400C${R(0,300)} ${R(200,330)} ${R(0,300)} ${R(100,250)} ${R(0,300)} 0" fill="none" stroke="${i%2?ac:"#fff"}" stroke-width="2.5" opacity=".4"/>`;
}
return s+`<text x="150" y="300" text-anchor="middle" font-family="Dela Gothic One,Zen Maru Gothic,sans-serif" font-size="140" fill="#fff" opacity=".93" stroke="rgba(0,0,0,.25)" stroke-width="6" style="paint-order:stroke">${a.k}</text></svg>`}
const EYE=`<svg class="e-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg><svg class="e-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.9 17.9A10.9 10.9 0 0112 19C5 19 1 12 1 12a18.5 18.5 0 015.1-5.9M9.9 5.1A10.9 10.9 0 0112 5c7 0 11 7 11 7a18.5 18.5 0 01-2.2 3.2M1 1l22 22"/></svg>`;
function epTxt(a){if(a.f==="Filme")return"1 filme";const n=a.ep;return !n?"":typeof n==="number"?`${n} ${n===1?"episódio":"episódios"}`:n}
// capa: 1) arquivo da pasta capas/  2) imagem embutida (imagens.js)  3) imagem do MyAnimeList  4) desenho gerado por código
function capaSrc(t){const f=typeof CAPA!=="undefined"&&CAPA[t];return f?"capas/"+f:(typeof IMG!=="undefined"&&IMG[t])||""}
function art(a){const s=capaSrc(a.t);if(s)return `<img src="${s}" alt="" loading="lazy" decoding="async" data-k="${a.id}">`;return a.img?`<img src="${a.img}" alt="" loading="lazy" referrerpolicy="no-referrer" data-k="${a.id}">`:artSvg(a)}
document.addEventListener("error",e=>{const t=e.target;if(t&&t.tagName==="IMG"&&t.dataset&&t.dataset.k!==undefined)t.outerHTML=artSvg(A[+t.dataset.k])},true);
const cardH=({a,i})=>`<div class="cardw${seen.has(i)?" seen":""}${watching.has(i)?" watching":""}" data-w="${i}"><button class="card" data-i="${i}"><div class="cover">${art(a)}<small>${a.f}</small>${a.mr?`<em class="mal">★ ${a.mr}</em>`:""}</div><div class="info"><h3>${a.t}</h3><p>${a.g.join(", ")} · ${a.y}${rate[i]?" · ★ "+rate[i]:""}</p></div></button><span class="badge">Assistido</span><span class="wbadge">Assistindo</span><button class="eye" data-seen="${i}" aria-pressed="${seen.has(i)}" aria-label="Marcar ${a.t} como assistido" title="Marcar como assistido">${EYE}</button></div>`;
function renderTabs(){
$("tabs").innerHTML=tabs.map(n=>`<button class="tab" role="tab" aria-selected="${n===tab}" data-t="${n}" style="--c:${n==="Todos"?"#FFD23F":n==="Favoritos"?"#FF8FB1":n==="Assistidos"?"#34D399":n==="Assistindo"?"#FBBF24":PAL[n][0]}"><i></i>${n}${n==="Favoritos"?" ("+favs.size+")":n==="Assistidos"?" ("+seen.size+")":n==="Assistindo"?" ("+watching.size+")":""}</button>`).join("");
}
function renderGrid(anim){syncFilters();const showF=tab==="Todos"&&!query.trim()&&!fmt&&!yr&&!extraOn();$("feat").hidden=!showF;if(showF)renderRow();$("grid").classList.toggle("anim",!!anim);
const r=list();
$("count").textContent=r.length+(r.length===1?" anime encontrado":" animes encontrados");
if(!r.length){$("grid").innerHTML=`<div class="empty">${tab==="Assistindo"&&!query?"Nenhum anime marcado como assistindo. Abra um anime e toque em Estou assistindo.":tab==="Assistidos"&&!query?"Nenhum anime marcado como assistido. Toque no olhinho de uma capa para marcar.":tab==="Favoritos"&&!query?"Você ainda não favoritou nada. Abra um anime e toque em Favoritar.":"Nada encontrado. Tente outro nome ou afrouxe os filtros."}</div>`;return}
const more=n=>n>lim?`<button class="more" data-more>Carregar mais (${n-lim} restantes)</button>`:"";
if(tab==="Todos"&&!query.trim()&&!sortBy&&!fmt&&!yr&&!extraOn()){
const f=r.filter(x=>x.a.sin),o=r.filter(x=>!x.a.sin);
$("grid").innerHTML=`<h2 class="sec">Destaques <small>com sinopse e guia completo</small></h2>`+f.map(cardH).join("")+`<h2 class="sec">Catálogo completo <small>${o.length} animes</small></h2>`+o.slice(0,lim).map(cardH).join("")+more(o.length);
}else{const s=srt(r);$("grid").innerHTML=s.slice(0,lim).map(cardH).join("")+more(s.length)}
}
function toggleSeen(i){seen.has(i)?seen.delete(i):seen.add(i);saveSeen();document.querySelectorAll(`[data-w="${i}"]`).forEach(w=>{w.classList.toggle("seen",seen.has(i));const ey=w.querySelector(".eye");ey.setAttribute("aria-pressed",seen.has(i));ey.classList.remove("pop");void ey.offsetWidth;ey.classList.add("pop")});renderTabs();updateProg();if(tab==="Assistidos")renderGrid()}
function renderRow(){const t=A.map((a,i)=>({a,i})).filter(x=>x.a.mr&&x.a.mp&&x.a.mp<4000).sort((x,y)=>y.a.mr-x.a.mr).slice(0,14);$("row").innerHTML=t.map(cardH).join("")}
let FEAT=[],hi=0;
function drawNav(){$("nav").innerHTML=[["home","Home"],["TV","Séries"],["Filme","Filmes"],["gen","Gêneros"]].map(([k,n])=>`<button data-nav="${k}" class="${(k==="home"&&!fmt)||k===fmt?"on":""}">${n}</button>`).join("")}
function drawHero(){const a=A[FEAT[hi]];if(!a)return;const tx=a.sin||a.syn||"";
const st=[a.mr?`★ ${a.mr}`:"",epTxt(a),a.mp&&a.mp<=200?`Popularidade #${a.mp}`:""].filter(Boolean);
const th=[0,1,2,3,4].map(k=>(hi+k)%FEAT.length).filter((k,j,r)=>r.indexOf(k)===j).map(k=>`<button class="hero-th${k===hi?" on":""}" data-hi="${k}" aria-label="${A[FEAT[k]].t}">${art(A[FEAT[k]])}</button>`).join("");
$("hero").innerHTML=`<div class="hero-bg">${art(a)}</div><div class="hero-in"><div class="hero-txt"><span class="hero-meta">${a.f==="Filme"?"Filme":"Série"} · ${a.g[0]} · ${a.y}</span><h2>${a.t}</h2><p>${tx.length>230?tx.slice(0,230).replace(/\s\S*$/,"")+"…":tx}</p><div class="hero-st">${st.map(x=>`<span>${x}</span>`).join("")}</div><div class="hero-btns"><button class="hbtn" data-hero="${a.id}">Ver detalhes</button><button class="hbtn ghost" data-herow="${a.id}">${watching.has(a.id)?"✓ Assistindo":"+ Assistindo"}</button></div></div><div class="hero-cover">${art(a)}</div></div><div class="hero-bot"><span class="hero-lbl">Em alta</span><div class="hero-ths">${th}</div><div class="hero-arr"><button data-heroprev aria-label="Anterior">‹</button><button class="on" data-heronext aria-label="Próximo">›</button></div></div>`}
function srt(r){const s=sortBy;if(s==="az")r.sort((x,y)=>x.a.t.localeCompare(y.a.t,"pt"));else if(s==="new")r.sort((x,y)=>y.a.y-x.a.y);else if(s==="old")r.sort((x,y)=>x.a.y-y.a.y);else if(s==="mal")r.sort((x,y)=>(y.a.mr||0)-(x.a.mr||0));else if(s==="rate")r.sort((x,y)=>(rate[y.i]||0)-(rate[x.i]||0));else if(s==="unseen")r.sort((x,y)=>seen.has(x.i)-seen.has(y.i));else r.sort((x,y)=>!!y.a.sin-!!x.a.sin);return r}
function updateProg(){const pc=Math.round(seen.size/A.length*100);$("bar").style.width=pc+"%";$("ptxt").textContent=`${seen.size} de ${A.length} assistidos (${pc}%)`}
let cur=null,mtab="sinopse";
function openModal(i){cur=i;mtab="sinopse";drawModal();$("ov").classList.add("open");$("modal").querySelector(".close").focus()}
function drawModal(){
const a=A[cur],on=favs.has(cur);
const mal=`https://myanimelist.net/search/all?q=${encodeURIComponent(a.t)}`;
const tags=`<div class="tags">${a.g.map(g=>`<span>${g}</span>`).join("")}</div>`;
const rows=[["Ano",a.y],["Estúdio",a.s],["Episódios",epTxt(a)],["Temporadas",a.se?`${a.se} ${a.se===1?"temporada":"temporadas"}`:""],["Situação",a.stt||""],["Duração por episódio",a.du||""],["Formato",a.f],["Nota no MyAnimeList",a.mr?"★ "+a.mr:""],["Ranking no MAL",a.mk?"#"+a.mk:""],["Popularidade",a.mp?"#"+a.mp:""]].filter(r=>r[1]);
const body={
sinopse:a.sin?`${tags}<p>${a.sin}</p><p><b>Clima:</b> ${a.vibe}</p>`:a.syn?`${tags}<p>${a.syn}</p>${a.tr?"":`<p class="note">Sinopse original em inglês, do MyAnimeList.</p><a class="btnlink" href="https://translate.google.com/?sl=en&tl=pt&op=translate&text=${encodeURIComponent(a.syn.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">"))}" target="_blank" rel="noopener">Traduzir para português</a>`}`:`${tags}<p>Este título ainda não tem sinopse escrita aqui. <a href="${mal}" target="_blank" rel="noopener" style="color:var(--accent)">Ver sinopse no MyAnimeList</a></p>`,
pra:a.pra?`<p><b>Pra quem é:</b> ${a.pra}</p><p><b>Por onde começar:</b> ${a.ini}</p>`:"",
similar:mtab==="similar"?similarHtml(cur):"",
onde:`<a class="btnlink" href="https://www.justwatch.com/br/busca?q=${encodeURIComponent(a.t)}" target="_blank" rel="noopener">Ver onde assistir ↗</a>`,
ficha:`<dl>${rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join("")}</dl>${CUR[a.t]||a.f==="Filme"?"":`<p class="note" style="margin-top:12px">Os números do MyAnimeList valem para a obra listada. Séries com várias temporadas podem ter mais episódios no total.</p>`}`
}[mtab];
const mt=[["sinopse","Sinopse"],...(a.pra?[["pra","Vale a pena?"]]:[]),["similar","Parecidos"],["onde","Onde assistir"],["ficha","Ficha"]];
$("modal").innerHTML=`<div class="mhead">${art(a)}<button class="close" aria-label="Fechar">×</button><h2 id="mt">${a.t}</h2></div><div class="mbody"><div class="mtabs" role="tablist">${mt.map(([k,n])=>`<button class="mtab" role="tab" aria-selected="${k===mtab}" data-m="${k}">${n}</button>`).join("")}</div>${body}${[1,2,3,4,5].length?`<div class="stars" role="group" aria-label="Sua nota">${[1,2,3,4,5].map(n=>`<button class="star${(rate[cur]||0)>=n?" on":""}" data-star="${n}" aria-label="${n} estrelas">★</button>`).join("")}</div>`:""}<button class="fav ${watching.has(cur)?"on":""}" data-watching>${watching.has(cur)?"Assistindo agora":"Estou assistindo"}</button> <button class="fav seenb ${seen.has(cur)?"on":""}" data-seenm aria-pressed="${seen.has(cur)}">${seen.has(cur)?"Assistido":"Marcar como assistido"}</button> <button class="fav ${on?"on":""}" data-fav aria-pressed="${on}">${on?"Favoritado":"Favoritar"}</button></div>`;
}
function closeModal(){$("ov").classList.remove("open")}

$("q").addEventListener("input",e=>{query=e.target.value;lim=60;renderGrid(1)});
$("tabs").addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(!b)return;tab=b.dataset.t;lim=60;renderTabs();renderGrid(1)});
$("grid").addEventListener("click",e=>{if(e.target.closest("[data-more]")){lim+=60;renderGrid(1);return}const s=e.target.closest("[data-seen]");if(s)return toggleSeen(+s.dataset.seen);const c=e.target.closest("[data-i]");if(c)openModal(+c.dataset.i)});
$("ov").addEventListener("click",e=>{
if(e.target===$("ov")||e.target.closest(".close"))return closeModal();
const so=e.target.closest("[data-open]");if(so){cur=+so.dataset.open;mtab="similar";drawModal();$("ov").scrollTop=0;$("modal").scrollTop=0;return}
const m=e.target.closest("[data-m]");if(m){mtab=m.dataset.m;drawModal();return}
const st=e.target.closest("[data-star]");if(st){const n=+st.dataset.star;rate[cur]===n?delete rate[cur]:rate[cur]=n;saveRate();drawModal();renderGrid();return}
if(e.target.closest("[data-watching]")){watching.has(cur)?watching.delete(cur):watching.add(cur);saveWatch();drawModal();renderTabs();renderGrid();return}
if(e.target.closest("[data-seenm]")){toggleSeen(cur);drawModal();return}
if(e.target.closest("[data-fav]")){favs.has(cur)?favs.delete(cur):favs.add(cur);saveFavs();drawModal();renderTabs();renderGrid()}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("ns").textContent=A.length;
$("enter").onclick=()=>{document.documentElement.classList.remove("intro");$("welcome").classList.add("out");wt=setTimeout(()=>{$("welcome").style.display="none"},550)};
$("sort").onchange=e=>{sortBy=e.target.value;lim=60;renderGrid(1)};
$("fmt").onchange=e=>{fmt=e.target.value;lim=60;renderGrid(1);drawNav()};
$("yr").onchange=e=>{yr=e.target.value;lim=60;renderGrid(1)};
$("minr").onchange=e=>{minr=+e.target.value||0;lim=60;renderGrid(1)};
$("stt").onchange=e=>{stt=e.target.value;lim=60;renderGrid(1)};
$("len").onchange=e=>{len=e.target.value;lim=60;renderGrid(1)};
$("clr").onclick=()=>{minr=0;stt="";len="";gsel=[];fmt="";yr="";["minr","stt","len","fmt","yr"].forEach(k=>{$(k).value=""});lim=60;renderGrid(1);drawNav()};
const setTheme=t=>{document.documentElement.dataset.theme=t;$("th").checked=t==="light";try{localStorage.setItem("theme",t)}catch(e){}};
$("th").onchange=()=>setTheme($("th").checked?"light":"dark");
let th0="dark";try{th0=localStorage.getItem("theme")||"dark"}catch(e){}setTheme(th0);
let wt;
if(typeof window!=="undefined"){window.addEventListener("scroll",()=>$("up").classList.toggle("show",window.scrollY>700),{passive:true});$("up").onclick=()=>window.scrollTo({top:0,behavior:"smooth"})}
$("rnd").onclick=()=>{const r=list(),p=r.filter(x=>!seen.has(x.i)),c=p.length?p:r;if(c.length)openModal(c[Math.floor(Math.random()*c.length)].i)};
FEAT=A.filter(a=>a.sin).map(a=>a.id);hi=Math.floor(Math.random()*FEAT.length);drawHero();drawNav();
if(typeof matchMedia!=="function"||!matchMedia("(prefers-reduced-motion:reduce)").matches)setInterval(()=>{if(!document.hidden&&!$("hero").matches(":hover")){hi=(hi+1)%FEAT.length;drawHero()}},8000);
$("hero").addEventListener("click",e=>{const g=e.target.closest("[data-hero]");if(g)return openModal(+g.dataset.hero);const w=e.target.closest("[data-herow]");if(w){const i=+w.dataset.herow;watching.has(i)?watching.delete(i):watching.add(i);saveWatch();drawHero();renderTabs();renderGrid();return}const t=e.target.closest("[data-hi]");if(t){hi=+t.dataset.hi;drawHero();return}if(e.target.closest("[data-heronext]")){hi=(hi+1)%FEAT.length;drawHero()}else if(e.target.closest("[data-heroprev]")){hi=(hi-1+FEAT.length)%FEAT.length;drawHero()}});
$("nav").addEventListener("click",e=>{const b=e.target.closest("[data-nav]");if(!b)return;const v=b.dataset.nav;if(v==="gen"){if($("tabs").scrollIntoView)$("tabs").scrollIntoView({behavior:"smooth",block:"center"});return}fmt=v==="home"?"":v;$("fmt").value=fmt;tab="Todos";lim=60;renderTabs();renderGrid(1);drawNav()});
$("row").addEventListener("click",e=>{const s=e.target.closest("[data-seen]");if(s)return toggleSeen(+s.dataset.seen);const c=e.target.closest("[data-i]");if(c)openModal(+c.dataset.i)});
$("home").onclick=()=>{document.documentElement.classList.add("intro");const w=$("welcome");w.classList.add("out");w.style.display="grid";void w.offsetWidth;w.classList.remove("out");$("enter").focus();if(typeof scrollTo==="function")scrollTo(0,0)};
(function(){const R=rng(11),pal=["#17204f","#1c2a66","#22307a","#2a2f5e","#3a2f5e","#7a3b5e","#2d6a8f","#b88a3d","#1a3a5c"];let b="";
[[118,222,310],[118,342,310],[118,462,310],[1236,190,260],[1236,300,260]].forEach(([x0,y,w])=>{let x=x0;while(x<x0+w-14){const bw=8+R()*9,bh=34+R()*46;b+=`<rect x="${x.toFixed(1)}" y="${(y-bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${pal[Math.floor(R()*pal.length)]}"/>`;x+=bw+1.5}});
$("books").innerHTML=b;let s="";for(let i=0;i<16;i++)s+=`<circle class="tw" cx="${(666+R()*268).toFixed(0)}" cy="${(196+R()*110).toFixed(0)}" r="${(.8+R()*1.4).toFixed(1)}" fill="#fff" style="animation-delay:${(R()*4).toFixed(1)}s"/>`;$("stars").innerHTML=s;
let d="";for(let i=0;i<26;i++)d+=`<circle class="dust" cx="${(R()*1600).toFixed(0)}" cy="${(300+R()*500).toFixed(0)}" r="${(1+R()*2).toFixed(1)}" fill="#cfe0ff" style="animation-duration:${(10+R()*14).toFixed(0)}s;animation-delay:-${(R()*20).toFixed(0)}s"/>`;$("dust").innerHTML=d})();
if(document.querySelectorAll)document.querySelectorAll(".w-go").forEach(b=>b.onclick=$("enter").onclick);
if(typeof window!=="undefined"&&!(typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion:reduce)").matches))$("welcome").addEventListener("pointermove",e=>{$("scene").style.transform=`scale(1.06) translate(${(e.clientX/innerWidth-.5)*-16}px,${(e.clientY/innerHeight-.5)*-9}px)`});
renderTabs();renderGrid();updateProg();$("enter").focus();
