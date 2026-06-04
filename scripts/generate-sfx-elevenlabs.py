#!/usr/bin/env python3
"""Generate sound effects via ElevenLabs Sound Effects API.

Usage: python3 scripts/generate-sfx-elevenlabs.py
Reads ELEVENLABS_API_KEY from .env. Writes MP3 to public/_shared/sfx/.
Not TTS (no French TTS rules apply) — pure sound design prompts in English.
"""
import os
import sys
import requests
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# load .env
for line in (ROOT / ".env").read_text().splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        os.environ["ELEVENLABS_API_KEY"] = line.split("=", 1)[1].strip()

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

URL = "https://api.elevenlabs.io/v1/sound-generation"
OUT_DIR = ROOT / "public" / "_shared" / "sfx"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (filename, prompt, duration_seconds, prompt_influence)
SFX = [
    (
        "sfx-clash-impact.mp3",
        "Two medieval armies colliding, metal weapons and shields clashing together, "
        "single powerful impact, short, cinematic, dry, no music",
        1.4,
        0.5,
    ),
    (
        "sfx-army-charge.mp3",
        "Brief war cry and rushing footsteps of soldiers charging into battle, "
        "short energetic burst, cinematic, no music",
        2.0,
        0.4,
    ),
]


def generate(filename, prompt, duration, influence):
    payload = {
        "text": prompt,
        "duration_seconds": duration,
        "prompt_influence": influence,
    }
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
