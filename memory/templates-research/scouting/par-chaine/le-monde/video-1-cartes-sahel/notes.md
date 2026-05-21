# Comprendre la guerre au Sahel (Les cartes du Monde Afrique, épisode 1)
URL : https://www.youtube.com/watch?v=j1tLiD6yjXM | Durée : 4m32s | Date upload : 2020-01-11
Chaîne : Le Monde Afrique
Ratio live-action / motion design : ~25% présentatrice (talking head fond bleu) + ~10% PiP archive + ~65% motion design cartographique

## Axe 1 — Palette de couleurs
- Couleurs dominantes :
  - Océan/fond carte : bleu pâle saturé halftone `#9FC8C9` à `#B7D4D4` (texture pointillée prononcée)
  - Terre / pays neutres : blanc cassé `#F4F1E8`
  - Bande Sahel highlight : jaune sable `#E8D7A0`
  - Highlight pays/conflit : rose poudré `#E5B5B5` (Mali tagué)
  - Texte : noir profond `#0A0A0A` serif (Le Monde signature)
  - Étoiles bases militaires : vert foncé olive `#3F5A3D`
  - Fond plateau présentatrice : bleu nuit dégradé `#1B2B45` → `#2C4365`
- Ratio approx : 40% bleu pâle océan, 30% terre crème, 15% highlights colorés, 10% texte/labels, 5% accents (étoiles, points)
- Mood : éditorial presse francophone classique, "atelier de cartographie" Le Monde, didactique, élégant, retenue chromatique. Halftone donne touche papier journal vintage.
- **Verdict palette** : 🟢 — palette CARTO CASPIAN-FRANÇAISE confirmée + signature halftone unique. Très proche template B mais avec la touche "papier journal" presse.

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - Carte 2D vectorielle West/North Africa, frontières fines noires
  - Texture halftone océan (pointillé visible, signature)
  - Labels pays SERIF capitales (typo Le Monde — Heading)
  - Highlight pays (fill teinté rose/jaune avec opacité ~70%)
  - Bande Sahel typographique grande échelle (lettres espacées étirées sur la zone)
  - Pictos camels dans cercles bleu marine pour "routes caravanières"
  - Picto étoile pour bases militaires (vert olive)
  - Tirets pointillés routes/itinéraires
  - PiP archive vidéo en cartouche bordure noire fine + tag "20h"
  - Logo M Le Monde discret coin haut-droit
- **Verdict assets** : 🟢 — très réutilisable. Halftone océan = différenciateur fort. Pictos cercles + étoiles + dotted lines = vocabulaire compact réutilisable Souverain.

## Axe 3 — Mouvements caméra
- Patterns dominants :
  - Pan+zoom doux sur carte (Ken Burns lent)
  - Add-layer séquentiel : carte vide → SAHEL apparaît → camels → highlight pays → étoiles
  - Cross-fade entre cartes (pas de hard cut)
  - PiP qui apparaît en slide-fade depuis le coin
- Durée moyenne des plans : 4-7s (très éditorial, lent, pédagogique)
- Spécificités : très peu de zoom agressif. Les plans respirent. Les ajouts d'éléments sont lents et lisibles. Aucun whip-pan.
- **Verdict caméra** : 🟡 — rythme trop lent pour Short 75s. À surveiller comme inspiration "respiration" mais accélérer 1.5-2x. La couche "add-layer séquentiel" est en revanche directement transposable.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : custom monochrome très clair, océan halftone via overlay PNG/SVG répété, terre `#F4F1E8`, frontières 0.5px noir
- Projection inférée : Mercator (visible distorsion latitudes nord)
- Layers principaux : océan halftone (raster) / pays fill / frontières / labels SERIF / highlight pays (additional fill layer toggleable) / pictos en svg overlay (Remotion)
- Animations Remotion : interpolate fadeIn pour highlights, sequence pour add-layer pédagogique, spring sur entrée pictos
- Difficulté de reproduction : ⬜ haute / ☑ moyenne / ⬜ basse (le halftone océan est le seul vrai défi — solution : SVG pattern fill ou texture PNG tileable)

## Frames sélectionnées (motion design priority)
- `frame-003-sahel-band-yellow.jpg` : bande Sahel typographique + PiP archive (composition signature)
- `frame-007-mediterrannee-halftone.jpg` : pure carte sans label — halftone le plus lisible
- `frame-010-routes-caravanieres-camels.jpg` : pictos cercles bleus camels — vocabulaire pictural
- `frame-015-mali-pink-highlight.jpg` : highlight pays rose — pattern teinte conflit
- `frame-040-mali-burkina-pip-archive.jpg` : PiP archive + carte terre crème
- `frame-050-bases-militaires-stars.jpg` : pictos étoiles vertes — exemple data points

## Verdict global vidéo : 🟢
Très proche d'un template "presse FR Sahel" exploitable directement pour Souverain. Halftone + serif + pictos circulaires = signature reconnaissable.
