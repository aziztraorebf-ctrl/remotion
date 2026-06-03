"""
Generate 5 music tracks Minimax v2.6 — Quebec/Canada documentary style.
Tests de portabilité musicale pour le projet Souverain Canada (différé).

Coût estimé: 5 × $0.10 = $0.50
Temps estimé: ~5 min en parallèle

Outputs: out/_r-and-d/quebec-music-test/q-{A|B|C|D|E}-*.mp3
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
if not FAL_KEY:
    print("ERROR: FAL_KEY missing in .env")
    raise SystemExit(1)
os.environ["FAL_KEY"] = FAL_KEY

OUT_DIR = ROOT / "out" / "_r-and-d" / "quebec-music-test"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = {
    "A-ambient-nordique": """Modern Canadian documentary score. Sparse acoustic piano melody over slow ambient cello drones.
Style of Olafur Arnalds. Slow 4/4 rhythm, 70 BPM.
Cold, introspective, vast northern landscapes. Tension underneath.
No synthesizers, no electronic beats, no orchestral strings, no chorus.""",

    "B-folk-wilderness": """Contemporary Canadian folk score. Fingerpicked acoustic guitar with subtle reverb.
Style of Mark Knopfler solo work. Gentle 4/4 rhythm, 80 BPM.
Contemplative, vast wilderness mood, modern documentary feel.
No synthesizers, no electronic elements, no vocals, no drums, no country slide guitar.""",

    "C-hivernal-tendu": """Cold cinematic score. Deep acoustic bass pulse with sparse piano notes.
Style of Hildur Gudnadottir film score. Slow 4/4 rhythm, 90 BPM.
Frozen lake at night atmosphere, tension without aggression, dignified.
No synthesizers, no electronic beats, no orchestral swells, no chorus.""",

    "D-aurore-acoustique": """Cinematic acoustic post-rock score. Slow swelling acoustic guitar with deep cello.
Style of Sigur Ros instrumental work. Slow 4/4 rhythm, 75 BPM.
Dawn over wilderness atmosphere, hopeful but mature, organic.
No synthesizers, no electronic elements, no vocals, no drums.""",

    "E-percussion-organique": """Acoustic documentary score. Hand drums and upright bass groove with sparse piano melody.
Style of Tinariwen contemporary work. Steady 4/4 rhythm, 95 BPM.
Forward motion, journalistic curiosity, northern modern feel.
No synthesizers, no electronic beats, no orchestral elements, no vocals.""",
}


def generate_one(key: str, prompt: str) -> dict:
    """Generate one Minimax track (blocking call to subscribe)."""
    print(f"[{key}] Submit prompt ({len(prompt)} chars)...")
    try:
        result = fal_client.subscribe(
            "fal-ai/minimax-music/v2.6",
            arguments={
                "prompt": prompt,
                "is_instrumental": True,
            },
            with_logs=False,
        )
        audio_url = result.get("audio", {}).get("url")
        if not audio_url:
            print(f"[{key}] ERROR: no audio URL in result: {result}")
            return {"key": key, "error": "no_audio_url"}
        # Download
        out_file = OUT_DIR / f"q-{key}.mp3"
        r = requests.get(audio_url, timeout=120)
        out_file.write_bytes(r.content)
        size_mb = len(r.content) / 1024 / 1024
        # Probe duration
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
    print(f"Output dir: {OUT_DIR}")
    print(f"Generating {len(VARIANTS)} tracks in parallel...")
    print(f"Estimated cost: ${len(VARIANTS) * 0.10:.2f}")
    print()

    # Submit all in parallel via asyncio.to_thread
    tasks = [
        asyncio.to_thread(generate_one, key, prompt)
        for key, prompt in VARIANTS.items()
    ]
    results = await asyncio.gather(*tasks)

    print("\n=== SUMMARY ===")
    success = 0
    for r in results:
        if "error" in r:
            print(f"  [{r['key']}] FAILED: {r['error']}")
        else:
            print(f"  [{r['key']}] {r['duration']:.1f}s  →  {r['file']}")
            success += 1
    print(f"\n{success}/{len(VARIANTS)} tracks generated successfully")


if __name__ == "__main__":
    asyncio.run(main())
