#!/usr/bin/env python3
"""LE SQUINT TEST A LA COUPE - mesure objective de la qualite des raccords d'un montage.

Loi de perception ("change blindness") : on rate les changements visuels, surtout quand ils
coincident avec une interruption visuelle. Une COUPE EST une interruption visuelle. Donc un
changement d'information a cheval sur une coupe est structurellement invisible, quelle que
soit sa taille.

Le test manuel : plisser les yeux devant les deux images de part et d'autre de la coupe.
Si le changement n'apparait pas au plissement, le spectateur ne le verra pas.

Traduit en mesure : flou gaussien (= le plissement) sur les frames avant/apres, puis
comparaison. Deux echecs OPPOSES, et c'est toute la subtilite :

  INVISIBLE  les deux frames se ressemblent trop apres flou -> le spectateur ne percoit pas
             qu'on a change de plan, le montage patine, on a coupe pour rien
  VIOLENTE   rupture totale (luminosite, composition, couleur) -> cassure de continuite,
             le spectateur est perdu
  BONNE      entre les deux : percue comme un changement, mais un fil de continuite persiste
             (une forme, une masse lumineuse, une couleur dominante)

Ce que ca mesure, pour chaque coupe :
  - DELTA    ecart global apres plissement (0-100) : combien la coupe se VOIT
  - FIL      continuite structurelle survivant au flou (0-100) : ce qui RESTE d'un plan
             a l'autre (masse lumineuse, dominante couleur, composition)
  et classe INVISIBLE / BONNE / VIOLENTE a partir des deux.

Usage :
  test-coupe.py video.mp4
  test-coupe.py video.mp4 --crop 1920:1080:270:0     # retirer un watermark / recadrer
  test-coupe.py video.mp4 --json                     # sortie machine
  test-coupe.py video.mp4 --dump-frames /tmp/out     # exporter les paires pour verifier a l'oeil
  test-coupe.py a.mp4 b.mp4 c.mp4                    # plans separes : juge les RACCORDS entre eux

Le rayon de flou par defaut est derive de la hauteur d'image (voir RAYON_RATIO) : il represente
l'acuite visuelle a distance normale de visionnage, pas une constante arbitraire.
"""
import argparse
import io
import json
import os
import re
import subprocess
import sys

try:
    import numpy as np
    from PIL import Image, ImageFilter
except ImportError:
    sys.exit("Requiert numpy et Pillow (pip install numpy pillow)")


# --- Calibration -----------------------------------------------------------------------
# Rayon de flou = 1/64 de la hauteur d'image. A 1080p cela fait ~17 px.
# Justification : a distance normale de visionnage (~3x la hauteur de l'ecran), l'oeil
# distingue mal les details sous ~1/60 du champ vertical. Plisser les yeux revient a
# supprimer ce qui est sous cette limite. Le ratio rend la mesure INDEPENDANTE de la
# resolution : un 720p et un 4K du meme montage donnent le meme score.
RAYON_RATIO = 1.0 / 64.0

# Hauteur d'analyse : on ramene tout a 180 px de haut avant flou. Deux raisons :
#  - le sous-echantillonnage EST deja un flou passe-bas, le gaussien vient par-dessus
#  - cout constant quelle que soit la source
HAUTEUR_ANALYSE = 180

# Seuils de detection (metrique scene de ffmpeg, identique a select=gt(scene,X))
SEUIL_FRANCHE = 0.30
SEUIL_DOUCE = 0.12

# Fenetre de regroupement : des detections espacees de moins de ca appartiennent au MEME
# evenement (un fondu / une transition animee declenche plusieurs detections d'affilee).
FENETRE_GROUPE = 0.40

# Recul d'echantillonnage autour de la coupe : on prend la frame a -RECUL et +RECUL secondes
# pour lire les plans EN REGIME, pas le milieu d'une transition.
# Fenetre de trainee : un pic faible a moins de ca d'un pic fort est la decroissance de
# celui-ci, pas une coupe distincte.
FENETRE_TRAINEE = 0.10

RECUL = 0.12

