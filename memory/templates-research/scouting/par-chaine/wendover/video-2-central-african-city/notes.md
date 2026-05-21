# How This Central African City Became the World's Most Expensive
URL : https://youtube.com/watch?v=f66GfsKPTUg | Durée : 22:48 (analysé 0-10min) | Date upload : 2022-08-23

## Axe 1 — Palette de couleurs
- Couleurs dominantes : satellite désaturé à ~60% (vert `#5a6b48`, ocre `#8a7a5c`, bleu océan `#1a2c40`), fond gris-acier `#3a3f44` pour zones « hors sujet », accent orange tracking `#ff7b1c`, drapeau Angola rouge/noir/or
- Ratio approx : satellite 50% / fond gris atténué 30% / accents drapeaux 15% / labels blancs 5%
- Mood : enquête doc-investigation, satellite « actif » (Google Earth-like) avec masking pour focaliser l'attention
- **Verdict palette** : 🟢 — pattern « satellite VIVANT pour la zone d'intérêt + gris désaturé pour le hors-sujet » est puissant et différencie de Or Africain

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Vue satellite oblique tilt 3D** (frame-001 aéroport, frame-013 quartier) — Google Earth Studio-style
  - **Country shape masking** (frame-009) : la silhouette Angola découpée affiche du satellite COULEUR, le reste du monde reste gris désaturé = effet « focus géographique »
  - **Drapeaux SVG en cartouche pin** : fanion sur petit pic blanc, fond noir contour blanc — élégant
  - **Labels cartouche noir contour blanc fin** (frame-019 : Algeria/Libya/Iraq/Qatar/Kuwait/UAE/Nigeria/Gabon/Angola/Venezuela/Equador) — police sans-serif blanche, padding serré
  - **Polygone surligné orange fluo** sur satellite (frame-005) = bâtiment/parcelle pointée
- **Verdict assets** : 🟢🟢 — c'est PRÉCISÉMENT le vocabulaire visuel Template C qu'on cherche à valider ; plusieurs assets immédiatement transposables (mask shape, label cartouche, pin drapeau)

## Axe 3 — Mouvements caméra
- Patterns dominants : (1) **tilt 3D oblique avec dolly forward** (Google Earth-style) sur lieux clés, 4-6s, (2) **zoom-out depuis détail rue → quartier → ville**, (3) **pan latéral lent** sur masque pays, (4) apparition séquentielle des labels OPEC (stagger ~12f)
- Durée moyenne des plans : 5-7 secondes (plus long que video-1)
- Spécificités : la caméra BOUGE en 3D oblique — c'est le signal Template C le plus fort de la chaîne. Pas une carte plate qu'on déplace, une vue oblique avec parallaxe perçue.
- **Verdict caméra** : 🟢🟢 — exactement le mouvement « atlas réaliste 3D » qu'Aziz a noté chez RealLifeLore/Vox. Reproductible Mapbox via `pitch: 60` + `flyTo`.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : `satellite-streets-v12` ou `satellite-v9` custom, désaturation conditionnelle hors zone d'intérêt
- Projection inférée : Mercator standard avec `pitch: 50-65°` pour le tilt 3D
- Layers principaux : raster satellite (base), GeoJSON country mask fill `#3a3f44` opacité 0.7 sauf intérieur du pays focus (utiliser `fill-pattern` ou inversion via clip), SVG flag pins en HTML overlay positionnés via `map.project([lng,lat])`, labels HTML cartouches noirs
- Animations Remotion : `Mapbox.flyTo({ pitch, bearing, zoom })` driven par `useCurrentFrame()`, fade-in séquentiel des pins (stagger 10-15f), highlight orange = layer line GeoJSON `#ff7b1c` largeur animée
- Difficulté de reproduction : ☑ moyenne (pitch 3D + masque pays inversé demandent setup ; Google Earth Studio aurait l'air plus authentique mais Mapbox satellite + pitch suffit à 80%)

## Frames sélectionnées
- `frame-001-satellite-airport-tilt.jpg` : tilt 3D Google Earth-style, signal fort Template C
- `frame-005-satellite-city-orange-highlight.jpg` : highlight polygone orange sur satellite zoomé — pattern « point d'intérêt »
- `frame-009-country-shape-mask-flags.jpg` : LA frame essentielle — masque pays Angola coloré + monde gris + drapeaux pins
- `frame-019-opec-multi-country-labels.jpg` : multi-country avec drapeaux + labels cartouches (équivalent Wendover de notre Or Africain Beat 3b)

## Verdict global vidéo : 🟢🟢
Vidéo la plus pertinente du batch. Trois patterns directement transposables Template C : tilt 3D, mask pays, label cartouche+drapeau pin. À retenir intégralement pour dissection Jour 2.
