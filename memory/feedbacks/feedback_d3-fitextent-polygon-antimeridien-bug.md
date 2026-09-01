`geoMercator().fitExtent(extent, geometry)` avec une `geometry` de type `Polygon` construite a la main
(4 coins, rectangle simple) peut echouer silencieusement : `geoBounds` interprete le polygone selon la
regle du winding antimeridien de d3-geo et le traite parfois comme la region EXTERIEURE (le complement),
renvoyant `[[-180,-90],[180,90]]` (le monde entier) au lieu de la petite bbox locale. Resultat : la carte
ne zoome pas du tout, scale reste proche du defaut (~140-150 au lieu de plusieurs milliers attendus pour
un zoom regional serre).

**Reproduit** (2026-07-25, proto `ItineraireMultiEtapes16x9.tsx`, R&D map-animation styles) : bbox Soudan
(4 coins, ~19 degres de large) donnait `geoBounds` = monde entier au lieu de la region locale.

**Fix qui marche** : remplacer le `Polygon` par une `FeatureCollection` de **Points** (juste les 2 coins
opposes de la bbox, ou tous les points d'interet). Les Points n'ont pas de face interieure/exterieure a
arbitrer, donc pas de piege de winding rule. `geoMercator().fitExtent(extent, pointsFeatureCollection)`
fonctionne immediatement (verifie : scale passe de ~140 a ~3394 sur le meme test).

**Comment appliquer** : pour tout futur proto D3/Mercator qui zoome une carte sur une region a partir de
coordonnees connues (pas un contour de pays reel deja en GeoJSON), construire le fitExtent avec des POINTS,
jamais un polygone rectangle bricole a la main. Si le contour est un vrai polygone de pays (Natural Earth,
rings existants comme dans `sahelFlatGeo.ts`), pas de probleme — le bug ne touche que les rectangles
synthetiques a 4 coins construits pour l'occasion.

Voir aussi [[svg-path-length-heuristique-jamais-fiable]] — meme famille de lecon : ne jamais faire confiance
a une heuristique geometrique sans la verifier par un test isole avant de batir dessus.
