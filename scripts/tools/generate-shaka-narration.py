"""Generate full narration for Shaka Zulu Atlas video.

Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm)
Config: max-style (stability 0.22, similarity 0.55, style 0.55, speed 1.0, model eleven_v3)

Script V5 — TTS scan validated (no e/ee traps, no ont+voyelle, no digits)
"""
import os
import sys
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

VOICE_ID = "z3gESu49naEZW8Af2Upm"

OUT_DIR = ROOT / "public" / "audio" / "atlas-shaka-zulu"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "narration-v5.mp3"

SCRIPT = """[tense] Il est né paria. Il est mort roi d'un empire de deux cent cinquante mille âmes. [solemn] KwaZulu-Natal. Un clan. Les Zulus. Mille cinq cents personnes. Un fils que son père refuse de reconnaître. Banni à six ans. Banni à quinze ans. [awe] Deux fois chassé. Deux fois debout. Son nom : Shaka. [dramatic tone] Quand Dingiswayo lui donne un régiment, Shaka réinvente la guerre. Première innovation : il supprime la lance longue. Il forge l'iklwa, courte, mortelle au corps à corps. L'ennemi doit se battre. Deuxième : le bouclier devient une arme. Accrocher le bouclier adverse, tourner le poignet, l'ennemi expose son flanc. Un seul mouvement. Fatal. [tense] Troisième : la formation des cornes de buffle. Un centre qui fixe et épuise. Deux flancs qui encerclent par derrière. L'ennemi est cerné avant de comprendre ce qui arrive. [proud] À Gqokli Hill, en mil huit cent dix-huit, quatre-vingt-dix pour cent de pertes chez l'ennemi. Pas une victoire. Une destruction totale. [awe] Chaque tribu conquise fournit ses guerriers, loyaux à Shaka seul. [dramatic tone] Mille cinq cents guerriers en mil huit cent seize. Cinquante mille en mil huit cent vingt-huit. Vingt pour cent de sa population porte les armes. En Europe, cinq pour cent. Un seul homme. Trente mille kilomètres carrés. [solemn] Mais rien de tout cela ne peut se comprendre sans Nandi. Sa mère. La seule qui l'avait défendu. Quand tous le rejetaient, Nandi était là. [melancholic] Octobre mil huit cent vingt-sept. Nandi meurt. Shaka décrète un deuil national. Toute naissance est proscrite pendant un an. Tout champ reste sans culture. [tense] Selon les chroniques, James Stuart Archive, quatre mille Zulus périssent. Pour n'avoir pas pleuré assez fort. [dramatic tone] Ses demi-frères Dingane et Mhlangana comprennent. L'homme qui a tout bâti est en train de tout détruire. Le vingt-deux septembre mil huit cent vingt-huit, ils l'assassinent. [proud] L'empire Zulu survit cinquante ans après sa mort. Quand on parle de génie militaire, on cite Napoléon. On cite Alexandre. [awe] Qui cite Shaka ? Abonne-toi. Il y en a d'autres comme lui."""


def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Script: {len(SCRIPT)} chars")
    print(f"Output: {OUT_FILE}")
    print()

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": SCRIPT,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.22,
            "similarity_boost": 0.55,
            "style": 0.55,
            "speed": 1.0,
        },
        "output_format": "mp3_44100_128",
    }
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
    }

    print("Calling ElevenLabs API...")
    resp = requests.post(url, json=payload, headers=headers, timeout=120)
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:300]}")
        return 2

    OUT_FILE.write_bytes(resp.content)
    size_kb = OUT_FILE.stat().st_size / 1024
    print(f"Saved: {OUT_FILE.name} ({size_kb:.1f} KB)")

    probe = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(OUT_FILE),
        ],
        capture_output=True, text=True,
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        print(f"Duration: {duration:.2f}s")
        if duration > 125:
            print("[WARN] > 125s — script trop long, envisager coupes")
        elif duration < 90:
            print("[WARN] < 90s — script plus court que prevu")
        else:
            print("[OK] dans la cible 90-120s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
