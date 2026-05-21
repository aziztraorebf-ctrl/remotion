"""Regenerate CTA chaine narration — v2 avec parametres corrects eleven_v3.
Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm)
Model: eleven_v3 (meme que narration-v3.mp3)
Settings: stability 0.22, similarity 0.55, style 0.55
Fix: v1 etait generee avec eleven_multilingual_v2 + stability 0.45 -> timbre different
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

# Script valide par Aziz (option a). Scan TTS effectue — aucun participe vulnerable.
# "regorge" = verbe conjugue, pas de "e/ee" en fin de groupe phonetique.
CTA_TEXT = """[curious] Tu savais que l'histoire de l'Afrique regorge de figures comme lui ?

[calm] Chaque semaine, la newsletter qui te raconte ce qu'on ne t'a pas appris a l'ecole.

[confident] Lien en bio."""

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "atlas-cta-narration-v2.mp3"

PUBLIC_DEST = ROOT / "quebec-jacques-poc" / "public" / "atlas-mansa-moussa" / "atlas-cta-narration-v1.mp3"


def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Model: eleven_v3")
    print(f"Settings: stability 0.22, similarity_boost 0.55, style 0.55, speed 1.0")
    print(f"Text length: {len(CTA_TEXT)} chars")
    print(f"Output: {OUT_FILE}")
    cost = len(CTA_TEXT) * 0.00003
    print(f"[COST PREVIEW] ~${cost:.4f}")
    print()

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": CTA_TEXT,
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

    print("Generating CTA narration v2...")
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
    duration = None
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        print(f"Duration: {duration:.2f}s")

    # Copier vers public/
    import shutil
    shutil.copy2(OUT_FILE, PUBLIC_DEST)
    print(f"Copied to: {PUBLIC_DEST}")

    if duration and abs(duration - 9.75) > 1.5:
        print(f"WARNING: duration {duration:.2f}s diverge de 9.75s (la reference Whisper).")
        print("Si duration < 8s ou > 12s, mettre a jour ATLAS_CTA_CHAINE_FRAMES dans AtlasV2CtaChaine.tsx")
        print(f"Nouvelle valeur: Math.round({duration:.2f} * 30) = {round(duration * 30)}")
    else:
        print("Duration OK — aucune modification de code necessaire.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
