# RENDU / ASSEMBLAGE / PASSE FINALE — fiche de déclenchement (lire AVANT de rendre ou concaténer)
> ⚠️ Si ce que tu lis ne correspond PAS au réel que tu as sous les yeux : **c'est la FICHE qui a tort**. Corrige-la immédiatement.
> Chemins vérifiés sur disque le 2026-08-17.

## AVANT DE RENDRE
- **Mapbox / WebGL → `./scripts/render-mapbox.sh <CompositionId> <out.mp4> [args]` OBLIGATOIRE.** `npx remotion render` nu échoue en « Failed to initialize WebGL ». Le script fixe ce qui a été payé : `chrome-headless-shell`, `--gl=angle`, `--concurrency=1`, public-dir slim par symlinks (évite de copier 2,4 Go). ~5 fps.
- **D3 / SVG pur → `npx remotion render` local classique.** ⛔ `scripts/tools/render-on-vercel.py` = POC ABANDONNÉ, ne JAMAIS l'utiliser (repo Vercel figé au 2026-03-27, 3 compos de démo, ne verra jamais nos compositions).
- **Netteté = `scale=1` uniquement.** Un render 0.4–0.5 est flou par construction et fait douter à tort. Avant de conclure « flou/moche » → 1 frame full HD.
- **Render multi-segments** (`--frames=X-Y`) : `python3 scripts/tools/check-frame-continuity.py 2055-2939 3196-5699 …` AVANT (bornes prévues) ET APRÈS (bornes réelles). Coût de ne pas l'avoir fait : War-Map Sahel 2026-07-01, trous entre segments, narration sautée, détecté après livraison.
- **Chaque clip vidéo importé se mesure INDIVIDUELLEMENT** (`ffprobe -v error -show_entries format=duration …`), jamais par analogie avec un voisin du même dossier (5.875 s vs 5.167 s constatés). Une durée surestimée dans un `<Loop>` gèle l'image sans aucune erreur.
- ⭐ **GAZODUC passe finale** : Actes 1/2/3 se re-rendent en palette sombre `PAL_GPT` **à la passe finale, ⛔ PAS acte par acte** (`memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md`). L'Acte 4 est en **3 fichiers séparés** à assembler (124,68 s cumulées pour 124,04 s d'audio → 300 ms de marges à rogner).

## ⛔ VÉRIFIER UN CONCAT — le gel invisible
Coût documenté : Soudan mid-form v4 (2026-07-22), **image figée ~4 minutes** (2:55→7:00) avec audio normal. « Vérifié » par frames isolées : toutes plausibles. Aziz l'a vu en regardant.
- ⛔ **Le concat DEMUXER (`-f concat -i list.txt`) est interdit pour tout assemblage présenté**, surtout si une source est elle-même issue d'un concat (DTS non-monotones en cascade). Utiliser le **filtre** : `concat=n=N:v=1:a=1` (ou `a=0` si audio géré séparément — consigne écrite pour l'Acte 4 Gazoduc), avec ré-encodage complet.
- **Lire les warnings ffmpeg**, pas seulement grep « Error ». `Non-monotonic DTS` est un WARNING et c'était LE signal du bug.
- **Signal objectif le plus rapide** — flux VIDÉO, pas `format=duration` :
  `ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of default=nw=1:nk=1 out.mp4`
  Si `nb_frames / fps` << `format.duration` → le flux vidéo s'est arrêté avant l'audio.
