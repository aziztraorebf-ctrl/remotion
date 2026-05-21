#!/bin/bash
# tmux-agents.sh — Layout surveillance agents GeoAfrique
# Usage : ./scripts/tmux-agents.sh [session_name]
# Lance une session tmux avec 4 panneaux pour monitorer les agents en live

SESSION="${1:-geoafrique-agents}"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PIPELINE_LOG="$PROJECT_ROOT/.claude/agent-memory/shared/PIPELINE.md"

# Si la session existe deja : switch depuis l'interieur de tmux, ou reattacher depuis l'exterieur
if tmux has-session -t "$SESSION" 2>/dev/null; then
  if [ -n "$TMUX" ]; then
    # Deja dans tmux (ex: terminal VSCode) — switch de session sans nester
    tmux switch-client -t "$SESSION"
  else
    tmux attach-session -t "$SESSION"
  fi
  exit 0
fi

# Creer la session detachee
tmux new-session -d -s "$SESSION" -x 220 -c "$PROJECT_ROOT"

# Nommer la fenetre principale
tmux rename-window -t "$SESSION:0" "agents"

# Layout : 4 panneaux
#  ┌──────────────────────┬───────────────────────┐
#  │  PIPELINE.md (live)  │  Claude Code terminal │
#  │  (tail -f)           │  (agent invocation)   │
#  ├──────────────────────┼───────────────────────┤
#  │  API balance check   │  out/ watcher         │
#  │  (on-demand)         │  (nouveaux fichiers)  │
#  └──────────────────────┴───────────────────────┘

# Panneau 0 (haut-gauche) — PIPELINE.md en live
tmux send-keys -t "$SESSION:0.0" \
  "echo '=== PIPELINE.md LIVE ===' && tail -f '$PIPELINE_LOG'" Enter

# Panneau 1 (haut-droite) — terminal libre pour lancer les agents
tmux split-window -h -t "$SESSION:0.0" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION:0.1" \
  "echo '=== AGENT TERMINAL — lancer: claude (puis /goal ou agents) ==='" Enter

# Panneau 2 (bas-gauche) — API balance checker
tmux split-window -v -t "$SESSION:0.0" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION:0.2" \
  "echo '=== API BALANCES ===' && ./scripts/check-api-balance.sh all" Enter

# Panneau 3 (bas-droite) — watcher out/ pour nouveaux renders
tmux split-window -v -t "$SESSION:0.1" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION:0.3" \
  "echo '=== out/ WATCHER ===' && fswatch -r out/ | xargs -I{} echo '[NEW] {}'" Enter

# Equilibrer la hauteur des panneaux
tmux select-layout -t "$SESSION:0" tiled

# Mettre le focus sur le terminal agent (panneau 1)
tmux select-pane -t "$SESSION:0.1"

# Attacher la session
tmux attach-session -t "$SESSION"
