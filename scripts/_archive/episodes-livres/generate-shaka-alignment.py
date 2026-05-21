"""ElevenLabs Forced Alignment pour narration-v5.mp3 Shaka Zulu.

Donne l'audio + le texte exact → retourne timestamps mot-par-mot avec score de confiance.
Output : src/projects/shaka-zulu/shaka-alignment.json (raw) + shaka-alignment.ts (TypeScript)

Usage:
    python scripts/tools/generate-shaka-alignment.py
"""
import os
import sys
import json
import re
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

AUDIO_FILE = ROOT / "public" / "audio" / "atlas-shaka-zulu" / "narration-v5.mp3"
OUT_DIR = ROOT / "src" / "projects" / "shaka-zulu"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_JSON = OUT_DIR / "shaka-alignment.json"
OUT_TS = OUT_DIR / "shaka-alignment.ts"

# Plain text — SANS tags TTS, SANS markdown
PLAIN_TEXT = """Il est né paria. Il est mort roi d'un empire de deux cent cinquante mille âmes. KwaZulu-Natal. Un clan. Les Zulus. Mille cinq cents personnes. Un fils que son père refuse de reconnaître. Banni à six ans. Banni à quinze ans. Deux fois chassé. Deux fois debout. Son nom : Shaka. Quand Dingiswayo lui donne un régiment, Shaka réinvente la guerre. Première innovation : il supprime la lance longue. Il forge l'iklwa, courte, mortelle au corps à corps. L'ennemi doit se battre. Deuxième : le bouclier devient une arme. Accrocher le bouclier adverse, tourner le poignet, l'ennemi expose son flanc. Un seul mouvement. Fatal. Troisième : la formation des cornes de buffle. Un centre qui fixe et épuise. Deux flancs qui encerclent par derrière. L'ennemi est cerné avant de comprendre ce qui arrive. À Gqokli Hill, en mil huit cent dix-huit, quatre-vingt-dix pour cent de pertes chez l'ennemi. Pas une victoire. Une destruction totale. Chaque tribu conquise fournit ses guerriers, loyaux à Shaka seul. Mille cinq cents guerriers en mil huit cent seize. Cinquante mille en mil huit cent vingt-huit. Vingt pour cent de sa population porte les armes. En Europe, cinq pour cent. Un seul homme. Trente mille kilomètres carrés. Mais rien de tout cela ne peut se comprendre sans Nandi. Sa mère. La seule qui l'avait défendu. Quand tous le rejetaient, Nandi était là. Octobre mil huit cent vingt-sept. Nandi meurt. Shaka décrète un deuil national. Toute naissance est proscrite pendant un an. Tout champ reste sans culture. Selon les chroniques, James Stuart Archive, quatre mille Zulus périssent. Pour n'avoir pas pleuré assez fort. Ses demi-frères Dingane et Mhlangana comprennent. L'homme qui a tout bâti est en train de tout détruire. Le vingt-deux septembre mil huit cent vingt-huit, ils l'assassinent. L'empire Zulu survit cinquante ans après sa mort. Quand on parle de génie militaire, on cite Napoléon. On cite Alexandre. Qui cite Shaka ? Abonne-toi. Il y en a d'autres comme lui."""


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
        "// ElevenLabs Forced Alignment — narration-v5.mp3 Shaka Zulu",
        f"// Loss globale : {loss_global:.4f} (plus bas = meilleur)" if isinstance(loss_global, float) else f"// Loss globale : {loss_global}",
        "// DO NOT EDIT — regenerer via scripts/tools/generate-shaka-alignment.py",
        "",
        "export const SHAKA_ALIGNMENT: { text: string; start: number; end: number; loss: number }[] = [",
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
