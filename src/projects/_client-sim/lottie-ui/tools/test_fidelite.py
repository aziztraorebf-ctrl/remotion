#!/usr/bin/env python3
"""
Tests de non-regression des deux defauts trouves le 2026-08-26 sur Khartoum.

⛔ POURQUOI CE FICHIER : les deux bugs ci-dessous etaient invisibles au rapport
du convertisseur (l'un classe en simple "approximation", l'autre jamais
signale) et n'ont ete trouves qu'en comparant le rendu a la scene d'origine.
Sans test, un refactor les fait revenir en silence -- c'est exactement
l'histoire de la semaine : fichier valide, rapport content, rendu faux.

    python3 test_fidelite.py
"""

import pathlib
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

ICI = Path(__file__).resolve().parent
sys.path.insert(0, str(ICI))

import svg2lottie_scene as S


def _st(xml, herite=None):
    return S.styles(ET.fromstring(xml), herite or {})


def test_opacite_de_groupe_se_multiplie():
    """L'opacite d'un groupe se COMPOSE avec celle de l'enfant (SVG/CSS).

    Bug reel : elle etait ECRASEE. Le groupe racine de KhartoumEtatMajorSVG est
    a opacity="0" en frame 0 (fondu d'ouverture) ; tout enfant portant sa propre
    opacite redevenait visible. Le Lottie dessinait 19,9 % d'encre la ou la
    source en montrait 0,5 %.
    """
    st = _st('<rect opacity="0.5"/>', {"opacity": "0.4"})
    assert abs(float(st["opacity"]) - 0.2) < 1e-9, st

    # Le cas qui a mordu : un parent a 0 rend l'enfant invisible, quoi qu'il porte.
    st = _st('<rect opacity="0.8"/>', {"opacity": "0"})
    assert float(st["opacity"]) == 0.0, st

    # Sans opacite propre, on herite telle quelle.
    st = _st('<rect fill="#f00"/>', {"opacity": "0.3"})
    assert float(st["opacity"]) == 0.3, st

    # Egalement via style="" et non seulement l'attribut.
    st = _st('<rect style="opacity:0.5"/>', {"opacity": "0.5"})
    assert abs(float(st["opacity"]) - 0.25) < 1e-9, st
    print("  ok  opacite de groupe : se multiplie, ne s'ecrase pas")


def test_motif_non_peint_plutot_que_gris_invente():
    """Un <pattern> non supporte ne doit RIEN peindre.

    Bug reel : replie sur un gris #808080 arbitraire, il se peignait OPAQUE
    par-dessus le fond beige de la carte (`background-base`, #d9c092) et
    l'effacait -- 82 % de l'image fausse pour UN element, pendant que le
    rapport le classait en "approximation" parmi six.
    """
    svg = ('<svg xmlns="http://www.w3.org/2000/svg">'
           '<defs><pattern id="grille" width="10" height="10"/></defs>'
           '<rect id="fond" width="100" height="100" fill="url(#grille)"/></svg>')
    root = ET.fromstring(svg)
    defs = S.gradients_complets(root)
    assert defs.get("grille", {}).get("motif") is True, defs

    rap = S.Rapport()
    st = {"fill": "url(#grille)", "_est_motif": True}
    formes = S.shapes_de_style(st, rap, "fond")
    peints = [f for f in formes if f.get("ty") in ("fl", "gf")]
    assert not peints, f"un motif ne doit rien peindre, obtenu : {peints}"
    print("  ok  motif : refuse et non peint (la couche du dessous reste visible)")


def test_url_inconnue_ne_peint_pas_de_couleur_inventee():
    """Un url(#x) qui ne designe rien de connu : ne pas inventer de couleur."""
    rap = S.Rapport()
    formes = S.shapes_de_style({"fill": "url(#fantome)"}, rap, "x")
    peints = [f for f in formes if f.get("ty") in ("fl", "gf")]
    assert not peints, f"aucune couleur ne doit etre inventee, obtenu : {peints}"
    print("  ok  url inconnue : rien de peint, rien d'invente")


