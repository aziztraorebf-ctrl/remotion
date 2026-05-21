---
name: Gemini drift — annotations stylistiques rendues littéralement dans l'image
description: Quand un prompt Gemini contient des indications de style typo (taille, font, opacity), Gemini peut écrire ces annotations littéralement dans l'image rendue
type: feedback
---

# Gemini drift — annotations stylistiques écrites dans l'image

**Observé** : 2026-05-07 sur storyboard Niger uranium S4 (procédures CIRDI).

Le prompt contenait des spécifications de typographie sous chaque overlay :
```
- BOTTOM HEADLINE: "STOCK BLOQUÉ" — uppercase, white, 56px Inter ExtraBold
- UNDER BOTTOM HEADLINE: "Sept. 2025 — décision tribunal arbitral" — IBM Plex Mono 24px, white opacity 70%
```

**Résultat** : Gemini a écrit littéralement "IBM Plex Mono 24px, white opacity 70%" en sous-titre dans la frame finale, comme s'il faisait partie du texte à afficher.

**Why:** Gemini 3.1 Flash Image traite les contenus entre guillemets comme du texte à rendre, et peut interpréter les annotations stylistiques voisines comme du contexte additionnel à afficher.

**How to apply:**
1. Mettre les overlays texte EN HAUT du prompt avec une syntaxe stricte : `Text to render: "EXACT TEXT". Style: ...` plutôt que des bullet lists mêlant texte et style.
2. Ou : décrire les overlays sans guillemets pour les annotations stylistiques (les sortir du bloc texte).
3. Format recommandé :
```
TEXT OVERLAYS TO RENDER (these strings appear in the image):
1. "STOCK BLOQUÉ" — bottom, large white uppercase
2. "Sept. 2025 — décision tribunal arbitral" — small white caption under headline
```
4. Dernier recours : régénérer en simplifiant.

**Cas d'origine** : S4 Niger uranium storyboard, frame utilisable comme mood mais pas comme livrable. Coût d'une régénération : $0.04.
