---
name: Character sheets canoniques AVANT production
description: Generer les character sheets de tous les personnages recurrents AVANT de commencer la production des scenes. Evite les incoherences vestimentaires (torse nu vs tunique).
type: feedback
---

Migré depuis auto-memory 2026-08-31.

Generer les character sheets (3 vues + expressions) pour tous les personnages recurrents AVANT de produire les scenes. Les passer en input Gemini a CHAQUE generation d'image.

**Why:** Session 2026-04-20, Sonjata — Sunjata enfant variait entre torse nu et tunique selon les scenes. Le character sheet a fige le design canonique (torse nu + pagne rouge) et elimine les incoherences.

**How to apply:**
1. En debut de production, lister les personnages recurrents (ceux qui apparaissent dans 3+ scenes)
2. Generer un character sheet pour chacun via Gemini (style-ref + prompt detaille)
3. Sauvegarder dans `refs/` du projet
4. Mettre a jour le manifest avec les chemins
5. Passer le character sheet en input a CHAQUE image Gemini ou le personnage apparait
6. En paper-craft, les personnages secondaires sont interchangeables — pas besoin de sheets pour eux
