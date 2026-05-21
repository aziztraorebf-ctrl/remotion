#!/usr/bin/env python3
"""
TTS Beat 3b v3 - Or Africain : ajout Afrique du Sud (6e pays diplomatique).
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3.
"""

import os, sys, json, subprocess, requests
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY: print("ELEVENLABS_API_KEY missing"); sys.exit(1)
VOICE_ID = "z3gESu49naEZW8Af2Upm"

# v3 : ajout "et meme l'Afrique du Sud" + soulignement rhetorique
BEAT3B_TTS = """Les États-Unis, le Royaume-Uni, la Chine, le Canada, l'Australie et même l'Afrique du Sud présentent un document conjoint au gouvernement ghanéen.
[tense] Le message : n'allez pas plus loin. Cette loi menace nos investissements.
[pause]
[solemn] Le Ghana a signé quand même."""

BEAT3B_PLAIN = """Les États-Unis, le Royaume-Uni, la Chine, le Canada, l'Australie et même l'Afrique du Sud présentent un document conjoint au gouvernement ghanéen. Le message : n'allez pas plus loin. Cette loi menace nos investissements. Le Ghana a signé quand même."""

OUT = "public/souverain/or-africain/audio/narration-beat3b-v3.mp3"
ALIGN = "public/souverain/or-africain/audio/narration-beat3b-v3-alignment.json"


def gen_tts():
    print("Generation TTS Beat 3b v3 (avec Afrique du Sud)...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"
    payload = {
        "text": BEAT3B_TTS,
        "model_id": "eleven_v3",
        "voice_settings": {"stability": 0.22, "similarity_boost": 0.55, "style": 0.55, "speed": 1.0},
    }
    r = requests.post(url, headers={"xi-api-key": API_KEY, "Content-Type": "application/json"}, json=payload)
    if r.status_code != 200:
        print(f"ERREUR TTS {r.status_code}: {r.text}"); return False
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "wb") as f: f.write(r.content)
    print(f"Saved : {OUT} ({len(r.content)//1024} KB)")
    return True


def align():
    print("Forced alignment...")
    with open(OUT, "rb") as af:
        r = requests.post("https://api.elevenlabs.io/v1/forced-alignment",
                          headers={"xi-api-key": API_KEY},
                          files={"file": ("n.mp3", af, "audio/mpeg")},
                          data={"text": BEAT3B_PLAIN})
    if r.status_code != 200:
        print(f"ERREUR align {r.status_code}: {r.text}"); return None
    result = r.json()
    with open(ALIGN, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    words = result.get("words", [])
    duration = words[-1]["end"] if words else 0
    loss = result.get("loss")
    print(f"Saved : {ALIGN} | duree={duration:.2f}s | mots={len(words)} | loss={loss:.4f}")

    print("\n--- Markers ---")
    targets = ["États-Unis,", "Royaume-Uni,", "Chine,", "Canada,", "l'Australie", "et", "même", "l'Afrique", "Sud", "présentent", "ghanéen.", "investissements.", "signé", "même."]
    for w in words:
        for t in targets:
            if t.lower() == w["text"].lower().strip():
                print(f"  '{w['text']:<20}' {w['start']:.3f}s -> {w['end']:.3f}s")
                break
    return result


def measure():
    r = subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", OUT], capture_output=True, text=True)
    if r.returncode == 0:
        print(f"\nffprobe : {float(r.stdout.strip()):.2f}s")


if __name__ == "__main__":
    if gen_tts():
        align()
        measure()
