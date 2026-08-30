# -*- coding: utf-8 -*-
"""Convertit une chaine en un unique path SVG rempli (aucune balise <text>)."""
from fontTools.ttLib import TTCollection
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

_TTC = "/System/Library/Fonts/Avenir Next.ttc"
_CACHE = {}

def _face(idx):
    if idx not in _CACHE:
        _CACHE[idx] = TTCollection(_TTC).fonts[idx]
    return _CACHE[idx]

# index utiles : 7 Regular, 5 Medium, 2 DemiBold, 0 Bold
def texte_path(s, taille, x=0, y=0, face=5, suivi=0.0):
    """Retourne (d, largeur_totale). y = ligne de base. suivi en unites de 'taille'."""
    f = _face(face)
    upem = f["head"].unitsPerEm
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()
    hmtx = f["hmtx"]
    k = taille / upem
    d = []
    cur = 0.0
    for ch in s:
        gname = cmap.get(ord(ch))
        if gname is None:
            cur += taille * 0.35 + suivi
            continue
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}")
        # y inverse : la police monte en +y, le SVG en -y
        tp = TransformPen(pen, Transform(k, 0, 0, -k, x + cur, y))
        gs[gname].draw(tp)
        seg = pen.getCommands()
        if seg:
            d.append(seg)
        cur += hmtx[gname][0] * k + suivi
    return " ".join(d), cur - (suivi if s else 0)
