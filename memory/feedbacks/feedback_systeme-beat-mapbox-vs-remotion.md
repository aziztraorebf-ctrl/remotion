# DEUX systèmes de production beat scorés existent — Mapbox ET Remotion

Deux systèmes de production beat **scorés et disciplinés** existent. Quand Aziz dit "coder un beat" ou "Short", lancer le bon système — NE PAS improviser une boucle de review Gemini ad hoc.

**Beat MAPBOX** (carte animée, getCam, overlays) → `scripts/mapbox-session.py`
- Validation : `scripts/tools/gemini-mapbox-review.py` (JSON scoré, seuil 8/10)
- Phases : storyboard (Production Brief validé Aziz) → code → self-review 12 critères Mapbox → review Gemini → corrections → upload

**Beat REMOTION/Tailwind** (graphisme, data-viz, texte, image) → `/beat` = `scripts/beat-session.py`
- Validation intégrée, seuil 19/23 puis review Gemini
- Phases : breakdown → code → self-review 23 critères → review → corrections → upload

**Why:** Le 2026-06-01, Claude a improvisé une boucle de 4 appels Gemini sur un beat Mapbox alors que le système discipliné (max 2 appels, storyboard validé en amont) existait déjà. Aziz a dû se rappeler lui-même que le système existait — signe d'un problème de routage, pas une faute de Claude. Routage CLAUDE.md corrigé : 2 lignes distinctes Mapbox vs Remotion, chacune nommant son système + sa discipline.

**How to apply:**
1. Aziz dit "beat/Short Mapbox" → lancer `mapbox-session.py`, ne pas réfléchir, c'est le système.
2. Aziz dit "beat Remotion/graphisme" → lancer `/beat`.
3. La règle MAX 2 appels Gemini est sacrée : le self-review (cocher les critères SOI-MÊME) sert à valider avant de "dépenser" l'appel Gemini. 4 appels = anti-pattern.
4. Le storyboard/Production Brief validé par Aziz EN AMONT = ce qui permet d'atteindre l'optimum en 2 passes au lieu de 4.
5. Les deux systèmes sont modifiables — enrichir les checklists au fil des épisodes.

Cette table de routage (quel système lancer) vit aussi dans `ROUTAGE.md` (§ Coder un beat Souverain
MAPBOX / REMOTION) — ce fichier-ci garde la LEÇON derrière la règle (l'incident du 2026-06-01, la
discipline MAX 2 appels Gemini) que ROUTAGE.md ne détaille pas.

---
Migré depuis auto-memory (`feedback_systeme-beat-mapbox-vs-remotion.md`) le 2026-08-31, contenu original inchangé.
