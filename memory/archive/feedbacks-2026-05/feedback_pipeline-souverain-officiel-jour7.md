---
name: Pipeline Gemini-pro vision = méthode officielle Souverain (validé Jour 7)
description: Validation par Aziz que le pipeline 4-étapes Gemini est la méthode officielle pour toute production Souverain à signature visuelle forte. Test contrôlé Atlas/Hannibal prévu à la reprise.
type: feedback
---

# Pipeline officiel Souverain — Gemini-pro vision breakdown

**Validé** : Niger Uranium Beat 2 v3 + Beat 7 v3, 2026-05-10 (Jour 7).

## Décision Aziz

> "Wow! C'est l'une des premières fois que je vois des résultats et que je n'ai presque rien à dire. J'ai l'impression qu'on a trouvé un cheat code pour créer des vidéos style telles que celles-ci. Très facilement. Au lieu de devoir recommencer quatre, six, sept fois une scène. [...] Documentez ce pipeline comme méthode officielle pour toute production Souverain."

## Statut

**Méthode officielle pour toute production Souverain à signature visuelle forte.** S'applique automatiquement aux projets : Niger Uranium, Or Africain v2, Money Legends, futurs Souverain narratifs.

Référence pipeline : `memory/workflow-souverain-gemini-pipeline.md`.

## Ce qui rend le pipeline supérieur

1. **Storyboard figé vs code temporel** : un beat data-viz avec placeholders ("60% / Duration Label / Lane") devient lisible seulement quand le code injecte la vraie data + le timing. Le code dépasse intrinsèquement le storyboard sur ce type de beat.

2. **Gemini 3.1-pro vision = intermédiaire qui supprime l'interprétation** : avant, Claude devait deviner coords/hex/rotations à partir de l'image. Maintenant, 3.1-pro lit son propre storyboard et crache un JSON exécutable. Fidélité passée de ~50% à ~85-90%.

3. **Permanent motion + audio cues mappés aux mots** : le breakdown JSON contient `audio_cue_word` qui se mappe au forced alignment. Plus besoin de tâtonner les frames — chaque événement visuel est calé sur un mot pivot.

## Quand l'appliquer

- ✅ Beats data-viz, diagrammes, documents (Beat 2, 3, 7 type)
- ✅ Beats avec storyboard signature visuel fort
- ✅ Production Souverain où la fidélité visuelle prime
- ✅ Or Africain v2 beats narratifs data-viz
- ✅ Money Legends beats narratifs

## Quand ne pas l'appliquer

- ❌ Beats Mapbox WebGL (cartes interactives, pas reproductibles en assets statiques)
- ❌ Beats avec walk cycles PixelLab ou animations structurelles (Atlas combat scene, caravane)
- ❌ Beats à camera tracking complexe (svgToComp + focus offsets)

## Test Atlas/Hannibal — à faire à la reprise

Aziz : **prendre un beat insert/cartouche du prochain Atlas (Hannibal Beat 3 si on continue, ou Songhaï) et tester le pipeline.** Atlas a sa grammaire (refs Mansa Moussa V2, palette fauve/chocolat) qu'il faudra injecter dans les refs i2i Gemini.

Maintenant qu'on a Mapbox MCP installé, ça accélère la R&D Atlas — on pourra valider plus vite si le pipeline Gemini-pro tient sur Atlas.

Voir : `memory/NEXT-SESSION-atlas-hannibal-pipeline-test.md`.

## How to apply

Pour toute nouvelle production Souverain :
1. Storyboard image Gemini 3.1-flash-image-preview avec refs Or Africain V5 en i2i
2. Breakdown Gemini 3.1-pro-preview avec storyboard PNG en référence multimodale → JSON
3. Génération assets manquants (Gemini 3.1-flash-image-preview avec fond solide imposé)
4. Code Claude principal (pas remotion-composer agent) suivant le JSON à la lettre

Springs amortis (damping 80-100, stiffness 50-70, durée 25-35), permanent motion obligatoire, max 5s sans changement, min 2s entre changements majeurs.
