"""
Batch Short Production — Phase 2: Timing Extraction
Extracts total duration via ffprobe and produces a timing.json skeleton.

Usage:
    python extract-timing.py --audio path/to/voixoff.mp3 --beats 9 --output path/to/timing.json
    python extract-timing.py --audio path/to/voixoff.mp3 --beats-file path/to/beats.txt --output path/to/timing.json

The --beats flag creates evenly-spaced beats (for initial skeleton).
The --beats-file flag reads manual timestamps (after Whisper analysis).

beats.txt format (one beat per line):
    0.0 12.5 Intro - Dakar 1944
    12.5 24.0 Context - Camp Thiaroye
    24.0 36.0 Soldiers faces
    ...
"""

import argparse
import json
import math
import os
import subprocess
import sys
import pathlib


def get_audio_duration(audio_path):
    """Get audio duration in seconds via ffprobe."""
    try:
        result = subprocess.run(
            [
                "ffprobe", "-v", "quiet",
                "-show_entries", "format=duration",
                "-of", "json",
                str(audio_path),
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        data = json.loads(result.stdout)
        return float(data["format"]["duration"])
    except FileNotFoundError:
        print("ERROR: ffprobe not found. Install ffmpeg.")
        sys.exit(1)
    except (KeyError, json.JSONDecodeError) as e:
        print(f"ERROR: Could not parse ffprobe output: {e}")
        sys.exit(1)


def create_even_beats(total_duration, num_beats, fps=30):
    """Create evenly-spaced beats as a starting skeleton."""
    beat_duration = total_duration / num_beats
    beats = []
    for i in range(num_beats):
        start = i * beat_duration
        end = min((i + 1) * beat_duration, total_duration)
        duration = end - start
        clip_duration = "10" if duration > 7 else "5"

        beats.append({
            "beat": i + 1,
            "start_time": round(start, 2),
            "end_time": round(end, 2),
            "duration": round(duration, 2),
            "start_frame": round(start * fps),
            "end_frame": round(end * fps),
            "duration_frames": round(duration * fps),
            "clip_duration_target": clip_duration,
            "description": f"Beat {i + 1}",
        })
    return beats


def parse_beats_file(beats_file_path, fps=30):
    """Parse manual beat timestamps from a text file."""
    beats = []
    with open(beats_file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split(None, 2)
            if len(parts) < 2:
                print(f"WARNING: Skipping malformed line {i + 1}: {line}")
                continue

            start = float(parts[0])
            end = float(parts[1])
            description = parts[2] if len(parts) > 2 else f"Beat {len(beats) + 1}"
            duration = end - start
            clip_duration = "10" if duration > 7 else "5"

            beats.append({
                "beat": len(beats) + 1,
                "start_time": round(start, 2),
                "end_time": round(end, 2),
                "duration": round(duration, 2),
                "start_frame": round(start * fps),
                "end_frame": round(end * fps),
                "duration_frames": round(duration * fps),
                "clip_duration_target": clip_duration,
                "description": description,
            })
    return beats


def main():
    parser = argparse.ArgumentParser(description="Extract timing from audio for Short production")
    parser.add_argument("--audio", required=True, help="Path to audio MP3 file")
    parser.add_argument("--output", required=True, help="Output timing.json path")
    parser.add_argument("--beats", type=int, default=None, help="Number of beats (creates even skeleton)")
    parser.add_argument("--beats-file", default=None, help="Path to manual beats timestamp file")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second (default: 30)")
    args = parser.parse_args()

    audio_path = pathlib.Path(args.audio)
    if not audio_path.exists():
        print(f"ERROR: Audio file not found: {audio_path}")
        sys.exit(1)

    total_duration = get_audio_duration(audio_path)
    total_frames = math.ceil(total_duration * args.fps)
    print(f"Audio: {audio_path.name}")
    print(f"Duration: {total_duration:.2f}s ({total_frames} frames at {args.fps}fps)")
    print()

    if args.beats_file:
        beats = parse_beats_file(args.beats_file, args.fps)
        print(f"Parsed {len(beats)} beats from {args.beats_file}")
    elif args.beats:
        beats = create_even_beats(total_duration, args.beats, args.fps)
        print(f"Created {args.beats} evenly-spaced beats (skeleton — refine with Whisper)")
    else:
        print("ERROR: Provide either --beats N or --beats-file path")
        sys.exit(1)

    timing = {
        "audio_file": str(audio_path),
        "total_duration": round(total_duration, 2),
        "total_frames": total_frames,
        "fps": args.fps,
        "beats": beats,
    }

    output_path = pathlib.Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(timing, f, indent=2, ensure_ascii=False)

    print(f"\nSaved: {output_path}")
    print()
    print("Beat summary:")
    for b in beats:
        pr = round(float(b["clip_duration_target"]) / b["duration"], 2) if b["duration"] > 0 else 1.0
        print(f"  Beat {b['beat']:2d}: {b['start_time']:6.1f}s - {b['end_time']:6.1f}s ({b['duration']:5.1f}s) -> clip {b['clip_duration_target']}s (playbackRate ~{pr})")

    print()
    print("Next step: run generate-storyboard.py with this timing.json")


if __name__ == "__main__":
    main()
