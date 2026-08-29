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
import svgtext

# Voie de conversion du texte, fixee par --texte (voir main).
#   "vectorise" : les glyphes deviennent des courbes -- fidele, non editable.
#   "natif"     : un calque Lottie ty:5 -- editable, dependant de la police.
MODE_TEXTE = "vectorise"

# Pointilles (stroke-dasharray) : ACTIFS depuis que la cause du blocage est
# prouvee (voir le bloc `nm` dans shapes_de_style). Garde-fou conserve : le
# passer a False rend les traits pleins ET le signale dans le rapport.
POINTILLES_ACTIFS = True

NS = "{http://www.w3.org/2000/svg}"
XLINK = "{http://www.w3.org/1999/xlink}"

# Elements geometriques qu'on sait porter
GEOM = ("path", "circle", "ellipse", "rect", "line", "polygon", "polyline")

# Elements dont l'absence CHANGE le rendu : on refuse bruyamment.
# (valeur = raison affichee dans le rapport)
#
# ⛔ CETTE TABLE SE PERIME (revue 2026-08-29). Deux entrees annonçaient un refus
# que le code ne pratiquait plus : `filter` ("pas d'equivalent generique") alors
# que le flou seul est porte depuis le 2026-08-28, et `text` ("refuse") alors
# qu'il est vectorise plus haut et n'atteint JAMAIS cette table. Un refus
# perime n'est pas inoffensif : le rapport est notre argument commercial, et il
# sous-vendait l'outil aupres du client. Quand le code apprend a porter quelque
# chose, CORRIGER LA LIGNE ICI dans le meme commit.
NON_PORTES = {
    # Le flou seul EST porte (effet ty 29) — cf. flou_du_filtre(). Ne reste
    # refuse que le composite, et ce texte n'est affiche que dans ce cas-la.
    "filter": "filtre COMPOSITE (ombre portee, colorMatrix...) — "
              "seul un feGaussianBlur seul est portable",
    # Lottie a bien un equivalent : le track matte (`tt` sur le calque decoupe,
    # `td:1` sur le calque du dessus qui sert de pochoir). Mesure du 2026-08-29
    # sur 22 pieces pro : 93 paires, 0 malformee, 92 en mode alpha (tt:1).
    # Non porte AUJOURD'HUI faute d'implementation, pas faute de format.
    "mask": "masque — Lottie a l'equivalent (track matte tt/td), "
            "pas encore implemente chez nous",
    "clipPath": "detourage — meme mecanisme que <mask> cote Lottie (tt/td), "
                "sinon portable en le pre-appliquant a la geometrie",
    "image": "images raster — a embarquer en base64, alourdit beaucoup",
    "pattern": "motifs de remplissage — sans equivalent",
    "marker": "marqueurs de fleche — sans equivalent",
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
        # ⛔ GARDE-FOU STRUCTUREL (2026-08-29). Un `clip-path` sur un <g>
        # disparaissait EN SILENCE et le rapport disait "transportable a
        # l'identique" : ni le rapport ni l'ecart mesure ne le voyaient (une
        # forme clipee et sa version non clipee se recouvrent largement).
        # On compte donc les clips VUS et les pochoirs EMIS : tout ecart
        # interdit le verdict vert. C'est la 3e occurrence de cette famille
        # (couleurs, <use>, clips) -- un compteur bat une relecture.
        self.clips_vus = 0
        self.pochoirs_emis = 0

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
        perdus = self.clips_vus - self.pochoirs_emis
        if perdus > 0:
            print(f"  ⛔⛔ INCOHERENCE : {self.clips_vus} clip(s)/masque(s) vus, "
                  f"{self.pochoirs_emis} pochoir(s) emis — {perdus} PERDU(S) "
                  f"SANS ETRE DECLARE(S). Le rendu change sans que le rapport "
                  f"le dise : c'est un BUG du convertisseur, pas du SVG.")
        if not self.approx and not self.refus and perdus <= 0:
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

def feuille_css(root):
    """
    Regles d'une balise <style> -> {nom_de_classe: {propriete: valeur}}.

    ⛔ TROUVE PAR MESURE (2026-08-28, logo Stripe) : Adobe Illustrator n'ecrit
    PAS les couleurs sur les formes. Il les met dans une feuille de style et
    pose class="st0" sur chaque forme. Sans lire ces regles, le convertisseur
    ne trouve aucun fill, applique le noir par defaut, et le rapport annonce
    quand meme "transportable a l'identique" — un logo violet livre en noir,
    SANS AUCUN signal.

    Ampleur mesuree sur 6 fichiers reels : 2 concernes, dont les armoiries avec
    236 elements a classe. C'est la cause des grandes zones noires observees,
    attribuees a tort aux <use> refuses.

    ⭐ Illustrator est l'outil standard des designers de logos : ce cas n'est
    pas un cas limite, il est probablement majoritaire chez un vrai client.

    Volontairement simple : selecteurs de CLASSE uniquement (.st0, .a), qui est
    ce que produisent Illustrator et les optimiseurs. Les selecteurs complexes
    (descendants, pseudo-classes, media queries) ne sont pas geres — ils
    n'apparaissent pas dans un export de logo.
    """
    regles = {}
    for el in root.iter(NS + "style"):
        texte = "".join(el.itertext())
        texte = re.sub(r"/\*.*?\*/", "", texte, flags=re.S)   # commentaires CSS
        for bloc_css in re.findall(r"([^{}]+)\{([^{}]*)\}", texte):
            selecteurs, corps = bloc_css
            decls = {}
            for decl in corps.split(";"):
                if ":" in decl:
                    k, v = decl.split(":", 1)
                    decls[k.strip()] = v.strip()
            if not decls:
                continue
            for sel in selecteurs.split(","):
                sel = sel.strip()
                if sel.startswith(".") and re.fullmatch(r"\.[\w-]+", sel):
                    regles.setdefault(sel[1:], {}).update(decls)
    return regles


def styles(el, herite, css=None):
    """
    Fusionne feuille CSS, attributs de presentation et style="" avec l'heritage.

    ⛔ ORDRE DE PRIORITE (celui d'un navigateur, du plus faible au plus fort) :
    herite < regle de classe CSS < attribut de presentation < style="" en ligne.
    Se tromper d'ordre fait gagner la mauvaise couleur en silence.
    """
    st = dict(herite)
    for cls in (el.attrib.get("class") or "").split():
        if css and cls in css:
            st.update(css[cls])
    # ⚠️ Les proprietes de POLICE s'heritent en SVG comme en CSS, et elles
    # sont presque toujours posees sur un <g> parent plutot que sur le <text>
    # lui-meme. Les oublier ici donnait un texte rendu dans la police par
    # defaut sans le moindre avertissement.
    for k in ("fill", "stroke", "stroke-width", "opacity", "fill-opacity",
              "stroke-opacity", "stroke-linecap", "stroke-linejoin", "display",
              # ⛔ Ajoutes le 2026-08-26 apres les avoir vus MANQUER a l'oeil
              # sur une vraie scene : un attribut absent de cette liste est
              # ignore EN SILENCE, quoi qu'en dise le rapport.
              "stroke-dasharray", "stroke-dashoffset",
              "font-family", "font-size", "font-weight", "font-style",
              "letter-spacing", "text-anchor"):
        if k in el.attrib:
            st[k] = el.attrib[k]
    raw = el.attrib.get("style", "")
    for decl in raw.split(";"):
        if ":" in decl:
            k, v = decl.split(":", 1)
            st[k.strip()] = v.strip()

    # ⛔ `opacity` est la SEULE de ces proprietes qui se COMPOSE au lieu de
    # s'ecraser : en SVG, l'opacite d'un groupe se multiplie a celle de ses
    # enfants. Un enfant a opacity="0.5" dans un groupe a opacity="0" reste
    # INVISIBLE. Le code ecrasait la valeur du parent des qu'un enfant portait
    # la sienne -- le fondu d'ouverture de KhartoumEtatMajorSVG (groupe racine
    # a opacity="0" en frame 0) etait donc entierement ignore : la scene
    # apparaissait d'un coup au lieu de se reveler, et le Lottie dessinait
    # 19,9 % d'encre la ou la source en montrait 0,5 % (mesure du 2026-08-26).
    # Meme famille que les autres pieges de la semaine : la valeur est bien
    # lue, c'est sa COMPOSITION qui etait fausse.
    if "opacity" in el.attrib or "opacity" in raw:
        propre = el.attrib.get("opacity")
        for decl in raw.split(";"):
            if ":" in decl and decl.split(":", 1)[0].strip() == "opacity":
                propre = decl.split(":", 1)[1].strip()
        try:
            st["opacity"] = str(float(herite.get("opacity", 1)) * float(propre))
        except (TypeError, ValueError):
            pass
    return st


_CAP = {"butt": 1, "round": 2, "square": 3}
_JOIN = {"miter": 1, "round": 2, "bevel": 3}


def _nb(v, defaut=0.0):
    """Nombre SVG tolerant aux unites ('40px' -> 40.0)."""
    if v is None:
        return defaut
    m = re.match(r"\s*(-?[\d.]+)", str(v))
    return float(m.group(1)) if m else defaut


def _dasharray(v):
    """
    'stroke-dasharray' -> liste de longueurs, ou [] si le trait est plein.

    SVG accepte les separateurs virgule ET espace, le mot-cle 'none', et une
    liste IMPAIRE qui se repete alors deux fois (5 = 5,5). Lottie veut des
    paires tiret/espace : on double donc les listes impaires, sinon le motif
    rendu n'est pas celui du SVG.
    """
    if not v or str(v).strip().lower() in ("none", ""):
        return []
    vals = [abs(_nb(x)) for x in re.split(r"[,\s]+", str(v).strip()) if x]
    vals = [x for x in vals if x is not None]
    if not vals or all(x == 0 for x in vals):
        return []
    if len(vals) % 2:
        vals = vals + vals
    return vals


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
        if grad and grad.get("gtransform"):
            # ⭐ AVANT (jusqu'au 2026-08-28) : on jetait TOUTE gradientTransform
            # et on se repliait sur la couleur moyenne. C'etait trop prudent —
            # une translation / rotation / echelle uniforme se transporte
            # EXACTEMENT en deplacant les 2 points du segment Lottie.
            # ⛔ Seuls le cisaillement et l'echelle non uniforme restent hors
            # format (ils rendraient un radial elliptique) : on se replie alors,
            # et on DIT laquelle des deux causes c'est.
            portable, raison = gtransform_portable(parse_transform(grad["gtransform"]))
            if portable:
                rapport.ok(f"{nom}: gradientTransform portee")
            else:
                rapport.approxime(f"{nom}: gradientTransform",
                                  f"{raison} — hors format Lottie, "
                                  "repli sur la couleur moyenne")
                grad = None
        if grad and boite:
            # ⭐ VRAI DEGRADE Lottie ('gf'), plus une couleur moyenne.
            depart, arrivee = geometrie_gradient(
                grad, boite, st.get("_gradient_mat", (1, 0, 0, 1, 0, 0)))
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
            # ⛔ Distinguer le MOTIF du degrade absent. Mesure du 2026-08-26 sur
            # KhartoumEtatMajorSVG : `background-grid` est un <pattern> (une
            # grille repetee), pas un degrade. Repli sur un gris #808080 arbitraire,
            # il se peignait OPAQUE par-dessus `background-base` (#d9c092) et
            # effacait tout le fond beige de la carte -- 82 % de l'image fausse
            # pour UN element, pendant que le rapport le classait en simple
            # "approximation" parmi six. Un motif non supporte ne doit RIEN
            # peindre : on laisse voir la couche du dessous, ce qui est toujours
            # plus proche de la verite qu'une couleur inventee.
            ref = str(fill)[4:-1].lstrip("#") if str(fill).startswith("url(") else ""
            if st.get("_est_motif"):
                rapport.refuse(f"{nom}: fill=pattern (#{ref})",
                               "motif de remplissage — sans equivalent Lottie ; "
                               "non peint, la couche du dessous reste visible")
                fill = None
            else:
                moyen = st.get("_gradient_moyen")
                if moyen:
                    rapport.approxime(f"{nom}: fill=gradient (#{ref})",
                                      "degrade introuvable — replie sur sa couleur moyenne")
                    fill = moyen
                    fo *= float(st.get("_gradient_opacite", 1.0))
                else:
                    # Aucune couleur mesuree : ne rien inventer.
                    rapport.refuse(f"{nom}: fill=url(#{ref})",
                                   "remplissage introuvable et aucune couleur "
                                   "mesurable — non peint plutot qu'invente")
                    fill = None
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
            trait = {"ty": "st", "nm": "stroke",
                     "o": {"a": 0, "k": round(so * 100, 2)},
                     "w": {"a": 0, "k": w}, "c": {"a": 0, "k": sc},
                     "lc": _CAP.get(st.get("stroke-linecap", "butt"), 1),
                     "lj": _JOIN.get(st.get("stroke-linejoin", "miter"), 1)}
            # ⛔ TROUVE A L'OEIL sur une VRAIE scene (Gazoduc Acte 4, 2026-08-26),
            # pas par le rapport : `stroke-dasharray` etait IGNORE EN SILENCE.
            # Le trace pointille vers l'Algerie ressortait CONTINU, sans le
            # moindre avertissement -- meme famille que les 4 pieges de la
            # semaine. Nos scenes s'en servent (4 occurrences sur cette seule
            # frame) parce que c'est ainsi qu'on dessine un projet "pas encore
            # construit" : le rendre plein CHANGE CE QUE LA CARTE RACONTE.
            # Lottie a le champ prevu : une liste d'objets n="d"/"g" (tiret,
            # espace) plus un decalage "o" optionnel.
            tirets = _dasharray(st.get("stroke-dasharray"))
            if tirets:
                if POINTILLES_ACTIFS:
                    # ⛔⛔ `nm` N'EST PAS DECORATIF ICI : lottie-web s'en sert
                    # comme CLE D'OBJET --
                    #   Object.defineProperty(dashOb, shape.d[i].nm, ...)
                    #   (node_modules/lottie-web/.../lottie.js v5.13, l.15497)
                    # Deux `nm` identiques -> "Cannot redefine property", jetee
                    # DANS initExpressions, en asynchrone : DOMLoaded n'arrive
                    # JAMAIS, sans une seule erreur console ni pageerror. Le
                    # player fige en silence, et un `nm` absent ne sauve pas
                    # (la cle devient "undefined", dupliquee pareil).
                    # Le rendu, lui, ne lit que `n` et `v`.
                    # -> `nm` doit etre PRESENT et UNIQUE. Convention After
                    # Effects (Bodymovin) : "dash 1" / "gap 1" / "dash 2"...
                    # Mesure apres correction : 0,07 % d'ecart (2 valeurs),
                    # 0,10 % (4 valeurs). Les pointilles PASSENT.
                    d = []
                    for i, v in enumerate(tirets):
                        pair = "d" if i % 2 == 0 else "g"
                        d.append({"n": pair,
                                  "nm": f"{'dash' if pair == 'd' else 'gap'} "
                                        f"{i // 2 + 1}",
                                  "v": {"a": 0, "k": v}})
                    decalage = _nb(st.get("stroke-dashoffset"), 0.0)
                    if decalage:
                        d.append({"n": "o", "nm": "offset",
                                  "v": {"a": 0, "k": decalage}})
                    trait["d"] = d
                    rapport.ok(f"{nom}: pointilles")
                else:
                    # ⛔ MESURE 2026-08-26 : la structure "d" que nous ecrivons
                    # FIGE lottie-web -- DOMLoaded n'arrive jamais, sans la
                    # moindre erreur ni message console. Un fichier qui bloque
                    # le player est PIRE qu'un trait plein : on desactive, et
                    # surtout on le DIT au lieu d'ignorer en silence (c'est ce
                    # silence, decouvert a l'oeil sur le Gazoduc Acte 4, qui a
                    # motive tout ce bloc). Diagnostic en cours.
                    rapport.approxime(
                        f"{nom}: stroke-dasharray",
                        "pointilles rendus PLEINS — la structure Lottie 'd' fige "
                        "le player (mesure 2026-08-26) ; un trace 'prevu' "
                        "ressort donc comme un trace 'construit'")
            out.append(trait)
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
    # ⛔ MESURE (logo Inkscape, 2026-08-28) : 23 des 38 degrades du fichier
    # n'ont AUCUN arret propre — ils heritent tout d'un autre degrade via
    # xlink:href / href. Sans resoudre cette chaine, on lit 23 degrades VIDES
    # et on les perd silencieusement (repli sur la couleur pleine). On note
    # donc les liens ici, et on les suit apres la lecture (cf. plus bas).
    liens = {}
    # Les <pattern> sont recenses eux aussi, marques comme motifs : un `url(#x)`
    # qui ne designe AUCUNE definition connue et un `url(#x)` qui designe un
    # motif sont deux situations differentes, et il faut pouvoir les distinguer
    # au moment du repli (cf. shapes_de_style). Sans ce recensement, un motif
    # tombait dans la branche "degrade introuvable" et se repliait sur un gris
    # invente qui effacait le fond -- mesure Khartoum, 2026-08-26.
    for pat in root.iter(NS + "pattern"):
        pid = pat.attrib.get("id")
        if pid:
            out[pid] = {"motif": True}
    # ⭐ Les <filter> vivent dans le meme espace de noms que les gradients : un
    # `url(#x)` peut designer l'un ou l'autre. On les recense ici pour pouvoir
    # PORTER le cas du simple flou au lieu de le refuser en bloc.
    for flt in root.iter(NS + "filter"):
        fid = flt.attrib.get("id")
        if fid:
            r = flou_du_filtre(flt)
            out[fid] = {"filtre": True, "flou": r}
    for tag, genre in (("linearGradient", 1), ("radialGradient", 2)):
        for g in root.iter(NS + tag):
            gid = g.attrib.get("id")
            if not gid:
                continue
            for k, v in g.attrib.items():
                if k.endswith("href") and str(v).startswith("#"):
                    liens[gid] = str(v)[1:]
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
            # ⛔ NE PAS sauter un degrade sans arret : il peut n'etre qu'un
            # MAILLON qui herite ses couleurs d'un autre via href. On
            # l'enregistre avec une liste vide, la resolution la remplira.
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
                # gradientTransform : matrice propre au degrade. Master ne
                # sait pas la porter ; on la retient pour pouvoir REFUSER
                # explicitement plutot que de la perdre en silence.
                "gtransform": g.attrib.get("gradientTransform"),
                # moyennes conservees : repli si la geometrie est inexploitable
                "couleur": _moyenne_couleur(arrets),
                "opacite": _moyenne_opacite(arrets),
            }

    # --- Heritage par xlink:href / href --------------------------------------
    # La chaine peut avoir plusieurs maillons ; garde anti-boucle car un SVG
    # malforme peut se referencer lui-meme.
    for gid in list(out):
        cible = out[gid]
        if cible.get("motif") or cible.get("arrets"):
            continue
        vu = {gid}
        cur = liens.get(gid)
        while cur and cur not in vu:
            vu.add(cur)
            src = out.get(cur)
            if src and not src.get("motif") and src.get("arrets"):
                cible["arrets"] = src["arrets"]
                cible["couleur"] = src["couleur"]
                cible["opacite"] = src["opacite"]
                # la geometrie s'herite aussi quand elle est absente
                if all(cible.get(k) is None for k in
                       ("x1", "y1", "x2", "y2", "cx", "cy", "r")):
                    for k in ("x1", "y1", "x2", "y2", "cx", "cy", "r"):
                        cible[k] = src.get(k)
                    cible["unites"] = src.get("unites", cible["unites"])
                break
            cur = liens.get(cur)

    # Un degrade reste sans arret (chaine cassee) : il n'est pas exploitable.
    # ⛔ PIEGE PAYE (2026-08-28) : ce menage, ecrit pour les degrades casses,
    # supprimait AUSSI les <filter> recenses (ils n'ont ni "motif" ni "arrets").
    # Le recensement etait correct, c'est le NETTOYAGE qui l'annulait en aval —
    # meme famille que les 4 bugs precedents : l'element est bon, son
    # AIGUILLAGE le detruit. Diagnostique en appelant la fonction isolement.
    for gid in list(out):
        e = out[gid]
        if not e.get("motif") and not e.get("filtre") and not e.get("arrets"):
            del out[gid]
    return out


