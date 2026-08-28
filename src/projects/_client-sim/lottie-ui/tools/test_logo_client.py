#!/usr/bin/env python3
"""
Non-regression de la CHAINE LOGO CLIENT : nommage puis animation.

⭐ POURQUOI CE TEST EXISTE. Le 2026-08-28, le regroupement des calques de
LoadUp a sorti un "o" en DISQUE PLEIN : sa contre-forme blanche (path-8),
rangee dans le mauvais groupe, etait peinte au mauvais moment et bouchait le
trou. `compare_render.py` annoncait 0,14 % d'ecart -- un chiffre qui passe
pour bon. C'est l'IMAGE qui a montre le defaut, jamais le nombre.
=> Ce test ne se contente pas d'un seuil global : il verifie NOMMEMENT que
chaque contre-forme voyage avec sa lettre, et que le geste garde sa pause.

Ce qu'il verrouille, en 4 volets :
  1. NOMMAGE  -- 8 groupes nommes, 15 calques couverts, aucun orphelin,
                 et chaque lettre creuse embarque sa contre-forme.
  2. FIDELITE -- le regroupement ne change pas le dessin (ecart <= 0,05 %).
  3. GESTE    -- la fleche porte ses 4 cles, la SUSPENSION existe, et le
                 ratio montee/chute reste asymetrique (cf. FICHE-GESTE-ANIME).
  4. PROPOSITION -- `proposer_carte.py` ne melange jamais deux objets dans un
                 meme bloc, et ses blocs restent contigus.

⛔ Le volet 2 exige rsvg-convert ; il est saute proprement s'il manque, et
le test le DIT au lieu de passer en silence.

Lance : python3 test_logo_client.py
"""

import json
import os
import subprocess
import sys
import tempfile

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.abspath(os.path.join(ICI, "..", "..", "..", "..", ".."))
LOGOS = os.path.join(RACINE, "public/_client-sim/logos")
SVG_SOURCE = os.path.join(LOGOS, "recraft-loadup.svg")
JSON_BRUT = os.path.join(LOGOS, "rc-loadup.json")
RSVG = "/opt/homebrew/bin/rsvg-convert"

# Chaque lettre creuse DOIT embarquer sa contre-forme blanche : mesure des
# bbox (2026-08-28) -- o: x=767/773 · a: 893/892 · d: 1026/1020 · p: 1289/1298.
# Une contre-forme separee de sa lettre bouche le trou, sans faire bouger le
# chiffre global. C'est le bug reel que ce test empeche de revenir.
CONTRE_FORMES = {
    "lettre-o": ("path-7", "path-8"),
    "lettre-a": ("path-9", "path-10"),
    "lettre-d": ("path-5", "path-6"),
    "lettre-p": ("path-3", "path-4"),
}
GROUPES_ATTENDUS = {
    "fond", "lettre-l", "lettre-o", "lettre-a", "lettre-d",
    "lettre-p", "fleche-up", "marque-deposee",
}
ECART_MAX = 0.05          # %  (mesure reelle apres correction : 0,01 %)
RATIO_CHUTE_MAX = 0.75    # la chute doit rester nettement plus breve que la montee