def test_calque_non_attribue_garde_sa_place_et_son_nom():
    """Un calque qu'aucun groupe ne reclame ne doit PAS finir dans un sac.

    Bug reel (le 3e de regroupement en une semaine) : tous les non-attribues
    tombaient dans un unique groupe "divers", ajoute EN DERNIER dans l'ordre,
    donc peint AU-DESSUS de tout. Sur Khartoum ce sac contenait
    `background-base` -- un aplat beige OPAQUE plein cadre (opacite 100,
    bbox 0,0->1920,1080). Un aplat opaque au sommet occulte 100 % du cadre :
    la scene entiere disparaissait (1,30 % -> 11,90 % d'ecart) et la mesure
    devenait INSENSIBLE a l'ordre des autres groupes -- elle ne mesurait plus
    que "fond uni vs reference".
    """
    import group_layers as G

    def calque(nom, ind):
        return {"ty": 4, "ind": ind, "nm": nom,
                "ks": {"o": {"a": 0, "k": 100}},
                "shapes": [{"ty": "gr", "nm": nom, "it": [
                    {"ty": "fl", "nm": "fill", "c": {"a": 0, "k": [0, 0, 0, 1]},
                     "o": {"a": 0, "k": 100}, "r": 1}]}]}

    # ordre de peinture : le fond d'abord (indice le plus haut dans la liste
    # Lottie, ou l'indice 0 est AU-DESSUS).
    doc = {"w": 100, "h": 100, "op": 60, "fr": 30,
           "layers": [calque("cible-2", 0), calque("cible-1", 1),
                      calque("fond", 2)]}
    carte = {"_ordre": ["cible"], "cible": {"motifs": ["cible"]}}
    sortie, rapport = G.regrouper(doc, carte)

    noms = [c["nm"] for c in sortie["layers"]]
    assert "divers" not in noms, f"le sac 'divers' est de retour : {noms}"
    assert "fond" in noms, f"le calque isole a perdu son nom : {noms}"

    # Le fond doit rester SOUS le groupe : dans la liste Lottie, l'indice 0 est
    # au-dessus, donc le fond doit etre le DERNIER de la liste.
    assert noms[-1] == "fond", (
        f"le calque isole doit rester sous le groupe (peint en premier), "
        f"ordre obtenu : {noms}")
    print("  ok  calque isole : garde sa place dans l'ordre de peinture, et son nom")



# --- Le pochoir (track matte tt/td), 2026-08-29 --------------------------------
# ⛔ POURQUOI CES TESTS : un `clip-path` porte par un <g> -- la forme la plus
# courante dans un SVG d'export -- disparaissait EN SILENCE. Le rapport
# annoncait quand meme "transportable a l'identique", et l'ecart mesure ne le
# voyait pas non plus (une forme clipee et sa version non clipee se recouvrent
# largement). Trouve seulement par un test bout-en-bout sur de la geometrie
# professionnelle reelle.

def _convertir(svg_texte):
    with tempfile.TemporaryDirectory() as d:
        f = Path(d) / "t.svg"
        f.write_text(svg_texte, encoding="utf-8")
        doc, rapport = S.convertir(str(f))
        return doc, rapport


_CLIP = ('<defs><clipPath id="k"><circle cx="200" cy="200" r="90"/></clipPath></defs>')


def test_pochoir_sur_une_forme_emet_la_paire():
    doc, _ = _convertir(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">{_CLIP}'
        '<rect x="60" y="160" width="280" height="80" clip-path="url(#k)"/></svg>')
    ls = doc["layers"]
    assert len(ls) == 2, [l["nm"] for l in ls]
    assert ls[0].get("td") == 1, "le pochoir doit porter td:1"
    assert ls[1].get("tt") == 1, "le calque decoupe doit porter tt:1 (alpha)"


def test_pochoir_sur_un_groupe_nest_pas_perdu_en_silence():
    """Le bug du 2026-08-29 : la branche <g> retournait avant le traitement."""
    doc, rapport = _convertir(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">{_CLIP}'
        '<g clip-path="url(#k)"><rect x="60" y="160" width="280" height="80"/></g></svg>')
    ls = doc["layers"]
    assert any(l.get("td") == 1 for l in ls), \
        f"clip sur <g> PERDU : {[(l['nm'], l.get('td'), l.get('tt')) for l in ls]}"
    assert rapport.clips_vus == rapport.pochoirs_emis, \
        f"{rapport.clips_vus} clips vus / {rapport.pochoirs_emis} traites"


