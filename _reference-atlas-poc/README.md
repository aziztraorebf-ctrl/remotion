# Reference Atlas POC

Extraits conservés du `quebec-jacques-poc` (archivé 2026-06-01). Le POC original pesait 3.1 GB — ce dossier en est l'essentiel utile (~160 MB).

## Pourquoi garder ça

Le POC a exploré des techniques de caméra et d'esthétique cartographique (style Globe, Parchemin Mandé, Google Earth) qui ne sont pas encore dans le pipeline Souverain/Atlas principal. Ces fichiers servent de référence pour une future session.

## Contenu

### renders/
- `pocv4-mali-60s_2026-05-18.mp4` — Short 60s Mali, style storyboard validé
- `pocv4.1-mali-60s-turf_2026-05-18.mp4` — Variante avec effet turf
- `mansa-moussa-showcase-v1.mp4` — Atlas Mansa Moussa, esthétique Parchemin Mandé
- `tombouctou-mini2-indigo.mp4` — Scène Tombouctou, palette indigo
- `tombouctou-showcase-v8-mali.mp4` — Version finale Mali, best overall
- `quebec-mobile-1080x1920.mp4` — Test perf mobile 9:16

### mapbox-styles/
- `atlas-parchemin-mande.json` — Style Mapbox Parchemin Mandé (fond parchemin + tracés historiques)
- `atlas-parchemin-mande-relief.json` — Variante avec relief

### composants-tsx/
- `AtlasParcheminGlobe.tsx` — Globe Parchemin avec mouvements de caméra sphériques
- `AtlasParcheminRelief.tsx` — Version relief du globe
- `AtlasGoogleEarthNeutral.tsx` — Style Google Earth neutre (mouvements caméra = référence)
- `AtlasGoogleEarthParchment.tsx` — Hybrid Google Earth + Parchemin
- `AnimatedCaravan.tsx` — Caravane animée le long d'un path SVG
- `AnimatedPath.tsx` — Path animé générique (réutilisable)
- `POCV4Mali60s.tsx` — Composition complète POC v4 (structure de référence)

### research/
- `analyse-gemini-3.1-pro.md` — Analyse Gemini 3.1 Pro des vidéos de référence
- `analyse-gemini.md` — Analyse Gemini initiale
- `analyse-references-v3.md` — Analyse refs visuelles v3 (techniques retenues)
- `REMOGEN-CROATIA-BRIEF.md` — Brief template réutilisable pour nouvelles géographies

### youtube-refs/
- `DjgF6ZU8DSw.mp4` — Vidéo référence style Globe/Mercator avec mouvements caméra premium

## A faire (session future)

Les techniques clés à porter dans le pipeline principal :
1. Mouvements caméra sphériques de `AtlasParcheminGlobe.tsx` → adapter en Mercator pour Souverain
2. Style Parchemin Mandé (`atlas-parchemin-mande.json`) → potentiel pour épisodes Empire/Mansa
3. Pattern `AnimatedCaravan.tsx` → route commerciale animée, applicable Atlas/Souverain
