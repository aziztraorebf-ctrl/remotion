#!/usr/bin/env python3
"""test-pause.py -- LE TEST DE LA PAUSE : mesurer si une video tient a l'arret sur image.

PRINCIPE (transpose d'une regle de design d'interface a la video) :
  "le mouvement n'est jamais le seul canal d'information."
Si on met la video en pause sur n'importe quelle frame, l'information doit etre la.
Une info qui n'existe QUE pendant le mouvement (element qui traverse, flash, texte
lisible seulement en transition) est une info perdue -- et le signe d'une scene qui
repose sur le mouvement au lieu de reposer sur la COMPOSITION.

CE QUE CA MESURE (et pourquoi, cf. section MECANIQUE plus bas) :
  - par frame echantillonnee : une densite de contours mesuree a DEUX ECHELLES
    (detail fin ET grandes formes), qui suit la quantite de contenu lisible ;
  - un seuil RELATIF calcule PAR PLAN (percentile des frames du plan), jamais un seuil
    absolu ni un seuil global : une scene sombre "texte sur noir" plafonne a 3 % de
    contours la ou un plan photo-reel est a 30 %. Un seuil absolu comparerait des choux
    et des carottes et recalerait tout le registre sombre ;
  - la DUREE des passages faibles, pour distinguer les deux cas que le test doit
    absolument separer :
      TRANSITOIRE LEGITIME = creux court entre deux etats stables (cut, fondu,
        typewriter entre deux mots) -> ce n'est PAS un defaut ;
      TROU REEL = segment long ou rien n'est lisible -> defaut.

SORTIE : pourcentage de frames auto-portantes + liste des trous avec timecodes.

MECANIQUE RETENUE (et alternatives ECARTEES, mesurees sur le materiau reel) :
  - ENTROPIE globale : ECARTEE. Mesuree sur nos plans, elle reste plate (2.86 -> 3.06)
    entre une frame vide et une frame pleine de texte : la distribution des niveaux de
    gris d'un fond sombre domine tout. Elle ne separe rien.
  - LUMINOSITE MOYENNE / DYNAMIQUE : ECARTEES. Elles decrivent l'exposition, pas la
    lisibilite. Une frame noire avec un texte blanc lisible et une frame noire vide ont
    quasi la meme moyenne.
  - VARIANCE du Laplacien (mesure de nettete classique) : ECARTEE comme signal principal.
    Elle est dominee par quelques pixels a fort contraste : elle bouge d'un facteur 30
    entre deux frames visuellement equivalentes. Le TAUX de pixels de contour (part de
    l'image au-dessus d'un seuil) est bien plus stable et directement interpretable
    comme "quelle proportion de l'image porte du detail".
  - DIFFERENCE INTER-FRAMES seule : ECARTEE comme juge. Un plan fige est immobile, mais
    un plan fige PLEIN (une UI a l'ecran) est parfaitement auto-portant. L'immobilite
    n'est pas un defaut en soi. Elle sert ici a deux choses seulement : qualifier un
    trou (fige-et-vide vs en-mouvement-et-vide) et DECOUPER LES PLANS (voir ci-dessous).
  - SEUIL GLOBAL sur toute la video : ECARTE apres mesure. C'etait la premiere version
    de ce script, et la video de reference professionnelle l'a invalidee : elle sortait
    a 47 % avec 22 s de faux "trous". Cause racine mesuree : un film multi-plans n'a pas
    UN niveau normal. La reference alterne des plans photo-reels (30 %+ de contours) et
    des actes texte-sur-noir (0.5-3 %) ; le percentile global, tire vers le haut par les
    plans denses, condamnait en bloc tous les actes sobres. Preuve : le meme acte texte
    mesure SEUL sort a 77-94 %, contre 47 % noye dans le film entier.
    -> Le seuil est donc calcule PAR PLAN (segmentation par pic de difference
    inter-frames), jamais sur la video entiere. Un plan est compare a lui-meme.

Usage :
  test-pause.py video.mp4
  test-pause.py video.mp4 --json
  test-pause.py video.mp4 --step 0.4 --hole 0.5
  test-pause.py a.mp4 b.mp4 c.mp4          # comparer plusieurs rendus
  test-pause.py ref.mp4 --crop 1920:1080:270:0   # reference recadree (watermark/cadre)

Dependances : ffmpeg/ffprobe, numpy, Pillow. Aucun appel API, aucun LLM : mesure
deterministe, rejouable a l'identique.
"""
import argparse
import json
import subprocess
import sys

