#!/bin/bash
# preflight-check.sh
# Triggered BEFORE Remotion render commands.
# Reminds Claude to run creative-director preflight BEFORE rendering.
# Hook event: PreToolUse (matcher: Bash)

INPUT=$(cat)
TOOL_INPUT=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only trigger if the command contains "remotion render"
if [[ "$TOOL_INPUT" != *"remotion render"* ]]; then
  exit 0
fi

# Check if this is a test render (single frame or very short range)
# Allow quick test renders without full preflight
if [[ "$TOOL_INPUT" =~ --frames=[0-9]+-[0-9]+ ]]; then
  RANGE="${BASH_REMATCH[0]}"
  START=$(echo "$RANGE" | sed 's/--frames=\([0-9]*\)-.*/\1/')
  END=$(echo "$RANGE" | sed 's/--frames=[0-9]*-\([0-9]*\)/\1/')
  FRAME_COUNT=$((END - START))
  if [ "$FRAME_COUNT" -le 30 ]; then
    # 30 frames or less = quick test, skip preflight
    exit 0
  fi
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/clawdbot/Workspace/remotion}"

cat <<PREFLIGHT
---
PREFLIGHT CHECK REQUIS AVANT RENDER

AVANT de lancer ce render, as-tu:

1. CREATIVE-DIRECTOR PREFLIGHT:
   - Verifie que chaque personnage a l'animation dans sa direction assignee?
   - Verifie que le compositing utilise un tileset grid (PAS un painted bg)?
   - Verifie les z-index (texte >= 9999, sprites par profondeur)?
   - Verifie le timing (scene durations match hookTiming.ts)?

2. ASSET CHECK:
   - Tous les fichiers images references existent sur disque?
   - Les frame counts sont corrects par personnage?
   - child="walk" (pas "walking"), monk=pas de west, noble=south seulement?

3. SCRIPT FIDELITY:
   - L'implementation correspond au texte EXACT de scenes.json?
   - Aucun comportement invente/confabule (pas de scatter/flee sauf si dans le script)?

Si NON a un de ces points: CORRIGER AVANT DE RENDER.
Si OUI a tout: proceder avec le render.
---
PREFLIGHT
