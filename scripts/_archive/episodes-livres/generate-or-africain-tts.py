#!/usr/bin/env python3
"""
TTS generation + Forced Alignment — Or Africain script V2
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3
Config: max-style (stability 0.22, style 0.55)
"""

import os
import json
import subprocess
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY", "sk_3db028ca13456f1acdc83d298cbc9be688935afd676ec9eb")
VOICE_ID = "z3gESu49naEZW8Af2Upm"
OUTPUT_PATH = "public/poc-money-legends/audio/narration-or-africain-v1.mp3"
ALIGNMENT_OUTPUT = "public/poc-money-legends/audio/narration-or-africain-v1-alignment.json"

# Script TTS annote eleven_v3
SCRIPT_TTS = """[tense] Le prix de l'or vient de battre tous les records.
[pause]
Six gouvernements se sont levés contre le Ghana.
Le Ghana a signé quand même.

Depuis deux mille dix, le Ghana touchait cinq pour cent de royalties sur son or — peu importe si le prix était à mille ou cinq mille dollars l'once.
Les multinationales encaissaient toute la hausse.
[pause] L'État ghanéen ? Rien.

[dramatic tone] En janvier deux mille vingt-six, l'or dépasse cinq mille dollars l'once pour la première fois de l'histoire.
Le Ghana propose des royalties progressives : de cinq pour cent à douze pour cent selon le cours.
Les États-Unis, le Royaume-Uni, la Chine, le Canada et l'Australie écrivent une lettre officielle au gouvernement ghanéen.
[tense] Le message : n'allez pas plus loin. Cette loi menace nos investissements.
[pause]
[solemn] Le Ghana a signé quand même.

[awe] Et le Ghana n'est pas un cas isolé.
Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol.
Le Mali a saisi trois tonnes d'or à Barrick Mining — quatre cent trente millions de dollars de règlement.
Le Burkina Faso a revu son code minier.
Le Niger a nationalisé sa seule mine industrielle.
[proud] Quatre pays. Un même signal.

[quietly] Le Ghana a signé la loi.
L'Afrique commence à changer les règles de son propre sous-sol.
[whispers] Discrètement. Sans que personne n'en parle."""

# Texte plain pour forced alignment (sans tags V3)
SCRIPT_PLAIN = """Le prix de l'or vient de battre tous les records.
Six gouvernements se sont levés contre le Ghana.
Le Ghana a signé quand même.

Depuis deux mille dix, le Ghana touchait cinq pour cent de royalties sur son or — peu importe si le prix était à mille ou cinq mille dollars l'once.
Les multinationales encaissaient toute la hausse.
L'État ghanéen ? Rien.

En janvier deux mille vingt-six, l'or dépasse cinq mille dollars l'once pour la première fois de l'histoire.
Le Ghana propose des royalties progressives : de cinq pour cent à douze pour cent selon le cours.
Les États-Unis, le Royaume-Uni, la Chine, le Canada et l'Australie écrivent une lettre officielle au gouvernement ghanéen.
Le message : n'allez pas plus loin. Cette loi menace nos investissements.
Le Ghana a signé quand même.

Et le Ghana n'est pas un cas isolé.
Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol.
Le Mali a saisi trois tonnes d'or à Barrick Mining — quatre cent trente millions de dollars de règlement.
Le Burkina Faso a revu son code minier.
Le Niger a nationalisé sa seule mine industrielle.
Quatre pays. Un même signal.

Le Ghana a signé la loi.
L'Afrique commence à changer les règles de son propre sous-sol.
Discrètement. Sans que personne n'en parle."""


def generate_tts():
    print("Generation TTS...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
    }
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
        print(f"Duree totale audio : {duration:.2f}s")
        print(f"Nombre de mots alignes : {len(words)}")
        print(f"Score confiance global (loss) : {result.get('loss', 'N/A'):.4f}")
        print()
        print("=== Timestamps beat markers ===")
        markers = {"records.": "Beat1 fin", "quand": "Hook fin", "Rien.": "Beat2 fin",
                   "investissements.": "Beat3 fin", "signal.": "Beat4 fin", "parle.": "Beat5 fin"}
        for word in words:
            if word["text"] in markers:
                print(f"  {markers[word['text']]} '{word['text']}' -> {word['end']:.2f}s")
    return result


def measure_ffprobe():
    print()
    print("Mesure ffprobe independante :")
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", OUTPUT_PATH],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"  Duree : {float(result.stdout.strip()):.2f}s")
    else:
        print(f"  ffprobe error: {result.stderr}")


if __name__ == "__main__":
    ok = generate_tts()
    if ok:
        run_forced_alignment()
        measure_ffprobe()
