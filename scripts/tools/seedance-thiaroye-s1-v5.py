"""Thiaroye V5 Scene 1 v5 — Seedance 2.0 image-to-video (formule Sonjata 7s choregraphique).

V5 corrections from Aziz feedback on V4 (2026-04-23):
1. Duration: 7s (was 13s) — formule Sonjata courte valide. Long = risque statique.
2. Prompt condense : segments 3 (0-2s / 2-4s / 4-7s) au lieu de 4, verbes d'action MAJUSCULES
   explicites par personnage, pas de clause 7 tirailleurs (on laisse Seedance gerer).
3. R-SLOW corrige : "SLOW subtle dolly-in, barely perceptible forward push over 7 seconds"
   (V4 disait "13s" dans prompt — mismatch).
4. Dot-eyes renforce explicite : "pure black dot pupils, NO realistic eyes, NO visible iris".
5. generate_audio=True conserve (ambient port).

Source image : scene1-source-v4.png (V4 validee Aziz, pas archivee).
Endpoint : bytedance/seedance-2.0/image-to-video (RULE 75 — paper-craft REQUIRES i2v).
Cost : 7s x $0.30 = $2.10.

Recovery: Request ID sauvegarde immediatement dans .request-id.txt des la submission.
Si le polling coupe, relancer avec ce fichier pour recuperer le resultat.
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

SOURCE_IMAGE = REPO / "public/assets/thiaroye-1944/scene1/scene1-source-v4.png"

OUTPUT_DIR = REPO / "public/assets/thiaroye-1944/clips"
OUTPUT_MP4 = OUTPUT_DIR / "s1-retour-v5.mp4"
OUTPUT_META = OUTPUT_DIR / "s1-retour-v5.meta.json"
REQUEST_ID_FILE = OUTPUT_DIR / "s1-retour-v5.request-id.txt"

ENDPOINT = "bytedance/seedance-2.0/image-to-video"

# Prompt V5 -- formule Sonjata 7s choregraphique (validated Aziz 2026-04-23)
PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY: flat 2D paper-craft, cold grey-blue-olive palette, dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera: SLOW subtle dolly-in, barely perceptible forward push over 7 seconds. No pan, no rotation.

SECONDS 0 TO 2: The foreground tirailleur leaning on the railing SHIFTS his weight and LEANS forward, his gaze SCANNING the shore. The two tirailleurs in conversation GESTURE with their hands, one POINTING toward the city.

SECONDS 2 TO 4: The foreground tirailleur TURNS his head to observe further right. The central standing tirailleur LIFTS his beret slightly then LOWERS it. The seated soldier ADJUSTS his posture.

SECONDS 4 TO 7: The foreground tirailleur STRAIGHTENS up from the rail. The central beret tirailleur TURNS his head toward the shore. The conversation pair LEANS slightly against the cabin wall. All tirailleurs stay engaged, bodies continuously micro-shifting.

Continuous throughout: Harbor water RIPPLES around the ship hull. Gulls GLIDE across the distant sky. Pale factory smoke RISES from distant chimneys.

Characters STAY in their positions on deck -- no one walks, no one leaves frame. MAINTAIN dot-eyes throughout, pure black dot pupils, NO realistic eyes, NO visible iris, NO BD comic drift. No text, no banners.

Ambient: harbor water sounds, distant gull cries, light breeze, no dialogue, no music.
"""


def submit_and_save_request_id() -> str:
    """Upload source image, submit to Seedance, save request_id immediately."""
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}")
        sys.exit(1)
    size_kb = SOURCE_IMAGE.stat().st_size // 1024
    print(f"  OK ({size_kb} KB) {SOURCE_IMAGE.name}")
    print()

    print("[2/4] Uploading source image to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  -> {image_url}")
    print()

    print("[3/4] Submitting to Seedance 2.0 image-to-video...")
    print(f"  Endpoint   : {ENDPOINT}")
    print(f"  Duration   : 7s (formule Sonjata)")
    print(f"  Aspect     : 9:16")
    print(f"  Resolution : 720p")
    print(f"  Audio      : generate_audio=True")
    print(f"  Est. cost  : $2.10")
    print(f"  Prompt     : {len(PROMPT)} chars (~{len(PROMPT.split())} words)")
    print()

    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": "7",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
    }

    handler = fal_client.submit(ENDPOINT, arguments=args)
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    REQUEST_ID_FILE.write_text(
        f"{request_id}\n"
        f"# endpoint: {ENDPOINT}\n"
        f"# image_url: {image_url}\n"
        f"# saved_at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    print(f"  Request ID saved to: {REQUEST_ID_FILE}")
    print()

    return request_id, image_url


def poll_until_complete(request_id: str) -> None:
    """Poll Seedance until completion (max 10 min)."""
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
            print("  TIMEOUT after 10 min -- use recover mode with request_id")
            sys.exit(1)
        time.sleep(5)


def download_and_save(request_id: str, image_url: str) -> None:
    """Fetch result, download video, save metadata."""
    result = fal_client.result(ENDPOINT, request_id)
    print()

    print("[4/4] Downloading video and metadata...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  URL  : {video_url}")
    print(f"  Seed : {seed}")
    if file_size:
        print(f"  Size : {file_size} bytes ({file_size/1024/1024:.1f} MB)")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED video: {OUTPUT_MP4}")

    meta = {
        "request_id": request_id,
        "endpoint": ENDPOINT,
        "duration_s": 7,
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "source_image": SOURCE_IMAGE.name,
        "source_image_url": image_url,
        "prompt": PROMPT,
        "cost_usd_estimate": 2.10,
        "test_intent": (
            "V5 formule Sonjata 7s choregraphique -- segments condenses, "
            "verbes MAJUSCULES par personnage, R-SLOW corrige, dot-eyes renforce"
        ),
        "v5_corrections_vs_v4": [
            "duration: 7s (was 13s) -- formule Sonjata courte",
            "segments: 3 blocs (0-2s / 2-4s / 4-7s) au lieu de 4",
            "no clause '7 tirailleurs' -- laisse Seedance gerer",
            "R-SLOW: 'over 7 seconds' coherent avec duration",
            "dot-eyes: 'pure black dot pupils, NO realistic eyes, NO visible iris'"
        ]
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta : {OUTPUT_META}")


def recover_from_request_id() -> None:
    """Recover mode: read saved request_id and continue polling + download."""
    if not REQUEST_ID_FILE.exists():
        print(f"ERROR: no request ID file at {REQUEST_ID_FILE}")
        print("Run without --recover first to submit a new request.")
        sys.exit(1)
    lines = REQUEST_ID_FILE.read_text().splitlines()
    request_id = lines[0].strip()
    image_url = ""
    for line in lines[1:]:
        if line.startswith("# image_url:"):
            image_url = line.split(":", 1)[1].strip()
            break
    print(f"RECOVER MODE: request_id = {request_id}")
    print()
    poll_until_complete(request_id)
    download_and_save(request_id, image_url)


def main():
    print("=" * 70)
    print("SEEDANCE 2.0 -- Thiaroye V5 Scene 1 v5 (formule Sonjata 7s)")
    print("=" * 70)
    print()

    if "--recover" in sys.argv:
        recover_from_request_id()
    else:
        request_id, image_url = submit_and_save_request_id()
        poll_until_complete(request_id)
        download_and_save(request_id, image_url)

    print()
    print("=" * 70)
    print(f"DONE -- review video: {OUTPUT_MP4}")
    print("=" * 70)


if __name__ == "__main__":
    main()
