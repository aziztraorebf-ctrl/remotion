#!/usr/bin/env python3
"""
TTS + Forced Alignment — "La vraie taille de l'Afrique" (refonte audio 2026-05-12)
Voix: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm), eleven_v3, config max-style.
5 beats avec VO (beat3 inclus — refonte complete du script).
"""

import os, sys, json, subprocess, requests
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ELEVENLABS_API_KEY missing")
    sys.exit(1)

VOICE_ID = "z3gESu49naEZW8Af2Upm"
OUT_DIR = "public/souverain/vraie-taille-afrique/audio"

VOICE_SETTINGS = {
    "stability": 0.22,
    "similarity_boost": 0.55,
    "style": 0.55,
    "speed": 1.0,
}

BEATS = [
    {
        "id": "beat1",
        "tts": "[tense] Tu connais cette carte. Mais tu ne connais pas l'Afrique.",
        "plain": "Tu connais cette carte. Mais tu ne connais pas l'Afrique.",
    },
    {
        "id": "beat2",
        "tts": (
            "[calm] Voici la vraie projection. Elle s'appelle Equal Earth.\n"
            "[awe] Regarde : les quarante-huit États américains entrent dedans. "
            "La Chine aussi. Toute l'Europe. Et l'Inde.\n"
            "[proud] L'Afrique les contient tous."
        ),
        "plain": (
            "Voici la vraie projection. Elle s'appelle Equal Earth. "
            "Regarde : les quarante-huit États américains entrent dedans. "
            "La Chine aussi. Toute l'Europe. Et l'Inde. "
            "L'Afrique les contient tous."
        ),
    },
    {
        "id": "beat3",
        "tts": "[solemn] Trente virgule trois millions de kilomètres carrés.",
        "plain": "Trente virgule trois millions de kilomètres carrés.",
    },
    {
        "id": "beat4",
        "tts": (
            "[solemn] Sur la carte Mercator, le Groenland semble aussi grand que l'Afrique. [pause] "
            "En réalité, l'Afrique est QUATORZE fois plus grande.\n"
            "Le Groenland fait deux millions de kilomètres carrés.\n"
            "[dramatic tone] L'Afrique en fait trente. [pause] "
            "Et pourtant, depuis mille cinq cent soixante-neuf, "
            "cette carte conçue pour les marins est dans tous les manuels scolaires du monde."
        ),
        "plain": (
            "Sur la carte Mercator, le Groenland semble aussi grand que l'Afrique. "
            "En réalité, l'Afrique est quatorze fois plus grande. "
            "Le Groenland fait deux millions de kilomètres carrés. "
            "L'Afrique en fait trente. "
            "Et pourtant, depuis mille cinq cent soixante-neuf, "
            "cette carte conçue pour les marins est dans tous les manuels scolaires du monde."
        ),
    },
    {
        "id": "beat5",
        "tts": (
            "[awe] Maintenant tu sais.\n"
            "L'Afrique est bien plus grande que tu ne le croyais. "
            "Et tu le vois enfin à sa vraie taille.\n"
            "[calm] Partage cette vidéo à quelqu'un qui ne le sait pas encore."
        ),
        "plain": (
            "Maintenant tu sais. "
            "L'Afrique est bien plus grande que tu ne le croyais. "
            "Et tu le vois enfin à sa vraie taille. "
            "Partage cette vidéo à quelqu'un qui ne le sait pas encore."
        ),
    },
]


def gen_tts(beat):
    bid = beat["id"]
    out_path = f"{OUT_DIR}/narration-{bid}.mp3"
    print(f"\n[{bid}] Generation TTS...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"
    payload = {
        "text": beat["tts"],
        "model_id": "eleven_v3",
        "voice_settings": VOICE_SETTINGS,
    }
    r = requests.post(
        url,
        headers={"xi-api-key": API_KEY, "Content-Type": "application/json"},
        json=payload,
        timeout=60,
    )
    if r.status_code != 200:
        print(f"  ERREUR TTS {r.status_code}: {r.text}")
        return False
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(r.content)
    print(f"  Saved : {out_path} ({len(r.content) // 1024} KB)")
    return True


def align(beat):
    bid = beat["id"]
    mp3_path = f"{OUT_DIR}/narration-{bid}.mp3"
    align_path = f"{OUT_DIR}/narration-{bid}-alignment.json"
    print(f"[{bid}] Forced alignment...")
    with open(mp3_path, "rb") as af:
        r = requests.post(
            "https://api.elevenlabs.io/v1/forced-alignment",
            headers={"xi-api-key": API_KEY},
            files={"file": ("n.mp3", af, "audio/mpeg")},
            data={"text": beat["plain"]},
            timeout=60,
        )
    if r.status_code != 200:
        print(f"  ERREUR align {r.status_code}: {r.text}")
        return None
    result = r.json()
    with open(align_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    words = result.get("words", [])
    duration = words[-1]["end"] if words else 0
    loss = result.get("loss", 0)
    print(f"  Saved : {align_path} | duree={duration:.2f}s | mots={len(words)} | loss={loss:.4f}")
    return result


def measure(beat):
    bid = beat["id"]
    mp3_path = f"{OUT_DIR}/narration-{bid}.mp3"
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", mp3_path],
        capture_output=True, text=True,
    )
    if r.returncode == 0:
        print(f"  ffprobe : {float(r.stdout.strip()):.2f}s")
    return float(r.stdout.strip()) if r.returncode == 0 else None


if __name__ == "__main__":
    print("=== TTS + Alignment — La vraie taille de l'Afrique (refonte 2026-05-12) ===")
    print(f"Voix : {VOICE_ID} (Narratrice GeoAfrique v2)")
    print(f"Beats : {[b['id'] for b in BEATS]}\n")

    durations = {}
    for beat in BEATS:
        if gen_tts(beat):
            align(beat)
            d = measure(beat)
            if d:
                durations[beat["id"]] = d

    print("\n=== RESUME DUREES ===")
    for bid, dur in durations.items():
        frames = round(dur * 30)
        print(f"  {bid}: {dur:.2f}s = {frames}f")

    print("\n=== DONE ===")
    print("Fichiers dans :", OUT_DIR)
