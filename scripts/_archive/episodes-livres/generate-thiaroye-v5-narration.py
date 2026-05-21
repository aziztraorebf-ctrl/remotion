"""Generate Thiaroye V5 Short full narration (hook + 6 scenes).

Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm) - same as Sonjata
Config: max-style (stability 0.22, similarity 0.55, style 0.55, speed 1.0, model eleven_v3)

Source: manifests/thiaroye-v5-manifest.json (LOCKED 2026-04-22)
TTS scan: all accents added (libere->libere, tue->tue, decembre->decembre, etc.)
Char count: ~1316 chars (target ~1400 in manifest)
Target duration: ~95s

Words to validate at ear after generation:
- Biram (proper noun Senegalese)
- Senghor (h muet or aspire?)
- Thiaroye (3 or 4 syllables?)
- tirailleurs
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

NARRATION = """Ils ont libere la France. Trois cents sont tombes au retour.

Decembre mille neuf cent quarante-quatre. Le port de Dakar. Trois tirailleurs rentrent au pays. Ils ont combattu pour la France. Leur France. Ils attendent leur solde.

Thiaroye, camp militaire. La solde ne vient pas. Les tirailleurs s'organisent. Calmes. Dignes. Une main s'ouvre. Une demande. Rien de plus.

Premier decembre mille neuf cent quarante-quatre. A l'aube, l'armee francaise ouvre le feu. Sur ses propres soldats. Sur ceux qui avaient libere la France. La demande devient silence. Le silence devient sang.

Quatre-vingts morts officiels. Peut-etre trois cents. Peut-etre plus. Personne ne sait. Personne ne veut savoir. Les archives se ferment. Les noms s'effacent.

Tu n'as jamais appris leurs noms. Parce qu'on n'a pas voulu les dire. Des decennies passent. Leurs enfants cherchent la verite.

Quatre-vingts ans plus tard, le fils d'un des trois cents de Thiaroye depose plainte. Biram Senghor contre l'Etat francais. En mars deux mille vingt-six, la justice tranche. L'Etat dissimule. Le tribunal le dit. Un seul nom sur la pierre. Les autres attendent encore.

Ils ont libere un continent qui les oublie. Maintenant, toi, tu sais. Chaque matin dans notre newsletter, l'actualite africaine vue sous un angle different. Lien en bio."""

OUT_DIR = ROOT / "public" / "audio" / "thiaroye-1944"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "thiaroye-v5-narration.mp3"


def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Text length: {len(NARRATION)} chars")
    print(f"Target duration: ~95s")
    print(f"Output: {OUT_FILE}")
    print()

    # Confirm cost preview
    cost_estimate = len(NARRATION) * 0.00003  # rough ElevenLabs pricing ~$30/1M chars
    print(f"[COST PREVIEW] ~{len(NARRATION)} chars -> ~${cost_estimate:.3f}")
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
    }

    print("Calling ElevenLabs API...")
    resp = requests.post(url, json=payload, headers=headers, timeout=180)
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}")
        return 2

    OUT_FILE.write_bytes(resp.content)
    size_kb = OUT_FILE.stat().st_size / 1024
    print(f"Saved: {OUT_FILE.name} ({size_kb:.1f} KB)")

    probe = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(OUT_FILE),
        ],
        capture_output=True, text=True,
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        print(f"Duration: {duration:.2f}s (target: ~95.0s)")
        delta = duration - 95.0
        if abs(delta) > 5.0:
            print(f"[WARN] deviation {delta:+.1f}s from target - may need script adjustment")
        else:
            print(f"[OK] within tolerance ({delta:+.1f}s from target)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
