"""Generate 2 additional music variants for Abou Bakari II — darker, more contemplative royal style.

Based on variante-A (kora + balafon Toumani Diabate style) but darker and more introspective.
Cost: $0.10 per variant = $0.20 total.
"""
import asyncio
import os
import sys
from pathlib import Path

import fal_client
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

OUT_DIR = ROOT / "public" / "audio" / "abou-bakari" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = [
    {
        "name": "variante-D-royal-sombre-kora",
        "prompt": (
            "Traditional Mande griot music from Mali, 14th century. "
            "Solo kora, slow and introspective, dark minor tonality. "
            "Style of Toumani Diabate. Somber, melancholic, regal, heavy with fate. "
            "A king who knows he will never return. Sparse notes, long silences. "
            "Acoustic, organic, meditative. "
            "No synthesizers, no electronic sounds, no drums, no percussion."
        ),
    },
    {
        "name": "variante-E-royal-contemplatif-ngoni",
        "prompt": (
            "Traditional Mande griot music from Mali, 14th century empire era. "
            "Solo ngoni with deep balafon undertones, very slow tempo. "
            "Style of Bassekou Kouyate. Dark, contemplative, searching, bittersweet. "
            "The music of a man staring at the horizon he cannot resist. "
            "Melancholic yet dignified. Acoustic, warm, organic. "
            "No synthesizers, no electronic sounds, no djembe, no upbeat rhythm."
        ),
    },
]


async def generate_variant(name: str, prompt: str) -> bool:
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


async def main() -> int:
    if not os.environ["FAL_KEY"]:
        print("ERROR: FAL_KEY missing")
        return 1

    print(f"Output dir: {OUT_DIR}")
    print(f"Generating {len(VARIANTS)} variants in parallel...")
    print(f"[COST PREVIEW] {len(VARIANTS)} * $0.10 = ${len(VARIANTS) * 0.10:.2f}")
    print()

    results = await asyncio.gather(*[generate_variant(v["name"], v["prompt"]) for v in VARIANTS])
    ok = sum(1 for r in results if r)
    print(f"\nResults: {ok}/{len(VARIANTS)} succeeded")
    return 0 if ok == len(VARIANTS) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
