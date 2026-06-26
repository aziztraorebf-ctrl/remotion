# Mapbox MCP Server — Règles et coordonnées validées

## Installation (2026-05-09)

Serveur ajouté dans `.mcp.json` du projet :
```json
"mapbox": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@mapbox/mcp-server"],
  "env": { "MAPBOX_ACCESS_TOKEN": "<voir .env REMOTION_MAPBOX_TOKEN>" }
}
```
Token utilisé : `REMOTION_MAPBOX_TOKEN` (pk. = token public, OK pour MCP).

## Catalogue capacités — par cas d'usage narratif

> Lire ce catalogue AVANT de coder toute scène avec carte. Cocher ce qui s'applique.

### Placement et précision géographique
| Besoin | Outil MCP | Exemple Hannibal / Souverain |
|--------|-----------|------------------------------|
| Centroïde exact d'un pays ou ville | `search_and_geocode_tool` | "Niger", "Niamey", "Carthage" |
| Bounding box d'un territoire | `bbox_tool` | Encadrer l'Afrique du Nord pour cadrage caméra |
| Vérifier qu'un sprite est dans le bon pays | `point_in_polygon_tool` | Éléphant posé en mer → bug impossible désormais |
| Placer un label au centroïde exact | `search_and_geocode_tool` → `coordinates` | Label "Niger" centré sur le vrai territoire |

### Mouvement et trajectoires
| Besoin | Outil MCP | Exemple Hannibal / Souverain |
|--------|-----------|------------------------------|
| Distance réelle entre deux points | `directions_tool` | Carthage → Alpes = 2 097 km exact |
| Point à mi-chemin sur un trajet | `midpoint_tool` | "Jour 15" posé exactement entre Rhône et Alpes |
| Point à X km dans une direction | `destination_tool` | Camp d'Hannibal après 3 jours de marche |
| Angle d'orientation entre deux villes | `bearing_tool` | Sprites éléphants orientés vers le nord-ouest (pas à l'œil) |
| Matrice distances multi-villes | `matrix_tool` | Réseau routes commerciales Ibn Battuta en 1 appel |

### Zones et territoires
| Besoin | Outil MCP | Exemple Hannibal / Souverain |
|--------|-----------|------------------------------|
| Zone atteignable en X heures/jours | `isochrone_tool` | "Territoire sous contrôle carthaginois après 10 jours" |
| Fusionner plusieurs pays en un polygone | `union_tool` | Empire carthaginois = Tunisie + Algérie + Espagne du Sud |
| Intersection de deux territoires | `intersect_tool` | Zone de conflit entre deux empires |
| Différence (territoire A moins B) | `difference_tool` | Ce qu'Hannibal a conquis mais pas encore consolidé |
| Simplifier un polygone pour perf | `simplify_tool` | GeoJSON allégé pour render Remotion fluide |

### Validation et debug
| Besoin | Outil MCP | Exemple |
|--------|-----------|---------|
| Vérifier coordonnées existantes dans le code | `search_and_geocode_tool` | Comparer hardcodé vs MCP, corriger si écart >50km |
| Aperçu carte sans lancer Remotion | `static_map_image_tool` | PNG de validation avant de coder une scène |
| Point le plus proche d'une route | `nearest_point_on_line_tool` | Hannibal — col exact sur la ligne de crête des Alpes |

---

## Outils disponibles (validés)

| Outil | Usage |
|-------|-------|
| `search_and_geocode_tool` | Géocoder villes, pays, lieux → lon/lat précis |
| `reverse_geocode_tool` | lon/lat → nom du lieu |
| `directions_tool` | Distance et durée entre 2 points |
| `place_details_tool` | Détails d'un lieu (photos, horaires, etc.) |
| `category_search_tool` | Chercher par type de lieu |
| `static_map_image_tool` | Générer une image de carte statique |
| `distance_tool`, `midpoint_tool`, `bbox_tool` | Calculs géospatiaux Turf.js |

## Règles d'utilisation

**TOUJOURS utiliser le MCP pour toute coordonnée** — jamais hardcoder à la main.

### Géocoder un pays
```
search_and_geocode_tool(q: "Niger", types: ["country"])
```
Retourne le centroïde officiel du pays. Utiliser pour placer labels et caméra.

### Géocoder une ville
```
search_and_geocode_tool(q: "Tombouctou", country: ["ML"])
```
Toujours passer `country` pour éviter les homonymes USA.

### Gotcha — homonymes
`search_and_geocode_tool("Carthage")` retourne Carthage, Missouri USA en premier.
→ Toujours passer `country: ["TN"]` ou `proximity` près du lieu cible.
→ Carthage antique (Tunisie) = site archéologique, non géocodable directement. Utiliser Tunis (`10.1858, 36.8002`).

## Coordonnées validées (prêtes à réutiliser)

