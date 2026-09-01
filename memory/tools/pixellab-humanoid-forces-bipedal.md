# Humanoid template force la bipédie (anti-pattern animaux)

**Règle** : `body_type: humanoid` dans `create_character` impose un skeleton mannequin à 2 jambes. La description peut dire "war elephant" tout ce qu'elle veut — le résultat sera un **éléphant anthropomorphe debout sur 2 pattes**.

**Cas d'origine 2026-05-04** : Lab Hannibal Phase 2, tentative éléphant humanoid v3 → résultat hilarant : éléphant en armure sur 2 pattes, bouclier rond, posture combat humaine.

**Why** : le skeleton est appliqué AVANT la génération texturale. La description ne peut pas changer la topologie 2 jambes vs 4 pattes.

**How to apply** :

| Asset | Méthode recommandée |
|-------|---------------------|
| Bipède (humain, robot, monstre humanoid) | `create_character` body_type humanoid |
| Quadrupède clean (cheval, chien, chat, ours, lion) | `create_character` body_type quadruped + template correspondant |
| Quadrupède hors templates (éléphant, chameau, etc.) | `create_map_object` 1 direction OU quadruped horse + accepter limitations expérimentales |
| Objets statiques (sac, mur, monument) | `create_map_object` |

**Pattern chameaux Empire Ghana validé** : map_object 1 direction + animation interne. Marche bien quand on n'a besoin que d'une seule vue (side view typique pour caravane).

**Anti-pattern confirmé** :
- `body_type: humanoid` + description animal = bipède anthropomorphe
- Aucun ajout de "four legs" ou "NO bipedal" dans le prompt ne contourne le skeleton

**Validé par** : Lab Hannibal éléphant humanoid v3, 2026-05-04.

Complète `tools/pixellab-canonical-size-132.md` (qui mentionne `body_type="humanoid"` dans son exemple
de code mais sans ce gotcha) et `tools/PIXELLAB-MASTER-INDEX.md`.

---
Migré depuis auto-memory (`feedback_pixellab-humanoid-forces-bipedal.md`) le 2026-08-31, contenu original inchangé.
