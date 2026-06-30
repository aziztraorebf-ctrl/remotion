#!/usr/bin/env python3
"""Generate the 4 missing SFX for the cacao-chocolat short via ElevenLabs Sound Effects API.
Writes MP3 to public/souverain/cacao-chocolat-short/audio/sfx/.
Not TTS (no French TTS rules) — pure sound-design prompts in English, sober/premium.
"""
import os
import sys
import requests
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
for line in (ROOT / ".env").read_text().splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        os.environ["ELEVENLABS_API_KEY"] = line.split("=", 1)[1].strip()

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

URL = "https://api.elevenlabs.io/v1/sound-generation"
OUT_DIR = ROOT / "public" / "souverain" / "cacao-chocolat-short" / "audio" / "sfx"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (filename, prompt, duration_seconds, prompt_influence)
SFX = [
    (
        "sfx-pod-crack.mp3",
        "A ripe cacao pod splitting open, soft organic crack, natural woody texture, "
        "gentle, short, no music",
        0.8,
        0.5,
    ),
    (
        "sfx-flag-unfold.mp3",
        "Fabric cloth gently unfolding and settling, soft and ceremonial, "
        "short, no music",
        1.0,
        0.4,
    ),
    (
        "sfx-industrial-sketch.mp3",
        "Metallic ruler sliding on drafting paper drawing precise lines, "
        "dry rhythmic technical sound, short, no music",
        1.5,
        0.5,
    ),
    (
        "sfx-flux-exit.mp3",
        "Thin liquid stream flowing out of frame, subtle airy whoosh, "
        "soft, short, no music",
        1.0,
        0.4,
    ),
]


def generate(filename, prompt, duration, influence):
    payload = {"text": prompt, "duration_seconds": duration, "prompt_influence": influence}
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    print(f"-> generating {filename} ({duration}s) ...")
    r = requests.post(URL, json=payload, headers=headers, timeout=120)
    if r.status_code != 200:
        print(f"  ERROR {r.status_code}: {r.text[:300]}")
        return False
    out = OUT_DIR / filename
    out.write_bytes(r.content)
    print(f"  OK -> {out} ({len(r.content)} bytes)")
    return True


if __name__ == "__main__":
    ok = all(generate(*s) for s in SFX)
    sys.exit(0 if ok else 1)
