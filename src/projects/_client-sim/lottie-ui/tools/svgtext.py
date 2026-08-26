#!/usr/bin/env python3
"""
Le TEXTE d'un SVG vers Lottie -- les DEUX voies, parce qu'elles ne livrent
pas la meme chose au client.

  VECTORISE (`vectoriser`)  : chaque glyphe devient des courbes. Fidele au
                              pixel, aucune dependance a une police chez le
                              lecteur, mais le client ne peut plus editer le
                              mot. C'est ce que la table de decision annonce
                              deja aujourd'hui.

  NATIF (`calque_natif`)    : un calque Lottie `ty:5` avec un TextDocument.
                              Le client PEUT rouvrir et changer le texte dans
                              Creator / After Effects -- mais le rendu depend
                              alors de la police disponible chez le lecteur.

⛔ CE QUE LA MESURE A TRANCHE (2026-08-26, sonde-texte.svg, 960x540) :
   Nos scenes ecrivent en Georgia (412 usages), Arial, Cinzel, Arial Black.
   AUCUNE de ces familles n'est dans les 17 que Creator embarque (releve par
   `list_fonts` : Inter, Roboto, Merriweather, Poppins...). Un calque natif
   pose avec `font_family: "Georgia"` s'affiche donc correctement ICI (macOS
   a Georgia) et se degrade en fonte de repli chez un client qui ne l'a pas.
   -> Le natif est un choix d'EDITABILITE, pas de fidelite. Voir le rapport.

⛔ PIEGE DE FAMILLE (le meme qui a coute 4 fois cette semaine) : un calque
   dont la geometrie est juste mais l'AIGUILLAGE faux produit un fichier
   valide et un ecran vide. Ici l'aiguillage risque est l'ANCRE : les glyphes
   sont convertis en coordonnees ABSOLUES de la scene, donc le calque doit
   rester a l'origine (a=p=0). Ne pas "recentrer" -- cf. `calque_vectorise`.
"""

import os
import re

from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont


# ---------------------------------------------------------------------------
# Trouver le fichier de police qui correspond a une declaration CSS
# ---------------------------------------------------------------------------

# Les dossiers ou macOS range ses polices, du plus specifique au plus general.
DOSSIERS_POLICES = (
    os.path.expanduser("~/Library/Fonts"),
    "/Library/Fonts",
    "/System/Library/Fonts/Supplemental",
    "/System/Library/Fonts",
)

# Familles generiques CSS -> une police reelle presente sur le systeme.
# ⚠️ C'est un REPLI, pas une equivalence : on le signale dans le rapport.
GENERIQUES = {
    "serif": "Georgia",
    "sans-serif": "Helvetica",
    "monospace": "Menlo",
    "cursive": "Apple Chancery",
    "fantasy": "Papyrus",
}


def familles_css(valeur):
    """'Georgia, serif' -> ['Georgia', 'serif'] (guillemets retires)."""
    if not valeur:
        return []
    return [f.strip().strip('"\'') for f in str(valeur).split(",") if f.strip()]


def _gras(poids):
    """font-weight CSS -> booleen. 'bold', '700', 800... = gras."""
    if poids is None:
        return False
    p = str(poids).strip().lower()
    if p in ("bold", "bolder"):
        return True
    try:
        return int(p) >= 600
    except ValueError:
        return False


def _italique(style):
    return str(style or "").strip().lower() in ("italic", "oblique")


def _candidats(famille, gras, ital):
    """Noms de fichiers plausibles, du plus precis au plus lache."""
    suffixes = []
    if gras and ital:
        suffixes = [" Bold Italic", "-BoldItalic", " BoldItalic"]
    elif gras:
        suffixes = [" Bold", "-Bold"]
    elif ital:
        suffixes = [" Italic", "-Italic"]
    suffixes.append("")                      # la variante Regular en dernier
    noms = []
    for s in suffixes:
        for ext in (".ttf", ".otf", ".ttc"):
            noms.append(f"{famille}{s}{ext}")
            noms.append(f"{famille.replace(' ', '')}{s.replace(' ', '')}{ext}")
    return noms


def _index_dans_collection(chemin, gras, ital):
    """
    ⛔ LE PIEGE QUI A FAIT RENDRE UN TITRE MAIGRE (mesure 2026-08-26).
    macOS range Helvetica, Arial et bien d'autres dans des `.ttc` : UN fichier
    qui contient TOUTES les graisses (Helvetica.ttc = Regular, Bold, Oblique,
    Bold Oblique, Light, Light Oblique). Ouvrir un .ttc sans preciser lequel
    prend le n°0 -- donc toujours le Regular. Le gras etait la, dans le
    fichier, et on ne le demandait pas : meme famille de faute que les 4
    autres de la semaine (l'element est correct, l'aiguillage l'annule).
    Rend l'index de la fonte demandee, 0 si on ne trouve pas mieux.
    """
    if not chemin.lower().endswith(".ttc"):
        return 0
    from fontTools.ttLib import TTCollection
    vise_gras = bool(gras)
    vise_ital = bool(ital)
    try:
        col = TTCollection(chemin, lazy=True)
    except Exception:
        return 0
    repli = 0
    try:
        for i, f in enumerate(col.fonts):
            sous = (f["name"].getDebugName(2) or "").lower()
            est_gras = "bold" in sous
            # macOS ecrit tantot "Italic", tantot "Oblique".
            est_ital = "italic" in sous or "oblique" in sous
            if est_gras == vise_gras and est_ital == vise_ital:
                return i
    except Exception:
        return repli
    finally:
        try:
            col.close()
        except Exception:
            pass
    return repli