def _lancer(script, *args):
    r = subprocess.run([sys.executable, os.path.join(ICI, script), *args],
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{script} a echoue :\n{r.stdout}\n{r.stderr}")
    return r.stdout


def _encre(svg_path, png_path, largeur=900):
    subprocess.run([RSVG, "-w", str(largeur), svg_path, "-o", png_path], check=True)


def _compter_chemins(noeud):
    """
    Compte les chemins ('sh') A N'IMPORTE QUELLE PROFONDEUR.

    ⛔ PIEGE PAYE LE 2026-08-28 : compter `len(couche["shapes"])` renvoie 1 pour
    un groupe qui en contient deux. `group_layers.py` imbrique les calques dans
    UN groupe par calque -- les chemins vivent une couche plus bas. La 1re
    version de ce test criait "contre-forme separee" sur un fichier PARFAIT
    (ecart 0,01 %, trou visible a l'image). C'etait la SONDE qui regardait au
    mauvais niveau, pas le fichier qui etait faux.
    """
    if isinstance(noeud, dict):
        n = 1 if noeud.get("ty") == "sh" else 0
        return n + sum(_compter_chemins(v) for v in noeud.values())
    if isinstance(noeud, list):
        return sum(_compter_chemins(v) for v in noeud)
    return 0


def volet_nommage(nomme):
    """Les 8 groupes sont la, les 15 calques couverts, les trous preserves."""
    doc = json.load(open(nomme, encoding="utf-8"))
    noms = {c["nm"] for c in doc["layers"]}
    ecarts = []

    if noms != GROUPES_ATTENDUS:
        ecarts.append(f"groupes inattendus : {sorted(noms ^ GROUPES_ATTENDUS)}")

    # aucun calque ne doit rester anonyme
    restes = [n for n in noms if n.startswith("path-")]
    if restes:
        ecarts.append(f"calques encore anonymes : {sorted(restes)}")

    # chaque lettre creuse contient bien 2 formes (la lettre ET son trou)
    for groupe, (lettre, trou) in CONTRE_FORMES.items():
        couche = next((c for c in doc["layers"] if c["nm"] == groupe), None)
        if couche is None:
            ecarts.append(f"{groupe} absent")
            continue
        n_formes = _compter_chemins(couche)
        if n_formes < 2:
            ecarts.append(
                f"{groupe} n'a que {n_formes} forme(s) : sa contre-forme "
                f"({trou}) a ete separee de {lettre} -> le trou sera bouche")
    return ecarts


def volet_fidelite(nomme):
    """Le regroupement ne doit RIEN changer au dessin."""
    if not os.path.exists(RSVG):
        return None, "rsvg-convert absent -- volet SAUTE (non concluant)"
    out = _lancer("compare_render.py", SVG_SOURCE, nomme,
                  "-o", os.path.join(tempfile.gettempdir(), "test-logo-client.png"))
    ecart = None
    for ligne in out.splitlines():
        if "pixels divergents" in ligne:
            ecart = float(ligne.split(":")[1].strip().split("%")[0])
    if ecart is None:
        return None, "ecart illisible dans la sortie de compare_render"
    if ecart > ECART_MAX:
        return ecart, f"ecart {ecart:.2f} % > {ECART_MAX} % -- le dessin a change"
    return ecart, None


def volet_geste(anime):
    """La fleche garde ses 4 cles, sa suspension et son asymetrie."""
    doc = json.load(open(anime, encoding="utf-8"))
    ecarts = []
    fleche = next((c for c in doc["layers"] if c["nm"] == "fleche-up"), None)
    if fleche is None:
        return ["fleche-up absente du fichier anime"]

    pos = fleche["ks"].get("p", {})
    if pos.get("a") != 1:
        return ["la position de fleche-up n'est PAS animee"]
    cles = pos["k"]
    if len(cles) != 4:
        ecarts.append(f"{len(cles)} cles de position au lieu de 4 (geste en 3 temps)")
        return ecarts

    t = [k["t"] for k in cles]
    y = [k["s"][1] for k in cles]

    # ⭐ LA SUSPENSION : sans elle le geste ne raconte rien (fiche, regle n.4).
    if y[1] != y[2]:
        ecarts.append(f"SUSPENSION PERDUE : y passe de {y[1]} a {y[2]} entre "
                      f"f{t[1]} et f{t[2]} au lieu de rester immobile")
    elif t[2] - t[1] < 4:
        ecarts.append(f"suspension trop courte ({t[2]-t[1]} frames) pour se voir")

    # timing ASYMETRIQUE : la chute est plus breve que la montee
    montee, chute = t[1] - t[0], t[3] - t[2]
    if montee <= 0 or chute <= 0:
        ecarts.append("timing incoherent (montee ou chute nulle)")
    elif chute / montee > RATIO_CHUTE_MAX:
        ecarts.append(f"timing devenu symetrique : chute/montee = "
                      f"{chute/montee:.2f} > {RATIO_CHUTE_MAX}")

    # le fond ne bouge pas : un seul point focal
    fond = next((c for c in doc["layers"] if c["nm"] == "fond"), None)
    if fond and any(fond["ks"].get(k, {}).get("a") == 1 for k in ("p", "s", "o")):
        ecarts.append("le fond est anime -- il doit rester fixe (point focal unique)")

    return ecarts


# ---------------------------------------------------------------------------
# Volet 4 — la PROPOSITION de carte (proposer_carte.py), ajoute le 2026-08-28.
# ⭐ Ce qu'on verrouille n'est PAS "l'outil trouve les bons noms" (il n'en trouve
# aucun, par conception) mais deux garanties MECANIQUES :
#   a) chaque bloc propose est un SOUS-ENSEMBLE d'un groupe de la carte manuelle
#      -- l'outil peut sur-decouper, jamais melanger deux objets ;
#   b) les blocs sont CONTIGUS dans l'ordre de peinture.
# ⛔ (a) est le vrai garde-fou : sur-decouper est recuperable en une seconde,
# melanger deux objets produit un rendu faux (le "o" en disque plein).
def volet_proposition():
    import importlib.util
    sp = importlib.util.spec_from_file_location(
        "pc", os.path.join(ICI, "proposer_carte.py"))
    pc = importlib.util.module_from_spec(sp)
    sp.loader.exec_module(pc)

    doc = json.load(open(JSON_BRUT, encoding="utf-8"))
    blocs = pc.proposer(doc)
    ecarts = []

    # (a) aucun bloc ne doit chevaucher deux groupes de la carte manuelle
    from group_layers import CARTES
    appartenance = {}
    for groupe in CARTES["loadup"]["_ordre"]:
        for n in CARTES["loadup"][groupe]["noms"]:
            appartenance[n] = groupe
    for etiquette, membres in blocs:
        vus = {appartenance.get(n) for n in membres}
        if len(vus) > 1:
            ecarts.append(f"{etiquette} melange {sorted(vus)} : "
                          f"deux objets dans un meme bloc")

    # (b) contiguite : les membres se suivent dans l'ordre de peinture
    ordre = [c["nm"] for c in reversed(doc["layers"])]
    rang = {n: i for i, n in enumerate(ordre)}
    for etiquette, membres in blocs:
        rangs = sorted(rang[n] for n in membres if n in rang)
        if rangs and rangs != list(range(rangs[0], rangs[0] + len(rangs))):
            ecarts.append(f"{etiquette} n'est PAS contigu : {rangs}")

    return ecarts, len(blocs)


def main():
    tmp = tempfile.mkdtemp(prefix="logo-client-")
    nomme = os.path.join(tmp, "nomme.json")
    anime = os.path.join(tmp, "anime.json")

    _lancer("group_layers.py", JSON_BRUT, "--carte", "loadup", "-o", nomme)
    _lancer("animate_scene.py", nomme, "--partition", "loadup", "-o", anime)

    echecs = []

    print("1. NOMMAGE")
    ec = volet_nommage(nomme)
    for e in ec:
        print(f"   ECHEC  {e}")
    if not ec:
        print(f"   OK     8 groupes nommes, 15 calques couverts, "
              f"{len(CONTRE_FORMES)} contre-formes avec leur lettre")
    echecs += ec

    print("2. FIDELITE")
    ecart, souci = volet_fidelite(nomme)
    if souci and ecart is None:
        print(f"   SAUTE  {souci}")
    elif souci:
        print(f"   ECHEC  {souci}")
        echecs.append(souci)
    else:
        print(f"   OK     ecart {ecart:.2f} % (max {ECART_MAX} %)")

    print("3. GESTE")
    eg = volet_geste(anime)
    for e in eg:
        print(f"   ECHEC  {e}")
    if not eg:
        doc = json.load(open(anime, encoding="utf-8"))
        f = next(c for c in doc["layers"] if c["nm"] == "fleche-up")
        t = [k["t"] for k in f["ks"]["p"]["k"]]
        print(f"   OK     4 cles, suspension {t[2]-t[1]} frames, "
              f"ratio chute/montee {(t[3]-t[2])/(t[1]-t[0]):.2f}")
    echecs += eg

    print("4. PROPOSITION DE CARTE")
    ep, nb = volet_proposition()
    for e in ep:
        print(f"   ECHEC  {e}")
    if not ep:
        print(f"   OK     {nb} blocs, tous contigus et tous inclus dans un "
              f"seul groupe de la carte manuelle")
    echecs += ep

    print()
    if echecs:
        print(f"ECHEC : {len(echecs)} probleme(s)")
        return 1
    print("Les 4 volets passent.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

