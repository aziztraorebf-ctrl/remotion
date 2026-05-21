---
name: Apprentissages techniques V2 vectoriel - Atlas Mansa Moussa (2026-04-30)
description: Decouvertes techniques + decisions strategiques + patterns valides pour pipeline 100% Remotion vectoriel (d3-geo + Natural Earth + Historical Basemaps).
type: project
---

# Apprentissages V2 Vector Pipeline — 2026-04-30

> Session : 2026-04-30
> Duree : ~6h continues
> Cout total : $0.355
> Livrable : S3 Climax Hadj mini-render Iter1 (16s avec audio) + 3 sources de feedback consolidees
> Decision finale : "PROCEED WITH MODIFICATIONS" (Gemini), Iter2 pour batch-production

---

## 1. PIPELINE TECHNIQUE FINAL VALIDE

### Stack 100% Remotion vectoriel
- **`d3-geo`** : projection geographique (`geoOrthographic` pour globe, `geoMercator` pour vues plates)
- **Natural Earth 50m** (`ne_50m_countries.geojson`) : frontieres modernes precises
- **Historical Basemaps GitHub** (`world_1300.geojson`) : empires medievaux (GPL-3.0 attribue)
- **Precompute SVG paths** : `node scripts-atlas/precompute-atlas-v2-data.mjs` -> `src/atlas-v2-data.json` (188 ortho + 103 wide + 103 narrow + 103 caire)
- **Remotion overlays** : SVG natif + spring animations + interpolate cameras + Audio + Sequence

### Approches abandonnees pendant session
1. **Mapbox runtime** (V1) — saccades projection switch + manque flexibilite
2. **Carte parchemin Gemini** — frontieres modernes parasites + drift style + audience puriste detecte
3. **Mapbox satellite + filtre sepia** — rendu "fade", filtre desature couleurs sans creer identite
4. **Texture parchemin overlay multiply** — peu visible (cream sur cream = opaque)
5. **Camel walk cycle 3 frames Gemini** — frames de bbox different + character drift = "teleporting" visible

### Cout par approche testee
- Approches abandonnees : $0.21
- Approche finale (vectoriel) : **$0.07 cout chibi caravane uniquement** (le reste est code)

---

## 2. DECOUVERTES TECHNIQUES CRITIQUES

### 2.1 Gemini 3.1 Flash Image retourne RGB sans alpha
**Bug observe** : meme avec prompt explicite "TRANSPARENT BACKGROUND", le PNG retourne est **mode RGB** avec un fond gris (~RGB 212,212,212) qui ressemble a du "transparent" dans les viewers (damier visible) mais n'a PAS de canal alpha.

**Verification** :
```python
from PIL import Image
im = Image.open(file)
print('mode:', im.mode)  # 'RGB' au lieu de 'RGBA'
print('Sample (0,0):', im.getpixel((0,0)))  # (212, 212, 212) au lieu de (0,0,0,0)
```

**Fix** : chroma-key le gris -> alpha 0, puis crop bbox + sauvegarde RGBA :
```python
for y in range(H):
    for x in range(W):
        r, g, b, a = px[x, y]
        if abs(r - g) < 12 and abs(g - b) < 12 and r > 195:
            px[x, y] = (0, 0, 0, 0)
```

Script complet : `quebec-jacques-poc/scripts-atlas/fix-chibi-transparency.py`

### 2.2 Walk cycle multi-frame Gemini = bug visuel
**Probleme** : meme avec prompt "EXACT same character + costume + colors, only walking pose changes", Gemini genere 3 frames avec **bbox different** (755x855 vs 857x966 vs 1024x1024) ET character drift subtle (proportions camel + position rider).

**Effet visuel** : effet "teleporting" + flickering carre transparent quand frames swap.

**Lecon** : pour Remotion vectoriel, **ne pas tenter walk cycle multi-frame Gemini**. Une seule frame + hopping vertical suffit pour V1. Si vraiment besoin walk cycle, considerer :
- PixelLab (specialise sprite animation, frames coherent par design)
- Generation manuelle Photoshop/Krita (3-4 frames customs, alignees pixel-perfect)
- Skip walk cycle, garder frame statique + Math.abs(sin) hopping

### 2.3 Audio offset narration (test mid-narration)
**Pattern valide** : Pour tester scene mid-narration en mini-render, utiliser `<Audio startFrom={Math.round(NARRATION_OFFSET_SEC * fps)}>` :
```tsx
<Audio
  src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
  startFrom={Math.round(34 * fps)}  // skip first 34s
/>
```

Compose avec `BEATS = { soixanteHommes: Math.round((43.46 - 34) * fps) }` pour aligner les beats relatifs au scene start.

### 2.4 d3-geo precompute pour Remotion
**Pourquoi precompute** : projeter en runtime (`geoPath()` dans component) = lent + variable selon frame. Mieux precomputer en build-time vers JSON.

