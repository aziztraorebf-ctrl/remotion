#!/usr/bin/env python3
"""
Rendre VIVANT ce qu'une extraction fige : les 3 techniques du 2026-08-26.

⛔⛔ POURQUOI CE FICHIER EXISTE (dette rattrapee le jour meme, /wrap) : ces trois
techniques ont d'abord ete ecrites dans des scripts JETABLES. Le resultat vivait
dans le .json livre, le PRODUCTEUR n'existait nulle part -- `out/` est gitignore
et le commit ne portait que 17 lignes de correctif. Elles auraient ete a
re-decouvrir integralement a la prochaine scene qui recalcule une forme.
⭐ Regle : une technique decrite dans un message de commit DOIT exister en code
versionne, sinon elle n'existe pas.

LES 3 TECHNIQUES

1. `courbe_recalculee` -- UNE FORME QUI GRANDIT, pas qui se revele.
   Nos scenes Remotion REFABRIQUENT certains traces a chaque image (`buildCurve`
   du Gazoduc A5 : la courbe pousse vers la droite en montant). Une extraction
   ne capture qu'UNE image figee ; l'animer par "trait qui se dessine" (trimPath)
   donne un mouvement FAUX -- la vraie courbe grandit, la notre se devoile.
   ⛔ `transcribe_animation.py` declare ce cas non transcriptible : le nombre de
   sommets varie, et Lottie EXIGE un compte constant pour interpoler. La limite
   est reelle. LE CONTOURNEMENT AUSSI : ces fonctions echantillonnent sur une
   grille FIXE (i/steps) ; seul le NOMBRE de points TRACES varie. En generant
   toujours les N+1 points et en ECRASANT la queue sur la pointe, le compte
   devient constant et Lottie interpole.
   Mesure : pointe finale reconstruite identique a l'attendu (x1273,0 y477,1).

2. `poser_flux` -- DU MOUVEMENT DANS UN TRAIT IMMOBILE.
   L'original superpose un 2e trace en pointilles courts dont le `dashoffset`
   defile : le gaz "coule". Porte par une simple rampe lineaire d'offset (Lottie
   repete le motif tout seul, inutile d'une keyframe par periode).
   Mesure dans la zone du fil : pixels ambres 277 -> 355 -> 307, cycliques.

3. `fondu_de_bord` -- UN DEGRADE LA OU LE FORMAT REFUSE LES MASQUES.
   L'original adoucit le bord d'une aire avec un masque a degrade horizontal.
   Lottie ne porte pas ces masques. On empile N copies de la forme allant toutes
   de l'origine a une borne de plus en plus proche du bord, a opacite faible et
   EGALE : les opacites s'ADDITIONNENT la ou les copies se superposent -> une
   rampe, pas un escalier.
   ⛔⛔ PLUS ≠ MIEUX, et c'est MESURE : teste a 8, 5, 4 et 3 tranches. **4 donne
   le fondu le PLUS lisse** (plus grande marche de luminosite 4/255 contre 7/255
   a huit) **ET 40 % de poids en moins**. Au-dela, les copies se chevauchent et
   RECREENT des paliers. Ne pas augmenter N en esperant lisser.

⚠️ Ces fonctions reconstruisent une geometrie a partir des CONSTANTES DU
COMPOSANT. ⛔ Les lire dans le CODE SOURCE, jamais dans un fichier converti :
un converti porte des valeurs deja transformees (cadrage, echelle) -- ce sont
des SORTIES, pas des parametres. Vecu : X1=984 lu au lieu de 1560, la courbe
s'arretait a mi-parcours, sans erreur.
"""

import json


# ---------------------------------------------------------------------------
# Briques communes
# ---------------------------------------------------------------------------

def keyframes_de_forme(frames, fabrique, fermee, easing=(0.33, 0.67)):
    """
    Une suite de keyframes de FORME ('sh' anime).

    `fabrique(frame)` doit rendre la liste des sommets a cette frame, et
    TOUJOURS LA MEME LONGUEUR (voir la docstring du module).
    """
    ox, ix = easing
    out = []
    n_ref = None
    for i, f in enumerate(frames):
        v = fabrique(f)
        if n_ref is None:
            n_ref = len(v)
        elif len(v) != n_ref:
            raise ValueError(
                f"frame {f} : {len(v)} sommets contre {n_ref} a la premiere. "
                "Lottie EXIGE un compte constant -- echantillonner sur une "
                "grille fixe et ecraser la queue sur la pointe.")
        k = {"t": f, "s": [{"c": fermee, "v": v,
                            "i": [[0, 0]] * len(v), "o": [[0, 0]] * len(v)}]}
        if i < len(frames) - 1:
            k["o"] = {"x": [ox], "y": [0]}
            k["i"] = {"x": [ix], "y": [1]}
        out.append(k)
    return {"a": 1, "k": out}


