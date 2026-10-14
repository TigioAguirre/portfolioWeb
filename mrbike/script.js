/* Dibujo de bicicletas en SVG (ilustrativo, sin imágenes externas) */
function bikeSVG(o){
  const c=o.color, d=o.dark||'#111214', k=o.kind;
  const R=o.kids?30:42, ty=o.kids?4:0;
  const rw={x:62,y:118}, fw={x:206,y:118};
  const bb={x:118,y:118}, st={x:106,y:o.kids?78:64}, ht={x:o.kind==='urbana'?186:182,y:o.kids?76:60};
  const tire=k==='montaña'?7:k==='ruta'?2.6:k==='eléctrica'?5:4;
  const wheel=(p)=>`<circle cx="${p.x}" cy="${p.y}" r="${R}" fill="none" stroke="${d}" stroke-width="${tire}"/>
    <circle cx="${p.x}" cy="${p.y}" r="${R-tire/2-2}" fill="none" stroke="#9aa0a8" stroke-width="1"/>
    <g stroke="#b9bec6" stroke-width=".8">${[0,30,60,90,120,150].map(a=>`<line x1="${p.x-(R-6)*Math.cos(a*Math.PI/180)}" y1="${p.y-(R-6)*Math.sin(a*Math.PI/180)}" x2="${p.x+(R-6)*Math.cos(a*Math.PI/180)}" y2="${p.y+(R-6)*Math.sin(a*Math.PI/180)}"/>`).join('')}</g>
    <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${d}"/>`;
  const sw=k==='montaña'?5:4;
  let bars='', saddleX=st.x-6;
  if(k==='ruta') bars=`<path d="M${ht.x+2} ${ht.y-8}h10q9 0 9 10q0 9-9 9h-5" fill="none" stroke="${d}" stroke-width="3.5" stroke-linecap="round"/>`;
  else if(k==='urbana') bars=`<path d="M${ht.x} ${ht.y-6}l8-14h12" fill="none" stroke="${d}" stroke-width="3.5" stroke-linecap="round"/>`;
  else bars=`<path d="M${ht.x-6} ${ht.y-12}h22" stroke="${d}" stroke-width="4" stroke-linecap="round"/>`;
  const extras=
    (k==='eléctrica'?`<rect x="${bb.x-16}" y="${(bb.y+ht.y)/2-12}" width="38" height="10" rx="4" transform="rotate(-38 ${bb.x+3} ${(bb.y+ht.y)/2-7})" fill="#2b2e34" stroke="#FFC400" stroke-width="1.5"/><circle cx="${bb.x}" cy="${bb.y}" r="8" fill="#2b2e34" stroke="#FFC400" stroke-width="2"/>`:'')+
    (k==='montaña'?`<rect x="${ht.x-3}" y="${ht.y+4}" width="6" height="26" rx="3" fill="#FFC400" transform="rotate(18 ${ht.x} ${ht.y+4})"/>`:'')+
    (o.kids?`<circle cx="${rw.x}" cy="${rw.y}" r="${R+3}" fill="none" stroke="#FFC400" stroke-width="1.5" stroke-dasharray="3 5"/>`:'');
  return `<svg viewBox="0 0 270 170" role="img" aria-label="${o.name}">
  <ellipse cx="135" cy="${rw.y+R+3}" rx="105" ry="5" fill="rgba(0,0,0,.14)"/>
  ${wheel(rw)}${wheel(fw)}
  <g stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M${rw.x} ${rw.y}L${bb.x} ${bb.y}L${st.x} ${st.y}L${rw.x} ${rw.y}"/>
    <path d="M${st.x} ${st.y}L${ht.x} ${ht.y}L${bb.x} ${bb.y}"/>
    <path d="M${ht.x} ${ht.y}L${fw.x} ${fw.y}" stroke="${d}"/>
    <path d="M${st.x} ${st.y}L${st.x-4} ${st.y-12}" stroke="${d}"/>
  </g>
  <rect x="${saddleX-8}" y="${st.y-17}" width="22" height="6" rx="3" fill="${d}"/>
  <path d="M${ht.x} ${ht.y}l-2-10" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
  ${bars}${extras}
  <circle cx="${bb.x}" cy="${bb.y}" r="9" fill="none" stroke="#9aa0a8" stroke-width="2.5"/>
  <path d="M${bb.x} ${bb.y}l10 12" stroke="${d}" stroke-width="3" stroke-linecap="round"/>
  <rect x="${bb.x+6}" y="${bb.y+10}" width="10" height="4" rx="2" fill="${d}"/>
</svg>`;
}

