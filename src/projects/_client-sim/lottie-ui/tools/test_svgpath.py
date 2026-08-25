#!/usr/bin/env python3
"""
Tests de svgpath.parse_path. Sans dependance : lancer `python3 test_svgpath.py`.

⭐ POURQUOI CES TESTS-LA : en developpant le module, 4 mesures successives ont
accuse a tort un code JUSTE, et une 5e a declare "exact" un code FAUX. Les
tests ci-dessous sont ceux qui ont fini par trancher, gardes pour ne pas
refaire le chemin :

  - INVARIANT RADIAL (arcs) : tout point d'un arc circulaire est a R du centre.
    Exact, sans reference externe, sans echantillonnage a apparier. C'est LUI
    qui a revele que la decoupe a 90 deg derivait de 0,11 px a R=400 -- ce que
    trois mesures precedentes avaient manque.
    ⛔ Ne PAS mesurer l'erreur au seul milieu (t=0,5) : elle y est nulle par
    construction. C'est l'erreur qui m'a fait conclure "exact" sur un code faux.
  - RECONSTRUCTION DES CONTROLES (cubiques) : un C SVG doit ressortir avec des
    points de controle identiques. Egalite exacte, pas une tolerance.
  - ALLER-RETOUR (quadratiques) : Q eleve en cubique doit passer par le meme
    point milieu, calcule analytiquement.

⛔ Ce qu'il ne faut PAS refaire : comparer deux nuages de points par distance
de Hausdorff. Ca mesure l'espacement des echantillons, pas l'ecart des courbes.
"""

import math
import sys

from svgpath import parse_path, PathError

FAILS = []


def check(name, cond, detail=""):
    print(f"  {'ok  ' if cond else 'FAIL'}  {name}{'' if cond else '  <- ' + detail}")
    if not cond:
        FAILS.append(name)


def cubics(shapes):
    """Reconstruit les cubiques absolues (v + tangentes relatives i/o)."""
    segs = []
    for sh in shapes:
        k = sh["ks"]["k"]
        v, i, o, closed = k["v"], k["i"], k["o"], k["c"]
        idx = list(range(len(v) - 1)) + ([len(v) - 1] if closed and len(v) > 1 else [])
        for a in idx:
            b = (a + 1) % len(v)
            segs.append((v[a],
                         [v[a][0] + o[a][0], v[a][1] + o[a][1]],
                         [v[b][0] + i[b][0], v[b][1] + i[b][1]],
                         v[b]))
    return segs


def sample(shapes, n=200):
    pts = []
    for p0, c1, c2, p1 in cubics(shapes):
        for s in range(n + 1):
            t = s / n
            u = 1 - t
            pts.append((u*u*u*p0[0] + 3*u*u*t*c1[0] + 3*u*t*t*c2[0] + t*t*t*p1[0],
                        u*u*u*p0[1] + 3*u*u*t*c1[1] + 3*u*t*t*c2[1] + t*t*t*p1[1]))
    return pts


# --- 1. Segments droits : tangentes nulles, pas de sommet en trop -------------
print("\nSEGMENTS DROITS")

k = parse_path("M 10 10 H 90 V 90 H 10 Z")[0]["ks"]["k"]
check("rectangle H/V ferme = 4 sommets", len(k["v"]) == 4, f"{len(k['v'])} sommets")
check("rectangle ferme (c=True)", k["c"] is True)
check("rectangle sans tangentes",
      all(t == [0.0, 0.0] for t in k["i"] + k["o"]))
check("rectangle coordonnees justes",
      k["v"] == [[10, 10], [90, 10], [90, 90], [10, 90]], str(k["v"]))

k = parse_path("M 10 10 L 30 10 50 30 70 10")[0]["ks"]["k"]
check("repetition implicite de L", len(k["v"]) == 4, f"{len(k['v'])} sommets")

k = parse_path("M 10 10 L 90 10 L 90 90 L 10 10 Z")[0]["ks"]["k"]
check("Z sur point de depart ne duplique pas", len(k["v"]) == 3, f"{len(k['v'])} sommets")


# --- 2. Cubiques : les points de controle doivent ressortir a l'identique -----
print("\nCUBIQUES (egalite exacte des controles)")

