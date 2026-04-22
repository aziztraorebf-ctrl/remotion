"""Minimax Music 2.6 - generate 3 variantes Mande en parallele.

Formule validee (key-learnings.md L4) :
- Nommer un artiste specifique
- 1-2 instruments principaux
- Rythme precis (6/8, BPM)
- Texture organique ("warm, acoustic, organic")
- Interdictions directes ("No synthesizers, no electronic sounds")
- Origine culturelle precise ("Mande from Mali")
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

OUT_DIR = ROOT / "sonjata-papercraft" / "audio" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = {
    "v2-A-griot-intime": (
        "Traditional Mande griot music from Mali, 13th century empire era. "
        "Solo kora with slow balafon accents. Style of Toumani Diabate. "
        "Gentle 6/8 rhythm, acoustic, warm, organic, meditative. "
        "No synthesizers, no electronic sounds, no drums except soft dundun."
    ),
    "v2-B-griot-royal": (
        "Traditional Mande griot music from Mali. Solo kora with deep balafon "
        "melody, joined by acoustic djembe and dundun drums in slow 6/8 rhythm. "
        "Style of Sidiki Diabate. Building from contemplative to majestic. "
        "Warm, acoustic, organic, royal. No synthesizers, no electronic sounds, "
        "no orchestral strings."
    ),
    "v2-C-griot-guerrier": (
        "Traditional Mande warrior music from Mali, 13th century. Acoustic "
        "djembe and dundun drums in powerful 6/8 rhythm, joined by balafon "
        "melody. Style of Neba Solo. Tense, earthy, tribal, triumphant. "
        "No synthesizers, no electronic sounds, no modern instruments."
    ),
}


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def submit_all() -> dict:
    """Submit 3 jobs, return dict name -> request_id."""
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
    """Wait for all handles, return dict name -> result."""
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
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture_output=True, text=True,
    )
    return float(probe.stdout.strip()) if probe.returncode == 0 else -1.0


def main() -> int:
    log("=== Minimax Music 2.6 - 3 variantes Mande parallele ===")
    t_start = time.time()
    handles = submit_all()
    log(f"all 3 jobs submitted in {time.time()-t_start:.1f}s")
    log("waiting for all completions (typical ~4min per job)...")

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
