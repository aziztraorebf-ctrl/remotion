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

### Phase 4: KIMI STORYBOARD DIRECTION (~$0.005)

Send script + timing to Kimi K2.5 for storyboard artistic direction.

**Execute**: `python scripts/batch-short-production/kimi-script-review.py --script <file> --timing <file> --storyboard-only`

Kimi proposes a frame-by-frame storyboard brief: shot types, camera movements,
rhythm (fast cuts vs slow reveals), palette progression, transitions.
This brief becomes the input for Gemini storyboard generation.

Rules:
- Kimi's storyboard direction is GUIDANCE for Gemini — not a replacement.
- With timing.json, Kimi can propose precise framing per beat duration.

**Output**: `[project]/kimi-storyboard-direction.md`

### Phase 5: STORYBOARD

Generate visual frames for each beat. Use Kimi's storyboard direction brief as input.

**Execute**: `python scripts/batch-short-production/generate-storyboard.py --timing <file> --style <style>`

Default method: Gemini 3x3 grid (1 prompt = 9 frames + 9 video prompts).
Alternative: Aziz provides custom reference images for some or all beats.

Beat types (Claude identifies from the script):
- **NARRATIVE**: character scene, action, emotion -> standard I2V
- **GEO**: map, geography, route, territory -> Gemini map frame. Two options:
  - I2V animation (simple zoom/pan on map) -- propose first
  - Remotion SVG animation (d3-geo, markers, counters, route tracing) -- if I2V insufficient
- **SYMBOLIC**: metaphor, split-screen, comparison -> may be Remotion-only

Rules:
- NO TEXT in any frame. Hardcoded in Gemini prompt + Kling negative_prompt.
  Reimagine any beat that would "naturally" contain text (dates, labels, titles).
- Style: always "2D vivid flat illustration" as base. Palette varies per project — ask Aziz or derive from the script's tone/era/geography. Do NOT default to sepia/gold/charcoal.
- Expect 1-2 frames to need correction (cloned faces, artifacts). Budget for it.
- Gemini is excellent at map/geography frames. Use this for variety between narrative clips.

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

Fix rejected clips from Phase 4.

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
| 6 | Grille 3x3 = visages clones | Scene inutilisable | Budget 1-2 corrections Gemini editorial |
| 7 | Mauvais model name Gemini | 404 errors | Verifier via api-reference.md |
| 8 | Seedance audio non strip | Mots deformes dans le render | Toujours `ffmpeg -an -c:v copy` avant Remotion |

---

## REFERENCES (Level 3 — charges a la demande)

- `references/pipeline-validation-session.md` — Session complete 29 mars (erreurs, corrections, code)
- `references/prompt-templates.md` — Templates prompts par type de plan
- `references/api-reference.md` — Endpoints, parametres, voice settings, model names
- `references/remotion-patterns.md` — Patterns TSX (OffthreadVideo, overlays, carte SVG, vignette)
- `references/kimi-direction-example.md` — Example output from Kimi script review + storyboard direction (Thiaroye test)