| Lieu | Longitude | Latitude | Notes |
|------|-----------|----------|-------|
| Tunis (= Carthage antique) | 10.1858 | 36.8002 | Hannibal point de départ |
| Tombouctou, Mali | -3.0138 | 16.7874 | Projet Mansa Moussa |
| Col du Mont-Genèvre (Alpes) | 6.6272 | 44.9274 | Traversée Hannibal |

## Test de distance validé

Tunis → Col du Mont-Genèvre : **2 097 km** route, ~27h.
Cohérent historiquement avec la traversée d'Hannibal (218 av. J.-C.).

## Note Hannibal — Premier terrain de test MCP (session suivante)

Quand on reprend Hannibal, tester dans cet ordre :
1. `search_and_geocode_tool` → vérifier toutes les coordonnées hardcodées existantes (Rhône, Mont-Genèvre, Rome, Carthage)
2. `bearing_tool` → orienter les sprites éléphants automatiquement selon la vraie direction de marche
3. `isochrone_tool` → visualiser la zone d'avancée de l'armée par étape (Beat 2 Rhône, Beat 3 Alpes)
4. `static_map_image_tool` → PNG de validation avant de coder chaque beat
5. `point_in_polygon_tool` → vérifier que chaque sprite est bien posé dans le bon territoire

### Priorité : tester les batailles schématiques AVANT Cavalry

Pour les scènes de bataille (Tessin, Trébie, Cannes) — **tester d'abord l'approche schématique en Remotion pur** avant de se lancer dans Cavalry.

