# Un chiffre ou un remède venu d'un rapport d'agent est un SIGNAL, pas un fait

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Vécu 2026-08-17**, session de bilan du studio. J'ai relayé à Aziz, comme des faits établis,
**trois affirmations fausses** venues de rapports d'agents ou de résumés, sans les vérifier :

1. **« L'Extracteur n'existe pas »** — il est spécifié depuis toujours dans `/wrap` comme AGENT.
   J'avais cherché un *fichier* et conclu de son absence. Aziz avait raison en disant « je l'ai vu
   tourner ». Une recherche qui échoue ne prouve pas une absence : elle prouve que j'ai mal cherché.
2. **« CLAUDE.md est périmé sur l'upload »** — faux. La règle d'Aziz était plus fine que ma lecture
   (Vercel réservé aux MP4 à cause du quota, catbox pour le reste). J'ai pris une différence pour
   une contradiction.
3. **« La boucle zoom Mapbox, 3 itérations »** — n'existe dans AUCUNE source. Reprise d'un rapport
   d'audit et répétée deux fois avant qu'un second agent ne signale qu'elle n'est nulle part.

**Why** : un chiffre a l'apparence d'une preuve. « 3 itérations », « 6 cas », « 49 % » se relaient
sans friction parce qu'ils *ressemblent* à de la mesure — alors qu'ils peuvent être l'inférence d'un
agent qui n'a pas trouvé la source. Le coût n'est pas l'erreur elle-même : c'est qu'Aziz **prend une
décision dessus**, et qu'une décision bâtie sur un chiffre faux ne se détecte qu'une fois exécutée.

**Le même mécanisme sur un REMÈDE, le même jour** : la mémoire prescrivait depuis mai de basculer
sur `/v2/forced-alignment` quand v1 déraille. J'ai demandé à un agent de l'implémenter. Il a testé :
**la route renvoie 404, elle n'a jamais existé**. Appliquer le remède documenté aurait transformé un
bug intermittent en panne dure, sur le seul alignement encore disponible. C'est l'agent qui a refusé
la consigne — pas moi qui l'ai vérifiée avant de la donner.

**How to apply** :
- Avant de relayer un chiffre d'audit à Aziz : **l'ouvrir dans la source citée**. Si l'agent ne cite
  pas de source vérifiable, le présenter comme une estimation, pas comme une mesure.
- Avant d'implémenter un remède lu en mémoire : **vérifier qu'il marche encore** (la route existe ?
  le fichier existe ? sur la branche COURANTE ?). Un remède gravé n'a pas été retesté depuis.
- Une affirmation d'ABSENCE (« X n'existe pas », « ce n'est nulle part ») est la plus dangereuse :
  elle clôture la recherche et se recopie. La vérifier deux fois, par deux chemins différents
  (`ls` + `git ls-files` + `grep` dans les skills, pas seulement `find`).
- **Signaler l'incertitude coûte moins cher que la corriger après coup.** « L'agent rapporte X, je
  ne l'ai pas vérifié » est une phrase acceptable ; « X » présenté comme un fait ne l'est pas.

Voisins : [[autocritique-agent-signal-pas-verdict]] (l'autocritique d'un agent est un signal) ·
[[rapport-agent-texte-pas-preuve-verifier-disque]] (un « terminé » ≠ un fichier produit) ·
[[verifier-souvenir-comme-verdict-llm]] · [[commentaire-code-perime-bat-doctrine]] (le code périmé
gagne contre la doctrine). **Ce feedback-ci ajoute le cas du CHIFFRE et du REMÈDE relayés vers
l'utilisateur** — les voisins couvrent les verdicts et les livrables, pas les données d'audit.

## ⭐⭐ RECIDIVE 2026-08-23 — deux « ABSENCES » affirmees par des agents, fausses les deux fois

Meme mecanique que le cas n°1 ci-dessus, **deux fois dans la meme session**, et **Aziz avait raison
contre l'agent les deux fois** :

1. « **Pas assez de matiere pour un showcase motion design** » → il existait **8 montages showcase
   deja faits, deja en 1920x1080**, que ni moi ni le 1er agent n'avions vus.
2. « **Aucun lower third dans le fonds** » → il y en avait, **visibles dans un des montages**.

**Le motif exact** : un agent (et moi) transforme « je n'ai pas trouve » en « ca n'existe pas ». La
phrase sort du rapport sous une forme affirmative et se relaie sans friction, exactement comme un
chiffre. **Une affirmation d'ABSENCE est le type de conclusion d'agent le moins fiable qui soit** —
c'est la seule qu'on ne peut pas prouver, seulement echouer a refuter.

**How to apply** :
- ⛔ Ne JAMAIS relayer « il n'y a pas de X » sur la foi d'un rapport d'agent. **Chercher soi-meme**,
  avec au moins **deux strategies de nommage differentes** (le 1er agent cherchait par nom de
  composant ; les montages existaient sous un autre nom de fichier).
- Quand Aziz dit « je crois qu'il y en a » contre un rapport : **il a l'historique visuel du projet,
  l'agent a un contexte vierge**. Son doute prime — chercher, ne pas defendre le rapport.
- Reformuler dans les briefs d'agent : « je n'ai pas trouve de X en cherchant <critere> » n'est PAS
  « X n'existe pas ».

⭐ **Contre-exemple utile de la meme session** : l'agent CLEANUP du /wrap a REFUSE de fermer un
worktree parce que mon brief affirmait a tort « travail deja recupere ». Il a verifie et m'a
contredit — c'est exactement le comportement attendu. Un agent qui verifie le brief de son
orchestrateur vaut mieux qu'un agent obeissant.
