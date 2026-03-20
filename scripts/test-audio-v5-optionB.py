"""
Test audio V5 — Option B (Performance V3 avec audio tags)
Fragment : debut jusqu'a "il ne reviendra jamais"
Deux voix en parallele : feminine africaine + masculine africain
2026-03-14
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-v5-test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

VOICES = [
    {
        "id": "feminine-v2",
        "name": "Narratrice Africaine Subtile",
        "voice_id": "Y8XqpS6sj6cx5cCTLp8a",
        "params": {"stability": 0.32, "similarity_boost": 0.75, "style": 0.40, "speed": 0.85},
    },
    {
        "id": "masculine-v2",
        "name": "Narrateur Africain Subtil",
        "voice_id": "ICHuIqamER7XZMdm2HYC",
        "params": {"stability": 0.32, "similarity_boost": 0.75, "style": 0.50, "speed": 0.75},
    },
]

# Option B — fragment de test (debut jusqu'a "jamais")
# Audio tags V3 : [whispers], [sighs], [gasp], [sad], [pause], [long pause]
SCRIPT_FRAGMENT = """[thoughtful] En treize-cent-onze, l'océan Atlantique n'est qu'un mur de brouillard.
[whispers] On l'appelle la Mer des Ténèbres.
Personne ne sait ce qu'il y a de l'autre côté.
Personne... [pause] sauf UN homme.

Abou Bakari deux. Mansa du Mali. Roi des rois.
Il règne sur l'empire le plus riche du monde.
[sighs] Mais il est... hanté par l'horizon.
Il refuse de croire que l'océan n'a pas de fin.

Deux-mille pirogues. Deux-cents éclaireurs.
Un seul bateau revient.
Le capitaine est [pause] terrifié [gasp].
Un courant titanesque ! En plein milieu de la mer !

Abou Bakari ne recule pas. Il abdique.
Il quitta son trône. Son or. Son pouvoir.
Il monte LUI-MÊME à bord.
Et ordonne de ramer vers l'ouest.
[sad] Il ne reviendra [long pause] jamais."""

# Params individuels par voix — voir VOICES ci-dessus


def generate(voice: dict) -> str | None:
    print(f"\n--- {voice['name']} ({voice['voice_id']}) ---")

    p = voice["params"]
    payload = {
        "text": SCRIPT_FRAGMENT,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": p["stability"],
            "similarity_boost": p["similarity_boost"],
            "style": p["style"],
            "speed": p["speed"],
        },
        "output_format": "mp3_44100_128",
    }

    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice['voice_id']}",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    output_path = OUTPUT_DIR / f"v5-optionB-{voice['id']}.mp3"
    output_path.write_bytes(resp.content)
    size_kb = len(resp.content) / 1024
    print(f"  Saved: {output_path.name} ({size_kb:.0f} KB)")

    result = subprocess.run(
        ["ffprobe", "-i", str(output_path), "-show_entries", "format=duration",
         "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        duration = float(result.stdout.strip())
        print(f"  Duree: {duration:.2f}s")

    return str(output_path)


def main():
    print("=== Test Audio V5 — Option B (fragment) ===")
    print("Modele : eleven_v3")
    print("Params : voir VOICES (individuels par voix)")
    print(f"Output : {OUTPUT_DIR}\n")

    paths = []
    for voice in VOICES:
        path = generate(voice)
        if path:
            paths.append(path)

    print("\n=== DONE ===")
    for p in paths:
        print(f"  {Path(p).name}")

    if paths:
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)


if __name__ == "__main__":
    main()
