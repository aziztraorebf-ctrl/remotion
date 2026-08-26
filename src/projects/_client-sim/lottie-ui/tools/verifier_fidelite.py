#!/usr/bin/env python3
"""
VERIFIE QU'UN LOTTIE RACONTE LA MEME HISTOIRE QUE LA SCENE REMOTION D'ORIGINE.

⛔ POURQUOI CET OUTIL EXISTE (le trou paye TROIS fois le 2026-08-26)
--------------------------------------------------------------------
Nos deux verificateurs existants valident chacun UNE MOITIE, et le trou est
exactement entre les deux :

  - compare_render.py  : Lottie  vs  SVG d'origine, mais a UNE SEULE frame.
    Or l'animation ne vient PAS du SVG (les interpolate y sont "cuits") : elle
    est ajoutee apres coup par animate_scene.py / transcribe_animation.py.
    La reference ne CONTIENT donc pas ce qu'on veut verifier.

  - check_animation.py : le Lottie compare a LUI-MEME d'une frame a l'autre.
    C'est de l'auto-coherence, pas de la fidelite. D'ou le piege du 26/08 :
    group_layers ignorait `ks`, 23 opacites et 9 traces etaient PERDUS, et
    l'outil disait quand meme "ca bouge" -- les frames restaient distinctes,
    elles racontaient simplement une AUTRE histoire.

Aucun des deux ne pouvait voir les 3 bugs du 26/08 (pointilles ignores,
animations perdues au regroupement, fondu en marches d'escalier). Chaque fois :
fichier valide + rapport content + rendu FAUX, trouve seulement a l'OEIL.

CE QUE FAIT CET OUTIL
---------------------
Il met les deux face a face SUR L'AXE DU TEMPS : la composition Remotion est
extraite a N frames (la verite), le Lottie est rendu aux N frames correspondantes,
et on compare frame i contre frame i.

DEUX MESURES DISTINCTES, et c'est le coeur de la methode :

  1. FIDELITE  -- Lottie[i] vs Remotion[i].
     Repond a "est-ce la meme image ?". Le refus se fait sur la PIRE frame,
     jamais sur la moyenne : 23 opacites perdues dans une scene dense se
     diluent dans une moyenne et passent inapercues. C'est precisement ainsi
     que le piege 2 est passe.

  2. AMPLITUDE -- Remotion[i]->Remotion[i+1] compare a Lottie[i]->Lottie[i+1].
     Repond a "est-ce que ca bouge AUTANT ?". Deux animations peuvent etre
     fideles frame par frame et l'une etre FIGEE si la reference bouge peu.
     C'est ce chiffre-la qui aurait crie "courbe FIGEE" au lieu de deux jours
     de silence. Un Lottie qui bouge a 10 % de l'amplitude voulue est REFUSE
     meme si chaque frame prise seule semble correcte.

Un ecran vide ne peut pas produire un faux succes : l'encre est mesuree par
frame des deux cotes (blanc vs blanc = 0 % d'ecart, le piege classique).

USAGE
    # depuis une composition Remotion (le cas normal)
    python3 verifier_fidelite.py <CompositionId> <anime.json> [--frames 0,60,120]

    # ou depuis des SVG de reference deja extraits
    python3 verifier_fidelite.py --refs "dossier/scene-f*.svg" <anime.json>

Sortie : un verdict ACCEPTE/REFUSE, un tableau par frame, et une planche
        de controle (Remotion | Lottie | differences) ligne par frame.
"""

import argparse
import glob
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile

ICI = pathlib.Path(__file__).resolve().parent

# Seuils de refus. Choisis par mesure sur la maison-gaz (piece validee par
# Aziz) : ils doivent ACCEPTER ce qui est deja approuve, sinon c'est l'outil
# qui a tort. Ajustables en ligne de commande.
SEUIL_PIRE_FRAME = 6.0      # % de pixels divergents sur la PIRE frame
SEUIL_AMPLITUDE = 0.45      # part minimale du mouvement d'origine restituee


def _trouver_lottie_js():
    for parent in ICI.parents:
        c = parent / "node_modules" / "lottie-web" / "build" / "player" / "lottie.min.js"
        if c.exists():
            return c
    return None