# Seuils de verdict (calibres sur la reference Fiverr, voir le rapport)
SEUIL_INVISIBLE = 12.0   # DELTA sous ce niveau : la coupe ne se voit pas
SEUIL_VIOLENT_DELTA = 55.0   # DELTA au-dessus ET fil casse : rupture
SEUIL_VIOLENT_FIL = 25.0     # FIL sous ce niveau : plus aucun repere commun


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    """Retourne (largeur, hauteur, duree, fps_moyen)."""
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
               "-show_entries", "stream=width,height,nb_frames,duration,r_frame_rate",
               "-show_entries", "format=duration", "-of", "json", path])
    if out.returncode != 0:
        sys.exit(f"ffprobe a echoue sur {path}\n{out.stderr.strip()}")
    data = json.loads(out.stdout)
    if not data.get("streams"):
        sys.exit(f"Aucun flux video dans {path}")
    s = data["streams"][0]
    duree = None
    for cand in (s.get("duration"), data.get("format", {}).get("duration")):
        try:
            duree = float(cand)
            break
        except (TypeError, ValueError):
            continue
    if duree is None or duree <= 0:
        sys.exit(f"Duree illisible pour {path}")
    nb = s.get("nb_frames")
    try:
        fps = int(nb) / duree if nb and int(nb) > 0 else 30.0
    except (TypeError, ValueError):
        fps = 30.0
    return int(s["width"]), int(s["height"]), duree, fps


def detecte_coupes(path, crop, seuil_franche, seuil_douce):
    """Detecte les coupes via la metrique scene de ffmpeg.

    On lit le score scene de CHAQUE frame en une seule passe (metadata=print) plutot que de
    filtrer avec select : on obtient le signal complet, ce qui permet de distinguer une coupe
    FRANCHE (un pic isole) d'une transition DOUCE (une serie de pics moyens consecutifs).
    Le resultat au seuil 0.30 / 0.12 est identique a `select=gt(scene,X)`.
    """
    vf = []
    if crop:
        vf.append(f"crop={crop}")
    vf.append("scale=-2:180")
    # select='gte(scene,0)' force l'evaluation de la metrique scene sur CHAQUE frame tout en
    # les retenant toutes : metadata=print livre alors le signal complet. Sans select, aucun
    # filtre ne produit lavfi.scene_score et la sortie est vide. (scdet expose bien un score
    # par frame mais c'est une AUTRE metrique, MAFD : elle ne retrouve pas les memes coupes.)
    vf.append("select='gte(scene\\,0)'")
    vf.append("metadata=print:file=-")
    cmd = ["ffmpeg", "-v", "error", "-i", path, "-vf", ",".join(vf), "-an", "-f", "null", "-"]
    out = run(cmd)
    if out.returncode != 0:
        sys.exit(f"ffmpeg a echoue sur {path}\n{out.stderr.strip()[:800]}")

    pts, scores = [], []
    cur = None
    for line in out.stdout.splitlines():
        m = re.search(r"pts_time:([0-9.]+)", line)
        if m:
            cur = float(m.group(1))
            continue
        m = re.search(r"lavfi\.scene_score=([0-9.]+)", line)
        if m and cur is not None:
            pts.append(cur)
            scores.append(float(m.group(1)))
    if not scores:
        return [], []

    # Detections brutes au seuil bas, puis regroupement.
    #
    # Regrouper sur le seul critere temporel est FAUX : a 18.03 s et 18.41 s la reference
    # enchaine deux VRAIES coupes distinctes en 378 ms, qu'une fenetre de 0.4 s fusionnait a
    # tort en un seul evenement. A l'inverse les 4 detections de 11.44 a 11.64 s sont UNE
    # transition animee (des cartes qui entrent une a une).
    # Le discriminant n'est ni la duree ni la presence d'un creux (les deux cas retombent a
    # zero entre leurs pics) : c'est l'AMPLITUDE. Une vraie coupe change tout d'un coup
    # (pics 0.90 et 0.44) ; une transition animee progresse par paliers modestes (0.19-0.30).
    # Donc : tout pic >= seuil_franche est un evenement A LUI SEUL ; seuls les pics faibles
    # se regroupent entre eux en une transition DOUCE.
    # La 2e frame porte souvent un score parasite (la metrique scene n'a pas de frame
    # precedente valide pour l'initialiser) : observe sur plan06 et plan07, un pic isole a
    # 0.033 s sur des plans continus sans aucune coupe. Une coupe sur la 1re frame n'a de
    # toute facon aucun sens : il n'y a pas d'"avant".
    debut_ignore = pts[2] if len(pts) > 2 else 0.0
    brut = [(t, s) for t, s in zip(pts, scores)
            if s >= seuil_douce and t > debut_ignore]
    groupes = []
    for t, s in brut:
        prev = groupes[-1] if groupes else None
        prev_fort = prev and max(x[1] for x in prev) >= seuil_franche
        colle = prev is not None and t - prev[-1][0] <= FENETRE_TRAINEE
        if s >= seuil_franche:
            # Pic fort : nouvel evenement, SAUF s'il suit immediatement un autre pic fort
            # (rare, mais alors c'est la meme coupe vue sur 2 frames).
            if prev_fort and colle:
                prev.append((t, s))
            else:
                groupes.append([(t, s)])
            continue
        # Pic faible colle a un pic fort : c'est la TRAINEE de la coupe precedente, pas un
        # evenement. Sans ca, une coupe nette (0.455) suivie de sa decroissance (0.195) etait
        # comptee deux fois -- observe sur notre montage a 17.57/17.60 et 18.67/18.70.
        if prev_fort and colle:
            prev.append((t, s))
        elif prev and not prev_fort and t - prev[-1][0] <= FENETRE_GROUPE:
            prev.append((t, s))
        else:
            groupes.append([(t, s)])

    coupes = []
    for g in groupes:
        pic = max(g, key=lambda x: x[1])
        etalement = g[-1][0] - g[0][0]
        franche = pic[1] >= seuil_franche
        coupes.append({
            "t": round(pic[0], 3),
            "type": "FRANCHE" if franche else "DOUCE",
            "score_scene": round(pic[1], 4),
            "etalement_s": round(etalement, 3),
            "n_detections": len(g),
            "t_debut": round(g[0][0], 3),
            "t_fin": round(g[-1][0], 3),
        })
    return coupes, list(zip(pts, scores))