def test_la_paire_precede_immediatement_son_masque():
    """Lottie applique le matte au calque juste SOUS la decoupe."""
    doc, _ = _convertir(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">{_CLIP}'
        '<rect x="10" y="10" width="20" height="20"/>'
        '<rect x="60" y="160" width="280" height="80" clip-path="url(#k)"/></svg>')
    ls = doc["layers"]
    for i, l in enumerate(ls):
        if l.get("tt"):
            assert i > 0 and ls[i - 1].get("td") == 1, \
                f"tt:1 en position {i} sans td:1 juste au-dessus"
    assert [l["ind"] for l in ls] == list(range(len(ls))), \
        "ind doit rester monotone apres insertion du pochoir"


def test_clip_introuvable_est_declare_pas_silencieux():
    doc, rapport = _convertir(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
        '<rect x="60" y="160" width="280" height="80" clip-path="url(#absent)"/></svg>')
    assert rapport.clips_vus == 1, rapport.clips_vus
    assert rapport.clips_vus == rapport.pochoirs_emis, "une ref cassee doit etre DECLAREE"
    assert rapport.approx, "une reference introuvable est une approximation, pas un silence"



def test_precomp_un_clip_sur_un_groupe_de_N_calques():
    """
    ⛔ Le blocage mesure le 2026-08-29 sur une VRAIE piece : 1 pochoir sur 5
    passait. Un oeil n'est pas une forme, c'est 4 calques (globe, iris,
    pupille, reflet) -- et Lottie ne decoupe QU'UN calque par pochoir. Le
    groupe doit donc etre emballe dans une precomposition, et c'est le calque
    ty:0 qui porte le `tt`.
    """
    doc, rapport = _convertir(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">{_CLIP}'
        '<g clip-path="url(#k)">'
        '  <circle cx="200" cy="200" r="70"/>'
        '  <circle cx="200" cy="200" r="40"/>'
        '  <circle cx="185" cy="185" r="12"/>'
        '</g></svg>')
    ls = doc["layers"]
    assert doc["assets"], "un groupe de 3 calques doit produire une precomposition"
    asset = doc["assets"][0]
    assert len(asset["layers"]) == 3, [l["nm"] for l in asset["layers"]]
    precomp = [l for l in ls if l.get("ty") == 0]
    assert len(precomp) == 1, f"un seul calque ty:0 attendu, {len(precomp)}"
    assert precomp[0].get("tt") == 1, "c'est la PRECOMP qui porte le matte"
    assert precomp[0].get("refId") == asset["id"]
    i = ls.index(precomp[0])
    assert i > 0 and ls[i - 1].get("td") == 1, "le pochoir doit preceder la precomp"
    assert rapport.clips_vus == rapport.pochoirs_emis
    assert not [k for l in ls for k in l if k.startswith("_")], "residus de marquage"


def test_pochoirs_multiples_gardent_chacun_leur_paire():
    """
    ⛔ Mesure : quand deux pochoirs devenaient voisins dans le tableau,
    apparier « le calque suivant » faisait perdre sa paire a l'un des deux
    (head-shading la perdait quand decal etait replace). L'appariement se fait
    par NOM, jamais par position.
    """
    doc, _ = _convertir(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
        '<defs>'
        '  <clipPath id="a"><circle cx="120" cy="200" r="60"/></clipPath>'
        '  <clipPath id="b"><circle cx="280" cy="200" r="60"/></clipPath>'
        '</defs>'
        '<g clip-path="url(#a)"><rect x="60" y="160" width="120" height="80"/>'
        '  <rect x="70" y="170" width="40" height="40"/></g>'
        '<rect x="220" y="160" width="120" height="80" clip-path="url(#b)"/>'
        '</svg>')
    ls = doc["layers"]
    assert sum(1 for l in ls if l.get("tt")) == 2, \
        f"2 paires attendues : {[(l['nm'], l.get('td'), l.get('tt')) for l in ls]}"
    for i, l in enumerate(ls):
        if l.get("tt"):
            assert i > 0 and ls[i - 1].get("td") == 1, f"paire cassee en {i}"



# --- Le RIG : parentage + pivots (2026-08-29) ---------------------------------
# ⛔ POURQUOI : mesure sur un rig professionnel (Hiker du corpus, 32 calques) :
# 84 % des calques ont un `parent`, 90 % de l'animation est de la ROTATION sur
# des dessins figes, et l'ancre n'est deplacee QUE sur les calques qui tournent
# (13/13 deplacees ; 18 des 19 autres restent a [0,0]). SVG n'ayant aucune
# notion de parentage, il se DECLARE : data-parent + data-pivot.

