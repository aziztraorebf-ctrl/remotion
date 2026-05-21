# How Ocean Shipping Works (And Why It's Broken)
URL : https://youtube.com/watch?v=8d5d_HXGeMA | Durée : 19:17 (analysé 0-10min) | Date upload : 2021-11-17

## Axe 1 — Palette de couleurs
- Couleurs dominantes : satellite réaliste (vert `#3a4d2c`, océan `#1a3850`, sable `#7a6850`), HUD overlay noir `#0a0a0a` opacité 0.85 avec texte blanc et accent jaune-vert `#d4e85c`
- Ratio approx : satellite 80% / HUD overlay 15% / accents 5%
- Mood : surveillance/intel — esthétique « image satellite militaire » avec timestamp et coordonnées
- **Verdict palette** : 🟡 — palette très neutre, peu différenciante seule, MAIS le HUD timestamp+coords est un asset narratif fort à isoler

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - **HUD timestamp + coordonnées** (frame-006, frame-013) : badge noir top-left avec date `09/01/2021 12:14:00 UTC`, badge top-right `Longitude: 139° Latitude: 35° Bearing: 238°` — police mono, esthétique « satellite intel »
  - **Vue satellite zoom maximal** sur ports / navires individuels — niveaux de zoom 16-18
  - **Tilt léger** sur ports (frame-013 vs frame-006 = top-down vs oblique léger)
  - Stock aerial drone footage massif (containers, ports Maersk, détroit de Singapour) — non-reproductible
- **Verdict assets** : 🟢 pour le HUD coords/timestamp (asset isolable, transposable Or Africain ou Template C) ; 🟡 pour le satellite zoom max (Mapbox sait faire) ; 🔴 pour stock drone

## Axe 3 — Mouvements caméra
- Patterns dominants : (1) **satellite ZOOM 18 quasi-fixe** avec navire qui se déplace dans le cadre (animation par déplacement du sujet, pas de la caméra), (2) **changement brutal de localisation** avec coordonnées qui flippent, (3) drone footage cinématique
- Durée moyenne des plans : 3-4s (rapide)
- Spécificités : la caméra satellite est presque immobile — l'animation vient du sujet (navire qui glisse) et du HUD (chiffres qui changent). Très différent de video-2.
- **Verdict caméra** : 🟡 — pattern « satellite fixe + sujet animé » intéressant pour scènes de flux (caravanes, trajets), mais nécessite un sprite mobile (overlay HTML positionné en lat/lon animé). Pas LE pattern Template C principal.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : `satellite-v9` zoom 16-18, sans labels
- Projection inférée : Mercator, pitch 0-15° (top-down avec très léger tilt)
- Layers principaux : satellite base, sprite HTML overlay (navire/icone) animé via `map.project()` avec lat/lon interpolés, HUD badges en `<div>` Remotion (pas Mapbox)
- Animations Remotion : `interpolate` sur lat/lon du sprite → recalcul `project()` chaque frame, HUD timestamp = `Math.floor` sur compteur frames, `extrapolateRight: 'clamp'`
- Difficulté de reproduction : ☑ basse pour HUD seul, ☑ moyenne pour sprite-on-satellite (gestion projection + WebGL render headless)

## Frames sélectionnées
- `frame-006-satellite-port-hud-coords.jpg` : LA frame d'inspiration HUD intel
- `frame-013-satellite-port-tilt.jpg` : satellite top-down port avec coords + tilt léger
- `frame-002-stock-containers.jpg` & `frame-018-stock-maersk-port.jpg` : preuve dépendance archives (~70% de la vidéo)

## Verdict global vidéo : 🟡
Moins pertinente que video-2 mais le HUD timestamp+coords est un asset narratif réutilisable (style « rapport déclassifié »). Le reste = stock drone non-reproductible. À retenir partiellement pour le HUD pattern uniquement.
