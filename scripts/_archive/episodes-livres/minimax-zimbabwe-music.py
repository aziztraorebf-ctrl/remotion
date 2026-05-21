"""Minimax Music 2.6 - 3 variantes Zimbabwe Lithium.

Registre : tension geopolitique, culture Shona/Ndebele Zimbabwe.
NE PAS reutiliser prompts Mande/griot (biais de recence Sonjata).
Formule validee minimax.md : artiste nomme + 1-2 instruments + rythme precis
+ texture organique + interdictions directes.
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

OUT_DIR = ROOT / "public" / "souverain" / "zimbabwe-lithium" / "audio" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = {
    "music-A-contemplatif": (
        "Traditional Southern African music, Zimbabwe Shona culture. "
        "Solo mbira (thumb piano) with sparse marimba accents. "
        "Slow contemplative rhythm, earthy, organic, traditional. "
        "Style of Stella Chiweshe. Meditative, tense undertone, acoustic. "
        "No synthesizers, no electronic sounds, no orchestral strings, no percussion ensemble."
    ),
    "music-B-geopolitique": (
        "Traditional Southern African music, Zimbabwe Ndebele and Shona tradition. "
        "Mbira dzavadzimu with slow ngoma drum accents. "
        "Deep, solemn, deliberate 4/4 rhythm. Style of Forward Kwenda. "
        "Dark, resolute, dignified, acoustic, organic. "
        "No synthesizers, no electronic sounds, no choir, no modern instruments."
    ),
    "music-C-tension": (
        "Traditional Zimbabwean music building tension. "
        "Solo mbira with marimba and soft hosho rattle. "
        "Rhythm slowly intensifying, ominous, ancestral, grounded. "
        "Style of Dumisani Maraire. Acoustic, earthy, building, organic. "
        "No synthesizers, no electronic sounds, no orchestral brass, no modern drums."
    ),
}


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def generate_one(name: str, prompt: str) -> tuple:
    """Generate one variant, return (name, local_path or None)."""
    log(f"Submitting {name} ({len(prompt)} chars)...")
    try:
        result = fal_client.subscribe(
            "fal-ai/minimax-music/v2.6",
            arguments={
                "prompt": prompt,
                "is_instrumental": True,
            },
            with_logs=False,
        )
        audio_url = (
            result.get("audio", {}).get("url")
            or result.get("audio_file", {}).get("url")
        )
        if not audio_url:
            log(f"[ERROR] {name} — no audio URL in response: {result}")
            return name, None

        out_path = OUT_DIR / f"{name}.mp3"
        log(f"Downloading {name} -> {out_path.name}")
        urllib.request.urlretrieve(audio_url, out_path)

        import subprocess
        probe = subprocess.run(
            [
                "ffprobe", "-v", "quiet",
                "-show_entries", "format=duration",
                "-of", "csv=p=0",
                str(out_path),
            ],
            capture_output=True,
            text=True,
        )
        duration = float(probe.stdout.strip()) if probe.stdout.strip() else 0
        size_mb = out_path.stat().st_size / (1024 * 1024)
        log(f"[OK] {name} — {duration:.1f}s — {size_mb:.2f} MB — {out_path}")
        return name, str(out_path)

    except Exception as e:
        log(f"[ERROR] {name}: {e}")
        return name, None


def main():
    log("=== Minimax Music 2.6 — Zimbabwe Lithium (3 variantes parallele) ===")
    log(f"Output: {OUT_DIR}")
    log("Budget : ~$0.30 (3 x $0.10)")
    log("")
    for name, prompt in VARIANTS.items():
        log(f"  {name}: {prompt[:80]}...")
    log("")

    t_start = time.time()
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
    log(f"=== Resultats ({time.time()-t_start:.0f}s) ===")
    for name, path in results.items():
        status = "[OK]" if path else "[FAIL]"
        log(f"  {status} {name}: {path or 'echec'}")

    success = sum(1 for p in results.values() if p)
    log(f"\n{success}/3 variantes generees dans {OUT_DIR}")
    return 0 if success > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
