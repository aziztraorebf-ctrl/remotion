# How Africa is Becoming China's China
URL : https://www.youtube.com/watch?v=zQV_DKQkT8o | Durée : 10:48 | Date upload : 2018-07-31

## Axe 1 — Palette de couleurs
- **Charts data** : fond bleu nuit texturé `#1E2A3F`, ligne magenta néon `#E6217E`, axes blancs `#FFFFFF`, headline blanc bold
- Footage live : couleurs très saturées (textile factory orange `#E66518`), grade docu cinéma
- Big number overlays : blanc `#FFFFFF` bold sur footage, pas de fond — ombre portée légère
- Mood : éditorial data-driven, contraste fort, "économie chiffres explosifs"
- Ratio approx : 30% charts + big numbers, 50% footage live, 20% archives + cartes
- **Verdict palette** : 🟢 — Le chart bleu nuit + magenta = palette signature très distincte. Bleu nuit dialogue bien avec or de Souverain (bleu/or = palette presse classique, ledger financier). Magenta trop pop pour nous mais le PRINCIPE bleu sombre + accent saturé est transposable (or sur navy).

## Axe 2 — Assets / figures d'animation
- **Big number overlay** : nombre géant blanc bold (~300px) sur footage live, label dessous plus petit (`1.8 more / Chinese infrastructure projects`) — composant TRÈS FORT, signature Vox
- **Line chart animé** : axes blancs, ligne magenta qui se trace gauche→droite, labels année en bas (1965 1977 1990 2002 2015), titre en haut blanc bold
- **Headlines bold sans-serif** : famille type Vox = Balto/Suisse-Bold-like, condensé poids 700+
- **Texture fond** : pattern subtil triangulaire/géométrique sur le bleu nuit
- **Watermark Vox** top-right
- **Verdict assets** : 🟢 — Big number overlay et line chart magenta = composants directement reproductibles en Remotion. Big number = parfait pour Souverain (chiffres économiques explosifs).

## Axe 3 — Mouvements caméra
- Patterns dominants : push-in/pull-out sur archives, line draw progressif (chart), text scale-in sur big numbers, cuts secs entre data et footage
- Durée moyenne des plans : 2-4s (pacing nettement plus rapide que Borders)
- Spécificités : alternance footage live ↔ écran data full-screen toutes les 5-10s. Big numbers apparaissent par scale-in spring + tracking shot derrière (parallax léger). Chart ligne se trace sur ~2-3s.
- **Verdict caméra** : 🟢 — Pacing rapide adapté au format Short. Pattern "big number scale-in sur footage" directement applicable Souverain.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : peu de Mapbox dans cette vidéo (cartes statiques + footage). Style si refait : navy fond `#1E2A3F` + accent jaune/or
- Projection inférée : N/A
- Layers principaux : Remotion pur — Sequence chart, Sequence big number, Sequence footage
- Animations Remotion : `interpolate` sur strokeDashoffset (line draw chart), `spring` sur fontSize big number, `Img` + `interpolate` translateX (parallax)
- Difficulté de reproduction : ☑ basse — composants pure Remotion, pas de complexité Mapbox

## Frames sélectionnées
- `frame-005-satellite-mining-site.jpg` : satellite mining Afrique (référence layer Mapbox satellite)
- `frame-007-data-chart-gdp-magenta.jpg` : line chart signature Vox — composant à reproduire
- `frame-009-live-textile-factory.jpg` : footage live (référence non-reproductible, montre alternance)
- `frame-011-big-number-overlay-un.jpg` : big number overlay sur footage UN — pattern signature

## Verdict global vidéo : 🟢
