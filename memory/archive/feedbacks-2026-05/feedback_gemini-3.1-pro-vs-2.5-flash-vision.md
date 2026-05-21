---
name: Gemini 3.1-pro-preview supérieur à 2.5-flash pour vision multimodale
description: Pour analyser une image et produire un breakdown technique, 3.1-pro est nettement meilleur que 2.5-flash. Détecte rotations, donne coords exactes, hex codes.
type: feedback
---

# Gemini 3.1-pro-preview vs 2.5-flash pour vision

**Validé** : Niger Uranium Beat 3 breakdown, 2026-05-10. Aziz a demandé de re-tester avec un meilleur modèle.

## Différences observées sur le même prompt + même image

| Critère | 2.5-flash | 3.1-pro-preview |
|---------|-----------|-----------------|
| Foreground elements détectés | 18 | 16 (mieux structurés) |
| Backgrounds suggérés | 2-3 (sur-spécifiés) | 1 (économe, pertinent) |
| Animation timeline events | 13 (micro-events) | 5 (groupes cohérents) |
| Coordonnées SVG fournies | partielles | complètes (M/L/cx/cy/r exacts) |
| Hex codes par élément | partiels | complets (#a33333, #d4c29d, #c8a951) |
| Détecte rotation -12° du tampon | ❌ | ✅ |
| Suggère police adaptée (Oswald) | ❌ | ✅ |
| Audio cues mappés à frames | 4 | 5 (toutes les phrases majeures) |

## Quand utiliser quoi

**3.1-pro-preview** : breakdown technique d'un visuel existant, analyse d'image complexe, raisonnement multimodal qui demande précision (positions, couleurs, rotations).

**2.5-flash** : tâches text-only sans vision critique, prototypage rapide, JSON mode standard.

## Prix

- 3.1-pro-preview : ~$0.05 par appel breakdown (input image + prompt + JSON output)
- 2.5-flash : ~$0.005 par appel
- Différence négligeable face au gain de qualité

## Modèle à NE PAS utiliser

- ❌ `gemini-3.1-flash` (n'existe pas en text-only, seulement image-preview ou flash-lite)
- ❌ `gemini-2.0-flash-preview-image-generation` (404)

## Modèles corrects 2026-05

- Image generation : `gemini-3.1-flash-image-preview`
- Text+vision breakdown : `gemini-3.1-pro-preview`
- Text rapide : `gemini-2.5-flash` (acceptable mais inférieur à 3.1-pro pour vision)

**Why:** Aziz a explicitement demandé "tu as utilisé 2.5 flash tandis que 3.1 flash est supérieur, recommençons". Le test a confirmé que 3.1-pro est bien supérieur pour cette tâche. Documenter pour ne plus utiliser 2.5-flash sur de la vision multimodale exigeante.

**How to apply:** Pour tout breakdown image-to-JSON, défault sur `gemini-3.1-pro-preview`. Coût négligeable, qualité significativement meilleure.
