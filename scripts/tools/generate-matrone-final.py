"""
Generate final version of rival dialogue — fix 'ramene' pronunciation.
Uses 'apporte' instead of 'ramene' (no tricky accents for TTS).
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "soundjata-insult"

MATRONE_VOICE_ID = "5eScDXbqClEhrA46NN4r"

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

TEXT = """[angry][mockingly] Mon fils apporte des feuilles de baobab! [scathing] Le tien — ne sait meme pas se lever!"""


def generate():
    payload = {
        "text": TEXT,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.25,
            "similarity_boost": 0.75,
            "style": 0.60,
            "speed": 0.92,
        },
        "output_format": "mp3_44100_128",
    }
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{MATRONE_VOICE_ID}",
        headers=HEADERS,
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    out = OUTPUT_DIR / "rival-matrone-final.mp3"
    out.write_bytes(resp.content)
    print(f"Saved: {out} ({len(resp.content) // 1024}KB)")


if __name__ == "__main__":
    print(f"Text: {TEXT}")
    generate()