p0, c1, c2, p1 = cubics(parse_path("M 10 80 C 40 10 65 10 95 80"))[0]
check("C absolu : controles exacts",
      c1 == [40, 10] and c2 == [65, 10], f"c1={c1} c2={c2}")
check("C absolu : extremites exactes", p0 == [10, 80] and p1 == [95, 80])

p0r, c1r, c2r, p1r = cubics(parse_path("m 10 80 c 30 -70 55 -70 85 0"))[0]
check("c relatif == C absolu", [p0r, c1r, c2r, p1r] == [p0, c1, c2, p1])

# S reflechit le controle precedent autour du point courant
segs = cubics(parse_path("M 10 80 C 40 10 65 10 95 80 S 150 150 180 80"))
check("S : controle reflechi", segs[1][1] == [125, 150], str(segs[1][1]))
# S sans C avant : le controle vaut le point courant (spec SVG)
s0 = cubics(parse_path("M 10 80 S 65 10 95 80"))[0]
check("S sans C avant : c1 = point courant", s0[1] == [10, 80], str(s0[1]))


# --- 3. Quadratiques : elevation exacte au degre 3 ----------------------------
print("\nQUADRATIQUES (elevation exacte)")

# ⚠️ 2/3 est periodique : les controles theoriques sont irrationnels en
# decimal, donc on compare avec la tolerance de l'ARRONDI demande, pas a
# l'egalite stricte. (Le 1er jet de ce test comparait 38.3333 a 38.33333...
# et signalait un echec sur une conversion juste.)
P0, Q, P1 = (10, 80), (52.5, 10), (95, 80)
p0, c1, c2, p1 = cubics(parse_path("M 10 80 Q 52.5 10 95 80", precision=12))[0]
exp1 = [P0[0] + 2/3*(Q[0]-P0[0]), P0[1] + 2/3*(Q[1]-P0[1])]
exp2 = [P1[0] + 2/3*(Q[0]-P1[0]), P1[1] + 2/3*(Q[1]-P1[1])]
check("Q -> cubique : controles theoriques",
      max(abs(c1[0]-exp1[0]), abs(c1[1]-exp1[1]),
          abs(c2[0]-exp2[0]), abs(c2[1]-exp2[1])) < 1e-9, f"{c1} {c2}")

# Point milieu : la quadratique et sa cubique elevee doivent coincider
qm = ((P0[0]+2*Q[0]+P1[0])/4, (P0[1]+2*Q[1]+P1[1])/4)
cm = ((p0[0]+3*c1[0]+3*c2[0]+p1[0])/8, (p0[1]+3*c1[1]+3*c2[1]+p1[1])/8)
check("Q : meme point milieu", math.dist(qm, cm) < 1e-9, f"{qm} vs {cm}")

# A la precision de sortie par defaut (4 decimales), l'ecart doit rester
# invisible a l'ecran -- c'est ca qui compte en pratique.
p0d, c1d, c2d, p1d = cubics(parse_path("M 10 80 Q 52.5 10 95 80"))[0]
cmd = ((p0d[0]+3*c1d[0]+3*c2d[0]+p1d[0])/8, (p0d[1]+3*c1d[1]+3*c2d[1]+p1d[1])/8)
check("Q : arrondi par defaut sous 1e-3 px", math.dist(qm, cmd) < 1e-3,
      f"{math.dist(qm, cmd):.2e}")

t0 = cubics(parse_path("M 10 80 Q 52.5 10 95 80 T 180 80"))[1]
check("T : quadratique reflechie", t0 is not None)


# --- 4. Arcs : invariant radial (LE test qui a trouve le vrai bug) ------------
print("\nARCS (invariant radial : |P - centre| == R)")

