# Règles outils techniques — Remotion, PixelLab, Mapbox, Audio (consolidé)
> Fusion de : feedback_remotion-lottie-headless-broken, feedback_pixellab-animations-spritesheet, feedback_pixellab-objects-vs-characters, feedback_pixellab-rpg-pattern, feedback_mapbox-overlay-svg-vs-layer, feedback_minimax-fal-api-status-endpoint, feedback_audio-overlap-trim-after, feedback_geo-zero-approximation, feedback_geojson-natural-earth-50m, feedback_historical-basemaps-empires-medievaux, feedback_static-maps-vs-mapbox-runtime, feedback_montagne-overlay-test, feedback_gemini-style-annotations-leak
> Mis à jour : 2026-05-08

---

## SECTION 1 — Remotion : Lottie règles canoniques

**Pattern require() obligatoire :**
```tsx
const animationData = require("./mon-animation.json");
<Lottie animationData={animationData} loop style={{ width: 300, height: 300 }} />
```
INTERDIT : fetch + delayRender externe. Double delayRender = conflit → timeout 28s.

**4 règles JSON critiques (sinon crash silencieux lottie-web) :**
1. Keyframes avec `s` ET `e` explicites : `{"t":0, "s":[85,85], "e":[100,100], "i":{...}, "o":{...}}`
2. Bezier handles : arrays par dimension — 3D scale : `"x":[0.42,0.42,0.42], "y":[1,1,1]`
3. Cohérence dimensionnelle : si position 3D `[60,60,0]` → scale aussi `[100,100,100]`
4. Groupes `gr` DOIVENT contenir `"ty":"tr"`. Alternative : mettre fill directement après chaque shape.

**Peut faire :** primitives geo, couleurs/gradients, trim path, animations propriété, easing bezier.
**Ne peut pas :** path bezier >10 vertices, logo réaliste, path morphing, particules, glow headless.
**Utiliser pour :** icônes géométriques simples, pulse, rotate, fade, slide, breathe, cercles d'écho.
**Ne pas utiliser pour :** silhouettes personnage (→ PixelLab), géo (→ d3-geo), artwork existant.

---

## SECTION 2 — PixelLab : recettes production Atlas

### map_object > Lottie > SVG pour illustrer cartes Atlas

map_object génère en 30-60s, qualité premium (relief 3D, ombres), fond transparent, sans animation requise. Lottie limité à ~10 vertices = lingot ressemble à un trapèze géométrique (indéfendable).

**Recipe génération :**
```typescript
mcp__pixellab__create_map_object({
  description: "[OBJET CONCRET] [contexte historique], [matériau], isolated on transparent background, pixel art style matching ATLAS palette: [hex colors], no text",
  width: 96, height: 96,
  view: "high top-down",  // ou "side" pour profil
  detail: "high detail",
  shading: "detailed shading",
  outline: "single color outline",
})
```

**Intégration Remotion :**
```tsx
<image href={staticFile("...")} x={poiX-44} y={poiY-44} width="88" height="88"
  preserveAspectRatio="xMidYMid meet"
  style={{ imageRendering: "pixelated" }} />  // OBLIGATOIRE
```
Breathing léger : `const breathing = 1 + 0.04 * Math.sin(localFrame * 0.08)` suffit — pas besoin d'animation PixelLab.

### Pipeline animation PixelLab → spritesheet → Remotion clipPath

1. `mcp__pixellab__animate_object({object_id, animation_description, frame_count: 4})`
2. `ffmpeg -i input.gif -vf "scale=112:112,tile=4x1" output-sheet.png`
3. Dans Remotion : `const animFrame = Math.floor(localFrame / FRAMES_PER_ANIM_FRAME) % NUM_FRAMES`
4. Translate horizontale spritesheet via clipPath SVG + `x={-DISPLAY_SIZE/2 - animFrame * DISPLAY_SIZE}`

### Pattern RPG signature Atlas

Différenciateur vs concurrents (stock footage / IA incohérente / statique).

**Patterns prouvés :**
- Camera-track sprite sur carte : walk + caméra suit position SVG (`svgToCompWithCam`) + zoom 2.5x
- Formation file indienne : leader + suiveurs avec retard temporel 10-22 frames + décalage spatial
- Custom animation pour moments signature (war-cry, idle spécial) — 25 generations chacune, réserver aux moments clés
- map_object plein détail (ville, monument) persistant plusieurs scènes

