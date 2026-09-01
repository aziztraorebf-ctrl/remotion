# Pipeline cover B — recadrage Gemini 16:9 vers 9:16

> Migré depuis auto-memory 2026-08-31 (créé 2026-07-31). Complète `memory/tools/postiz.md` (qui
> documente le CONCEPT coverB et le concat ffmpeg) avec la MÉTHODE de fabrication du cover B via
> Gemini image-to-image (recomposition de ratio, pas génération from scratch).

Pour un cover B de Short (image insérée ~0.5s en tête de vidéo, cf `memory/tools/postiz.md`
section coverB), on peut recomposer le thumbnail 16:9 DÉJÀ VALIDÉ de la vidéo longue en 9:16 via Gemini
image-to-image (**`IMAGE_MODEL_HQ`**, `gemini-3.1-flash-image` — un cover B est PUBLIÉ TEL QUEL en tête de vidéo et doit tenir en 1080x1920, au-delà du plafond 1K du Lite ; ⛔ importer depuis `scripts/tools/gemini_models.py`, jamais en dur), plutôt que d'en composer un nouveau from scratch.

**Pourquoi** : demande observée le 2026-07-31 sur des chaînes similaires (Instagram/Shorts).
Résultat validé sur 3 thumbnails testés (Sénégal, AES, CFA) : texte français exact avec accents
corrects ("PÉTROLE", "SÉNÉGALAIS"), même palette/typo que la source, composition verticale
lisible (titre en haut, élément focal agrandi au centre, éléments secondaires redistribués en
haut/bas plutôt qu'à côté). Coût ~0.04$/image, quelques secondes par appel.

**Ne PAS confondre avec le principe** qu'une miniature ne se GÉNÈRE jamais par IA (cf
`memory/doctrines/PACKAGING-YOUTUBE.md` § miniature composée SVG) — celui-là s'applique à la
CRÉATION initiale d'un thumbnail. Ici on RECOMPOSE un ratio à partir d'un design déjà validé par
jury/Aziz, ce qui est un cas différent : le contenu (texte, formes, couleurs) est figé, seule la
disposition spatiale change.

**Comment** : script `scripts/tools/gemini-cover-vertical.py` (⚠️ vérifier existence, créé
2026-07-31). Prend `--input` (PNG 16:9), `--output`, `--brief` (un brief PAR SUJET, décrivant la
composition source et comment la restacker en vertical — PAS de brief générique, chaque sujet a sa
propre disposition d'éléments à préserver).

**Gotchas** :
- Sortie API Gemini en ~768x1376 (pas du 1080x1920 exact, ratio légèrement différent) ET en JPEG
  réel malgré l'extension `.png` écrite. Toujours upscaler explicitement en 1080x1920 avant usage :
  `ffmpeg -i in.png -vf "scale=1080:1920:flags=lanczos" out.png`.
- Le brief DOIT lister explicitement quels éléments de la source existent et comment les restacker
  (ex: "titre en haut, objet focal au centre agrandi, éléments secondaires redistribués au-dessus et
  en-dessous du centre") — un brief vague produirait une réinterprétation plutôt qu'une recomposition
  fidèle.

## Pipeline complet cover B

1. Recadrer le thumbnail long en vertical (ci-dessus).
2. Upscale 1080x1920.
3. Incruster en tête du Short avec fade + concat (voir `memory/tools/postiz.md` pour la commande
   ffmpeg complète — ⛔ JAMAIS `-f concat` (demuxer), toujours le filtre `concat=`).
4. Vérifier durée finale = durée originale + 0.5s (`ffprobe`), vérifier absence de gel par hashing
   1fps sur toute la durée (pas juste des frames isolées).
5. Uploader les PNG verticaux pour revue visuelle Aziz AVANT de considérer le cover B final — Aziz
   veut TOUJOURS voir l'image avant validation, même pour un test.
