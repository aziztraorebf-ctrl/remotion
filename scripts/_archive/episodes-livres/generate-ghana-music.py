"""Minimax Music 2.6 — 3 variantes Empire du Ghana / Sahara

Formule validee :
- Origine culturelle precise (Saharan caravan / Tuareg / Sahel)
- 1-2 instruments principaux
- Rythme precis
- Texture organique ("warm, acoustic, organic")
- Interdictions directes (no synth, no electronic)
"""
import os
import sys
import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing", file=sys.stderr)
    sys.exit(1)

OUT_DIR = ROOT / "public" / "audio" / "atlas-empire-ghana" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# 3 variantes adaptees au sujet Empire Ghana / commerce trans-saharien
VARIANTS = {
    "v1-A-caravane-tuareg": (
        "Traditional Tuareg desert music from the Sahara. Solo imzad fiddle "
        "with deep tinde drum in slow caravan rhythm. Style of Tinariwen, "
        "but acoustic only. Mysterious, vast, meditative. "
        "Warm, acoustic, organic, atmospheric. "
        "No synthesizers, no electronic sounds, no modern instruments, no electric guitar."
    ),
    "v1-B-marche-or": (
        "Medieval West African trading music. Acoustic kora and balafon "
        "melody in steady 6/8 rhythm, joined by soft hand drums. "
        "Evokes ancient gold-salt trade caravans. Style of Toumani Diabate "
        "with touches of Saharan tonality. Warm, contemplative, dignified. "
        "No synthesizers, no electronic sounds, no orchestral strings."
    ),
    "v1-C-empire-or": (
        "Epic ancient empire score. Deep ngoni lute and balafon with low "
        "dundun drums building slowly. Saharan and Mande blended. "
        "Sense of wealth, mystery, vast desert kingdoms. "
        "Style of Ali Farka Toure with ceremonial weight. "
        "Warm, acoustic, organic, regal. No synthesizers, no electronic sounds, no choir."
    ),
}


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def submit_all() -> dict:
    handles = {}
    for name, prompt in VARIANTS.items():
        log(f"submit {name} ({len(prompt)} chars)")
        handle = fal_client.submit(
            "fal-ai/minimax-music/v2.6",
            arguments={"prompt": prompt, "is_instrumental": True},
        )
        handles[name] = handle
        log(f"  request_id = {handle.request_id}")
    return handles


def wait_all(handles: dict) -> dict:
    results = {}
    for name, handle in handles.items():
        log(f"waiting {name}...")
        t0 = time.time()
        result = handle.get()
        log(f"  done in {time.time()-t0:.1f}s")
        results[name] = result
    return results


def download_all(results: dict) -> None:
    for name, result in results.items():
        url = result.get("audio", {}).get("url") or result.get("audio_url")
        if not url:
            log(f"[WARN] no audio url for {name}")
            log(f"  result keys = {list(result.keys())}")
            continue
        out_path = OUT_DIR / f"{name}.mp3"
        log(f"download {name} -> {out_path.name}")
        urllib.request.urlretrieve(url, out_path)
        size_kb = out_path.stat().st_size / 1024
        log(f"  {size_kb:.1f} KB")


def main() -> int:
    log("=" * 70)
    log("EMPIRE DU GHANA — 3 variantes musique Minimax v2.6")
    log("=" * 70)

    handles = submit_all()
    log("")
    log("All 3 jobs submitted, waiting in parallel...")
    log("")

    results = wait_all(handles)
    log("")

    download_all(results)
    log("")
    log("DONE — fichiers dans :")
    log(f"  {OUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
