---
name: Souverain — Template officiel split-screen illustration + Mapbox
description: Pattern validé Aziz Jour 7 sur Beat 5 Niger uranium v4. Template canonique pour tout split-screen Souverain combinant illustration éditoriale (top) et carte Mapbox (bottom) — à réutiliser tel quel.
type: feedback
---

# Template officiel split-screen Souverain (validé Beat 5 Niger uranium v4)

**Validé Aziz Jour 7 (2026-05-10) :** "à partir de maintenant qu'on utilise ce template, c'est comme ça qu'on devrait placer le nom des pays et toutes les inserts qui apparaissent sur la map".

Référence vidéo : https://files.catbox.moe/fm22rq.mp4

## Architecture de base

```
┌─────────────────────────────────────┐  y=0
│  ┌──────────┐    ┌──────────┐       │
│  │ PANEL 1  │ │  │ PANEL 2  │       │   TOP HALF (height/2)
│  │ scène    │ │  │ scène    │       │   2 PNG full-scene Gemini
│  │ complète │ │  │ complète │       │   (chacun avec son fond intégré)
│  └──────────┘    └──────────┘       │
├─────────────────────────────────────┤  y=height/2 + séparateur gold horizontal
│                                     │
│         ┌─────┐                     │
│         │CAN  │     ┌─────┐         │   BOTTOM HALF (height/2)
│   ╲    └─────┘    │KAZ  │           │   Mapbox Mercator + Caspian Sepia
│    ╲              └─────┘           │   3 pays highlighted en gold
│     ╲    ┌─────┐    ╱               │   Arcs Bezier + dots avec plates
│      ╲   │NIG  │   ╱                │
│       ╲  └─────┘  ╱                 │
└─────────────────────────────────────┘  y=height
```

## Spécifications top half (illustration)

### Assets — TOUJOURS deux PNG full-scene complets

**Ne PAS** générer les éléments séparément (sujet + fond + objets séparés). Ça produit des compositions flottantes.

**OUI** générer **un seul PNG par panneau** avec :
- Sujet principal centré
- Fond intégré (dunes, paysage, etc.) directement dans la même image
- Composition cadrée comme une affiche éditoriale finie

**Dimensions recommandées** : 520x760 (ratio 9:13 portrait).

**Prompt Gemini canonique** :
```
Flat editorial vector illustration filling the ENTIRE portrait frame edge to edge.
Background: cream-sand colored paper #e8d8b8 with subtle paper grain texture,
[paysage intégré de fond — ex: low silhouette of beige-tan sand dunes #b89970].
Foreground: [sujet — ex: Sahel soldier silhouette in brown-sepia tone #6a4a28].
Single complete scene, like a finished editorial poster panel.
CRITICAL: NO text, NO letters, NO numbers, NO labels, NO logos, NO frame, NO border.
Flat 2D vector aesthetic, no 3D, no shadows, no gradients beyond [paysage].
Newspaper editorial illustration style, minimalist documentary aesthetic.
```

### Layout

- Background `#e8d8b8` solid sous les deux panneaux
- Paper grain `repeating-linear-gradient` avec `mixBlendMode: multiply`
- Panneau gauche : `width: width / 2`, `height: TOP_HALF`, `objectFit: cover`
- Panneau droit : idem en miroir
- Séparateur vertical fin : `linear-gradient(180deg, transparent, rgba(60,40,20,0.25), transparent)` 2px

### Animations

- Apparition séquentielle calée sur les mots-pivots de la voix-off (springs amortis Souverain : damping 90, stiffness 65, durée 28)
- Float permanent micro : `Math.sin(frame * 0.04) * 3` sur Y
- Drop-shadow flash conditionnel pour insistance narrative (insurrection, alerte) : 60 frames max
- **Top half dim de 1.0 → 0.32** au mot-pivot de transition vers la carte (pattern : "Orano, lui," = pivot narratif)

### INTERDIT

- Pas de bandeau header décoratif ("LE NIGER DOIT TENIR" et autres)
- Pas de sub-labels sous les illustrations ("SOLDATS · INSURRECTION", etc.)
- Pas de badge VS au centre — Souverain n'oppose pas, il documente une asymétrie

