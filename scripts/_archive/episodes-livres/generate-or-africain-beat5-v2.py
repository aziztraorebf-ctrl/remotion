#!/usr/bin/env python3
"""
TTS Beat 5 v2 — Or Africain (suppression "Le Ghana a signe la loi", trop redondant)
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3
Config: max-style (stability 0.22, style 0.55) — meme que master
"""

import os
import json
import subprocess
import sys
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERREUR: ELEVENLABS_API_KEY manquante dans env")
    sys.exit(1)

VOICE_ID = "z3gESu49naEZW8Af2Upm"
OUTPUT_PATH = "public/souverain/or-africain/audio/narration-beat5-v2.mp3"
ALIGNMENT_OUTPUT = "public/souverain/or-africain/audio/narration-beat5-v2-alignment.json"

# Tags V3 conserves pour coherence avec master (pause + whispers sur Discretement)
SCRIPT_TTS = """L'Afrique commence à changer les règles de son propre sous-sol.
[pause]
[whispers] Discrètement. Sans que personne n'en parle."""

# Plain text pour forced alignment (sans tags V3)
SCRIPT_PLAIN = """L'Afrique commence à changer les règles de son propre sous-sol. Discrètement. Sans que personne n'en parle."""


def generate_tts():
    print("Generation TTS Beat 5 v2...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    payload = {
        "text": SCRIPT_TTS,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.22,
            "similarity_boost": 0.55,
            "style": 0.55,
            "speed": 1.0,
        },
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"ERREUR TTS {response.status_code}: {response.text}")
        return False

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "wb") as f:
        f.write(response.content)
    size_kb = len(response.content) // 1024
    print(f"Audio sauvegarde : {OUTPUT_PATH} ({size_kb} KB)")
    return True


def run_forced_alignment():
    print("Forced alignment...")
    url = "https://api.elevenlabs.io/v1/forced-alignment"
    headers = {"xi-api-key": API_KEY}

    with open(OUTPUT_PATH, "rb") as audio_file:
        files = {"file": ("narration.mp3", audio_file, "audio/mpeg")}
        data = {"text": SCRIPT_PLAIN}
        response = requests.post(url, headers=headers, files=files, data=data)

    if response.status_code != 200:
        print(f"ERREUR Forced Alignment {response.status_code}: {response.text}")
        return None

    result = response.json()
    with open(ALIGNMENT_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Alignment sauvegarde : {ALIGNMENT_OUTPUT}")
    words = result.get("words", [])
    if words:
        duration = words[-1]["end"]
        print(f"Duree narration : {duration:.2f}s")
        print(f"Mots alignes : {len(words)}")
        loss = result.get("loss")
        if loss is not None:
            print(f"Score loss : {loss:.4f}")
        print()
        print("=== Markers ===")
        for w in words:
            txt = w["text"]
            if txt in ("L'Afrique", "changer", "sous-sol.", "Discrètement.", "parle."):
                print(f"  '{txt}' -> {w['start']:.2f}s -> {w['end']:.2f}s")
    return result


def measure_ffprobe():
    print()
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", OUTPUT_PATH],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"ffprobe duree totale : {float(result.stdout.strip()):.2f}s")


if __name__ == "__main__":
    if generate_tts():
        run_forced_alignment()
        measure_ffprobe()
