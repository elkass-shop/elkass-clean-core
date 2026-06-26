
async function load(){const local=localStorage.getItem("elkass85alpha");if(local)return JSON.parse(local);const r=await fetch("../data/store.json");return await r.json()}
function save(d){localStorage.setItem("elkass85alpha",JSON.stringify(d));alert("Zapisano lokalnie. Produkcyjny zapis będzie w Supabase.")}
async function homePage(){const d=await load();sections.innerHTML=d.homeSections.sort((a,b)=>a.order-b.order).map(s=>`<div class="admin-card"><b>${s.active?'🟢':'⚪'} ${s.title}</b><p>${s.id}</p><button onclick="toggle('${s.id}')">${s.active?'Ukryj':'Aktywuj'}</button></div>`).join("")}
async function toggle(id){const d=await load();const s=d.homeSections.find(x=>x.id===id);if(s){s.active=!s.active;save(d);homePage()}}
async function settingsPage(){const d=await load();theme.value=d.settings.theme;type.value=d.settings.typography;logo.value=d.settings.logoVariant;saveSettings.onclick=()=>{d.settings.theme=theme.value;d.settings.typography=type.value;d.settings.logoVariant=logo.value;save(d)}}
async function productPage(){const d=await load();productList.innerHTML=d.products.map(p=>`<div class="admin-card"><b>${p.name}</b><p>${p.category} · ${p.price}</p><a href="../product.html?id=${p.id}">Podgląd</a></div>`).join("")}
async function brandsPage(){const d=await load();brandList.innerHTML=d.brands.map(b=>`<div class="admin-card"><b>${b}</b><p>marka w pasku producentów</p></div>`).join("")}
async function reviewsPage(){const d=await load();reviewList.innerHTML=[...d.reviews.google,...d.reviews.local].map(r=>`<div class="admin-card"><b>★★★★★</b><p>${r}</p></div>`).join("")}
