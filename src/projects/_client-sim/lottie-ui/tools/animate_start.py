#!/usr/bin/env python3
"""
Anime le SVG structure produit par Fable -> Lottie.

Workflow respecte :
  1. Le modele dessine le STATIQUE (start_button.svg, groupes nommes, zero animation)
  2. NOUS animons, en code, depuis les groupes nommes.

Le SVG source n'est jamais modifie : on lit ses <path> et on les porte dans
des calques Lottie separes, un par groupe. Si le client fournit son Figma,
on remplace le SVG et on relance -- l'animation ne bouge pas.

Sortie : start_button_v2.json
"""

import json
import re
import sys

SRC = "start_button.svg"
OUT = "start_button_v2.json"

W, H = 360, 72
FPS = 30
DUR = 24                       # 0,8 s -- entree rapide, UI reactive

CORAIL = [0.941, 0.384, 0.329]     # #F06254
CHEVRON = [1.0, 0.702, 0.659]      # #FFB3A8
BLANC = [1.0, 1.0, 1.0]


# --- Helpers Lottie ----------------------------------------------------------

def val(v):
    return {"a": 0, "k": v}


def anim(frames, easing=(0.33, 0.67)):
    out, (ox, ix) = [], easing
    for i, (t, s) in enumerate(frames):
        k = {"t": t, "s": s}
        if i < len(frames) - 1:
            k["h"] = 0
            k["o"] = {"x": [ox], "y": [0]}
            k["i"] = {"x": [ix], "y": [1]}
        out.append(k)
    return {"a": 1, "k": out}


def tr(pos=None, scale=None, opacity=None, anchor=None):
    return {"ty": "tr", "a": anchor or val([0, 0]), "p": pos or val([0, 0]),
            "s": scale or val([100, 100]), "r": val(0),
            "o": opacity or val(100)}


def layer(ind, name, shapes, ks=None):
    return {"ddd": 0, "ty": 4, "ind": ind, "nm": name, "st": 0,
            "ip": 0, "op": DUR, "ks": ks or tr(), "shapes": shapes}


# --- Lecture du SVG : on extrait les <path d="..."> par id -------------------

def read_paths(svg_text):
    """
    {id: (d, dx, dy)} pour chaque <path>.

    Les attributs arrivent dans un ordre quelconque, et Fable place le
    positionnement dans un transform="translate(x,y)" plutot que dans les
    coordonnees. On lit les deux : Lottie n'a pas d'equivalent de transform
    sur une forme, donc on APLATIT la translation dans les points.
    """
    paths = {}
    for tag in re.finditer(r"<path\b[^>]*/?>", svg_text):
        s = tag.group(0)
        pid = re.search(r'id="([^"]+)"', s)
        d = re.search(r'\sd="([^"]+)"', s)
        if not (pid and d):
            continue
        tx = re.search(r'transform="translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)"', s)
        dx, dy = (float(tx.group(1)), float(tx.group(2))) if tx else (0.0, 0.0)
        paths[pid.group(1)] = (d.group(1), dx, dy)
    return paths


def path_to_lottie(entry):
    """
    Convertit un 'd' SVG en shape Lottie.

    Limite assumee : ne gere que M / L / H / V / Z -- des segments DROITS.
    C'est suffisant ici (lettrage LCD orthogonal + hexagone + triangle) et
    ca garde le fichier leger, ce que le brief exige explicitement
    (« limited layers and keyframes », processeur embarque).
    Une forme a courbes ferait echouer ce parseur de facon visible,
    pas silencieuse -- c'est voulu.
    """
    d, dx, dy = entry
    tokens = re.findall(r'([MLHVZmlhvz])|(-?\d+\.?\d*)', d)
    subpaths, pts, cmd, nums, closed = [], [], None, [], False
    cur = [0.0, 0.0]

    def flush():
        nonlocal nums, cur
        if not cmd or not nums:
            nums = []
            return
        c = cmd.upper()
        rel = cmd.islower()
        if c == "M" or c == "L":
            for i in range(0, len(nums) - 1, 2):
                x, y = nums[i], nums[i + 1]
                cur = [cur[0] + x, cur[1] + y] if rel else [x, y]
                pts.append(list(cur))
        elif c == "H":
            for x in nums:
                cur = [cur[0] + x, cur[1]] if rel else [x, cur[1]]
                pts.append(list(cur))
        elif c == "V":
            for y in nums:
                cur = [cur[0], cur[1] + y] if rel else [cur[0], y]
                pts.append(list(cur))
        nums = []

    for letter, num in tokens:
        if letter:
            flush()
            if letter.upper() == "Z":
                # fin d'un sous-chemin : on le ferme et on en ouvre un neuf
                if pts:
                    subpaths.append((pts, True))
                pts, closed, cmd = [], False, None
            else:
                if letter.upper() == "M" and pts:
                    subpaths.append((pts, False))
                    pts = []
                cmd = letter
        else:
            nums.append(float(num))
    flush()
    if pts:
        subpaths.append((pts, closed))

    if not subpaths:
        raise ValueError(f"path non convertible (courbes ?) : {d[:40]}")

    out = []
    for sp, is_closed in subpaths:
        if len(sp) < 2:
            continue
        moved = [[x + dx, y + dy] for x, y in sp]
        out.append({"ty": "sh", "nm": "path", "ks": val({
            "c": is_closed, "v": moved,
            "i": [[0, 0]] * len(moved), "o": [[0, 0]] * len(moved)})})
    return out


