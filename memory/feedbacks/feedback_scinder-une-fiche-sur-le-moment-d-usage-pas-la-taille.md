# On scinde une fiche injectée sur le MOMENT D'USAGE, jamais parce que le fichier grossit

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

⭐ **Critere de decoupe d'une fiche auto-injectee : le MOMENT D'USAGE (le declencheur), pas la taille.**

Vecu 2026-08-19. Aziz demande si `FICHE-CAMERA.md` devient « un grand fouillis » apres y avoir ajoute
une section MiniMax H3/previs. **Mesure d'abord, avis ensuite** :
- contenu bien separe : **0 fuite** dans les deux sens (0 mention de previs/H3 dans la partie code,
  0 mention de `interpolate`/Mapbox/D3 dans la partie H3) ;
- taille 12,6 Ko / 157 lignes — pas encore critique.

**Mais le vrai defaut etait le DECLENCHEUR, pas le contenu** : le hook injectait la fiche sur detection
de *code* camera (`camAt|jumpTo|interpolate(`). Consequence :
- qui code une camera D3 recevait 61 lignes sur MiniMax **sans rapport avec son geste** ;
- ⛔ qui lancait une **generation H3 ne recevait JAMAIS** la fiche previs — le moment ou elle sert.

**Fix** : scinder en `FICHE-CAMERA.md` (camera CODEE, declencheur = motifs de code) +
`FICHE-CLIP-GENERE.md` (camera GENEREE, declencheur = `mkprevis|minimax_h3|submit_workflow|comfy`),
chacune pointant vers l'autre en 1 ligne. 101 + 82 lignes au lieu de 157.

**How to apply** :
1. Avant de scinder, MESURER les fuites croisees (`grep -c` des motifs de chaque famille dans l'autre
   moitie) — si 0, le contenu n'est pas melange et la taille seule ne justifie rien.
2. Se demander : **les deux moities se declenchent-elles au MEME instant de travail ?** Si oui → garder
   ensemble meme a 150 lignes. Si non → scinder et donner a chacune son declencheur.
3. Apres scission : ajouter le declencheur dans `.claude/hooks/fiche-inject.sh`, `bash -n` pour la
   syntaxe, **tester le motif sur 2-3 commandes reelles** (une qui doit matcher, deux qui ne doivent pas),
   mettre a jour `memory/fiches/README.md`, puis `check-links.py`.
4. ⭐ **Lire la fiche quand elle s'injecte pour de vrai** : c'est en la voyant s'afficher que j'ai repere
   2 incoherences residuelles (un « ECHEC » contredit plus bas, un chemin pointant vers le scratchpad
   au lieu du repo). Une fiche se relit dans son contexte d'injection, pas dans l'editeur.
