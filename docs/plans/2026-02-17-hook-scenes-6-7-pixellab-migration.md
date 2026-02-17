# Hook Scenes 6-7: PixelLab Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 12 Elthen/Gothicvania chibi sprites in HookScene.tsx scenes 6-7 with 7 PixelLab characters, using the existing `PixelLabSprite` component and a NEW PixelLab-generated background (replacing the Gemini `town-bg-topdown.png`).

**Architecture:** Scenes 6-7 currently use `GridSpritesheetAnimator` reading rows/cols from townsfolk-1/2/3.png spritesheets (32x32 chibi). We replace this with `PixelLabSprite` reading individual frame PNGs from `pixellab/characters/*/animations/walking/*/frame_NNN.png` (64x64 native). The background switches from Gemini isometric to PixelLab Pixflux low-top-down for perspective coherence with sprites. Text overlays, CRT, darken logic, and Ken Burns camera stay unchanged.

**UPDATED 2026-02-17:** Plague doctor removed (not narratively relevant in scenes 6-7). Background changed from Gemini to PixelLab Pixflux for style/perspective coherence. Peasant-woman walk animation generated.

**Tech Stack:** Remotion, React, TypeScript. No new dependencies.

---

## Current State Summary

### What stays (DO NOT touch)
- Scenes 1-5: PlagueSpreadMap + HookTextOverlay (carte, MOITIE, MALADIE)
- `HookTextOverlay.tsx` (HUMAINS stamp, LES MEMES REFLEXES typewriter)
- `CRTOverlay.tsx`
- `hookTiming.ts` (scene timings)
- Black cut between scenes 5 and 6

### What changes
- `MedievalTownBackground.tsx`: image path from `town-bg-topdown.png` to `pixellab/backgrounds/town-square-warm-1920x1080.png`
- `HookScene.tsx` scenes 6-7: NPC system migrated from GridSpritesheet to PixelLabSprite
- Remove `GridSpritesheetAnimator` import (if no longer used elsewhere)
- NPC data structure changes from spritesheet grid coords to PixelLab basePath
- Plague doctor REMOVED from NPC list (not in this scene narratively)

### Assets Available (PixelLab characters with walk animations)

| Character | Native Size | Walk Dirs | Walk Frames | Animation Folder Name |
|-----------|-------------|-----------|-------------|-----------------------|
| peasant-man | 64x64 | 4 (S/W/E/N) | 6 | `walking` |
| merchant | 64x64 | 4 (S/W/E/N) | 6 | `walking` |
| blacksmith | 64x64 | 4 (S/W/E/N) | 6 | `walking` |
| monk | 64x64 | 4 (S/W/E/N) | 6 | `walking` |
| child | 48x48 | 4 (S/W/E/N) | 6 | `walk` (NOT "walking") |
| noble | 64x64 | south ONLY | 6 | `walking` |
| peasant-woman | 64x64 | 4 (S/W/E/N) | 6 | `walking` |

**Usable for walk scenes:** peasant-man, merchant, blacksmith, monk, child, peasant-woman (6 walkers in all dirs)
**Static only:** noble (south walk only)
**Removed:** plague-doctor-concept (not in scenes 6-7 narratively -- appears later in Seg 4)

---

## Task 0: Update background to PixelLab Pixflux

**Files:**
- Modify: `src/projects/peste-1347-pixel/components/MedievalTownBackground.tsx:69`

**Step 1: Change image path**

Replace:
```typescript
src={staticFile("assets/peste-pixel/town/town-bg-topdown.png")}
```
With:
```typescript
src={staticFile("assets/peste-pixel/pixellab/backgrounds/town-square-warm-1920x1080.png")}
```

**Step 2: Verify render**

Run: `npx remotion render HookBloc1 --frames=960-965 --output=/tmp/hook-bg-test.mp4 2>&1 | tail -5`
Expected: PASS -- new PixelLab background visible in scene 6.

