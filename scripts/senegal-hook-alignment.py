"""Forced alignment ElevenLabs pour le HOOK Senegal (scene 0).
Le texte = SCENE 0 du SCRIPT-V3 (tags retires), correspondant a l'extrait audio des 26 premieres s.
Sert a caler PRECISEMENT le SFX fracture sur "saute" et la question sur "Comment".
"""
import os, sys, json
from pathlib import Path
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing"); sys.exit(1)

AUDIO_FILE = Path("/tmp/senegal-hook26.mp3")
OUT_FILE = ROOT / "public" / "souverain" / "senegal-petrole-gaz" / "audio" / "hook-alignment.json"

# SCENE 0 du SCRIPT-V3, tags [..] RETIRES (non prononces), ponctuation conservee.
TEXT = ("Avril 2026. Le Senegal pompe son petrole, et l'argent afflue : huit millions de dollars CHAQUE jour. "
        "Un mois plus tard, le 22 mai... le gouvernement saute. Le president limoge son Premier ministre. "
        "Comment un pays qui s'enrichit bascule, au meme moment, dans la tourmente politique ? "
        "Pour le comprendre, il faut oublier les deux recits habituels.")


def main() -> int:
    if not AUDIO_FILE.exists():
        print(f"ERROR: audio not found: {AUDIO_FILE}"); return 2
    url = "https://api.elevenlabs.io/v1/forced-alignment"
    with open(AUDIO_FILE, "rb") as f:
        files = {"file": (AUDIO_FILE.name, f, "audio/mpeg")}
        data = {"text": TEXT}
        headers = {"xi-api-key": API_KEY}
        print("Calling forced alignment API...")
        resp = requests.post(url, files=files, data=data, headers=headers, timeout=120)
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}"); return 3
    result = resp.json()
    OUT_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    words = result.get("words", [])
    print(f"OK: {len(words)} words, loss={result.get('loss','n/a')}")
    # imprime les timestamps des mots-cles
    for w in words:
        t = (w.get("text") or w.get("word") or "").strip().lower()
        if any(k in t for k in ["saute", "comment", "mai", "bascule", "gouvernement", "millions"]):
            print(f"  {w.get('start'):6.2f}s  {w.get('text') or w.get('word')}")
    print(f"-> {OUT_FILE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
