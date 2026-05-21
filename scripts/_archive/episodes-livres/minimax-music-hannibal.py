"""Minimax Music 2.6 - 3 variantes Hannibal / Méditerranée antique.

Registre : militaire punique, traversée montagne, tension dramatique.
Influences : musique méditerranéenne antique, percussions de guerre.
Formule validée minimax.md : artiste nommé + 1-2 instruments + rythme précis
+ texture organique + interdictions directes.
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

OUT_DIR = ROOT / "public" / "hannibal" / "audio" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = {
    "v1-A-marche-punique": (
        "Ancient Carthaginian military march, 3rd century BC Mediterranean. "
        "Solo aulos (double flute) with slow acoustic drum cadence. "
        "Style of ancient North African military music. "
        "Steady 4/4 march rhythm, earthy, tense, determined, sparse. "
        "No synthesizers, no electronic sounds, no modern instruments, no strings orchestra."
    ),
    "v1-B-alpes-tension": (
        "Ancient Mediterranean music evoking mountain crossing and danger. "
        "Solo frame drum with deep acoustic bass drum, joined by sparse aulos flute. "
        "Slow 3/4 rhythm, building tension, dark, cold, epic, organic. "
        "Style of ancient Berber and Iberian folk music. "
        "No synthesizers, no electronic sounds, no choir, no orchestral strings."
    ),
    "v1-C-victoire-carthage": (
        "Triumphant ancient Carthaginian military music, Mediterranean antiquity. "
        "Acoustic lyre with tympanum percussion in powerful 6/8 rhythm. "
        "Style of ancient Phoenician ceremonial music. "
        "Majestic, heroic, warm, organic, acoustic. "
        "No synthesizers, no electronic sounds, no modern drums, no orchestral brass."
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


def download(name: str, result: dict) -> Path:
    audio = result.get("audio") if isinstance(result, dict) else None
    if not audio or not audio.get("url"):
        log(f"[ERROR] {name}: no audio.url")
        return None
    out = OUT_DIR / f"{name}.mp3"
    urllib.request.urlretrieve(audio["url"], out)
    size_mb = out.stat().st_size / (1024 * 1024)
    log(f"saved {name}.mp3 ({size_mb:.2f} MB)")
    return out


def probe_duration(path: Path) -> float:
    import subprocess
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True,
    )
    return float(probe.stdout.strip()) if probe.returncode == 0 else -1.0


def main() -> int:
    log("=== Minimax Music 2.6 - 3 variantes Hannibal parallele ===")
    t_start = time.time()
    handles = submit_all()
    log(f"all 3 jobs submitted in {time.time()-t_start:.1f}s")
    log("waiting (typical ~4min per job)...")

    results = wait_all(handles)
    log(f"all jobs done in {time.time()-t_start:.1f}s total")

    log("--- downloading + probing ---")
    for name, result in results.items():
        path = download(name, result)
        if path:
            dur = probe_duration(path)
            log(f"  {name}: {dur:.1f}s")

    log(f"=== COMPLETE in {time.time()-t_start:.1f}s ===")
    log(f"fichiers dans: {OUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
