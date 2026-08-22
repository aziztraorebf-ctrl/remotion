#!/usr/bin/env python3
"""
carto-selfreview.py — self-review MECANIQUE d'une frame cartographique.

⛔ POURQUOI CETTE BRIQUE EXISTE (payee le 2026-08-21/22, demo client Zambie)
Trois defauts ont traverse plusieurs rendus SANS etre vus, jusqu'a ce qu'Aziz les signale :
  1. un GLOBE non voulu — Mapbox v3 bascule tout seul en projection globe sous zoom ~5.
     Rien ne plante, l'image est juste fausse.
  2. un FOND NOIR RGB(9,9,9) au lieu du bleu marine RGB(21,53,82) de la palette maison :
     j'utilisais dark-v11 brut sans appeler applyGeoAfriqueV5().
  3. un CADRAGE juge a l'oeil sur des vignettes — deux modeles ont alors halluciné
     "le pays occupe 15-20 % du cadre" alors que la mesure donnait 61 %.

Le point commun : AUCUN n'est un jugement de gout. Tous se MESURENT sur la frame rendue.
Une note globale (19/25, 8,5/10) ne les attrape pas — elle moyenne le mesurable et
l'opinion. Cette brique ne verifie QUE le mesurable, en O/X, avant tout appel de modele
et avant toute presentation.

Usage :
  carto-selfreview.py --frame f.png [--attendu-fond RRGGBB] [--sujet-min 45] [--sujet-max 90]
                      [--globe-interdit] [--cible-case case.png]

Sortie : une ligne O/X par critere + un score + exit 1 si un critere DUR echoue.
"""
import argparse
import sys
from collections import Counter

from PIL import Image


