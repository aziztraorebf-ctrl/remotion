# Une règle écrite, même bien visible et déjà lue, ne force pas son application — seul un gate outillé fonctionne

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Diagnostic méthodologique d'Aziz (2026-08-07, très important, transversal au-delà du seul Gazoduc),
après une analyse comparative ayant montré que le registre visuel du Gazoduc Acte 3 (jetons
géométriques inventés à la main) restait largement sous le niveau déjà prouvé ailleurs dans le
projet (Soudan `KhartoumEtatMajorSVG.tsx`, Short AES) — alors que les catalogues de briques
correspondants existent déjà et sont bien tenus (`MAPBOX-COMPOSANTS.md`, `CATALOGUE-CARTE-VIVANTE.md`,
`COMPOSANTS-INDEX.md`, `INTENTION-FORME-INDEX.md`).

**Le constat** : le problème récurrent du projet n'est PAS l'absence de briques réutilisables — c'est
l'absence de **mécanique d'exécution** qui force leur consultation AVANT de coder. Une règle écrite
dans CLAUDE.md ou une doctrine, même bien visible et déjà lue par le passé, ne suffit pas si rien ne
force un arrêt réel au bon moment.

**La distinction clé** : "règle écrite" (principe énoncé, ex. `CONTINUITE-SCENE-INTENTION-DABORD.md`
qui dit déjà "le scan de templates est une aide à la déduction, jamais le point de départ") vs "gate
outillé" (étapes numérotées + appel d'outil concret qui bloque structurellement, ex. le
`da-brief-gate` : impossible de sauter l'étape, elle produit une sortie qu'on doit lire). Le premier
ne fonctionne pas de façon fiable ; le second fonctionne parce qu'il n'y a pas d'option de "passer
à côté" sans s'en apercevoir.

**Comment appliquer** : avant de créer une nouvelle doctrine pour un principe non respecté, vérifier
si le principe existe déjà ailleurs (souvent le cas) — le vrai travail est d'**ajouter un mécanisme
bloquant** à la doctrine existante, pas d'écrire un principe de plus. Décision actée : une session
dédiée "studio réutilisable" doit auditer où ce trou de mécanique se répète dans le projet (pas
seulement sur le Gazoduc), via des agents Claude Code internes (contexte vierge, accès direct au
workspace, effort élevé, plusieurs en parallèle sur des angles distincts) — l'audit externe (LLM
tiers) vient en second temps seulement, nourri par le résumé produit par l'audit interne, jamais
l'inverse (un LLM externe ne peut pas lire le vrai code).

---

## ⭐⭐ COROLLAIRE (2026-08-17) — un gate NEUF se teste contre le CORPUS RÉEL, pas contre des cas imaginés

Écrire le gate ne suffit pas : il faut le passer sur les **vrais fichiers du repo** avant de le brancher.

**Vécu le 2026-08-17** (`forme-narrative-gate.sh`) : gate écrit, testé sur 13 cas **inventés** → 13/13.
Branché. Un agent d'audit lancé en parallèle a ensuite trouvé **3 faux positifs réels** que mes cas
inventés ne couvraient pas :
- `memory/feedbacks/feedback_warmap-script-process.md` — un feedback *sur* le script
- `memory/templates/script-ebauche-v1.md` — un gabarit, pas un script d'épisode
- `*-SCRIPT-jury-results.md` — la *sortie* du jury, pas le script

Sans cet audit, le gate m'aurait bloqué en écrivant un feedback. **Un gate qui bloque à tort finit
désactivé — et un gate désactivé ne protège plus rien.**

