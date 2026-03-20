#!/bin/bash
# pre-compact-context.sh
# Re-injects critical project context after context compaction.
# This prevents losing key decisions and gotchas mid-session.

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/clawdbot/Workspace/remotion}"
MEMORY_DIR="$HOME/.claude/projects/-Users-clawdbot-Workspace-remotion/memory"

# Read current-project.md if it exists (compact summary of project state)
if [ -f "$MEMORY_DIR/current-project.md" ]; then
  PROJ_STATE=$(head -60 "$MEMORY_DIR/current-project.md")
else
  PROJ_STATE="No current-project.md found"
fi

# Output critical context that will be injected after compaction
cat <<CONTEXT
# Post-Compaction Context Injection

## Active Project: Peste 1347
$PROJ_STATE

## PROJET SATELLITE : GeoAfrique — Abou Bakari II
- COMPOSANT : src/projects/geoafrique-shorts/AbouBakariShort.tsx (A RECONSTRUIRE beat-by-beat)
- AUDIO VALIDE : public/audio/abou-bakari/stephyra-v2-noms-fixes.mp3 (54s, Stephyra)
- STORYBOARD : tmp/storyboard-abou-bakari/ (8 PNG + storyboard.html)
- SVG MANSA FINAL : tmp/storyboard-abou-bakari/03-mansa-v3.svg (Gemini 3.1 Pro — UTILISER CE FICHIER)
- TIMINGS : src/projects/geoafrique-shorts/timing.ts (Whisper, 30fps, NE PAS RECALCULER)
- MEMOIRE COMPLETE : memory/geoafrique-abou-bakari.md (LIRE AVANT DE TOUCHER CE PROJET)
- METHODE : Beat-by-Frame — coder 1 beat, mini-render, valider, passer au suivant. Storyboard ouvert en reference.

## AGENTS SPECIALISES (4 agents, DECLENCHEMENT OBLIGATOIRE)
1. creative-director: AVANT de coder une scene (direction review) + AVANT render >30 frames (preflight)
2. pixel-art-director: APRES Direction Brief, AVANT assets (composition, perspective, palette)
3. kimi-reviewer: APRES chaque render reussi (hook automatique rappelle)
4. pixellab-expert: AVANT toute generation PixelLab (consulter registre erreurs)
Details: .claude/agents/*.md | Memoire: .claude/agent-memory/*/MEMORY.md

## PERSPECTIVE PAR SCENE (pixel-art-director decide)
- Scenes carte/propagation: top-down (tilesets grille)
- Scenes personnages/action: SIDE-VIEW (parallax 5-6 layers, compositing trivial)
- Transition entre vues: 4-6 frames noires
INTERDIT: placer sprites CSS sur image peinte (10+ echecs documentes)

## Critical PixelLab Animation Gotchas
- child: animation folder = "walk" (NOT "walking")
- monk: missing west walking direction
- noble: south-only walk animation
- peasant-woman: NO walk animations (rotations only)
- plague-doctor: 4 frames (not 6 like MCP characters)

## Circuit Breaker
3+ echecs sur meme scene = STOP patcher, re-evaluer l'approche.
JAMAIS modifier un prototype rejete incrementalement -> rebuild from zero.

## Production Rules
- Audio-first: generate audio -> measure ffprobe -> THEN sync visuals
- Build minute by minute, checkpoint with Aziz after each minute
- NO emojis in code files (.ts/.tsx/.js/.json)
- Scene 7: NO scatter/flee (philosophical reflection, not panic)
CONTEXT