**Possibilités à explorer :** scène village (sprites idle), bataille (formations qui convergent), marché (3-5 sprites), caravane longue (5+), conseil de chefs.

**Sujets idéaux :** Hannibal (formations militaires), Songhai (Tombouctou bibliothèques), Royaume Kongo, Aksum.

**Pièges walk cycle :**
- `archive/<perso>-east/frame_XXX.png` = 6 designs alternatifs, PAS un walk cycle → effet "palpitation" désastreux
- Vrais walk cycles = `characters/<perso>/animations/<animation-id>/<direction>/frame_XXX.png`
- Avant boucle : Read 3 frames espacées et vérifier continuité visuellement

---

## SECTION 3 — Mapbox : règles Remotion headless

### Layers vector ne fonctionnent PAS en headless globe mode

`map.addLayer` + `setPaintProperty` = invisible (testé exhaustivement ~6 itérations, Atlas Tombouctou 2026-04-29).
Cause : en mode globe + hillshade, les fills vector sont composés AVANT le hillshade. `addLayer` dans `style.load` peut ne pas être appliqué avant capture canvas. `setPaintProperty` ne déclenche pas re-render synchrone.

**Solution : overlay SVG React par-dessus `<div>` Mapbox :**
```tsx
const pts = MALI_POLYGON.map(([lo, la]) => {
  const p = mapRef.current!.project([lo, la]);
  return `${p.x},${p.y}`;
});
// JSX :
<svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}>
  <polygon points={maliPolyPx} fillOpacity={interpolatedOpacity} />
</svg>
```
Avantages : 100% prévisible headless, animation frame-by-frame, effets SVG disponibles.

### Cartes statiques vs Mapbox-gl runtime — pivot architectural

Pour Shorts narratifs avec personnages animés et dynamisme TikTok : **cartes statiques pré-rendues + Remotion compositing** > Mapbox-gl runtime.

Cas d'usage Mapbox-gl runtime justifié : compositions purement cartographiques sans sprites, mouvements caméra avancés (rotation globe, globe mode), data viz Mapbox native (choropleth, heat map).

### Montagne overlay (test validé, limites connues)

PixelLab map_object montagne sur carte = fonctionne techniquement, bon pour repère géographique passager. Insuffisant pour climax (Hannibal Alpes). Pour wow effect : Seedance hybrid ou Remotion 3D R&D requise.

### ⚠️ Dette connue : `filter: blur()` CSS DOM en dur dans `SenegalActe2Continu.tsx` (à corriger si retouché)

