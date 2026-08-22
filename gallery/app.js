// Galerie de mouvements de camera.
// Mecanique d'affichage (carte + nom copiable, chargement paresseux) adaptee de
// video-shotcraft (Apache-2.0). Lecture au clic, recherche locale, favoris partages.
const CATS = {tous:'Tous', reperage:'Repérage', approche:'Approche',
              revelation:'Révélation', transition:'Transition', accent:'Accent'};
let cards = [], filtre = 'tous', q = '', favOnly = false;

fetch('data.json').then(r => r.json()).then(d => {
  cards = d; initUI(); rendre();
  document.getElementById('sub').textContent = `${d.length} gestes disponibles`;
});

// Sans accents ni casse : "révélation" trouve "revelation".
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Mots outils ignores : "suivre une route" ne doit pas echouer sur "une".
const STOP = new Set(['un','une','des','le','la','les','de','du','au','aux','et','ou','en',
                      'sur','dans','pour','avec','que','qui','ce','cette','je','veux','plus',
                      'par','se','son','sa','est','il','elle','on','me','ma','mon','faire']);

// Score = nombre de mots trouves (titre et usage comptent double).
// Classement par pertinence plutot que filtre strict : une phrase entiere ne
// doit pas echouer parce qu'un seul mot manque.
function score(c, terms){
  const fort = norm([c.titre, c.usage, c.slug].join(' '));
  const tout = fort + ' ' + norm([c.desc, c.kw, c.lieu, CATS[c.cat]].join(' '));
  let n = 0;
  for (const t of terms){
    if (fort.includes(t)) n += 2;
    else if (tout.includes(t)) n += 1;
  }
  return n;
}

function initUI(){
  const dispo = ['tous', ...Object.keys(CATS).filter(c => c !== 'tous' && cards.some(x => x.cat === c))];
  const nav = document.getElementById('filters');
  nav.innerHTML = dispo.map(c =>
    `<button data-c="${c}" aria-pressed="${c === filtre}">${CATS[c]}</button>`).join('')
    + (cards.some(c => c.fav)
        ? `<button data-fav="1" aria-pressed="false" class="fav-filter">&#9733; Favoris</button>` : '');
  nav.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.fav){ favOnly = !favOnly; b.setAttribute('aria-pressed', favOnly); }
    else {
      filtre = b.dataset.c; favOnly = false;
      nav.querySelectorAll('[data-c]').forEach(x => x.setAttribute('aria-pressed', x.dataset.c === filtre));
      const f = nav.querySelector('[data-fav]'); if (f) f.setAttribute('aria-pressed', 'false');
    }
    rendre();
  };
  const inp = document.getElementById('q');
  inp.oninput = () => { q = inp.value; rendre(); };
  document.getElementById('qClear').onclick = () => { inp.value = ''; q = ''; rendre(); inp.focus(); };
}

function rendre(){
  const brut = norm(q).split(/\s+/).filter(Boolean);
  const terms = brut.filter(t => !STOP.has(t) && t.length > 1);

  let list = cards.filter(c => (filtre === 'tous' || c.cat === filtre) && (!favOnly || c.fav));
  if (terms.length){
    list = list.map(c => ({c, n: score(c, terms)})).filter(x => x.n > 0)
               .sort((a, b) => b.n - a.n).map(x => x.c);
  }

  document.getElementById('qClear').hidden = !q;
  document.getElementById('count').textContent =
    list.length === cards.length ? `${cards.length} mouvements` : `${list.length} sur ${cards.length}`;

  document.getElementById('grid').innerHTML = list.length ? list.map(c => `
    <article class="card">
      <div class="preview" data-slug="${c.slug}">
        <img class="poster" src="posters/${c.slug}.jpg" alt="${esc(c.titre)}" loading="lazy" decoding="async">
        <button class="play" type="button" aria-label="Lire ${esc(c.titre)}">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor"/></svg>
        </button>
        <span class="badge">${CATS[c.cat]}</span>
        ${c.fav ? '<span class="star" title="Favori">&#9733;</span>' : ''}
      </div>
      <div class="body">
        <div class="titre">${esc(c.titre)}</div>
        <p class="usage">${esc(c.usage)}</p>
        <p class="desc">${esc(c.desc)}</p>
        <div class="meta"><span>${esc(c.lieu)}</span><span>énergie ${c.energie}</span><span>5 s</span></div>
        <button class="copier" data-copy="${c.slug}">${c.slug}</button>
      </div>
    </article>`).join('')
    : `<p class="vide">Rien pour « ${esc(q)} ».<br>Essaie un mot plus simple : reculer, tourner, suivre, flou, interface…</p>`;
}

// La video n'est creee — donc telechargee — qu'au premier clic.
function lire(box){
  let v = box.querySelector('video');
  if (!v){
    v = document.createElement('video');
    v.src = `clips/${box.dataset.slug}.mp4`;
    v.muted = true; v.loop = true; v.playsInline = true; v.controls = true;
    v.setAttribute('playsinline', '');
    box.appendChild(v);
  }
  document.querySelectorAll('.preview.playing').forEach(o => {
    if (o !== box){ o.classList.remove('playing'); const ov = o.querySelector('video'); if (ov) ov.pause(); }
  });
  box.classList.add('playing');
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
  if (pl) lire(pl.closest('.preview'));
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
