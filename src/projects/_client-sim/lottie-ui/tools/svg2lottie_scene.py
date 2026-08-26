#!/usr/bin/env python3
"""
SVG complet -> Lottie, un calque nomme par groupe/forme.

But (etape 2 du chantier) : SAVOIR OU CA CASSE sur nos vrais assets, pas
prouver que ca marche. Le programme classe donc chaque element en trois :

    PORTE      converti fidelement
    APPROXIME  converti, mais pas a l'identique (ex. degrade radial -> lineaire)
    REFUSE     non transportable -- et on dit POURQUOI

⛔ Il ne "fait pas de son mieux" en silence. Un element non transportable est
signale ; c'est la liste des refus qui est le livrable, parce que c'est elle
qui permet de repondre oui ou non a un brief en 30 secondes.

Usage :
    python3 svg2lottie_scene.py <fichier.svg> [-o sortie.json] [--fps 30] [--frames 60]
    python3 svg2lottie_scene.py <fichier.svg> --rapport      # analyse seule
"""

import argparse
import json
import math
import os
import re
import sys
import xml.etree.ElementTree as ET

# Les SVG viendront de CLIENTS : le parseur stdlib est vulnerable aux entites
# externes (XXE) et au "billion laughs". defusedxml neutralise les deux.
# ⭐ Ce durcissement existait deja dans svg2lottie.py (le prototype abandonne) ;
# le STATUS de la session precedente demandait de le REPORTER ici plutot que
# de repartir de zero -- c'est fait.
try:
    from defusedxml.ElementTree import fromstring as _xml_fromstring
    XML_DURCI = True
except ImportError:                     # pragma: no cover
    XML_DURCI = False

    def _xml_fromstring(texte):
        return ET.fromstring(texte)

from svgpath import parse_path, shape_to_path, PathError

NS = "{http://www.w3.org/2000/svg}"
XLINK = "{http://www.w3.org/1999/xlink}"

# Elements geometriques qu'on sait porter
GEOM = ("path", "circle", "ellipse", "rect", "line", "polygon", "polyline")

# Elements dont l'absence CHANGE le rendu : on refuse bruyamment.
# (valeur = raison affichee dans le rapport)
NON_PORTES = {
    "filter": "filtres (flou, ombre portee) — Lottie n'a pas d'equivalent generique",
    "mask": "masques de luminance — Lottie a des masques, mais d'un autre modele",
    "clipPath": "detourage — portable seulement en le pre-appliquant a la geometrie",
    "image": "images raster — a embarquer en base64, alourdit beaucoup",
    "text": "texte — Lottie exige une police declaree, pas de rendu direct",
    "use": "reutilisation par reference — a aplatir avant conversion",
    "pattern": "motifs de remplissage — sans equivalent",
    "marker": "marqueurs de fleche — sans equivalent",
    "symbol": "symboles — a aplatir avant conversion",
    "foreignObject": "contenu HTML embarque — hors format",
    "animate": "animation SMIL — l'animation doit venir de NOTRE code",
    "animateTransform": "animation SMIL — l'animation doit venir de NOTRE code",
    "animateMotion": "animation SMIL — l'animation doit venir de NOTRE code",
}


