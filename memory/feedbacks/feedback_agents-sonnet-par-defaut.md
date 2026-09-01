# Agents délégués en Sonnet par défaut ; Opus seulement pour tâches sensibles signalées avant

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Quand Claude (orchestrateur Opus) lance des agents délégués (Agent tool / Workflow), il les lance en **Sonnet 4.6 PAR DÉFAUT** (`model: "sonnet"` explicite à chaque appel). Sonnet en effort élevé suffit largement pour l'audit, la réparation mémoire/doctrine, le nettoyage, la recherche, l'exécution de lots.

**Why** : Opus consomme beaucoup plus. Aziz veut maîtriser le coût. La valeur d'Opus est dans l'ORCHESTRATION (découpe, synthèse, jugement, zones sensibles), pas dans l'exécution déléguée.

**How to apply** :
- Agents délégués → toujours `model: "sonnet"`.
- Opus réservé à : (1) l'orchestrateur lui-même (Claude principal), (2) une tâche déléguée VRAIMENT sensible ET signalée+validée par Aziz AVANT de lancer (ex. raisonnement critique sur du code de prod validé). Annoncer « je lance cet agent en Opus parce que X — OK ? » avant.
- Zones sensibles (CLAUDE.md, merges, régressions, décisions doctrine) : Claude les fait LUI-MÊME en direct, pas via agent.

Prouvé : consolidation 2026-06-25, 3 vagues, ~25 agents tous en Sonnet 4.6 + Claude Opus orchestrateur. Voir [[methode-test-reproductibilite-agent-vierge]] et [[feedback_methode-storyboard-orchestration-guider]] (déléguer à un agent frais).

**Rappel coût 2026-07-05** : les agents délégués (Sonnet) ne sont PAS gratuits, même quand le coût n'est pas
ticketé/affiché comme un appel API externe direct (GLM/GPT/Gemini via OpenRouter, prix au token visible). Un
pipeline qui dispatche 1 agent par élément à raffiner (ex. SVG multi-éléments, cf.
`[[feedback_pipeline-2-temps-generation-puis-raffinement-agent-vierge]]`) a un coût réel proportionnel au
nombre d'agents lancés — à garder dans le calcul coût/bénéfice, ne pas dispatcher à la légère sous l'idée
fausse que "les agents c'est gratuit puisque pas d'API key facturée directement".
