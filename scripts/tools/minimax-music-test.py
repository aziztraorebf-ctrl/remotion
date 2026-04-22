"""Minimax Music 2.6 - test duree reelle.

Lance UN prompt (prompt A epique) via fal-ai/minimax-music/v2.6.
Schema v2.6 : prompt seul (pas de reference_audio_url, pas de generate_audio).
Verifie le duration reellement produit par Minimax.
"""
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
    print("[ERROR] FAL_KEY missing in .env", file=sys.stderr)
    sys.exit(1)

OUT_DIR = ROOT / "sonjata-papercraft" / "audio" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT_A = (
    "Epic West African orchestral, kora melody, djembe and dunun percussion, "
    "balafon accents, majestic warm tones, building intensity from contemplative "
    "to triumphant, cinematic, 95 BPM"
)

OUT_FILE = OUT_DIR / "test-prompt-A-epic.mp3"


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for entry in update.logs or []:
            log(f"queue: {entry.get('message', '')}")


def main() -> int:
    log(f"endpoint: fal-ai/minimax-music/v2.6")
    log(f"prompt ({len(PROMPT_A)} chars): {PROMPT_A}")
    log(f"output: {OUT_FILE}")

    start = time.time()
    result = fal_client.subscribe(
        "fal-ai/minimax-music/v2.6",
        arguments={
            "prompt": PROMPT_A,
            "is_instrumental": True,
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )
    elapsed = time.time() - start
    log(f"job completed in {elapsed:.1f}s")
    log(f"raw result: {result}")

    audio = result.get("audio") if isinstance(result, dict) else None
    if not audio or not audio.get("url"):
        log("[ERROR] no audio.url in result")
        return 2

    url = audio["url"]
    log(f"downloading: {url}")
    urllib.request.urlretrieve(url, OUT_FILE)
    size_mb = OUT_FILE.stat().st_size / (1024 * 1024)
    log(f"saved ({size_mb:.2f} MB)")

    # ffprobe duration
    import subprocess
    probe = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(OUT_FILE),
        ],
        capture_output=True,
        text=True,
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        log(f"DURATION: {duration:.2f}s (target clip: 146s)")
        if duration < 140:
            log(f"[WARN] duree < 146s — strategie 2 pistes a considerer")
        else:
            log(f"[OK] couvre la duree complete du Short")
    return 0


if __name__ == "__main__":
    sys.exit(main())
