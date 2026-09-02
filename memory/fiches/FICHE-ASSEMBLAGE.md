# RENDU / ASSEMBLAGE / PASSE FINALE — fiche de déclenchement (lire AVANT de rendre ou concaténer)
> ⚠️ Si ce que tu lis ne correspond PAS au réel que tu as sous les yeux : **c'est la FICHE qui a tort**. Corrige-la immédiatement.
> Chemins vérifiés sur disque le 2026-08-17.

## AVANT DE RENDRE

### ⛔⛔ MESURER UNE COULEUR — sur le RENDU, au CŒUR du glyphe (2026-08-27, repro Foster)
- **Une couleur se valide sur le RENDU FINAL, jamais sur la valeur écrite dans le code.** La chaîne
  Chromium + h264 `yuv420p` ÉCLAIRCIT, et pas uniformément : biais mesuré **+5 R, +13 G, +21 B**.
  Le bleu remontant le plus, c'est la **saturation** qui s'effondre — donc « terne » malgré une
  luminosité correcte. FIX : poser **cible MOINS biais**. Vérifié : sat 0,542 obtenue pour 0,540 visée.
- ⭐ **Sur du TEXTE, relever la couleur au CŒUR du glyphe (percentile 99+).** Un seuil plus large
  embarque les pixels de bord anti-aliasés contre le fond → biais **systématique** vers le fond
  (mesuré sur le même mot : `rgb(165,133,73)` au p97 contre `rgb(204,165,93)` au p99,5).

### ⛔⛔ FRAME 0 ≠ ÉTAT ÉTABLI · MESURER UNE TEXTURE (2026-09-02, chill-meter)
- ⛔ **Sur une compo de N frames, la frame 0 est le DÉBUT de l'animation.** Pour juger un état à son
  maximum (givre plein, remplissage 75 %), rendre la **dernière** : `--frame=104` sur
  `durationInFrames={105}`. Rendre la frame 0 d'une compo « Fill75 » donne un objet à 0 %, et toute
  mesure faite dessus décrit un autre état que celui qu'on croit mesurer.
- ⛔ **Mesurer une TEXTURE = séparation de fréquences** (`sub - gaussian_filter(sub, sigma)`), sur
  des zones de **matière plate**, à l'écart des arêtes, textes et vis. 2 erreurs payées le même
  jour : (1) fenêtre à cheval sur une arête → on mesure le contraste de l'ARÊTE, pas le grain ;
  (2) fenêtre hors du `getbbox()` du contenu → retourne **0.000**, qui se lit à tort comme « pas de
  grain ». ⚠️ Aucun script du repo n'outille ça (`scipy.ndimage` seulement dans `test-groupement.py`)
  — à outiller au 2e cas d'usage réel, pas avant.

### ⛔⛔ POLICE : la pile système SATURE à `fontWeight: 600`
Mesuré (« Confidence » @68px) : `400→340px · 500→352 · **600→363 · 700→363 · 800→363 · 900→363**`.
Chromium n'a que les faces discrètes de Helvetica Neue — au-delà de 600 il n'a plus rien.
⭐ Ce n'est pas un dosage à trouver, c'est **un plafond de fonte** : 3 corrections successives n'y
ont rien changé. FIX : embarquer Inter (`@remotion/google-fonts/Inter`, axe complet, 700→376px).
⚠️ Mais Inter **en 400 est 5 % TROP LARGE** sur le texte clair → **mélanger les deux polices**
(système pour le clair, Inter 700 pour le gras), ne pas basculer toute la scène.

### ⛔ ffmpeg local : 2 limites vérifiées (2026-08-27)
- **Pas de filtre `drawtext`** (`ffmpeg -filters | grep drawtext` → 0). Toute planche annotée passe
  par PIL sur les frames extraites, jamais par ffmpeg.
- **`-t <durée>` arrondit à ±1 frame** — inutilisable pour une comparaison frame à frame.
  → `-frames:v <N>`.

