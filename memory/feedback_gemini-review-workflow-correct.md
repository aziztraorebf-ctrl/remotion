---
name: gemini-review-workflow-correct
description: Workflow correct pour review Gemini post-render — appel unique, JSON actionnable avec valeurs de code, sans maxOutputTokens
metadata:
  type: feedback
---

Ne JAMAIS limiter `maxOutputTokens` sur les appels Gemini review — cela tronque le JSON et force des re-appels coûteux.

**Why:** Session Beat5 Silicon Savannah : 4 appels Gemini gaspillés (2 pour output tronqué, 1 mauvais model ID, 1 second pass inutile) au lieu d'un seul.

**How to apply:**

1. Utiliser `"responseMimeType": "application/json"` dans `generationConfig` — force JSON propre sans markdown, jamais tronqué
2. Ne PAS mettre `maxOutputTokens` — laisser Gemini choisir sa longueur
3. Le prompt doit demander des `code_values` concrets (fontSize, color hex, opacity, strokeWidth) — pas seulement des critiques narratives
4. Envoyer storyboard + frames en un seul appel, pas itérativement
5. Limiter à 2 passes max (pass 1 = diagnostic, pass 2 = validation corrections) — jamais plus

**Format prompt JSON cible :**
```json
{
  "score": 7.5,
  "verdict": "APPROVE|NEEDS_WORK",
  "phase_x": { "status": "ok|partial|fail", "match_pct": 70, "comment": "...",
    "fixes": [{ "priority": "critical|major|minor", "element": "nom React", "problem": "...", "code_values": { "fontSize": 220, "color": "#c8a951" } }]
  },
  "overall_comment": "..."
}
```

**Leçon ping ring :** Ne jamais positionner un élément "autour d'un SVG" via un `<div>` externe — utiliser le même SVG pour garantir le centrage. Un `<div>` border-radius:50% ne s'aligne pas automatiquement sur le SVG parent.
