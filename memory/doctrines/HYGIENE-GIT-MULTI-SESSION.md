# DOCTRINE — Hygiène git en multi-session

> Extrait de `memory/NEXT-ACTION.md` le 2026-09-08 : c'était un **protocole de lecture
> permanent**, pas une action à cocher — il n'avait donc rien à faire dans un fichier de
> prochaines actions, qu'il alourdissait de 1793 o.
>
> **Contexte** : plusieurs sessions Claude travaillent en parallèle sur ce repo (27 sessions
> recensées le 07/09, dont Remote Control et cloud). Git n'a **qu'un seul répertoire de
> travail** : changer de branche quelque part la change partout. Chaque règle ci-dessous vient
> d'un incident réel et daté.

---

## 1. Les chantiers vivants sont dans des WORKTREES — ne jamais figer leur liste

⛔ **Ne JAMAIS recopier une table figée des worktrees ou des branches** dans un fichier de
mémoire : elle se périme en 1-3 jours. **Vécu 3 fois** (27/07, 30/07, et le 08/09 où une section
« 4 branches vivantes » en présentait 2 déjà mergées comme mergeables) — et à chaque fois
l'avertissement « cette section se périme » était présent, lu, sans rien empêcher.

**Un avertissement n'empêche pas la péremption ; une commande, si :**

```bash
for w in $(git worktree list --porcelain | grep ^worktree | cut -d' ' -f2); do
  echo "=== $w [$(git -C $w branch --show-current)]"; git -C $w log --oneline -3
done
git stash list
git branch --no-merged master   # ce qui porte du travail unique
git branch --merged master      # supprimable sans risque
```

Un commit récent dans un worktree **prime toujours** sur un fichier de mémoire.

## 2. ⛔⛔ Une autre session peut changer la branche ou lancer un merge pendant que tu travailles

Vécu le 2026-08-20. **Symptômes** : `git checkout <fichier>` échoue en `path is unmerged`, ou un
typecheck révèle des imports dupliqués absents de `HEAD`. **Cause** : `.git/MERGE_HEAD` d'une
autre session.

Vérifier avant de conclure sur un fichier partagé (`src/Root.tsx` en tête) :

```bash
git branch --show-current && ls -d .git/MERGE_HEAD 2>/dev/null && echo "MERGE EN COURS"
```

⛔ **Ne JAMAIS résoudre ou abandonner le merge d'une autre session** (`reset`, `stash`,
`merge --abort`, `checkout` d'un fichier unmerged) : c'est son travail vivant. Signaler à Aziz,
continuer ailleurs.

⚠️ **Corollaire** : cette même session peut aussi commiter TON travail à ta place (vécu :
`e6657203`). Relire `git log` avant de supposer qu'un commit est de toi.

## 3. ⛔⛔ Aucune commande git destructive dans un répertoire partagé

Ni `checkout`, ni `reset`, ni `stash`/`stash pop`. **Deux incidents documentés** :
- 2026-07-01 — un agent a écrasé le travail d'un autre par `git checkout`.
- 2026-08-01 — un agent `/wrap` a fait un `git stash` avec 25 fichiers non commités :
  `git status` est revenu VIDE, tout semblait perdu.

Un agent commite **NOMMÉMENT** ses propres fichiers, jamais `git add -A`.

**Prévention** : une session = un worktree. `./scripts/session.sh <branche>`

Un gate existe (`branche-derive-gate.sh`, worktree `retro-gates-multi-session`) : il bloque un
commit si la branche a changé depuis le début de la session et propose `BRANCHE_OK=1` en
échappatoire. **Vérifier la légitimité avant de passer outre, jamais par réflexe.**

## 4. Avant de supprimer une branche : regarder le disque, pas seulement les commits

⛔ Lire `memory/projects/INCIDENT-BRANCHE-SUPPRIMEE-TRAVAIL-PERDU.md` — une branche supprimée le
28/08 portait 2 fichiers **jamais commités**, récupérés par chance seulement. Toujours vérifier
`git status` **sur la branche** avant de la supprimer.

⚠️ **Worktrees sur `/tmp`** : macOS purge `/tmp`. Les commits survivent dans le `.git` du repo
principal, mais tout fichier non commité y disparaît au reboot. Vérifier
`git -C <worktree> status --porcelain` avant de considérer un worktree `/tmp` comme jetable.

## 5. Pousser vers origin — la sauvegarde n'est pas automatique

Mesuré le 2026-09-08 : **295 commits non poussés, dernier push le 21 août — 18 jours de travail
sans aucune copie hors machine.** Les commits locaux ne sont pas une sauvegarde : un disque qui
lâche efface tout.

Vérifier régulièrement : `git rev-list --count origin/master..master`

⚠️ Avant un push sur un dépôt **public**, vérifier qu'aucun secret ne part :

```bash
git diff origin/master..master | grep "^+" | grep -E "claimToken|sk-|ghp_|AIza"
```

## 6. Stashs orphelins

5 stashs recensés le 08/09, dont 3 annotés « PAS mon travail » / « mis de côté par une session
concurrente » (juillet). ⛔ Ne jamais dropper un stash qu'on n'a pas créé — confirmer avec Aziz.
