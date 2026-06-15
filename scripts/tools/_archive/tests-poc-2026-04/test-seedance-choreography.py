"""
Seedance 2.0 Reference-to-Video Test — Choreography Transfer
Tests whether Seedance can reproduce the motion of a reference video
applied to our characters (Soundjata vs Soumaoro).

Inputs:
- @image1: Soundjata combat ref
- @image2: Soumaoro combat ref
- @video1: choreography reference (8s segment from anime fight)

Output: 10s 9:16 video at 1080p
Expected cost: ~$1.80
"""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
SOUNDJATA_REF = ROOT / "public/assets/library/geoafrique/soundjata/combat-refs/soundjata-combat-ref.png"
SOUMAORO_REF = ROOT / "public/assets/library/geoafrique/soundjata/combat-refs/soumaoro-combat-ref.png"
VIDEO_REF = Path("/tmp/choreo-segments/seg_B_4-12s.mp4")

OUT_DIR = ROOT / "public/assets/library/geoafrique/soundjata/combat-tests"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat anime illustration style, painted graphic novel aesthetic, bold clean outlines, cel-shaded flat colors.

SCENE: 13th century West Africa, rocky savanna at dusk. Two warriors face off on dusty ochre ground with scattered boulders, distant haze of golden-orange sky. Wide cinematic shot.

CHARACTERS:
@image1 is SOUNDJATA (right side of frame): young Mandinka warrior, dark brown skin, short braided hair, WHITE tunic with GOLD trim and RED sash, holding a CURVED STEEL SABRE in his RIGHT HAND.
@image2 is SOUMAORO (left side of frame): older Sosso sorcerer-king, dark brown skin, long black dreadlocks, BLACK robe with DARK RED geometric patterns, bone amulets on chest, BOTH HANDS open with faint dark red magical glow. NO WEAPON — fights with sorcery.

CHOREOGRAPHY (follow @video1 for camera movement, rhythmic timing, and fight staging):

0-2s (Wide shot, camera static): Both warriors in combat stance, facing each other across the dusty ground. Soumaoro LEFT with palms raised, Soundjata RIGHT with sabre raised diagonally. Both PLANT their feet firmly, bodies COILED with tension. Dust drifts slowly in the foreground.

2-4s (Snap zoom in toward the clash point): Soundjata LUNGES forward with explosive speed, sabre SLICING horizontally toward Soumaoro. Soumaoro SNAPS both hands up, casting a burst of dark red energy to block. A shockwave of DUST SWIRLS outward from between them as the blade meets the magical barrier.

4-6s (Medium close-up, camera tracks the action): The two clash in close range — Soundjata STRIKES twice in rapid succession, the curved blade flashing. Soumaoro PIVOTS his body, deflecting each strike with glowing palms, dark red sparks EXPLODING at each contact point. Their faces are fierce, eyes locked.

6-8s (Pull back to wide shot, camera steady): Soundjata SPINS away and lands in a new stance on the right, sabre now held low. Soumaoro STAGGERS one step back on the left, hands still glowing. Both panting, locked in a standoff, dust settling around them.

COLOR GRADE: warm ochre dust, deep indigo shadows, white tunic pops against the dark robe, dark red magical glow as the only saturated accent on Soumaoro's side. Cinematic sunset warmth.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue. Clean skin, no markings or tattoos on bodies. The human body structure is normal, without motion distortion, without abrupt changes, no unnecessary spins."""


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
    assert os.getenv("FAL_KEY"), "FAL_KEY missing in .env"
    assert SOUNDJATA_REF.exists(), f"Missing: {SOUNDJATA_REF}"
    assert SOUMAORO_REF.exists(), f"Missing: {SOUMAORO_REF}"
    assert VIDEO_REF.exists(), f"Missing: {VIDEO_REF}"

    print("=" * 60)
    print("SEEDANCE 2.0 REFERENCE-TO-VIDEO — CHOREOGRAPHY TEST")
    print("=" * 60)

    # Upload all 3 files
    img1 = upload(SOUNDJATA_REF)
    img2 = upload(SOUMAORO_REF)
    vid1 = upload(VIDEO_REF)

    # Seedance 2.0 endpoint (confirmed via fal.ai API docs 2026-04-13)
    endpoint = "bytedance/seedance-2.0/reference-to-video"

    args = {
        "prompt": PROMPT,
        "image_urls": [img1, img2],
        "video_urls": [vid1],
        "duration": "10",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": False,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       duration=10s, 720p, 9:16")
    print(f"       @image1={SOUNDJATA_REF.name}")
    print(f"       @image2={SOUMAORO_REF.name}")
    print(f"       @video1={VIDEO_REF.name}")
    print(f"       estimated cost: ~$3.02 (10s * $0.3024/s)\n", flush=True)

    t0 = time.time()
    try:
        result = fal_client.subscribe(
            endpoint,
            arguments=args,
            with_logs=True,
            on_queue_update=on_queue_update,
        )
    except Exception as e:
        print(f"\n[ERROR] {type(e).__name__}: {e}")
        print("\nSchema hint — retry with simpler args:")
        # Fallback: try without reference_video_urls to see if endpoint exists
        raise

    elapsed = time.time() - t0
    print(f"\n[DONE] {elapsed:.1f}s")
    print(f"[RESULT] {result}")

    video_url = result.get("video", {}).get("url") if isinstance(result.get("video"), dict) else result.get("video_url")
    if not video_url:
        print(f"[WARN] no video url in result: {result}")
        return

    # Download
    import urllib.request
    out_path = OUT_DIR / f"test-choreography-transfer-{int(t0)}.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    main()
