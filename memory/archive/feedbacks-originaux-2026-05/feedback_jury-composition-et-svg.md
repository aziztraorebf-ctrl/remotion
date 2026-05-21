---
name: Jury LLM — composition correcte + règle SVG pur
description: Composition jury créatif validée (OpenAI + Grok + Kimi) et règle anti-SVG-pur pour textures/matières
type: feedback
---

## Règle 1 — Composition jury créatif (NON-NEGOTIABLE)

Le jury créatif standard est : **OpenAI + Grok + Kimi**

- OpenAI (GPT-4o) : via OpenRouter
- Grok : via API xAI (XAI_API_KEY dans .env)
- Kimi K2.5 : via Moonshot API

**INTERDIT** : remplacer Grok ou Kimi par Claude Sonnet. Claude ne peut pas jouer le rôle de juré indépendant dans son propre projet — biais évident.

**Gemini dans le jury** : à exclure quand Gemini est déjà utilisé comme outil de génération d'assets dans le même projet. Conflit d'intérêt.

**Why:** Or Africain 2026-05-06 — le visual-producer a utilisé OpenAI + Claude au lieu de OpenAI + Grok + Kimi. Le brief ne spécifiait pas les modèles explicitement.

**How to apply:** Tout brief jury DOIT spécifier les 3 modèles nommément. Le visual-producer ne choisit pas les modèles — ils sont imposés par ce fichier.

---

## Règle 2 — SVG pur interdit pour textures, matières, effets atmosphériques

SVG pur = acceptable uniquement pour éléments géométriques purs :
- Lignes, arcs, courbes de données
- Formes géométriques simples
- Grilles de données
- Particules ponctuelles (points simples)

SVG pur = INTERDIT pour :
- Textures (papier, métal, grain, tissu)
- Effets atmosphériques (brume, fumée, lumière)
- Fonds enrichis (pas de gradient SVG pour simuler une matière)
- Film grain, bruit
- Topographie organique

**Pour ces cas → Gemini génère un asset image PNG/JPG, Remotion l'intègre via staticFile()**

**Why:** Comparaison directe 2026-05-06 — texture papier SVG pur = fond neutre sans texture réelle. Même texture générée par Gemini = fibres organiques visibles, profondeur, matière réelle. Le SVG ne peut pas reproduire l'organicité d'une texture.

**How to apply:** Avant de coder un effet "enrichi" en SVG, se demander : est-ce géométrique pur ? Si non → Gemini asset.