class Rapport:
    """Compte ce qui passe, ce qui s'approxime, ce qui casse."""

    def __init__(self):
        self.porte = []
        self.approx = []
        self.refus = []

    def ok(self, quoi):
        self.porte.append(quoi)

    def approxime(self, quoi, pourquoi):
        self.approx.append((quoi, pourquoi))

    def refuse(self, quoi, pourquoi):
        self.refus.append((quoi, pourquoi))

    def afficher(self, titre=""):
        """
        ⛔ ORDRE ET REGROUPEMENT (corrige sur une vraie scene) : le 1er jet
        listait les approximations AVANT les refus, une ligne par element.
        Sur chill-meter-mix, 102 lignes de degrades identiques enterraient
        les 30 refus (13 textes, 12 <use>, 5 filtres) 100 lignes plus bas --
        un rapport cense trancher en 30 secondes.
        Desormais : LES REFUS D'ABORD, et on groupe par CAUSE, pas par
        element. Le detail element par element reste accessible via --detail.
        """
        if titre:
            print(f"\n{titre}")
        if self.refus:
            print(f"  ⛔ REFUSE    : {len(self.refus)} element(s) — le rendu CHANGE")
            for quoi, pourquoi in _par_cause(self.refus):
                print(f"      - {quoi} : {pourquoi}")
        if self.approx:
            print(f"  ⚠️  APPROXIME : {len(self.approx)} element(s)")
            for quoi, pourquoi in _par_cause(self.approx):
                print(f"      - {quoi} : {pourquoi}")
        print(f"  ✓  porte     : {len(self.porte)} element(s)")
        if not self.approx and not self.refus:
            print("  -> transportable a l'identique")

    def detail(self):
        """Liste element par element (option --detail)."""
        for etiquette, items in (("REFUSE", self.refus), ("APPROXIME", self.approx)):
            for quoi, pourquoi in items:
                print(f"  {etiquette:9} {quoi} : {pourquoi}")


def _par_cause(pairs):
    """
    Groupe par RAISON et non par element : "12 <use>" est actionnable,
    douze lignes "<use>" identiques ne le sont pas. Les noms d'elements
    sont resumes (3 max) pour garder la trace de OU regarder.
    """
    par_raison = {}
    for quoi, pourquoi in pairs:
        # "path-248: fill=gradient" -> famille "fill=gradient"
        famille = quoi.split(": ", 1)[1] if ": " in quoi else quoi.split(" (x")[0]
        cible = quoi.split(": ", 1)[0] if ": " in quoi else None
        e = par_raison.setdefault((famille, pourquoi), [])
        if cible:
            e.append(cible)
    out = []
    for (famille, pourquoi), cibles in par_raison.items():
        n = len(cibles) if cibles else sum(
            1 for q, p in pairs if p == pourquoi and famille in q)
        etiquette = f"{famille} (x{n})" if n > 1 else famille
        if cibles:
            apercu = ", ".join(cibles[:3]) + ("…" if len(cibles) > 3 else "")
            etiquette += f"  [{apercu}]"
        out.append((etiquette, pourquoi))
    return out


def _uniq(pairs):
    """Deduplique en gardant l'ordre, avec un compteur si repetition."""
    vus = {}
    for quoi, pourquoi in pairs:
        vus.setdefault((quoi, pourquoi), 0)
        vus[(quoi, pourquoi)] += 1
    out = []
    for (quoi, pourquoi), n in vus.items():
        out.append((f"{quoi} (x{n})" if n > 1 else quoi, pourquoi))
    return out


# --- Couleurs ----------------------------------------------------------------

_NOMS = {
    "black": "#000000", "white": "#ffffff", "red": "#ff0000", "green": "#008000",
    "blue": "#0000ff", "yellow": "#ffff00", "gray": "#808080", "grey": "#808080",
    "orange": "#ffa500", "purple": "#800080", "brown": "#a52a2a", "pink": "#ffc0cb",
    "gold": "#ffd700", "silver": "#c0c0c0", "navy": "#000080", "teal": "#008080",
    "lime": "#00ff00", "cyan": "#00ffff", "magenta": "#ff00ff", "maroon": "#800000",
    "olive": "#808000", "darkgreen": "#006400", "darkblue": "#00008b",
    "lightgray": "#d3d3d3", "lightgrey": "#d3d3d3", "none": None, "transparent": None,
}


