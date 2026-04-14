"""
Design 2 voice profiles for Soundjata rival wife via ElevenLabs Voice Design API.
Test avec notre dialogue reel pour juger en contexte.
"""

import base64
import json
import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "soundjata-insult" / "voice-design"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# Texte test : notre dialogue + continuation naturelle pour atteindre 100+ chars
TEST_TEXT = "Au moins mon fils peut cueillir des feuilles de baobab. Le tien ne sait meme pas se lever. Regarde-le ramper dans la poussiere."

PROFILES = {
    "A-matrone-froide": {
        "voice_description": (
            "Middle-aged West African woman from Mali, strong Mandinka French accent. "
            "Her voice is deep, resonant, confident. She speaks with the authority of "
            "a royal first wife — slow, deliberate, cutting. Age 40-45. Not gentle, "
            "not warm. Cold undertone with a hint of contempt."
        ),
    },
    "B-douce-cruaute": {
        "voice_description": (
            "Middle-aged West African woman, warm Senegalese French accent. Her voice "
            "is medium-pitched, smooth, almost melodic — but with a subtle edge that "
            "reveals cruelty. She speaks calmly, unhurried, as someone who knows her "
            "power. Age 38-42."
        ),
    },
}


def design_voice(profile_name: str, voice_description: str):
    print(f"\n--- Designing profile : {profile_name} ---")
    print(f"  Description: {voice_description[:80]}...")

    payload = {
        "voice_description": voice_description,
        "text": TEST_TEXT,
        "model_id": "eleven_ttv_v3",
        "guidance_scale": 5,
        "output_format": "mp3_44100_128",
    }

    resp = requests.post(
        "https://api.elevenlabs.io/v1/text-to-voice/design",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )
    if not resp.ok:
        print(f"  ERROR {resp.status_code}: {resp.text[:500]}")
        return []

    data = resp.json()
    previews = data.get("previews", [])
    print(f"  Got {len(previews)} previews")

    saved = []
    for i, preview in enumerate(previews, start=1):
        audio_b64 = preview.get("audio_base_64")
        generated_voice_id = preview.get("generated_voice_id")
        if not audio_b64:
            continue

        audio_bytes = base64.b64decode(audio_b64)
        out_path = OUTPUT_DIR / f"{profile_name}-preview-{i}.mp3"
        out_path.write_bytes(audio_bytes)
        size_kb = len(audio_bytes) // 1024
        print(f"    [{i}] {out_path.name} ({size_kb}KB) — voice_id={generated_voice_id}")
        saved.append({
            "profile": profile_name,
            "preview": i,
            "file": str(out_path),
            "generated_voice_id": generated_voice_id,
        })

    return saved


if __name__ == "__main__":
    print("=" * 60)
    print("Voice Design — Soundjata rival wife (2 profils)")
    print("=" * 60)
    print(f"Test text : {TEST_TEXT}")
    print(f"Chars : {len(TEST_TEXT)}")
    print("=" * 60)

    all_results = []
    for profile_name, config in PROFILES.items():
        results = design_voice(profile_name, config["voice_description"])
        all_results.extend(results)

    manifest = OUTPUT_DIR / "manifest.json"
    manifest.write_text(json.dumps(all_results, indent=2))

    print("\n" + "=" * 60)
    print(f"Manifest : {manifest}")
    print(f"Total previews generated : {len(all_results)}")
    print("=" * 60)
