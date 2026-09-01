# Atlas Geoafrique - Direction visuelle finale (2026-04-28) — ARCHIVE

> Migré depuis auto-memory 2026-08-31. Décision de direction visuelle actée à l'époque du projet
> GeoAfrique. Le composant `AtlasParcheminGlobe.tsx` et le style.json référencés vivaient dans
> `quebec-jacques-poc/` (supprimé au Grand Ménage v2 2026-06-01) — noté comme "pattern
> `_reference-atlas-poc/` non porté" dans `memory/NEXT-ACTION.md` (2026-08-31), donc potentiellement
> pertinent si un système Atlas est relancé. Conservé pour les specs couleurs/animation précises.

## Decision actee par Aziz

**Style officiel** : Globe Parchemin Mande + ocean indigo + relief 3D + halo dore + projection globe.

**Why** : Apres comparaison de 5 versions (Parchemin plat, Parchemin v2 amplitude, Google Earth neutre, Google Earth filtres parchemin, Parchemin globe creme, Parchemin globe indigo), Aziz a choisi **Parchemin globe indigo**.

**Style.json reference (historique)** : `quebec-jacques-poc/mapbox-styles/atlas-parchemin-mande-relief.json` (avec `background-color: "#3A4A6A"`) — chemin mort, contenu potentiellement dans `_reference-atlas-poc/`.

**Composant Remotion reference (historique)** : `quebec-jacques-poc/src/AtlasParcheminGlobe.tsx` — chemin mort.

## Insight cle d'Aziz (NON-NEGOTIABLE pour tout futur système Atlas)

> "Le cote vieille carte au papier n'est pas a 100% obligatoire."

**How to apply** :
- **NE PAS** sur-prioriser l'authenticite "carte ancienne au papier vieilli"
- **PRIVILEGIER** la lisibilite mobile, le contraste, l'impact immediat
- L'identite Atlas est **stylisee moderne** avec elements parchemin (terracotta, sepia, halo dore), PAS du faux-vintage strict
- Si une decision creative oppose "fidele a vieille carte" vs "lisible/impactant", choisir lisible/impactant
- La palette terracotta/indigo/dore est l'identite, pas le cote "papyrus crameuse"

## Specs techniques validees (à réutiliser si le système Atlas Parchemin est relancé)

**Couleurs** :
- Background ocean : `#3A4A6A` (indigo profond)
- Pays terracotta : `#A85A3A` → `#B8633E` → `#C4995A` (gradient zoom)
- Pays "shadow east" (Nigeria/Tchad/Soudan/Cameroun/Centrafrique) : `#5A3A28` (brun fonce)
- Frontieres : `#1F2A4A` (indigo profond)
- Halo "ink" cotes : `#1F2A4A` 18% opacite, blur 3
- Hillshade shadow : `#3A2418`
- Hillshade highlight : `#F5DDA8`
- Hillshade accent : `#7A3A28`
- Hillshade exaggeration : 1.0
- Fog color : `rgba(242, 229, 200, 0.85)` (creme dore halo atmospherique)
- Fog high-color : `rgba(168, 90, 58, 0.7)` (terracotta horizon)
- Space-color : `rgba(31, 42, 74, 0.95)` (indigo profond espace)
- Star intensity : 0.4

**Animation par defaut** :
- Frame 0 : zoom 1.5, pitch 0, bearing 0 (globe entier)
- Frame 120 : zoom 3.5, pitch 25, bearing 5
- Frame 240 : zoom 5.5, pitch 55, bearing 15
- Easing : `Easing.inOut(Easing.cubic)` sur tous les axes

**Projection** : `globe`

**Render command** : `npx remotion render src/index.ts <Composition> <output> --gl=angle --concurrency=1`

**Perf** : ~25s pour 240 frames @ 1080x1920 = ~7-8x faster than realtime

## Réutilisation prévue (si système relancé)

Le template était pensé **réutilisable directement** pour tout épisode Atlas. Il suffirait de :
1. Changer les `KEYFRAMES` (lon/lat de la cible)
2. Changer le label de la ville ciblée
3. Changer le pays "shadow east" si pertinent

## Phase 2 envisagée (jamais réalisée à confirmer)

**Showcase 30s** avec elements espaces dans le temps : globe entier qui tourne (intro) → zoom
progressif vers cible → apparition label ville → apparition icone → apparition tracé (route
caravanière) → apparition cartouche stat. Tout lisible sur fond indigo (label noir + halo creme
garantit le contraste).
