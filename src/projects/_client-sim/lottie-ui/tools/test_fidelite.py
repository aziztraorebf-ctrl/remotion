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
