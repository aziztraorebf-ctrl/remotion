Un fichier de methode (`memory/tools/`, `memory/starters/`) cite depuis `MEMORY.md` doit exister
sur **toute branche de travail active**, pas seulement celle ou il a ete initialement ecrit.

**Why** : le 2026-07-31, `memory/tools/notebooklm-boucle-short.md` et
`memory/starters/STARTER-PROMPT-notebooklm-planche-slides-et-videos.md` etaient cites dans
`MEMORY.md` mais absents du disque sur la branche de travail active — ils vivaient sur d'autres
branches (`chore/menage-memoire-poids`, `rnd/slide-nlm-vers-svg`) jamais mergees. Consequence :
la methode etait introuvable precisement au moment ou on en avait besoin (construction du Short
CFA, qui utilise exactement cette methode). Restaures via `git show <commit>:<chemin>` puis
`git checkout <commit> -- <chemin>` (commit `19615633`).

Distinct de [[feedback_worktree-git-isolation-gotchas]] (qui porte sur l'isolation des worktrees
en general — node_modules, symlinks audio) : ici le probleme est specifiquement la **survie
d'un fichier de methode reference par l'index** a travers des branches non mergees.

**How to apply** : quand un fichier `memory/tools/*.md` ou `memory/starters/*.md` significatif
est cree ou modifie sur une branche de R&D, verifier qu'il sera bien present sur les branches de
production qui en auront besoin plus tard — merger tot, ou au minimum noter explicitement dans
`MEMORY.md` sur QUELLE branche vit le fichier si le merge n'est pas encore fait. Si un fichier
cite par `MEMORY.md` s'avere absent sur la branche courante, chercher d'abord `git log --all
--oneline -- <chemin>` avant de conclure qu'il a ete supprime ou de le recreer de zero — il vit
probablement ailleurs, non merge.
