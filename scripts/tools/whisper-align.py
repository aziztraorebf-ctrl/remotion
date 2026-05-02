"""
Whisper API word-level alignment.

Generates a TypeScript file with { word, start, end } timestamps for each word
in an audio file, used by the Subtitles component template.

Usage:
    python scripts/tools/whisper-align.py <audio.mp3> [--out path/to/whisper-words.ts]

Example:
    python scripts/tools/whisper-align.py public/audio/sonjata-papercraft/sonjata-short-v2.mp3
    python scripts/tools/whisper-align.py public/audio/thiaroye/thiaroye-v5.mp3 \
        --out src/projects/geoafrique-shorts/whisper-words-thiaroye.ts

Cost: ~$0.006/min (whisper-1). A 3-minute narration = ~$0.018.
"""

import os
import sys
import json
import argparse
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    print("ERROR: OPENAI_API_KEY not found in .env")
    sys.exit(1)


def transcribe(audio_path: Path, language: str = "fr") -> dict:
    print(f"Transcribing {audio_path.name} ({audio_path.stat().st_size / (1024*1024):.1f} MB)...")
    with open(audio_path, "rb") as f:
        response = requests.post(
            "https://api.openai.com/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            files={"file": (audio_path.name, f, "audio/mpeg")},
            data={
                "model": "whisper-1",
                "language": language,
                "response_format": "verbose_json",
                "timestamp_granularities[]": "word",
            },
            timeout=180,
        )
    if response.status_code != 200:
        print(f"ERROR {response.status_code}: {response.text[:500]}")
        sys.exit(1)
    return response.json()


def write_typescript(words: list[dict], out_path: Path) -> None:
    lines = [
        "// Generated from Whisper API (whisper-1) — word-level timestamps",
        f"// Source: {out_path.name}",
        "// DO NOT EDIT manually — regenerate via scripts/tools/whisper-align.py",
        "",
        "export const WHISPER_WORDS: { word: string; start: number; end: number }[] = [",
    ]
    for w in words:
        word = w["word"].replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'  {{ word: "{word}", start: {w["start"]:.3f}, end: {w["end"]:.3f} }},')
    lines.append("];")
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"OK: {len(words)} words written to {out_path}")


def main():
    parser = argparse.ArgumentParser(description="Whisper API word-level alignment")
    parser.add_argument("audio", help="Path to audio file (mp3, wav)")
    parser.add_argument("--out", default=None, help="Output .ts file path")
    parser.add_argument("--language", default="fr", help="Language code (default: fr)")
    args = parser.parse_args()

    audio_path = Path(args.audio)
    if not audio_path.exists():
        print(f"ERROR: file not found: {audio_path}")
        sys.exit(1)

    out_path = Path(args.out) if args.out else Path("src/projects/geoafrique-shorts/whisper-words.ts")

    data = transcribe(audio_path, language=args.language)
    words = data.get("words", [])
    write_typescript(words, out_path)


if __name__ == "__main__":
    main()
