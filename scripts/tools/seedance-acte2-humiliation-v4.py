"""
Seedance 2.0 image-to-video: Acte 2 Setup Humiliation v4
Start frame + End frame, 9s, 9:16, 720p, generate_audio=true
Approach: image-to-video (not storyboard-to-video -- 3 storyboard attempts failed)
"""
import os
import sys
import time
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

ROOT = Path("/Users/clawdbot/Workspace/remotion")
REFS_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2"
START_IMAGE = REFS_DIR / "start-frame-humiliation.png"
END_IMAGE = REFS_DIR / "end-frame-humiliation.png"

OUTPUT_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUTPUT_MP4 = OUTPUT_DIR / "acte2-setup-v4.mp4"
OUTPUT_META = OUTPUT_DIR / "acte2-setup-v4.meta.json"
OUTPUT_PROMPT = OUTPUT_DIR / "acte2-setup-v4.prompt.txt"

PROMPT = """2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors. 13th century West African Mande village.

A woman in blue geometric pagne wrap and indigo turban STRIDES through the village courtyard with cruel confidence. She GESTURES dismissively, MOCKING someone unseen. Village women WATCH from doorways. She then CONFRONTS another woman in teal dress, POINTING directly at her face. The teal woman SHRINKS back, head BOWING in shame. The crowd GATHERS as silent witnesses.

Warm amber-ochre earth tones. No text, no banners, no signs. No modern clothing. Traditional handwoven cotton, indigo dye, cowrie shells."""

ENDPOINT = "bytedance/seedance-2.0/image-to-video"


def upload(path: Path) -> str:
    print(f"[UPLOAD] {path.name}...", flush=True)
    url = fal_client.upload_file(str(path))
    print(f"         -> {url}", flush=True)
    return url


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            msg = log.get("message", "") if isinstance(log, dict) else str(log)
            print(f"  [fal] {msg}", flush=True)


def main():
    print("=" * 60)
    print("SEEDANCE 2.0 image-to-video")
    print("Acte 2 Setup Humiliation v4")
    print("9s, 9:16, 720p, start+end frame, audio=true")
    print("=" * 60)

    if not START_IMAGE.exists():
        raise FileNotFoundError(f"Start image not found: {START_IMAGE}")
    if not END_IMAGE.exists():
        raise FileNotFoundError(f"End image not found: {END_IMAGE}")

    print(f"\nStart: {START_IMAGE.name} ({START_IMAGE.stat().st_size // 1024} KB)")
    print(f"End:   {END_IMAGE.name} ({END_IMAGE.stat().st_size // 1024} KB)")

    start_url = upload(START_IMAGE)
    end_url = upload(END_IMAGE)

    args = {
        "prompt": PROMPT,
        "image_url": start_url,
        "end_image_url": end_url,
        "duration": "9",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    }

    print(f"\n[CALL] {ENDPOINT}")
    print(f"       prompt: {len(PROMPT)} chars")
    print(f"       duration=9s, 720p, 9:16, audio=true")
    print(f"       start_image + end_image (interpolation)")
    print(f"       estimated cost: ~$2.70\n", flush=True)

    t0 = time.time()
    result = fal_client.subscribe(
        ENDPOINT,
        arguments=args,
        with_logs=True,
        on_queue_update=on_queue_update,
    )
    elapsed = time.time() - t0
    print(f"\n[DONE] Generation took {elapsed:.0f}s", flush=True)

    # Extract video URL
    video_url = result.get("video", {}).get("url")
    if not video_url:
        print(f"ERROR: No video URL in result: {json.dumps(result, indent=2)}")
        sys.exit(1)

    seed = result.get("seed")

    # Download
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n[DOWNLOAD] {OUTPUT_MP4.name}...", flush=True)
    urllib.request.urlretrieve(video_url, str(OUTPUT_MP4))
    size_mb = OUTPUT_MP4.stat().st_size / (1024 * 1024)
    print(f"           Saved: {OUTPUT_MP4} ({size_mb:.2f} MB)", flush=True)

    # Save metadata
    meta = {
        "tool": "seedance-2.0/image-to-video",
        "endpoint": ENDPOINT,
        "request_id": result.get("request_id", "N/A"),
        "seed": seed,
        "video_url": video_url,
        "start_image": str(START_IMAGE),
        "end_image": str(END_IMAGE),
        "prompt_length": len(PROMPT),
        "duration": "9s",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
        "generation_time_s": round(elapsed),
        "cost_estimate": "$2.70",
        "date": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    with open(OUTPUT_META, "w") as f:
        json.dump(meta, f, indent=2)

    with open(OUTPUT_PROMPT, "w") as f:
        f.write(PROMPT)

    print(f"\n{'=' * 60}")
    print(f"COMPLETE")
    print(f"  Video:  {OUTPUT_MP4}")
    print(f"  Size:   {size_mb:.2f} MB")
    print(f"  Seed:   {seed}")
    print(f"  Time:   {elapsed:.0f}s")
    print(f"  Cost:   ~$2.70")
    print(f"  Meta:   {OUTPUT_META}")
    print(f"  Prompt: {OUTPUT_PROMPT}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
