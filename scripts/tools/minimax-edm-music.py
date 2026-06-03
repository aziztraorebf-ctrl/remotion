"""
Generate 3 EDM/energetic music tracks Minimax v2.6.
Tests de variation musicale pour Souverain/Canada (sortir du contemplatif slow).

Coût estimé: 3 × $0.10 = $0.30
"""
import asyncio
import os
import subprocess
from pathlib import Path

import fal_client
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

FAL_KEY = os.getenv("FAL_KEY")
os.environ["FAL_KEY"] = FAL_KEY

OUT_DIR = ROOT / "out" / "_r-and-d" / "edm-music-test"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = {
    "1-cinematic-trailer": """Modern cinematic trailer score. Pulsing electronic bass with rhythmic synth stabs.
Style of Hans Zimmer Inception. Strong 4/4 rhythm, 128 BPM.
Building tension, urgent, contemporary, energetic.
No vocals, no acoustic guitar, no orchestral strings.""",

    "2-documentary-techno": """Modern documentary techno score. Driving electronic kick drum with deep bass synth.
Style of Bonobo instrumental work. Steady 4/4 rhythm, 120 BPM.
Forward motion, urban contemporary, dignified energy.
No vocals, no breakdowns, no melodic vocals.""",

    "3-hybrid-orchestral-electronic": """Hybrid orchestral electronic score. Synth bass with strings hits and drum machine.
Style of Junkie XL Mad Max soundtrack. Building 4/4 rhythm, 110 BPM.
Powerful, contemporary, journalistic urgency.
No vocals, no breakdowns, no melodic chorus.""",
}


def generate_one(key: str, prompt: str) -> dict:
    print(f"[{key}] Submit ({len(prompt)} chars)...")
    try:
        result = fal_client.subscribe(
            "fal-ai/minimax-music/v2.6",
            arguments={"prompt": prompt, "is_instrumental": True},
            with_logs=False,
        )
        audio_url = result.get("audio", {}).get("url")
        if not audio_url:
            print(f"[{key}] ERROR: no audio URL: {result}")
            return {"key": key, "error": "no_audio_url"}
        out_file = OUT_DIR / f"edm-{key}.mp3"
        r = requests.get(audio_url, timeout=120)
        out_file.write_bytes(r.content)
        size_mb = len(r.content) / 1024 / 1024
        probe = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(out_file)],
            capture_output=True, text=True
        )
        duration = float(probe.stdout.strip()) if probe.returncode == 0 else 0
        print(f"[{key}] OK {out_file.name} ({size_mb:.2f} MB, {duration:.1f}s)")
        return {"key": key, "file": str(out_file), "size_mb": size_mb, "duration": duration}
    except Exception as e:
        print(f"[{key}] ERROR: {e}")
        return {"key": key, "error": str(e)}


async def main():
    print(f"Output: {OUT_DIR}")
    print(f"Cost: ${len(VARIANTS) * 0.10:.2f}\n")
    tasks = [asyncio.to_thread(generate_one, k, p) for k, p in VARIANTS.items()]
    results = await asyncio.gather(*tasks)
    print("\n=== SUMMARY ===")
    for r in results:
        if "error" in r:
            print(f"  [{r['key']}] FAILED: {r['error']}")
        else:
            print(f"  [{r['key']}] {r['duration']:.1f}s  →  {r['file']}")


if __name__ == "__main__":
    asyncio.run(main())