def detecte_bandes(path, crop, duree):
    """Detecte des bandes laterales/haut-bas inertes (pillarbox, letterbox, watermark fixe).

    Pourquoi c'est critique : ces bandes sont IDENTIQUES de part et d'autre de chaque coupe.
    FIL les compte comme de la structure commune et surestime donc la continuite, ce qui
    masque les vraies ruptures. Verifie sur la reference Fiverr (2460x1080 avec 270 px de
    noir de chaque cote) : sans recadrage elle affiche 1 coupe VIOLENTE, avec recadrage 3 --
    et le raccord a 18.41 s bascule de BONNE a VIOLENTE. Le recadrage n'est pas cosmetique,
    il change le verdict.
    """
    ech = [duree * f for f in (0.15, 0.4, 0.65, 0.9)]
    imgs = [grab(path, t, crop, 120) for t in ech]
    imgs = [i for i in imgs if i is not None]
    if len(imgs) < 2:
        return None
    arrs = [np.asarray(i.convert("L"), dtype=np.float64) for i in imgs]
    h, w = arrs[0].shape
    pile = np.stack([a for a in arrs if a.shape == (h, w)])
    if pile.shape[0] < 2:
        return None
    # une colonne est inerte si elle ne bouge pas dans le temps ET reste tres sombre
    col_var = pile.std(axis=0).mean(axis=0)
    col_lum = pile.mean(axis=0).mean(axis=0)
    inerte = (col_var < 1.5) & (col_lum < 16)
    g = 0
    while g < w and inerte[g]:
        g += 1
    d = 0
    while d < w and inerte[w - 1 - d]:
        d += 1
    if g + d < w * 0.04:
        return None
    return {"gauche_pct": round(g / w * 100, 1), "droite_pct": round(d / w * 100, 1)}


