"""
Test Gemini 3.1 Flash TTS V2 — avec prompt structure (Audio Profile + Scene + Director's Notes)
Compare : voix sculptee vs preset brut

Usage:
  python3 scripts/tools/test-gemini-tts-v2.py

Output:
  /tmp/gemini-tts-test/
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

# --- PROMPT NARRATEUR MASCULIN (Acte VII) ---
PROMPT_NARRATEUR = """
# AUDIO PROFILE: Griot Moderne
## "Le Conteur des Heros Oublies"
A West African storyteller in his late 40s. Deep, resonant baritone voice with natural warmth. He carries the weight of centuries of oral tradition. His voice commands attention without shouting.

## THE SCENE: Transmission orale au coin du feu
Night in the Sahel. A kora plays softly in the distance. The griot speaks about legacy and memory to a circle of silent listeners.

### DIRECTOR'S NOTES
Style: Warm reverence, gentle pride, gravitas naturelle
Accent: Francais ouest-africain cultive, articulation claire, voyelles ouvertes
Pace: Slow, contemplative, each word chosen with care

### SAMPLE CONTEXT
Narrateur principal d'une serie YouTube sur les heros africains oublies. Ton solennel mais accessible. Il raconte, il ne fait pas cours.

#### TRANSCRIPT
[solemn] Aujourd'hui encore, les griots du Mali chantent son nom.

[slow] Pas dans les livres. [whispers] De bouche \u00e0 oreille, de p\u00e8re en fils, [normal] depuis huit si\u00e8cles.

[thoughtful] Il n'existe pas de version d\u00e9finitive de son histoire.

[warm] Chaque griot la raconte \u00e0 sa mani\u00e8re.
"""

# --- PROMPT NARRATRICE FEMININE (Acte VII) ---
PROMPT_NARRATRICE = """
# AUDIO PROFILE: Djelia
## "La Gardienne des Memoires"
A West African woman in her early 40s. Rich, warm mezzo-soprano voice with natural authority. She speaks as a keeper of ancestral memory. Her voice has the musicality of the griot tradition.

## THE SCENE: Transmission orale au coin du feu
Night in the Sahel. A kora plays softly. She speaks to the next generation about keeping memory alive.

### DIRECTOR'S NOTES
Style: Warm authority, maternal wisdom, quiet pride
Accent: Francais ouest-africain, melodique et musical, voyelles ouvertes
Pace: Slow, meditative, each sentence lands like a proverb

### SAMPLE CONTEXT
Narratrice documentaire YouTube sur les heros africains oublies. Voix feminine avec gravite naturelle. Elle temoigne, elle ne dramatise pas.

#### TRANSCRIPT
[warm, reverent] Aujourd'hui encore, les griots du Mali chantent son nom.

[gentle] Pas dans les livres. [whispers] De bouche \u00e0 oreille, de p\u00e8re en fils, [normal] depuis huit si\u00e8cles.

[reflective] Il n'existe pas de version d\u00e9finitive de son histoire.

[smiling, tender] Chaque griot la raconte \u00e0 sa mani\u00e8re.
"""

TESTS = [
    ("narrateur-charon-sculpted", PROMPT_NARRATEUR, "Charon"),
    ("narrateur-enceladus-sculpted", PROMPT_NARRATEUR, "Enceladus"),
    ("narratrice-kore-sculpted", PROMPT_NARRATRICE, "Kore"),
    ("narratrice-leda-sculpted", PROMPT_NARRATRICE, "Leda"),
    ("narratrice-aoede-sculpted", PROMPT_NARRATRICE, "Aoede"),
]

print("=" * 60)
print("Gemini 3.1 Flash TTS V2 — Voix sculptees")
print("=" * 60)

for name, prompt, voix in TESTS:
    print(f"\n--- {name} (voix: {voix}) ---")
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-tts-preview",
            contents=prompt,
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
        data = response.candidates[0].content.parts[0].inline_data.data
        out_path = os.path.join(OUTPUT_DIR, f"{name}.wav")
        wave_file(out_path, data)
        duration = len(data) / (24000 * 2)
        print(f"  OK -> {out_path} ({duration:.1f}s)")
    except Exception as e:
        print(f"  ERREUR: {e}")

print("\n" + "=" * 60)
print(f"DONE — fichiers dans {OUTPUT_DIR}/")
print("=" * 60)
