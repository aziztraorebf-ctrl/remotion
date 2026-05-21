# Why Russia Isn't Actually Collapsing

URL : https://www.youtube.com/watch?v=0T7Itt9mqtA
Durée : 52:28 (analysé 0-10:00)
Date upload : 2023-08-26

## Axe 1 — Palette de couleurs
- Couleurs dominantes :
  - Maps : terre satellite muted `#3a4a3a` / `#5a4a3a` (teinte désaturée), pays surlignés en flat colors saturés : rouge `#c0392b` (Russie/territoire occupé), jaune-moutarde `#d4a82a` (Ukraine-held), violet `#7a4a8a` (zones militaires)
  - Texte/labels : cartouches noirs `#0a0a0a` avec texte blanc `#ffffff`, accents jaune `#f5d042` (events), vert flashy `#3fc14d` (good news), cyan `#3fd4d4` (data lines)
  - Charts dark : background quasi-noir `#0a0815` avec quadrillage très subtil, cyan vif pour la data line
- Ratio approx : sur les map shots — 40% terre désaturée, 25% rouge/jaune territoires, 20% noir labels, 15% bleu océan ; sur charts — 60% noir, 25% data colorée, 15% labels
- Mood : **autoritaire, news-style, "expert qui décode"**. Beaucoup plus designed que video 1. C'est cette vidéo qui incarne la signature RealLifeLore "fond de sauce".
- **Verdict palette** : 🟢 — cartouches noirs + accents saturés (jaune/vert/rouge) = pattern réutilisable. Diffère d'Or Africain V5 (noir+or pur ledger) car ici c'est noir + multi-accents tactiques, plus géopolitique que financier.

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **Cartouche label noir** (frame-010, 036) : pill/rectangle noir aux coins légèrement arrondis, texte blanc bold all-caps, drop shadow subtil. Posé directement sur la zone du pays. C'est LA figure signature.
  - **Country fill flat coloré** : par-dessus satellite map, pays surligné avec opacity ~70% en couleur narrative (rouge ennemi, jaune allié, vert neutre). Bordure blanche fine.
  - **Animated arrow rouge** (frame-010) : flèche épaisse rouge avec drop shadow, traçage progressif de A vers B avec icône "no entry" rouge à l'origine = blocage symbolique. Très fort narrativement.
  - **Portrait pin + nameplate + stat grid** (frame-030) : portrait circulaire ovale avec drapeau du pays (Putin + drapeau russe), nameplate noir "VLADIMIR PUTIN", grille de pictogrammes humains verts/blancs représentant un %, footer noir "APPROVAL RATING: 82%" avec accent vert. **Excellent module dataviz character-driven**.
  - **Newspaper clipping** (frame-018) : screenshot direct NYT inséré pas-de-frame, juste le clipping brut avec son fond blanc. Coupe sèche depuis map.
  - **Line chart sur fond noir** (frame-040) : ligne cyan vive, événements annotés avec petits drapeaux jaunes/verts, dates en bas, transition zone "Soviet Union" en pink/red translucide. Très lisible.
  - **Legend coin bas-gauche** : petits carrés colorés + texte blanc, fond translucide, coin inférieur gauche
- **Verdict assets** : 🟢 (très forte) — au moins 4 modules réutilisables identifiés, tous reproductibles Remotion.

## Axe 3 — Mouvements caméra
- Patterns dominants :
  - Sur maps : push-in lent (zoom 1.0 → 1.3 sur 4-6s) ou pan parallaxe lateral (caméra qui dérive sur le satellite imagery), souvent suivi d'un freeze pour permettre lecture des labels
  - Apparition labels : fade-in + légère scale up (0.95 → 1.0) sur 0.3-0.5s, séquentiel (label 1 puis 2 puis 3 décalés de 0.4s)
  - Flèches animées : draw progressive ~1-1.5s avec easing
  - Coupes sèches entre map / stock / chart, pas de transition designed
  - Charts : la ligne se dessine progressivement (line-trim-end animation), tags événements pop-in après le passage de la ligne au point
- Durée moyenne des plans : maps 8-12s (assez long pour absorber labels), stock 2-3s, charts 6-10s
- Spécificités : **rythme retentif sur les maps** — donne le temps de lire. Les labels arrivent en cascade narrative (pas tous d'un coup). C'est ce qui crée la sensation "didactique premium".
- **Verdict caméra** : 🟢 — push-in lent + apparition séquentielle labels = pattern Souverain-compatible direct.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : **custom dark/satellite hybrid** — satellite raster désaturé (filtre CSS `filter: saturate(0.6) brightness(0.7)` ou Mapbox raster-saturation -0.4 + raster-brightness -0.2). Pas dark-v11 pur (on voit relief subtil).
- Projection inférée : mercator
- Layers principaux :
  - raster satellite (désaturé)
  - fill layer GeoJSON pays (fill-color narratif, fill-opacity 0.6-0.7, fill-outline-color blanc)
  - line layer pour frontières (line-color blanc, line-width 1.5)
  - symbol layer JAMAIS — les labels sont **rendus en HTML/Remotion par-dessus la carte**, pas dans Mapbox (animation et styling cartouche plus libres)
- Animations Remotion :
  - `<Sequence from={X}>` par cartouche label, fade-in + scale spring
  - Component `<MapLabelChip text="..." x={lon} y={lat} />` qui projette via mapboxRef.project()
  - Arrows : SVG path avec stroke-dasharray + stroke-dashoffset interpolé (line drawing classique)
  - Charts : `<Sequence>` + interpolate sur path d=
- Difficulté de reproduction : ⬛ moyenne (basse pour map+labels, moyenne pour le module portrait+stat-grid à designer).

## Frames sélectionnées (5-7)
- `frame-002-stock-coldopen-armored.jpg` : cold open stock, pas exploitable mais documenté
- `frame-006-stock-meeting.jpg` : exemple stock politique typique
- `frame-010-signature-map-flat-fills-arrow.jpg` : **LA frame signature** — map satellite + country fills colorés + cartouches noirs + flèche rouge animée + legend
- `frame-018-newspaper-clipping-headline.jpg` : pattern "preuve documentaire" — clipping NYT brut intercalé
- `frame-030-overlay-portrait-pin-stat-grid.jpg` : **module dataviz character-driven** à reproduire (Putin portrait + nameplate + people-grid stat)
- `frame-036-flat-map-territory-labels-bars.jpg` : variante zoom serré du pattern signature, montre les labels en cascade
- `frame-040-darkbg-line-chart-event-tags.jpg` : pattern line chart événementiel à fond noir

## Verdict global vidéo : 🟢
Vidéo dense en patterns visuels signatures, directement transposables Mapbox+Remotion. C'est la pierre angulaire du scout RealLifeLore. Au moins 4 modules à mettre en backlog.
