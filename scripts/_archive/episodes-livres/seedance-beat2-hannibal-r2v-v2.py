"""
Seedance 2.0 reference-to-video -- Beat 2 Hannibal v2
Traversee du Rhone -- prompt valide Aziz 2026-05-05
5 refs: rhone bg + hannibal + elephant (x2 slots) + soldat-carthaginois
Duration: 10s, aspect_ratio: 9:16, generate_audio: true
Cost estimate: ~$1.81 (10s x $0.1814/s, r2v discount)
Output: public/hannibal/assets/video-tests/beat2-r2v-v2.mp4
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
    ROOT / "public/hannibal/assets/backgrounds/rhone-traversee.png",        # @Image1 env
    ROOT / "public/_lab-hannibal/sprites/hannibal/east.png",                 # @Image2 Hannibal
    ROOT / "public/hannibal/assets/elephant-radeau.png",                     # @Image3 raft foreground
    ROOT / "public/hannibal/assets/elephant-radeau.png",                     # @Image4 raft background (same file, 2nd slot)
    ROOT / "public/hannibal/assets/characters/soldat-carthaginois/east.png", # @Image5 soldiers
]

OUT_DIR = ROOT / "public/hannibal/assets/video-tests"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "beat2-r2v-v2.mp4"

PROMPT = """Pixel art 16-bit SNES RPG style. Square pixels, hard edges, flat shading, limited palette of steel-blue/purple/orange/amber/grey. NO anti-aliasing, NO photorealism, NO smooth gradients, NO cartoon softness. Every element must look like a Super Nintendo RPG battle screen.

@Image1 defines the complete visual environment -- the Rhone river, rocky right cliff with conifers and golden grass, reedy muddy left bank with orange autumn trees, crepuscular purple-orange sky. This is the ONLY environment -- do NOT add or remove landscape elements.

@Image2 is HANNIBAL -- Carthaginian general in red-gold armor and plumed helmet. Place him on the LEFT BANK at the bottom-left of the frame, facing right, watching the river. He CONTINUOUSLY SHIFTS his weight, arms ALTERNATELY crossing and uncrossing, eyes TRACKING the moving raft throughout the entire clip.

@Image3 is the WAR ELEPHANT on a wooden raft. Place it in the CENTER of the river at frame 0. It CONTINUOUSLY DRIFTS rightward throughout the entire clip and EXITS the right edge of the frame completely by second 9. It NEVER stops. It NEVER reaches a bank. It NEVER docks. The elephant's trunk CONTINUOUSLY SWINGS side to side in a steady rhythmic arc from second 0 to second 10, NON-STOP.

@Image4 is also the WAR ELEPHANT on a wooden raft -- place a SECOND smaller version further back in the river, higher in the frame, suggesting distance. This second raft also DRIFTS rightward continuously, slower than the first.

@Image5 is a CARTHAGINIAN SOLDIER. Place 3 of them grouped on the LEFT BANK behind Hannibal, facing right. They SHUFFLE in place, NUDGE each other, shields TAPPING, waiting. One POINTS toward the river.

SECONDS 0 TO 3: Wide establishing shot. Camera HOLDS STEADY with only the faintest micro-breath vibration -- no pan, no tilt, no tracking. The river FLOWS with continuous pixel ripple animations across its entire surface. Two pixel clouds DRIFT slowly rightward across the upper sky throughout the entire clip. Hannibal WATCHES the main raft. Both rafts visible -- one mid-river, one smaller further back.

SECONDS 3 TO 7: The main raft ACCELERATES its rightward drift, now crossing toward the right third of the frame. The elephant's trunk SWINGS in wide arcs. White pixel foam CHURNS continuously around the raft edges. Hannibal UNCROSSES his arms and PLANTS his fist on his hip. The soldiers behind him STIR and MURMUR, one RAISING his spear briefly.

SECONDS 7 TO 10: The main raft SLIDES fully off the right edge of the frame -- last pixel exits by second 9. The river CONTINUES FLOWING with ripples where the raft was. Hannibal NODS once then TURNS slightly toward his troops. The soldiers behind him REACT -- one RAISES his fist. The smaller second raft continues drifting rightward in the background. Clouds continue drifting.

COLOR GRADE: Steel-blue river with grey-white ripple pixels. Amber-gold cliff grass. Dark grey stone cliff. Deep purple-to-orange gradient sky in hard pixel color steps -- NO soft gradients. Orange-rust autumn foliage left bank. Hannibal in red-gold pixels. Soldiers in dark navy-bronze. Hard pixel edges everywhere, zero anti-aliasing.

No text, no banners, no signs, no writing visible anywhere. No words, no dialogue, no music."""


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
    print("=== Seedance Beat 2 Hannibal v2 -- reference-to-video ===")
    print(f"Output: {OUT_PATH}")
    print(f"Refs: {[r.name for r in REFS]}")

    # Upload refs (Image4 is same file as Image3 -- fal_client deduplicates upload but both slots needed)
    print("\n[1/3] Uploading reference images...")
    image_urls = [upload(r) for r in REFS]

    # Submit + poll
    print("\n[2/3] Submitting job to fal.ai (10s clip, generate_audio=true)...")
    print(f"  Endpoint: bytedance/seedance-2.0/reference-to-video")
    start = time.time()
    result = fal_client.subscribe(
        "bytedance/seedance-2.0/reference-to-video",
        arguments={
            "prompt": PROMPT,
            "image_urls": image_urls,
            "duration": 10,
            "aspect_ratio": "9:16",
            "generate_audio": True,
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
        "version": "v2",
        "duration": 10,
        "aspect_ratio": "9:16",
        "generate_audio": True,
        "image_refs": [r.name for r in REFS],
        "prompt_chars": len(PROMPT),
        "video_url": video_url,
        "generation_seconds": round(elapsed),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "cost_estimate_usd": round(10 * 0.1814, 2),
    }
    meta_path = OUT_DIR / "beat2-r2v-v2.meta.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  Meta saved: {meta_path}")

    # Download
    print("\n[3/3] Downloading video...")
    urllib.request.urlretrieve(video_url, OUT_PATH)
    size_mb = OUT_PATH.stat().st_size / 1024 / 1024
    print(f"  Saved: {OUT_PATH} ({size_mb:.1f} MB)")

    # Save prompt sidecar
    prompt_path = OUT_DIR / "beat2-r2v-v2.prompt.txt"
    prompt_path.write_text(PROMPT)
    print(f"  Prompt sidecar: {prompt_path}")

    print("\n=== DONE ===")
    print(f"Video: {OUT_PATH}")
    print(f"URL publique: {video_url}")


if __name__ == "__main__":
    main()
