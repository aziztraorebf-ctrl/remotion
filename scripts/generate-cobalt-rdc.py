"""Generate narration Short Cobalt RDC — Template B Hybride test."""
import os
import sys
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "z3gESu49naEZW8Af2Upm"

SCRIPT_FILE = ROOT / "src" / "projects" / "_demos" / "cobalt-rdc" / "script-tts.txt"
NARRATION = SCRIPT_FILE.read_text(encoding="utf-8").strip()

OUT_DIR = ROOT / "public" / "_demos" / "cobalt-rdc" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "narration-v1.mp3"

def main() -> int:
    print(f"Text length: {len(NARRATION)} chars")
    cost = len(NARRATION) * 0.00003
    print(f"[COST PREVIEW] ~${cost:.4f}")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": NARRATION,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.5, "similarity_boost": 0.75,
            "style": 0.3, "speed": 1.0,
        },
        "output_format": "mp3_44100_128",
    }
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"}

    print("Generating audio...")
    r = requests.post(url, json=payload, headers=headers, timeout=180)
    if r.status_code != 200:
        print(f"ERROR {r.status_code}: {r.text[:500]}")
        return 1

    OUT_FILE.write_bytes(r.content)
    print(f"OK {OUT_FILE} ({len(r.content) / 1024 / 1024:.2f} MB)")

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(OUT_FILE)],
        capture_output=True, text=True
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        frames = int(duration * 30)
        print(f"Duration: {duration:.2f}s | {frames} frames @30fps")
    return 0

if __name__ == "__main__":
    sys.exit(main())
