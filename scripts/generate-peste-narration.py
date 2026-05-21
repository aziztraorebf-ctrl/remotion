"""Generate narration — La Peste et le Sahara (Atlas pur).
Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm)
Script V3 LOCKED 2026-05-15
"""
import os
import sys
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

VOICE_ID = "z3gESu49naEZW8Af2Upm"

NARRATION = """En mil trois cent quarante-sept, un tiers de l'Europe disparaît en trois ans.
L'Afrique subsaharienne, elle, continue.

Octobre mil trois cent quarante-sept. Un navire accoste en Sicile.
Il vient de Crimée. À son bord : la Peste.
La Peste se propage vers le nord. Vers Paris. Vers Londres. Vers Stockholm.
Mais le Sahara est là.

En Angleterre : quarante-six pour cent de la population meurt.
Quatre virgule huit millions d'habitants. Deux virgule six millions survivent.
Au Caire, en décembre mil trois cent quarante-huit : sept mille morts par jour.
Sept mille. Chaque jour.

La bactérie voyage avec les rats, les puces, les bateaux.
Elle suit les routes maritimes.
Et voici ce qu'elle ne peut pas faire.

Traverser le Sahara à dos de chameau prend soixante à quatre-vingt-dix jours.
Un malade de la Peste meurt en deux à six jours.
La puce vectrice exige une humidité élevée pour survivre.
L'air du désert l'assèche en quelques heures.

En Europe : des milliers de fosses communes.
Au sud du Sahara : aucune.
La même époque. Le même pathogène. Un désert entre les deux.

Pendant ce temps, Mansa Souleymane gouverne le Mali.
Les récits de l'époque décrivent des routes sûres, un commerce qui prospère, aucune épidémie.
L'or du Mali part en caravane vers le Maghreb, puis par bateau vers les ports de Florence et de Venise.
L'Europe s'effondre. Le Mali alimente ses monnaies.

Deux épidémies, deux destins. Un désert entre les deux.
La géographie n'est pas neutre."""

OUT_DIR = ROOT / "public" / "atlas" / "peste-1347" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "narration-v1.mp3"

def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Text length: {len(NARRATION)} chars")
    print(f"Output: {OUT_FILE}")
    cost = len(NARRATION) * 0.00003
    print(f"[COST PREVIEW] ~${cost:.4f} ({len(NARRATION)} chars)")
    print()
    confirm = input("Confirmer la generation ? (o/n) : ").strip().lower()
    if confirm != "o":
        print("Annule.")
        return 0

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": NARRATION,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.3,
            "speed": 1.0,
        },
        "output_format": "mp3_44100_128",
    }
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

    print("Generating audio...")
    r = requests.post(url, json=payload, headers=headers, timeout=120)
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
        frames = int(duration * 30)
        print(f"Duration: {duration:.2f}s | {frames} frames @30fps")
    return 0

if __name__ == "__main__":
    sys.exit(main())
