"""Forced alignment B4 + B5 GGW Muraille Verte (correction FMNR 2026-06-25).

Genere l'alignement mot-a-mot ElevenLabs pour les 2 beats regeneres.
Texte PLAIN (sans tags V3) = exactement les mots prononces.
Sortie : beat4.alignment.json + beat5.alignment.json (frames @30 relatives au debut du beat).
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
    "beat4": "Mais la vraie réponse existait déjà. Dès les années quatre-vingt, bien avant ce grand projet, un agronome, Tony Rinaudo, avait remarqué une chose que personne ne voyait. Sous ce sol mort dormait une forêt entière. Des millions de souches encore vivantes, qu'il suffisait de protéger et de tailler pour les faire repousser. Pas besoin de planter. La forêt était déjà là, sous leurs pieds.",
    "beat5": "Le résultat ? Au Niger, deux cents millions d'arbres sont revenus. Pas plantés. Revenus. Pour presque rien. Et avec eux, l'ombre, des sols vivants, et les récoltes qui repartent.",
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
        # decoupage mot->frame@30 (debut beat = frame 0)
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
