---
name: render-background-gel-sleeps
description: Les renders Remotion en background se figent pendant les ScheduleWakeup longs — poller actif pour les longs renders
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fc5f26c6-b90c-4a2c-ab12-2de5f4f7a354
---

Un render Remotion lancé en background (`nohup ... &` ou Bash run_in_background) **n'avance quasiment pas pendant que la session est en veille** (entre deux `ScheduleWakeup`). Le process n'est réellement alimenté en CPU que pendant les tours actifs.

Symptôme observé (2026-06-03, Petrole Patience) : un render de 2730 frames semblait prendre des heures ; en réalité, en restant actif et en pollant en boucle courte (`for i in seq; sleep 30`), il finissait en ~7-8 min. L'illusion de lenteur venait de l'écart entre mes intervalles de réveil (30 min) et le temps CPU réel.

**Piège associé** : extrapoler la vitesse d'un render depuis le nombre de frames avancées entre deux réveils donne une estimation fausse (j'ai estimé 5-6h là où le vrai temps était ~7 min). Un benchmark direct (`render --frames=900-960` chronométré) donne la vraie vitesse : ~6 fps pour `render-mapbox.sh` en pleine résolution.

**Why** : le sandbox/harness ne garantit pas de CPU au background pendant les sleeps longs ; le render n'est pas intrinsèquement lent.

**How to apply** : pour un render local long, soit (1) lancer via `nohup &` PUIS poller en boucle active de 30s tant que c'est en cours (garde le render alimenté), soit (2) accepter d'attendre la notification de complétion du background task (signal fiable) sans tirer de conclusion sur la "lenteur" depuis l'écart entre réveils. Ne JAMAIS estimer la durée d'un render depuis l'intervalle des ScheduleWakeup — benchmarker une petite fenêtre d'abord. Voir [[sfx-reveal-mp3-banni]] (même session).
