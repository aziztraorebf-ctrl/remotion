"""
Generation audio — Soundjata Keita (Heros Oublies #3)
Voix : Narratrice GeoAfrique V3
Strategie : tags emotion pousses sur chaque beat + pauses chirurgicales
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-soundjata"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NARRATRICE_ID = "Y8XqpS6sj6cx5cCTLp8a"  # Narratrice GeoAfrique V3

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# ─────────────────────────────────────────────────────────────────────────────
# SCRIPT ANNOTE — Soundjata Keita
#
# Corrections v2 :
#   - Accents complets partout (règle obligatoire)
#   - Tags émotion poussés sur CHAQUE beat narratif
#   - Dialogues retirés — narratrice raconte, ne joue pas les personnages
#   - Pauses courtes aux moments de rupture uniquement
# ─────────────────────────────────────────────────────────────────────────────

SOUNDJATA = """[tense] Treizième siècle. Le pays mandingue est écrasé sous la tyrannie d'un roi-sorcier.

Mais une prophétie circule : un enfant naîtra qui libèrera le peuple.
Le problème — cet enfant ne peut pas marcher.

[sorrowful] Il s'appelle Soundjata. Il rampe à quatre pattes.
La première épouse de son père le ridiculise.
Elle humilie sa mère devant tout le village.
Elle lui lance : au moins mon fils peut cueillir des feuilles de baobab.
Le tien ne sait même pas se lever.

[pause]

[tense] Cette insulte va changer l'histoire de l'Afrique de l'Ouest.

[proud] Soundjata se fait apporter une barre de fer.
Il la plante dans le sol. Et il se hisse debout.
La barre se tord sous sa force — tordue comme un arc.
Il sort, arrache un baobab entier, et le dépose aux pieds de sa mère.
[solemn] Il ne rampera plus jamais.

[sorrowful] Chassé par la jalousie de la cour, il s'exile loin de sa terre.
Sept longues années à Mema, à apprendre, à attendre.
Quand le roi-sorcier Soumaoro écrase son peuple, des messagers traversent tout le pays pour le retrouver.

[proud] Le lion du Manden revient.

[tense] Soumaoro est invulnérable. Aucune arme ne le touche.
Soundjata découvre son secret : l'animal sacré du sorcier est le coq.
Il fait forger une flèche avec un ergot de coq à sa pointe.
Bataille de Kirina — douze cent trente-cinq.
La flèche atteint Soumaoro. Ses pouvoirs disparaissent.
Le tyran s'enfuit dans la montagne et ne revient jamais.

[awe] Soundjata fonde l'Empire du Mali — le plus vaste, le plus riche d'Afrique de l'Ouest.
Et il fait quelque chose d'extraordinaire.
En douze cent trente-six, il proclame la Charte du Manden : quarante-quatre articles.
Droit à la vie. Protection des femmes. Dignité des captifs.

[pause]

Huit cents ans avant la Déclaration universelle des droits de l'homme.

[awe] Aujourd'hui encore, les griots du Mali chantent son nom.
Pas dans les livres — de bouche à oreille, de père en fils, depuis huit siècles.
Il n'existe pas de version définitive de son histoire.
Chaque griot la raconte à sa manière.

[pause]

[whispers] Un enfant qui rampait à quatre pattes a fondé un empire.
Et pourtant, l'histoire a presque oublié son nom."""


def generate(voice_id, text, output_name, speed=0.92, stability=0.30, style=0.25):
    print(f"\nGenerating : {output_name}")
    payload = {
        "text": text,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": 0.75,
            "style": style,
            "speed": speed,
        },
        "output_format": "mp3_44100_128",
    }
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers=HEADERS,
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    out = OUTPUT_DIR / output_name
    out.write_bytes(resp.content)
    size_kb = len(resp.content) // 1024
    print(f"  Saved : {out} ({size_kb} KB)")
    return out


if __name__ == "__main__":
    print("=" * 60)
    print("GENERATION AUDIO — Soundjata Keita — Narratrice V2")
    print("=" * 60)

    generate(NARRATRICE_ID, SOUNDJATA, "soundjata-narratrice-v2.mp3", speed=0.92)

    print("\n" + "=" * 60)
    print(f"Fichier dans : {OUTPUT_DIR}")
    print("  soundjata-narratrice-v2.mp3")
    print("=" * 60)
