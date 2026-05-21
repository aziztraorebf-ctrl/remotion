# Comprendre la situation au Mali en 5 minutes
URL : https://www.youtube.com/watch?v=IHWBx7qnE98 | Durée : 5m01s | Date upload : ~2013
Chaîne : Le Monde
Ratio live-action / motion design : ~95% motion design cartographique pur + ~5% archive vidéo en plein écran

## Axe 1 — Palette de couleurs
- Couleurs dominantes :
  - Fond carte / océan : gris très clair `#D8D8D8` (presque "papier journal")
  - Terre pays neutres : blanc `#FFFFFF` à gris perle `#E8E8E8`
  - Sahara highlight : sable doux `#E8D7A0` à `#D6B470`
  - Sahel highlight : jaune-vert pâle `#D8D188`
  - Mali outline conflit : contour rouge brique `#A04030` (trait épais ~3px)
  - Zone peuplement Touareg : orange terracotta translucide `#D88B4A` opacité 50%
  - Zone Azawad rebellion : rouge orangé `#C45530` plus saturé
  - Zone d'action AQMI : contour vert olive `#5A7A3A` (cercle ovale tracé)
  - Algérie/Libye highlight : violet poussiéreux `#7A4A6A` translucide
  - Wordmark "Le Monde" coin bas-gauche en italique noir
  - Globe miniature coin haut-droit (référence position)
- Ratio approx : 50% gris clair, 25% terres beige/orange, 15% rouge/orangé Mali, 5% texte/labels, 5% violet/vert
- Mood : austérité éditoriale, "carte d'état-major", très français presse classique. Plus minéral et moins coloré que video 1. Très proche carto manuel papier.
- **Verdict palette** : 🟢 — référence forte pour template "presse FR éditorial sobre". Palette terre+rouge brique+orangé est exactement ce qui manque entre B (caspian) et D (papier WonderWhy).

## Axe 2 — Assets / figures d'animation
- Composants identifiés :
  - Carte vectorielle simple sans texture (pas de halftone ici — différence avec video 1)
  - Frontières blanches fines entre pays
  - Labels pays SERIF petites capitales en noir
  - Outline pays-conflit avec contour épais coloré (rouge brique)
  - Zones thématiques en fill translucide (Sahara, Sahel, Touareg, Azawad)
  - Étoiles rouges multiples pour attaques/incidents (clusterées)
  - Flèches courbes grises pour mouvements/ingérence (Libye → Mali)
  - Cercle/ovale tracé fin pour zone d'influence (AQMI)
  - Globe miniature fixe coin (carto reference)
  - Échelle 400 km coin bas-gauche
  - Tag date "janvier 2013" coin haut-gauche
  - Wordmark "Le Monde" italique noir coin bas-gauche
- **Verdict assets** : 🟢 — vocabulaire EXTRÊMEMENT exploitable pour Souverain. Couches superposables thématiques (peuplement, contrôle, attaque) = framework conceptuel direct. Le "wordmark italique + globe miniature + échelle km" = signature francophone fortement identitaire.

## Axe 3 — Mouvements caméra
- Patterns dominants :
  - Add-layer cumulatif (chaque concept = une nouvelle couche translucide qui apparaît par fadeIn)
  - Quasi-immobilité de la caméra (carte fixe)
  - Très rares zooms — surtout des AJOUTS de couches sémantiques
  - Date stamp qui change en haut-gauche (timeline historique)
  - Étoiles attaque qui apparaissent une à une avec léger pop
  - Flèches qui se tracent (path drawing)
- Durée moyenne des plans : 5-9s (lent éditorial)
- Spécificités : pure pédagogie. Le mouvement narratif vient des couches sémantiques qui s'empilent, pas du mouvement de caméra. Très distinctif.
- **Verdict caméra** : 🟡 → 🟢 pour le pattern "stack-layers temporel". Pour Short rythme à 1.5x mais le pattern est gold.

## Recette technique (pour reproduire en Mapbox + Remotion)
- Style Mapbox inféré : monochrome très clair, océan `#D8D8D8` plat, terre `#FFFFFF`, frontières blanches `#FFFFFF` 1.5px
- Projection inférée : Mercator standard, vue Sahara-Sahel cadrée serré
- Layers principaux :
  - basemap gris/blanc (mapbox monochrome)
  - country-fill (toggle highlight)
  - country-outline conflit (line layer dynamique stroke 3px)
  - thematic-zones (custom geojson polygones translucides : Touareg, Azawad, AQMI)
  - attack-points (circle layer rouge avec pulse)
  - flow-arrows (line layer + svg arrowhead)
  - timestamp HUD (Remotion overlay)
  - logo Le Monde italique (Remotion overlay)
- Animations Remotion : interpolate opacity layer-by-layer, useCurrentFrame pour date stamp, spring pour étoiles, drawPath remotion-paths pour flèches courbes
- Difficulté de reproduction : ⬜ haute / ⬜ moyenne / ☑ basse (rien d'exotique, juste de la rigueur de séquence)

## Frames sélectionnées (toutes motion design pur)
- `frame-005-mali-base-grayscale.jpg` : carte vide nue + Mali highlight — base canonique
- `frame-015-touareg-zone-orange.jpg` : ajout zone Touareg orange + flèches — couche sémantique
- `frame-025-azawad-rebellion-stars.jpg` : étoiles attaques + zone Azawad rouge — climax conflit
- `frame-035-aqmi-zone-action.jpg` : ovale vert AQMI tracé — pattern zone d'influence
- `frame-045-algerie-purple-zone.jpg` : Algérie violet + Mali contour brique — palette multi-zone
- `frame-055-janvier-2013-timestamp.jpg` : timestamp HUD + carte minimal — pattern timeline

## Verdict global vidéo : 🟢
**Vidéo la plus directement actionnable pour Souverain.** Pure cartographie éditoriale francophone. À retenir comme référence de tête pour template E candidat 3 : "Carto presse FR sobre".
