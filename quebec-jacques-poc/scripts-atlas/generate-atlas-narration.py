"""Generate Atlas Tombouctou Phase 2 narration.
Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm)
"""
import os
import sys
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

VOICE_ID = "z3gESu49naEZW8Af2Upm"

NARRATION = """Une question. Au treizieme siecle, quelle ville africaine accueillait plus d'etudiants que Oxford ?

Tombouctou, dans le desert du Mali. Carrefour des routes du sel et des livres venus du Maroc.

Sa bibliotheque, Sankoré. Vingt-cinq mille etudiants. Plus que Oxford a la meme epoque.

Une universite africaine, deux siecles avant la Sorbonne."""

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-tombouctou"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "narration-v1.mp3"


def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Text length: {len(NARRATION)} chars")
    print(f"Output: {OUT_FILE}")
    cost = len(NARRATION) * 0.00003
    print(f"[COST PREVIEW] ~${cost:.4f}")
    print()

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": NARRATION,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.22,
            "similarity_boost": 0.55,
            "style": 0.55,
            "speed": 1.0,
        },
        "output_format": "mp3_44100_128",
    }
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

    print("Generating audio...")
    r = requests.post(url, json=payload, headers=headers, timeout=120)
    if r.status_code != 200:
        print(f"ERROR {r.status_code}: {r.text[:500]}")
        return 1

    OUT_FILE.write_bytes(r.content)
    size_mb = len(r.content) / 1024 / 1024
    print(f"OK {OUT_FILE} ({size_mb:.2f} MB)")

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(OUT_FILE)],
        capture_output=True, text=True
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        print(f"Duration: {duration:.2f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
