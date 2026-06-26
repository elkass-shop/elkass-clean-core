
async function load(){
  const local=localStorage.getItem("elkass85beta");
  if(local) return JSON.parse(local);
  const r=await fetch("../data/store.json");
  return await r.json();
}
function save(d){
  localStorage.setItem("elkass85beta", JSON.stringify(d));
  alert("Zapisano lokalnie. W wersji produkcyjnej zapis przejdzie do Supabase.");
}
const slug=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ł/g,"l").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
function esc(s){return String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]))}
function parseProducer(raw){
  const specs={}, features=[], desc=[];
  String(raw||"").split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(line=>{
    const i=line.indexOf(":");
    if(i>0 && i<80){specs[line.slice(0,i).trim()]=line.slice(i+1).trim();return}
    const m=line.match(/^(.{3,55}?)\s[-–—]\s(.+)$/);
    if(m){features.push(m[1].trim());desc.push(m[1].trim()+": "+m[2].trim());return}
    desc.push(line);
  });
  return {specs, features, description:desc.join("\n\n")};
}
function autoBadges(text){
  const t=String(text||"").toLowerCase(), out=[];
  if(/smart|android|tizen/.test(t)) out.push("Smart TV");
  if(/hdr/.test(t)) out.push("HDR");
  if(/4k|uhd/.test(t)) out.push("4K UHD");
  if(/oled/.test(t)) out.push("OLED");
  if(/qled/.test(t)) out.push("QLED");
  if(/no frost|bezszron/.test(t)) out.push("No Frost");
  if(/air fry/.test(t)) out.push("Air Fry");
  if(/wifi|wi-fi/.test(t)) out.push("WiFi");
  if(/bluetooth/.test(t)) out.push("Bluetooth");
  if(/1200/.test(t)) out.push("1200 obr.");
  if(/8 kg|8kg/.test(t)) out.push("8 kg");
  if(/7 kg|7kg/.test(t)) out.push("7 kg");
  return [...new Set(out)];
}
async function dashboardPage(){
  const d=await load();
  stats.innerHTML = `
    <div class="admin-card"><b>${d.products.length}</b><p>produktów</p></div>
    <div class="admin-card"><b>${d.categories.length}</b><p>kategorii</p></div>
    <div class="admin-card"><b>${d.brands.length}</b><p>marek</p></div>
    <div class="admin-card"><b>${d.homeSections.filter(x=>x.active).length}</b><p>aktywnych sekcji</p></div>`;
}
async function homePage(){
  const d=await load();
  sections.innerHTML=d.homeSections.sort((a,b)=>a.order-b.order).map(s=>`
    <div class="admin-card">
      <b>${s.active?'🟢':'⚪'} ${esc(s.title)}</b>
      <p>${esc(s.id)} · kolejność ${s.order}</p>
      <button onclick="toggleSection('${s.id}')">${s.active?'Ukryj':'Aktywuj'}</button>
      <button onclick="moveSection('${s.id}',-1)">⬆</button>
      <button onclick="moveSection('${s.id}',1)">⬇</button>
    </div>`).join("");
}
async function toggleSection(id){const d=await load();const s=d.homeSections.find(x=>x.id===id);if(s){s.active=!s.active;save(d);homePage()}}
async function moveSection(id,dir){const d=await load();const s=d.homeSections.find(x=>x.id===id);if(s){s.order+=dir*1.5;d.homeSections.sort((a,b)=>a.order-b.order).forEach((x,i)=>x.order=i+1);save(d);homePage()}}
async function addSectionPage(){
  addBtn.onclick=async()=>{
    const d=await load();
    d.homeSections.push({id:slug(title.value||type.value+"-"+Date.now()),title:title.value||"Nowa sekcja",type:type.value,active:true,order:d.homeSections.length+1,editable:true,pinned:pinned.checked,scheduled:false});
    save(d);
  }
}
async function productPage(){
  const d=await load();
  category.innerHTML=d.categories.filter(c=>c.parent).map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");
  parseBtn.onclick=()=>{
    const parsed=parseProducer(raw.value);
    specsPreview.innerHTML=Object.entries(parsed.specs).map(([k,v])=>`<p><b>${esc(k)}</b>: ${esc(v)}</p>`).join("") || "<p>Brak parametrów</p>";
    features.value = features.value || parsed.features.join(", ");
    badges.value = badges.value || autoBadges(raw.value+" "+name.value).join(", ");
    description.value = description.value || parsed.description;
  };
  saveBtn.onclick=async()=>{
    const d=await load();
    const parsed=parseProducer(raw.value);
    const id=slug(name.value);
    const img=image.value || "assets/products/tv.svg";
    const item={id,name:name.value,category:category.value,price:price.value,oldPrice:oldPrice.value,discount:discount.value,promo:promo.checked,featured:featured.checked,image:img,badges:badges.value.split(",").map(x=>x.trim()).filter(Boolean),features:features.value.split(",").map(x=>x.trim()).filter(Boolean),specs:parsed.specs,description:description.value||parsed.description,advisor:advisor.value,stock:Number(stock.value||0),active:active.checked,promotion:{type:promoType.value,start:promoStart.value,end:promoEnd.value},draft:draft.checked,seo:{title:name.value+" - ELKASS Olesno",description:(description.value||parsed.description).slice(0,150)}};
    d.products=d.products.filter(p=>p.id!==id);
    d.products.push(item);
    save(d);
  };
  list.innerHTML=d.products.map(p=>`<div class="admin-card"><b>${esc(p.name)}</b><p>${esc(p.category)} · ${esc(p.price)}</p><a href="../product.html?id=${esc(p.id)}">Podgląd</a></div>`).join("");
}
async function mediaPage(){
  const d=await load();
  formats.innerHTML=d.mediaEngine.supportedFormats.map(f=>`<span class="chip">${f.toUpperCase()}</span>`).join("");
  variants.innerHTML=d.mediaEngine.variants.map(v=>`<div class="admin-card"><b>${v}</b><p>auto wariant</p></div>`).join("");
  file.onchange=e=>{
    preview.innerHTML=[...e.target.files].map(f=>`<div class="admin-card"><b>${esc(f.name)}</b><p>${esc(f.type||"plik")}</p><small>Etap Beta: podgląd. Production: Storage + Edge Function.</small></div>`).join("");
  };
}
async function settingsPage(){const d=await load();theme.value=d.settings.theme;type.value=d.settings.typography;logo.value=d.settings.logoVariant;saveSettings.onclick=()=>{d.settings.theme=theme.value;d.settings.typography=type.value;d.settings.logoVariant=logo.value;save(d)}}
async function brandsPage(){const d=await load();brandList.innerHTML=d.brands.map(b=>`<div class="admin-card"><b>${esc(b)}</b><p>marka w pasku producentów</p></div>`).join("");addBrand.onclick=()=>{d.brands.push(brand.value);save(d);brandsPage()}}
async function reviewsPage(){const d=await load();reviewList.innerHTML=[...d.reviews.google,...d.reviews.local].map(r=>`<div class="admin-card"><b>★★★★★</b><p>${esc(r)}</p></div>`).join("");addReview.onclick=()=>{const key=reviewType.value;d.reviews[key].push(reviewText.value);save(d);reviewsPage()}}