**Note:** TOWN_Y_MIN/MAX may need adjustment since the new background has a different ground plane layout. Check visually after Task 3.

---

## Task 1: Define new NPC data structure

**Files:**
- Modify: `src/projects/peste-1347-pixel/scenes/HookScene.tsx`

**Step 1: Replace NPC interface and data array**

Remove the old `NPC` interface (lines 54-71) and `NPCS` array (lines 74-152) that reference grid spritesheets. Replace with a PixelLab-oriented structure:

```typescript
// Character native sizes
const CHAR_NATIVE_PL = 64; // PixelLab native (peasant-man, merchant, etc.)
const CHILD_NATIVE_PL = 48; // child is smaller

interface PixelNPC {
  id: string;
  basePath: string;       // e.g. "assets/peste-pixel/pixellab/characters/peasant-man"
  animation: string;      // "walking" or "walk" (child) or null for static
  frameCount: number;     // 6 for walking, 4 for idle
  nativeSize: number;     // 64 or 48
  x: number;              // initial X position
  y: number;              // initial Y position (determines depth)
  behavior: "walk" | "idle";
  direction: "east" | "west" | "south" | "north";
  dx: number;             // movement vector X (-1, 0, 1)
  dy: number;             // movement vector Y (-1, 0, 1)
}

const PIXELLAB_CHARS = "assets/peste-pixel/pixellab/characters";

// 7 NPCs spread across the town square, back to front
// NO plague doctor (not in this scene -- appears later in Seg 4)
const NPCS: PixelNPC[] = [
  // --- BACK (Y ~460-520, far from camera) ---
  {
    id: "monk-back",
    basePath: `${PIXELLAB_CHARS}/monk`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    x: 400, y: 480, behavior: "walk", direction: "east", dx: 1, dy: 0,
  },
  {
    id: "noble-idle",
    basePath: `${PIXELLAB_CHARS}/noble`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    x: 1350, y: 500, behavior: "idle", direction: "south", dx: 0, dy: 0,
  },
  // --- MIDDLE (Y ~580-700) ---
  {
    id: "merchant-center",
    basePath: `${PIXELLAB_CHARS}/merchant`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    x: 680, y: 600, behavior: "idle", direction: "south", dx: 0, dy: 0,
  },
  {
    id: "peasant-walker",
    basePath: `${PIXELLAB_CHARS}/peasant-man`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    x: 1100, y: 650, behavior: "walk", direction: "west", dx: -1, dy: 0,
  },
  {
    id: "blacksmith-diag",
    basePath: `${PIXELLAB_CHARS}/blacksmith`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    x: 300, y: 700, behavior: "walk", direction: "east", dx: 1, dy: 1,
  },
  // --- FRONT (Y ~780-900, closest to camera) ---
  {
    id: "child-run",
    basePath: `${PIXELLAB_CHARS}/child`,
    animation: "walk", frameCount: 6, nativeSize: 48,
    x: 500, y: 800, behavior: "walk", direction: "east", dx: 1, dy: 0,
  },
  {
    id: "peasant-woman-walk",
    basePath: `${PIXELLAB_CHARS}/peasant-woman`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    x: 1500, y: 880, behavior: "walk", direction: "west", dx: -1, dy: 0,
  },
];
```

**Design decisions:**
- 7 NPCs (down from 12) -- fewer but higher quality, each visually distinct
- noble is idle-only (south walk only)
- child uses `"walk"` not `"walking"` (different folder name in assets)
- Y positions spread across TOWN_Y_MIN(400) to TOWN_Y_MAX(950)
- Mix of walkers (5) and idle (3) for visual variety

**Step 2: Verify step compiles**

Run: `npx remotion render HookBloc1 --frames=0-1 2>&1 | tail -5`
Expected: Will fail because renderNPC still uses old interface. That's OK -- we fix it in Task 2.

---

