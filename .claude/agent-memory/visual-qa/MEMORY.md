# Visual QA Agent - Memory

## Reviews History

| Date | File | Score | Verdict | Key Finding |
|------|------|-------|---------|-------------|
| 2026-02-18 | preview-sideview-v2.png | 7.5/10 | MINOR FIXES | Style coherence RESOLVED via unified PixelLab pipeline. Hooded figure + top-hat figure need 2-3px Y anchor fix. |

## Score Progression (Peste 1347 - HookBloc1)
- v1 (CSS placeholder): 6.5/10
- v2 (GPT-Image-1): 4.5/10 — REGRESSION
- v3 (PixelLab unified): 7.5/10 — RECOVERY

## Critical Learnings
- Mixed pipelines (PixelLab sprites + GPT painted bg) = catastrophic style mismatch
- Unified PixelLab pipeline (all assets same tool) = style coherence
- Static screenshot review BEFORE coding saves render cycles
- Character Y-offset must be per-sprite, not global (each sprite has different "foot bottom" pixel)
