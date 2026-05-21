# The English divide nobody talks about
URL : https://www.youtube.com/watch?v=DQzqmV7t6_0 | Durée : 784s (13:04) | Date upload : 2025-12-08

## Axe 1 — Palette de couleurs
- Couleurs dominantes (frames 3 + 4 cartes signature) :
  - Frame 3 (carte vierge) : fond bleu pâle `#BDDDF2`, terre blanc pur `#FFFFFF`, frontière noire fine `#000000` (~1.5px), ligne de division pointillée noire animée
  - Frame 4 (régions choropleth) : pastel rose `#E8A8B8`, vert menthe `#A8D5B8`, bleu ciel `#A8C8E0`, jaune `#F0E098`, orange `#F0B898`, mauve `#C8A8D8`, ligne pen-stroke rouge `#D63838` ~5px
  - Labels : boîtes blanches avec texte serif noir condensé (style "OS Map" UK)
- Ratio approx : eau pâle 30%, terre blanche/fill choropleth 60%, labels+ligne 10%
- Mood : "Ordnance Survey moderne", didactique, atlas scolaire britannique. Très clean, minimal
- **Verdict palette** : 🟢 — la palette **frame 3 (terre blanche + eau bleu pâle + frontière noire fine)** est ÉPURÉE et compatible Souverain. Remplacer le bleu eau par noir profond + terre or pâle = signature Souverain potentielle. Pattern minimaliste à backloguer en priorité

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Ligne pen-stroke animée** (frame 3 dashed, frame 4 rouge ondulée) — trace de division qui s'écrit progressivement comme stylo. Signature Map Men forte
  - **Boîte label rectangulaire** blanche avec texte serif noir, posée à côté du territoire avec leader implicite. ~9 régions chacune labellée frame 4
  - **Carte choropleth régionale** (frame 4) : 6 teintes pastel cyclant par région
  - **Inset weather forecast parodique** (frame 10) : encadré données superposé sur écran TV — `Liverpool 1000mm` + icône cloud SVG, fond glassmorphisme léger
  - **Press conference parodie** (frame 16) : podium "Department for Transport" + 2 drapeaux UK + écran de présentation déroulant — pas reproductible sans skit
- **Verdict assets** : 🟢 — la **ligne pen-stroke animée pour tracer une division** (frame 3 dashed + frame 4 red wavy) est LE pattern signature Map Men. Reproductible en Remotion via SVG path strokeDasharray animation. La boîte label rectangulaire blanche est aussi très propre

## Axe 3 — Mouvements caméra
- Patterns dominants : statique total sur la carte. Le mouvement vient EXCLUSIVEMENT de :
  1. Apparition séquentielle des labels (un par un)
  2. Tracé progressif de la ligne pen-stroke (le seul "mouvement" cinétique)
  3. Cut secs vers live-action / inserts
- Durée moyenne des plans carte : 3-6s (la carte sert de support pendant que la voix-off explique)
- Spécificités : aucun zoom, aucun pan, aucun ken burns. La carte est traitée comme une **page de manuel** qu'on annote en direct. C'est l'inverse complet de RealLifeLore
- **Verdict caméra** : 🟢 — modèle "carte = manuel annoté en live" très différenciant. Pour Souverain Short, idéal pour scènes "exposé pédagogique" où on veut citer 6 régions sans surcharger. Pen-stroke animé = élément cinétique fort à coût animation très bas

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : background eau pâle, country/region fill blanc ou pastel cyclique, line noir fin 1.5px, hide all labels Mapbox
- Projection inférée : Mercator zoomé sur région (UK ici, équivalent : Afrique de l'Ouest pour Souverain)
- Layers principaux : admin region fill, admin region borders. Tout le reste (ligne division, labels boîtes, inset data) = overlay Remotion par-dessus le canvas Mapbox capturé
- Animations Remotion :
  - Pen-stroke : SVG path avec `strokeDasharray` interpolate de `[0, pathLength]` → `[pathLength, 0]` sur 60-90 frames
  - Labels boîtes : sequential fade-in + scale spring(0.95→1) staggered 5f entre chaque
  - Inset data : slide-in depuis bord + fade
- Difficulté de reproduction : ☑ basse pour pen-stroke + labels (Remotion natif). ☑ basse pour la carte (style Mapbox simple)

## Frames sélectionnées
- `frame-0003-england-blank-dashed-line.jpg` : pattern minimaliste — terre blanche + eau pâle + ligne pointillée animée. À adapter Souverain en "noir+or"
- `frame-0004-england-regions-pastel-redline.jpg` : choropleth 6-teintes + labels boîtes blanches + ligne pen-stroke rouge ondulée. Template direct
- `frame-0010-weather-forecast-parody.jpg` : inset data avec icônes SVG — pattern "fiche stats régionales"
- `frame-0016-press-conference-parody.jpg` : skit live-action non reproductible (skip)

## Verdict global vidéo : 🟢
Vidéo la plus utile du scout : 2 patterns cartographiques minimalistes directement compatibles Souverain (pen-stroke division + labels boîtes), et un pattern inset data pour citer chiffres régionaux.
