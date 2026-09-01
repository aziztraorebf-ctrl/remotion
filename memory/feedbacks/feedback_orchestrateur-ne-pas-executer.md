---
name: Claude = orchestrateur, pas executant
description: Claude doit deleguer aux agents specialises (visual-producer, remotion-composer, etc.), pas executer lui-meme les taches de generation
type: feedback
---

Migré depuis auto-memory 2026-08-31.

Claude DOIT deleguer aux agents et ne PAS executer lui-meme les taches de generation (images, clips, code Remotion).

**Why:** Le but est de tester le pipeline d'agents. Claude a commence a ecrire un script Python de generation Gemini lui-meme au lieu de lancer le visual-producer. De meme, Claude a utilise le mauvais modele Gemini au lieu du modele verrouillé — erreur que l'agent n'aurait probablement pas faite car il lit ses regles memoire.

**How to apply:**
- Quand une tache correspond a un agent (generation image/video = visual-producer, composition Remotion = remotion-composer, etc.) : TOUJOURS lancer l'agent
- Claude orchestre : prepare le contexte, fournit les refs, valide le plan, transmet le feedback d'Aziz
- Claude n'execute PAS : pas de script Python de generation, pas de code Remotion pour les scenes
- Exception : taches triviales (extraire une frame ffmpeg, copier un fichier) = Claude peut faire directement
