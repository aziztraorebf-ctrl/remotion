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

## Tri du feedback Gemini sur SCÈNE SVG ANIMÉE — 3 critères de REJET (prouvé Cacao B3/B4, 2026-06-29)
Gemini propose souvent de bonnes idées d'animation MAIS aussi des idées contraires à notre stack/style. Ne JAMAIS
appliquer en bloc. Lire chaque point → vérifier contre 3 critères de rejet → appliquer SEULEMENT ce qui passe :
1. **Contraire au style/registre** → REJET. Ex : oiseaux/objets qui SORTENT du cadre (rien ne sort latéralement ;
   seule la marchandise glisse). Adaptation acceptée : oiseaux qui montent + fade avant le bord.
2. **Interdit Remotion** → REJET ou TRADUCTION. Ex : `@keyframes`/`animation-delay`/`requestAnimationFrame` CSS →
   traduire en `interpolate`/`Math.sin(frame)`/`spring()` natifs (jamais le CSS brut).
3. **Contraire à la doctrine** → REJET. Ex : parallaxe multi-couches / faux-3D.
   ⚠️ **CORRECTION 2026-08-15** : la formule « DOCTRINE-SOUVERAIN : pas de 3D, plat encre » écrite ici
   était FAUSSE — vérifié, cette phrase n'existe nulle part dans `DOCTRINE-SOUVERAIN.md`, qui
   RECOMMANDE au contraire `@remotion/three` « pour 3D premium » (L267). La vraie règle est le
   **cadre d'usage tranché par Aziz le 2026-06-17** (`feedback_remotion-effects-rack-natif.md`
   § CADRE D'USAGE 3D) : le 3D est un **réhausseur de niche** — ✅ jetons/objets 3D posés sur une
   carte, géométrie simple · ❌ cartes Mapbox en 3D, backgrounds génératifs, formes organiques.
   Le test A/B jetons plat vs 3D a conclu que **le plat gagne**. Citer la source réelle, pas celle-ci.
GARDÉS cette session (passent les 3) : croissance des arbres (vs pop binaire), couche de vie permanente, squash&stretch,
tracé ordonné de l'usine. Le diagnostic de fond de Gemini ("scène trop statique") était JUSTE — c'est le tri des
SOLUTIONS qui compte. Gemini = signal sur le problème, pas juge des solutions.
