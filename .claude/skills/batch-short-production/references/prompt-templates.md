# Prompt Templates — Batch Short Production

## Gemini Storyboard 3x3

### Structure

```
Role: expert storyboard artist for animated historical documentary
Subject: [SUBJECT DESCRIPTION — 2-3 sentences, key narrative beats]
Style: 2D vivid flat illustration, [PALETTE DESCRIPTION per project]
Format: 3x3 grid, each cell = one scene for 9:16 vertical video

CRITICAL CONSTRAINT -- NO TEXT IN ANY FRAME (NON-NEGOTIABLE):
- ZERO text, numbers, dates, labels, stamps, titles visible in any frame
- All text elements will be inserted in post-production via Remotion
- [For each frame that would "naturally" contain text: describe what to show INSTEAD]
  Example: Instead of "1944" on screen, show a wax seal being pressed / calendar page turning / seasons changing

For each of the 9 frames, describe:
- Frame N: [narrative description] [camera angle] [key visual elements]
  Duration target: [Xs from timing.json]

Additionally, output 9 video animation prompts (one per frame),
each describing the motion, camera movement, and atmosphere for I2V generation.
```

### Palette — Adapt Per Project

The palette is NOT fixed. Derive it from the script's tone, era, and geography.
Only constant: "2D vivid flat illustration".

Examples from past projects:
- Thiaroye 1944: sepia, gold, charcoal tones, warm earth, dark shadows
- Abou Bakari II: deep black background, warm gold accents, terracotta, cream highlights
- Amanirenas: navy blue, gold, desert sand, terracotta red

For a new project: ask Aziz or propose a palette based on the subject matter.

---

## I2V Clip Prompts — By Shot Type

### Close-Up / Portrait

```
[CHARACTER DESCRIPTION] in extreme close-up.
[ACTION VERB: TURNS head, CLENCHES jaw, BREATHES deeply, BLINKS slowly].
Camera: slow dolly in, shallow depth of field.
Lighting: [warm golden / cold blue / dramatic side-light].
Style: 2D vivid flat illustration, [palette].
```

Dynamic keywords: TURNS, CLENCHES, BREATHES, STARES, NARROWS eyes, PRESSES lips

### Wide Shot / Atmosphere

```
[SCENE DESCRIPTION] wide establishing shot.
[ENVIRONMENTAL MOTION: wind WHIPS through trees, dust SWIRLS, waves CRASH, clouds DRIFT].
Camera: slow pan [left/right] OR static with environmental motion.
Style: 2D vivid flat illustration, [palette].
```

Dynamic keywords: WHIPS, SWIRLS, CRASH, DRIFT, FLUTTER, BILLOW, RIPPLE

### Group / Multiple Characters

```
[GROUP DESCRIPTION] in medium shot.
[GROUP ACTION: soldiers MARCH in formation, crowd PUSHES forward, warriors RAISE shields].
Camera: tracking shot following the group OR dolly out revealing scale.
[KEY DETAIL: wind in clothing, dust from footsteps, weapons catching light].
Style: 2D vivid flat illustration, [palette].
```

Dynamic keywords: MARCH, PUSH, RAISE, RUSH, CHARGE, GATHER, SCATTER

### Emotional / Symbolic

```
[SYMBOLIC DESCRIPTION — e.g., hands pressing a seal, document burning, flag rising].
[MICRO-MOTION: fingers PRESS firmly, flames LICK edges, fabric RIPPLES].
Camera: extreme close-up OR slow dolly in.
Atmosphere: [tense / solemn / triumphant / melancholic].
Style: 2D vivid flat illustration, [palette].
```

### Map / Geography

If using I2V on a Gemini-generated map frame:
```
Animated map of [REGION]. Camera slowly ZOOMS IN from continental view to [TARGET LOCATION].
Borders GLOW as camera passes. [ROUTE or TERRITORY] ILLUMINATES progressively.
Style: 2D vivid flat illustration, [palette]. Geographic accuracy maintained.
NO text, labels, or place names visible.
```

If Remotion-only: use d3-geo + TopoJSON with animated zoom, pulsing markers, counters.

---

## Negative Prompt (ALWAYS include for I2V)

```
text, writing, letters, numbers, dates, subtitles, captions, watermark, signature,
title, label, stamp, typography, words, digits, calendar, timestamps,
photorealistic, 3D render, CGI
```

---

## Seedance Prompt Formats

### Format 1: Narrative Linear (~40 words, simple scenes)

```
Camera follows [CHARACTER] as they [ACTION]. The wind [DETAIL].
[CHARACTER] [EMOTION/GESTURE]. The shot slowly [CAMERA MOVEMENT].
COLOR GRADE: [palette description].
```

### Format 2: Shot-by-Shot (~75 words, multi-shot control)

```
Shot 1: [DESCRIPTION + CAMERA + DURATION]
Shot 2: [DESCRIPTION + CAMERA + DURATION]
Shot 3: [DESCRIPTION + CAMERA + DURATION]
COLOR GRADE: [palette description].
```

### Format 3: Second-by-Second (~200 words, maximum control)

```
SECONDS 0 TO 4: [DETAILED DESCRIPTION + CAMERA]
SECONDS 4 TO 8: [DETAILED DESCRIPTION + CAMERA]
SECONDS 8 TO 12: [DETAILED DESCRIPTION + CAMERA]
SECONDS 12 TO 15: [DETAILED DESCRIPTION + CAMERA]
COLOR GRADE: [palette description].
```

---

## Anti-Patterns in Prompts

- NEVER "atmospheric movement only" — produces near-static clips
- NEVER "subtle", "gentle", "slow" unless the beat is explicitly calm
- NEVER include text, dates, or numbers in the visual description
- NEVER "the camera stays still" — at minimum use slow zoom or drift
- "NOT slow NOT gentle" can be added to override default stillness
