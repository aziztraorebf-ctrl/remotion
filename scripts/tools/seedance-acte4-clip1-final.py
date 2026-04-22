"""Soundjata Acte IV Clip 1 — Seedance 2.0 reference-to-video (FINAL).

Storyboard-to-video technique with 5 reference images:
1. Storyboard 4-panel v3 (primary composition guide - Kimi DA direction)
2. Soundjata young (child/teen from Acte III baobab) - panel 1 identity
3. Soundjata adult warrior canon (white tunic, red sash, sword) - panels 2+4
4. 3 Mande messengers on horseback (blue/red/green turbans) - panels 3+4
5. Mema environment (red-earth minaret, palm trees) - panel 2 background

Narration window: 14.32s (48.44s -> 62.76s in timing-soundjata.ts).
Clip duration: 14s (deficit 0.32s, absorbable via freeze/crossfade in Remotion).
Aspect ratio: 9:16 (YouTube Shorts).
Resolution: 720p.
Cost: ~$4.23 (14s x $0.3024/s).
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
REFS_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4"

REFS = [
    REFS_DIR / "storyboard-acte4-clip1-4panels-v3.png",
    REFS_DIR / "soundjata-young-exile-ref.jpg",
    REFS_DIR / "soundjata-adult-warrior-ref.png",
    REFS_DIR / "messagers-cavaliers-ref.png",
    REFS_DIR / "mema-environment.png",
]

OUTPUT_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUTPUT_MP4 = OUTPUT_DIR / "acte4-clip1-exil-mema-messagers-v2.mp4"
OUTPUT_META = OUTPUT_DIR / "acte4-clip1-exil-mema-messagers-v2.meta.json"

PROMPT = """2D vivid flat BD illustrated style, semi-detailed, warm African palette. 13th century West African epic. Exile, growth, and call to destiny — 4 shots in 14 seconds.

CRITICAL IDENTITY AND STYLE RULE: character faces, hairstyles, skin tones, and clothing MUST match the reference images EXACTLY. The storyboard (Image 1) provides shot ORDER and COMPOSITION only. Character IDENTITY and VISUAL STYLE come from the character reference images (Images 2-5), NOT from the storyboard sketches. The final video must look like the character references brought to life, not like the storyboard sketches animated.

References with strict role separation:
- Image 1 = storyboard 4-panel layout -> COMPOSITION GUIDE ONLY for shot order and framing. Follow panels in reading order (top-left, top-right, bottom-left, bottom-right). Do NOT copy the storyboard drawing style.
- Image 2 = young Soundjata CANON identity -> lock for panel 1 ONLY. Dark-skinned child/adolescent, bare-chested, simple brown loincloth, barefoot, short hair. MATCH THIS FACE AND BODY EXACTLY.
- Image 3 = adult Soundjata warrior CANON identity -> lock for panels 2 and 4. Dark-skinned young adult, distinctive woven braids falling on left side, white tunic with gold collar trim, red sash at waist, ONE single curved sword in right hand, clean-shaven, muscular build. MATCH THIS FACE, HAIRSTYLE, AND OUTFIT EXACTLY.
- Image 4 = three Mande messenger horsemen CANON identity -> lock for panels 3 and 4. Lead rider: blue turban, indigo boubou. Second: tan/red turban. Third: green turban. Horses bay/black/white. MATCH THESE FACES AND OUTFITS EXACTLY.
- Image 5 = Mema environment -> lock for panel 2 background. Red-earth architecture, tall mud-minaret, palm trees, Sahelian landscape.

Emotional arc: melancholy departure -> disciplined solitude -> urgent gallop -> kneeling supplication.

Absolute priorities:
1. EXACTLY 4 shots, ~3.5s each. Camera tracks, sweeps, and pushes — always in motion. No static shots.
2. Panel 1: young Soundjata (Image 2 face) STRIDES away, dust KICKS from barefoot steps, wind PULLS at his loincloth. Village silhouettes recede behind. Golden sunset.
3. Panel 2: adult Soundjata (Image 3 face, braids, white tunic, red sash) SLASHES ONE SINGLE sword in sharp horizontal arc, blade CUTS through dusty air, body PIVOTS into the strike. Mema minaret towers behind. NO second sword, NO scabbard.
4. Panel 3: horsemen (Image 4 faces, same turbans) CHARGE left-to-right in strict lateral profile, hooves THUNDER across dry savanna, dust ERUPTS behind, camera SWEEPS alongside.
5. Panel 4: over-the-shoulder from behind Soundjata (Image 3 braids visible from behind) — messenger DROPS to knees, hands CLASP in supplication. Two riders PULL reins behind him. Moment of realization, not triumph.
6. Soundjata and Mema are the key names of this story.
7. Authentic 13th century Mande: handwoven cotton, indigo dyes, leather, cowrie shells. No modern elements.

Color palette: amber, ochre, indigo, dusty red. Warm dusk and dawn light. No cold blue tones.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue."""


def main():
    print("=" * 70)
    print("SEEDANCE 2.0 — Soundjata Acte IV Clip 1 (FINAL, reference-to-video)")
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
    print(f"  Duration: 14s (narration window: 14.32s)")
    print(f"  Aspect: 9:16")
    print(f"  Resolution: 720p")
    print(f"  Audio: generate_audio=true (keep-and-duck 30% in post)")
    print(f"  Refs: {len(ref_urls)} images")
    print(f"  Est. cost: $4.23")
    print()

    args = {
        "prompt": PROMPT,
        "reference_image_urls": ref_urls,
        "duration": "14",
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
    print(f"  Size: {file_size} bytes ({file_size/1024/1024:.1f} MB)" if file_size else "  Size: unknown")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED video: {OUTPUT_MP4}")

    meta = {
        "request_id": request_id,
        "endpoint": "bytedance/seedance-2.0/reference-to-video",
        "duration_s": 14,
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "refs": [r.name for r in REFS],
        "prompt": PROMPT,
        "cost_usd_estimate": 4.23,
        "version": "v2-identity-fidelity-fix",
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta: {OUTPUT_META}")
    print()
    print("=" * 70)
    print(f"DONE — review video: {OUTPUT_MP4}")
    print("=" * 70)


if __name__ == "__main__":
    main()
