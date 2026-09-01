---
name: episodic-memory-usage-ponctuel-pas-automatique
description: "episodic-memory est un outil de recherche ponctuelle sur l'historique de conversations, jamais un chargement automatique en contexte de session"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 279cc1d2-e511-491a-835c-85ee33db2a04
  modified: 2026-09-01T19:03:37.611Z
---

`episodic-memory` (plugin superpowers-marketplace, MCP `search-conversations`) est actif depuis
avant le chantier mémoire du 2026-08-31/09-01 (`"episodic-memory@superpowers-marketplace": true`
dans `.claude/settings.json`, index de 13 455 conversations dont 10 708 pour ce projet). Rien à
activer.

**Usage correct : ponctuel, à la demande, jamais automatique au démarrage.** Invoquer uniquement
quand une question précise se pose sur une décision/raisonnement tenu dans une conversation
passée et absent des fichiers structurés (`memory/doctrines/`, `feedbacks/`, `MEMORY.md`,
`NEXT-ACTION.md`). Ne JAMAIS le charger par défaut à chaque session — ça recréerait exactement
le problème de dérive de contexte que le chantier du 2026-08-31/09-01 vient de résoudre
(cf [[budget-memoire-gate]], `memory/BUDGET.md`).

**Why** : Aziz a demandé (2026-09-01) confirmation qu'episodic-memory était bien "la solution
principale" au problème de mémoire. Ce n'est PAS le cas — la solution principale est le plan en
3 couches (nettoyage MEMORY.md/NEXT-ACTION.md → structure repo=autorité/auto-memory=stubs → gate
bloquant `budget-memoire-gate.sh`). episodic-memory reste un outil d'APPOINT pour la recherche
historique ponctuelle, positionné ainsi dès le départ dans la discussion de cadrage de la session.

**How to apply** : si une session future redemande "utilise episodic-memory à chaque fois" —
rappeler cette distinction avant d'appliquer, plutôt que de silencieusement commencer à charger
des résultats de recherche en début de session.
