---
name: d3-geo — Comparaison de surfaces (principe thetruesize.com)
description: Technique pour superposer des pays à leur vraie taille relative sur une carte Mercator. Validée "La Vraie Taille de l'Afrique" 2026-05-11.
type: reference
---

# d3-geo — Comparaison de surfaces

> Validé : 2026-05-11 sur "La Vraie Taille de l'Afrique"
> Fichiers de référence :
> - `scripts/precompute-vraie-taille.mjs` — script precompute complet
> - src/projects/souverain/vraie-taille-afrique/Beat2Silhouettes.tsx — composant Remotion
> - src/projects/souverain/vraie-taille-afrique/geo-data.json — output precompute

---

## Principe

En Mercator, les pays à haute latitude (USA, Europe, Russie) sont visuellement gonflés.
Pour montrer les vraies tailles relatives, il faut **translater les coordonnées GeoJSON
du pays source vers la latitude du pays cible avant de projeter**.

C'est le principe de thetruesize.com — quand on déplace un pays vers l'équateur,
Mercator affiche sa taille honnête.

---

## Pipeline en 2 étapes

### Étape 1 — Precompute (Node.js, build-time)

```js
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature, merge } from "topojson-client";

// Projection centrée sur le pays CIBLE (ex: Afrique)
const PROJECTION = geoMercator()
  .center([20, -5])   // centre Afrique
  .scale(420)          // échelle = zoom ~2.7 pour 1080px
  .translate([540, 844]);

// Centre géo cible
const AFRICA_GEO_CENTER = [20, 0];

function translateToTarget(feature) {
  const centroid = geoCentroid(feature);
  const dLon = AFRICA_GEO_CENTER[0] - centroid[0];
  const dLat = AFRICA_GEO_CENTER[1] - centroid[1];

  function translateCoords(coords) {
    if (typeof coords[0] === "number") return [coords[0] + dLon, coords[1] + dLat];
    return coords.map(translateCoords);
  }
  function translateGeometry(geom) {
    if (!geom) return geom;
    if (["MultiPolygon","Polygon","LineString","MultiLineString","MultiPoint"].includes(geom.type))
      return { ...geom, coordinates: translateCoords(geom.coordinates) };
    if (geom.type === "GeometryCollection")
      return { ...geom, geometries: geom.geometries.map(translateGeometry) };
    return geom;
  }
  return { ...feature, geometry: translateGeometry(feature.geometry) };
}

function computeOverlay(feature, label) {
  const translated = translateToTarget(feature);
  const d = pathGen(translated) ?? "";
  const bounds = pathGen.bounds(translated);
  const [[x0,y0],[x1,y1]] = bounds;
  const cx = (x0+x1)/2, cy = (y0+y1)/2;
  // dx/dy = offset pour centrer sur le centre pixel du pays cible
  return { label, path: d, cx, cy, dx: africaCX-cx, dy: africaCY-cy, w: x1-x0, h: y1-y0 };
}
```

**Output JSON** : `{ overlays: { usa, china, india, europe }, africa: { path, cx, cy, w, h }, world: { paths } }`

### Étape 2 — Composant Remotion (runtime)

```tsx
// ClipPath = contour exact du pays cible
<clipPath id="africa-clip">
  <path d={geoData.africa.path} />
</clipPath>

// Silhouette translatée + clippée
<g clipPath="url(#africa-clip)">
  <g transform={`translate(${overlay.dx}, ${overlay.dy})`}>
    <path d={overlay.path} fill={color} fillOpacity={opacity} />
  </g>
</g>
```

---

## USA — règle obligatoire

Toujours utiliser `public/_shared/geo-data/us-48states.json` (48 états contigus).
Alaska déforme massivement même corrigé à lat=0. Convention universelle des infographies.

---

## Gotchas

- **Ne pas utiliser Mapbox** pour ce type de comparaison — Mapbox ne peut pas déplacer des polygones
- **Mercator OBLIGATOIRE** pour ce sujet précis — montrer le biais Mercator en Mercator est narrativement correct
- **clipPath sur contour exact** (pas bbox rectangle) — sinon les silhouettes débordent visuellement
- **Precompute obligatoire** — calculer les paths à runtime = trop lent pour Remotion
- **geo-data.json = 2MB** — normal (241 pays × paths SVG complets)

## Animation pattern validé (Beat2Silhouettes.tsx)

- Pays arrivent séquentiellement depuis hors-champ (startOffsetX/Y)
- Légère rotation initiale (`rotate(12, cx, cy)`) → retombe à 0 via spring
- Opacity : monte à 0.65 → dim à 0.40 quand tous arrivés
- Zoom-out léger à la fin pour montrer l'ensemble
- Labels : fade-in 15f après la silhouette, fade-out quand suivant arrive

## Cas d'usage futurs

- "La forêt amazonienne dans l'Afrique"
- "La Russie à sa vraie taille vs Mercator"
- "L'Empire Mongol vs pays modernes"
- Tout épisode comparant des surfaces géographiques
