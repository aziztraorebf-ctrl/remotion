#!/usr/bin/env python3
"""
TTS Beat 3b v2 + Beat 4 v2 - Or Africain corrections factuelles post-Perplexity fact-check.
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3 - meme config que master.
"""

import os, sys, json, subprocess, requests
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY: print("ELEVENLABS_API_KEY missing"); sys.exit(1)
VOICE_ID = "z3gESu49naEZW8Af2Upm"

# Beat 3b v2 - "lettre officielle" -> "document conjoint"
BEAT3B_TTS = """Les États-Unis, le Royaume-Uni, la Chine, le Canada et l'Australie présentent un document conjoint au gouvernement ghanéen.
[tense] Le message : n'allez pas plus loin. Cette loi menace nos investissements.
[pause]
[solemn] Le Ghana a signé quand même."""

BEAT3B_PLAIN = """Les États-Unis, le Royaume-Uni, la Chine, le Canada et l'Australie présentent un document conjoint au gouvernement ghanéen. Le message : n'allez pas plus loin. Cette loi menace nos investissements. Le Ghana a signé quand même."""

BEAT3B_OUT = "public/souverain/or-africain/audio/narration-beat3b-v2.mp3"
BEAT3B_ALIGN = "public/souverain/or-africain/audio/narration-beat3b-v2-alignment.json"

# Beat 4 v2 - "sa seule mine industrielle" -> "sa principale mine d'uranium"
BEAT4_TTS = """[awe] Et le Ghana n'est pas un cas isolé.
Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol.
Le Mali a saisi trois tonnes d'or à Barrick Mining — quatre cent trente millions de dollars de règlement.
Le Burkina Faso a revu son code minier.
Le Niger a nationalisé sa principale mine d'uranium.
[proud] Quatre pays. Un même signal."""

BEAT4_PLAIN = """Et le Ghana n'est pas un cas isolé. Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol. Le Mali a saisi trois tonnes d'or à Barrick Mining — quatre cent trente millions de dollars de règlement. Le Burkina Faso a revu son code minier. Le Niger a nationalisé sa principale mine d'uranium. Quatre pays. Un même signal."""

BEAT4_OUT = "public/souverain/or-africain/audio/narration-beat4-v2.mp3"
BEAT4_ALIGN = "public/souverain/or-africain/audio/narration-beat4-v2-alignment.json"


def gen_tts(script_tts, out_path, label):
    print(f"\n=== {label} TTS ===")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"
    payload = {
        "text": script_tts,
        "model_id": "eleven_v3",
        "voice_settings": {"stability": 0.22, "similarity_boost": 0.55, "style": 0.55, "speed": 1.0},
    }
    r = requests.post(url, headers={"xi-api-key": API_KEY, "Content-Type": "application/json"}, json=payload)
    if r.status_code != 200:
        print(f"ERREUR TTS {r.status_code}: {r.text}"); return False
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f: f.write(r.content)
    print(f"Saved : {out_path} ({len(r.content)//1024} KB)")
    return True


def align(script_plain, audio_path, out_path, label):
    print(f"=== {label} alignment ===")
    with open(audio_path, "rb") as af:
        r = requests.post("https://api.elevenlabs.io/v1/forced-alignment",
                          headers={"xi-api-key": API_KEY},
                          files={"file": ("n.mp3", af, "audio/mpeg")},
                          data={"text": script_plain})
    if r.status_code != 200:
        print(f"ERREUR align {r.status_code}: {r.text}"); return None
    result = r.json()
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    words = result.get("words", [])
    duration = words[-1]["end"] if words else 0
    loss = result.get("loss")
    print(f"Saved : {out_path} | duree={duration:.2f}s | mots={len(words)} | loss={loss:.4f}")
    return result, duration


def measure(audio_path):
    r = subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", audio_path], capture_output=True, text=True)
    if r.returncode == 0:
        return float(r.stdout.strip())
    return None


def print_markers(result, label, words_to_track):
    print(f"\n--- {label} markers ---")
    for w in result.get("words", []):
        for target in words_to_track:
            if target.lower() in w["text"].lower():
                print(f"  '{w['text']}' -> {w['start']:.3f}s -> {w['end']:.3f}s")
                break


if __name__ == "__main__":
    # Beat 3b
    if gen_tts(BEAT3B_TTS, BEAT3B_OUT, "Beat 3b"):
        result, _ = align(BEAT3B_PLAIN, BEAT3B_OUT, BEAT3B_ALIGN, "Beat 3b")
        if result:
            print_markers(result, "Beat 3b",
                ["États-Unis", "Royaume-Uni", "Chine", "Canada", "Australie", "présentent", "ghanéen.", "investissements.", "signé", "même."])
        ffd = measure(BEAT3B_OUT)
        if ffd: print(f"  ffprobe : {ffd:.2f}s")

    # Beat 4
    if gen_tts(BEAT4_TTS, BEAT4_OUT, "Beat 4"):
        result, _ = align(BEAT4_PLAIN, BEAT4_OUT, BEAT4_ALIGN, "Beat 4")
        if result:
            print_markers(result, "Beat 4",
                ["isolé.", "Mali", "Barrick", "millions", "Burkina", "Niger", "uranium.", "Quatre", "signal."])
        ffd = measure(BEAT4_OUT)
        if ffd: print(f"  ffprobe : {ffd:.2f}s")
