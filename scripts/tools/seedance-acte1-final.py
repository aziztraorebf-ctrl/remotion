"""Soundjata Acte I — Seedance 2.0 reference-to-video generation (FINAL).

Storyboard-to-video technique with 4 reference images:
1. Storyboard 6-panel v5 (primary composition guide)
2. Soumaoro canon (identity lock for panels 2 and 4)
3. Baby Soundjata canon (identity lock for panels 5 and 6)
4. Sogolon canon (identity lock for panel 5 - use LEFT woman only)

Narration measured: 12.12s (Whisper). Clip duration: 12s (tight narration sync).
Aspect ratio: 9:16 (YouTube Shorts).
Resolution: 720p.
Cost: ~$3.60 (12s × $0.30/s).
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set")
    sys.exit(1)

import fal_client

REPO = Path("/Users/clawdbot/Workspace/remotion")

REFS = [
    REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte1/storyboard-6panels-v5.png",
    REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/soumaoro-combat-ref.png",
    REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte1/soundjata-baby-ref.png",
    REPO / "tmp/heros-oublies-styleref/soundjata-insult-starting-pose-styleref.png",
]

OUTPUT_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUTPUT_MP4 = OUTPUT_DIR / "acte1-v2.mp4"
OUTPUT_META = OUTPUT_DIR / "acte1-v2.meta.json"

PROMPT = """2D vivid flat illustration style, 13th century West African epic opening sequence.

References with strict role separation:
- Image 1 = storyboard 6-panel layout -> PRIMARY GUIDE for composition, shot order, framing, and timing. Follow panels in reading order (top-left to bottom-right).
- Image 2 = Soumaoro canon identity (dreadlocks, black robe, red magic, fetish necklaces) -> lock for panels 2 and 4.
- Image 3 = baby Soundjata canon identity (toddler 3-4 years old) -> lock for panels 5 and 6.
- Image 4 = Sogolon canon identity -> USE ONLY the woman on the LEFT SIDE of this image (turquoise turban and turquoise dress). IGNORE the woman on the right (blue patterned dress). Lock for panel 5.

Create a dark-mood opening depicting a tyrannized Mande land, a whispered prophecy, and a disabled baby heir.

Absolute priorities:
1. EXACTLY 6 shots total, ~2s each, minimal camera movement. NO additional zooms or shots after panel 6.
2. Timing mapping: panels 1-2 cover seconds 0-4, panels 3-4 cover seconds 4-8, panels 5-6 cover seconds 8-12.
3. Panel 6 is the narrative punchline: the baby's visibly frail legs MUST be the focus, legs extended forward, hands on ground for support, gaze toward his own legs.
4. Authentic 13th century West African Mande setting: traditional handwoven cotton, indigo and terracotta dyes, leather, cowrie shells. No modern garments, no anachronistic materials.
5. NO additional characters beyond those shown in the storyboard panels. No extra adults, no praying figures, no meditating men.
6. Keep Soumaoro's dreadlocks and red magic consistent between panels 2 and 4.
7. Keep mother Sogolon's turquoise turban and robe consistent.

Color grade: desaturated cinematic, blood-red sky for panels 1-2, warmer daylight for panels 5-6. Dramatic shadow and firelight mood.

No text, no banners, no signs, no writing visible anywhere."""


def main():
    print("=" * 70)
    print("SEEDANCE 2.0 — Soundjata Acte I (FINAL, reference-to-video)")
    print("=" * 70)
    print()

    # Step 1: verify refs
    print("[1/4] Verifying reference files...")
    for ref in REFS:
        if not ref.exists():
            print(f"  MISSING: {ref}")
            sys.exit(1)
        size_kb = ref.stat().st_size // 1024
        print(f"  OK ({size_kb} KB) {ref.name}")
    print()

    # Step 2: upload refs
    print("[2/4] Uploading references to fal.ai CDN...")
    ref_urls = []
    for ref in REFS:
        url = fal_client.upload_file(str(ref))
        print(f"  {ref.name} -> {url}")
        ref_urls.append(url)
    print()

    # Step 3: submit
    print("[3/4] Submitting to Seedance 2.0 reference-to-video...")
    print(f"  Endpoint: bytedance/seedance-2.0/reference-to-video")
    print(f"  Duration: 12s (narration: 12.12s)")
    print(f"  Aspect: 9:16")
    print(f"  Resolution: 720p")
    print(f"  Audio: generate_audio=true (keep-and-duck in post)")
    print(f"  Refs: {len(ref_urls)} images")
    print(f"  Est. cost: $3.60")
    print()

    args = {
        "prompt": PROMPT,
        "reference_image_urls": ref_urls,
        "duration": "12",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
    }

    handler = fal_client.submit(
        "bytedance/seedance-2.0/reference-to-video",
        arguments=args,
    )
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")
    print()

    # Poll
    print("  Polling for completion...")
    start = time.time()
    last_log = ""
    while True:
        status = fal_client.status(
            "bytedance/seedance-2.0/reference-to-video",
            request_id,
            with_logs=False,
        )
        elapsed = int(time.time() - start)
        status_name = type(status).__name__
        if status_name != last_log:
            print(f"    [{elapsed}s] status: {status_name}")
            last_log = status_name
        if status_name == "Completed":
            break
        if elapsed > 600:
            print("  TIMEOUT after 10 min")
            sys.exit(1)
        time.sleep(5)

    result = fal_client.result(
        "bytedance/seedance-2.0/reference-to-video",
        request_id,
    )
    print()

    # Step 4: download + save
    print("[4/4] Downloading video and metadata...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  URL: {video_url}")
    print(f"  Seed: {seed}")
    print(f"  Size: {file_size} bytes ({file_size/1024/1024:.1f} MB)")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED video: {OUTPUT_MP4}")

    meta = {
        "request_id": request_id,
        "endpoint": "fal-ai/bytedance/seedance/v1/pro/reference-to-video",
        "duration_s": 12,
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "refs": [r.name for r in REFS],
        "prompt": PROMPT,
        "cost_usd_estimate": 3.60,
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta: {OUTPUT_META}")
    print()
    print("=" * 70)
    print(f"DONE — review video: {OUTPUT_MP4}")
    print("=" * 70)


if __name__ == "__main__":
    main()
