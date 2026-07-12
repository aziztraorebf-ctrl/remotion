"""Pecheur test v2 — Un seul beat (pose poisson + redressement + regard) — Grok Imagine Video 1.5.
Duree : 6s | Resolution : 720p | Cout ~= 6 * $0.14/s = $0.84
Corrige v1 : panier duplique (anti-duplication explicite) + morphing visage pendant rotation (audio cue + camera stable).
Repart de la frame ou le poisson est deja en main (extraite de v1), pas de l'image source originale.
"""

import os, sys, json, time, base64
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

XAI_API_KEY = os.environ.get("XAI_API_KEY", "")
if not XAI_API_KEY:
    print("ERROR: XAI_API_KEY not set"); sys.exit(1)

import requests

REPO = Path("/Users/clawdbot/Workspace/remotion")

SOURCE_IMAGE    = REPO / "public/assets/pecheur-grok-test/scenes/pecheur-holding-fish-frame.png"
OUTPUT_DIR      = REPO / "public/assets/pecheur-grok-test/clips"
OUTPUT_MP4      = OUTPUT_DIR / "pecheur-grok-v2.mp4"
OUTPUT_META     = OUTPUT_DIR / "pecheur-grok-v2.meta.json"
REQUEST_ID_FILE = OUTPUT_DIR / "pecheur-grok-v2.request-id.txt"

API_BASE = "https://api.x.ai/v1/videos"
MODEL = "grok-imagine-video-1.5"

DURATION      = 6
RESOLUTION    = "720p"
ASPECT_RATIO  = "16:9"
COST_ESTIMATE = 0.84   # 6s * $0.14/s (720p)

# v2 : un seul beat isole (le moment le plus fragile du v1 : pose + redressement + regard).
# Corrections : anti-duplication objet explicite, audio cue pendant rotation pour stabiliser le visage,
# "one action per clip" (doc Grok Imagine 1.5), camera stable pendant la rotation.
PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY: minimalist ink-line 2D flat illustration — thin black outlined stick-figure character, flat solid color fills, no shading beyond the existing sun halo, no added texture or detail, no photorealism, no 3D rendering. Do NOT drift toward anime or cartoon style.

The fisherman, already bent forward holding a fish in his hand, LOWERS the fish into the single wicker basket already resting at the bottom of the pirogue — the exact same basket visible in the source image. Do not add a second basket. Do not duplicate any object already present in the boat. There is only ever one crate on the left and one basket on the right, exactly as shown.

He STRAIGHTENS back up slowly and turns his gaze toward the horizon. His expression DARKENS — brow lowers, mouth flattens — and he goes still.

Sound: gentle water lapping against the wooden pirogue, a distant seabird call. Keep the audio continuous through the turn to help anchor the face during the movement.

Identity lock: dark brown skin, teal shirt, dark slate-grey pants, shaved head, calm profile face, same proportions throughout — face must not distort or morph during the turn. Pirogue and flat ink ocean/sky stay exactly consistent with the source image.

Camera holds completely steady, no rotation, no zoom, minimal handheld sway only. Normal human body structure, no anatomical distortion.

No text, no banners, no signs, no writing visible anywhere. No music, no dialogue, no dust motes, no floating particles, no extra characters, no extra objects."""


def submit_and_save_request_id():
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}"); sys.exit(1)
    print(f"  OK ({SOURCE_IMAGE.stat().st_size // 1024} KB) {SOURCE_IMAGE.name}")

    print("[2/4] Encoding image as base64 data URL...")
    img_bytes = SOURCE_IMAGE.read_bytes()
    b64 = base64.b64encode(img_bytes).decode("utf-8")
    image_data_url = f"data:image/png;base64,{b64}"
    print(f"  -> {len(b64)} chars base64")

    print("[3/4] Submitting to xAI Grok Imagine Video 1.5...")
    body = {
        "model": MODEL,
        "prompt": PROMPT,
        "image": {"url": image_data_url},
        "duration": DURATION,
        "aspect_ratio": ASPECT_RATIO,
        "resolution": RESOLUTION,
    }
    resp = requests.post(
        f"{API_BASE}/generations",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {XAI_API_KEY}",
        },
        json=body,
        timeout=60,
    )
    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text}"); sys.exit(1)

    data = resp.json()
    request_id = data["request_id"]
    print(f"  Request ID: {request_id}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    REQUEST_ID_FILE.write_text(
        f"{request_id}\n# model: {MODEL}\n"
        f"# saved_at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    return request_id


def poll_until_complete(request_id):
    print("  Polling...")
    start, last_status = time.time(), ""
    while True:
        resp = requests.get(
            f"{API_BASE}/{request_id}",
            headers={"Authorization": f"Bearer {XAI_API_KEY}"},
            timeout=30,
        )
        if resp.status_code != 200:
            print(f"  ERROR {resp.status_code}: {resp.text}"); sys.exit(1)
        data = resp.json()
        status = data.get("status", "unknown")
        elapsed = int(time.time() - start)
        if status != last_status:
            print(f"    [{elapsed}s] {status}"); last_status = status
        if status == "done":
            return data
        if status in ("failed", "expired"):
            print(f"  FAILED: {json.dumps(data, indent=2)}"); sys.exit(1)
        if elapsed > 600:
            print("  TIMEOUT — use --recover"); sys.exit(1)
        time.sleep(5)


def download_and_save(request_id, data):
    print("[4/4] Downloading...")
    video_url = data["video"]["url"]
    duration = data["video"].get("duration")
    print(f"  URL: {video_url}  |  Duration: {duration}s")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED: {OUTPUT_MP4}")

    OUTPUT_META.write_text(json.dumps({
        "request_id": request_id, "model": MODEL,
        "duration_s": DURATION, "resolution": RESOLUTION,
        "aspect_ratio": ASPECT_RATIO,
        "video_url": video_url,
        "source_image": SOURCE_IMAGE.name,
        "prompt": PROMPT, "cost_usd_estimate": COST_ESTIMATE,
        "raw_response": data,
    }, indent=2))


def recover():
    if not REQUEST_ID_FILE.exists():
        print(f"ERROR: {REQUEST_ID_FILE} not found"); sys.exit(1)
    rid = REQUEST_ID_FILE.read_text().splitlines()[0].strip()
    print(f"RECOVER: {rid}")
    data = poll_until_complete(rid)
    download_and_save(rid, data)


def main():
    print("=" * 60)
    if "--recover" in sys.argv:
        recover()
    else:
        rid = submit_and_save_request_id()
        data = poll_until_complete(rid)
        download_and_save(rid, data)
    print(f"\nDONE — {OUTPUT_MP4}")
    print("=" * 60)

if __name__ == "__main__":
    main()