def _moyenne_couleur(arrets):
    if not arrets:
        return None
    return [round(sum(a[1][i] for a in arrets) / len(arrets), 4) for i in range(3)]


def _moyenne_opacite(arrets):
    if not arrets:
        return 1.0
    return round(sum(a[2] for a in arrets) / len(arrets), 4)


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


def flou_du_filtre(el_filtre):
    """
    Un <filter> SVG est-il un SIMPLE FLOU, portable en Lottie ? (2026-08-28)

    ⭐⭐ CONTREDIT LA NOTE "les filtres sont une limite du FORMAT". MESURE le
    2026-08-28 : lottie-web rend bien l'effet Gaussian Blur (`ty: 29`) — un carre
    passe de 0 a 5360 pixels de bord adouci, verifie A L'IMAGE. Ce n'est donc PAS
    le format qui bloque, c'est que notre convertisseur ne l'emettait pas.

    ⛔ CE QUI RESTE HORS PORTEE : tout filtre COMPOSITE (feOffset + feMerge =
    ombre portee, feColorMatrix, feTurbulence...). On ne porte que le cas d'un
    <filter> ne contenant QU'UN feGaussianBlur — le plus frequent, et le seul
    dont l'equivalence est exacte.

    Retourne le rayon en px, ou None si non portable.
    """
    enfants = [e for e in el_filtre if isinstance(e.tag, str)]
    if len(enfants) != 1:
        return None
    e = enfants[0]
    if e.tag.split("}")[-1] != "feGaussianBlur":
        return None
    sd = e.attrib.get("stdDeviation")
    if not sd:
        return None
    try:
        vals = [float(x) for x in re.split(r"[\s,]+", sd.strip()) if x]
    except ValueError:
        return None
    if not vals:
        return None
    # stdDeviation peut etre "x y" : un flou anisotrope n'a pas d'equivalent
    if len(vals) > 1 and abs(vals[0] - vals[1]) > 1e-6:
        return None
    # SVG raisonne en ecart-type, After Effects/Lottie en "blurriness".
    # Facteur ~3 (regle usuelle : rayon visible ~ 3 sigma).
    return round(vals[0] * 3.0, 3)


