"""
Generate Scene 7A clip (6s) via fal.ai Seedance V1 Pro image-to-video.
Soumaoro with army, menacing stance, paper-craft sepia style.
"""

import os
import sys
import time
import json
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

os.environ["FAL_KEY"] = os.environ["FAL_KEY"]

PROJECT_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft"
SOURCE_IMAGE = PROJECT_DIR / "images" / "scene7a-soumaoro-v3.png"
OUTPUT_CLIP = PROJECT_DIR / "clips-production" / "scene7a-soumaoro-6s.mp4"
OUTPUT_META = PROJECT_DIR / "clips-production" / "scene7a-soumaoro-6s.meta.json"
OUTPUT_PROMPT = PROJECT_DIR / "clips-production" / "scene7a-soumaoro.prompt.txt"

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY: paper-craft sepia illustration, bold clean outlines, muted earth tones, textured paper.

SECONDS 0 TO 2: Camera HOLDS STEADY on Soumaoro's imposing figure. His feathered cape RIPPLES in the wind. His scarified face GLARES forward with cold menace. His fingers CLENCH slowly.

SECONDS 2 TO 4: Camera PULLS BACK to reveal the massive army behind him. Soldiers SHIFT their weight, spears SWAY slightly. A soldier in the front row ADJUSTS his grip on his shield. Dust SWIRLS at their feet.

SECONDS 4 TO 6: Camera TILTS UP dramatically from army level to frame Soumaoro against the stormy sky. Dark clouds CHURN overhead. His cape BILLOWS wider. The army stands RIGID and menacing.

COLOR GRADE: desaturated grey-blue sky, dark earth tones, muted browns and blacks. Cold, threatening palette.

No text, no banners, no writing. No music, no words, no dialogue."""


def upload_image(path: Path) -> str:
    """Upload image to fal.ai storage and return URL."""
    print(f"Uploading source image: {path.name}")
    url = fal_client.upload_file(str(path))
    print(f"  -> {url}")
    return url


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"  [seedance] {log['message']}")


def main():
    if not SOURCE_IMAGE.exists():
        print(f"ERROR: source image not found: {SOURCE_IMAGE}")
        sys.exit(1)

    OUTPUT_CLIP.parent.mkdir(parents=True, exist_ok=True)

    print(f"Prompt length: {len(PROMPT)} chars")
    print(f"Duration: 6s")
    print(f"Audio: ENABLED (keep-and-duck)")
    print(f"Cost estimate: ~$1.80 (V1 Pro, 6s)")
    print()

    # Upload image to fal storage
    image_url = upload_image(SOURCE_IMAGE)

    # Submit Seedance V1 Pro i2v job
    print("\nSubmitting Seedance V1 Pro i2v...")
    start_time = time.time()

    result = fal_client.subscribe(
        "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        arguments={
            "prompt": PROMPT,
            "image_url": image_url,
            "resolution": "1080p",
            "duration": "6",
            "camera_fixed": False,
            "seed": 42,
            "enable_safety_checker": True,
            "generate_audio": True,
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )

    elapsed = time.time() - start_time
    print(f"\nDone in {elapsed:.0f}s")
    print(f"Result keys: {list(result.keys())}")

    # Download video
    video_url = result["video"]["url"]
    print(f"\nDownloading: {video_url}")
    import urllib.request
    urllib.request.urlretrieve(video_url, OUTPUT_CLIP)
    size_mb = OUTPUT_CLIP.stat().st_size / (1024 * 1024)
    print(f"Saved: {OUTPUT_CLIP} ({size_mb:.1f} MB)")

    # Save prompt
    OUTPUT_PROMPT.write_text(PROMPT)

    # Save metadata
    request_id = result.get("request_id", "unknown")
    seed_used = result.get("seed", 42)

    meta = {
        "scene": "7A",
        "title": "Soumaoro + armee menaçante",
        "duration_s": 6,
        "source_image": str(SOURCE_IMAGE.relative_to(PROJECT_DIR)),
        "tool": "fal.ai Seedance V1 Pro i2v",
        "endpoint": "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        "cost_usd": 1.80,
        "video_url": video_url,
        "request_id": request_id,
        "seed": seed_used,
        "audio_enabled": True,
        "elapsed_s": round(elapsed, 1),
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"Meta: {OUTPUT_META}")
    print(f"Request ID: {request_id}")
    print(f"Cost: ~$1.80")

    print("\nScene 7A clip generated successfully.")


if __name__ == "__main__":
    main()
