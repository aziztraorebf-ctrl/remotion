---
name: Pipeline d3-geo + Natural Earth + Remotion vectoriel
description: Alternative validee a Mapbox runtime pour cartes Atlas. 100% code, zero dependance externe payante, render 4x plus rapide.
type: workflow
---

# Pipeline d3-geo Vectoriel pour Cartes Atlas

> Valide : 2026-04-30 sur Atlas Mansa Moussa V2 S3 mini-render
> Alternative a : Mapbox runtime (V1 Mansa Moussa, abandonne pour saccades + manque flexibilite)
> Inspiration : style Jacques a dit (cartes vectorielles 2D animees)

---

## Stack technique

- **`d3-geo`** : projection geographique (geoOrthographic globe, geoMercator plat)
- **Natural Earth 50m** (`ne_50m_countries.geojson`) : frontieres modernes precises
- **Natural Earth 10m rivers** (`ne_10m_rivers_lake_centerlines.geojson`, github.com/nvkelso/natural-earth-vector)
  : cours d'eau/rivieres reels (prouve 2026-07-24, geodata Seine cropee sur Paris pour CFA Acte 4 — 1 seule
  feature par riviere nommee, cropper sur la fenetre lon/lat voulue + lisser via courbes Q). Meme source que
  `ne_10m_admin_1_states_provinces.geojson` (regions administratives, cf `scripts/warmap/generate-sahel-admin1.py`)
  — pattern jumeau reutilisable pour toute geodata reelle absente du projet (JAMAIS laisser un modele dessiner la geo).
- **Historical Basemaps GitHub** (`world_1300.geojson`, etc.) : empires medievaux GPL-3.0
- **Precompute SVG paths** : Node.js script (build-time) -> JSON consomme par Remotion
- **Remotion overlays** : SVG natif + spring + interpolate + Audio + Sequence

## Avantages vs Mapbox runtime

| Critere | Mapbox runtime (V1) | d3-geo vectoriel (V2) |
|---------|---------------------|------------------------|
| Render time 80s @ 30fps | 12 min | 3-5 min |
| Saccades projection switch | Oui | Aucune (fade smooth) |
| Personnages chibi sur carte | Limite | Compositing libre |
| Cuts dynamiques entre vues | Lourd | `<Sequence>` natif |
| Cout production | Tokens API | $0 (zero call) |
| Reutilisable cross-episodes | Limite | 80% reutilisable |
| Identite visuelle controle | Limite par tiles | 100% controle palette |
| Saccades runtime | Oui sur globe<->mercator | Aucune |

## Pattern complet

### 1. Precompute SVG paths (build-time)

```javascript
// scripts-atlas/precompute-atlas-data.mjs
import { geoOrthographic, geoMercator, geoPath } from "d3-geo";
import fs from "node:fs";

const ne = JSON.parse(fs.readFileSync("data/ne_50m_countries.geojson", "utf8"));

// Globe orthographic
const orthoProj = geoOrthographic()
  .scale(280)
  .translate([360, 640])
  .rotate([-20, -5, 0])
  .clipAngle(90);
const orthoPath = geoPath(orthoProj);

// Mercator wide
const mercWideProj = geoMercator()
  .center([15, 20])
  .scale(550)
  .translate([360, 640]);
const mercWidePath = geoPath(mercWideProj);

const out = {
  width: 720,
  height: 1280,
  ortho: { countries: features.map(f => ({ iso: f.properties.ISO_A3, d: orthoPath(f) })) },
  mercWide: { countries: features.map(f => ({ iso: f.properties.ISO_A3, d: mercWidePath(f) })) },
};
fs.writeFileSync("src/atlas-data.json", JSON.stringify(out));
```

### 2. Composant Remotion (runtime)

```tsx
import data from "./atlas-data.json";

const AtlasMap: React.FC = () => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame * 0.014) * 18;
  const scale = interpolate(frame, [0, 90], [1.0, 1.15]);

  return (
    <svg viewBox="0 0 720 1280">
      <g transform={`translate(${360 + driftX} 640) scale(${scale}) translate(${-360} ${-640})`}>
        {data.mercWide.countries.map(c => (
          <path
            key={c.iso}
            d={c.d}
            fill={c.iso === "MLI" ? "#F5EBD8" : "#C97D5A"}
            stroke="#5A3A2A"
            strokeWidth="0.6"
          />
        ))}
      </g>
    </svg>
  );
};
```

### 3. Camera moves illusoires

`<g transform="translate scale">` sur viewBox SVG fixe = drift + zoom + pan **sans saccade ni recompute**. Pattern equivalent a Mapbox tilted MAIS plus performant + flexible.

## Projections disponibles

| Projection | Usage | Reference |
|------------|-------|-----------|
| `geoOrthographic` | Globe vue espace, hook + finale narrative | V1 Mansa Moussa hook |
| `geoMercator` | Vue plate avec pays, scenes narratives | Jacques a dit standard |
| `geoStereographic` | Effet fisheye polaire | Vue dramatique solennelle |
| `geoEquirectangular` | Vue plate world map | Pour comparaisons multi-region |

Switch entre projections : fade Remotion `opacity interpolate` entre 2 `<g>` distincts (chacun rendu avec sa projection precomputee). **Aucune saccade**.

## Empire historique overlay

Pattern signature : Mali Empire 1300 hatching cream sur land terracotta moderne.

