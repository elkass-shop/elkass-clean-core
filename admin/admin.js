
async function load(){const local=localStorage.getItem("elkass85_stage1");if(local)return JSON.parse(local);const r=await fetch("../data/store.json");return await r.json()}
function save(d){localStorage.setItem("elkass85_stage1",JSON.stringify(d));alert("Zapisano lokalnie. Produkcyjny zapis będzie w Supabase.")}
async function homePage(){const d=await load();sections.innerHTML=d.homeSections.map(s=>`<div class="admin-card"><b>${s.active?'🟢':'⚪'} ${s.id}</b><p>sekcja strony głównej</p><button onclick="toggle('${s.id}')">${s.active?'Ukryj':'Aktywuj'}</button></div>`).join("")}
async function toggle(id){const d=await load();const s=d.homeSections.find(x=>x.id===id);if(s){s.active=!s.active;save(d);homePage()}}
async function settingsPage(){const d=await load();theme.value=d.settings.theme;type.value=d.settings.typography;saveSettings.onclick=()=>{d.settings.theme=theme.value;d.settings.typography=type.value;save(d)}}
async function productPage(){const d=await load();productList.innerHTML=d.products.map(p=>`<div class="admin-card"><b>${p.name}</b><p>${p.category} · ${p.price}</p></div>`).join("")}
