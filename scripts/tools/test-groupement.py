#!/usr/bin/env python3
"""
test-groupement.py -- Mesure de COMPOSITION sur une frame 1920x1080 (loi de proximite).

PRINCIPE (Gestalt, formule en regle chiffree)
  L'ecart ENTRE deux groupes doit valoir au moins 2x l'ecart A L'INTERIEUR d'un groupe.
    ratio >= 2.0  -> l'espace porte le groupement, l'oeil voit des groupes
    ratio <  2.0  -> le groupement ne se lit pas ; si un groupement est quand meme
                     percu, c'est autre chose qui le porte (bordure, fond, carte),
                     ce qui est un defaut de composition.

AVANTAGE STRUCTUREL EXPLOITE
  Les regles de design interdisent d'habitude de mesurer en pixels sur une capture,
  parce que l'echelle du screenshot est inconnue. Ici l'echelle est CONNUE et FIXE
  (1920x1080, master de rendu Remotion). Les pixels sont donc des pixels ABSOLUS et
  les seuils en px (grille 8, safe zone 100/60) sont legitimes.

REGLE COMPLEMENTAIRE : RYTHME D'ESPACEMENT
  Tous les ecarts sont divises par le plus petit ecart repete, et on regarde si les
  quotients tombent sur une grille reguliere (multiples de 4 ou 8 px). Une composition
  dont les espacements ne suivent aucune grille se lit comme approximative.

AVERTISSEMENT (issu de notre experience documentee)
  Les detecteurs automatiques deraillent des que le decor s'allume. Sur une image
  chargee (photo, carte, feuillage) la segmentation produit du bruit massif. Ce script
  produit donc TOUJOURS une IMAGE ANNOTEE destinee a une lecture HUMAINE, et il
  s'auto-declare NON FIABLE quand la frame est trop chargee (voir --json > reliability).
  Un chiffre non verifiable a l'oeil ne vaut rien.

LIMITES CONNUES ET MESUREES (ne pas les decouvrir a l'usage)
  1. RESOLUTION PLANCHER ~20 px. Deux lignes separees de moins de ~2*DILATE_Y sont
     fusionnees en un seul bloc AVANT toute mesure : leur ecart devient invisible.
     Verifie sur mire (ecart reel 20 px -> les 2 lignes ressortent en une seule boite).
  2. Ne s'applique qu'aux compositions EMPILEES EN RANGEES. Un schema radial, un
     nuage de pastilles ou une repetition uniforme (tableau) ne relevent pas de la
     loi de proximite verticale -- le script les detecte et refuse de conclure.
  3. Ne voit que ce qui a des BORDS FRANCS. Un panneau translucide/floute pose sur
     une photo (carte UI en verre depoli) n'est PAS detecte.
  4. Mesure l'ESPACE, pas le sens. Il ne sait pas si un groupement est le BON.

USAGE
  python3 scripts/tools/test-groupement.py FRAME.png
  python3 scripts/tools/test-groupement.py VIDEO.mp4 --at 0.8
  python3 scripts/tools/test-groupement.py VIDEO.mp4 --at 0.5 --crop 1920:1080:270:0
  python3 scripts/tools/test-groupement.py FRAME.png --json
  python3 scripts/tools/test-groupement.py FRAME.png --outdir /tmp/annot --debug-mask
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile

try:
    import numpy as np
except ImportError:
    sys.exit("ERREUR: numpy requis (pip3 install numpy)")

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("ERREUR: Pillow requis (pip3 install Pillow)")

try:
    from scipy import ndimage
except ImportError:
    sys.exit("ERREUR: scipy requis (pip3 install scipy)")


# --------------------------------------------------------------------------
# Constantes -- valables parce que l'echelle est CONNUE (master 1920x1080)
# --------------------------------------------------------------------------
MASTER_W, MASTER_H = 1920, 1080
SAFE_MARGIN_X = 100          # marge laterale doctrine
SAFE_MARGIN_Y = 60           # marge haut/bas doctrine
GRID_CANDIDATES = (8, 4)     # grilles testees, dans l'ordre de preference
GRID_TOLERANCE = 0.15        # 15 % d'ecart tolere pour dire "sur la grille"
RATIO_TARGET = 2.0           # seuil de la loi de proximite

# Detection
LOCAL_WIN = 41               # fenetre du filtre local (px) -- passe-haut
CONTRAST_MIN = 18            # ecart local minimal pour retenir un pixel (0-255)
MIN_BOX_AREA = 260           # px^2 -- sous ca c'est du grain
MIN_BOX_W = 12
MIN_BOX_H = 10
DILATE_X = 26                # collage horizontal : mots -> ligne
DILATE_Y = 7                 # collage vertical : accents/jambages -> ligne
MAX_BOXES = 60               # au dela, la frame est du bruit, pas une composition

# Correction du HALO de detection.
# Le passe-haut (fenetre LOCAL_WIN) reagit un peu AVANT et APRES l'encre, et la
# dilatation verticale ajoute encore DILATE_Y//2 de chaque cote. Resultat mesure
# sur mire synthetique : une ligne de 52 px nominal ressort en boite de 70 px,
# soit ~9 px de bavure par cote, et donc CHAQUE ecart raccourci d'environ 18 px.
# Non corrige, ce biais additif fausse les RATIOS (une mire a 2.00 sortait a 2.82).
# On retire donc la bavure des bords de boite. Verifie : apres correction la mire
# a 2.00 sort a 2.00 et celle a 1.50 sort a 1.50.
BLEED_Y = 9

# Rejet des blobs "photographiques"
# On ne juge PAS sur la teinte : un titre bicolore (blanc + or) a une forte variance
# de teinte et resterait un titre. Le discriminant retenu est la NETTETE DE BORD.
#
# Mesure sur nos 11 plans + la reference (voir --json > boxes[].sharpness) :
#   texte / carte UI reels ...... 0.22 a 0.36
#   feuillage, gazon, terrain ... 0.000 a 0.021  (litteralement zero le plus souvent)
# La separation est quasi binaire : aucun blob photo de notre corpus ne depasse 0.03,
# aucun element graphique reel ne descend sous 0.22. Le seuil est pose au milieu du
# vide mesure, pas choisi a vue.
EDGE_SHARPNESS_MIN = 0.12
PHOTO_FILL_MIN = 0.045       # garde-fou secondaire : boite quasi vide = artefact


# --------------------------------------------------------------------------
# Entree : frame ou video
# --------------------------------------------------------------------------
def which(prog: str) -> bool:
    return subprocess.run(["which", prog], capture_output=True).returncode == 0


def extract_frame(video: str, at: float, crop: str | None, workdir: str) -> str:
    """Extrait une frame d'une video a la position relative `at` (0..1)."""
    if not which("ffmpeg") or not which("ffprobe"):
        sys.exit("ERREUR: ffmpeg/ffprobe introuvables dans le PATH.")

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nk=1:nw=1", video],
        capture_output=True, text=True,
    )
    if probe.returncode != 0 or not probe.stdout.strip():
        sys.exit(f"ERREUR: ffprobe n'a pas pu lire '{video}'.")
    try:
        duration = float(probe.stdout.strip())
    except ValueError:
        sys.exit(f"ERREUR: duree illisible pour '{video}'.")

    ts = max(0.0, min(duration - 0.05, duration * at))
    out = os.path.join(workdir, "frame.png")
    vf = f"crop={crop}" if crop else None
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{ts:.3f}", "-i", video]
    if vf:
        cmd += ["-vf", vf]
    cmd += ["-vframes", "1", out]
    if subprocess.run(cmd, capture_output=True).returncode != 0 or not os.path.exists(out):
        sys.exit(f"ERREUR: extraction de frame echouee a t={ts:.2f}s sur '{video}'.")
    return out


