"""Forced alignment B2 GGW Muraille Verte (correction factuelle Sahel/80% 2026-06-25).

Genere l'alignement mot-a-mot ElevenLabs pour le beat 2 regenere.
Texte PLAIN (sans tags V3) = exactement les mots prononces.
Sortie : beat2.alignment.json (frames @30 relatives au debut du beat).
Reutilise la logique de ggw-b4b5-alignment.py.
"""
import os
import sys
import json
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

AUDIO_DIR = ROOT / "public" / "audio" / "ggw-muraille-verte"
FPS = 30

BEATS = {
    "beat2": "L'idée de départ : aligner des arbres, en ligne droite, face au sable. Mais dans le Sahel, près de huit arbres sur dix meurent, faute d'eau. Au Sénégal, sur trente-six zones plantées, une seule a vraiment reverdi. Les scientifiques sont durs : sur le papier, cette idée n'avait aucune chance.",
}


def align(audio: Path, text: str) -> dict:
    url = "https://api.elevenlabs.io/v1/forced-alignment"
    with open(audio, "rb") as f:
        resp = requests.post(
            url,
            files={"file": (audio.name, f, "audio/mpeg")},
            data={"text": text},
            headers={"xi-api-key": API_KEY},
            timeout=120,
        )
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:400]}")
        sys.exit(2)
    return resp.json()


def main() -> int:
    for slug, text in BEATS.items():
        audio = AUDIO_DIR / f"narration-{slug}.mp3"
        if not audio.exists():
            print(f"ERROR: {audio} introuvable")
            return 3
        print(f"=== {slug} ({len(text)} chars) ===")
        data = align(audio, text)
        out = AUDIO_DIR / f"{slug}.alignment.json"
        out.write_text(json.dumps(data, indent=2, ensure_ascii=False))
        words = [w for w in data.get("words", []) if w.get("text", "").strip()]
        print(f"  loss global: {data.get('loss')}")
        print(f"  mots: {len(words)}  -> {out.name}")
        print("  MOT -> frame@30 (start):")
        for w in words:
            f0 = round(w["start"] * FPS)
            loss = w.get("loss", 0)
            flag = "  <-- loss eleve" if loss and loss > 0.5 else ""
            print(f"    {f0:>4}  '{w['text']}'  (start {w['start']:.3f}s, loss {loss:.3f}){flag}")
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
