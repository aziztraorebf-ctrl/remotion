---
name: batch-short-production
description: >
  Produce YouTube Shorts (9:16) from a validated script. Pipeline: ElevenLabs
  audio, ffprobe timing, Gemini 3x3 storyboard, I2V clips (Kling/Seedance/any),
  corrections, Remotion assembly, Vercel Blob review. Chains after
  youtube-scriptwriting. Use when Aziz has a script ready and wants to produce
  the full Short.
---

# Batch Short Production Pipeline

Takes a validated script (from `youtube-scriptwriting` skill or Aziz directly)
and produces a complete YouTube Short (9:16, 60-120s) through 8 automated phases
with 4 human checkpoints.

## PREREQUISITES

- **Input**: Script final valide (structure beats, texte mot-a-mot)
- **Format**: Short vertical 9:16 (1080x1920) UNIQUEMENT
- **API keys in .env**: `ELEVENLABS_API_KEY`, `GEMINI_API_KEY`, `FAL_KEY`, `BLOB_READ_WRITE_TOKEN`, `MOONSHOT_API_KEY` (for Kimi review)
- **Tools**: ffprobe, Python 3.10+, PIL/Pillow, fal_client, remotion CLI

## PIPELINE — 8 Phases

### Phase 1: KIMI SCRIPT REVIEW (~$0.005)

BEFORE audio generation. Send script V1 to Kimi K2.5 for narrative review.

**Execute**: `python scripts/batch-short-production/kimi-script-review.py --script <file> --review-only`

Kimi evaluates: hook strength, pacing, narrative structure, weaknesses.
Returns score /10 + concrete modifications (with before/after text).

Rules:
- Iterate script with Kimi until Aziz is satisfied. This is CHEAP (~$0.005/pass).
- Kimi's suggestions are PROPOSALS — Aziz decides what to apply.
- Script is LOCKED after this phase. No changes after audio generation.

> **CHECKPOINT AZIZ**: "Voici les suggestions de Kimi. Quelles modifications tu veux appliquer ?"
> Iterate until script is final. THEN proceed to audio.

**Output**: `[project]/kimi-script-review.md` + script final

### Phase 2: AUDIO

Generate voice-over from the FINAL script (locked after Phase 1).

**Execute**: `python scripts/batch-short-production/generate-audio.py --script <file>`

Parameters (documentary style, validated 2026-03-29):
- Voice: Narratrice GeoAfrique V3 `Y8XqpS6sj6cx5cCTLp8a`
- Model: `eleven_v3`
- stability: 0.25, similarity_boost: 0.75, style: 0.40, speed: 0.88
- Tags: `[pause]`, `[long pause]`, `[drawn out]`, MAJUSCULES = emphasis

Rules:
- Max 3 iterations. If the voice doesn't work after 3, ask Aziz to adjust the script text.
- NEVER cut audio with ffmpeg to remove a phrase. Regenerate without the phrase.
- Speed 0.88 adds ~40% to script duration. A 75-word script = ~60s audio, 110 words = ~90s.

> **CHECKPOINT AZIZ**: "L'audio te convient ? Ecoute le lien : [Vercel Blob URL]"
> Proceed ONLY after explicit approval.

**Output**: `[project]/audio/voixoff-final.mp3`

### Phase 3: TIMING

Extract precise beat timestamps from the approved audio.

**Execute**: `python scripts/batch-short-production/extract-timing.py --audio <file>`

Process:
1. ffprobe total duration
2. Whisper or manual segmentation into narrative beats
3. For each beat: start_time, end_time, duration, clip_duration_target

Duration matching rule:
- Beat duration > 7s -> `clip_duration: "10"`
- Beat duration <= 7s -> `clip_duration: "5"`
- Target playbackRate: 0.75-1.0 (natural). NEVER below 0.5 (unnatural slow-mo).

**Output**: `[project]/timing.json`

### Phase 4: KIMI ARTISTIC DIRECTION (~$0.01-0.02)

