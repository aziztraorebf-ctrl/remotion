# Understanding Western Sahara
URL : https://www.youtube.com/watch?v=4SakRNO_SMY | Durée : 7:27 | Date upload : 2014-07-30

## Axe 1 — Palette de couleurs
- Couleurs dominantes : **fond texture sable `#e6c896`** (cards), rouge Maroc `#c1272d`, vert Polisario `#0d9b4a`, jaune `#f3c200`, bleu ONU `#5b8dc4`. Satellite désertique (ocre+brun).
- Ratio approx : 40% sable/desert texture · 25% drapeaux saturés · 20% satellite désert · 15% texte noir
- Mood : "tableau scolaire géopolitique", chaud, terre cuite. Vibe Sahara assumée comme texture de fond.
- **Verdict palette** : 🟢 — la **texture de fond contextuelle** (sable ici, jungle pour Congo, neige possible ailleurs) est une idée forte adaptable à Souverain (texture lingot d'or, texture pétrole, texture papier ledger).

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Background texture pleine** (sable, dunes) qui contextualise le sujet
  - Drapeaux SVG plats avec **bulles dialogue** comic-style (white speech bubble + tail)
  - Logos institutionnels (UN, OAU) en watermark/icône
  - Satellite avec **fill polygone color-coded par contrôle territorial** (Maroc rouge / Polisario vert / zone tampon jaune)
  - Animation flèche pointillée pour mouvements géopol
- **Verdict assets** : 🟢 — les **bulles dialogue sur drapeaux** sont une trouvaille narrative pour Souverain (faire "parler" un État sans portrait humain). Très réutilisable.

## Axe 3 — Mouvements caméra
- Patterns dominants : zoom satellite vers POI (Tindouf), pan slow sur background sable, **apparition séquentielle d'acteurs** (drapeau + bulle) avec spring scale
- Durée moyenne des plans : 4-6s
- Spécificités : usage massif du **fond texture statique** où apparaissent éléments narratifs animés. Caméra elle-même peu mobile — le mouvement vient des entrées d'acteurs.
- **Verdict caméra** : 🟡 — pattern "fond fixe + acteurs qui pop" est efficace pédagogique mais peu cinématographique. À doser, pas à reproduire intégralement.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : `satellite-v9` (zones désertiques) ; pour cards = pas Mapbox, juste `<AbsoluteFill>` avec image texture
- Projection inférée : Mercator standard
- Layers principaux : raster satellite + fill polygones (3 zones contrôle) + symbol layer markers POI
- Animations Remotion : `<Img>` background fixe + `<Sequence>` drapeaux avec spring + bulle dialogue en SVG path animé (stroke-dasharray ou simple opacity+scale)
- Difficulté de reproduction : ⬜ haute / ⬜ moyenne / ☑ basse

## Frames sélectionnées
- `frame-0002-territory-fill-satellite.jpg` : satellite + 3 fills (rouge/vert/jaune) avec marker POI animé
- `frame-0005-sand-bubble-flags.jpg` : drapeau Maroc + bulle dialogue + logo ONU sur fond sable
- `frame-0008-sand-flags-actors.jpg` : 2 acteurs (OAU + Sahrawi flag) sur fond sable, layout staged

## Verdict global vidéo : 🟢
