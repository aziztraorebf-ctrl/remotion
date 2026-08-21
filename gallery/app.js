// Galerie de mouvements de camera.
// Mecanique d'affichage (chargement paresseux, carte + nom copiable) adaptee de
// video-shotcraft (Apache-2.0). Lecture au clic, pas d'autoplay.
const CATS = {tous:'Tous', reperage:'Repérage', approche:'Approche',
              revelation:'Révélation', transition:'Transition', accent:'Accent'};
let cards = [], filtre = 'tous';

fetch('data.json').then(r => r.json()).then(d => { cards = d; initFiltres(); rendre(); });

function initFiltres(){
  const dispo = ['tous', ...Object.keys(CATS).filter(c => c !== 'tous' && cards.some(x => x.cat === c))];
  const nav = document.getElementById('filters');
  nav.innerHTML = dispo.map(c =>
    `<button data-c="${c}" aria-pressed="${c === filtre}">${CATS[c]}</button>`).join('');
  nav.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    filtre = b.dataset.c;
    nav.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.c === filtre));
    rendre();
  };
}

function rendre(){
  const list = cards.filter(c => filtre === 'tous' || c.cat === filtre);
  document.getElementById('grid').innerHTML = list.map(c => `
    <article class="card">
      <div class="preview" data-slug="${c.slug}">
        <img class="poster" src="posters/${c.slug}.jpg" alt="${esc(c.titre)}" loading="lazy" decoding="async">
        <button class="play" type="button" aria-label="Lire ${esc(c.titre)}">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor"/></svg>
        </button>
        <span class="badge">${CATS[c.cat]}</span>
      </div>
      <div class="body">
        <div class="titre">${esc(c.titre)}</div>
        <p class="desc">${esc(c.desc)}</p>
        <div class="meta"><span>${esc(c.lieu)}</span><span>énergie ${c.energie}</span><span>5 s</span></div>
        <button class="copier" data-copy="${c.slug}">${c.slug}</button>
      </div>
    </article>`).join('');
}

// Lecture : la video n'est creee (et donc telechargee) qu'au premier clic.
function lire(box){
  const slug = box.dataset.slug;
  let v = box.querySelector('video');
  if (!v){
    v = document.createElement('video');
    v.src = `clips/${slug}.mp4`;
    v.muted = true; v.loop = true; v.playsInline = true; v.controls = true;
    v.setAttribute('playsinline','');
    box.appendChild(v);
  }
  box.classList.add('playing');
  document.querySelectorAll('.preview.playing').forEach(o => {
    if (o !== box){ o.classList.remove('playing'); const ov = o.querySelector('video'); if (ov) ov.pause(); }
  });
  v.play().catch(() => {});
}

document.addEventListener('click', e => {
  const cp = e.target.closest('[data-copy]');
  if (cp){
    const t = cp.dataset.copy;
    navigator.clipboard.writeText(t).then(() => toast(`Copié : ${t}`)).catch(() => toast('Copie impossible'));
    return;
  }
  const pl = e.target.closest('.play');
  if (pl){ lire(pl.closest('.preview')); }
});

function toast(m){
  const t = document.getElementById('toast');
  t.textContent = m; t.classList.add('on');
  clearTimeout(t._x); t._x = setTimeout(() => t.classList.remove('on'), 1700);
}
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

const KEY = 'galerie-camera-theme';
function setTheme(t, save){
  document.documentElement.setAttribute('data-theme', t);
  if (save) localStorage.setItem(KEY, t);
  document.getElementById('tLight').setAttribute('aria-pressed', t === 'light');
  document.getElementById('tDark').setAttribute('aria-pressed', t === 'dark');
}
document.getElementById('tLight').onclick = () => setTheme('light', true);
document.getElementById('tDark').onclick = () => setTheme('dark', true);
setTheme(localStorage.getItem(KEY) ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), false);