# --------------------------------------------------------------------------
# Detection des elements graphiques
# --------------------------------------------------------------------------
def box_filter(a: np.ndarray, win: int) -> np.ndarray:
    """Moyenne locale rapide (filtre separable, O(n))."""
    return ndimage.uniform_filter(a, size=win, mode="nearest")


def graphic_mask(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, float]:
    """
    Isole la couche GRAPHIQUE (texte, cartes UI, formes nettes) de la couche
    PHOTOGRAPHIQUE (feuillage, gazon, texture) et des degrades lisses.

    Mecanique : passe-haut local. On compare chaque pixel a la moyenne de son
    voisinage large. Un degrade lisse (fond Remotion) a un ecart local ~0 et
    disparait. Un texte a un ecart local fort. Une texture photo a aussi un ecart
    fort -- c'est le filtrage par NETTETE DE BORD (plus bas) qui l'ecarte, pas ce
    masque.

    Retourne (masque booleen, luminance, taux de couverture).
    """
    lum = rgb.astype(np.float32) @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    local = box_filter(lum, LOCAL_WIN)
    resid = np.abs(lum - local)
    mask = resid > CONTRAST_MIN
    return mask, lum, float(mask.mean())


def edge_sharpness(lum_patch: np.ndarray) -> float:
    """
    Part des pixels de bord qui sont des bords FRANCS.

    Un glyphe ou une bordure de carte UI passe du fond a l'encre en 1-2 px : le
    gradient y est concentre sur peu de pixels, tres fort. Un feuillage a des
    gradients moyens etales partout. On mesure donc, parmi les pixels ou il se
    passe quelque chose, la proportion de vrais francs.
    """
    if lum_patch.size < 40:
        return 0.0
    gx = np.abs(np.diff(lum_patch, axis=1))
    gy = np.abs(np.diff(lum_patch, axis=0))
    g = np.concatenate([gx.ravel(), gy.ravel()])
    active = g[g > 8]
    if active.size < 20:
        return 0.0
    return float((active > 55).mean())