## Spécifications bottom half (Mapbox)

### Setup obligatoire

```ts
const map = new mapboxgl.Map({
  container: containerRef.current,
  style: "mapbox://styles/mapbox/light-v11",
  center: [10, 30],                       // équilibre Canada gauche / Kazakhstan droite
  zoom: 1.95,                             // assez large pour world, assez serré pour lisibilité
  projection: { name: "mercator" },       // CRITIQUE — sinon globe par défaut
  interactive: false,
  attributionControl: false,
  preserveDrawingBuffer: true,
  fadeDuration: 0,
});
```

### Style — toujours appliquer Caspian Sepia + hide labels

```ts
map.on("style.load", () => {
  applySepia(map);
  // Hide ALL native Mapbox text labels for clean editorial look
  const layers = map.getStyle().layers ?? [];
  for (const layer of layers) {
    if (layer.type === "symbol") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }
  // ... add country fill layers
});
```

### Highlight pays — fill Mapbox piloté par frame

Trois layers fill `country-boundaries-v1` filtrés par ISO alpha-3 :
- Niger (origine) — visible immédiatement à 0.85 opacity
- Pays cibles — opacité ramped via `setPaintProperty("fill-opacity", value)` dans `useEffect([frame, ready])`

**Pattern pulse sur le mot** :
```ts
const canadaFill = interpolate(
  frame,
  [arcStartF, arcStartF + 30, wordF, wordF + 15],
  [0, 0.55, 0.55, 0.85],   // ramp doux puis boost sur le mot
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
```

### Coords — TOUJOURS via MCP Mapbox (pas hardcodé)

```
mcp__mapbox__search_and_geocode_tool({ q: "McArthur River uranium mine Saskatchewan", country: ["CA"] })
→ [-105.052, 57.762]

mcp__mapbox__search_and_geocode_tool({ q: "Inkai uranium mine Kazakhstan", country: ["KZ"] })
→ [67.4, 45.0] (Cameco/Orano JV documentation, MCP n'a que centroid pays)
```

### Arcs Bezier — projection dynamique chaque frame

Calcul pixel-précis dans `useEffect([frame, ready])` :
```ts
const np = mapRef.current.project(NIGER_COORD);
setNigerPt({ x: np.x, y: np.y });
// idem pour les pays cibles
```

Path SVG quadratic curve avec point de contrôle au-dessus :
```ts
const arcPath = (from, to) => {
  const cx = (from.x + to.x) / 2;
  const cy = Math.min(from.y, to.y) - 90;  // arc bombé vers le haut
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
};
```

