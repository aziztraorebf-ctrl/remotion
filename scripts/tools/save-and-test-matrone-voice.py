"""
Save matrone voice (A-preview-1) as permanent voice, then generate
a much more emotional 5s version with aggressive audio tags.
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "soundjata-insult"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# From previous voice design run
GENERATED_VOICE_ID = "5eScDXbqClEhrA46NN4r"  # A-matrone-froide-preview-1
# Same text used for the preview, required for the save endpoint
PREVIEW_TEXT = "Au moins mon fils peut cueillir des feuilles de baobab. Le tien ne sait meme pas se lever. Regarde-le ramper dans la poussiere."

# New emotional dialogue — simplified (no "cueillir"), ~5s target
EMOTIONAL_DIALOGUE = """[angry][mockingly] Au moins mon fils peut ALLER CHERCHER des feuilles de baobab! [scathing] Le tien — ne sait meme pas se lever!"""


def save_voice_from_preview():
    print("--- Saving voice from preview ---")
    payload = {
        "voice_name": "Soundjata Rivale - Matrone Froide",
        "voice_description": (
            "Middle-aged West African woman from Mali, strong Mandinka French "
            "accent. Deep, resonant, cutting voice of a royal first wife."
        ),
        "generated_voice_id": GENERATED_VOICE_ID,
        "played_not_selected_voice_ids": [],
        "labels": {
            "accent": "african",
            "age": "middle_aged",
            "gender": "female",
            "use_case": "character",
            "descriptive": "cold, commanding, mocking",
        },
    }
    resp = requests.post(
        "https://api.elevenlabs.io/v1/text-to-voice",
        headers=HEADERS,
        json={**payload, "text": PREVIEW_TEXT},
        timeout=60,
    )
    if not resp.ok:
        print(f"  ERROR {resp.status_code}: {resp.text[:500]}")
        return None
    data = resp.json()
    voice_id = data.get("voice_id")
    print(f"  OK — voice_id={voice_id}")
    return voice_id


def generate_tts(voice_id, text, output_name, speed=0.92, stability=0.28, style=0.45):
    print(f"\n--- Generating emotional dialogue : {output_name} ---")
    print(f"  stability={stability} style={style} speed={speed}")
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
    print(f"  Saved : {out} ({len(resp.content) // 1024}KB)")
    return out


if __name__ == "__main__":
    print("=" * 60)
    print("Soundjata rivale — save + emotional dialogue generation")
    print("=" * 60)

    voice_id = save_voice_from_preview()
    if not voice_id:
        print("FAILED to save voice, abort")
        exit(1)

    # Generate 3 versions with escalating emotion
    generate_tts(voice_id, EMOTIONAL_DIALOGUE, "rival-matrone-enraged-v1.mp3",
                 stability=0.28, style=0.45)

    # higher style = more dramatic
    generate_tts(voice_id, EMOTIONAL_DIALOGUE, "rival-matrone-enraged-v2.mp3",
                 stability=0.25, style=0.60)

    print("\n" + "=" * 60)
    print(f"Voice ID permanent : {voice_id}")
    print(f"Files : {OUTPUT_DIR}")
    print("=" * 60)
