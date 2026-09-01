Ne pas réinventer le pattern Mapbox pour chaque nouvel épisode Souverain.

**Why:** Or Africain a validé un pipeline Mapbox complet qui fonctionne : projection Mercator, GéoAfrique V5, highlights pays, flyover caméra, sous-titres, hachures. Beat1 Sénégal a failli utiliser un BrutalHookSplit split-screen avant qu'Aziz corrige — le split 50/50 n'existe pas dans les documentaires YouTube premium 16:9.

**How to apply:**
- Pour tout nouveau beat Mapbox Souverain : partir du pattern Or Africain comme blueprint
- Projection Mercator forcée via `setProjection("mercator")` dans `style.load` — dark-v11 démarre en globe sinon
- Carte plein écran (pas de split) — la carte EST le visuel, pas un élément parmi d'autres
- Highlight pays en gold dès frame 0
- Label pays apparaît en spring pop en fin de séquence (bandeau navy + trait gold vertical + sous-titre)
- Flyover caméra = zoom cubic in-out sur 70-85% de la durée, stable ensuite
- Vignette radiale subtile sur les bords uniquement

Composants disponibles et validés : `applyGeoAfriqueV5`, `addCountryHighlight`, `ISO.SENEGAL`, `MapboxBrandingHide`, `lerpCam`, `CAM_PRESETS`.

Complète (sans dupliquer) `doctrines/DOCTRINE-SOUVERAIN.md` § 3.2 Projection (qui pose la règle Mercator
obligatoire) et `tools/mapbox-render-pattern-canonique.md` (qui pointe vers un autre showcase de
référence, `AtlasRealiste3DShowcase.tsx`) — ce fichier-ci garde l'anecdote concrète (le near-miss
BrutalHookSplit sur Beat1 Sénégal) qui justifie la règle "carte plein écran, jamais de split".

---
Migré depuis auto-memory (`feedback_mapbox-souverain-blueprint.md`) le 2026-08-31, contenu original inchangé.
