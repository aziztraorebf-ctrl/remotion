> ⚠️ **THIS DOCUMENT DESCRIBES THE PREVIOUS BUILD (pre 2026-09-04).**
> The client rejected the hand-drawn SVG casing on 2026-09-04 and asked to move forward from the
> rustic/weathered meter image instead. The device is being rebuilt on that image as its base,
> with the animated layers (gauge segments, power LED, button labels, screen glow) composited on
> top. The sections below about the casing, the metal finishes and the frost-free base are
> **out of date** and will be rewritten before the next delivery.
> Internal reference for the rebuild: `memory/starters/STARTER-chill-meter-device-rustique.md`

# Max Chill Factor Meter — Source Project

Animated overlay for the **AbiGirl Reacts** YouTube channel.

This folder contains the complete source used to produce the delivered `.mov` overlay files.
It is a standard [Remotion](https://www.remotion.dev) project (React + TypeScript). Nothing here is
proprietary or locked to a service: any React developer can open it, change it, and re-export.

---

## What you received

| File | What it is |
|---|---|
| `ChillMeter-Entrance.mov` | Device slides in, lands, powers on |
| `ChillMeter-Idle.mov` | Resting loop — soft glow, no score change |
| `ChillMeter-Fill25.mov` | Fills 0 → 25%, meter only |
| `ChillMeter-Fill50.mov` | Fills to 50%, frost grows on the device |
| `ChillMeter-Fill75.mov` | Fills to 75%, bottom-edge screen effect |
| `ChillMeter-Fill100.mov` | Full payoff — shock wave, all four edges |

All exports are **1920×1080 full-frame Apple ProRes 4444 with true alpha transparency**.

### Dropping them into CapCut

1. Import the `.mov` and drop it on a track **above** your footage.
2. **Do not reposition or resize it.** The meter is already placed inside a full-screen frame, so it
   lands in the exact same spot every time.
3. If the meter disappears from your preview, it was accidentally dragged. Select the clip and reset
   **Transform** (or set X = 0, Y = 0). The file is fine — a full-frame overlay moves with a single
   stray drag.

Where no clip plays underneath, the overlay shows against the project's black background. That black
is the empty timeline, not part of the file.

---

## Running the source

Requires [Node.js](https://nodejs.org) 20 or newer (built and tested on v25.6.0).

```bash
npm install
npx remotion studio
```

The studio opens in your browser. Every meter state lives in the **RND-ChillMeter** folder — click one
to preview it and scrub through the timeline.

### Re-exporting a file

```bash
npx remotion render ChillMeter-Fill100 out.mov \
  --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
```

Replace `ChillMeter-Fill100` with whichever state you want.

> **All three flags are required.** Without `--pixel-format`, ProRes silently falls back to a format
> with **no transparency** — no error, just an opaque file. Without `--image-format=png`, the render
> throws. To confirm a finished file has alpha:
> ```bash
> ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of csv=p=0 out.mov
> ```
> It must print `yuva444p12le` — the `a` is the alpha channel.

---

## How the files are organised

```
src/projects/_rnd/chill-meter/
├── ChillMeterDevice.tsx    the device itself — casing, screen, bar, buttons, power light
├── ChillMeterOverlay.tsx   places the device in the 1920×1080 frame, drives each state
├── GivrePlanche.tsx        the frost artwork — crystals, shards, ice flowers
├── chill-meter-mix.svg     source vector artwork for the device
└── givre-mix.svg           source vector artwork for the frost
```

`ChillMeterOverlay.tsx` is the one to open first. It takes a single `state` prop and everything else
follows from it.

## Common changes

Every adjustment below is a value change, not a re-render from scratch — the animation is code, so
the rest of the shot stays identical.

| You want | Where | What to change |
|---|---|---|
| Move the meter | `ChillMeterOverlay.tsx` | `POS_X` / `POS_Y` (top-left corner, in pixels) |
| Make it bigger or smaller | `ChillMeterOverlay.tsx` | `SCALE` — currently `0.52` |
| More or less frost | `ChillMeterOverlay.tsx` | the `frost` value inside each state block |
| Longer or shorter animation | `src/Root.tsx` | `durationInFrames` on that state's `<Composition>` |
| Change the score a state fills to | `ChillMeterOverlay.tsx` | the `chill` target inside that state block |

Everything runs at **30 fps**, so 30 frames = 1 second.

---

## A note on the design

The device follows the reference image from the brief: the 0–100 scale, the horizontal bar,
**AbiGirl Reacts** on top, **MAX CHILL DETECTION** underneath, the green power button, and the icy
blue palette.

The base meter is deliberately **clean, not frosted**. Frost is what grows as the score climbs — at
50% it forms on the device, at 75% it reaches the bottom edge of the screen, and at 100% it takes all
four edges. Starting frosted would leave the progression nowhere to go.
