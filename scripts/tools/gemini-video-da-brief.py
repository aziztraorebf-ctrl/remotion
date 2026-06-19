#!/usr/bin/env python3
"""
DA-brief VIDEO : upload une scene complete (mp4) a Gemini 3.1 Pro et demande une
critique premium de NIVEAU (analyse d'ecart vers des refs), pas un catalogue d'effets.

Gemini = SIGNAL, jamais juge (DA-BRIEF-GATE.md). On filtre ses retours apres :
on garde ce qui ELEVE sans casser l'epure, on jette le reste.

Usage : python3 scripts/tools/gemini-video-da-brief.py <video.mp4> [--out brief.md]
"""
import os, sys, time, argparse
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3.1-pro-preview"

BRIEF = """Tu es directeur artistique senior en motion design data-viz editoriale.

CONTEXTE — ce que tu regardes :
C'est la scene d'OUVERTURE (hook, ~22s) d'une video YouTube documentaire geopolitique sur le
Senegal (petrole & gaz). Chaine "Kora & Cartes" — registre : cartes qui racontent, analyse sobre,
public africain francophone. La narration (voix off) dit : le Senegal pompe son petrole (8 M$/jour),
puis un mois plus tard le gouvernement saute / le president limoge son Premier ministre, puis pose
la question : comment un pays qui s'enrichit bascule dans la tourmente ? — et annonce qu'il faut
ecarter deux recits (la "malediction petroliere" et le "miracle de la souverainete") pour une verite
"plus froide, plus precise".

CE QU'ON A FAIT (intentions DELIBEREES — ne pas les remettre en cause) :
- Carte du Senegal (vraie geometrie) sur fond papier/grille quadrillee, charte navy + or + ivoire.
- Le compteur "8 000 000 $" monte puis se fige (l'argent qui sort).
- La carte se FRACTURE en deux (cale sur le mot "limoge") avec SFX dechirure = la bascule politique.
- Puis la rupture S'AGGRAVE (les moities derivent, faille qui palpite, vignette qui monte).
- Beat final : les 2 moities = les 2 recits qu'on ECARTE (chacune s'eteint sur son mot), PUIS la carte
  se RECOMPOSE en une piece nette = "la verite plus precise".
- EPURE RADICALE ASSUMEE : on a VOLONTAIREMENT retire tout texte qui doublait la voix. L'image montre,
  la voix raconte. NE PROPOSE PAS d'ajouter du texte a l'ecran.

NIVEAU CIBLE (refs d'ecart) :
- Data-viz editoriale premium : Bloomberg, Financial Times, The Economist (rigueur typographique,
  palette restreinte, animation au service de la donnee, zero gadget).
- Explainer premium : Vox, Kurzgesagt (rythme, transitions soignees, lisibilite, retention).

TA MISSION — critique premium LIBRE :
Juge le MOUVEMENT, le rythme, les transitions, la matiere (texture/lumiere/grain), le son, la
hierarchie visuelle. Qu'est-ce qui, concretement, ferait passer CETTE scene au niveau des refs
ci-dessus ? Sois precis et actionnable (pas "ajoute des particules" — explique QUOI, OU, POURQUOI).
Distingue : (A) ce qui est deja au niveau, (B) les ecarts qui comptent vraiment, (C) les details mineurs.
Signale tout ce qui fait "amateur" ou "vectoriel plat" vs "premium/matiere".
Contrainte ABSOLUE : aucune suggestion qui rajoute du texte a l'ecran ou re-meuble ce qu'on a epure.

Format : 3 sections (A DEJA AU NIVEAU / B ECARTS QUI COMPTENT / C MINEUR), bullet points concrets.
"""


def load_key():
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    if not Path(args.video).exists():
        print(f"introuvable: {args.video}"); sys.exit(1)
    key = load_key()
    if not key:
        print("GEMINI_API_KEY manquante"); sys.exit(1)

    client = genai.Client(api_key=key)
    print(f"Upload {args.video} ...")
    f = client.files.upload(file=args.video)
    # attendre ACTIVE
    for _ in range(60):
        f = client.files.get(name=f.name)
        if f.state == "ACTIVE":
            break
        if f.state == "FAILED":
            print("upload FAILED"); sys.exit(2)
        time.sleep(2)
    print(f"Fichier ACTIVE: {f.name}. Appel Gemini...")

    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[f, BRIEF],
        config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=3000),
    )
    out = resp.text or "(reponse vide)"
    print("\n" + "=" * 70 + "\n" + out + "\n" + "=" * 70)
    if args.out:
        Path(args.out).write_text(out)
        print(f"-> {args.out}")


if __name__ == "__main__":
    main()
