"""Send S3 mini-render Iter 1 to Gemini 3 Flash Preview for technical review.

Goal: independent third-eye review on what to fix in Iter 2 + final V2 production.
"""
import os
import sys
import time
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3-flash-preview"

VIDEO = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "v2" / "scene-s3" / "scene-s3-iter1.mp4"
OUT = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "v2" / "scene-s3" / "gemini-iter1-review.md"

PROMPT = """You are a senior video director and Remotion expert reviewing a 16-second mini-render for a YouTube Short series "Atlas GeoAfrique".

CONTEXT:
- This is Scene S3 "Climax Hadj" (narration timestamps 34s-50s of 81s total)
- Subject: Mansa Moussa pilgrimage Mali -> Cairo -> Mecca, 14th century, with 60 000 men, 12 000 slaves, 80 camels carrying gold
- Visual style target: like GeoGlobeTales / Jacques a dit / RealLifeLore (vector cartography animated, dynamic camera, karaoke subtitles)
- Tech stack: 100% Remotion + d3-geo SVG paths + Natural Earth GeoJSON + chibi PNG overlays
- Brand identity: terracotta lands + indigo ocean + cream Mali focus + gold accents (Mande aesthetic)

WHAT THE CREATOR (AZIZ) ALREADY OBSERVED:
1. Camel walk cycle (3-frame loop A-B-C-B) does NOT work — frames don't align, looks like a bug not animation
2. Camel PNG transparent shows a flickering "transparent square box" around it (artifact during walk cycle frame swap)
3. Ocean color is slightly lighter than V1 but barely visible — could be even lighter
4. Labels "LE CAIRE" / "LA MECQUE" pill backgrounds look great, but:
   - "LA MECQUE" text overflows the pill (text width calc bug)
   - "LE CAIRE" pill cuts the pulse marker dot underneath
5. Camera motion (drift + scale pendulum) works well — keep this
6. Cartouches "60 000" / "12 000" / "80 CHAMEAUX" sync OK with audio
7. Empire Mali 1300 hatching cream is more visible than gold version

YOUR MISSION — provide an EXHAUSTIVE technical review of this 16s render. Cover:

## 1. CRITICAL BUGS (must-fix before V2 production)
List every visible bug. Priority order. For each: what you see + likely root cause + suggested fix in Remotion code.

## 2. AUDIO-VISUAL SYNC
Did the cartouches/markers/labels appear at the right narration beats? List moments where sync feels OFF.

## 3. CAMERA MOTION
Is the camera motion smooth? Does it match references like Hundred Years War / Jacques a dit? What's missing?

## 4. PALETTE & READABILITY
Are colors balanced? Is everything readable on a 9:16 mobile screen? List weak contrasts.

## 5. NARRATIVE CLARITY
Without audio, can you UNDERSTAND the story (Mansa Moussa traveling Mali->Mecca with massive caravan)? What visual cues are missing?

## 6. PIECES THAT WORK GREAT (don't change)
List what's already very good. Be specific.

## 7. MISSING ELEMENTS THAT REFERENCES HAVE
What do GeoGlobeTales/Jacques a dit Shorts have that this render lacks? (subtitles karaoke, certain transitions, etc.)

## 8. PRIORITY-RANKED FIX LIST FOR ITER 2
Top 8 fixes in order of impact-per-effort. For each:
- What to change
- Why it matters
- Estimated Remotion code complexity (low/med/high)

## 9. ASSESSMENT FOR PRODUCTION DECISION
Should Aziz proceed to produce the 5 remaining scenes (Hook + S1 + S2 + S4 + CTA) using THIS pipeline as-is, or is there a fundamental flaw that requires rethinking?

Be specific, technical, and direct. Cite timestamps in seconds for visual moments. Don't pad."""


def main() -> int:
    print(f"Video: {VIDEO}")
    print(f"Model: {MODEL}")
    print(f"Output: {OUT}")
    print(f"Cost: ~$0.005-0.01 (16s video)")
    print()

    print("Uploading to Gemini File API...")
    uploaded = client.files.upload(file=str(VIDEO))
    while uploaded.state.name == "PROCESSING":
        time.sleep(3)
        uploaded = client.files.get(name=uploaded.name)
    if uploaded.state.name != "ACTIVE":
        print(f"ERROR: state={uploaded.state.name}")
        return 1
    print(f"ACTIVE: {uploaded.name}")

    print(f"Sending to {MODEL}...")
    t0 = time.time()
    response = client.models.generate_content(
        model=MODEL,
        contents=[uploaded, PROMPT],
    )
    elapsed = time.time() - t0
    text = response.text if hasattr(response, "text") else ""
    usage = getattr(response, "usage_metadata", None)

    OUT.write_text(
        f"# Gemini Review - Atlas V2 Scene S3 Iter1\n\n"
        f"- Model: {MODEL}\n"
        f"- Video: scene-s3-iter1.mp4 (16s)\n"
        f"- Elapsed: {elapsed:.1f}s\n"
        f"- Input tokens: {getattr(usage, 'prompt_token_count', None) if usage else 'n/a'}\n"
        f"- Output tokens: {getattr(usage, 'candidates_token_count', None) if usage else 'n/a'}\n\n"
        f"---\n\n{text}\n"
    )
    print(f"OK saved -> {OUT}")

    try:
        client.files.delete(name=uploaded.name)
    except Exception:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
