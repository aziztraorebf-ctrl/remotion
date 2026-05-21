# How Africa is Becoming China's China
URL : https://youtube.com/watch?v=zQV_DKQkT8o | Durée : 10:48 | Date upload : 2018-07-31

## Axe 1 — Palette de couleurs
- Couleurs dominantes : satellite Blue Marble (océan `#0a2742`/`#0e3b66`, terres `#3a5a3a`/`#6b8253`), accent rouge Chine `#a31a1a` à `#c92020`, étoiles or `#d8a93a`, halo bleu pâle `#9bb6d4` pour pays « cibles »
- Ratio approx : satellite 70% / accent rouge 20% / blanc texte 5% / or 5%
- Mood : géopolitique sobre, Blue Marble réaliste avec un seul accent saturé pour lire l'argument
- **Verdict palette** : 🟢 — palette satellite + 1 accent narratif unique = directement applicable Template C ; le rouge est interchangeable (or pour Souverain)

## Axe 2 — Assets / figures d'animation
- Composants identifiés : carte satellite NASA Blue Marble équirectangulaire, contour pays en trait épais (~2-3px ivoire/or), fill semi-transparent (rouge à ~70% opacité), étoiles vectorielles décoratives (drapeau chinois symbolique), labels rectangulaires à fond plein avec texte blanc (UNITED STATES en frame-003), bandes letterbox noires (vidéo 16:9 dans cadre 16:9 letterboxed pour effet ciné)
- Beaucoup de stock footage (rues Burkina, Shanghai nuit, Cité interdite, marchés Lagos) — non-reproductible sans archives
- **Verdict assets** : 🟢 pour la carte satellite + overlay pays ; 🔴 pour stock footage (n'importe-qui peut faire pareil mais pas pertinent pour notre stack Mapbox)

## Axe 3 — Mouvements caméra
- Patterns dominants : (1) zoom progressif lent sur carte fixe (push-in 5-8s, échelle ~1.0→1.2x), (2) cross-fade carte → stock footage, (3) plans stock fixes 3-5s
- Durée moyenne des plans : 4-5 secondes
- Spécificités : la carte ne BOUGE quasiment pas — le mouvement vient d'apparitions séquentielles (pays qui se colorent un par un, étoiles qui pop)
- **Verdict caméra** : 🟡 — patterns simples mais efficaces ; le « pop séquentiel des pays » est exactement ce qu'on fait déjà sur Or Africain. Rien de nouveau.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : `satellite-v9` (raster Blue Marble équivalent) avec atténuation/grain ajouté en post
- Projection inférée : équirectangulaire (mercator-like, distorsion polaire visible) — à confirmer pour Short vertical
- Layers principaux : raster satellite (base), GeoJSON countries fill `fill-color` rouge `#a31a1a` opacité 0.7, GeoJSON countries line ivoire `#e8d8b8` width 2px, SVG étoiles superposées en HTML overlay, labels en HTML `<div>` pas Mapbox symbol
- Animations Remotion : `interpolate` opacity 0→0.7 sur fill par pays, stagger 8-12 frames, `spring()` sur scale des étoiles
- Difficulté de reproduction : ☑ basse (pattern Or Africain V5 quasi-identique, juste swap palette noir+or → satellite+accent)

## Frames sélectionnées
- `frame-003-world-satellite-label.jpg` : carte mondiale satellite + label cartouche US, référence layout
- `frame-005-africa-china-overlay.jpg` : LA frame signature — Afrique entière fill rouge + étoiles or, motif géopolitique fort
- `frame-007/011/019-stock-*.jpg` : preuve que Wendover repose massivement sur archives (pertinent pour évaluer reproductibilité)

## Verdict global vidéo : 🟡
Carte = directement utile (palette satellite + overlay pays). Mais 70% de la vidéo = stock footage qu'on ne peut pas reproduire. La leçon : Wendover n'innove PAS sur les cartes ici, c'est du Or Africain V5 avec satellite à la place de noir.
