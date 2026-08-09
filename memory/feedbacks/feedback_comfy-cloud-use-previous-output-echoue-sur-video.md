---
name: comfy-cloud-use-previous-output-echoue-sur-video
description: L'outil MCP use_previous_output(prompt_id) du serveur Comfy Cloud accepte sans erreur un output VIDÉO déjà généré comme input d'un autre template, mais ne câble PAS réellement le flux — le résultat est le clip d'exemple par défaut du template cible, pas le clip demandé. Aucune méthode fiable trouvée pour chaîner un output vidéo Comfy Cloud vers un 2e template.
metadata:
  type: feedback
---

## Contexte

Tentative (2026-08-09) de réutiliser un clip vidéo H3 déjà généré comme input d'un template d'upscale
vidéo (`utility_seedvr2_3b_int8_upscale_video`, node LoadVideo id 73) via
`use_previous_output(prompt_id)`.

## Why

`use_previous_output` est conçu pour des **outputs IMAGE**, pas vidéo (confirmé par le comportement
observé, pas trouvé documenté explicitement ailleurs). L'appel réussit SANS ERREUR et accepte un nom
de fichier `.mp4` — mais ne câble pas correctement le flux vidéo dans le graphe du workflow cible. Le
résultat livré était le clip d'exemple PAR DÉFAUT du template (une pub "Confy" hors-sujet), avec un
mauvais ratio (portrait 1080x1440 au lieu de l'horizontal source demandé) et une mauvaise durée (5.04s
au lieu des 8s attendus) — signe que le node LoadVideo n'a jamais reçu la bonne valeur malgré l'absence
d'erreur API.

L'autre outil MCP disponible, `upload_file`, **refuse explicitement les .mp4** (n'accepte que
jpg/jpeg/png/webp/gif) — donc pas de contournement immédiat par ce biais non plus.

## How to apply

- **Ne PAS utiliser `use_previous_output` pour chaîner un output vidéo Comfy Cloud vers un autre
  template** (upscale ou autre) — le "succeeded" sans erreur ne garantit rien sur le contenu réel,
  cohérent avec le pattern déjà documenté dans `memory/tools/minimax.md` ("un run succeeded ne
  garantit pas que le contenu correspond aux inputs").
- **Piste non explorée à tester avant de retenter** : héberger la vidéo source ailleurs (Vercel Blob,
  déjà l'outil d'upload standard du projet — `scripts/tools/upload-to-blob.py`) et vérifier si le
  template cible accepte une **URL externe** en entrée plutôt qu'un `prompt_id`/nom de fichier interne
  Comfy Cloud.
- Si un chaînage vidéo→vidéo entre templates Comfy Cloud redevient nécessaire, ne pas repartir sur
  `use_previous_output` sans avoir d'abord confirmé (doc officielle Comfy Cloud ou test isolé à faible
  coût) qu'il supporte les outputs vidéo — à ce jour, aucune preuve qu'il le fasse.