def transition_density(mask_patch: np.ndarray) -> float:
    """
    Densite de changements d'etat le long des lignes du masque.
    Conserve a titre DIAGNOSTIQUE dans le JSON : mesure sur le corpus, il ne
    separe rien (tout est < 0.17), donc il n'entre PAS dans la decision de rejet.
    """
    if mask_patch.size < 40 or mask_patch.shape[1] < 3:
        return 1.0
    changes = np.diff(mask_patch.astype(np.int8), axis=1) != 0
    return float(changes.sum() / max(1, mask_patch.shape[0] * (mask_patch.shape[1] - 1)))


def detect_boxes(rgb: np.ndarray) -> tuple[list[dict], np.ndarray, float]:
    """
    Detecte les elements graphiques et retourne (boites, masque_dilate, couverture).
    """
    mask, lum, coverage = graphic_mask(rgb)

    # Collage horizontal fort / vertical faible : un mot devient une boite,
    # une ligne de texte devient une boite, deux lignes restent separees.
    struct_x = np.ones((1, DILATE_X), dtype=bool)
    struct_y = np.ones((DILATE_Y, 1), dtype=bool)
    glued = ndimage.binary_dilation(mask, structure=struct_x)
    glued = ndimage.binary_dilation(glued, structure=struct_y)
    glued = ndimage.binary_closing(glued, structure=np.ones((3, 3), dtype=bool))

    labels, n = ndimage.label(glued)
    if n == 0:
        return [], glued, coverage

    boxes: list[dict] = []
    slices = ndimage.find_objects(labels)
    for sl in slices:
        if sl is None:
            continue
        ys, xs = sl
        y0, y1 = int(ys.start), int(ys.stop)
        x0, x1 = int(xs.start), int(xs.stop)
        w, h = x1 - x0, y1 - y0
        if w < MIN_BOX_W or h < MIN_BOX_H or w * h < MIN_BOX_AREA:
            continue
        # une boite qui couvre presque toute l'image = le fond, pas un element
        if w * h > 0.62 * rgb.shape[0] * rgb.shape[1]:
            continue

        sub_mask = mask[y0:y1, x0:x1]
        fill = float(sub_mask.mean())
        sharp = edge_sharpness(lum[y0:y1, x0:x1])
        trans = transition_density(sub_mask)

        # Retrait de la bavure verticale du detecteur (cf. BLEED_Y). On ne corrige
        # que si la boite reste plus haute que la bavure, sinon on la laisse telle
        # quelle plutot que de produire une geometrie absurde.
        if h > 2 * BLEED_Y + 6:
            y0 += BLEED_Y
            y1 -= BLEED_Y
            h = y1 - y0

        photo_like = (sharp < EDGE_SHARPNESS_MIN) or (fill < PHOTO_FILL_MIN)
        boxes.append({
            "x0": x0, "y0": y0, "x1": x1, "y1": y1,
            "w": w, "h": h, "area": w * h,
            "fill": round(fill, 3),
            "sharpness": round(sharp, 3),
            "transitions": round(trans, 3),
            "kind": "photo?" if photo_like else "graphic",
        })

    boxes.sort(key=lambda b: (b["y0"], b["x0"]))
    return boxes, glued, coverage


# --------------------------------------------------------------------------
# Mesure : rangees, groupes, ratio, grille
# --------------------------------------------------------------------------
def build_rows(boxes: list[dict]) -> list[dict]:
    """
    Fusionne en RANGEES les elements qui partagent une bande horizontale.

    Indispensable : 3 cartes KPI cote a cote ont un ecart VERTICAL de 0. Les
    compter comme des voisins verticaux produit un "intra = 0" et un ratio
    arithmetiquement infini -- un chiffre faux qui a l'air bon. Une rangee est
    l'unite reelle que l'oeil empile verticalement.
    """
    if not boxes:
        return []
    ordered = sorted(boxes, key=lambda b: b["y0"])
    rows: list[dict] = []
    for b in ordered:
        placed = False
        for r in rows:
            # recouvrement vertical > 50 % de la plus petite hauteur -> meme rangee
            ov = min(r["y1"], b["y1"]) - max(r["y0"], b["y0"])
            if ov > 0.5 * min(r["y1"] - r["y0"], b["h"]):
                r["y0"] = min(r["y0"], b["y0"])
                r["y1"] = max(r["y1"], b["y1"])
                r["x0"] = min(r["x0"], b["x0"])
                r["x1"] = max(r["x1"], b["x1"])
                r["members"].append(b)
                placed = True
                break
        if not placed:
            rows.append({"x0": b["x0"], "y0": b["y0"], "x1": b["x1"], "y1": b["y1"],
                         "members": [b]})
    rows.sort(key=lambda r: r["y0"])
    return rows


