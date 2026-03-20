"""
Beat09 CTA audio — Abou Bakari II Short
Voix : Narratrice GeoAfrique V3 (Y8XqpS6sj6cx5cCTLp8a)
Modele : eleven_v3
Output : public/audio/abou-bakari/beat09-cta.mp3
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio" / "abou-bakari"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH = OUTPUT_DIR / "beat09-cta.mp3"

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

VOICE_ID = "Y8XqpS6sj6cx5cCTLp8a"
VOICE_PARAMS = {
    "stability": 0.32,
    "similarity_boost": 0.75,
    "style": 0.30,
    "speed": 0.90,
}

# Ton plus leger, direct — sortie du mode documentaire
CTA_SCRIPT = """Si cette histoire t'a surpris, laisse un commentaire. Et si tu veux la version longue, abonne-toi."""

def generate():
    print("=== Beat09 CTA — ElevenLabs V3 ===")
    print(f"Script : {CTA_SCRIPT[:60]}...")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": CTA_SCRIPT,
        "model_id": "eleven_v3",
        "voice_settings": VOICE_PARAMS,
        "output_format": "mp3_44100_128",
    }

    resp = requests.post(url, headers=HEADERS, json=payload)
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text}")
        return None

    with open(OUTPUT_PATH, "wb") as f:
        f.write(resp.content)

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"Saved: {OUTPUT_PATH} ({size_kb:.0f} KB)")

    # Mesure duree avec ffprobe
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(OUTPUT_PATH)],
        capture_output=True, text=True
    )
    duration = float(result.stdout.strip())
    print(f"Duree : {duration:.2f}s")
    return duration


if __name__ == "__main__":
    dur = generate()
    if dur:
        frames = round(dur * 30)
        print(f"Frames a 30fps : {frames}f")
        print("Done.")
