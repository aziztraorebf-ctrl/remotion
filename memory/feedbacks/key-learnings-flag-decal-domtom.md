# MapboxCountryFlagDecal + pays a DOM-TOM = drapeau casse (fix clipBbox)

**Bug (2026-06-21, scene gisements Senegal)** : `MapboxCountryFlagDecal iso="FRA" geoNames={["France"]}`
projetait un drapeau BLANC UNI, pas tricolore. Cause : dans Natural Earth (`countries-50m.json`),
« France » inclut TOUS les DOM-TOM (Guadeloupe lon -61.8 .. La Reunion lon +55.8 → bbox 117° de large).
La metropole devient un point minuscule dans une bbox geante → le drapeau s'etale sur du vide, on ne voit
qu'une bande (le blanc central).

**Fix (dans la brique partagee)** : prop optionnel `clipBbox={[minLon,minLat,maxLon,maxLat]}` qui ne garde
que les anneaux dont le centroide tombe dans la bbox. Pour la France metropolitaine : `[-5.5, 41.0, 9.8, 51.5]`.
Profite a tout pays a territoires d'outre-mer (Espagne/Canaries, Portugal/Acores, Pays-Bas/Caraibes…).

**Regle** : avant de projeter un drapeau sur un pays europeen/colonial via `MapboxCountryFlagDecal`,
verifier sa bbox Natural Earth. Si elle s'etale anormalement (DOM-TOM) → passer `clipBbox` metropolitaine.
Russie OK telle quelle (s'affiche bien malgre Tchoukotka). Inde, Senegal : OK sans clip.

Brique : `src/projects/_shared/mapbox/MapboxCountryFlagDecal.tsx`. Doctrine : `doctrines/CARTO-OVERLAYS-PRINCIPES.md`
(qui référence ce fichier par wikilink `[[key-learnings-flag-decal-domtom]]` — comblé par cette migration).

---
Migré depuis auto-memory (`key-learnings-flag-decal-domtom.md`) le 2026-08-31, contenu original inchangé.
