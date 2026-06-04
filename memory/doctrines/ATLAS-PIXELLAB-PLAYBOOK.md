# ATLAS-PIXELLAB-PLAYBOOK — La couche personnages (le différentiel)

> Créé 2026-06-03. Couche dédiée du [[ATLAS-PLAYBOOK]]. Le morceau le PLUS DUR et le PLUS PRÉCIEUX
> d'Atlas — ce qui le sépare d'un clone mapanimation (carte 2D flat). Sprites = ACTEURS du récit.
> Dérivé du décodage Mansa Moussa V2 ([[DECODE-mansa-moussa]]) + correction [[atlas-pixellab-differentiel]].
> Code réel restauré : `src/projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasPixelChar.tsx`.

**Principe directeur (Aziz)** : PixelLab = différentiel par DÉFAUT, pas plan B. La flèche/primitive
montre la GÉOGRAPHIE du mouvement ; le sprite EST l'acteur. Dès qu'un acteur est présent dans le
récit, on l'incarne.

---

## §1 — CONVENTION DE DOSSIERS (NON-NEGOTIABLE)

```
public/<episode>/characters/<perso>/
├── animations/
│   └── <animName>/            ex: walk_cycle, royal_pose
│       ├── east/  frame_000.png … frame_NNN.png
│       ├── west/  frame_000.png … frame_NNN.png   (souvent dérivable par flip, voir §2)
│       ├── south/ frame_000.png …
│       └── north/ frame_000.png …
└── static-<dir>.png           fallback statique (static-east.png, static-south.png…)
```

