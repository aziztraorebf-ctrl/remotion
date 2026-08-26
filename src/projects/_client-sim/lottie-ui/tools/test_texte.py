#!/usr/bin/env python3
"""
Le TEXTE : ce qui passe, ce qui se degrade, et de combien -- MESURE.

⛔ POURQUOI CE FICHIER EXISTE : le rapport du convertisseur peut annoncer
"transportable a l'identique" sur un fichier qui rend faux (quatre fois cette
semaine). Les chiffres ci-dessous sont donc des MESURES de rendu, pas des
avis, et ils sont figes ici pour qu'une regression se voie.

    python3 test_texte.py            # tout
    python3 test_texte.py -v         # avec le detail

⭐ LE RESULTAT QUI TRANCHE POUR UN BRIEF CLIENT (2026-08-26, 960x540) :

    voie          police presente   police ABSENTE chez le lecteur
    vectorise         1,95 %              1,95 %   (indifferent)
    natif             0,05 %              5,74 %   (pire que ne rien porter)
    rien porte        4,76 %              4,76 %

  Le natif gagne QUAND la police est la, et perd contre "ne rien faire"
  quand elle ne l'est pas. Ce n'est donc pas un choix de qualite mais un
  choix de RISQUE : vectorise = fidele partout mais fige ; natif = parfait
  chez qui a la police, deforme ailleurs, et editable.

  ⚠️ Et l'ecart de 1,95 % du vectorise n'est PAS un decalage : apres erosion
  3x3 il tombe a 0,010 %, et le centre de gravite de l'encre est identique a
  0,02 px pres. C'est l'antialiasing d'un glyphe rendu en courbes contre un
  glyphe rendu par le moteur de texte -- invisible a l'oeil.
"""

import json
import os
import pathlib
import subprocess
import sys
import tempfile
import unittest

ICI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(ICI))

import svgtext                                                   # noqa: E402
import svg2lottie_scene as conv                                  # noqa: E402


# --- Sondes ------------------------------------------------------------------

# Uniquement des polices REELLEMENT installees (Georgia, Arial) : une sonde qui
# depend d'une police absente mesurerait la substitution, pas la conversion.
SONDE = """<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="#16213a"/>
  <text x="480" y="180" text-anchor="middle" font-family="Georgia" font-weight="bold"
        font-size="64" fill="#e8c57a">SOUVERAINETE</text>
  <text x="480" y="280" text-anchor="middle" font-family="Georgia" font-size="40"
        fill="#f0f0f0">Le gaz change de camp</text>
  <text x="480" y="360" text-anchor="middle" font-family="Georgia" font-size="40"
        fill="#f0f0f0">Accents : ÉÈÀÇÙ</text>
  <text x="60" y="460" font-family="Arial" font-size="34" fill="#9fb4d8">Ancrage gauche</text>
  <text x="900" y="460" text-anchor="end" font-family="Arial" font-weight="bold"
        font-size="34" fill="#9fb4d8">Ancrage droite</text>
</svg>
"""


def _convertir(svg_texte, mode):
    """Convertit une chaine SVG et rend (doc, rapport)."""
    with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False,
                                     encoding="utf-8") as f:
        f.write(svg_texte)
        chemin = f.name
    ancien = conv.MODE_TEXTE
    conv.MODE_TEXTE = mode
    try:
        return conv.convertir(chemin)
    finally:
        conv.MODE_TEXTE = ancien
        os.unlink(chemin)


class TrouverPolice(unittest.TestCase):

    def test_famille_reelle_trouvee(self):
        chemin, retenue, exacte, _i = svgtext.trouver_police(["Georgia"])
        self.assertIsNotNone(chemin, "Georgia est installee sur macOS")
        self.assertTrue(exacte)
        self.assertEqual(retenue, "Georgia")

    def test_generique_signale_comme_substitution(self):
        """serif -> Georgia, mais le rapport doit pouvoir dire que c'est un repli."""
        _c, _r, exacte, _i = svgtext.trouver_police(["PoliceQuiNExistePas", "serif"])
        self.assertFalse(exacte, "un generique CSS est une SUBSTITUTION")

    def test_gras_dans_une_collection_ttc(self):
        """
        ⛔ LA REGRESSION A EMPECHER : Helvetica.ttc contient 6 graisses dans UN
        fichier. Prendre fontNumber=0 rendait tous les titres en maigre --
        fichier valide, rapport content, titre faux (mesure : 2,69 % au lieu
        de 2,05 %). L'index doit differer entre normal et gras.
        """
        chemin, _r, _e, i_normal = svgtext.trouver_police(["Helvetica"])
        if chemin is None or not chemin.endswith(".ttc"):
            self.skipTest("pas de collection Helvetica sur cette machine")
        _c, _r2, _e2, i_gras = svgtext.trouver_police(["Helvetica"], gras=True)
        self.assertNotEqual(i_normal, i_gras,
                            "le gras d'un .ttc doit pointer une autre fonte")

    def test_police_introuvable_ne_ment_pas(self):
        chemin, _r, _e, _i = svgtext.trouver_police(["ZzzPoliceAbsente"])
        self.assertIsNone(chemin)


