# Remotion Project - Code Rules & Standards

## Architecture

```
src/
  Root.tsx                    -- Entry point: registers ALL compositions from ALL projects
  characters/                 -- SHARED reusable character components (SVG)
    StickFigure/
      index.tsx               -- Parent component assembling all body parts
      Head.tsx, Arm.tsx, etc. -- Individual body part components
      types.ts                -- TypeScript interfaces
      constants.ts            -- Default dimensions, colors
  animations/                 -- SHARED reusable animation functions
    idle.ts, walking.ts, etc. -- Each animation returns an AnimationPose
    types.ts                  -- AnimationPose interface
    easing.ts                 -- Standard easing curves
  components/                 -- SHARED UI components (backgrounds, text, etc.)
  projects/                   -- EACH VIDEO = ONE SUBFOLDER
    hello-world/              -- First video project
      scenes/                 -- Scene components for this video
      assets/                 -- Assets specific to this video
      storyboard.md           -- Storyboard for this video
      art-direction.md        -- Art direction for this video
    [future-project]/         -- Next video project (same structure)
public/                       -- Global static assets (fonts, shared images)
out/                          -- Rendered output (MP4, WebM)
```

## Coding Standards

### TypeScript
- Strict mode enabled
- No `any` types
- All components must have typed props
- Use interfaces, not type aliases for component props

### React/Remotion Patterns
- All compositions registered in `src/Root.tsx`
- Use `useCurrentFrame()` for frame-based animations
- Use `useVideoConfig()` for fps-aware timing
- Use `<Sequence>` for timeline management
- Use `spring()` for physics-based motion (preferred over linear interpolation)
- Use `interpolate()` with `extrapolateRight: "clamp"` to prevent overshooting

### SVG Characters
- All characters built as SVG `<g>` groups
- Use `transformBox: "fill-box"` for correct rotation pivots
- Body parts as separate components for independent animation
- Rotation angles in degrees, applied at joint points (shoulder, hip)

### Animation Functions
- Each animation is a pure function: `(frame, fps, options?) => AnimationPose`
- AnimationPose contains rotation values for all limbs + position offsets
- Use cyclical patterns for looping animations (walking, idle)
- Never hardcode fps values - always use the fps parameter

### File Organization
- One component per file
- Group related files in folders (characters/, animations/, scenes/)
- Constants in dedicated files, not inline
- Re-export from index.ts files

### No Emojis in Code
- Strictly forbidden in .ts, .tsx, .js, .json, .yaml, .env files
- Allowed only in .md and .txt files

## Video Defaults

- Resolution: 1920x1080 (Full HD)
- FPS: 30
- Codec: H.264 (MP4)
- Background: Light pastel colors (#87CEEB sky, #90EE90 ground)
- Character color: Dark (#2d3436) on light backgrounds
