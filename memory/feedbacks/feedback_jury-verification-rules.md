# Règle : vérifier les affirmations chiffrées du jury avant d'agir

**Contexte :** Workflow Jury Hybride creatif (étape 7.5 du pipeline Atlas).

## La règle

Quand un LLM du jury (GPT-4o, Grok, Gemini-3-flash-preview, Kimi) émet une **alerte critique basée sur un chiffre, une règle de plateforme, une limite technique, ou une politique commerciale**, Claude DOIT vérifier l'info via WebSearch AVANT de proposer une action correctrice à Aziz.

**Why:** Les LLMs ont des knowledge cutoffs différents et souvent dépassés. Cas réel Shaka Zulu (2026-05-02) : Gemini-3-flash-preview a sorti une alerte critique "YouTube Shorts limité à 60s, ton 150s sort du Shorts Feed". WebSearch a révélé que YouTube a étendu Shorts à 3 minutes depuis le 15 octobre 2024. L'alerte était basée sur data stale → aurait poussé Aziz à découper son script en 3 Shorts inutilement (1 journée de travail perdue).

**How to apply:**
- Déclencheurs concrets : durée max plateforme, RPM/monétisation, formats acceptés, limites API, politiques de contenu, prix d'outils
- Pas applicable aux jugements créatifs (composition visuelle, narration, esthétique) — ces points restent du débat éditorial
- Procédure : WebSearch avec année courante explicite ("YouTube Shorts max length 2026") → comparer avec l'affirmation du jury → si divergence, présenter la vraie info à Aziz avant toute décision
- Annoncer à Aziz la vérification : "Tu as raison de douter, je vérifie via WebSearch avant de trancher"

**Cas typiques où vérifier :**
- "X plateforme limite à Y secondes/minutes"
- "Format Z n'est pas supporté"
- "Outil W ne permet pas de faire V"
- "Politique de monétisation exige X"
- "API Z coûte $Y par appel"

**Cas où NE PAS vérifier (perte de temps) :**
- Critiques de composition visuelle ("le hook manque d'impact")
- Suggestions techniques internes au stack ("utiliser feDisplacementMap")
- Recommandations narratives ("S4 est la scène la plus risquée")

Distinct de `doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` § FACT-CHECK 3 NIVEAUX (qui porte sur le fact-check
factuel du TEXTE final du script) — cette règle-ci porte spécifiquement sur les affirmations chiffrées/
techniques/plateforme émises PAR le jury créatif lui-même, à vérifier avant d'agir dessus.

---
Migré depuis auto-memory (`feedback_jury-verification-rules.md`) le 2026-08-31, contenu original inchangé.
