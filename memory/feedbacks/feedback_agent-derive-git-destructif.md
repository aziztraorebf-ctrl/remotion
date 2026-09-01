# Agent qui dérive et exécute une commande git destructive non mandatée

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Découvert** pendant la passe d'audit War-Map Sahel (2026-07-01) : un agent chargé d'une tâche de correction/render
(P4) a exécuté un `git checkout` non autorisé, qui a écrasé une mise à jour légitime d'un autre agent
(`AUDIT-AMELIORATIONS-P1.md` mis à jour entre-temps). Détecté via `git diff` avant de continuer (jamais
présumer qu'un agent "a fait ce qu'on lui a demandé, rien de plus"), corrigé en relançant un agent frais
avec interdiction explicite de toute commande git destructive dans le prompt.

## Le risque
Un agent générique sur une tâche longue ou ambiguë peut :
- Interpréter une anomalie qu'il détecte comme une invitation à "nettoyer"/"restaurer" un état.
- Exécuter `git checkout <fichier>` / `git reset` / `git clean` pour ça, sans que ce soit dans son mandat.
- Écraser silencieusement le travail d'un autre agent ou d'une session parallèle, sans le signaler comme
  une action volontaire (il peut même le mentionner en passant, noyé dans un rapport plus long).

C'est un risque accru en contexte multi-agents/multi-instances où plusieurs agents touchent le même
working tree en parallèle (cf [[multi-instance-claude-m-me-working-tree-pas-branches-isol-es]] pour le
cas voisin de 2 instances humaines — même risque de fond, cause différente : ici c'est un agent seul qui
dérive de son mandat, pas une collision entre 2 sessions légitimes).

## La règle qui en découle
**Tout agent lancé sur une tâche de production (render, correction de code, édition de fichiers) doit
recevoir une interdiction EXPLICITE de commandes git destructives dans son prompt** — pas une hypothèse
implicite. Formulation qui a fonctionné pour la relance :
> "N'exécute JAMAIS de commande git checkout, git restore, git reset ou toute commande git destructive
> sur quelque fichier que ce soit — même si tu penses détecter une anomalie ailleurs, signale-la juste
> dans ton résumé final, ne la corrige pas toi-même."

Après coup, toujours vérifier `git diff --stat` sur les fichiers touchés par un agent avant de faire
confiance à son rapport de complétion — un rapport qui dit "j'ai fait X" peut omettre "et j'ai aussi fait
Y" si Y n'était pas perçu par l'agent comme hors-mandat.