def grab(path, t, crop, hauteur):
    """Extrait UNE frame au temps t, recadree et reduite, en niveaux + couleur."""
    vf = []
    if crop:
        vf.append(f"crop={crop}")
    vf.append(f"scale=-2:{hauteur}")
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{max(t, 0):.4f}", "-i", path,
         "-vf", ",".join(vf), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
        capture_output=True,
    )
    if not out.stdout:
        return None
    return Image.open(io.BytesIO(out.stdout)).convert("RGB")


def plisse(img, rayon):
    """Le plissement des yeux : flou gaussien."""
    return img.filter(ImageFilter.GaussianBlur(radius=rayon))


def mesure_paire(av, ap, rayon):
    """Compare deux frames APRES plissement. Retourne DELTA (ca se voit) et FIL (ce qui reste).

    Choix de mesure, et pourquoi :

    DELTA agrege trois ecarts qui correspondent aux trois facons dont une coupe se signale
    a un spectateur qui plisse les yeux :
      - luminance   : la masse lumineuse globale a-t-elle change (jour/nuit, flash) ?
      - couleur     : la dominante chromatique a-t-elle change (chaud/froid) ?
      - composition : la repartition spatiale des masses a-t-elle change ?
    Ils sont pris en MAX et non en moyenne : il suffit qu'UN des trois saute pour que la
    coupe se voie. Une moyenne diluerait un flash blanc dans deux canaux stables.

    FIL mesure a l'inverse ce qui SURVIT : correlation spatiale des deux images floutees
    (structure) combinee au recouvrement des histogrammes de teinte (palette). C'est le
    "fil de continuite" : une forme, une masse, une dominante qui persiste d'un plan a l'autre.

    Ecarte : SSIM complet (sensible a la texture fine, or le flou la detruit justement, donc
    il mesurerait surtout du bruit) ; distance L2 pixel a pixel seule (ne distingue pas un
    deplacement de masse d'un changement de sujet) ; comparaison sur la frame nette (c'est
    exactement ce que le squint test refuse de faire).
    """
    a = np.asarray(plisse(av, rayon), dtype=np.float64) / 255.0
    b = np.asarray(plisse(ap, rayon), dtype=np.float64) / 255.0
    if a.shape != b.shape:
        h = min(a.shape[0], b.shape[0])
        w = min(a.shape[1], b.shape[1])
        a, b = a[:h, :w], b[:h, :w]

    # Luminance perceptuelle (Rec. 709)
    la = a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722
    lb = b[..., 0] * 0.2126 + b[..., 1] * 0.7152 + b[..., 2] * 0.0722

    d_lum = abs(float(la.mean()) - float(lb.mean()))

    # Dominante couleur : ecart des moyennes RGB, normalise
    d_col = float(np.abs(a.reshape(-1, 3).mean(0) - b.reshape(-1, 3).mean(0)).max())

    # Composition : ecart moyen local de luminance (les masses ont-elles bouge)
    d_comp = float(np.abs(la - lb).mean())

    delta = max(d_lum, d_col, d_comp) * 100.0

    # FIL : correlation structurelle sur la luminance floutee
    fa, fb = la.ravel() - la.mean(), lb.ravel() - lb.mean()
    den = float(np.sqrt((fa ** 2).sum()) * np.sqrt((fb ** 2).sum()))
    corr = float((fa * fb).sum() / den) if den > 1e-9 else 0.0
    corr = max(0.0, corr)

    # Recouvrement des histogrammes de couleur (palette commune)
    inter = 0.0
    for c in range(3):
        ha, _ = np.histogram(a[..., c], bins=16, range=(0, 1), density=False)
        hb, _ = np.histogram(b[..., c], bins=16, range=(0, 1), density=False)
        ha = ha / max(ha.sum(), 1)
        hb = hb / max(hb.sum(), 1)
        inter += float(np.minimum(ha, hb).sum())
    inter /= 3.0

    fil = (0.5 * corr + 0.5 * inter) * 100.0

    # DETAIL : densite de detail fin de chaque plan.
    # ATTENTION a ce que ce chiffre est, et surtout a ce qu'il N'EST PAS.
    # Il est tentant d'y lire un detecteur de flou ("coupe masquee par un blur"). C'est FAUX
    # et ca a ete verifie : sur la reference, le plan reellement floute (blur radial a 18.45 s)
    # mesure 0.84, mais un carton de TEXTE parfaitement net sur fond noir mesure 0.66 a 1.13 --
    # plus bas encore. La metrique confond "floute" et "peu de matiere". Une version normalisee
    # par le contraste a ete testee et echoue pareillement (le plan floute passe AU-DESSUS du
    # drone net). Aucun seuil ne separe les deux : le flag "masquee par flou" a donc ete RETIRE
    # plutot que livre non calibrable.
    # Ce qui reste vrai et utile : un DETAIL faible des DEUX cotes signifie que la coupe joue
    # sur des masses larges, pas sur de la texture -- a lire comme un contexte, pas un verdict.
    def detail(img):
        g = np.asarray(img.convert("L"), dtype=np.float64) / 255.0
        gy, gx = np.gradient(g)
        return float(np.sqrt(gx ** 2 + gy ** 2).mean() * 100.0)

    return {
        "delta": round(delta, 2),
        "fil": round(fil, 2),
        "d_lum": round(d_lum * 100, 2),
        "d_couleur": round(d_col * 100, 2),
        "d_composition": round(d_comp * 100, 2),
        "detail_avant": round(detail(av), 2),
        "detail_apres": round(detail(ap), 2),
    }