def cluster_1d(items: list[dict], axis: str) -> tuple[list[list[dict]], list[float], list[float]]:
    """
    Regroupe les elements le long d'un axe par la methode du plus grand saut.

    Le seuil de coupure est place au point ou l'ecart trie fait son bond le plus
    marque -- c'est exactement ce que fait l'oeil : il coupe la ou l'espace
    change de regime.
    Retourne (groupes, ecarts_intra, ecarts_inter).
    """
    if len(items) < 2:
        return ([items] if items else []), [], []

    key_lo, key_hi = ("y0", "y1") if axis == "v" else ("x0", "x1")

    ordered = sorted(items, key=lambda b: b[key_lo])
    gaps = [max(0, b[key_lo] - a[key_hi]) for a, b in zip(ordered, ordered[1:])]
    if not gaps:
        return [ordered], [], []

    uniq = sorted(set(gaps))
    if len(uniq) == 1:
        # tous les ecarts identiques : un seul groupe, pas de hierarchie
        return [ordered], list(gaps), []

    # coupure qui maximise le RAPPORT entre le plus petit ecart "au-dessus"
    # et le plus grand ecart "en-dessous"
    best_cut, best_ratio = None, 0.0
    for i in range(len(uniq) - 1):
        below, above = uniq[i], uniq[i + 1]
        r = above / max(1.0, below)
        if r > best_ratio:
            best_ratio, best_cut = r, (below + above) / 2.0

    if best_cut is None:
        return [ordered], list(gaps), []

    groups: list[list[dict]] = [[ordered[0]]]
    intra, inter = [], []
    for g, nxt in zip(gaps, ordered[1:]):
        if g > best_cut:
            inter.append(g)
            groups.append([nxt])
        else:
            intra.append(g)
            groups[-1].append(nxt)
    return groups, intra, inter


def grid_analysis(gaps: list[float]) -> dict:
    """
    Rythme d'espacement : les ecarts tombent-ils sur une grille reguliere ?
    On divise chaque ecart par le plus petit ecart REPETE (le pas de base observe),
    puis on teste l'alignement sur une grille de 8 px, puis 4 px.
    """
    vals = [g for g in gaps if g > 0]
    if len(vals) < 2:
        return {"testable": False, "reason": "moins de 2 ecarts non nuls"}

    # plus petit ecart repete : arrondi a 4 px pour trouver la valeur modale basse
    buckets: dict[int, int] = {}
    for v in vals:
        k = int(round(v / 4.0)) * 4
        buckets[k] = buckets.get(k, 0) + 1
    repeated = sorted([b for b, c in buckets.items() if c >= 2 and b > 0])
    base = repeated[0] if repeated else min(vals)

    result = {"testable": True, "base_px": round(base, 1),
              "gaps_px": [round(v, 1) for v in vals]}

    best = None
    for grid in GRID_CANDIDATES:
        offs = [abs(v / grid - round(v / grid)) for v in vals]
        on_grid = sum(1 for o in offs if o <= GRID_TOLERANCE)
        score = on_grid / len(vals)
        if best is None or score > best["score"]:
            best = {"grid_px": grid, "score": round(score, 2),
                    "on_grid": on_grid, "total": len(vals)}
    result.update(best)
    result["quotients"] = [round(v / base, 2) for v in vals]
    result["verdict"] = "SUR GRILLE" if best["score"] >= 0.75 else "HORS GRILLE"
    return result


def collisions(boxes: list[dict]) -> list[tuple[int, int]]:
    out = []
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            a, b = boxes[i], boxes[j]
            if a["x0"] < b["x1"] and b["x0"] < a["x1"] and a["y0"] < b["y1"] and b["y0"] < a["y1"]:
                out.append((i, j))
    return out


def safe_zone_violations(boxes: list[dict], w: int, h: int) -> list[dict]:
    out = []
    for i, b in enumerate(boxes):
        sides = []
        if b["x0"] < SAFE_MARGIN_X:
            sides.append(f"gauche({b['x0']}px < {SAFE_MARGIN_X})")
        if b["x1"] > w - SAFE_MARGIN_X:
            sides.append(f"droite({w - b['x1']}px < {SAFE_MARGIN_X})")
        if b["y0"] < SAFE_MARGIN_Y:
            sides.append(f"haut({b['y0']}px < {SAFE_MARGIN_Y})")
        if b["y1"] > h - SAFE_MARGIN_Y:
            sides.append(f"bas({h - b['y1']}px < {SAFE_MARGIN_Y})")
        if sides:
            out.append({"index": i, "sides": sides})
    return out


