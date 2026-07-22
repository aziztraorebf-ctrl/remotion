"""Generation DETERMINISTE par segment — Soudan Acte 6.

Chaque segment du manifest = 1 mp3 propre (debit naturel, AUCUNE pause interne forcee),
TRIME net en debut et fin (les silences sont ajoutes par assemble-segments.py, PAS ici).

Pipeline VOIX VIVANTE (identique a generate-narration-expressive.py) :
  1. TTS V3 : texte -> Oceane V3 (eleven_v3)
  2. STS    : audio -> GeoAfrique v2 (eleven_multilingual_sts_v2, stability 0.45)
  3. trim silences bord (ffmpeg silenceremove) -> <id>.mp3

USAGE :
  python3 gen-segments.py --manifest <json> --out-dir <dir> [--dry-run] [--only b1s1,b2s4]
"""
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[3]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

VOICE_V3_OCEANE = "CqTrL0ThT2GJVJEIiLcY"
VOICE_GEOAFRIQUE = "z3gESu49naEZW8Af2Upm"
MODEL_V3 = "eleven_v3"
MODEL_STS = "eleven_multilingual_sts_v2"
# reglages doctrine VALIDES (identiques au pipeline qui marche)
V3_SETTINGS = {"stability": 0.30, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}
STS_SETTINGS = {"stability": 0.45, "similarity_boost": 0.80, "style": 0.0}


def tts_v3(text, dest):
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_V3_OCEANE}",
        json={"text": text, "model_id": MODEL_V3, "voice_settings": V3_SETTINGS,
              "output_format": "mp3_44100_128"},
        headers={"xi-api-key": API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        timeout=180,
    )
    if r.status_code != 200:
        print(f"    TTS V3 ERR {r.status_code}: {r.text[:200]}")
        return False
    dest.write_bytes(r.content)
    return True


def sts_geo(src, dest):
    with open(src, "rb") as fh:
        r = requests.post(
            f"https://api.elevenlabs.io/v1/speech-to-speech/{VOICE_GEOAFRIQUE}",
            headers={"xi-api-key": API_KEY},
            data={"model_id": MODEL_STS, "output_format": "mp3_44100_128",
                  "voice_settings": json.dumps(STS_SETTINGS)},
            files={"audio": ("src.mp3", fh, "audio/mpeg")},
            timeout=300,
        )
    if r.status_code != 200:
        print(f"    STS ERR {r.status_code}: {r.text[:200]}")
        return False
    dest.write_bytes(r.content)
    return True


def trim_silence(src, dest):
    """Retire le silence en DEBUT et FIN (voix nette bord-a-bord).
    silenceremove start + fin (via areverse). Seuil -45dB, min 0.05s."""
    r = subprocess.run(
        ["ffmpeg", "-y", "-i", str(src),
         "-af",
         "silenceremove=start_periods=1:start_duration=0.02:start_threshold=-45dB:"
         "detection=peak,areverse,"
         "silenceremove=start_periods=1:start_duration=0.02:start_threshold=-45dB:"
         "detection=peak,areverse",
         "-c:a", "libmp3lame", "-b:a", "128k", str(dest)],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        print(f"    TRIM ERR: {r.stderr[-300:]}")
        return False
    return True


def dur(f):
    return float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(f)],
        capture_output=True, text=True).stdout.strip() or 0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", type=Path, required=True)
    ap.add_argument("--out-dir", type=Path, required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", type=str, default=None, help="ids csv a (re)generer seuls")
    args = ap.parse_args()

    data = json.loads(args.manifest.read_text())
    segs = data["segments"]
    if args.only:
        keep = set(args.only.split(","))
        segs = [s for s in segs if s["id"] in keep]

    total_chars = sum(len(s["text"]) for s in segs)
    approx_words = sum(len(s["text"].split()) for s in segs)
    approx_min = approx_words / 150
    print("=== ESTIMATION COUT ===")
    print(f"Segments   : {len(segs)}")
    print(f"Chars (V3) : {total_chars} credits")
    print(f"Duree ~    : {approx_min:.1f} min -> STS ~{round(approx_min*1000)} credits")
    print(f"TOTAL ~    : {total_chars + round(approx_min*1000)} credits  ({len(segs)*2} appels API)")
    if args.dry_run:
        print("\n[DRY-RUN] aucun appel API.")
        return

    args.out_dir.mkdir(parents=True, exist_ok=True)
    tmp = args.out_dir / "_tmp"
    tmp.mkdir(exist_ok=True)

    ok = []
    for s in segs:
        sid, text = s["id"], s["text"]
        print(f"\n[{sid}] {len(text)} chars : {text[:55]}...")
        v3f = tmp / f"{sid}_v3.mp3"
        geof = tmp / f"{sid}_geo.mp3"
        dest = args.out_dir / f"{sid}.mp3"
        if not tts_v3(text, v3f):
            print("  ABORT TTS"); sys.exit(1)
        if not sts_geo(v3f, geof):
            print("  ABORT STS"); sys.exit(1)
        raw = dur(geof)
        if not trim_silence(geof, dest):
            print("  ABORT TRIM"); sys.exit(1)
        trimmed = dur(dest)
        print(f"  OK -> {dest.name}  brut {raw:.2f}s -> trime {trimmed:.2f}s (retire {raw-trimmed:.2f}s)")
        ok.append(sid)

    # nettoyage tmp
    for f in tmp.glob("*"):
        f.unlink()
    tmp.rmdir()
    print(f"\n=== {len(ok)}/{len(segs)} segments generes ===")


if __name__ == "__main__":
    main()
