#!/bin/bash
# circuit-breaker.sh
# Triggered BEFORE any Edit or Write tool use on scene files.
# After 6 attempts: does NOT block — forces a creative-director re-evaluation instead.
# Claude must write a new Direction Brief in PIPELINE.md before the next edit is allowed.
# Hook event: PreToolUse (matcher: Edit|Write)

STATE_FILE="/Users/clawdbot/Workspace/remotion/.claude/circuit-breaker-state.json"
PIPELINE_FILE="/Users/clawdbot/Workspace/remotion/.claude/agent-memory/shared/PIPELINE.md"

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only trigger for scene files
if [[ "$FILE_PATH" != *"/scenes/"* ]] && \
   [[ "$FILE_PATH" != *"HookScene"* ]] && \
   [[ "$FILE_PATH" != *"Scene.tsx"* ]]; then
  exit 0
fi

# Skip agent-memory, plan files, and CLAUDE.md
if [[ "$FILE_PATH" == *"agent-memory"* ]] || \
   [[ "$FILE_PATH" == *"docs/plans"* ]] || \
   [[ "$FILE_PATH" == *"CLAUDE.md"* ]]; then
  exit 0
fi

SCENE_KEY=$(basename "$FILE_PATH")

# Initialize state file if missing
if [ ! -f "$STATE_FILE" ]; then
  echo '{}' > "$STATE_FILE"
fi

CURRENT_STATE=$(jq -r --arg key "$SCENE_KEY" '.[$key] // {"attempts":0,"escalated":false}' "$STATE_FILE")
ATTEMPTS=$(echo "$CURRENT_STATE" | jq -r '.attempts // 0')
ESCALATED=$(echo "$CURRENT_STATE" | jq -r '.escalated // false')

# If escalated: block until a new Direction Brief is written in PIPELINE.md
if [ "$ESCALATED" = "true" ]; then
  # Check if a new Direction Brief was written since escalation
  ESCALATED_AT=$(echo "$CURRENT_STATE" | jq -r '.escalated_at // ""')
  if grep -q "CIRCUIT BREAKER RE-OPEN" "$PIPELINE_FILE" 2>/dev/null; then
    # New direction confirmed — auto-reset and allow
    NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    jq --arg key "$SCENE_KEY" \
       --arg ts "$NOW" \
       '.[$key] = {"attempts":1,"escalated":false,"reset_at":$ts,"history":[]}' \
       "$STATE_FILE" > /tmp/cb-tmp.json && mv /tmp/cb-tmp.json "$STATE_FILE"
    cat <<UNBLOCK
---
CIRCUIT BREAKER: DEVERROUILLE

Nouvelle direction detectee dans PIPELINE.md (CIRCUIT BREAKER RE-OPEN).
Compteur reset. Bonne continuation — nouvelle approche en cours.
---
UNBLOCK
    exit 0
  fi

  # No new direction yet — block with instructions (but Claude can still work autonomously)
  cat <<BLOCK
---
CIRCUIT BREAKER: AUTO-ESCALADE ACTIVE

Scene: "$SCENE_KEY" — 3 tentatives sans resolution.

Tu dois changer d'approche avant de continuer. Etapes autonomes (sans attendre Aziz):

1. Invoquer creative-director mode=circuit-breaker
   -> Produire un Direction Brief DIFFERENT (nouvelle architecture, nouvelle approche)
   -> Ecrire "CIRCUIT BREAKER RE-OPEN: [NomScene] — [resume nouvelle approche]" dans PIPELINE.md

2. Une fois ecrit dans PIPELINE.md, la prochaine tentative d'edit sera automatiquement debloquee.

Tu peux faire tout cela maintenant, sans attendre Aziz.
Aziz lira le brief a son retour et pourra corriger si besoin.
---
BLOCK
  exit 2
fi

# Increment attempt counter
NEW_ATTEMPTS=$((ATTEMPTS + 1))
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PREV_HISTORY=$(echo "$CURRENT_STATE" | jq '.history // []')

NEW_ENTRY=$(jq -n \
  --argjson attempts "$NEW_ATTEMPTS" \
  --arg ts "$NOW" \
  --argjson history "$PREV_HISTORY" \
  --argjson escalated "false" \
  '{
    attempts: $attempts,
    escalated: $escalated,
    last_attempt: $ts,
    history: ($history + [$ts])
  }')

# At attempt 6: mark escalated (do not block this edit, but next one will be blocked)
if [ "$NEW_ATTEMPTS" -ge 6 ]; then
  NEW_ENTRY=$(echo "$NEW_ENTRY" | jq --arg ts "$NOW" '. + {"escalated":true,"escalated_at":$ts}')
fi

# Write updated state atomically
jq --arg key "$SCENE_KEY" \
   --argjson entry "$NEW_ENTRY" \
   '.[$key] = $entry' \
   "$STATE_FILE" > /tmp/cb-tmp.json && mv /tmp/cb-tmp.json "$STATE_FILE"

# Attempt 6: allow this edit BUT trigger escalation notice for next time
if [ "$NEW_ATTEMPTS" -ge 6 ]; then
  HISTORY_LINES=$(echo "$NEW_ENTRY" | jq -r '.history[] | "  - " + .')
  cat <<ESCALATE
---
CIRCUIT BREAKER: ESCALADE DECLENCHEE (tentative $NEW_ATTEMPTS)

Scene: "$SCENE_KEY"

Historique:
$HISTORY_LINES

Cette modification est autorisee. Mais si elle ne resout pas le probleme,
la prochaine tentative sera bloquee jusqu'a ce que tu produises
un nouveau Direction Brief (creative-director mode=circuit-breaker).

Tu n'as pas besoin d'Aziz pour continuer en autonome:
-> creative-director -> nouveau brief -> "CIRCUIT BREAKER RE-OPEN" dans PIPELINE.md -> edit debloque
---
ESCALATE
  exit 0
fi

# Attempt 5: penultimate warning
if [ "$NEW_ATTEMPTS" -eq 5 ]; then
  cat <<WARN
---
CIRCUIT BREAKER: AVERTISSEMENT (tentative 5/6)

Scene: "$SCENE_KEY" — encore une modification et l'escalade est declenchee.

Avant de continuer:
- La CAUSE RACINE est-elle identifiee (pas juste un symptome)?
- Le mini-render Stage 5.2 a-t-il valide les proportions?
- Le creative-director a-t-il valide l'approche?
---
WARN
  exit 0
fi

# Attempt 1: silent
exit 0
