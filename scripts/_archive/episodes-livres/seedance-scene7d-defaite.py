"""
Seedance 2.0 image-to-video: Scene 7D Defaite de Soumaoro
Single start frame (NO end_image_url), classic i2v.
6s, 9:16, 720p, generate_audio=true
Endpoint: V2 bytedance/seedance-2.0/image-to-video
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
START_IMAGE = ROOT / "sonjata-papercraft/images/scene7d-defaite-v3.png"

OUTPUT_DIR = ROOT / "sonjata-papercraft/clips-production"
OUTPUT_MP4 = OUTPUT_DIR / "scene7d-defaite-6s.mp4"
OUTPUT_META = OUTPUT_DIR / "scene7d-defaite-6s.meta.json"
OUTPUT_PROMPT = OUTPUT_DIR / "scene7d-defaite.prompt.txt"

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY: paper-craft sepia illustration, bold clean outlines, muted earth tones, textured paper. MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris.

SECONDS 0 TO 2: Camera FRAMES the battlefield aftermath. Soumaoro on the left STAGGERS backward. Dark mist SWIRLS up around his legs and torso. His feathered cape DRAGS behind him. His soldiers on the right BREAK formation — shields DROP to the ground, soldiers STUMBLE over each other.

SECONDS 2 TO 4: Soumaoro's body FADES into the mountain fog — his cape DISSOLVES into wisps. Soldiers SPRINT in panic, PUSHING each other, kicking up dust clouds. More soldiers in the background SCATTER in all directions.

SECONDS 4 TO 6: Where Soumaoro stood, only dark mist and empty ground remain. Golden light BREAKS through the storm clouds on the right. The fleeing soldiers become distant silhouettes in the golden dust.

COLOR GRADE: dark cold mist on the left TRANSITIONS to warm golden savanna light on the right. Palette shift from grey-black to amber-gold.

No text, no banners, no writing."""

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
    print("SEEDANCE 2.0 image-to-video (V2 endpoint)")
    print("Scene 7D Defaite de Soumaoro")
    print("6s, 9:16, 720p, audio=true")
    print("=" * 60)

    if not START_IMAGE.exists():
        raise FileNotFoundError(f"Start image not found: {START_IMAGE}")

    print(f"\nStart: {START_IMAGE.name} ({START_IMAGE.stat().st_size // 1024} KB)")

    start_url = upload(START_IMAGE)

    args = {
        "prompt": PROMPT,
        "image_url": start_url,
        "duration": "6",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    }

    print(f"\n[CALL] {ENDPOINT}")
    print(f"       prompt: {len(PROMPT)} chars")
    print(f"       duration=6s, 720p, 9:16, audio=true")
    print(f"       NO end_image_url (classic i2v)")
    print(f"       estimated cost: ~$1.80\n", flush=True)

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
    request_id = result.get("request_id", "N/A")

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
        "request_id": request_id,
        "seed": seed,
        "video_url": video_url,
        "start_image": str(START_IMAGE),
        "end_image": None,
        "prompt_length": len(PROMPT),
        "duration": "6s",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
        "generation_time_s": round(elapsed),
        "cost_estimate": "$1.80",
        "date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "note": "Scene 7D - Soumaoro defeat, soldiers flee, dark mist to golden light transition",
    }
    with open(OUTPUT_META, "w") as f:
        json.dump(meta, f, indent=2)

    with open(OUTPUT_PROMPT, "w") as f:
        f.write(PROMPT)

    print(f"\n{'=' * 60}")
    print(f"COMPLETE")
    print(f"  Video:     {OUTPUT_MP4}")
    print(f"  Size:      {size_mb:.2f} MB")
    print(f"  Seed:      {seed}")
    print(f"  RequestID: {request_id}")
    print(f"  Time:      {elapsed:.0f}s")
    print(f"  Cost:      ~$1.80")
    print(f"  Meta:      {OUTPUT_META}")
    print(f"  Prompt:    {OUTPUT_PROMPT}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
