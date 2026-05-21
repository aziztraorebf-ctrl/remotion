#!/usr/bin/env python3
"""Generate SFX for Atlas Mansa Moussa V2 via ElevenLabs sound-generation API."""
import os
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY not set")

OUTPUT_DIR = "/Users/clawdbot/Workspace/remotion/quebec-jacques-poc/public/atlas-mansa-moussa/sfx"
os.makedirs(OUTPUT_DIR, exist_ok=True)

sfx_list = [
    {
        "filename": "A-mali-whoosh.mp3",
        "text": "Fast cartographic swoosh, camera snapping into focus on a map, quick whoosh with a soft thud at the end, like a zoom on ancient parchment",
        "duration_seconds": 1.2,
        "prompt_influence": 0.4,
    },
    {
        "filename": "B2-empire-reveal.mp3",
        "text": "Ancient empire borders appearing on a map, soft whoosh with a low resonant hum, like ink spreading across old parchment, mysterious and grand",
        "duration_seconds": 2.0,
        "prompt_influence": 0.35,
    },
    {
        "filename": "E-coins-caire.mp3",
        "text": "Gold coins raining down, coins clinking and scattering on stone floor, wealth overflowing, metallic coins cascading, rich and abundant",
        "duration_seconds": 3.0,
        "prompt_influence": 0.45,
    },
    {
        "filename": "F-crowd-mecque.mp3",
        "text": "Distant crowd murmur in a vast open space, thousands of pilgrims in awe, reverent crowd noise, low rumble of many voices in the desert wind",
        "duration_seconds": 3.5,
        "prompt_influence": 0.3,
    },
]

ENDPOINT = "https://api.elevenlabs.io/v1/sound-generation"
HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

for sfx in sfx_list:
    filename = sfx["filename"]
    output_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(output_path):
        print(f"SKIP (exists): {filename}")
        continue

    print(f"Generating: {filename} ...")
    payload = {
        "text": sfx["text"],
        "duration_seconds": sfx.get("duration_seconds"),
        "prompt_influence": sfx.get("prompt_influence", 0.3),
        "output_format": "mp3_44100_128",
    }
    resp = requests.post(
        ENDPOINT,
        headers=HEADERS,
        json=payload,
        params={"output_format": "mp3_44100_128"},
        timeout=60,
    )
    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:200]}")
        continue

    with open(output_path, "wb") as f:
        f.write(resp.content)
    size_kb = len(resp.content) // 1024
    print(f"  -> {output_path} ({size_kb} KB)")

print("Done.")
