# Remotion Patterns — Batch Short Production

## Component Architecture

Each Short is a single component in `src/projects/geoafrique-shorts/`.

```tsx
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { OffthreadVideo } from "remotion";

// Composition config: 1080x1920, 30fps, totalFrames from timing.json
export const MyShort: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Audio — single track, full duration */}
      <Audio src={staticFile("audio/project/voixoff-final.mp3")} />

      {/* Beat segments — one Sequence per beat */}
      <Sequence from={0} durationInFrames={360}>
        <ClipBeat clipFile="clips/frame-01.mp4" playbackRate={0.83} />
        <TextOverlay text="Dakar, 1944" position="bottom-left" />
      </Sequence>

      <Sequence from={360} durationInFrames={300}>
        <ClipBeat clipFile="clips/frame-02.mp4" playbackRate={0.80} />
      </Sequence>

      {/* GEO beat — Remotion SVG instead of clip */}
      <Sequence from={1380} durationInFrames={360}>
        <MapSegment
          targetCountry="Senegal"
          targetCity="Dakar"
          counter={{ from: 0, to: 400000, label: "tirailleurs" }}
        />
      </Sequence>

      {/* ... more beats ... */}

      {/* Cinematic vignette — always on top */}
      <CinematicVignette />
    </AbsoluteFill>
  );
};
```

---

## OffthreadVideo Pattern (I2V Clips)

3 rules NON-NEGOTIABLE:

1. `<OffthreadVideo>` ONLY — never `<Video>` (headless render = black frames)
2. MUST be inside `<Sequence from={...}>` — without it, frame overrun = freeze on last frame
3. Always `muted` — Kling/Seedance generate unwanted ambient audio

```tsx
const ClipBeat: React.FC<{
  clipFile: string;
  playbackRate: number;
  scale?: number;
}> = ({ clipFile, playbackRate, scale = 1.03 }) => {
  const frame = useCurrentFrame();

  // Slow zoom for subtle motion
  const currentScale = interpolate(
    frame, [0, 300], [1.0, scale],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <OffthreadVideo
      src={staticFile(clipFile)}
      playbackRate={playbackRate}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${currentScale})`,
      }}
    />
  );
};
```

### playbackRate Guide

| Clip duration | Beat duration | playbackRate | Quality |
|--------------|---------------|-------------|---------|
| 10s | 12s | 0.83 | Natural, recommended |
| 10s | 10s | 1.0 | Perfect match |
| 10s | 15s | 0.67 | Acceptable slow-mo |
| 5s | 12s | 0.42 | Too slow, avoid |
| 5s | 7s | 0.71 | Acceptable |

Target: 0.7 - 1.0. Below 0.5 = unnatural slow-motion.

---

## Seedance Lip Sync Pattern

Seedance clips with lip sync need audio offset (~9 frames / 0.3s):

```tsx
<Sequence from={beatStart} durationInFrames={beatDuration}>
  {/* Video — stripped of audio via ffmpeg */}
  <OffthreadVideo
    src={staticFile("clips/seedance-silent.mp4")}
    playbackRate={1.0}
    muted
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
</Sequence>

{/* Audio — offset for lip sync alignment */}
<Sequence from={beatStart + 9} durationInFrames={beatDuration - 9}>
  <Audio src={staticFile("audio/beat-dialogue.mp3")} />
</Sequence>
```

---

## Text Overlay Pattern

All text (dates, names, quotes) is Remotion post-production. NEVER in source frames.

```tsx
const TextOverlay: React.FC<{
  text: string;
  position?: "top" | "bottom-left" | "center";
  opacity?: number;
  fontSize?: number;
}> = ({ text, position = "bottom-left", opacity = 0.9, fontSize = 48 }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 15], [0, opacity], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const positionStyles: Record<string, React.CSSProperties> = {
    "top": { top: 120, left: 80, right: 80 },
    "bottom-left": { bottom: 400, left: 80 },
    "center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  };

  return (
    <div style={{
      position: "absolute",
      ...positionStyles[position],
      color: "#F5E6C8",
      fontSize,
      fontFamily: "serif",
      fontWeight: "bold",
      opacity: fadeIn,
      textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
    }}>
      {text}
    </div>
  );
};
```

### Safe Zones (Short 9:16 — TikTok/YouTube/Reels)

```
Top    : 120px  (profile bar, live indicator)
Bottom : 340px  (nav, caption, CTA buttons)
Left   :  80px  (margin)
Right  : 140px  (like / comment / share / follow)
```

Text overlays MUST stay within safe zones. No static content below Y=850.

---

## Map / Geography Pattern (Remotion SVG)

For GEO beats — animated map with d3-geo + TopoJSON:

```tsx
import { geoMercator, geoPath } from "d3-geo";
import topojsonData from "./countries-50m.json";

const MapSegment: React.FC<{
  targetCountry: string;
  targetCity: string;
  counter?: { from: number; to: number; label: string };
}> = ({ targetCountry, targetCity, counter }) => {
  const frame = useCurrentFrame();

  // Animated zoom: Africa wide -> target country -> target city
  const zoomLevel = interpolate(frame, [0, 120, 240], [1, 3, 8], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Animated counter
  const count = counter ? Math.round(
    interpolate(frame, [120, 300], [counter.from, counter.to], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  ) : null;

  // ... d3-geo projection + SVG rendering
  // Use CSS transform for zoom (NEVER d3 re-projection per frame)
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920">
        <g transform={`translate(540,960) scale(${zoomLevel}) translate(-540,-960)`}>
          {/* country paths */}
        </g>
        {/* Pulsing marker on target city */}
        {/* Animated counter */}
      </svg>
    </AbsoluteFill>
  );
};
```

Key rules:
- Zoom via CSS transform — NEVER d3 re-projection per frame (performance killer)
- Pulsing marker: `opacity: Math.sin(frame * 0.15) * 0.3 + 0.7`
- Counter: `interpolate()` between start and end values
- No text in the map SVG from Gemini. All labels added by Remotion.

---

## Cinematic Vignette

Always on top layer for film look:

```tsx
const CinematicVignette: React.FC = () => (
  <div style={{
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
    pointerEvents: "none",
  }} />
);
```

---

## Render Command

```bash
# Full render
npx remotion render src/index.ts [CompositionName] out/[name]-final.mp4

# Preview specific frames (mini-render for validation)
npx remotion render src/index.ts [CompositionName] out/[name]-preview.mp4 --frames=0-150
```
