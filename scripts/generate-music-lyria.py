"""
Music generation via Lyria RealTime (Gemini API)
Model: lyria-realtime-exp
Protocol: WebSocket bidirectionnel, PCM 16-bit 48kHz stereo
Saves output as WAV then converts to MP3 via ffmpeg
2026-03-14
"""

import os
import json
import base64
import asyncio
import wave
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import websockets

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-v5-test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

WS_URL = (
    "wss://generativelanguage.googleapis.com/ws/"
    "google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateMusic"
    f"?key={API_KEY}"
)

SAMPLE_RATE = 48000
CHANNELS = 2
SAMPLE_WIDTH = 2  # 16-bit

# Duration to capture per track (seconds)
CAPTURE_SECONDS = 30

TRACKS = [
    {
        "id": "lyria-doc-africain",
        "text": (
            "West African documentary background music. "
            "Balafon xylophone as main melody instrument. "
            "Djembe and dunun percussion, steady groove. "
            "Kora plucking, warm and contemplative atmosphere. "
            "Instrumental, no vocals. Suitable for narration."
        ),
        "config": {
            "temperature": 1.0,
            "guidance": 4.0,
            "bpm": 120,
            "density": 0.5,
            "brightness": 0.6,
        },
    },
    {
        "id": "lyria-festive-africain",
        "text": (
            "Festive West African music. Balafon leading melody, "
            "fast djembe rhythms, dunun bass drums. "
            "Celebratory Manding style, energetic and joyful. "
            "Instrumental only."
        ),
        "config": {
            "temperature": 1.2,
            "guidance": 4.0,
            "bpm": 130,
            "density": 0.7,
            "brightness": 0.8,
        },
    },
]


def pcm_to_wav(pcm_data: bytes, wav_path: Path):
    with wave.open(str(wav_path), "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(SAMPLE_WIDTH)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm_data)


def wav_to_mp3(wav_path: Path, mp3_path: Path):
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(wav_path), "-q:a", "2", str(mp3_path)],
        capture_output=True, check=True
    )
    wav_path.unlink()


async def generate_lyria(track: dict) -> str | None:
    track_id = track["id"]
    print(f"\n--- Generating {track_id} via Lyria RealTime ---")

    pcm_chunks = []
    target_bytes = SAMPLE_RATE * CHANNELS * SAMPLE_WIDTH * CAPTURE_SECONDS

    try:
        async with websockets.connect(WS_URL, max_size=10 * 1024 * 1024) as ws:
            # Step 1: Setup
            await ws.send(json.dumps({"setup": {"model": "models/lyria-realtime-exp"}}))
            print("  Setup sent, waiting for acknowledgment...")
            setup_resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=10))
            if "setupComplete" not in setup_resp:
                print(f"  ERROR: unexpected setup response: {setup_resp}")
                return None
            print("  Setup OK")

            # Step 2: Text prompt (separate from config)
            await ws.send(json.dumps({
                "clientContent": {
                    "weightedPrompts": [{"text": track["text"], "weight": 1.0}]
                }
            }))

            # Step 3: Music generation config (no text fields here)
            await ws.send(json.dumps({"musicGenerationConfig": track["config"]}))

            # Step 4: Start playback
            await ws.send(json.dumps({"playbackControl": "PLAY"}))
            print(f"  Playback started. Capturing {CAPTURE_SECONDS}s...")

            collected = 0
            while collected < target_bytes:
                raw = await asyncio.wait_for(ws.recv(), timeout=15)
                msg = json.loads(raw) if isinstance(raw, str) else json.loads(raw.decode())

                if "serverContent" in msg:
                    for chunk in msg["serverContent"].get("audioChunks", []):
                        audio_bytes = base64.b64decode(chunk["data"])
                        pcm_chunks.append(audio_bytes)
                        collected += len(audio_bytes)
                        pct = min(100, int(collected / target_bytes * 100))
                        print(f"\r  Captured: {pct}% ({collected // 1024} KB)", end="", flush=True)
                elif "error" in msg:
                    print(f"\n  ERROR from server: {msg['error']}")
                    return None

            print(f"\n  Capture complete: {collected // 1024} KB")

    except asyncio.TimeoutError:
        if not pcm_chunks:
            print("\n  ERROR: timeout with no data received")
            return None
        print(f"\n  Timeout — saving partial capture ({sum(len(c) for c in pcm_chunks) // 1024} KB)")
    except Exception as e:
        print(f"\n  ERROR: {e}")
        return None

    if not pcm_chunks:
        print("  ERROR: no audio data collected")
        return None

    pcm_data = b"".join(pcm_chunks)
    wav_path = OUTPUT_DIR / f"music-{track_id}.wav"
    mp3_path = OUTPUT_DIR / f"music-{track_id}.mp3"

    pcm_to_wav(pcm_data, wav_path)
    wav_to_mp3(wav_path, mp3_path)

    size_kb = mp3_path.stat().st_size / 1024
    print(f"  Saved: {mp3_path.name} ({size_kb:.0f} KB)")
    return str(mp3_path)


async def main_async():
    print("=== Lyria RealTime — West African Documentary Music ===")
    print(f"Model: lyria-realtime-exp")
    print(f"Output: {OUTPUT_DIR}\n")

    paths = []
    for track in TRACKS:
        path = await generate_lyria(track)
        if path:
            paths.append(path)

    print("\n=== DONE ===")
    for p in paths:
        print(f"  {Path(p).name}")

    if paths:
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)


def main():
    asyncio.run(main_async())


if __name__ == "__main__":
    main()
