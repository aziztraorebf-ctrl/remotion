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
- **Récupérer le travail non commité d'un worktree** vers une autre branche : `git -C <worktree> diff > patch && git apply patch` (les worktrees ne partagent pas leur working tree).
- **Fermer** quand le chantier est fini : `git worktree remove <path>` (+ `git branch -D worktree-<id>` si branche auto).

**Preuve** : session passe finale Soudan 2026-07-21 — worktree `remotion-soudan` a permis de continuer malgré une session CFA qui rebasculait le repo 2×. ~40 min perdus AVANT d'isoler (leçon : isoler plus tôt) + 2 échecs render Mapbox (exit 9/1) avant de comprendre les assets gitignorés à lier.

Lié : [[chercher-outil-existant-avant-improviser]] · voir aussi `memory/tools/mapbox-effets-et-tests.md` (render-mapbox.sh + still WebGL).
