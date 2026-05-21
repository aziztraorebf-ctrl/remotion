# Why South Africa is still so segregated
URL : https://www.youtube.com/watch?v=NVH7JewfgJg | Durée : 10:16 | Date upload : 2021-04-12

## Axe 1 — Palette de couleurs
- Couleurs dominantes (carte data) : fond crème clair `#EFEAE0`, océan bleu pastel `#BFD8DA`, dots catégoriels saturés mais non-criards : vert `#3F8A4E`, jaune `#F0B833`, rouge `#C8312A`, violet `#7E3F8F`, gris `#7C7C7C`
- Frames archive presse : tons sépia/N&B, papier ivoire `#E8E0D0`, encre noir `#1A1815`
- Footage live : couleurs réelles, désaturées de ~10% (LUT documentaire)
- Ratio approx (cross-vidéo) : 35% cartes data, 25% archives presse/photo, 30% footage live, 10% animations texte
- Mood : éditorial sobre, fond clair (rare chez Vox récent), data-viz "encyclopédique"
- **Verdict palette** : 🟡 — Palette claire bien différente de Or Africain (noir/or). Intéressant pour un Template "papier presse" mais pourrait être trop éloigné de la signature Souverain.

## Axe 2 — Assets / figures d'animation
- **Légende data-viz** : carré hexagones légère ombre, label noir tag avec ville (`Durban` en blanc sur tag noir arrondi)
- **Tags villes** : pill noir arrondi, texte blanc bold, queue de pointeur courte — TRÈS REPRODUCTIBLE Mapbox
- **Coupures presse** : fond crème, headline serif heavy, texte colonnes — overlay scan papier
- **Photos archive N&B** : tag rouge/noir avec libellé "National Party"
- **Lignes vectorielles superposées** sur carte (ligne ferroviaire qui se trace)
- **Footage live** brut sans grade marqué
- **Verdict assets** : 🟢 — Pills/tags villes + coupures presse = composants directement reproductibles. Confirme valeur Template "carto-éditorial papier".

## Axe 3 — Mouvements caméra
- Patterns dominants : zoom progressif sur carte (slow push), pan latéral le long d'une ligne (railway), cuts secs entre carte et photo archive, ken burns sur clipping presse
- Durée moyenne des plans : 3-5s sur carte, 1.5-2.5s sur photo, 4-6s sur footage
- Spécificités : ZÉRO whip-pan ou caméra trop dynamique. Pacing posé mais cuts nombreux. Ligne tracée animée le long d'un path = signature.
- **Verdict caméra** : 🟢 — Pattern "trace de path" sur carte = directement applicable Mapbox (LineLayer animé). Slow push éditorial cohérent avec ton Souverain.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : style custom clair, OSM-like, palette pastel, labels minimalistes
- Projection inférée : Mercator cylindrique standard
- Layers principaux : fond clair / océan / overlay dot density (custom canvas) / line (railway) / pills city labels
- Animations Remotion : interpolate path drawing (strokeDashoffset), spring sur apparition pills, ken burns scale 1→1.1 sur archives
- Difficulté de reproduction : ☑ moyenne (dot density custom canvas non trivial mais pills + line sont basiques)

## Frames sélectionnées
- `frame-002-dot-density-map-durban.jpg` : data-viz dot density + pill city tag (Durban)
- `frame-005-railway-line-overlay.jpg` : ligne traçante sur carte claire
- `frame-008-archive-photo-caption-tag.jpg` : photo archive N&B + caption tag blanc bold sur pill noire
- `frame-010-newspaper-clipping.jpg` : coupure presse animée (composant fort)
- `frame-012-live-footage-township.jpg` : footage live (référence palette désaturée)

## Verdict global vidéo : 🟢