try:
    import numpy as np
except ImportError:
    sys.exit("Requiert numpy (pip install numpy)")


# --- Constantes de mesure -----------------------------------------------------
# Seuil sur la reponse du Laplacien au-dessus duquel un pixel compte comme "contour
# net". 18/255 : au-dessus du bruit de compression (mesure ~4-8 sur des aplats
# encodes en h264), en dessous du contraste d'un texte anti-aliase sur fond sombre.
EDGE_MAGNITUDE = 18.0

# Taille du bloc pour l'echelle grossiere (grandes formes : logo, sujet, structure).
# 8 px sur une largeur d'analyse de 480 px : capte ce qui reste lisible meme quand le
# detail fin disparait (flou de mouvement, gros aplats).
COARSE_BLOCK = 8

# Le seuil d'auto-portance d'une frame vaut RATIO_OF_REF x (niveau de reference du
# PLAN auquel elle appartient). Le niveau de reference est un percentile haut des
# frames de ce plan : ce que ce plan montre quand il montre quelque chose.
REF_PERCENTILE = 75
RATIO_OF_REF = 0.30

# Segmentation en plans : une frame dont la difference avec la precedente depasse
# CUT_MOTION (en niveaux de gris moyens) est traitee comme un changement de plan.
# Mesure : les cuts reels de la reference sortent a 20-80 ; l'interieur d'un plan,
# meme anime (zoom, typewriter, fondu), reste sous 12.
CUT_MOTION = 18.0


# Plancher absolu : en dessous, l'image ne porte objectivement aucun detail, quel que
# soit le registre (mesure : une frame uniforme sort a 0.03 %, une frame avec un seul
# mot lisible a ~0.30 %).
FLOOR_EDGE_PCT = 0.12

DEFAULT_STEP = 0.4    # pas d'echantillonnage (s) -- pas maison habituel

# Duree a partir de laquelle un creux cesse d'etre un transitoire et devient un TROU.
# JUSTIFIE PAR BALAYAGE, pas par intuition (reference pro vs nos plans) :
#   --hole 0.4 : 5 trous signales sur la REFERENCE -> trop sensible, chaque creux d'un
#                seul echantillon (cut, fondu, typewriter) devient un defaut. Rejete.
#   --hole 0.5 : la reference tombe a 1 seul signalement (limite, verifie a l'oeil :
#                0.8 s ou l'ecran ne porte qu'un mot en fondu), le vrai defaut de
#                plan11 (2.4 s vides) reste pris, et les vraies zones minces
#                (plan10, plan03) ressortent. -> DEFAUT RETENU.
#   --hole >=1.2 : la reference passe a 0, mais plan10 et plan03 aussi ; seul le defaut
#                grossier survit. C'est le reglage d'un GATE bloquant, pas d'une review.
DEFAULT_HOLE = 0.5


def probe(path):
    """Retourne (width, height, duration_s, fps). Sort proprement si illisible."""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,r_frame_rate:format=duration",
         "-of", "json", path],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        return None
    try:
        data = json.loads(out.stdout)
        s = data["streams"][0]
        num, den = s["r_frame_rate"].split("/")
        fps = float(num) / float(den) if float(den) else 0.0
        dur = float(data.get("format", {}).get("duration", 0.0))
        return int(s["width"]), int(s["height"]), dur, fps
    except (KeyError, IndexError, ValueError, ZeroDivisionError):
        return None


