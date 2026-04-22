"""
Generate Scene 5B clip (7s) via fal.ai Seedance 2.0 image-to-video.
Source: scene5b-baobab-arrache.png (Sunjata grips baobab, villagers watch).
Audio: generate_audio=True for keep-and-duck ambient mix.
"""

import os
import sys
import time
import json
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

PROJECT_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft"
SOURCE_IMAGE = PROJECT_DIR / "images" / "scene5b-baobab-arrache.png"
OUTPUT_CLIP = PROJECT_DIR / "clips-production" / "scene5b-baobab-7s.mp4"
OUTPUT_META = PROJECT_DIR / "clips-production" / "scene5b-baobab-7s.meta.json"
OUTPUT_PROMPT = PROJECT_DIR / "clips-production" / "scene5b-baobab.prompt.txt"

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style - flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera HOLDS STEADY then PULLS BACK slightly to reveal the full tree.

SECONDS 0 TO 3: The boy GRIPS the massive baobab trunk, his body STRAINS backward, feet DIGGING into the earth. His arms PULL with maximum force. The ground around the roots begins to CRACK -- small fissures spread outward. Dust rises from the cracks. Villagers on both sides LEAN BACK in fear.

SECONDS 3 TO 7: The tree TILTS -- roots TEAR from the ground with explosive force. Earth chunks FLY upward. The massive trunk LEANS dramatically to one side. The boy HOLDS his grip, body arched with effort. Villagers SCATTER backward, arms raised. Dust cloud BILLOWS around the base.

The baobab trunk is RIGID and NON-DEFORMING -- it tilts as one solid piece. Villagers have DISTINCT faces. The boy remains bare-chested with red loincloth throughout.

Warm golden palette, earth tones, dust particles. Cracking earth sounds, gasps from crowd, groaning wood, roots snapping. No music, no words, no dialogue. No text, no banners, no signs visible anywhere."""


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
    print(f"Duration: 7s")
    print(f"Audio: ENABLED")
    print(f"Cost estimate: $2.12")
    print()

    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"Uploaded: {image_url}")

    print("\nSubmitting Seedance i2v...")
    start_time = time.time()

    result = fal_client.subscribe(
        "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        arguments={
            "prompt": PROMPT,
            "image_url": image_url,
            "resolution": "1080p",
            "duration": "7",
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

    video_url = result["video"]["url"]
    print(f"Downloading: {video_url}")
    import urllib.request
    urllib.request.urlretrieve(video_url, OUTPUT_CLIP)
    size_mb = OUTPUT_CLIP.stat().st_size / (1024 * 1024)
    print(f"Saved: {OUTPUT_CLIP} ({size_mb:.1f} MB)")

    OUTPUT_PROMPT.write_text(PROMPT)

    meta = {
        "scene": "5B",
        "title": "Baobab arrache",
        "duration_s": 7,
        "source_image": "images/scene5b-baobab-arrache.png",
        "tool": "fal.ai Seedance 2.0 i2v",
        "cost_usd": 2.12,
        "video_url": video_url,
        "audio_enabled": True,
        "elapsed_s": elapsed,
        "seed": 42,
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"Meta: {OUTPUT_META}")
    print("\nScene 5B clip generated successfully.")


if __name__ == "__main__":
    main()
