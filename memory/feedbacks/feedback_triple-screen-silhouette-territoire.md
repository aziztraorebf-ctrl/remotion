Pattern triple-screen final = silhouettes territoire (d3-geo) remplies du drapeau, pour opposer N pays
sans texte.

Pattern PROUVÉ (scène 2 Sénégal V3, validé Aziz 2026-06-24) pour **opposer 2-3 pays en fin de scène** :
un **triple screen** où chaque panneau montre la **SILHOUETTE du territoire** (forme réelle du pays)
**remplie de son drapeau**, + nom + 1 chiffre factuel. ZÉRO phrase — la voix porte le récit (les lignes
de texte qui répètent la voix = redondance proscrite, retour Aziz).

**Comment** (composant local, pas besoin de Mapbox) :
- `feature(topology, topology.objects.countries)` (topojson-client) sur `public/_shared/geo-data/countries-50m.json`
- `geoMercator().fitExtent([[marge,marge],[PW-marge,PH-marge]], feat)` cale la silhouette dans le panneau (PW = W/3)
- `geoPath(proj)` → `pathD` + `bounds` ; clipPath SVG sur le path ; `<image href={drawFlagCanvas(iso).toDataURL()}>` clippé à la silhouette
- halo couleur = paths superposés en opacité (JAMAIS `filter:blur` en SVG → invisible en headless, gate E4)
- topology chargé une fois via `fetch(staticFile)` + `delayRender/continueRender`
- noms Natural Earth : "Norway", "Congo" (=Congo-Brazzaville, PAS "Dem. Rep. Congo"), "Botswana"

Brique de référence existante : `src/projects/_shared/components/inserts/CountryFlagFill.tsx` (même
principe, mais drapeau via flagcdn externe — préférer `drawFlagCanvas` local pour cohérence + offline).

**Distinct** de la solution Mapbox `MapboxCountryFlagDecal` documentée dans
`doctrines/CARTO-OVERLAYS-PRINCIPES.md` (drapeau drapé sur une VRAIE carte Mapbox interactive, suit
pitch/zoom/pan) : ce pattern-ci est du **SVG pur composé localement** (silhouette d3-geo découpée, pas
de carte Mapbox vivante), pensé pour un panneau triple-écran comparatif fixe, pas une scène cartographique.

Voir aussi : `doctrines/CARTO-OVERLAYS-PRINCIPES.md` (technique Mapbox complémentaire), scène =
`src/projects/souverain/senegal-petrole-gaz/beats/SceneComparaisonV3.tsx`.

---
Migré depuis auto-memory (`triple-screen-silhouette-territoire.md`) le 2026-08-31, contenu original inchangé.
