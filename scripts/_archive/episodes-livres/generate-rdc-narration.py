"""Generate narration — RDC: Pourquoi la geographie de la RDC n'a aucun sens.
Voice: Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm)
Script LOCKED 2026-05-17 (fact-checked via Perplexity sonar-pro)
Mode autonome: no interactive prompt.
"""
import os
import sys
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing")
    sys.exit(1)

VOICE_ID = "z3gESu49naEZW8Af2Upm"

NARRATION = """La Republique democratique du Congo. Ce n'est pas vraiment un pays. C'est un continent cache au milieu de l'Afrique. Et quand on regarde sa carte, on se demande comment ce territoire tient encore debout.

La RDC couvre deux millions trois cent quarante-cinq mille kilometres carres. C'est le deuxieme plus grand pays d'Afrique, juste derriere l'Algerie. Pour donner une idee concrete, on peut faire rentrer la France quatre fois entiere dans la RDC. On peut aussi y poser l'Espagne, l'Allemagne, et la Pologne, et il reste encore de la place pour glisser le Royaume-Uni a cote.

La RDC touche neuf voisins. Neuf. Aucun autre pays d'Afrique centrale n'en a autant. Mais le plus etrange, ce sont les frontieres elles-memes. Des lignes droites parfaites tracees dans la jungle. Des fleuves coupes en deux. Des villages separes par une carte. Ces frontieres n'ont pas ete dessinees par les Congolais. Elles ont ete negociees a Berlin, en mille huit cent quatre-vingt-cinq, par des Europeens qui n'avaient jamais mis les pieds la-bas.

Au coeur du pays, il y a un monstre. Le fleuve Congo. Plus de quatre mille trois cents kilometres de long. C'est le deuxieme debit fluvial du monde, juste derriere l'Amazone. Le fleuve traverse l'equateur deux fois. Il est si large qu'a certains endroits, on ne voit pas l'autre rive. Et il transporte plus d'eau en une seule seconde que le Nil en une minute entiere.

Autour du fleuve s'etend la deuxieme plus grande foret tropicale du monde. Pres de cent soixante-dix millions d'hectares de jungle dense. Ce massif absorbe desormais plus de carbone net que l'Amazonie degradee. On l'appelle le second poumon de la planete. Et la majorite se trouve en RDC.

Dans ce territoire vivent cent millions d'habitants. Ils parlent plus de deux cents langues differentes. C'est l'un des pays les plus multilingues du monde. Quatre langues nationales officielles, le francais comme langue administrative, et des centaines de dialectes locaux. Un Congolais de Kinshasa et un Congolais de Lubumbashi peuvent ne pas se comprendre du tout.

Sous la jungle dort un tresor. La RDC possede environ soixante pour cent du cobalt mondial. Le metal qui fait fonctionner les batteries de tous les smartphones et de toutes les voitures electriques de la planete. Le sous-sol vaut plusieurs milliers de milliards de dollars. Et pourtant, c'est l'un des pays les plus pauvres du monde.

Voila la Republique democratique du Congo. Un pays trop grand, trop riche, trop complexe. Et qui, malgre tout, continue d'exister."""

OUT_DIR = ROOT / "src" / "projects" / "geoafrique-shorts" / "rdc-no-sense" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "narration-v1.mp3"

def main() -> int:
    print(f"Voice: Narratrice GeoAfrique v2 ({VOICE_ID})")
    print(f"Text length: {len(NARRATION)} chars")
    print(f"Output: {OUT_FILE}")
    cost = len(NARRATION) * 0.00003
    print(f"[COST] ~${cost:.4f} ({len(NARRATION)} chars)")
    print()

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    payload = {
        "text": NARRATION,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.3,
            "speed": 1.0,
        },
        "output_format": "mp3_44100_128",
    }
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

    print("Generating audio (autonomous mode)...")
    r = requests.post(url, json=payload, headers=headers, timeout=180)
    if r.status_code != 200:
        print(f"ERROR {r.status_code}: {r.text[:500]}")
        return 1

    OUT_FILE.write_bytes(r.content)
    size_mb = len(r.content) / 1024 / 1024
    print(f"OK {OUT_FILE} ({size_mb:.2f} MB)")

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(OUT_FILE)],
        capture_output=True, text=True
    )
    if probe.returncode == 0:
        duration = float(probe.stdout.strip())
        frames = int(duration * 30)
        print(f"Duration: {duration:.2f}s | {frames} frames @30fps")
    return 0

if __name__ == "__main__":
    sys.exit(main())
