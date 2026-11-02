/* ZANIME - Política de Privacidade (janela aberta pelos links com data-priv). Carrega depois do script.js. */
(function(){
"use strict";
var ATUALIZADO="1 de novembro de 2026";
var ov=document.createElement("div");ov.className="overlay";ov.id="pov";
ov.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="pt"><div class="mbody authbox priv"><button class="close" aria-label="Fechar" style="position:absolute;top:10px;right:12px">×</button><h2 id="pt">Política de Privacidade</h2><div id="pb"></div></div></div>';
document.body.appendChild(ov);
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function texto(){
  var c=window.AVG_CONFIG||{},quem=c.responsavel?esc(c.responsavel):"o responsável pelo projeto",
      contato=c.contato?'<p><b>Contato para assuntos de privacidade:</b> <a href="mailto:'+esc(c.contato)+'">'+esc(c.contato)+'</a></p>':"";
  return '<p class="note">Última atualização: '+ATUALIZADO+'</p>'+
  '<p>O ZANIME é um projeto pessoal, sem fins lucrativos, que ajuda você a descobrir animes. Esta página explica, em linguagem simples, quais dados ele usa e quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).</p>'+
  '<h3>Quem cuida dos seus dados</h3><p>O controlador dos dados é '+quem+'.</p>'+contato+
  '<h3>Sem criar conta</h3><p>Você pode usar o catálogo inteiro sem conta. Nesse caso, seus favoritos, assistidos, notas e o tema escolhido ficam <b>só no seu aparelho</b> (no armazenamento do navegador) e não são enviados para nós.</p>'+
  '<h3>Se você criar uma conta</h3><p>Guardamos:</p><ul>'+
  '<li>seu <b>e-mail</b> e sua <b>senha</b> (a senha é guardada de forma protegida pelo serviço de login, e nem o responsável consegue lê-la);</li>'+
  '<li>seu <b>perfil</b>, se você preencher: nome de exibição, texto "sobre você", anime favorito, cor do nome e avatar ou foto;</li>'+
  '<li>suas <b>marcações</b>: favoritos, assistidos, assistindo agora e notas.</li></ul>'+
  '<h3>Para que usamos</h3><p>Apenas para criar e manter sua conta, mostrar seu perfil e sincronizar suas marcações entre seus aparelhos. Não vendemos seus dados, não fazemos publicidade e não enviamos e-mails de divulgação. Os únicos e-mails são o de confirmação da conta e o de recuperação de senha.</p>'+
  '<h3>Base legal</h3><p>Usamos seus dados para prestar o serviço que você pediu ao criar a conta (LGPD, art. 7º, V) e, nos campos opcionais do perfil e na foto, com o seu consentimento (art. 7º, I), que você pode retirar a qualquer momento.</p>'+
  '<h3>Com quem os dados passam</h3><ul>'+
  '<li><b>Supabase</b>: guarda o login e o banco de dados, em servidores na região do Canadá. Isso é uma transferência internacional de dados feita para operar o serviço.</li>'+
  '<li><b>GitHub Pages</b>: hospeda o site.</li>'+
  '<li><b>Google Fonts</b>: entrega as fontes das letras, e por isso o Google recebe o endereço de IP de quem abre o site.</li>'+
  '<li><b>MyAnimeList</b>: de lá vêm os dados e, em alguns casos, as capas.</li>'+
  '<li><b>JustWatch, Google Tradutor e outros</b>: só recebem dados se você clicar em um link que leva até eles, e cada um tem a sua própria política.</li></ul>'+
  '<h3>Foto de perfil</h3><p>A foto que você envia fica num endereço público: quem tiver o link consegue ver a imagem. Por isso, não envie fotos de outras pessoas nem imagens que você não queira expor. Se preferir, escolha uma das capas de anime como avatar.</p>'+
  '<h3>Por quanto tempo</h3><p>Enquanto sua conta existir. Ao tocar em <b>Apagar conta</b>, no seu perfil, a conta, as marcações e a foto são excluídas.</p>'+
  '<h3>Seus direitos</h3><p>Pela LGPD (art. 18), você pode confirmar se tratamos seus dados, acessá-los, corrigi-los, pedir a exclusão, pedir a portabilidade e retirar o consentimento. Boa parte você mesmo faz no perfil: editar os dados, <b>baixar uma cópia em arquivo</b> ("Baixar meus dados") e apagar a conta. Para qualquer outro pedido, use o contato acima.</p>'+
  '<h3>Segurança</h3><p>A conexão com o site é criptografada (HTTPS) e o banco de dados tem regras que permitem a cada pessoa ver apenas os próprios dados. Nenhum sistema é 100% seguro, mas cuidamos para guardar o mínimo necessário.</p>'+
  '<h3>Armazenamento no aparelho</h3><p>O site usa o armazenamento do navegador para lembrar seu tema, suas marcações e, se você entrar, a sua sessão. Não usamos cookies de rastreamento nem ferramentas de análise de audiência.</p>'+
  '<h3>Crianças e adolescentes</h3><p>O ZANIME não é voltado a crianças menores de 12 anos. Quem tem menos de 18 anos deve criar conta com o conhecimento de um responsável.</p>'+
  '<h3>Mudanças</h3><p>Se esta política mudar, a data no topo será atualizada.</p>'+
  '<p class="note">Os nomes, as capas e as sinopses dos animes pertencem aos seus respectivos donos. O ZANIME não é afiliado ao MyAnimeList nem aos estúdios.</p>';
}
function open(){$("pb").innerHTML=texto();ov.classList.add("open");ov.scrollTop=0;var m=ov.querySelector(".modal");if(m)m.scrollTop=0;ov.querySelector(".close").focus()}
function $(i){return document.getElementById(i)}
function close(){ov.classList.remove("open")}
ov.addEventListener("click",function(e){if(e.target===ov||e.target.closest(".close"))close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&ov.classList.contains("open")){e.stopPropagation();close()}},true);
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("[data-priv]");if(!a)return;e.preventDefault();open()});
})();
