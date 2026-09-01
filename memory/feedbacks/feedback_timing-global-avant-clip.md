---
name: Ne pas construire une scene isolee avant d'avoir le timing global
description: Regle de process : decouper le script en scenes mappees a l'audio AVANT de produire des clips ou dialogues
type: feedback
---

Migré depuis auto-memory 2026-08-31.

Ne JAMAIS commencer a produire un clip, un dialogue ou une image pour une scene precise d'un Short AVANT d'avoir le `timing-{projet}.ts` complet qui mappe chaque phrase de la narration a des frames exactes.

**Why:** le 2026-04-12/13 on a produit un clip insulte (5s) + dialogue Matrone (6.3s) + tente un assemblage Remotion AVANT d'avoir mesure le timing de la narration complete (Sonjata/Soundjata). Resultat : la scene ne rentrait pas dans le creneau audio, le lip-sync ne fonctionnait pas, et il a fallu revenir en arriere, archiver les assets premature, transcrire la narration via Whisper, creer timing-{projet}.ts, et recommencer proprement. Perte de temps significative.

**How to apply:** pour tout nouveau Short, suivre l'ordre :
1. Script valide par Aziz
2. Audio ElevenLabs de la narration COMPLETE
3. Transcription Whisper OpenAI (`scripts/tools/transcribe-openai.py`)
4. Creer `timing-{projet}.ts` avec frames exactes pour chaque scene
5. Decouper en actes/sub-scenes
6. SEULEMENT APRES : decisions par scene (clip Seedance / Remotion pur / image + zoom)
7. Produire les assets un par un selon le plan
