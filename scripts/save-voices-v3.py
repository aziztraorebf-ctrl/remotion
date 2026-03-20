"""
Regenere et sauvegarde immediatement les deux voix africaines v3
Endpoint correct : POST /v1/text-to-voice (sans /create)
2026-03-14
"""

import os
import base64
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY = os.getenv("ELEVENLABS_API_KEY")
HEADERS = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-voice-design-v3"

PREVIEW_TEXT = (
    "En mil trois cent onze, l'ocean Atlantique n'est qu'un mur de brouillard. "
    "On l'appelle la Mer des Tenebres. "
    "Un seul bateau revient. Le capitaine est terrifie. "
    "Au lieu de reculer, Abou Bakari abdique. "
    "Il laisse son trone. Son or. Son pouvoir absolu. "
    "Il ne reviendra jamais."
)

VOICES = [
    {
        "id": "africaine-subtile",
        "description": (
            "Female narrator, early 40s, French speaker from West Africa — subtle accent, never caricatural. "
            "Light melodic intonation typical of Francophone West Africa, fully intelligible internationally. "
            "Deep warm voice, storytelling tradition in every phrase, unhurried gravitas. "
            "Feels authentic to the subject matter — African history told by an African voice. "
            "Not exaggerated accent, not stereotypical, not robotic, not Caribbean."
        ),
        "save_name": "Narratrice GeoAfrique V3 — Africaine Subtile",
    },
    {
        "id": "africain-subtil",
        "description": (
            "Male narrator, early 40s, French speaker from West Africa — subtle accent, never caricatural. "
            "Light melodic intonation typical of Francophone West Africa, fully intelligible internationally. "
            "Deep warm baritone, storytelling tradition in every phrase, unhurried gravitas. "
            "Feels authentic to the subject matter — African history told by an African voice. "
            "Not exaggerated accent, not stereotypical, not robotic, not Caribbean."
        ),
        "save_name": "Narrateur GeoAfrique V3 — Africain Subtil",
    },
]


def main():
    results = []

    for v in VOICES:
        print(f"\n--- {v['id']} ---")

        # 1. Design
        resp = requests.post(
            "https://api.elevenlabs.io/v1/text-to-voice/design",
            headers=HEADERS,
            json={
                "voice_description": v["description"],
                "text": PREVIEW_TEXT,
                "model_id": "eleven_ttv_v3",
                "output_format": "mp3_44100_128",
                "auto_generate_text": False,
            },
            timeout=60,
        )
        if resp.status_code != 200:
            print(f"  ERROR design: {resp.status_code} {resp.text[:200]}")
            continue

        previews = resp.json().get("previews", [])
        if not previews:
            print("  No previews returned")
            continue

        preview = previews[0]
        generated_voice_id = preview.get("generated_voice_id")
        audio_path = OUTPUT_DIR / f"{v['id']}-FINAL.mp3"
        audio_path.write_bytes(base64.b64decode(preview.get("audio_base_64")))
        print(f"  Preview saved: {audio_path.name}")
        print(f"  generated_voice_id: {generated_voice_id}")

        # 2. Save permanent — endpoint correct : /v1/text-to-voice
        save_resp = requests.post(
            "https://api.elevenlabs.io/v1/text-to-voice",
            headers=HEADERS,
            json={
                "voice_name": v["save_name"],
                "voice_description": v["description"],
                "generated_voice_id": generated_voice_id,
            },
            timeout=30,
        )
        print(f"  Save status: {save_resp.status_code}")
        if save_resp.status_code in (200, 201):
            permanent_id = save_resp.json().get("voice_id")
            print(f"  SAVED -> permanent voice_id: {permanent_id}")
            results.append({"name": v["save_name"], "permanent_id": permanent_id})
        else:
            print(f"  ERROR save: {save_resp.text[:300]}")
            results.append({"name": v["save_name"], "permanent_id": "ERROR"})

    print("\n=== RESUME FINAL ===")
    for r in results:
        print(f"  {r['name']}: {r['permanent_id']}")


if __name__ == "__main__":
    main()