Ce qu'une bataille schématique permet avec le MCP :
- Flèches directionnelles orientées via `bearing_tool` (angle exact de l'attaque carthaginoise)
- Zones colorées qui avancent/reculent (polygones Turf.js animés frame par frame)
- Encerclement de Cannes visualisé via `union_tool` + animation Remotion
- Positions des deux armées placées via `destination_tool` à distance réelle l'une de l'autre
- Chiffres des pertes qui apparaissent au bon endroit géographique

Style : carte militaire historique type Arte/documentaire — lisible, précis, faisable sans Cavalry.

**Décision à prendre en session Hannibal** : si la bataille schématique est suffisamment lisible et impactante → on garde. Si trop abstraite pour l'émotion voulue → on évalue Cavalry en complément. Ne pas partir sur Cavalry sans avoir d'abord testé le schématique.

## Règle universelle — tous projets utilisant Mapbox

S'applique à **Atlas, Souverain, et tout projet futur avec Mapbox**.

### Ordre de priorité strict (NON-NEGOTIABLE)

1. **MCP Mapbox en premier** — toujours, pour toute donnée géospatiale (coordonnées, distances, geocoding, GeoJSON)
2. **API REST Mapbox** (curl/fetch) — uniquement si le MCP est défaillant ou non fonctionnel après 2-3 essais, ou si la fonction requise n'existe pas dans le MCP
3. **Coordonnées hardcodées** — INTERDIT. Jamais de lon/lat inventé à la main.

Le bug Niger (label décalé par rapport au polygone) vient de coordonnées hardcodées approximatives.
Avec `search_and_geocode_tool`, le centroïde correspond exactement aux vraies frontières Mapbox
→ label toujours centré sur le bon territoire, quel que soit le projet.

---

## Caméra, projection, mouvements et transitions de style

> Règles caméra/projection/blur/mouvements catalogués → **`memory/doctrines/DOCTRINE-SOUVERAIN.md` sections 3.1-3.9** (source de vérité).

---

## Techniques overlay validées headless (2026-05-26)

Toutes testées dans `MapboxOverlayLab` — render chrome-headless-shell confirmé.

### Champ ISO obligatoire — country-boundaries-v1
- **TOUJOURS** `iso_3166_1_alpha_3` : `"SEN"`, `"NGA"`, `"GHA"`, etc.
- **JAMAIS** `iso_3166_1_numeric` ("686", "566"...) — ne filtre pas en headless
- Source partagée : `mapbox://mapbox.country-boundaries-v1`, source-layer : `country_boundaries`

### Fill-pattern (drapeau sur territoire)
```ts
map.addImage("flag-sn", { width, height, data: ctx.getImageData(...).data });
map.addLayer({ type: "fill", paint: { "fill-pattern": "flag-sn" },
  filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"] });
// Tiling automatique sur toute la superficie
// Opacité animable via setPaintProperty("fill-opacity", t)
```

### Canvas animé (drapeau ondulant frame par frame)
- `map.updateImage("id", { width, height, data })` **fonctionne en headless** ✅
- Appeler à chaque frame dans le useEffect sans deps
- Fallback : si `updateImage` throw → removeImage + addImage
- Résultat : mosaïque de l'image canvas qui ondule sur tout le territoire

### Fill-extrusion 3D
```ts
map.addLayer({ type: "fill-extrusion", paint: {
  "fill-extrusion-color": "#c8a951",
  "fill-extrusion-height": 0,   // animer via setPaintProperty
  "fill-extrusion-opacity": 0.85,
}});
// Pitch ≥ 30° obligatoire pour que l'effet soit visible
// Hauteurs en mètres — Nigeria PIB ~ 180000, Ghana ~ 80000, Sénégal ~ 45000
```

### Line dasharray tracé progressif
```ts
// dasharray [filled, gap] — faire varier filled de 0→20 sur tScene
const drawn = easeInOut(tScene) * 20;
map.setPaintProperty("layer", "line-dasharray", [drawn, Math.max(0, 20 - drawn)]);
```

### Markers spring pop séquentiel
```ts
// DOM marker + transform scale via el.style.transform = `scale(${springBounce(t)})`
// Délai par index : tLocal = clamp01((tScene - i * 0.08) / 0.3)
// Pulse continu après apparition : scale = 1 + sin(t * PI * 4) * 0.15
```

### Gradient canvas animé (vague, radial, multi-pays)
```ts
// Gradient vague horizontal — phase = (frame/fps) * 0.6
const grad = ctx.createLinearGradient(waveX - w*0.3, 0, waveX + w*0.5, 0);
grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(0.6, "rgba(200,169,81,0.85)");

// Gradient radial pulsant — pulse = (sin(t * PI * 1.2) + 1) / 2
const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
// Le tiling Mapbox crée une mosaïque de halos = effet premium
```

### Noise organique (territoire vivant)
```ts
// Pseudo-Perlin via sin harmoniques — canvas 256×256 pour résolution correcte
const noise = sin(nx*8 + t*2.1)*0.35 + sin(ny*6 + t*1.7)*0.25 + ...
// Peindre pixel par pixel via ctx.createImageData() + putImageData()
// Palette or/ambre : R=180+v*60, G=120+v*60, B=20+v*30, A=v*200
```

### Watermark SVG texte répété
```ts
// Canvas 200×150, grille 2×2, texte incliné -PI/8
ctx.font = `bold ${h*0.28}px monospace`;
ctx.rotate(-Math.PI / 8);
ctx.fillText("$47B", ...);
// Résultat : chiffre clé en mosaïque dense sur tout le territoire
```

### Lottie + fill-pattern : quoi utiliser quand (2026-05-26)
- **fill-pattern Mapbox = TILING mosaïque** — l'image se répète sur le territoire
- **OK ✅** : textures organiques continues qui couvrent tout le canvas
  - Fumée (smoke.json premium dans `public/_shared/lottie/smoke.json`) → champ pétrolier, pollution, production
  - Eau, vagues, feu, particules denses → atmosphère
  - Gradients, noise → effets de surface
- **PAS OK ❌** : éléments localisés (pulse anneaux, markers, points uniques)
  - Le tiling répète l'élément en grille → perd son sens de "point unique"
  - Solution alternative : **DOM markers Mapbox** (technique Spring Pop validée Overlay v1)
- Showcase narratif v1 : https://files.catbox.moe/bj078h.mp4 (S2 smoke = star, autres scènes = leçon)

### Lottie off-screen — RÉSOLU headless (2026-05-26) ✅
- `lottie-web` installé, import statique : `import lottie from "lottie-web"`
- **Pattern validé headless chrome-headless-shell :**
```ts
// 1. Container div caché dans le body — Lottie EXIGE un container DOM
const lottieContainer = document.createElement("div");
lottieContainer.style.cssText = "position:absolute;opacity:0;left:-9999px;top:-9999px;width:128px;height:128px;";
document.body.appendChild(lottieContainer);

// 2. loadAnimation SANS context — Lottie crée son propre canvas
const anim = lottie.loadAnimation({
  container: lottieContainer, animationData: lottiJson,
  renderer: "canvas", loop: true, autoplay: false,
  rendererSettings: { clearCanvas: true, progressiveLoad: false },
} as any);

// 3. Récupérer le canvas créé par Lottie dans le container
anim.addEventListener("DOMLoaded", () => {
  const created = lottieContainer.querySelector("canvas") as HTMLCanvasElement;
  if (created) lottieCanvasRef.current = created;
});

// 4. Par frame : goToAndStop puis pushCanvas → updateImage vers Mapbox
anim.goToAndStop(sceneFrame % 30, true);
pushCanvas(map, "img-lottie", lottieCanvasRef.current);
```
- **Erreur piège** : passer `context` dans `rendererSettings` → Lottie l'ignore et crée quand même son canvas → notre canvas reste vide
- **Erreur piège** : `require("lottie-web")` dans useEffect → objet vide (bundler ESM) → utiliser import statique
- Résultat : mosaïque de l'animation Lottie qui se tile sur tout le territoire

### Gestion layers entre scènes
- Les layers s'accumulent sur la même map instance — en production, cleanup explicite à chaque entrée de scène
- Pattern : `if (map.getLayer(id)) map.removeLayer(id)` avant `addLayer`
- Source `cb-source` partagée entre toutes les scènes, créée une seule fois
