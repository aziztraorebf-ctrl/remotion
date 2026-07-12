# Usine de transformation (UsineConstruction)

**Issu de** : `UsineConstruction.tsx` (cacao-chocolat-short) — sous-scène 4C de B4, "transformer le cacao chez soi"
**Registre** : encre narrative (fond `#e8dcc0` parchemin, encre `#332A20` — variante plus foncée que l'INK standard `#2b2117`)
**ViewBox source** : composant parent 1080×1920

## Parties

### Bâtiment (`id="batiment"`)
2 polygones : mur latéral en ombre + mur de face, plus 5 lignes intérieures (détails, apparaissent après la structure).
- Mur latéral : `650,1180 920,1050 920,800 650,900`
- Mur de face : `250,1180 650,1180 650,900 250,900`

### Toit dents-de-scie (`id="toit"`, 3 "sheds")
9 polygones (3 par shed : face claire + 2 pans arrière sombres) — motif industriel répété 3× avec décalage horizontal de 133px.

### Porte (`id="porte"`)
Arche pleine (`#332A20`) + contour arche plus large, apparaît avec les détails (après la structure).

### Cheminée (`id="cheminee"`)
Corps rectangulaire + chapeau + 4 lignes horizontales (texture). Dans le composant source : fumée animée en boucle permanente (8 bouffées désynchronisées, dilatation puis dissolution) — non figée dans ce SVG statique.

### Convoyeur de sortie (`id="convoyeur"`)
2 rails courbes + 3 traverses verticales + tablettes de chocolat en flux continu (le SVG documente 1 tablette figée à titre d'exemple ; le composant source en anime 4 en boucle permanente le long d'une courbe de Bézier paramétrée).

## Palette — 3 variantes (`palette` prop)

| Palette | Murs (wf/ws) | Toit face (rf) | Toit arrière (rb) | Cheminée (ch) | Usage |
|---|---|---|---|---|---|
| `cacao` (défaut) | `#d8c4a2` / `#c2a878` | `#8a5b35` | `#6f4628` | `#b88a5a` | terre/cacao neutre |
| `ivoire` | `#F77F00` / `#d96f00` | `#009E60` | `#00824f` | `#f4f1ea` | drapeau Côte d'Ivoire vif (orange/vert/blanc) |
| `ivoire-douce` | `#c9762f` / `#a85f24` | `#5e7245` | `#4c5c38` | `#e6dcc4` | drapeau CI désaturé, dialogue avec le registre encre |
| `ivoire-douce-chem-verte` | idem `ivoire-douce` | idem | idem | `#5e7245` (cheminée verte, pas crème) | variante cheminée unifiée au toit |

Ce SVG documente la palette `cacao` (défaut).

## Paramètres d'animation réels (props `UsineConstruction`)

Tous existent dans le code source :

| Prop | Rôle | Défaut |
|------|------|--------|
| `build` (0..1) | Construction progressive séquencée : sol (0→0.15) → murs (0.13→0.42, contour tracé) → toit (0.32→0.58) → détails porte/lignes (0.55→0.78) → cheminée (0.72→0.96) | 1 |
| `colorize` (0..1) | Colorisation (fill apparaît en opacity) — "munition couleur", tout encre puis couleur = événement | 1 |
| `chocOut` (0..1) | Tablettes qui sortent en flux continu sur le convoyeur (fade au bord) | 1 |
| `windPhase` (frame) | Vie permanente : soleil (glow/rayons rotatifs), nuages qui dérivent, fumée de cheminée | 0 |
| `groundFromCrack` (0..1) | Si >0, le sol naît de la fissure du verger (transition liée à `VergerCacao` état "fissure") | 0 |
| `palette` | `"cacao"` \| `"ivoire"` \| `"ivoire-douce"` \| `"ivoire-douce-chem-verte"` | `"cacao"` |

## Fichier source réel (ne pas dupliquer le code TypeScript)

`src/projects/souverain/cacao-chocolat-short/components/UsineConstruction.tsx` — exporte `UsineConstruction(props)` + 4 previews de comparaison palette (`UsinePreviewCacao`, `UsinePreviewIvoire`, `UsinePreviewIvoireDouce`, `UsinePreviewIvoireDouceChemVerte`). Toute réutilisation doit importer depuis ce fichier.