```tsx
<defs>
  <pattern id="empireHatch" patternUnits="userSpaceOnUse" width="6" height="6"
           patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="6" stroke="#F5EBD8" strokeWidth="2" opacity="0.75"/>
  </pattern>
</defs>

<path d={data.maliEmpire1300}
      fill="url(#empireHatch)"
      stroke="#F5EBD8"
      strokeWidth="3"
      strokeDasharray="10 5"  // dashed = frontiere historique imprecise
/>
```

## Caravane animation sur path bezier

```tsx
const t = interpolate(frame, [startFrame, endFrame], [0, 1]);
const dashOffset = pathTotalLength * (1 - t);

// Path qui se dessine
<path d={smoothCaravanePath}
      stroke="#D4A574" strokeWidth="3"
      strokeDasharray={pathTotalLength}
      strokeDashoffset={dashOffset}
/>

// Position chibi le long du path (interpolation waypoints)
const segIdx = Math.floor(t * (waypoints.length - 1));
const localT = t * (waypoints.length - 1) - segIdx;
const cx = waypoints[segIdx][0] + (waypoints[segIdx+1][0] - waypoints[segIdx][0]) * localT;
const hopY = Math.abs(Math.sin(frame * 0.4)) * 5;

<image href={staticFile("chibi.png")}
       x={cx - 50} y={cy - 100 + hopY}
       width="100" height="100"/>
```

## Performance

Tested sur Atlas Mansa Moussa V2 S3 (16s @ 30fps, 720x1280) :
- 188 ortho countries + 103 mercator wide countries (path complexes)
- Render time : ~3-5 min sur Mac M1
- File size : 10.5 MB MP4 H.264

Pour 80s scene complete (extrapolation) : ~15-25 min render. Pour scene narrative tres dense (multiples cartes + chibi + karaoke), prevoir 30-45 min.

## Sources academiques (attribution obligatoire)

- **Natural Earth 50m** : domaine public, AUCUNE attribution requise
- **Historical Basemaps** : GPL-3.0, attribution dans description YouTube ("Traces : Historical Basemaps by aourednik")
- **OSM** (si used) : ODbL, attribution forme libre

## Quand utiliser ce pipeline vs alternatives

### Utiliser d3-geo vectoriel pour
- Shorts narratifs Atlas (notre cas)
- Identite visuelle stylisee (palette controlee)
- Multiples scenes avec cuts dynamiques
- Personnages chibi animes sur cartes
- Episodes recurrents (assets reutilisables cross-episodes)

### Utiliser Mapbox satellite pour
- Demos techniques avec relief satellite reel
- Scenes uniques sans reutilisation
- Quand precision photographique > flexibilite creative

### Utiliser After Effects + GEOlayers 3 pour (n'est pas notre cas)
- Production volume pro (4+ episodes/mois)
- Equipe avec competence AE existante
- Budget plugin $255 + abo Mapdata

## Fichiers reference dans projet

- Pipeline complet : memory/atlas-mansa-moussa/LEARNINGS-V2-VECTOR-PIPELINE.md
- Composition template : `quebec-jacques-poc/src/AtlasV2GlobeTest.tsx` + `AtlasV2SceneS3Test.tsx`
- Precompute script : `quebec-jacques-poc/scripts-atlas/precompute-atlas-v2-data.mjs`
- Data extracted : `quebec-jacques-poc/src/atlas-v2-data.json` (1.2 MB, 4 datasets)
- **Geo elargie Gazoduc** (2026-08-04) : `scripts/tools/generate-gazoduc-geo-elargie.mjs` genere
  `src/projects/_rnd/d3-16x9/gazoducGeoElargie.json` — 76 pays (Afrique + voisins : Bresil/Venezuela,
  Europe complete, Moyen-Orient) vs les 54 pays de l'original Afrique seule, meme fitExtent. Reutilisable
  pour tout futur beat carte D3 necessitant un cadrage plus large que l'Afrique stricte.

## ⛔ GOTCHA — lookup par nom : l'ACCENT fait partie de la clef (echec SILENCIEUX)

Les noms de pays du GeoJSON sont accentues tels quels : **`"Côte d'Ivoire"`**, pas `"Cote d'Ivoire"`.
Un `byName("Cote d'Ivoire")` renvoie `undefined` **sans aucune erreur** — le `.filter(Boolean)` habituel
l'absorbe, le trace se construit quand meme, et le pays est simplement **saute en silence**. Aucun crash,
aucun warning : le seul symptome est un pays manquant a l'ecran, invisible si on ne compare pas au script.
(Vecu 2026-08-15, Gazoduc Acte 4B : le trace cotier AAGP sautait la Cote d'Ivoire.)

**Reflexe** : apres tout ajout de pays par NOM dans une carte D3, verifier VISUELLEMENT que chacun est
bien la — ne pas se contenter de « le code ne plante pas ». En cas de doute :
`node -e "console.log(JSON.parse(require('fs').readFileSync('<geo>.json')).countries.map(c=>c.name))"`.

## ⭐ Projeter de VRAIES coordonnees lon/lat dans un fond de carte deja genere

Pour poser un point reel (ville, terminal, champ) sur un fond `gazoducGeoElargie.json`, il faut rejouer
**EXACTEMENT** la projection du generateur — toute autre projection decale les points :
`geoMercator().fitExtent([[80, 90], [1840, 918]], <FeatureCollection AFRIQUE SEULE>)`.
Les voisins (Europe, Moyen-Orient) sont projetes avec cette meme fonction et debordent naturellement.
⛔ Ne jamais placer un repere geo « a l'oeil » sur la carte (regle geo-zero-approximation).
