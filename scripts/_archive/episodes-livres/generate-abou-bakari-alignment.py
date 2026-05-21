"""Generate forced alignment for Abou Bakari II narration.

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

AUDIO_FILE = ROOT / "public" / "audio" / "abou-bakari" / "abou-bakari-narratrice-v1.mp3"
OUT_FILE = ROOT / "public" / "audio" / "abou-bakari" / "abou-bakari-alignment.json"

# Must match EXACTLY what was passed to ElevenLabs for TTS
TEXT = """En 1311, l'océan Atlantique n'est qu'un mur de brouillard. Personne n'ose regarder vers l'ouest. Sauf un homme qui a un ardent désir de savoir.

Abou Bakari deux. Mansa du Mali. Roi des rois. Il règne sur l'empire le plus riche du monde. Hanté par l'horizon.

Il fait préparer deux mille pirogues. Un seul bateau revient. Le capitaine est terrifié. Un courant géant. On ne passe pas.

Abou Bakari ne recule pas. Il abdique. Il quitte son trône, son or, son pouvoir. Il monte lui-même à bord. Il ne reviendra jamais.

Son demi-frère monte sur le trône. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. 400 milliards de dollars.

Abou Bakari avait tout abandonné pour une seule obsession : savoir ce qu'il y avait à l'ouest.

Cent quatre-vingt-un ans plus tard, Christophe Colomb traverse le même océan. On l'appelle le découvreur.

Mais qui a traversé en premier ? Et toi... tu savais ça ?"""


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
        total = words[-1].get("end", 0)
        print(f"Total duration: {total:.2f}s")

    return 0


if __name__ == "__main__":
    sys.exit(main())
