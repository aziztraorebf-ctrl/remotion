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
- **Render VIDÉO (mp4) HANG à l'encoding** dans un worktree quand les assets sont accédés via symlink (ffmpeg muxing bloque à 0% CPU). MAIS `remotion still` (PNG) fonctionne normalement. → réserver le worktree aux itérations **code + still**, faire les **renders vidéo finaux dans le repo PRINCIPAL**.
- **Récupérer le travail non commité d'un worktree** vers une autre branche : `git -C <worktree> diff > patch && git apply patch` (les worktrees ne partagent pas leur working tree).
- **Fermer** quand le chantier est fini : `git worktree remove <path>` (+ `git branch -D worktree-<id>` si branche auto).

**Preuve** : session passe finale Soudan 2026-07-21 — worktree `remotion-soudan` a permis de continuer malgré une session CFA qui rebasculait le repo 2×. ~40 min perdus AVANT d'isoler (leçon : isoler plus tôt) + 2 échecs render Mapbox (exit 9/1) avant de comprendre les assets gitignorés à lier.

Lié : [[chercher-outil-existant-avant-improviser]] · voir aussi `memory/tools/mapbox-effets-et-tests.md` (render-mapbox.sh + still WebGL).
