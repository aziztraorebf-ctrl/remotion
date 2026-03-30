"""
Batch Short Production — Phase 5: Storyboard Generation
Generates INDIVIDUAL frames via Gemini (one API call per beat).

Usage:
    python generate-storyboard.py --timing timing.json --style "ochre, navy, gold" --output-dir project/frames/
    python generate-storyboard.py --timing timing.json --style "ochre, navy, gold" --output-dir project/frames/ --kimi-brief kimi-storyboard.md
    python generate-storyboard.py --descriptions descriptions.json --style "ochre, navy, gold" --output-dir project/frames/

With --kimi-brief: uses Kimi's simplified frame descriptions from the storyboard direction.
With --descriptions: uses a JSON file with per-frame descriptions (from Kimi Pass 3 or manual).

descriptions.json format:
{
  "frames": [
    {"beat": 1, "description": "Three soldier silhouettes sitting on a crate..."},
    {"beat": 2, "description": "Two dark hands flat on rough wood table..."},
    ...
  ]
}

Each frame is generated individually at 9:16 resolution — no grid, no cropping.
"""

import argparse
import base64
import json
import os
import sys
import time
import pathlib
import requests
from dotenv import load_dotenv


GEMINI_MODEL = "gemini-3.1-flash-image-preview"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

STYLE_PREAMBLE = """You are generating a SINGLE frame for an animated YouTube Short (9:16 vertical).
Style: 2D vivid flat illustration.

CONSTRAINTS (NON-NEGOTIABLE):
- ZERO text, numbers, dates, labels, stamps, titles, writing of ANY kind
- Maximum 3 characters. Use silhouettes for groups.
- NO blood, NO gore, NO explosions, NO tears
- Style: SOBER and DIGNIFIED
- ONE clear focal point
- Simple background (flat colors, gradient, or minimal decor)
- Maps must be COMPLETELY BLANK (outlines only, no arrows, no symbols, no figures)

Generate ONE image. No grid, no subdivisions."""


def find_env():
    path = pathlib.Path.cwd()
    while path != path.parent:
        env_file = path / ".env"
        if env_file.exists():
            return str(env_file)
        path = path.parent
    return None


def generate_frame(description, style, api_key, frame_num, total):
    prompt = f"""{STYLE_PREAMBLE}

Palette: {style}

Frame {frame_num} of {total}:
{description}

Generate this single image now. Verify: no text, no subdivisions, one focal point."""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "maxOutputTokens": 500,
        },
    }

    resp = requests.post(
        GEMINI_URL,
        headers={"Content-Type": "application/json"},
        json=payload,
        params={"key": api_key},
        timeout=300,
    )

    if resp.status_code != 200:
        print(f"  ERROR: Gemini returned {resp.status_code}")
        print(f"  {resp.text[:300]}")
        return None, None

    result = resp.json()
    image_data = None
    video_prompt = None

    if "candidates" in result and result["candidates"]:
        parts = result["candidates"][0].get("content", {}).get("parts", [])
        for part in parts:
            if "inlineData" in part:
                image_data = base64.b64decode(part["inlineData"]["data"])
            elif "text" in part:
                video_prompt = part["text"]

    return image_data, video_prompt


def build_descriptions_from_timing(beats, style):
    """Build generic frame descriptions from beat descriptions in timing.json."""
    descriptions = []
    for b in beats:
        descriptions.append({
            "beat": b["beat"],
            "description": b.get("description", f"Beat {b['beat']}"),
            "duration": b["duration"],
        })
    return descriptions


def parse_kimi_brief(kimi_path):
    """Extract frame descriptions from Kimi Pass 3 simplified markdown."""
    text = pathlib.Path(kimi_path).read_text(encoding="utf-8")
    frames = []
    current_desc = []
    current_beat = 0

    for line in text.split("\n"):
        if line.startswith("## FRAME [") or line.startswith("## Frame ["):
            if current_desc and current_beat > 0:
                frames.append({
                    "beat": current_beat,
                    "description": "\n".join(current_desc),
                })
            current_beat += 1
            current_desc = [line]
        elif current_beat > 0 and line.strip():
            current_desc.append(line)

    if current_desc and current_beat > 0:
        frames.append({
            "beat": current_beat,
            "description": "\n".join(current_desc),
        })

    return frames


def main():
    parser = argparse.ArgumentParser(description="Generate individual storyboard frames via Gemini")
    parser.add_argument("--timing", default=None, help="Path to timing.json (for beat descriptions)")
    parser.add_argument("--descriptions", default=None, help="Path to descriptions.json (per-frame descriptions)")
    parser.add_argument("--kimi-brief", default=None, help="Path to Kimi Pass 3 simplified markdown")
    parser.add_argument("--style", required=True, help="Visual palette description")
    parser.add_argument("--output-dir", required=True, help="Output directory for frames")
    parser.add_argument("--start-from", type=int, default=1, help="Start from frame N (skip already generated)")
    args = parser.parse_args()

    env_path = find_env()
    if env_path:
        load_dotenv(env_path)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found")
        sys.exit(1)

    # Load frame descriptions from one of three sources
    if args.descriptions:
        with open(args.descriptions) as f:
            data = json.load(f)
        frames = data["frames"]
        print(f"Loaded {len(frames)} frame descriptions from {args.descriptions}")
    elif args.kimi_brief:
        frames = parse_kimi_brief(args.kimi_brief)
        print(f"Parsed {len(frames)} frame descriptions from Kimi brief: {args.kimi_brief}")
    elif args.timing:
        with open(args.timing) as f:
            timing = json.load(f)
        frames = build_descriptions_from_timing(timing["beats"], args.style)
        print(f"Built {len(frames)} frame descriptions from timing.json")
    else:
        print("ERROR: Provide --descriptions, --kimi-brief, or --timing")
        sys.exit(1)

    output_dir = pathlib.Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    total = len(frames)
    prompts = []
    success = 0
    failed = []

    print(f"\nGenerating {total} individual frames...\n")

    for frame_info in frames:
        beat_num = frame_info["beat"]

        if beat_num < args.start_from:
            print(f"  Frame {beat_num}/{total}: SKIPPED (--start-from {args.start_from})")
            continue

        print(f"  Frame {beat_num}/{total}: generating...")

        image_data, video_prompt = generate_frame(
            frame_info["description"], args.style, api_key, beat_num, total
        )

        if image_data:
            frame_path = output_dir / f"frame-{beat_num:02d}.jpg"
            frame_path.write_bytes(image_data)

            # Check dimensions
            from PIL import Image
            img = Image.open(frame_path)
            print(f"    Saved: {frame_path.name} ({img.size[0]}x{img.size[1]})")
            success += 1
        else:
            print(f"    FAILED: no image returned")
            failed.append(beat_num)

        if video_prompt:
            prompts.append(f"[Frame {beat_num}] {video_prompt.strip()}")

        # Brief pause between API calls
        if beat_num < total:
            time.sleep(2)

    # Save video prompts
    if prompts:
        prompts_path = output_dir / "video-prompts.txt"
        prompts_path.write_text("\n\n".join(prompts), encoding="utf-8")
        print(f"\nVideo prompts saved: {prompts_path}")

    # Summary
    print(f"\n{'=' * 50}")
    print(f"SUMMARY: {success}/{total} frames generated")
    if failed:
        print(f"FAILED: frames {failed} — retry with --start-from {failed[0]}")
    print(f"Output: {output_dir.resolve()}")
    print(f"\nNext step: review frames, then run generate-clips.py")


if __name__ == "__main__":
    main()
