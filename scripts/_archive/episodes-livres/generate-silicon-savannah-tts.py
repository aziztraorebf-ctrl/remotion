#!/usr/bin/env python3
"""
TTS generation - Silicon Savannah (Kenya M-Pesa) Script V5 LOCKED
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3
"""

import os
import json
import requests

API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "z3gESu49naEZW8Af2Upm"
OUTPUT_DIR = "public/souverain/silicon-savannah/audio"
OUTPUT_PATH = f"{OUTPUT_DIR}/narration-v3.mp3"
ALIGNMENT_OUTPUT = f"{OUTPUT_DIR}/narration-v3-alignment.json"

SCRIPT_TTS = """[dramatic tone] En deux mille vingt-cinq, un pays africain a la plus forte pénétration de paiements mobiles au monde.
Pas la Chine. Pas les États-Unis.
[awe] Le Kenya.

Tout commence en deux mille sept. Safaricom lance M-Pesa.
Un service de paiement par SMS.
[proud] Pas de smartphone. Pas d'appli. Pas de banque. Juste un réseau et un vieux Nokia.

[excited] Dix-huit ans plus tard.
Neuf Kenyans sur dix disposent d'un compte mobile money actif — le taux le plus élevé au monde.
Trois cent mille points de paiement physiques dans tout le pays — des kiosques, des épiceries, des pharmacies.
Des familles séparées par des centaines de kilomètres envoient de l'argent en secondes.
[solemn] C'était une révolution réelle.

[tense] Mais voilà ce qu'on dit moins.
Deux cents shillings envoyés — sept shillings de frais. Moins d'un centime d'euro.
Cinquante mille shillings envoyés — cent huit shillings de frais. Moins d'un euro.
[dramatic tone] Même service. Même tuyau. Plus la somme est petite, plus le pourcentage est élevé.
C'est dans le barème officiel de Safaricom.

[solemn] La Banque Centrale du Kenya a laissé M-Pesa opérer sept ans avant d'imposer un cadre réglementaire complet — ce que la BCK appelait elle-même une approche test-and-learn.
Sept ans pendant lesquels une seule entreprise privée est devenue l'infrastructure financière d'un pays entier.
[whispers] Un seul service. Les rails de tout un pays.

[solemn] M-Pesa a sorti des millions de Kenyans de l'exclusion financière. C'est vrai.
Et les rails sur lesquels circule cet argent — ton salaire, tes frais de scolarité, tes urgences — appartiennent à une seule entreprise privée.
[tense] La question n'est pas si M-Pesa est bon ou mauvais.
[dramatic tone] La question c'est : qui décide ?

[curious] Et dans ton pays — qui contrôle ces rails ? Une entreprise privée ou l'État ?
Réponds en commentaire."""

SCRIPT_PLAIN = """En deux mille vingt-cinq, un pays africain a la plus forte pénétration de paiements mobiles au monde.
Pas la Chine. Pas les États-Unis.
Le Kenya.

Tout commence en deux mille sept. Safaricom lance M-Pesa.
Un service de paiement par SMS.
Pas de smartphone. Pas d'appli. Pas de banque. Juste un réseau et un vieux Nokia.

Dix-huit ans plus tard.
Neuf Kenyans sur dix disposent d'un compte mobile money actif — le taux le plus élevé au monde.
Trois cent mille points de paiement physiques dans tout le pays — des kiosques, des épiceries, des pharmacies.
Des familles séparées par des centaines de kilomètres envoient de l'argent en secondes.
C'était une révolution réelle.

Mais voilà ce qu'on dit moins.
Deux cents shillings envoyés — sept shillings de frais. Moins d'un centime d'euro.
Cinquante mille shillings envoyés — cent huit shillings de frais. Moins d'un euro.
Même service. Même tuyau. Plus la somme est petite, plus le pourcentage est élevé.
C'est dans le barème officiel de Safaricom.

La Banque Centrale du Kenya a laissé M-Pesa opérer sept ans avant d'imposer un cadre réglementaire complet — ce que la BCK appelait elle-même une approche test-and-learn.
Sept ans pendant lesquels une seule entreprise privée est devenue l'infrastructure financière d'un pays entier.
Un seul service. Les rails de tout un pays.

M-Pesa a sorti des millions de Kenyans de l'exclusion financière. C'est vrai.
Et les rails sur lesquels circule cet argent — ton salaire, tes frais de scolarité, tes urgences — appartiennent à une seule entreprise privée.
La question n'est pas si M-Pesa est bon ou mauvais.
La question c'est : qui décide ?

Et dans ton pays — qui contrôle ces rails ? Une entreprise privée ou l'État ?
Réponds en commentaire."""


def generate_tts():
    print("Generating TTS via ElevenLabs V3...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps"
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
            "speed": 1.25,
        },
        "output_format": "mp3_44100_128",
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"ERROR {response.status_code}: {response.text}")
        return False

    data = response.json()

    audio_b64 = data.get("audio_base64", "")
    if audio_b64:
        import base64
        audio_bytes = base64.b64decode(audio_b64)
        with open(OUTPUT_PATH, "wb") as f:
            f.write(audio_bytes)
        print(f"Audio saved: {OUTPUT_PATH} ({len(audio_bytes)/1024:.1f} KB)")
    else:
        print("ERROR: no audio_base64 in response")
        return False

    alignment = data.get("alignment", {})
    if alignment:
        with open(ALIGNMENT_OUTPUT, "w") as f:
            json.dump(alignment, f, indent=2)
        print(f"Alignment saved: {ALIGNMENT_OUTPUT}")

    return True


def measure_duration():
    import subprocess
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", OUTPUT_PATH],
        capture_output=True, text=True
    )
    duration = float(result.stdout.strip())
    print(f"\nDuration: {duration:.2f}s ({duration/60:.1f} min)")
    frames_30fps = int(duration * 30)
    print(f"Frames @30fps: {frames_30fps}")
    return duration


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: ELEVENLABS_API_KEY not set")
        exit(1)

    success = generate_tts()
    if success:
        measure_duration()
        print("\nDone. Next: manifest visuel + timing.ts")
