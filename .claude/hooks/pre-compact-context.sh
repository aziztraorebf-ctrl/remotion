#!/bin/bash
# pre-compact-context.sh
# Re-injects critical project context after context compaction.
# Lit dynamiquement NEXT-ACTION.md + PIPELINE.md au lieu d'un contenu hardcode.

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/clawdbot/Workspace/remotion}"
MEMORY_DIR="$PROJECT_DIR/memory"
PIPELINE_FILE="$PROJECT_DIR/.claude/agent-memory/shared/PIPELINE.md"
NEXT_ACTION_FILE="$MEMORY_DIR/NEXT-ACTION.md"

# --- Lire NEXT-ACTION.md (priorites actives) ---
if [ -f "$NEXT_ACTION_FILE" ]; then
  NEXT_ACTION=$(cat "$NEXT_ACTION_FILE")
else
  NEXT_ACTION="NEXT-ACTION.md absent — lire PIPELINE.md pour l'etat des projets."
fi

# --- Lire l'etat actuel depuis PIPELINE.md (section "Etat actuel") ---
if [ -f "$PIPELINE_FILE" ]; then
  PIPELINE_STATE=$(sed -n '/## .tat actuel/,/^---/p' "$PIPELINE_FILE" 2>/dev/null | head -40)
else
  PIPELINE_STATE="PIPELINE.md absent."
fi

cat <<CONTEXT
# Post-Compaction Context Injection
# (Genere dynamiquement depuis NEXT-ACTION.md + PIPELINE.md — mis a jour 2026-06-01)

## Recommandations actives (NEXT-ACTION.md)
$NEXT_ACTION

## Etat projets (PIPELINE.md extrait)
$PIPELINE_STATE

## Regles NON-NEGOTIABLE (toujours actives apres compaction)
- MODELES GEMINI : voir tableau "MODELES API VERROUILLES" dans CLAUDE.md — source de verite unique
- VOIX ELEVENLABS : z3gESu49naEZW8Af2Upm (GeoAfrique V2) — aucune autre
- REMOTION : audio-derived timing obligatoire, jamais de valeurs hardcodees
- MAPBOX : useCurrentFrame + map.jumpTo() uniquement — flyTo/easeTo interdits (headless)
- TAILWIND : text-gold / text-ivory / bg-navy. Zero style inline pour couleurs/typo/spacing.
- CIRCUIT BREAKER : 3 echecs sur le meme probleme = STOP, re-evaluer avant de continuer.

## Sources de verite
- Doctrine Souverain : memory/DOCTRINE-SOUVERAIN.md
- Etat projets complet : .claude/agent-memory/shared/PIPELINE.md
- Prochaine action recommandee : memory/NEXT-ACTION.md
- Routage outils/skills : tableau "Routage outils" dans CLAUDE.md
CONTEXT
