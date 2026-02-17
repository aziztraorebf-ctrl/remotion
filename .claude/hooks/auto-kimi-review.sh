#!/bin/bash
# auto-kimi-review.sh
# Automatically triggers kimi-reviewer subagent after a Remotion render completes.
# Hook event: PostToolUse (matcher: Bash)
#
# Detects: npx remotion render ... --output=X or -o X
# Then prints instructions for Claude to invoke the kimi-reviewer subagent.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
TOOL_INPUT=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
TOOL_OUTPUT=$(echo "$INPUT" | jq -r '.tool_output // empty')

# Only trigger on Bash tool
if [[ "$TOOL_NAME" != "Bash" ]]; then
  exit 0
fi

# Only trigger if the command contains "remotion render"
if [[ "$TOOL_INPUT" != *"remotion render"* ]]; then
  exit 0
fi

# Only trigger if the command succeeded (check for common success indicators)
if [[ "$TOOL_OUTPUT" == *"Error"* ]] || [[ "$TOOL_OUTPUT" == *"error"* ]] || [[ "$TOOL_OUTPUT" == *"FAILED"* ]]; then
  exit 0
fi

# Extract output file path from the command
OUTPUT_FILE=""

# Try --output=path or --output path
if [[ "$TOOL_INPUT" =~ --output[=\ ]([^ ]+) ]]; then
  OUTPUT_FILE="${BASH_REMATCH[1]}"
fi

# Try -o path
if [[ -z "$OUTPUT_FILE" ]] && [[ "$TOOL_INPUT" =~ -o[\ ]([^ ]+) ]]; then
  OUTPUT_FILE="${BASH_REMATCH[1]}"
fi

# If no explicit output, check tool output for the rendered file path
if [[ -z "$OUTPUT_FILE" ]] && [[ "$TOOL_OUTPUT" =~ (/[^ ]*\.mp4) ]]; then
  OUTPUT_FILE="${BASH_REMATCH[1]}"
fi

# If we found a file, remind Claude to run the full QA pipeline
if [[ -n "$OUTPUT_FILE" ]]; then
  PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/clawdbot/Workspace/remotion}"
  cat <<REMINDER

---
RENDU REMOTION DETECTE: $OUTPUT_FILE

PIPELINE QA AUTOMATIQUE (executer dans l'ordre) :

1. STYLE SCAN : bash scripts/style-scan-pixel.sh
   -> Verifie anti-patterns, safe zones, magic numbers

2. KIMI REVIEW : python -u scripts/review_with_kimi.py "$OUTPUT_FILE" --output "/tmp/kimi-review-latest.md"
   -> Envoie la video a Kimi K2.5 pour diagnostic visuel

3. AFFICHER le verdict a Aziz (score /10 + top 3 problemes)

Si le style scan detecte des CRITICAL : corriger AVANT d'envoyer a Kimi.
---
REMINDER
fi

exit 0
