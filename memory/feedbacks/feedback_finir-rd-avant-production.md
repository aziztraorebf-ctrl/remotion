# Finir la R&D library AVANT de lancer la production

## Règle

Quand on est en phase de construction d'une **bibliothèque réutilisable** (templates, composants, presets) :
- Continuer R&D jusqu'à avoir testé/statué tous les éléments du backlog
- Lock la lib comme étape explicite avant de passer en production
- Ne pas fragmenter : R&D → 1 épisode prod → R&D → 1 épisode prod
- Ne pas se laisser tenter par "on a déjà 4 templates, lançons l'épisode test"

## Pourquoi (raisonnement Aziz validé)

1. **Économie de scope-switching** : rester en mode R&D + jury = même mental model. Switcher vers production casse le flow.
2. **Décisions architecturales finales** : si en testant un template tardif on découvre qu'il faut modifier un template existant ou la palette globale, autant le faire avant de produire.
3. **Production = test final, pas test intermédiaire** : quand on attaque la production, ce doit être avec une lib **complète et stable**, pas en construction.

## Application Jour 4 (templates Souverain)

- 4 templates V3 validés Jour 3 (Atlas3D, CartoCaspian, KraftCard 3 options, SmallMultiplesGrid)
- 8 templates restants au backlog (BrutalHeadline, DataCard, BigStat, NewsClipping, DateBar, OsintSplitScreen, Le Monde, Carnet Reporter)
- **Plan validé** : Jour 4 = finir les 8 → décision LOCK → Jour 5+ production Niger uranium

## Cas où la règle peut être assouplie

- Si un POC nécessite **un vrai contexte épisode** pour être évalué (rare)
- Si la production a une **deadline urgente externe** (ex: actualité)
- Si la lib est déjà **largement complète** et qu'il reste 1-2 nice-to-have non bloquants

## Anti-pattern à éviter

> "On a 4 templates, on peut déjà attaquer Niger pour valider qu'ils marchent en réel. On finira la lib après si besoin."

C'est faux. Si on découvre en production qu'il manque un template, on l'aura coupé en 2 sessions et on aura perdu la cohérence.

## Trace de la décision

Cette règle vient de la fin de session Jour 3 templates Souverain. Aziz a explicitement refusé mon plan "Jour 4 = production Niger uranium" et exigé "Jour 4 = finir le backlog R&D, Niger en Jour 5+".

Distinct de la règle "1 session = 1 beat" (`memory/rules/rules-atlas-production.md` § Une scène par
session) : celle-ci porte sur le grain d'une session de production, la règle ci-dessus porte sur la
séquence macro R&D-complète → LOCK → production, un niveau au-dessus.

---
Migré depuis auto-memory (`feedback_finir-rd-avant-production.md`) le 2026-08-31, contenu original inchangé.
