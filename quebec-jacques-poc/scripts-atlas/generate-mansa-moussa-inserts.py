"""Generate 3 ElevenLabs audio inserts for Atlas Mansa Moussa V2 (BLOC 5).
Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3
TTS-safe scripts (no participe passe e/ee in fin de groupe, no liaisons risk)
Cost: ~$0.07 total for 3 inserts (~700 chars).
"""
import os
import sys
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

VOICE_ID = "z3gESu49naEZW8Af2Upm"

OUT_DIR = ROOT / "quebec-jacques-poc" / "public" / "atlas-mansa-moussa"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# === SCRIPTS TTS-SAFE (validated by Aziz) ===
INSERTS = [
    {
        "name": "insert-1-bambouk",
        "text": "[curious] L'or vient des fleuves du Bambouk et du Boure. [confident] Trois cents tonnes par an traversent le Sahara vers l'Europe et l'Orient.",
    },
    {
        "name": "insert-2-expeditions",
        "text": "[dramatic] Marco Polo, Vasco de Gama, Christophe Colomb. [confident] Aucune autre expedition de l'Histoire n'a transporte une telle fortune.",
    },
    {
        "name": "insert-3-mediterranee",
        "text": "[serious] De Genes a Bagdad, les marches se figent. [dramatic] Tout cela parce qu'un seul homme a traverse le Sahara.",
    },
]


def generate(name: str, text: str) -> int:
    out_file = OUT_DIR / f"{name}.mp3"
    print(f"\n=> {name}")
    print(f"   Text: {text}")
    cost = len(text) * 0.00003
    print(f"   [COST PREVIEW] ~${cost:.4f}")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": text,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.22,
            "similarity_boost": 0.55,
            "style": 0.55,
            "speed": 1.0,
        },
        "output_format": "mp3_44100_128",
    }
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }
    r = requests.post(url, json=payload, headers=headers, timeout=180)
    if r.status_code != 200:
        print(f"   ERROR {r.status_code}: {r.text[:300]}")
        return 1
    out_file.write_bytes(r.content)
    size_kb = len(r.content) / 1024
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(out_file)],
        capture_output=True, text=True
    )
    duration = float(probe.stdout.strip()) if probe.returncode == 0 else 0
    print(f"   OK saved: {out_file.name} ({size_kb:.0f} KB, {duration:.2f}s)")
    if duration > 9.0:
        print(f"   WARNING: duration {duration:.2f}s > 9s — extend INSERT_DURATION_FRAMES")
    return 0


def main() -> int:
    total_chars = sum(len(i["text"]) for i in INSERTS)
    total_cost = total_chars * 0.00003
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Model: eleven_v3")
    print(f"Total: {len(INSERTS)} inserts, {total_chars} chars")
    print(f"[TOTAL COST PREVIEW] ~${total_cost:.4f}")
    fails = 0
    for ins in INSERTS:
        if generate(ins["name"], ins["text"]) != 0:
            fails += 1
    print(f"\nDone. Failed: {fails}/{len(INSERTS)}")
    return fails


if __name__ == "__main__":
    sys.exit(main())