**Pattern** :
```javascript
// scripts-atlas/precompute-atlas-v2-data.mjs (Node.js)
import { geoMercator, geoPath } from "d3-geo";
const proj = geoMercator().center([15, 20]).scale(550).translate([360, 640]);
const pathGen = geoPath(proj);
const out = { countries: countries.map(f => ({ iso: f.properties.ISO_A3, d: pathGen(f) })) };
fs.writeFileSync("src/atlas-v2-data.json", JSON.stringify(out));
```

```tsx
// Remotion component
import data from "./atlas-v2-data.json";
{data.mercWide.countries.map(c => <path key={c.iso} d={c.d} fill={...} />)}
```

Render time : ~3-5 min pour 16s @ 30fps (vs 12 min V1 Mapbox).

### 2.5 Camera moves illusoires (sans Mapbox runtime)
**Pattern** : transformer le SVG content via `<g transform>` au lieu de re-projecter. Permet drift continu + scale + offset center sans saccade :
```tsx
<g transform={`translate(${360 + driftX} ${640 + driftY}) scale(${scale}) translate(${-360} ${-640})`}>
  {/* country paths */}
</g>
```

`scale + translate + drift sinusoidal` = effet "vol au-dessus" identique a Mapbox tilted, **sans Mapbox**.

---

## 3. DECISIONS STRATEGIQUES SESSION

### 3.1 Pivot architectural Mapbox -> 100% Remotion vectoriel
**Justification** : V1 a 12 min render + saccades projection + manque flexibilite chibi animation. V2 vectoriel a 3-5 min render + zero saccade + chibi compositing libre + reutilisable cross-episodes.

### 3.2 Style "carte design 2D" choisi vs "satellite tilted"
**Reference dominante** : Jacques a dit (cartes vectorielles 2D animees Illustrator) plutot que GeoGlobeTales (satellite tilted Google Earth Studio).

**Why** : style 2D vectoriel = 100% controle palette + identite Mande possible (terracotta/cream/indigo/or) + zero asset image generee + reutilisable cross-episodes.

### 3.3 Recherche outils chaines pro - 3 agents paralleles
**Methodologie validee** : `/last30days` skill + 2 agents general-purpose (deep search + reverse-engineer specifique) en parallele = reponse fiable 30 min.

**Resultat** : confirmation chaines pro (Johnny Harris, Vox, RealLifeLore, GeoGlobeTales) = After Effects + GEOlayers 3 + Google Earth Studio. Jacques a dit (Lumera Montpellier) = After Effects + Illustrator vectoriel custom.

**Pour notre niveau (Aziz code-only, pas de AE)** : Voie 2 (cartes vectorielles 2D Remotion) = meilleur compromis.

### 3.4 Validation Gemini independante = process valide
**Pattern adopte** : apres mini-render, envoyer a Gemini API ($0.005-0.01) avec brief structure incluant :
- Contexte projet + style target + tech stack
- Observations Aziz (bugs deja vus)
- Mission exhaustive (10 sections : bugs critiques, sync audio, camera, palette, narrative clarity, what works, missing, priority fix list, production decision)

**ROI** : Gemini reperer 2 bugs additionnels que Aziz + Claude n'avaient pas vu (path entier au depart, sync 60 000 leger retard) en 18s analyse.

### 3.5 Process "fix components first, then batch produce" (Gemini reco)
Ne pas batch-render les 5 scenes restantes avant d'avoir fixe S3 components. Sinon : 10+ heures de manual tweaking apres render. Componentiser puis dupliquer = ROI 5x.

---

## 4. PATTERNS PRODUCTION VALIDES (REUTILISABLES)

### 4.1 Pre-test mini-render scene complete (audio + visuel + SFX)
**Pattern** : Avant production complete, tester UNE scene cle 10-16s avec audio narration + musique + SFX synchronises. Permet validation 5 dimensions simultanement (audio sync, camera motion, palette, narrative clarity, transitions).

**ROI** : evite render full 81s + 5 corrections post-render.

### 4.2 Recherche stack outils createurs - 3 sources paralleles
- `/last30days` skill (X posts engagement signal)
- Agent deep search general (blogs/tutos/articles, sources convergentes)
- Agent reverse-engineer specifique chaines (Patreon/Lumera/podcast/about pages)

Convergence 3 sources = verite verifiable. Divergence = signal faible, ne pas se fier.

### 4.3 Composants reutilisables Remotion vectoriel (pour Iter2)
Pattern de **components partages** entre toutes scenes Atlas :
- `<AtlasGlobe>` ortho avec rotation + halo + ciel etoile
- `<AtlasMercator>` plate avec scale + drift + center offset
- `<AtlasLabel>` pill auto-width Cormorant + spring entry
- `<AtlasCartouche>` chiffre-choc + wobble + fadeOut
- `<AtlasPulseMarker>` ring blanc + dot dore stroke noir
- `<AtlasCaravane>` chibi + path strokeDashoffset + hopping
- `<AtlasSubtitlesKaraoke>` word-by-word from forced-alignment.json

Une fois codes, **80% reutilisables** pour Songhai, Ghana, Aksoum, Kanem-Bornou, etc.

---

## 5. ERREURS A NE PAS REPRODUIRE

