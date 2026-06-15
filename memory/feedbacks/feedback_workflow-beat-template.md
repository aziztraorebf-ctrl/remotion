---
name: workflow-beat-template-premiere-validé
description: Workflow Beat Mapbox avec templates catalogue — validé 2026-06-02. Satisfaisant dès le premier render.
metadata:
  type: feedback
---

**Règle :** Choisir le template catalogue AVANT d'écrire une ligne de code. Remplir le storyboard 7 champs (Playbook) avec le template choisi, valider avec Aziz, puis coder.

**Why:** Beat 0 Maroc a été satisfaisant dès le premier render (au lieu de 5-8 itérations). La différence = template SweepRevealTerritory choisi à l'avance vs code custom qui demandait des refontes complètes.

**How to apply:**
1. Storyboard 7 champs → choisir template catalogue
2. Coder le template avec les bonnes props
3. Render → auto-review Claude → appliquer les 1-2 premiums évidents (SFX volumes, karaoké complet, fill-pattern)
4. Envoyer à Gemini avec les premiums déjà intégrés (objectif : partir de 7.5/10 minimum)
5. Appliquer les suggestions Gemini priorité HAUTE uniquement
6. Valider

**Karaoké :** Toujours utiliser MAROC_WORDS (tous les mots) filtrés par timestamps — jamais WORD_ANCHORS seuls.
**SFX volumes doctrine :** cinématique 0.50-0.55 · UI 0.40-0.45 · musique fond 0.10-0.14.
