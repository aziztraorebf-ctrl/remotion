#!/usr/bin/env python3
"""
SVG path 'd' -> polybezier cubique Lottie.

Remplace le parseur "segments droits" de animate_start.py, qui echouait
bruyamment sur toute courbe. Gere desormais la grammaire complete :

    M m  L l  H h  V v  C c  S s  Q q  T t  A a  Z z

--- Le modele Lottie (verifie sur la spec officielle, lottie-docs) ---

Un chemin Lottie est UN polybezier cubique :

    {"v": [sommets], "i": [tangentes entrantes], "o": [tangentes sortantes],
     "c": ferme?}

`i` et `o` sont RELATIFS a leur sommet (spec : "in/out tangent points
relative to v"). C'est le piege principal : un `C` SVG donne ses deux points
de controle en ABSOLU, et ils se repartissent sur DEUX sommets differents --
le 1er controle devient le `o` du sommet de DEPART, le 2nd devient le `i` du
sommet d'ARRIVEE.

    SVG :     P0 --c1      c2-- P1
    Lottie :  v[k]=P0, o[k]=c1-P0     v[k+1]=P1, i[k+1]=c2-P1

Un segment droit est donc juste une courbe dont les deux tangentes sont
nulles : le code n'a plus de "cas droit" separe.

--- Conversions ---

Q/T (quadratique, 1 seul controle) : eleve au degre 3, exactement --
    c1 = P0 + 2/3 (Q - P0)   et   c2 = P1 + 2/3 (Q - P1)
Ce n'est pas une approximation : toute quadratique EST une cubique.

S/T (lisses) : le controle manquant est le reflet du precedent autour du
point courant. Si le segment precedent n'etait pas de la meme famille, la
spec SVG impose de prendre le point courant lui-meme.

A (arc elliptique) : seule conversion APPROXIMATIVE du module. Decoupe en
cubiques "kappa", dont le nombre depend du RAYON pour viser 0,01 px d'erreur
radiale a toute echelle (cf. _arc_to_cubics).
⚠️ Une decoupe fixe a 90 deg -- le reflexe habituel -- donne 0,11 px a R=400
et 0,55 px a R=2000 : visible. L'erreur chute en delta^6, donc raccourcir les
arcs coute peu de points et gagne beaucoup.
"""

import math
import re

__all__ = ["parse_path", "shape_to_path", "PathError"]


class PathError(ValueError):
    """Chemin non convertible. Leve bruyamment -- jamais d'echec silencieux."""


# Un token = une lettre de commande, ou un nombre (gere -1.5e-3, .5, 1.5.5)
_TOKEN = re.compile(r"([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?)")

# Nombre d'arguments par commande
_ARITY = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7, "Z": 0}


def _tokenize(d):
    """Decoupe 'd' en [(cmd|None, num|None), ...] en refusant les caracteres parasites."""
    out, pos = [], 0
    for m in _TOKEN.finditer(d):
        # Tout ce qui n'est ni separateur ni token est une erreur : on ne
        # devine pas, on refuse.
        gap = d[pos:m.start()]
        if gap.strip(" ,\t\r\n"):
            raise PathError(f"caractere inattendu {gap.strip()!r} dans le path")
        pos = m.end()
        out.append((m.group(1), m.group(2)))
    gap = d[pos:]
    if gap.strip(" ,\t\r\n"):
        raise PathError(f"caractere inattendu {gap.strip()!r} en fin de path")
    return out


def _commands(d):
    """
    Regroupe les tokens en (lettre, [args]).

    Gere la repetition implicite : "L 1 2 3 4" == deux L. Cas particulier
    impose par la spec SVG : un M repete devient un L (m -> l en relatif).
    """
    toks = _tokenize(d)
    cmds, i = [], 0
    cur = None
    while i < len(toks):
        letter, num = toks[i]
        if letter:
            cur = letter
            i += 1
            if cur in "Zz":
                cmds.append((cur, []))
                cur = None
                continue
        elif cur is None:
            raise PathError("le path commence par un nombre, sans commande")

        n = _ARITY[cur.upper()]
        args = []
        for _ in range(n):
            if i >= len(toks) or toks[i][0] is not None:
                raise PathError(f"commande '{cur}' incomplete ({len(args)}/{n} arguments)")
            args.append(float(toks[i][1]))
            i += 1
        cmds.append((cur, args))
        # M implicite -> L (spec SVG 8.3.2)
        if cur == "M":
            cur = "L"
        elif cur == "m":
            cur = "l"
    return cmds