# --------------------------------------------------------------------------
# Sortie visuelle -- la piece maitresse : ca se VERIFIE A L'OEIL
# --------------------------------------------------------------------------
def load_font(size: int):
    for path in (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ):
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def annotate(img: Image.Image, boxes: list[dict], rows: list[dict],
             groups: list[list[dict]], report: dict, out_path: str) -> None:
    """Trace boites, rangees, ecarts mesures, grille de reperes et safe zones."""
    canvas = img.convert("RGB").copy()
    # voile pour que les traces ressortent sur photo
    canvas = Image.blend(canvas, Image.new("RGB", canvas.size, (0, 0, 0)), 0.35)
    d = ImageDraw.Draw(canvas, "RGBA")
    W, H = canvas.size
    f_s = load_font(15)
    f_m = load_font(19)
    f_l = load_font(26)

    # --- grille de reperes tous les 120 px, marquee tous les 240 px
    for x in range(0, W, 120):
        strong = x % 240 == 0
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 42 if strong else 18), width=1)
        if strong:
            d.text((x + 4, 4), str(x), font=f_s, fill=(255, 255, 255, 130))
    for y in range(0, H, 120):
        strong = y % 240 == 0
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 42 if strong else 18), width=1)
        if strong:
            d.text((4, y + 4), str(y), font=f_s, fill=(255, 255, 255, 130))

    # --- safe zones
    d.rectangle([SAFE_MARGIN_X, SAFE_MARGIN_Y, W - SAFE_MARGIN_X, H - SAFE_MARGIN_Y],
                outline=(255, 200, 0, 150), width=2)
    d.text((SAFE_MARGIN_X + 6, SAFE_MARGIN_Y + 6), "SAFE ZONE 100/60",
           font=f_s, fill=(255, 200, 0, 190))

    palette = [(0, 220, 255), (0, 255, 130), (255, 90, 200),
               (255, 170, 0), (150, 130, 255), (255, 255, 0)]
    gi_of = {}
    for gi, g in enumerate(groups):
        for r in g:
            gi_of[id(r)] = gi
            for b in r["members"]:
                gi_of[id(b)] = gi

    # boites individuelles : trait fin
    for i, b in enumerate(boxes):
        gi = gi_of.get(id(b), -1)
        col = palette[gi % len(palette)] if gi >= 0 else (140, 140, 140)
        if b["kind"] == "photo?":
            col = (255, 60, 60)
        d.rectangle([b["x0"], b["y0"], b["x1"], b["y1"]], outline=col + (255,), width=2)
        tag = f"#{i} {b['w']}x{b['h']}"
        if b["kind"] == "photo?":
            tag += " REJET"
        ty = b["y0"] - 20 if b["y0"] > 24 else b["y1"] + 3
        d.rectangle([b["x0"], ty, b["x0"] + 8 * len(tag) + 8, ty + 19], fill=(0, 0, 0, 190))
        d.text((b["x0"] + 4, ty + 2), tag, font=f_s, fill=col + (255,))

    # rangees : trait epais, c'est l'unite REELLEMENT mesuree
    for ri, r in enumerate(rows):
        gi = gi_of.get(id(r), -1)
        col = palette[gi % len(palette)] if gi >= 0 else (200, 200, 200)
        d.rectangle([r["x0"] - 5, r["y0"] - 5, r["x1"] + 5, r["y1"] + 5],
                    outline=col + (170,), width=4)
        lab = f"RANGEE {ri} (G{gi}) x{len(r['members'])}"
        d.rectangle([r["x1"] + 8, r["y0"] - 5, r["x1"] + 8 + 8 * len(lab) + 8, r["y0"] + 15],
                    fill=(0, 0, 0, 200))
        d.text((r["x1"] + 12, r["y0"] - 3), lab, font=f_s, fill=col + (255,))

    # --- cotes verticales entre RANGEES consecutives
    ordered = sorted(rows, key=lambda r: r["y0"])
    for a, b in zip(ordered, ordered[1:]):
        gap = b["y0"] - a["y1"]
        if gap <= 0:
            continue
        same = gi_of.get(id(a), -1) == gi_of.get(id(b), -2)
        col = (0, 255, 130, 255) if same else (255, 90, 200, 255)
        x = max(14, min(a["x0"], b["x0"]) - 30)
        d.line([(x, a["y1"]), (x, b["y0"])], fill=col, width=3)
        d.line([(x - 7, a["y1"]), (x + 7, a["y1"])], fill=col, width=3)
        d.line([(x - 7, b["y0"]), (x + 7, b["y0"])], fill=col, width=3)
        label = f"{gap}px {'intra' if same else 'INTER'}"
        my = (a["y1"] + b["y0"]) // 2
        d.rectangle([x + 10, my - 11, x + 10 + 9 * len(label) + 8, my + 11], fill=(0, 0, 0, 200))
        d.text((x + 14, my - 9), label, font=f_s, fill=col)

    # --- bandeau verdict
    g = report["grid"]
    lines = [
        f"RATIO GROUPEMENT (vertical) : {report['ratio_display']}   [cible >= {RATIO_TARGET}]",
        f"intra median {report['intra_median']}px | inter median {report['inter_median']}px"
        f" | {report['n_rows']} rangee(s) en {report['n_groups']} groupe(s)"
        f" | {report['n_graphic']} element(s) retenu(s)",
        f"RYTHME : {g['verdict'] if g.get('testable') else 'non testable'}"
        + (f" (grille {g.get('grid_px')}px, {g.get('on_grid')}/{g.get('total')} ecarts alignes)"
           if g.get("testable") else ""),
        f"FIABILITE DETECTION : {report['reliability']['level']} -- {report['reliability']['why']}",
    ]
    bh = 26 * len(lines) + 18
    d.rectangle([0, H - bh, W, H], fill=(0, 0, 0, 215))
    vc = {"OK": (0, 255, 130), "ALERTE": (255, 170, 0), "ECHEC": (255, 70, 70),
          "N/A": (170, 170, 170)}.get(report["verdict"], (255, 255, 255))
    for k, ln in enumerate(lines):
        d.text((16, H - bh + 8 + 26 * k), ln, font=f_m,
               fill=vc if k == 0 else (235, 235, 235))
    d.text((W - 190, H - bh + 8), report["verdict"], font=f_l, fill=vc)

    canvas.save(out_path)


