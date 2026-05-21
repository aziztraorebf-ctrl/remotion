#!/bin/bash
# screenshot-qa.sh - Auto-trigger visual-qa when a preview-*.png is written
# Triggered by PostToolUse on Write/Bash tools

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
PROJECT_DIR="/Users/clawdbot/Workspace/remotion"

# Detecter si un fichier preview-*.png vient d'etre cree/modifie
if echo "$TOOL_INPUT" | grep -qE 'preview-.*\.png|preview_.*\.png'; then
    # Extraire le chemin du fichier
    PNG_FILE=$(echo "$TOOL_INPUT" | grep -oE '["\x27][^"'\'']*preview[^"'\'']*\.png["\x27]' | tr -d '"'\''' | head -1)

    if [ -z "$PNG_FILE" ]; then
        # Fallback: chercher le dernier preview-*.png modifie
        PNG_FILE=$(find "$PROJECT_DIR" -maxdepth 1 -name "preview-*.png" -newer "$PROJECT_DIR/src" 2>/dev/null | head -1)
    fi

    if [ -n "$PNG_FILE" ] && [ -f "$PNG_FILE" ]; then
        echo "VISUAL QA REQUIS: Un screenshot $PNG_FILE vient d'etre genere."
        echo "Action: Invoquer l'agent visual-qa pour analyser ce screenshot avant de continuer."
        echo "Commande: Task(subagent_type='kimi-reviewer', prompt='Review $PNG_FILE via visual-qa protocol')"
    fi
fi

exit 0
