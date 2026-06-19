"""Review Gemini 3.1 Pro de la vidéo carrousel Good News (analyse mouvement réel).

Modèle : gemini-3.1-pro-preview (vision/analyse, jamais output image).
Input : full preview MP4 via Files API.
Mode : base validée, axes d'amélioration DANS nos contraintes (pas de refonte).
"""
import os
import time
from pathlib import Path
from google import genai

env = Path(__file__).resolve().parents[2] / ".env"
for line in env.read_text().splitlines():
    if line.startswith("GEMINI_API_KEY="):
        os.environ["GEMINI_API_KEY"] = line.split("=", 1)[1].strip().strip('"')

VIDEO = Path(__file__).resolve().parents[2] / "out/_r-and-d/good-news/final/gn-FULL-preview.mp4"

BRIEF = """Tu analyses un carrousel Instagram ANIMÉ (vidéo) pour la chaîne "Kora & Cartes" (@koraetcartes), un média de vulgarisation géopolitique/économique sur l'Afrique avec un angle MACRO (impact mondial).

IMPORTANT — C'EST UNE VIDÉO ANIMÉE, PAS DU STATIQUE. Chaque slide a des animations qui jouent puis bouclent :
- Slide Hook : un globe doré se dessine avec 3 points qui s'allument, le titre apparaît en machine à écrire (typewriter), sous-titre en fade.
- Slide Maroc (barres) : la barre dorée "Maroc" GRANDIT et dépasse la barre grise "Afrique du Sud", chiffres qui comptent.
- Slides "Pourquoi le monde regarde" (flux) : deux cercles (source africaine → cible mondiale) reliés par un trait qui SE DESSINE avec des particules vertes qui circulent. Dispositions variées (horizontale, diagonale montante).
- Slide Kenya : une jauge circulaire dorée SE REMPLIT jusqu'à 90%, le chiffre compte de 0 à 90.
- Slide Algérie : une vraie carte (style beige clair "Caspian") avec un tracé doré pointillé qui SE DESSINE d'Alger vers Berlin, pins de villes.
- Slide CTA finale : un bouton play qui PULSE + texte typewriter.

CONTRAINTES NON-NÉGOCIABLES (ne propose RIEN qui les viole) :
- Charte LUMINEUSE : fond ivoire/crème (#fbf7ec→#f0e6cf), texte navy (#16213a), accents or (#c8a951), serif Georgia. C'est volontaire : le flux "good news" est lumineux pour se distinguer du flux analytique sombre.
- Format vertical 4:5 (1080x1350). Safe-zone basse ~250px (boutons Instagram).
- 100% Remotion (code) : graphismes vectoriels animés, PAS de photos, PAS d'illustrations IA générées. C'est notre signature anti-"AI slop".
- Header "K&C" + barre de progression 8 segments. Footer "@koraetcartes".
- Marque premium éditoriale (esprit Monocle / The Economist / Le Monde), jamais clinquant ou naïf.

MISSION :
La base est VALIDÉE par le réalisateur. Ne propose PAS de refonte. Réponds à : "Qu'est-ce qu'on peut AMÉLIORER, dans nos contraintes, pour passer de bon à excellent ?"

Analyse précisément :
1. RYTHME D'ANIMATION : les boucles sont-elles vivantes ou y a-t-il des temps morts (animation finie trop tôt, slide figée trop longtemps avant de reboucler) ? Suggestions de timing.
2. GRAPHISMES : les briques animées (jauge, barres, flux, carte) sont-elles assez grandes, lisibles, équilibrées ? Y a-t-il des slides plus faibles que d'autres ?
3. EMOJI vs ÉDITORIAL : les glyphes emoji (🏭 ✈️ 💧 🇪🇺 ⚡ 🖥️) dans les flux jurent-ils avec le registre premium éditorial ? Vaudrait-il mieux des icônes dessinées (SVG line) ? Donne ton avis tranché.
4. HIÉRARCHIE & COHÉRENCE : le kicker "Pourquoi le monde regarde" répété 3 fois aide-t-il ou lasse-t-il ? La distinction visuelle fait/macro (kicker or vs bleu) est-elle assez claire ?
5. FOND : l'ivoire est-il assez "respirant/joyeux" pour du good news, ou trop plat/uniforme ? Idées subtiles dans la charte (texture, halo, variation) ?
6. LISIBILITÉ MOBILE : un point qui passerait mal sur un petit écran ?

Format de réponse : liste priorisée. Pour chaque point : [SLIDE concernée] · observation · suggestion concrète réalisable en Remotion. Distingue "quick win" (5 min de code) vs "amélioration moyenne". Sois franc et exigeant, pas complaisant — le but est d'identifier les vrais leviers.
"""

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

print(f"[upload] {VIDEO.name} ...")
uploaded = client.files.upload(file=str(VIDEO))
while uploaded.state.name == "PROCESSING":
    time.sleep(3)
    uploaded = client.files.get(name=uploaded.name)
print(f"[upload] state={uploaded.state.name}")

print("[analyse] Gemini 3.1 Pro ...")
resp = client.models.generate_content(
    model="gemini-3.1-pro-preview",
    contents=[uploaded, BRIEF],
)
print("\n" + "=" * 70)
print(resp.text)
print("=" * 70)