def read_ppm_stream(buf):
    """Decode un flux PPM (P6) concatene en une liste de tableaux numpy."""
    frames = []
    i = 0
    n = len(buf)
    while i < n:
        if buf[i:i + 2] != b"P6":
            break
        j = i + 2
        vals = []
        while len(vals) < 3 and j < n:
            while j < n and buf[j:j + 1].isspace():
                j += 1
            if buf[j:j + 1] == b"#":            # commentaire PPM
                while j < n and buf[j:j + 1] != b"\n":
                    j += 1
                continue
            start = j
            while j < n and not buf[j:j + 1].isspace():
                j += 1
            vals.append(int(buf[start:j]))
        j += 1                                   # un seul whitespace apres maxval
        if len(vals) < 3:
            break
        w, h, _maxval = vals
        size = w * h * 3
        if j + size > n:
            break
        frames.append(
            np.frombuffer(buf[j:j + size], dtype=np.uint8).reshape(h, w, 3)
        )
        i = j + size
    return frames


def extract(path, step, crop=None, width=480):
    """Echantillonne la video tous les `step` secondes, en niveaux de gris flottants."""
    chain = []
    if crop:
        chain.append(f"crop={crop}")
    chain.append(f"fps={1.0 / step}")
    chain.append(f"scale={width}:-2")
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", ",".join(chain),
         "-f", "image2pipe", "-vcodec", "ppm", "-"],
        capture_output=True,
    )
    if r.returncode != 0:
        return None
    return [f.mean(axis=2) for f in read_ppm_stream(r.stdout)]


def _lap_rate(plane):
    """Taux (%) de pixels dont la reponse du Laplacien 4-voisins depasse le seuil."""
    lap = (-4.0 * plane[1:-1, 1:-1]
           + plane[:-2, 1:-1] + plane[2:, 1:-1]
           + plane[1:-1, :-2] + plane[1:-1, 2:])
    return float((np.abs(lap) > EDGE_MAGNITUDE).mean() * 100.0)


