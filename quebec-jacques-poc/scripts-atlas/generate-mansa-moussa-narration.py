"""Generate Atlas Mansa Moussa narration V3 — script LOCKED avec tags eleven_v3.
Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm)
Model: eleven_v3 (canonique Atlas V8)
Tags: [mysterious] [fast] [curious] [serious] [dramatic] [confident]
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

NARRATION = """[mysterious] Cet homme a fait s'effondrer le cours de l'or pendant douze ans.

[fast] Mali, mille trois cent vingt-quatre. Tu regardes une carte d'Afrique de l'Ouest. Cette zone-la, c'est l'empire du Mali. Plus grand que l'Europe occidentale. [curious] Et il a un secret.

[fast] A cette epoque, le Mali produit la moitie de l'or qui circule dans le monde. [serious] La moitie. [fast] Tombouctou compte plus de bibliotheques que Paris. L'universite de Sankore accueille vingt-cinq mille etudiants. Pendant ce temps, la Sorbonne en a deux mille.

[dramatic] Mais le moment qui marque l'histoire, c'est ca. [fast] Douze ans apres son couronnement, l'empereur du Mali part a La Mecque. Avec lui : soixante mille hommes. Douze mille esclaves. Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur.

[fast] Sur la route, il distribue tellement d'or au Caire que l'economie egyptienne s'effondre. Pendant douze ans, le prix de l'or chute dans toute la Mediterranee. [serious] Un seul homme. Un continent qui s'effondre.

[confident] Cet homme s'appelait Mansa Moussa. [fast] Demande qui est l'homme le plus riche de l'histoire. On te repondra Rockefeller, Bezos, Musk. [dramatic] Et pourtant, la vraie reponse, c'est Mansa Moussa."""

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "narration-v3.mp3"


def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Model: eleven_v3")
    print(f"Settings: stability 0.22, similarity 0.55, style 0.55")
    print(f"Text length: {len(NARRATION)} chars")
    print(f"Output: {OUT_FILE}")
    cost = len(NARRATION) * 0.00003
    print(f"[COST PREVIEW] ~${cost:.4f}")
    print()

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": NARRATION,
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

    print("Generating narration V3...")
    r = requests.post(url, json=payload, headers=headers, timeout=180)
    if r.status_code != 200:
        print(f"ERROR {r.status_code}: {r.text[:500]}")
        return 1

    OUT_FILE.write_bytes(r.content)
    size_mb = len(r.content) / 1024 / 1024
    print(f"OK {OUT_FILE} ({size_mb:.2f} MB)")

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(OUT_FILE)],
        capture_output=True, text=True
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        print(f"Duration: {duration:.2f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
