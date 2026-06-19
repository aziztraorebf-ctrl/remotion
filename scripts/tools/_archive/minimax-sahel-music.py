"""Minimax Music 2.6 - 4 variantes musique War-Map Sahel AES.

Ton : documentaire geopolitique grave, tension Sahel, dignite.
PAS Mande medieval, PAS drone monotone. Doit suivre la narration
sans l'enterrer et pouvoir tourner en boucle.
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

OUT_DIR = ROOT / "public" / "_shared" / "audio" / "sahel-warmap" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = {
    "music-A-ostinato-grave": (
        "Modern geopolitical documentary score. Slow hypnotic ostinato on low "
        "strings and muted piano, with a sparse ngoni motif on top. Style of a "
        "tense investigative documentary about the Sahel. Steady 4/4 at 70 BPM, "
        "subtle forward momentum. Grave, restrained, serious, dignified. "
        "No synthesizers, no electronic beats, no orchestral swells, no vocals."
    ),
    "music-B-tension-desertique": (
        "Sahelian documentary film score. Deep frame drum pulse and acoustic bass "
        "under a sparse desert guitar line and distant calabash. Warm, arid, tense, "
        "grounded. Slow 6/8 at 66 BPM, meditative but uneasy. "
        "No synthesizers, no electronic elements, no vocals, no upbeat energy."
    ),
    "music-C-cordes-minimales": (
        "Minimal contemporary documentary score. Sustained low cello and viola with "
        "a single repeating kora-like phrase, very sparse. Solemn, introspective, "
        "weight underneath. Slow 4/4 at 60 BPM. "
        "No synthesizers, no percussion, no electronic sounds, no vocals."
    ),
    "music-D-montee-maitrisee": (
        "Restrained cinematic documentary score about modern African geopolitics. "
        "Pulsing low piano and bowed bass building slowly, with a mournful ngoni "
        "melody. Tension that grows then settles. Slow 4/4 at 72 BPM. "
        "No synthesizers, no electronic drums, no triumphant brass, no vocals."
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
        log(f"[ERROR] {name}: no audio.url in result: {result}")
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
    log("=== Minimax Music 2.6 - War-Map Sahel (4 variantes) ===")
    t_start = time.time()
    handles = submit_all()
    log(f"all 4 jobs submitted in {time.time()-t_start:.1f}s")
    log("waiting (typique ~4min par job)...")

    results = wait_all(handles)
    log(f"all jobs done in {time.time()-t_start:.1f}s total")

    log("--- download + probe ---")
    completed = []
    for name, result in results.items():
        path = download(name, result)
        if path:
            dur = probe_duration(path)
            log(f"  {name}: {dur:.1f}s")
            completed.append((name, dur))

    log("=== RESULTATS ===")
    for name, dur in completed:
        log(f"  {name}: {dur:.0f}s -> {OUT_DIR / (name + '.mp3')}")
    log(f"Total elapsed: {time.time()-t_start:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
