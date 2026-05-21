"""
Generation audio — Empire du Ghana / "Le sel qui valait son poids en or"
Voix : Narratrice GeoAfrique V2 (z3gESu49naEZW8Af2Upm)
Strategie : tags emotion sur chaque beat + pauses chirurgicales aux pivots
Format : Atlas (densite Cesar, didactique chaleureux)
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

OUTPUT_DIR = ROOT / "public" / "audio" / "atlas-empire-ghana"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Voix canonique GeoAfrique V2 (validee Mansa Moussa V2, Sonjata V7, Thiaroye V5)
NARRATRICE_ID = "z3gESu49naEZW8Af2Upm"

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# ─────────────────────────────────────────────────────────────────────────────
# SCRIPT V3 LOCKED — Empire du Ghana / Le sel qui valait son poids en or
#
# Verifications TTS :
#   - Tous nombres en lettres (huitieme, treizieme, quatre-vingt-dix, mille soixante-seize, mille deux cent quarante, vingt mille, cinq cents)
#   - Pas de "ont + voyelle" (correction Beat 4 : "coupèrent")
#   - Pas de participe e/ee en fin de groupe
#   - Mention factuelle commerce esclaves Beat 2 (validee Aziz)
#   - Tags emotion sur chaque beat
# ─────────────────────────────────────────────────────────────────────────────

GHANA = """[curious] Au cœur du Sahara, on troquait du sel contre de l'or. Au gramme près.

[pause]

[didactic] Wagadou. Aujourd'hui, presque personne ne connaît ce nom. Pourtant, du huitième au treizième siècle, cet empire ouest-africain contrôlait la richesse la plus convoitée du monde médiéval. Et il avait un secret.

[proud] À Taghaza, au nord, le sel était extrait par blocs de quatre-vingt-dix kilos. À Bambouk, au sud, l'or sortait de la terre par poignées. Entre les deux, le désert. Et au centre exact, Koumbi Saleh. Vingt mille habitants. Une mosquée. Et un roi qui taxait chaque caravane — d'or, de sel, et d'esclaves.

[mysterious] Mais le moment qui marque l'histoire, c'est ça. Sur les marchés du sud, les marchands déposaient leur sel. Puis ils s'éloignaient. Les acheteurs venaient. Posaient leur or à côté. Et repartaient sans un mot.

[awe] Le silent barter. Sel contre or, presque au poids égal.

[pause]

[solemn] Ce système a tenu cinq cents ans. Puis les Almoravides coupèrent les routes du sel en mille soixante-seize. Sécheresse. Effondrement. Et en mille deux cent quarante, un certain Sundiata Keïta détruit Koumbi Saleh. L'empire du Mali venait de naître sur les cendres de Wagadou.

[invitation] Wagadou. Cinq siècles de commerce mondial. Demande qui contrôlait l'or au Moyen-Âge. On te répondra Florence, Venise. Jamais Wagadou.
"""


def generate(text: str, output_path: Path, label: str = ""):
    """Generation TTS via ElevenLabs eleven_v3 model."""
    print(f"\n→ Generating {label or 'audio'}")
    print(f"  Output: {output_path}")
    print(f"  Chars: {len(text)}")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{NARRATRICE_ID}/stream"
    payload = {
        "text": text,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.4,  # plus expressif pour Atlas
            "use_speaker_boost": True,
        },
    }

    response = requests.post(url, headers=HEADERS, json=payload, stream=True)
    if response.status_code != 200:
        print(f"  ERROR: {response.status_code} — {response.text[:300]}")
        return False

    with open(output_path, "wb") as f:
        total = 0
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                total += len(chunk)
        print(f"  OK, {total / 1024:.1f} KB written")
    return True


def main():
    print("=" * 70)
    print("ATLAS EMPIRE DU GHANA — Generation narration v1")
    print("=" * 70)

    output = OUTPUT_DIR / "narration-v1.mp3"

    if output.exists():
        print(f"\n⚠️  {output.name} existe deja. Overwrite ? (y/n) ", end="")
        if input().strip().lower() != "y":
            print("Aborted.")
            return

    success = generate(GHANA, output, "narration-v1")
    if not success:
        sys.exit(1)

    # Affiche taille + duree estimee
    size_kb = output.stat().st_size / 1024
    print(f"\n✓ DONE — {output}")
    print(f"  Size: {size_kb:.1f} KB")
    print(f"  Duree estimee : ~{len(GHANA.split()) / 2.2:.1f}s (densite ~2.2 mots/s)")
    print(f"\nPROCHAINE ETAPE :")
    print(f"  1. Ecouter et valider l'audio")
    print(f"  2. Lancer Forced Alignment : python scripts/tools/generate-ghana-alignment.py")


if __name__ == "__main__":
    main()
