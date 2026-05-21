"""Generate 3 music variants for Thiaroye V5 via Minimax v2.6 on fal.ai.

Formula (validated on Sonjata): artist-named + 1-2 instruments + "no synthesizers".
Target: grave, dignified, traditional West African mourning music (~95s).
Cost: $0.10 per variant = $0.30 total.
"""
import asyncio
import os
import sys
from pathlib import Path

import fal_client
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

OUT_DIR = ROOT / "public" / "audio" / "thiaroye-1944" / "music-variantes"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# 3 different prompts (same theme, different instrument/artist combos)
VARIANTS = [
    {
        "name": "variante-A-balafon-dundun",
        "prompt": (
            "Traditional West African mourning music, Senegalese griot tradition. "
            "Solo balafon with deep dundun drum, slow 6/8 rhythm. "
            "Style of Toumani Diabate. Somber, grave, dignified. "
            "No synthesizers, no electronic sounds, no orchestral strings."
        ),
    },
    {
        "name": "variante-B-kora-ngoni",
        "prompt": (
            "West African mourning lament, Mande tradition. "
            "Solo kora with sparse ngoni accompaniment, slow meditative tempo. "
            "Style of Ballake Sissoko. Grave, reverent, spacious silences. "
            "No synthesizers, no drums, no percussion."
        ),
    },
    {
        "name": "variante-C-balafon-solo",
        "prompt": (
            "West African solo balafon lament, slow tempo. "
            "Pure acoustic balafon only, deep resonance, few notes with long sustains. "
            "Style of Aly Keita. Hypnotic, grave, ancestral, commemorative. "
            "No other instruments, no synthesizers, no electronic sounds."
        ),
    },
]


async def generate_variant(name: str, prompt: str):
    """Generate one Minimax music variant."""
    out_path = OUT_DIR / f"{name}.mp3"
    print(f"[{name}] starting...")
    try:
        handler = await fal_client.submit_async(
            "fal-ai/minimax-music/v2.6",
            arguments={
                "prompt": prompt,
                "is_instrumental": True,
            },
        )
        result = await handler.get()
        audio_url = result.get("audio", {}).get("url") or result.get("audio_url")
        if not audio_url:
            print(f"[{name}] ERROR: no audio URL in result: {result}")
            return False

        import requests
        resp = requests.get(audio_url, timeout=60)
        if resp.status_code != 200:
            print(f"[{name}] ERROR download: {resp.status_code}")
            return False
        out_path.write_bytes(resp.content)
        size_kb = out_path.stat().st_size / 1024
        print(f"[{name}] SAVED: {out_path.name} ({size_kb:.1f} KB)")
        return True
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def main():
    if not os.environ["FAL_KEY"]:
        print("ERROR: FAL_KEY missing")
        return 1

    print(f"Output dir: {OUT_DIR}")
    print(f"Generating {len(VARIANTS)} music variants in parallel...")
    print(f"[COST PREVIEW] {len(VARIANTS)} * $0.10 = ${len(VARIANTS) * 0.10:.2f}")
    print()

    tasks = [generate_variant(v["name"], v["prompt"]) for v in VARIANTS]
    results = await asyncio.gather(*tasks)

    ok = sum(1 for r in results if r)
    print(f"\nResults: {ok}/{len(VARIANTS)} succeeded")
    return 0 if ok == len(VARIANTS) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
