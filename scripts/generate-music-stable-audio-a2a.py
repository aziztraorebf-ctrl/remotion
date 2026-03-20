"""
Music generation via Stable Audio 2.5 audio-to-audio (fal.ai)
Transforms reference balafon sample into documentary/festive styles
Model: fal-ai/stable-audio-25/audio-to-audio
2026-03-14
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import fal_client
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

REFERENCE_AUDIO = Path(__file__).parent.parent / "tmp" / "audio-v5-test" / "beat-test-afrique.mp3"
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-v5-test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TRACKS = [
    {
        "id": "stable-a2a-doc-africain",
        "prompt": (
            "West African documentary background music. "
            "Balafon xylophone as main melody, djembe percussion, kora plucking. "
            "Contemplative, warm atmosphere. Instrumental, no vocals. "
            "Suitable for narration, gentle and loopable."
        ),
        "negative_prompt": "vocals, singing, electronic, synth, western orchestra, guitar",
        "seconds_total": 47,
        "strength": 0.5,
    },
    {
        "id": "stable-a2a-festive-africain",
        "prompt": (
            "Festive West African music. Balafon leading melody, "
            "fast djembe rhythms, dunun bass drums, shekere rattles. "
            "Celebratory Manding style, energetic and joyful. "
            "Instrumental only, no vocals."
        ),
        "negative_prompt": "vocals, singing, electronic, synth, western orchestra",
        "seconds_total": 47,
        "strength": 0.7,
    },
]


def generate_stable_a2a(track: dict, reference_url: str) -> str | None:
    print(f"\n--- Generating {track['id']} via Stable Audio 2.5 audio-to-audio ---")
    print(f"  Prompt: {track['prompt'][:80]}...")
    print(f"  Strength: {track['strength']} (0=copy reference, 1=ignore reference)")

    try:
        result = fal_client.subscribe(
            "fal-ai/stable-audio-25/audio-to-audio",
            arguments={
                "prompt": track["prompt"],
                "negative_prompt": track["negative_prompt"],
                "audio_url": reference_url,
                "seconds_total": track["seconds_total"],
                "strength": track["strength"],
            },
            with_logs=True,
            on_queue_update=lambda u: print(f"  Queue: {u.status}" if hasattr(u, "status") else "  ..."),
        )

        print(f"  Raw result keys: {list(result.keys()) if isinstance(result, dict) else type(result)}")

        audio_url = None
        if isinstance(result, dict):
            audio = result.get("audio")
            if isinstance(audio, dict):
                audio_url = audio.get("url")
            if not audio_url:
                audio_url = result.get("audio_url") or result.get("url")

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
    print("=== Stable Audio 2.5 audio-to-audio — West African Style Transfer ===")
    print(f"Reference: {REFERENCE_AUDIO.name}")
    print(f"Output: {OUTPUT_DIR}\n")

    if not REFERENCE_AUDIO.exists():
        print(f"ERROR: Reference not found: {REFERENCE_AUDIO}")
        return

    print("  Uploading reference audio to fal.ai storage...")
    reference_url = fal_client.upload_file(str(REFERENCE_AUDIO))
    print(f"  Reference URL: {reference_url}\n")

    paths = []
    for track in TRACKS:
        path = generate_stable_a2a(track, reference_url)
        if path:
            paths.append(path)

    print("\n=== DONE ===")
    for p in paths:
        print(f"  {Path(p).name}")

    if paths:
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)


if __name__ == "__main__":
    main()