# --------------------------------------------------------------------------
# Pipeline
# --------------------------------------------------------------------------
def analyse(png_path: str, outdir: str, tag: str, debug_mask: bool) -> dict:
    img = Image.open(png_path).convert("RGB")
    W, H = img.size
    rgb = np.asarray(img)

    boxes, glued, coverage = detect_boxes(rgb)
    graphic = [b for b in boxes if b["kind"] == "graphic"]
    rejected = [b for b in boxes if b["kind"] == "photo?"]

    # On mesure sur des RANGEES, pas sur des boites : deux elements cote a cote
    # ont un ecart vertical de 0 et fausseraient l'intra.
    rows = build_rows(graphic)

    # --- auto-declaration de fiabilite : le point le plus important du script
    #
    # Deux familles de doute, et il faut les DEUX :
    #  (a) le decor est charge -> la segmentation ramasse de la texture
    #  (b) la composition n'est pas un EMPILEMENT DE RANGEES -> la mesure verticale
    #      n'a pas de sens meme si la detection est parfaite. Cas vecu sur la
    #      reference pro : un schema RADIAL (cercle pointille + pastilles) est
    #      decoupe en dizaines de tirets, entasses dans une fausse rangee. Le fond
    #      etait propre, donc le test (a) seul disait "BONNE" pour une lecture fausse.
    fragments = sum(1 for b in graphic if b["w"] < 60 and b["h"] < 40)
    frag_share = fragments / max(1, len(graphic))
    crowded_row = max((len(r["members"]) for r in rows), default=0)

    if len(graphic) >= 8 and (frag_share > 0.55 or crowded_row > 8):
        level, why = "NON FIABLE", (
            f"composition non tabulaire ({fragments}/{len(graphic)} micro-fragments, "
            f"rangee la plus chargee {crowded_row}) -> probable schema radial/disperse, "
            f"la mesure verticale par rangees ne s'applique pas")
    elif coverage > 0.16 or len(boxes) > MAX_BOXES:
        level, why = "NON FIABLE", (
            f"decor charge (couverture passe-haut {coverage:.1%}, {len(boxes)} blobs) "
            f"-> lire l'image annotee a l'oeil, ne pas croire le chiffre")
    elif len(rejected) > len(graphic):
        level, why = "NON FIABLE", (
            f"{len(rejected)} blobs rejetes pour {len(graphic)} retenus -> segmentation instable")
    elif coverage > 0.07 or rejected:
        level, why = "PARTIELLE", (
            f"fond non uniforme (couverture {coverage:.1%}, {len(rejected)} rejets) "
            f"-> verifier les boites sur l'image annotee")
    else:
        level, why = "BONNE", f"fond propre (couverture {coverage:.1%}), boites nettes"

    groups, intra, inter = cluster_1d(rows, "v")

    if len(rows) < 3:
        im = xm = 0.0
        ratio = None
        ratio_disp = (f"{len(rows)} rangee(s) : il en faut 3 pour distinguer "
                      f"un ecart intra d'un ecart inter")
        verdict = "N/A"
    elif intra and inter:
        im, xm = float(np.median(intra)), float(np.median(inter))
        if im < 1.0:
            # Ecart intra median NUL : les rangees d'un meme groupe se touchent ou
            # se recouvrent. Diviser par 1.0 fabriquerait un ratio enorme affiche
            # "OK" -- exactement le chiffre invente qu'il ne faut jamais produire.
            ratio = None
            ratio_disp = ("ecart intra median nul (rangees jointives) :"
                          " ratio non calculable, lire l'image annotee")
            verdict = "N/A"
        elif len(inter) < 2 or len(inter) < 0.2 * len(intra):
            # Symetrique du cas precedent : un seul (ou presque) ecart INTER, donc
            # un groupe geant qui avale toute la page et une coupure isolee. Le
            # ratio serait arithmetiquement correct mais ne decrirait pas la
            # hierarchie reelle. Cas vecu : un dashboard complet ou barre laterale,
            # bandeau KPI, en-tete et 8 lignes de tableau finissaient dans le meme
            # groupe, avec pour seul INTER un ecart de la barre laterale.
            ratio = None
            ratio_disp = (f"coupure isolee ({len(inter)} inter pour {len(intra)} intra) :"
                          f" un groupe avale la page, hierarchie non decrite")
            verdict = "N/A"
        elif len(intra) < 2 or len(intra) < 0.2 * len(inter):
            # Presque tous les ecarts sont classes INTER : il n'y a pas de vraie
            # hierarchie, c'est une REPETITION UNIFORME (lignes d'un tableau,
            # liste). Le "ratio" reposerait sur 1 ou 2 ecarts intra isoles et ne
            # decrirait pas la composition. Cas vecu : le tableau de facturation.
            ratio = None
            ratio_disp = (f"repetition uniforme ({len(intra)} intra pour "
                          f"{len(inter)} inter) : pas de hierarchie de groupes a mesurer")
            verdict = "N/A"
        else:
            ratio = xm / im
            ratio_disp = f"{ratio:.2f}"
            verdict = "OK" if ratio >= RATIO_TARGET else "ECHEC"
    elif not inter:
        im = float(np.median(intra)) if intra else 0.0
        xm, ratio = 0.0, None
        ratio_disp = "un seul groupe (espacement uniforme, pas de hierarchie)"
        verdict = "N/A"
    else:
        im = 0.0
        xm = float(np.median(inter))
        ratio, ratio_disp = None, "rangees toutes separees (aucun groupe interne)"
        verdict = "N/A"

    grid = grid_analysis(intra + inter)
    coll = collisions(graphic)
    safe = safe_zone_violations(graphic, W, H)

    report = {
        "source": png_path,
        "size": [W, H],
        "master_scale": (W == MASTER_W and H == MASTER_H),
        "coverage_highpass": round(coverage, 4),
        "n_boxes_raw": len(boxes),
        "n_graphic": len(graphic),
        "n_rejected_photo": len(rejected),
        "n_rows": len(rows),
        "n_groups": len(groups),
        "intra_gaps": [int(g) for g in intra],
        "inter_gaps": [int(g) for g in inter],
        "intra_median": round(im, 1),
        "inter_median": round(xm, 1),
        "ratio": round(ratio, 3) if ratio is not None else None,
        "ratio_display": ratio_disp,
        "ratio_target": RATIO_TARGET,
        "verdict": verdict,
        "grid": grid,
        "collisions": [{"a": a, "b": b} for a, b in coll],
        "safe_zone_violations": safe,
        "reliability": {
            "level": level, "why": why,
            "fragment_share": round(frag_share, 2),
            "crowded_row": crowded_row,
        },
        "boxes": boxes,
    }

    os.makedirs(outdir, exist_ok=True)
    annot = os.path.join(outdir, f"{tag}_annot.png")
    annotate(img, boxes, rows, groups, report, annot)
    report["annotated"] = annot

    if debug_mask:
        dbg = os.path.join(outdir, f"{tag}_mask.png")
        Image.fromarray(glued.astype(np.uint8) * 255).save(dbg)
        report["mask"] = dbg

    return report