**Procédure à appliquer pour tout nouveau gate/hook** :
1. Écrire le gate.
2. `find`/`ls` le corpus réel que son regex est censé viser → vérifier les **faux négatifs**
   (des fichiers légitimes qu'il rate).
3. Passer le gate sur les fichiers **existants** du repo → vérifier les **faux positifs**
   (il ne doit rien bloquer de ce qui existe déjà et qui est légitime).
4. Seulement ensuite : brancher dans `settings.json`.

⚠️ Corollaire du corollaire : **la sentinelle anti-répétition fausse les tests**. Le même jour, 2 « RATE »
sur le déclencheur packaging étaient un artefact de mon test (la clé de session était déjà consommée par
le 1er appel), pas un bug. **Utiliser un `session_id` distinct par cas de test.**

## ⛔⛔ COROLLAIRE (2026-08-27) — le bruit d'un gate DÉJÀ INSTALLÉ

Le corollaire précédent traite du gate qu'on ÉCRIT (le tester avant de brancher). Celui-ci traite
du gate **branché depuis des semaines**, que plus personne ne teste, et qui dérive vers le faux
positif permanent.

**Vécu** (`.git/hooks/pre-commit`, détecteur de starters périmés) : il cherchait
`V1|V2|perime|obsolete|ARCHIVE` **n'importe où** dans un starter. Conséquences :
- un starter **bien tenu**, qui écrit lui-même « ce volet est périmé, voici ce qui reste valide »,
  était signalé — **le hook punissait la bonne pratique** ;
- la note ajoutée le matin même pour documenter le faux positif contenait le mot « périmé » et le
  déclenchait à son tour (boucle auto-entretenue) ;
- aucun filtre d'existence : il listait des fichiers **déjà supprimés** ;
- il signalait des starters déjà rangés dans `starters-perimes-*/`, donc déjà traités.

Résultat : **une alerte à chacun des 10 commits de la session, toujours fausse.**

⭐ **Pourquoi c'est urgent et pas cosmétique** : un avertissement qui a toujours tort finit ignoré,
et le jour où il a raison personne ne le lit. C'est ainsi que `circuit-breaker.sh` est mort le
2026-07-12 sans que personne le remarque. Aggravant ce jour-là : **3 nouveaux gates venaient d'être
installés** — les habituer au bruit les tuait tous les trois.

**Règle de conception** : un marqueur d'état (obsolète, périmé, archivé) se cherche dans
**l'EN-TÊTE** (5 premières lignes = là où on marque un fichier mort), jamais dans le corps — le
corps d'un bon fichier PARLE légitimement de ce qui est périmé. Plus : filtrer sur les fichiers
existants, exclure les dossiers d'archive.

**Piège de test** : un hook `pre-commit` sort tôt sans fichier *staged*. Mes premiers tests
« passaient » pour cette raison, pas parce que le fix marchait. Tester **avec un fichier staged**,
et dans les DEUX sens (silencieux sur le corpus réel + détecte bien un cas volontairement marqué).

⚠️ `.git/hooks/` n'est pas versionné → copie de référence dans
`.claude/hooks/_git-pre-commit-reference.sh`.

## ⛔⛔ COROLLAIRE (2026-08-31) — un exemple de plus, sur la communication externe

La règle "zéro tiret cadratin" existait déjà en mémoire depuis avant cette session
(`feedback_message-client-ne-pas-sonner-genere.md`, citée dans MEMORY.md comme règle
non-négociable), donc **connue**. Malgré ça, la lettre de candidature Upwork vokabl a
contenu 5+ tirets cadratins dans sa version initiale — la règle écrite n'a pas empêché
l'oubli d'exécution en plein travail génératif (une lettre de plusieurs paragraphes).

Corrigé cette fois par un **gate outillé réel** : `.claude/hooks/outbound-message-guard.sh`
(commit `05d6e137`) bloque (exit 2) tout draft de proposition/message Upwork contenant un
tiret cadratin, avant même que le draft soit montré pour validation — plus une simple
relecture à faire, un blocage mécanique qui empêche la création du draft tant que le texte
n'est pas corrigé. Avertissement (non bloquant) en plus sur une liste de formules figées
IA-sonnantes, où le blocage forcerait des reformulations parfois inutiles.

**Confirme le principe déjà établi** : la fiche/règle seule n'a jamais suffi ici, dans la
MÊME session où la règle était pourtant fraîche en mémoire. Le gate mécanique est la seule
protection qui tienne sur une tâche générative à volume de tokens élevé.
