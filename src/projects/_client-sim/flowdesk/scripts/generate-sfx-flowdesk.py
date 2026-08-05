#!/usr/bin/env python3
"""Generate Flowdesk panel-1 notification SFX via ElevenLabs Sound Effects API.

Usage: python3 src/projects/_client-sim/flowdesk/scripts/generate-sfx-flowdesk.py
Reads ELEVENLABS_API_KEY from .env. Writes MP3 to
src/projects/_client-sim/flowdesk/audio/sfx/ (then copy to public/ before use in Remotion).
Not TTS (no French TTS rules apply) — pure sound design prompts in English.
"""
import os
import sys
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[5]
for line in (ROOT / ".env").read_text().splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        os.environ["ELEVENLABS_API_KEY"] = line.split("=", 1)[1].strip()

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

URL = "https://api.elevenlabs.io/v1/sound-generation"
OUT_DIR = ROOT / "src/projects/_client-sim/flowdesk/audio/sfx"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (filename, prompt, duration_seconds, prompt_influence)
SFX = [
    (
        "sfx-notif-email.mp3",
        "Single soft email notification chime, gentle bell ding, clean and short, "
        "modern UI sound, no reverb, no music",
        0.6,
        0.5,
    ),
    (
        "sfx-notif-slack.mp3",
        "Quick two-tone messaging app notification pop, playful knock sound, "
        "short digital blip, modern collaboration app, no music",
        0.5,
        0.5,
    ),
    (
        "sfx-notif-tableur.mp3",
        "Short mechanical spreadsheet cell click, subtle digital tick, "
        "crisp and dry, no music",
        0.5,
        0.5,
    ),
    (
        "sfx-notif-generic-soft.mp3",
        "Soft generic app notification pop, short subtle digital blip, "
        "clean UI sound, low key, no music",
        0.5,
        0.5,
    ),
    (
        "sfx-notif-generic-sharp.mp3",
        "Sharp short digital alert ping, urgent notification sound, "
        "crisp attention-grabbing blip, no music",
        0.5,
        0.5,
    ),
    (
        "sfx-tension-bed-loop.mp3",
        "Low tense ambient drone, subtle rising anxious hum, corporate stress texture, "
        "no percussion, no melody, loopable, cinematic underscore only",
        6.0,
        0.35,
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
    ok = all(generate(*s) for s in SFX if not (OUT_DIR / s[0]).exists())
    sys.exit(0 if ok else 1)
