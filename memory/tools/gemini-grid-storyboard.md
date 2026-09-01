# Gemini Grid Storyboard — Technique de production batch YouTube Shorts

> Migré depuis auto-memory 2026-08-31 (analysée 2026-03-29). Réserve pour industrialisation
> future — non utilisée actuellement, technique concurrente au pipeline frame-chaining actuel.

## Source
- **Video** : "FAST AI Storyboarding: Generate 9-Frame Cohesive Grids in Gemini" (AI Mind Revolution, 29 mars 2026)
- **URL** : https://youtu.be/g1PqsY6x-UQ

## Le concept

1 prompt Gemini = 1 grille 3x3 (9 frames coherentes) + 9 prompts texte pour video.
Les 9 frames servent de start frames pour Seedance/Kling.
Les 9 prompts texte sont reutilisables directement comme prompts video.

## Le prompt structure (reconstruit depuis la video)

```
Storyboard Prompt:
A professional 3x3 storyboard grid showing 9 sequential cinematic frames.
Frame 1 must be a direct visual continuation of the attached reference image.

Story:
The sequence unfolds as follows: [VOTRE HISTOIRE EN 4-BEAT]

Layout & Composition:
- Grid Specification: Generate a single image containing a perfect 3x3 storyboard grid
  (9 frames total). Each frame must be separated by a thin, clean white border.
- Dynamic Cinematography: Vary the camera's perspective across the 9 frames.
  Use a mix of wide establishing shots, medium character shots, and tight close-ups.
  Avoid repeating the same composition or "camera" height in consecutive panels.
- Lens Accuracy: Maintain a consistent depth of field that matches the reference image.
- Consistency: Maintain character appearance, lighting, and color palette throughout.

Output:
- The 3x3 grid image
- For each frame (1-9), provide a detailed text prompt describing the scene,
  camera angle, lighting, and action — usable as a video generation prompt.
```

## Pipeline complet pour Shorts 60s en batch

```
1. Image d'ancrage (personnage/sujet) — Recraft ou Gemini
2. Script 4-beat : Introduction -> Incident -> Climax -> Resolution
3. Prompt grille Gemini (mode Thinking, pas Fast) = 9 frames + 9 prompts
4. Extraction frame par frame via Gemini ou Google Flow (Nano Banana)
5. Chaque frame → Seedance/Kling image-to-video (~6-7s par frame)
6. 9 clips x 6-7s = ~60s de Short
7. Assembler dans Remotion : transitions + voix-off ElevenLabs + musique
```

## Tips du créateur

- **Mode Thinking obligatoire** (pas Fast) — meilleure cohérence entre les 9 frames
- **Structure 4-beat** pour l'histoire : sinon Gemini ne termine pas la séquence narrative
- **Image d'ancrage haute qualité** : visage + vêtements visibles = meilleure cohérence
- **Extraction via Google Flow** (Nano Banana) = plus rapide et sans limite sur compte Pro
- **Les prompts texte générés = point de départ** — les affiner avant de les envoyer à Seedance
- Ne pas écrire une histoire trop complexe — garder concis pour que la grille reste cohérente

## Pourquoi on ne l'utilise PAS actuellement (discussion Aziz, mars 2026)

- Le pipeline actuel fonctionne en **frame chaining** (dernière frame clip N → edit Gemini → start frame clip N+1). Une grille 3x3 ne peut pas capturer cette dépendance séquentielle.
- Notre niveau de qualité/contrôle est supérieur à ce que la grille produit.
- La grille est un outil de **prototypage rapide** ou de **production en volume** — pas de précision.

## Quand l'utiliser (cas d'usage futur)

- **Production en volume** : chaîne TikTok/Instagram/YouTube Shorts, 3-5 vidéos/semaine
- **Série "Un fait historique par jour"** ou micro-contenus éducatifs
- **Prototypage rapide** : voir à quoi ressemblerait un Short AVANT d'investir des crédits
- **Volume over precision** : acceptable quand la vitesse prime sur le contrôle