class Vectorisation(unittest.TestCase):

    def test_baseline_est_la_baseline(self):
        """
        L'attribut y d'un <text> est la LIGNE DE BASE, pas le haut du bloc.
        Une capitale doit donc s'etendre AU-DESSUS de y et s'y arreter.
        (Confondre les deux decale tout d'une hauteur de capitale.)
        """
        chemin, _r, _e, i = svgtext.trouver_police(["Georgia"])
        formes, _l, _m = svgtext.vectoriser("E", chemin, 100, 0, 300, "start")
        ys = [p[1] for f in formes for p in f["ks"]["k"]["v"]]
        self.assertAlmostEqual(max(ys), 300, delta=1.0,
                               msg="le bas du E doit toucher la baseline")
        self.assertLess(min(ys), 250, "le haut du E doit monter au-dessus")

    def test_ancrages(self):
        """start / middle / end placent le meme mot a trois endroits."""
        chemin, _r, _e, i = svgtext.trouver_police(["Georgia"])
        centres = {}
        for ancrage in ("start", "middle", "end"):
            formes, largeur, _m = svgtext.vectoriser(
                "Test", chemin, 40, 500, 100, ancrage)
            xs = [p[0] for f in formes for p in f["ks"]["k"]["v"]]
            centres[ancrage] = (min(xs) + max(xs)) / 2
        self.assertGreater(centres["start"], centres["middle"])
        self.assertGreater(centres["middle"], centres["end"])
        # middle doit etre centre sur x=500 a la tolerance des jambages pres
        self.assertAlmostEqual(centres["middle"], 500, delta=3.0)

    def test_accents_portes(self):
        """Les accents francais sont NON-NEGOTIABLES a l'ecran."""
        chemin, _r, _e, i = svgtext.trouver_police(["Georgia"])
        formes, _l, manquants = svgtext.vectoriser(
            "ÉÈÀÇÙ", chemin, 40, 0, 100)
        self.assertEqual(manquants, [], "aucun accent ne doit manquer")
        self.assertGreaterEqual(len(formes), 5)

    def test_glyphe_absent_signale(self):
        """Un caractere hors police est SIGNALE, pas dessine faux."""
        chemin, _r, _e, i = svgtext.trouver_police(["Georgia"])
        _f, _l, manquants = svgtext.vectoriser("A字B", chemin, 40, 0, 100)
        self.assertIn("字", manquants)

    def test_tangentes_relatives(self):
        """
        Convention Lottie : les tangentes sont RELATIVES a leur sommet. Des
        tangentes absolues donnent un fichier valide et des formes explosees.
        """
        chemin, _r, _e, i = svgtext.trouver_police(["Georgia"])
        formes, _l, _m = svgtext.vectoriser("O", chemin, 100, 500, 500)
        k = formes[0]["ks"]["k"]
        ampl = max(abs(c) for pt in (k["i"] + k["o"]) for c in pt)
        self.assertLess(ampl, 100,
                        "une tangente relative reste petite ; absolue elle "
                        "vaudrait ~500 (la position du sommet)")


