"""Forced alignment ElevenLabs v2 pour Soudan Acte 5 (5 beats, texte plain sans tags V3)."""
import json
import os
import re
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
AUDIO = ROOT / "public/_shared/audio/soudan/acte5-reseau-ombre.mp3"
OUT_ALIGN = ROOT / "public/_shared/audio/soudan/acte5-reseau-ombre-alignment.json"

# Texte PLAIN correspondant exactement à l'audio généré (avec les 2 reformulations TTS,
# nombres en toutes lettres comme envoyés à la synthèse, sans tags [..]).
FULL_TEXT = (
    "Cette organisation, on y reviendra. Mais avant, il faut comprendre pourquoi elle reste dans l'impasse. "
    "Une partie de la réponse tient dans un circuit extérieur. Un pays du Golfe finance un réseau, installé en Libye. "
    "Ce réseau alimente la guerre elle-même. "
    "Ce pays, c'est les Émirats arabes unis. Le vingt-neuf juin deux mille vingt-six, Lighthouse Reports et Der Spiegel "
    "sortent une enquête commune sur leur rôle. "
    "Selon cette enquête, les Émirats financent des camps d'entraînement. "
    "En Libye, ce réseau s'appuie sur les forces du maréchal Haftar, qui contrôlent l'est du pays. "
    "Et ce n'est pas nouveau. Un rapport des Nations unies avait déjà repéré ce corridor, en avril deux mille vingt-six. "
    "Des armes, du carburant, des combattants — tout ça en route vers le Soudan. "
    "Et cette route, on la retrouve à El-Fasher, au Darfour, pendant le siège de la ville. "
    "Des combattants qui en viennent, on les y a repérés, sur le terrain. "
    "Résumons. Un financement émirati, un relais libyen, une guerre qui continue au Darfour. "
    "Ce réseau est donc documenté, y compris par les Nations unies. "
    "Et pourtant, il continue de fonctionner. Pour comprendre pourquoi, il faut regarder du côté des "
    "institutions censées justement empêcher ça."
)


def main():
    if not AUDIO.exists():
        print(f"ERROR audio manquant: {AUDIO}")
        return 2

    print(f"Forced alignment v2 sur {AUDIO.name} ({len(FULL_TEXT)} chars texte)...")
    with open(AUDIO, "rb") as f:
        resp = requests.post(
            "https://api.elevenlabs.io/v1/forced-alignment",
            files={"file": (AUDIO.name, f, "audio/mpeg")},
            data={"text": FULL_TEXT},
            headers={"xi-api-key": API_KEY},
            timeout=300,
        )
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:400]}")
        return 3

    result = resp.json()
    OUT_ALIGN.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    words = [w for w in result.get("words", []) if w.get("text", "").strip()]
    print(f"OK alignment : {len(words)} mots reels, loss={result.get('loss', 'n/a')} -> {OUT_ALIGN.name}")

    # detection bug timestamps bloques (v1 connu, verif meme si v2)
    if len(words) >= 3 and words[0]["start"] == words[1]["start"] == words[2]["start"]:
        print("⚠️  ALERTE : timestamps bloques (bug connu) — verifier manuellement")

    print("\n--- Premiers mots ---")
    for w in words[:8]:
        print(f"  {w['text']!r}: {w['start']:.2f}s - {w['end']:.2f}s (loss={w.get('loss', '?')})")


if __name__ == "__main__":
    main()
