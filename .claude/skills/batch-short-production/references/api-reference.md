# API Reference — Batch Short Production

## ElevenLabs V3 (Voice-Over)

**Endpoint**: `https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}`
**Key**: `ELEVENLABS_API_KEY`
**Method**: POST

### Voices

| Name | ID | Usage |
|------|----|-------|
| Narratrice GeoAfrique V3 | `Y8XqpS6sj6cx5cCTLp8a` | Default documentary narrator |

### Parameters (documentary style)

```python
{
    "text": script_text,
    "model_id": "eleven_v3",
    "voice_settings": {
        "stability": 0.25,           # Low = more expressive
        "similarity_boost": 0.75,
        "style": 0.40,               # Emotional engagement
        "speed": 0.88                 # Slow = documentary gravitas. Adds ~40% to script duration.
    }
}
```

### Text Tags

| Tag | Effect | Example |
|-----|--------|---------|
| `[pause]` | Short pause (~0.5s) | "Dakar. [pause] Decembre 1944." |
| `[long pause]` | Long pause (~1.5s) | "...oublies. [long pause] L'Afrique a une histoire..." |
| `[drawn out]` | Stretched syllable | "...pour avoir [drawn out] cache les documents." |
| MAJUSCULES | Natural emphasis | "Ces hommes ont traverse l'EUROPE" |

### Gotchas

- Participes passes en "e" : drop systematique. Remplacer par constructions sans accent final.
- "ont + voyelle" : liaison bizarre. Remplacer par passe simple.
- Noms de villes avec "s" final : liaison bizarre. Ecrire sans "s" phonetique.
- Speed 0.88 : un script de 75 mots = ~60s audio, 110 mots = ~90s.
- JAMAIS couper audio avec ffmpeg sub-seconde. Regenerer sans la phrase.

---

## Gemini (Storyboard + Editorial)

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent`
**Key**: `GEMINI_API_KEY`
**Method**: POST

### Models

| Model | Usage |
|-------|-------|
| `gemini-3.1-flash-image-preview` | Storyboard 3x3, editorial face fixes |
| `gemini-3-pro-image-preview` | Higher quality single image generation |

**ATTENTION**: `gemini-2.0-flash-exp` = 404. Always use `gemini-3.1-flash-image-preview` or newer.

### Storyboard 3x3

```python
{
    "contents": [{
        "parts": [{
            "text": prompt  # See prompt-templates.md for structure
        }]
    }],
    "generationConfig": {
        "responseModalities": ["IMAGE", "TEXT"],
        "temperature": 1.0
    }
}
```

Output: 1 image (1024x1024 grid) + text with 9 video prompts.
Extract frames: PIL crop, 336x336 per cell (3 rows x 3 cols, ~5px margin).

### Editorial Fix (face diversification, artifact removal)

Upload source image as `Part.from_bytes()` + text prompt describing the fix.
Example: "Give each soldier a completely distinct face, different morphology, different age..."

---

## Kling via fal.ai (I2V Clips)

**Key**: `FAL_KEY`
**SDK**: `fal_client` (Python)

### Endpoints

| Model | Endpoint | Best for |
|-------|----------|----------|
| V3 Pro | `fal-ai/kling-video/v3/pro/image-to-video` | Close-ups, portraits, textures |
| V3 Standard | `fal-ai/kling-video/v3/standard/image-to-video` | Wide shots, atmosphere |
| O3 Standard | `fal-ai/kling-video/o3/standard/image-to-video` | Groups, multi-character, start+end frame |

### Common Parameters

```python
{
    "image_url": uploaded_url,          # fal_client.upload_file(path)
    "prompt": "...",                     # Dynamic action verbs + camera cues
    "negative_prompt": "text, writing, letters, numbers, dates, subtitles, captions, watermark, signature, title, label, stamp, typography, words, digits, calendar, timestamps, photorealistic, 3D render, CGI",
    "duration": "5" | "10",             # Seconds. V3/O3: 3-15 by increments of 1
    "aspect_ratio": "9:16",             # Vertical Short
    "cfg_scale": 0.35                   # 0.3-0.5. Lower = more stable. Higher = more creative.
}
```

### Workflow

```python
# 1. Upload
url = fal_client.upload_file(str(frame_path))
# 2. Submit (async)
handler = fal_client.submit(endpoint, arguments={...})
# 3. Poll
status = fal_client.status(endpoint, handler.request_id, with_logs=False)
# status type: "InQueue", "InProgress", "Completed", "Failed"
# 4. Result
result = fal_client.result(endpoint, handler.request_id)
video_url = result["video"]["url"]
# 5. Download
urllib.request.urlretrieve(video_url, output_path)
```

### cfg_scale Guide

| Value | Behavior | Use when |
|-------|----------|----------|
| 0.3 | Very stable, minimal style drift | Flat 2D characters, long clips |
| 0.35 | Stable, slight creativity | Default recommendation |
| 0.4 | Moderate creativity | Portraits, emotional scenes |
| 0.45 | More creative, risk of style drift | Only if 0.35 too static |
| 0.5 | High adherence to prompt movement | Dynamic action scenes |

### Key Rules

- cfg_scale = adherence to prompt, NOT motion intensity. Motion = prompt vocabulary only.
- NO TEXT in source frames. Kling animates text = morphing artifacts guaranteed.
- Duration = beat duration from timing.json. Never 5s for a 15s beat.
- Always `muted` in Remotion (Kling generates ambient audio even without request).
- V2.1 (legacy): only "5" or "10" duration. V3/O3: 3-15 by 1s increments.

---

## Seedance 2.0 / Dreamina (Alternative I2V)

**Access**: Dreamina web interface only (API suspended overseas, March 2026)
**Credits**: Free daily credits (~1 video/day)

### Workflow

1. Upload reference images (up to 12) + optional audio on Dreamina web
2. Write prompt (3 formats: narrative ~40w, Shot 1/2/3 ~75w, SECONDS X TO Y ~200w)
3. Manually @mention tag each uploaded image (@Image1, @Image2...)
4. Generate (80 credits text-to-video, 120 with image refs)
5. Download video
6. Strip audio: `ffmpeg -i input.mp4 -an -c:v copy output-silent.mp4`
7. Integrate in Remotion with ElevenLabs audio (offset ~9 frames / 0.3s for lip sync)

### Key Rules

- Audio is ALWAYS re-synthesized by Seedance (words distorted). ALWAYS strip and replace.
- No text in prompts for overlay — add in Remotion post-prod.
- COLOR GRADE section at end of prompt to set palette without extra ref image.
- Plan-sequence: max 1 ref, zero decor refs.
- Max 15s, 720p on free tier.

---

## Vercel Blob (Review Gallery)

**Key**: `BLOB_READ_WRITE_TOKEN`
**Script**: `scripts/upload-to-blob.py`

```bash
# Single file
python scripts/upload-to-blob.py file.png --folder images

# Gallery (images + audio + video on one page)
python scripts/upload-to-blob.py --gallery "Review Title" img1.png clip1.mp4 audio.mp3 --folder review/project

# List files
python scripts/upload-to-blob.py --list
```

Gallery produces a static HTML page uploaded to Blob — works on iPhone Safari.