## Task 2: Replace renderNPC with PixelLabSprite

**Files:**
- Modify: `src/projects/peste-1347-pixel/scenes/HookScene.tsx`

**Step 1: Rewrite renderNPC function**

Replace the old `renderNPC` function (lines 230-288) that uses `GridSpritesheetAnimator` with one that uses `PixelLabSprite`:

```typescript
import { PixelLabSprite } from "../components/PixelLabSprite";

// Depth scale: same formula, but with PixelLab native sizes
function renderPixelNPC(
  npc: PixelNPC,
  finalX: number,
  finalY: number,
  isWalking: boolean,
  direction: string,
  spriteFps: number,
) {
  const ds = dScale(finalY);
  // PixelLab sprites are 64x64 native (or 48x48 for child)
  // Scale factor: depth scale * base upscale
  const BASE_UPSCALE = 3.5; // slightly larger than old 3.0 since native is 64 not 32
  const sz = Math.round(npc.nativeSize * BASE_UPSCALE * ds);
  const shadowW = Math.round(sz * 0.8);
  const shadowH = Math.round(sz * 0.2);
  const GROUND_SINK = 4;

  return (
    <div
      key={npc.id}
      style={{
        position: "absolute",
        top: Math.round(finalY - sz + GROUND_SINK),
        left: Math.round(finalX - sz / 2),
        zIndex: Math.round(finalY),
      }}
    >
      {/* Shadow */}
      <div
        style={{
          position: "absolute",
          bottom: -4 + GROUND_SINK,
          left: Math.round((sz - shadowW) / 2),
          width: shadowW,
          height: shadowH,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)",
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />
      <PixelLabSprite
        basePath={npc.basePath}
        animation={isWalking && npc.animation ? npc.animation : undefined}
        direction={direction}
        frameCount={npc.frameCount}
        frameRate={spriteFps}
        displaySize={sz}
        loop
      />
    </div>
  );
}
```

**Key differences from old renderNPC:**
- Uses `PixelLabSprite` instead of `GridSpritesheetAnimator`
- No more `src`, `cols`, `rows`, `fw`, `fh`, `startRow` -- PixelLab uses folder-based frames
- `direction` is a string ("east", "west", etc.) not computed from flipX
- `BASE_UPSCALE` adjusted to 3.5 (PixelLab sprites are 64px native vs 32px for Elthen)
- Shadow and ground sink logic preserved identically

**Step 2: Remove GridSpritesheetAnimator import**

Check if `GridSpritesheetAnimator` is used anywhere else:

Run: `grep -r "GridSpritesheetAnimator" src/ --include="*.tsx" --include="*.ts" -l`

If only used in HookScene.tsx, remove the import line. If used elsewhere, leave it.

**Step 3: Verify compilation**

Run: `npx remotion render HookBloc1 --frames=0-1 2>&1 | tail -5`
Expected: Still may fail -- Scene 6/7 inline code still references old NPC fields. Fixed in Task 3.

---

## Task 3: Update Scene 6 inline rendering

**Files:**
- Modify: `src/projects/peste-1347-pixel/scenes/HookScene.tsx`

**Step 1: Update Scene 6 NPC rendering block (lines 357-387)**

Replace the Scene 6 IIFE that renders NPCs. Key changes:
- Use `PixelNPC` interface fields
- Use `npc.direction` for walk direction (not flipX)
- Step-based offset uses `npc.dx`, `npc.dy` from the new interface

