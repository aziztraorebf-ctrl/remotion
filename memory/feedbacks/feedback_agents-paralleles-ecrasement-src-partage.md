# L'isolation `worktree` du tool Agent ne protège PAS `src/` — deux agents parallèles qui écrivent dans les mêmes fichiers source s'écrasent

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo, alors que
> [[worktree-git-isolation-gotchas]] le cite déjà nommément en tête de fichier).

## ⛔⛔ Deux agents en isolation `worktree` se sont ECRASES — `src/` est partage

**Vecu 2026-08-23** (traduction EN du portfolio Upwork). Deux agents lances EN PARALLELE avec
`isolation: "worktree"`, chacun charge de traduire un lot de compositions. Resultat : **le 2e agent a
reecrit `src/Root.tsx` et annule le travail du 1er**. Les constantes `_LABELS_EN` de la traduction
Soudan avaient disparu, les fichiers etaient revenus au francais en dur.

**Ce qui a survecu** : les **MP4 deja rendus** (ils vivent dans `out/`). **Le code, non.**

**Why — la croyance fausse qui a coute le travail** : « isolation worktree = les agents ne peuvent
pas se marcher dessus ». **Faux.** L'isolation `worktree` isole l'**etat git** (branche, index,
commits) — elle ne donne PAS a chaque agent une copie privee des fichiers source. Deux agents qui
touchent `src/Root.tsx` ecrivent au meme endroit, et le dernier ecrivain gagne. Silencieusement :
`tsc` passe, le render marche, rien n'echoue — le travail a juste disparu.

**Aggravant** : `Root.tsx` est un point de convergence oblige (tout nouveau composant s'y enregistre).
Deux agents qui produisent des compositions **vont forcement** y ecrire tous les deux. Ce n'est pas
un risque de collision, c'est une certitude.

## ⛔⛔ 2e MODE D'ECHEC, DECOUVERT LE MEME JOUR — le commit reste sur la branche du worktree

Corollaire mesure a la cloture de la meme session : quand un agent worktree commit son travail, ce
commit vit sur `worktree-agent-<id>`, **PAS sur la branche courante**. J'ai commite un `Root.tsx`
qui importait `GazoducPortfolioEN.tsx` — fichier qui **n'existait pas** dans le repo principal.
Le typecheck ne l'a pas vu (l'import etait dans le commit du worktree, pas dans le mien).

→ **Avant de fermer un worktree d'agent : `git log <branche-worktree> --not HEAD`** pour voir ce qui
n'est pas dans la branche courante, puis `git cherry-pick`. `git worktree remove --force` sur un
worktree non merge DETRUIT le travail.
→ Detecte par l'agent CLEANUP du /wrap, qui a REFUSE de fermer le worktree malgre un brief (le mien)
qui affirmait a tort « travail deja recupere et commite ».

## Regle

⛔ **Sur un meme repo, les agents qui ECRIVENT dans `src/` se lancent SEQUENTIELLEMENT, jamais en
parallele — meme avec `isolation: "worktree"`.**

- ✅ **Parallele OK** : agents en LECTURE seule (recherche, audit, review), ou ecritures dans des
  dossiers disjoints SANS point de convergence.
- ⛔ **Sequentiel OBLIGATOIRE** : des que 2 agents doivent enregistrer une composition, modifier un
  composant partage, ou toucher `src/Root.tsx`.
- 🔎 **Le test avant de paralleliser** : « ces deux agents peuvent-ils ecrire dans le MEME fichier ? »
  Si oui — et `Root.tsx` repond oui par defaut sur ce projet — c'est sequentiel.

## Detection apres coup

Un ecrasement ne leve aucune erreur. Apres une salve d'agents d'ecriture :
`git diff --stat` + **verifier que le travail du PREMIER agent est toujours la** (grep une constante
qu'il a creee, ex. `grep -r "_LABELS_EN" src/`). Ne pas se fier au rapport « termine » du 1er agent :
il disait vrai au moment ou il l'a ecrit.

Lie : [[agents-paralleles-contrat-partage]] · [[worktree-git-isolation-gotchas]] ·
[[rapport-agent-texte-pas-preuve-verifier-disque]] · [[registre-canonique-branche-rnd-jamais-mergee-pattern-recurrent]].