def couleur(v, defaut=(0.0, 0.0, 0.0)):
    """'#rgb' / '#rrggbb' / 'rgb(...)' / nom -> [r,g,b] en 0..1. None si absente."""
    if v is None:
        return defaut
    v = str(v).strip().lower()
    if v in _NOMS:
        v = _NOMS[v]
        if v is None:
            return None
    if not v:
        return defaut
    if v.startswith("url("):
        return None                     # gradient : traite ailleurs
    m = re.match(r"rgba?\(([^)]+)\)", v)
    if m:
        parts = [p.strip() for p in m.group(1).replace("/", ",").split(",")]
        vals = []
        for p in parts[:3]:
            vals.append(float(p[:-1]) / 100.0 if p.endswith("%") else float(p) / 255.0)
        return [round(x, 4) for x in vals] if len(vals) == 3 else defaut
    if v.startswith("#"):
        h = v[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        if len(h) >= 6:
            try:
                return [round(int(h[i:i + 2], 16) / 255.0, 4) for i in (0, 2, 4)]
            except ValueError:
                return defaut
    return defaut


# --- Transformations ---------------------------------------------------------

def parse_transform(s):
    """
    'translate(..) scale(..) rotate(..)' -> matrice (a,b,c,d,e,f).

    Lottie n'a pas de transform arbitraire au niveau d'une forme : on APLATIT
    la matrice dans les coordonnees des points. C'est aussi ce que faisait
    animate_start.py, mais pour translate() seulement.
    """
    m = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
    if not s:
        return m
    for nom, args in re.findall(r"(\w+)\s*\(([^)]*)\)", s):
        v = [float(x) for x in re.findall(r"-?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?", args)]
        if nom == "translate":
            t = (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0)
        elif nom == "scale":
            sx = v[0]
            sy = v[1] if len(v) > 1 else sx
            t = (sx, 0, 0, sy, 0, 0)
        elif nom == "rotate":
            a = math.radians(v[0])
            ca, sa = math.cos(a), math.sin(a)
            t = (ca, sa, -sa, ca, 0, 0)
            if len(v) >= 3:                      # rotation autour d'un point
                cx, cy = v[1], v[2]
                m = _mul(m, (1, 0, 0, 1, cx, cy))
                m = _mul(m, t)
                t = (1, 0, 0, 1, -cx, -cy)
        elif nom == "matrix" and len(v) >= 6:
            t = tuple(v[:6])
        elif nom == "skewX":
            t = (1, 0, math.tan(math.radians(v[0])), 1, 0, 0)
        elif nom == "skewY":
            t = (1, math.tan(math.radians(v[0])), 0, 1, 0, 0)
        else:
            continue
        m = _mul(m, t)
    return m


def _mul(m, n):
    a1, b1, c1, d1, e1, f1 = m
    a2, b2, c2, d2, e2, f2 = n
    return (a1*a2 + c1*b2, b1*a2 + d1*b2,
            a1*c2 + c1*d2, b1*c2 + d1*d2,
            a1*e2 + c1*f2 + e1, b1*e2 + d1*f2 + f1)


def appliquer(m, pt):
    a, b, c, d, e, f = m
    x, y = pt
    return [a*x + c*y + e, b*x + d*y + f]


def est_identite(m):
    return (abs(m[0]-1) < 1e-12 and abs(m[1]) < 1e-12 and abs(m[2]) < 1e-12
            and abs(m[3]-1) < 1e-12 and abs(m[4]) < 1e-12 and abs(m[5]) < 1e-12)


# --- Styles ------------------------------------------------------------------

def styles(el, herite):
    """Fusionne attributs de presentation et style="" avec l'heritage."""
    st = dict(herite)
    for k in ("fill", "stroke", "stroke-width", "opacity", "fill-opacity",
              "stroke-opacity", "stroke-linecap", "stroke-linejoin", "display"):
        if k in el.attrib:
            st[k] = el.attrib[k]
    raw = el.attrib.get("style", "")
    for decl in raw.split(";"):
        if ":" in decl:
            k, v = decl.split(":", 1)
            st[k.strip()] = v.strip()
    return st


_CAP = {"butt": 1, "round": 2, "square": 3}
_JOIN = {"miter": 1, "round": 2, "bevel": 3}


def shapes_de_style(st, rapport, nom):
    """
    Remplissage et contour Lottie deduits du style CSS/SVG.

    ⛔ ORDRE CRITIQUE (bug trouve a l'OEIL, pas par le rapport) : dans un
    groupe Lottie, les styles s'empilent et le DERNIER est peint AU-DESSUS.
    Un fill place apres le stroke recouvre donc le trait, et le contour
    disparait -- silencieusement, avec un JSON parfaitement valide.
    Le convertisseur annoncait "transportable a l'identique" pendant que les
    liseres noirs de la cabosse s'evaporaient. On retourne donc [stroke, fill]
    ... puis on INVERSE a l'insertion (cf. l'appelant) pour que le trait passe
    par-dessus le remplissage, comme le fait un navigateur.
    """
    out = []
    fill = st.get("fill", "#000000")
    fo = float(st.get("fill-opacity", 1)) * float(st.get("opacity", 1))
    if str(fill).startswith("url("):
        grad = st.get("_gradient_objet")
        boite = st.get("_gradient_boite")
        if grad and boite:
            # ⭐ VRAI DEGRADE Lottie ('gf'), plus une couleur moyenne.
            depart, arrivee = geometrie_gradient(grad, boite)
            out.append({
                "ty": "gf", "nm": "gradient",
                "o": {"a": 0, "k": round(fo * 100, 2)},
                "r": 1,
                "t": grad["type"],                 # 1 = lineaire, 2 = radial
                "s": {"a": 0, "k": [round(depart[0], 3), round(depart[1], 3)]},
                "e": {"a": 0, "k": [round(arrivee[0], 3), round(arrivee[1], 3)]},
                "g": {"p": len(grad["arrets"]),
                      "k": {"a": 0, "k": table_couleurs(grad["arrets"])}},
            })
            if grad["type"] == 2:
                out[-1]["h"] = {"a": 0, "k": 0}    # highlight neutre
            rapport.ok(f"{nom}: gradient {'radial' if grad['type']==2 else 'lineaire'}")
            fill = None
        else:
            rapport.approxime(f"{nom}: fill=gradient",
                              "degrade introuvable — replie sur une couleur pleine")
            fill = st.get("_gradient_moyen", "#808080")
            fo *= float(st.get("_gradient_opacite", 1.0))
    if fill is None:
        c = None
    else:
        c = couleur(fill)
    if c is not None:
        out.append({"ty": "fl", "nm": "fill", "r": 1,
                    "o": {"a": 0, "k": round(fo * 100, 2)}, "c": {"a": 0, "k": c}})

    stroke = st.get("stroke")
    if stroke and str(stroke) not in ("none", "transparent"):
        sc = couleur(stroke)
        if sc is not None:
            so = float(st.get("stroke-opacity", 1)) * float(st.get("opacity", 1))
            w = float(st.get("stroke-width", 1) or 1)
            out.append({"ty": "st", "nm": "stroke",
                        "o": {"a": 0, "k": round(so * 100, 2)},
                        "w": {"a": 0, "k": w}, "c": {"a": 0, "k": sc},
                        "lc": _CAP.get(st.get("stroke-linecap", "butt"), 1),
                        "lj": _JOIN.get(st.get("stroke-linejoin", "miter"), 1)})
    return out


# --- Parcours du SVG ---------------------------------------------------------

def gradients_complets(root):
    """
    Lit CHAQUE gradient en entier : type, geometrie et tous ses arrets.

    ⭐ Remplace l'ancienne "moyenne des arrets". Le format Lottie sait porter
    les degrades ('gf') — verifie sur la spec officielle ET teste en direct
    dans LottieFiles Creator via son MCP le 2026-08-26 (radial 3 arrets +
    lineaire 0,30 -> 0,02 : rendu correct, halo qui s'estompe).

    Structure Lottie du tableau de couleurs (spec `values.md`) : un tableau
    PLAT. D'abord tous les arrets de COULEUR (offset, r, g, b), puis, si au
    moins un arret est transparent, tous les arrets d'ALPHA (offset, alpha)
    a la suite. Toutes les valeurs entre 0 et 1.

    ⚠️ Les coordonnees `s`/`e` sont en PIXELS dans l'espace de la forme (pas
    des ratios 0-1). Pour un gradient SVG en `objectBoundingBox` (le defaut),
    il faut donc les convertir avec la boite de la forme -- fait a l'usage,
    car la boite n'est connue qu'apres conversion du chemin.
    """
    out = {}
    for tag, genre in (("linearGradient", 1), ("radialGradient", 2)):
        for g in root.iter(NS + tag):
            gid = g.attrib.get("id")
            if not gid:
                continue
            arrets = []
            for stop in g.iter(NS + "stop"):
                brut = stop.attrib.get("stop-color") or ""
                op = stop.attrib.get("stop-opacity")
                style = stop.attrib.get("style", "")
                if style:
                    m = re.search(r"stop-color\s*:\s*([^;]+)", style)
                    brut = brut or (m.group(1) if m else "")
                    m = re.search(r"stop-opacity\s*:\s*([\d.]+)", style)
                    op = op if op is not None else (m.group(1) if m else None)
                c = couleur(brut, None)
                if c is None:
                    continue
                pos = stop.attrib.get("offset", "0")
                try:
                    pos = float(pos[:-1]) / 100.0 if str(pos).endswith("%") else float(pos)
                except ValueError:
                    pos = 0.0
                try:
                    alpha = float(op) if op is not None else 1.0
                except ValueError:
                    alpha = 1.0
                arrets.append((max(0.0, min(1.0, pos)), c, max(0.0, min(1.0, alpha))))
            if not arrets:
                continue
            arrets.sort(key=lambda a: a[0])
            out[gid] = {
                "type": genre,
                "arrets": arrets,
                "unites": g.attrib.get("gradientUnits", "objectBoundingBox"),
                # coordonnees brutes ; interpretees a l'usage selon `unites`
                "x1": g.attrib.get("x1"), "y1": g.attrib.get("y1"),
                "x2": g.attrib.get("x2"), "y2": g.attrib.get("y2"),
                "cx": g.attrib.get("cx"), "cy": g.attrib.get("cy"),
                "r": g.attrib.get("r"),
                # moyennes conservees : repli si la geometrie est inexploitable
                "couleur": [round(sum(a[1][i] for a in arrets) / len(arrets), 4)
                            for i in range(3)],
                "opacite": round(sum(a[2] for a in arrets) / len(arrets), 4),
            }
    return out


def table_couleurs(arrets):
    """
    Arrets SVG -> tableau PLAT Lottie.

    [offset, r, g, b] x N  puis  [offset, alpha] x N si au moins un arret
    est transparent (spec : "gradients with transparency include an
    additional alpha component ... after the RGB values").
    """
    plat = []
    for pos, c, _ in arrets:
        plat += [round(pos, 4), round(c[0], 4), round(c[1], 4), round(c[2], 4)]
    if any(a[2] < 1.0 for a in arrets):
        for pos, _, alpha in arrets:
            plat += [round(pos, 4), round(alpha, 4)]
    return plat


def boite_des_formes(formes):
    """Boite englobante des chemins deja convertis (pour situer le gradient)."""
    xs, ys = [], []
    for f in formes:
        for x, y in f["ks"]["k"]["v"]:
            xs.append(x)
            ys.append(y)
    if not xs:
        return None
    return min(xs), min(ys), max(xs), max(ys)


def geometrie_gradient(g, boite):
    """
    Points de depart/arrivee du gradient, en coordonnees ABSOLUES.

    SVG place le gradient soit dans la boite de la forme (`objectBoundingBox`,
    coordonnees 0-1 -- le defaut), soit dans l'espace utilisateur
    (`userSpaceOnUse`, coordonnees absolues). Lottie, lui, veut des pixels.
    """
    x0, y0, x1b, y1b = boite
    w, h = max(1e-6, x1b - x0), max(1e-6, y1b - y0)
    bbox = g["unites"] != "userSpaceOnUse"

    def val(v, defaut, axe):
        if v is None:
            v = defaut
        v = str(v)
        try:
            if v.endswith("%"):
                r = float(v[:-1]) / 100.0
                return (x0 + r * w) if axe == "x" else (y0 + r * h)
            f = float(v)
        except ValueError:
            return x0 + 0.5 * w if axe == "x" else y0 + 0.5 * h
        if bbox:
            return (x0 + f * w) if axe == "x" else (y0 + f * h)
        return f

    if g["type"] == 1:                       # lineaire
        return ([val(g["x1"], "0%", "x"), val(g["y1"], "0%", "y")],
                [val(g["x2"], "100%", "x"), val(g["y2"], "0%", "y")])
    # radial : `s` = centre, `e` = un point du bord (la distance donne le rayon)
    cx = val(g["cx"], "50%", "x")
    cy = val(g["cy"], "50%", "y")
    rayon = g["r"]
    if rayon is None:
        rayon = "50%"
    rayon = str(rayon)
    try:
        rr = (float(rayon[:-1]) / 100.0) if rayon.endswith("%") else float(rayon)
    except ValueError:
        rr = 0.5
    r_px = rr * ((w + h) / 2.0) if bbox else rr
    return ([cx, cy], [cx + r_px, cy])


def collecter(el, mat, herite, rapport, grads, sortie, profondeur=0, chemin=()):
    """
    Parcourt l'arbre SVG et produit une liste de (nom, formes, styles).

    `chemin` = les id des <g> traverses. ⭐ MESURE (2 scenes reelles) : les
    formes n'ont presque jamais d'id, mais les GROUPES en ont souvent
    (moitie-gauche, feves...). Aplatir sans les reprendre donnait 100 % de
    calques nommes "path-248" -- illisible dans Creator, et c'est justement
    ce qui separe un livrable pro d'un fichier brut.
    """
    tag = el.tag.replace(NS, "")

    if tag in NON_PORTES:
        rapport.refuse(f"<{tag}>", NON_PORTES[tag])
        return
    if tag in ("defs", "linearGradient", "radialGradient", "stop", "title",
               "desc", "metadata", "style"):
        return

    st = styles(el, herite)
    if st.get("display") == "none":
        return

    # ⛔ Trouve par un SVG-piege : filter/clipPath/mask sont surtout utilises
    # comme ATTRIBUTS (filter="url(#flou)") et pas seulement comme balises.
    # Ne detecter que les balises laissait un flou disparaitre EN SILENCE --
    # le rapport annoncait "porte" sur un element dont le rendu changeait.
    for attr, raison in (("filter", NON_PORTES["filter"]),
                         ("clip-path", NON_PORTES["clipPath"]),
                         ("mask", NON_PORTES["mask"])):
        v = el.attrib.get(attr) or st.get(attr)
        if v and str(v).strip() not in ("none", ""):
            rapport.refuse(f"attribut {attr}=", raison)

    m = _mul(mat, parse_transform(el.attrib.get("transform", "")))

    if tag in ("svg", "g", "a"):
        gid = el.attrib.get("id")
        suite = chemin + (gid,) if gid else chemin
        for enfant in el:
            collecter(enfant, m, st, rapport, grads, sortie, profondeur + 1, suite)
        return

    if tag not in GEOM:
        if tag:
            rapport.refuse(f"<{tag}>", "element inconnu, ignore")
        return

    # Geometrie -> 'd'
    if tag == "path":
        d = el.attrib.get("d", "")
    else:
        d = shape_to_path(tag, el.attrib)
        if d is None:
            return                      # forme degeneree : rien a tracer
        rapport.ok(f"<{tag}>")

    # Nom du calque : l'id de la forme si elle en a un, sinon celui du groupe
    # qui la contient (suffixe pour rester unique), sinon un auto-numero.
    propre = el.attrib.get("id")
    if propre:
        nom = propre
    elif chemin:
        base = chemin[-1]
        rang = sum(1 for n, _, _ in sortie if n == base or n.startswith(base + "-")) + 1
        nom = f"{base}-{rang}"
    else:
        nom = f"{tag}-{len(sortie) + 1}"

    # Gradient : on note la moyenne pour shapes_de_style
    for cle in ("fill", "stroke"):
        v = str(st.get(cle, ""))
        if v.startswith("url("):
            gid = v[v.find("#") + 1:].rstrip(")").strip('"\'')
            if gid in grads:
                g = grads[gid]
                st["_gradient_objet"] = g
                # replis si la geometrie s'avere inexploitable
                st["_gradient_moyen"] = "#%02x%02x%02x" % tuple(
                    int(round(x * 255)) for x in g["couleur"])
                st["_gradient_opacite"] = g["opacite"]

    try:
        formes = parse_path(d)
    except PathError as e:
        rapport.refuse(f"{nom} (<{tag}>)", f"chemin illisible : {e}")
        return

    if not est_identite(m):
        for f in formes:
            k = f["ks"]["k"]
            k["v"] = [appliquer(m, p) for p in k["v"]]
            # Les tangentes sont des VECTEURS : pas de translation, seulement
            # la partie lineaire de la matrice.
            lin = (m[0], m[1], m[2], m[3], 0.0, 0.0)
            k["i"] = [appliquer(lin, p) for p in k["i"]]
            k["o"] = [appliquer(lin, p) for p in k["o"]]

    if tag == "path":
        rapport.ok(f"<path> {nom}")

    # ⚠️ La boite des formes n'est connue qu'ICI, apres conversion ET
    # application du transform : un gradient SVG en `objectBoundingBox` (le
    # defaut) s'exprime en fractions de cette boite, alors que Lottie veut
    # des pixels. On la passe donc au styleur, pas avant.
    if "_gradient_objet" in st:
        st = dict(st)
        st["_gradient_boite"] = boite_des_formes(formes)

    sortie.append((nom, formes, shapes_de_style(st, rapport, nom)))


def viewbox(root):
    vb = root.attrib.get("viewBox")
    if vb:
        v = [float(x) for x in re.findall(r"-?[\d.]+", vb)]
        if len(v) == 4:
            return v
    w = re.sub(r"[a-z%]+$", "", root.attrib.get("width", "512") or "512")
    h = re.sub(r"[a-z%]+$", "", root.attrib.get("height", "512") or "512")
    try:
        return [0, 0, float(w), float(h)]
    except ValueError:
        return [0, 0, 512.0, 512.0]


def convertir(chemin, fps=30, frames=60):
    """SVG -> (document Lottie, rapport)."""
    with open(chemin, "r", encoding="utf-8") as f:
        texte = f.read()
    # Double garde : defusedxml si present, ET un refus explicite des entites
    # (le parseur stdlib les developperait silencieusement en repli).
    if re.search(r"<!ENTITY", texte, re.I) or re.search(r"<!DOCTYPE[^>]+SYSTEM", texte, re.I):
        raise PathError("le SVG declare des entites XML — refuse (risque XXE)")

    root = _xml_fromstring(texte)
    x0, y0, w, h = viewbox(root)
    rapport = Rapport()
    grads = gradients_complets(root)
    elements = []
    base = (1, 0, 0, 1, -x0, -y0)          # ramene le viewBox a l'origine
    collecter(root, base, {}, rapport, grads, elements)

    layers = []
    # Lottie dessine le calque d'indice 0 AU-DESSUS : on inverse pour garder
    # l'ordre de peinture du SVG (premier element = dessous).
    def _tr():
        return {"ty": "tr", "a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                "o": {"a": 0, "k": 100}}

    for i, (nom, formes, styles_) in enumerate(reversed(elements)):
        # ⛔ UN GROUPE PAR STYLE, jamais fill+stroke dans le meme groupe.
        # MESURE (profil de pixels, bord de la cabosse a y=180) : avec les
        # deux dans un seul groupe, lottie-web peint le remplissage APRES le
        # trait et en recouvre la moitie interieure -- le contour tombe de
        # 5 px a 2 px de large, soit 7030 -> 3475 pixels sombres. Le JSON
        # restait valide et le rapport annoncait "transportable a l'identique".
        # Deux groupes (remplissage dessous, contour dessus) rendent l'ordre
        # de peinture explicite, comme dans un navigateur.
        # ⛔ PIEGE PAYE (2026-08-26) : ce tri ne connaissait que "fl" et "st".
        # Un remplissage en DEGRADE a le type "gf" -- il n'entrait dans aucune
        # des deux listes et etait SILENCIEUSEMENT JETE : fichier valide,
        # rapport annoncant "gradient porte", et rendu quasi vide (99,5 %
        # d'ecart, 1,1 % de pixels encres). Meme famille que les 3 bugs
        # precedents : l'element est correct, c'est son AIGUILLAGE qui l'annule.
        # "gs" = gradient de CONTOUR, prevu ici par symetrie.
        fills = [x for x in styles_ if x.get("ty") in ("fl", "gf")]
        strokes = [x for x in styles_ if x.get("ty") in ("st", "gs")]
        groupes = []
        # ⛔ ORDRE : dans un calque, le PREMIER groupe de la liste est peint
        # EN DERNIER (au-dessus). Le contour doit donc venir en tete, sinon le
        # remplissage recouvre sa moitie interieure. Mesure a l'appui : profil
        # de pixels au bord de la cabosse, trait de 5 px reduit a 2 px, et
        # 3475 pixels sombres au lieu de 7030. Dans le bon ordre : 7066 vs
        # 7030 et 0,00 % d'ecart avec le SVG.
        for style, suffixe in ((strokes, "stroke"), (fills, "fill")):
            if style:
                groupes.append({"ty": "gr", "nm": f"{nom}-{suffixe}",
                                "it": [dict(f) for f in formes] + style + [_tr()]})
        if not groupes:                       # ni fill ni stroke : geometrie seule
            groupes.append({"ty": "gr", "nm": nom, "it": list(formes) + [_tr()]})

        layers.append({
            "ddd": 0, "ty": 4, "ind": i, "nm": nom, "st": 0, "ip": 0, "op": frames,
            "ks": {"a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                   "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                   "o": {"a": 0, "k": 100}},
            "shapes": groupes,
        })

    doc = {"nm": os.path.splitext(os.path.basename(chemin))[0], "v": "5.5.2",
           "fr": fps, "ip": 0, "op": frames, "w": round(w), "h": round(h),
           "assets": [], "layers": layers}
    return doc, rapport


def main():
    ap = argparse.ArgumentParser(description="SVG complet -> Lottie")
    ap.add_argument("svg")
    ap.add_argument("-o", "--out")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--frames", type=int, default=60)
    ap.add_argument("--rapport", action="store_true",
                    help="analyse seule, n'ecrit pas de fichier")
    ap.add_argument("--detail", action="store_true",
                    help="liste element par element au lieu du groupement par cause")
    a = ap.parse_args()

    try:
        doc, rapport = convertir(a.svg, a.fps, a.frames)
    except (PathError, ET.ParseError) as e:
        print(f"ECHEC : {e}", file=sys.stderr)
        return 2

    # un meme chemin est duplique dans le groupe fill ET le groupe stroke :
    # on ne compte que le premier groupe de chaque calque
    nb_pts = sum(len(sh["ks"]["k"]["v"])
                 for l in doc["layers"] for sh in l["shapes"][0]["it"]
                 if sh.get("ty") == "sh")
    print(f"{os.path.basename(a.svg)} -> {len(doc['layers'])} calques, "
          f"{nb_pts} sommets, {doc['w']}x{doc['h']}")
    rapport.afficher()
    if a.detail:
        rapport.detail()

    if not a.rapport:
        out = a.out or os.path.splitext(a.svg)[0] + ".json"
        with open(out, "w", encoding="utf-8") as f:
            json.dump(doc, f, separators=(",", ":"))
        print(f"  ecrit : {out}  ({os.path.getsize(out)} octets)")
    return 1 if rapport.refus else 0


if __name__ == "__main__":
    sys.exit(main())