def effet_flou(rayon):
    """Effet Lottie Gaussian Blur (ty 29), teste en direct sur lottie-web."""
    return {"ty": 29, "nm": "Gaussian Blur", "ix": 1, "ef": [
        {"ty": 0, "nm": "Blurriness", "ix": 1, "v": {"a": 0, "k": rayon}},
        {"ty": 7, "nm": "Dimensions", "ix": 2, "v": {"a": 0, "k": 1}},
        {"ty": 7, "nm": "Repeat Edge Pixels", "ix": 3, "v": {"a": 0, "k": 0}}]}


def gtransform_portable(gm):
    """
    Une `gradientTransform` est-elle transportable en Lottie ? (ajout 2026-08-28)

    ⭐ POURQUOI CE N'EST PAS TOUT-OU-RIEN. Lottie ne porte pas de matrice sur un
    degrade : il porte un SEGMENT (`s` depart -> `e` arrivee). Or deplacer les
    deux points reproduit EXACTEMENT une translation, une rotation, une echelle
    UNIFORME, et toute composition de celles-ci -- ce sont des similitudes, elles
    conservent les angles. L'ancienne version refusait TOUTES les
    gradientTransform et se repliait sur la couleur moyenne : elle jetait donc
    des cas parfaitement portables (13 degrades chez nous).

    ⛔ CE QUI RESTE IRRECUPERABLE : le cisaillement et l'echelle NON uniforme.
    Ils rendraient un degrade radial ELLIPTIQUE, ce que le format ne sait pas
    exprimer. Sur ceux-la on continue de se replier -- et on le DIT.

    Test : la partie lineaire (a,b,c,d) doit etre une similitude, c'est-a-dire
    colonne1 perpendiculaire a colonne2 ET de meme norme.
    """
    a, b, c, d, _, _ = gm
    n1 = math.hypot(a, b)
    n2 = math.hypot(c, d)
    if n1 < 1e-9 or n2 < 1e-9:
        return False, "matrice degeneree (echelle nulle)"
    # ⛔ Tester le CISAILLEMENT D'ABORD : un skew fait aussi varier les normes,
    # et l'annoncer comme "echelle non uniforme" donne un diagnostic FAUX
    # (verifie : skewX(20) et matrix(1,0,0.5,1,0,0) sortaient "echelle 1 vs 1.06").
    # Le verdict etait bon, le motif trompeur — et c'est le motif qu'on lit
    # pour decider quoi corriger.
    if abs(a * c + b * d) > 1e-6 * n1 * n2:
        return False, "cisaillement (skew)"
    if abs(n1 - n2) > 1e-6 * max(n1, n2):
        return False, f"echelle NON uniforme ({n1:.4g} vs {n2:.4g})"
    return True, ""