_RIG = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
        '<g id="torse"><rect x="170" y="180" width="60" height="120"/></g>'
        '<g id="bras" data-parent="torse" data-pivot="haut">'
        '  <rect x="230" y="185" width="90" height="26"/></g>'
        '<g id="main" data-parent="bras" data-pivot="150,198">'
        '  <circle cx="330" cy="198" r="18"/></g></svg>')


def test_rig_chaine_de_parentage_resolue():
    doc, _ = _convertir(_RIG)
    par = {l["nm"].rsplit("-", 1)[0]: l for l in doc["layers"]}
    assert par["main"].get("parent") == par["bras"]["ind"], "main doit suivre bras"
    assert par["bras"].get("parent") == par["torse"]["ind"], "bras doit suivre torse"
    assert par["torse"].get("parent") is None, "la racine ne suit rien"


def test_rig_pivot_pose_et_position_compensee():
    """
    ⛔ Dans Lottie, `a` est le point de la forme qui vient se poser sur `p`.
    Deplacer `a` SEUL decale le dessin d'autant. Les deux doivent bouger
    ensemble — sinon le rig deplace le personnage au lieu de l'articuler.
    """
    doc, _ = _convertir(_RIG)
    par = {l["nm"].rsplit("-", 1)[0]: l for l in doc["layers"]}
    bras = par["bras"]
    a, p = bras["ks"]["a"]["k"], bras["ks"]["p"]["k"]
    assert a == p, f"ancre et position doivent coincider : a={a} p={p}"
    assert a != [0, 0], "un pivot declare doit etre pose"
    # "haut" = le milieu du bord SUPERIEUR de la boite (l'epaule)
    assert abs(a[0] - 275) < 1 and abs(a[1] - 185) < 1, a
    # un calque SANS rig garde [0,0], comme dans un fichier pro
    assert par["torse"]["ks"]["a"]["k"] == [0, 0]


def test_rig_parent_introuvable_est_declare():
    doc, rapport = _convertir(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
        '<g id="bras" data-parent="nexistepas"><rect x="10" y="10" width="50" height="20"/></g>'
        '</svg>')
    assert all(l.get("parent") is None for l in doc["layers"])
    assert rapport.refus, "un parent introuvable doit etre REFUSE, pas ignore en silence"


def test_parcours_vitesse_constante_et_deplacement_relatif():
    """La primitive 'parcourt' : vitesse reguliere, et un DELTA (pas un saut).

    Deux exigences, chacune payee ailleurs dans la chaine :

    1. Echantillonnage par LONGUEUR D'ARC, pas par parametre. Sur une Bezier,
       t=0,5 n'est pas le milieu du trajet : echantillonner en t donne un objet
       qui ralentit dans les courbes et accelere dans les lignes droites, sans
       que personne l'ait demande.
    2. On anime un DELTA depuis le premier point, jamais la position absolue.
       Un calque converti porte sa geometrie en coordonnees absolues avec `p`
       a [0,0] : poser les points du chemin dans `p` TELEPORTERAIT l'objet au
       depart du trajet, en cumulant sa position propre et celle du chemin.
       Meme famille que "la flamme ne s'anime pas" (25/08) : une transformation
       posee a cote de la forme au lieu d'etre calee dessus.
    """
    import animate_scene as A

    pts = A.points_du_chemin("M100 500 Q 400 300 700 500", 9)
    d = [((pts[i+1][0]-pts[i][0])**2 + (pts[i+1][1]-pts[i][1])**2) ** 0.5
         for i in range(len(pts) - 1)]
    moy = sum(d) / len(d)
    ecart = (max(d) - min(d)) / moy
    assert ecart < 0.05, f"vitesse irreguliere : ecart {100*ecart:.1f} % entre segments"

    couche = {"nm": "jeton", "ks": {}}
    assert A.parcourir(couche, "M100 500 Q 400 300 700 500", 0, 100)
    kf = couche["ks"]["p"]["k"]
    assert kf[0]["s"][:2] == [0.0, 0.0], (
        f"le 1er point doit etre un delta NUL (sinon l'objet saute) : {kf[0]['s']}")
    # le dernier delta vaut le vecteur depart->arrivee
    assert abs(kf[-1]["s"][0] - 600) < 2, f"arrivee attendue a +600 en x : {kf[-1]['s']}"
    assert abs(kf[-1]["s"][1] - 0) < 2, f"arrivee attendue a +0 en y : {kf[-1]['s']}"
    print("  ok  parcours : vitesse constante, deplacement relatif")


