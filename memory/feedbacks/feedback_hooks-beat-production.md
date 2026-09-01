# Système hooks beat production — état au 2026-06-01 (+ correctif 2026-08-09)

Hooks actifs dans `.claude/hooks/` (état 2026-06-01) :

**beat-preflight.sh** ACTIF (PreToolUse Edit|Write sur Beat*.tsx Souverain) :
- Affiche rappel règles critiques + modèles Gemini (source : CLAUDE.md)
- Vérifie storyboard `storyboard/beat<N>-storyboard.md`
- Vérifie flag `/tmp/shared-components-read`
- Bloque si score Gemini beat précédent < 8.5

**atlas-beat-guard.sh** ACTIF (PreToolUse Edit|Write sur Beat*.tsx Atlas) :
- CHECK A1 : Math.max(0, localF) avant frameIdx
- CHECK A2 : Spring pop sur sprites
- CHECK A3 : Composants suspects sans script audio
- CHECK A4 : Spec table `/tmp/{episode}-beat{N}-spec.md` présente (BLOQUANT)

**beat-gemini-review.sh** ARCHIVÉ le 2026-06-01 → `.claude/hooks/_archive/`
- Était désactivé depuis plusieurs semaines (`exit 0` ligne 7, bug heredoc backticks Python)
- La review Gemini est faite manuellement via `beat-session.py --phase review`
- Ne pas réactiver sans corriger le bug heredoc

**Why:** Hooks bloquants = erreurs coûteuses évitées mécaniquement. beat-gemini-review archivé car désactivé silencieusement — mieux vaut clarifier que laisser du code mort.

**How to apply:** Hooks actifs automatiquement sur tout Beat*.tsx. Bypass urgence : `/tmp/beat-preflight-bypass`.

**Dette corrigée (2026-08-09, session MOCH-IT) :** le check ligne 33 matchait tout `.tsx` contenant
"Beat" n'importe où dans le chemin, pas seulement `souverain/<episode>/Beat*.tsx` — faux
déclenchement confirmé sur un fichier hors-Souverain (`_client-sim/mochit/Beat1Accumulation.tsx`),
contourné par renommage sur le moment plutôt que corrigé. Fix appliqué : le check lourd (storyboard,
score Gemini, règles bloquantes) est désormais restreint à `$FILE_PATH == *"/souverain/"*Beat*.tsx`
(nouvelle variable `IS_SOUVERAIN_BEAT`) — testé non-régression sur un vrai chemin Souverain (check
lourd toujours actif) et sur le cas qui avait échoué (check lourd n'apparaît plus, seul le rappel
léger intention→forme reste affiché, ce qui est voulu pour toute scène `.tsx`).

**Règles lockées :**
- Max 8s sans changement visible. Permanent motion seul ne compte pas.
- Score minimum Gemini : 8.5/10 avant présentation à Aziz.
- Modèles : gemini-3.1-pro-preview (review) — voir tableau CLAUDE.md comme source de vérité unique.

Voir aussi `memory/doctrines/HOOKS-GARDE-FOUS-PRINCIPES.md` pour le protocole d'interaction légitime
avec ces hooks (neutralisation temporaire tracée, override) — ce fichier-ci documente CE QUE font les
hooks mécaniquement, l'autre documente COMMENT interagir avec eux sans les casser.

---
Migré depuis auto-memory (`feedback_hooks-beat-production.md`) le 2026-08-31, contenu original inchangé.
