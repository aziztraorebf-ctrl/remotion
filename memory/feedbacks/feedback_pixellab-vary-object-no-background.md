# vary_object PixelLab — interdire backgrounds dans le prompt de variation

> Migré depuis auto-memory 2026-08-31 (validé 2026-05-04, épisode Hannibal archivé). Gotcha
> spécifique non retrouvé dans les fichiers PixelLab du repo (`tools/pixellab.md`,
> `tools/pixellab-states-animate-object.md`, `feedbacks/feedback_pixellab-*.md`).

**Règle** : pour `vary_object`, le prompt de variation doit décrire **uniquement les changements sur le sujet lui-même**, jamais le contexte/environnement. Sinon PixelLab inclut un background dans l'asset (qui devrait être transparent).

**Why** : Lab Hannibal Phase 2 (2026-05-04) — un prompt écrivait "elephant collapsed in deep snow, completely buried under thick snow and ice" → résultat : éléphant avec un **paysage neigeux complet** ajouté autour, plus une "maison" interprétée à partir du howdah. Le background pollue l'asset qui devait rester transparent pour compositing carte.

**Anti-pattern (ce qui a foiré 2026-05-04)** :
```
elephant collapsed dead lying on side in deep snow, legs sprawled stiff,
completely buried under thick snow and ice, broken howdah fallen,
abandoned red blanket half buried, lifeless closed eyes, blue grey frozen
skin, tragic still scene, pixel art
```
→ Résultat : background neige + "maison" parasite sur le dos + composition complète au lieu d'un sprite isolé.

**Pattern correct** :
```
elephant lying on its side, legs sprawled, eyes closed, frozen blue grey
skin tint, ice on tusks, snow patches on body
```
→ Résultat attendu : éléphant transparent autour, juste les changements visuels sur l'animal.

## How to apply

| Variation | Décrire UNIQUEMENT | Ne JAMAIS écrire |
|-----------|---------------------|-------------------|
| Épuisé | "drooping head, half-closed eyes, slow posture, snow patches on back, ice on tusks" | "in deep snow", "snowy mountain", "winter landscape" |
| Mort | "lying on side, eyes closed, stiff legs, frozen skin tint" | "buried in snow", "snow scene", "tragic landscape" |
| Brûlé | "burnt skin texture, smoke marks on body, charred details" | "in fire", "burning building" |
| Vieux | "wrinkled skin, white hair, slower posture" | "in old castle", "background scene" |

**Règle générale** : si le mot décrit **où l'asset est**, c'est un background — l'enlever. Si le mot décrit **comment l'asset a changé**, c'est correct.

**Conséquence** : pour un effet neige/brouillard/fumée/eau sur une scène, l'ajouter en **overlay Remotion** (couche fond séparée avec particules), jamais dans l'asset PixelLab lui-même.
