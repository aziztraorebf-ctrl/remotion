"""
Transcribe Soundjata narration via OpenAI Whisper API.
Returns word-level timestamps in JSON.
"""

import json
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).parent.parent.parent / ".env")

AUDIO = Path(__file__).parent.parent.parent / "public" / "assets" / "library" / "geoafrique" / "heros-oublies" / "soundjata" / "narration-full.mp3"
OUTPUT = Path(__file__).parent.parent.parent / "tmp" / "whisper-soundjata" / "narration-full.json"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

print(f"Transcribing : {AUDIO.name} ({AUDIO.stat().st_size // 1024}KB)")

with open(AUDIO, "rb") as f:
    result = client.audio.transcriptions.create(
        file=f,
        model="whisper-1",
        language="fr",
        response_format="verbose_json",
        timestamp_granularities=["word", "segment"],
    )

data = result.model_dump()
OUTPUT.write_text(json.dumps(data, indent=2, ensure_ascii=False))

print(f"Saved: {OUTPUT}")
print(f"Duration: {data.get('duration', '?')}s")
print(f"Words: {len(data.get('words', []))}")
print(f"Segments: {len(data.get('segments', []))}")
print()
print("--- First 10 segments ---")
for seg in data.get("segments", [])[:10]:
    start = seg.get("start", 0)
    end = seg.get("end", 0)
    text = seg.get("text", "").strip()
    print(f"  [{start:6.2f}s - {end:6.2f}s] {text}")
