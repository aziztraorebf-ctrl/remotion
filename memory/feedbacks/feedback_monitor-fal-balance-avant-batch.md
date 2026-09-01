---
name: Monitorer solde fal.ai avant batch parallele
description: Avant tout batch Seedance > 1 clip, verifier solde fal.ai et informer Aziz du cout total estime. Pain point session 2026-04-14 soir.
type: feedback
---

Migré depuis auto-memory 2026-08-31.

**Pain point** : 2026-04-14 soir, Phase 2 Soundjata. 3 appels Seedance lances en parallele (Acte I 13s + Acte IV Clip 1 15s + Acte IV Clip 2 5s). Le compte fal.ai s'est epuise au milieu — 2 clips reussis ($5.43), le 3e a echoue avec un 403 silencieux.

**Symptome** : l'agent visual-producer qui devait remonter le 3e clip a sorti un message confus ("j'attends la fin de la tache bnz0bijzh") sans signaler clairement le 403. Investigation manuelle (ps aux + verification disque) pour comprendre que le clip n'avait jamais ete genere.

**Cause racine** :
1. Solde fal.ai non verifie avant le batch
2. Agent visual-producer pas equipe pour detecter et remonter clairement les erreurs 403 balance-exhausted
3. Test parallelisation a fait oublier la verification financiere prealable

**Regle operationnelle** :

### Avant tout batch Seedance > 1 clip

1. Demander a Aziz le solde actuel fal.ai (URL : https://fal.ai/dashboard/billing) OU verifier via `curl` API si endpoint disponible
2. Calculer le **cout total estime du batch** = somme des durees × tarif/s en vigueur
3. Verifier `solde >= cout_batch + 20% marge`
4. Si solde insuffisant : **STOP**, demander a Aziz de recharger AVANT lancement
5. Annoncer explicitement a Aziz : "Batch de N clips, cout estime $X, solde fal.ai necessaire >= $Y"

### Pour les sub-agents visual-producer

A integrer dans le brief des lancements Seedance batch :
- "Si l'appel API retourne 403 ou message 'balance exhausted' / 'user is locked', REMONTE IMMEDIATEMENT a Claude principal avec le message d'erreur exact. Ne pas tenter de retry, ne pas remonter de message confus."

### Cas d'echec acceptable

Si le solde est inconnu au moment du lancement et que tu lances quand meme (cas exploratoire) :
- Lancer 1 clip d'abord, attendre confirmation succes
- Puis lancer le reste si OK
- Mais c'est sub-optimal : prefere toujours verifier solde avant batch

**Source** : pain point session 2026-04-14 soir, Phase 2 Soundjata. ~30 min perdues a investiguer + 1 clip a relancer en prochaine session.
