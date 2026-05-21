#!/usr/bin/env python3
"""Generate 7 SFX for Atlas Empire du Ghana via ElevenLabs sound-generation API."""
import os
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY not set")

OUTPUT_DIR = "/Users/clawdbot/Workspace/remotion/public/audio/atlas-empire-ghana/sfx"
os.makedirs(OUTPUT_DIR, exist_ok=True)

sfx_list = [
    {
        "filename": "01-beat1-secret-whoosh.mp3",
        "text": "Subtle magical reveal whoosh, soft sweep of ancient parchment with a hint of golden shimmer, mysterious cartographic discovery, brief and elegant",
        "duration_seconds": 0.5,
        "prompt_influence": 0.4,
    },
    {
        "filename": "02-beat3-balance-chime.mp3",
        "text": "Soft single bell chime ringing in equilibrium, gentle metallic resonance like brass scales finding perfect balance, brief and pure",
        "duration_seconds": 0.8,
        "prompt_influence": 0.4,
    },
    {
        "filename": "03-beat4-almoravid-warcry.mp3",
        "text": "Aggressive Berber warrior battle horn blast, deep low brass war horn followed by horse galloping hooves on sand, military invasion approaching, menacing and forceful, NOT a fearful scream, threatening and dominant",
        "duration_seconds": 1.2,
        "prompt_influence": 0.6,
    },
    {
        "filename": "04-beat4-1076-impact.mp3",
        "text": "Massive cinematic boom impact with thunderous low bass, heavy stone hitting ground with echoing rumble, dramatic loud crash like a building collapsing, very LOUD and powerful with deep sub-bass frequencies, movie trailer impact",
        "duration_seconds": 1.0,
        "prompt_influence": 0.7,
    },
    {
        "filename": "05-beat4-sundiata-warcry.mp3",
        "text": "Loud triumphant African male warrior shouting in victory, deep masculine voice with full power, raw guttural war cry from the chest, no music just pure powerful human voice, heroic and dominant, brief reverb tail, clearly audible and intense",
        "duration_seconds": 1.5,
        "prompt_influence": 0.7,
    },
    {
        "filename": "06-beat4-niani-shimmer.mp3",
        "text": "Magical golden shimmer ascending, ethereal bells rising in harmony, birth of a new empire, light and luminous chime sequence, hopeful transition",
        "duration_seconds": 1.0,
        "prompt_influence": 0.4,
    },
    {
        "filename": "07-beat5-final-impact.mp3",
        "text": "Single massive djembe drum hit, very loud powerful African drum strike with long booming reverb tail echoing for two seconds, deep low bass frequencies, dramatic cinematic ending impact like a movie trailer climax, heavy and weighty, unmistakable percussive boom",
        "duration_seconds": 2.0,
        "prompt_influence": 0.7,
    },
]

ENDPOINT = "https://api.elevenlabs.io/v1/sound-generation"
HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

print(f"Generating {len(sfx_list)} SFX for Empire Ghana...")
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
    print(f"  Prompt: {sfx['text'][:80]}...")
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

print()
print("Done. Next step: upload to Vercel Blob for review.")
