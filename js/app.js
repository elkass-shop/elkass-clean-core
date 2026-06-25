
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
const param=n=>new URLSearchParams(location.search).get(n);
const catUrl=id=>`category.html?cat=${encodeURIComponent(id)}`;
const prodUrl=id=>`product.html?id=${encodeURIComponent(id)}`;

const Store={
  data:null,
  async load(){
    if(this.data) return this.data;
    const local=localStorage.getItem("elkass81_store");
    if(local){ this.data=JSON.parse(local); return this.data; }
    const r=await fetch("data/store.json");
    this.data=await r.json();
    return this.data;
  },
  save(d){this.data=d;localStorage.setItem("elkass81_store",JSON.stringify(d));}
};

function header(d){return `<header class="topbar"><div class="container nav"><a class="logo" href="index.html">ELKASS<span>.</span><small>${esc(d.project.tagline)}</small></a><div class="navlinks"><a href="index.html">Start</a><a href="category.html?cat=rtv">RTV</a><a href="category.html?cat=agd">AGD</a><a href="category.html?cat=agd-zabudowa">AGD zabudowa</a><a href="#kontakt">Kontakt</a><a class="adminlink" href="admin/index.html">Panel</a><a class="phone" href="tel:${esc(d.project.phone).replaceAll(' ','')}">☎ ${esc(d.project.phone)}</a></div></div></header>`}
function footer(d){return `<footer class="footer" id="kontakt"><div class="container"><div><b>${esc(d.project.name)}</b><p>${esc(d.project.tagline)}</p></div><div><b>Kontakt</b><p>☎ ${esc(d.project.phone)}<br>${esc(d.project.address)}</p></div><div><b>WoodyBoy Platform</b><p>Silnik nadrzędny dla sklepów, stron i modułów.</p></div></div></footer>`}
async function boot(){
  const d=await Store.load();
  if(!document.body.classList.contains("admin-shell")){
    document.body.insertAdjacentHTML("afterbegin",header(d));
    document.body.insertAdjacentHTML("beforeend",footer(d));
  }
  const p=document.body.dataset.page;
  if(p==="home") renderHome(d);
  if(p==="category") renderCategory(d);
  if(p==="product") renderProduct(d);
}

function sectionActive(d,id){const s=(d.homeSections||[]).find(x=>x.id===id); return !s || s.active!==false;}
function renderHome(d){
  const cats=d.categories.filter(c=>c.home&&c.active);
  const promos=d.products.filter(p=>p.promo&&p.active).slice(0,4);
  const featured=d.products.filter(p=>p.featured&&p.active&&!p.promo).concat(d.products.filter(p=>p.featured&&p.active&&p.promo)).slice(0,6);
  let html="";
  if(sectionActive(d,"hero")) html+=`<section class="container hero"><div><span class="kicker">ELKASS Premium RTV/AGD</span><h1>Elektronika w najlepszym wydaniu</h1><p>Nowoczesny lokalny sklep RTV/AGD. Mniej chaosu niż w dużych sieciach, więcej doradztwa, prostoty i czytelnych kart produktów.</p><div class="btnrow"><a class="btn" href="#promocje">Zobacz promocje</a><a class="btn ghost" href="#kategorie">Oferta sklepu</a></div></div><div class="hero-card"><b>WoodyBoy Platform</b><p>ELKASS działa jako pierwszy sklep na czystym silniku: jeden routing, jeden panel, jeden system rozwoju.</p><div class="stats"><div class="stat">Produkty</div><div class="stat">Kategorie</div><div class="stat">PDF</div><div class="stat">Supabase Ready</div></div></div></section>`;
  if(sectionActive(d,"modern")) html+=`<section class="container section modern"><div><h2>Nowoczesna elektronika dla Twojego domu</h2><p class="lead">Strona ułożona tak, aby klient szybko trafił do kategorii, promocji, produktu albo kontaktu ze sklepem.</p></div><div><a class="btn" href="#promocje">Sprawdź aktualne promocje</a></div></section>`;
  if(sectionActive(d,"promotions")) html+=`<section class="container section" id="promocje"><h2>Promocje i hity</h2><p class="lead">Cztery eleganckie kafle zamiast jednego ogromnego bloku.</p><div class="promo-grid">${promos.map(productCard).join("")}</div></section>`;
  if(sectionActive(d,"manufacturer")) html+=`<section class="container section"><h2>Promocje producentów</h2><p class="lead">Karuzela marek i ofert producentów — fundament Home Buildera.</p><div class="carousel-row">${(d.manufacturers||[]).filter(x=>x.active).map(m=>`<div class="brand-card"><strong>${esc(m.name)}</strong><small>${esc(m.badge)}</small><p class="lead">Baner producenta / oferta specjalna</p></div>`).join("")}</div></section>`;
  if(sectionActive(d,"categories")) html+=`<section class="container section" id="kategorie"><h2>Oferta sklepu</h2><p class="lead">Najpopularniejsze kategorie i szybkie przejście do podkategorii.</p><div class="grid">${cats.map(catCard).join("")}</div></section>`;
  if(sectionActive(d,"featured")) html+=`<section class="container section"><h2>Najczęściej wybierane</h2><p class="lead">Produkty i kategorie, o które klienci najczęściej pytają w sklepie.</p><div class="promo-grid">${featured.slice(0,4).map(productCard).join("")}</div></section>`;
  if(sectionActive(d,"why")) html+=`<section class="container section modern"><div><h2>Dlaczego warto kupić w ELKASS?</h2><p class="lead">Lokalne doradztwo, jasna informacja o dostępności, transport, raty i pomoc po zakupie.</p></div><div class="benefits"><div class="benefit">🚚 Szybki transport</div><div class="benefit">💳 Raty 0%</div><div class="benefit">🧠 Fachowe doradztwo</div><div class="benefit">🛠️ Wsparcie</div></div></section>`;
  if(sectionActive(d,"opinions")) html+=`<section class="container section comments-section"><h2>Opinie klientów</h2><p class="lead">Losowe opinie kategorii i produktów — docelowo zarządzane z panelu.</p><div class="comments">${(d.comments.default||[]).slice(0,3).map(c=>`<div class="comment"><div class="stars">★★★★★</div><p>${esc(c)}</p><b>Klient ELKASS</b></div>`).join("")}</div></section>`;
  $("#app").innerHTML=html;
}
function catCard(c){return `<a class="cat" href="${catUrl(c.id)}"><span class="icon">${esc(c.icon)}</span><strong>${esc(c.name)}</strong><small>${esc(c.description)}</small><em>Zobacz więcej</em></a>`}
function productCard(p){return `<a class="promo" href="${prodUrl(p.id)}"><span class="discount">${esc(p.discount||p.promoType||"Oferta")}</span><img src="${esc(p.media?.promo||p.images?.[0]||"")}" alt="${esc(p.name)}"><b>${esc(p.name)}</b><div class="badges">${(p.badges||[]).slice(0,4).map(b=>`<span class="badge">✨ ${esc(b)}</span>`).join("")}</div><div class="price"><strong>${esc(p.price)}</strong>${p.oldPrice?`<s>${esc(p.oldPrice)}</s>`:""}</div><small class="stock">● ${p.stock>0?`Dostępny (${p.stock} szt.)`:"Zapytaj o dostępność"}</small></a>`}