def verdict(m, seuils):
    delta, fil = m["delta"], m["fil"]
    if delta < seuils["invisible"]:
        return "INVISIBLE", "les deux plans se ressemblent trop apres plissement : la coupe ne se percoit pas"
    if delta >= seuils["violent_delta"] and fil < seuils["violent_fil"]:
        return "VIOLENTE", "rupture totale : aucun repere commun ne survit au plissement"
    if fil < seuils["violent_fil"]:
        return "VIOLENTE", "plus aucun fil de continuite (structure et palette disjointes)"
    return "BONNE", "changement percu, mais un fil de continuite persiste"


def analyse(path, args):
    w, h, duree, fps = probe(path)
    crop = args.crop
    rayon = args.rayon if args.rayon else max(2.0, HAUTEUR_ANALYSE * RAYON_RATIO * (1080.0 / 1080.0))
    # rayon exprime dans le referentiel HAUTEUR_ANALYSE (equivalent 1/64 de la hauteur reelle)
    coupes, signal = detecte_coupes(path, crop, args.seuil_franche, args.seuil_douce)

    recul = args.recul
    for c in coupes:
        t_av = max(c["t_debut"] - recul, 0.0)
        t_ap = min(c["t_fin"] + recul, max(duree - 0.02, 0.0))
        av = grab(path, t_av, crop, HAUTEUR_ANALYSE)
        ap = grab(path, t_ap, crop, HAUTEUR_ANALYSE)
        if av is None or ap is None:
            c["erreur"] = "frame illisible"
            c["verdict"] = "INDETERMINE"
            continue
        c.update(mesure_paire(av, ap, rayon))
        c["t_avant"] = round(t_av, 3)
        c["t_apres"] = round(t_ap, 3)
        v, motif = verdict(c, args.seuils)
        c["verdict"] = v
        c["motif"] = motif
        if args.dump_frames:
            os.makedirs(args.dump_frames, exist_ok=True)
            base = os.path.splitext(os.path.basename(path))[0]
            tag = f"{base}_{c['t']:07.3f}_{c['verdict']}"
            for nom, img in (("avant", av), ("apres", ap)):
                img.resize((img.width * 3, img.height * 3)).save(
                    os.path.join(args.dump_frames, f"{tag}_{nom}.png"))
                plisse(img, rayon).resize((img.width * 3, img.height * 3)).save(
                    os.path.join(args.dump_frames, f"{tag}_{nom}_plisse.png"))
    res = {
        "fichier": path,
        "largeur": w, "hauteur": h, "duree_s": round(duree, 3), "fps": round(fps, 3),
        "rayon_flou_px": round(rayon, 2),
        "n_frames_signal": len(signal),
        "coupes": coupes,
    }
    if not crop:
        bandes = detecte_bandes(path, crop, duree)
        if bandes:
            res["bandes_inertes"] = bandes
    return res


