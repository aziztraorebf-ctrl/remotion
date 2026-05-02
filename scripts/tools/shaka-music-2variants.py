"""Atlas Shaka Zulu — Minimax Music v2.6: 2 variants (isicathamiya + ingoma).

Parallel submit. Logs cost. No semantic retry.
"""
import os
import sys
import time
import json
import urllib.request
import subprocess
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing", file=sys.stderr)
    sys.exit(1)

import fal_client

OUT_DIR = ROOT / "public/atlas-shaka-zulu/audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)
COST_LOG = ROOT / "out/shaka-cost-log.txt"

VARIANTS = {
    "music-isicathamiya": (
        "Traditional Zulu a cappella male choir from South Africa, soft polyphonic harmonies, "
        "deep bass voices and tenor voices interweaving, slow ceremonial pace, "
        "ancestral and contemplative mood, evokes nostalgia and memory, "
        "style of Ladysmith Black Mambazo. Warm, organic, human voices only. "
        "No drums, no percussion, no synthesizers, no electronic sounds, no instruments."
    ),
    "music-ingoma": (
        "Traditional Zulu war drumming from South Africa, deep djembe and dundun drums, "
        "rhythmic warrior stomping pattern in 4/4, low male chanting voices in distance, "
        "building ceremonial tension, earthy and tribal mood, percussion-focused. "
        "Style of traditional ingoma war dance music. Acoustic, organic, raw. "
        "No melody, no synthesizers, no electronic sounds, no modern instruments, no orchestral strings."
    ),
}


def log_cost(msg: str) -> None:
    COST_LOG.parent.mkdir(parents=True, exist_ok=True)
    with COST_LOG.open("a") as f:
        f.write(msg + "\n")
    print(msg, flush=True)


def probe_duration(path: Path) -> float:
    try:
        probe = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
            capture_output=True, text=True,
        )
        return float(probe.stdout.strip())
    except Exception:
        return -1.0


def main() -> int:
    t0 = time.time()
    handles = {}
    for name, prompt in VARIANTS.items():
        ts = time.strftime("%H:%M:%S")
        log_cost(f"[{ts}] [minimax] [{name}] [submit] [cumul=running] [START {len(prompt)} chars]")
        try:
            handle = fal_client.submit(
                "fal-ai/minimax-music/v2.6",
                arguments={"prompt": prompt, "is_instrumental": True},
            )
            handles[name] = handle
            print(f"  request_id = {handle.request_id}")
        except Exception as e:
            log_cost(f"[{time.strftime('%H:%M:%S')}] [minimax] [{name}] [$0.00] [cumul=running] [FAIL submit: {e}]")

    for name, handle in handles.items():
        print(f"waiting {name}...")
        try:
            result = handle.get()
        except Exception as e:
            log_cost(f"[{time.strftime('%H:%M:%S')}] [minimax] [{name}] [$0.10] [cumul=running] [FAIL get: {e}]")
            continue
        audio = result.get("audio") if isinstance(result, dict) else None
        if not audio or not audio.get("url"):
            log_cost(f"[{time.strftime('%H:%M:%S')}] [minimax] [{name}] [$0.10] [cumul=running] [FAIL no audio.url]")
            continue
        out = OUT_DIR / f"{name}.mp3"
        urllib.request.urlretrieve(audio["url"], out)
        size_mb = out.stat().st_size / (1024 * 1024)
        dur = probe_duration(out)
        log_cost(f"[{time.strftime('%H:%M:%S')}] [minimax] [{name}] [$0.10] [cumul=running] [OK {size_mb:.2f}MB dur={dur:.1f}s]")

        meta_path = OUT_DIR / f"{name}.meta.json"
        meta_path.write_text(json.dumps({
            "request_id": handle.request_id,
            "endpoint": "fal-ai/minimax-music/v2.6",
            "is_instrumental": True,
            "duration_s": dur,
            "size_mb": round(size_mb, 2),
            "audio_url": audio["url"],
            "prompt": VARIANTS[name],
            "cost_estimate_usd": 0.10,
        }, indent=2))

    log_cost(f"[{time.strftime('%H:%M:%S')}] [minimax] [BATCH] [TOTAL] [cumul=$0.80] [DONE in {int(time.time()-t0)}s]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