def trouver_police(familles, gras=False, ital=False):
    """
    Rend (chemin, famille_retenue, exacte, index) ou (None, None, False, 0).
    `exacte` est faux quand on a du passer par un generique CSS -- le rapport
    doit le dire : c'est une SUBSTITUTION, pas un portage.
    `index` designe la fonte a l'interieur d'un .ttc (voir ci-dessus).
    """
    for famille in familles:
        reelle = GENERIQUES.get(famille.lower(), famille)
        exacte = reelle == famille
        for dossier in DOSSIERS_POLICES:
            if not os.path.isdir(dossier):
                continue
            fichiers = os.listdir(dossier)
            plats = {f.lower(): f for f in fichiers}
            for cand in _candidats(reelle, gras, ital):
                vrai = plats.get(cand.lower())
                if vrai:
                    chemin = os.path.join(dossier, vrai)
                    return (chemin, famille, exacte,
                            _index_dans_collection(chemin, gras, ital))
    return None, None, False, 0


# ---------------------------------------------------------------------------
# Glyphes -> chemins
# ---------------------------------------------------------------------------

class _PenChemin(BasePen):
    """
    Collecte les contours d'un glyphe au format que `svgpath.parse_path`
    attend en sortie : des listes de sommets avec tangentes RELATIVES.

    Les polices TrueType sont en quadratique ; BasePen les convertit en
    cubiques pour nous (`_qCurveToOne` -> `curveTo`), ce qui tombe juste :
    Lottie ne connait que les cubiques.
    """

    def __init__(self, glyphSet, echelle, dx, dy):
        super().__init__(glyphSet)
        self.echelle = echelle
        self.dx, self.dy = dx, dy
        self.contours = []
        self._cur = None
        self._depart = None

    def _pt(self, p):
        # y s'inverse : les polices montent, l'ecran descend.
        return (p[0] * self.echelle + self.dx, -p[1] * self.echelle + self.dy)

    def _moveTo(self, p):
        self._fermer()
        self._depart = self._pt(p)
        self._cur = {"v": [self._depart], "i": [(0.0, 0.0)], "o": [(0.0, 0.0)]}

    def _lineTo(self, p):
        if self._cur is None:
            self._moveTo(p)
            return
        self._cur["v"].append(self._pt(p))
        self._cur["i"].append((0.0, 0.0))
        self._cur["o"].append((0.0, 0.0))

    def _curveToOne(self, c1, c2, p):
        if self._cur is None:
            self._moveTo(p)
            return
        a = self._cur["v"][-1]
        b1, b2, fin = self._pt(c1), self._pt(c2), self._pt(p)
        # Tangentes RELATIVES a leur sommet, convention Lottie.
        self._cur["o"][-1] = (b1[0] - a[0], b1[1] - a[1])
        self._cur["v"].append(fin)
        self._cur["i"].append((b2[0] - fin[0], b2[1] - fin[1]))
        self._cur["o"].append((0.0, 0.0))

    def _closePath(self):
        self._fermer()

    def _endPath(self):
        self._fermer()

    def _fermer(self):
        cur = self._cur
        self._cur = None
        if not cur or len(cur["v"]) < 2:
            return
        # Un contour ferme dont le dernier sommet retombe sur le premier :
        # on fusionne pour ne pas laisser un sommet double (qui casse
        # l'interpolation si la forme est animee plus tard).
        if len(cur["v"]) > 2:
            ax, ay = cur["v"][0]
            bx, by = cur["v"][-1]
            if abs(ax - bx) < 1e-9 and abs(ay - by) < 1e-9:
                sortant = cur["o"][-1]
                cur["v"].pop(); cur["i"].pop(); cur["o"].pop()
                cur["o"][-1] = sortant if sortant != (0.0, 0.0) else cur["o"][-1]
        self.contours.append(cur)


def _forme(contour):
    """Un contour -> un objet Lottie 'sh' (ferme)."""
    return {"ty": "sh", "ks": {"a": 0, "k": {
        "c": True,
        "v": [[round(x, 3), round(y, 3)] for x, y in contour["v"]],
        "i": [[round(x, 3), round(y, 3)] for x, y in contour["i"]],
        "o": [[round(x, 3), round(y, 3)] for x, y in contour["o"]],
    }}}


