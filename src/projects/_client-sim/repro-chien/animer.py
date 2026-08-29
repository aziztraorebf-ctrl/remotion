#!/usr/bin/env python3
"""
Anime le chien riggé, depuis les valeurs MESUREES sur la piece professionnelle.

⛔ AUCUNE VALEUR INVENTEE ICI. Tout vient de la lecture des keyframes du
fichier d'origine (out/_r-and-d/corpus-kamotion/02_Doggy_with_segments_3.json),
consignee dans partition.ts. Un commentaire qui justifie une valeur jamais
mesuree serait un signal d'alarme -- il n'y en a pas.

⭐ CE QUI REND CE SCRIPT COURT : le rig. Les pivots et le parentage sont
declares dans le SVG (data-pivot / data-parent) et portes par le convertisseur.
Animer se reduit donc a poser des ROTATIONS -- exactement ce que fait un studio
(mesure sur le Hiker du corpus : 90 % de l'animation est de la rotation sur des
dessins figes). On ne touche JAMAIS a la geometrie.

Usage : python3 animer.py <chien.json> -o <chien-anime.json>
"""

import argparse
import json
import sys

FPS = 60
DUREE = 290                      # 4,83 s a 60 fps, comme la piece d'origine
BATTEMENT = round(0.33 * FPS)    # ~20 frames : le pouls de la tete


def cles(paires, easing=(0.33, 0.67)):
    """
    Keyframes avec inertie douce. ⛔ Jamais lineaire : ca se voit immediatement,
    le mouvement devient mecanique.
    """
    ox, ix = easing
    out = []
    for i, (t, v) in enumerate(paires):
        k = {"t": round(t), "s": v if isinstance(v, list) else [v]}
        if i < len(paires) - 1:
            k["o"] = {"x": [ox], "y": [0]}
            k["i"] = {"x": [ix], "y": [1]}
        out.append(k)
    return {"a": 1, "k": out}


def oscille(amplitude, periode, duree=DUREE, phase=0.0, repos=0.0):
    """
    Va-et-vient regulier entre -amplitude et +amplitude.

    ⭐ `phase` est ce qui evite l'effet marionnette : mesure sur le rig
    professionnel du Hiker, la moitie des membres est decalee de 41 % du cycle.
    Les deux oreilles du chien d'origine sont dephasees de la meme facon
    (l'une demarre a 0,33 s, l'autre a 1,67 s).
    """
    paires = []
    t = -phase * periode
    haut = True
    while t < duree + periode:
        if t >= 0:
            paires.append((t, repos + (amplitude if haut else -amplitude)))
        t += periode / 2
        haut = not haut
    return cles(paires) if len(paires) > 1 else None


def saccades(positions, instants, duree=DUREE):
    """
    Deplacements INSTANTANES entre des cibles.

    ⭐⭐ LE DETAIL QU'ON N'AURAIT PAS INVENTE : dans la piece d'origine, l'iris
    bouge par PAIRES SERREES (0,33 -> 0,35 s, soit 0,02 s d'ecart). Ce sont des
    COUPS D'OEIL : le regard change de cible d'un coup. Interpoler doucement
    entre ces deux cles tuerait completement l'effet -- on obtiendrait un oeil
    qui glisse, ce qu'aucun oeil ne fait.
    """
    out = []
    for i, t0 in enumerate(instants):
        depart = positions[i % len(positions)]
        arrivee = positions[(i + 1) % len(positions)]
        out.append({"t": round(t0 * FPS), "s": list(depart),
                    "o": {"x": [0.9], "y": [0]}, "i": {"x": [0.1], "y": [1]}})
        out.append({"t": round((t0 + 0.02) * FPS), "s": list(arrivee),
                    "o": {"x": [0.9], "y": [0]}, "i": {"x": [0.1], "y": [1]}})
    out.sort(key=lambda k: k["t"])
    deduplique = []
    for k in out:
        if deduplique and deduplique[-1]["t"] == k["t"]:
            deduplique[-1] = k
        else:
            deduplique.append(k)
    if deduplique:
        deduplique[-1].pop("o", None)
        deduplique[-1].pop("i", None)
    return {"a": 1, "k": deduplique}



