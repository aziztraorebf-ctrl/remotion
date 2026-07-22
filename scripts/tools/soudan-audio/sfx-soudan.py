#!/usr/bin/env python3
"""7 SFX ponctuels mid-form Soudan via ElevenLabs Sound Effects API.
Registre "renseignement/enquete" : sons MATS, secs, PAS hollywoodiens. Chacun <2s.
Ecrit dans le repo PRINCIPAL (public partage).
"""
import os
import sys
import requests
from pathlib import Path

MAIN = Path("/Users/clawdbot/Workspace/remotion")
for line in (MAIN / ".env").read_text().splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        os.environ["ELEVENLABS_API_KEY"] = line.split("=", 1)[1].strip()

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

URL = "https://api.elevenlabs.io/v1/sound-generation"
OUT_DIR = MAIN / "public" / "_shared" / "sfx" / "soudan"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (filename, prompt, duration_seconds, prompt_influence)
SFX = [
    ("sfx-soudan-mines.mp3",
     "A single soft metallic ting, like a small gold ingot tapped once, dry, close, "
     "muted resonance, no reverb tail, no music",
     1.0, 0.5),
    ("sfx-soudan-fracture.mp3",
     "A dry cracking split like stone or dry earth breaking, followed by a deep sub bass drop, "
     "short, ominous, no music, no debris",
     1.6, 0.5),
    ("sfx-soudan-connexion.mp3",
     "A short digital sonar-modem connection blip, two quiet electronic pings, cold, clinical, "
     "surveillance-room feel, no music",
     1.2, 0.55),
    ("sfx-soudan-russie.mp3",
     "A distant low ship horn with faint radio static crackle underneath, brief, cold, "
     "intelligence-feed atmosphere, no music",
     1.8, 0.45),
    ("sfx-soudan-drone.mp3",
     "A rising mechanical drone hum that swells then a dry muffled impact thud, cutting to silence, "
     "restrained, documentary, not cinematic, no music, no explosion boom",
     1.9, 0.5),
    ("sfx-soudan-veto.mp3",
     "A single hard metallic clank like a heavy stamp or gavel striking metal, dry, final, "
     "cutting to silence, no reverb, no music",
     1.2, 0.55),
    ("sfx-soudan-bilan.mp3",
     "A soft desert wind with a faint creak of old wood, desolate, hollow, quiet, "
     "aftermath atmosphere, no music",
     2.0, 0.4),
]


def generate(filename, prompt, duration, influence):
    payload = {"text": prompt, "duration_seconds": duration, "prompt_influence": influence}
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    print(f"-> {filename} ({duration}s) ...", flush=True)
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
    print(f"\n=== {'ALL OK' if ok else 'SOME FAILED'} -> {OUT_DIR} ===")
    sys.exit(0 if ok else 1)
