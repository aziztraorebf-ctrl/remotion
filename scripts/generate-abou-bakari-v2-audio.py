"""
Generation audio — Abou Bakari II Short V2 (Seedance-native)
3 fichiers : narration principale + 2 voix dialogue
Modele : eleven_v3
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-abou-bakari-v2"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# --- Voice IDs ---
NARRATRICE_ID = "Y8XqpS6sj6cx5cCTLp8a"  # Narratrice GeoAfrique V3
ABOU_BAKARI_ID = "ICHuIqamER7XZMdm2HYC"  # Narrateur GeoAfrique V3 (grave, baritone)
MOUSSA_ID = "12mpLi4ieFNVlQlAIJ3m"  # Narrateur GeoAfrique B3 (plus jeune)

# --- Narration principale (tout sauf le dialogue) ---
NARRATION_SCRIPT = """En treize cent onze, l'océan Atlantique n'est qu'un mur de brouillard. [pause] Personne n'ose regarder vers l'ouest. [pause] Sauf un homme.

[long pause]

Abou Bakari deux. Mansa du Mali. Roi des rois. Il règne sur l'empire le plus riche du monde. [pause] Mais il est hanté par l'horizon.

[long pause]

Il fait préparer deux mille pirogues. [pause] Un seul bateau revient. Le capitaine est terrifié. [pause] Un courant géant. On ne passe pas.

[long pause]

Abou Bakari ne recule pas. [pause] Il abdique. Il quitte son trône, son or, son pouvoir.

[long pause]

Il monte lui-même à bord. Des milliers d'hommes le suivent. [pause] Le plus grand voyage maritime jamais tenté. [pause] Il ne reviendra jamais.

[long pause]

Cent quatre-vingt-un ans plus tard, un marin génois traverse le même océan. [pause] Et c'est son nom que le monde retient. [pause] Christophe Colomb. Le découvreur.

[long pause]

Mais qui a traversé en premier ? [pause] L'Afrique a une histoire qu'on ne t'a pas racontée, et une actualité qu'on simplifie. [pause] Pour en savoir plus, le lien est en bio."""

# --- Dialogue Abou Bakari ---
ABOU_BAKARI_DIALOGUE = """L'empire est à toi, Moussa. [pause] Protège-le."""

ABOU_BAKARI_REPLY = """Là où personne n'est jamais allé."""

# --- Dialogue Moussa ---
MOUSSA_DIALOGUE = """Et toi, où iras-tu ?"""


def generate_tts(voice_id, text, output_name, speed=0.88):
    print(f"\nGenerating: {output_name}")
    print(f"  Voice: {voice_id}")
    print(f"  Speed: {speed}")
    print(f"  Text: {text[:80]}...")

    payload = {
        "text": text,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.30,
            "similarity_boost": 0.75,
            "style": 0.25,
            "speed": speed,
        },
        "output_format": "mp3_44100_128",
    }

    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    output_path = OUTPUT_DIR / output_name
    output_path.write_bytes(resp.content)
    size_kb = len(resp.content) / 1024
    print(f"  Saved: {output_path} ({size_kb:.0f} KB)")

    result = subprocess.run(
        ["ffprobe", "-i", str(output_path), "-show_entries",
         "format=duration", "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        duration = float(result.stdout.strip())
        print(f"  Duration: {duration:.2f}s")

    return str(output_path)


def main():
    print("=" * 60)
    print("Abou Bakari II — Short V2 Audio Generation")
    print("=" * 60)

    files = []

    # 1. Narration principale — speed 1.0 (epique, rythme soutenu)
    f = generate_tts(
        NARRATRICE_ID,
        NARRATION_SCRIPT,
        "narration-v2c.mp3",
        speed=1.0
    )
    if f:
        files.append(f)

    # 2. Dialogue Abou Bakari ligne 1 — speed 0.85 (pose, royal)
    f = generate_tts(
        ABOU_BAKARI_ID,
        ABOU_BAKARI_DIALOGUE,
        "dialogue-abou-bakari-line1.mp3",
        speed=0.85
    )
    if f:
        files.append(f)

    # 3. Dialogue Abou Bakari ligne 2 — speed 0.85
    f = generate_tts(
        ABOU_BAKARI_ID,
        ABOU_BAKARI_REPLY,
        "dialogue-abou-bakari-line2.mp3",
        speed=0.85
    )
    if f:
        files.append(f)

    # 4. Dialogue Moussa — speed 0.90 (plus jeune, respectueux)
    f = generate_tts(
        MOUSSA_ID,
        MOUSSA_DIALOGUE,
        "dialogue-moussa.mp3",
        speed=0.90
    )
    if f:
        files.append(f)

    print("\n" + "=" * 60)
    print(f"Generated {len(files)} audio files in {OUTPUT_DIR}")
    print("=" * 60)

    # List all with durations
    print("\nAll files:")
    for fp in sorted(OUTPUT_DIR.glob("*.mp3")):
        result = subprocess.run(
            ["ffprobe", "-i", str(fp), "-show_entries",
             "format=duration", "-v", "quiet", "-of", "csv=p=0"],
            capture_output=True, text=True
        )
        dur = float(result.stdout.strip()) if result.stdout.strip() else 0
        print(f"  {fp.name:45s} {dur:.2f}s")


if __name__ == "__main__":
    main()
