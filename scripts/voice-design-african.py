"""
ElevenLabs Voice Design — Narrateur africain francophone
Nouveau pipeline (post-23 fev 2026) : /v1/text-to-voice/design -> /v1/text-to-voice/create
V3 — 2026-03-14 : migre eleven_multilingual_ttv_v2 -> eleven_ttv_v3 pour compatibilite native audio tags
"""

import os
import json
import base64
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-voice-design"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# Round 2 — prompts optimises (structure complete + negatifs)
VOICE_DESCRIPTIONS = [
    {
        "id": "r2-senegalais-A",
        "description": (
            "Male voice, early 40s, francophone from Senegal, West Africa. "
            "Light Senegalese accent — present but not exaggerated, internationally understandable. "
            "Warm authoritative baritone, slow measured pace, deep resonant chest voice. "
            "Calm and dignified, perfect for historical documentary narration. "
            "Not Parisian French, not nasal, not robotic, not overly formal."
        ),
    },
    {
        "id": "r2-senegalais-B",
        "description": (
            "Male voice, mid 30s, born and raised in Dakar Senegal, French as primary language. "
            "Subtle West African accent, melodic intonation typical of Wolof-French speakers. "
            "Rich warm tone, confident storyteller quality, gravitas without heaviness. "
            "Clear articulation, measured pace suitable for educational content narration. "
            "Not standard European French, not overly accented, not robotic."
        ),
    },
    {
        "id": "r2-senegalais-C",
        "description": (
            "Male narrator, 45 years old, West African French speaker from Senegal. "
            "Deep commanding voice, slight African musicality in the vowels, "
            "cinematic documentary tone, slow deliberate delivery. "
            "Warm and engaging, authoritative without being cold. "
            "Clear enough for international audience, distinctly African in character. "
            "Not nasal, not Parisian, not robotic, not Caribbean."
        ),
    },
]

# Texte de preview — inclut moments dramatiques pour evaluer expressivite v3
PREVIEW_TEXT = (
    "En 1311, l'ocean Atlantique n'est qu'un mur de brouillard. "
    "On l'appelle la Mer des Tenebres. "
    "Un seul bateau revient. Le capitaine est... terrifie. "
    "Au lieu de reculer... Abou Bakari abdique. "
    "Il laisse son trone. Son or. Son pouvoir absolu. "
    "Il ne reviendra... jamais."
)


def design_voice(description_obj: dict) -> dict | None:
    """Genere un preview de voix via /v1/text-to-voice/design"""
    print(f"\n--- Generating {description_obj['id']} ---")

    payload = {
        "voice_description": description_obj["description"],
        "text": PREVIEW_TEXT,
        "model_id": "eleven_ttv_v3",
        "output_format": "mp3_44100_128",
        "auto_generate_text": False,
    }

    resp = requests.post(
        "https://api.elevenlabs.io/v1/text-to-voice/design",
        headers=HEADERS,
        json=payload,
        timeout=60,
    )

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    data = resp.json()
    print(f"  Response keys: {list(data.keys())}")

    # La reponse contient {"previews": [...], "text": "..."}
    if "previews" in data:
        previews = data["previews"]
    elif isinstance(data, list):
        previews = data
    else:
        previews = [data]

    print(f"  Preview count: {len(previews)}")
    if previews:
        print(f"  First preview keys: {list(previews[0].keys())}")

    results = []
    for i, preview in enumerate(previews):
        generated_voice_id = preview.get("generated_voice_id") or preview.get("voice_id")
        audio_b64 = preview.get("audio_base_64") or preview.get("audio")

        if not audio_b64:
            print(f"  WARNING: No audio in preview {i}")
            continue

        audio_bytes = base64.b64decode(audio_b64)
        filename = f"{description_obj['id']}-preview{i+1}.mp3"
        output_path = OUTPUT_DIR / filename
        output_path.write_bytes(audio_bytes)
        print(f"  Saved: {output_path} ({len(audio_bytes):,} bytes)")
        print(f"  generated_voice_id: {generated_voice_id}")

        results.append({
            "file": str(output_path),
            "generated_voice_id": generated_voice_id,
            "description_id": description_obj["id"],
        })

    return results


def save_voice(generated_voice_id: str, name: str, description: str) -> str | None:
    """Sauvegarde un preview comme voix permanente via /v1/text-to-voice/create"""
    print(f"\n--- Saving voice '{name}' ---")

    payload = {
        "voice_name": name,
        "voice_description": description,
        "generated_voice_id": generated_voice_id,
    }

    resp = requests.post(
        "https://api.elevenlabs.io/v1/text-to-voice/create",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )

    if resp.status_code not in (200, 201):
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    data = resp.json()
    voice_id = data.get("voice_id")
    print(f"  Saved! Permanent voice_id: {voice_id}")
    return voice_id


def main():
    print("=== ElevenLabs Voice Design — Narrateur Africain ===")
    print(f"Output: {OUTPUT_DIR}\n")

    if not API_KEY:
        print("ERROR: ELEVENLABS_API_KEY not found in .env")
        return

    all_results = []

    for desc in VOICE_DESCRIPTIONS:
        previews = design_voice(desc)
        if previews:
            all_results.extend(previews)

    # Sauvegarder le manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(all_results, indent=2, ensure_ascii=False))
    print(f"\nManifest saved: {manifest_path}")

    print("\n=== DONE ===")
    print("Generated previews:")
    for r in all_results:
        print(f"  {Path(r['file']).name} — voice_id: {r['generated_voice_id']}")

    print("\nPour sauvegarder une voix permanente, appeler save_voice() avec le generated_voice_id choisi.")
    print("Exemple: save_voice('abc123', 'Narrateur Abou Bakari', 'Narrateur africain francophone')")


if __name__ == "__main__":
    main()