Send script + timing + clip structure to Kimi K2.5 as artistic director. This is the
most impactful phase for visual quality. Kimi challenges every visual choice BEFORE
generation, proposes alternatives, and ensures narrative continuity between clips.

**Execute**: `python scripts/batch-short-production/kimi-da-review.py --script <file> --timing <file> --clips <N>`

The brief sent to Kimi MUST include these 4 sections:

#### Section 1: Generator Constraints (MANDATORY)

Kimi must work WITHIN the technical limits of whatever video generator is used.
These constraints prevent Kimi from proposing impossible shots.

Include for ANY generator:
- Max duration per clip (e.g. 15s for Seedance, 10s for Kling)
- Max scenes per clip (e.g. 2-3 for Format 6)
- Supported transition types (e.g. slow-mo orbital for Seedance)
- Style anchor (e.g. "2D vivid flat illustration style")
- Anti-instructions (e.g. "No text, no banners")
- Literal interpretation rules (what you write = what you get)
- Max distinct characters per clip (2-3 typically)
- Dynamic verb requirements (generator-specific)

If using Seedance: load `memory/tools/seedance-rules.md` and include the 27 rules as constraints.
If using Kling: load `memory/tools/kling.md` and include cfg_scale, duration, format rules.
If using another generator: describe its limits explicitly in the brief.

#### Section 2: Moral/Tonal Guidelines

Every project has a tone. Kimi must respect it.

Include:
- What to AVOID (e.g. caricature, diabolization, victimization)
- What to PREFER (e.g. systemic injustice over individual cruelty, dignity over pathos)
- Level of violence/sensitivity appropriate for the platform (YouTube, TikTok, etc.)

Example: "Show systemic bureaucratic violence, not individual cruelty. The spectator
should feel the injustice without being told who is the villain."

#### Section 3: Frame Chaining (MANDATORY)

Each clip will be generated in sequence. The last frame of clip N becomes the
reference image for clip N+1. This guarantees visual continuity.

Rules for Kimi to follow:
- Last ~2 seconds of each clip = STABLE IMAGE, quasi-static, composed like a painting
- No fast movement at end of clip (last frame must be extractable as ref)
- The final visual element of clip N must LOGICALLY introduce clip N+1
- Each clip ending must contain a BRIDGE ELEMENT (object, place, light, character)
  that is ALSO present at the start of the next clip
- **CRITICAL**: The bridge element must be DESCRIBED IN THE PROMPT ITSELF, not just
  in the metadata. Example: if the bridge is "a folded letter", the prompt must contain
  "the folded letter REMAINS visible at center frame" AND the next clip must start with
  "the same folded letter from previous frame now..."
- Each Scene 2 must end with "[element] REMAINS completely still for the final 2 seconds"

Good bridges: same object in new context, same framing with new content, same character in new place.
Bad bridges: interior->exterior with no shared element, different characters with no link.

For each clip, Kimi must provide:
- `BRIDGE TO NEXT CLIP:` — the shared visual element
- `LAST FRAME:` — exact description of the final extractable image

#### Section 4: GeoAfrique Visual Identity (MANDATORY)

Include the visual identity system in the brief so Kimi applies it natively.

**Chromatic Contrast (OBLIGATORY — 1 to 2 clips per Short)**:
- 1 subject in ONE dominant color, rest of world desaturated (grey/sepia/monochrome)
- Place at the strongest narrative moments (hook, climax, or conclusion)
- The contrast is a COLOR TREATMENT on natural tones (skin, fabric, environment)
  — NOT a magical aura, glow, or special effect
- Kimi must justify WHY each chosen clip gets the contrast and why others don't

**Geographic Palettes (RECOMMENDED)**:
- West Africa: gold + indigo + terre rouge (accent: gold)
- East Africa: green + ochre + sky blue (accent: green)
- Central Africa: deep green + red + black (accent: red)
- North Africa: white + blue + sand (accent: blue)
- Southern Africa: burnt earth + orange + grey (accent: orange)
- Modern/geopolitical: desaturated + 1 neon accent (accent: neon)
- Pan-African: green-yellow-red (accent: yellow)

**Temporal Split (OPTIONAL)**: only if the subject explicitly opposes past and present. Justify.

