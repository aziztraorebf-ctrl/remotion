#!/usr/bin/env python3
"""
Preuve de concept : generer un Lottie JSON depuis un SVG structure, par code.

Principe teste : nos SVG sont deja decoupes en <g id> nommes, avec des primitives
simples (circle, line). Un script peut lire cette structure et ecrire directement
le JSON Lottie -- sans editeur, sans After Effects, sans conversion manuelle.

Cas : soleil-radiant-ggw.svg
  - groupe "rayons"  -> rotation continue (ce que le SVG documente lui-meme)
  - halos exterieurs -> pulse d'opacite
Le fichier SVG dit explicitement : "rotate sur le groupe rayons", "opacity du glow
(pulse sin)". On automatise exactement l'intention deja ecrite dans l'asset.

Usage : python3 svg2lottie.py <fichier.svg> <sortie.json>
"""

import json
import sys

# Un SVG peut venir d'un client : le parseur stdlib est vulnerable aux attaques
# XXE et "billion laughs". defusedxml si dispo, sinon on desamorce a la main.
try:
    from defusedxml import ElementTree as ET
except ImportError:
    import xml.etree.ElementTree as _ET

    class _SafeParser(_ET.XMLParser):
        """Refuse toute declaration d'entite (XXE + billion laughs)."""

        def __init__(self, *a, **k):
            super().__init__(*a, **k)
            expat = getattr(self, "parser", getattr(self, "_parser", None))
            if expat is not None:
                def _reject(*args, **kwargs):
                    raise ValueError("entites XML refusees (SVG non fiable)")
                expat.EntityDeclHandler = _reject
                expat.ExternalEntityRefHandler = lambda *args: False

    class ET:
        @staticmethod
        def parse(path):
            return _ET.parse(path, parser=_SafeParser())

SVG_NS = "{http://www.w3.org/2000/svg}"
FPS = 60
DURATION_FRAMES = 120


# --- Helpers Lottie -----------------------------------------------------------

def static(value):
    """Propriete non animee : {a:0, k:value}"""
    return {"a": 0, "k": value}


def animated(keyframes):
    """
    Propriete animee : {a:1, k:[{t, s, i, o}, ...]}
    Le DERNIER keyframe ne porte ni i ni o (il ne demarre aucune transition).
    """
    out = []
    for i, (t, s) in enumerate(keyframes):
        kf = {"t": t, "s": s if isinstance(s, list) else [s]}
        if i < len(keyframes) - 1:
            kf["h"] = 0
            kf["o"] = {"x": [0.33], "y": [0]}
            kf["i"] = {"x": [0.67], "y": [1]}
        out.append(kf)
    return {"a": 1, "k": out}


def hex_to_rgb(h):
    """#e8b44a -> [0.91, 0.71, 0.29] (Lottie veut du 0-1)"""
    h = h.lstrip("#")
    return [round(int(h[i:i + 2], 16) / 255, 3) for i in (0, 2, 4)]


def transform(anchor=None, position=None, scale=None, rotation=None, opacity=None):
    """Objet transform ('tr') d'un groupe de formes."""
    return {
        "ty": "tr",
        "a": anchor or static([0, 0]),
        "p": position or static([0, 0]),
        "s": scale or static([100, 100]),
        "r": rotation if rotation is not None else static(0),
        "o": opacity or static(100),
    }


# --- Conversion des primitives SVG -------------------------------------------

def circle_to_shapes(el, cx_off, cy_off):
    """<circle> -> groupe Lottie [ellipse, fill/stroke, transform]"""
    cx = float(el.get("cx", 0)) + cx_off
    cy = float(el.get("cy", 0)) + cy_off
    r = float(el.get("r", 0))

    items = [{"ty": "el", "nm": "ellipse",
              "p": static([cx, cy]), "s": static([r * 2, r * 2])}]

    fill = el.get("fill", "none")
    if fill and fill != "none":
        fill_op = float(el.get("fill-opacity", 1)) * 100
        items.append({"ty": "fl", "nm": "fill", "r": 1,
                      "o": static(fill_op), "c": static(hex_to_rgb(fill))})

    stroke = el.get("stroke")
    if stroke and stroke != "none":
        items.append({"ty": "st", "nm": "stroke",
                      "o": static(float(el.get("opacity", 1)) * 100),
                      "w": static(float(el.get("stroke-width", 1))),
                      "c": static(hex_to_rgb(stroke)), "lc": 2, "lj": 2})

    items.append(transform())
    return {"ty": "gr", "nm": "circle", "it": items}


