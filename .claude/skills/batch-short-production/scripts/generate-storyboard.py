"""
Batch Short Production — Phase 3: Storyboard Generation
Generates a 3x3 storyboard grid via Gemini and extracts individual frames.

Usage:
    python generate-storyboard.py --timing timing.json --subject "Thiaroye 1944" --style "sepia, gold, charcoal" --output-dir project/frames/
    python generate-storyboard.py --timing timing.json --subject "Mansa Musa" --style "navy, gold, desert sand" --output-dir project/frames/ --grid-output project/grid.jpg

Reads beat descriptions from timing.json to create one frame per beat.
"""

import argparse
import base64
import json
import os
import sys
import pathlib
import requests
from PIL import Image
from dotenv import load_dotenv


GEMINI_MODEL = "gemini-3.1-flash-image-preview"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"


def find_env():
    path = pathlib.Path.cwd()
    while path != path.parent:
        env_file = path / ".env"
        if env_file.exists():
            return str(env_file)
        path = path.parent
    return None


def build_prompt(subject, style, beats):
    beat_descriptions = ""
    for b in beats:
        beat_descriptions += f"- Frame {b['beat']}: {b['description']} (duration target: {b['duration']}s)\n"

    return f"""You are an expert storyboard artist for animated historical documentaries.

Subject: {subject}
Style: 2D vivid flat illustration, {style}
Format: 3x3 grid, each cell = one scene for 9:16 vertical video

CRITICAL CONSTRAINT -- NO TEXT IN ANY FRAME (NON-NEGOTIABLE):
- ZERO text, numbers, dates, labels, stamps, titles visible in any frame
- All text elements will be inserted in post-production via Remotion
- If the narrative references a document: show hands touching paper, light on parchment — NEVER readable text
- If the narrative references a date or timeline: show atmospheric light shift, shadow progression — NEVER numbers
- If the narrative references a count/number: show symbolic crowd, mass of figures — NEVER digits
- If the narrative references a verdict or official action: show gavel, hands, architecture — NEVER text stamps

Beats to illustrate:
{beat_descriptions}

Requirements:
1. Generate a SINGLE image containing a perfect 3x3 storyboard grid with {len(beats)} frames separated by thin white borders
2. Each frame depicts ONE cinematic moment from the corresponding beat
3. Camera varies across frames: wide establishing, medium, tight close-up (avoid repetition)
4. Include geographic/map frames where the script mentions territories, routes, or locations
5. VERIFY before generating: scan every frame for any text, number, date, or label — remove all

After the image, provide {len(beats)} detailed video animation prompts (one per frame).
Each prompt should describe: scene, motion, camera movement, atmosphere.
Use dynamic action verbs (TURNS, MARCHES, PRESSES, RUSHES) — NOT "atmospheric movement only".

Format each video prompt as:
[Frame N] [Scene description], [Camera instruction], [Dynamic motion description]"""


def call_gemini(prompt, api_key):
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "maxOutputTokens": 2000,
        },
    }
    params = {"key": api_key}

    print(f"Calling Gemini {GEMINI_MODEL}...")
    resp = requests.post(GEMINI_URL, headers=headers, json=payload, params=params, timeout=120)

    if resp.status_code != 200:
        print(f"ERROR: Gemini returned {resp.status_code}")
        print(resp.text[:500])
        sys.exit(1)

    return resp.json()


def extract_results(result, output_dir, grid_output=None):
    image_path = None
    prompts_text = None

    if "candidates" not in result or len(result["candidates"]) == 0:
        print("ERROR: No candidates in Gemini response")
        sys.exit(1)

    parts = result["candidates"][0].get("content", {}).get("parts", [])

    for part in parts:
        if "inlineData" in part:
            image_data = base64.b64decode(part["inlineData"]["data"])
            grid_path = pathlib.Path(grid_output) if grid_output else output_dir / "storyboard-grid.jpg"
            grid_path.parent.mkdir(parents=True, exist_ok=True)
            grid_path.write_bytes(image_data)
            image_path = grid_path
            print(f"Grid saved: {grid_path}")

        elif "text" in part:
            prompts_text = part["text"]
            prompts_path = output_dir / "video-prompts.txt"
            prompts_path.write_text(prompts_text, encoding="utf-8")
            print(f"Video prompts saved: {prompts_path}")

    return image_path, prompts_text


def extract_frames(grid_path, output_dir, num_frames):
    print(f"\nExtracting {num_frames} frames from grid...")
    img = Image.open(grid_path)
    w, h = img.size
    print(f"Grid size: {w}x{h}")

    cols = 3
    rows = (num_frames + cols - 1) // cols
    border = 4
    cell_w = (w - border * (cols + 1)) // cols
    cell_h = (h - border * (rows + 1)) // rows

    frames = []
    for i in range(num_frames):
        row = i // cols
        col = i % cols
        x1 = border + col * (cell_w + border)
        y1 = border + row * (cell_h + border)
        x2 = x1 + cell_w
        y2 = y1 + cell_h

        frame = img.crop((x1, y1, x2, y2))
        frame_path = output_dir / f"frame-{i + 1:02d}.jpg"
        frame.save(frame_path, quality=95)
        frames.append(frame_path)
        print(f"  Frame {i + 1}: {frame_path.name} ({cell_w}x{cell_h})")

    return frames


def main():
    parser = argparse.ArgumentParser(description="Generate storyboard from timing and subject")
    parser.add_argument("--timing", required=True, help="Path to timing.json")
    parser.add_argument("--subject", required=True, help="Subject description for the storyboard")
    parser.add_argument("--style", required=True, help="Visual style/palette description")
    parser.add_argument("--output-dir", required=True, help="Output directory for frames")
    parser.add_argument("--grid-output", default=None, help="Path for the grid image (optional)")
    args = parser.parse_args()

    env_path = find_env()
    if env_path:
        load_dotenv(env_path)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in environment")
        sys.exit(1)

    timing_path = pathlib.Path(args.timing)
    if not timing_path.exists():
        print(f"ERROR: Timing file not found: {timing_path}")
        sys.exit(1)

    with open(timing_path, "r", encoding="utf-8") as f:
        timing = json.load(f)

    beats = timing["beats"]
    output_dir = pathlib.Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    prompt = build_prompt(args.subject, args.style, beats)
    result = call_gemini(prompt, api_key)
    grid_path, prompts_text = extract_results(result, output_dir, args.grid_output)

    if grid_path:
        extract_frames(grid_path, output_dir, len(beats))

    if prompts_text:
        print("\n=== GENERATED VIDEO PROMPTS ===\n")
        print(prompts_text)

    print(f"\nNext step: review frames, then run generate-clips.py")


if __name__ == "__main__":
    main()