PAGE_LOTTIE = """<!doctype html><html><head><meta charset="utf-8"><style>
 html,body{margin:0;padding:0;background:#fff}
 #box{width:%(w)dpx;height:%(h)dpx;background:#fff}
</style><script>%(js)s</script></head><body><div id="box"></div><script>
 window.pret=false; window.anim=null;
 const a=lottie.loadAnimation({container:document.getElementById('box'),
   renderer:'svg',loop:false,autoplay:false,animationData:%(data)s});
 a.addEventListener('DOMLoaded',()=>{window.anim=a;window.pret=true;});
</script></body></html>"""

PAGE_SVG = """<!doctype html><html><head><meta charset="utf-8"><style>
 html,body{margin:0;padding:0;background:#fff}
 #box{width:%(w)dpx;height:%(h)dpx;background:#fff}
 #box svg{display:block;width:%(w)dpx;height:%(h)dpx}
</style></head><body><div id="box">%(svg)s</div>
<script>window.pret=true;</script></body></html>"""


# ------------------------------------------------------------------ extraction

def extraire_reference(composition, frames, dossier):
    """Appelle extract-remotion-svg.mjs UNE fois pour toutes les frames.

    Un seul appel : le bundle Remotion est la partie couteuse et l'extracteur
    reutilise deja le meme navigateur pour toutes les frames demandees.
    """
    script = ICI / "extract-remotion-svg.mjs"
    racine = ICI.parents[4]
    cmd = ["node", str(script), composition,
           "--frames", ",".join(str(f) for f in frames)]
    print(f"  extraction Remotion : {len(frames)} frames (bundle en cours, patienter)")
    res = subprocess.run(cmd, cwd=dossier, capture_output=True, text=True)
    # ⚠️ Un code de retour non nul ne veut PAS dire que rien n'a ete produit :
    # l'extracteur refuse individuellement les frames hors bornes (le balayage
    # temporel en demande volontairement) tout en ecrivant les autres. On juge
    # donc sur les FICHIERS presents, pas sur le code de retour.
    sortis = {}
    for f in frames:
        chemin = pathlib.Path(dossier) / f"{composition}-f{f}.svg"
        if chemin.exists():
            sortis[f] = chemin
    if not sortis:
        print(res.stdout)
        print(res.stderr, file=sys.stderr)
        raise RuntimeError("extraction Remotion echouee : aucune frame produite")
    hors = [f for f in frames if f not in sortis]
    if hors:
        print(f"  (frames hors bornes ignorees : {hors})")
    return sortis


def refs_depuis_motif(motif):
    """Recupere des SVG deja extraits, la frame etant lue dans le nom -fN.svg."""
    trouves = {}
    for chemin in sorted(glob.glob(motif)):
        m = re.search(r"-f(\d+)\.svg$", chemin)
        if m:
            trouves[int(m.group(1))] = pathlib.Path(chemin)
    if not trouves:
        raise RuntimeError(f"aucun SVG -fN.svg ne correspond a : {motif}")
    return trouves


# --------------------------------------------------------------------- rendus

