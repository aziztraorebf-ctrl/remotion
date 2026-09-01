Ne JAMAIS espérer un "skills chaining" automatique entre /session-close et /memo dans Claude Code — les hooks ne s'activent que sur des événements système, pas en fin de skill.

**Why:** Aziz voulait que /session-close déclenche /memo automatiquement. Impossible nativement. Solution retenue : /wrap, un seul slash qui orchestre les 3 agents en parallèle (CLEANUP + INSIGHTS + COHERENCE). C'est le SEUL slash à retenir en fin de session.

**How to apply:** En fin de session, toujours proposer `/wrap` plutôt que `/session-close` + `/memo` séquentiellement. Si session < 30 min et 1 seul fichier modifié → `/memo` seul suffit.

## Pattern clôture agentique (validé 2026-06-26)

L'orchestrateur en fin de session a un contexte saturé → risque de manquer des insights ou de rater des incohérences. Solution prouvée :

1. Orchestrateur génère un brief ciblé (15-20 lignes : projets touchés, décisions clés, fichiers à NE PAS TOUCHER, worktree du projet actif, prochaine priorité)
2. Spawner 3 agents en PARALLÈLE avec le brief
3. Recevoir les 3 rapports JSON → valider → écrire

Un agent briefé (contexte frais, 15 lignes) bat l'orchestrateur saturé pour : suppressions de fichiers, audit de liens morts, extraction d'insights.

## Règle worktrees en fin de session (NON-NEGOTIABLE)

Fermer UNIQUEMENT le worktree du projet actif mentionné dans le brief. Les autres worktrees appartiennent à des sessions parallèles — y toucher crée des conflits.

- Si le brief ne mentionne pas de worktree actif → ne fermer AUCUN worktree
- Les autres worktrees ouverts → SIGNALER SEULEMENT dans le rapport

Prouvé 2026-06-26 : deux sessions avaient toutes les deux tenté de fermer le worktree GGW → conflit potentiel.

## Check anti-dérive NEXT-ACTION (Agent COHERENCE)

Problème récurrent : des sections dans NEXT-ACTION.md restent étiquetées ⭐⭐ alors que le chantier est terminé. Une instance fraîche les lit comme urgentes.

Règle pour l'Agent COHERENCE : pour chaque section ⭐ ou ⭐⭐, lire le fichier REPRISE/STATUS pointé. Si "MERGÉ/TERMINÉ/LIVRÉ/PROUVÉ" → rétrograder UNIQUEMENT le niveau d'urgence :
- ⭐⭐ urgente → 🔧 BACKLOG TECHNIQUE ou ✅ SYSTÈME GRAVÉ
- Garder le contenu (les décisions gravées ont de la valeur)

Exemples prouvés 2026-06-26 :
- `⭐⭐ REPRISE IMMÉDIATE — Workflow Data-viz` → `✅ SYSTÈME GRAVÉ (plus une priorité active)`
- `⭐⭐ REPRISE — Système Carto V5` → `🔧 BACKLOG TECHNIQUE (reprendre après Sénégal V3)`
