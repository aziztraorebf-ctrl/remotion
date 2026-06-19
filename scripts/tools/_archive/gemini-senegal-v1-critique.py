"""Critique premium de l'ACTE 1 V1 Senegal (publie) — upload video a Gemini 3.1 Pro.
But : pointer les VRAIES failles (narratif + cartographique + rythme) vs references du genre,
sans complaisance ET sans insultes gratuites. Gemini = SIGNAL, on filtre apres.
"""
import os, sys, time
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3.1-pro-preview"

BRIEF = """Tu es directeur artistique ET directeur narratif senior, specialiste du documentaire
geopolitique cartographique premium (references : RealLifeLore, PolyMatter, Vox, Bloomberg Originals,
Johnny Harris). Tu analyses l'ACTE 1 (les 2 premieres minutes) d'une video YouTube documentaire sur
le petrole & gaz du Senegal. Chaine "Kora & Cartes" — public africain francophone, registre : cartes
qui racontent, analyse sobre mais VIVANTE.

CONTEXTE NARRATIF de cet acte : un hook (le gouvernement saute alors que le pays s'enrichit) puis la
presentation des 3 gisements (Sangomar petrole, GTA gaz, Yakaar-Teranga gaz "en attente") et la question
de combien d'argent reste au Senegal (~50-60% des revenus).

CE QU'ON CHERCHE — une critique HONNETE et PRECISE, ni complaisante ni gratuitement dure. Le createur
trouve cette version "molle", "on pourrait s'endormir devant", "loin du standard premium". Aide-le a
NOMMER pourquoi, concretement. Analyse en profondeur :

1. RYTHME & MOUVEMENT : les mouvements de camera servent-ils un POINT NARRATIF, ou est-ce du "glissement
   sans but" / zoom mecanique ? Y a-t-il des temps morts ? La carte est-elle VIVANTE ou un aplat statique ?
2. NARRATION VISUELLE : l'image fait-elle AVANCER l'histoire, ou se contente-t-elle d'illustrer mollement
   la voix ? Y a-t-il une TENSION tenue (open loop), une montee, ou est-ce plat ?
3. CARTOGRAPHIE : la carte est-elle exploitee (couleurs signifiantes, frontieres, flux, textures de
   ressource, drapeaux dans les pays) ou juste un fond gris + un pays en aplat jaune ?
4. CONTINUITE : est-ce UN monde qui se transforme, ou une succession de plans coupes sans liant ?
5. EMOTION & RETENTION : qu'est-ce qui ferait qu'un spectateur RESTE vs decroche ? Compare au standard
   RealLifeLore/Johnny Harris (ou chaque seconde tient en haleine).

Pour CHAQUE faille : dis OU (timecode approx), POURQUOI ca affaiblit, et une direction de correction
concrete (pas "ajoute des particules"). Distingue : (A) ce qui MARCHE deja / (B) les failles MAJEURES
qui expliquent le "mou" / (C) les details mineurs.

Sois direct et utile. Le but n'est pas de demolir mais d'identifier le delta exact vers le premium.
Format : 3 sections (A MARCHE / B FAILLES MAJEURES / C MINEUR), bullet points avec timecodes."""


def load_key():
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")


def main():
    video = sys.argv[1] if len(sys.argv) > 1 else "/tmp/v1-acte1-pour-gemini.mp4"
    out = sys.argv[2] if len(sys.argv) > 2 else "/tmp/gemini-senegal-v1-critique.md"
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
    print(f"ACTIVE: {f.name}. Appel Gemini (analyse video)...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[f, BRIEF],
        config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=4000),
    )
    txt = resp.text or "(reponse vide)"
    print("\n" + "=" * 72 + "\n" + txt + "\n" + "=" * 72)
    Path(out).write_text(txt)
    print(f"-> {out}")


if __name__ == "__main__":
    main()
