"""Generate 3 SFX for Atlas Tombouctou Phase 2.
B: impact stamp Tombouctou (frame 209 = 6.98s)
C: ink draw caravane route (12.82s -> 15s)
D: thud cartouche 25 000 (16.56s)
"""
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-tombouctou" / "sfx"
OUT_DIR.mkdir(parents=True, exist_ok=True)

SFX_DEFS = [
    {
        "name": "B-tombouctou-impact",
        "prompt": "Short impactful stamp sound, like a wax seal being pressed firmly on parchment, deep low frequency thud with a subtle metallic ring, 0.6 seconds, dramatic and authoritative",
        "duration": 0.8,
        "prompt_influence": 0.5,
    },
    {
        "name": "C-caravane-ink-draw",
        "prompt": "Soft ink quill drawing on parchment, smooth ink flow sound with a gentle scratching texture, slow steady pace, 2 seconds, ASMR-like and meditative",
        "duration": 2.2,
        "prompt_influence": 0.4,
    },
    {
        "name": "D-cartouche-thud",
        "prompt": "Wooden stamp thud landing softly on a desk, deep warm bass with a quick decay, suggesting a final declaration or announcement, 0.5 seconds",
        "duration": 0.7,
        "prompt_influence": 0.5,
    },
]


def generate(spec: dict) -> bool:
    url = "https://api.elevenlabs.io/v1/sound-generation"
    payload = {
        "text": spec["prompt"],
        "duration_seconds": spec["duration"],
        "prompt_influence": spec["prompt_influence"],
        "model_id": "eleven_text_to_sound_v2",
    }
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

    print(f"Generating: {spec['name']} ({spec['duration']}s)")
    r = requests.post(url, json=payload, headers=headers, timeout=120)
    if r.status_code != 200:
        print(f"  ERROR {r.status_code}: {r.text[:300]}")
        return False

    out_file = OUT_DIR / f"{spec['name']}.mp3"
    out_file.write_bytes(r.content)
    size_kb = len(r.content) / 1024
    print(f"  OK {out_file} ({size_kb:.1f} KB)")
    return True


def main() -> int:
    print(f"Generating {len(SFX_DEFS)} SFX")
    print(f"Output dir: {OUT_DIR}")
    print()
    fails = 0
    for spec in SFX_DEFS:
        if not generate(spec):
            fails += 1
    print(f"\n{len(SFX_DEFS) - fails}/{len(SFX_DEFS)} OK")
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
