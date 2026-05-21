#!/usr/bin/env python3
"""
TTS generation — Zimbabwe Lithium script V5 FINAL
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3
"""

import os
import json
import subprocess
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "z3gESu49naEZW8Af2Upm"
OUTPUT_PATH = "public/souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1.mp3"
ALIGNMENT_OUTPUT = "public/souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1-alignment.json"

# Script TTS annote eleven_v3
SCRIPT_TTS = """[tense] Un pays de seize millions d'habitants a fait bouger le prix de ta future voiture électrique de dix pour cent en une nuit.
[pause]
Le Zimbabwe. L'un des quatre premiers producteurs mondiaux de lithium — la matière première de toutes les batteries, tous les téléphones, toutes les voitures électriques.
Le minerai partait brut. Faute d'usines sur place, une tonne valait quelques centaines de dollars à l'export.
Transformée en Chine en composant de batterie — elle vaut quinze fois plus.
[pause]
[dramatic tone] Le gouvernement découvre que les entreprises déclarent le minerai moins cher qu'il ne vaut — pour payer moins de taxes au Zimbabwe.
Il interdit tout export de minerai brut.
Tu veux exporter — tu transformes d'abord sur place.
[tense] Les marchés s'affolent. Plus dix pour cent à Shanghai en vingt-quatre heures.
[pause]
[solemn] Le Zimbabwe a gagné sa bataille industrielle. Mais à quel prix ?
[pause]
Deux mois plus tard, la première usine de transformation du continent ouvre ses portes.
Elle appartient à Huayou Cobalt. Chinoise.
Quatre cents millions de dollars investis.
La Chine a construit exactement ce que le Zimbabwe exigeait.
[pause]
[quietly] Le Zimbabwe a forcé la Chine à jouer selon ses règles.
La Chine a joué — et a bâti l'usine.
[whispers] Qui a vraiment gagné ?"""

# Texte plain pour forced alignment (sans tags V3)
SCRIPT_PLAIN = """Un pays de seize millions d'habitants a fait bouger le prix de ta future voiture électrique de dix pour cent en une nuit.
Le Zimbabwe. L'un des quatre premiers producteurs mondiaux de lithium — la matière première de toutes les batteries, tous les téléphones, toutes les voitures électriques.
Le minerai partait brut. Faute d'usines sur place, une tonne valait quelques centaines de dollars à l'export.
Transformée en Chine en composant de batterie — elle vaut quinze fois plus.
Le gouvernement découvre que les entreprises déclarent le minerai moins cher qu'il ne vaut — pour payer moins de taxes au Zimbabwe.
Il interdit tout export de minerai brut.
Tu veux exporter — tu transformes d'abord sur place.
Les marchés s'affolent. Plus dix pour cent à Shanghai en vingt-quatre heures.
Le Zimbabwe a gagné sa bataille industrielle. Mais à quel prix ?
Deux mois plus tard, la première usine de transformation du continent ouvre ses portes.
Elle appartient à Huayou Cobalt. Chinoise.
Quatre cents millions de dollars investis.
La Chine a construit exactement ce que le Zimbabwe exigeait.
Le Zimbabwe a forcé la Chine à jouer selon ses règles.
La Chine a joué — et a bâti l'usine.
Qui a vraiment gagné ?"""

def generate_tts():
    print("Generating TTS via ElevenLabs V3...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps"
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "text": SCRIPT_TTS,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.22,
            "similarity_boost": 0.80,
            "style": 0.55,
            "use_speaker_boost": True
        }
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"ERROR: {response.status_code} — {response.text}")
        return False

    data = response.json()
    audio_b64 = data.get("audio_base64", "")
    alignment = data.get("alignment", {})

    import base64
    audio_bytes = base64.b64decode(audio_b64)
    with open(OUTPUT_PATH, "wb") as f:
        f.write(audio_bytes)
    print(f"Audio saved: {OUTPUT_PATH}")

    with open(ALIGNMENT_OUTPUT, "w") as f:
        json.dump(alignment, f, ensure_ascii=False, indent=2)
    print(f"Alignment saved: {ALIGNMENT_OUTPUT}")
    return True

def measure_duration():
    print("\nMeasuring duration with ffprobe...")
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "json", OUTPUT_PATH],
        capture_output=True, text=True
    )
    data = json.loads(result.stdout)
    duration = float(data["format"]["duration"])
    frames_30fps = int(duration * 30)
    print(f"Duration: {duration:.3f}s ({frames_30fps} frames @ 30fps)")
    return duration, frames_30fps

if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: ELEVENLABS_API_KEY not set")
        exit(1)
    ok = generate_tts()
    if ok:
        duration, frames = measure_duration()
        print(f"\nSUMMARY")
        print(f"  Audio : {OUTPUT_PATH}")
        print(f"  Duration : {duration:.3f}s")
        print(f"  Frames @ 30fps : {frames}")
