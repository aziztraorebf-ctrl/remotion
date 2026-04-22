"""
Test Gemini 3.1 Flash TTS V3 — Leda avec accents africains
Teste plusieurs descriptions d'accent pour trouver le plus proche
de notre narratrice ElevenLabs.

Usage:
  python3 scripts/tools/test-gemini-tts-v3-accents.py
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


GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment")

client = genai.Client(api_key=GEMINI_API_KEY)

OUTPUT_DIR = "/tmp/gemini-tts-test"
os.makedirs(OUTPUT_DIR, exist_ok=True)

TEXTE = (
    "[solemn] Aujourd'hui encore, les griots du Mali chantent son nom. "
    "[slow] Pas dans les livres. [whispers] De bouche \u00e0 oreille, "
    "de p\u00e8re en fils, [normal] depuis huit si\u00e8cles. "
    "[thoughtful] Il n'existe pas de version d\u00e9finitive de son histoire. "
    "[warm] Chaque griot la raconte \u00e0 sa mani\u00e8re."
)

ACCENTS = [
    (
        "leda-accent-ouest-africain",
        """# AUDIO PROFILE: Djelia
## "La Gardienne des Memoires"
A West African woman in her early 40s. Rich, warm mezzo-soprano.

### DIRECTOR'S NOTES
Style: Warm authority, maternal wisdom
Accent: West African French. The distinctive musicality of Francophone West Africa — Senegalese/Malian intonation patterns, slightly rolled R sounds, open vowels, rhythmic cadence that rises and falls like a song. Think of how educated women from Dakar or Bamako speak French — melodic, warm, with a distinctive lilt.
Pace: Measured, contemplative

#### TRANSCRIPT
"""
    ),
    (
        "leda-accent-griot-musical",
        """# AUDIO PROFILE: Djelia
## "La Gardienne des Memoires"
A West African griotte in her 40s. Her French carries the unmistakable melody of the Mande world.

### DIRECTOR'S NOTES
Style: Sacred storytelling, ancestral gravity
Accent: Mandinka-inflected French. The accent of a woman raised between Bamako and the village — French spoken with the tonal patterns of Bambara underneath. Vowels are warm and round, consonants are soft, the rhythm is unhurried and musical. Not Parisian French — this is the French of the Niger River, of the griot families.
Pace: Slow, deliberate, each phrase a proverb

#### TRANSCRIPT
"""
    ),
    (
        "leda-accent-senegalais",
        """# AUDIO PROFILE: Aminata
## "La Voix de Teranga"
A Senegalese woman, university-educated, mid-30s. Confident and warm.

### DIRECTOR'S NOTES
Style: Modern storyteller, intellectual warmth
Accent: Senegalese French — the elegant, confident French of Dakar. Slightly faster rhythm than Malian French, with characteristic Wolof-influenced intonation. The R is lightly rolled, vowels are clear and open, and there is a natural musicality that distinguishes it immediately from European French.
Pace: Natural, flowing, engaging

#### TRANSCRIPT
"""
    ),
    (
        "leda-accent-conteuse-sahel",
        """# AUDIO PROFILE: Fatoumata
## "La Conteuse du Sahel"
A woman from the Sahel, late 40s. She learned French from her grandmother's stories before she learned it from books.

### DIRECTOR'S NOTES
Style: Intimate fireside storytelling
Accent: Deep Sahelian French — slow, earthy, with the cadence of someone who thinks in Fulani or Bambara before speaking in French. Every sentence has a natural rise and fall, almost sung. The accent is warm and grounding, like red earth under bare feet. Not polished or academic — lived and felt.
Pace: Very slow, hypnotic, with natural pauses between thoughts

#### TRANSCRIPT
"""
    ),
]

print("=" * 60)
print("Gemini 3.1 Flash TTS V3 — Leda + accents africains")
print("=" * 60)

for name, prompt_prefix in ACCENTS:
    full_prompt = prompt_prefix + TEXTE
    print(f"\n--- {name} ---")
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-tts-preview",
            contents=full_prompt,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name="Leda",
                        )
                    )
                ),
            ),
        )
        data = response.candidates[0].content.parts[0].inline_data.data
        out_path = os.path.join(OUTPUT_DIR, f"{name}.wav")
        wave_file(out_path, data)
        duration = len(data) / (24000 * 2)
        print(f"  OK -> {out_path} ({duration:.1f}s)")
    except Exception as e:
        print(f"  ERREUR: {e}")

print("\n" + "=" * 60)
print(f"DONE — 4 variantes d'accent dans {OUTPUT_DIR}/")
print("=" * 60)
