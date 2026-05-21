"""Poll existing music jobs from fal.ai (re-poll request_ids submitted earlier)."""
import os
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

FAL_KEY = os.getenv("FAL_KEY")

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-tombouctou" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

JOBS = {
    "A-sahara-ambient": "019dd6f6-3d85-78e1-ab20-7563cdd51ff7",
    "B-cesar-epique": "019dd6f6-3e4c-7153-bbef-be5889546c6e",
    "C-mande-contemplatif": "019dd6f6-3f0c-7911-bf8e-404a0cfc84bd",
}


def poll(name: str, request_id: str, max_wait: int = 300) -> bool:
    status_url = f"https://queue.fal.run/fal-ai/minimax-music/requests/{request_id}/status"
    result_url = f"https://queue.fal.run/fal-ai/minimax-music/requests/{request_id}"
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
        else:
            print(f"  [{elapsed}s] {name} -> status check failed {r.status_code}: {r.text[:200]}")
        time.sleep(10)
    print(f"  TIMEOUT {name}")
    return False


def main() -> int:
    fails = 0
    for name, rid in JOBS.items():
        print(f"\nPolling {name} ({rid})")
        if not poll(name, rid):
            fails += 1
    print(f"\n{len(JOBS) - fails}/{len(JOBS)} OK")
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
