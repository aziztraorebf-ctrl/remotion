"""
Generation musique de fond — test pour Abou Bakari II
Style C : fusion minimaliste (kora/oud + pad discret)
Style D : dark ambient historique (drones graves + percussions oceaniques)
Style E : cinematic ambient tribal (nappes + percussions lointaines)
Style F : orchestral enigmatic journey (cordes lentes + crescendo)
Duree : 22s par clip (loopable jusqu'a 100s via ffmpeg)
2026-03-14
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-v5-test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

MUSIC_TRACKS = [
    {
        "id": "style-C-minimaliste",
        "prompt": (
            "Minimalist West African documentary score. "
            "Solo kora plucking a slow meditative melody, sparse and spacious. "
            "Subtle ambient pad underneath, barely audible. "
            "No drums, no percussion. Melancholic and contemplative. "
            "Feels like standing at the edge of the ocean, looking west into the unknown. "
            "Very low volume, designed to sit under a narrator voice."
        ),
    },
    {
        "id": "style-D-dark-ambient",
        "prompt": (
            "Dark cinematic ambient score for a historical documentary. "
            "Deep drone tones, slowly evolving. Distant ocean percussion, like waves on a hull. "
            "Mysterious and foreboding, suggesting an unexplored horizon. "
            "Low brass undertones, no melody, pure atmospheric tension. "
            "Builds very slowly from silence. "
            "Designed to sit quietly under a narrator voice without competing."
        ),
    },
    {
        "id": "style-E-ambient-tribal",
        "prompt": (
            "Cinematic ambient tribal documentary score. "
            "Deep atmospheric synthesizer pads, low-frequency drones slowly evolving. "
            "Distant West African kora with heavy reverb, sparse and mysterious. "
            "Faint earth drum hits, barely audible, like a heartbeat. "
            "Sense of vast oceanic space and ancient mystery. "
            "No melody, pure texture. Designed to sit under a narrator without competing."
        ),
    },
    {
        "id": "style-F-orchestral-journey",
        "prompt": (
            "Minimalist orchestral score for a historical discovery documentary. "
            "Slow cello and viola low notes, sustained and tense. "
            "Very sparse — long silences between phrases. "
            "Builds imperceptibly from a single low cello note. "
            "Feeling of an enigmatic journey into the unknown. "
            "No percussion, no drums. Understated gravitas. "
            "Designed to sit quietly under a narrator voice."
        ),
    },
]


def generate_music(track: dict) -> str | None:
    print(f"\n--- Generating {track['id']} ---")

    payload = {
        "text": track["prompt"],
        "model_id": "eleven_text_to_sound_v2",
        "output_format": "mp3_44100_128",
        "duration_seconds": 22,
    }

    resp = requests.post(
        "https://api.elevenlabs.io/v1/sound-generation",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    output_path = OUTPUT_DIR / f"music-{track['id']}.mp3"
    output_path.write_bytes(resp.content)
    size_kb = len(resp.content) / 1024
    print(f"  Saved: {output_path.name} ({size_kb:.0f} KB)")

    result = subprocess.run(
        ["ffprobe", "-i", str(output_path), "-show_entries", "format=duration",
         "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        duration = float(result.stdout.strip())
        print(f"  Duree: {duration:.2f}s")

    return str(output_path)


def main():
    print("=== Generation Musique — Abou Bakari II ===")
    print("Styles : C (kora minimaliste) + D (dark ambient) + E (ambient tribal) + F (orchestral)")
    print(f"Output : {OUTPUT_DIR}\n")

    paths = []
    for track in MUSIC_TRACKS:
        path = generate_music(track)
        if path:
            paths.append(path)

    print("\n=== DONE ===")
    for p in paths:
        print(f"  {Path(p).name}")

    if paths:
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)


if __name__ == "__main__":
    main()
