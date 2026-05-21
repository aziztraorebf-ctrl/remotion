# Why Are There Two Congos?
URL : https://www.youtube.com/watch?v=yA4uvWhvmHw | Durée : 7:23 | Date upload : 2018-03-06

## Axe 1 — Palette de couleurs
- Couleurs dominantes : kraft beige `#d9c8a4` (fonds carte d'étude), bleu océan satellite `#0e2a3d`, vert végétation `#3b6b3a`, accents flag (jaune `#f7d000`, rouge `#c8102e`, bleu `#2e7cd6`)
- Ratio approx : 35% beige/kraft (cards) · 30% satellite (vert+bleu) · 20% drapeaux saturés · 15% B&W archival
- Mood : manuel scolaire vintage, chaud, didactique, documentaire-cours. Pas de noir profond.
- **Verdict palette** : 🟡 — chaude et lisible mais trop "edu-classique" ; à l'opposé du noir+or Souverain. Différenciée naturellement, mais peu inspirante pour notre signature ledger.

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - Satellite imagery (NASA/Bing) en base avec **fills de couleur plate** par territoire (alpha ~0.7) qui se révèlent par fade
  - Drapeaux SVG plats avec **ombre portée subtile** (carte étude posée sur table)
  - Photos archivées noir & blanc (gare de Bruxelles 1900s) en plein cadre, ken burns lent
  - Cartes vintage (1880s) scrollées/zoomées
  - Labels typographie sans serif blanc avec halo discret, leader lines pointillées
- **Verdict assets** : 🟢 — pattern "satellite + flat color fill par territoire animé dans le temps" est exactement ce qu'on cherche pour Souverain (avant/après nationalisations). Reproductible Mapbox.

## Axe 3 — Mouvements caméra
- Patterns dominants : pan lent horizontal sur carte vintage, zoom-in progressif vers POI, fade par couches (territoires colorés apparaissent un par un), ken burns sur photos archives
- Durée moyenne des plans : 4-7s
- Spécificités : **transitions chronologiques par color-fill animé** — le territoire change de couleur (= change de souverain) sans cut. Frontières restent fixes, le remplissage évolue.
- **Verdict caméra** : 🟢 — le "color fill chronologique" est la meilleure idée pour Souverain ép. nationalisations/concessions.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : `satellite-v9` avec hue/saturation poussées
- Projection inférée : Mercator standard
- Layers principaux : satellite raster + GeoJSON polygones territoires (fill-opacity animé) + symbol layer drapeaux + label layer
- Animations Remotion : interpolate fill-opacity et fill-color des polygones par époque ; spring sur apparition labels ; Img + scale ken burns sur archives
- Difficulté de reproduction : ⬜ haute / ☑ moyenne / ⬜ basse

## Frames sélectionnées
- `frame-0002-archival-photo.jpg` : pattern photo B&W plein cadre (cold open historique)
- `frame-0004-satellite-flags.jpg` : satellite + drapeaux ancrés sur territoires (signature)
- `frame-0006-kraft-flag-card.jpg` : "fiche d'étude" kraft + drapeau + label (inter-section)
- `frame-0008-flag-territory-overlay.jpg` : flat color fills par territoire avec drapeaux superposés (idéal Souverain)
- `frame-0010-vintage-map-zoom.jpg` : carte 1880s pan/zoom (transition époque)

## Verdict global vidéo : 🟢
