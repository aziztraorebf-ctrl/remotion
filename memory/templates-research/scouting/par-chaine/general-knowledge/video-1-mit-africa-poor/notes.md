# MIT Study Reveals Why Africa Is Still Poor
URL : https://youtube.com/watch?v=1k8TXQWVsoI | Durée : 1154s (~19 min) | Date upload : 2024-02-27
Ratio live-action / motion design : ~60% live action / 40% motion design

## Axe 1 — Palette de couleurs
- Couleurs dominantes (cartes) : océan `#3b6680` (bleu-gris moyen), terres en surbrillance `#e8a740` (jaune-orange ocre), terres neutres `#e8e1d4` (beige clair), routes/highlights `#e63b3b` (rouge vif), accents `#d97a2a` (orange brûlé)
- Stock footage : très saturé, ciel `#5a9bd9`, sols `#c4866a` à `#8a4a2a`, pas de cohérence palette imposée
- Ratio approx : 50% beige/blanc-cassé, 25% bleu océan, 15% accents orange/jaune, 10% rouge tracé
- Mood : éducatif vintage, didactique scolaire, légèrement daté
- **Verdict palette** : 🔴 — palette éducative générique, pas distinctive, et incohérente entre stock footage saturé et cartes plates pastel

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - Cartes monde 2D plates avec continents en aplat coloré (style "world atlas school")
  - Routes tracées en lignes rouges fines (Silk Road, routes commerciales)
  - Surbrillance pays : aplat orange par-dessus carte beige
  - Encarts académiques : photo personne + logo institution + extrait PDF (MIT, Acemoglu)
  - Stock footage drone Afrique (déserts, marchés, villages)
  - Captures jeu vidéo low-poly (illustratif "civilisation")
  - Texture papier subtile sous les cartes
  - Marqueurs cardinaux (N/S/E/W) en filigrane
- **Verdict assets** : 🟡 — pattern "card carte + photo + citation académique" intéressant pour épisode Souverain didactique (cf. frame-013), mais cartes elles-mêmes trop scolaires

## Axe 3 — Mouvements caméra
- Patterns dominants : zoom-in lent sur région highlight (5-8s), pan latéral lent, fade entre stock footage et carte, cuts secs sur encarts académiques
- Durée moyenne des plans : 4-6 secondes
- Spécificités : alternance systématique stock footage (4s) → carte (6s) → talking head/encart (5s) ; carte n'apparaît qu'en illustration ponctuelle, pas comme support principal
- **Verdict caméra** : 🟡 — pattern "carte comme illustration intercalée" applicable ; mais pas de signature mouvement forte

## Recette technique (Mapbox + Remotion)
- Style Mapbox inféré : pas Mapbox — assets cartes pré-rendus 2D (Photoshop/Illustrator), texture papier appliquée
- Projection inférée : Equirectangular ou Mercator simple
- Layers principaux : terre aplat beige, océan bleu-gris, frontières fines, surbrillance pays orange semi-transparent, lignes routes rouges
- Animations Remotion : interpolate opacity sur surbrillance, stroke-dashoffset sur routes, fade-cross entre stock et carte
- Difficulté de reproduction : ☑ basse (cartes 2D simples, stock footage = obstacle de licensing)

## Frames sélectionnées (motion design priorité)
- `frame-001-stockfootage-desert-aerial.jpg` : exemple stock footage typique, à éviter pour Souverain
- `frame-004-stockfootage-market.jpg` : stock africain marché, 60% du contenu
- `frame-007-map-silkroad-yellow-blue.jpg` : pattern carte routes + continents jaunes — daté
- `frame-010-map-africa-orange-highlight.jpg` : highlight pays sur carte plate Mercator — pattern réutilisable simple
- `frame-013-cardpaper-academic-quote.jpg` : encart MIT + photo + extrait PDF — **pattern intéressant pour citation académique Souverain**
- `frame-009-stockfootage-game-lowpoly.jpg` : capture jeu low-poly comme métaphore — louche, à éviter
- `frame-015-stockfootage-village.jpg` (non copiée) : village rond drone

## Verdict global vidéo : 🔴
Trop dépendante de stock footage, palette incohérente, esthétique scolaire datée. Seul le pattern "encart citation académique" est récupérable.
