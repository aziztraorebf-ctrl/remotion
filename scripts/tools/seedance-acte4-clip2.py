"""
Seedance 2.0 image-to-video — Soundjata Acte IV, Clip 2
"Le lion du Manden revient" (5s mono-shot, ancrage frame 1)

Input : soundjata-lion-returns-ref.png (CANON tresses + tunique blanche + sash rouge + sabre leve + cheval noir)
Output: acte4-clip2-lion-revient-v1.mp4 (720p 9:16 5s)
Cost  : ~$1.50
"""

import os
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
IMG_REF = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4/soundjata-lion-returns-ref.png"
OUT_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "acte4-clip2-lion-revient-v1.mp4"

PROMPT = """2D vivid flat illustration style, epic cinematic West African.

Animate this image into a 5-second epic shot. Soundjata, adult Mandinka warrior with woven braids, white tunic with gold collar, red sash flowing in the wind, curved saber raised high, mounted on a black stallion on a savanna hilltop, orange sunrise rim-lighting his silhouette.

Subtle motion only: the horse REARS slightly once around mid-clip (controlled, measured movement, not frantic). Soundjata's red sash and the horse's mane gently flow in steady wind. Soundjata's saber stays raised throughout. Slow camera dolly-in over 5 seconds to amplify the epic feel.

Absolute priority:
1. Soundjata keeps his canonical appearance (woven braids, white tunic, red sash, curved saber). NO beard, NO short hair, NO indigo robe.
2. The horse's anatomy is NORMAL (4 legs, 1 tail, no morphing).
3. The saber stays RIGID, length constant, does not stretch or bend.
4. The sunrise stays behind him as backlight, not front light.

Important: no text, no banners, no letters anywhere. No music, no dialogue, no words — only wind and horse breath ambient. Calm controlled motion, not chaotic."""


def upload(path: Path) -> str:
    print(f"[UPLOAD] {path.name}...", flush=True)
    url = fal_client.upload_file(str(path))
    print(f"         -> {url}", flush=True)
    return url


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"  [fal] {log.get('message', '')}", flush=True)


def main():
    print("=" * 60)
    print("SEEDANCE 2.0 image-to-video — Soundjata Acte IV Clip 2")
    print("Le lion du Manden revient (5s mono-shot)")
    print("=" * 60)

    if not IMG_REF.exists():
        raise FileNotFoundError(f"Ref image not found: {IMG_REF}")

    img_url = upload(IMG_REF)

    endpoint = "bytedance/seedance-2.0/image-to-video"
    args = {
        "prompt": PROMPT,
        "image_url": img_url,
        "duration": "5",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       prompt: {len(PROMPT)} chars")
    print(f"       duration=5s, 720p, 9:16, audio=True")
    print(f"       estimated cost: ~$1.50\n", flush=True)

    t0 = time.time()
    result = fal_client.subscribe(
        endpoint, arguments=args, with_logs=True, on_queue_update=on_queue_update
    )
    elapsed = time.time() - t0
    print(f"\n[DONE] {elapsed:.1f}s")

    video_url = result.get("video", {}).get("url") if isinstance(result.get("video"), dict) else None
    if not video_url:
        print(f"[WARN] no video url in result: {result}")
        return

    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, OUT_PATH)
    size_mb = OUT_PATH.stat().st_size / 1024 / 1024
    print(f"[SAVED] {OUT_PATH} ({size_mb:.1f} MB)")
    print(f"\nOUTPUT_PATH={OUT_PATH}")
    print(f"VIDEO_URL={video_url}")


if __name__ == "__main__":
    main()
