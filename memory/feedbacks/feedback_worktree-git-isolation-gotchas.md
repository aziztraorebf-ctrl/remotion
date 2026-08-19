---
name: worktree-git-isolation-gotchas
description: Travailler dans un worktree git dédié pour s'isoler d'une session concurrente — gotchas assets gitignorés, symlinks, render vidéo qui hang.
metadata:
  type: feedback
---

# Worktree git dédié — isolation d'une session concurrente (gotchas)

**Quand** : une 2e session (autre instance Claude) travaille sur le MÊME repo et le rebascule sur SA branche → elle écrase le working tree et fait perdre du temps (observé 2× en une session, chantiers Soudan vs CFA, 2026-07-21).

**Why** : deux instances sur un working tree partagé se marchent dessus (checkout, stash, commits croisés). Un worktree git dédié (`git worktree add <path> <branche>`) donne un répertoire ISOLÉ sur sa propre branche — les deux sessions coexistent sans conflit.

**How to apply** :
- **Dès qu'une activité concurrente est détectée** (le repo rebascule tout seul sur une autre branche) → créer un worktree dédié IMMÉDIATEMENT, ne pas attendre 2-3 bascules. `git worktree add /Users/clawdbot/Workspace/<repo>-<projet> <ma-branche>`.
- **Assets gitignorés ABSENTS du worktree neuf** (`.env`, `node_modules`, `public/_shared/audio` + `sfx` mp3) → les LIER par symlink depuis le repo principal, ne pas copier :
  `ln -s /Users/clawdbot/Workspace/remotion/{node_modules,.env} .` puis remplacer les sous-dossiers `public/_shared/{audio,sfx}` par des symlinks vers le repo principal.
- **Symlink par-dessus un chemin qui contient des fichiers TRACKÉS** → git les voit "deleted" (fantômes). Fix : `git update-index --skip-worktree <fichiers>` sur ces fichiers. Et **NE JAMAIS `git add -A`** dans un worktree (risque de committer les suppressions) — toujours `git add <fichier précis>`.
- ⚠️⚠️ **UN WORKTREE D'AGENT QUI SE NETTOIE PEUT EMPORTER LE `node_modules` DU REPO PRINCIPAL**
  (vécu 2026-07-28) : en pleine session, `npx remotion render` s'est mis à échouer avec
  `npm error could not determine executable to run`, et `ls node_modules` renvoyait « No such file
  or directory » **à la racine du repo principal** — alors que les worktrees d'agents, eux, avaient
  toujours le leur. Cause probable : le nettoyage automatique d'un worktree d'agent (isolation
  `worktree` du tool Agent) a suivi/supprimé le lien. **Diagnostic en 5 s** : `ls -d node_modules`
  → absent = c'est ça, pas un bug Remotion. **Fix** : `npm install` depuis la racine (long mais
  seule voie propre). **Prévention** : après une salve d'agents en isolation `worktree`, vérifier
  `ls -d node_modules` AVANT de lancer un render — ça évite de diagnostiquer un faux problème de
  rendu. ⚠️ Corollaire shell : lancer `npm install` avec le shell resté dans un scratchpad échoue
  sur `ENOENT package.json` — toujours `cd /Users/clawdbot/Workspace/remotion && npm install`.
- ⚠️⚠️ **Les FICHIERS DE NAVIGATION existent en DEUX exemplaires et DIVERGENT** — `memory/NEXT-ACTION.md`,
  `memory/PIPELINE.md`, les `STATUS.md`… sont versionnés, donc le worktree en a sa propre copie, figée à
  la date où la branche a divergé. Dès la 1re session qui ne met à jour que l'un des deux, ils mentent.
  Vécu 2026-07-26 : le `NEXT-ACTION.md` du worktree CFA datait du 22/07 et n'avait AUCUNE section CFA,
  alors que le CFA y était le chantier actif — j'ai édité le mauvais fichier avant de m'en apercevoir.
  → **Réflexe à l'ouverture d'un worktree** : `ls -la` les deux `NEXT-ACTION.md` et comparer les dates
  avant de faire confiance à l'un. Puis **poser un bandeau de péremption** sur celui qui ne fait pas
  autorité, en nommant explicitement lequel gagne pour quoi.
  → Répartition qui a marché sur CFA : **NEXT-ACTION → le repo PRINCIPAL fait autorité** (c'est lui qui
  est chargé en début de session) · **STATUS de l'épisode → le WORKTREE fait autorité** (c'est là qu'on
  travaille). L'écrire noir sur blanc dans les deux fichiers, sinon la prochaine instance repayera l'erreur.

