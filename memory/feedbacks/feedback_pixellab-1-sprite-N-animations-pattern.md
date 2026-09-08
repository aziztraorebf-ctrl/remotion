---
name: PixelLab — 1 sprite source + N animations narratives (pattern par défaut Atlas)
description: Pour différents états narratifs d'un même asset (vivant/épuisé/mort, neuf/vieux, calme/colère), générer UN sprite + N animations dessus. Jamais N sprites séparés. Garantit cohérence visuelle stricte.
type: feedback
originSessionId: 7177aca4-7a3c-4cce-93fc-eed694c7c1da
---
# Pattern par défaut Atlas : 1 sprite + N animations

**Règle** : pour représenter plusieurs états narratifs d'un même asset (personnage ou objet), générer **UN sprite source unique** puis appliquer **N animations** dessus via `animate_character` ou `animate_object`. Ne JAMAIS créer N sprites séparés "alive / exhausted / dead" — chaque sprite indépendant produit des proportions, couleurs et détails légèrement différents qui cassent l'identité visuelle.

**Why** : Lab Hannibal Phase 2 (2026-05-04) a échoué visuellement parce que j'ai créé 3 map_objects séparés (alive, exhausted, dead). Résultat : 3 éléphants visiblement différents entre eux (orientation tête, taille howdah, détails couverture). Le crossfade Remotion révèle ces différences comme des "saccades de design" au lieu d'une dégradation narrative.

**Pattern correct (validé Empire Ghana avant cette session)** :
- Koumbi Saleh : 1 sprite ville + 1 animation interne (petits personnages bougent dans les rues)
- Chameau caravane : 1 sprite chameau + 1 animation walking
- Sundiata : 1 character + 4 animations (walk-north, war-cry, etc.)

**Pattern à appliquer pour TOUTES les évolutions narratives** :

```
sprite = create_map_object(description="war elephant with howdah, walking")  # 1 fois
anim_walk = animate_object(sprite, "walking steadily")
anim_tired = animate_object(sprite, "head drooping, slow weary movement, snow accumulating on back")
anim_dying = animate_object(sprite, "collapsing slowly to the side, legs giving out, head falling")
```

**Avantages** :
1. Cohérence visuelle stricte (même sprite, donc proportions/couleurs/détails identiques)
2. Coût équivalent (3 anims = 3 crédits ≈ 3 sprites)
3. Animation continue raconte mieux qu'un swap d'images fixes
4. Possibilité d'ajouter des éléments narratifs progressifs dans la description d'animation (neige qui s'accumule, sang qui coule, fatigue qui croît)

**Mappage Atlas par type d'asset** :

| Asset | Outil sprite | Outil animation |
|-------|--------------|-----------------|
| Humain (Hannibal, Sundiata, soldats) | `create_character` humanoid (size=96 pour 132×132) | `animate_character` (templates 49 dispo OU custom) |
| Animal (éléphant, chameau, dromadaire) | `create_map_object` 1 direction (160×120 ou 160×160) | `animate_object` custom descriptions |
| Objet statique évolutif (ville, monument) | `create_map_object` | `animate_object` custom |
| Objet purement statique (sac, sceau, lingot) | `create_map_object` seul | aucune |

**Anti-patterns confirmés cette session** :
- ❌ N `create_map_object` séparés pour N états (incohérence visuelle)
- ❌ `vary_object` (bug download HTTP 500 confirmé)
- ❌ `create_character` humanoid pour animaux (force bipédie anthropomorphe)
- ❌ `create_character` quadruped (expérimental, crinière parasite, vues frontales bizarres)

**Cas exception (rare)** : générer 2 sprites séparés si les designs sont **fondamentalement incompatibles** (ex: humain en armure → squelette, ville → ruines totales). Mais pour gradations (alive → tired → dead), pattern 1 sprite + N animations gagne toujours.

**Validé Aziz** : 2026-05-04 Lab Hannibal Phase 2, après constat que mes 3 sprites éléphant (alive/exhausted/dead) étaient visiblement différents.
