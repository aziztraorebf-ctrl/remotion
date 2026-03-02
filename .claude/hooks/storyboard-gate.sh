#!/bin/bash
# storyboard-gate.sh
# Triggered BEFORE any Edit or Write tool use.
# Blocks scene file edits if Stage 1.8 (Storyboarder) is not complete.
# Hook event: PreToolUse (matcher: Edit|Write)

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only trigger for scene files (scenes/ directory or HookScene*.tsx pattern)
if [[ "$FILE_PATH" != *"/scenes/"* ]] && [[ "$FILE_PATH" != *"HookScene"* ]] && [[ "$FILE_PATH" != *"Scene.tsx"* ]]; then
  exit 0
fi

# Skip if this is an agent memory file or plan file
if [[ "$FILE_PATH" == *"agent-memory"* ]] || [[ "$FILE_PATH" == *"docs/plans"* ]]; then
  exit 0
fi

PIPELINE_FILE="/Users/clawdbot/Workspace/remotion/.claude/agent-memory/shared/PIPELINE.md"

# If PIPELINE.md doesn't exist yet, warn but don't block (first scene ever)
if [ ! -f "$PIPELINE_FILE" ]; then
  cat <<WARN
---
AVERTISSEMENT: PIPELINE.md introuvable.
Si tu commences une nouvelle scene, assure-toi d'avoir:
1. Lance le creative-director (Direction Brief)
2. Lance le pixel-art-director (Composition Brief)
3. Lance le storyboarder (SCENE_TIMING)
avant d'ecrire du code de scene.
---
WARN
  exit 0
fi

# Check if Stage 1.8 is marked COMPLETE in PIPELINE.md
if grep -q "Stage 1.8.*COMPLETE" "$PIPELINE_FILE"; then
  exit 0
fi

# Stage 1.8 not complete — block and explain
cat <<BLOCK
---
STORYBOARD GATE: BLOQUE

Tu tentes d'editer un fichier de scene sans que le Storyboarder ait complete son travail.

PIPELINE.md ne contient pas "Stage 1.8 — Storyboarder [COMPLETE]".

Avant de coder cette scene:
1. Le SCENE_TIMING doit etre produit par le storyboarder
2. L'audio doit etre genere et mesure avec ffprobe
3. Stage 1.8 doit etre ecrit dans PIPELINE.md

Pour bypasser (scene de test uniquement):
- Ecris "Stage 1.8 — Storyboarder [BYPASSED — test]" dans PIPELINE.md

Agent a invoquer: storyboarder (.claude/agents/storyboarder.md)
---
BLOCK

exit 2
