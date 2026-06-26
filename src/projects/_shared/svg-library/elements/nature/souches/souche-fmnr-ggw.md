# Souche FMNR GGW

**Issu de** : B4Demilune.tsx (plan 1 gros-plan + plan 2 champ de souches), B5LaPreuve.tsx (racines/souche au pied des arbres)  
**Registre** : encre narrative (fond #e8dcc0, encre #2b2117, vert-terre #5d7d3a, or #d8a43a)  
**ViewBox source** : 1080x1920 — les souches sont dans la zone y 900-1400

## Concept narratif FMNR

La souche n'est pas un objet mort : elle cache un **coeur vivant** (cambium = anneau de bois vivant sur le bord). La technique FMNR (Farmer Managed Natural Regeneration) consiste à protéger et tailler ces souches pour qu'elles repoussent. Animation clé : le cambium s'illumine en vert-terre (#5d7d3a) quand la narration révèle que "la forêt était déjà là, sous leurs pieds."

## Deux types de souches

### Petite souche (FS_*) — plan 2 champ
Vue frontale simple. Adaptée pour un champ de 12+ souches répétées.
- Tronc : `FS_TRUNK = "M-40,0 C-44,-40 -38,-68 -28,-80 L28,-80 C40,-68 44,-40 40,0 Z"` — fill crème, stroke encre
- Cernes : `FS_RINGS = "M-20,-78 C-6,-86 10,-86 22,-78 M-26,-74 C-4,-88 ..."` — 3 arcs sur le dessus
- Coeur (cambium) : `FS_CORE = "M-14,-79 C-2,-85 6,-85 14,-79 C8,-72 -8,-72 -14,-79 Z"` — fill animé encre->vert
- Rejet FMNR : `FS_SHOOT = "M0,-78 C6,-110 0,-140 8,-176"` + `FS_LEAF = "M8,-176 C-12,-184 -8,-202 6,-202 ..."` — tige + feuille terminale
- **Ancrage critique** : le rejet part du BORD supérieur (x=8, y=-78), PAS du centre. C'est le bois vivant au bord.

### Gros-plan souche (GP_*) — plan 1 héros
Vue de 3/4, large et basse. Centre (0,0) = centre du disque scie. La souche est positionnée à (540, 980) dans la composition.

Éléments :
- **GP_TOP** = disque scie (sommet, l'élément héros du plan serré)
  - `"M-210,-6 C-206,-66 206,-66 210,-6 C206,52 -206,52 -210,-6 Z"`
- **GP_SIDE** = flancs du tronc (courts + irréguliers, évases vers la base)
  - `"M-210,0 C-224,52 -208,108 -176,150 C-150,176 ... C210,44 210,0"`
- **GP_RINGS** = 4 cernes concentriques décentrés (ellipses emboîtées)
- **GP_RAYS** = stries radiales (rayons du bois depuis le coeur)
- **GP_BARK** = écorce hachuree sur les flancs (6 traits verticaux courbes)
- **GP_ROOTS** = racines profondes depuis la base (4 paths vers le bas)
- **GP_CAMBIUM** = anneau de bois vivant — 2 contours emboîtés + `fillRule="evenodd"` = anneau

### Anti-pattern "barrique"
Une vraie souche coupée est **LARGE et BASSE**, pas un cylindre haut. Les flancs sont IRRÉGULIERS et ÉVASES vers la base. Le sommet SCIE est l'élément dominant, pas les flancs.

## Paths complets GP_* (B4Demilune.tsx)

```ts
const GP_TOP =
  "M-210,-6 C-206,-66 206,-66 210,-6 C206,52 -206,52 -210,-6 Z";
const GP_SIDE =
  "M-210,0 C-224,52 -208,108 -176,150 C-150,176 -120,184 -70,190 C-20,196 30,196 84,188 C140,178 180,158 200,120 C214,86 210,44 210,0";
const GP_RINGS = [
  "M-168,-6 C-166,-50 170,-50 172,-6 C170,40 -166,40 -168,-6 Z",
  "M-120,-10 C-118,-44 128,-44 130,-10 C128,30 -118,30 -120,-10 Z",
  "M-72,-8 C-70,-32 84,-32 86,-8 C84,16 -70,16 -72,-8 Z",
  "M-32,-12 C-30,-24 44,-24 46,-12 C44,4 -30,4 -32,-12 Z",
];
const GP_RAYS =
  "M8,-44 L4,-22 M-92,-30 L-58,-16 M104,-30 L66,-16 M-150,-8 L-104,-4 M156,-8 L108,-4 M8,30 L4,14 M-60,28 L-36,14 M76,28 L48,14";
const GP_BARK =
  "M-176,30 C-184,80 -178,130 -160,166 M-120,42 C-128,90 -124,140 -110,176 M-58,50 C-64,100 -62,150 -54,186 M22,50 C26,100 24,150 16,186 M96,44 C104,92 100,142 84,176 M158,32 C168,80 164,130 142,166";
const GP_ROOTS =
  "M-150,180 C-200,260 -250,340 -284,470 M-70,190 C-100,300 -110,430 -120,580 M70,190 C104,300 116,430 128,580 M150,180 C208,260 264,340 300,470";
const GP_CAMBIUM =
  "M-204,-6 C-200,-62 200,-62 204,-6 C200,48 -200,48 -204,-6 Z M-168,-6 C-166,-50 170,-50 172,-6 C170,40 -166,40 -168,-6 Z";
```

## Animation du cambium (coeur vivant)

```tsx
// Le bord du bois s'illumine en vert-terre
const gpCambiumLife = clampI(frame, [372, 410], [0, 1]);

// Fonction d'interpolation de couleur
const inkToColor = (t: number, r: number, g: number, b: number) =>
  t < 0.001
    ? ENCRE
    : `rgb(${mix(t, 0x2b, r)},${mix(t, 0x21, g)},${mix(t, 0x17, b)})`;

// Usage : encre -> vert-terre (#5d7d3a = 93,125,58)
<path d={GP_CAMBIUM} fill={inkToColor(gpCambiumLife, 0x5d, 0x7d, 0x3a)}
  fillRule="evenodd" opacity={gpCambiumLife * 0.7} />

// Pulse du cambium (respire)
<path d={GP_CAMBIUM} fill="none" stroke="#5d7d3a" strokeWidth={3}
  opacity={gpCambiumLife * 0.5 * (0.6 + 0.4 * Math.sin(frame / 9))} />
```

## Animation du rejet FMNR (jeune pousse)

Le composant `SproutLeaves` (B4) crée une pousse avec tige + 3-4 petites feuilles, ancré au sommet de la souche (translate(0,-78)).

Paramètres :
- `g` = avancement 0..1 (pilote hauteur tige + ouverture feuilles)
- `big` = la souche héros pousse plus haut
- `sway` = angle de balancement au vent (sin frame-driven)

La tige monte de 0 à 78px (petite souche) ou 132px (héros) selon `g`.  
Les feuilles s'ouvrent quand `g > 0.35` (après la tige).

## Disposition du champ (B4 FIELD)

```ts
const FIELD: FieldStump[] = [
  // rang du fond — reverdit en DERNIER
  { x: 220, y: 980, scale: 0.62, order: 8 },
  { x: 430, y: 968, scale: 0.66, order: 6 },
  { x: 640, y: 974, scale: 0.6,  order: 10 },
  { x: 860, y: 984, scale: 0.64, order: 7 },
  // rang médian
  { x: 160, y: 1130, scale: 0.82, order: 5 },
  { x: 400, y: 1142, scale: 0.86, order: 4 },
  { x: 660, y: 1136, scale: 0.84, order: 5 },
  { x: 910, y: 1148, scale: 0.8,  order: 9 },
  // rang avant — reverdit en PREMIER
  { x: 250, y: 1320, scale: 1.05, order: 2 },
  { x: 540, y: 1336, scale: 1.12, order: 1 }, // héros (FMNR central)
  { x: 820, y: 1316, scale: 1.04, order: 3 },
  { x: 110, y: 1300, scale: 0.92, order: 0 },
];
// La cascade verte : greenWave(order) = clampI(frame, [664 + order*3.5, 664+order*3.5+42], [0,1])
```

## Racines exposées (B3, B5)

Le composant `Roots` (B3/B5) dessine des racines qui s'étalent depuis la base (0,0) vers le sol :
```tsx
const Roots: React.FC<{ color: string }> = ({ color }) => (
  <path
    d="M0 0 C-40 50 -85 80 -150 120 C-205 154 -250 170 -320 196
       M18 0 C-2 60 -10 120 -18 185 C-24 240 -30 290 -42 350
       M30 0 C70 55 120 90 195 130 C255 162 300 178 365 205
       M22 0 C50 60 95 110 160 160 C225 210 270 245 330 300"
    fill="none" stroke={color} strokeWidth={5}
    strokeLinecap="round" strokeLinejoin="round"
  />
);
// Dans B5 : rootsOcre anime la couleur encre->#b5651d quand "pas plantés - revenus"
```
