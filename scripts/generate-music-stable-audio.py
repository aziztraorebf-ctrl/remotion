"""
Music generation via Stable Audio 2.5 (fal.ai)
Model: fal-ai/stable-audio-25
2026-03-14
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import fal_client
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-v5-test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TRACKS = [
    {
        "id": "stable-audio-doc-africain",
        "prompt": (
            "West African documentary background music. "
            "Balafon xylophone as main melody, djembe percussion, kora plucking. "
            "Contemplative, warm atmosphere. Instrumental, no vocals. "
            "Suitable for narration, gentle and loopable."
        ),
        "negative_prompt": "vocals, singing, electronic, synth, western orchestra, guitar",
        "seconds_total": 47,
        "seconds_start": 0,
    },
    {
        "id": "stable-audio-festive-africain",
        "prompt": (
            "Festive West African music. Balafon leading melody, "
            "fast djembe rhythms, dunun bass drums, shekere rattles. "
            "Celebratory Manding style, energetic and joyful. "
            "Instrumental only, no vocals."
        ),
        "negative_prompt": "vocals, singing, electronic, synth, western orchestra",
        "seconds_total": 47,
        "seconds_start": 0,
    },
]


def generate_stable_audio(track: dict) -> str | None:
    print(f"\n--- Generating {track['id']} via Stable Audio 2.5 (fal.ai) ---")
    print(f"  Prompt: {track['prompt'][:80]}...")

    try:
        result = fal_client.subscribe(
            "fal-ai/stable-audio",
            arguments={
                "prompt": track["prompt"],
                "negative_prompt": track["negative_prompt"],
                "seconds_total": track["seconds_total"],
                "seconds_start": track["seconds_start"],
            },
            with_logs=True,
            on_queue_update=lambda u: print(f"  Queue: {u.status}" if hasattr(u, "status") else "  ..."),
        )

        audio_url = None
        if isinstance(result, dict):
            audio_file = result.get("audio_file")
            if isinstance(audio_file, dict):
                audio_url = audio_file.get("url")
            if not audio_url:
                audio_url = result.get("audio_url") or result.get("url")
        print(f"  Raw result keys: {list(result.keys()) if isinstance(result, dict) else type(result)}")

        if not audio_url:
            print(f"  ERROR: no audio URL. Full result: {result}")
            return None

        resp = requests.get(audio_url, timeout=60)
        if resp.status_code != 200:
            print(f"  ERROR downloading: {resp.status_code}")
            return None

        ext = "wav" if "wav" in resp.headers.get("content-type", "") else "mp3"
        output_path = OUTPUT_DIR / f"music-{track['id']}.{ext}"
        output_path.write_bytes(resp.content)
        size_kb = len(resp.content) / 1024
        print(f"  Saved: {output_path.name} ({size_kb:.0f} KB)")

        probe = subprocess.run(
            ["ffprobe", "-i", str(output_path), "-show_entries", "format=duration",
             "-v", "quiet", "-of", "csv=p=0"],
            capture_output=True, text=True
        )
        if probe.stdout.strip():
            print(f"  Duration: {float(probe.stdout.strip()):.2f}s")

        return str(output_path)

    except Exception as e:
        print(f"  ERROR: {e}")
        return None


def main():
    print("=== Stable Audio 2.5 — West African Documentary Music ===")
    print(f"Output: {OUTPUT_DIR}\n")

    paths = []
    for track in TRACKS:
        path = generate_stable_audio(track)
        if path:
            paths.append(path)

    print("\n=== DONE ===")
    for p in paths:
        print(f"  {Path(p).name}")

    if paths:
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)


if __name__ == "__main__":
    main()