def rendre_tout(doc, refs, dossier):
    """Rend, dans UN seul Chromium, le Lottie et les SVG de reference.

    Les deux cotes sont rendus a la MEME taille et par le MEME moteur : tout
    ecart mesure vient donc de la conversion, pas du navigateur.
    """
    from playwright.sync_api import sync_playwright
    js = _trouver_lottie_js()
    if not js:
        raise RuntimeError("lottie-web introuvable (npm i lottie-web)")

    w, h = int(doc["w"]), int(doc["h"])
    frames = sorted(refs)
    paires, erreurs = [], []

    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.on("pageerror", lambda e: erreurs.append(str(e)))

        # --- cote Lottie : une seule page, on deplace la tete de lecture
        pg.set_content(PAGE_LOTTIE % {"w": w, "h": h, "js": js.read_text(),
                                      "data": json.dumps(doc)}, wait_until="load")
        try:
            pg.wait_for_function("window.pret === true", timeout=20000)
        except Exception:
            # ⛔ Piege connu : deux `nm` identiques -> exception ASYNCHRONE dans
            # initExpressions, le player fige, DOMLoaded jamais emis, et il n'y
            # a NI erreur console NI pageerror. Le symptome est ce timeout.
            raise RuntimeError(
                "le Lottie ne s'est jamais charge (DOMLoaded jamais emis).\n"
                "    Cause connue : deux calques/formes portant le meme `nm` "
                "-- lottie-web en fait une cle d'objet et leve une exception "
                "asynchrone silencieuse.")

        lot = {}
        for f in frames:
            # La frame Lottie porte le meme numero que la frame Remotion :
            # la conversion conserve la base de temps (verifie plus bas).
            pg.evaluate(f"window.anim.goToAndStop({f}, true)")
            pg.wait_for_timeout(90)
            c = os.path.join(dossier, f"lot-{f:05d}.png")
            pg.locator("#box").screenshot(path=c)
            lot[f] = c

        # --- cote reference : le SVG resolu par Remotion a cette meme frame
        ref = {}
        for f in frames:
            pg.set_content(PAGE_SVG % {"w": w, "h": h,
                                       "svg": refs[f].read_text()}, wait_until="load")
            pg.wait_for_timeout(60)
            c = os.path.join(dossier, f"ref-{f:05d}.png")
            pg.locator("#box").screenshot(path=c)
            ref[f] = c

        nav.close()

    for f in frames:
        paires.append((f, ref[f], lot[f]))
    return paires, erreurs


# ------------------------------------------------------------------- mesures

def emprise_encre(png, seuil=248):
    """Boite englobante de l'encre d'une image (zone reellement dessinee).

    Sert a neutraliser le RECADRAGE : une piece livrable est presque toujours
    recadree serre (finir_piece.py), alors que la reference Remotion est le
    plan large d'origine. Comparer les deux tels quels gonfle l'ecart de ~10 %
    en pur artefact de cadrage -- mesure faite sur la maison-gaz, piece validee
    par Aziz : 12 % d'ecart alors que l'oeil confirme que le rendu est BON.
    Un outil qui crie au loup sur une piece correcte sera ignore le jour ou il
    aura raison.
    """
    from PIL import Image, ImageOps
    im = Image.open(png).convert("L")
    # L'encre est ce qui s'ecarte du fond ; le fond peut etre sombre OU clair.
    fond = im.getpixel((0, 0))
    masque = im.point(lambda v: 255 if abs(v - fond) > 12 else 0)
    return masque.getbbox()


def chercher_decalage(doc, frames, refs_dispo, dossier, ech, dec0):
    """MESURE le decalage temporel entre le Lottie et sa source, au lieu de le supposer.

    Une piece finie a ete retimee (finir_piece.py) : sa frame 100 ne correspond
    plus a la frame 100 de la composition. Comparer les numeros bruts produit
    alors un faux refus, et surtout un faux DIAGNOSTIC ("animation amortie"
    alors que le decalage est voulu).

    Methode : on rend le Lottie aux frames demandees, puis on cherche le
    decalage qui minimise l'ecart total contre les references disponibles.
    Le resultat est RAPPORTE -- c'est une information utile en soi : elle
    repond a "mon Lottie est-il en retard sur la scene d'origine ?".
    """
    from PIL import Image, ImageChops
    lot = rendre_lottie_seul(doc, frames, dossier)
    candidats = sorted(refs_dispo)
    meilleur, meilleur_score = dec0, None
    # On teste chaque decalage possible parmi les references extraites.
    for cand in candidats:
        d = cand - ech * frames[0]
        total = 0.0
        n = 0
        for f in frames:
            cible = int(round(ech * f + d))
            if cible not in refs_dispo:
                continue
            r = rendre_svg_seul(refs_dispo[cible], doc, dossier)
            a_, b_ = Image.open(r).convert("L"), Image.open(lot[f]).convert("L")
            if a_.size != b_.size:
                b_ = b_.resize(a_.size)
            diff = ImageChops.difference(a_, b_).getdata()
            total += sum(1 for v in diff if v > 16) / len(diff)
            n += 1
        if n and (meilleur_score is None or total / n < meilleur_score):
            meilleur_score, meilleur = total / n, d
    return round(meilleur)


