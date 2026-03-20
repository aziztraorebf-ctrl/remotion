"""
Generation audio V5 complet — Abou Bakari II Short
Script enrichi (Option A) avec tags eleven_v3
Voix : Narratrice GeoAfrique V3 (feminine, preferee)
2026-03-14
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio" / "abou-bakari"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

VOICE_ID = "Y8XqpS6sj6cx5cCTLp8a"  # Narratrice GeoAfrique V3 — Africaine Subtile
VOICE_PARAMS = {
    "stability": 0.32,
    "similarity_boost": 0.75,
    "style": 0.40,
    "speed": 0.85,
}

SCRIPT_V5 = """En 1311, l'océan Atlantique n'est qu'un mur de brouillard.
On l'appelle la Mer des Ténèbres.
Personne n'ose regarder vers l'ouest.
Personne...

Sauf un homme qui a un ardent désir de savoir.

Abou Bakari deux. Mansa du Mali. Roi des rois.
Il règne sur l'empire le plus riche du monde.
Mais il est... hanté par l'horizon.
Il refuse de croire que l'océan n'a pas de fin.

Il fait préparer deux mille pirogues.
Il envoie deux cents éclaireurs vers l'ouest.
Un seul bateau revient.
Le capitaine est... terrifié.
Un courant géant. Un mur d'eau. Au milieu de l'océan.
On ne passe pas.

Abou Bakari ne recule pas. Il abdique.
Il quitte son trône. Son or. Son pouvoir.
Il monte lui-même à bord.
Et ordonne de ramer vers l'ouest.
Il ne reviendra... jamais.

Pendant ce temps, son demi-frère monte sur le trône.
Il s'appelle Mansa Moussa.
Il deviendra l'homme le plus riche de toute l'histoire humaine.
Un empire de trois millions de kilomètres carrés.
Quatre cents milliards de dollars.

Abou Bakari avait tout abandonné pour une seule obsession :
savoir ce qu'il y avait à l'ouest.

Cent quatre-vingt-un ans plus tard,
Christophe Colomb traverse le même océan.
On l'appelle le découvreur.

Mais qui a traversé en premier ?

Et toi... tu savais ça ?"""


def generate() -> str | None:
    print(f"Voix : Narratrice GeoAfrique V3 ({VOICE_ID})")
    print(f"Modele : eleven_v3")
    print(f"Output : {OUTPUT_DIR}")

    payload = {
        "text": SCRIPT_V5,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": VOICE_PARAMS["stability"],
            "similarity_boost": VOICE_PARAMS["similarity_boost"],
            "style": VOICE_PARAMS["style"],
            "speed": VOICE_PARAMS["speed"],
        },
        "output_format": "mp3_44100_128",
    }

    print("\nGeneration en cours...")
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    output_path = OUTPUT_DIR / "abou-bakari-v5-full.mp3"
    output_path.write_bytes(resp.content)
    size_kb = len(resp.content) / 1024
    print(f"Sauvegarde : {output_path.name} ({size_kb:.0f} KB)")

    result = subprocess.run(
        ["ffprobe", "-i", str(output_path), "-show_entries", "format=duration",
         "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        duration = float(result.stdout.strip())
        print(f"Duree : {duration:.2f}s")
        if duration > 85:
            print("ATTENTION : duree > 85s — silences trop longs ou script trop long")
        elif duration < 60:
            print("ATTENTION : duree < 60s — verifier que le script complet a ete genere")
        else:
            print("OK : duree dans la cible 60-85s")

    return str(output_path)


def main():
    print("=== Generation Audio V5 Complet — Abou Bakari II ===\n")
    path = generate()

    if path:
        print(f"\nFichier : {path}")
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)
    else:
        print("\nECHEC — verifier la cle API et les credits ElevenLabs")


if __name__ == "__main__":
    main()
