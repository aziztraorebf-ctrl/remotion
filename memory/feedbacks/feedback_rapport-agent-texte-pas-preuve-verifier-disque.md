Sur le mid-form Soudan (passe finale v4, 2026-07-22), un agent charge de re-timer et re-rendre 6 actes
+ 1 hook a termine avec le message "J'arrete definitivement d'appeler des outils vides dans ce tour et
j'attends la notification." — un message qui ne contient AUCUN signal d'alerte explicite ("termine",
"echec", "bloque"), mais qui masquait en realite un travail INCOMPLET : 2 des 6 fichiers attendus
(`a2.mp4`, `a6.mp4`) n'avaient jamais ete produits. Je ne l'ai detecte qu'en verifiant directement le
systeme de fichiers (`ls out/episodes/.../passe-finale-v4/`) plutot qu'en me fiant au texte du rapport.

**Distinct de la confabulation deja gravee** ([[feedback_deleguer-debug-bloquant-plutot-que-simplifier]],
§ "Suite 2") : la confabulation, c'est un agent qui AFFIRME avoir fait un travail qu'il n'a pas fait du
tout (chemins de fichiers inventes, "verifie visuellement" sans l'avoir fait). Ici, le travail etait
REEL et PARTIEL (4/6 fichiers produits, corrects) — le probleme est que la communication de fin ne
signalait PAS clairement l'etat d'avancement incomplet. Meme risque final (ne pas se fier au texte),
cause differente (omission de reporting vs invention pure).

**Why** : CLAUDE.md racine (ligne 83) grave deja "un agent qui rapporte terminé n'a pas forcément
produit le fichier" — mais ce point est SCOPE a la generation d'ASSET par un agent visual-producer.
Cette session montre que le meme risque existe pour N'IMPORTE QUEL type d'agent sur une tache
multi-fichiers/multi-etapes (ici : re-timing/re-render de code), y compris quand le message de fin ne
contient aucun mot-cle d'alerte apparent — il faut donc verifier systematiquement, pas seulement
quand le rapport "sonne mal".

**How to apply** : apres tout retour d'agent sur une tache qui produit PLUSIEURS livrables nommes
(fichiers, sections de code, etapes d'un pipeline) : lister explicitement les livrables ATTENDUS (les
noter avant de lancer l'agent si possible) et verifier par `ls`/`find`/`git diff --stat` la liste REELLE
produite, meme si le rapport texte de l'agent ne contient aucun signal d'alerte. Ne jamais conclure "tout
est fait" sur la seule base d'un message de fin qui semble neutre ou conclusif.

## Variante 2026-08-03 (session refs video externes, Gazoduc) — mauvais PERIMETRE de recherche, pas un fichier absent

Un agent charge de verifier si des rendus video existaient pour cacao/GGW (pour juger si des personnages
articules complexes etaient necessaires) a conclu a tort "aucun rendu video" — alors que les videos
FINALES existaient bel et bien dans `out/PRET-PUBLICATION/`. Cause : l'agent cherchait un rendu
correspondant EXACTEMENT au fichier de code PROTOTYPE (`HistoirePlanteur.tsx`/`HistoireGGW.tsx`) au lieu
de verifier si la video FINALE publiee existait par un AUTRE chemin de production (souvent renommee/
deplacee entre le prototype et la sortie `PRET-PUBLICATION/`).

**Distinction avec le cas principal ci-dessus** : la ici n'est pas "l'agent affirme un travail fait qui ne
l'est pas" (confabulation) ni "le rapport texte cache un manque" (omission) — c'est un **perimetre de
recherche trop etroit** : l'agent a suppose qu'un livrable FINAL doit forcement porter le meme nom/chemin
que le fichier de code source qui l'a produit a l'origine. Faux dans ce projet : le pipeline
prototype -> beat -> assemblage -> `out/PRET-PUBLICATION/<ep>-FINAL.mp4` change le nom a chaque etape
(cf § Hygiene out/ du CLAUDE.md racine).

**How to apply (ajout)** : avant de conclure "aucun rendu n'existe" pour un sujet/composant, chercher
D'ABORD dans `out/PRET-PUBLICATION/` (nommage `<ep>-FINAL.mp4`) et `memory/archive/episodes-livres/`
(grep le sujet) — PAS seulement un chemin derive du nom du fichier de code prototype. Un livrable publie
est presque toujours ailleurs et autrement nomme que son fichier source d'origine.

---

## Corollaire 2026-08-15 — MON PROPRE travail n'est pas mieux placé qu'un rapport d'agent

En fin de session, je m'apprêtais à annoncer « tout est sauvegardé ». La vérification git a révélé
**deux problèmes que ma mémoire de session ne contenait pas** :
1. les clips validés n'étaient **pas trackés** — la règle `*.mp4` du `.gitignore` les avalait
   silencieusement : des assets payés (GPU) n'existaient que sur le disque local ;
2. des commits étaient partis sur la **mauvaise branche**, alors qu'une branche R&D dédiée avait
   justement été créée pour les isoler d'une session parallèle.

**Aucun des deux n'était visible sans lancer les commandes** : un `.gitignore` rend l'absence
invisible (rien dans `git status`), et un changement de branche ne laisse aucune trace perceptible
dans le fil de la conversation.

**En clôture de toute session produisant des assets binaires ou impliquant un changement de branche** :
(a) `git status --short` ET `git status --ignored` sur les dossiers d'assets touchés ·
(b) `git log --oneline -10` + `git branch --show-current` pour vérifier où les commits ont atterri ·
(c) tout asset généré à coût non nul qu'on veut garder → `git add -f` explicite.
⛔ Ne jamais formuler « tout est sauvegardé » sans avoir lu la sortie de ces commandes.
