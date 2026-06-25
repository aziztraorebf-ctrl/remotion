# Upload VIDÉO complète à Gemini 3.1 Pro = FIABLE

> Validé 2026-06-16, re-confirmé 2026-06-18 (breakdown du template journal 3D).

## Le fait
Uploader une **vidéo MP4 complète** à `gemini-3.1-pro-preview` via la Files API fonctionne et est fiable. Gemini analyse réellement le MOUVEMENT / rythme / transitions / SON — supérieur aux frames figées pour un breakdown premium (caméra, easing, timing, mécanique 3D).

- Le bug du 13 juin (« répond sans voir la vidéo ») est **résolu**.
- Toujours tester la fiabilité avant un usage critique : `scripts/tools/gemini-video-upload-test.py`.
- Gemini reste **SIGNAL, jamais juge** : vérifier chaque point du breakdown contre le réel avant d'appliquer.

## Comment faire (pattern éprouvé)
Script générique : `scripts/tools/gemini-vision-breakdown.py` accepte une vidéo en `--image` (la Files API gère image ET vidéo) :
```
python3 scripts/tools/gemini-vision-breakdown.py \
  --image <video.mp4> --prompt-file <prompt.txt> --output <out.json>
```
Le script `client.files.upload()` puis attend l'état `ACTIVE` (vidéo = quelques secondes de processing) avant `generate_content`. Validé sur une vidéo de 39s (ACTIVE en 4s).

## Cas d'usage validés
- Breakdown mécanique d'un template motion (ex : journal 3D flythrough → `out/_r-and-d/BREAKDOWN-JOURNAL-REF.json`).
- Review d'un beat rendu (mouvement/synchro/son).

Liens : [[openrouter-gpt-image-et-breakdown]] (comparatif Gemini vs GPT-5.5 sur breakdown) · [[feedback_gemini-video-review-pattern]] (Gemini analyse MP4).
