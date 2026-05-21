# The World's Oldest International Borders
URL : https://www.youtube.com/watch?v=QukqGCzVSW0 | Durée : 11:42 (segment 0-10:00 analysé) | Date upload : 2019-09-30

## Axe 1 — Palette de couleurs
- Couleurs dominantes : satellite vert/bleu base, **fills magenta saturé `#c83fc8`** (Francs), vert plat `#3a9b4a` (Moors), bleu océan `#1a3550`. Texte blanc avec ombre.
- Ratio approx : 50% satellite (vert+bleu) · 30% color fills territoriaux · 10% peintures historiques · 10% stock aerial vidéo
- Mood : encyclopédique, "atlas animé", couleurs franches sans subtilité. Vibe Wikipedia animée.
- **Verdict palette** : 🟡 — saturation arbitraire (magenta = Francs ?) ; à éviter pour Souverain qui a besoin d'une grammaire chromatique signée. Notable pour son **contraste fort fill vs satellite**.

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - Satellite raster + polygones GeoJSON colorés en **flat color** (alpha ~0.65)
  - Labels typés directement dans le polygone, taille proportionnelle à la surface
  - **Stock footage aerial drone** (San Marino, montagnes) inséré entre 2 plans cartographiques
  - Peintures historiques (Congrès Berlin) en plein écran, pan slow
  - Pas de drapeaux sur cette portion, plus textuel
- **Verdict assets** : 🟢 — la combinaison **carte animée + stock drone + peinture** est un trio d'alternance rythmique reproductible et économique.

## Axe 3 — Mouvements caméra
- Patterns dominants : zoom progressif sur carte (Europe → Iberia), pan horizontal long, **transitions par fade entre époques** (le polygone change de couleur en place), pan vertical sur peintures
- Durée moyenne des plans : 5-9s (plus lent que vidéo 1)
- Spécificités : **frontières restent immuables**, c'est la couleur de fill qui transmet le temps. Très peu de mouvement de caméra brut, beaucoup de morph chromatique.
- **Verdict caméra** : 🟢 — confirme le pattern signature WonderWhy : carte = base fixe, temps = couleur. Économique en compute, fort en lisibilité.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : `satellite-streets-v12` desaturé légèrement
- Projection inférée : Mercator (Europe centrée)
- Layers principaux : raster satellite + fill layer GeoJSON par époque (4-5 polygones max simultanés) + symbol labels
- Animations Remotion : interpolate fill-color via lerpColor entre époques, fade-in fill-opacity 0→0.65 sur 600ms, ken burns peintures
- Difficulté de reproduction : ⬜ haute / ☑ moyenne / ⬜ basse

## Frames sélectionnées
- `frame-0002-flat-color-fill-satellite.jpg` : Francs (magenta) + Moors (vert) sur satellite — pattern signature
- `frame-0005-stock-aerial.jpg` : drone footage San Marino — break visuel entre cartes
- `frame-0008-historical-painting.jpg` : peinture plein écran avec ken burns

## Verdict global vidéo : 🟢
