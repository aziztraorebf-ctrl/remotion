# The NEW African Country Nobody Likes (Sahel Confederation)
URL : https://youtube.com/watch?v=nENRLqRXyME | Durée : 711s (~12 min) | Date upload : 2024-07-12
Ratio live-action / motion design : ~10% live action / 90% motion design (cartoon collage)

## Axe 1 — Palette de couleurs
- Couleurs dominantes : papier kraft beige `#c9a577` à `#b08a5a`, ombres pays `#3d3528` (brun foncé / quasi-noir), accents tape jaune `#f4d83a`, rouge militaire `#c8362e`, vert opposition `#4a8a3a` à `#2a5a2a`, drapeaux saturés (rouge/blanc/bleu, vert/jaune/rouge)
- Ratio approx : 45% beige kraft (fond), 20% gris/noir (ombres pays + texte), 15% rouge militaire, 10% vert opposition, 10% accents (jaune tape, drapeaux)
- Mood : carnet de terrain journalistique, ambiance "podcast géopolitique illustré", légèrement satirique
- **Verdict palette** : 🟢 — palette beige kraft + dark shapes + jaune tape **très distinctive** ; cohérence Souverain (chaleur africaine, neutre informatif), proche candidat F (Johnny Harris carnet) mais plus saturé / cartoon

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Fond papier kraft texturé** (texture grain visible)
  - **Pays en silhouette aplat foncé** (gris/noir) sur fond beige — très lisible
  - **Étiquettes "tape jaune"** type ruban adhésif fluo pour titres ("SAHEL CONFEDERATION")
  - **Personnages cartoon** dessinés à la main (Macron, présidents) avec drapeaux miniatures
  - **Bulles de dialogue** dactylographiées ("WE ARE LEAVING THE ECOWAS", "OUR URANIUM!!")
  - **Logos vectoriels** (ECOWAS, drapeaux) intégrés au collage
  - **Pictogrammes coup d'état** : poings levés, char d'assaut cartoon, croix rouge X
  - **Encarts mini-cartes Afrique** en bas-gauche (rappel localisation)
  - Légende couleurs (Junta & Sahel Alliance, Diplomatic Opposition...) avec carrés colorés
  - **Capture screenshot articles BBC** intégrée comme preuve documentaire
- **Verdict assets** : 🟢 — bibliothèque dense très réutilisable Souverain : silhouettes pays + bulles + tape labels + encart screenshot article. Style "scrapbook journaliste" inédit dans templates lockés

## Axe 3 — Mouvements caméra
- Patterns dominants : entrée pop des éléments (scale-in cartoon), shake léger sur impact (X rouge, poing), pan rapide sur carte, zoom progressif sur pays focus, layering progressif (fond → carte → silhouette → label → personnage)
- Durée moyenne des plans : 3-5 secondes (rythme rapide)
- Spécificités : **construction par couches accumulatives** plutôt que cuts (très Remotion-friendly), bounce easing sur entrées, pas de mouvement caméra continu lent
- **Verdict caméra** : 🟢 — pattern "couches accumulatives + bounce-in" parfaitement reproductible Remotion (`spring()` + `interpolate scale`), évite besoin caméra Mapbox complexe

## Recette technique (Mapbox + Remotion)
- Style Mapbox inféré : **pas Mapbox** — silhouettes pays vectorielles pré-extraites (geoJSON → SVG → import statique)
- Projection inférée : Mercator local Afrique de l'Ouest, projection figée
- Layers principaux : (1) fond papier kraft texture image, (2) silhouettes pays SVG remplis aplat, (3) overlays labels tape, (4) personnages PNG cartoon, (5) bulles dialogue
- Animations Remotion : `spring()` scale-in pour personnages/bulles, `interpolate` opacity layers, `random(seed)` pour micro-shake tape labels, sequence accumulative
- Difficulté de reproduction : ☑ moyenne — les **assets cartoon (personnages, pictos)** demandent illustration custom (Gemini i2i possible mais style consistency à valider)

## Frames sélectionnées (motion design priorité)
- `frame-002-map-pale-yellow-greybg.jpg` : variant carte "info BBC-style" pâle — 2e style coexiste
- `frame-005-cartoon-infographic-flags.jpg` : full collage cartoon, **densité visuelle** typique
- `frame-011-cartoon-macron-uranium.jpg` : satire Macron + bulle "OUR URANIUM!!" — angle éditorial fort
- `frame-014-paperbeige-darkshapes-yellowtape.jpg` : **frame signature** : silhouettes Sahel + tape "SAHEL CONFEDERATION" — pattern cible Souverain
- `frame-016-news-collage-sketchy.jpg` : screenshot BBC intégré + symboles dollar/dessin — pattern "preuve documentaire"

## Verdict global vidéo : 🟢
Style cartoon-scrapbook distinctif, palette beige kraft cohérente Souverain, assets reproductibles en Remotion. Candidat sérieux template E ou enrichissement candidat F.