def rendre_lottie_seul(doc, frames, dossier):
    """Rend le Lottie aux frames donnees (sert a la recherche de decalage)."""
    from playwright.sync_api import sync_playwright
    js = _trouver_lottie_js()
    w, h = int(doc["w"]), int(doc["h"])
    out = {}
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.set_content(PAGE_LOTTIE % {"w": w, "h": h, "js": js.read_text(),
                                      "data": json.dumps(doc)}, wait_until="load")
        pg.wait_for_function("window.pret === true", timeout=20000)
        for f in frames:
            pg.evaluate(f"window.anim.goToAndStop({f}, true)")
            pg.wait_for_timeout(80)
            c = os.path.join(dossier, f"srch-lot-{f:05d}.png")
            pg.locator("#box").screenshot(path=c)
            out[f] = c
        nav.close()
    return out


_CACHE_SVG = {}


def rendre_svg_seul(chemin_svg, doc, dossier):
    """Rend un SVG de reference a la taille du Lottie (avec cache)."""
    cle = str(chemin_svg)
    if cle in _CACHE_SVG:
        return _CACHE_SVG[cle]
    from playwright.sync_api import sync_playwright
    w, h = int(doc["w"]), int(doc["h"])
    c = os.path.join(dossier, "srch-ref-" + pathlib.Path(chemin_svg).stem + ".png")
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.set_content(PAGE_SVG % {"w": w, "h": h,
                                   "svg": pathlib.Path(chemin_svg).read_text()},
                       wait_until="load")
        pg.wait_for_timeout(60)
        pg.locator("#box").screenshot(path=c)
        nav.close()
    _CACHE_SVG[cle] = c
    return c


def union(boites):
    b = [x for x in boites if x]
    if not b:
        return None
    return (min(x[0] for x in b), min(x[1] for x in b),
            max(x[2] for x in b), max(x[3] for x in b))


def aligner_cadrage(paires):
    """Ramene les deux cotes a leur ZONE DESSINEE commune, normalisee.

    ⛔ Deux tentatives ratees avant celle-ci, meme famille d'erreur :
      1. emprise mesuree FRAME PAR FRAME. Sur une scene qui se dessine, la
         frame 60 ne montre qu'un fragment : l'echelle deduite partait dans le
         decor et la reference semblait bouger a 39 % -- c'etait mon recadrage
         qui gigotait. Le cadrage d'une piece est FIXE : il se mesure une fois,
         sur l'union des frames.
      2. recadrage rectangulaire de la reference vers le cadre Lottie. Il a
         DEBORDE de l'image source ; PIL a rempli en blanc, et ces bandes ont
         compte comme divergentes sur toute la largeur (+12 points d'ecart).
         Cause profonde : les deux cotes n'ont pas le meme RAPPORT D'ASPECT
         (1346x805 = 1,67 contre 1920x1080 = 1,78). Aucun recadrage rectangulaire
         ne peut les faire coincider -- je forcais une transformation qui
         n'existe pas.

    La seule comparaison geometriquement honnete : decouper de chaque cote la
    boite du DESSIN (union sur toutes les frames), et ramener les deux a une
    meme taille. On mesure alors le dessin, pas le cadre.
    """
    from PIL import Image
    br = union([emprise_encre(r) for _, r, _ in paires])
    bl = union([emprise_encre(l) for _, _, l in paires])
    if not br or not bl:
        return paires
    if min(br[2] - br[0], br[3] - br[1], bl[2] - bl[0], bl[3] - bl[1]) < 8:
        return paires
    # Deja le meme cadrage ? ne rien toucher (evite un resize inutile).
    ir0 = Image.open(paires[0][1])
    il0 = Image.open(paires[0][2])
    if ir0.size == il0.size and abs(br[0] - bl[0]) < 6 and abs(br[1] - bl[1]) < 6 \
       and abs((br[2] - br[0]) - (bl[2] - bl[0])) < 6:
        return paires

    taille = (bl[2] - bl[0], bl[3] - bl[1])     # on garde l'echelle du Lottie
    sorties = []
    for f, ref_png, lot_png in paires:
        r = Image.open(ref_png).crop(br).resize(taille)
        l = Image.open(lot_png).crop(bl).resize(taille)
        pr = ref_png.replace(".png", "-zone.png")
        pl = lot_png.replace(".png", "-zone.png")
        r.save(pr)
        l.save(pl)
        sorties.append((f, pr, pl))
    return sorties