`src/projects/souverain/senegal-petrole-gaz/SenegalActe2Continu.tsx` (lignes 460, 731) utilise `filter:
blur()` CSS sur un élément DOM — contraire à la doctrine headless-safe ci-dessus (comportement
imprévisible en Chrome headless, même esprit que l'interdiction CSS transition/@keyframes). Découvert
2026-07-10 en cherchant une alternative pour un effet de whip pan sur Soudan Acte 3. **Alternative
conforme** : `<feGaussianBlur stdDeviation={interpolate(frame,...)} />` dans un `<filter>` SVG natif
appliqué à un `<g>` — prévisible en headless car c'est un filtre SVG du DOM, pas un `style.filter` CSS
sur un canvas/div. Pas urgent, à corriger si ce composant est retouché.

### Bug globe headless DISTINCT du bug "layers ADDED" ci-dessus : tuiles vector natives du style de base

Testé 2026-07-10 (proto `GlobeSoudanDubaiTest.tsx`, Soudan Acte 3, écarté pour cette raison) : en mode
`projection:{name:'globe'}`, les tuiles vector NATIVES du style de base (`land`/`water`/`admin-0-boundary`
— pas des layers ajoutés via `addLayer`, ceux-là sont couverts par le bug documenté plus haut) ne se
chargent quasi jamais à temps avant la capture canvas headless. Résultat : disque uni (juste le fond
`space-color`/étoiles du `setFog`) pendant ~95% du render, les continents n'apparaissent que dans les
toutes dernières frames. Confirmé avec le bon script (`render-mapbox.sh`, chrome-headless-shell +
`--gl=angle`), donc pas un problème de moteur de rendu. Piste non testée pour un futur essai : attendre
`map.once('idle')` (au lieu de `style.load`) avant de commencer la capture, ou pré-chauffer les tuiles en
amont du render. Style/direction artistique validée (fidèle à la référence testée) — seul le TIMING de
chargement est cassé.

---

## SECTION 4 — Audio : règles assemblage Remotion

### trimAfter obligatoire (anti-overlap)

Quand un beat individuel a `<Audio src startFrom>`, l'audio joue jusqu'à la fin de la Sequence parent par défaut → overlap avec le beat suivant.

**Règle :** toujours ajouter `trimAfter={frameLastSegmentAudio}` sur tout `<Audio>` beat individuel.
```tsx
<Audio src={staticFile("...")} trimBefore={5} trimAfter={153} />
```
`trimAfter` = frames du fichier source (pas frames composition). En Remotion v4, `endAt/startFrom` dépréciés → utiliser `trimBefore/trimAfter`.

### Audio handoff master → beat dédié (trim chirurgical)

Quand Beat N (master) handoff Beat N+1 (audio dédié) qui rejoue le mot pivot : trim master 4-11 frames avant le mot pivot pour éviter doublon. Mini-render `--frames=N-M` AVANT Full. Validé Or Africain v6.

### Fichiers séparés par beat (anti-drift TTS)

Re-record d'un beat = fichier dédié + AUDIO_SEGMENTS RELATIVES, jamais splicer dans master.

---

## SECTION 5 — Géographie : règles zéro approximation

### Coordonnées — sources obligatoires
- POI capitale → coordonnées Wikipedia exactes
- Polygone empire → croisé avec Britannica/Euratlas/sources historiques
- Routes → plausibilité historique vérifiée
- Écart > 50 km sur POI critique → corriger AVANT de coder

**Jamais :** polygone dessiné "ça ressemble", coordonnées inventées, routes "qui semblent plausibles".

### Tracés pays = Natural Earth 50m obligatoire
JAMAIS écrire un polygone GeoJSON à la main. Toujours Natural Earth 50m pour fidélité géographique BBC/NatGeo.

### Empires historiques = aourednik/historical-basemaps
GitHub CC BY-SA 4.0, par siècle (`world_1300.geojson`). Validé Empire Ghana + Mali Empire (52 vertices). Quand OHM absent.

---

## SECTION 6 — Minimax fal.ai : endpoint status change

JAMAIS hardcoder `/v2.6/requests/{id}/status`. Toujours utiliser le `status_url` retourné par le submit response.

```python
data = requests.post(url, json=payload, ...).json()
status_url = data.get("status_url", "")  # use this exact URL
requests.get(status_url, ...)  # poll here
```

**Symptôme bug :** HTTP 405 Method Not Allowed sur poll status → URL hardcodée avec `v2.6` dans le path. Depuis 2026-04-29, fal.ai a changé le routing, le `status_url` retourné n'a plus `v2.6`.

---

## SECTION 7 — Rythme animation Souverain

- **Max 5s sans changement visuel** (jamais de zone morte)
- **Min 2s entre changements majeurs** (laisser respirer)
- **Mouvement permanent toujours présent** : grain shift, breathing, marching ants — jamais 0 motion
- **Springs amortis** : `damping: 80-100`, `stiffness: 50-70`, `durationInFrames: 25-35`

Règle calibrée sur la voix Souverain (débit lent journalistique). Atlas/data-viz peut aller 2-3s parce que la voix est rapide. Souverain non.

**Beat 14s** : 4-7 événements, chacun calé sur un mot-pivot du forced alignment.
**Beat 22s** (type bras de fer) : 8-12 événements, rythme dossier qui se construit.

---

## SECTION 8 — Split-screen Souverain (template officiel — 2 variantes)

### Variante A — SplitScreenSouverain (générique Tailwind) ⭐ DÉFAUT

**Composant** : `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx`
**Validé** : Beat 5 Zimbabwe Lithium 2026-05-13 (drapeau Chine vs carte Zimbabwe)
**Pattern** : Tailwind flex — zéro calcul de coordonnées, zéro constant manuelle
**Usage** : carte pays vs drapeau/logo, stat vs illustration, deux entités en tension

Structure canonique Tailwind :
```tsx
<SplitScreenSouverain
  left={{ asset: <svg>...</svg>, assetStartAt: 60, items: [
    { text: "$400M", startAt: 120, fontSize: 180, color: "#c8a951", font: "bebas" },
    { separator: true, text: "HARARE · ZIMBABWE", startAt: 150, fontSize: 38, font: "mono" },
  ]}}
  right={{ asset: <Img src={staticFile("flag.png")} />, assetStartAt: 210, items: [
    { text: "HUAYOU COBALT", startAt: 250, fontSize: 82, font: "bebas" },
    { separator: true, text: "ZHEJIANG, CHINE", startAt: 250, fontSize: 34, font: "mono" },
  ]}}
  subtitle="Huayou Cobalt investit 400 millions de dollars."
  subtitleStartAt={385}
/>
```

Règles clés :
- `aspectRatio` sur l'asset = hauteur visuelle identique des deux côtés
- `flex-shrink-0` sur asset + `flex-1 justify-around` sur textes = distribution automatique
- `pb-[200px]` sur colonnes réserve la zone sous-titre
- ffmpeg colorkey pour PNG fond noir : `ffmpeg -i in.png -vf "colorkey=0x000000:0.15:0.1" -update 1 out.png`

---

### Variante B — Split-screen illustration + Mapbox (haut/bas)

Validé Beat 5 Niger uranium v4. Réutiliser tel quel pour tout split-screen Souverain avec Mapbox.

### Architecture

```
TOP HALF  : 2 PNG full-scene Gemini (sujet + fond intégré — jamais d'éléments séparés)
SÉPARATEUR: ligne gold horizontale 1px
BOTTOM HALF: Mapbox Mercator + Caspian Sepia + symboles masqués
```

### Illustrations (top half) — règle absolue

**Un seul PNG par panneau**, sujet + fond intégré. Jamais de compositing CSS.
Prompt Gemini canonique :
```
Flat editorial vector illustration filling the ENTIRE portrait frame edge to edge.
Background: cream-sand colored paper #e8d8b8. Foreground: [sujet].
Single complete scene, like a finished editorial poster panel.
CRITICAL: NO text, NO letters, NO numbers, NO labels, NO logos.
Flat 2D vector aesthetic, no 3D, no shadows.
```

### Mapbox (bottom half) — setup obligatoire

```ts
const map = new mapboxgl.Map({
  center: [10, 30], zoom: 1.95,
  projection: { name: "mercator" },  // CRITIQUE — sinon globe par défaut
  interactive: false, attributionControl: false,
  preserveDrawingBuffer: true, fadeDuration: 0,
});
map.on("style.load", () => {
  applySepia(map);
  // Masquer TOUS les labels natifs Mapbox
  for (const layer of map.getStyle().layers ?? [])
    if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
});
```

### Plates labels — template validé

Dark navy + barre gold + texte blanc IBM Plex Mono, **au-dessus du dot** :
```tsx
<g transform={`translate(${pt.x} ${pt.y})`}>
  <circle r={11} fill={CASPIAN_SEPIA.highlightOr} stroke="#0d1525" strokeWidth={3} />
  <g transform="translate(-78 -56)">
    <rect width={156} height={36} rx={4} fill="#0d1525" opacity={0.92} />
    <rect width={3} height={36} fill={CASPIAN_SEPIA.highlightOr} />
    <text x={78} y={16} fontFamily="'IBM Plex Mono', monospace" fontSize={17}
          fill="#ffffff" fontWeight={700} textAnchor="middle">NOM PAYS</text>
    <text x={78} y={30} fontFamily="'IBM Plex Mono', monospace" fontSize={11}
          fill={CASPIAN_SEPIA.highlightOr} textAnchor="middle">SOUS-TITRE</text>
  </g>
</g>
```

### Timing arcs — règle "respirer 8 secondes"

Déclencher la **préparation** (arc qui se trace) ~8s AVANT le mot-pivot. Quand le mot arrive : **pulse halo** sur l'élément déjà présent, pas un nouveau déclenchement.

### INTERDIT dans split-screen Souverain

- Bandeau header décoratif ("LE NIGER DOIT TENIR")
- Sub-labels sous les illustrations
- Badge VS au centre — documenter une asymétrie, pas opposer
- Caption bottom redondante avec la voix-off

---

## SECTION 9 — Gemini : drift annotations typographiques

Si prompt Gemini mêle texte à rendre et indications de style ("IBM Plex Mono 24px opacity 70%"), Gemini peut écrire l'annotation style littéralement dans l'image rendue.

**Solution :** sortir les annotations style des blocs guillemets. Les mettre en commentaires ou parenthèses hors du texte à rendre.

Cas : Niger uranium S4 2026-05-07.
