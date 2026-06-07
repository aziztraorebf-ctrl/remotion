#!/usr/bin/env python3
"""Genere les SFX War-Map (Sahel + reutilisables) via ElevenLabs Sound Effects API.

Set complet : 3 signature (utilises Acte 1) + 3 bonus (banque reutilisable).
Sortie : public/_shared/sfx/warmap/. Indexer ensuite dans SFX-INDEX.md.
Pas de TTS — prompts sound design en anglais.

Usage : python3 scripts/warmap/generate-warmap-sfx.py
"""
import os
import sys
import requests
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
for line in (ROOT / ".env").read_text().splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        os.environ["ELEVENLABS_API_KEY"] = line.split("=", 1)[1].strip()

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing"); sys.exit(1)

URL = "https://api.elevenlabs.io/v1/sound-generation"
OUT_DIR = ROOT / "public" / "_shared" / "sfx" / "warmap"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (filename, prompt, duration_seconds, prompt_influence)
SFX = [
    # --- 3 SIGNATURE (utilises Acte 1 Sahel) ---
    ("boom-coup.mp3",
     "deep muffled sub-bass impact, single heavy thud, dark and grave, short, cinematic, no music",
     1.2, 0.5),
    ("cedeao-snap.mp3",
     "sharp electrical snap then dead silence, a neon tube blowing out, dry crack, short, ominous, no music",
     1.0, 0.6),
    ("liptako-gong.mp3",
     "low deep gong impact with long grave resonance, three forces converging into one, muffled cinematic, no music",
     2.5, 0.4),
    # --- 3 BONUS (banque reutilisable) ---
    ("arrow-whoosh.mp3",
     "fast low whoosh of movement across a map, dry air swipe, short, subtle, no music",
     0.6, 0.4),
    ("tension-drone.mp3",
     "very low continuous ominous drone, old archive room ambience, grave sustained bass, seamless loop, no music melody",
     8.0, 0.3),
    ("ink-spread.mp3",
     "soft organic liquid spreading sound, ink bleeding into paper, subtle dark texture, short, no music",
     1.5, 0.4),
]


def generate(filename, prompt, duration, influence):
    payload = {"text": prompt, "duration_seconds": duration, "prompt_influence": influence}
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    print(f"-> {filename} ({duration}s) ...")
    r = requests.post(URL, json=payload, headers=headers, timeout=120)
    if r.status_code != 200:
        print(f"   ERROR {r.status_code}: {r.text[:200]}")
        return False
    (OUT_DIR / filename).write_bytes(r.content)
    print(f"   OK -> {OUT_DIR / filename}")
    return True


def main():
    ok = 0
    for args in SFX:
        if generate(*args):
            ok += 1
    print(f"\n{ok}/{len(SFX)} SFX generes dans {OUT_DIR}")


if __name__ == "__main__":
    main()
