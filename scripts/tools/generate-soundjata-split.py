"""
Generate Soundjata narration in 2 parts around the insult clip.
Same voice + settings as narration-full.mp3, split on the dialogue line.
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent.parent / "public" / "assets" / "library" / "geoafrique" / "heros-oublies" / "soundjata"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NARRATRICE_ID = "Y8XqpS6sj6cx5cCTLp8a"

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# Partie A — du debut jusqu'au setup de l'insulte (la derniere phrase met la table pour le clip)
PART_A = """[tense] Treizième siècle. Le pays mandingue est écrasé sous la tyrannie d'un roi-sorcier.

Mais une prophétie circule : un enfant naîtra qui libèrera le peuple.
Le problème — cet enfant ne peut pas marcher.

[sorrowful] Il s'appelle Soundjata. Il rampe à quatre pattes.
La première épouse de son père le ridiculise.
Elle humilie sa mère devant tout le village."""

# [5s clip + dialogue Matrone ici dans Remotion]

# Partie B — reaction + reste du script
PART_B = """[tense] Cette insulte va changer l'histoire de l'Afrique de l'Ouest.

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


def generate(text, output_name, speed=0.92, stability=0.30, style=0.25):
    print(f"\n--- {output_name} ---")
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
        f"https://api.elevenlabs.io/v1/text-to-speech/{NARRATRICE_ID}",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )
    resp.raise_for_status()
    out = OUTPUT_DIR / output_name
    out.write_bytes(resp.content)
    print(f"  Saved: {out.name} ({len(resp.content) // 1024}KB)")


if __name__ == "__main__":
    print("Generating narration in 2 parts (Narratrice GeoAfrique)")
    generate(PART_A, "narration-part-a.mp3")
    generate(PART_B, "narration-part-b.mp3")
