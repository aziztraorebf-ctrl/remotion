#!/usr/bin/env python3
"""Generate lab SFX for Hannibal RPG patterns (Phase 1+)."""
import os
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY not set")

OUTPUT_DIR = "/Users/clawdbot/Workspace/remotion/public/_lab-hannibal/sfx"
os.makedirs(OUTPUT_DIR, exist_ok=True)

sfx_list = [
    {
        "filename": "blip-bubble.mp3",
        "text": "Short retro 8-bit notification blip, single brief electronic tone like a Nintendo NES menu cursor, very crisp and clean, no reverb, no music, brief and punchy",
        "duration_seconds": 0.5,
        "prompt_influence": 0.5,
    },
    {
        "filename": "stat-tick.mp3",
        "text": "Subtle metallic counter tick, brief crisp click like an old odometer rolling, very short and precise, no reverb",
        "duration_seconds": 0.5,
        "prompt_influence": 0.5,
    },
]

ENDPOINT = "https://api.elevenlabs.io/v1/sound-generation"
HEADERS = {"xi-api-key": API_KEY, "Content-Type": "application/json"}

print(f"Generating {len(sfx_list)} SFX for Lab Hannibal...")
print(f"Output: {OUTPUT_DIR}")
print(f"Estimated cost: ~${len(sfx_list) * 0.05:.2f}")
print()

for sfx in sfx_list:
    filename = sfx["filename"]
    output_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(output_path):
        print(f"SKIP (exists): {filename}")
        continue

    print(f"Generating: {filename}")
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

print("\nDone.")
