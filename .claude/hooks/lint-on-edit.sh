#!/bin/bash
# lint-on-edit.sh
# Runs TypeScript type-check on edited .ts/.tsx files.
# Catches type errors immediately instead of at render time.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check TypeScript files in the project
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/clawdbot/Workspace/remotion}"

# Quick type check (noEmit = no output files, just check types)
cd "$PROJECT_DIR" && npx tsc --noEmit --pretty 2>&1 | head -30

# Always allow the edit to proceed (exit 0), just show warnings
exit 0