def print_report(r: dict) -> None:
    print(f"\n=== GROUPEMENT -- {os.path.basename(r['source'])} ({r['size'][0]}x{r['size'][1]}) ===")
    if not r["master_scale"]:
        print(f"  [!] Pas au master {MASTER_W}x{MASTER_H} : les seuils px absolus sont indicatifs.")
    rel = r["reliability"]
    print(f"  FIABILITE DETECTION : {rel['level']}")
    print(f"    {rel['why']}")
    print(f"  Elements : {r['n_graphic']} retenus, {r['n_rejected_photo']} rejetes (photo-like),"
          f" couverture passe-haut {r['coverage_highpass']:.1%}")
    print(f"  Rangees  : {r['n_rows']} regroupees en {r['n_groups']} groupe(s)")
    print(f"    intra (px) : {r['intra_gaps'] or '-'}   median {r['intra_median']}")
    print(f"    inter (px) : {r['inter_gaps'] or '-'}   median {r['inter_median']}")
    print(f"  RATIO    : {r['ratio_display']}  [cible >= {r['ratio_target']}]  -> {r['verdict']}")
    g = r["grid"]
    if g.get("testable"):
        print(f"  RYTHME   : {g['verdict']} -- grille {g['grid_px']}px,"
              f" {g['on_grid']}/{g['total']} ecarts alignes (base {g['base_px']}px)")
        print(f"    quotients / base : {g['quotients']}")
    else:
        print(f"  RYTHME   : non testable ({g.get('reason')})")
    if r["collisions"]:
        print(f"  COLLISIONS : {len(r['collisions'])} paire(s) : "
              + ", ".join(f"#{c['a']}~#{c['b']}" for c in r["collisions"]))
    if r["safe_zone_violations"]:
        print(f"  HORS SAFE ZONE : {len(r['safe_zone_violations'])} element(s)")
        for v in r["safe_zone_violations"][:6]:
            print(f"    #{v['index']} : {', '.join(v['sides'])}")
    print(f"  IMAGE ANNOTEE -> {r['annotated']}")
    if rel["level"] == "NON FIABLE":
        print("  >>> Le chiffre ci-dessus n'est PAS un verdict. Ouvrir l'image annotee"
              " et lire les ecarts a l'oeil sur la grille de reperes.")
    print()