# --- Assemblage ---------------------------------------------------------------

def build(svg_text):
    paths = read_paths(svg_text)
    layers = []

    # --- Calque 3 (avant-plan) : le chevron ---------------------------------
    # Pulse discret 100 -> 104 -> 100, ancre sur le centre indique par le SVG.
    m = re.search(r"Centre icone\s*:\s*\((\d+),\s*(\d+)\)", svg_text)
    cx, cy = (float(m.group(1)), float(m.group(2))) if m else (318.0, 36.0)

    icon_shapes = []
    for pid in ("hex_outline", "triangle"):
        icon_shapes.extend(path_to_lottie(paths[pid]))
        icon_shapes.append({"ty": "st", "nm": f"stroke-{pid}", "o": val(100),
                            "w": val(4), "c": val(CHEVRON), "lc": 2, "lj": 2})
    icon_shapes.append(tr(anchor=val([cx, cy]), pos=val([cx, cy]),
                          scale=anim([(0, [100, 100]), (DUR // 2, [104, 104]),
                                      (DUR, [100, 100])])))
    layers.append(layer(0, "play-chevron",
                        [{"ty": "gr", "nm": "icon", "it": icon_shapes}]))

    # --- Calque 2 : les lettres, en cascade ---------------------------------
    # Chaque lettre est un calque-forme distinct : le developpeur peut en
    # retirer une ou changer le mot sans toucher au reste.
    letters = ("letter_s_1", "letter_t_1", "letter_a", "letter_r", "letter_t_2")
    letter_groups = []
    for i, lid in enumerate(letters):
        start = 4 + i * 2                       # cascade : 2 frames d'ecart
        letter_groups.append({"ty": "gr", "nm": lid, "it": [
            *path_to_lottie(paths[lid]),
            {"ty": "fl", "nm": "fill", "r": 2, "o": val(100), "c": val(BLANC)},
            tr(opacity=anim([(0, [0]), (start, [0]), (start + 8, [100])])),
        ]})
    layers.append(layer(1, "label-start", letter_groups))

    # --- Calque 1 (arriere-plan) : le bandeau qui se remplit ----------------
    # Le degrade est FIXE (comme la maquette). C'est son point d'arrivee qui
    # recule : la couleur envahit le bandeau sans qu'aucune forme ne bouge.
    layers.append(layer(2, "bg-sweep", [{
        "ty": "gr", "nm": "band", "it": [
            {"ty": "rc", "nm": "rect", "p": val([W / 2, H / 2]),
             "s": val([W, H]), "r": val(6)},
            {"ty": "gf", "nm": "gradient", "o": val(100), "r": 1, "t": 1,
             "s": val([0, H / 2]),
             "e": anim([(0, [W * 2.4, H / 2]), (DUR, [W, H / 2])]),
             "g": {"p": 2, "k": val([0, 0, 0, 0, 1] + CORAIL)}},
            tr(),
        ]}]))

    return {"nm": "lcd-start-button", "v": "5.5.2", "fr": FPS, "ip": 0,
            "op": DUR, "w": W, "h": H, "layers": layers}


if __name__ == "__main__":
    with open(SRC) as f:
        doc = build(f.read())
    with open(OUT, "w") as f:
        json.dump(doc, f, separators=(",", ":"))
    import os
    print(f"{OUT}  {os.path.getsize(OUT)} octets | "
          f"{len(doc['layers'])} calques | {DUR} frames @ {FPS}fps")
