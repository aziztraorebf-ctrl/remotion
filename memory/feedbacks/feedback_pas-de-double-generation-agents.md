---
name: Pas de double generation Seedance via agents
description: Ne JAMAIS lancer 2 agents successifs qui soumettent chacun un job Seedance. Un seul job a la fois. Cout double sinon.
type: feedback
---

Migré depuis auto-memory 2026-08-31.

Ne JAMAIS lancer 2 agents successifs qui soumettent chacun un job Seedance pour la meme scene.

**Why:** Session Sonjata Papercraft 2026-04-19. Scene 2 : le premier agent a soumis un job mais n'a pas retourne le request_id proprement. Un deuxieme agent a ete lance qui a soumis un nouveau job. Resultat : 2 clips generes, $7.80 au lieu de $3.90.

**How to apply:**
1. Un seul agent a la fois pour la generation Seedance
2. L'agent DOIT retourner le request_id dans son output
3. Si l'agent ne retourne pas de request_id, verifier le dashboard fal.ai AVANT de relancer
4. Si le polling echoue, demander a Aziz de verifier le dashboard plutot que de soumettre un nouveau job
5. Toujours verifier `ls clips-production/scene*` avant de lancer pour voir si un clip existe deja