def _arc_to_cubics(p0, rx, ry, phi_deg, large_arc, sweep, p1):
    """
    Arc elliptique SVG -> liste de cubiques [(c1, c2, fin), ...].

    Implementation de l'annexe F.6 de la spec SVG (endpoint -> center
    parameterization), puis decoupe en segments de <= 90 deg.
    """
    if p0 == p1:
        return []                              # arc de longueur nulle : ignore
    rx, ry = abs(rx), abs(ry)
    if rx == 0 or ry == 0:
        return [(p0, p1, p1)]                  # rayon nul -> segment droit (spec)

    phi = math.radians(phi_deg % 360.0)
    cos_p, sin_p = math.cos(phi), math.sin(phi)

    # 1. Point median dans le repere de l'ellipse
    dx2, dy2 = (p0[0] - p1[0]) / 2.0, (p0[1] - p1[1]) / 2.0
    x1p = cos_p * dx2 + sin_p * dy2
    y1p = -sin_p * dx2 + cos_p * dy2

    # 2. Correction des rayons trop petits (spec F.6.6)
    lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
    if lam > 1:
        s = math.sqrt(lam)
        rx, ry = rx * s, ry * s

    # 3. Centre
    num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    factor = math.sqrt(max(0.0, num / den)) if den else 0.0
    if large_arc == sweep:
        factor = -factor
    cxp = factor * rx * y1p / ry
    cyp = -factor * ry * x1p / rx
    cx = cos_p * cxp - sin_p * cyp + (p0[0] + p1[0]) / 2.0
    cy = sin_p * cxp + cos_p * cyp + (p0[1] + p1[1]) / 2.0

    # 4. Angles de depart et d'arrivee
    def angle(ux, uy, vx, vy):
        dot = ux * vx + uy * vy
        n = math.hypot(ux, uy) * math.hypot(vx, vy)
        a = math.acos(max(-1.0, min(1.0, dot / n))) if n else 0.0
        return -a if ux * vy - uy * vx < 0 else a

    ux, uy = (x1p - cxp) / rx, (y1p - cyp) / ry
    vx, vy = (-x1p - cxp) / rx, (-y1p - cyp) / ry
    theta = angle(1.0, 0.0, ux, uy)
    dtheta = angle(ux, uy, vx, vy)
    if not sweep and dtheta > 0:
        dtheta -= 2 * math.pi
    elif sweep and dtheta < 0:
        dtheta += 2 * math.pi

    # 5. Decoupe en arcs assez courts pour que l'approximation cubique tienne.
    #
    # Une cubique "kappa" passe par les extremites avec les bonnes tangentes,
    # mais devie entre les deux. MESURE (pas estimation) : l'erreur radiale
    # max vaut ~2,73e-4 x R pour un arc de 90 deg, et chute en delta^6 --
    # 30 deg la divise par 730.
    #
    #   decoupe   err/R      R=40       R=400      R=2000
    #    90 deg   2.73e-4    1.1e-2     1.1e-1     5.5e-1   <- trop grossier
    #    45 deg   4.25e-6    1.7e-4     1.7e-3     8.5e-3
    #    30 deg   3.73e-7    1.5e-5     1.5e-4     7.5e-4
    #
    # On choisit donc l'angle en fonction du RAYON, pour viser TOL_PX partout :
    # un petit cadran n'a pas besoin de la finesse d'un grand cercle.
    # delta_max = (TOL / (K * R))^(1/6), borne a 90 deg.
    TOL_PX, K = 0.01, 2.73e-4
    r_max = max(rx, ry)
    if r_max > 0:
        delta_max = min(math.pi / 2, (TOL_PX / (K * r_max)) ** (1.0 / 6.0))
    else:
        delta_max = math.pi / 2
    n_seg = max(1, int(math.ceil(abs(dtheta) / delta_max)))
    delta = dtheta / n_seg
    # kappa exact pour un arc unitaire d'angle delta
    k = 4.0 / 3.0 * math.tan(delta / 4.0)

    def point(t):
        ct, st = math.cos(t), math.sin(t)
        return (cx + rx * cos_p * ct - ry * sin_p * st,
                cy + rx * sin_p * ct + ry * cos_p * st)

    def derivative(t):
        ct, st = math.cos(t), math.sin(t)
        return (-rx * cos_p * st - ry * sin_p * ct,
                -rx * sin_p * st + ry * cos_p * ct)

    out, t0 = [], theta
    start = p0
    for _ in range(n_seg):
        t1 = t0 + delta
        end = point(t1)
        d0, d1 = derivative(t0), derivative(t1)
        c1 = (start[0] + k * d0[0], start[1] + k * d0[1])
        c2 = (end[0] - k * d1[0], end[1] - k * d1[1])
        out.append((c1, c2, end))
        start, t0 = end, t1
    # On force le point final exact : l'arithmetique flottante peut deriver
    # de quelques 1e-13, et un sous-chemin ferme doit retomber pile.
    if out:
        c1, c2, _ = out[-1]
        out[-1] = (c1, c2, p1)
    return out


