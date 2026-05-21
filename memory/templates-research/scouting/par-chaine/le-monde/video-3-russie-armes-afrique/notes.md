# Comment la Russie de Poutine redéploie ses armes en Afrique
URL : https://www.youtube.com/watch?v=pAn8hkbbAGo | Durée : 6m34s | Date upload : 2025
Chaîne : Le Monde
Ratio live-action / motion design : ~50% archive vidéo (combat Libye/Syrie, intervieweurs) + ~50% motion design (satellite OSINT zoom, cartes 3D textured, pills annotations)

## Axe 1 — Palette de couleurs
- Couleurs dominantes :
  - Satellite imagery brut : sable désert `#C8B080` à `#A89060` + roches gris `#7A7066`
  - Texture papier kraft / cuir vieilli (carte satellite stylisée) : ocre `#B0905A` + ombrages bruns `#5A4030`
  - Annotation pill jaune : `#F4D040` à `#E8C030` fond + texte noir `#0A0A0A`
  - Annotation pill blanche : `#F8F8F0` + texte noir
  - Outline pays highlight : marron foncé `#3A2820` (visible sur frame Mali pill)
  - Marker square rouge OSINT : `#C03020`
  - Fond globe : noir profond `#000000` avec Afrique en or `#D9A84A` (frame 010 — clin d'œil clair à Or Africain V5 !)
  - Logo M Le Monde haut-droit en italique blanc/noir selon contraste
- Ratio approx : 35% satellite/sable, 25% archive footage, 15% texture papier, 10% annotations pills, 10% noir, 5% accents rouges/or
- Mood : investigation OSINT, Bellingcat-style à la française. Plus dramatique et moins didactique que video 1/2. Mélange satellite réaliste + annotations presse classique. Hybride C+E2 (Atlas 3D + NYT VI) avec touche francophone.
- **Verdict palette** : 🟢 — montre que Le Monde sait basculer en mode investigation. Palette satellite/kraft/pill jaune = directement transférable vers contenu Souverain à fort enjeu (Wagner, mines, blocus).

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - Imagerie satellite zoomée plein cadre (Google Earth / Maxar style)
  - Cartouches localisation top-left : "Maaten Al-Sarra, Libye" + "Juillet 2024" (deux blocs noir/blanc empilés)
  - Pills jaunes label pays sur carte (LIBYE, MALI) — typo bold sans serif
  - Marker carré rouge sur satellite (target indicator OSINT)
  - Carte stylisée texture papier/kraft 3D extruded (Mapbox satellite + filtre)
  - Pull-back/zoom-in agressif sur satellite (cinematic OSINT reveal)
  - Globe earth noir + Afrique highlight or (intro signature)
  - Logo Le Monde "M" italique discret coin haut-droit (toujours présent)
- **Verdict assets** : 🟢 — vocabulaire investigation pure. Pills jaunes signature. Cartouche localisation+date noir/blanc empilé = pattern simple à reproduire et très "presse FR".

## Axe 3 — Mouvements caméra
- Patterns dominants :
  - Pull-back satellite (zoom-out depuis détail vers contexte régional)
  - Push-in satellite OSINT (zoom-in vers marker rouge)
  - Pan latéral lent sur archive footage
  - Cross-cut rapide entre archive et carte (rythme investigation)
  - Tilt 3D sur carte texturée (parallaxe relief)
  - Le globe noir-or = entry signature (court, ~1.5s)
- Durée moyenne des plans : 3-5s (plus rapide que video 1 et 2 — rythme investigation)
- Spécificités : utilise vraiment le tilt 3D / parallaxe que video 1/2 n'ont pas. Combine satellite IRL et carte stylisée. Cadrage cinéma.
- **Verdict caméra** : 🟢 — directement utilisable pour Short Souverain à enjeu fort. Le combo "zoom satellite + pill annotation" est puissant et reproductible.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : `mapbox/satellite-v9` avec post-traitement (saturation +, vibrance désaturée, vignette) + custom layer texture papier overlay multiply
- Projection inférée : Mercator + tilt 60° + bearing variable pour effet 3D
- Layers principaux :
  - mapbox satellite base
  - country-fill highlight (semi-transparent or/jaune sur pays cible)
  - country-outline marron sombre 2px
  - markers OSINT (square rouge custom symbol layer)
  - texture paper overlay (Remotion CSS multiply blend)
- Animations Remotion :
  - flyTo / easeTo Mapbox pour push/pull satellite
  - spring pour entry pills jaunes
  - useCurrentFrame pour cartouches localisation (slide-in latéral)
  - blend mode multiply pour effet kraft sur layer satellite
- Difficulté de reproduction : ☑ haute / ⬜ moyenne / ⬜ basse (le tilt 3D + texture kraft + post-process satellite = R&D Mapbox-Remotion non triviale, vaut un POC dédié)

## Frames sélectionnées
- `frame-005-satellite-libye-osint.jpg` : satellite + cartouche localisation/date noir+blanc — pattern signature investigation
- `frame-010-afrique-or-globe-noir.jpg` : Afrique en or sur globe noir — signature Le Monde Afrique récente, proche template A Or Africain
- `frame-035-libye-pill-jaune.jpg` : pill LIBYE jaune typo bold — annotation pays signature
- `frame-045-territoire-texture-papier.jpg` : carte 3D extrudée texture kraft — différenciateur fort
- `frame-055-zoom-satellite-marker-rouge.jpg` : zoom satellite + carré rouge OSINT — Bellingcat français
- `frame-075-mali-pill-satellite-3d.jpg` : Mali pill terreuse sur satellite 3D — combo signature

## Verdict global vidéo : 🟢
**Vidéo la plus ambitieuse techniquement.** Le combo "satellite + pill jaune + cartouche noir/blanc + globe or-noir" forme un mini-template "investigation Le Monde Afrique 2024-2025" très distinct. Pour épisodes Souverain à enjeu fort (Wagner, blocus, mines disputées), ce vocabulaire est plus crédible que B (caspian) ou D (WonderWhy).