```typescript
{(() => {
  const localF = frame - HOOK_SCENE_STARTS[SCENE.REVEAL];
  const charOpacity = interpolate(localF, [7, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate positions and Y-sort
  const positioned = NPCS.map((npc) => {
    const isW = npc.behavior === "walk";
    const off = isW
      ? stepOffset(localF, npc.dx, npc.dy, 8, PX_PER_STEP, SPRITE_FPS)
      : { ox: 0, oy: 0 };
    return {
      npc,
      fx: npc.x + off.ox,
      fy: npc.y + off.oy,
      isW,
    };
  });
  // Y-sort: lower Y renders first (behind)
  positioned.sort((a, b) => a.fy - b.fy);

  return (
    <div style={{ opacity: charOpacity }}>
      {positioned.map(({ npc, fx, fy, isW }) =>
        renderPixelNPC(npc, fx, fy, isW, npc.direction, SPRITE_FPS),
      )}
    </div>
  );
})()}
```

**Note:** The `stepOffset` function stays unchanged. It uses `walkFrames=8` and `IMPACT_FRAMES=[2,6]` which were calibrated for 8-frame walk cycles. PixelLab walks are 6 frames, but the stepOffset input `walkFrames` controls the step pattern, not the sprite frame count. We keep `walkFrames=8` for smooth movement and let `PixelLabSprite` handle the 6-frame loop independently. If movement feels off, we can tune `walkFrames` and `PX_PER_STEP` later.

**Step 2: Verify Scene 6 renders**

Run: `npx remotion render HookBloc1 --frames=960-970 --output=/tmp/hook-scene6-test.mp4 2>&1 | tail -5`
Expected: PASS -- Scene 6 should show PixelLab characters on the Gemini background.

---

## Task 4: Update Scene 7 exit/scatter rendering

**Files:**
- Modify: `src/projects/peste-1347-pixel/scenes/HookScene.tsx`

**Step 1: Update Scene 7 IIFE (lines 404-470)**

Same migration pattern as Scene 6. Key changes:
- Exit direction determines the `direction` prop for PixelLabSprite
- Map dx/dy to cardinal direction string for walk animation

```typescript
// Helper: convert dx/dy to PixelLab direction string
function exitDirection(dx: number, dy: number): string {
  if (dx > 0 && dy === 0) return "east";
  if (dx < 0 && dy === 0) return "west";
  if (dy < 0) return "north"; // fleeing upward
  if (dy > 0) return "south"; // fleeing downward
  // Diagonals: use horizontal component
  if (dx > 0) return "east";
  if (dx < 0) return "west";
  return "south"; // fallback
}
```

Then in the exit rendering:
```typescript
const exitPositioned = NPCS.map((npc, i) => {
  // Where NPC ended in scene 6
  const s6Off = npc.behavior === "walk"
    ? stepOffset(scene6Dur, npc.dx, npc.dy, 8, PX_PER_STEP, SPRITE_FPS)
    : { ox: 0, oy: 0 };
  const baseX = npc.x + s6Off.ox;
  const baseY = npc.y + s6Off.oy;

  // Exit scatter
  const exitDelay = 3 + (i % 6) * 2;
  const ed = EXIT_DIRS[i % EXIT_DIRS.length];
  const exitLocalF = Math.max(0, localF - exitDelay);
  const exitOff = stepOffset(exitLocalF, ed.dx, ed.dy, 8, EXIT_PX, EXIT_FPS);

  return {
    npc,
    fx: baseX + exitOff.ox,
    fy: baseY + exitOff.oy,
    dir: exitDirection(ed.dx, ed.dy),
  };
});
exitPositioned.sort((a, b) => a.fy - b.fy);

return (
  <>
    <MedievalTownBackground
      localFrame={scene6Dur + localF}
      totalDuration={scene6Dur + dur}
      darkenOverlay={darken}
    />
    <div style={{ opacity: fadeOut }}>
      {exitPositioned.map(({ npc, fx, fy, dir }) =>
        renderPixelNPC(npc, fx, fy, true, dir, EXIT_FPS),
      )}
    </div>
    <HookTextOverlay
      text="LES MEMES REFLEXES"
      mode="typewriter"
      localFrame={Math.max(0, localF - 15)}
      color={COLORS.textPrimary}
      fontSize={36}
      position="center"
    />
  </>
);
```