def parse_path(d, dx=0.0, dy=0.0, precision=4):
    """
    Convertit un 'd' SVG en liste de shapes Lottie (une par sous-chemin).

    dx/dy : translation aplatie dans les points (Lottie n'a pas d'equivalent
    du transform SVG au niveau d'une forme).

    Retourne [{"ty": "sh", "nm": ..., "ks": {"a": 0, "k": {v,i,o,c}}}, ...]
    Un sous-chemin de moins de 2 sommets est ignore (un point isole n'a pas
    de rendu). Leve PathError si le chemin est illisible.
    """
    if not d or not d.strip():
        raise PathError("path vide")

    subpaths = []                 # [(verts, ins, outs, closed)]
    v, tin, tout = [], [], []
    closed = False
    cur = (0.0, 0.0)
    start = (0.0, 0.0)
    last_ctrl = None              # dernier point de controle (pour S/T)
    last_kind = None              # 'C' ou 'Q' -- famille du segment precedent

    def flush():
        nonlocal v, tin, tout, closed
        if len(v) >= 2:
            subpaths.append((v, tin, tout, closed))
        v, tin, tout = [], [], []
        closed = False

    def add_point(p):
        v.append(list(p))
        tin.append([0.0, 0.0])
        tout.append([0.0, 0.0])

    def add_curve(c1, c2, end):
        """Pose une cubique : c1 -> tangente sortante du dernier sommet,
        c2 -> tangente entrante du nouveau."""
        if not v:
            add_point(cur)
        tout[-1] = [c1[0] - v[-1][0], c1[1] - v[-1][1]]
        add_point(end)
        tin[-1] = [c2[0] - end[0], c2[1] - end[1]]

    for letter, args in _commands(d):
        c = letter.upper()
        rel = letter.islower()

        if c == "Z":
            if v:
                # Si le trace revient exactement sur son point de depart, le
                # sommet duplique ferait un doublon : Lottie ferme deja via "c".
                if len(v) > 1 and _close(v[0], v[-1]):
                    tin[0] = tin[-1]
                    v.pop(); tin.pop(); tout.pop()
                closed = True
                flush()
            cur = start
            last_ctrl, last_kind = None, None
            continue

        if c == "M":
            x, y = args
            p = (cur[0] + x, cur[1] + y) if rel else (x, y)
            flush()
            add_point(p)
            cur = start = p
            last_ctrl, last_kind = None, None
            continue

        if not v:
            # Un trace qui commence sans M : la spec l'interdit, mais on
            # tolere en demarrant a l'origine courante plutot que d'echouer.
            add_point(cur)

        if c == "L":
            x, y = args
            cur = (cur[0] + x, cur[1] + y) if rel else (x, y)
            add_point(cur)
            last_ctrl, last_kind = None, None

        elif c == "H":
            x = args[0]
            cur = (cur[0] + x, cur[1]) if rel else (x, cur[1])
            add_point(cur)
            last_ctrl, last_kind = None, None

        elif c == "V":
            y = args[0]
            cur = (cur[0], cur[1] + y) if rel else (cur[0], y)
            add_point(cur)
            last_ctrl, last_kind = None, None

        elif c == "C":
            x1, y1, x2, y2, x, y = args
            if rel:
                c1 = (cur[0] + x1, cur[1] + y1)
                c2 = (cur[0] + x2, cur[1] + y2)
                end = (cur[0] + x, cur[1] + y)
            else:
                c1, c2, end = (x1, y1), (x2, y2), (x, y)
            add_curve(c1, c2, end)
            cur, last_ctrl, last_kind = end, c2, "C"

        elif c == "S":
            x2, y2, x, y = args
            if rel:
                c2 = (cur[0] + x2, cur[1] + y2)
                end = (cur[0] + x, cur[1] + y)
            else:
                c2, end = (x2, y2), (x, y)
            # Controle 1 = reflet du precedent, sinon le point courant
            c1 = _reflect(last_ctrl, cur) if last_kind == "C" else cur
            add_curve(c1, c2, end)
            cur, last_ctrl, last_kind = end, c2, "C"

        elif c == "Q":
            x1, y1, x, y = args
            if rel:
                q = (cur[0] + x1, cur[1] + y1)
                end = (cur[0] + x, cur[1] + y)
            else:
                q, end = (x1, y1), (x, y)
            c1, c2 = _quad_to_cubic(cur, q, end)
            add_curve(c1, c2, end)
            cur, last_ctrl, last_kind = end, q, "Q"

        elif c == "T":
            x, y = args
            end = (cur[0] + x, cur[1] + y) if rel else (x, y)
            q = _reflect(last_ctrl, cur) if last_kind == "Q" else cur
            c1, c2 = _quad_to_cubic(cur, q, end)
            add_curve(c1, c2, end)
            cur, last_ctrl, last_kind = end, q, "Q"

        elif c == "A":
            rx, ry, phi, large, sweep, x, y = args
            end = (cur[0] + x, cur[1] + y) if rel else (x, y)
            for c1, c2, e in _arc_to_cubics(cur, rx, ry, phi,
                                            bool(int(large)), bool(int(sweep)), end):
                add_curve(c1, c2, e)
            cur, last_ctrl, last_kind = end, None, None

    flush()

    if not subpaths:
        raise PathError(f"aucun sous-chemin exploitable : {d[:60]!r}")

    def r(pt):
        return [round(pt[0], precision), round(pt[1], precision)]

    shapes = []
    for verts, ins, outs, is_closed in subpaths:
        shapes.append({"ty": "sh", "nm": "path", "ks": {"a": 0, "k": {
            "c": is_closed,
            "v": [r([x + dx, y + dy]) for x, y in verts],
            "i": [r(p) for p in ins],
            "o": [r(p) for p in outs],
        }}})
    return shapes


