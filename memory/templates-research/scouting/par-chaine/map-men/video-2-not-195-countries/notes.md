# There are NOT 195 countries
URL : https://www.youtube.com/watch?v=3nB688xBYdY | Durée : 735s (12:15) | Date upload : 2024-06-23

## Axe 1 — Palette de couleurs
- Couleurs dominantes (frame 8 carte signature) : océan bleu pâle `#B7E0F2`, vert pomme `#C8E6A0`, jaune crème `#F4E89A`, rose corail `#F2A6A6`, orange tendre `#F4C28A`, frontières noires épaisses ~3-4px `#000000`
- Ratio approx (frame 8) : terre multicolore ~70%, eau bleu pâle 25%, frontières noires 5%
- Mood : "atlas pour enfants 1980", flat, ludique, palette 4-5 couleurs en cycle pour différencier pays adjacents
- **Verdict palette** : 🟡 — palette pastel ne match pas Souverain mais le PRINCIPE (4-5 couleurs en rotation par pays adjacent + frontière noire grasse) est intéressant. À tester en version "noir+or+ledger" : 4 teintes or désaturées en rotation

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Carte choropleth 5-couleurs cycliques** avec frontières noires épaisses (signature visuelle forte, low-cost)
  - **Hybride carte satellite + fill drapeau territoire** (frame 14 : Catalogne en motif drapeau rouge/jaune par-dessus image satellite Espagne) — pattern "spotlight territoire" sur basemap réaliste
  - **Sprites avions vectoriels** posés sur carte papier vintage (frame 17) — petites icônes positionnées géographiquement
  - **Cartouche événement historique** (frame 5 "Chinese Civil War 1927-1949") : fond jaune crème, titre serif noir, dates en sous-titre, 2 portraits + 2 emblèmes côte à côte
  - **Big question mark overlay** (frame 2) : "?" rouge ~250px posé au centre d'une carte du monde — figure rhétorique
- **Verdict assets** : 🟢 — le pattern **fill drapeau-en-motif sur territoire spécifique** (frame 14) est exploitable pour Souverain : highlight d'une région contestée avec son drapeau revendicatif. Le cartouche événement (frame 5) est un template direct pour les "fiches contexte" Souverain

## Axe 3 — Mouvements caméra
- Patterns dominants : carte plein écran statique avec apparition d'éléments + flash-cuts vers sketches live-action. Sur la carte satellite (frame 14), zoom léger (~1.05x) + apparition fill drapeau en fade ou wipe
- Durée moyenne des plans carte : 2-5s
- Spécificités : utilisation très intentionnelle du **cut sec** comme rythme principal — pas de transitions douces. La carte n'est jamais "explorée" longtemps, elle illustre un point puis disparaît
- **Verdict caméra** : 🟢 — le rythme cut-sec entre carte / cartouche / live-action est une stratégie de retention différente de RealLifeLore (qui mise sur ken burns long). Pour Souverain Short, le cut sec correspond mieux au ton ledger/factuel que le ken burns cinematic

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : background bleu pâle eau, fill-color par feature-state cyclant 4-5 teintes (Mapbox `match` expression sur ISO code modulo 5), line noir 3px
- Projection inférée : Mercator. Frame 14 utilise raster satellite tiles (mapbox-streets ou satellite style)
- Layers principaux : country fill (5-color cycle), country borders (black thick), pour frame 14 : raster satellite + custom polygon layer fill-pattern (drapeau Catalogne en SVG repeat pattern)
- Animations Remotion : pour cartouche événement = sequence 0.5s fade-in + portraits scale spring. Pour fill drapeau = setPaintProperty fill-pattern via interpolate frame
- Difficulté de reproduction : ☑ basse pour la carte 5-couleurs ; ☑ moyenne pour le fill-pattern drapeau (nécessite préparer le SVG repeat)

## Frames sélectionnées
- `frame-0008-pastel-flat-borders.jpg` : signature carte 5-couleurs cycliques + frontières noires grasses
- `frame-0014-satellite-flag-fill.jpg` : pattern hybride satellite + fill drapeau territoire — le plus exploitable pour Souverain
- `frame-0017-paper-map-airplane-sprites.jpg` : sprites posés sur carte papier vintage — pattern "trajets aériens / routes"
- `frame-0002-question-mark-overlay.jpg` : figure rhétorique "?" sur carte — backlog pour cold opens Souverain

## Verdict global vidéo : 🟢
Trois patterns reproductibles solides, dont la carte 5-couleurs et le fill drapeau territoire qui complètent bien le vocabulaire visuel Souverain.
