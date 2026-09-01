---
name: claudemd-size-nuance
description: The 150-line CLAUDE.md threshold from claude-reflect is conservative — structure and clarity matter more than raw line count for modern Claude models
type: feedback
---

Migré depuis auto-memory 2026-08-31.

The 150-line threshold in claude-reflect is a community heuristic, not an Anthropic limit. With large-context modern models (1M context), well-structured files of 400+ lines work fine in practice.

**Why:** Aziz questioned why the threshold is so low given modern model capabilities. The real risk is contradiction and noise, not line count. A well-structured 400-line file with clear sections is better than a cramped 150-line file with compressed instructions.

**How to apply:** When /reflect warns about line count, nuance the message: acknowledge the threshold but emphasize that structure, clarity, and deduplication matter more than a hard line limit. Don't alarm the user over a well-organized file that happens to exceed 150 lines.

**Note (2026-08-31):** le repo actuel a de fait un CLAUDE.md structuré bien au-delà de 150 lignes, avec
des pointeurs denses vers `memory/ROUTAGE.md` plutôt que tout le contenu inline — cohérent avec cette
nuance, mais aussi avec la doctrine `budget-contexte-mesurer-la-chaine-entiere` (mesurer la CHAINE
entière chargée, pas le seul fichier plafonné) — les deux principes coexistent, pas de contradiction.
