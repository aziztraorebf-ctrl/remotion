"""
Generation audio voix off — Abou Bakari II Short 75s
Voice ID : 4Qug1SpnYkDaNDo6hbdi (Narrateur GeoAfrique, senegalais leger)
Model : eleven_multilingual_v2
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "QMNPncWXVcTVhJ9rDEQO"
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-abou-bakari"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# Script complet — voix off Abou Bakari II
# Separateurs de pauses : <break time="0.5s" /> pour les moments de silence dramatiques
SCRIPT = """En 1311... l'océan Atlantique n'est qu'un mur de brouillard.
On l'appelle... la Mer des Ténèbres.
Personne ne sait ce qu'il y a de l'autre côté.
Personne... sauf UN homme.

Abou Bakari II.
Mansa du Mali.
Roi des rois.
Il règne sur l'empire le plus riche du monde.
Mais il est... obsédé... par l'horizon.
Il refuse de croire que l'océan n'a pas de fin.

Il fait construire deux mille pirogues massives.
Il envoie d'abord deux cents éclaireurs.
Un seul bateau revient.
Le capitaine est... terrifié.
Un courant titanesque.
En plein milieu de la mer !

Au lieu de reculer... Abou Bakari abdique.
Il laisse son trône. Son or. Son pouvoir absolu.
Il monte LUI-MÊME dans l'une des embarcations.
Et ordonne de ramer vers l'ouest.
Vers l'inconnu.
Il ne reviendra... jamais.

Pendant ce temps, son successeur monte sur le trône.
Mansa Moussa.
L'homme qui deviendra si riche... qu'il fera s'effondrer le cours de l'or en Égypte.
Quatre cents milliards de dollars actuels.
Abou Bakari a TOUT abandonné... pour une boussole.
Et un rêve.

Cent quatre-vingt-un ans plus tard...
Christophe Colomb débarquait en Amérique.
On l'appelle "le découvreur".
Mais certains historiens pensent qu'un roi africain l'avait devancé...
De deux siècles.

Et toi ?
Tu penses qu'il a réussi à toucher terre ?
Dis-le moi en commentaire !"""


def generate_audio():
    print("=== Generation audio — Abou Bakari II ===")
    print(f"Voice ID : {VOICE_ID}")
    print(f"Output : {OUTPUT_DIR}\n")

    payload = {
        "text": SCRIPT,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.35,
            "similarity_boost": 0.80,
            "style": 0.70,
            "use_speaker_boost": True,
        },
        "output_format": "mp3_44100_128",
    }

    print("Generating...")
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}")
        return None

    output_path = OUTPUT_DIR / "abou-bakari-v4-organic.mp3"
    output_path.write_bytes(resp.content)
    size_kb = len(resp.content) / 1024
    print(f"Saved : {output_path} ({size_kb:.0f} KB)")
    return str(output_path)


if __name__ == "__main__":
    path = generate_audio()
    if path:
        result = subprocess.run(
            ["ffprobe", "-i", path, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"],
            capture_output=True, text=True
        )
        if result.stdout.strip():
            duration = float(result.stdout.strip())
            print(f"\nDuree totale : {duration:.2f}s ({duration/60:.1f} min)")
        subprocess.run(["open", path], check=False)
