"""DA-brief VIDEO sur la scene 1 V3 (les 3 gisements). Upload mp4 a Gemini 3.1 Pro.
Brief NOURRI de nos capacites reelles (catalogue carte vivante) + des 4 critiques d'Aziz.
Gemini = SIGNAL : pointe les failles ET propose des idees REALISABLES avec notre arsenal. On filtre apres.
"""
import os, sys, time
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3.1-pro-preview"

BRIEF = """Tu es directeur artistique senior en motion-design cartographique editorial premium
(references : RealLifeLore, Johnny Harris, Vox, Bloomberg). Tu analyses la SCENE 1 (~100s) d'un
documentaire YouTube sur le petrole & gaz du Senegal. Chaine "Kora & Cartes", public africain francophone.

CONTENU NARRATIF de la scene (la voix dit) : on ecarte 2 recits (malediction petroliere / miracle de la
souverainete) -> on presente 3 gisements offshore un par un (Sangomar = petrole, Woodside+Petrosen ;
GTA = gaz, frontiere Mauritanie, BP, exporte vers Europe/Asie ; Yakaar-Teranga = gaz en attente, "la plus
grosse surprise") -> puis le paradoxe : ~60% des revenus restent au Senegal, "moyenne des emergents, ni
scandale ni jackpot", mais "ce chiffre ne dit rien sur ce qui decide vraiment".

LE REALISATEUR (notre client) a deja identifie 4 PROBLEMES — confirme-les ou nuance-les, et VA PLUS LOIN :
1. Les ~32 premieres secondes (les "2 recits" sur la carte) sont MORTES : on fixe une carte grise avec 2
   mots ("malediction"/"miracle") et un leger drift. Il ne se passe RIEN. Le realisateur pense que ce
   passage ABSTRAIT devrait etre un vrai MOTION-DESIGN plein ecran (comme le hook), PAS sur la carte.
2. Les gisements = juste un point qui pulse + une petite plaque. Trop statique, repetitif (Sangomar puis
   GTA = meme chose). Il faut MEUBLER, donner de la vie/echelle.
3. BUG geo-ancrage : quand la camera dezoome/bouge, les points et les plaques DRIFTENT (ils ne sont pas
   ancres a leurs vraies coordonnees). [NB technique : corrige via map.project() frame-driven.]
4. La carte est GRISE et morte. Occasion perdue : le Senegal pourrait etre COLORE (couleur unie ou son
   DRAPEAU rempli dans la silhouette), les pays vers qui partent les exports aussi. On ne combat pas le gris.
5. Le graphique "60%" final est PRIMAIRE (juste un gros chiffre + une reglette). Tres en-dessous de nos
   data-viz habituelles. Que faire de premium pour ce moment ?

NOS CAPACITES REELLES (propose des idees REALISABLES avec ca, ne reste pas dans le vide) :
- Carte vivante Mapbox : remplir un pays de son DRAPEAU (statique, ondulant, ou qui "envahit" depuis la
  frontiere tracee au laser), colorer des pays en aplats, texture de ressource projetee, faisceau qui revele
  un territoire, zone offshore isolee/hachuree, encarts data ANCRES au point geo par ligne fine, popups
  glassmorphism, propagation par vagues, pulse d'une region entiere.
- Motion-design Remotion plein ecran (data-viz premium type Bloomberg/Vox) : count-up, barres, donut,
  flux/Sankey, comparaisons, typographie cinetique, masque (chiffre geant qui revele une carte dedans).
- Camera Mapbox frame-driven (plongee, pitch, fly d'un point a l'autre), SFX, drapeaux reels.
- Doctrine : SPATIAL -> carte / ABSTRAIT -> motion Remotion plein ecran. Transition TENUE (jamais cut sec).
  Continuite : UN monde qui se transforme. L'image PRECEDE l'oreille. Epure : l'ecran ne double pas la voix.

TA MISSION :
(A) Confirme/nuance les 5 problemes ci-dessus avec des TIMECODES.
(B) Pour CHAQUE moment de la scene (intro 2 recits / Sangomar / GTA+export / Yakaar / 60%), propose 1-2
    IDEES CONCRETES et premium, en t'appuyant sur nos capacites listees. Sois precis : quel geste visuel,
    pourquoi il sert le propos, comment il combat le gris / meuble / cree de la tension.
(C) Signale tout ce qui fait "amateur/statique" vs "premium/vivant".

Format : 3 sections (A PROBLEMES CONFIRMES+timecodes / B IDEES PAR MOMENT / C PRINCIPES). Concret, actionnable.
Le sujet est en or — on veut une execution implacable, au niveau RealLifeLore/Johnny Harris."""


def load_key():
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")


def main():
    video = sys.argv[1] if len(sys.argv) > 1 else "/tmp/senegal-scene1-v3-b.mp4"
    out = sys.argv[2] if len(sys.argv) > 2 else "/tmp/gemini-scene1-da.md"
    if not Path(video).exists():
        print(f"introuvable: {video}"); sys.exit(1)
    key = load_key()
    if not key:
        print("GEMINI_API_KEY manquante"); sys.exit(1)
    client = genai.Client(api_key=key)
    print(f"Upload {video} ...")
    f = client.files.upload(file=video)
    for _ in range(90):
        f = client.files.get(name=f.name)
        if f.state == "ACTIVE": break
        if f.state == "FAILED": print("upload FAILED"); sys.exit(2)
        time.sleep(2)
    print(f"ACTIVE. Appel Gemini (analyse video)...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL, contents=[f, BRIEF],
        config=types.GenerateContentConfig(temperature=0.45, max_output_tokens=4500),
    )
    txt = resp.text or "(vide)"
    print("\n" + "=" * 74 + "\n" + txt + "\n" + "=" * 74)
    Path(out).write_text(txt)
    print(f"-> {out}")


if __name__ == "__main__":
    main()
