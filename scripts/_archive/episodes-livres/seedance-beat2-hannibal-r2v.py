"""
Seedance 2.0 reference-to-video -- Beat 2 Hannibal
Traversee du Rhone par les elephants (5s test clip)
Cost: ~$1.51 (5s @ $0.3024/s, reference-to-video)
"""

import os
import sys
import time
import json
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
REFS = [
    ROOT / "public/hannibal/assets/backgrounds/rhone-traversee.png",
    ROOT / "public/hannibal/assets/characters/hannibal-v4a/rotations/east.png",
    ROOT / "public/hannibal/assets/map-objects/elephant-radeau/elephant-radeau-v2-base.png",
    ROOT / "public/hannibal/assets/characters/volque/rotations/west.png",
]
OUT_DIR = ROOT / "public/hannibal/assets/video-tests"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "beat2-r2v-test1.mp4"

PROMPT = """@Image1 defines the visual environment and pixel art style. STRICT STYLE FIDELITY: maintain EXACT 16-bit pixel art aesthetic -- square pixels, hard edges, flat shading, limited palette of blues/greys/oranges, NO anti-aliasing, NO photorealism, NO smooth gradients, NO cartoon softness. Every element must look like a Super Nintendo RPG screen.

@Image2 is HANNIBAL -- Carthaginian general in red-gold armor. Place him on the LEFT BANK (bottom-left of frame), standing on muddy ground near the reeds, facing right, WATCHING the river.

@Image3 is the WAR ELEPHANT on a wooden raft. Place it in the RIVER CENTER (middle of frame), floating on the water surface. The raft DRIFTS steadily toward the right bank.

@Image4 is a VOLQUE WARRIOR. Place 2 of them on the RIGHT CLIFF (upper-right of frame), standing on the plateau edge, facing left, HOLDING spears upright.

SECONDS 0 TO 2: Wide establishing shot. The river FLOWS with gentle pixel ripples. Hannibal STANDS still on the left bank, arms crossed, watching. The raft with the elephant is visible mid-river. The two Volque warriors STAND on the right cliff, shields raised.

SECONDS 2 TO 4: The raft DRIFTS steadily rightward. Water CHURNS in pixel foam around the raft edges. The elephant SHIFTS its weight, trunk SWINGING once. Hannibal TURNS his head slightly to track the raft.

SECONDS 4 TO 5: The raft REACHES the right bank. The two Volque warriors RAISE their spears upward in unison. Camera HOLDS STEADY throughout -- NO lateral tracking, NO pan, NO camera movement.

COLOR GRADE: pixel art palette -- steel blue river, warm amber cliffs, deep orange sunset sky, muted earth tones on the banks. Hard pixel edges everywhere.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue."""


def upload(path: Path) -> str:
    print(f"  Uploading {path.name}...")
    url = fal_client.upload_file(str(path))
    print(f"    -> {url}")
    return url


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in getattr(update, "logs", []) or []:
            msg = log.get("message", "") if isinstance(log, dict) else str(log)
            if msg:
                print(f"  [progress] {msg}")


def main():
    print("=== Seedance Beat 2 Hannibal -- reference-to-video ===")
    print(f"Output: {OUT_PATH}")

    # Upload refs
    print("\n[1/3] Uploading reference images...")
    image_urls = [upload(r) for r in REFS]

    # Submit + poll via fal_client.subscribe
    print("\n[2/3] Submitting job to fal.ai (will poll automatically)...")
    start = time.time()
    result = fal_client.subscribe(
        "bytedance/seedance-2.0/reference-to-video",
        arguments={
            "prompt": PROMPT,
            "image_urls": image_urls,
            "duration": 5,
            "aspect_ratio": "9:16",
            "generate_audio": False,
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )
    elapsed = time.time() - start
    print(f"  Completed in {elapsed:.0f}s")

    # Extract video URL
    video_url = None
    if isinstance(result, dict):
        if "video" in result and isinstance(result["video"], dict):
            video_url = result["video"].get("url")
        elif "videos" in result and result["videos"]:
            video_url = result["videos"][0].get("url")
        elif "url" in result:
            video_url = result["url"]

    if not video_url:
        print("ERROR: No video URL in result:")
        print(json.dumps(result, indent=2, default=str))
        sys.exit(1)

    print(f"  Video URL: {video_url}")

    # Save meta
    meta = {
        "tool": "fal-ai/bytedance/seedance-2.0/reference-to-video",
        "duration": 5,
        "aspect_ratio": "9:16",
        "generate_audio": False,
        "image_refs": [r.name for r in REFS],
        "prompt_chars": len(PROMPT),
        "video_url": video_url,
        "generation_seconds": round(elapsed),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    meta_path = OUT_DIR / "beat2-r2v-test1.meta.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  Meta saved: {meta_path}")

    # Download
    print("\n[3/3] Downloading video...")
    urllib.request.urlretrieve(video_url, OUT_PATH)
    size_mb = OUT_PATH.stat().st_size / 1024 / 1024
    print(f"  Saved: {OUT_PATH} ({size_mb:.1f} MB)")

    # Save prompt sidecar
    prompt_path = OUT_DIR / "beat2-r2v-test1.prompt.txt"
    prompt_path.write_text(PROMPT)
    print(f"  Prompt sidecar: {prompt_path}")

    print("\n=== DONE ===")
    print(f"Video: {OUT_PATH}")


if __name__ == "__main__":
    main()
