# Europe's most fortified border is in Africa
URL : https://www.youtube.com/watch?v=LY_Yiu2U2Ts | Durée : 10:52 | Date upload : 2017-12-05

## Axe 1 — Palette de couleurs
- Couleurs dominantes (cartes Google Earth-style) : verts naturels `#3E5E2A`/`#7D9A4F`, ocre désertique `#A5764A`, océan profond `#0A1F2A`, blanc neige sommets
- Frames interview : tons réalistes warm desert, fond noir + caption blanc bold (`#FFFFFF` sur `#000000` 80% alpha)
- Watermark "Vox" wordmark blanc top-right toutes frames
- Mood : reportage terrain immersif, OSINT-cinéma, peu d'animations propres
- **Verdict palette** : 🔴 — Palette satellite "Google Earth" peu différenciante et coûteuse à reproduire (imagerie satellite haute déf). Pas pertinent pour Souverain.

## Axe 2 — Assets / figures d'animation
- **Captions interview** : texte blanc bold sans-serif, pas de fond — outline noir léger ou shadow drop
- **Labels lieux sur carte 3D** : texte blanc capitales bold incrusté à plat sur surface (`MELILLA`), suit perspective
- **Wordmark Vox** : signature top-right
- **Drone footage / orbital satellite** : pas reproductible chez nous
- Très peu de composants graphiques propres — Vox-Borders ère Johnny Harris privilégie la direct-to-camera + cartes 3D Google Earth
- **Verdict assets** : 🟡 — Caption interview style + label perspective sur carte sont reproductibles. Le reste = footage. Limité pour Template Souverain.

## Axe 3 — Mouvements caméra
- Patterns dominants : orbital flyover Google Earth (zoom out depuis sol vers vue continentale), tilt 3D sur terrain satellite, cuts cinématique vers footage handheld
- Durée moyenne des plans : 4-7s (plus long que video-1 et video-3)
- Spécificités : signature Borders = transition fluide carte 3D ↔ footage terrain. Ralentis légers (~80%). Zéro animation graphique pure pendant les segments live.
- **Verdict caméra** : 🟡 — Orbital 3D Mapbox `flyTo` + `pitch` peut imiter le pattern. Mais Souverain Short = pas de footage terrain donc on peut juste retenir le `flyTo` + `pitch 60°`.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : satellite-streets-v12 (imagerie satellite + labels)
- Projection inférée : globe ou Mercator avec pitch 45-60°
- Layers principaux : raster satellite / labels custom 3D / annotations text
- Animations Remotion : `easeCamera` sur center + zoom + pitch simultanés ; label fade-in à mid-zoom
- Difficulté de reproduction : ☑ moyenne (Mapbox satellite + flyTo + pitch — déjà testé en R&D selon mapbox-effets-et-tests.md)

## Frames sélectionnées
- `frame-002-satellite-map-melilla-port.jpg` : vue oblique satellite, mood cinématique
- `frame-006-interview-caption-bottom.jpg` : caption interview blanc bold sans fond
- `frame-008-satellite-melilla-label.jpg` : label perspective sur surface (composant utile)
- `frame-010-interview-quote-overlay.jpg` : caption + watermark Vox (référence layout)

## Verdict global vidéo : 🟡
