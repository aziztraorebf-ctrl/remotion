# Arbre Sahel GGW

**Issu de** : B2LigneBrisee.tsx, B3Malentendu.tsx, B5LaPreuve.tsx  
**Registre** : encre narrative (fond #e8dcc0 parchemin, encre #2b2117)  
**ViewBox source** : 1080x1920 — coordonnées relatives (0,0) = base du tronc, Y négatif = vers le haut

## Parties

### Tronc (`id="tronc"`)
Deux paths courbes parallèles (double trait) pour un rendu organique.
- Path 1 : `M0 0 C6 -60 3 -115 15 -170 C25 -217 25 -263 18 -305` — strokeWidth 12, stroke brun `#5b3b24`
- Path 2 : `M35 0 C32 -64 38 -115 32 -175 C28 -227 37 -265 48 -305` — strokeWidth 7, même couleur
- fill="none" : le tronc est tracé, pas rempli

### Branches (`id="branches"`)
Quatre amorces de branches depuis la tige centrale vers le houppier.
- Path composé de 4 segments M séparés par espaces (syntaxe SVG valide)
- `M12 -165 C-20 -195 -45 -235 -68 -283 M38 -187 C78 -220 105 -257 138 -293 M22 -240 C-5 -270 -28 -300 -55 -335 M40 -245 C82 -267 115 -293 153 -323`
- strokeWidth 5, stroke brun `#5b3b24`

### Houppier (`id="houppier"`)
9 cercles de feuillage positionnés autour du centre (~20, -360).
Positions `[cx, cy, r]` :
- `[-58, -360, 52]`, `[-12, -392, 56]`, `[38, -382, 58]`, `[82, -352, 50]`
- `[-30, -330, 50]`, `[40, -322, 48]`, `[8, -360, 60]`
- `[-78, -335, 36]`, `[108, -332, 34]`

Plus 3 paths de nervures internes (texture feuillage).

## Palette de couleurs selon l'état narratif

| État | Tronc/Branches | Houppier fill | Houppier stroke |
|------|---------------|---------------|-----------------|
| Vivant (naissance) | `#5b3b24` brun | `#6fa85a` vert tendre | `#4f7e3f` |
| Climax vivant | `#5b3b24` brun | `#3e8f34` vert vif | `#295c1c` |
| Encre neutre | `#2b2117` encre | `#cdbd9a` crème | `#2b2117` |
| Mort/gris | `#3a3a3a` cendre | `#8f8a7e` gris feuille | `#3a3a3a` |

## Usage Remotion (pattern cross-fade couleur)

```tsx
// Placement dans la composition
<g transform={`translate(${TX} ${TY}) scale(${S})`}>
  {/* couche encre (état neutre) */}
  <g opacity={1 - greenIn}>
    <LeafyCrown fill="#cdbd9a" stroke="#2b2117" />
  </g>
  {/* couche verte (état vivant) */}
  <g opacity={greenIn}>
    <LeafyCrown fill="#3e8f34" stroke="#295c1c" />
  </g>
</g>
```

Le cross-fade par opacité est la technique canonique du registre GGW (évite les re-renders de couleur inline).

## Animation reveal (technique B7)
B7MosaiqueFinal utilise un clipPath circulaire croissant (effet "buvard") pour révéler le vert :
- `<clipPath id="clip-buvard-{id}"><circle cx={canopyCx} cy={canopyCy} r={buvardR} /></clipPath>`
- `buvardR` passe de 0 au rayon max du houppier via `clampI(frame, [start, start+45], [0, canopyMaxR])`

## Animation de mouvement
- Balancement au vent : `rotate(${Math.sin(frame/18) * 1.2}, 20, -360)` sur le groupe houppier (pivot = centre du houppier)
- Pour le sway sans déport : `rotate(angle, cx_houppier, cy_houppier)`
- Pop d'apparition : `spring({ frame: frame-birth, fps, config: { mass:1, damping:13, stiffness:120 } })`

## Variante : Arbre mort (B2, B6)
Les arbres morts ont une géométrie différente — tronc simple + branches ramifiées sans houppier :
```
Tronc : M0 0 C-8 -70 12 -145 0 -250
Branches mortes : M0 -242 C-42 -285 ... (voir DeadTreeShape dans B2LigneBrisee.tsx)
```
Non extrait dans ce SVG (trop dynamique/JSX). Référence : `B2LigneBrisee.tsx` lignes 176-205.

## Placement dans les scènes sources

| Scène | Position (tx, ty) | Scale |
|-------|------------------|-------|
| B2 — arbre avant-plan | (260, 1500) | 1.15 |
| B2 — arbre milieu | (420, 1278) | 0.90 |
| B2 — arbre fond | (575, 1038) | 0.72 |
| B2 — survivant | (775, 785) | 0.78 |
| B3 — arbre central | (530, 1300) | 1.00 |
| B5 — arbre gauche | (235, 1320) | 0.66 |
| B5 — arbre centre | (540, 1345) | 0.74 |
| B5 — arbre droite | (832, 1320) | 0.64 |

## Techniques associées
- Pour la révélation bottom-up : clipPath avec rect qui monte (voir B7 `clipTop/clipBottom`)
- Pour la colorisation timée circulaire : voir technique buvard B7
- Pour les racines : voir `racines-ggw.svg` dans ce dossier
