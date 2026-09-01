# Style Guide : SVG Enluminure/Gravure (Peste 1347)

> Migré depuis auto-memory 2026-08-31. Registre visuel historique du projet Peste 1347 —
> le projet a depuis pivoté vers Atlas Mapbox pur (voir `memory/episodes/peste-1347/STATUS.md`),
> mais `archive/current-project.md` (repo) pointe encore vers `EnlumCharacters.tsx` comme source
> de vérité de palette sans donner les valeurs hex ni les helpers. Ce fichier comble ce trou :
> palette exacte, helpers de couleur (lerpColor, etatTint), système d'état personnage, archétypes.
> Applicable à tout futur projet avec un registre medieval enluminé.

## Palette officielle (NON-NEGOTIABLE à l'époque)
```ts
const GOLD        = "#c9a84c";
const GOLD_BRIGHT = "#f0d060";
const GOLD_DARK   = "#8a6820";
const LAPIS       = "#1a3a7a";   // bleu royal enluminure
const LAPIS_MID   = "#2a5aaa";
const LAPIS_LIGHT = "#5080d0";
const VERMILLON   = "#c8301a";
const VERT        = "#2a6a30";
const VERT_MID    = "#4a9a50";
const VERT_LIGHT  = "#7ac080";
const OCRE        = "#c8a040";
const OCRE_LIGHT  = "#e8c870";
const OCRE_PALE   = "#f0dca0";
const CHAIR       = "#e8c898";   // peau claire
const CHAIR_DARK  = "#c8a070";   // peau plus foncee
const INK         = "#1a1008";   // noir encre enluminure
const INK_MID     = "#3a2510";
const PARCHMENT   = "#f4e8c8";   // fond parchemin
const PARCHMENT_DARK = "#dfd0a0";
const WHITE       = "#f8f4e8";   // blanc casse
const STONE       = "#b8a888";   // gris pierre
```

## Proportions personnages medievaux canoniques
```ts
const TOTAL_H = 220;  // hauteur totale du personnage
const HEAD_R  = 38;   // rayon tete (ovale)
const TORSO_H = 85;   // hauteur torse
const LEG_H   = 80;   // hauteur jambes
const ARM_L   = 75;   // longueur bras
// Tete = 1/5 du corps (convention 14e s.)
```

## Systeme EtatPersonnage
```ts
type EtatPersonnage = "sain" | "malade" | "mort";

function etatTint(color: string, etat: EtatPersonnage): string {
  if (etat === "mort") return "#8a8a8a";
  if (etat === "malade") {
    // teinte verdatre 35% vers #7a9a60
    const hex = (s: string) => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)];
    const c = hex(color);
    const t = 0.35;
    const r = Math.round(c[0] * (1-t) + 100 * t);
    const g = Math.round(c[1] * (1-t) + 140 * t);
    const b = Math.round(c[2] * (1-t) + 80  * t);
    return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
  }
  return color;
}
```

**Regles visuelles par etat :**
- `sain` : couleurs vives, oeil ouvert, posture droite, accessoire complet
- `malade` : teinte verdatre, sourcil fronce, posture voûtee (rotate leger sur hipY), accessoire degrade
- `mort` : grise (#8a8a8a), oeil ferme (line), bouche affaissee, opacity 0.55, rotate 85° sur feetY

## Transition Enluminure → Gravure
```tsx
// Dans Remotion :
const saturation = interpolate(frame, [startFrame, endFrame], [1, 0], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp"
});
// Utiliser saturation pour toutes les couleurs via lerpColor
const skyColor = lerpColor(colorEnluminure, colorGravure, 1 - saturation);

// Helper lerpColor :
function lerpColor(a: string, b: string, t: number): string {
  const hex = (s: string) => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)];
  const ca = hex(a), cb = hex(b);
  const r = Math.round(ca[0] * (1-t) + cb[0] * t);
  const g = Math.round(ca[1] * (1-t) + cb[1] * t);
  const b2 = Math.round(ca[2] * (1-t) + cb[2] * t);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b2.toString(16).padStart(2,"0")}`;
}
```

## Systeme 3 Overlays Data
| Type | Quand | Position | Duree |
|------|-------|----------|-------|
| Permanent discret | En continu sur scene | Coin haut-gauche | Toute la scene |
| Pause narrative | Moment cle (stats choc) | Parchemin centre | 5-8s |
| Portrait flash | Citation/personnage historique | Coin haut-droit | 2-3s |

**Trace progressif (overlay Type 2) :** `stroke-dasharray` + `stroke-dashoffset` interpole via frames

## Archetype Scale Alignment
**PROBLEME CONNU** : `scale(flip * s, s)` en SVG multiplie aussi le `y`. Si on passe `y=groundY` et `scale=1.1`, le personnage descend de `groundY * 0.1`.

**SOLUTION :**
```tsx
// Dans la composition :
const SCALE = 1.1;
const Y_OFFSET = groundY * (1 - 1 / SCALE); // ~74px pour groundY=820
<g transform={`translateY(${Y_OFFSET})`}>
  <Personnage x={x} y={groundY - Y_OFFSET} scale={SCALE} />
</g>
```

## 6 Archetypes Peste 1347 (Villa Sancti Petri)
| Nom | Role | Couleur signature | Accessoire evolutif |
|-----|------|-------------------|---------------------|
| Pierre | Laboureur | #5a4020 brun | fourche→beche→rien |
| Martin | Pretre | LAPIS bleu | croix droite→inclinee→grisee |
| Isaac | Preteur juif | VERT + judenhut jaune | bourse pleine→aplatie→coupee |
| Guillaume | Seigneur | VERMILLON + or | epee presente→inclinee→absente |
| Agnes | Guerisseuse | #7a5828 brun + fichu | herbes fraîches→fanees→rien |
| Renaud | Medecin | #1a1a1a noir | baguette droite→baissee→absente |

**Note Renaud** : masque bec d'oiseau = anachronisme conscient (de Lorme 1619, pas 1347). Visage revelé si mort (masque tombe).

## Typographie
- Titres : `fontFamily="serif"`, `fontSize=28`, `letterSpacing=5`, `fill=GOLD_DARK`
- Labels personnages : `fontSize=12-13`, `fontWeight="bold"`, `fill=PARCHMENT`
- Sous-titres : `fontFamily="serif"`, `fontStyle="italic"`, `fontSize=11`
- Latin : italique, taille legrement plus petite

## Bordure et Cadre
```tsx
// Bordure double or standard :
<rect x={20} y={20} width={1880} height={1040} rx={10} fill="none" stroke={GOLD} strokeWidth={6} />
<rect x={30} y={30} width={1860} height={1020} rx={8} fill="none" stroke={GOLD_DARK} strokeWidth={1.5} opacity={0.5} />
// Coins :
{[[26, 26], [1894, 26], [26, 1054], [1894, 1054]].map(([cx, cy], i) => (
  <circle key={i} cx={cx} cy={cy} r={7} fill={GOLD_BRIGHT} stroke={GOLD_DARK} strokeWidth={1} />
))}
```

## Dallage Sol Standard
- `OCRE` + `OCRE_LIGHT` en damier, grille 96x58px, trait `GOLD_DARK` opacity 0.65
- Ligne superieure : `GOLD_DARK` pleine, opacity 0.5, height 5px