def analyse_raccords(paths, args):
    """Plans separes : on juge le RACCORD entre la derniere frame de l'un et la premiere du suivant."""
    rayon = args.rayon if args.rayon else HAUTEUR_ANALYSE * RAYON_RATIO
    raccords = []
    for i in range(len(paths) - 1):
        a_path, b_path = paths[i], paths[i + 1]
        _, _, da, _ = probe(a_path)
        av = grab(a_path, max(da - args.recul, 0.0), args.crop, HAUTEUR_ANALYSE)
        ap = grab(b_path, args.recul, args.crop, HAUTEUR_ANALYSE)
        if av is None or ap is None:
            continue
        r = {
            "de": os.path.basename(a_path),
            "vers": os.path.basename(b_path),
            "type": "RACCORD",
        }
        r.update(mesure_paire(av, ap, rayon))
        v, motif = verdict(r, args.seuils)
        r["verdict"], r["motif"] = v, motif
        if args.dump_frames:
            os.makedirs(args.dump_frames, exist_ok=True)
            tag = f"raccord_{i + 1:02d}_{r['verdict']}"
            for nom, img in (("avant", av), ("apres", ap)):
                img.resize((img.width * 3, img.height * 3)).save(
                    os.path.join(args.dump_frames, f"{tag}_{nom}.png"))
                plisse(img, rayon).resize((img.width * 3, img.height * 3)).save(
                    os.path.join(args.dump_frames, f"{tag}_{nom}_plisse.png"))
        raccords.append(r)
    return {"mode": "raccords", "fichiers": [os.path.basename(p) for p in paths],
            "rayon_flou_px": round(rayon, 2), "coupes": raccords}


BADGE = {"INVISIBLE": "[INVISIBLE]", "BONNE": "[  BONNE  ]",
         "VIOLENTE": "[VIOLENTE ]", "INDETERMINE": "[   ???   ]"}


def affiche(res):
    print()
    if res.get("mode") == "raccords":
        print("RACCORDS ENTRE PLANS SEPARES  (" + " -> ".join(res["fichiers"]) + ")")
    else:
        print(f"SQUINT TEST A LA COUPE  -  {res['fichier']}")
        print(f"  {res['largeur']}x{res['hauteur']}  {res['duree_s']} s  "
              f"{res['fps']:.2f} fps  -  {res['n_frames_signal']} frames analysees")
        b = res.get("bandes_inertes")
        if b:
            larg = res["largeur"]
            px_g = int(b["gauche_pct"] / 100 * larg)
            px_d = int(b["droite_pct"] / 100 * larg)
            util = larg - px_g - px_d
            print()
            print(f"  ATTENTION bandes noires inertes detectees "
                  f"({b['gauche_pct']}% a gauche, {b['droite_pct']}% a droite).")
            print(f"  Elles sont identiques des deux cotes de chaque coupe : FIL les compte")
            print(f"  comme de la continuite et SURESTIME la qualite des raccords.")
            print(f"  Relancer avec :  --crop {util}:{res['hauteur']}:{px_g}:0")
    print(f"  rayon de plissement : {res['rayon_flou_px']} px "
          f"(equivalent 1/64 de la hauteur d'image)")
    print()
    coupes = res["coupes"]
    if not coupes:
        print("  Aucune coupe detectee.")
        return
    print(f"  {'TEMPS':>9}  {'TYPE':<8} {'DELTA':>6} {'FIL':>6}  VERDICT")
    print("  " + "-" * 74)
    for c in coupes:
        loc = (f"{c['de'][:9]}>{c['vers'][:9]}" if res.get("mode") == "raccords"
               else f"{c['t']:9.2f}")
        d = c.get("delta", float("nan"))
        f = c.get("fil", float("nan"))
        print(f"  {loc:>9}  {c['type']:<8} {d:6.1f} {f:6.1f}  "
              f"{BADGE.get(c['verdict'], c['verdict'])}")
    print()
    n = {}
    for c in coupes:
        n[c["verdict"]] = n.get(c["verdict"], 0) + 1
    print("  Bilan : " + "  ".join(f"{k} {v}" for k, v in sorted(n.items())))
    print()
    for c in coupes:
        if c["verdict"] in ("INVISIBLE", "VIOLENTE"):
            loc = (f"{c.get('de', '')} -> {c.get('vers', '')}" if res.get("mode") == "raccords"
                   else f"a {c['t']:.2f} s")
            print(f"  ! {loc} [{c['verdict']}] {c.get('motif', '')}")
            print(f"      lum {c.get('d_lum', 0):.1f}  couleur {c.get('d_couleur', 0):.1f}  "
                  f"composition {c.get('d_composition', 0):.1f}  "
                  f"detail {c.get('detail_avant', 0):.1f}/{c.get('detail_apres', 0):.1f}")
    print()


