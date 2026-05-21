"""Generate 1 music variant for Mansa Moussa via Minimax v2.6 on fal.ai.
Variant C - Mande Contemplatif (canonique Atlas V8).
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

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = [
    {
        "name": "C-mande-contemplatif",
        "prompt": (
            "Traditional Mande griot music from Mali, 14th century empire era. "
            "Solo kora with slow balafon accents. Style of Toumani Diabate. "
            "Gentle 6/8 rhythm, acoustic, warm, organic, meditative, regal. "
            "Building slight intensity for an emperor's pilgrimage narrative. "
            "No synthesizers, no electronic sounds, no drums except soft dundun."
        ),
    },
]


def submit_job(prompt: str) -> tuple[str, str, str]:
    """Returns (request_id, status_url, response_url)."""
    url = "https://queue.fal.run/fal-ai/minimax-music/v2.6"
    payload = {"prompt": prompt, "is_instrumental": True}
    headers = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}
    r = requests.post(url, json=payload, headers=headers, timeout=60)
    if r.status_code not in (200, 201, 202):
        print(f"  Submit ERROR {r.status_code}: {r.text[:300]}")
        return "", "", ""
    data = r.json()
    return data.get("request_id", ""), data.get("status_url", ""), data.get("response_url", "")


def poll_and_download(name: str, request_id: str, status_url: str, result_url: str, max_wait: int = 600) -> bool:
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
                return False
        time.sleep(8)
    print(f"  TIMEOUT {name}")
    return False


def main() -> int:
    print(f"Generating {len(VARIANTS)} music variant via Minimax v2.6")
    print(f"Estimated cost: ~$0.10")
    print()
    jobs = {}
    for v in VARIANTS:
        print(f"Submitting: {v['name']}")
        rid, status_url, result_url = submit_job(v["prompt"])
        if rid:
            jobs[v["name"]] = (rid, status_url, result_url)
            print(f"  request_id: {rid}")
            print(f"  status_url: {status_url}")
    print(f"\n{len(jobs)}/{len(VARIANTS)} submitted")
    fails = 0
    for v in VARIANTS:
        name = v["name"]
        if name not in jobs:
            fails += 1
            continue
        print(f"\n=== {name} ===")
        rid, status_url, result_url = jobs[name]
        if not poll_and_download(name, rid, status_url, result_url):
            fails += 1
    print(f"\n{len(VARIANTS) - fails}/{len(VARIANTS)} OK")
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
