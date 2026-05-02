"""Generate 3 background music variants via Minimax on fal.ai for Atlas Tombouctou.
Variant A: Sahara ambient cinematic
Variant B: Cesar epique avec percussions
Variant C: Mande contemplatif kora medieval
"""
import os
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

FAL_KEY = os.getenv("FAL_KEY")
if not FAL_KEY:
    print("ERROR: FAL_KEY missing")
    sys.exit(1)

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-tombouctou" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = [
    {
        "name": "A-sahara-ambient",
        "prompt": "Ambient cinematic soundscape evoking the vast Sahara desert at dawn, subtle West African percussion (djembe brushed lightly), slow drone with desert wind textures, deep low strings, no vocals, contemplative and majestic, 30 seconds",
    },
    {
        "name": "B-cesar-epique",
        "prompt": "Epic cinematic crescendo building over 30 seconds, Mande percussion ensemble (djembe, dunun), tribal African drums building intensity, deep cinematic strings rising, no vocals, dramatic and revelatory, suitable for documentary about ancient African civilization, climax around 25 seconds",
    },
    {
        "name": "C-mande-contemplatif",
        "prompt": "Solo kora (West African 21-string harp) playing a contemplative slow melody, traditional Mande griot music, soft fingerpicking style, intimate and ancient feel, no vocals, evoking medieval Mali Empire and Timbuktu library scholars, 30 seconds",
    },
]


def submit_job(prompt: str) -> str:
    """Submit Minimax music generation job to fal.ai. Returns request_id."""
    url = "https://queue.fal.run/fal-ai/minimax-music"
    payload = {
        "prompt": prompt,
    }
    headers = {
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json",
    }
    r = requests.post(url, json=payload, headers=headers, timeout=60)
    if r.status_code not in (200, 201, 202):
        print(f"  Submit ERROR {r.status_code}: {r.text[:300]}")
        return ""
    data = r.json()
    return data.get("request_id", "")


def poll_result(request_id: str, max_wait: int = 180) -> str | None:
    """Poll fal.ai queue for result. Returns audio URL when done."""
    status_url = f"https://queue.fal.run/fal-ai/minimax-music/requests/{request_id}/status"
    result_url = f"https://queue.fal.run/fal-ai/minimax-music/requests/{request_id}"
    headers = {"Authorization": f"Key {FAL_KEY}"}
    start = time.time()
    while time.time() - start < max_wait:
        r = requests.get(status_url, headers=headers, timeout=30)
        if r.status_code == 200:
            status = r.json().get("status", "")
            if status == "COMPLETED":
                rr = requests.get(result_url, headers=headers, timeout=30)
                if rr.status_code == 200:
                    result = rr.json()
                    audio = result.get("audio", {})
                    return audio.get("url", "")
            elif status in ("IN_QUEUE", "IN_PROGRESS"):
                print(f"  ...{status} ({int(time.time() - start)}s)")
        time.sleep(5)
    print(f"  TIMEOUT after {max_wait}s")
    return None


def download(url: str, out_file: Path) -> bool:
    r = requests.get(url, timeout=120)
    if r.status_code != 200:
        print(f"  Download ERROR {r.status_code}")
        return False
    out_file.write_bytes(r.content)
    size_kb = len(r.content) / 1024
    print(f"  OK {out_file} ({size_kb:.1f} KB)")
    return True


def main() -> int:
    print(f"Generating {len(VARIANTS)} music variants via Minimax/fal.ai")
    print(f"Estimated cost: ~$0.30 ($0.10/variant)")
    print(f"Output dir: {OUT_DIR}")
    print()

    # Submit all jobs
    job_ids = {}
    for v in VARIANTS:
        print(f"Submitting: {v['name']}")
        rid = submit_job(v["prompt"])
        if rid:
            job_ids[v["name"]] = rid
            print(f"  request_id: {rid}")
        else:
            print(f"  FAILED to submit")

    print(f"\n{len(job_ids)}/{len(VARIANTS)} submitted. Polling...\n")

    fails = 0
    for v in VARIANTS:
        name = v["name"]
        if name not in job_ids:
            fails += 1
            continue
        print(f"Polling: {name}")
        audio_url = poll_result(job_ids[name])
        if audio_url:
            ext = audio_url.split(".")[-1].split("?")[0] or "mp3"
            out_file = OUT_DIR / f"{name}.{ext}"
            if not download(audio_url, out_file):
                fails += 1
        else:
            print(f"  FAILED")
            fails += 1

    print(f"\n{len(VARIANTS) - fails}/{len(VARIANTS)} variants OK")
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