def main():
    p = argparse.ArgumentParser(
        description="Squint test a la coupe : detecte les coupes d'un montage et les classe "
                    "INVISIBLE / BONNE / VIOLENTE en simulant le plissement des yeux.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Exemples :\n"
               "  test-coupe.py montage.mp4\n"
               "  test-coupe.py ref.mp4 --crop 1920:1080:270:0   (retirer un watermark)\n"
               "  test-coupe.py plan01.mp4 plan02.mp4 plan03.mp4 (raccords entre plans separes)\n"
               "  test-coupe.py montage.mp4 --dump-frames /tmp/v (verifier les verdicts a l'oeil)\n")
    p.add_argument("videos", nargs="+", help="une video montee, ou N plans separes")
    p.add_argument("--crop", default=None,
                   help="recadrage ffmpeg L:H:X:Y applique avant toute mesure")
    p.add_argument("--rayon", type=float, default=None,
                   help="rayon du flou en px (defaut : 1/64 de la hauteur, soit ~2.8 sur l'image "
                        "d'analyse de 180 px)")
    p.add_argument("--recul", type=float, default=RECUL,
                   help=f"recul en s de part et d'autre de la coupe (defaut {RECUL})")
    p.add_argument("--seuil-franche", type=float, default=SEUIL_FRANCHE)
    p.add_argument("--seuil-douce", type=float, default=SEUIL_DOUCE)
    p.add_argument("--seuil-invisible", type=float, default=SEUIL_INVISIBLE)
    p.add_argument("--seuil-violent-delta", type=float, default=SEUIL_VIOLENT_DELTA)
    p.add_argument("--seuil-violent-fil", type=float, default=SEUIL_VIOLENT_FIL)
    p.add_argument("--dump-frames", default=None,
                   help="repertoire ou exporter les paires avant/apres (nettes et plissees)")
    p.add_argument("--json", action="store_true", help="sortie JSON")
    args = p.parse_args()

    for v in args.videos:
        if not os.path.isfile(v):
            sys.exit(f"Fichier introuvable : {v}")
    if not run(["ffprobe", "-version"]).stdout:
        sys.exit("ffprobe introuvable : installer ffmpeg")

    args.seuils = {"invisible": args.seuil_invisible,
                   "violent_delta": args.seuil_violent_delta,
                   "violent_fil": args.seuil_violent_fil}

    if len(args.videos) > 1:
        res = analyse_raccords(args.videos, args)
        if args.json:
            print(json.dumps(res, indent=2, ensure_ascii=False))
        else:
            affiche(res)
        return

    res = analyse(args.videos[0], args)
    if args.json:
        print(json.dumps(res, indent=2, ensure_ascii=False))
    else:
        affiche(res)


if __name__ == "__main__":
    main()
