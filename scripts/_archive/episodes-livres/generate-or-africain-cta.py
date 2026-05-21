#!/usr/bin/env python3
"""
TTS CTA seul — Or Africain
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3
"""

import os
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY", "sk_3db028ca13456f1acdc83d298cbc9be688935afd676ec9eb")
VOICE_ID = "z3gESu49naEZW8Af2Upm"
OUTPUT_PATH = "public/poc-money-legends/audio/narration-or-africain-cta-v1.mp3"

SCRIPT_CTA = """[whispers] Si tu veux des histoires que les médias ne racontent pas — abonne-toi."""

def generate_cta():
    print("Generation CTA TTS...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": SCRIPT_CTA,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.22,
            "similarity_boost": 0.55,
            "style": 0.55,
            "speed": 1.0,
        },
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"ERREUR TTS {response.status_code}: {response.text}")
        return False

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "wb") as f:
        f.write(response.content)
    size_kb = len(response.content) // 1024
    print(f"CTA sauvegarde : {OUTPUT_PATH} ({size_kb} KB)")
    return True

if __name__ == "__main__":
    generate_cta()
