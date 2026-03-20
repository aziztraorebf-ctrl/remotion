"""
Music generation via Beatoven (fal.ai)
Cinematic + African instruments via text prompt
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
        "id": "beatoven-doc-africain",
        "prompt": "West African documentary background music. Balafon xylophone melody, djembe percussion, kora plucking. Contemplative and warm, suitable for narration. Instrumental.",
        "duration": 30,
    },
    {
        "id": "beatoven-festive-africain",
        "prompt": "Festive West African music. Balafon leading melody, djembe and dunun drums. Celebratory Manding style, energetic and joyful. Instrumental only.",
        "duration": 30,
    },
]


def generate_beatoven(track: dict) -> str | None:
    print(f"\n--- Generating {track['id']} via Beatoven (fal.ai) ---")
    print(f"  Prompt: {track['prompt'][:80]}...")

    try:
        result = fal_client.subscribe(
            "beatoven/music-generation",
            arguments={
                "prompt": track["prompt"],
                "duration": track["duration"],
            },
            with_logs=True,
            on_queue_update=lambda u: print(f"  Queue: {u.status}" if hasattr(u, "status") else "  ..."),
        )

        audio_url = None
        if isinstance(result, dict):
            audio_url = (
                result.get("audio_url")
                or result.get("url")
                or (result.get("audio", {}) or {}).get("url")
            )
        print(f"  Raw result keys: {list(result.keys()) if isinstance(result, dict) else type(result)}")

        if not audio_url:
            print(f"  ERROR: no audio URL. Full result: {result}")
            return None

        resp = requests.get(audio_url, timeout=60)
        if resp.status_code != 200:
            print(f"  ERROR downloading: {resp.status_code}")
            return None

        output_path = OUTPUT_DIR / f"music-{track['id']}.mp3"
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
    print("=== Beatoven — West African Documentary Music ===")
    print(f"Output: {OUTPUT_DIR}\n")

    paths = []
    for track in TRACKS:
        path = generate_beatoven(track)
        if path:
            paths.append(path)

    print("\n=== DONE ===")
    for p in paths:
        print(f"  {Path(p).name}")

    if paths:
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)


if __name__ == "__main__":
    main()
