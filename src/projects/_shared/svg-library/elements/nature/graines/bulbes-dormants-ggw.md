# Bulbes Dormants + Epi GGW

**Issu de** : B6Outro.tsx (BULBS array, 3 bulbes sous la coupe de terre), B5LaPreuve.tsx (CropStalk, épi/culture)
**Registre** : encre narrative (fond #e8dcc0, encre #2b2117, vert vie #3e8f34, doré récolte #c9a13b)
**ViewBox source** : 1080x1920 — les bulbes sont dans la zone y 900-1400 (profondeur sous le sol)

## Concept narratif

Le Beat 6 (B6) est une **coupe de terre verticale** : surface (arbres morts) vs profondeur (bulbes dormants). Les bulbes représentent le **savoir paysan qui dort sous nos pieds** — ils sont vivants mais invisibles. La technique FMNR les réveille plutôt que de planter à neuf.

L'épi de B5 est le **climax d'abondance** : "les récoltes qui repartent" — la conséquence visible du retour des arbres (ombre + sol vivant + humidité).

## Bulbes dormants (B6 — BULBS array)

Trois bulbes, chacun avec une morphologie distincte (horizontal / vertical / incliné). Toujours en encre pure jusqu'au moment narratif où "la vie s'éveille" (f256-371).

### Positions dans la composition B6 (coordonnées absolues, viewBox 1080×1920)

| Bulbe | tx | ty | rx | ry | Forme |
|-------|----|----|----|----|-------|
| Bulbe 1 | 250 | 950 | 55 | 40 | horizontale aplatie |
| Bulbe 2 | 820 | 1150 | 45 | 65 | verticale allongée |
| Bulbe 3 | 350 | 1350 | 60 | 35 | ovale inclinée |

### Paths complets (B6Outro.tsx)

#### Bulbe 1 — horizontal (tx=250, ty=950)
```ts
seed: "M-30,0 C-30,-25 30,-25 40,0 C50,25 -30,25 -30,0 Z"
roots: "M-30,0 C-60,10 -80,-20 -100,10 M-30,0 C-50,30 -70,30 -80,60 M40,0 C70,10 90,-10 120,0 M40,0 C60,20 70,40 100,50"
veins: "M-20,-5 Q 5,-15 30,-2 M-20,5 Q 5,15 25,5"
delay: 0
```

#### Bulbe 2 — vertical (tx=820, ty=1150)
```ts
seed: "M0,-40 C25,-40 25,40 0,50 C-25,40 -25,-40 0,-40 Z"
roots: "M0,50 C10,80 -10,100 0,130 M0,50 C-20,70 -40,60 -60,90 M0,-40 C-10,-70 20,-90 10,-120 M0,-40 C30,-60 50,-50 70,-70"
veins: "M-10,-20 Q 15,-10 10,-30 M-15,10 Q 15,20 10,0"
delay: 12
```

#### Bulbe 3 — incliné (tx=350, ty=1350)
```ts
seed: "M-35,-10 C-10,-30 20,-30 40,-5 C60,20 10,25 -35,-10 Z"
roots: "M-35,-10 C-60,-20 -80,0 -110,-10 M-35,-10 C-50,-30 -40,-60 -60,-80 M40,-5 C70,0 80,20 110,10 M40,-5 C50,25 70,40 90,60"
veins: "M-20,-10 Q 5,-20 25,-10 M-10,0 Q 15,-10 20,5"
delay: 24
```

### Rendu en Remotion (B6)

```tsx
// Apparition en cascade (révélation de la profondeur)
const BULBS = [ /* array ci-dessus */ ];

// Pour chaque bulbe :
const bulbReveal = (b: Bulb) =>
  spring({
    frame: frame - (191 + b.delay),
    fps,
    config: { mass: 0.7, damping: 12, stiffness: 140 },
  });

// Pulse discret (le bulbe respire, il est vivant)
const bulbPulse = (b: Bulb) =>
  1 + 0.04 * Math.sin((frame - b.delay) / 18);

// Vie-verte : liseré vert qui apparaît f256-371
const bulbLife = clampI(frame, [256, 320], [0, 1]);

// Rendu :
<g transform={`translate(${b.tx} ${b.ty}) scale(${bulbReveal(b) * bulbPulse(b)})`}
   opacity={bulbReveal(b)}>
  {/* corps seed (encre) */}
  <path d={b.seed} fill={CREME} stroke={ENCRE} strokeWidth={5} strokeLinejoin="round" />
  {/* nervures internes */}
  <path d={b.veins} fill="none" stroke={ENCRE} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
  {/* racines */}
  <path d={b.roots} fill="none" stroke={ENCRE} strokeWidth={3} strokeLinecap="round" opacity={0.55} />
  {/* liseré vert (vie latente qui s'éveille) */}
  <path d={b.seed} fill="none" stroke="#3e8f34" strokeWidth={4} opacity={bulbLife * 0.8} />
</g>
```

## Epi / Culture (B5 — CropStalk)

L'épi est le résultat visible du retour des arbres FMNR : l'agriculture repart. Apparaît en dernier (f377-421 de B5).

### Paramètres du composant CropStalk (B5LaPreuve.tsx)

```tsx
const CropStalk: React.FC<{
  x: number;   // position absolue dans la composition
  y: number;
  s: number;   // scale (0.7-1.0 selon rang)
  grow: number; // avancement 0..1 (pilote hauteur tige + ouverture épi)
  sway: number; // balancement latéral (°) — sin frame-driven
}> = ...
```

### Palettes CropStalk

```ts
const SOL_VIVANT = "#5e8a3a"; // tige + feuilles (vert-terre)
const DORE = "#c9a13b";        // corps de l'épi (grains)
const DORE_D = "#977418";      // détails grains + barbes
```

### Paths internes (relatifs à translate(x, y))

```
Tige :    M0 0 L0 ${-120 * h}          strokeWidth=6, SOL_VIVANT
Feuilles: M0 ${-38*h} C-28 ... -32 ${-84*h}    (2 feuilles alternées)
Halo épi: ellipse cx=0 cy=-18 rx=24 ry=34      fill=DORE opacity=0.22
Corps épi: ellipse cx=0 cy=-18 rx=15 ry=28     fill=DORE stroke=DORE_D
Grains:   "M-9 -30 L-3 -24 M9 -30 ..." (chevrons internes)
Barbes:   "M0 -46 L0 -62 M-5 -44 L-12 -58 ..." (5 arêtes du sommet)
```

### Règle d'animation (CropStalk)

- `h = clampI(grow, [0, 1], [0, 1])` — hauteur tige proportionnelle à grow
- Feuilles s'ouvrent quand `grow > 0.4` (après la tige)
- Épi visible quand `grow > 0.55`
- `sway` = balancement au vent : `sway = Math.sin(frame / 16) * 3` (degrés)
- Scale animé via spring : `sc = s * clampI(grow, [0, 0.4], [0, 1])`

### Placements dans B5 (coordonnées absolues, viewBox 1080×1920)

Les épis poussent au pied des arbres (y sol ~1350-1440) :
- Épi gauche : `x≈200, y≈1440, s=0.85`
- Épi centre : `x≈540, y≈1450, s=1.0`
- Épi droit : `x≈880, y≈1440, s=0.85`

## Anti-patterns

- **JAMAIS glisser** un bulbe ou un épi latéralement (objet inerte) — seuls fade/pop/pulse autorisés
- **JAMAIS** dessiner un bulbe comme un cercle parfait — les 3 formes sont délibérément asymétriques (organic = vivant)
- La couleur verte sur un bulbe est un **liseré discret**, pas un remplissage massif (ils sont dormants, pas en plein éveil)
- L'épi = **climax doré**, pas une icône minimaliste — les barbes de blé et le halo sont obligatoires pour la lisibilité au rendu

## Chronologie B6 (timings clés)

| Événement | Frames | Notes |
|-----------|--------|-------|
| Révélation bulbes | f191-256 | cascade delay=0/12/24 |
| Pulse vie-verte | f256-371 | liseré #3e8f34 sur bulbes |
| Graine qui "tombe" | f256-340 | une graine se détache vers la fissure |
| Pousse verte perce | f499-562 | depuis la fissure (pas des bulbes directement) |
