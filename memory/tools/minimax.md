# Minimax — Sommaire (scindé en 4 fichiers le 2026-08-13, fichier unique devenu trop long à 2269 lignes)

> **Note** : consulter le fichier ciblé ci-dessous AVANT tout appel Minimax. Ce fichier n'est qu'un
> sommaire de navigation — tout le contenu détaillé vit dans les 4 fichiers pointés.

## MiniMax H3 (vidéo image-to-video)

| Fichier | Contenu |
|---|---|
| **`minimax-h3-styles-tests.md`** ⭐⭐⭐ | Tests de styles visuels (Hand Drawn, Poster Vector — inspirés Higgsfield Explainer), workflow standard 480p→720p→upscale validé, dossier de référence consolidé (2026-08-13). **⛔⛔ LIRE EN PREMIER § "FORMAT DE PROMPT OFFICIEL" (2026-08-14) avant tout nouveau prompt H3 — corrige le format 6-sections ci-dessous.** |
| **`minimax-h3-comfy-cloud.md`** ⭐⭐⭐ | Voie GRATUITE principale (open-weight, inclus abonnement) — guide de prompting officiel, format 6-sections (⚠️ officiel pour l'API hébergée payante, PAS confirmé pour notre node local gratuit — voir correction ci-dessus), node IDs, tous les tests réels (Sonjata, NoteShield, Flowdesk, Pêcheur, Mariama Bâ...). **Toujours essayer en premier.** |
| `minimax-h3-api-fal.md` | Voie payante fal.ai (~1.30$/5s) — fallback SEULEMENT si Comfy Cloud down/saturé |

## MiniMax Music + TTS + Voice Clone

| Fichier | Contenu |
|---|---|
| `minimax-music-tts.md` | Musique (`fal-ai/minimax-music/v2.6`), TTS (`fal-ai/minimax/speech-2.8-hd`), Voice Clone — domaine séparé de H3, aucun rapport avec la génération vidéo |

## Repère rapide

- **Tester un style visuel H3** (Hand Drawn, Poster Vector, Whiteboard Doodle...) → `minimax-h3-styles-tests.md`
- **Générer une vidéo depuis une image de référence** (mécanique R2V/T2V, prompt structuré) → `minimax-h3-comfy-cloud.md`
- **Comfy Cloud indisponible** → `minimax-h3-api-fal.md`
- **Musique de fond ou narration TTS** → `minimax-music-tts.md`
