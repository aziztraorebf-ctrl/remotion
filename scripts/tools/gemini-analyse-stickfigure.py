#!/usr/bin/env python3
"""
Analyse Gemini 3.1 Pro de l'animation d'un personnage STICK FIGURE d'encre (R&D 2026-06-30).
On envoie 2 videos (un perso simple + un perso plus complexe) et on demande ce qui CLOCHE dans
l'ANIMATION et comment des stick figures devraient bouger (marche, penche, ramassage naturel).
Gemini = SIGNAL, pas juge : on filtre apres.

Usage : python3 scripts/tools/gemini-analyse-stickfigure.py <video_simple.mp4> <video_complexe.mp4> [--out brief.md]
"""
import sys, time, argparse
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3.1-pro-preview"

BRIEF = """Tu es animateur 2D senior (principes Disney : squash/stretch, anticipation, arcs, ease in/out,
follow-through, timing) ET developpeur d'animation procedurale (personnages anim'es par code, pas frame-by-frame).

CONTEXTE — ce que tu regardes :
2 videos d'un MEME personnage "stick figure" (homme-baton d'encre, chapeau de paille = un planteur de cacao)
pour une chaine de documentaires economiques africains, registre dessin a l'encre sur parchemin. Le perso doit :
ENTRER en marchant par la gauche, s'arreter pres d'un cacaoyer, SE PENCHER, et RAMASSER une feve/cabosse au sol.
- VIDEO 1 (libelle "ACTUEL" ou "simple") : un stick figure tres simple, segments droits, pas d'articulations.
- VIDEO 2 (libelle "ORGANIQUE") : une version plus complexe (membres en courbes, genoux articules).

L'auteur (le realisateur) a tranche : il PREFERE le stick figure SIMPLE (video 1). Il pense que la complexite
du corps (video 2) est une erreur, et que le VRAI probleme n'est pas le corps mais l'ANIMATION : la marche
semble trop rapide / "glissee", et le geste de SE PENCHER + RAMASSER est peu naturel (dans une version la feve
"monte magiquement" dans la main au lieu d'un vrai geste de ramassage).

CONTRAINTES NON-NEGOCIABLES (ne pas les remettre en cause) :
- Le perso RESTE un stick figure simple, stylise pictogramme, JAMAIS un humain realiste/detaille.
- Animation 100% PROCEDURALE par CODE (fonctions de la frame : sin/cos/easing/interpolation). PAS de frame-by-frame,
  PAS de sprites, PAS de bibliotheque d'images. Tout doit etre calculable en SVG anime par le numero de frame.

TA MISSION — analyse d'ANIMATION, concrete et actionnable :
1. MARCHE : qu'est-ce qui fait que la marche parait "trop rapide / glissee" ? Comment la rendre credible
   (cadence, longueur de pas, contact pied-sol, report de poids, bob du bassin, balancier des bras) ? Donne des
   ORDRES DE GRANDEUR exploitables en code (ex : "cycle de marche ~0.8-1s", "le pied en appui ne doit pas glisser").
2. SE PENCHER : comment un stick figure doit-il se baisser vers le sol sans basculer en arriere ? (flexion hanche
   vs genoux, ou va le centre de masse, faut-il plier les jambes ?). Decris la POSE-cle et la trajectoire.
3. RAMASSER NATURELLEMENT : comment animer un vrai geste de ramassage (la main DESCEND, TOUCHE la feve, la SAISIT,
   REMONTE avec) au lieu d'une feve qui levite ? Decris le timing et la sequence de poses.
4. NETTETE / LISIBILITE du perso en encre : quels details de trait/epaisseur/silhouette rendent un stick figure
   "propre et digne" plutot qu'amateur ?

Sois SPECIFIQUE et orienté CODE PROCEDURAL (ce que je peux traduire en formules de frame). Distingue ce qui compte
vraiment (gros impact) de ce qui est cosmetique. Format : 4 sections (MARCHE / PENCHER / RAMASSER / NETTETE),
bullet points concrets avec ordres de grandeur.
"""


def load_key():
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    import os
    return os.environ.get("GEMINI_API_KEY")


def upload_active(client, path):
    print(f"Upload {path} ...")
    f = client.files.upload(file=path)
    for _ in range(60):
        f = client.files.get(name=f.name)
        if f.state == "ACTIVE":
            return f
        if f.state == "FAILED":
            print("upload FAILED"); sys.exit(2)
        time.sleep(2)
    print("timeout upload"); sys.exit(2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video_simple")
    ap.add_argument("video_complexe")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    for v in (args.video_simple, args.video_complexe):
        if not Path(v).exists():
            print(f"introuvable: {v}"); sys.exit(1)
    key = load_key()
    if not key:
        print("GEMINI_API_KEY manquante"); sys.exit(1)
    client = genai.Client(api_key=key)
    f1 = upload_active(client, args.video_simple)
    f2 = upload_active(client, args.video_complexe)
    print("Les 2 ACTIVE. Appel Gemini...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=["VIDEO 1 (ACTUEL / simple) :", f1, "VIDEO 2 (ORGANIQUE / complexe) :", f2, BRIEF],
        config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=4000),
    )
    out = resp.text or "(reponse vide)"
    print("\n" + "=" * 70 + "\n" + out + "\n" + "=" * 70)
    if args.out:
        Path(args.out).write_text(out)
        print(f"-> {args.out}")


if __name__ == "__main__":
    main()
