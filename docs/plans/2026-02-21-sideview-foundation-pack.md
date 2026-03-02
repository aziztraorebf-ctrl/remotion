# Side-View Foundation Pack (Anti-Flottement)

## Scope

This pack is the mandatory baseline before building any new side-view pixel prototype.

Core files:
- `src/projects/peste-1347-pixel/config/sideViewFoundation.ts`
- `src/projects/peste-1347-pixel/config/sideViewAssets.ts`
- `src/projects/peste-1347-pixel/components/SideViewDebugOverlay.tsx`

## What Is Locked

1. Coordinate system:
- Resolution: 1920x1080
- Origin: top-left
- Ground line and lane Y values are fixed in `sideViewFoundation.ts`.

2. Character grounding:
- Every character uses a manifest entry with `footAnchorY`.
- Sprite top placement is computed via `computeAnchoredTop()`.

3. Layering contract:
- Buildings and lanes use stable z ordering via `SIDEVIEW_LAYER_Z`.
- Text overlay is always above sprite lanes.

4. Deterministic horizontal wrap:
- Character x wrap uses `wrapScreenX()`.

## Pre-Prototype Checklist (Must Pass)

1. Grounding:
- Enable `SIDEVIEW_DEBUG = true`.
- Verify every green foot marker sits on lane lines.
- Max tolerated drift: 2px.

2. Layering:
- Validate that far lane can pass behind buildings while near lane stays in front.
- Confirm no sprite appears "inside" a flat painted background.

3. Animation integrity:
- For each NPC, verify `walking` loop runs and frame count matches manifest.
- Check idle fallback (animation off) still renders a valid direction sprite.

4. Scale consistency:
- Compare human height against doors/windows on at least 3 key frames.
- If mismatch is visible, adjust lane scale or character scale override.

5. Render safety:
- `npx tsc --noEmit` passes.
- No new runtime errors in Remotion studio preview.

## Keyframe QA (Required Before Export)

Validate screenshots at:
- Scene entry (first visible town frame)
- First character crossing
- Mid-scene (max crowd overlap)
- Start of deceleration
- Near fade-out end

If any check fails, fix the foundation values before adding new scene content.

