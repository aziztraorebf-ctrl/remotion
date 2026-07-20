---
name: kimi-review-bug
description: "RÉSOLU 2026-07-11 — scripts/visual_review.py --model kimi retournait une review vide, fix déjà appliqué au script réel"
metadata:
  type: reference
---

# Bug — `scripts/visual_review.py --model kimi` retournait une review VIDE — ✅ RÉSOLU

> Vérifié 2026-07-11 : `scripts/visual_review.py` ligne 469-482 contient déjà `max_tokens: 16000` et la
> lecture `msg.get('content') or msg.get('reasoning_content') or ''`, modèle `kimi-k2.5` (ligne 53). Le
> fix ci-dessous est appliqué — cette note ne décrit plus un bug actif, gardée pour mémoire du pattern API.

**Symptôme d'origine** (reproduit 2× en session 2026-07-07) : `python3 scripts/visual_review.py <fichier> --model kimi` renvoyait un verdict vide ou tronqué, sans erreur explicite — l'appel réussissait (tokens facturés) mais `result['choices'][0]['message']['content']` était vide.

## Cause racine (pattern API à retenir pour tout futur appel Kimi)

Kimi est un *thinking model* : sa vraie réponse peut atterrir dans `reasoning_content` au lieu de
`content`, et `max_tokens` doit être ≥16000 (sinon troncature `finish_reason: "length"` avant la vraie
réponse). Si un NOUVEAU script appelle Kimi et répète ce symptôme, appliquer le même pattern :
1. `max_tokens` ≥ 16000.
2. Lecture réponse : `msg.get('content') or msg.get('reasoning_content') or ''` au lieu de `content` seul.
3. Vérifier `finish_reason` — si encore `"length"` à 16000, augmenter ou réduire le prompt.

## Contournement historique (n'est plus nécessaire pour visual_review.py, gardé si un autre script bloque)
Fichiers `*.review-override.md` tracés à côté du rendu (pattern déjà prévu par le hook
`pre-presentation-review.sh`) — justification écrite du bypass, pas un contournement silencieux.
