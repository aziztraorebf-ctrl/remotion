"""ElevenLabs forced-alignment for Atlas Tombouctou narration.
Returns word-level timing JSON.
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

AUDIO = ROOT / "quebec-jacques-poc" / "out" / "atlas-tombouctou" / "narration-v1.mp3"
OUT = ROOT / "quebec-jacques-poc" / "out" / "atlas-tombouctou" / "narration-v1-alignment.json"

NARRATION = """Une question. Au treizieme siecle, quelle ville africaine accueillait plus d'etudiants que Oxford ?

Tombouctou, dans le desert du Mali. Carrefour des routes du sel et des livres venus du Maroc.

Sa bibliotheque, Sankoré. Vingt-cinq mille etudiants. Plus que Oxford a la meme epoque.

Une universite africaine, deux siecles avant la Sorbonne."""


def main() -> int:
    if not AUDIO.exists():
        print(f"ERROR: audio not found: {AUDIO}")
        return 1

    print(f"Audio: {AUDIO} ({AUDIO.stat().st_size / 1024:.1f} KB)")
    print(f"Text: {len(NARRATION)} chars")
    print("Calling ElevenLabs forced-alignment API...")

    url = "https://api.elevenlabs.io/v1/forced-alignment"
    files = {"file": ("audio.mp3", AUDIO.read_bytes(), "audio/mpeg")}
    data = {"text": NARRATION}
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
    print("\nKey words timing:")
    for word in words:
        text = word.get("text", "").strip().lower()
        if text in ["tombouctou", "oxford", "sankoré", "sankore", "vingt-cinq", "mille", "sorbonne", "mali", "maroc"]:
            print(f"  {word['start']:.2f}s -> {word['end']:.2f}s : '{word['text']}'")

    return 0


if __name__ == "__main__":
    sys.exit(main())
