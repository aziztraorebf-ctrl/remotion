"""Generate CTA narration for Empire Ghana Short closing.

Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm) — canonical GeoAfrique voice
Config: max-style (stability 0.22, similarity 0.55, style 0.55, speed 1.0, model eleven_v3)

Texte locked Aziz 2026-05-04. Scan TTS effectue : zero participe en e/ee final,
zero liaison ont+voyelle, zero chiffre brut, zero nom de ville a risque.
Reformulation "vue autrement" -> "un autre regard sur" pour eviter participe a risque.
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

VOICE_ID = "z3gESu49naEZW8Af2Upm"  # Narratrice GeoAfrique v2
PHRASE = (
    "Tu savais ? Au treizième siècle, le commerce du sel valait son poids d'or. "
    "Wagadou n'était que le début. Newsletter quotidienne — un autre regard "
    "sur l'actualité africaine. Lien en bio."
)
OUT_DIR = ROOT / "public" / "audio" / "atlas-empire-ghana"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "cta-narration-v1.mp3"

TARGET_DURATION = 11.0  # cible ~10-11s


def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Phrase ({len(PHRASE)} chars): {PHRASE}")
    print(f"Output: {OUT_FILE}")
    print()

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": PHRASE,
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
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=90)
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:300]}")
        return 2

    OUT_FILE.write_bytes(resp.content)
    size_kb = OUT_FILE.stat().st_size / 1024
    print(f"Saved: {OUT_FILE.name} ({size_kb:.1f} KB)")

    probe = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(OUT_FILE),
        ],
        capture_output=True, text=True,
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        print(f"Duration: {duration:.2f}s (target ~10-11s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