- ⛔ **REMOTION `defaultProps` EST SÉRIALISÉ EN JSON.** Y passer une **référence de composant** la fait arriver `undefined` côté navigateur → **« Minified React error #130 »**, message qui ne nomme ni la prop ni le composant. FIX : wrappers concrets câblés en dur, un par variante (`export const KeyBenchA = () => <KeyBench model={KeyModelA} />`). Vaut pour toute prop non-JSON : fonction, classe, Map, Date. (session 3D, 2026-08-25)
- ⭐⭐ **Export ALPHA (overlay livré à un client, incrustation CapCut/Premiere) — les 4 flags sont TOUS obligatoires** :
  `npx remotion render <Comp> out.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png`
  ⛔ Sans `--pixel-format`, ProRes retombe **silencieusement** en `yuv422p12le` SANS alpha, sans erreur.
  Sans `--image-format=png`, TypeError. **Vérifier après coup, jamais sur parole** :
  `ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt` doit rendre `yuva444p12le`
  (le `10le` demandé sort en `12le`, c'est normal — ce qui compte est le **`a`**). Mesuré : 135 frames 1080p = 53 s.
  ⛔⛔ **Ce test vaut pour ProRes/MOV UNIQUEMENT.** (chill-meter Upwork, 2026-08-22)
- ⛔⛔ **WebM/VP9 : `pix_fmt` NE TESTE PAS l'alpha** — il rend `yuv420p` alors que l'alpha est INTACT
  (mesuré sur 2 fichiers du repo). L'alpha vit dans un BlockAdditional Matroska. Et `ffmpeg -i out.webm … .png`
  l'**aplatit en noir** sans `-c:v libvpx-vp9` EN ENTRÉE (0 % de pixels transparents sans le flag, 86,4 % avec).
  Deux vérifications, le MÊME angle mort ffmpeg, deux fausses confirmations → **3 « fix » sur une commande
  jamais cassée** (2026-08-29). Test : `ffprobe -v error -select_streams v:0 -show_entries stream_tags=alpha_mode
  -of default=nw=1:nk=1 f.webm` → doit rendre `1`. Encodage (aucun flag exotique nécessaire) :
  `ffmpeg -i src.mov -c:v libvpx-vp9 -pix_fmt yuva420p -crf 40 -b:v 0 -vf "scale=640:-2" -an -row-mt 1 out.webm`
- ⛔⛔ **UN RENDU ALPHA S'AFFICHE COMME UN RECTANGLE NOIR** dans les visualiseurs d'images — c'est NORMAL,
  pas un bug. Vécu 2026-08-22 : défaut inexistant signalé à Aziz, code modifié pour rien, agent de diagnostic
  mobilisé. **Avant de conclure à un défaut sur une frame transparente : MESURER**
  (`Image.open(f).convert("RGBA").getpixel((x,y))` → `(0,0,0,0)` = tout va bien).
  Cf. `feedback_transparence-lue-comme-bug.md`.
- **Mapbox / WebGL → `./scripts/render-mapbox.sh <CompositionId> <out.mp4> [args]` OBLIGATOIRE.** `npx remotion render` nu échoue en « Failed to initialize WebGL ». Le script fixe ce qui a été payé : `chrome-headless-shell`, `--gl=angle`, `--concurrency=1`, public-dir slim par symlinks (évite de copier 2,4 Go). **~1,5 fps en 1080p** (mesure 2026-08-22 ; le « ~5 fps » historique était optimiste x3). ⛔ **VIDÉO SEULEMENT** — le script est câblé en dur sur `remotion render` (L41) : pour une **IMAGE FIXE** WebGL/Three.js il ne sert à rien (`--frames=0` échoue en « output directory of the image sequence cannot have an extension »). Utiliser `still` à la main : `npx remotion still src/index.ts <Comp> <out.png> --browser-executable=node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell --gl=angle --image-format=png` (2026-08-25).
- **D3 / SVG pur → `npx remotion render` local classique.** ⛔ `scripts/tools/render-on-vercel.py` = POC ABANDONNÉ, ne JAMAIS l'utiliser (repo Vercel figé au 2026-03-27, 3 compos de démo, ne verra jamais nos compositions).
- **Netteté = `scale=1` uniquement.** Un render 0.4–0.5 est flou par construction et fait douter à tort. Avant de conclure « flou/moche » → 1 frame full HD.
- **Render multi-segments** (`--frames=X-Y`) : `python3 scripts/tools/check-frame-continuity.py 2055-2939 3196-5699 …` AVANT (bornes prévues) ET APRÈS (bornes réelles). Coût de ne pas l'avoir fait : War-Map Sahel 2026-07-01, trous entre segments, narration sautée, détecté après livraison.
- ⛔⛔ **`<OffthreadVideo>` SANS `<Sequence>` lit la frame ABSOLUE de la composition.** Posé à la frame
  1292 d'un plan, un clip de 154 frames est fini depuis longtemps et affiche sa **dernière image FIGÉE** —
  sans erreur, sans warning, une image plausible et immobile qu'on confond avec un gel de rendu.
  → toujours l'envelopper : `<Sequence from={DEBUT} durationInFrames={DUR}>` lui donne son propre
  référentiel (sa frame 0 = début du plan). Même mécanisme que `<Loop>`.
  ⚠️ Piège symétrique : si le plan **gèle** le fond (`const frame = actif ? START-1 : rawFrame`), tout ce
  qui pilote la vidéo se calcule sur **`rawFrame`**, jamais sur `frame` — sinon on fige aussi le clip.
  *Coût : bug livré à Aziz et repéré par lui (Gazoduc A3, 2026-08-18), 1 aller-retour + 1 re-render.*
- ⛔ **Avant tout `<Loop>` sur un clip généré (H3/Seedance/Kling), MESURER son écart de boucle** :
  extraire 1re et dernière frame, diffuser un diff de pixels. Mesuré sur le clip pelleteuse : **7,4 % de
  pixels sautent** → bouclé sur 32,8 s il aurait produit 6,3 raccords visibles. Décision prise : **une
  seule passe + hard cut**. ⛔ Ne jamais « prolonger un peu » un tel plan. Hypothèse par défaut : un clip
  génératif **ne boucle pas**. (`scripts/tools/measure-insert-clip.py` calcule déjà ce ratio.)
- **Chaque clip vidéo importé se mesure INDIVIDUELLEMENT** (`ffprobe -v error -show_entries format=duration …`), jamais par analogie avec un voisin du même dossier (5.875 s vs 5.167 s constatés). Une durée surestimée dans un `<Loop>` gèle l'image sans aucune erreur.

- Fondu enchaîné (`xfade`) : offset **CUMULATIF** + `scale=1920:1080,setsar=1,fps=30` sur chaque entrée (sources hétérogènes) → `memory/client-sim-tests/upwork-chill-meter/PORTFOLIO-MANIFESTE.md` (payé 2026-08-23).
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
- **Après tout changement de STRUCTURE** (raccord, concat, refactor d'un composant partagé) : revérifier la séquence narrative de **chaque scène touchée**, pas seulement le point de couture (vécu CFA : jonction parfaite, scène suivante détruite).
- ⛔⛔ **Un diff de pixels entre DEUX fichiers ré-encodés séparément ne mesure PAS une différence de mouvement — il mesure du BRUIT D'ENCODAGE.** Contrôle qui l'a prouvé (2026-08-18) : la zone de ciel **statique** différait autant (7,25) que la zone du personnage qui gesticule (7,51). J'ai conclu « le mouvement diffère » sur une corrélation de 0,56 ; Aziz a regardé les 2 vidéos et tranché : **quasi-copie, artefact d'origine compris**. Coût : un verdict FAUX présenté à Aziz sur un résultat qui était le succès recherché. → Le diff de pixels ne vaut qu'À L'INTÉRIEUR d'un même encodage (frames consécutives : gel, boucle, saut). Entre 2 fichiers : poser une zone de CONTRÔLE statique, exiger que la zone jugée la dépasse NETTEMENT, sinon ne rien conclure — et faire REGARDER.
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
  ⭐ **Leçon** : corriger une valeur chiffrée = **grep du chiffre dans TOUT le repo** (`.md` ET code ET `.claude/`), jamais fichier par fichier de mémoire. Écrire « corrigé partout » sans avoir greppé fabrique une fiche qui ment — arrivé ici le jour même de la création de cette fiche.
- **Hygiène out/** : `wip/beatN_v3.mp4` → présenté `beatN_V3.mp4` → validé `beatN-FINAL.mp4` → `out/PRET-PUBLICATION/<ep>-FINAL.mp4`. Jamais de fichier à la racine de `out/`, jamais de dossier par date. À validation : promouvoir `versions/` → FINAL, purger `wip/` + `versions/`.

## PRÉSENTER À AZIZ (il est sur mobile)
- **Uploader AVANT de présenter, jamais un chemin local.** ⭐⭐⭐ **ARTIFACT = LE DÉFAUT** (décision Aziz 2026-08-27) : image, page HTML **et vidéo compressée**, tant que la page tient sous **16 Mo**. Je le crée et le mets à jour moi-même, sans script ni hôte externe.
  - **Image · page HTML · vidéo < 16 Mo → ARTIFACT.** ⭐ **1 page par SUJET**, enrichie toute la session (même URL redéployée) — le lien vit dans le **STARTER de reprise du sujet**, ⛔ jamais dans `MEMORY.md`.
  - **Rendu > 16 Mo → Vercel Blob** : `python3 scripts/tools/upload-to-blob.py <fichier> --folder <dossier>`. Réservé à ça (quota à 75 %). Mesuré le 27/08 sur 60 rendus : un **BEAT** fait 2,4 Mo de médiane (100 % passent en Artifact), un **ASSEMBLAGE complet** 230-400 Mo → Blob. La coupure tombe sur la nature du livrable.
  - **Blob ou Artifact indisponible → catbox → Litterbox.** catbox est instable (HTTP 200 + `content-length: 0` silencieux) → **vérifier `curl -sI <url> | grep content-length` avant de donner le lien**. uguu ~3 h de rétention, Litterbox 72 h.
- **Page HTML → ⛔ JAMAIS Vercel Blob ni catbox** (confirmé 2×) → **Artifact**. Repli si la page dépasse 16 Mo (HTML avec vidéos lourdes) : `~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh`. Page autonome (CSS/JS inline, images `data:`).
**Page HTML avec des VIDÉOS → GitHub Pages** (here.now sert aussi les `.mp4` : `video/mp4` +
`accept-ranges` + HTTP 206 vérifiés le 2026-08-21, son API accepte un TABLEAU de fichiers). 3 gotchas
payés : (1) **`workflow_dispatch` n'est déclenchable que si le workflow est sur la branche par défaut** —
sur une branche de feature `gh workflow run` renvoie 404, le 1er déploiement EXIGE le merge ;
(2) **médias lourds hors git, sur une release GitHub**, téléchargés au déploiement (`gallery/fetch-media.sh`),
sinon l'historique gonfle à chaque re-découpage ; (3) **transcodage obligatoire** :
`scale=1280:-2 -crf 28 -preset slow -an -movflags +faststart` = ~320 Ko/5 s au lieu de 80 Mo (facteur 14).
- ⛔⛔ **ENVOI DIRECT D'UNE VIDÉO DANS LE CHAT → TRANSCODER D'ABORD** (vécu 2026-08-30, repro-docs) :
  un rendu Remotion **2000×2000 @ 60 fps** sort en **H.264 niveau 5.1** — refusé par le décodeur
  matériel de son téléphone. Symptôme : « erreur, impossible de lire », **y compris après
  téléchargement**, et **y compris sur un fichier parfaitement sain** (`ffprobe` ne signale rien).
  ⭐ Le fichier n'est PAS corrompu : c'est le PROFIL qui dépasse ce que lit le mobile.
  **Commande à passer avant tout `SendUserFile` d'une vidéo :**
  ```
  ffmpeg -i <src> -vf "scale=1080:-2:flags=lanczos,format=yuv420p,scale=out_range=tv" \
    -c:v libx264 -profile:v main -level:v 4.0 \
    -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -crf 20 -preset slow -movflags +faststart -an <src>-mobile.mp4
  ```
  ⚠️ **`-pix_fmt yuv420p` seul NE SUFFIT PAS** : ffmpeg repropage le `yuvj420p` (full range) de la
  source. Il faut **aussi** `format=yuv420p,scale=out_range=tv` dans le `-vf` ET `-color_range tv`.
  Vérifier après coup : `ffprobe -show_entries stream=pix_fmt,level,color_range` → attendu
  `yuv420p / 40 / tv`. Repère : **niveau ≤ 4.0 passe, 5.1 ne passe pas**. Une pièce du corpus en
  800×854 (niveau 3.2) passait, la même en 2000×2000 non — ce n'est pas la taille du FICHIER
  (930 Ko) qui bloque, c'est la définition + le fps.
  ⭐ **Garder le master haute définition** (référence qualité + base de l'export Lottie) ; le fichier
  mobile est une COPIE de confort, suffixée `-mobile`.
- **Plein format seul d'abord**, jamais une vignette côte-à-côte rapetissée : un render jugé à 540 px a fait « corriger » un problème inexistant en plein écran. Le côte-à-côte sert à MESURER, le plein format à JUGER.
- **Un agent qui rapporte « terminé » n'a pas forcément produit le fichier** : `ls -la` sur le chemin annoncé avant d'accepter le succès. Un agent peut aussi s'arrêter juste AVANT `git commit`.

## SI ÇA RATE 2×
Au **2e échec du même symptôme** (render qui plante, concat qui casse, gel qui revient) : STOP, pas de 3e variante. Déléguer à un agent frais (Opus, `run_in_background`) — **reverse-engineering du repo D'ABORD** (git log/blame, `memory/`, doctrines : le fix existe souvent déjà), `systematic-debugging` ensuite. L'agent RAPPORTE, n'applique pas. Coût documenté : ~40 min perdues sur un blocage API dont le fix était déjà dans le repo.

## ARTIFACT = LE DÉFAUT, BORNÉ À 16 Mo/PAGE (mesures 2026-08-23, conclusion révisée le 08-27)

L'artifact **affiche bien** la video (`data:video/mp4;base64`, lecture confirmee) — ce n'est pas la
lecture qui bloque, c'est le POIDS. **Plafond 16 Mo/page, et le base64 coute x1,34.**
Mesure : 4 showcases = **41,6 Mo bruts -> 55,4 Mo encodes** = impossible.
La version qui passe : `-crf 30 -vf scale=620:-2` -> **0,27-0,56 Mo par video, 2,18 Mo la page**.
-> Calcul avant d'essayer : **~12 Mo de video brute maximum** par page, tout compris.
-> ⭐ Ce plafond n'EXCLUT plus la vidéo, il la BORNE : un **beat** (2,4 Mo de médiane) part en
Artifact, un **assemblage complet** (230-400 Mo) part en Blob. Images et HTML : Artifact d'office.

⚠️ **Une vignette extraite d'une video recadree DEPUIS est perimee** — elle montre l'ancien
decoupage, sans erreur. Test : `[ vignette -nt video ] || echo PERIME`.

⛔ **`--gl=angle` vaut pour TOUT render 3D headless, pas seulement Mapbox** — un `<ThreeCanvas>` sans lui
echoue en `Error creating WebGL context`. Pour un **still** 3D, `render-mapbox.sh` ne sert a rien (cable sur
`remotion render`) : passer `--gl=angle` a la main sur `npx remotion still`. Paye le 2026-08-26.
