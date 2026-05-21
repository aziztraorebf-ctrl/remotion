"""
Generate Scene 8 clips (8A + 8B, 9s each) via fal.ai Seedance V2 image-to-video.
8A: Sunjata roi devant Niani, foule agenouillee
8B: Sunjata proclamant la Charte sous le baobab

Usage:
  python scripts/tools/generate-scene8-clips.py 8a
  python scripts/tools/generate-scene8-clips.py 8b
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
CLIPS_DIR = PROJECT_DIR / "clips-production"

# Local image paths (will be uploaded to fal storage)
IMAGE_PATHS = {
    "8a": PROJECT_DIR / "images" / "scene8a-mansa-niani-v2.png",
    "8b": PROJECT_DIR / "images" / "scene8b-charte-proclamation-v3.png",
}

# Vercel Blob URLs (for metadata/reference only)
VERCEL_URLS = {
    "8a": "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/sonjata-papercraft/scene8a-mansa-niani-v2-YcxANMRBFMkk4nqBVnHmSuAKQQgCxF.png",
    "8b": "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/sonjata-papercraft/scene8b-charte-proclamation-v3-4xLBuD3Lxz8fKdpJ13ZyEXrxqVwABy.png",
}

PROMPTS = {
    "8a": """Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style -- flat 2D paper-craft, warm sepia/amber palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism. MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris.

Camera SLOWLY PULLS BACK during the entire clip, starting tight on Sunjata and gradually revealing the full scene with kneeling crowd and Niani city behind.

SECONDS 0 TO 3: Sunjata stands tall on the stone platform. Wind RIPPLES his white royal boubou. He RAISES the golden scepter in his right hand above his shoulder. The medallion on his chest CATCHES the golden light.

SECONDS 3 TO 6: The kneeling crowd in the foreground SHIFTS -- some PRESS their foreheads to the ground, others RAISE their arms toward Sunjata. Dust SWIRLS gently at ground level. Sunjata TURNS his head slightly to survey his people.

SECONDS 6 TO 9: Camera REVEALS the full city of Niani behind Sunjata -- round huts, marketplace, palm trees. Small figures in the background WALK between buildings. Sunjata PLANTS the scepter firmly DOWN beside his foot. His chin LIFTS higher.

IMPORTANT:
- Sunjata: dark brown skin, short twisted dreadlocks, white Mande bonnet with golden trim, white royal boubou with golden embroidery, red sash, gold medallion
- The scepter STAYS in his RIGHT HAND throughout -- he NEVER drops, transfers, or releases it
- ALL characters have dark brown skin, 13th century West African Mande clothing
- No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue.""",

    "8b": """Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style -- flat 2D paper-craft, warm sepia/amber palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism. MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris.

Camera ORBITS 90 degrees around the assembly during the entire clip, starting from front view and ending at three-quarter side view.

SECONDS 0 TO 3: Sunjata stands firm on the stone platform beneath the massive baobab tree. He LIFTS the inscribed clay tablet HIGH in his left hand for all chiefs to see. His expression is SOLEMN and authoritative.

SECONDS 3 TO 6: The clan chiefs sitting in the semicircle REACT -- the elder with the blue turban NODS deeply, the chief in green STRIKES his staff against the ground, others SHIFT forward attentively. Sunjata SWEEPS his gaze across the assembly.

SECONDS 6 TO 9: Sunjata LOWERS the tablet to chest level and RAISES the golden scepter in his right hand. The chiefs BOW their heads in unison. Warm golden light INTENSIFIES from behind the baobab tree, bathing the entire scene.

IMPORTANT:
- Sunjata: dark brown skin, short twisted dreadlocks, white Mande bonnet with golden trim, white royal boubou with golden embroidery, red sash, gold medallion
- The inscribed tablet STAYS in his LEFT HAND throughout -- he NEVER drops or releases it
- The scepter STAYS in his RIGHT HAND throughout
- ALL chiefs have dark brown skin, diverse ages and clothing, 13th century West African Mande style
- No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue.""",
}

SCENE_TITLES = {
    "8a": "Sunjata Mansa devant Niani, foule agenouillee",
    "8b": "Sunjata proclame la Charte du Mande sous le baobab",
}


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


def generate_clip(scene_id: str):
    scene_id = scene_id.lower()
    if scene_id not in IMAGE_PATHS:
        print(f"ERROR: unknown scene '{scene_id}'. Use '8a' or '8b'.")
        sys.exit(1)

    image_path = IMAGE_PATHS[scene_id]
    prompt = PROMPTS[scene_id]
    output_clip = CLIPS_DIR / f"scene{scene_id}-9s.mp4"
    output_meta = CLIPS_DIR / f"scene{scene_id}-9s.meta.json"
    output_prompt = CLIPS_DIR / f"scene{scene_id}.prompt.txt"

    CLIPS_DIR.mkdir(parents=True, exist_ok=True)

    if not image_path.exists():
        print(f"ERROR: source image not found: {image_path}")
        sys.exit(1)

    print(f"=== Scene {scene_id.upper()} ===")
    print(f"Source: {image_path.name} ({image_path.stat().st_size // 1024} KB)")
    print(f"Prompt length: {len(prompt)} chars")
    print(f"Duration: 9s")
    print(f"Aspect ratio: 9:16")
    print(f"Audio: ENABLED")
    print(f"Endpoint: {ENDPOINT} (V2)")
    print(f"Cost estimate: ~$2.72")
    print()

    # Upload image to fal storage
    image_url = upload(image_path)

    # Submit Seedance V2 i2v job
    print(f"\n[CALL] {ENDPOINT}")
    start_time = time.time()

    result = fal_client.subscribe(
        ENDPOINT,
        arguments={
            "prompt": prompt,
            "image_url": image_url,
            "duration": "9",
            "resolution": "720p",
            "aspect_ratio": "9:16",
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
    urllib.request.urlretrieve(video_url, output_clip)
    size_mb = output_clip.stat().st_size / (1024 * 1024)
    print(f"Saved: {output_clip} ({size_mb:.1f} MB)")

    # Save prompt
    output_prompt.write_text(prompt)

    # Save metadata
    request_id = result.get("request_id", "unknown")
    seed_used = result.get("seed", 42)

    meta = {
        "scene": scene_id.upper(),
        "title": SCENE_TITLES[scene_id],
        "duration_s": 9,
        "source_image": str(image_path.relative_to(PROJECT_DIR)),
        "source_image_fal_url": image_url,
        "vercel_blob_url": VERCEL_URLS[scene_id],
        "tool": "fal.ai Seedance V2 i2v",
        "endpoint": ENDPOINT,
        "cost_usd": 2.72,
        "video_url": video_url,
        "request_id": request_id,
        "seed": seed_used,
        "audio_enabled": True,
        "aspect_ratio": "9:16",
        "elapsed_s": round(elapsed, 1),
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    output_meta.write_text(json.dumps(meta, indent=2))
    print(f"Meta: {output_meta}")
    print(f"Request ID: {request_id}")
    print(f"Cost: ~$2.72")

    print(f"\nScene {scene_id.upper()} clip generated successfully.")
    return output_clip, video_url


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate-scene8-clips.py <8a|8b>")
        sys.exit(1)

    generate_clip(sys.argv[1])