def _reflect(ctrl, pt):
    """Reflet du point de controle autour du point courant (S et T)."""
    if ctrl is None:
        return pt
    return (2 * pt[0] - ctrl[0], 2 * pt[1] - ctrl[1])


def _quad_to_cubic(p0, q, p1):
    """Elevation exacte d'une quadratique au degre 3."""
    c1 = (p0[0] + 2.0 / 3.0 * (q[0] - p0[0]), p0[1] + 2.0 / 3.0 * (q[1] - p0[1]))
    c2 = (p1[0] + 2.0 / 3.0 * (q[0] - p1[0]), p1[1] + 2.0 / 3.0 * (q[1] - p1[1]))
    return c1, c2


def _close(a, b, eps=1e-9):
    return abs(a[0] - b[0]) < eps and abs(a[1] - b[1]) < eps


# --- Primitives SVG -> 'd' equivalent ----------------------------------------
#
# ⭐ TROUVE PAR LA MESURE, pas prevu : nos propres assets de svg-library ne
# sont PAS faits que de <path>. soleil-radiant-ggw.svg contient ZERO path --
# 4 <circle> et 12 <line>. Un convertisseur qui ne lit que <path> en sort un
# fichier VIDE, sans erreur : exactement l'echec silencieux qu'on refuse.
#
# Ces conversions sont exactes (la spec SVG definit les primitives en termes
# de chemins equivalents). Les coins arrondis de <rect> suivent la regle
# officielle : rx manquant prend la valeur de ry, et chacun est borne a la
# moitie du cote.