def main() -> int:
    p = argparse.ArgumentParser(
        prog="test-groupement.py",
        description="Mesure de composition (loi de proximite) sur une frame 1920x1080. "
                    "Produit toujours une image annotee verifiable a l'oeil.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Exemples :\n"
            "  test-groupement.py frame.png\n"
            "  test-groupement.py plan08-FINAL.mp4 --at 0.8\n"
            "  test-groupement.py ref.mp4 --at 0.5 --crop 1920:1080:270:0\n"
            "  test-groupement.py frame.png --json --outdir /tmp/annot\n\n"
            "Lecture : ratio >= 2.0 -> l'espace porte le groupement. Sinon, c'est\n"
            "une bordure ou un fond qui le porte, ce qui est un defaut.\n"
            "AVERTISSEMENT : sur decor charge (photo, carte) ou sur composition non\n"
            "tabulaire (schema radial, tableau), la detection est declaree NON FIABLE\n"
            "et l'outil redevient une aide a la lecture humaine."
        ),
    )
    p.add_argument("input", help="frame .png/.jpg ou video .mp4")
    p.add_argument("--at", type=float, default=0.8,
                   help="position relative dans la video (0..1), defaut 0.8")
    p.add_argument("--crop", default=None,
                   help="crop ffmpeg W:H:X:Y applique a la video (ex 1920:1080:270:0)")
    p.add_argument("--outdir", default=None, help="dossier de sortie des images annotees")
    p.add_argument("--json", action="store_true", help="sortie JSON sur stdout")
    p.add_argument("--debug-mask", action="store_true", help="sauver aussi le masque binaire")
    args = p.parse_args()

    if not os.path.exists(args.input):
        print(f"ERREUR: fichier introuvable : {args.input}", file=sys.stderr)
        return 2
    if not (0.0 <= args.at <= 1.0):
        print("ERREUR: --at doit etre entre 0 et 1", file=sys.stderr)
        return 2

    outdir = args.outdir or os.path.join(
        os.environ.get("TMPDIR", "/tmp"), "test-groupement")
    tag = os.path.splitext(os.path.basename(args.input))[0]

    tmp = tempfile.mkdtemp(prefix="grp-")
    try:
        ext = os.path.splitext(args.input)[1].lower()
        if ext in (".mp4", ".mov", ".mkv", ".webm", ".avi"):
            png = extract_frame(args.input, args.at, args.crop, tmp)
            tag = f"{tag}_at{int(args.at * 100)}"
        else:
            if args.crop:
                print("ERREUR: --crop ne s'applique qu'a une video.", file=sys.stderr)
                return 2
            png = args.input

        try:
            rep = analyse(png, outdir, tag, args.debug_mask)
        except Exception as e:  # noqa: BLE001
            print(f"ERREUR pendant l'analyse : {type(e).__name__}: {e}", file=sys.stderr)
            return 1

        if args.json:
            print(json.dumps(rep, indent=2, ensure_ascii=False))
        else:
            print_report(rep)
        return 0
    finally:
        for f in os.listdir(tmp):
            try:
                os.remove(os.path.join(tmp, f))
            except OSError:
                pass
        try:
            os.rmdir(tmp)
        except OSError:
            pass


if __name__ == "__main__":
    sys.exit(main())
