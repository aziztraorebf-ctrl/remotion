# Communication durée agents - annoncer avant + background si long

## Règle communication agents (validée 2026-04-23 session Thiaroye V5)

### Avant tout Agent call
Annoncer à Aziz l'estimation de durée AVANT de lancer l'agent. Format :
> "Je lance l'agent [nom]. Attente estimée : X minutes. Je reviens dès qu'il répond."

**Why:** Pendant qu'un agent travaille (parfois 3-5 min), Aziz voit un silence total. Sans annonce préalable, il attend aveuglément et peut perdre patience (observé 4 min d'attente sans feedback sur visual-producer Scene 1 V3 → V4 transition).

**How to apply:**
- Estimer la durée selon la tâche :
  - Agent léger (analyse, audit, preview sans génération) : 30s-2min
  - Agent avec 1 génération (Gemini image) : 1-3 min
  - Agent avec génération + self-review + upload : 2-5 min
  - Agent avec Seedance clip + review + upload : 3-8 min
  - Agent multi-étapes (plusieurs générations séquentielles) : 5+ min → BACKGROUND

### Tâches >3 min estimées
Lancer l'agent en `run_in_background: true` + `ScheduleWakeup` après 90s pour donner un update intermédiaire à Aziz.

### Éviter
- Silences longs sans annonce préalable
- Lancer des agents pour des tâches simples que je peux faire moi-même (Bash, Read, Write directs)
- Ne pas informer Aziz quand un agent prend plus que l'estimation annoncée

### Exemples concrets Thiaroye V5
- Preview-before-pay (pas de génération) : 1-2 min
- Génération Gemini seule + review + upload : 2-4 min
- Génération Seedance + extraction frames + Kimi + upload : 5-8 min → BACKGROUND recommandé
- Pipeline complet (image + review + clip + review + upload) : 10+ min → OBLIGATOIRE background

Distinct de `feedbacks/render-background-gel-sleeps.md` (qui documente que le CPU d'un render en
background est affamé pendant les longs `ScheduleWakeup`, donc l'agent doit poller activement plutôt
qu'extrapoler la vitesse depuis l'écart entre réveils) — cette règle-ci porte sur la COMMUNICATION à
Aziz avant/pendant un Agent call, un problème différent (attente perçue côté utilisateur, pas
starvation CPU côté process).

---
Migré depuis auto-memory (`feedback_agent-timeout-communication.md`) le 2026-08-31, contenu original inchangé.
