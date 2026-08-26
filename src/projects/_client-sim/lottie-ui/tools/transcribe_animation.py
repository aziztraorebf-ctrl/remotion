#!/usr/bin/env python3
"""
Transcrit une animation Remotion en Lottie, frame par frame.

⭐ LE PROBLEME QU'IL RESOUT (mesure le 2026-08-25, signale par Aziz) :
convertir UNE image d'une scene puis l'animer par transformations ne rend pas
les animations dites "par recalcul de forme". La flamme de GazoducActe5Maison
en est l'exemple : son trace est REFABRIQUE a chaque image (la pointe ondule,
la hauteur respire). Mesure dans la zone de la flamme, sur 40 images :
    original 98 pixels changent par image · Lottie converti 0.
Elle etait FIGEE, et aucune de nos verifications ne pouvait le voir : elles
comparaient a une image fixe, jamais a la video.

⭐ CE QU'IL FAIT : extrait la scene a CHAQUE frame demandee, puis pose les
sommets successifs de chaque chemin comme des KEYFRAMES de forme. Lottie
supporte nativement l'animation de path ("ks": {"a": 1, ...} sur un 'sh').

⛔ CONTRAINTE DU FORMAT, incontournable : toutes les keyframes d'un meme
chemin doivent avoir LE MEME NOMBRE DE SOMMETS (la spec Lottie l'exige pour
pouvoir interpoler). Un chemin dont le nombre de points varie dans le temps
n'est donc PAS transcriptible PAR EXTRACTION -- le script le signale au lieu
de produire un fichier faux.

⭐ MAIS LE MUR SE CONTOURNE (prouve le 2026-08-26, ne pas relire l'alinea
ci-dessus comme un refus definitif) : une courbe qui se construit point par
point (comme `buildCurve` du Gazoduc A5) echantillonne en general sur une
grille FIXE (i/steps) ; seul le NOMBRE de points TRACES varie. En REGENERANT
la forme depuis les constantes du composant -- toujours N+1 points, la queue
ecrasee sur la pointe -- le compte devient constant et Lottie interpole.
    -> `vivifier.py` : `courbe_recalculee()` / `echantillonner()`.
Mesure : pointe finale reconstruite identique a l'attendu (x1273,0 y477,1).
⚠️ Ce n'est pas de la transcription mais de la RECONSTRUCTION : il faut les
constantes du CODE SOURCE (jamais d'un fichier converti, qui porte des valeurs
deja transformees -- vecu : X1=984 lu au lieu de 1560, courbe a mi-parcours).

Usage :
    python3 transcribe_animation.py <CompositionId> --frames 70-160 --pas 2 \\
        --calques flame -o flamme.json
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

ICI = os.path.dirname(os.path.abspath(__file__))


def extraire(compo, frame, dossier):
    """Une frame -> fichier .svg. Renvoie son chemin."""
    sortie = os.path.join(dossier, f"f{frame:05d}.svg")
    r = subprocess.run(
        ["node", os.path.join(ICI, "extract-remotion-svg.mjs"), compo,
         "--frame", str(frame), "-o", sortie],
        capture_output=True, text=True)
    if not os.path.exists(sortie):
        raise RuntimeError(f"extraction frame {frame} echouee :\n{r.stderr[-400:]}")
    return sortie


def convertir(svg, dossier, frame):
    """Un .svg -> document Lottie (via le convertisseur deja eprouve)."""
    sortie = os.path.join(dossier, f"f{frame:05d}.json")
    subprocess.run(
        [sys.executable, os.path.join(ICI, "svg2lottie_scene.py"), svg, "-o", sortie],
        capture_output=True, text=True)
    if not os.path.exists(sortie):
        raise RuntimeError(f"conversion frame {frame} echouee")
    return json.load(open(sortie, encoding="utf-8"))


def chemins_du_calque(couche):
    """Tous les 'sh' d'un calque, dans l'ordre, avec leur groupe."""
    out = []
    for ig, groupe in enumerate(couche.get("shapes", [])):
        for it in groupe.get("it", []):
            if it.get("ty") == "sh":
                out.append((ig, it))
    return out


def transcrire(compo, frames, motifs, dossier):
    """
    Retourne (doc Lottie anime, rapport).

    Le 1er document sert de squelette ; les suivants ne fournissent que les
    sommets, qui deviennent des keyframes de forme.
    """
    docs = []
    for f in frames:
        svg = extraire(compo, f, dossier)
        docs.append((f, convertir(svg, dossier, f)))
        print(f"   frame {f} extraite", flush=True)

    base = docs[0][1]
    rapport = {"animes": [], "figes": [], "refuses": []}

    # index des calques par nom dans chaque document
    par_nom = [{c["nm"]: c for c in d["layers"]} for _, d in docs]

    for couche in base["layers"]:
        nom = couche["nm"]
        if motifs and not any(m.lower() in nom.lower() for m in motifs):
            rapport["figes"].append(nom)
            continue

        chemins = chemins_du_calque(couche)
        ok = True
        for idx, (ig, forme) in enumerate(chemins):
            series = []
            for i, (f, _) in enumerate(docs):
                autre = par_nom[i].get(nom)
                if not autre:
                    ok = False
                    break
                ch = chemins_du_calque(autre)
                if idx >= len(ch):
                    ok = False
                    break
                k = ch[idx][1]["ks"]["k"]
                series.append((f, k))
            if not ok:
                break

            # ⛔ Contrainte Lottie : meme nombre de sommets partout.
            tailles = {len(k["v"]) for _, k in series}
            if len(tailles) > 1:
                rapport["refuses"].append(
                    f"{nom} : le nombre de sommets varie ({sorted(tailles)}) — "
                    "non interpolable par Lottie")
                ok = False
                break

            if all(k["v"] == series[0][1]["v"] for _, k in series):
                continue                     # ce chemin ne bouge pas : on le laisse fixe

            forme["ks"] = {"a": 1, "k": [
                {"t": f,
                 "s": [{"c": k["c"], "v": k["v"], "i": k["i"], "o": k["o"]}],
                 **({"o": {"x": [0.4], "y": [0]}, "i": {"x": [0.6], "y": [1]}}
                    if j < len(series) - 1 else {})}
                for j, (f, k) in enumerate(series)]}
            if nom not in rapport["animes"]:
                rapport["animes"].append(nom)

        # Le groupe peut aussi porter un transform anime (scale de respiration) :
        # on le reprend depuis les documents successifs.
        transcrire_transform(couche, nom, par_nom, docs, rapport)

    # ⛔ PIEGE PAYE : mettre a jour "op" sur le DOCUMENT ne suffit pas. Chaque
    # CALQUE a sa propre plage ip/op, heritee de la conversion (60 frames par
    # defaut). Des keyframes posees a t=100 sur un calque qui meurt a t=60 ne
    # s'affichent JAMAIS -- le fichier est valide, le rapport dit "transcrit",
    # et rien ne bouge. Meme famille que le bug de l'ancre au coin de l'ecran :
    # l'animation est correcte, c'est son CONTENANT qui l'annule.
    fin_reelle = frames[-1] + 1
    base["op"] = fin_reelle
    for couche in base["layers"]:
        couche["ip"] = min(couche.get("ip", 0), frames[0])
        couche["op"] = fin_reelle
    return base, rapport


def transcrire_transform(couche, nom, par_nom, docs, rapport):
    """Anime l'echelle d'un groupe si elle varie d'une frame a l'autre."""
    for ig, groupe in enumerate(couche.get("shapes", [])):
        trs = [it for it in groupe.get("it", []) if it.get("ty") == "tr"]
        if not trs:
            continue
        tr = trs[0]
        series = []
        for i, (f, _) in enumerate(docs):
            autre = par_nom[i].get(nom)
            if not autre or ig >= len(autre.get("shapes", [])):
                return
            t2 = [x for x in autre["shapes"][ig].get("it", []) if x.get("ty") == "tr"]
            if not t2:
                return
            series.append((f, t2[0]))
        for cle in ("s", "p"):
            vals = [(f, t[cle]["k"]) for f, t in series if isinstance(t.get(cle), dict)]
            if len(vals) == len(series) and len({tuple(v) for _, v in vals}) > 1:
                tr[cle] = {"a": 1, "k": [
                    {"t": f, "s": list(v),
                     **({"o": {"x": [0.4], "y": [0]}, "i": {"x": [0.6], "y": [1]}}
                        if j < len(vals) - 1 else {})}
                    for j, (f, v) in enumerate(vals)]}
                if nom not in rapport["animes"]:
                    rapport["animes"].append(nom)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("composition")
    ap.add_argument("--frames", required=True, help="ex. 70-160")
    ap.add_argument("--pas", type=int, default=2, help="1 frame sur N (defaut 2)")
    ap.add_argument("--calques", help="motifs separes par des virgules (sinon tous)")
    ap.add_argument("-o", "--out", required=True)
    a = ap.parse_args()

    m = re.match(r"^(\d+)-(\d+)$", a.frames)
    if not m:
        print("--frames attend un intervalle, ex. 70-160", file=sys.stderr)
        return 2
    debut, fin = int(m.group(1)), int(m.group(2))
    frames = list(range(debut, fin + 1, a.pas))
    motifs = [x.strip() for x in a.calques.split(",")] if a.calques else None

    print(f"transcription de {a.composition} : {len(frames)} frames "
          f"({debut}-{fin}, 1 sur {a.pas})")
    with tempfile.TemporaryDirectory() as tmp:
        doc, rapport = transcrire(a.composition, frames, motifs, tmp)

    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"))

    print()
    if rapport["animes"]:
        print(f"  ✓ transcrits : {', '.join(rapport['animes'])}")
    if rapport["refuses"]:
        print(f"  ⛔ REFUSES :")
        for r in rapport["refuses"]:
            print(f"      - {r}")
    print(f"  {len(rapport['figes'])} calques laisses fixes")
    print(f"  {a.out} ({os.path.getsize(a.out)/1024:.1f} Ko, {doc['op']} frames)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
