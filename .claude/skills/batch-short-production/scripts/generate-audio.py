"""
Batch Short Production — Phase 1: Audio Generation
Generates voice-over from a script file using ElevenLabs V3.

Usage:
    python generate-audio.py --script path/to/script.txt --output path/to/output.mp3
    python generate-audio.py --script path/to/script.txt --output path/to/output.mp3 --voice VOICE_ID
    python generate-audio.py --script path/to/script.txt --output path/to/output.mp3 --speed 0.92

Default voice: Narratrice GeoAfrique V3 (Y8XqpS6sj6cx5cCTLp8a)
Default settings: documentary style (stability 0.25, style 0.40, speed 0.88)
"""

import argparse
import os
import sys
import pathlib
import requests
from dotenv import load_dotenv


DEFAULT_VOICE_ID = "Y8XqpS6sj6cx5cCTLp8a"
DEFAULT_SETTINGS = {
    "stability": 0.25,
    "similarity_boost": 0.75,
    "style": 0.40,
    "speed": 0.88,
}


def find_env():
    """Walk up from CWD to find .env file."""
    path = pathlib.Path.cwd()
    while path != path.parent:
        env_file = path / ".env"
        if env_file.exists():
            return str(env_file)
        path = path.parent
    return None


def generate_audio(script_text, output_path, voice_id, settings):
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("ERROR: ELEVENLABS_API_KEY not found in environment")
        sys.exit(1)

    print(f"Voice: {voice_id}")
    print(f"Settings: stability={settings['stability']}, style={settings['style']}, speed={settings['speed']}")
    print(f"Script length: {len(script_text.split())} words")
    estimated_duration = len(script_text.split()) / 150 * 60 / settings["speed"]
    print(f"Estimated duration: ~{estimated_duration:.0f}s (at speed {settings['speed']})")
    print()

    print("Calling ElevenLabs V3...")
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
        json={
            "text": script_text,
            "model_id": "eleven_v3",
            "voice_settings": settings,
        },
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"ERROR: ElevenLabs returned {resp.status_code}")
        print(resp.text[:500])
        sys.exit(1)

    output = pathlib.Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(resp.content)

    size_kb = len(resp.content) / 1024
    print(f"Saved: {output} ({size_kb:.1f} KB)")
    print()
    print("Next step: run extract-timing.py on this audio file")


def main():
    parser = argparse.ArgumentParser(description="Generate voice-over audio from script")
    parser.add_argument("--script", required=True, help="Path to script text file")
    parser.add_argument("--output", required=True, help="Output MP3 path")
    parser.add_argument("--voice", default=DEFAULT_VOICE_ID, help="ElevenLabs voice ID")
    parser.add_argument("--speed", type=float, default=None, help="Override speech speed (default: 0.88)")
    parser.add_argument("--stability", type=float, default=None, help="Override stability (default: 0.25)")
    parser.add_argument("--style", type=float, default=None, help="Override style (default: 0.40)")
    args = parser.parse_args()

    env_path = find_env()
    if env_path:
        load_dotenv(env_path)

    script_path = pathlib.Path(args.script)
    if not script_path.exists():
        print(f"ERROR: Script file not found: {script_path}")
        sys.exit(1)

    script_text = script_path.read_text(encoding="utf-8").strip()
    if not script_text:
        print("ERROR: Script file is empty")
        sys.exit(1)

    settings = DEFAULT_SETTINGS.copy()
    if args.speed is not None:
        settings["speed"] = args.speed
    if args.stability is not None:
        settings["stability"] = args.stability
    if args.style is not None:
        settings["style"] = args.style

    generate_audio(script_text, args.output, args.voice, settings)


if __name__ == "__main__":
    main()
