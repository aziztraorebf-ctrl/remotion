"""
Test comparatif audio tags V3 — Abou Bakari
Genere 2 versions de la narration :
  - original : script existant (12 pauses explicites)
  - enrichi  : pauses chirurgicales + audio tags emotion/ton
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-tags-test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NARRATEUR_ID = "ICHuIqamER7XZMdm2HYC"  # Narrateur GeoAfrique V3 (grave, baritone)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# ─────────────────────────────────────────────────────────────────────────────
# VERSION ORIGINALE — 12 pauses explicites (reference)
# ─────────────────────────────────────────────────────────────────────────────
PART_A_ORIGINAL = """En treize cent onze, l'ocean Atlantique n'est qu'un mur de brouillard. [pause] Personne n'ose regarder vers l'ouest. [pause] Sauf un homme.

[pause]

Abou Bakari deux. Mansa du Mali. Roi des rois. Il regne sur l'empire le plus riche du monde. [pause] Mais l'horizon le hante.

[pause]

Il fait armer deux mille pirogues. [pause] Un seul bateau revient. Le capitaine tremble de peur. [pause] Un courant geant. On ne passe pas.

[pause]

Abou Bakari ne recule pas. [pause] Il abdique. Il quitte son trone, son or, son pouvoir."""

PART_B_ORIGINAL = """Son demi-frere monte sur le trone. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. [pause] Quatre cents milliards de dollars.

[pause]

Et Abou Bakari monte lui-meme a bord. Des milliers d'hommes le suivent. [pause] Le plus grand voyage maritime de l'histoire. [pause] Il ne reviendra jamais.

[pause]

Cent quatre-vingt-un ans plus tard, un marin genois traverse le meme ocean. [pause] Et c'est son nom que le monde retient. [pause] Christophe Colomb. Le decouvreur.

Mais qui a fait la traversee en premier ? L'Afrique a une histoire qu'on TE cache, et une actualite qu'on te simplifie. [pause] Pour en savoir plus, le lien est en bio."""

# ─────────────────────────────────────────────────────────────────────────────
# VERSION ENRICHIE — pauses chirurgicales + audio tags emotion/ton
# Philosophie :
#   - Pauses : 3 max sur tout le script, aux moments de rupture narrative
#   - Rythme : assure par la structure des phrases et les retours a la ligne
#   - Couleur : audio tags emotion/ton (zero duree ajoutee)
# ─────────────────────────────────────────────────────────────────────────────
PART_A_ENRICHI = """En treize cent onze, l'ocean Atlantique n'est qu'un mur de brouillard. Personne n'ose regarder vers l'ouest. Sauf un homme.

[solemn] Abou Bakari deux. Mansa du Mali. Roi des rois. Il regne sur l'empire le plus riche du monde. Mais l'horizon le hante.

[tense] Il fait armer deux mille pirogues. Un seul bateau revient. Le capitaine tremble de peur. Un courant geant — on ne passe pas.

[proud] Abou Bakari ne recule pas. Il abdique. Il quitte son trone, son or, son pouvoir."""

PART_B_ENRICHI = """Son demi-frere monte sur le trone. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. Quatre cents MILLIARDS de dollars.

[awe] Et Abou Bakari monte lui-meme a bord. Des milliers d'hommes le suivent. Le plus grand voyage maritime de l'histoire. Il ne reviendra jamais.

Cent quatre-vingt-un ans plus tard, un marin genois traverse le meme ocean. Et c'est son nom que le monde retient. Christophe Colomb. Le decouvreur.

[pause]

[whispers] Mais qui a fait la traversee en premier ? L'Afrique a une histoire qu'on TE cache, et une actualite qu'on te simplifie. Pour en savoir plus, le lien est en bio."""


def generate(voice_id, text, output_name, speed=0.90, stability=0.30, style=0.25):
    print(f"\nGenerating : {output_name}")
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
    size_kb = len(resp.content) // 1024
    print(f"  Saved : {out} ({size_kb} KB)")
    return out


if __name__ == "__main__":
    print("=" * 60)
    print("TEST COMPARATIF AUDIO TAGS V3 — Abou Bakari")
    print("=" * 60)

    print("\n--- VERSION ORIGINALE (reference) ---")
    generate(NARRATEUR_ID, PART_A_ORIGINAL, "partA-original.mp3", speed=0.90)
    generate(NARRATEUR_ID, PART_B_ORIGINAL, "partB-original.mp3", speed=0.90)

    print("\n--- VERSION ENRICHIE (audio tags emotion + pauses chirurgicales) ---")
    generate(NARRATEUR_ID, PART_A_ENRICHI, "partA-enrichi.mp3", speed=0.90)
    generate(NARRATEUR_ID, PART_B_ENRICHI, "partB-enrichi.mp3", speed=0.90)

    print("\n" + "=" * 60)
    print(f"Fichiers dans : {OUTPUT_DIR}")
    print("Comparer :")
    print("  partA-original.mp3  vs  partA-enrichi.mp3")
    print("  partB-original.mp3  vs  partB-enrichi.mp3")
    print("=" * 60)