def ecart(a, b, seuil=16):
    """% de pixels divergents entre deux PNG, et la carte des differences."""
    from PIL import Image, ImageChops
    ia = Image.open(a).convert("RGB")
    ib = Image.open(b).convert("RGB")
    if ia.size != ib.size:
        ib = ib.resize(ia.size)
    d = ImageChops.difference(ia, ib).convert("L")
    px = d.getdata()
    n = sum(1 for v in px if v > seuil)
    return 100.0 * n / len(px), d, ia, ib


def encre(png):
    """% de pixels non blancs -- detecte l'ecran vide (faux succes classique)."""
    from PIL import Image
    px = Image.open(png).convert("L").getdata()
    return 100.0 * sum(1 for v in px if v < 250) / len(px)


def mouvement(p1, p2):
    """% de pixels qui CHANGENT entre deux frames consecutives du meme cote.

    C'est la mesure d'AMPLITUDE : combien cette animation bouge-t-elle
    reellement, independamment de sa fidelite.
    """
    from PIL import Image, ImageChops
    ia = Image.open(p1).convert("L")
    ib = Image.open(p2).convert("L")
    if ia.size != ib.size:
        ib = ib.resize(ia.size)
    d = ImageChops.difference(ia, ib).getdata()
    return 100.0 * sum(1 for v in d if v > 16) / len(d)


def planche(lignes, sortie, largeur_max=460):
    """Planche de controle : une LIGNE par frame -- Remotion | Lottie | ecarts.

    L'oeil doit pouvoir trancher en un coup d'oeil : c'est lui qui a trouve
    les 3 bugs du 26/08, l'outil ne fait que le diriger vers la bonne frame.
    """
    from PIL import Image, ImageDraw
    if not lignes:
        return
    from PIL import Image as I
    w0, h0 = I.open(lignes[0]["ref_png"]).size
    ech = min(1.0, largeur_max / w0)
    w, h = int(w0 * ech), int(h0 * ech)
    marge = 22
    board = Image.new("RGB", (w * 3 + 24, (h + marge) * len(lignes)), "white")
    d = ImageDraw.Draw(board)
    for i, l in enumerate(lignes):
        y = i * (h + marge)
        ref = I.open(l["ref_png"]).convert("RGB").resize((w, h))
        lot = I.open(l["lot_png"]).convert("RGB").resize((w, h))
        board.paste(ref, (0, y + marge))
        board.paste(lot, (w + 12, y + marge))
        carte = l["diff"].resize((w, h))
        rouge = Image.new("RGB", (w, h), "white")
        rp, cp = rouge.load(), carte.load()
        for yy in range(h):
            for xx in range(w):
                if cp[xx, yy] > 16:
                    rp[xx, yy] = (220, 0, 0)
        board.paste(rouge, (w * 2 + 24, y + marge))
        etat = "OK" if l["ecart"] <= SEUIL_PIRE_FRAME else "ECART"
        d.text((3, y + 6), f"frame {l['frame']}   Remotion | Lottie | ecarts "
                           f"= {l['ecart']:.2f} %  {etat}", fill="black")
    board.save(sortie)


# ---------------------------------------------------------------------- main

