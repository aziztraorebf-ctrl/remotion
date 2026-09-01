# Un agent qui `git stash` dans un répertoire partagé crée une fenêtre de fausse disparition

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Session Gazoduc (2026-08-01), lancement du skill `/wrap`. L'agent CLEANUP a execute un `git stash` /
`git stash pop` (documente lui-meme dans son rapport : "verifie via git stash/pop utilise pour tester
l'etat de master") pendant que la session principale avait ~25 fichiers modifies/crees non commites
(script Gazoduc complet, doctrines mises a jour, outil jury cree, 3 skills supprimes).

**Symptome vecu** : pendant la fenetre ou le stash de l'agent etait actif, `git status --short` dans le
repertoire principal est revenu VIDE — tout le travail de la session semblait avoir disparu. Un 2e agent
(COHERENCE), tournant en parallele et lisant le disque a ce moment-la, a lui-meme rapporte a tort que les
3 skills "supprimes" existaient encore physiquement — victime de la meme fenetre d'inconsistance.
Alerte serieuse levee aupres d'Aziz avant diagnostic complet (bon reflexe — s'arreter et verifier avant
d'agir), mais l'incident aurait pu etre evite.

**Resultat final** : AUCUNE perte reelle — le `stash pop` de l'agent a tout restitue correctement une
fois termine. Mais le risque n'est pas nul : un agent qui stash puis rencontre une erreur AVANT de pop
(crash, timeout, exception) laisserait le travail de la session principale coince dans un stash oublie,
et un `git reset --hard` (au lieu d'un stash) aurait ete irrecuperable de la meme facon.

**Why** : `git stash`/`git status`/`git reset` operent sur TOUT le repertoire de travail, pas sur un
sandbox isole a l'agent qui les invoque. Un agent lance en parallele de la session principale (meme
repertoire) qui execute une commande git affectant l'arbre de travail entre en collision avec n'importe
quel travail non commite en cours, meme si l'agent n'a "l'intention" de toucher qu'un sous-ensemble.

**How to apply** :
1. **Ne jamais briefer un agent pour executer `git stash`, `git reset`, `git checkout .`/`--`, ou toute
   commande qui modifie l'arbre de travail complet**, sauf isolation explicite (`isolation: 'worktree'`
   sur l'Agent tool, ou un `git -C <autre-chemin>` cible sur un AUTRE repertoire). Un agent qui a besoin
   de "verifier l'etat de master" doit le faire en LECTURE SEULE (`git log`, `git diff`, `git show
   <branche>:<fichier>`) ou dans un worktree separe, jamais stash/reset le repertoire courant.
2. Si un agent de type CLEANUP (session-close/wrap) a besoin de comparer l'etat actuel a une autre
   branche, prefer `git worktree add` temporaire (`isolation: 'worktree'` du tool Agent) plutot que de
   stasher le repertoire principal.
3. **Reflexe de diagnostic si `git status` semble vide a tort en pleine session** : NE PAS supposer une
   perte immediatement, mais NE PAS non plus continuer comme si de rien n'etait. Verifier dans l'ordre :
   `git stash list` (le travail y est peut-etre, ou un stash concurrent tourne) → chercher les fichiers
   directement sur disque avec `find` (hors git, un fichier NOUVEAU non-track peut avoir survecu meme si
   `git status` ment temporairement) → attendre/re-verifier avant de conclure a une perte reelle. Signaler
   le probleme a l'utilisateur des la premiere alerte serieuse, mais continuer a investiguer en parallele
   plutot que de rester bloque sur une hypothese fausse (ex: chercher dans le mauvais stash).
4. Corollaire pour les skills wrap eux-memes (session-close, /wrap) : instruire explicitement l'agent
   CLEANUP a ne PAS utiliser stash/reset pour ses propres verifications — ce prompt-brief doit etre
   corrige dans le skill lui-meme si l'usage de stash y est deja ancre comme methode de verification.

Lie : [[feedback_agents-paralleles-contrat-partage]] (autre risque de parallelisation, derive de contenu
plutot que collision git) · [[feedback_agent-derive-git-destructif]] (gate destructive generale).