def _parcourir(items, action):
    """Applique `action` a chaque item, en descendant dans les groupes."""
    for it in items:
        if it.get("ty") == "gr":
            _parcourir(it.get("it", []), action)
        else:
            action(it)


def formes_du_calque(doc, nom_calque):
    """Les objets 'sh' d'un calque nomme, groupes imbriques compris."""
    out = []
    for c in doc["layers"]:
        if c.get("nm") != nom_calque:
            continue
        for g in c.get("shapes") or []:
            _parcourir(g.get("it", []),
                       lambda it: out.append(it) if it.get("ty") == "sh" else None)
    return out


# ---------------------------------------------------------------------------
# 1. La forme qui GRANDIT
# ---------------------------------------------------------------------------

def echantillonner(p, steps, point_a):
    """
    Les `steps + 1` points d'un trace avance jusqu'a la progression `p`.

    ⭐ LA CLE : la grille est FIXE (i / steps). Les points au-dela de `p`
    s'ecrasent sur la pointe -- le compte reste constant, donc interpolable.
    `point_a(t)` rend (x, y) a la progression t.
    """
    return [list(point_a(min(p, i / steps))) for i in range(steps + 1)]


def courbe_recalculee(doc, nom_calque, point_a, progression, frames,
                      steps=72, base_y=None, x_origine=None, decimales=2):
    """
    Remplace les formes d'un calque par une VRAIE animation de forme.

    - `point_a(t)`      : (x, y) a la progression t, DEJA dans le repere final
                          (decalage de cadrage compris)
    - `progression(f)`  : la progression 0..1 a la frame f
    - `base_y`/`x_origine` : si fournis, la forme la plus longue est traitee
                          comme une AIRE (fermee sur la base) et les autres
                          comme des LIGNES.

    Rend le nombre de formes remplacees. ⚠️ 0 = rien fait : le calque n'existe
    pas, ou ses formes sont deja animees (voir le piege de l'aiguillage).
    """
    formes = [f for f in formes_du_calque(doc, nom_calque)
              if isinstance(f["ks"].get("k"), dict)]
    if not formes:
        return 0

    def arrondi(pts):
        return [[round(x, decimales), round(y, decimales)] for x, y in pts]

    def ligne(f):
        return arrondi(echantillonner(progression(f), steps, point_a))

    def aire(f):
        pts = arrondi(echantillonner(progression(f), steps, point_a))
        xg = x_origine if x_origine is not None else pts[0][0]
        return pts + [[pts[-1][0], base_y], [round(xg, decimales), base_y]]

    n = 0
    for forme in formes:
        nb = len(forme["ks"]["k"]["v"])
        # L'aire porte 2 sommets de plus que la ligne (la fermeture sur la base).
        est_aire = base_y is not None and nb > steps // 2 + 1 and nb % 2 == 1
        forme["ks"] = keyframes_de_forme(
            frames, aire if est_aire else ligne, est_aire)
        n += 1
    return n


# ---------------------------------------------------------------------------
# 2. Le FLUX dans un trait
# ---------------------------------------------------------------------------