Tracé `strokeDasharray` + `strokeDashoffset` ramped via spring(damping 100, stiffness 30, durée 60 = 2 secondes pour bien voir l'animation).

### **Plates labels — LE template officiel validé**

Chaque pays nommé a une **plate rectangulaire dark navy avec barre verticale gold**, positionnée **au-dessus du dot**. Texte blanc IBM Plex Mono pour le pays + gold pour le sous-titre (mine spécifique).

```tsx
<g transform={`translate(${pt.x} ${pt.y + TOP_HALF})`}>
  {/* Halo pulse (permanent ou sur mot-pivot) */}
  <circle cx={0} cy={0} r={18} fill={CASPIAN_SEPIA.highlightOr}
          opacity={0.35 + wordPulse * 0.4}
          transform={`scale(${1 + Math.sin(frame * 0.15) * 0.2 + wordPulse * 0.6})`} />
  {/* Dot principal */}
  <circle cx={0} cy={0} r={11} fill={CASPIAN_SEPIA.highlightOr}
          stroke="#0d1525" strokeWidth={3} />
  {/* Plate label (au-dessus du dot, transform translate négatif sur Y) */}
  <g transform="translate(-78 -56)">
    <rect x={0} y={0} width={156} height={36} rx={4} fill="#0d1525" opacity={0.92} />
    <rect x={0} y={0} width={3} height={36} fill={CASPIAN_SEPIA.highlightOr} />
    <text x={78} y={16} fontFamily="'IBM Plex Mono', monospace" fontSize={17}
          fill="#ffffff" fontWeight={700} letterSpacing="0.18em" textAnchor="middle">
      CANADA
    </text>
    <text x={78} y={30} fontFamily="'IBM Plex Mono', monospace" fontSize={11}
          fill={CASPIAN_SEPIA.highlightOr} letterSpacing="0.2em" textAnchor="middle">
      MCARTHUR R.
    </text>
  </g>
</g>
```

**Décaler la plate à gauche du dot** quand le pays est près du bord droit du viewport (Kazakhstan : `transform="translate(-180 -56)"` au lieu de `-78`, barre gold à droite).

### Timing arcs — règle "respirer 8 secondes"

**INTERDIT** : déclencher arcs uniquement sur les mots finaux. L'animation n'a pas le temps de respirer.

**OUI** : étaler le tracé des arcs sur ~8 secondes, déclenchés sur des mots-pivots **antérieurs** au mot principal :
- Arc Canada commence sur "actif majeur lui échapper" (frame 340)
- Arc Kazakhstan commence sur "centaines de millions gelés" (frame 420)
- Quand les mots "Canada" (frame 560) et "Kazakhstan" (frame 590) arrivent, les arcs sont déjà tracés et le pays **explose en pulse** (halo élargi + opacité boost)

## Leçons apprises (4 versions Beat 5)

### v1 (existant ancien)
- Primitives SVG soldat/croix/sacs avec labels "VIE CONTINUE / SANS REVENUS / URANIUM PART"
- Style Mapbox `light-v11` brut sans projection mercator explicite
- **Erreur** : composant primitif et off-storyboard

### v2 (premier essai pipeline Gemini)
- 3 PNG isolés (soldat seul, sacs seuls, fond dunes séparé)
- Globe Mapbox au lieu de Mercator (zoom trop bas + projection oubliée)
- Bandeau "LE NIGER DOIT TENIR" + badge VS + sub-labels
- **Erreurs majeures** :
  - Assets séparés au lieu de scènes complètes → composition flottante
  - `projection: { name: "mercator" }` non spécifié → globe par défaut
  - Style Caspian non visible → fond bleu/blanc light-v11 brut
  - Bandeau header redondant avec voix-off
  - Badge VS qui oppose alors qu'il faut documenter une asymétrie

### v3 (correction structurelle)
- 2 PNG full-scene complets (soldat+caisses+dunes intégré, sacs+dunes intégré)
- Mapbox Mercator explicite + Caspian Sepia + hide labels symbol
- Pays highlighted en gold via fill Mapbox piloté par frame
- Pas de VS, pas de bandeau header
- **Restant** : arcs trop tardifs, labels gold sur fond crème illisibles, caption bottom redondante

### v4 (validé final)
- Arcs déclenchés tôt (frames 340 et 420) avec ~8 secondes pour respirer
- Plates labels dark navy avec texte blanc + barre gold latérale
- Caption "ORANO — APPROVISIONNEMENTS DIVERSIFIÉS" supprimée
- Pulse halo sur mots-pivots quand les noms sont prononcés
- **Validé** par Aziz, "très premium, très bien fait"

## How to apply

Pour TOUT futur split-screen Souverain illustration + Mapbox :
1. Storyboard Gemini i2i avec refs Or Africain V5 → vérifier que c'est en Mercator + Caspian
2. **Générer les illustrations comme 2 PNG full-scene complets** (jamais isolés)
3. Mapbox setup : copier le bloc setup ci-dessus à la lettre, **ne pas oublier `projection: { name: "mercator" }`**
4. Pays highlighted en gold via fill layers, pilotés par frame
5. Plates labels dark navy + barre gold + texte blanc IBM Plex Mono **au-dessus du dot**
6. Arcs tracés sur 60 frames, déclenchés ~8 secondes avant le mot-pivot principal
7. **Aucun overlay texte redondant** avec la voix-off (pas de bandeau header, pas de sub-labels, pas de caption bottom)
8. Pulse halo sur dot quand le mot-pivot du pays est prononcé

**Why:** ce template a été itéré 4 fois sur Beat 5 Niger uranium pour atteindre la version premium validée Aziz. Toutes les déviations corrigées sont documentées dans `feedback_souverain-inserts-utilite.md`. Réutiliser ce template tel quel = économiser 2-3 itérations sur les prochains beats split-screen.