# ---------------------------------------------------------------------------
# VOIE 1 : vectorisation
# ---------------------------------------------------------------------------

def vectoriser(texte, chemin_police, taille, x, y, ancrage="start",
               tracking=0.0, index=0):
    """
    Rend (formes, largeur_totale).

    (x, y) est l'origine SVG du texte : x selon `text-anchor`, y = la LIGNE DE
    BASE (et non le haut du bloc -- confondre les deux decale le texte d'une
    hauteur de capitale, exactement le genre de faute qui rend "un fichier
    valide et un ecran faux").
    `tracking` est en unites SVG (letter-spacing), ajoute APRES chaque glyphe.
    """
    police = TTFont(chemin_police, fontNumber=index, lazy=True)
    upem = police["head"].unitsPerEm
    echelle = taille / upem
    cmap = police.getBestCmap()
    glyphSet = police.getGlyphSet()
    hmtx = police["hmtx"]

    # 1re passe : la largeur totale, pour resoudre text-anchor.
    largeur = 0.0
    plan = []
    for ch in texte:
        nom = cmap.get(ord(ch))
        if nom is None:
            # Glyphe absent de la police : on avance d'un espace plutot que
            # de dessiner faux, et l'appelant le signalera.
            nom = cmap.get(ord(" "))
            plan.append((ch, nom, True))
        else:
            plan.append((ch, nom, False))
        av = hmtx[nom][0] * echelle if nom else taille * 0.5
        largeur += av + tracking

    if plan:
        largeur -= tracking                  # pas d'espacement apres le dernier

    if ancrage == "middle":
        curseur = x - largeur / 2.0
    elif ancrage == "end":
        curseur = x - largeur
    else:
        curseur = x

    formes = []
    manquants = []
    for ch, nom, absent in plan:
        if absent and ch.strip():
            manquants.append(ch)
        if nom and ch.strip():
            pen = _PenChemin(glyphSet, echelle, curseur, y)
            glyphSet[nom].draw(pen)
            formes.extend(_forme(c) for c in pen.contours)
        av = hmtx[nom][0] * echelle if nom else taille * 0.5
        curseur += av + tracking

    police.close()
    return formes, largeur, manquants


# ---------------------------------------------------------------------------
# VOIE 2 : calque texte natif (ty:5)
# ---------------------------------------------------------------------------

# Correspondance text-anchor SVG -> justification Lottie.
# Releve dans Creator (`read_scene`) : align 2 = centre.
JUSTIF = {"start": 0, "end": 1, "middle": 2}


def calque_natif(texte, famille, taille, x, y, couleur_rgb, ancrage="start",
                 tracking=0.0, opacite=100, gras=False, ital=False,
                 nom="texte", frames=60, ind=0):
    """
    Rend (calque, entree_fonts).

    ⭐ RELEVE DANS CREATOR (2026-08-26) plutot que devine :
      - `line_height` vaut la taille de police quand rien n'est precise ;
      - `tracking` est un nombre simple (4 pour "leger"), pas une fraction ;
      - la justification 2 = centre.
    Lottie exprime le tracking en 1/1000 de cadratin : on convertit depuis les
    unites SVG (letter-spacing en px) pour que les deux voies s'accordent.
    """
    style = ("Bold Italic" if gras and ital else
             "Bold" if gras else "Italic" if ital else "Regular")
    ref = re.sub(r"[^A-Za-z0-9]", "", f"{famille}{style}") or "Police"

    doc = {
        "f": ref,                               # renvoie vers `fonts`
        "fc": [round(c, 4) for c in couleur_rgb],
        "s": taille,
        "t": texte,
        "j": JUSTIF.get(ancrage, 0),
        "tr": round(tracking / taille * 1000.0, 2) if taille else 0,
        "lh": taille,                           # releve : defaut = la taille
        "ls": 0,
    }

    calque = {
        "ddd": 0, "ty": 5, "ind": ind, "nm": nom, "st": 0, "ip": 0, "op": frames,
        "ks": {"a": {"a": 0, "k": [0, 0, 0]},
               # ⛔ La position PORTE le texte (contrairement a la voie
               # vectorisee, ou tout est deja en absolu). L'origine y est la
               # LIGNE DE BASE : Lottie pose le texte dessus, comme SVG.
               "p": {"a": 0, "k": [x, y, 0]},
               "s": {"a": 0, "k": [100, 100, 100]},
               "r": {"a": 0, "k": 0},
               "o": {"a": 0, "k": opacite}},
        "t": {"d": {"k": [{"s": doc, "t": 0}]},
              "p": {}, "m": {"g": 1, "a": {"a": 0, "k": [0, 0]}},
              "a": []},
    }

    fonte = {"fName": ref, "fFamily": famille, "fStyle": style,
             "ascent": 75}                      # valeur usuelle des exports AE
    return calque, fonte
