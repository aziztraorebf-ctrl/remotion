# INCIDENT — branche supprimée avec du travail non commité (récupéré par chance)

> Écrit le 2026-08-31, à la demande d'Aziz, pour qu'une session future traite ce problème
> AVANT qu'il se reproduise sur une branche dont le contenu ne serait pas récupérable.
> ⛔ Ce n'est PAS un post-mortem de confort — c'est une action à planifier.

## Ce qui s'est passé, précisément

Lors du ménage de branches du **2026-08-28** (mentionné dans `NEXT-ACTION.md` : "23 branches
supprimées — 22 déjà mergées dans master + 1 redondante"), la branche
`feat/cfa-nuit1994-svg-mix` a été supprimée. Elle contenait, en modifications **non
commitées** (jamais poussées dans aucun commit d'aucune branche) :
- `src/projects/_rnd/fable-svg/CfaNuit1994Anime16x9.tsx` — le composant Franc CFA original
  en 16:9, "mid-form publié" selon son propre commentaire de tête.
- `src/projects/_rnd/fable-svg/cfaNuit1994Groups.ts` — le fichier de groupes SVG associé.

Ces fichiers n'apparaissaient dans AUCUN commit accessible via `git log`. La seule trace
restante était deux **blobs orphelins** dans la base d'objets git locale (trouvés via
`git fsck --unreachable`, jamais garbage-collectés par chance). Récupérés le 2026-08-31,
recommités sur `feat/chill-meter-jalon1` (commit `16a25e1a`) — cf
`out/PORTFOLIO-UPWORK/README.md` et l'historique de la session du 2026-08-31 pour le détail
de la récupération.

## Pourquoi c'est arrivé — le vrai mécanisme, pas une impression

**Un `git branch -D` (ou équivalent) supprime la référence à une branche, pas ses objets.**
Si la branche avait des commits non mergés, ceux-ci deviennent orphelins mais restent dans
la base d'objets jusqu'au prochain `git gc` (peut prendre des semaines). Mais ici, le
problème est **pire que ça** : les fichiers n'étaient même pas dans un COMMIT de cette
branche — juste des modifications de working-tree, jamais commitées du tout. Leur seule
existence en base d'objets vient d'un `git add` (mise en index) fait à un moment donné,
peut-être pour un `git stash` ou une préparation de commit jamais finalisée.

**Le ménage du 28/08 n'a probablement vérifié que `git log` / `git diff` de la branche
contre master** — ce qui ne révèle RIEN sur des fichiers jamais commités. Un simple
`git status` sur cette branche, AVANT suppression, aurait montré ces 2 fichiers en
"untracked" ou "modified", et les aurait sauvés trivialement (stash, commit, ou copie).

## Ce que ça révèle de systémique (pas juste "un cas isolé")

1. **Aucun script de nettoyage de branches versionné dans le repo.** Recherché
   (`grep -rn "branch --merged\|branch -D"` sur `scripts/`) — rien trouvé. Le ménage du
   28/08 a donc été fait à la main, sans check automatique reproductible.
2. **La règle mémoire existante** (`memory/NEXT-ACTION.md` § ÉTAT GIT) dit *"`git branch
   --merged master` liste ce qui se supprime sans aucune perte, `git branch --no-merged
   master` ce qui porte du travail unique"* — mais ça ne couvre QUE les commits, pas les
   modifications non commitées sur une branche. La règle elle-même a un angle mort.
3. **Aucun signal d'alerte au moment de la suppression** — pas de hook, pas de script qui
   aurait affiché "cette branche a des fichiers non commités, confirmer la suppression".

## Ce qui a limité les dégâts cette fois (chance, pas méthode)

- `git fsck --unreachable` retrouve un blob tant qu'aucun `git gc` n'est passé dessus.
  **Ce n'est pas garanti** : `git gc --auto` se déclenche automatiquement selon des seuils
  internes (nombre d'objets lâches, etc.) — il aurait pu passer n'importe quand entre le
  28/08 et le 31/08. On a eu de la chance sur la fenêtre de temps, pas une garantie.
- Le fichier avait un commentaire de code assez détaillé pour qu'on sache QUOI chercher
  (le nom exact `CfaNuit1994Anime16x9.tsx` était cité dans le fichier vertical dérivé,
  encore présent). Sans cet indice, on n'aurait même pas su qu'il fallait chercher.

## À faire en session future — 3 pistes, à trancher avec Aziz avant de coder

1. **Un script `scripts/tools/git-branch-cleanup.sh`** qui, avant toute suppression de
   branche : (a) vérifie `git log <branche> ^master` (commits non mergés), ET (b) checkout
   temporaire ou `git show <branche>:<fichier>` pour vérifier s'il y a des différences de
   working-tree jamais commitées (plus dur à vérifier a posteriori sur une branche qu'on
   n'a pas sous la main — à réfléchir : peut-être que la seule vraie protection est de
   TOUJOURS committer ou stasher avant de changer de branche, jamais de laisser du travail
   en working-tree non sauvegardé).
2. **Une règle de discipline plus stricte** : ne jamais quitter une branche (checkout vers
   une autre) sans avoir commité OU explicitement stashé ses modifications — actuellement
   la règle mémoire dit déjà ça pour les worktrees (`feedback_worktree-git-isolation-
   gotchas.md`) mais pas pour un simple changement de branche dans le même répertoire de
   travail.
3. **`git gc.auto` désactivé ou espacé** sur ce repo précis, pour élargir la fenêtre de
   récupération d'un incident futur — mesure de mitigation, pas de prévention (traite le
   symptôme, pas la cause).

⭐ Recommandation de départ (pas une décision, juste où commencer la discussion) : la piste
2 est la plus fondamentale — un script de garde-fou (piste 1) protège contre l'oubli au
moment du ménage, mais n'empêche pas qu'un travail non commité existe en premier lieu sur
une branche qu'on va quitter. Traiter la cause avant le symptôme.

## Lien avec la session qui a produit ce fichier

Contexte complet de la récupération (commandes `git fsck` utilisées, contenu retrouvé) :
historique de conversation du 2026-08-31, candidature Upwork vokabl — chercher
"CfaNuit1994Anime16x9" dans les transcripts de session si le détail exact des commandes
est nécessaire. Commit de récupération : `16a25e1a` sur `feat/chill-meter-jalon1`.