def test_onde_et_monte_par_le_vrai_chemin():
    """Les primitives narratives, testees PAR `animer()` et non en direct.

    ⛔ La lecon qui a motive ce test : `parcourt` a ete livre avec une branche
    de dispatch referencant des variables INEXISTANTES (`n_animes`, `ks`). Le
    test d'alors appelait la fonction `parcourir()` directement -- il passait au
    vert pendant que le chemin reel etait casse. La brique etait bonne, son
    AIGUILLAGE etait faux : exactement la famille de defauts que cette chaine
    passe son temps a rattraper. On teste donc `animer()`, la porte d'entree.
    """
    import animate_scene as A

    def calque(nom, cx, cy, r=15):
        v = [[cx-r, cy-r], [cx+r, cy-r], [cx+r, cy+r], [cx-r, cy+r]]
        return {"ty": 4, "ind": 0, "nm": nom, "ip": 0, "op": 120,
                "ks": {"a": {"a": 0, "k": [0, 0]}, "p": {"a": 0, "k": [0, 0]},
                       "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0},
                       "o": {"a": 0, "k": 100}},
                "shapes": [{"ty": "gr", "nm": nom, "it": [
                    {"ty": "sh", "ks": {"a": 0, "k": {"c": True, "v": v,
                     "i": [[0, 0]]*4, "o": [[0, 0]]*4}}}]}]}

    doc = {"fr": 30, "ip": 0, "op": 120, "w": 800, "h": 600,
           "layers": [calque("jeton", 100, 500), calque("anneau", 400, 300),
                      calque("volute", 650, 450)]}
    animes, ignores = A.animer(doc, {
        "_duree": 120,
        "jeton": ("parcourt", 0, 110, "M100 500 Q 400 300 700 500"),
        "anneau": ("onde", 10, 70, 8.0),
        "volute": ("monte", 0, 120, 80, 60),
    })
    assert (animes, ignores) == (3, 0), f"dispatch casse : {animes} animes, {ignores} ignores"

    jeton, anneau, volute = doc["layers"]
    assert jeton["ks"]["p"].get("a") == 1, "parcourt n'a pas anime la position"
    assert anneau["ks"]["s"].get("a") == 1, "onde n'a pas anime l'echelle"
    assert anneau["ks"]["o"]["k"][-1]["s"] == [0], (
        "l'onde doit s'effacer completement, sinon c'est un cercle")

    # ⛔ La volute doit monter depuis SA position, pas depuis le coin de l'ecran.
    kf = volute["ks"]["p"]["k"]
    assert kf[0]["s"][0] == 650.0 and kf[0]["s"][1] == 450.0, (
        f"la volute part du coin au lieu de sa place : {kf[0]['s']}")
    assert kf[1]["s"][1] < kf[0]["s"][1], "la volute doit MONTER (y decroissant)"

    # ⚠️ Jamais deux keyframes au meme instant : mal defini pour le lecteur.
    for prop in ("p", "s", "o"):
        ts = [k["t"] for k in volute["ks"][prop]["k"]]
        assert len(ts) == len(set(ts)), f"keyframes en collision sur {prop} : {ts}"
    print("  ok  onde + monte : dispatch reel, referentiel correct, pas de collision")


