"""
Generate rival wife dialogue audio for Soundjata insult clip.
Voice : Fatou (Radiant and Gentle, African French)
Strategy : douceur de voix + tags [mockingly]/[cold] = insulte glacante
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "soundjata-insult"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FATOU_ID = "Vza9yt3uSx3RXnRx6YfI"  # Fatou - Radiant and Gentle (African French)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# Dialogue — meme texte que dans le prompt Seedance pour permettre matching visuel
DIALOGUE = """[mockingly] Au moins mon fils peut cueillir des feuilles de baobab. [cold] Le tien ne sait meme pas se lever."""


def generate(voice_id, text, output_name, speed=0.92, stability=0.30, style=0.30):
    print(f"\nGenerating : {output_name}")
    payload = {
        "text": text,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": 0.75,
            "style": style,
            "speed": speed,
        },
        "output_format": "mp3_44100_128",
    }
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers=HEADERS,
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    out = OUTPUT_DIR / output_name
    out.write_bytes(resp.content)
    size_kb = len(resp.content) // 1024
    print(f"  Saved : {out} ({size_kb} KB)")
    return out


if __name__ == "__main__":
    print("=" * 60)
    print("Soundjata — Rival wife dialogue (Fatou African French)")
    print("=" * 60)

    generate(FATOU_ID, DIALOGUE, "rival-dialogue-v1.mp3", speed=0.92)

    print("\n" + "=" * 60)
    print(f"File : {OUTPUT_DIR / 'rival-dialogue-v1.mp3'}")
    print("=" * 60)
