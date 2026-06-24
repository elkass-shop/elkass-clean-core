
const Store = {
  data:null,
  async load(){
    if(this.data) return this.data;
    const local = localStorage.getItem("elkass8_store");
    if(local){ this.data = JSON.parse(local); return this.data; }
    const res = await fetch("data/store.json");
    this.data = await res.json();
    return this.data;
  },
  save(data){ this.data=data; localStorage.setItem("elkass8_store", JSON.stringify(data)); }
};
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
function esc(s){return String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));}
function param(n){return new URLSearchParams(location.search).get(n)}
function catUrl(id){return `category.html?cat=${encodeURIComponent(id)}`}
function prodUrl(id){return `product.html?id=${encodeURIComponent(id)}`}
function activeTheme(){return localStorage.getItem("elkass8_theme")||"standard"}
function setTheme(t){localStorage.setItem("elkass8_theme",t); document.body.classList.toggle("black",t==="black")}
function header(){return `<header class="topbar"><nav class="nav"><a class="logo" href="index.html">ELKASS<span>.</span></a><div class="navlinks"><a href="index.html">Start</a><a href="category.html?cat=rtv">RTV</a><a href="category.html?cat=agd">AGD</a><a href="category.html?cat=agd-zabudowa">AGD zabudowa</a><a href="admin/index.html" class="adminlink">Panel</a></div></nav></header>`}
function footer(){return `<footer class="footer"><b>ELKASS Olesno</b><p>RTV · AGD · Multimedia · Fachowe doradztwo · Lokalny sklep</p></footer>`}
async function init(){
  document.body.insertAdjacentHTML("afterbegin",header());
  document.body.insertAdjacentHTML("beforeend",footer());
  setTheme(activeTheme());
  const page=document.body.dataset.page;
  if(page==="home") renderHome(await Store.load());
  if(page==="category") renderCategory(await Store.load());
  if(page==="product") renderProduct(await Store.load());
}
function renderHome(data){
  const cats=data.categories.filter(c=>c.home&&c.active);
  const promos=data.products.filter(p=>p.promo&&p.active).slice(0,4);
  $("#app").innerHTML=`
  <section class="section hero"><div><h1>Elektronika w najlepszym wydaniu</h1><p>Premium lokalny sklep RTV/AGD. Proste kategorie, czytelne promocje i karty produktów gotowe do wydruku dla klienta.</p><div class="btnrow"><a class="btn" href="#promocje">Zobacz promocje</a><a class="btn dark" href="#kategorie">Kategorie</a></div></div><div class="hero-card"><strong>WoodyBoy Platform</strong><p>ELKASS działa jako pierwszy sklep na czystym rdzeniu WoodyBoy.</p><div class="stats"><div class="stat">25+ lat</div><div class="stat">Lokalnie</div><div class="stat">PDF produktu</div><div class="stat">Supabase ready</div></div></div></section>
  <section class="section modern"><div><h2>Nowoczesna elektronika dla Twojego domu</h2><p class="lead">Wybierz sprzęt z jasną specyfikacją, dostępnością i fachowym opisem. Bez chaosu znanego z dużych marketów.</p></div><div><a class="btn" href="#promocje">Zobacz promocje</a></div></section>
  <section class="section" id="promocje"><h2>Promocje i hity</h2><div class="promo-grid">${promos.map(p=>promoCard(p)).join("")}</div></section>
  <section class="section" id="kategorie"><h2>Oferta sklepu</h2><p class="lead">Najpopularniejsze kategorie</p><div class="grid">${cats.map(catCard).join("")}</div></section>
  <section class="section"><h2>Klienci najczęściej wybierają</h2><div class="grid">${cats.slice(0,6).map(catCard).join("")}</div></section>
  <section class="section modern"><div><h2>Dlaczego ELKASS?</h2><p class="lead">Lokalne doradztwo, szybki kontakt, możliwość odbioru, dostawa i pomoc po zakupie.</p></div><div class="benefits"><div class="benefit">🚚 Transport</div><div class="benefit">💳 Raty</div><div class="benefit">🧠 Doradztwo</div><div class="benefit">🛠️ Wsparcie</div></div></section>`
}
function promoCard(p){return `<a class="promo" href="${prodUrl(p.id)}"><span class="discount">${esc(p.discount||"Hit")}</span><img src="${esc(p.images?.[0]||"")}" alt="${esc(p.name)}"><b>${esc(p.name)}</b><div class="badge-row">${(p.promoBadges||[]).map(b=>`<span class="badge">${esc(b.icon)} ${esc(b.text)}</span>`).join("")}</div><div class="price"><strong>${esc(p.price)}</strong>${p.oldPrice?`<s>${esc(p.oldPrice)}</s>`:""}</div></a>`}
function catCard(c){return `<a class="cat" href="${catUrl(c.id)}"><span class="icon">${esc(c.icon)}</span><strong>${esc(c.name)}</strong><small>${esc(c.description)}</small><em>Zobacz więcej</em></a>`}
function renderCategory(data){
  const id=param("cat")||"rtv"; const cat=data.categories.find(c=>c.id===id)||data.categories[0];
  const children=(cat.children||[]).map(cid=>data.categories.find(c=>c.id===cid)).filter(Boolean);
  const products=data.products.filter(p=>p.active && p.category===cat.id);
  $("#app").innerHTML=`<section class="section"><h2>${esc(cat.icon)} ${esc(cat.name)}</h2><p class="lead">${esc(cat.description)}</p></section>
  ${children.length?`<section class="section"><h2>Podkategorie</h2><div class="grid">${children.map(catCard).join("")}</div></section>`:""}
  <section class="section"><h2>Produkty</h2>${products.length?`<div class="promo-grid">${products.map(promoCard).join("")}</div>`:`<p class="lead">Brak produktów w tej kategorii. Dodaj je w panelu lub przejdź do podkategorii.</p>`}</section>`
}
function renderProduct(data){
  const id=param("id")||data.products[0].id; const p=data.products.find(x=>x.id===id)||data.products[0];
  const comments=(data.comments[p.category]||data.comments.default).slice(0,3);
  $("#app").innerHTML=`<section class="section product-hero"><div class="gallery"><img id="mainImg" src="${esc(p.images?.[0])}" alt="${esc(p.name)}"></div><div class="info"><small>${esc(p.category)}</small><h1>${esc(p.name)}</h1><div class="price"><strong>${esc(p.price)}</strong>${p.oldPrice?`<s>${esc(p.oldPrice)}</s>`:""}</div><div class="chips">${(p.features||[]).slice(0,8).map(f=>`<span class="chip">✓ ${esc(f)}</span>`).join("")}</div><div class="btnrow"><a class="btn" href="tel:343582442">Zapytaj o produkt</a><button class="btn dark" onclick="window.print()">Drukuj / PDF</button></div></div></section>
  <section class="section"><h2>Opis produktu</h2><p class="lead">${esc(p.description)}</p></section>
  <section class="section"><h2>Korzyści zakupu w ELKASS</h2><div class="benefits"><div class="benefit">🚚 Szybki transport</div><div class="benefit">💳 Raty 0%</div><div class="benefit">🧠 Fachowe doradztwo</div><div class="benefit">🛠️ Wsparcie po zakupie</div></div></section>
  <section class="section"><h2>Parametry techniczne</h2><table class="spec">${Object.entries(p.specs||{}).map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table></section>
  <section class="section hide-print comments-section"><h2>Opinie klientów o produktach z tej kategorii</h2><div class="comments">${comments.map(c=>`<div class="comment"><div class="stars">★★★★★</div><p>${esc(c)}</p><b>Klient, okolice Olesna</b></div>`).join("")}</div></section>`
}
document.addEventListener("DOMContentLoaded",init);
