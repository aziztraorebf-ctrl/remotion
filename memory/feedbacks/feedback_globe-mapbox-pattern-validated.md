# Globe Mapbox + overlay Remotion — pattern hook ouverture (rationale + workflow)

> Migré depuis auto-memory 2026-08-31 (Jour 5, 2026-05-09). Complète
> `memory/feedbacks/feedback_globe-reveal-2-styles-locked.md` (styles/conventions/props détaillés)
> avec le RATIONALE ("pourquoi Mapbox plutôt que SVG custom") et le WORKFLOW pas à pas
> (géocodage MCP → props → render). Composant : `src/projects/_shared/components/inserts/GlobeLocationReveal.tsx`.

**Règle** : Pour tout hook d'ouverture "globe → focus pays/ville", utiliser `GlobeLocationReveal`. NE PAS coder un globe SVG custom (perte de temps, problèmes textures/projection vus sur des itérations Atlas-based antérieures).

**Why** :
- Mapbox `projection: 'globe'` donne nativement : sphère, atmosphère, étoiles, texture continents, halo bleu
- `map.project([lon, lat])` calcule la position écran exacte du pays — réticule placé au pixel près
- MCP Mapbox `search_and_geocode_tool` fournit les coordonnées exactes sans approximation
- Transition globe → Mercator native (`setProjection`) = composant unique pour reveal + zoom continu vers carte détaillée

## How to apply (workflow)

1. Récupérer coordonnées via MCP Mapbox : `search_and_geocode_tool({q: "Niamey, Niger"})`
2. Si highlight pays entier : passer `countryIso="NER"` + `centerCoord=[8.082, 17.608]`
3. Si highlight ville : passer juste `targetCoord=[lon, lat]` sans `countryIso`
4. Choisir style (cf `feedback_globe-reveal-2-styles-locked.md` pour le détail des 2 styles canoniques)
5. Pour zoom continu vers Mercator, fournir `cameraKeyframes` avec `projection` qui passe à `mercator` à mi-parcours
6. Render via `./scripts/render-mapbox.sh <CompId> <out.mp4>` (WebGL, Chrome for Testing + --gl=angle)

## Anti-patterns à éviter

- **Ne pas** coder un globe SVG paths custom — Mapbox fait déjà tout
- **Ne pas** hardcoder coordonnées pays — toujours passer par MCP Mapbox
- **Ne pas** utiliser `npx remotion render` direct — toujours `render-mapbox.sh` (WebGL fail sinon, cf `memory/tools/mapbox-render-pattern-canonique.md`)
- **Ne pas** oublier de masquer le logo/attribution Mapbox si publication

## Réutilisations probables

- Hook ouverture tout pays africain Souverain
- Hook ouverture vidéo géopolitique mondiale (Ukraine, Taïwan, etc.)
- Transition end-to-end globe → carte détaillée (intro+contexte en une seule séquence)