class Conversion(unittest.TestCase):

    def test_vectorise_ne_refuse_plus_le_texte(self):
        doc, rapport = _convertir(SONDE, "vectorise")
        self.assertEqual(rapport.refus, [], "aucun refus attendu")
        self.assertEqual(len(doc["layers"]), 6, "1 fond + 5 textes")

    def test_natif_produit_des_calques_ty5_et_les_fontes(self):
        doc, _r = _convertir(SONDE, "natif")
        textes = [c for c in doc["layers"] if c.get("ty") == 5]
        self.assertEqual(len(textes), 5)
        # ⛔ Un ty:5 qui reference une fonte absente du tableau se rend VIDE.
        self.assertIn("fonts", doc)
        declarees = {f["fName"] for f in doc["fonts"]["list"]}
        for c in textes:
            ref = c["t"]["d"]["k"][0]["s"]["f"]
            self.assertIn(ref, declarees,
                          f"la fonte {ref} doit etre declaree, sinon rendu vide")

    def test_natif_previent_du_risque_police(self):
        """Le rapport DOIT dire que le rendu depend du lecteur."""
        _doc, rapport = _convertir(SONDE, "natif")
        raisons = " ".join(p for _q, p in rapport.approx)
        self.assertIn("police", raisons.lower())

    def test_natif_beaucoup_plus_leger(self):
        v = len(json.dumps(_convertir(SONDE, "vectorise")[0]))
        n = len(json.dumps(_convertir(SONDE, "natif")[0]))
        self.assertLess(n * 5, v, "le natif doit etre bien plus leger")

    def test_texte_vide_refuse(self):
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">'
               '<text x="10" y="10">   </text></svg>')
        _doc, rapport = _convertir(svg, "vectorise")
        self.assertTrue(rapport.refus, "un <text> vide doit etre signale")

    def test_police_heritee_du_groupe(self):
        """
        font-family se pose presque toujours sur un <g> parent. L'oublier
        rendait le texte dans une police par defaut SANS avertir.
        """
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">'
               '<g font-family="Georgia" font-size="40">'
               '<text x="10" y="100">Herite</text></g></svg>')
        doc, rapport = _convertir(svg, "natif")
        t = [c for c in doc["layers"] if c.get("ty") == 5][0]
        self.assertEqual(doc["fonts"]["list"][0]["fFamily"], "Georgia")
        self.assertEqual(t["t"]["d"]["k"][0]["s"]["s"], 40,
                         "la taille aussi s'herite")

    def test_transform_applique_au_texte(self):
        """Un <text> dans un <g transform> doit suivre la translation."""
        base = ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">'
                '<g font-family="Georgia" font-size="40">%s</g></svg>')
        sans = _convertir(base % '<text x="10" y="100">A</text>', "vectorise")[0]
        avec = _convertir(
            base % '<g transform="translate(50,0)"><text x="10" y="100">A</text></g>',
            "vectorise")[0]

        def gauche(doc):
            f = doc["layers"][0]["shapes"][0]["it"][0]
            return min(p[0] for p in f["ks"]["k"]["v"])

        self.assertAlmostEqual(gauche(avec) - gauche(sans), 50, delta=0.5)

    def test_pointilles_nm_uniques(self):
        """
        ⛔⛔ LA REGRESSION LA PLUS COUTEUSE A EMPECHER (2026-08-26).
        `nm` n'est PAS decoratif dans le tableau `d` d'un trait : lottie-web
        en fait une CLE D'OBJET (Object.defineProperty(dashOb, d[i].nm, ...),
        lottie.js v5.13 l.15497). Deux `nm` identiques -> "Cannot redefine
        property" jetee en ASYNCHRONE dans initExpressions : le player FIGE,
        DOMLoaded n'arrive jamais, et il n'y a NI erreur console NI pageerror.
        Un `nm` absent ne sauve pas non plus (cle "undefined", dupliquee).
        Symptome cote outil : compare_render.py part en TimeoutError.
        """
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">'
               '<path d="M 40 100 L 360 100" fill="none" stroke="#FFC742" '
               'stroke-width="6" stroke-dasharray="20 12 4 12"/></svg>')
        doc, _r = _convertir(svg, "vectorise")
        trait = [x for g in doc["layers"][0]["shapes"] for x in g["it"]
                 if x.get("ty") == "st"][0]
        self.assertIn("d", trait, "les pointilles doivent etre portes")
        noms = [e["nm"] for e in trait["d"]]
        self.assertTrue(all(noms), "aucun `nm` ne doit etre vide ou absent")
        self.assertEqual(len(noms), len(set(noms)),
                         f"les `nm` doivent etre UNIQUES, sinon le player fige : {noms}")
        # Le rendu ne lit que `n` et `v` : ils doivent rester justes.
        self.assertEqual([e["n"] for e in trait["d"]], ["d", "g", "d", "g"])
        self.assertEqual([e["v"]["k"] for e in trait["d"]], [20.0, 12.0, 4.0, 12.0])

    def test_dasharray_impair_double(self):
        """SVG : une liste impaire se repete deux fois ('5' = 5,5)."""
        self.assertEqual(conv._dasharray("5"), [5.0, 5.0])
        self.assertEqual(conv._dasharray("10 5 10"), [10.0, 5.0, 10.0] * 2)
        self.assertEqual(conv._dasharray("none"), [])
        self.assertEqual(conv._dasharray(None), [])

    def test_tspans_signales(self):
        """Fusionner des tspans est une APPROXIMATION : il faut le dire."""
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">'
               '<text x="10" y="100" font-family="Georgia" font-size="30">'
               'Un <tspan>deux</tspan> trois</text></svg>')
        _doc, rapport = _convertir(svg, "vectorise")
        self.assertTrue(any("tspan" in p for _q, p in rapport.approx))


if __name__ == "__main__":
    unittest.main(verbosity=2 if "-v" in sys.argv else 1)