def mode_serie(motif_svg, motif_json, sortie, seuil, sans_alignement):
    """Compare une SERIE de couples SVG/JSON, une frame chacun.

    C'est le cas reel quand on convertit une scene frame par frame (chaque
    frame extraite a son propre .json) : on mesure alors la fidelite STATIQUE
    de la conversion sur toute la duree, sans la melanger au timing. Repond a
    "que coute la conversion elle-meme ?", separement de "l'animation
    suit-elle ?".
    """
    from PIL import Image
    svgs, jsons = {}, {}
    for c in sorted(glob.glob(motif_svg)):
        m = re.search(r"-f(\d+)\.svg$", c)
        if m:
            svgs[int(m.group(1))] = pathlib.Path(c)
    for c in sorted(glob.glob(motif_json)):
        m = re.search(r"-?f(\d+)\.json$", c)
        if m:
            jsons[int(m.group(1))] = pathlib.Path(c)
    communes = sorted(set(svgs) & set(jsons))
    if not communes:
        print("ECHEC : aucune frame commune entre les SVG et les JSON",
              file=sys.stderr)
        print(f"  SVG  : {sorted(svgs)}", file=sys.stderr)
        print(f"  JSON : {sorted(jsons)}", file=sys.stderr)
        return 2

    print(f"serie : {len(communes)} frames comparees — {communes}")
    lignes = []
    with tempfile.TemporaryDirectory() as tmp:
        for f in communes:
            doc = json.loads(jsons[f].read_text(encoding="utf-8"))
            paires, erreurs = rendre_tout(doc, {0: svgs[f]}, tmp)
            # chaque .json est une image fixe : sa frame 0 porte le dessin
            _, ref_png, lot_png = paires[0]
            for e in erreurs[:2]:
                print(f"  [erreur js frame {f}] {e}")
            nref = ref_png.replace(".png", f"-s{f}.png")
            nlot = lot_png.replace(".png", f"-s{f}.png")
            os.rename(ref_png, nref)
            os.rename(lot_png, nlot)
            pr = [(f, nref, nlot)]
            if not sans_alignement:
                pr = aligner_cadrage(pr)
            _, rr, ll = pr[0]
            pct, carte, _, _ = ecart(rr, ll)
            lignes.append({"frame": f, "ecart": pct, "diff": carte,
                           "ref_png": rr, "lot_png": ll,
                           "encre_ref": encre(rr), "encre_lot": encre(ll),
                           "mv_ref": None, "mv_lot": None})
        planche(lignes, sortie)

    print()
    print(f"  {'frame':>6} {'ecart':>9} {'encre ref':>10} {'encre lot':>10}")
    for l in lignes:
        print(f"  {l['frame']:>6} {l['ecart']:>8.2f} % {l['encre_ref']:>9.1f} %"
              f" {l['encre_lot']:>9.1f} %{'  <<' if l['ecart'] > seuil else ''}")

    pire = max(lignes, key=lambda l: l["ecart"])
    moyen = sum(l["ecart"] for l in lignes) / len(lignes)
    print()
    print(f"  ecart moyen : {moyen:.2f} %")
    print(f"  PIRE frame  : {pire['ecart']:.2f} % (frame {pire['frame']})")
    print(f"  planche     : {sortie}   [SVG | Lottie | ecarts]")
    vides = [l["frame"] for l in lignes
             if l["encre_ref"] > 1.0 and l["encre_lot"] < 0.2]
    print()
    if vides:
        print(f"  ⛔ REFUSE — Lottie VIDE aux frames {vides}")
        return 1
    if pire["ecart"] > seuil:
        print(f"  ⛔ REFUSE — frame {pire['frame']} a {pire['ecart']:.2f} % "
              f"(> {seuil} %)")
        return 1
    print("  ✓ ACCEPTE — la conversion est fidele sur toutes les frames.")
    return 0