def poser_flux(doc, nom_calque, longueur, frame_debut, frame_fin,
               tiret=0.035, espace=0.075, vitesse=0.0028, opacite_cible=None):
    """
    Fait DEFILER des pointillés dans un trait : "quelque chose circule".

    `tiret`/`espace`/`vitesse` sont en FRACTION de la longueur du trace (comme
    un `pathLength=1` en SVG) ; `longueur` les convertit en pixels.
    `opacite_cible` vise un trait precis quand le calque en porte plusieurs
    (ex. 80 pour le flux, 40 pour le fil de base) ; None = tous.

    ⛔⛔ `nm` DOIT etre present et UNIQUE dans le tableau `d` : lottie-web en
    fait une CLE D'OBJET (Object.defineProperty). Deux `nm` identiques -> le
    player FIGE, sans erreur console ni pageerror, DOMLoaded jamais emis.
    Un `nm` absent ne sauve pas (cle "undefined", dupliquee pareil).
    """
    px_tiret, px_espace = tiret * longueur, espace * longueur
    total = -vitesse * longueur * (frame_fin - frame_debut)
    poses = []

    def traiter(it):
        if it.get("ty") not in ("st", "gs"):
            return
        if opacite_cible is not None:
            o = it.get("o", {}).get("k")
            if o is None or abs(o - opacite_cible) > 1:
                return
        it["d"] = [
            {"n": "d", "nm": "dash 1", "v": {"a": 0, "k": round(px_tiret, 2)}},
            {"n": "g", "nm": "gap 1", "v": {"a": 0, "k": round(px_espace, 2)}},
            {"n": "o", "nm": "offset", "v": {"a": 1, "k": [
                {"t": frame_debut, "s": [0],
                 "o": {"x": [0.5], "y": [0.5]}, "i": {"x": [0.5], "y": [0.5]}},
                {"t": frame_fin, "s": [round(total, 2)]},
            ]}},
        ]
        poses.append(it)

    for c in doc["layers"]:
        if c.get("nm") != nom_calque:
            continue
        for g in c.get("shapes") or []:
            _parcourir(g.get("it", []), traiter)
    return len(poses)


# ---------------------------------------------------------------------------
# 3. Le FONDU DE BORD (sans masque)
# ---------------------------------------------------------------------------

# ⭐ N=4 CHOISI PAR MESURE, pas par intuition. Teste a 8, 5, 4, 3 tranches :
# 4 donne la plus petite marche de luminosite (4/255 contre 7/255 a huit) ET
# 40 % de poids en moins. Au-dela, les copies se chevauchent et RECREENT des
# paliers -- augmenter N ne lisse PAS mieux.
TRANCHES_OPTIMALES = 4


def opacite_par_tranche(opacite_pleine, n):
    """
    L'opacite de CHAQUE copie pour que l'empilement rende `opacite_pleine`.

    Les opacites s'additionnent en se superposant : (1-(1-a)^n) = cible.
    """
    return round((1 - (1 - opacite_pleine / 100.0) ** (1.0 / n)) * 100, 4)


def fondu_de_bord(doc, nom_calque, nom_groupe, fabrique_bornee, frames,
                  largeur, opacite_pleine, n=TRANCHES_OPTIMALES):
    """
    Remplace un groupe par N copies d'opacite egale et de bornes decroissantes.

    `fabrique_bornee(frame, recul_px)` rend les sommets de la forme arretee
    `recul_px` avant son bord. Le compte de sommets doit rester constant.

    Rend le nombre de tranches posees (0 = groupe introuvable).
    """
    import copy
    o_tranche = opacite_par_tranche(opacite_pleine, n)
    poses = 0

    for c in doc["layers"]:
        if c.get("nm") != nom_calque:
            continue
        for g in c.get("shapes") or []:
            items = g["it"]
            for idx, it in enumerate(list(items)):
                if it.get("ty") != "gr" or it.get("nm") != nom_groupe:
                    continue
                copies = []
                for j in range(n):
                    recul = largeur * j / n
                    cp = copy.deepcopy(it)
                    cp["nm"] = f"{nom_groupe}-fondu{j}"
                    if cp.get("it") and cp["it"][0].get("ty") == "gr":
                        cp["it"][0]["nm"] = cp["nm"]
                    cible = cp["it"][0]["it"] if (
                        cp.get("it") and cp["it"][0].get("ty") == "gr") else cp["it"]
                    for sub in cible:
                        if sub.get("ty") == "sh":
                            sub["ks"] = keyframes_de_forme(
                                frames, lambda f, r=recul: fabrique_bornee(f, r),
                                True)
                        elif sub.get("ty") in ("fl", "gf"):
                            sub["o"] = {"a": 0, "k": o_tranche}
                    copies.append(cp)
                items[idx:idx + 1] = copies
                poses += len(copies)
                break
    return poses


# ---------------------------------------------------------------------------

def charger(chemin):
    with open(chemin, encoding="utf-8") as f:
        return json.load(f)


def ecrire(doc, chemin):
    with open(chemin, "w", encoding="utf-8") as f:
        json.dump(doc, f, separators=(",", ":"))
