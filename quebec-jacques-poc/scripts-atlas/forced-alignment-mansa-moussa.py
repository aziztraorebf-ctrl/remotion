"""ElevenLabs forced-alignment for Atlas Mansa Moussa narration V3.
Tags eleven_v3 stripped before alignment (they aren't pronounced).
"""
import os
import sys
import json
import re
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

AUDIO = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "narration-v3.mp3"
OUT = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "narration-v3-alignment.json"

NARRATION_WITH_TAGS = """[mysterious] Cet homme a fait s'effondrer le cours de l'or pendant douze ans.

[fast] Mali, mille trois cent vingt-quatre. Tu regardes une carte d'Afrique de l'Ouest. Cette zone-la, c'est l'empire du Mali. Plus grand que l'Europe occidentale. [curious] Et il a un secret.

[fast] A cette epoque, le Mali produit la moitie de l'or qui circule dans le monde. [serious] La moitie. [fast] Tombouctou compte plus de bibliotheques que Paris. L'universite de Sankore accueille vingt-cinq mille etudiants. Pendant ce temps, la Sorbonne en a deux mille.

[dramatic] Mais le moment qui marque l'histoire, c'est ca. [fast] Douze ans apres son couronnement, l'empereur du Mali part a La Mecque. Avec lui : soixante mille hommes. Douze mille esclaves. Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur.

[fast] Sur la route, il distribue tellement d'or au Caire que l'economie egyptienne s'effondre. Pendant douze ans, le prix de l'or chute dans toute la Mediterranee. [serious] Un seul homme. Un continent qui s'effondre.

[confident] Cet homme s'appelait Mansa Moussa. [fast] Demande qui est l'homme le plus riche de l'histoire. On te repondra Rockefeller, Bezos, Musk. [dramatic] Et pourtant, la vraie reponse, c'est Mansa Moussa."""


def strip_tags(text: str) -> str:
    return re.sub(r"\[\w+\]\s*", "", text)


def main() -> int:
    if not AUDIO.exists():
        print(f"ERROR: audio not found: {AUDIO}")
        return 1

    text_clean = strip_tags(NARRATION_WITH_TAGS)
    print(f"Audio: {AUDIO} ({AUDIO.stat().st_size / 1024:.1f} KB)")
    print(f"Text (tags stripped): {len(text_clean)} chars")
    print("Calling ElevenLabs forced-alignment API...")

    url = "https://api.elevenlabs.io/v1/forced-alignment"
    files = {"file": ("audio.mp3", AUDIO.read_bytes(), "audio/mpeg")}
    data = {"text": text_clean}
    headers = {"xi-api-key": API_KEY}

    r = requests.post(url, files=files, data=data, headers=headers, timeout=180)
    if r.status_code != 200:
        print(f"ERROR {r.status_code}: {r.text[:500]}")
        return 1

    result = r.json()
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"OK saved: {OUT}")

    words = result.get("words", [])
    print(f"\nTotal words aligned: {len(words)}")

    keywords = [
        "mali", "tombouctou", "sankore", "sankoré", "moussa", "mansa",
        "caire", "mecque", "rockefeller", "bezos", "musk", "moitie", "moitié",
        "couronnement", "douze", "soixante", "chameaux", "or",
    ]
    print("\nKey words timing:")
    for word in words:
        text = word.get("text", "").strip().lower().rstrip(".,!?:;")
        if text in keywords:
            print(f"  {word['start']:6.2f}s -> {word['end']:6.2f}s : '{word['text']}'")

    return 0


if __name__ == "__main__":
    sys.exit(main())