def main():
    ap = argparse.ArgumentParser(
        description="Compare un Lottie a sa scene Remotion d'origine, frame par frame.")
    ap.add_argument("composition", nargs="?",
                    help="CompositionId Remotion (ou --refs)")
    ap.add_argument("json", nargs="?",
                    help="le .json Lottie anime a verifier (inutile avec --serie)")
    ap.add_argument("--frames", help="liste de frames ; defaut : 8 reparties")
    ap.add_argument("--refs", help="motif de SVG deja extraits (scene-f*.svg)")
    ap.add_argument("-o", "--out", default="fidelite.png")
    ap.add_argument("--seuil", type=float, default=SEUIL_PIRE_FRAME)
    ap.add_argument("--seuil-amplitude", type=float, default=SEUIL_AMPLITUDE)
    ap.add_argument("--sans-alignement", action="store_true",
                    help="ne pas neutraliser le recadrage (comparer tel quel)")
    ap.add_argument("--temps", metavar="A:B",
                    help="frame Remotion = A * frame_Lottie + B. Necessaire des "
                         "que la piece a ete RETIMEE (finir_piece.py : amorce, "
                         "acceleration d'ouverture, tenue finale)")
    ap.add_argument("--serie", metavar="MOTIF_JSON",
                    help="compare une SERIE de couples SVG/JSON (un .json par "
                         "frame extraite) : mesure la fidelite de CONVERSION "
                         "seule, sans le timing. A utiliser avec --refs")
    ap.add_argument("--chercher-temps", action="store_true",
                    help="trouve le meilleur alignement temporel par mesure, "
                         "et le RAPPORTE (repond a : mon Lottie est-il en retard ?)")
    a = ap.parse_args()

    if a.serie:
        if not a.refs:
            print("ECHEC : --serie exige --refs", file=sys.stderr)
            return 2
        return mode_serie(a.refs, a.serie, a.out, a.seuil, a.sans_alignement)

    doc = json.loads(pathlib.Path(a.json).read_text(encoding="utf-8"))
    duree = int(doc.get("op", 60))

    if a.frames:
        frames = [int(x) for x in a.frames.split(",")]
    else:
        frames = [int(duree * i / 7) for i in range(8)]
        frames[-1] = max(0, duree - 1)
    hors = [f for f in frames if not (0 <= f < max(1, duree))]
    frames = sorted(set(f for f in frames if 0 <= f < max(1, duree)))
    if hors:
        print(f"  ⚠️ frames hors de la plage du Lottie (0..{duree - 1}), "
              f"ignorees : {hors}")

    # Base de temps : une piece FINIE n'a plus la meme que sa source (amorce,
    # ouverture acceleree, tenue). Comparer frame N a frame N est alors faux.
    ech, dec = 1.0, 0.0
    if a.temps:
        ech, dec = (float(x) for x in a.temps.split(":"))

    def vers_remotion(f):
        return int(round(ech * f + dec))

    print(f"{os.path.basename(a.json)} — {duree} frames @ {doc.get('fr')}fps")
    print(f"  frames verifiees : {frames}")
    if a.temps:
        print(f"  base de temps : Remotion = {ech:g} x Lottie + {dec:g}"
              f"  -> {[vers_remotion(f) for f in frames]}")

    with tempfile.TemporaryDirectory() as tmp:
        if a.refs:
            refs = refs_depuis_motif(a.refs)
            manquantes = [f for f in frames if f not in refs]
            if manquantes:
                print(f"  ⚠️ pas de reference pour {manquantes} — ignorees")
                frames = [f for f in frames if f in refs]
            refs = {f: refs[f] for f in frames}
        else:
            if not a.composition:
                print("ECHEC : donner un CompositionId ou --refs", file=sys.stderr)
                return 2
            # Balayage temporel : on extrait aussi les frames voisines pour
            # pouvoir MESURER le decalage au lieu de le supposer.
            besoin = sorted({vers_remotion(f) for f in frames})
            if a.chercher_temps:
                pas = max(2, int(duree * 0.04))
                for k in (-3, -2, -1, 1, 2, 3):
                    besoin += [vers_remotion(f) + k * pas for f in frames]
                besoin = sorted({f for f in besoin if f >= 0})
            brut = extraire_reference(a.composition, besoin, tmp)
            if a.chercher_temps:
                dec_trouve = chercher_decalage(doc, frames, brut, tmp, ech, dec)
                dec = dec_trouve
                print(f"  ⭐ decalage mesure : Remotion = {ech:g} x Lottie "
                      f"+ {dec:g}")
            refs = {}
            for f in frames:
                cible = vers_remotion(f)
                proche = min(brut, key=lambda r: abs(r - cible))
                refs[f] = brut[proche]

        paires, erreurs = rendre_tout(doc, refs, tmp)

        # Neutraliser le recadrage AVANT toute mesure (voir aligner_cadrage).
        if not a.sans_alignement:
            paires = aligner_cadrage(paires)

        lignes = []
        for f, ref_png, lot_png in paires:
            pct, carte, _, _ = ecart(ref_png, lot_png)
            lignes.append({"frame": f, "ecart": pct, "diff": carte,
                           "ref_png": ref_png, "lot_png": lot_png,
                           "encre_ref": encre(ref_png), "encre_lot": encre(lot_png)})

        # Amplitude : le mouvement reel de chaque cote, frame a frame.
        for i in range(len(lignes) - 1):
            lignes[i]["mv_ref"] = mouvement(lignes[i]["ref_png"], lignes[i + 1]["ref_png"])
            lignes[i]["mv_lot"] = mouvement(lignes[i]["lot_png"], lignes[i + 1]["lot_png"])
        if lignes:
            lignes[-1]["mv_ref"] = lignes[-1]["mv_lot"] = None

        planche(lignes, a.out)

    for e in erreurs[:3]:
        print(f"  [erreur js] {e}")

    print()
    print(f"  {'frame':>6} {'ecart':>9} {'encre ref':>10} {'encre lot':>10}"
          f" {'bouge ref':>10} {'bouge lot':>10}")
    for l in lignes:
        mr = f"{l['mv_ref']:.2f} %" if l["mv_ref"] is not None else "     -"
        ml = f"{l['mv_lot']:.2f} %" if l["mv_lot"] is not None else "     -"
        drapeau = "  <<" if l["ecart"] > a.seuil else ""
        print(f"  {l['frame']:>6} {l['ecart']:>8.2f} % {l['encre_ref']:>9.1f} %"
              f" {l['encre_lot']:>9.1f} % {mr:>10} {ml:>10}{drapeau}")

    # ---- verdict
    if not lignes:
        # ⛔ Un outil de controle qui CRASHE sera contourne. On explique.
        print("  ⛔ REFUSE — aucune frame n'a pu etre comparee.")
        print(f"     Le Lottie fait {duree} frames ; les frames demandees "
              f"tombent hors de cette plage, ou aucune reference ne leur "
              f"correspond.")
        print("     Verifier --frames, ou utiliser --serie pour comparer des "
              "couples SVG/JSON image par image.")
        return 1
    pire = max(lignes, key=lambda l: l["ecart"])
    moyen = sum(l["ecart"] for l in lignes) / len(lignes)
    mv_ref = sum(l["mv_ref"] for l in lignes if l["mv_ref"] is not None)
    mv_lot = sum(l["mv_lot"] for l in lignes if l["mv_lot"] is not None)
    part = (mv_lot / mv_ref) if mv_ref > 0.01 else 1.0

    print()
    print(f"  ecart moyen        : {moyen:.2f} %")
    print(f"  PIRE frame         : {pire['ecart']:.2f} % (frame {pire['frame']})")
    print(f"  amplitude restituee: {100*part:.0f} %  "
          f"(reference {mv_ref:.1f} % — Lottie {mv_lot:.1f} %)")
    print(f"  planche            : {a.out}   [Remotion | Lottie | ecarts]")

    motifs = []
    if pire["ecart"] > a.seuil:
        motifs.append(f"frame {pire['frame']} a {pire['ecart']:.2f} % "
                      f"(> {a.seuil} %) — regarder cette ligne de la planche")
    # Un ecran vide cote Lottie alors que la reference dessine : faux succes.
    for l in lignes:
        if l["encre_ref"] > 1.0 and l["encre_lot"] < 0.2:
            motifs.append(f"frame {l['frame']} : le Lottie est VIDE alors que "
                          f"la reference dessine ({l['encre_ref']:.1f} % d'encre)")
    if mv_ref > 0.5 and part < a.seuil_amplitude:
        motifs.append(f"le Lottie ne restitue que {100*part:.0f} % du mouvement "
                      f"d'origine (< {100*a.seuil_amplitude:.0f} %) — animation "
                      f"amortie ou perdue")

    print()
    if motifs:
        print("  ⛔ REFUSE")
        for m in motifs:
            print(f"     - {m}")
        return 1
    print("  ✓ ACCEPTE — le Lottie suit la scene d'origine sur toute la duree.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
