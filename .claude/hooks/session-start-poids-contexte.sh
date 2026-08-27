#!/bin/bash
# Gate d'EVICTION — pendant de session-start-capitalisation.sh (cote entree).
# Mesure la chaine de demarrage et signale la derive. Ne bloque jamais.
python3 /Users/clawdbot/Workspace/remotion/scripts/tools/check-poids-contexte.py 2>/dev/null || true
