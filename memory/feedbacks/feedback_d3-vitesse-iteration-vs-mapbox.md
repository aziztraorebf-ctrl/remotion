Observation d'Aziz (2026-07-19, R&D Soudan Acte 3 globe D3) — VALIDEE et gravee comme avantage
STRUCTUREL, pas circonstanciel.

**Le constat** : en une session, 3 variantes completes de palette globe (space bleu / parchemin /
mixte kaki+ocean-bleu) + ajustements echelle/jetons/saturation flux ont ete produites sans jamais se
battre contre l'outil. Chaque changement de style = editer un objet de couleurs + `npx remotion render`.

**Pourquoi c'est structurel (pas de la chance)** :
- **Render** : D3 = `npx remotion render` classique. Mapbox = WebGL headless -> `render-mapbox.sh`
  obligatoire, jamais brut (cf CLAUDE.md).
- **Rien de cache** : D3 = tout est du SVG que le code genere. Mapbox = tuiles chargees par serveur +
  style JSON externe + `map.project()` reprojete CHAQUE frame = la source n°1 des overlays qui derivent
  (cf CARTO-OVERLAYS-PRINCIPES). En D3, `project([lon,lat])` place carte ET jetons dans le MEME repere
  SVG -> zero derive meme en mouvement/dezoom.
- **Ce qui peut casser** : Mapbox = tuiles qui ne s'affichent pas, WebGL qui refuse en headless. D3 = si
  ca compile, ca rend.

**La contrepartie honnete (seule limite)** : Mapbox donne gratuitement relief satellite, labels villes
auto, terrain texture. D3 = on dessine tout. MAIS sur nos sujets (contours stylises, encre, parchemin)
on VEUT ce controle, pas le rendu photo. Le compromis penche nettement vers D3 pour notre esthetique.

**Conclusion strategique** : D3 n'est PAS "l'alternative pauvre a Mapbox". Pour globe / flux /
contours stylises / data-viz cartographique = moteur SUPERIEUR (plus rapide a iterer ET plus robuste).
Mapbox reste meilleur UNIQUEMENT quand le SOL doit "exister" (plan rapproche, terrain texture reel) —
coherent avec [[MOTEURS-VISUELS-ET-SOCLE]] § "seule limite residuelle D3 = le SOL".

**Comment appliquer** : quand une scene est globe/flux/contours-stylises, defaut = D3 (pas Mapbox par
reflexe). Reserver Mapbox aux plans ou le terrain raster texture porte le sens. Voir aussi
[[feedback_jeton-iso-pas-d-ombre-externe]] (compositing objets identique D3/Mapbox, portable).

**Le moteur "carte D3 plate qui se dessine" (short AES) est TRANSPOSABLE en 16:9 (2026-07-21, CFA Beat 2).** Le socle du short AES — `aesGeo.ts` (rings de pays pré-calculés, geoMercator fitExtent) + `getCamera` (zoom MOTIVÉ, ex. la Libye/un pays qui ENTRE dans le cadre) — est un pattern réutilisable pour tout beat "montrer des pays qui se colorisent au trait, un par un, sous une intention". Transposé au format horizontal pour CFA Beat 2 (`CfaActe2Carte16x9.tsx` + `cfaGeoWide.json`, 14 pays CFA + France). Distinct du globe D3 (voir [[feedback_globe-d3-moteur-cartographique-reutilisable]]) : la carte AES est PLATE et se construit (grammaire de DÉFINITION), le globe est sphérique et relie (grammaire de FLUX). Même avantage structurel D3 (itération rapide, zéro dérive, render classique). Registre habillable : sur CFA on l'a mis en encre/nuit (palette scène 1), pas en blueprint bleu AES — le moteur est neutre, l'habillage suit le registre du projet.
