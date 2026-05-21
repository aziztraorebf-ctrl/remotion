"""ElevenLabs Forced Alignment pour cta-narration-v1.mp3 Empire du Ghana.

Output : src/projects/atlas/empire-ghana/cta-alignment.json + .ts
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

AUDIO_FILE = ROOT / "public" / "audio" / "atlas-empire-ghana" / "cta-narration-v1.mp3"
OUT_DIR = ROOT / "src" / "projects" / "atlas" / "empire-ghana"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_JSON = OUT_DIR / "cta-alignment.json"
OUT_TS = OUT_DIR / "cta-alignment.ts"

PLAIN_TEXT = (
    "Tu savais ? Au treizième siècle, le commerce du sel valait son poids d'or. "
    "Wagadou n'était que le début. Newsletter quotidienne — un autre regard "
    "sur l'actualité africaine. Lien en bio."
)


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
        "// ElevenLabs Forced Alignment — cta-narration-v1.mp3 Empire du Ghana",
        f"// Loss globale : {loss_global:.4f}" if isinstance(loss_global, float) else f"// Loss globale : {loss_global}",
        "// DO NOT EDIT — regenerer via scripts/tools/generate-empire-ghana-cta-alignment.py",
        "",
        "export const CTA_ALIGNMENT: { text: string; start: number; end: number; loss: number }[] = [",
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
