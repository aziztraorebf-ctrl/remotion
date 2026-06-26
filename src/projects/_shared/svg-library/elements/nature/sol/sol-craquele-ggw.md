# Sol Aride et Craquelures GGW

**Issu de** : B3Malentendu.tsx (complet), B4Demilune.tsx (opening + plan 1 + plan 2), B6Outro.tsx (surface de la coupe de terre)  
**Registre** : encre narrative (fond #e8dcc0 parchemin, encre #2b2117, ocre #b5651d)  
**ViewBox source** : 1080x1920 — le sol occupe typiquement y 1300-1920 (bas de composition)

## Architecture en couches

Le sol craquelé est toujours rendu en deux couches superposées :

### Couche 1 — Plaques ocre (fond coloré)
```tsx
<g opacity={ocreIn * 0.55}>
  <path d="M380 1400 L250 1395 ..." fill="#b5651d" stroke="none" />
  {/* plusieurs polygones qui forment les plaques */}
</g>
```
`ocreIn` = 0 initialement, monte à 1 quand la narration nomme la cause de la mort du sol.  
C'est la **seule touche couleur diagnostic** du registre B3 : "la vraie cause se colore quand on la nomme."

### Couche 2 — Réseau d'encre (se-dessine)
```tsx
<path d="M530 1400 L500 1480 ..." fill="none" stroke="#2b2117"
  strokeDasharray={4200} strokeDashoffset={crackDraw} />
```
`crackDraw` = `clampI(frame, [start, end], [4200, 0])` — se dessine de 4200 (invisible) à 0 (visible).

## Paths extraits de B3 (coordonnées absolues, viewBox 1080×1920)

### Craquelures principales (5 lignes brisées)
```
M530 1400 L500 1480 L530 1580 L490 1700 L540 1810 L500 1920  — strokeWidth 7
M500 1400 L400 1450 L360 1560 L220 1650 L190 1780 L60 1920  — strokeWidth 6
M560 1400 L660 1440 L730 1540 L880 1620 L930 1760 L1060 1920 — strokeWidth 7
M440 1410 L280 1400 L170 1440 L20 1395                       — strokeWidth 5
M600 1410 L760 1390 L930 1420 L1080 1395                     — strokeWidth 6
```

### Plaques ocre de B3 (polygones fill)
```
M380 1400 L250 1395 L150 1430 L60 1500 L150 1620 L320 1640 L460 1560 L420 1450 Z
M460 1560 L600 1530 L760 1560 L850 1650 L760 1780 L560 1800 L450 1700 Z
M520 1410 L680 1390 L850 1420 L940 1500 L850 1560 L660 1540 L520 1500 Z
M150 1620 L60 1700 L120 1820 L300 1840 L320 1640 Z
M850 1560 L1000 1540 L1040 1660 L960 1790 L760 1780 L850 1650 Z
```

## Variante B4 — Sol de l'opening (ligne d'horizon + plaques plates)
B4 utilise une version plus simple, des plaques rectangulaires perspectives au bord d'une ligne de sol :
```
Ligne de sol : M90,1180 C 320,1170 560,1188 800,1176 C 920,1170 990,1182 1000,1178
Plaques :
  M120,1184 L300,1178 L330,1150 L150,1156 Z  — ocre fill
  M420,1186 L640,1190 L660,1158 L440,1152 Z
  M740,1182 L940,1176 L960,1150 L760,1154 Z
Hachures verticales : M200,1166 L212,1144 M380,1172 L392,1150 ...
```

## Variante B6 — Sol de surface (coupe de terre)
B6 utilise des polygones très courts, vue de haut légèrement en perspective :
```
M50,560 L150,580 L70,595 L160,545 L250,540 L280,565 L170,585 Z
M290,540 L380,542 L360,575 L285,570 L400,538 ...
```
Le sol de B6 est dans la zone y 530-620 (c'est la surface visible, pas le bas de l'image).

## Particules de poussière (B3 uniquement)
B3 ajoute des cercles de poussière qui s'élèvent depuis les craquelures lors de leur illumination :
```tsx
const DUST = [
  { x: 300, y: 1640, r: 5, rise: 220, drift: -40, delay: 0 },
  // ... 7 autres particules
];
// Animation : cy = d.y - d.rise * p (monte), cx = d.x + d.drift * sin(local/16) (dérive)
// opacity : apparaît vite (0->0.5 sur p 0->0.15), disparaît en montant (0.5->0 sur p 0.7->1)
```

## Timings d'animation (B3)

| Élément | Frames apparition | Notes |
|---------|-------------------|-------|
| Réseau encre | f205-280 | `crackDraw = clampI(frame, [205, 280], [DASH, 0])` |
| Ocre (couleur) | f198-255 | `ocreIn = clampI(frame, [198, 255], [0, 1])` |
| Racines exposées | f215-265 | `rootsIn = clampI(frame, [215, 265], [0, 1])` |
| Particules poussière | f210-280 | cascade par delay individuel |
| Craquelures secondaires | f225-270 | fade-in après les principales |
