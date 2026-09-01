---
name: Storyboard colore i2v — regles d'execution
description: Feedbacks sur l'execution des storyboards colores paper-craft en image-to-video. Une erreur de contenu de storyboard n'est pas une erreur technique. Identifier panels explicitement dans le prompt.
type: feedback
---

Migré depuis auto-memory 2026-08-31 (feedback 2026-04-20, session 3 Sonjata Papercraft).

Seedance comprend la structure (N panels = N shots avec cuts). Les erreurs viennent du CONTENU du storyboard et de la CLARTE du prompt, pas de la technique.

**Why** : test 3 panels Scene 3 — Seedance a fait 3 shots avec les bons cadrages (wide, medium, close-up mains) mais le personnage etait debout au lieu de a genoux dans le shot 2. C'est parce que le storyboard le montrait deja debout.

**How to apply** :
1. Contraintes narratives dans CHAQUE panel du storyboard (si "jamais debout" = le dessiner a genoux dans TOUS les panels)
2. Identifier positions : "PANEL 1 is the LEFTMOST image, PANEL 2 is CENTER, PANEL 3 is RIGHTMOST"
3. Rappeler les contraintes dans le prompt Seedance : "The boy NEVER stands — KNEELING in ALL shots"
4. Verifier le storyboard genere AVANT de lancer Seedance — le contenu du storyboard = le contenu du clip

Voir aussi la découverte R-PC16 (storyboard colore + i2v, remplace reference-to-video en échec)
documentée dans `memory/tools/seedance-storyboard-technique.md` (repo) et
`memory/tools/gemini.md` (regen complète > édition chirurgicale de panel).