- **Échantillonnage DENSE obligatoire** (1 frame / 2 s sur **toute** la durée, pas aux « points d'intérêt ») :
  `ffmpeg -i out.mp4 -vf fps=0.5 -q:v 5 /tmp/chk/f%04d.jpg && md5 /tmp/chk/*.jpg | awk '{print $NF}' | uniq -c | sort -rn | head`
  Deux hashs consécutifs identiques = gel. Des frames isolées NE PROUVENT RIEN.
  ⚠️ Commande dérivée de la règle écrite, **non exécutée sur un vrai fichier** — vérifier son comportement au 1er usage.
- **Après tout changement de STRUCTURE** (raccord, concat, refactor d'un composant partagé) : revérifier la séquence narrative de **chaque scène touchée**, pas seulement le point de couture (vécu CFA : jonction parfaite, scène suivante détruite).
- ⚠️ `check-frame-continuity.py` couvre les **trous entre segments de render**, PAS le gel de concat. Deux problèmes distincts.

## GATES BLOQUANTS (tu seras bloqué — voici pourquoi)
- **`.claude/hooks/pre-presentation-review.sh`** intercepte toute commande contenant `catbox` / `upload-to-blob.py` / `litterbox` / `ntfy-notify.sh`, et tout `SendUserFile` d'un `.mp4`. Il exige, à côté du mp4 : `<mp4-sans-ext>.review.json` (via `python3 scripts/visual_review.py <mp4> --model gemini --storyboard <s.png> --output <mp4-sans-ext>.review.json`), **score ≥ 8/10 ET verdict ≠ REBUILD**, et **plus récent que le mp4**. Exemptés : `/_rnd/`, `/_r-and-d/`, `templates-souverain`.
  3 pièges qui coûtent des tours : (1) l'override vaut pour le mp4 **exact** nommé (un `-compressed.mp4` a besoin du sien) ; (2) l'override doit être **plus récent** que le mp4 — le créer APRÈS le dernier encodage (`stat -f "%m %N"`) ; (3) un `ffmpeg` + un upload dans **la même commande Bash** sont bloqués avant l'encodage → séparer en 2 commandes.
  Faux positif Gemini (il réclame des labels volontairement retirés) → écrire `<mp4-sans-ext>.review-override.md` justifiant chaque point ignoré, puis relancer.
- **`.claude/hooks/pre-final-promotion.sh`** se déclenche sur tout `cp`/`mv` vers `*-FINAL.mp4`.
  ⚠️⚠️ **Bloquant (exit 2) UNIQUEMENT pour les épisodes Atlas** : GATE 1 ne cherche le TSX que sous `src/projects/atlas/<episode>/` (L34-35) et ne teste que 10 mots-clés hardcodés (L39). **Hors Atlas — Souverain, Gazoduc, War-Map — `TSX_CANDIDATES` est vide, la branche `else` s'exécute et le hook sort en 0 : il est entièrement INFORMATIF.** Ne pas compter dessus comme garde-fou de source.
  **Informatif partout** : self-review `/tmp/<ep>-beat<N>-self-review.json` ≥ 19, flag d'upload, rappel `trace-livrable.py` (`python3 scripts/tools/trace-livrable.py <rendu.mp4> --episode-dir <dossier>`).
  ⚠️ **Un gate qui « passe » ne prouve pas qu'il a testé.** `pre-final-promotion.sh` sort en 0 dès que le TSX est introuvable ; `pre-presentation-review.sh` sort en 0 avec un simple WARNING si le score du review.json est illisible (clé API absente, L174-181), et un `.review-override.md` plus récent que le mp4 le court-circuite AVANT même la recherche du review.json (L136-148). **Lire le texte imprimé, pas le seul code de sortie.**
  ✅ **Échelle tranchée 2026-08-17** : `SELF_REVIEW_CRITERIA` compte **25 critères** (comptés dans le code). Seuil = **19/25**. Corrigé dans CLAUDE.md + beat-session.py.
  ⛔ **La correction est PARTIELLE** : le « 19/23 » survit dans 5 fichiers (`SOUVERAIN-REMOTION-PLAYBOOK.md:115`, `SCRIPTS-INDEX.md:124`, `PIPELINE.md:207`, `.claude/commands/beat.md:35`, `SOUVERAIN-INDEX.md:32`). **Non corrigés volontairement** : à faire en une passe une fois qu'Aziz aura tranché 19 vs 21, sinon double passe.
  ⚠️ Effet de bord non décidé : passer de 23 à 25 critères a fait descendre l'exigence de 83 % à **76 %** sans que personne ne le choisisse. 21/25 (= 84 %) rétablirait l'origine — **décision d'Aziz en attente**.
  ⭐ **Leçon** : corriger une valeur chiffrée = **grep du chiffre dans TOUT le repo** (`.md` ET code ET `.claude/`), jamais fichier par fichier de mémoire. Écrire « corrigé partout » sans avoir greppé fabrique une fiche qui ment — arrivé ici le jour même de la création de cette fiche.
- **Hygiène out/** : `wip/beatN_v3.mp4` → présenté `beatN_V3.mp4` → validé `beatN-FINAL.mp4` → `out/PRET-PUBLICATION/<ep>-FINAL.mp4`. Jamais de fichier à la racine de `out/`, jamais de dossier par date. À validation : promouvoir `versions/` → FINAL, purger `wip/` + `versions/`.

## PRÉSENTER À AZIZ (il est sur mobile)
- **Uploader AVANT de présenter, jamais un chemin local.** ⛔⛔ **QUOTA VERCEL BLOB : le plan gratuit est à 75 % de sa limite mensuelle** (décision Aziz 2026-08-17) — Vercel Blob est réservé aux **MP4 / rendus vidéo**, PAS aux images ni au reste.
  - **MP4 / rendu vidéo → Vercel Blob** : `python3 scripts/tools/upload-to-blob.py <fichier> --folder <dossier>`.
  - **PNG / image / autre → catbox → Imgur → uguu → Litterbox** (ordre CLAUDE.md § Communication mobile, TOUJOURS valide). catbox est instable (HTTP 200 + `content-length: 0` silencieux) → **vérifier `curl -sI <url> | grep content-length` avant de donner le lien**. uguu ~3 h de rétention, Litterbox 72 h.
  - **Page HTML → ni Blob ni catbox** (voir ligne suivante).
- **Page HTML → ⛔ JAMAIS Vercel Blob ni catbox** (confirmé 2×) → `~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh`. Page autonome (CSS/JS inline, images `data:`).
- **Plein format seul d'abord**, jamais une vignette côte-à-côte rapetissée : un render jugé à 540 px a fait « corriger » un problème inexistant en plein écran. Le côte-à-côte sert à MESURER, le plein format à JUGER.
- **Un agent qui rapporte « terminé » n'a pas forcément produit le fichier** : `ls -la` sur le chemin annoncé avant d'accepter le succès. Un agent peut aussi s'arrêter juste AVANT `git commit`.

## SI ÇA RATE 2×
Au **2e échec du même symptôme** (render qui plante, concat qui casse, gel qui revient) : STOP, pas de 3e variante. Déléguer à un agent frais (Opus, `run_in_background`) — **reverse-engineering du repo D'ABORD** (git log/blame, `memory/`, doctrines : le fix existe souvent déjà), `systematic-debugging` ensuite. L'agent RAPPORTE, n'applique pas. Coût documenté : ~40 min perdues sur un blocage API dont le fix était déjà dans le repo.