def line_to_shapes(el, cx_off, cy_off, inherited):
    """<line> -> groupe Lottie [path 2 points, stroke, transform]"""
    x1 = float(el.get("x1", 0)) + cx_off
    y1 = float(el.get("y1", 0)) + cy_off
    x2 = float(el.get("x2", 0)) + cx_off
    y2 = float(el.get("y2", 0)) + cy_off

    stroke = el.get("stroke") or inherited.get("stroke", "#000000")
    width = float(el.get("stroke-width") or inherited.get("stroke-width", 1))

    path = {"ty": "sh", "nm": "line", "ks": static({
        "c": False,                       # non ferme
        "v": [[x1, y1], [x2, y2]],        # sommets
        "i": [[0, 0], [0, 0]],            # tangentes entrantes
        "o": [[0, 0], [0, 0]],            # tangentes sortantes
    })}

    return {"ty": "gr", "nm": "line", "it": [
        path,
        {"ty": "st", "nm": "stroke", "o": static(100), "w": static(width),
         "c": static(hex_to_rgb(stroke)), "lc": 2, "lj": 2},
        transform(),
    ]}


# --- Lecture du SVG -----------------------------------------------------------

def parse_viewbox(root):
    """viewBox='-180 -180 360 360' -> (offset_x, offset_y, w, h)

    Lottie n'a pas de coordonnees negatives : on decale tout pour que
    l'origine du viewBox tombe en (0,0).
    """
    vb = root.get("viewBox", "0 0 512 512").split()
    min_x, min_y, w, h = (float(v) for v in vb)
    return -min_x, -min_y, w, h


def group_children(g, cx_off, cy_off):
    """Convertit les enfants directs d'un <g> en formes Lottie."""
    inherited = {k: g.get(k) for k in ("stroke", "stroke-width") if g.get(k)}
    shapes = []
    for el in g:
        tag = el.tag.replace(SVG_NS, "")
        if tag == "circle":
            shapes.append(circle_to_shapes(el, cx_off, cy_off))
        elif tag == "line":
            shapes.append(line_to_shapes(el, cx_off, cy_off, inherited))
        elif tag == "g":
            shapes.extend(group_children(el, cx_off, cy_off))
    return shapes


def find_group(root, group_id):
    for g in root.iter(SVG_NS + "g"):
        if g.get("id") == group_id:
            return g
    return None


# --- Assemblage ---------------------------------------------------------------

def build(svg_path):
    tree = ET.parse(svg_path)
    root = tree.getroot()
    cx_off, cy_off, w, h = parse_viewbox(root)

    layers = []

    # --- Couche 1 : les rayons, en rotation continue -------------------------
    # Le SVG documente lui-meme : "ce groupe tourne avec rotate(frame*0.1)"
    rayons = find_group(root, "rayons")
    if rayons is not None:
        # ATTENTION (bug paye au test) : un 'tr' Lottie n'agit que sur les
        # formes du MEME groupe 'it'. Poser le transform a cote des rayons ne
        # les fait pas tourner -- il faut les ENVELOPPER dedans.
        shapes = [{
            "ty": "gr", "nm": "rayons-rotation",
            "it": group_children(rayons, cx_off, cy_off) + [
                transform(
                    anchor=static([cx_off, cy_off]),
                    position=static([cx_off, cy_off]),
                    rotation=animated([(0, [0]), (DURATION_FRAMES, [360])]),
                )
            ],
        }]
        layers.append({
            "ddd": 0, "ty": 4, "ind": len(layers), "nm": "rayons",
            "st": 0, "ip": 0, "op": DURATION_FRAMES,
            "ks": transform(), "shapes": shapes,
        })

    # --- Couche 2 : le corps + halos, avec pulse d'opacite -------------------
    soleil = find_group(root, "soleil-jaune")
    if soleil is not None:
        circles = [el for el in soleil if el.tag.replace(SVG_NS, "") == "circle"]
        shapes = [circle_to_shapes(c, cx_off, cy_off) for c in circles]
        half = DURATION_FRAMES // 2
        layers.append({
            "ddd": 0, "ty": 4, "ind": len(layers), "nm": "corps-halos",
            "st": 0, "ip": 0, "op": DURATION_FRAMES,
            # pulse : 100 -> 72 -> 100 sur la duree
            "ks": transform(opacity=animated([(0, [100]), (half, [72]),
                                              (DURATION_FRAMES, [100])])),
            "shapes": shapes,
        })

    return {
        "nm": "soleil-radiant-ggw",
        "v": "5.5.2",
        "fr": FPS,
        "ip": 0,
        "op": DURATION_FRAMES,
        "w": int(w),
        "h": int(h),
        "layers": layers,
    }


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    result = build(sys.argv[1])
    with open(sys.argv[2], "w") as f:
        json.dump(result, f, separators=(",", ":"))
    n_shapes = sum(len(l["shapes"]) for l in result["layers"])
    print(f"OK  {len(result['layers'])} couches, {n_shapes} formes "
          f"-> {sys.argv[2]}")