1. **Tester Mapbox satellite + filtre sepia** sans valider avant que filtre desature couleurs au lieu de creer identite -> $0.07 perdus + 1h iterations
2. **Generer texture parchemin Gemini pour overlay multiply** -> 75% transparent visuel = inutile en multiply
3. **Tenter walk cycle multi-frame Gemini** sans verifier bbox alignment -> $0.14 perdus + bug visuel "teleporting"
4. **Hardcoder URL Gemini File API status** : utiliser `client.files.get(name=...)` pas URL hardcoded
5. **Croire que "background damier" dans Read tool = transparent** : Gemini retourne RGB sans alpha, Read tool affiche damier comme placeholder. **TOUJOURS verifier avec PIL `im.mode`**
6. **Lancer batch-render 5 scenes avant fix components S3** : 10+ heures de tweaking apres = perte massive de temps. Componentize first.
7. **Confondre "vue satellite tilted" avec "vue plate vectorielle 2D"** : ce sont 2 styles differents, references differentes (GeoGlobeTales vs Jacques a dit), pipelines differents
8. **Generer cartes via Gemini sans verifier geographie** : Gemini "dessine ce qui ressemble a une carte", PAS la vraie geographie. Mali deborde Niger, frontieres imaginaires. **Audience puriste detecte instantanement.** Toujours utiliser source GeoJSON academique (Natural Earth + Historical Basemaps).

---

## 6. ASSETS REUTILISABLES POUR PRODUCTION COMPLETE V2

### Audio (TOUS de V1, NE PAS REGENERER)
- `narration-v3.mp3` (81.04s) + `narration-v3-alignment.json`
- 4 SFX : B-impact, C-caravane-ink-draw, D-cartouche-thud, E-vent-sahara
- Musique : C-mande-contemplatif.mp3

### Visuels (TOUS reutilisables)
- `gizeh-medallion.png` (paper-craft Gizeh, scene S4 Caire)
- `mansa-portrait-A-v2-canonique.png` (gros plan, scene CTA)
- `mansa-portrait-B-v2-canonique-trone.png` (trone, punch finale CTA)
- `caravane-A.png` (chibi caravane transparent OK, scene S3 climax)

### Code (V2 vector pipeline)
- `src/atlas-v2-data.json` (1.2 MB precompute SVG paths)
- `src/AtlasV2GlobeTest.tsx` (template globe ortho a reutiliser)
- `src/AtlasV2SceneS3Test.tsx` (template scene wide Mercator a reutiliser)
- `src/timing-mansa-moussa.ts` (16 timestamps + COORDS + SFX_VOLUMES)
- `scripts-atlas/precompute-atlas-v2-data.mjs` (regenerer si on change projection/cadrage)
- `scripts-atlas/fix-chibi-transparency.py` (process PNG Gemini pour transparence reelle)

### GeoJSON sources
- `data/ne_50m_countries.geojson` (Natural Earth 50m, frontieres modernes)
- `data/world_1300.geojson` (Historical Basemaps, empires medievaux)

---

## 7. UPGRADE PIXELLAB WALK CYCLE (2026-05-01)

> Session parallèle d'exploration — pipeline validé, prêt pour intégration S3.
> Fichier complet : `memory/atlas-mansa-moussa/PIXELLAB-WALK-PIPELINE.md`
> Règles canoniques outil : `memory/tools/pixellab.md`

### Ce qui est validé
- Sprites statiques PixelLab sur carte plate d3-geo : OK
- Walk cycle frames individuelles sur carte, déplacement sur route : OK
- Changement animation (marche → action) : OK
- 2 personnages simultanés avec animations distinctes : OK

### Règles visuelles actées
- Taille sprite : **64px affiché** (canonique, ne pas grandir)
- Carte **plate (0° tilt)** pour scènes personnages
- **Pas d'ombre** sous les pieds
- **Pas de hop** sur personnage statique
- Labels géo : couper pendant phases animation personnage

### Intégration S3 prévue
Remplacer `<AtlasCaravane>` statique par Mansa Moussa + guerrier animés sur route caravane.
Nécessite walk cycles générés via abonnement MCP PixelLab ou SDK frame-par-frame.
Assets statiques déjà disponibles : `mansa-pixel-128.png`, `guerrier-pixel-128.png`, `chameau-pixel-128.png`.

---

## 8. METRIQUES SESSION

- Duree : ~6h continues
- Cout : $0.355
  - Approches abandonnees : $0.21 ($0.07 carte test + $0.07 parchemin texture + $0.07 chibi A initiale)
  - Walk cycle abandonne : $0.14 (chibi B + C)
  - Review Gemini : $0.005
- Renders test : 5 (parchment overlay, vector test, globe test, S3 first, S3 Iter1)
- Decouvertes techniques : 5 (d3-geo, PNG transparency, audio offset, walk cycle bug, palette V1 reproductible)
- Decisions strategiques : 5 (pipeline final, style 2D vector, methodologie 3-agents recherche, process fix-then-batch, validation Gemini)
- Memoires creees : 2 (NEXT-SESSION-mansa-moussa-v2-vector-iter2.md + ce LEARNINGS)