def geometrie_gradient(g, boite, mat=(1, 0, 0, 1, 0, 0)):
    """
    Points de depart/arrivee du gradient, en coordonnees ABSOLUES.

    SVG place le gradient soit dans la boite de la forme (`objectBoundingBox`,
    coordonnees 0-1 -- le defaut), soit dans l'espace utilisateur
    (`userSpaceOnUse`, coordonnees absolues). Lottie, lui, veut des pixels.

    `mat` = matrice accumulee de la forme. Elle n'est appliquee QUE dans le cas
    `userSpaceOnUse` (cf. le commentaire au point d'appel) : en
    `objectBoundingBox`, la boite est deja exprimee apres transformation.
    """
    x0, y0, x1b, y1b = boite
    w, h = max(1e-6, x1b - x0), max(1e-6, y1b - y0)
    bbox = g["unites"] != "userSpaceOnUse"

    # ⭐ gradientTransform : matrice PROPRE au degrade, appliquee a ses points
    # AVANT celle de la forme (c'est l'ordre de la spec SVG). Portee seulement
    # si elle est une similitude -- l'appelant a deja verifie et refuse sinon.
    gm = parse_transform(g.get("gtransform")) if g.get("gtransform") else None
    if gm is not None and est_identite(gm):
        gm = None

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

    # En userSpaceOnUse les coordonnees sont dans le repere du DESSIN : la
    # matrice accumulee doit leur etre appliquee, comme elle l'a ete aux
    # sommets. En objectBoundingBox elle l'est deja, via la boite.
    def sortie(depart, arrivee):
        # ⛔ ORDRE : gradientTransform d'abord (repere du degrade), matrice de la
        # forme ensuite (repere du dessin). L'inverse donne un degrade decale.
        if gm is not None:
            depart, arrivee = appliquer(gm, depart), appliquer(gm, arrivee)
        if bbox or est_identite(mat):
            return depart, arrivee
        return appliquer(mat, depart), appliquer(mat, arrivee)

    if g["type"] == 1:                       # lineaire
        return sortie([val(g["x1"], "0%", "x"), val(g["y1"], "0%", "y")],
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
    # ⚠️ Rayon d'un gradient radial en `objectBoundingBox`. Lottie n'a qu'un
    # rayon SCALAIRE (distance s->e) la ou SVG raisonne sur une boite : il
    # faut donc choisir. Les 4 formules ont ete MESUREES sur l'aeroport
    # (95 degrades, 11 radiaux), ecart au SVG d'origine :
    #     moyenne (w+h)/2   11,58 %   <- retenue
    #     diagonale/sqrt(2) 11,91 %
    #     largeur w         12,65 %
    #     max(w, h)         12,65 %
    # ⛔ J'avais "corrige" vers la diagonale en raisonnant sur la spec, sans
    # mesurer : c'etait une REGRESSION. La spec decrit le rendu SVG, pas la
    # meilleure approximation dans un format qui n'a qu'un rayon.
    r_px = rr * ((w + h) / 2.0) if bbox else rr
    # ⚠️ `e` est un POINT du bord, pas un vecteur : on le transforme comme le
    # centre. La distance s->e suit donc l'echelle de la matrice, ce qui est
    # bien le comportement voulu (un degrade sur une forme agrandie grandit).
    return sortie([cx, cy], [cx + r_px, cy])


def index_ids(root):
    """{id: element} pour resoudre les <use href="#id">."""
    return {e.attrib["id"]: e for e in root.iter() if "id" in e.attrib}


def decoupe_referencee(cible, mat, herite, css=None):
    """
    Geometrie d'un <mask>/<clipPath> -> formes Lottie, dans le repere final.

    ⭐ LE POINT DELICAT (2026-08-29). Cote SVG le pochoir est REFERENCE : il
    vit dans <defs>, hors de l'arbre, et n'a donc PAS subi les transforms des
    <g> qui portent l'element masque. Cote Lottie il est POSITIONNEL : c'est
    le calque juste au-dessus. Il faut donc lui appliquer a la main la matrice
    accumulee `mat` de l'element masque, sinon le pochoir atterrit ailleurs
    que ce qu'il decoupe -- meme famille de bug que les degrades
    `userSpaceOnUse` (7 sur 8 hors cadre, 2026-08-28).

    Retourne [] si la decoupe n'est pas faite de primitives simples : on
    prefere un refus declare a un pochoir approximatif, parce qu'un masque
    faux ne se voit pas comme une absence, il se voit comme un trou au
    mauvais endroit.
    """
    formes = []
    for el in cible.iter():
        tag = el.tag.replace(NS, "")
        if tag not in GEOM:
            continue
        st = styles(el, herite, css)
        if st.get("display") == "none":
            continue
        if tag == "path":
            d = el.attrib.get("d", "")
        else:
            d = shape_to_path(tag, el.attrib)
        if not d:
            continue
        try:
            fs = parse_path(d)
        except PathError:
            return []
        # transform propre a la forme DANS le pochoir, puis la matrice de
        # l'element masque (ordre : le repere local d'abord).
        m = _mul(mat, parse_transform(el.attrib.get("transform", "")))
        if not est_identite(m):
            for f in fs:
                k = f["ks"]["k"]
                k["v"] = [appliquer(m, p) for p in k["v"]]
                lin = (m[0], m[1], m[2], m[3], 0, 0)
                k["i"] = [appliquer(lin, p) for p in k["i"]]
                k["o"] = [appliquer(lin, p) for p in k["o"]]
        formes.extend(fs)
    return formes


def collecter(el, mat, herite, rapport, grads, sortie, profondeur=0, chemin=(),
              css=None, ids=None, pile=()):
    """
    Parcourt l'arbre SVG et produit une liste de (nom, formes, styles).

    `chemin` = les id des <g> traverses. ⭐ MESURE (2 scenes reelles) : les
    formes n'ont presque jamais d'id, mais les GROUPES en ont souvent
    (moitie-gauche, feves...). Aplatir sans les reprendre donnait 100 % de
    calques nommes "path-248" -- illisible dans Creator, et c'est justement
    ce qui separe un livrable pro d'un fichier brut.
    """
    tag = el.tag.replace(NS, "")

    if tag == "text":
        collecter_texte(el, mat, herite, rapport, sortie, chemin, css)
        return

    if tag in NON_PORTES:
        rapport.refuse(f"<{tag}>", NON_PORTES[tag])
        return
    if tag in ("defs", "linearGradient", "radialGradient", "stop", "title",
               "desc", "metadata", "style"):
        return

    st = styles(el, herite, css)
    if st.get("display") == "none":
        return

    # ⛔ Trouve par un SVG-piege : filter/clipPath/mask sont surtout utilises
    # comme ATTRIBUTS (filter="url(#flou)") et pas seulement comme balises.
    # Ne detecter que les balises laissait un flou disparaitre EN SILENCE --
    # le rapport annoncait "porte" sur un element dont le rendu changeait.
    # ⭐ Le pochoir (2026-08-29). `mask`/`clip-path` ne sont plus refuses en
    # bloc : ils sont RESOLUS plus bas (une fois `nom` et la matrice `m`
    # connus) en une paire de calques Lottie -- td:1 au-dessus = la decoupe,
    # tt:1 en dessous = le contenu. On note ici la reference a resoudre.
    ref_decoupe = None
    for attr in ("clip-path", "mask"):
        v = el.attrib.get(attr) or st.get(attr)
        if not v or str(v).strip() in ("none", ""):
            continue
        if not str(v).strip().startswith("url("):
            continue
        ref_decoupe = (attr, str(v).strip()[4:-1].strip().lstrip("#").strip("'\""))
        rapport.clips_vus += 1

    flou_a_poser = None
    for attr, raison in (("filter", NON_PORTES["filter"]),):
        v = el.attrib.get(attr) or st.get(attr)
        if not v or str(v).strip() in ("none", ""):
            continue
        # ⭐ Un filtre qui n'est QU'UN feGaussianBlur se porte (effet ty 29,
        # verifie sur lottie-web le 2026-08-28). Les composites (ombre portee =
        # feOffset + feMerge, feColorMatrix...) restent refuses, et on le dit.
        if attr == "filter" and str(v).startswith("url("):
            ref = str(v)[4:-1].strip().lstrip("#").strip("'\"")
            d = grads.get(ref) if grads else None
            if d is None:
                # ⭐ MESURE (logo Inkscape, 2026-08-28) : 14 des 16 references
                # `filter:url(#...)` pointent vers des ids QUI N'EXISTENT PAS —
                # supprimes a l'optimisation d'export, la reference est restee.
                # Un navigateur ignore un filtre introuvable : il n'y a donc
                # RIEN a porter, et le rendu de reference ne l'applique pas non
                # plus. L'annoncer comme "non porte" faisait croire a une perte.
                rapport.approxime(f"attribut filter= (#{ref})",
                                  "filtre INTROUVABLE dans le fichier — "
                                  "ignore, comme le fait un navigateur")
                continue
            if d.get("filtre"):
                if d.get("flou"):
                    flou_a_poser = d["flou"]
                    rapport.ok(f"filtre #{ref}: flou {d['flou']}px")
                else:
                    rapport.refuse(f"attribut filter= (#{ref})",
                                   "filtre COMPOSITE (ombre portee, colorMatrix...) — "
                                   "seul un feGaussianBlur seul est portable")
                continue
        rapport.refuse(f"attribut {attr}=", raison)

    m = _mul(mat, parse_transform(el.attrib.get("transform", "")))

    if tag == "use":
        # ⭐ APLATISSEMENT (2026-08-28). Un <use> reprend une forme deja definie,
        # en la decalant (x/y) ou en la transformant (souvent matrix(-1 0 0 1 ..)
        # = le MIROIR d'un blason). Refuser ces elements ne produit pas une
        # absence discrete : il manque LA MOITIE du dessin.
        #
        # ⛔ MESURE (armoiries d'Equateur) : 44 <use> refuses = la bande droite
        # perdait 90 % de son encre, et le rapport gauche/droite passait de 1,03
        # (source, symetrique) a 1,83. Le cote droit EST le cote gauche repete.
        #
        # x/y sont une translation ajoutee APRES le transform propre (spec SVG).
        cible = None
        ref = None
        for k, v in el.attrib.items():
            if k.endswith("href") and str(v).startswith("#"):
                ref = str(v)[1:]
                cible = (ids or {}).get(ref)
                break
        if cible is None:
            rapport.refuse("<use>", "cible introuvable — reference cassee dans le SVG")
            return
        if ref in pile:
            rapport.refuse("<use>", "reference circulaire — aplatissement interrompu")
            return
        try:
            dx = float(el.attrib.get("x", 0) or 0)
            dy = float(el.attrib.get("y", 0) or 0)
        except ValueError:
            dx = dy = 0.0
        m2 = _mul(m, (1, 0, 0, 1, dx, dy)) if (dx or dy) else m
        rapport.ok("<use> aplati")
        # La cible peut etre un <symbol>/<defs> : on descend dans ses enfants.
        sous = list(cible) if cible.tag.replace(NS, "") in ("symbol", "defs") else [cible]
        for enfant in sous:
            collecter(enfant, m2, st, rapport, grads, sortie, profondeur + 1, chemin,
                      css, ids, pile + (ref,))
        return

    if tag in ("svg", "g", "a"):
        gid = el.attrib.get("id")
        suite = chemin + (gid,) if gid else chemin
        debut = len(sortie)
        for enfant in el:
            collecter(enfant, m, st, rapport, grads, sortie, profondeur + 1, suite,
                      css, ids, pile)
        # ⛔⛔ BUG TROUVE PAR LE TEST BOUT-EN-BOUT (2026-08-29). Cette branche
        # faisait `return` AVANT le traitement de `ref_decoupe` : un
        # `clip-path` porte par un <g> -- la forme la plus courante dans un
        # SVG d'export -- disparaissait EN SILENCE, et le rapport annoncait
        # quand meme "transportable a l'identique". Faux vert : le clip perdu
        # ne se voyait ni au rapport, ni a l'ecart mesure (formes clipee et
        # non clipee se recouvrent largement).
        #
        # Un clip pose sur un groupe decoupe TOUT ce que le sous-arbre a
        # produit. On enveloppe donc les calques issus du groupe dans UNE
        # seule paire : le pochoir, puis les calques marques `tt` -- Lottie
        # applique un matte au calque immediatement sous la decoupe, donc
        # chaque calque du groupe porte son propre `tt` (l'assemblage
        # reordonne la paire).
        if ref_decoupe is not None and len(sortie) > debut:
            attr, ref = ref_decoupe
            cible = (ids or {}).get(ref)
            if cible is None:
                rapport.pochoirs_emis += 1  # declare : le rapport dit vrai
                rapport.approxime(f"attribut {attr}= (#{ref})",
                                  "reference INTROUVABLE — ignoree, comme le "
                                  "fait un navigateur")
            else:
                formes_d = decoupe_referencee(cible, m, st, css)
                if not formes_d:
                    rapport.pochoirs_emis += 1  # declare
                    rapport.refuse(
                        f"attribut {attr}= (#{ref})",
                        "pochoir sans geometrie simple : seules les primitives "
                        "(path, rect, circle...) sont portees, pas <use>/<text>")
                elif len(sortie) - debut > 1:
                    # ⛔ HONNETETE : Lottie ne decoupe QU'UN calque par
                    # pochoir. Un groupe qui produit N calques demanderait N
                    # pochoirs (ou une precomposition) -- non implemente. On
                    # REFUSE bruyamment plutot que de n'en decouper qu'un et
                    # laisser croire que le groupe entier est masque.
                    rapport.pochoirs_emis += 1  # declare
                    rapport.refuse(
                        f"attribut {attr}= (#{ref}) sur <{tag}>",
                        f"clip d'un groupe de {len(sortie) - debut} calques — "
                        "Lottie ne decoupe qu'un calque par pochoir "
                        "(precomposition non implementee)")
                else:
                    nom_g = gid or f"{tag}-{debut + 1}"
                    base = sortie[debut]
                    sortie[debut] = base[:4] + ("masque",)
                    sortie.insert(debut, (
                        f"{nom_g}-pochoir", formes_d,
                        [{"ty": "fl", "c": {"a": 0, "k": [1, 1, 1, 1]},
                          "o": {"a": 0, "k": 100}, "nm": "pochoir"}],
                        None, "decoupe"))
                    rapport.pochoirs_emis += 1
                rapport.ok(f"{attr}= #{ref}: pochoir porte (track matte alpha)")
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
        rang = sum(1 for e in sortie if e[0] == base or e[0].startswith(base + "-")) + 1
        nom = f"{base}-{rang}"
    else:
        nom = f"{tag}-{len(sortie) + 1}"

    # Gradient : on note la moyenne pour shapes_de_style
    for cle in ("fill", "stroke"):
        v = str(st.get(cle, ""))
        if v.startswith("url("):
            gid = v[v.find("#") + 1:].rstrip(")").strip('"\'')
            if gid in grads and grads[gid].get("motif"):
                st["_est_motif"] = True
            elif gid in grads:
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
        # ⛔⛔ CAUSE RACINE MESUREE (logo Inkscape, 2026-08-28) : les coordonnees
        # `userSpaceOnUse` vivent dans le MEME repere que le "d" du path, donc
        # AVANT la matrice accumulee (transform du path + des <g> parents). Les
        # sommets, eux, ont deja subi cette matrice juste au-dessus. Sans la
        # porter aussi au degrade, il atterrit hors du cadre : 7 degrades sur 8
        # invisibles, s=[95, 208] sur un cadre 128x128.
        # `objectBoundingBox` n'a PAS ce probleme : sa boite est calculee sur
        # les sommets DEJA transformes, donc deja en coordonnees finales.
        st["_gradient_mat"] = m

    # ⭐ LE POCHOIR (2026-08-29). Resolu ICI parce qu'il faut `nom` (pour
    # nommer la decoupe) et `m` (la matrice accumulee : la decoupe vit dans
    # <defs>, hors de l'arbre, donc elle n'a PAS subi les transforms des <g>
    # parents de l'element masque -- il faut les lui appliquer a la main).
    pochoir_pose = False
    if ref_decoupe is not None:
        attr, ref = ref_decoupe
        cible = (ids or {}).get(ref)
        if cible is None:
            # Meme traitement que les filtres introuvables : un navigateur
            # ignore une reference cassee. Il n'y a RIEN a porter, et le rendu
            # de reference ne masque pas non plus -- l'annoncer comme une perte
            # ferait croire a un manque qui n'existe pas.
            rapport.pochoirs_emis += 1      # declare : le rapport dit vrai
            rapport.approxime(f"attribut {attr}= (#{ref})",
                              "reference INTROUVABLE — ignoree, comme le fait "
                              "un navigateur")
        else:
            formes_d = decoupe_referencee(cible, m, herite, css)
            if formes_d:
                sortie.append((f"{nom}-pochoir", formes_d,
                               [{"ty": "fl", "c": {"a": 0, "k": [1, 1, 1, 1]},
                                 "o": {"a": 0, "k": 100}, "nm": "pochoir"}],
                               None, "decoupe"))
                pochoir_pose = True
                rapport.pochoirs_emis += 1
                rapport.ok(f"{attr}= #{ref}: pochoir porte (track matte alpha)")
            else:
                rapport.pochoirs_emis += 1  # declare
                rapport.refuse(
                    f"attribut {attr}= (#{ref})",
                    "pochoir sans geometrie simple : seules les primitives "
                    "(path, rect, circle...) sont portees, pas <use>/<text>")

    # ⭐ 4e element = le flou eventuel. Les autres appelants poussent des tuples
    # a 3 ou 4 elements : l'assemblage lit donc l'index 3 avec un defaut.
    # ⭐ 5e element = le role dans une paire de pochoir : "decoupe" pour le
    # calque qui decoupe, "masque" pour celui qui est decoupe, None sinon.
    sortie.append((nom, formes, shapes_de_style(st, rapport, nom), flou_a_poser,
                   "masque" if pochoir_pose else None))


def collecter_texte(el, mat, herite, rapport, sortie, chemin, css=None):
    """
    Un <text> SVG -> soit des courbes, soit un calque natif (MODE_TEXTE).

    ⛔ CE QUI SE JOUE ICI (et qui a coute 4 fois cette semaine) : le texte
    peut etre parfaitement converti et rester INVISIBLE si son AIGUILLAGE est
    faux. Deux aiguillages a ne pas rater :
      1. la LIGNE DE BASE -- l'attribut y d'un <text> n'est pas le haut du
         bloc, c'est la baseline. Traiter y comme un haut decale tout d'une
         hauteur de capitale ;
      2. le TRANSFORM du parent -- il doit s'appliquer aux glyphes une fois
         convertis, comme pour n'importe quelle geometrie.
    """
    st = styles(el, herite, css)
    if st.get("display") == "none":
        return

    # Le contenu textuel : le noeud lui-meme plus ses <tspan> (dont on ignore
    # pour l'instant le repositionnement individuel -- signale s'il y en a).
    morceaux = [el.text or ""]
    tspans = 0
    for enfant in el:
        if enfant.tag.replace(NS, "") == "tspan":
            tspans += 1
            morceaux.append(enfant.text or "")
            morceaux.append(enfant.tail or "")
        else:
            morceaux.append(enfant.tail or "")
    contenu = re.sub(r"\s+", " ", "".join(morceaux)).strip()

    if not contenu:
        rapport.refuse("<text> vide", "aucun contenu a rendre")
        return

    apercu = contenu if len(contenu) <= 24 else contenu[:21] + "..."

    if tspans:
        rapport.approxime(
            f"<text> \"{apercu}\"",
            f"{tspans} <tspan> fusionnes dans une seule ligne "
            "— un tspan repositionne (x/y/dy propres) ne sera pas suivi")

    taille = _nb(st.get("font-size"), 16.0)
    ancrage = str(st.get("text-anchor", "start")).strip()
    tracking = _nb(st.get("letter-spacing"), 0.0)
    familles = svgtext.familles_css(st.get("font-family"))
    gras = svgtext._gras(st.get("font-weight"))
    ital = svgtext._italique(st.get("font-style"))
    x = _nb(el.attrib.get("x"), 0.0)
    y = _nb(el.attrib.get("y"), 0.0)

    # Nom du calque : lisible dans Creator, comme pour les formes.
    propre = el.attrib.get("id")
    if propre:
        nom = propre
    else:
        base = re.sub(r"[^\w -]", "", contenu)[:24].strip() or "texte"
        rang = sum(1 for e in sortie if e[0] == base or e[0].startswith(base + "-"))
        nom = base if not rang else f"{base}-{rang + 1}"

    couleur_rgb, opacite = couleur(st.get("fill", "#000")), _nb(
        st.get("fill-opacity"), 1.0) * _nb(st.get("opacity"), 1.0)

    if MODE_TEXTE == "natif":
        famille = familles[0] if familles else "sans-serif"
        # ⛔ Le natif ne CONVERTIT pas la police, il la NOMME. Si le lecteur
        # ne l'a pas, il rendra autre chose. On le dit franchement.
        rapport.approxime(
            f"<text> \"{apercu}\"",
            f"calque natif editable en \"{famille}\" — le rendu depend de la "
            "police disponible chez le lecteur (aucune n'est embarquee)")
        m = _mul(mat, parse_transform(el.attrib.get("transform", "")))
        px, py = appliquer(m, (x, y))
        sortie.append((nom, None, None, {
            "texte": contenu, "famille": famille, "taille": taille,
            "x": px, "y": py, "couleur": couleur_rgb, "ancrage": ancrage,
            "tracking": tracking, "opacite": opacite * 100.0,
            "gras": gras, "ital": ital}))
        return

    # --- vectorisation ---
    police, retenue, exacte, idx = svgtext.trouver_police(familles, gras, ital)
    if police is None:
        rapport.refuse(
            f"<text> \"{apercu}\"",
            f"aucune police installee pour {familles or ['(non declaree)']} "
            "— impossible de vectoriser")
        return
    if not exacte:
        rapport.approxime(
            f"<text> \"{apercu}\"",
            f"police \"{retenue}\" absente du systeme — dessine avec une "
            "substitution, la largeur du texte change")

    try:
        formes, _largeur, manquants = svgtext.vectoriser(
            contenu, police, taille, x, y, ancrage, tracking, idx)
    except Exception as e:                        # police illisible, glyphe casse
        rapport.refuse(f"<text> \"{apercu}\"", f"vectorisation impossible : {e}")
        return

    if manquants:
        rapport.approxime(
            f"<text> \"{apercu}\"",
            f"glyphes absents de la police : {''.join(sorted(set(manquants)))}")

    if not formes:
        rapport.refuse(f"<text> \"{apercu}\"", "aucun glyphe dessinable")
        return

    m = _mul(mat, parse_transform(el.attrib.get("transform", "")))
    if not est_identite(m):
        lin = (m[0], m[1], m[2], m[3], 0.0, 0.0)
        for f in formes:
            k = f["ks"]["k"]
            k["v"] = [appliquer(m, p) for p in k["v"]]
            k["i"] = [appliquer(lin, p) for p in k["i"]]
            k["o"] = [appliquer(lin, p) for p in k["o"]]

    # ⚠️ Un glyphe vectorise est une SURFACE, jamais un trait : le contour du
    # <text> (stroke) cerne la lettre, il ne doit pas devenir le trait des
    # courbes du glyphe -- sinon un texte a contour double d'epaisseur.
    st_glyphes = dict(st)
    st_glyphes.pop("stroke", None)
    if str(st.get("stroke", "none")).strip() not in ("none", ""):
        rapport.approxime(
            f"<text> \"{apercu}\"",
            "contour du texte non porte — le glyphe est vectorise en surface")

    rapport.ok(f"<text> \"{apercu}\" ({len(formes)} contours)")
    sortie.append((nom, formes, shapes_de_style(st_glyphes, rapport, nom)))


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
    collecter(root, base, {}, rapport, grads, elements,
              css=feuille_css(root), ids=index_ids(root))

    layers = []
    # Lottie dessine le calque d'indice 0 AU-DESSUS : on inverse pour garder
    # l'ordre de peinture du SVG (premier element = dessous).
    def _tr():
        return {"ty": "tr", "a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                "o": {"a": 0, "k": 100}}

    fontes = {}
    for i, entree in enumerate(reversed(elements)):
        # ⛔ AVANT (bug du 2026-08-28) : on reconnaissait le texte a
        # `len(entree) == 4`. Des que les formes ont eu, elles aussi, un 4e champ
        # (le flou), toute forme floutee partait dans la branche TEXTE et
        # plantait sur `t["texte"]`. La LONGUEUR n'est pas un discriminant :
        # c'est le CONTENU qui l'est — une entree de texte n'a pas de formes.
        if len(entree) == 4 and entree[1] is None and isinstance(entree[3], dict):
            nom, _, _, t = entree
            calque, fonte = svgtext.calque_natif(
                t["texte"], t["famille"], t["taille"], t["x"], t["y"],
                t["couleur"], t["ancrage"], t["tracking"], t["opacite"],
                t["gras"], t["ital"], nom, frames, i)
            fontes[fonte["fName"]] = fonte
            layers.append(calque)
            continue

        # 4e element optionnel : le flou a poser (cf. collecter()).
        # 5e optionnel : le role dans une paire de pochoir ("decoupe"/"masque").
        nom, formes, styles_ = entree[0], entree[1], entree[2]
        flou = entree[3] if len(entree) > 3 else None
        role = entree[4] if len(entree) > 4 else None
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

        couche = {
            "ddd": 0, "ty": 4, "ind": i, "nm": nom, "st": 0, "ip": 0, "op": frames,
            "ks": {"a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                   "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                   "o": {"a": 0, "k": 100}},
            "shapes": groupes,
        }
        if flou:
            couche["ef"] = [effet_flou(flou)]
        # ⭐ LE POCHOIR. Dans le tableau Lottie, la decoupe doit preceder
        # IMMEDIATEMENT le calque qu'elle decoupe (indice plus petit = plus
        # haut dans la pile). `collecter` pousse le pochoir JUSTE AVANT son
        # masque ; comme on parcourt ici en `reversed`, le masque sort en
        # premier et le pochoir juste apres -- il faut donc les inverser pour
        # retablir "decoupe au-dessus".
        if role == "masque":
            couche["tt"] = 1          # 1 = alpha : 92 des 93 mattes du corpus
        elif role == "decoupe":
            couche["td"] = 1          # ce calque SERT de pochoir, il ne s'affiche pas
            if layers:                # remonter la decoupe au-dessus de son masque
                layers.insert(len(layers) - 1, couche)
                continue
        layers.append(couche)

    # ⛔ RENUMEROTATION OBLIGATOIRE APRES INSERTION D'UN POCHOIR. `ind` etait
    # pose depuis le compteur de boucle ; remonter une decoupe d'un cran casse
    # cette correspondance. Verifie sur un fichier pro (corpus kamotion,
    # 02_Doggy) : `ind` y croit strictement avec la position dans le tableau,
    # et le calque td:1 precede IMMEDIATEMENT son tt:1.
    for position, couche in enumerate(layers):
        couche["ind"] = position

    doc = {"nm": os.path.splitext(os.path.basename(chemin))[0], "v": "5.5.2",
           "fr": fps, "ip": 0, "op": frames, "w": round(w), "h": round(h),
           "assets": [], "layers": layers}
    # ⛔ Un calque ty:5 qui reference une fonte absente de ce tableau se rend
    # VIDE, sans erreur -- exactement la famille de piege qui a coute 4 fois
    # cette semaine (l'element est correct, son aiguillage l'annule).
    if fontes:
        doc["fonts"] = {"list": list(fontes.values())}
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
    ap.add_argument("--texte", choices=("vectorise", "natif"), default="vectorise",
                    help="vectorise : glyphes en courbes, fidele, non editable (defaut) ; "
                         "natif : calque ty:5 editable, mais dependant de la police du lecteur")
    a = ap.parse_args()

    global MODE_TEXTE
    MODE_TEXTE = a.texte

    try:
        doc, rapport = convertir(a.svg, a.fps, a.frames)
    except (PathError, ET.ParseError) as e:
        print(f"ECHEC : {e}", file=sys.stderr)
        return 2

    # un meme chemin est duplique dans le groupe fill ET le groupe stroke :
    # on ne compte que le premier groupe de chaque calque
    # ⚠️ Un calque texte NATIF (ty:5) n'a pas de "shapes" : il porte un
    # TextDocument. Compter sans le filtrer levait un KeyError.
    nb_pts = sum(len(sh["ks"]["k"]["v"])
                 for l in doc["layers"] if l.get("shapes")
                 for sh in l["shapes"][0]["it"] if sh.get("ty") == "sh")
    nb_txt = sum(1 for l in doc["layers"] if l.get("ty") == 5)
    print(f"{os.path.basename(a.svg)} -> {len(doc['layers'])} calques, "
          f"{nb_pts} sommets"
          + (f", {nb_txt} texte(s) natif(s)" if nb_txt else "")
          + f", {doc['w']}x{doc['h']}")
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
