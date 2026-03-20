"""
Music generation via MusicGen Melody (fal.ai)
Reference audio: beat-test-afrique.mp3 (balafon + djembe, Manding style)
Model: fal-ai/musicgen (melody conditioning on reference audio)
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
        "id": "musicgen-melody-doc",
        "prompt": (
            "West African balafon melody, djembe percussion, Manding style. "
            "Documentary background music, contemplative and warm. "
            "Instrumental, no vocals. Medium tempo, loopable."
        ),
        "duration": 30,
    },
    {
        "id": "musicgen-melody-festive",
        "prompt": (
            "West African balafon, djembe and dunun drums, kora plucking. "
            "Festive and celebratory, upbeat Manding groove. "
            "Instrumental only, energetic but not overwhelming."
        ),
        "duration": 30,
    },
]


def upload_reference(path: Path) -> str:
    print(f"  Uploading reference audio to fal.ai storage...")
    url = fal_client.upload_file(str(path))
    print(f"  Reference URL: {url}")
    return url


def generate_musicgen(track: dict, reference_url: str) -> str | None:
    print(f"\n--- Generating {track['id']} via fal.ai MusicGen ---")
    print(f"  Prompt: {track['prompt'][:80]}...")

    try:
        result = fal_client.subscribe(
            "fal-ai/musicgen",
            arguments={
                "prompt": track["prompt"],
                "duration": track["duration"],
                "model": "facebook/musicgen-stereo-melody-large",
                "audio_url": reference_url,
            },
            with_logs=True,
            on_queue_update=lambda update: print(f"  Status: {update.status}" if hasattr(update, 'status') else "  ..."),
        )

        audio_url = (result.get("audio_url") or {}).get("url") if isinstance(result.get("audio_url"), dict) else result.get("audio_url")
        print(f"  Raw result keys: {list(result.keys()) if isinstance(result, dict) else type(result)}")
        if not audio_url:
            print(f"  ERROR: no audio URL in result: {result}")
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
    print("=== MusicGen Melody — Reference-conditioned African music ===")
    print(f"Reference: {REFERENCE_AUDIO.name}")
    print(f"Output: {OUTPUT_DIR}\n")

    if not REFERENCE_AUDIO.exists():
        print(f"ERROR: Reference audio not found: {REFERENCE_AUDIO}")
        return

    reference_url = upload_reference(REFERENCE_AUDIO)

    paths = []
    for track in TRACKS:
        path = generate_musicgen(track, reference_url)
        if path:
            paths.append(path)

    print("\n=== DONE ===")
    for p in paths:
        print(f"  {Path(p).name}")

    if paths:
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)


if __name__ == "__main__":
    main()
