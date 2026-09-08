#!/usr/bin/env python3
"""Verifie un SVG contre les contraintes REELLES de notre pipeline SVG -> Lottie.

Source des regles : .claude/agents/svg-dessinateur.md (les 4 regles de dessin).
Chaque critere est MESURABLE : ce script remplace le "je trouve que c'est bien".

Usage : python3 svg-conformite-pipeline.py <fichier.svg> [...]
Sortie : une ligne par fichier + detail des violations. Exit 1 si un fichier echoue.
"""
import re
import sys
import pathlib
from collections import Counter

# Elements interdits : ils cassent la conversion Lottie
INTERDITS = ["<filter", "<feGaussianBlur", "<feTurbulence", "<feDisplacementMap",
             "<mask", "<clipPath", "<use", "<pattern"]
# Animation : le modele dessine, NOUS animons
ANIMATION = ["<animate", "<animateTransform", "<animateMotion", "<set ",
             "@keyframes", "animation:", "transition:"]

GENERIQUE = re.compile(r"^(path|rect|circle|ellipse|polygon|g|layer|group|shape|item|el|obj)[-_]?\d*$", re.I)


def analyse(p: pathlib.Path) -> dict:
    s = p.read_text(errors="replace")
    r = {"fichier": p.name, "violations": [], "avert": []}

    if "<svg" not in s:
        r["violations"].append("pas de balise <svg>")
        r["score"] = 0
        return r

    # ⛔ GATE N1 : le XML doit etre BIEN FORME. Un fichier tronque (finish_reason
    # "length") passe tous les autres criteres et ne s'affiche nulle part.
    # Ajoute le 2026-09-05 apres qu'un rapport 100/100 a ete donne a 4 fichiers casses.
    try:
        import xml.etree.ElementTree as ET
        ET.fromstring(s)
    except Exception as e:
        r["violations"].append(f"XML INVALIDE ({str(e)[:70]}) — ne s'affiche pas")
        r["score"] = 0
        return r

    # --- interdits de format ---
    for bad in INTERDITS:
        n = s.count(bad)
        if n:
            r["violations"].append(f"{bad}> x{n} (casse Lottie)")
    for bad in ANIMATION:
        n = s.count(bad)
        if n:
            r["violations"].append(f"ANIMATION {bad} x{n} (le modele ne doit pas animer)")

    # --- formes ---
    formes = sum(s.count(f"<{t}") for t in ("path", "rect", "circle", "ellipse", "polygon", "polyline"))
    r["formes"] = formes
    groupes = s.count("<g ")
    r["groupes"] = groupes

    # --- degrades : le relief doit venir de l'empilement ---
    grads = s.count("<linearGradient") + s.count("<radialGradient")
    r["degrades"] = grads
    # reference metier : 227 formes / 15 degrades = ~15 formes par degrade
    if grads and formes / grads < 4:
        r["avert"].append(f"ratio formes/degrades = {formes/grads:.1f} (metier ~15 : relief peut-etre porte par les degrades)")

    # --- ids ---
    ids = re.findall(r'\bid="([^"]+)"', s)
    r["ids"] = len(ids)
    dup = [k for k, v in Counter(ids).items() if v > 1]
    if dup:
        r["violations"].append(f"ID DUPLIQUES x{len(dup)}: {', '.join(dup[:4])} (fige le player Lottie)")
    generiques = [i for i in ids if GENERIQUE.match(i)]
    if ids:
        pct = 100 * (len(ids) - len(generiques)) / len(ids)
        r["pct_nommes"] = round(pct)
        if pct < 86:
            r["avert"].append(f"{round(pct)}% d'ids nommes par fonction (metier 86%, cible 100%)")
    else:
        r["pct_nommes"] = 0
        r["violations"].append("aucun id (rien n'est manipulable en calques)")

    # --- accents dans les ids ---
    if any(re.search(r"[^\x00-\x7F]", i) for i in ids):
        r["violations"].append("accent/non-ASCII dans un id")

    # --- formes fermees et remplies ---
    paths = re.findall(r"<path\b[^>]*>", s)
    sans_fill = [q for q in paths if "fill=" not in q and "fill:" not in q]
    if paths and len(sans_fill) / len(paths) > 0.3:
        r["avert"].append(f"{len(sans_fill)}/{len(paths)} paths sans fill (doivent etre recolorables)")

    # --- ⛔⛔ ARCS EN STROKE SANS fill="none" — VIOLATION, pas avertissement ---
    # Un <path stroke=...> sans attribut fill HERITE du fill de son groupe parent et SE REMPLIT.
    # Sur un objet rond (beaucoup d'arcs de reflet) c'est systemique : 73 cas sur le reveil du
    # 2026-09-05, deux bandes noires en travers du cadran — decouvertes APRES un 100/100.
    # ⛔ L'ancien controle ci-dessus ne les voyait pas : seuil a 30 % (43/377 = 11 %) et sans
    # distinguer les paths a stroke, les seuls ou l'heritage se VOIT.
    stroke_sans_fill = [q for q in paths
                        if "stroke=" in q and "fill=" not in q and "fill:" not in q]
    if stroke_sans_fill:
        r["violations"].append(
            f'{len(stroke_sans_fill)} path(s) avec stroke ET sans fill="none" '
            f"(ils heritent du fill du parent et se remplissent)")

    # --- score ---
    score = 100
    score -= 25 * len(r["violations"])
    score -= 5 * len(r["avert"])
    if formes < 20:
        score -= 20
        r["avert"].append(f"seulement {formes} formes (5-12 par objet attendu)")
    r["score"] = max(0, score)
    return r


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    rows = [analyse(pathlib.Path(a)) for a in sys.argv[1:]]
    ko = 0
    print(f"{'fichier':34s} {'score':>5} {'formes':>7} {'grp':>4} {'grad':>5} {'ids':>4} {'nom%':>5}")
    print("-" * 74)
    for r in sorted(rows, key=lambda x: -x["score"]):
        print(f"{r['fichier']:34s} {r['score']:5d} {r.get('formes',0):7d} "
              f"{r.get('groupes',0):4d} {r.get('degrades',0):5d} {r.get('ids',0):4d} "
              f"{r.get('pct_nommes',0):5d}")
        for v in r["violations"]:
            print(f"    X {v}")
            ko = 1
        for a in r["avert"]:
            print(f"    ! {a}")
    return ko


if __name__ == "__main__":
    sys.exit(main())
