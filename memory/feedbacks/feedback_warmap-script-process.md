---
name: warmap-script-process
description: Ordre obligatoire pour ecrire un script War-Map sur conflit en cours — WebSearch + vignettes Sonar-Pro AVANT le script
metadata:
  type: feedback
---

Ne jamais ecrire un script sur un conflit en cours depuis la memoire seule.

**Ordre obligatoire :**
1. WebSearch sur l'etat actuel du conflit (statut villes, fronts, bilans humains)
2. Relire les vignettes Sonar-Pro generees dans le pipeline donnees (sudan.warmap.json)
3. Ecrire le script en s'appuyant sur ces deux sources
4. Jury LLM (Gemini + Grok + GPT) pour valider — filet de securite, pas moteur de fact-check

**Why:** Session 2026-06-06 — script Soudan V1 ecrit depuis la memoire. Erreurs : Khartoum "reprise" (vrai mais incomplet), "tout le Darfour RSF" (faux — El-Fashir tenait encore a ce moment), "deux ans" (approximatif). Le jury LLM a rattrapé les erreurs mais aurait du etre le filet, pas la source principale. El-Fashir est tombee en octobre 2025 (genocide ONU), Khartoum entierement liberee mai 2025 — WebSearch aurait donne ces faits en 30 secondes.

**How to apply:** Pour tout script sur un sujet geopolitique en cours (conflit, actualite recente) : WebSearch obligatoire AVANT d'ecrire la premiere phrase. Les vignettes Sonar-Pro du pipeline sont aussi une source a relire — elles contiennent deja les faits verifies par le pipeline.
