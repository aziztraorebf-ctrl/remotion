"""
Test 3 versions raccourcies du dialogue Matrone (cible <=5s).
Meme voix + meme settings dramatiques que enraged-v2.
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "soundjata-insult"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MATRONE_VOICE_ID = "5eScDXbqClEhrA46NN4r"  # voix permanente sauvee

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

VERSIONS = {
    "court": """[angry][mockingly] Mon fils ramene des feuilles de baobab! [scathing] Le tien — ne sait meme pas se lever!""",
    "plus-court": """[angry][mockingly] Mon fils ramene du baobab! [scathing] Le tien — ne sait meme pas se lever!""",
    "punch": """[scathing] Mon fils marche! [angry] Le tien — ne sait meme pas se lever!""",
}


def generate(text, output_name):
    print(f"\n--- {output_name} ---")
    print(f"  Text : {text}")
    payload = {
        "text": text,
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
    out = OUTPUT_DIR / output_name
    out.write_bytes(resp.content)
    print(f"  Saved : {len(resp.content) // 1024}KB")
    return out


if __name__ == "__main__":
    for name, text in VERSIONS.items():
        generate(text, f"rival-matrone-{name}.mp3")
