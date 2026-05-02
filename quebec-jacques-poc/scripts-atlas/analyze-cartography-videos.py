"""Analyze cartography reference videos with Gemini 3 Flash Preview.

Sends each video (full quality) to Gemini for detailed pattern extraction:
- Cartographic style (parchment, satellite, paper, vector...)
- Camera moves (pan, zoom, tilt, orbit, cuts)
- Animation patterns (overlays, characters, markers, paths)
- Transitions between map states
- Timing/rhythm vs narration
- Subtitles style and sync
- Color palette and visual identity
- Specific tricks reusable in Remotion

Output: structured markdown blueprint per video + cross-video synthesis.
Cost estimate: ~$0.18 total (4 videos, default media resolution).
"""

import os
import sys
import time
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3-flash-preview"

VIDEOS_DIR = ROOT / "research" / "reference-shorts" / "cartography-analysis"
OUT_DIR = ROOT / "research" / "reference-shorts" / "cartography-analysis" / "gemini-analysis"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VIDEOS = [
    {
        "file": "short1-hundred-years-war.mp4",
        "label": "Short1 - Hundred Years War (France/England)",
        "url": "https://youtube.com/shorts/-VWk5IDn3CA",
        "fallback_ext": "webm",
    },
    {
        "file": "short2.mp4",
        "label": "Short2",
        "url": "https://youtube.com/shorts/xAiHu447QUg",
    },
    {
        "file": "short3.mp4",
        "label": "Short3",
        "url": "https://youtube.com/shorts/gGEcNiiTymU",
    },
    {
        "file": "longform.mp4",
        "label": "Long-form cartography video",
        "url": "https://www.youtube.com/watch?v=j3rYE-_RSpg",
    },
]

ANALYSIS_PROMPT = """You are a senior video director and Remotion (React-based programmatic video) expert.

I am building a YouTube Short titled "Atlas Mansa Moussa" - a 80-second history Short about the 14th century Mali Empire emperor Mansa Moussa, focused on cartographic storytelling: West Africa map, his pilgrimage Mali -> Cairo -> Mecca, the gold he carried, the economic collapse he caused in Cairo. Style: parchment Mande aesthetic with indigo/gold/terracotta palette. The narration is locked (81 seconds, French).

I am studying THIS reference video to reverse-engineer its cartographic technique and reproduce a similar dynamism in Remotion (React + SVG + PNG overlays + interpolate/spring animations on static map images).

Analyze this video EXHAUSTIVELY and produce a structured technical blueprint. Cover:

## 1. CARTOGRAPHY STYLE (the maps themselves)
- What style are the base maps? (satellite tilted, parchment flat, paper-craft, vector flat, illustrated...)
- Are they static images with effects, or live-rendered (Mapbox/Google Earth)?
- Is the camera angle vertical (top-down 90°) or tilted (45°-70° satellite)?
- Do you see the whole continent / globe / region with surroundings, or zoomed local?
- What is the color palette of the base maps?
- Are country borders visible by default, or added dynamically?

## 2. CAMERA MOVES
- List every camera move you observe: zoom in/out, pan, tilt, orbit, dolly, cut.
- Estimate duration of each move and easing (linear, ease-in-out, spring).
- Are moves continuous (smooth) or cut-based (jump cuts between fixed shots)?

## 3. OVERLAYS ON MAPS
- Country fills (which colors, which opacity, when do they appear/fade?)
- Borders / dashed lines / animated paths (technique?)
- Markers / pulse dots (style, animation)
- Characters / chibi sprites / illustrations (placed on maps? animated how?)
- Labels / typography (font feel, size, color, animation)
- Flags / icons / arrows
- Other overlays (medals, cartouches, stat boxes, photographs)

## 4. TRANSITIONS BETWEEN PLANS
- Between two map states: hard cut, crossfade, wipe, zoom-through, other?
- Between map and non-map scenes (if any): how?
- Approximate cut frequency (cuts per 10s)?

## 5. SUBTITLES / TYPOGRAPHY
- Are there subtitles? Karaoke style (word-by-word) or sentence blocks?
- Font, size, color, position, animation?
- Sync to narration (tight word-level or loose)?

## 6. AUDIO MIX (best guess from video)
- Narration style (energy, pace)?
- Music genre and intensity?
- SFX usage (hits, swooshes, ducks)?

## 7. TIMING / RHYTHM
- Average shot length?
- Where does the visual peak energy align with narration peaks?
- Is there a hook moment in the first 3s? What is it?

## 8. SPECIFIC TRICKS WORTH STEALING
- The 3-5 most distinctive techniques you observed that I should reproduce.
- For each, explain HOW to do it in Remotion (concrete: <Img> + interpolate scale, <Sequence>, spring(), Bezier path along SVG, etc.)

## 9. WHAT WOULD BE HARD TO REPRODUCE
- Anything that looks like After Effects / Cinema 4D / proprietary stock that Remotion + static assets can't easily match?

## 10. BLUEPRINT SUMMARY
A 5-bullet TLDR of how I should structure my Remotion composition based on this reference.

Be concrete and specific. Use timestamps when describing specific moments. Don't be vague."""