def test_onde_opacite_suit_l_expansion():
    """L'onde doit etre VISIBLE : son pic d'opacite tombe quand elle est large.

    ⛔ Lottie met le CONTOUR a l'echelle en meme temps que la forme. A 8 %
    d'echelle, un trait de 4 px n'en fait plus que 0,3 : invisible. Si
    l'opacite culmine pendant que l'anneau est encore minuscule, l'onde ne se
    voit JAMAIS -- opaque quand elle est trop petite, transparente quand elle
    est enfin grande. Mesure sur Khartoum : pic a 18 % de la duree = anneau de
    rayon ~33 px sur une carte 1920, masque par le batiment. Les keyframes
    etaient toutes "correctes" prises une par une ; c'est leur COORDINATION
    qui etait fausse.
    """
    import animate_scene as A

    couche = {"nm": "onde", "ks": {}}
    A.onde(couche, 100, rayon_fin=13.0, duree=55)
    ech = couche["ks"]["s"]["k"]
    opa = couche["ks"]["o"]["k"]

    t_pic = max(opa, key=lambda k: k["s"][0])["t"]
    t0, t1 = ech[0]["t"], ech[-1]["t"]
    s0, s1 = ech[0]["s"][0], ech[-1]["s"][0]
    # echelle atteinte au moment du pic (interpolation lineaire suffit ici)
    part = (t_pic - t0) / float(t1 - t0)
    taille = s0 + (s1 - s0) * part
    assert taille > 40, (
        f"au pic d'opacite l'onde n'est qu'a {taille:.0f} % de sa taille : "
        f"elle sera invisible")
    assert opa[-1]["s"] == [0], "l'onde doit s'eteindre completement"
    print("  ok  onde : le pic d'opacite tombe quand l'anneau est large")


def test_image_raster_portee_et_redimensionnee():
    """Les <image> sont portees en asset Lottie, a leur taille d'AFFICHAGE.

    ⭐ Ce n'etait PAS une limite du format : Lottie a un type d'asset image
    officiel. La table disait « alourdit beaucoup » -- vrai pour une image
    embarquee A SA TAILLE SOURCE, faux une fois redimensionnee. Mesure sur
    portrait-rsf.png : 1024x1024 pour un affichage 32x32, soit 1504 Ko en
    base64 tel quel contre 3 Ko a la bonne taille. Facteur 500.
    Meme diagnostic que le flou le 28/08 : le format savait, on n'emettait rien.
    """
    import base64
    import io
    import json
    import subprocess
    import tempfile
    from PIL import Image

    outil = ICI / "svg2lottie_scene.py"
    src = ICI.parents[4] / "public/_shared/sprites/warmap/portrait-rsf.png"
    if not src.is_file():
        print("  --  image de test absente, test ignore")
        return

    im = Image.open(src).convert("RGBA").resize((128, 128), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, "PNG", optimize=True)
    uri = "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" '
           'viewBox="0 0 400 300"><rect width="400" height="300" fill="#eee"/>'
           f'<image id="p" x="150" y="80" width="64" height="64" href="{uri}"/></svg>')

    with tempfile.TemporaryDirectory() as tmp:
        f_svg = pathlib.Path(tmp) / "t.svg"
        f_json = pathlib.Path(tmp) / "t.json"
        f_svg.write_text(svg)
        subprocess.run(["python3", str(outil), str(f_svg), "-o", str(f_json)],
                       capture_output=True)
        doc = json.loads(f_json.read_text())

    imgs = [a for a in doc.get("assets", []) if str(a.get("p", "")).startswith("data:image")]
    assert imgs, "aucun asset image produit"
    calques = [l for l in doc["layers"] if l.get("ty") == 2]
    assert calques, "aucun calque image (ty:2)"
    assert calques[0]["refId"] == imgs[0]["id"], "le calque ne reference pas l'asset"

    # ⛔ redimensionnee a la taille d'AFFICHAGE (x2 de confort), jamais la source
    assert imgs[0]["w"] <= 64 * 2, (
        f"image non redimensionnee : {imgs[0]['w']} px pour un affichage 64 px")
    print("  ok  image raster : portee en asset, redimensionnee a l'affichage")