def shape_to_path(tag, attrs):
    """
    'circle'/'ellipse'/'rect'/'line'/'polygon'/'polyline' -> chaine 'd'.

    attrs : dict des attributs XML (valeurs en chaines ou nombres).
    Retourne None si le tag n'est pas une primitive geometrique, ou si la
    forme est degeneree (rayon nul : rien a tracer).
    """
    def num(key, default=0.0):
        v = attrs.get(key, default)
        try:
            return float(v)
        except (TypeError, ValueError):
            raise PathError(f"<{tag}> attribut {key}={v!r} non numerique")

    if tag == "circle":
        r = num("r")
        if r <= 0:
            return None
        cx, cy = num("cx"), num("cy")
        # 2 demi-arcs : un seul arc de 360 deg serait ambigu (meme depart/arrivee)
        return (f"M {cx - r} {cy} A {r} {r} 0 1 0 {cx + r} {cy} "
                f"A {r} {r} 0 1 0 {cx - r} {cy} Z")

    if tag == "ellipse":
        rx, ry = num("rx"), num("ry")
        if rx <= 0 or ry <= 0:
            return None
        cx, cy = num("cx"), num("cy")
        return (f"M {cx - rx} {cy} A {rx} {ry} 0 1 0 {cx + rx} {cy} "
                f"A {rx} {ry} 0 1 0 {cx - rx} {cy} Z")

    if tag == "rect":
        w, h = num("width"), num("height")
        if w <= 0 or h <= 0:
            return None
        x, y = num("x"), num("y")
        has_rx, has_ry = "rx" in attrs, "ry" in attrs
        rx = num("rx") if has_rx else (num("ry") if has_ry else 0.0)
        ry = num("ry") if has_ry else (num("rx") if has_rx else 0.0)
        rx, ry = min(max(rx, 0.0), w / 2), min(max(ry, 0.0), h / 2)
        if rx == 0 or ry == 0:
            return f"M {x} {y} H {x + w} V {y + h} H {x} Z"
        return (f"M {x + rx} {y} H {x + w - rx} A {rx} {ry} 0 0 1 {x + w} {y + ry} "
                f"V {y + h - ry} A {rx} {ry} 0 0 1 {x + w - rx} {y + h} "
                f"H {x + rx} A {rx} {ry} 0 0 1 {x} {y + h - ry} "
                f"V {y + ry} A {rx} {ry} 0 0 1 {x + rx} {y} Z")

    if tag == "line":
        return f"M {num('x1')} {num('y1')} L {num('x2')} {num('y2')}"

    if tag in ("polygon", "polyline"):
        raw = str(attrs.get("points", "")).strip()
        nums = [float(v) for v in re.findall(r"-?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?", raw)]
        if len(nums) < 4:
            return None
        pts = " L ".join(f"{nums[i]} {nums[i+1]}" for i in range(0, len(nums) - 1, 2))
        return f"M {pts}" + (" Z" if tag == "polygon" else "")

    return None
