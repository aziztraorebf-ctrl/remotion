"""ElevenLabs Forced Alignment pour narration-v1.mp3 Empire du Ghana.

Donne l'audio + le texte exact (sans tags) -> retourne timestamps mot-par-mot.
Output : src/projects/atlas/empire-ghana/ghana-alignment.json + .ts

Usage:
    python scripts/tools/generate-ghana-alignment.py
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

AUDIO_FILE = ROOT / "public" / "audio" / "atlas-empire-ghana" / "narration-v1.mp3"
OUT_DIR = ROOT / "src" / "projects" / "atlas" / "empire-ghana"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_JSON = OUT_DIR / "ghana-alignment.json"
OUT_TS = OUT_DIR / "ghana-alignment.ts"

# Plain text — SANS tags TTS, SANS markdown
# Doit correspondre EXACTEMENT a ce que la narratrice a dit
PLAIN_TEXT = """Au cœur du Sahara, on troquait du sel contre de l'or. Au gramme près. Wagadou. Aujourd'hui, presque personne ne connaît ce nom. Pourtant, du huitième au treizième siècle, cet empire ouest-africain contrôlait la richesse la plus convoitée du monde médiéval. Et il avait un secret. À Taghaza, au nord, le sel était extrait par blocs de quatre-vingt-dix kilos. À Bambouk, au sud, l'or sortait de la terre par poignées. Entre les deux, le désert. Et au centre exact, Koumbi Saleh. Vingt mille habitants. Une mosquée. Et un roi qui taxait chaque caravane — d'or, de sel, et d'esclaves. Mais le moment qui marque l'histoire, c'est ça. Sur les marchés du sud, les marchands déposaient leur sel. Puis ils s'éloignaient. Les acheteurs venaient. Posaient leur or à côté. Et repartaient sans un mot. Le silent barter. Sel contre or, presque au poids égal. Ce système a tenu cinq cents ans. Puis les Almoravides coupèrent les routes du sel en mille soixante-seize. Sécheresse. Effondrement. Et en mille deux cent quarante, un certain Sundiata Keïta détruit Koumbi Saleh. L'empire du Mali venait de naître sur les cendres de Wagadou. Wagadou. Cinq siècles de commerce mondial. Demande qui contrôlait l'or au Moyen-Âge. On te répondra Florence, Venise. Jamais Wagadou."""


def call_forced_alignment() -> dict:
    print(f"Audio : {AUDIO_FILE.name} ({AUDIO_FILE.stat().st_size / 1024:.1f} KB)")
    print(f"Texte : {len(PLAIN_TEXT)} chars")
    print()
    print("Appel ElevenLabs Forced Alignment...")

    with open(AUDIO_FILE, "rb") as f:
        resp = requests.post(
            "https://api.elevenlabs.io/v1/forced-alignment",
            headers={"xi-api-key": API_KEY},
            files={"file": (AUDIO_FILE.name, f, "audio/mpeg")},
            data={"text": PLAIN_TEXT},
            timeout=180,
        )

    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}")
        sys.exit(1)

    return resp.json()


def write_typescript(data: dict) -> None:
    words = data.get("words", [])
    loss_global = data.get("loss", "?")

    lines = [
        "// ElevenLabs Forced Alignment — narration-v1.mp3 Empire du Ghana",
        f"// Loss globale : {loss_global:.4f} (plus bas = meilleur)" if isinstance(loss_global, float) else f"// Loss globale : {loss_global}",
        "// DO NOT EDIT — regenerer via scripts/tools/generate-ghana-alignment.py",
        "",
        "export const GHANA_ALIGNMENT: { text: string; start: number; end: number; loss: number }[] = [",
    ]
    for w in words:
        text = w["text"].replace("\\", "\\\\").replace('"', '\\"')
        lines.append(
            f'  {{ text: "{text}", start: {w["start"]:.3f}, end: {w["end"]:.3f}, loss: {w.get("loss", 0):.3f} }},'
        )
    lines.append("];")

    OUT_TS.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"TS  : {len(words)} mots -> {OUT_TS}")


def main() -> int:
    if not AUDIO_FILE.exists():
        print(f"ERROR: audio introuvable : {AUDIO_FILE}")
        return 1

    data = call_forced_alignment()

    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"JSON: {OUT_JSON}")

    write_typescript(data)

    words = data.get("words", [])
    loss = data.get("loss", "?")
    print()
    print(f"Loss globale : {loss}")
    print(f"Mots         : {len(words)}")
    if words:
        print(f"Premier mot  : '{words[0]['text']}' @ {words[0]['start']:.3f}s")
        print(f"Dernier mot  : '{words[-1]['text']}' @ {words[-1]['end']:.3f}s")

    return 0


if __name__ == "__main__":
    sys.exit(main())
