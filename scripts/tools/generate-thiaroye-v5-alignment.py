"""Generate forced alignment for Thiaroye V5 narration.

Uses ElevenLabs forced alignment endpoint to produce word-level + character-level
timing JSON. This JSON becomes the SOURCE OF TRUTH for timing.ts (per rules-pipeline.md).

Endpoint: POST https://api.elevenlabs.io/v1/forced-alignment
Input: audio file + text
Output: JSON with words[].{text, start, end} and characters[].{text, start, end}
"""
import os
import sys
import json
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

AUDIO_FILE = ROOT / "public" / "audio" / "thiaroye-1944" / "thiaroye-v5-narration.mp3"
OUT_FILE = ROOT / "public" / "audio" / "thiaroye-1944" / "thiaroye-v5-alignment.json"

# Must match EXACTLY what was passed to ElevenLabs for TTS
TEXT = """Ils ont libere la France. Trois cents sont tombes au retour.

Decembre mille neuf cent quarante-quatre. Le port de Dakar. Trois tirailleurs rentrent au pays. Ils ont combattu pour la France. Leur France. Ils attendent leur solde.

Thiaroye, camp militaire. La solde ne vient pas. Les tirailleurs s'organisent. Calmes. Dignes. Une main s'ouvre. Une demande. Rien de plus.

Premier decembre mille neuf cent quarante-quatre. A l'aube, l'armee francaise ouvre le feu. Sur ses propres soldats. Sur ceux qui avaient libere la France. La demande devient silence. Le silence devient sang.

Quatre-vingts morts officiels. Peut-etre trois cents. Peut-etre plus. Personne ne sait. Personne ne veut savoir. Les archives se ferment. Les noms s'effacent.

Tu n'as jamais appris leurs noms. Parce qu'on n'a pas voulu les dire. Des decennies passent. Leurs enfants cherchent la verite.

Quatre-vingts ans plus tard, le fils d'un des trois cents de Thiaroye depose plainte. Biram Senghor contre l'Etat francais. En mars deux mille vingt-six, la justice tranche. L'Etat dissimule. Le tribunal le dit. Un seul nom sur la pierre. Les autres attendent encore.

Ils ont libere un continent qui les oublie. Maintenant, toi, tu sais. Chaque matin dans notre newsletter, l'actualite africaine vue sous un angle different. Lien en bio."""


def main() -> int:
    if not AUDIO_FILE.exists():
        print(f"ERROR: audio not found: {AUDIO_FILE}")
        return 2

    print(f"Audio: {AUDIO_FILE}")
    print(f"Text length: {len(TEXT)} chars")
    print(f"Output: {OUT_FILE}")
    print()

    url = "https://api.elevenlabs.io/v1/forced-alignment"

    with open(AUDIO_FILE, "rb") as f:
        files = {
            "file": (AUDIO_FILE.name, f, "audio/mpeg"),
        }
        data = {"text": TEXT}
        headers = {"xi-api-key": API_KEY}

        print("Calling forced alignment API...")
        resp = requests.post(url, files=files, data=data, headers=headers, timeout=120)

    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}")
        return 3

    alignment = resp.json()
    OUT_FILE.write_text(json.dumps(alignment, indent=2, ensure_ascii=False))

    words = alignment.get("words", [])
    print(f"Saved: {OUT_FILE.name}")
    print(f"Words aligned: {len(words)}")
    if words:
        print(f"First word: '{words[0].get('text')}' @ {words[0].get('start')}s")
        print(f"Last word: '{words[-1].get('text')}' @ {words[-1].get('end')}s")
        total = words[-1].get('end', 0)
        print(f"Total duration: {total:.2f}s")

    return 0


if __name__ == "__main__":
    sys.exit(main())
