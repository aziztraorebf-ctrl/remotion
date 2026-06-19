"""Forced alignment pour la narration Peste 1347 (sous-titres sobres).

Endpoint ElevenLabs forced-alignment -> word-level timing JSON.
Le texte DOIT correspondre exactement au TTS d'origine (script V3 locked).
"""
import os
import sys
import json
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

AUDIO_FILE = ROOT / "public" / "atlas" / "peste-1347" / "audio" / "narration-v1.mp3"
OUT_FILE = ROOT / "public" / "atlas" / "peste-1347" / "audio" / "narration-v1-alignment.json"

# Script V3 LOCKED — doit correspondre au TTS d'origine.
TEXT = """En mil trois cent quarante-sept, un tiers de l'Europe disparait en trois ans. L'Afrique subsaharienne, elle, continue.

Octobre mil trois cent quarante-sept. Un navire accoste en Sicile. Il vient de Crimee. A son bord : la Peste. La Peste se propage vers le nord. Vers Paris. Vers Londres. Vers Stockholm. Mais le Sahara est la.

En Angleterre : quarante-six pour cent de la population meurt. Quatre virgule huit millions d'habitants. Deux virgule six millions survivent. Au Caire, en decembre mil trois cent quarante-huit : sept mille morts par jour. Sept mille. Chaque jour.

La bacterie voyage avec les rats, les puces, les bateaux. Elle suit les routes maritimes. Et voici ce qu'elle ne peut pas faire. Traverser le Sahara a dos de chameau prend soixante a quatre-vingt-dix jours. Un malade de la Peste meurt en deux a six jours. La puce vectrice exige une humidite elevee pour survivre. L'air du desert l'asseche en quelques heures. En Europe : des milliers de fosses communes. Au sud du Sahara : aucune. La meme epoque. Le meme pathogene. Un desert entre les deux.

Pendant ce temps, Mansa Souleymane gouverne le Mali. Les recits de l'epoque decrivent des routes sures, un commerce qui prospere, aucune epidemie. L'or du Mali part en caravane vers le Maghreb, puis par bateau vers les ports de Florence et de Venise. L'Europe s'effondre. Le Mali alimente ses monnaies.

Deux epidemies, deux destins. Un desert entre les deux. La geographie n'est pas neutre."""


def main() -> int:
    if not AUDIO_FILE.exists():
        print(f"ERROR: audio not found: {AUDIO_FILE}")
        return 2

    url = "https://api.elevenlabs.io/v1/forced-alignment"
    with open(AUDIO_FILE, "rb") as f:
        files = {"file": (AUDIO_FILE.name, f, "audio/mpeg")}
        data = {"text": TEXT}
        headers = {"xi-api-key": API_KEY}
        print("Calling forced alignment API...")
        resp = requests.post(url, files=files, data=data, headers=headers, timeout=120)

    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}")
        return 3

    result = resp.json()
    OUT_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    words = result.get("words", [])
    loss = result.get("loss", "n/a")
    print(f"OK: {len(words)} words, loss={loss}")
    print(f"-> {OUT_FILE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
