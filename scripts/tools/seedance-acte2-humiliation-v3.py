"""Soundjata Acte II Setup Humiliation v3 -- Seedance 2.0 reference-to-video.

5 reference images (storyboard + character refs + environment):
1. storyboard-3panels-humiliation-v1.png (composition guide)
2. soundjata-enfant-7ans-ref.png (Soundjata 7-8 year old boy)
3. start-frame-humiliation.png (Matrone identity)
4. end-frame-humiliation.png (Sogolon + Matrone confrontation)
5. village-daytime-plate.png (Village environment)

Duration: 9s. Aspect: 9:16. Resolution: 720p.
Estimated cost: ~$2.70 (9s x $0.30/s).
"""

import os
import sys
import json
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set in .env")
    sys.exit(1)

import fal_client

REPO = Path("/Users/clawdbot/Workspace/remotion")
REFS_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2"

REFS = [
    REFS_DIR / "storyboard-3panels-humiliation-v1.png",
    REFS_DIR / "soundjata-enfant-7ans-ref.png",
    REFS_DIR / "start-frame-humiliation.png",
    REFS_DIR / "end-frame-humiliation.png",
    REFS_DIR / "village-daytime-plate.png",
]

OUTPUT_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUTPUT_MP4 = OUTPUT_DIR / "acte2-setup-v3.mp4"
OUTPUT_META = OUTPUT_DIR / "acte2-setup-v3.meta.json"
OUTPUT_PROMPT = OUTPUT_DIR / "acte2-setup-v3.prompt.txt"

PROMPT = """2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors. 13th century West African Mande village, humiliation scene.

References with strict role separation:
- Image 1 = storyboard 3-panel layout -> COMPOSITION GUIDE ONLY for shot order, framing, and timing. Do NOT copy the sketch style - use character ref colors and style.
- Image 2 = Soundjata, a 7-8 YEAR OLD BOY (NOT a baby, NOT a toddler), crawling on all fours in the dust. Lock his face and body proportions across all shots.
- Image 3 = The Matrone (first wife of the king), standing tall in blue geometric pagne wrap, indigo turban, pearl necklace, hand on hip, finger pointing. Lock her identity.
- Image 4 = Matrone confronting Sogolon (Soundjata's mother, teal turban, teal dress, head bowed in shame). Lock both identities.
- Image 5 = Village environment: round banco huts with thatched roofs, baobab tree, red laterite ground, warm ochre sky.

Create a 3-shot scene of public humiliation in a Mande village courtyard:

SHOT 1 (0-3s): WIDE establishing. Soundjata (7-8 YEAR OLD BOY, same as Image 2) CRAWLS forward on hands and knees through red dust. Village women stand on either side, WHISPERING to each other, some SHAKING their heads. Baobab tree and banco huts in background. Camera HOLDS steady, low angle near ground level.

SHOT 2 (3-6s): MEDIUM. The Matrone STRIDES into the village square, chin raised, one hand on hip. She POINTS dismissively toward Soundjata off-screen. Two attendants LEAN in behind her. Expression: cruel satisfaction. Camera at eye level, slight push-in.

SHOT 3 (6-9s): TWO-SHOT. Matrone TOWERS over Sogolon, finger JABBING toward her face. Sogolon SHRINKS back, shoulders DROP, head BOWS. Village crowd GATHERS behind them as silent witnesses. Warm evening light casts long shadows. Camera HOLDS steady.

Color grade: warm amber-ochre earth tones throughout, deepening slightly in shot 3 (emotional weight).

No text, no banners, no signs, no writing visible anywhere. No morphing between shots - clean hard CUTS only. No modern clothing - traditional handwoven cotton, indigo dye, cowrie shells only."""

ENDPOINT = "bytedance/seedance-2.0/reference-to-video"


def main():
    print("=" * 70)
    print("SEEDANCE 2.0 -- Soundjata Acte II Setup Humiliation v3")
    print("reference-to-video | 9s | 9:16 | 720p | 5 refs")
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
    print("[2/4] Uploading 5 references to fal.ai CDN...")
    ref_urls = []
    for ref in REFS:
        url = fal_client.upload_file(str(ref))
        print(f"  {ref.name} -> {url}")
        ref_urls.append(url)
    print()

    # Step 3: submit
    print(f"[3/4] Submitting to {ENDPOINT}...")
    print(f"  Duration: 9s")
    print(f"  Aspect: 9:16")
    print(f"  Resolution: 720p")
    print(f"  Audio: generate_audio=true")
    print(f"  Refs: {len(ref_urls)} images")
    print(f"  Prompt: {len(PROMPT)} chars")
    print(f"  Est. cost: ~$2.70")
    print()

    args = {
        "prompt": PROMPT,
        "reference_image_urls": ref_urls,
        "duration": "9",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
    }

    handler = fal_client.submit(ENDPOINT, arguments=args)
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")
    print()

    # Poll for completion
    print("  Polling for completion...")
    start = time.time()
    last_log = ""
    while True:
        status = fal_client.status(ENDPOINT, request_id, with_logs=False)
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

    result = fal_client.result(ENDPOINT, request_id)
    total_time = int(time.time() - start)
    print()

    # Step 4: download + save
    print("[4/4] Downloading video and saving metadata...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size", 0)
    print(f"  URL: {video_url}")
    print(f"  Seed: {seed}")
    if file_size:
        print(f"  Remote size: {file_size} bytes ({file_size / 1024 / 1024:.1f} MB)")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, str(OUTPUT_MP4))
    local_size = OUTPUT_MP4.stat().st_size
    local_mb = local_size / (1024 * 1024)
    print(f"  Saved: {OUTPUT_MP4} ({local_mb:.2f} MB)")

    # Metadata
    meta = {
        "tool": "seedance-2.0/reference-to-video",
        "endpoint": ENDPOINT,
        "request_id": request_id,
        "seed": seed,
        "video_url": video_url,
        "refs": [str(r) for r in REFS],
        "ref_urls": ref_urls,
        "prompt_length": len(PROMPT),
        "duration": "9s",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
        "generation_time_s": total_time,
        "file_size_bytes": local_size,
        "cost_estimate": "$2.70",
        "date": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    with open(OUTPUT_META, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  Meta: {OUTPUT_META}")

    with open(OUTPUT_PROMPT, "w") as f:
        f.write(PROMPT)
    print(f"  Prompt: {OUTPUT_PROMPT}")

    print()
    print("=" * 70)
    print("COMPLETE")
    print(f"  Video:    {OUTPUT_MP4}")
    print(f"  Size:     {local_mb:.2f} MB")
    print(f"  Seed:     {seed}")
    print(f"  Time:     {total_time}s")
    print(f"  Cost:     ~$2.70")
    print(f"  Request:  {request_id}")
    print("=" * 70)


if __name__ == "__main__":
    main()
