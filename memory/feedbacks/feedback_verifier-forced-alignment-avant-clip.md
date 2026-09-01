---
name: Verifier forced alignment AVANT generation clip
description: TOUJOURS re-verifier les frontieres audio mot par mot dans le forced alignment avant de generer un clip. Le manifest est un guide, le forced alignment est la source de verite.
type: feedback
---

Migré depuis auto-memory 2026-08-31 (feedback 2026-04-20, Scene 3 Sonjata Papercraft).

TOUJOURS re-verifier les frontieres audio (start/end) mot par mot dans le forced alignment JSON avant de generer un clip ou d'extraire une narration.

**Why:** Le manifest indiquait narration_start_s: 24.74 et narration_end_s: 38.94. En realite, 24.74s est le debut du mot "comme" qui appartient a la scene precedente. Le vrai debut de la scene est un autre mot a 26.56s. La fin declaree se terminait 0.44s avant la vraie fin de mot. Resultat : le clip mixe commencait par un mot de la scene precedente et coupait le dernier mot en plein milieu. ~$4.50 de clip presque gache.

**How to apply:**
1. AVANT d'extraire l'audio d'une scene, ouvrir le forced alignment JSON
2. Trouver le PREMIER mot de la scene et noter son `start` exact
3. Trouver le DERNIER mot de la scene et noter son `end` exact (fin du mot, pas debut)
4. Verifier que le mot PRECEDENT appartient bien a la scene d'avant
5. Verifier que le mot SUIVANT appartient bien a la scene d'apres
6. Utiliser ces timestamps verifies, PAS ceux du manifest
7. Mettre a jour le manifest si les valeurs sont differentes

**Hierarchie des sources de verite :**
- forced alignment JSON = source de verite (timestamps au centieme de seconde)
- manifest = guide de production (peut avoir des approximations)
- memoire de session = le moins fiable (ecrit de memoire)
