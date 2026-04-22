"""
Seedance 2.0 image-to-video: Acte 2 Trou A - Humiliation de Sogolon
Start frame + End frame, 6s, 9:16, 720p
"""
import os
import sys
import time
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

ROOT = Path(__file__).resolve().parents[2]
START_IMAGE = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/start-frame-humiliation.png"
END_IMAGE = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/end-frame-humiliation.png"
OUTPUT_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-pending"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat illustration style, bold black outlines, warm ochre and indigo palette, serious historical graphic novel cel-shaded aesthetic. No text, no banners, no signs, no writing visible anywhere. No unnecessary 360-degree turns. Without motion distortion. The human body structure is normal.

13th century Manden village. A tall dark brown-skinned West African woman (the rival wife Sassouma) in an indigo and ochre geometric-patterned wrap dress with dark blue turban and pearl necklace stands alone in the village clearing. She publicly mocks and humiliates another woman.

SECONDS 0 TO 2: Medium-wide shot, camera STEADY. Sassouma stands alone at center, mouth OPENS wide in cruel laughter, right arm EXTENDED pointing toward the RIGHT off-screen, finger JABBING repeatedly. Her left hand PRESSES against her hip in a pose of arrogant authority. Red laterite dust DRIFTS at her feet. Empty village clearing behind her.

SECONDS 2 TO 4: Camera HOLDS steady. From the RIGHT side of frame, a second woman \u2014 Sogolon, dark brown skin, wearing a simple turquoise wrap dress and turquoise turban \u2014 STEPS INTO the frame, approaching Sassouma. Sassouma TURNS her body to face Sogolon directly, chin LIFTING in contempt, lips CURLING into a cold sneer. Her right hand DROPS from pointing and PLANTS on her hip. Sogolon STOPS walking, shoulders SLUMPING, head BOWING downward under the weight of the public shame.

SECONDS 4 TO 6: Camera TIGHTENS on both women. Sassouma TOWERS over Sogolon, staring down with icy satisfaction, jaw SET, eyes HARD. Sogolon SHRINKS back, head DROPPING, hands CLENCH then RELEASE at her sides in defeat. Warm amber light CASTS long shadows on the red earth between them.

No words, no music."""


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


def main():
    print("=" * 60)
    print("SEEDANCE 2.0 image-to-video")
    print("Acte 2 Trou A: Humiliation de Sogolon")
    print("6s, 9:16, 720p, start+end frame")
    print("=" * 60)

    if not START_IMAGE.exists():
        raise FileNotFoundError(f"Start image not found: {START_IMAGE}")
    if not END_IMAGE.exists():
        raise FileNotFoundError(f"End image not found: {END_IMAGE}")

    start_url = upload(START_IMAGE)
    end_url = upload(END_IMAGE)

    endpoint = "bytedance/seedance-2.0/image-to-video"
    args = {
        "prompt": PROMPT,
        "image_url": start_url,
        "end_image_url": end_url,
        "duration": "6",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": False,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       prompt: {len(PROMPT)} chars")
    print(f"       duration=6s, 720p, 9:16, audio=False")
    print(f"       start_image + end_image (interpolation)")
    print(f"       estimated cost: ~$3.00\n", flush=True)

    t0 = time.time()
    result = fal_client.subscribe(
        endpoint,
        arguments=args,
        with_logs=True,
        on_queue_update=on_queue_update,
    )
    elapsed = time.time() - t0
    print(f"\n[DONE] Generation took {elapsed:.0f}s", flush=True)

    # Extract video URL
    video_url = result.get("video", {}).get("url")
    if not video_url:
        print(f"ERROR: No video URL in result: {json.dumps(result, indent=2)}")
        sys.exit(1)

    # Download
    out_path = OUTPUT_DIR / "acte2-setup-humiliation-v1.mp4"
    print(f"\n[DOWNLOAD] {out_path.name}...", flush=True)
    urllib.request.urlretrieve(video_url, str(out_path))
    size_mb = out_path.stat().st_size / (1024 * 1024)
    print(f"           Saved: {out_path} ({size_mb:.2f} MB)", flush=True)

    # Save metadata
    meta = {
        "tool": "seedance-2.0/image-to-video",
        "endpoint": endpoint,
        "request_id": result.get("request_id", "N/A"),
        "seed": result.get("seed"),
        "video_url": video_url,
        "start_image": str(START_IMAGE),
        "end_image": str(END_IMAGE),
        "prompt_length": len(PROMPT),
        "duration": "6s",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generation_time_s": round(elapsed),
        "cost_estimate": "$3.00",
        "date": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    meta_path = OUTPUT_DIR / "acte2-setup-humiliation-v1.meta.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)

    prompt_path = OUTPUT_DIR / "acte2-setup-humiliation-v1.prompt.txt"
    with open(prompt_path, "w") as f:
        f.write(PROMPT)

    print(f"\n{'=' * 60}")
    print(f"COMPLETE")
    print(f"  Video:  {out_path}")
    print(f"  Size:   {size_mb:.2f} MB")
    print(f"  Seed:   {meta['seed']}")
    print(f"  Time:   {elapsed:.0f}s")
    print(f"  Meta:   {meta_path}")
    print(f"  Prompt: {prompt_path}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