**Note for peasant-woman (no animation):** `renderPixelNPC` passes `undefined` as animation when `npc.animation` is empty string. `PixelLabSprite` then falls back to showing the static rotation image. During the exit, she'll show as a static sprite sliding -- this is acceptable for a short scatter sequence. If it looks bad, we can generate a walk animation for her in a follow-up.

**Step 2: Verify Scene 7 renders**

Run: `npx remotion render HookBloc1 --frames=1100-1110 --output=/tmp/hook-scene7-test.mp4 2>&1 | tail -5`
Expected: PASS

---

## Task 5: Full render + frame extraction for visual review

**Files:**
- No code changes

**Step 1: Full Hook render**

Run: `npx remotion render HookBloc1 --output=/tmp/hook-bloc1-pixellab.mp4 2>&1 | tail -10`
Expected: PASS, ~30-40 MB, 1290 frames

**Step 2: Extract key frames for comparison**

```bash
mkdir -p /tmp/hook-pixellab-frames
ffmpeg -y -i /tmp/hook-bloc1-pixellab.mp4 \
  -vf "select='eq(n,960)+eq(n,1000)+eq(n,1050)+eq(n,1100)+eq(n,1200)+eq(n,1280)'" \
  -vsync vfr /tmp/hook-pixellab-frames/frame_%03d.jpg
```

This extracts frames from scenes 6 and 7 specifically.

**Step 3: Open video for Aziz review**

Run: `open /tmp/hook-bloc1-pixellab.mp4`

**Step 4: Commit**

```bash
git add src/projects/peste-1347-pixel/scenes/HookScene.tsx
git commit -m "feat(hook): migrate scenes 6-7 NPCs from Elthen spritesheets to PixelLab characters

Replace 12 chibi 32x32 Elthen/Gothicvania sprites with 8 PixelLab 64x64
characters (peasant-man, merchant, blacksmith, monk, child, noble,
peasant-woman, plague-doctor-concept). Uses PixelLabSprite component with
individual frame PNGs instead of GridSpritesheetAnimator.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: DONE -- Peasant-woman walk animation generated

Peasant-woman now has walking animations in all 4 directions (S/W/E/N, 6 frames each).
Character ID: `99eb124f-0543-4f55-9acc-debfa293dd2f`
ZIP must be downloaded and extracted before execution.

---

## Task 7: Optional -- Tune proportions if characters feel too large/small

**Condition:** Only if Aziz feedback indicates size issues.

**What to adjust:**
- `BASE_UPSCALE` in renderPixelNPC (currently 3.5) -- decrease to 3.0 if too large, increase to 4.0 if too small
- `dScale` range (currently 0.55-1.0) -- adjust for more/less depth perspective
- Individual NPC Y positions to redistribute spacing

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| PixelLab sprites look different from Gemini background | Medium | Both are low-top-down pixel art. VillageTestScene proved they coexist. Adjust `BASE_UPSCALE` if needed. |
| peasant-woman walk animation | None | RESOLVED -- walk generated in all 4 directions (6 frames each). |
| noble only walks south | Low | Placed as idle character. During exit scatter, his walk direction is limited but short duration makes it acceptable. |
| stepOffset tuning mismatch | Low | Keep walkFrames=8 for smooth movement. If speed feels wrong, adjust PX_PER_STEP (currently 14). |
| child "walk" vs "walking" folder name | None | Already accounted for in NPC data (animation: "walk"). |

---

## Dependencies

```
Task 0 (background) -> Task 1 (NPC data) -> Task 2 (renderNPC) -> Task 3 (Scene 6) -> Task 4 (Scene 7) -> Task 5 (Full render)
                                                                                                              |
                                                                                                     Task 7 (optional tuning)
```

**Pre-requisite:** Download peasant-woman ZIP and extract animations before Task 1.

Total estimated: Tasks 0-5 are the core migration. ~30 minutes implementation + render time.