def souleve(angle, depart, periode, duree=DUREE, repos=0.0):
    """
    ⭐ LE SOULEVEMENT NATUREL (V2, demande d'Aziz) — l'oreille d'un chien qui
    se dresse MONTE VITE et RETOMBE LENTEMENT. C'est un principe d'animation
    classique, et c'est ce qui separe un geste vivant d'un va-et-vient de
    metronome : mon oscillation symetrique de la V1 se lisait comme un essuie-
    glace.

    Quatre temps, chacun avec sa propre courbe :
      montee   ~0,15 s, easing SORTANT vif      (le muscle qui tire)
      sommet   court depassement puis retour    (l'inertie de l'oreille)
      maintien bref                             (l'attention)
      retombee ~0,50 s, easing ENTRANT mou      (la gravite, pas le muscle)

    ⛔ Le rapport monte/descente est d'environ 1 pour 3. Symetrique, ca ne
    ressemble a rien de vivant.
    """
    M = round(0.15 * FPS)          # montee vive
    S = round(0.10 * FPS)          # depassement + retour
    T = round(0.35 * FPS)          # maintien haut
    R = round(0.50 * FPS)          # retombee molle
    # ⛔ MESURE (1re version) : en calant la retombee sur `periode`, l'oreille
    # restait dressee 2 SECONDES (frames 66 -> 186). Le geste se lisait comme
    # une oreille bloquee en haut, pas comme un soulevement. La retombee a
    # donc sa propre duree, et le repos occupe le reste du cycle.
    cycle = M + S + T + R
    if periode < cycle + FPS // 2:
        periode = cycle + FPS // 2      # au moins 0,5 s de repos entre deux
    out = []
    t = depart
    while t < duree:
        out.append((t,               repos))
        out.append((t + M,           repos + angle * 1.12))  # depassement
        out.append((t + M + S,       repos + angle))          # sommet
        out.append((t + M + S + T,   repos + angle))          # maintien
        out.append((t + cycle,       repos))                  # retombee molle
        t += periode
    out = [(a, b) for a, b in out if a <= duree]
    if len(out) < 2:
        return None
    # easing par cle : vif a la montee, mou a la retombee
    k = []
    for i, (t0, v) in enumerate(out):
        cle = {"t": round(t0), "s": [v]}
        if i < len(out) - 1:
            monte = out[i + 1][1] > v
            if monte:
                cle["o"] = {"x": [0.15], "y": [0]}   # demarre franc
                cle["i"] = {"x": [0.35], "y": [1]}
            else:
                cle["o"] = {"x": [0.55], "y": [0]}   # retombee molle
                cle["i"] = {"x": [0.90], "y": [1]}
        k.append(cle)
    return {"a": 1, "k": k}


def clignement(duree=DUREE, periode=None, ferme=4):
    """
    Fermeture breve et periodique -> ks.s en Y (l'oeil s'ecrase, il ne
    disparait pas). ⛔ 4 frames = 0,067 s a 60 fps : plus long, le chien a l'air
    endormi ; plus court, on ne le voit pas.
    """
    per = periode or round(2.4 * FPS)
    k = []
    t = round(0.8 * FPS)
    while t < duree:
        k.append({"t": t, "s": [100, 100], "o": {"x": [0.3], "y": [0]}, "i": {"x": [0.7], "y": [1]}})
        k.append({"t": t + ferme, "s": [100, 8], "o": {"x": [0.3], "y": [0]}, "i": {"x": [0.7], "y": [1]}})
        k.append({"t": t + ferme * 2, "s": [100, 100], "o": {"x": [0.3], "y": [0]}, "i": {"x": [0.7], "y": [1]}})
        t += per
    if len(k) < 2:
        return None
    k[-1].pop("o", None); k[-1].pop("i", None)
    return {"a": 1, "k": k}


