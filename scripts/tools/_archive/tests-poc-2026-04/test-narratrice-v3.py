"""
Test Narratrice GeoAfrique — strategies pauses vs tags emotion
Meme texte que le test narrateur pour comparaison valide.

Version A : pauses moderees (comme narrateur enrichi)
Version B : tags emotion uniquement, pauses minimales (1-2 max)
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-tags-test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NARRATRICE_ID = "Y8XqpS6sj6cx5cCTLp8a"  # Narratrice GeoAfrique V3

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# ─────────────────────────────────────────────────────────────────────────────
# VERSION A — meme strategie que narrateur enrichi (pauses moderees + tags)
# ─────────────────────────────────────────────────────────────────────────────
PART_A_PAUSES = """En treize cent onze, l'ocean Atlantique n'est qu'un mur de brouillard. Personne n'ose regarder vers l'ouest. Sauf un homme.

[solemn] Abou Bakari deux. Mansa du Mali. Roi des rois. Il regne sur l'empire le plus riche du monde. [pause] Mais l'horizon le hante.

[tense] Il fait armer deux mille pirogues. Un seul bateau revient. Le capitaine tremble de peur. [pause] Un courant geant — on ne passe pas.

[proud] Abou Bakari ne recule pas. Il abdique. Il quitte son trone, son or, son pouvoir."""

PART_B_PAUSES = """Son demi-frere monte sur le trone. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. Quatre cents MILLIARDS de dollars.

[awe] Et Abou Bakari monte lui-meme a bord. Des milliers d'hommes le suivent. Le plus grand voyage maritime de l'histoire. Il ne reviendra jamais.

Cent quatre-vingt-un ans plus tard, un marin genois traverse le meme ocean. Et c'est son nom que le monde retient. Christophe Colomb. Le decouvreur.

[pause]

[whispers] Mais qui a fait la traversee en premier ? L'Afrique a une histoire qu'on TE cache, et une actualite qu'on te simplifie. Pour en savoir plus, le lien est en bio."""

# ─────────────────────────────────────────────────────────────────────────────
# VERSION B — tags emotion uniquement, zero pauses explicites
# Hypothese : voix deja lente = rythme assure par structure seule
# ─────────────────────────────────────────────────────────────────────────────
PART_A_TAGS = """En treize cent onze, l'ocean Atlantique n'est qu'un mur de brouillard. Personne n'ose regarder vers l'ouest. Sauf un homme.

[solemn] Abou Bakari deux. Mansa du Mali. Roi des rois. Il regne sur l'empire le plus riche du monde. Mais l'horizon le hante.

[tense] Il fait armer deux mille pirogues. Un seul bateau revient. Le capitaine tremble de peur. Un courant geant — on ne passe pas.

[proud] Abou Bakari ne recule pas. Il abdique. Il quitte son trone, son or, son pouvoir."""

PART_B_TAGS = """Son demi-frere monte sur le trone. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. Quatre cents MILLIARDS de dollars.

[awe] Et Abou Bakari monte lui-meme a bord. Des milliers d'hommes le suivent. Le plus grand voyage maritime de l'histoire. Il ne reviendra jamais.

Cent quatre-vingt-un ans plus tard, un marin genois traverse le meme ocean. Et c'est son nom que le monde retient. Christophe Colomb. Le decouvreur.

[whispers] Mais qui a fait la traversee en premier ? L'Afrique a une histoire qu'on TE cache, et une actualite qu'on te simplifie. Pour en savoir plus, le lien est en bio."""


def generate(voice_id, text, output_name, speed=0.92, stability=0.30, style=0.25):
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
    print("TEST NARRATRICE GeoAfrique — pauses vs tags emotion")
    print("=" * 60)

    print("\n--- VERSION A : pauses moderees + tags (meme strategie narrateur) ---")
    generate(NARRATRICE_ID, PART_A_PAUSES, "narratrice-partA-pauses.mp3", speed=0.92)
    generate(NARRATRICE_ID, PART_B_PAUSES, "narratrice-partB-pauses.mp3", speed=0.92)

    print("\n--- VERSION B : zero pauses, tags emotion uniquement ---")
    generate(NARRATRICE_ID, PART_A_TAGS, "narratrice-partA-tags.mp3", speed=0.92)
    generate(NARRATRICE_ID, PART_B_TAGS, "narratrice-partB-tags.mp3", speed=0.92)

    print("\n" + "=" * 60)
    print(f"Fichiers dans : {OUTPUT_DIR}")
    print("Comparer :")
    print("  narratrice-partA-pauses.mp3  vs  narratrice-partA-tags.mp3")
    print("  narratrice-partB-pauses.mp3  vs  narratrice-partB-tags.mp3")
    print("=" * 60)