const BIKES=[
  {name:'Trail Rider 29',kind:'montaña',color:'#E10600',price:1290,spec:'Aluminio · 21 vel. · Suspensión 100 mm',tag:'Nueva'},
  {name:'Ridge Pro',kind:'montaña',color:'#FFC400',price:1890,spec:'Aluminio · 1x12 · Frenos hidráulicos'},
  {name:'Velocity R1',kind:'ruta',color:'#111214',dark:'#E10600',price:1650,spec:'Carbono · 22 vel. · 8.2 kg',tag:'Top'},
  {name:'Aero Sprint',kind:'ruta',color:'#E10600',price:1420,spec:'Aluminio · Shimano 105 · 20 vel.'},
  {name:'City Flow',kind:'urbana',color:'#2c6fbb',price:640,spec:'Acero · 7 vel. · Guardabarros'},
  {name:'Metro Classic',kind:'urbana',color:'#1f8f5f',price:590,spec:'Aluminio · Cambio interno 3 vel.'},
  {name:'Volt City E1',kind:'eléctrica',color:'#E10600',price:2290,spec:'Motor 250 W · 80 km de autonomía',tag:'Nueva'},
  {name:'Volt Trail E2',kind:'eléctrica',color:'#111214',dark:'#222',price:2790,spec:'Motor 500 W · Batería 624 Wh'},
  {name:'Mini Rider 20',kind:'niños',color:'#FFC400',price:249,spec:'Rodado 20 · 6 vel. · Desde 7 años',kids:true},
  {name:'Kid Spark 16',kind:'niños',color:'#E10600',price:189,spec:'Rodado 16 · Ruedas de apoyo',kids:true}
];
const CATS=['todas','montaña','ruta','urbana','eléctrica','niños'];
const cap=s=>s[0].toUpperCase()+s.slice(1);
const money=n=>'$'+n.toLocaleString('es');

const grid=document.getElementById('grid'), filters=document.querySelector('.filters');
function render(cat){
  grid.innerHTML=BIKES.filter(b=>cat==='todas'||b.kind===cat).map(b=>`
    <article class="card">
      <div class="pic">${b.tag?`<span class="tag ${b.tag==='Nueva'?'new':''}">${b.tag}</span>`:''}${bikeSVG(b)}</div>
      <div class="body">
        <span class="meta">${cap(b.kind)}</span>
        <h3>${b.name}</h3>
        <p class="meta">${b.spec}</p>
        <div class="row"><span class="price">${money(b.price)}</span><a class="btn" href="#contacto">Cotizar</a></div>
      </div>
    </article>`).join('');
}
filters.innerHTML=CATS.map((c,i)=>`<button class="chip" role="tab" aria-selected="${i===0}" data-c="${c}">${cap(c)}</button>`).join('');
filters.addEventListener('click',e=>{
  const b=e.target.closest('.chip'); if(!b) return;
  filters.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-selected',x===b));
  render(b.dataset.c);
});
render('todas');

document.getElementById('heroBike').innerHTML=bikeSVG({name:'Bicicleta destacada',kind:'montaña',color:'#E10600',dark:'#fff'});
document.getElementById('tallerArt').innerHTML=bikeSVG({name:'Taller',kind:'ruta',color:'#E10600',dark:'#fff'});

const burger=document.querySelector('.burger'), menu=document.getElementById('menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
menu.addEventListener('click',e=>{if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded',false)}});

document.getElementById('form').addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target;
  if(!f.nombre.value.trim()||!f.contacto.value.trim()){f.reportValidity?.();return}
  document.getElementById('ok').hidden=false; f.reset();
});
document.getElementById('yr').textContent=new Date().getFullYear();
