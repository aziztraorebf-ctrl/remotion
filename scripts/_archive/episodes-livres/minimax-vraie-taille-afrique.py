"""Minimax Music 2.6 - 3 variantes pour 'La Vraie Taille de l'Afrique'.

Registres :
  A - Contemplatif -> revelation : kora solo qui monte doucement
  B - Atlas geographique : balafon + kora, majestueux, grandeur
  C - Fierte africaine : plus rythmé, confiant, celebratoire
"""
import os
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import fal_client
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing", file=sys.stderr)
    sys.exit(1)

OUT_DIR = ROOT / "public" / "souverain" / "vraie-taille-afrique" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = {
    "music-A-revelation": (
        "Traditional West African kora music, contemplative and educational. "
        "Solo kora with slow balafon accents, building gradually from meditative "
        "to confident and proud. Style of Toumani Diabate. "
        "Gentle 6/8 rhythm, acoustic, warm, organic. "
        "No synthesizers, no electronic sounds, no drums except soft dundun."
    ),
    "music-B-atlas": (
        "Traditional West African music, majestic and geographic. "
        "Kora and balafon together, wide and open, evoking vast landscapes. "
        "Style of Ballake Sissoko. Slow 4/4 rhythm, stately, grand, acoustic. "
        "Feeling of discovery and wonder. "
        "No synthesizers, no electronic sounds, no drums."
    ),
    "music-C-fierte": (
        "Traditional West African celebratory music, proud and joyful. "
        "Kora with acoustic djembe, building energy, affirming and triumphant. "
        "Style of Oumou Sangare instrumental. Medium 6/8 rhythm, warm, rhythmic. "
        "Feeling of pride and revelation. "
        "No synthesizers, no electronic sounds, no orchestral strings."
    ),
}


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def generate_one(name: str, prompt: str) -> tuple[str, str | None]:
    """Generate one variant, return (name, local_path or None)."""
    log(f"Submitting {name}...")
    try:
        result = fal_client.subscribe(
            "fal-ai/minimax-music/v2.6",
            arguments={
                "prompt": prompt,
                "is_instrumental": True,
            },
            with_logs=False,
        )
        audio_url = result.get("audio", {}).get("url") or result.get("audio_file", {}).get("url")
        if not audio_url:
            log(f"[ERROR] {name} — no audio URL in response: {result}")
            return name, None

        out_path = OUT_DIR / f"{name}.mp3"
        log(f"Downloading {name} -> {out_path.name}")
        urllib.request.urlretrieve(audio_url, out_path)

        # Mesurer duree
        import subprocess
        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(out_path)],
            capture_output=True, text=True,
        )
        duration = float(probe.stdout.strip()) if probe.stdout.strip() else 0
        log(f"[OK] {name} — {duration:.1f}s — {out_path}")
        return name, str(out_path)

    except Exception as e:
        log(f"[ERROR] {name}: {e}")
        return name, None


def main():
    log("=== Minimax Music — Vraie Taille Afrique (3 variantes) ===")
    log(f"Output: {OUT_DIR}")
    log("")

    for name, prompt in VARIANTS.items():
        log(f"  {name}: {prompt[:80]}...")
    log("")

    results = {}
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(generate_one, name, prompt): name
            for name, prompt in VARIANTS.items()
        }
        for future in as_completed(futures):
            name, path = future.result()
            results[name] = path

    log("")
    log("=== Resultats ===")
    for name, path in results.items():
        status = "[OK]" if path else "[FAIL]"
        log(f"  {status} {name}: {path or 'echec'}")

    success = sum(1 for p in results.values() if p)
    log(f"\n{success}/3 variantes generees dans {OUT_DIR}")


if __name__ == "__main__":
    main()
