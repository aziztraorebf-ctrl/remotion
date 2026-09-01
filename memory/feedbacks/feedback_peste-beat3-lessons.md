# Leçons Beat3 Peste 1347 — règles Atlas

> Migré depuis auto-memory 2026-08-31 (session 2026-05-17). Règles issues de 10 versions et ~15
> renders sur Beat3 Peste 1347. `doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` couvre le principe R2
> (garde d'apparition `Math.max(0, localF)`) en une ligne mais pas le détail ni les 5 autres règles.

**R1 — durationInFrames = durée beat seul dans Root.tsx**
Render standalone avec `--frames=BEAT_START-BEAT_END`. Sans ça : N secondes de noir au début.
**Why:** un beat avait `durationInFrames={1223}` (durée totale épisode) au lieu de `509` (durée beat). 23s de noir à chaque render.
**How to apply:** Vérifier Root.tsx avant le premier render de tout nouveau beat.

**R2 — Math.max(0, localF) avant tout calcul d'index de frame sprite**
`Math.floor(Math.max(0, localF) / FRAMES_PER_TICK) % frameCount` — jamais sans le Math.max.
**Why:** localF négatif (frames avant le beatStart) produit un index négatif en JS → chemin `frame_-14.png` → icône placeholder grise. Aucun console.error.
**How to apply:** Pattern obligatoire dans tout composant sprite animé équivalent (cf `doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` qui nomme la "garde d'apparition" mais sans ce détail).

**R3 — Vérifier pixels RGB de l'asset AVANT d'intégrer**
`python3 -c "from PIL import Image; img=Image.open('asset.png'); print(img.getpixel((64,64)))"` — si RGB < 80 sur 3 canaux = trop sombre, régénérer avec "vibrant warm colors".
**Why:** un asset pixel art palette sombre (R:67 G:62 B:49) quasi-invisible sur fond océan bleu marine. Découvert seulement au render après intégration.
**How to apply:** Inspection systématique avant tout `cp asset.png public/...`

**R4 — Élément visuel doit être dans le script audio — sinon beat suivant**
Avant de coder un asset visuel, vérifier qu'il est nommé dans le script du beat.
**Why:** des rats introduits dans un beat, visuellement intéressants mais absents du script du beat (élément narratif prévu pour le beat suivant). 6 itérations perdues à raffiner puis supprimer.
**How to apply:** Grep du script du beat avant de coder tout nouvel élément.

**R5 — Image de référence i2i obligatoire pour assets PixelLab ville/objet**
Utiliser un asset validé existant comme ref plutôt que génération from scratch.
**Why:** une ville générée avec ref i2i = parfait au premier coup. Une autre sans ref = palette sombre, régénération forcée.
**How to apply:** Toujours passer `background_image` à `create_map_object`.

**R6 — Tableau de spécification AVANT tout code de beat**
Phases narratives / frames audio-ancrées / coords stations / slots cartouches — tout calculé avant d'ouvrir le fichier tsx.
**Why:** Session avec tableau = 3-4 renders. Session sans tableau = 10 renders.
**How to apply:** Obligatoire en début de session pour chaque nouveau beat. Format : tableau phases A-D avec frames absolues calées sur forced-alignment.
