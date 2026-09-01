# Gemini V2 upgrade workflow — templates expérimentaux vers scènes premium

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-21). Workflow pour upgrader un template
> fonctionnel/abstrait en scène premium contextualisée, en utilisant Gemini comme creative director
> (pas générateur from scratch).

Ne pas demander à Gemini d'inventer un template générique. Lui apporter un v1 fonctionnel + le contexte narratif précis + les previews existants, et lui demander d'améliorer.

**Why:** Un template expérimental est fonctionnel mais abstrait. Le gap "fonctionnel → premium" se comble par itération avec Gemini en mode creative director, pas en mode invention. Validé par Aziz 2026-05-21.

**How to apply:** Avant de coder une scène premium pour un épisode :
1. Identifier le template le plus proche dans le catalogue de composants (previews)
2. Envoyer à Gemini (modèle vision courant, cf `scripts/tools/gemini_models.py`) :
   - Storyboard textuel de la scène cible
   - Images previews (URLs hébergées) du template existant
   - Code source du template (ou extrait clé)
   - Question : "Comment transformer ça en quelque chose de 2x plus premium pour CE contexte précis ?"
3. Gemini retourne `code_values` ciblés (timings, proportions, éléments additionnels)
4. Coder strictement sur ces valeurs — pas de devinettes

Analogie : motion designer (template v1) → creative director (Gemini) → itération → scène finale.
Différence clé avec un prompt générique : contexte narratif réel, pas invention libre.

---

## Workflow complémentaire — Gemini-as-storyboarder (validé conceptuellement 2026-05-21)

Pour la pré-production d'un épisode entier (pas juste upgrader un template) :

1. Prendre le script du chapitre/épisode
2. Joindre un catalogue condensé des templates disponibles (8 lignes/template max)
3. Demander à Gemini :
   - De sélectionner les templates beat par beat
   - De justifier chaque choix narratif (pourquoi cette mécanique pour ce propos)
   - De générer un storyboard image (1 frame clé par beat, style esquisse analytique)
4. Valider → Gemini retourne JSON code_values → coder avec les vraies données

**Avantage clé :** Gemini choisit sur la *sémantique* des mécaniques, pas sur l'esthétique. Un catalogue texte qui décrit "révèle ce qui est caché sous la surface" ou "montre qui s'oppose à qui" → meilleur matching narratif qu'envoyer des images de previews seules.

**⚠️ Note 2026-08-31** : `memory/CATALOGUE-GEMINI.md` référencé à l'époque n'existe plus tel quel
dans le repo actuel — chercher son équivalent courant (probablement `src/projects/_shared/COMPOSANTS-INDEX.md`
ou un catalogue Atlas dédié) avant de réutiliser ce workflow.
