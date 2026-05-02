"""
Test Vidu Q1 Reference-to-Video on Sonjata Papercraft scene 8B (Charte du Mande).

Compare against existing Seedance V2 clip (scene8b-9s.mp4) on the SAME source image.
Goal: evaluate whether Vidu preserves paper-craft sepia style better than Seedance
during a 90-degree camera orbit with 12+ characters in frame.
"""
import os
import sys
import json
import time
from pathlib import Path

import fal_client

API_KEY = os.environ.get("FAL_KEY")
if not API_KEY:
    print("ERROR: FAL_KEY not set")
    sys.exit(1)

# Source image: already validated + already on Vercel Blob + already used for Seedance
SOURCE_IMAGE_URL = "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/sonjata-papercraft/scene8b-charte-proclamation-v3-4xLBuD3Lxz8fKdpJ13ZyEXrxqVwABy.png"

# Prompt adapted from scene8b Seedance prompt, trimmed to <1500 chars
PROMPT = """Paper-craft sepia illustration style maintained throughout entire clip. Flat 2D, warm amber palette, simple character shapes with dot-eyes, clean dark outlines, paper texture. NO realism. MAINTAIN dot-eyes, small black dot pupils only, NO visible iris.

Camera orbits 90 degrees clockwise around the assembly, starting front view ending three-quarter side view.

Sunjata stands firm on stone platform beneath massive baobab tree. He lifts the inscribed clay tablet high in his left hand for all chiefs to see, solemn authoritative expression. The clan chiefs sitting in semicircle react: blue-turban elder nods deeply, green-robed chief strikes his staff against the ground, others lean forward attentively. Sunjata sweeps his gaze across the assembly. Warm golden light intensifies from behind the baobab tree, bathing the scene.

IMPORTANT:
- Sunjata dark brown skin, short twisted dreadlocks, white Mande bonnet with golden trim, white royal boubou with golden embroidery, red sash, gold medallion
- Inscribed tablet stays in LEFT hand entire clip, never dropped
- Golden scepter stays in RIGHT hand entire clip
- All chiefs dark brown skin, diverse ages and clothing, 13th century West African Mande style
- No text, no banners, no writing visible anywhere
- No music, no words, no dialogue"""

OUTPUT_DIR = Path("public/assets/library/geoafrique/heros-oublies/soundjata/clips-pending")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH = OUTPUT_DIR / "scene8b-charte-vidu-q1-test.mp4"
META_PATH = OUTPUT_DIR / "scene8b-charte-vidu-q1-test.meta.json"

print(f"Prompt length: {len(PROMPT)} chars (max 1500)")
print(f"Source image: {SOURCE_IMAGE_URL}")
print(f"Endpoint: fal-ai/vidu/q1/reference-to-video")
print(f"Aspect ratio: 9:16")
print(f"Movement amplitude: small (paper-craft requires contained movement)")
print()
print("Submitting to fal.ai Vidu Q1 Reference-to-Video...")

start = time.time()

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs or []:
            print(f"  [fal.ai] {log.get('message', '')}")

result = fal_client.subscribe(
    "fal-ai/vidu/q1/reference-to-video",
    arguments={
        "prompt": PROMPT,
        "reference_image_urls": [SOURCE_IMAGE_URL],
        "aspect_ratio": "9:16",
        "movement_amplitude": "small",
        "bgm": False,
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)

elapsed = time.time() - start
print(f"\nGenerated in {elapsed:.1f}s")
print(f"Result: {json.dumps(result, indent=2)}")

video_url = result.get("video", {}).get("url") or result.get("video_url")
if not video_url:
    print("ERROR: no video URL in result")
    sys.exit(1)

print(f"\nDownloading video from {video_url} ...")
import urllib.request
urllib.request.urlretrieve(video_url, OUTPUT_PATH)
size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
print(f"Saved: {OUTPUT_PATH} ({size_mb:.1f} MB)")

meta = {
    "scene": "8B",
    "title": "Sunjata proclame la Charte du Mande (TEST Vidu Q1 Ref2V)",
    "tool": "fal.ai Vidu Q1 Reference-to-Video",
    "endpoint": "fal-ai/vidu/q1/reference-to-video",
    "source_image": "sonjata-papercraft/images/scene8b-charte-proclamation-v3.png",
    "source_image_url": SOURCE_IMAGE_URL,
    "aspect_ratio": "9:16",
    "movement_amplitude": "small",
    "bgm": False,
    "prompt": PROMPT,
    "prompt_length": len(PROMPT),
    "elapsed_s": round(elapsed, 1),
    "video_url": video_url,
    "local_path": str(OUTPUT_PATH),
    "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    "comparison_with": "sonjata-papercraft/clips-production/scene8b-9s.mp4 (Seedance V2, $2.72)",
}
META_PATH.write_text(json.dumps(meta, indent=2))
print(f"Meta saved: {META_PATH}")
