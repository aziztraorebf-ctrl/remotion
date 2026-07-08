---
name: kimi-review-bug
description: scripts/visual_review.py --model kimi retourne une review vide — fix connu, pas encore porté dans ce script
metadata:
  type: reference
---

# Bug — `scripts/visual_review.py --model kimi` retourne une review VIDE

**Symptôme** (reproduit 2× en session 2026-07-07) : `python3 scripts/visual_review.py <fichier> --model kimi` renvoie un verdict vide ou tronqué, sans erreur explicite — l'appel réussit (tokens facturés) mais `result['choices'][0]['message']['content']` est vide.

## Cause racine — PAS un mystère API, un fix déjà connu ailleurs jamais porté ici

Le pattern est déjà documenté dans `memory/rules-workflow-processus.md` (ligne 22, 38-58) pour `kimi-k2.6` :
Kimi est un *thinking model* — sa vraie réponse peut atterrir dans `reasoning_content` au lieu de
`content`, et `max_tokens` doit être ≥16000 (sinon troncature `finish_reason: "length"` avant la vraie
réponse).

`scripts/visual_review.py` (fonction `review_kimi`, ~ligne 458-490) utilise `kimi-k2.5` (cohérent avec
le verrou modèles du CLAUDE.md projet) avec `max_tokens: 2000` et lit uniquement `content` — il n'a
jamais reçu le fix déjà appliqué ailleurs dans le projet pour ce même pattern d'API.

## Fix à appliquer (2 lignes, prochaine session qui touche ce script)
1. `max_tokens` : 2000 → 16000 dans `review_kimi()`.
2. Lecture réponse : `msg.get('content') or msg.get('reasoning_content') or ''` au lieu de `content` seul.
3. Vérifier `finish_reason` — si encore `"length"` à 16000, augmenter ou réduire le prompt.

## Contournement utilisé en attendant (sans corriger le script)
Fichiers `*.review-override.md` tracés à côté du rendu (pattern déjà prévu par le hook
`pre-presentation-review.sh`) — justification écrite du bypass, pas un contournement silencieux.

**Ne pas rediagnostiquer depuis zéro** — appliquer directement le fix ci-dessus.