function renderCategory(d){
  const id=param("cat")||"rtv";
  const c=d.categories.find(x=>x.id===id)||d.categories[0];
  const children=(c.children||[]).map(cid=>d.categories.find(x=>x.id===cid)).filter(Boolean);
  const products=d.products.filter(p=>p.active&&p.category===c.id);
  $("#app").innerHTML=`<section class="container section"><span class="kicker">Oferta sklepu</span><h2>${esc(c.icon)} ${esc(c.name)}</h2><p class="lead">${esc(c.description)}</p></section>${children.length?`<section class="container section"><h2>Podkategorie</h2><div class="grid">${children.map(catCard).join("")}</div></section>`:""}<section class="container section"><h2>Produkty</h2>${products.length?`<div class="promo-grid">${products.map(productCard).join("")}</div>`:`<p class="lead">Brak produktów w tej kategorii. Wybierz podkategorię albo dodaj produkt w panelu.</p>`}</section>`;
}

function renderProduct(d){
  const id=param("id")||d.products[0].id;
  const p=d.products.find(x=>x.id===id)||d.products[0];
  const comments=(d.comments[p.category]||d.comments.default||[]).slice(0,3);
  $("#app").innerHTML=`<section class="container section product-hero"><div class="gallery"><img src="${esc(p.media?.main||p.images?.[0])}" alt="${esc(p.name)}"></div><div class="info"><span class="kicker">${esc(p.category)}</span><h1>${esc(p.name)}</h1><div class="price"><strong>${esc(p.price)}</strong>${p.oldPrice?`<s>${esc(p.oldPrice)}</s>`:""}</div><div class="chips">${(p.features||[]).slice(0,8).map(f=>`<span class="chip">✓ ${esc(f)}</span>`).join("")}</div><div class="btnrow hide-print"><a class="btn" href="tel:${d.project.phone.replaceAll(' ','')}">Zapytaj o produkt</a><button class="btn dark" onclick="window.print()">Drukuj / PDF</button></div></div></section><section class="container section"><h2>Opis produktu</h2><p class="lead">${esc(p.description)}</p></section><section class="container section"><h2>Porada specjalisty ELKASS</h2><div class="advisor">${esc(p.advisor||"Zapytaj doradcę ELKASS, czy ten model będzie dobry do Twojego domu.")}</div></section><section class="container section"><h2>Korzyści zakupu w ELKASS</h2><div class="benefits"><div class="benefit">🚚 Szybki transport</div><div class="benefit">💳 Raty 0%</div><div class="benefit">🧠 Fachowe doradztwo</div><div class="benefit">🛠️ Wsparcie po zakupie</div></div></section><section class="container section"><h2>Parametry techniczne</h2><table class="spec">${Object.entries(p.specs||{}).map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table></section><section class="container section comments-section"><h2>Opinie klientów o produktach z tej kategorii</h2><div class="comments">${comments.map(c=>`<div class="comment"><div class="stars">★★★★★</div><p>${esc(c)}</p><b>Klient, okolice Olesna</b></div>`).join("")}</div></section>`;
}

document.addEventListener("DOMContentLoaded",boot);
