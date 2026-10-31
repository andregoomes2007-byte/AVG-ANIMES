/* ANIHUB - partículas flutuantes na tela de boas-vindas. Carrega depois do script.js. */
(function(){
"use strict";
var w=document.getElementById("welcome"),cv=document.getElementById("wfx");
if(!w||!cv||!cv.getContext)return;
var cx=cv.getContext("2d");if(!cx)return;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches,
    ps=[],W=0,H=0,raf=0,COL=["255,244,220","255,226,176","215,230,255"];
function mk(init){return{x:Math.random()*W,y:init?Math.random()*H:H+10,r:.6+Math.random()*1.7,vy:.08+Math.random()*.22,
  sw:Math.random()*6.28,sp:.3+Math.random()*.8,a:.25+Math.random()*.55,c:COL[(Math.random()*COL.length)|0]}}
function size(){var d=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;
  cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
  var n=Math.round(Math.min(45,Math.max(18,W*H/26000)));while(ps.length<n)ps.push(mk(true));ps.length=n}
function draw(t){cx.clearRect(0,0,W,H);
  for(var i=0;i<ps.length;i++){var p=ps[i];
    if(!reduce){p.y-=p.vy;p.x+=Math.sin(t/1000*p.sp+p.sw)*.18;if(p.y<-10)ps[i]=p=mk(false)}
    var tw=.6+.4*Math.sin(t/700*p.sp+p.sw);
    cx.beginPath();cx.fillStyle="rgba("+p.c+","+(p.a*tw).toFixed(3)+")";
    cx.shadowColor="rgba("+p.c+",.8)";cx.shadowBlur=p.r*5;cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}}
function loop(t){draw(t);raf=requestAnimationFrame(loop)}
function start(){if(reduce){size();draw(0);return}if(!raf){size();raf=requestAnimationFrame(loop)}}
function stop(){if(raf){cancelAnimationFrame(raf);raf=0}}
// só anima enquanto a tela de boas-vindas está aberta (economiza bateria no celular)
function sync(){var on=document.documentElement.classList.contains("intro")&&w.style.display!=="none";on?start():stop()}
new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
new MutationObserver(sync).observe(w,{attributes:true,attributeFilter:["style"]});
window.addEventListener("resize",function(){if(raf||reduce){size();if(reduce)draw(0)}});
document.addEventListener("visibilitychange",function(){document.hidden?stop():sync()});
// paralaxe suave: os elementos de fundo acompanham o mouse em velocidades diferentes
if(!reduce){var tx=0,ty=0,mx=0,my=0,pr=0;
  var step=function(){pr=0;mx+=(tx-mx)*.12;my+=(ty-my)*.12;w.style.setProperty("--mx",mx.toFixed(3));w.style.setProperty("--my",my.toFixed(3));
    if(Math.abs(tx-mx)>.002||Math.abs(ty-my)>.002)pr=requestAnimationFrame(step)};
  w.addEventListener("pointermove",function(e){tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;if(!pr)pr=requestAnimationFrame(step)})}
sync();
})();
