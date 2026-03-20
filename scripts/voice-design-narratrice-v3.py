"""
ElevenLabs Voice Design — Narratrice documentaire v3
Remplacement natif V3 de Stephyra (voix feminine V2.5 publique)
3 profils : neutre international / francais elegant / africain subtil
2026-03-14
"""

import os
import json
import base64
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-voice-design-v3"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

VOICE_DESCRIPTIONS = [
    {
        "id": "v3-male-neutre-A",
        "description": (
            "Male narrator, early 40s, neutral international French accent. "
            "No regional markers — clear, precise diction accessible to all French speakers worldwide. "
            "Warm authoritative baritone, measured cinematic pace, deep resonant chest voice. "
            "Conveys gravitas and emotional intelligence without melodrama. "
            "Perfect for historical documentary narration on YouTube. "
            "Not Parisian, not Canadian, not Swiss, not robotic, not overly formal."
        ),
    },
    {
        "id": "v3-male-neutre-B",
        "description": (
            "Male voice, mid 30s, neutral francophone accent — international, placeless. "
            "Smooth confident tone, natural slight huskiness, storyteller quality. "
            "Draws the listener in without effort. Emotionally present in tense moments, calm elsewhere. "
            "Ideal for premium documentary narration. "
            "Not theatrical, not nasal, not robotic, not overly deep."
        ),
    },
    {
        "id": "v3-male-francais-elegant",
        "description": (
            "Male narrator, late 30s, elegant educated French accent from France. "
            "Refined but warm — sophistication without coldness. "
            "Rich baritone, deliberate measured delivery, natural breathing rhythm. "
            "The voice of a documentary filmmaker who has seen the world. "
            "Poised, professional, high-end narration quality. "
            "Not Parisian nasal, not theatrical stage voice, not robotic."
        ),
    },
    {
        "id": "v3-male-africain-subtil",
        "description": (
            "Male narrator, early 40s, French speaker from West Africa — subtle accent, never caricatural. "
            "Light melodic intonation typical of Francophone West Africa, fully intelligible internationally. "
            "Deep warm baritone, storytelling tradition in every phrase, unhurried gravitas. "
            "Feels authentic to the subject matter — African history told by an African voice. "
            "Not exaggerated accent, not stereotypical, not robotic, not Caribbean."
        ),
    },
]

# Texte de preview — moments dramatiques pour evaluer l'expressivite v3
PREVIEW_TEXT = (
    "En mil trois cent onze, l'ocean Atlantique n'est qu'un mur de brouillard. "
    "On l'appelle la Mer des Tenebres. "
    "Un seul bateau revient. Le capitaine est... terrifie. "
    "Au lieu de reculer... Abou Bakari abdique. "
    "Il laisse son trone. Son or. Son pouvoir absolu. "
    "Il ne reviendra... jamais."
)


def design_voice(description_obj: dict) -> list:
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
        return []

    data = resp.json()
    previews = data.get("previews", [])
    print(f"  {len(previews)} preview(s) genere(s)")

    results = []
    for i, preview in enumerate(previews):
        generated_voice_id = preview.get("generated_voice_id") or preview.get("voice_id")
        audio_b64 = preview.get("audio_base_64") or preview.get("audio")

        if not audio_b64:
            print(f"  WARNING: pas d'audio dans preview {i}")
            continue

        audio_bytes = base64.b64decode(audio_b64)
        filename = f"{description_obj['id']}-preview{i+1}.mp3"
        output_path = OUTPUT_DIR / filename
        output_path.write_bytes(audio_bytes)
        print(f"  Saved: {output_path.name} ({len(audio_bytes):,} bytes) — voice_id: {generated_voice_id}")

        results.append({
            "file": str(output_path),
            "generated_voice_id": generated_voice_id,
            "description_id": description_obj["id"],
        })

    return results


def save_voice(generated_voice_id: str, name: str, description: str) -> str | None:
    """Sauvegarde un preview comme voix permanente"""
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

    voice_id = resp.json().get("voice_id")
    print(f"  Saved! Permanent voice_id: {voice_id}")
    return voice_id


def main():
    print("=== ElevenLabs Voice Design V3 — Narratrice Documentaire ===")
    print(f"Output: {OUTPUT_DIR}\n")

    if not API_KEY:
        print("ERROR: ELEVENLABS_API_KEY not found in .env")
        return

    all_results = []
    for desc in VOICE_DESCRIPTIONS:
        previews = design_voice(desc)
        all_results.extend(previews)

    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(all_results, indent=2, ensure_ascii=False))

    print(f"\n=== DONE — {len(all_results)} fichiers generes ===")
    print(f"Dossier : {OUTPUT_DIR}\n")
    print("Previews :")
    for r in all_results:
        print(f"  {Path(r['file']).name}  |  voice_id: {r['generated_voice_id']}")

    print("\nPour sauvegarder la voix choisie :")
    print("  save_voice('VOICE_ID_ICI', 'Narratrice GeoAfrique V3', 'description')")
    print("\nPuis mettre a jour generate-abou-bakari-audio.py avec le nouveau voice_id.")


if __name__ == "__main__":
    main()
