"""Minimax Music 2.6 - RDC No Sense — documentary ambient sober."""
import os
import sys
import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing", file=sys.stderr)
    sys.exit(1)

OUT = ROOT / "src" / "projects" / "geoafrique-shorts" / "rdc-no-sense" / "audio" / "music-v1.mp3"
OUT.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Documentary cinematic ambient music, sober and neutral, modern world music subtle. "
    "Sustained warm synth pads layered with light african percussion accents (soft shakers, "
    "distant kalimba touch, no djembe, no kora). Building atmospheric texture, hopeful but "
    "restrained, factual documentary tone in the style of BBC/Arte African geography "
    "documentaries. Slow rising arc, no vocals, no strong lead melody, focus on texture and breath. "
    "Minimalist."
)


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def main():
    log("=== Minimax Music 2.6 — RDC No Sense ===")
    log(f"prompt: {len(PROMPT)} chars")
    t0 = time.time()
    handle = fal_client.submit(
        "fal-ai/minimax-music/v2.6",
        arguments={"prompt": PROMPT, "is_instrumental": True},
    )
    log(f"submitted, request_id = {handle.request_id}")
    log("waiting (~4 min typical)...")
    result = handle.get()
    log(f"done in {time.time()-t0:.1f}s")

    audio = result.get("audio") if isinstance(result, dict) else None
    if not audio or not audio.get("url"):
        log(f"[ERROR] no audio.url in result: {result}")
        return 1
    urllib.request.urlretrieve(audio["url"], OUT)
    size_mb = OUT.stat().st_size / (1024 * 1024)
    log(f"saved {OUT.name} ({size_mb:.2f} MB)")
    log(f"path: {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
