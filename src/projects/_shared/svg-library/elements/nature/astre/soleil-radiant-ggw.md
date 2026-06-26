# Soleil Radiant GGW

**Issu de** : B2LigneBrisee.tsx (variante OR ardent), B4Demilune.tsx, B5LaPreuve.tsx (variante jaune), B6Outro.tsx (absent), B7MosaiqueFinal.tsx (variante jaune avec oscillation)  
**Registre** : encre narrative (fond #e8dcc0 parchemin)  
**ViewBox source** : 1080x1920 — le soleil est positionné en haut de la composition (zone ciel)

## Deux variantes

### Variante JAUNE (B4, B5, B7) — soleil espoir/positif
Palette : `#e8b44a` (jaune), `#b5862b` (jaune foncé)  
Usage narratif : espoir, régénération, climat neutre  
Position dans B4 : `(860, 250)` | B5 : `(220, 280)` | B7 : `(540, 200)` avec scale spring

### Variante OR ardent (B2) — soleil brûlant/écrasant
Palette : `#f2b53a` (or), `#ffd86b` (or glow), `#2b2117` (encre)  
Usage narratif : sécheresse, menace, embrasement  
Position dans B2 : `(540, 245)` | Rayon : 158px

## Structure SVG (relatif à 0,0 = centre)

```
[glow externe] — cercle flou (filter:blur), opacity animée
[halo pulsant] — cercle r~96-100, fill jaune/or, opacity sin
[anneau pointillé] — cercle r~92, stroke dasharray
[corps] — cercle plein r~60-64, fill + stroke
[rayons] — groupe de 12 lines (rotate animé en sin ou continu)
```

## Paramètres d'animation

### Rotation des rayons
```tsx
// B4/B5 : rotation très lente (une subtilité)
const sunRot = frame * 0.1;
<g transform={`rotate(${sunRot} 0 0)`} ...>

// B2 : rotation plus rapide à l'embrasement seulement
const sunRot = Math.max(0, frame - 180) * 0.25;
// rayons ne tournent qu'à partir de f180 (l'embrasement)
```

### Pulse du corps/halo
```tsx
// B3 (discret) : pulse très doux
const sunPulse = 1 + 0.02 * Math.sin(frame / 12);

// B4 : halo qui respire + pulse des rayons
const rayPulse = 0.5 + 0.5 * Math.sin(frame / 11);
const sunHaloR = 96 + 6 * Math.sin(frame / 17);

// B7 : pulse glow + rayons oscillants par rayon
const sunPulse = 0.5 + 0.5 * Math.sin((frame / 30) * (2 * Math.PI / 2.2));
const rayOscil = Math.sin((frame / 30) * (2 * Math.PI / 1.8));
```

### Cross-fade encre->or (B2 uniquement)
```tsx
// sunWarm = 0 à 180f (encre), 1 à 210f (or)
const sunWarm = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
// Corps : fill or avec fillOpacity animée
<circle fill="#f2b53a" fillOpacity={sunWarm} />
// Rayons : couleur conditionnelle
stroke={sunWarm > 0.3 ? "#f2b53a" : "#2b2117"}
```

## Positions dans les scènes sources

| Scène | Centre (cx, cy) | Rayon corps | Couleur |
|-------|----------------|-------------|---------|
| B2 | (540, 245) | 158 | or `#f2b53a` (embrasement f180+) |
| B3 | (250, 300) | 130 | encre (discret, jamais coloré) |
| B4 | (860, 250) | 64 | jaune `#e8b44a` |
| B5 | (220, 280) | 80 | jaune `#e8b44a` |
| B7 | (540, 200) | 60 | jaune `#f5c842` (variante légèrement plus vif) |

## Glow blur (filtre SVG)
Dans Remotion, le glow est rendu via `style={{ filter: "blur(Xpx)" }}` sur un cercle séparé placé derrière le corps.
```tsx
<circle cx={CX} cy={CY} r={R * 1.15} fill="#ffd86b"
  opacity={sunWarm * 0.5}
  style={{ filter: "blur(30px)" }} />
```
Note : `blur()` inline CSS fonctionne en Remotion headless (contrairement à `<feGaussianBlur>`).

## Soleil discret B3 (variante encre pure)
B3 utilise un soleil uniquement en encre, sans couleur, positionné haut-gauche :
```tsx
<circle cx={250} cy={300} r={130} fill="none" stroke="#2b2117" strokeWidth={5} />
<circle cx={250} cy={300} r={168} fill="none" stroke="#2b2117" strokeWidth={2} strokeDasharray="13 20" opacity={0.5} />
// 8 rayons cardinaux + diagonaux (pas de rotation)
<path d="M250 110 L250 150 M250 450 L250 490 M60 300 L100 300 M400 300 L440 300 M120 170 L148 198 ..." />
```