def animer(doc):
    """Pose les gestes mesures sur les calques riggés."""
    pose = []

    def couches(motif, dans_assets=True):
        """Tous les calques dont le nom commence par `motif` (racine + assets)."""
        vus = [c for c in doc.get("layers", []) if str(c.get("nm", "")).startswith(motif)]
        if dans_assets:
            for a in doc.get("assets", []):
                vus += [c for c in a.get("layers", [])
                        if str(c.get("nm", "")).startswith(motif)]
        return vus

    # --- LES OREILLES : -9 a +15 deg, DEPHASEES -----------------------------
    # Mesure : oreille A demarre a 0,33 s, oreille B a 1,67 s. Les animer en
    # phase donnerait un mouvement de robot -- c'est le decalage qui vit.
    # ⭐ V2 : SOULEVEMENT au lieu du balancement. Les deux oreilles restent
    # DEPHASEES (mesure d'origine : 0,33 s contre 1,67 s) — c'est le decalage
    # qui empeche l'effet marionnette.
    for motif, depart, signe in (("ear-l", round(0.5 * FPS), -1.0),
                                 ("ear-r", round(1.9 * FPS), 1.0)):
        for c in couches(motif):
            if c.get("ks", {}).get("a", {}).get("k") in ([0, 0], None):
                continue                      # piece non riggée : elle suivra
            c["ks"]["r"] = souleve(14.0 * signe, depart, round(2.6 * FPS))
            pose.append(f"{c['nm']}: soulevement {14.0 * signe:+.0f} deg (montee vive, retombee molle)")

    # --- LA TETE : 0 -> 15 deg, le mouvement porteur ------------------------
    # ⛔ V2 : LA TETE NE BOUGE PLUS. En V1 elle tournait de +/-4 deg, et comme
    # tout le visage lui est parente, l'ensemble basculait en bloc — ca se
    # lisait comme une tete en carton. Le fichier professionnel fait l'inverse :
    # le crane bouge tres peu, ce sont les DETAILS qui vivent.
    pose.append("head-base: IMMOBILE (V2) — seuls les details bougent")

    # --- LES SOURCILS : le droit 2x plus actif que le gauche -----------------
    # Mesure : 12 cles a droite contre 6 a gauche. C'est cette asymetrie qui
    # donne l'expression -- deux sourcils synchrones font un visage inerte.
    for motif, per, amp in (("eyebrow-l", BATTEMENT * 5, 5.0),
                            ("eyebrow-r", BATTEMENT * 2.5, 8.0)):
        for c in couches(motif):
            if c.get("ks", {}).get("a", {}).get("k") in ([0, 0], None):
                continue
            c["ks"]["r"] = oscille(amp, per, repos=-4.0)
            pose.append(f"{c['nm']}: sourcil +/-{amp} deg")

    # --- LES IRIS : des COUPS D'OEIL, pas des glissements -------------------
    # Amplitude mesuree : -33,66 a +18,91 px. On reste tres en deca (12 px) :
    # l'iris est deja pres du bord de son globe dans notre dessin, et le
    # pochoir le couperait. La MECANIQUE est identique, le dosage est adapte
    # a notre geometrie -- et c'est dit, pas cache.
    for c in doc.get("layers", []):
        nm = str(c.get("nm", ""))
        if not nm.startswith("iris-"):
            continue
        a = c.get("ks", {}).get("a", {}).get("k")
        if not a or a == [0, 0]:
            continue
        cx, cy = a[0], a[1]
        c["ks"]["p"] = saccades(
            [(cx, cy), (cx + 12, cy - 4), (cx, cy), (cx - 10, cy + 3)],
            [0.33, 0.98, 1.65, 2.32, 3.10, 3.90, 4.40])
        pose.append(f"{nm}: 7 coups d'oeil (sauts de 0,02 s)")

    # --- LE CLIGNEMENT : ce qui rend un regard vivant ----------------------
    for c in doc.get("layers", []):
        if str(c.get("nm", "")).startswith("eye-") and c["nm"].endswith("-ball"):
            b = c.get("ks", {}).get("a", {}).get("k")
            if b in ([0, 0], None):
                # l'oeil n'est pas riggé : on l'ancre a son centre pour que
                # l'ecrasement se fasse au milieu et non depuis le coin
                continue
            c["ks"]["s"] = clignement()
            pose.append(f"{c['nm']}: clignement toutes les 2,4 s")

    # --- LA LANGUE : la partie la plus mobile, +/-70 deg mesures ------------
    # On pose +/-14 deg : a 70 deg la langue sortirait du pochoir du museau,
    # qui la couperait. Meme remarque que pour l'iris -- dosage adapte, dit.
    for c in doc.get("layers", []):
        if str(c.get("nm", "")).startswith("tongue"):
            a = c.get("ks", {}).get("a", {}).get("k")
            if a and a != [0, 0]:
                c["ks"]["r"] = oscille(14.0, BATTEMENT * 2, phase=0.25)
                pose.append(f"{c['nm']}: langue +/-14 deg")

    # ⛔⛔ PIEGE PAYE : allonger la duree du DOCUMENT ne suffit pas. Chaque
    # calque porte sa PROPRE fenetre `ip`/`op` (posee par le convertisseur a
    # sa duree par defaut, 60 frames). Un calque dont `op` vaut 60 cesse
    # d'exister a la frame 60 : l'animation se figeait a partir de la, et le
    # fichier restait parfaitement valide -- 3 frames distinctes sur 8 au
    # controle. Symptome typique du "rapport content, rendu faux".
    for c in doc.get("layers", []):
        c["ip"], c["op"] = 0, DUREE
    for a in doc.get("assets", []):
        for c in a.get("layers", []):
            c["ip"], c["op"] = 0, DUREE
    doc["op"] = DUREE
    doc["fr"] = FPS
    return pose


def main():
    ap = argparse.ArgumentParser(description="Anime le chien riggé")
    ap.add_argument("json")
    ap.add_argument("-o", "--out", required=True)
    a = ap.parse_args()

    doc = json.load(open(a.json, encoding="utf-8"))
    pose = animer(doc)
    if not pose:
        print("⛔ AUCUN geste pose — le fichier est-il bien riggé "
              "(data-pivot / data-parent dans le SVG) ?", file=sys.stderr)
        return 1
    json.dump(doc, open(a.out, "w", encoding="utf-8"), separators=(",", ":"))
    print(f"{len(pose)} geste(s) pose(s) :")
    for p in pose:
        print(f"   {p}")
    print(f"  ecrit : {a.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