#### Section 5: Kimi Output Quality Rules (MANDATORY)

Kimi must follow these rules when writing his DIRECTION BRIEF (NOT Seedance prompts):

- **Output format**: Kimi produces a NARRATIVE DIRECTION per clip, NOT a Seedance prompt.
  He describes: the emotional arc, the key actions, the objects present, the color treatment,
  the bridge elements. Claude converts this into Format 3 SECONDS prompts.
- **Bridge elements**: each clip must specify a BRIDGE OBJECT that connects to the next clip
- **Chromatic contrast = color treatment**: describe which elements KEEP their natural
  warm tones and which elements DESATURATE to grey. NOT "golden aura", "glowing", "beacon".
  (Seedance renders light metaphors as literal magical halos in 2D flat style.)
- **Emotional progression**: Kimi specifies the EMOTION of each segment, not camera moves
- **COLOR GRADE direction** per clip (palette, not Seedance syntax)
- **Sound design direction** per clip (mood, not Seedance syntax)

**IMPORTANT**: Kimi's output goes to Claude for dynamisation (Phase 4c), NOT directly to Seedance.
The old approach (Scene 1 / Transition / Scene 2 prompts from Kimi) produced static, contemplative
videos scored 3-5/10. The new approach (Kimi direction -> Claude Format 3 SECONDS) scores 9-9.5/10.

#### Section 6: Full Script + Clip Structure

Include the complete script with timestamps + the clip breakdown table (which clip
covers which narration segment). Kimi needs the FULL picture to judge continuity.

Also include: what the clip BEFORE and clip AFTER each segment contain (context).

#### Kimi Output Format

For each clip, Kimi returns:
1. The complete prompt ready to paste into the generator
2. `BRIDGE TO NEXT CLIP:` line
3. `LAST FRAME:` line
4. If chromatic contrast is used: WHY this clip

Plus a global analysis:
- **Chromatic progression**: does the palette evolve logically across all clips?
- **Visual redundancies**: are two clips using the same motif? (eliminate)
- **Narrative gaps**: is any part of the script visually unrepresented?
- **Arc coherence**: does the emotional arc (visual) match the script (audio)?
- **Chromatic contrast placement**: which clips and WHY (1-2 per Short)

#### Iteration Protocol

1. First pass: Kimi produces all prompts with visual identity applied
2. User (Aziz) reviews, gives feedback (tone, nuance, preferences)
3. If changes needed: send FULL brief again with feedback appended. Never partial.
4. MAX 3 iterations. After 3, lock the prompts and move to verification.

Cost: ~$0.01-0.02 per full pass (7 clips). Total Phase 4 budget: ~$0.05 max.