def edge_density(gray):
    """Lisibilite d'une frame (%) : contours nets OU structure a grande echelle.

    DEUX ECHELLES, parce qu'une seule ne suffit pas (mesure sur la reference) :
      - echelle FINE (pixel) : suit le texte ecrit, l'UI, le sujet net ;
      - echelle GROSSIERE (blocs 8x8) : suit les grandes formes contrastees.

    Pourquoi la grossiere est indispensable : mesuree seule, l'echelle fine produisait
    de VRAIS faux positifs sur la reference. Un gros logo net sur un fond uni ("FosterWith",
    t=16-17 s) occupe peu de pixels de contour (1.9 %) alors qu'il est parfaitement
    lisible ; et un zoom en flou de mouvement (t=18.4 s) effondre le detail fin a 1.2 %
    alors que la structure reste tout a fait lisible (29 % a l'echelle grossiere).
    On retient le MAX des deux : une frame est portee soit par son detail, soit par sa
    grande forme. Le sous-echantillonnage par MOYENNE de blocs fait aussi office de
    filtre anti-bruit (grain, compression).
    """
    fine = _lap_rate(gray)
    f = COARSE_BLOCK
    h, w = gray.shape
    H, W = h // f * f, w // f * f
    if H < 3 * f or W < 3 * f:
        return fine
    blocks = gray[:H, :W].reshape(H // f, f, W // f, f).mean(axis=(1, 3))
    return max(fine, _lap_rate(blocks))


def split_shots(motion):
    """Decoupe la serie en plans aux pics de difference inter-frames.

    Un film multi-plans n'a pas UN niveau de contenu normal : comparer un acte
    texte-sur-noir au niveau d'un plan photo-reel condamne le premier a tort (mesure
    sur la video de reference : 47 % en global contre 77-94 % par plan). On segmente
    donc pour comparer chaque plan a lui-meme.
    """
    cuts = [0] + [i for i in range(1, len(motion)) if motion[i] >= CUT_MOTION] + [len(motion)]
    shots = [(a, b) for a, b in zip(cuts, cuts[1:]) if b > a]
    # ATTENTION : ne PAS fusionner un plan court avec son voisin. C'etait la premiere
    # version, et elle produisait un faux positif mesure sur la reference : un carton
    # logo sobre (5 % de contours, t=16-17 s) fusionne avec le plan dense qui suit
    # (globe/cartes, 36-47 %) heritait d'un seuil calcule sur l'autre contenu et etait
    # declare "trou" alors qu'il est parfaitement lisible. Un plan court garde donc son
    # propre niveau : mieux vaut un percentile sur peu de frames qu'un seuil emprunte a
    # un contenu qui n'a rien a voir.
    return shots or [(0, len(motion))]


def analyse(path, step=DEFAULT_STEP, hole=DEFAULT_HOLE, crop=None):
    """Mesure une video. Retourne un dict de resultats, ou {'error': ...}."""
    meta = probe(path)
    if meta is None:
        return {"file": path, "error": "video illisible ou introuvable"}
    w, h, dur, fps = meta

    grays = extract(path, step, crop)
    if not grays:
        return {"file": path, "error": "aucune frame extraite (video vide ou codec non supporte)"}
    if len(grays) < 2:
        return {"file": path, "error": f"trop courte pour un echantillonnage a {step}s ({dur:.2f}s)"}

    density = [edge_density(g) for g in grays]
    motion = [0.0] + [float(np.abs(grays[i] - grays[i - 1]).mean())
                      for i in range(1, len(grays))]

    # Seuil relatif PAR PLAN : chaque plan est compare a ce que lui-meme montre quand
    # il montre quelque chose (cf. split_shots et la docstring : le seuil global a ete
    # invalide par la video de reference).
    shots = split_shots(motion)
    threshold_at = [0.0] * len(density)
    shot_info = []
    for a, b in shots:
        ref_level = float(np.percentile(density[a:b], REF_PERCENTILE))
        thr = max(ref_level * RATIO_OF_REF, FLOOR_EDGE_PCT)
        for i in range(a, b):
            threshold_at[i] = thr
        shot_info.append({
            "start_s": round(a * step, 2),
            "end_s": round(b * step, 2),
            "ref_level_edge_pct": round(ref_level, 3),
            "threshold_edge_pct": round(thr, 3),
        })

    weak = [d < t for d, t in zip(density, threshold_at)]

    # Regroupement des frames faibles consecutives en segments.
    segments = []
    start = None
    for i, is_weak in enumerate(weak):
        if is_weak and start is None:
            start = i
        elif not is_weak and start is not None:
            segments.append((start, i - 1))
            start = None
    if start is not None:
        segments.append((start, len(weak) - 1))

    # Un segment est un TROU si sa duree atteint le seuil `hole` ; sinon c'est un
    # transitoire legitime (cut, fondu, typewriter entre deux mots).
    holes, transients = [], []
    for a, b in segments:
        seg_dur = (b - a + 1) * step
        item = {
            "start_s": round(a * step, 2),
            "end_s": round(b * step + step, 2),
            "duration_s": round(seg_dur, 2),
            "frames": b - a + 1,
            "min_edge_pct": round(min(density[a:b + 1]), 3),
            "mean_motion": round(float(np.mean(motion[a:b + 1])), 2),
        }
        (holes if seg_dur >= hole else transients).append(item)

    self_supporting = sum(1 for x in weak if not x)
    pct = 100.0 * self_supporting / len(weak)

    return {
        "file": path,
        "resolution": f"{w}x{h}",
        "duration_s": round(dur, 2),
        "fps": round(fps, 2),
        "sampled_frames": len(weak),
        "step_s": step,
        "hole_threshold_s": hole,
        "shots": shot_info,
        "self_supporting_pct": round(pct, 1),
        "holes": holes,
        "transients": transients,
        "hole_time_s": round(sum(x["duration_s"] for x in holes), 2),
        "series": [
            {"t": round(i * step, 2), "edge_pct": round(d, 3), "motion": round(m, 2),
             "threshold_edge_pct": round(t, 3)}
            for i, (d, m, t) in enumerate(zip(density, motion, threshold_at))
        ],
    }


def render(res, verbose=False):
    """Rapport terminal lisible pour une video."""
    name = res["file"].split("/")[-1]
    if "error" in res:
        print(f"  {name}: ERREUR -- {res['error']}")
        return

    pct = res["self_supporting_pct"]
    mark = "OK " if pct >= 90 and not res["holes"] else ("!! " if pct >= 70 else "XX ")
    print(f"{mark}{name}  {res['resolution']}  {res['duration_s']}s")
    print(f"    auto-portantes : {pct}%  ({res['sampled_frames']} frames a {res['step_s']}s)")
    shots = res["shots"]
    thr_span = (f"{min(s['threshold_edge_pct'] for s in shots)}%"
                f" - {max(s['threshold_edge_pct'] for s in shots)}%"
                if len(shots) > 1 else f"{shots[0]['threshold_edge_pct']}%")
    print(f"    {len(shots)} plan(s) detecte(s), seuil par plan : {thr_span} de contours")

    if res["holes"]:
        print(f"    TROUS ({res['hole_time_s']}s au total) :")
        for x in res["holes"]:
            fixed = " [image figee]" if x["mean_motion"] < 0.5 else ""
            print(f"      {x['start_s']:6.2f}s -> {x['end_s']:6.2f}s  "
                  f"({x['duration_s']}s, contours min {x['min_edge_pct']}%){fixed}")
    else:
        print("    TROUS : aucun")

    if res["transients"]:
        spans = ", ".join(f"{x['start_s']}-{x['end_s']}s" for x in res["transients"])
        print(f"    transitoires legitimes (< {res['hole_threshold_s']}s) : {spans}")

    if verbose:
        print("    serie :")
        for p in res["series"]:
            bar = "#" * min(40, int(p["edge_pct"] * 2))
            flag = "" if p["edge_pct"] >= p["threshold_edge_pct"] else "  <-- faible"
            print(f"      t={p['t']:6.2f}  {p['edge_pct']:7.3f}% {bar}{flag}")
    print()


def main():
    ap = argparse.ArgumentParser(
        description="Test de la pause : mesure si une video tient a l'arret sur image.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Le score est le pourcentage de frames echantillonnees qui portent du\n"
            "contenu lisible. Un creux court entre deux etats stables est un\n"
            "TRANSITOIRE LEGITIME (cut, fondu, typewriter) et n'est pas compte comme\n"
            "defaut ; un creux long est un TROU et est signale avec son timecode.\n\n"
            "Exemples :\n"
            "  test-pause.py out/plan01-FINAL.mp4\n"
            "  test-pause.py out/plan*.mp4 --json > pause.json\n"
            "  test-pause.py ref.mp4 --crop 1920:1080:270:0\n"
        ),
    )
    ap.add_argument("videos", nargs="+", help="fichier(s) video a mesurer")
    ap.add_argument("--step", type=float, default=DEFAULT_STEP,
                    help=f"pas d'echantillonnage en secondes (defaut {DEFAULT_STEP})")
    ap.add_argument("--hole", type=float, default=DEFAULT_HOLE,
                    help=f"duree (s) a partir de laquelle un creux est un TROU (defaut {DEFAULT_HOLE})")
    ap.add_argument("--crop", default=None,
                    help="crop ffmpeg applique avant mesure, ex 1920:1080:270:0")
    ap.add_argument("--json", action="store_true", help="sortie JSON complete")
    ap.add_argument("--verbose", action="store_true",
                    help="affiche la serie de mesures frame par frame")
    args = ap.parse_args()

    if args.step <= 0:
        sys.exit("--step doit etre > 0")
    if args.hole <= 0:
        sys.exit("--hole doit etre > 0")

    results = [analyse(v, args.step, args.hole, args.crop) for v in args.videos]

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        for res in results:
            render(res, args.verbose)
        ok = [r for r in results if "error" not in r]
        if len(ok) > 1:
            print("-" * 60)
            print("RECAPITULATIF")
            for r in sorted(ok, key=lambda x: x["self_supporting_pct"]):
                n = r["file"].split("/")[-1]
                print(f"  {r['self_supporting_pct']:5.1f}%  {n:28s} "
                      f"trous: {len(r['holes'])} ({r['hole_time_s']}s)")

    return 1 if any("error" in r for r in results) else 0


if __name__ == "__main__":
    sys.exit(main())
