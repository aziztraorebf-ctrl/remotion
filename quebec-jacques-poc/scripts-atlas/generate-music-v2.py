"""Generate 3 music variants via Minimax v2.6 on fal.ai.
Following formula validated 2026-04-22 (Sonjata session 8):
- Artist-specific reference
- 1-2 main instruments
- Explicit rhythm (6/8)
- Organic texture
- "No synthesizers, no electronic sounds"
- Specific cultural origin
"""
import os
import sys
import time
import requests
from pathlib import Path
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
        "prompt": (
            "Traditional Mande music from Mali, 13th century era. "
            "Solo ney flute with subtle dundun bass drum, warm acoustic atmosphere. "
            "Style of Bassekou Kouyate. Slow 4/4 rhythm, contemplative, vast desert dawn. "
            "Warm, acoustic, organic, sparse. "
            "No synthesizers, no electronic sounds, no orchestral strings."
        ),
    },
    {
        "name": "B-cesar-epique",
        "prompt": (
            "Traditional Mande music from Mali, building intensity. "
            "Acoustic djembe and dundun drums in slow 6/8 rhythm with kora melody rising. "
            "Style of Sidiki Diabate. Building from contemplative to majestic, climactic. "
            "Warm, acoustic, organic, royal. "
            "No synthesizers, no electronic sounds, no orchestral strings."
        ),
    },
    {
        "name": "C-mande-contemplatif",
        "prompt": (
            "Traditional Mande griot music from Mali, 13th century empire era. "
            "Solo kora with slow balafon accents. Style of Toumani Diabate. "
            "Gentle 6/8 rhythm, acoustic, warm, organic, meditative. "
            "No synthesizers, no electronic sounds, no drums except soft dundun."
        ),
    },
]


def submit_job(prompt: str) -> str:
    url = "https://queue.fal.run/fal-ai/minimax-music/v2.6"
    payload = {
        "prompt": prompt,
        "is_instrumental": True,
    }
    headers = {
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json",
    }
    r = requests.post(url, json=payload, headers=headers, timeout=60)
    if r.status_code not in (200, 201, 202):
        print(f"  Submit ERROR {r.status_code}: {r.text[:300]}")
        return ""
    return r.json().get("request_id", "")


def poll_and_download(name: str, request_id: str, max_wait: int = 600) -> bool:
    status_url = f"https://queue.fal.run/fal-ai/minimax-music/v2.6/requests/{request_id}/status"
    result_url = f"https://queue.fal.run/fal-ai/minimax-music/v2.6/requests/{request_id}"
    headers = {"Authorization": f"Key {FAL_KEY}"}
    start = time.time()
    while time.time() - start < max_wait:
        r = requests.get(status_url, headers=headers, timeout=30)
        elapsed = int(time.time() - start)
        if r.status_code == 200:
            status = r.json().get("status", "")
            print(f"  [{elapsed}s] {name} -> {status}")
            if status == "COMPLETED":
                rr = requests.get(result_url, headers=headers, timeout=30)
                if rr.status_code == 200:
                    audio = rr.json().get("audio", {})
                    url = audio.get("url", "")
                    if url:
                        ext = url.split(".")[-1].split("?")[0] or "mp3"
                        out_file = OUT_DIR / f"{name}.{ext}"
                        rd = requests.get(url, timeout=120)
                        if rd.status_code == 200:
                            out_file.write_bytes(rd.content)
                            print(f"  OK saved {out_file} ({len(rd.content)/1024:.1f} KB)")
                            return True
                    else:
                        print(f"  Result has no audio URL: {rr.text[:300]}")
                return False
        else:
            print(f"  [{elapsed}s] {name} -> status check failed {r.status_code}: {r.text[:200]}")
        time.sleep(8)
    print(f"  TIMEOUT {name}")
    return False


def main() -> int:
    print(f"Generating {len(VARIANTS)} music variants via Minimax v2.6")
    print(f"Estimated cost: ~$0.30 ($0.10/variant)")
    print()

    job_ids = {}
    for v in VARIANTS:
        print(f"Submitting: {v['name']}")
        rid = submit_job(v["prompt"])
        if rid:
            job_ids[v["name"]] = rid
            print(f"  request_id: {rid}")

    print(f"\n{len(job_ids)}/{len(VARIANTS)} submitted")
    print()

    fails = 0
    for v in VARIANTS:
        name = v["name"]
        if name not in job_ids:
            fails += 1
            continue
        print(f"\n=== {name} ===")
        if not poll_and_download(name, job_ids[name]):
            fails += 1

    print(f"\n{len(VARIANTS) - fails}/{len(VARIANTS)} OK")
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
