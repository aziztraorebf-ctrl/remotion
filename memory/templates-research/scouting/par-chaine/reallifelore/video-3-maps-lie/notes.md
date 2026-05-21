# How Maps LIE To You

URL : https://www.youtube.com/watch?v=pySHMxf_Qvk
Durée : 16:39 (analysé 0-10:00)
Date upload : 2022-02-11

## Axe 1 — Palette de couleurs
- Couleurs dominantes :
  - Cold open stock : tons pastel chaleureux bois/papier `#c8a87a` + plantes vertes `#8aac6a` + ambiance "café cosy"
  - Choropleth US (frame-026) : fond ciel pastel `#cde4f0`, rouge `#c0392b` → rose pastel pour fills par comté, bleu `#3a6abc` → bleu pastel
  - Coverage map (frame-015) : magenta vif `#e6007e` (T-Mobile branding) sur fond ivoire/blanc `#f5f0e0`
  - Bushfire Australia (frame-006/010) : satellite très sombre `#1a1a1a` avec **points rouge-orange luminescents** `#ff3a1a` / `#ff6a2a` — extrêmement dramatique
  - Antique maps (frame-034/038) : papier vieilli `#e8d8b0`, encres pastel rose/bleu/vert/jaune `#c08080`, hachures fines manuscrites
- Ratio approx : varie par sujet — pas de palette globale unifiée car la vidéo EST une démonstration de styles cartographiques différents
- Mood : **éclectique** — chaque shot a sa palette, c'est le sujet de la vidéo (les cartes mentent par leur design)
- **Verdict palette** : 🟡 — pas de palette signature à voler, MAIS la vidéo est une mine de **références cartographiques** (antique map texture, choropleth pastel, satellite-with-glowing-points). Idée backlog : palette "antique map" pour épisode patrimoine/histoire africaine pré-coloniale.

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Antique map texture + zoom Ken Burns** (frame-034, 038) : carte historique scannée HD + slow push-in + pan latéral. Texture papier visible, encres pastel, calligraphie d'époque. Très atmosphérique.
  - **Satellite glowing data points** (frame-006, 010) : satellite très sombre + points lumineux rouges (feux Australie) avec halo léger. Effet "thermal data" puissant.
  - **Choropleth comté** (frame-026) : fill par comté/division, palette bipolaire (rouge/bleu), pas de labels — laisse parler la forme. Frontières très fines blanches.
  - **Coverage map thématique mono-couleur** (frame-015) : fond pâle, fill couleur unique brand-style (T-Mobile pink), labels noirs sans cartouche par-dessus, étoiles pour villes
  - **Social media clipping** (frame-006) : screenshot post Reddit/Twitter inséré comme overlay translucide sur la carte = pattern "preuve internet"
  - **Tabletop cold open** : carte papier réelle filmée du dessus, mains qui pointent, plante + lunettes en déco — incarnation tactile du sujet
- **Verdict assets** : 🟢 — au moins 3 assets distincts à backlogger : antique map zoom, satellite + glowing points, choropleth pastel. Tous reproductibles.

## Axe 3 — Mouvements caméra
- Patterns dominants :
  - **Ken Burns sur antique maps** : push-in 6-10s très lent + pan diagonal subtil. Donne le temps de lire la calligraphie. Dominant style.
  - **Zoom-on-region** : sur choropleth, zoom progressif vers une zone d'intérêt avec labels qui apparaissent en fade
  - **Hard cuts** entre paradigmes cartographiques (mercator → choropleth → satellite → antique)
- Durée moyenne des plans : maps 8-15s (besoin de lecture), antique 10-12s
- Spécificités : la vidéo se permet des plans LONGS sur les antique maps — l'opposé du tempo Shorts. Mais la technique Ken Burns est universelle.
- **Verdict caméra** : 🟢 — Ken Burns sur antique maps = technique évidente à backlogger pour épisodes patrimoine.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré :
  - Pour antique maps : **PAS Mapbox** — c'est un raster image historique chargé en `<Img>` Remotion, animé en CSS transform scale + translate. Sources : David Rumsey Map Collection, BNF Gallica, Wikimedia Commons.
  - Pour satellite glowing points : Mapbox satellite-v9 + circle layer avec circle-color rouge + circle-blur 0.6 + circle-radius interpolé
  - Pour choropleth : Mapbox custom style ou `<Img>` SVG avec fill data-driven via React (D3 scale)
- Projection inférée : varie — antique maps gardent leur projection d'origine, choropleth US en Albers conique typique
- Layers principaux : voir ci-dessus, dépend du sub-pattern
- Animations Remotion :
  - Ken Burns : `interpolate(frame, [0, dur], [1.0, 1.18])` + translate spring lent
  - Glowing points : map de coordonnées + `<Sequence>` par point avec scale spring 0 → 1
- Difficulté de reproduction : ⬛ basse pour Ken Burns / glowing points, ⬛ moyenne pour choropleth animé.

## Frames sélectionnées (5-7)
- `frame-002-coldopen-tabletop-map.jpg` : pattern incarnation tactile cold open
- `frame-006-overlay-social-clipping-australia-fires.jpg` : combo satellite glowing + social clipping
- `frame-010-australia-fires-fullscreen.jpg` : **glowing data points fullscreen** — pattern fort
- `frame-015-pink-coverage-map-thematic.jpg` : coverage map mono-couleur brand-style
- `frame-026-county-choropleth-redblue.jpg` : choropleth bipolaire — référence dataviz US
- `frame-034-antique-map-kenburns.jpg` : antique map zoom — référence patrimoine
- `frame-038-antique-map-california.jpg` : autre antique avec calligraphie + encre pastel

## Verdict global vidéo : 🟢
Vidéo "anthologie cartographique" qui révèle plusieurs styles distincts. Pas une signature unique, mais **3 patterns à backlogger** (Ken Burns antique, glowing satellite points, choropleth pastel). Précieux pour différencier les épisodes Souverain.
