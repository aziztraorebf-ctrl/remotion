"""
Test A/B : Gemini 3.1 Flash TTS vs ElevenLabs
Segment : Acte VII Soundjata (griots, ~13s)

Usage:
  python3 scripts/tools/test-gemini-tts.py

Output:
  /tmp/gemini-tts-test-acte7.wav
"""

import os
import wave
from google import genai
from google.genai import types


def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


# --- Config ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment")

client = genai.Client(api_key=GEMINI_API_KEY)

# Acte VII texte (griots, legende vivante) — meme texte que narration ElevenLabs
TEXTE_ACTE_VII = (
    "Aujourd'hui encore, les griots du Mali chantent son nom. "
    "Pas dans les livres, de bouche a oreille, de pere en fils, depuis huit siecles. "
    "Il n'existe pas de version definitive de son histoire. "
    "Chaque griot la raconte a sa maniere."
)

# Version avec accents corrects + audio tags expressifs
TEXTE_ACTE_VII_EXPRESSIF = (
    "[solemn] Aujourd'hui encore, les griots du Mali chantent son nom. "
    "[slow] Pas dans les livres, [whispers] de bouche \u00e0 oreille, "
    "de p\u00e8re en fils, [normal] depuis huit si\u00e8cles. "
    "[thoughtful] Il n'existe pas de version d\u00e9finitive de son histoire. "
    "[warm] Chaque griot la raconte \u00e0 sa mani\u00e8re."
)

# 30 voix disponibles — tester les voix graves/masculines pour narrateur
VOIX_A_TESTER = [
    "Charon",    # voix masculine grave (candidate narrateur)
    "Orus",      # voix masculine
    "Enceladus", # voix masculine profonde
]

OUTPUT_DIR = "/tmp"

print("=" * 60)
print("Gemini 3.1 Flash TTS — Test A/B Soundjata Acte VII")
print("=" * 60)

for i, voix in enumerate(VOIX_A_TESTER):
    print(f"\n--- Test {i+1}/{len(VOIX_A_TESTER)} : voix '{voix}' ---")

    # Version simple (sans tags)
    print(f"  Generating version simple...")
    try:
        response_simple = client.models.generate_content(
            model="gemini-3.1-flash-tts-preview",
            contents=TEXTE_ACTE_VII,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voix,
                        )
                    )
                ),
            ),
        )
        data_simple = response_simple.candidates[0].content.parts[0].inline_data.data
        out_simple = os.path.join(OUTPUT_DIR, f"gemini-tts-{voix.lower()}-simple.wav")
        wave_file(out_simple, data_simple)
        print(f"  OK -> {out_simple}")
    except Exception as e:
        print(f"  ERREUR version simple: {e}")
        continue

    # Version expressive (avec audio tags)
    print(f"  Generating version expressive (audio tags)...")
    try:
        response_expr = client.models.generate_content(
            model="gemini-3.1-flash-tts-preview",
            contents=TEXTE_ACTE_VII_EXPRESSIF,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voix,
                        )
                    )
                ),
            ),
        )
        data_expr = response_expr.candidates[0].content.parts[0].inline_data.data
        out_expr = os.path.join(OUTPUT_DIR, f"gemini-tts-{voix.lower()}-expressif.wav")
        wave_file(out_expr, data_expr)
        print(f"  OK -> {out_expr}")
    except Exception as e:
        print(f"  ERREUR version expressive: {e}")

print("\n" + "=" * 60)
print("DONE — 6 fichiers WAV generes dans /tmp/")
print("Comparer avec ElevenLabs : public/assets/library/geoafrique/heros-oublies/soundjata/narration-full.mp3")
print("(segment Acte VII : 108.98s a 122.20s)")
print("=" * 60)
