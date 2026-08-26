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
