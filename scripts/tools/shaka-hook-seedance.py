"""Atlas Shaka Zulu — Hook 5s Seedance text-to-video (variant 2 papercraft).

Single attempt. No semantic retry. Logs cost.
"""
import os
import sys
import json
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing", file=sys.stderr)
    sys.exit(1)

import fal_client

ENDPOINT = "bytedance/seedance-2.0/text-to-video"
OUTPUT = ROOT / "public/atlas-shaka-zulu/hook/shaka-hook-seedance.mp4"
META = ROOT / "public/atlas-shaka-zulu/hook/shaka-hook-seedance.meta.json"
COST_LOG = ROOT / "out/shaka-cost-log.txt"

# Papercraft sepia style + statuesque hero portrait. No combat. Micro-mvts.
PROMPT = """2D vivid flat paper-craft illustration style, sepia tones, hand-cut paper texture, clean dark outlines, dot-eyes, flat color fills. Style of historical papercraft documentary.

A young muscular Zulu warrior, Shaka kaSenzangakhona, copper-brown skin, traditional Zulu attire (umbhumbhuluzo loincloth, leopard-fur band, black-and-white ostrich feathers in headband), holds a short stabbing iklwa spear (light wood shaft, polished steel blade) in right hand, large oval cowhide shield (brown and white pattern) on left arm. Standing facing camera, three-quarter body shot centered in frame, intense determined gaze locked on the lens.

Background: deep charcoal black, soft tarnished gold halo (#C8A84B) glowing dimly behind his silhouette, no other elements.

CAMERA: STEADY medium shot, no movement, no zoom, no pan. Locked-off frame.

SECONDS 0 TO 5: Shaka stays planted in stance. His chest RISES and FALLS gently with slow deep breathing. The black-and-white feathers in his headband SWAY softly as if touched by a slight breeze. His shoulders SHIFT minutely. His eyes stay fixed forward, unblinking and intense. Spear and shield held STEADY, NO movement of the weapons. Tarnished gold halo PULSES very subtly in luminance behind him.

COLOR GRADE: deep charcoal background, copper skin, ochre-tan loincloth, black/white feathers, tarnished gold halo (#C8A84B) low intensity. Sepia-papercraft palette, no vivid saturation.

CRITICAL: maintain dot-eyes throughout, pure black dot pupils, NO realistic eyes, NO visible iris, NO BD comic drift, NO photorealism. No combat, no swinging, no charging — purely statuesque presence.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue."""


def log_cost(msg: str) -> None:
    COST_LOG.parent.mkdir(parents=True, exist_ok=True)
    with COST_LOG.open("a") as f:
        f.write(msg + "\n")
    print(msg, flush=True)


def main():
    t0 = time.time()
    ts = time.strftime("%H:%M:%S")
    log_cost(f"[{ts}] [seedance] [shaka-hook-t2v] [submit] [cumul=$0.30] [START prompt={len(PROMPT)} chars]")

    args = {
        "prompt": PROMPT,
        "duration": "5",
        "aspect_ratio": "16:9",
        "resolution": "720p",
        "generate_audio": False,
    }
    try:
        handler = fal_client.submit(ENDPOINT, arguments=args)
    except Exception as e:
        log_cost(f"[{time.strftime('%H:%M:%S')}] [seedance] [shaka-hook-t2v] [$0.00] [cumul=$0.30] [FAIL submit: {e}]")
        return 2

    request_id = handler.request_id
    print(f"  request_id = {request_id}")

    poll_count = 0
    while True:
        poll_count += 1
        if poll_count > 20:
            log_cost(f"[{time.strftime('%H:%M:%S')}] [seedance] [shaka-hook-t2v] [$0.30] [cumul=$0.60] [TIMEOUT after 20 polls]")
            return 3
        try:
            status = fal_client.status(ENDPOINT, request_id, with_logs=False)
        except Exception as e:
            print(f"  poll error (continue): {e}")
            time.sleep(30)
            continue
        sname = type(status).__name__
        elapsed = int(time.time() - t0)
        print(f"  [{elapsed}s poll {poll_count}] {sname}")
        if sname == "Completed":
            break
        time.sleep(30)

    try:
        result = fal_client.result(ENDPOINT, request_id)
        video_url = result["video"]["url"]
    except Exception as e:
        log_cost(f"[{time.strftime('%H:%M:%S')}] [seedance] [shaka-hook-t2v] [$0.30] [cumul=$0.60] [FAIL result: {e}]")
        return 4

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT)
    size_mb = OUTPUT.stat().st_size / (1024 * 1024)

    meta = {
        "request_id": request_id,
        "endpoint": ENDPOINT,
        "duration_s": 5,
        "aspect_ratio": "16:9",
        "resolution": "720p",
        "video_url": video_url,
        "size_mb": round(size_mb, 2),
        "prompt": PROMPT,
        "cost_estimate_usd": 0.30,
    }
    META.write_text(json.dumps(meta, indent=2))
    log_cost(f"[{time.strftime('%H:%M:%S')}] [seedance] [shaka-hook-t2v] [$0.30] [cumul=$0.60] [OK {OUTPUT.name} {size_mb:.2f}MB in {int(time.time()-t0)}s]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