- Frames PNG **individuelles numérotées** `frame_000.png` (padStart 3), PAS une spritesheet packée.
- Format validé : PNG RGBA, ~92×92 (taille source ; `size` prop = taille d'affichage SVG).
- `imageRendering: "pixelated"` **OBLIGATOIRE** (sinon le navigateur lisse le pixel art en bouillie).

**Inventaire sprites RESTAURÉS** (`public/atlas-mansa-moussa/characters/`, 2026-06-03 depuis git) :
| Perso | Animations | Directions | Frames |
|---|---|---|---|
| `mansa-moussa` (couronné, robe or) | walk_cycle + royal_pose | east, west (walk) ; south (royal_pose) | 6 walk + 4 pose |
| `porteur-mali` | walk_cycle | east, west | 6 |
| `soldat-mali` | walk_cycle | east, west | 6 |
| `chameau` | walk_cycle | east, west | 4 (animal) |

Autres assets PixelLab/persos dans le repo : `public/hannibal/assets/map-objects/` (soldats-carthaginois,
rome-city, elephant-radeau…) + `public/hannibal/assets/characters/` (hannibal-v4a, numide, volque) +
`memory/tools/PIXELLAB-MASTER-INDEX.md` (si présent — ~50 assets historiques).

---

## §2 — LE COMPOSANT SOCLE `AtlasPixelChar`

Code : `_reference/mansa-moussa-v2/scenes/AtlasPixelChar.tsx`. Rend un `<image>` SVG (vit DANS le
`<g transform caméra>` du beat → hérite drift/tilt/zoom automatiquement, contrairement au mécanisme
DOM `<Img>` de Ghana qui exige `svgToCompWithCam()`). Les 5 mécaniques clés :

1. **Cadence d'animation DÉCOUPLÉE du fps vidéo** :
   ```js
   const WALK_FPS = 8;  // le sprite tourne à 8 img/s, indépendant du 30fps vidéo
   const animFrame = animated
     ? Math.floor(((frame - appearAt) / fps) * WALK_FPS) % frameCount
     : 0;
   ```
   `% frameCount` = boucle infinie. `frame - appearAt` recale le compteur à 0 à l'apparition.

2. **Garde d'apparition** (= `Math.max(0, localF)` Atlas) : `if (frame < appearAt) return null;`.

3. **Entrée fade par spring** (jamais pop brutal) :
   `spring({ frame: frame - appearAt, fps, config: { damping: 30, stiffness: 120 } })` → opacité du `<g>`.

4. **Ancrage au PIED** (crucial — le perso "marche sur" la carte, ne flotte pas) :
   `x={x - size/2} y={y - size}` → (x,y) = point au SOL, le sprite est dessiné au-dessus.

5. **Flip Ouest par transform** (PixelLab ne génère bien que l'Est) :
   `direction === "west" ? scale(-1, 1) translate(${-x*2 - size} 0) : ""`.

**Gotcha à connaître** : `staticSrc` est calculé mais le rendu affiche TOUJOURS `animSrc` (pas de
vrai fallback). Si une frame manque, `onError` est vide → trou. Pour un sprite statique pur, utiliser
`AtlasPixelStatic` (même fichier).

---

## §3 — RECETTES DE CHORÉGRAPHIE

### Recette A — Le CORTÈGE (file indienne sur un seul path) ⭐
La pièce maîtresse (caravane du Hadj). UN seul path, N sprites par décalage de paramètre :
```js
const waypoints = [Niani, Tombouctou, Sahara1, Sahara2, LeCaire, Sinai, Mecque];
const getWaypointPos = (t) => { /* lerp segment : segmentT = t*(N-1), seg=floor, localT=frac */ };
const mansaT = interpolate(frame, [start, end], [0, 1], clamp);
getWaypointPos(mansaT);          // Mansa en tête
getWaypointPos(mansaT - 0.06);   // chameau (0.06 derrière sur le path)
getWaypointPos(mansaT - 0.10);   // soldat
getWaypointPos(mansaT - 0.14);   // porteur
```
File indienne SANS coder 4 trajectoires. L'espacement = un seul nombre (resserrer pour rester dans
le cadre caméra zoomé). Pour une ROUTE visuelle courbe sous le cortège : path lissé séparé (cf.
`bezierRoute` de geoUtils, ou le `caravaneSmooth` Mansa).

### Recette B — Switch d'animation contextuel (arrivée)
À l'arrivée, le protagoniste change d'état :
```js
const atDestination = frame >= caravaneEnd;
animName={atDestination ? "royal_pose" : "walk_cycle"}
direction={atDestination ? "south" : "east"}   // se tourne FACE caméra
frameCount={atDestination ? 4 : 6}
```
Puis fade-out groupé : `<g opacity={interpolate(frame, [caravaneEnd, poseEnd], [1,0], clamp)}>`.

### Recette C — Caméra qui TRACK le sprite + annule le tilt
Pendant le voyage, la caméra EST le sprite ; à l'arrivée, pull-back :
```js
const activeCamX = atDestination
  ? interpolate(frame, [end, poseEnd], [spriteX, 360], clamp)  // pull-back
  : frame >= start ? spriteX : 360;                            // verrouillée sur le sprite
const camZoom = interpolate(frame, [start, zoomInEnd, end, poseEnd], [1, 2, 2, 1], clamp);
// + annuler le tilt au zoom pour la lisibilité : effectiveTilt = tiltDeg → 8
```

### Recette D (Ghana) — Drop d'objet au crouch (silent barter)
Sprite walk → crouch (change d'anim) → un objet PixelLab (sac) APPARAÎT à son pied au moment du
crouch et PERSISTE. Puis le sprite repart (walk, direction inverse). Une balance PixelLab descend
entre deux sacs et s'équilibre (`balanceTilt -10→0` + oscillation amortie).

---

## §4 — ÉCHELLE D'ESCALADE (N0 → N2)

Choisir le niveau d'incarnation selon le besoin (et le budget de génération PixelLab) :

| Niveau | Quoi | Quand | Coût |
|---|---|---|---|
| **N0 — primitive** | flèche / route / pulse / path animé (`AtlasAttackArrow`, `AtlasCaravane` chibi) | montrer la GÉOGRAPHIE d'un mouvement sans acteur identifié | zéro (code) |
| **N1 — marqueur** | `AtlasPulseMarker` + label, icône Gemini | situer / nommer, acteur non incarné | zéro / 1 image Gemini |
| **N2 — sprite-acteur** ⭐ | `AtlasPixelChar` (walk/idle/pose) | l'acteur EST présent dans le récit (Mansa marche, l'armée avance) | génération PixelLab |

**Règle (Aziz)** : dès qu'un acteur est présent, viser N2. Le N0 (flèche) montre où va l'armée ;
le N2 (sprite) EST l'armée. Les batailles = N2 exclusif (mapanimation échoue dessus, prouvé).
Mais N0/N1 restent valides pour le contexte, les flux, les lieux sans acteur.

---

## §5 — PRODUIRE UN NOUVEAU SPRITE (rappel pipeline PixelLab)

Avant de générer : consulter `PIXELLAB-MASTER-INDEX.md` (réutiliser un ID existant si l'asset existe).
Génération via MCP PixelLab (`create_character` → `animate_character`). Règle async
NON-NEGOTIABLE (CLAUDE.md) : après `animate_character`, `sleep 120` puis `get_character` dans le
MÊME flow ; si "Animations: None yet" après 3min → relancer. Export frames → convention §1.
`view: "side"` pour les profils de marche. Toujours `imageRendering: pixelated` à l'intégration.
