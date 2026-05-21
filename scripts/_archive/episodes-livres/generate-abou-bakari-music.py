"""Generate 3 music variants for Abou Bakari II Short via Minimax v2.6 on fal.ai.

Formula (validated Sonjata + Thiaroye): artist-named + 1-2 instruments + "no synthesizers".
Target: Mande epic music, Mali XIVe siecle, ~90s.
Cost: $0.10 per variant = $0.30 total.

Variants:
A — Royal & adventurous: kora solo + balafon (Toumani Diabate style) — la grandeur du Mansa qui part
B — Mysterious & oceanic: kora + dundun sourd (Ballake Sissoko style) — l'inconnu de l'Atlantique
C — Epic & majestic: balafon + djembe (Neba Solo style) — 2000 pirogues sur l'ocean
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
        "name": "variante-A-royal-kora-balafon",
        "prompt": (
            "Traditional Mande griot music from Mali, 14th century empire era. "
            "Solo kora with warm balafon melody, gentle 6/8 rhythm. "
            "Style of Toumani Diabate. Regal, adventurous, hopeful, meditative. "
            "Building slowly from contemplative to majestic. Acoustic, organic. "
            "No synthesizers, no electronic sounds, no orchestral strings."
        ),
    },
    {
        "name": "variante-B-mysterieux-kora-dundun",
        "prompt": (
            "Traditional Mande music from Mali, oceanic and mysterious. "
            "Solo kora with sparse deep dundun drum, slow meditative tempo. "
            "Style of Ballake Sissoko. Haunting, expansive, vast, unknowing. "
            "Long silences between notes, sense of infinite horizon. Acoustic, organic. "
            "No synthesizers, no electronic sounds, no bright percussion."
        ),
    },
    {
        "name": "variante-C-epique-balafon-djembe",
        "prompt": (
            "Traditional Mande warrior and explorer music from Mali, 14th century. "
            "Acoustic balafon melody with djembe and dundun drums in powerful 6/8 rhythm. "
            "Style of Neba Solo. Epic, determined, triumphant, ancestral. "
            "Driving rhythm evoking a fleet of canoes crossing the ocean. "
            "No synthesizers, no electronic sounds, no modern instruments."
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