def upload_and_wait(file_path: Path, label: str):
    """Upload video to Gemini File API and wait for ACTIVE state."""
    print(f"[{label}] Uploading {file_path.name} ({file_path.stat().st_size / (1024*1024):.1f} MB)...")
    uploaded = client.files.upload(file=str(file_path))
    print(f"[{label}] Uploaded as {uploaded.name}, waiting ACTIVE...")
    while uploaded.state.name == "PROCESSING":
        time.sleep(5)
        uploaded = client.files.get(name=uploaded.name)
    if uploaded.state.name != "ACTIVE":
        raise RuntimeError(f"Upload failed for {file_path.name}: state={uploaded.state.name}")
    print(f"[{label}] ACTIVE.")
    return uploaded


def analyze_video(file_path: Path, label: str) -> dict:
    """Upload + analyze a single video. Return result dict."""
    t0 = time.time()
    uploaded = upload_and_wait(file_path, label)

    print(f"[{label}] Sending to {MODEL}...")
    response = client.models.generate_content(
        model=MODEL,
        contents=[uploaded, ANALYSIS_PROMPT],
    )

    elapsed = time.time() - t0

    # Cleanup file from Gemini storage
    try:
        client.files.delete(name=uploaded.name)
    except Exception:
        pass

    text = response.text if hasattr(response, "text") else ""
    usage = getattr(response, "usage_metadata", None)
    return {
        "label": label,
        "file": file_path.name,
        "elapsed_s": round(elapsed, 1),
        "input_tokens": getattr(usage, "prompt_token_count", None) if usage else None,
        "output_tokens": getattr(usage, "candidates_token_count", None) if usage else None,
        "analysis": text,
    }


def main() -> int:
    print(f"Model: {MODEL}")
    print(f"Videos dir: {VIDEOS_DIR}")
    print(f"Output dir: {OUT_DIR}")
    print()

    results = []
    total_input = 0
    total_output = 0

    for v in VIDEOS:
        fp = VIDEOS_DIR / v["file"]
        if not fp.exists():
            # Try fallback extension
            if "fallback_ext" in v:
                alt = VIDEOS_DIR / (Path(v["file"]).stem + "." + v["fallback_ext"])
                if alt.exists():
                    fp = alt
                    print(f"[{v['label']}] Using fallback {alt.name}")
            if not fp.exists():
                print(f"[{v['label']}] SKIP - file not found: {fp}")
                continue

        try:
            result = analyze_video(fp, v["label"])
            results.append(result)
            total_input += result.get("input_tokens") or 0
            total_output += result.get("output_tokens") or 0

            # Save individual analysis
            out_md = OUT_DIR / (Path(v["file"]).stem + "-analysis.md")
            out_md.write_text(
                f"# Gemini Analysis: {v['label']}\n\n"
                f"- File: {result['file']}\n"
                f"- URL: {v['url']}\n"
                f"- Model: {MODEL}\n"
                f"- Elapsed: {result['elapsed_s']}s\n"
                f"- Input tokens: {result['input_tokens']}\n"
                f"- Output tokens: {result['output_tokens']}\n\n"
                f"---\n\n"
                f"{result['analysis']}\n"
            )
            print(f"[{v['label']}] Saved -> {out_md.name}")
            print()
        except Exception as e:
            print(f"[{v['label']}] ERROR: {e}")
            import traceback; traceback.print_exc()

    # Cost estimate
    cost_input = total_input * 0.50 / 1_000_000
    cost_output = total_output * 3.00 / 1_000_000
    cost_total = cost_input + cost_output

    summary = OUT_DIR / "_SUMMARY.md"
    summary.write_text(
        f"# Cartography Videos Analysis - Summary\n\n"
        f"- Model: {MODEL}\n"
        f"- Videos analyzed: {len(results)} / {len(VIDEOS)}\n"
        f"- Total input tokens: {total_input:,}\n"
        f"- Total output tokens: {total_output:,}\n"
        f"- Cost input: ${cost_input:.4f}\n"
        f"- Cost output: ${cost_output:.4f}\n"
        f"- **Total cost: ${cost_total:.4f}**\n\n"
        f"## Files\n\n"
        + "\n".join(f"- [{r['label']}]({Path(r['file']).stem}-analysis.md)" for r in results)
    )

    print(f"\nDONE. Cost: ${cost_total:.4f}. Summary -> {summary}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