- ⚠️ **Un asset audio FINAL (musique choisie, mix verrouillé) doit être tracé avec `git add -f`** — `*.mp3`
  et `*.wav` sont gitignorés, donc un fichier qu'on vient de valider N'EST PAS versionné et **disparaît**
  à la prochaine purge ou sur une autre machine. Distinct du gotcha symlink ci-dessus (qui concerne le
  RENDER) : ici c'est la PERSISTANCE d'une décision entre sessions. Vécu 2026-07-26 (CFA) : le rendu FINAL
  du beat 1 était introuvable sur disque, il a fallu le re-rendre depuis le composant — et la musique de
  l'épisode aurait subi le même sort sans `git add -f`.
  → Réflexe : dès qu'un asset audio est VALIDÉ (pas juste testé), le committer explicitement.

- **Render VIDÉO (mp4) HANG à l'encoding** dans un worktree quand les assets sont accédés via symlink (ffmpeg muxing bloque à 0% CPU). MAIS `remotion still` (PNG) fonctionne normalement. → réserver le worktree aux itérations **code + still**, faire les **renders vidéo finaux dans le repo PRINCIPAL**.
- **⚠️ ASSET AUDIO/SFX via symlink → 404 dans le bundle webpack Remotion** (vécu CFA Beat 3, 2026-07-22) : un render mp4 SANS audio passe très bien en worktree, MAIS dès qu'un `<Audio staticFile("_shared/sfx/...")>` pointe un mp3 **symlinké**, Remotion copie `public/` dans un bundle temporaire et NE SUIT PAS le symlink → `{"statusCode":404,"message":"...ink-spread.mp3 could not be found"}`, render avorté. **Fix** : pour les mp3 utilisés en `staticFile` (voix + SFX), COPIER les vrais fichiers dans le worktree (`cp`), PAS symlinker. Distinct du "hang encoding" ci-dessus (ça = 404 au chargement d'asset, pas un hang ffmpeg). C'est spécifique aux assets référencés par `staticFile()` dans le code ; les symlinks node_modules/.env restent OK.

  **🔎 SIGNATURE OBSERVABLE — `exit code 0` + AUCUN fichier produit = c'est CE bug, pas autre chose.**
  Le render échoue au chargement d'asset mais la commande retourne 0 et se rapporte « terminé ».
  → chercher `404` / `could not be found` dans le log, ne pas diagnostiquer ailleurs.
  → corollaire : **un exit code 0 ne prouve JAMAIS le fichier** — toujours `ls -la` sur le chemin de sortie.

  **⛔ VÉRIFICATION PRÉVENTIVE — à lancer en OUVRANT le worktree, pas après un render raté (friction 2026-07-25) :**
  ```bash
  find public -type l          # doit renvoyer VIDE. Tout symlink listé = un render qui echouera.
  ```
  Vécu ce jour : un seul mp3 symlinké (`blip-bubble.mp3`) a fait echouer un render **qui a quand même
  rapporté "terminé, exit code 0" sans produire de fichier**. Le gotcha était déjà écrit ici — mais relu
  seulement APRÈS l'échec. Une commande en 2 secondes à l'ouverture évite le diagnostic à froid.

  **⭐ PRÉCISION EMPIRIQUE (2026-07-25) — les renders VIDÉO marchent en worktree si `public/` est propre.**
  La règle « faire les renders vidéo finaux dans le repo principal » (ci-dessus) vient du hang à l'encoding
  lié aux symlinks. Une fois **zéro symlink** dans `public/`, 6 renders mp4 successifs (avec audio + SFX,
  jusqu'à 25s) ont été produits dans le worktree sans aucun hang. → la contrainte réelle n'est pas
  « worktree », c'est « symlink ». Rester prudent sur les très longs renders, mais ne pas s'interdire
  le worktree par principe.
- **⛔ ISOLER PLUS TÔT — appliquer la règle AU SIGNAL, pas au 2e télescopage** (re-vécu CFA Beat 3, 2026-07-22) : la mémoire (MEMORY.md/NEXT-ACTION) signalait DÉJÀ une session Soudan concurrente active (worktree `remotion-soudan`). J'ai quand même codé dans le repo principal → il a rebasculé sur la branche Soudan sous mes pieds, fichiers CFA disparus du disque + edits Root.tsx perdus. **Déclencheur renforcé** : si la mémoire mentionne une session concurrente sur un AUTRE projet, créer le worktree dédié AVANT la 1re ligne de code, même sans avoir encore vu de bascule. Le signal mémoire SUFFIT.
- ⛔⛔ **AVANT DE CONCLURE À UNE DISPARITION : VÉRIFIER SON PROPRE `pwd`** (vécu 2026-07-29, ~4 appels
  d'outil perdus). Symptômes identiques au gotcha ci-dessus — `npm error could not determine
  executable to run`, `ls node_modules` → "No such file or directory", **`git log` → "not a git
  repository"** — alors que RIEN n'avait disparu : un `cd` vers le scratchpad (fait pour lancer un
  script de vérification) avait **persisté d'un appel Bash au suivant**, et tous mes chemins relatifs
  pointaient hors du repo. J'ai commencé à chercher un coupable (un agent qui aurait nettoyé) avant
  de vérifier où j'étais.
  **Le signal qui distingue les deux cas** : si `git log`/`git status` répond *"not a git
  repository"*, ce n'est PAS une suppression de fichiers — un repo qui perd `node_modules` garde son
  `.git`. Une disparition réelle laisse git fonctionnel.
  **Parade** : `pwd` en premier réflexe, et surtout **chemins ABSOLUS dans les commandes de
  vérification** (`ls /Users/.../remotion/src/...`), jamais relatifs après un `cd` de convenance.
  ⚠️ Corollaire coûteux : le même `cd` dérivé a fait écrire des renders dans
  `out/_r-and-d/<projet>/out/_r-and-d/<projet>/` — un sous-dossier **orphelin en miroir** (6 Mo de
  doublons) qu'il faut penser à purger. Si un chemin de sortie se duplique dans l'arborescence,
  c'est la signature de ce bug.
- ⭐ **UN SOCLE PARTAGÉ EN 2 COPIES NE SE SYNCHRONISE PAS TOUT SEUL** (repo principal ↔ worktree).
  `src/projects/_shared/stick-figure-svg/{StickFigure.tsx, habillage.ts, identite/Roles.tsx}` existe
  dans les deux et **rien ne vérifie qu'ils sont identiques**. Corriger un bug de socle d'un seul
  côté = un bug qui réapparaît la session suivante depuis l'autre copie.
  **Après toute modification du socle** : `cp` vers l'autre copie **puis PROUVER** —
  `diff -q <principal> <worktree> && echo SYNCHRO OK` — et lancer `tsc` **des deux côtés**
  (une copie peut compiler et l'autre non si ses appelants diffèrent).
  ⚠️ Attention : seuls les fichiers de socle sont censés être identiques. La doc
  (`STICK-FIGURE-INDEX.md`), le dossier `gestes/` et les démos d'identité ne vivent que côté
  worktree CFA — un `diff -r` du dossier entier remonte donc des écarts LÉGITIMES.
- **Récupérer le travail non commité d'un worktree** vers une autre branche : `git -C <worktree> diff > patch && git apply patch` (les worktrees ne partagent pas leur working tree).
- **Fermer** quand le chantier est fini : `git worktree remove <path>` (+ `git branch -D worktree-<id>` si branche auto).

**Preuve** : session passe finale Soudan 2026-07-21 — worktree `remotion-soudan` a permis de continuer malgré une session CFA qui rebasculait le repo 2×. ~40 min perdus AVANT d'isoler (leçon : isoler plus tôt) + 2 échecs render Mapbox (exit 9/1) avant de comprendre les assets gitignorés à lier.

- ⛔⛔ **AVANT DE FOUILLER `git log`/`git show` POUR UN FICHIER "SUPPRIMÉ" : CHERCHER D'ABORD SUR LE
  DISQUE ENTIER, worktrees inclus** (vécu 2026-08-01, Short CFA 9x16). Les fichiers source du Short
  CFA n'existaient plus dans le repo principal (`src/projects/souverain/cfa-short-9x16/` absent) —
  réflexe immédiat : remonter l'historique git commit par commit pour les restaurer. Correction
  d'Aziz : « la vidéo est dans prêt pour production, pourquoi ne pas chercher là ? le code est-il
  encore présent ? » — un `find /Users/clawdbot/Workspace -iname "*cfa-short*"` aurait immédiatement
  révélé que le worktree `remotion-cfa` (branche `feat/cfa-short-9x16`) avait TOUJOURS les fichiers
  intacts, sans avoir besoin de reconstituer quoi que ce soit depuis git. La restauration git a quand
  même été faite dans le repo principal (décision explicite d'avoir les 2 copies), mais l'ordre de
  recherche était inversé : disque d'abord (`find` large, tous worktrees), git seulement si vraiment
  introuvable nulle part.
  → **Réflexe correct** : fichier introuvable dans le repo courant → `find /Users/clawdbot/Workspace
  -iname "*<mot-clé>*"` en premier (couvre tous les worktrees en une commande) → seulement si vide,
  `git log --all --oneline -- "*nom*"` pour remonter l'historique.

- ⚠️ **CORRIGER un socle/composant dans le repo principal SANS vérifier si une copie worktree
  diverge crée une divergence documentée-mais-oubliée** (vécu 2026-08-01, suite directe du point
  ci-dessus). Après restauration + correction du CTA CFA ("EN DESCRIPTION"→"EN BIO") dans le repo
  principal, le worktree `remotion-cfa` original garde sa version NON corrigée — les deux copies
  divergent maintenant sur un point précis (le texte du CTA), en plus de leur divergence de base
  (branches différentes). Ce n'est découvert qu'en fin de session, par l'agent CLEANUP du `/wrap`,
  pas pendant le travail actif. → Cf. le point "UN SOCLE PARTAGÉ EN 2 COPIES NE SE SYNCHRONISE PAS
  TOUT SEUL" ci-dessus : la même règle s'applique à un Short entier, pas seulement à un socle
  partagé nommé comme tel. **Dès qu'un fichier corrigé dans le repo principal a une copie connue
  dans un autre worktree, le signaler explicitement dans NEXT-ACTION.md avec les 2 chemins et l'état
  de chacun** — pas seulement le laisser à la découverte du prochain `/wrap`.

- ⛔⛔ **2 SESSIONS DANS LE MÊME RÉPERTOIRE, SANS WORKTREE — le cas que `git worktree list` NE MONTRE
  PAS** (vécu 2026-08-15). Aziz travaillait sur le Gazoduc Acte 4 dans une session parallèle, sur la
  branche `feat/gazoduc-acte1-hook-globe`, **dans le répertoire principal** (pas un worktree). J'ai
  travaillé toute une session de R&D sur la même branche sans m'en rendre compte, et posé **7 commits
  R&D sur sa branche d'épisode** — alors qu'Aziz m'avait prévenu dès le départ qu'une session tournait.
  `git worktree list` ne montrait qu'un seul arbre : **l'absence de worktree ne prouve PAS l'absence de
  session concurrente**.
  → **Réflexe correct, AVANT le premier commit d'une session** : `git branch --show-current` +
  `git log -1 --format=%cd` sur la branche. Une branche d'épisode commitée **aujourd'hui** = session
  active dessus → créer sa propre branche AVANT de commiter, pas après.
  → **Réparation sans risque** (appliquée) : créer la branche R&D **depuis l'état courant**
  (`git branch feat/xxx-rnd`) puis y basculer — les commits sont préservés, aucun `reset` n'est
  nécessaire. ⛔ **Ne JAMAIS `reset` la branche partagée pendant que l'autre session tourne** : ça
  changerait les fichiers sous ses pieds. Le nettoyage de la branche se fait quand l'autre session est
  finie, pas pendant.
  → Symptôme qui doit alerter en cours de session : des commits ou des fichiers non trackés qui
  apparaissent dans `git status` **sans que je les aie créés** (ici : `GazoducActe4Timing.ts`, un proto
  de palette, un `Root.tsx` modifié). Les regarder AVANT de committer ou de nettoyer quoi que ce soit —
  et ne jamais les emporter dans son propre commit.

Lié : [[chercher-outil-existant-avant-improviser]] · voir aussi `memory/tools/mapbox-effets-et-tests.md` (render-mapbox.sh + still WebGL).

<!-- Section rapatriee le 2026-08-17 depuis la copie .claude/.../feedbacks/ (datee 2026-07-26).
     Elle n'existait QUE la-bas : MEMORY.md pointe vers CE fichier, donc ce gotcha etait invisible. -->

## GOTCHA — un fichier/script peut etre TOTALEMENT ABSENT du worktree (branche non mergee)

Distinct des cas ci-dessus (fichiers qui DIVERGENT entre worktree et repo principal) : ici le fichier
**n'existe dans aucune version du worktree**, parce qu'il a ete ajoute par une AUTRE branche non
mergee. Vecu 2026-07-26 depuis le worktree `remotion-cfa` : `memory/doctrines/AUDIO-PAUSES-DETERMINISTES.md`
et `scripts/tools/soudan-audio/` (ajoutes par la branche Soudan) sont introuvables — alors qu'ils sont
bien presents dans le repo principal.

**Consequences a connaitre :**
- ⛔ **Ne PAS conclure « l'outil n'existe pas » ni « la doctrine n'existe pas »** et improviser un
  remplacement. Verifier d'abord dans le repo principal (`ls /Users/clawdbot/Workspace/remotion/<chemin>`).
- `check-links.py` lance DEPUIS le worktree produit des **FAUX POSITIFS** de liens morts sur ces
  fichiers. Le lancer depuis le **repo principal** pour un verdict fiable (verifie : 0 lien mort cote
  principal, 2 « morts » cote worktree pour les memes fichiers).
- Pour s'en servir sans merger : `git checkout <branche> -- <chemin>` dans le worktree, ou simplement
  lire/executer depuis le repo principal.

## ⭐⭐ UN `.alignment.json` SANS SON `.mp3` = AUDIO MANGÉ PAR `.gitignore`, PAS UN BUG DE CODE (2026-08-18)

Le re-rendu de `Stick-Vendeuse` plantait. Cause réelle : `public/_rnd/stick-figures/vendeuse/narration.mp3`
**absent du disque** — `.gitignore:9` contient `*.mp3`. Le `narration.alignment.json` (versionné, lui) était
bien là. Le rig stick-figure n'y était pour rien.
⭐ **LE TELL** : les DÉRIVÉS d'un audio sont versionnés, l'audio ne l'est pas. Un `.alignment.json` orphelin
est la signature exacte d'un audio perdu — **chercher ce qui MANQUE avant de corriger ce qu'on soupçonne**.

⛔ **ET NE PAS SUR-DIAGNOSTIQUER** : j'ai d'abord cru à une nouvelle occurrence de
[[feedback_registre-canonique-branche-rnd-jamais-mergee-pattern-recurrent]] (« les scènes vivent sur master,
absentes de ma branche »). **FAUX, vérifié** : `git branch -a --contains d38afc9c` → `master` (donc mergé),
et `git ls-files` liste les 2 fichiers sur HEAD. C'était une branche de travail **non rebasée**, rien d'autre.
→ **Avant d'incrémenter le compteur d'un pattern connu, vérifier `git branch --contains`.** Gonfler un
pattern récurrent avec un cas qui n'en est pas un rend le feedback moins fiable — l'EFFET se ressemblait
(fichier absent de ma branche), la CONDITION (jamais mergé) n'était pas remplie.
Cf. [[feedback_generaliser-un-seul-cas-isoler-la-condition-pas-juste-l-effet]].
