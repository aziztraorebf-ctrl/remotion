# DOM Marker Mapbox géo-attaché — pattern validé headless pour labels qui suivent la carte

Validé en production session 2026-05-31 (Maroc Batteries A1 Hook).

**Règle :** Pour tout label textuel lié à un point géographique Mapbox, utiliser un DOM Marker, pas un overlay CSS fixe.

**Why :** Un overlay CSS positionné fixe drift quand la caméra zoome/pan. Le DOM Marker suit automatiquement les coordonnées lon/lat. Validé headless sur chrome-headless-shell.

**Pattern complet :**
```ts
const el = document.createElement("div");
// Construire le contenu via DOM API (pas innerHTML — XSS risk)
const bar = document.createElement("div"); bar.style.cssText = "width:4px;background:#c08820;...";
const plate = document.createElement("div"); ...
el.appendChild(bar); el.appendChild(plate);

const marker = new mapboxgl.Marker({ element: el, anchor: "right", offset: [-16, 0] })
  .setLngLat([lon, lat])
  .addTo(map);

// Contrôler visibilité via opacité frame par frame :
marker.getElement().style.opacity = String(interpolate(frame, [trigIn, trigIn+15], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}));

// Cleanup obligatoire dans le return du useEffect :
marker.remove();
```

**Limite :** max ~15-20 markers simultanés avant dégradation perf headless.
**Ne pas utiliser innerHTML** → risque XSS signalé par hook sécurité. Toujours construire via `createElement` + `textContent`.

Le pattern DOM Marker est utilisé nommément dans plusieurs Production Briefs (Maroc Batteries, etc.) et
`doctrines/SOUVERAIN-SHORT-DEMARRAGE.md` (« le pattern getCam, pushCanvas, DOM Marker, KaraokeSubtitles =
copier tel quel ») sans que le code/gotchas (XSS, cleanup, limite perf) soient documentés — ce fichier
comble ce trou.

---
Migré depuis auto-memory (`feedback_mapbox-dom-marker-validated.md`) le 2026-08-31, contenu original inchangé.