Rules:
- Kimi's proposals are SUGGESTIONS — Aziz decides what to adopt
- Every prompt must be COMPLETE and ready to paste (no fragments)
- Kimi must respect the clip breakdown (don't merge or split clips without asking)
- Generator constraints are NON-NEGOTIABLE — Kimi cannot override them
- Every iteration sends the FULL brief, not partial updates (Kimi has no memory)

> **CHECKPOINT AZIZ**: "Voici la direction artistique de Kimi. Tu valides les prompts ?"
> Iterate until Aziz approves all prompts. THEN proceed to verification.

**Output**: `[project]/kimi-da-prompts-raw.md` (all prompts from Kimi)

### Phase 4c: CLAUDE DYNAMISATION (NON-NEGOTIABLE)

Claude rewrites Kimi's narrative direction into production-ready Seedance prompts.
This is the step that makes the difference between 3/10 and 9.5/10 videos.

**Input**: Kimi DA brief (vision narrative per clip)
**Output**: Format 3 SECONDS prompts ready to paste into Dreamina

**Rules for Claude (EVERY prompt):**

| # | Rule | Explanation |
|---|------|-------------|
| 1 | **Format 3 SECONDS X TO Y** | 4 segments of 3-4s each for 15s clips. NEVER Scene 1 + Transition + Scene 2. |
| 2 | **Verbes explosifs** | SLAMS, SURGES, DROPS, SNAPS, SWEEPS, CRASHES, CUTS, PUSHES. NEVER "stands", "holds", "slowly moves". |
| 3 | **3-4 mouvements camera VARIES** | aerial, snap zoom, dolly, sweep, pull back, tilt. NEVER orbital-only. |
| 4 | **Micro-actions CHAQUE segment** | Wind, dust, seagulls, rigging, flags, hair, clothing, expressions. Zero static frame. |
| 5 | **ZERO metaphore lumineuse** | "beacon", "glow", "catches light", "radiant" = magical halo in 2D flat. Use "contrasts sharply", "the only [color] object". |
| 6 | **Pas de changement d'echelle brutal** | Medium → close-up mains = morphing. Stay at consistent scale or change gradually. |
| 7 | **Anti-instructions en en-tete** | "@Image1 is the style reference. 2D vivid flat illustration style, vertical 9:16." + anti-text + anti-rotation |
| 8 | **COLOR GRADE en fin** | Palette precise, ONLY on [elements], cold [color] on everything else. |
| 9 | **Sound effects en fin** | Concrete sounds, not mood descriptions. |
| 10 | **Personnages differencies** | Chaque personnage a une action DISTINCTE (cross arms, shift weight, turn head, clench fists). |
| 11 | **Environnement vivant** | Le decor BOUGE : vent, fumee, poussiere, drapeaux, oiseaux, ombres qui bougent. |
| 12 | **Fins stables mais apres crescendo** | Les 2 dernieres secondes sont calmes, mais les 13 premieres sont dynamiques. |

### Phase 4d: GEMINI REF STYLE (1 image par clip)

Generate a style reference image for each clip via Gemini 3.1 Flash.

**Script**: `scripts/generate-thiaroye-styleref.py` (adapt PROMPT per clip)
**Input**: `frame-03.jpg` (style anchor) + scene description
**Output**: 1 image 9:16 per clip in `tmp/[project]-styleref/`

Why: Without a ref image, Seedance defaults to photorealism even with "2D flat" in text.
Validated 2026-04-05: test without ref = photorealistic (3/10), with ref = flat BD style (9.5/10).

### Phase 4e: PROMPT VERIFICATION (automated)

Final check on Claude's Format 3 SECONDS prompts before generation.

**Checklist (for each clip):**

| # | Check | What to look for |
|---|-------|-----------------|
| 1 | Format | Is it SECONDS X TO Y? (NOT Scene 1 / Transition / Scene 2) |
| 2 | Verbes | Count explosive verbs per segment. Minimum 2 per segment. |
| 3 | Camera | Are there 3+ DIFFERENT camera movements? (not just orbital) |
| 4 | Anti-instructions | "@Image1" + "No text, no banners..." + "No unnecessary 360" present? |
| 5 | No light metaphors | ZERO "beacon", "glow", "catches light", "radiant", "shining"? |
| 6 | No scale jumps | No medium-to-extreme-close-up in consecutive segments? |
| 7 | COLOR GRADE | Section present at end? Uses "ONLY on" + "everything else"? |
| 8 | Sound effects | Section present at end? |
| 9 | Bridge elements | Kimi's bridge objects preserved in the prompt? |
| 10 | No text-generating | No "labeled with", "marked with", "numbered"? |
| 11 | Personnages | Each character has a DISTINCT action? |
| 12 | Environment | Moving elements in the background? (wind, smoke, dust, flags) |

**If errors found**: fix directly.
**If no errors**: proceed to generation with ref images.

**Output**: `[project]/kimi-da-prompts-final.md` (verified prompts, ready to use)

### Phase 5: STORYBOARD

Generate visual frames for each beat. Use Kimi's simplified descriptions as input.

**Execute**: `python scripts/batch-short-production/generate-storyboard.py --kimi-brief <file> --style <style> --output-dir <dir>`

Method: INDIVIDUAL frames via Gemini (one API call per beat). NO grid.
Each frame is generated at native resolution — no cropping, no upscaling needed.
Alternative: Aziz provides custom reference images for some or all beats.

Beat types (Claude identifies from the script):
- **NARRATIVE**: character scene, action, emotion -> standard I2V
- **GEO**: map, geography, route, territory -> Gemini map frame. Two options:
  - I2V animation (simple zoom/pan on map) -- propose first
  - Remotion SVG animation (d3-geo, markers, counters, route tracing) -- if I2V insufficient
- **SYMBOLIC**: metaphor, split-screen, comparison -> may be Remotion-only

Beat strategy (determines what to generate):
- **NARRATIVE / ACTION beats**: generate I2V clips. Always 5-6s clips. A 12s beat = 2 clips of 6s chained in Remotion with hard cut. Gives natural rhythm.
- **GEO / MAP beats**: Gemini generates blank map image + Remotion animates on top (zoom, arrows, markers, counters, route tracing). Costs 0 I2V credits. Use for 10-15s contemplative beats. Every Short should have 1-2 geo beats for visual contrast.
- **SYMBOLIC beats**: Remotion pure or single I2V clip depending on complexity.
- Target ratio per 90s Short: ~6-7 I2V clips (5-6s each) + 1-2 Remotion geo segments (10-15s each).

Rules:
- NO TEXT in any frame. Hardcoded in Gemini prompt + Kling negative_prompt.
  Reimagine any beat that would "naturally" contain text (dates, labels, titles).
- Style: always "2D vivid flat illustration" as base. Palette varies per project — ask Aziz or derive from the script's tone/era/geography. Do NOT default to sepia/gold/charcoal.
- Gemini is excellent at map/geography frames. Use blank maps — all annotations added by Remotion.

Post-generation:
- Extract individual frames from grid (PIL crop, 336x336 per cell)
- Gemini editorial fix on cloned faces or artifacts if needed

> **CHECKPOINT AZIZ**: "Voici les 9 frames. Lesquelles sont OK, lesquelles a refaire ?"
> Show frames via Vercel Blob gallery.

**Output**: `[project]/frames/frame-01.png` to `frame-NN.png`

### Phase 6: CLIPS VIDEO

Generate I2V clips from approved frames. Generator-agnostic: Kling, Seedance, or any future tool.

**Execute**: `python scripts/batch-short-production/generate-clips.py --frames-dir <dir> --timing <file>`

For current generators, see `references/api-reference.md` for endpoints and parameters.

Model selection guide (by beat type):
- Close-up / portrait / texture -> highest quality model (e.g. Kling V3 Pro)
- Wide shot / atmosphere -> standard model (e.g. Kling V3 Std)
- Group / multiple characters -> model with best multi-subject coherence (e.g. Kling O3 Std)
- Close-up with lip sync -> Seedance 2.0 via Dreamina (strip audio in post)

Prompt rules:
- DYNAMIC by default: action verbs ("PRESSES", "MARCH", "RUSHES", "TURNS"), camera cues ("tracking shot", "dolly in", "handheld")
- NEVER "atmospheric movement only", "subtle", "gentle" unless explicitly calm scene
- Negative prompt ALWAYS includes: "text, writing, letters, numbers, dates, subtitles, captions, watermark"
- Duration = clip_duration_target from timing.json
- For prompt templates by shot type, see `references/prompt-templates.md`

Post-generation:
- Budget 1-2 regenerations per batch (cloned faces, lifted seals, static clips)
- Seedance clips: strip audio with `ffmpeg -an -c:v copy` before Remotion integration

> **CHECKPOINT AZIZ**: "Review les clips. Lesquels sont OK ? Lesquels a refaire ?"
> Upload all clips to Vercel Blob gallery for mobile review.

**Output**: `[project]/clips/frame-01.mp4` to `frame-NN.mp4`

### Phase 7: CORRECTIONS

Fix rejected clips from Phase 6.

Methods (try in this order):
1. **Re-prompt**: Adjust the prompt (more dynamic verbs, different camera angle) and regenerate
2. **Gemini editorial**: Fix the source frame (diversify faces, remove artifacts) then regenerate clip
3. **Remotion-only**: Replace the beat with pure Remotion (SVG map, split-screen, text animation)

Rule: max 2 regeneration rounds per clip. After 2 failures, switch to Remotion-only for that beat.

### Phase 8: ASSEMBLAGE

Generate Remotion component and render the Short.

Architecture pattern (from ThiaroyeShort.tsx):
```
<AbsoluteFill>
  <Audio src={staticFile(audioPath)} />
  {beats.map(beat =>
    <Sequence from={beat.startFrame} durationInFrames={beat.durationFrames}>
      {beat.type === 'clip' && <OffthreadVideo src={...} playbackRate={...} muted />}
      {beat.type === 'geo' && <MapSegment ... />}
      {beat.overlay && <TextOverlay text={beat.overlay} />}
    </Sequence>
  )}
  <CinematicVignette />
</AbsoluteFill>
```

Remotion rules:
- `<OffthreadVideo>` ONLY (never `<Video>`) — headless render = black frames with `<Video>`
- Always `muted` on OffthreadVideo clips
- Always wrap in `<Sequence from={...}>` — without it, frame count overruns = freeze on last frame
- Text overlays (dates, names, quotes) are Remotion post-prod. NEVER in source frames.
- Vignette cinematique on top layer
- Slow zoom (scale 1.0 -> 1.05 over segment) on each clip for subtle motion
- For GEO beats: d3-geo + TopoJSON, animated zoom, pulsing markers, animated counters
- For Seedance clips with lip sync: offset ~9 frames (0.3s) between video and ElevenLabs audio

Mini-render after assembly:
```bash
npx remotion render src/index.ts [CompositionName] out/[name]-preview.mp4
```

> **CHECKPOINT AZIZ**: "Voici le render complet. Le montage te convient ?"
> Upload to Vercel Blob.

**Output**: `out/[project]-final.mp4` + Remotion component in `src/projects/`

### Phase 9: REVIEW & DELIVERY

- Upload final render to Vercel Blob for mobile review
- List remaining manual steps:
  - Music (manual: Suno or other, mixed at -18dB under voice)
  - Fine-tuning (clip timing adjustments if needed)
  - YouTube upload metadata (title, description, tags, thumbnail)
- Archive project assets in `public/assets/library/geoafrique/[project]/`

**Output**: Vercel Blob gallery URL + local MP4

---

## ANTI-PATTERNS (erreurs session 29 mars — codees en dur)

| # | Anti-pattern | Consequence | Regle |
|---|-------------|-------------|-------|
| 1 | Clips generes AVANT audio | Durees non calees, slow-mo force | Phase 2 AVANT Phase 6. GATE: timing.json doit exister |
| 2 | "Atmospheric movement only" dans prompts | Clips quasi-statiques | Verbes d'action par defaut. "subtle" = flag explicite |
| 3 | Clips 5s pour beats 15s | playbackRate 0.33 = slow-mo artificiel | Duration matching: beat > 7s = clip 10s |
| 4 | Texte/chiffres dans frames Gemini | Kling anime le texte = artefacts | NO TEXT hardcode + negative_prompt |
| 5 | Cut ffmpeg sub-seconde sur audio | 5 tentatives echouees | Regenerer l'audio sans la phrase |
| 6 | Grille 3x3 mal croppee | Frames melangees, images trop petites | Generer frames individuelles, PAS de grille |
| 7 | Mauvais model name Gemini | 404 errors | Verifier via api-reference.md |
| 8 | Seedance audio non strip | Mots deformes dans le render | Toujours `ffmpeg -an -c:v copy` avant Remotion |

---

## REFERENCES (Level 3 — charges a la demande)

- `references/pipeline-validation-session.md` — Session complete 29 mars (erreurs, corrections, code)
- `references/prompt-templates.md` — Templates prompts par type de plan
- `references/api-reference.md` — Endpoints, parametres, voice settings, model names
- `references/remotion-patterns.md` — Patterns TSX (OffthreadVideo, overlays, carte SVG, vignette)
- `references/kimi-direction-example.md` — Example output from Kimi script review + storyboard direction (Thiaroye test)
