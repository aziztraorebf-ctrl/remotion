---
name: Self-review severe — preferer faux-positifs a laisser passer
description: Claude doit etre severe dans ses self-reviews de clips generes. Verifier visage side-by-side avec ref, style vs clips valides, details canon exacts. Aziz prefere corriger les faux-positifs que decouvrir des vrais problemes.
type: feedback
---

Migré depuis auto-memory 2026-08-31 (feedback 2026-04-16 soir).

Un clip a ete valide en disant "tunique blanche, sash rouge, 4 panels OK" alors que le visage ne matchait pas la ref canon, le style etait different des autres Actes, et un double sabre apparaissait.

**Why:** Aziz perd du temps quand il decouvre des problemes que Claude aurait du detecter. Une self-review trop permissive n'aide personne. Citation Aziz : "Mieux vaut etre severe et que je te dise que tu as ete trop severe, que de laisser passer."

**How to apply:**
1. Pour chaque panel, ouvrir la ref canon + la frame extraite et comparer VISAGE, COIFFURE, STYLE (pas juste vetements)
2. Comparer le style global du clip avec un clip DEJA VALIDE du meme projet
3. Tout artefact non-canon (sabre en trop, objet invente) = ERREUR, pas "visuellement dynamique"
4. Signaler 5 faux-positifs vaut mieux que laisser passer 1 vrai probleme
5. Ne jamais utiliser "acceptable" ou "non bloquant" pour un drift d'identite visage