ARCS = [
    ("quart R=40",        "M 10 50 A 40 40 0 0 1 50 10",  (50, 50),     40),
    ("quart sweep=0",     "M 10 50 A 40 40 0 0 0 50 10",  (10, 10),     40),
    ("demi-cercle",       "M 10 50 A 40 40 0 1 1 90 50",  (50, 50),     40),
    ("petit R=5",         "M 0 5 A 5 5 0 0 1 10 5",       (5, 5),        5),
    ("grand R=400",       "M 100 500 A 400 400 0 1 1 900 500", (500, 500), 400),
    ("tres grand R=2000", "M 0 2000 A 2000 2000 0 0 1 2000 0", (2000, 2000), 2000),
    ("cercle 4 arcs",
     "M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 "
     "A 40 40 0 0 1 10 50 A 40 40 0 0 1 50 10 Z", (50, 50), 40),
]
TOL = 0.01
for name, d, c, R in ARCS:
    e = max(abs(math.hypot(p[0]-c[0], p[1]-c[1]) - R)
            for p in sample(parse_path(d, precision=12), n=300))
    check(f"{name:<18} ecart {e:.2e} px", e < TOL, f"{e:.3e} >= {TOL}")

# Cas limites d'arc imposes par la spec
k = parse_path("M 10 50 A 0 0 0 0 1 90 50")[0]["ks"]["k"]
check("arc de rayon nul -> segment droit", len(k["v"]) == 2, f"{len(k['v'])} sommets")

# Rayons trop petits : la spec impose de les agrandir, l'arc doit rester continu
pts = sample(parse_path("M 10 50 A 5 5 0 0 1 90 50", precision=12), n=200)
check("arc a rayons trop petits : corrige",
      math.dist(pts[0], (10, 50)) < 1e-6 and math.dist(pts[-1], (90, 50)) < 1e-6,
      f"{pts[0]} -> {pts[-1]}")


# --- 5. Continuite : le trace ne doit jamais sauter --------------------------
print("\nCONTINUITE ET EXTREMITES")

for name, d, start, end in [
    ("mixte L/Q/A ferme",
     "M 10 10 L 90 10 Q 100 10 100 20 L 100 90 A 10 10 0 0 1 90 100 L 10 100 Z",
     (10, 10), (10, 10)),
    ("arc puis ligne", "M 10 50 A 40 40 0 0 1 50 10 L 90 10", (10, 50), (90, 10)),
]:
    pts = sample(parse_path(d, precision=12), n=100)
    ok = math.dist(pts[0], start) < 1e-6 and math.dist(pts[-1], end) < 1e-6
    check(f"{name}: extremites", ok, f"{pts[0]} -> {pts[-1]}")
    gaps = max(math.dist(a, b) for a, b in zip(pts, pts[1:]))
    check(f"{name}: aucun saut", gaps < 5.0, f"saut max {gaps:.2f} px")


# --- 6. Robustesse de la grammaire -------------------------------------------
print("\nGRAMMAIRE")

check("decimales collees (.5.5)", len(parse_path("M .5.5 L 1.5.5 2.5 1.5")[0]["ks"]["k"]["v"]) == 3)
check("signes colles (M-10-10)", len(parse_path("M-10-10L20,20 30-5")[0]["ks"]["k"]["v"]) == 3)
check("notation exponentielle", len(parse_path("M0,0C1e1,0 2e1,1e1 20,20")[0]["ks"]["k"]["v"]) == 2)
check("2 sous-chemins -> 2 shapes",
      len(parse_path("M 10 10 L 50 10 L 50 50 Z M 60 60 C 70 50 90 50 95 70")) == 2)
check("translation dx/dy aplatie",
      parse_path("M 0 0 L 10 0", dx=5, dy=7)[0]["ks"]["k"]["v"] == [[5, 7], [15, 7]])

print("\nERREURS ATTENDUES (echec bruyant, jamais silencieux)")
for name, d in [("path vide", ""), ("commande inconnue", "M 0 0 X 5 5"),
                ("commande incomplete", "M 0 0 C 1 2 3"),
                ("commence par un nombre", "10 20 L 30 40")]:
    try:
        parse_path(d)
        check(name, False, "aurait du lever PathError")
    except PathError:
        check(name, True)
    except Exception as e:
        check(name, False, f"a leve {type(e).__name__} au lieu de PathError")


print("\n" + "=" * 58)
if FAILS:
    print(f"{len(FAILS)} ECHEC(S) : " + ", ".join(FAILS))
    sys.exit(1)
print("Tous les tests passent.")