def coins_hors_disque(im: Image.Image) -> int:
    """
    Compte les coins qui appartiennent au FOND et non a la carte.

    ⚠️ Ne PAS tester "coin noir" : le fond d'un globe n'est pas forcement noir (concept A :
    RGB(10,16,32), bleu nuit) — faux positif rencontre des le 1er usage de ce script.
    On compare les coins au CENTRE : sur une carte plate, coin et centre appartiennent a la
    meme image, donc se ressemblent. Sur un globe, les coins sont le vide autour du disque.
    """
    px = im.load()
    w, h = im.size
    m = 30
    centre = px[w // 2, h // 2][:3]
    n = 0
    for x, y in ((m, m), (w - m, m), (m, h - m), (w - m, h - m)):
        c = px[x, y][:3]
        # coin tres sombre ET nettement plus sombre que le centre = hors disque
        if sum(c) < 120 and sum(centre) - sum(c) > 60:
            n += 1
    return n


def couleur_fond(im: Image.Image) -> tuple:
    """Couleur dominante des bords : c'est le fond, pas le sujet (centre)."""
    w, h = im.size
    px = im.load()
    ech = []
    for x in range(0, w, 7):
        ech.append(px[x, 6])
        ech.append(px[x, h - 7])
    for y in range(0, h, 7):
        ech.append(px[6, y])
        ech.append(px[w - 7, y])
    return Counter(ech).most_common(1)[0][0][:3]


def ecart_rgb(a: tuple, b: tuple) -> float:
    return sum(abs(a[i] - b[i]) for i in range(3)) / 3


def surface_sujet(im: Image.Image) -> tuple:
    """% du cadre occupe par le sujet (pixels satures : or/vert, pas le fond neutre)."""
    px = im.load()
    w, h = im.size
    xs, ys = [], []
    for y in range(0, h, 3):
        for x in range(0, w, 3):
            r, g, b = px[x, y][:3]
            sature = (r > 105 and r - b > 30) or (g > 85 and g - b > 25)
            if sature:
                xs.append(x)
                ys.append(y)
    if not xs:
        return 0.0, 0.0
    return 100 * (max(xs) - min(xs)) / w, 100 * (max(ys) - min(ys)) / h


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--frame", required=True)
    ap.add_argument("--attendu-fond", help="hex RRGGBB attendu pour le fond (palette maison)")
    ap.add_argument("--tolerance-fond", type=float, default=12.0, help="ecart RGB moyen tolere")
    ap.add_argument("--sujet-min", type=float, default=0.0, help="%% mini du cadre pour le sujet")
    ap.add_argument("--sujet-max", type=float, default=100.0)
    ap.add_argument("--globe-interdit", action="store_true")
    ap.add_argument("--globe-attendu", action="store_true")
    args = ap.parse_args()

    im = Image.open(args.frame).convert("RGB")
    resultats = []
    durs_ko = []

    # C1 — projection
    n = coins_hors_disque(im)
    if args.globe_interdit:
        ok = n < 3
        resultats.append(("C1", ok, f"projection plate attendue — {n}/4 coins hors-disque"))
        if not ok:
            durs_ko.append("C1 : un GLOBE s'est glisse (Mapbox bascule seul sous zoom ~5 : declarer projection)")
    elif args.globe_attendu:
        ok = n >= 3
        resultats.append(("C1", ok, f"globe attendu — {n}/4 coins hors-disque"))
        if not ok:
            durs_ko.append("C1 : globe attendu mais cadre rempli")
    else:
        resultats.append(("C1", True, f"projection non contrainte ({n}/4 coins hors-disque)"))

    # C2 — fond conforme a la palette
    fond = couleur_fond(im)
    if args.attendu_fond:
        cible = tuple(int(args.attendu_fond.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))
        e = ecart_rgb(fond, cible)
        ok = e <= args.tolerance_fond
        resultats.append(("C2", ok, f"fond {fond} vs cible {cible} — ecart {e:.1f}"))
        if not ok:
            durs_ko.append(f"C2 : fond hors palette (ecart {e:.1f}). Helper maison applique ?")
    else:
        resultats.append(("C2", True, f"fond {fond} (aucune cible fournie)"))

    # C3 — surface du sujet
    lw, lh = surface_sujet(im)
    ok = args.sujet_min <= lh <= args.sujet_max
    resultats.append(("C3", ok, f"sujet {lw:.0f}%x{lh:.0f}% du cadre (cible hauteur {args.sujet_min}-{args.sujet_max}%)"))
    if not ok:
        durs_ko.append(f"C3 : cadrage hors cible ({lh:.0f}% de hauteur)")

    # C4 — le cadre n'est pas majoritairement vide
    px = im.load()
    w, h = im.size
    vides = sum(
        1
        for y in range(0, h, 9)
        for x in range(0, w, 9)
        if sum(px[x, y]) < 60
    )
    total = len(range(0, h, 9)) * len(range(0, w, 9))
    part = 100 * vides / total
    # ⚠️ Un GLOBE laisse legitimement du vide autour de son disque : le seuil ne s'applique
    # qu'aux vues pleines (faux positif rencontre des le 1er usage : 73 % sur un globe correct).
    seuil_vide = 80 if args.globe_attendu else 55
    ok = part < seuil_vide
    resultats.append(("C4", ok, f"{part:.0f}% du cadre quasi-noir (seuil {seuil_vide}%)"))
    if not ok:
        durs_ko.append(f"C4 : {part:.0f}% du cadre est vide/noir")

    print(f"\n=== CARTO SELF-REVIEW — {args.frame} ===")
    for code, ok, msg in resultats:
        print(f"  [{code}] {'O' if ok else 'X'}  {msg}")
    score = sum(1 for _, ok, _ in resultats if ok)
    print(f"\n  SCORE : {score}/{len(resultats)}")

    if durs_ko:
        print("\n  ⛔ CRITERES DURS EN ECHEC — ne pas presenter, ne pas appeler un modele :")
        for d in durs_ko:
            print(f"     - {d}")
        sys.exit(1)
    print("  [OK] Aucun defaut mecanique. Le jugement de gout peut commencer.")


if __name__ == "__main__":
    main()