def test_parcours_respecte_la_position_deja_posee():
    """`parcourt` part de la position DEJA POSEE, pas de zero.

    ⛔ Deux referentiels coexistent dans un meme fichier :
      - un calque de FORMES converti a `p` = [0,0], sa geometrie portant deja
        les coordonnees absolues ;
      - un calque IMAGE (ty:2) porte sa position reelle dans `p`.
    Ecraser `p` par un delta partant de zero envoie donc l'image AU COIN DE
    L'ECRAN. Mesure du 2026-08-30 : les medaillons de Khartoum se deplacaient
    correctement mais leur PHOTO partait de [0,0] -- invisible hors cadre, et
    le disque ivoire arrivait VIDE sur la cible. Meme famille que le bug de
    `monte` : la valeur est juste, son REFERENTIEL est faux.
    """
    import animate_scene as A

    CHEMIN = "M100 500 Q 400 300 700 500"

    # calque de formes : p a [0,0] -> le delta part de zero
    forme = {"nm": "jeton", "ks": {"p": {"a": 0, "k": [0, 0]}}}
    A.parcourir(forme, CHEMIN, 0, 100)
    assert forme["ks"]["p"]["k"][0]["s"][:2] == [0.0, 0.0], "forme : delta attendu"

    # calque image : p porte sa position -> elle doit etre CONSERVEE
    image = {"nm": "photo", "ty": 2, "ks": {"p": {"a": 0, "k": [1720, 910, 0]}}}
    A.parcourir(image, CHEMIN, 0, 100)
    kf = image["ks"]["p"]["k"]
    assert kf[0]["s"][:2] == [1720.0, 910.0], (
        f"l'image doit partir de SA position, obtenu {kf[0]['s'][:2]}")
    # et arriver a sa position + le vecteur du trajet (600 en x)
    assert abs(kf[-1]["s"][0] - (1720 + 600)) < 2, (
        f"arrivee attendue a 2320, obtenu {kf[-1]['s'][0]}")
    print("  ok  parcours : la position deja posee est conservee")


def test_pochoirs_imbriques_gardent_leur_role():
    """Un pochoir DANS une precomposition reste un pochoir.

    ⛔ Les roles etaient EXCLUSIFS (if/elif) : marquer un calque « dans-precomp »
    ECRASAIT son role de « decoupe ». Or les deux se cumulent des que deux clips
    sont IMBRIQUES -- l'exterieur emballe la scene, les interieurs se retrouvent
    dedans. Le pochoir perdait son `td` et se peignait comme une FORME VISIBLE.
    Mesure sur EtatMajorGabarit : le medaillon clipe toute la carte, donc les 2
    clips de balayage des zones sortaient en RECTANGLES BLANCS opaques par-dessus
    le dessin -- 13,66 % d'ecart pendant que le rapport annoncait « transportable
    a l'identique ». Corrige : 13,66 % -> 0,25 %.
    """
    import json
    import subprocess
    import tempfile

    outil = ICI / "svg2lottie_scene.py"
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" '
           'viewBox="0 0 200 200">'
           '<defs>'
           '<clipPath id="dehors"><circle cx="100" cy="100" r="90"/></clipPath>'
           '<clipPath id="dedans"><rect x="20" y="20" width="80" height="60"/></clipPath>'
           '</defs>'
           '<g clip-path="url(#dehors)">'
           '  <rect width="200" height="200" fill="#ddd"/>'
           '  <g clip-path="url(#dedans)"><rect x="0" y="0" width="200" height="200" fill="#c33"/></g>'
           '</g></svg>')

    with tempfile.TemporaryDirectory() as tmp:
        f_svg = pathlib.Path(tmp) / "t.svg"
        f_json = pathlib.Path(tmp) / "t.json"
        f_svg.write_text(svg)
        subprocess.run(["python3", str(outil), str(f_svg), "-o", str(f_json)],
                       capture_output=True)
        doc = json.loads(f_json.read_text())

    # le pochoir interieur vit dans la precomp : il doit y garder td=1
    interieurs = []
    for a in doc.get("assets", []):
        interieurs += [l for l in a.get("layers", []) if "pochoir" in str(l.get("nm"))]
    assert interieurs, "aucun pochoir dans la precomposition"
    assert all(l.get("td") == 1 for l in interieurs), (
        f"un pochoir imbrique a perdu son td : "
        f"{[(l.get('nm'), l.get('td')) for l in interieurs]}")
    print("  ok  pochoir imbrique : garde son role de decoupe dans la precomp")


def main():
    print("test_fidelite — non-regression des defauts Khartoum (2026-08-26)")
    echecs = 0
    for nom, fn in sorted(globals().items()):
        if nom.startswith("test_") and callable(fn):
            try:
                fn()
            except AssertionError as e:
                print(f"  ECHEC  {nom} : {e}")
                echecs += 1
    print()
    if echecs:
        print(f"⛔ {echecs} test(s) en echec")
        return 1
    print("✓ tous les tests passent")
    return 0


if __name__ == "__main__":
    sys.exit(main())
