# The $8 Billion Wall to Stop a Sahara Desert

URL : https://www.youtube.com/watch?v=yc-AW0t4UL0
Durée : 15:18 (analysé 0-10:00)
Date upload : 2026-01-23

## Axe 1 — Palette de couleurs
- Couleurs dominantes : sable/ocre `#c9a878`, vert savane `#5a7a3e`, vert vif accent (Great Green Wall line) `#3fc14d`, ciel/satellite bleu `#6f8aa6`, blanc labels `#ffffff`. Beaucoup de stock footage = palette terre + ciel naturelle, peu de "design palette" propre.
- Ratio approx : 50% terre/ocre (stock + map), 25% vert (savane + ligne signature), 15% bleu/ciel, 10% accents (labels, papercraft jaune crème)
- Mood : naturaliste, documentaire de terrain, peu de "dataviz mood". Le map shot satellite est l'exception dans une mer de B-roll.
- **Verdict palette** : 🟡 — palette terre/savane intéressante pour épisodes Sahel, mais trop dispersée et dépendante du stock pour servir de template direct.

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Carte satellite + overlay vectoriel** : satellite imagery (Google Earth-like) avec frontières blanches fines + ligne verte épaisse animée traversant le continent (signature shot, frame-006)
  - **Labels capitales/régions** : texte blanc sans-serif gras, drop shadow noir, sans cartouche (style "free-floating")
  - **Source attribution** : petit texte blanc en bas à gauche "Source: SLICE Earth", systématique sur chaque clip stock
  - **Papercraft illustration** (frame-035) : flat 2D plante stylisée avec ombres simples, beige/vert — utilisé pour vulgariser concepts (racines, écosystème)
  - **Cold open : aerial drone tree shadow** (frame-002) : pas un asset Remotion-compatible, c'est du stock
- **Verdict assets** : 🟢 (forte) sur le pattern "satellite + overlay vectoriel ligne progressive" — directement reproductible Mapbox satellite-v9 + Remotion line drawing. Le reste (papercraft, labels free-floating) = 🟡.

## Axe 3 — Mouvements caméra
- Patterns dominants : sur les maps = slow zoom-in lent (push-in 3-5s) + pan lateral très doux ; sur stock = coupes sèches courtes (2-4s par clip) ; pas de transition fancy entre clips, juste hard cuts au rythme voix-off
- Durée moyenne des plans : 3-5s sur stock B-roll, 6-10s sur les map shots signatures
- Spécificités : très peu de mouvement caméra "designed" — c'est un montage stock-driven. Quand mouvement il y a (sur map), c'est un push-in cinématique avec slight rotation parfois (parallaxe satellite).
- **Verdict caméra** : 🟡 — le push-in lent sur satellite map est élégant et reproductible, mais ce n'est pas LA signature (c'est leur fond de sauce universel).

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : **satellite-v9** (raster) plutôt que dark-v11. Pas de palette flat colorée pour ce shot — c'est de la photo satellite avec overlay.
- Projection inférée : mercator (cadrage Sahara horizontal classique)
- Layers principaux :
  - raster Mapbox satellite (background)
  - line layer GeoJSON pour Great Green Wall (couleur verte épaisse 6-8px, animation line-progress via interpolate)
  - symbol layer pour labels villes/pays (text-color blanc, text-halo noir, font Open Sans Bold)
- Animations Remotion : `interpolate(frame, [0, durationInFrames], [0, 1])` sur `line-gradient` ou `line-trim-end` pour faire pousser la ligne ; `spring()` pour push-in caméra (zoom 1.0 → 1.2 sur 4-5s)
- Difficulté de reproduction : ⬛ basse — Mapbox satellite + line layer animé = pattern bien documenté.

## Frames sélectionnées (5-7)
- `frame-002-coldopen-aerial-tree.jpg` : cold open texture, pas exploitable mais montre l'usage stock
- `frame-006-signature-map-sahara-greenline.jpg` : LE shot signature à reproduire (map satellite + ligne verte traversant le Sahel)
- `frame-010-stock-aerial-savana.jpg` : exemple de B-roll stock typique
- `frame-015-stock-character-feet.jpg` : stock humain au sol, intercalé pour incarner
- `frame-020-stock-aerial-cattle.jpg` : aerial top-down ;  pattern récurrent
- `frame-030-stock-tree-planting.jpg` : stock terrain action humaine
- `frame-035-papercraft-tree-illustration.jpg` : seule animation 2D "designed", style papercraft simple

## Verdict global vidéo : 🟡
Vidéo riche en stock footage, pauvre en animation cartographique signature. Une seule frame vraiment exploitable (le map shot satellite + green line). Le reste est du stock = pas reproductible et pas l'angle Souverain.
