---
name: Verify memory content before following it
description: Memory files can contain inversions or errors — Claude must verify a claim experimentally when the claim is unusual or conditions a paid operation
type: feedback
---

Migré depuis auto-memory 2026-08-31 (feedback 2026-04-13).

**Règle** : quand Claude consulte un fichier memory et que l'information semble **contre-intuitive** ou va **conditionner une opération payante** (appel API, génération, etc.), Claude doit vérifier la claim **expérimentalement** avant de s'appuyer dessus. Un fichier memory peut contenir une inversion ou une erreur accumulée au fil du temps.

**Why:** 2026-04-13, une memory affirmait qu'un modèle Gemini = édition chirurgicale et l'autre = régénération — c'était l'inverse. Un appel Gemini Pro Image ($0.15) en édition chirurgicale a été lancé sur cette base, résultat = image quasi-identique à la source (le modèle refuse de modifier si source fournie sans le bon flag/modèle). Passage au bon modèle = modifications appliquées. La memory était inversée, elle a été suivie aveuglément.

**How to apply:**
- Avant un appel API payant qui s'appuie sur une règle memory contre-intuitive : faire un petit test peu cher ou demander à Aziz de confirmer
- Si un résultat d'API ne correspond pas à ce que la memory prédit : flag et suspecter la memory, pas le modèle
- Après correction d'une erreur memory : toujours éditer le fichier memory pour empêcher que l'erreur se propage
- La règle s'applique aussi aux recommandations stratégiques basées sur la memory — ne pas abandonner une approche sur la base d'une memory non vérifiée

Cette règle est un précurseur direct de la règle actuelle du CLAUDE.md § Vérification avant affirmation,
cas (4) — vérifier le verdict d'un agent/modèle dans le code réel avant de le présenter comme un fait.
