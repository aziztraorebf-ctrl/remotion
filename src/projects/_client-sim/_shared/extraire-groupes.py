#!/usr/bin/env python3
"""Genere un module `.ts` depuis une planche SVG dessinee (source de verite).

⭐ VERSION PARTAGEE — factorisee le 2026-08-30 depuis 3 copies divergentes.
   usage : python3 ../../_shared/extraire-groupes.py assets/ma-planche.svg

⛔ POURQUOI LA FACTORISATION : les 3 copies (repro-redeem, repro-docs,
repro-onboarding) ne differaient QUE par le nom du SVG... et par la PRESENCE
DES DURCISSEMENTS. La copie repro-redeem (66 lignes) ne portait NI le retrait
des commentaires NI le garde-fou — les deux fixes payes le 2026-08-30 sur des
bugs SILENCIEUX. Un projet qui copiait « l'extracteur » avait 1 chance sur 3
de repartir avec la version qui echoue sans le dire.

⛔ POURQUOI : sans ce script, quelqu'un (moi) recopie les formes a la main dans le
TSX et les deux versions divergent en silence. Le SVG dessine par l'agent est LA
reference ; le TSX ne fait que le piloter.

Chaque <g id> de 1er niveau devient une constante exportee contenant son INTERIEUR
(pas la balise <g> elle-meme), pour qu'on puisse l'envelopper dans nos propres
transformations animees.
"""
import pathlib
import re
import sys

ICI = pathlib.Path(__file__).resolve().parent
if len(sys.argv) < 2:
    raise SystemExit(
        "usage : python3 extraire-groupes.py <planche.svg> [sortie.ts]\n"
        "        (chemins relatifs au dossier appelant)"
    )
SVG = pathlib.Path(sys.argv[1]).resolve()
SORTIE = pathlib.Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else SVG.parent.parent / "planche.ts"
svg = SVG.read_text(encoding="utf-8")

# ⛔ Les COMMENTAIRES sont retires AVANT toute analyse : un commentaire qui
# contient « <g> » (ex. la legende « TAILLES REELLES (repere local de chaque
# <g>) ») etait compte comme une balise ouvrante par le compteur de profondeur
# ci-dessous, qui ne revenait alors jamais a zero -> 0 groupe extrait, en
# SILENCE. Vecu le 2026-08-30 sur cette planche meme.
svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)

# Les <defs> (degrades) sont partages : ils sortent une seule fois.
defs = re.search(r"<defs>(.*?)</defs>", svg, re.S)
defs_txt = defs.group(1).strip() if defs else ""


def groupes_top(s: str) -> list[tuple[str, str]]:
    """Retourne [(id, interieur)] des <g> de premier niveau."""
    out, prof, debut, gid = [], 0, None, None
    for m in re.finditer(r"<(/?)g\b([^>]*)>", s):
        ferme = m.group(1) == "/"
        auto = m.group(2).rstrip().endswith("/")
        if ferme:
            prof -= 1
            if prof == 0 and debut is not None:
                out.append((gid, s[debut:m.start()]))
                debut, gid = None, None
        else:
            i = re.search(r'id="([^"]+)"', m.group(2))
            if prof == 0 and i and not auto:
                gid, debut = i.group(1), m.end()
            if not auto:
                prof += 1
    return out


def camel(nom: str) -> str:
    parts = nom.split("-")
    return parts[0].upper() + "".join("_" + p.upper() for p in parts[1:])


blocs = groupes_top(svg)

# ⛔ GARDE-FOU : sans lui, un parsing casse ecrit un `planche.ts` VIDE et l'erreur
# n'apparait que 6 messages plus loin, sous la forme d'un « has no exported member ».
# Un extracteur qui ne trouve rien est TOUJOURS un bug, jamais un cas normal :
# on compare a ce que le SVG contient reellement.
# ⛔ Le garde-fou compare au COMPTE ATTENDU, pas a zero. Vecu le 2026-08-30 :
# la 1re version ne testait que « 0 groupe » — plus tard dans la meme session,
# une balise fermante orpheline a fait passer 15 groupes a 12, SILENCIEUSEMENT,
# car 12 != 0. Un garde-fou qui teste le cas extreme rate le cas partiel.
ids_presents = re.findall(r'<g\s+id="([^"]+)"', svg)
attendus = len(ids_presents)
if blocs and len(blocs) < attendus:
    print(
        f"⚠️  ATTENTION : {len(blocs)} groupes extraits pour {attendus} <g id> "
        f"presents dans le SVG. Manquants : "
        f"{sorted(set(ids_presents) - {g for g, _ in blocs})}\n"
        f"    (cause probable : balise fermante orpheline ou imbrication)"
    )
if not blocs:
    raise SystemExit(
        f"ABANDON : 0 groupe de premier niveau extrait, alors que le SVG "
        f"contient {len(ids_presents)} <g id> ({', '.join(ids_presents[:8])}). "
        f"Le parseur de profondeur est desynchronise — ne PAS ecrire planche.ts."
    )
lignes = [
    "// GENERE — ne pas editer a la main.",
    "// Source de verite : `assets/planche-docs.svg`, dessine par l'agent svg-dessinateur.",
    "// Regenerer : `python3 assets/extraire-groupes.py`",
    "//",
    "// ⛔ Le TSX ne redessine JAMAIS ces formes : il les PILOTE. C'est la regle n°0",
    "// (le modele dessine le statique, NOUS animons) — et l'erreur deja payee une fois",
    "// dans ce dossier meme.",
    "",
    f"export const DEFS = `{defs_txt}`;",
    "",
]
for gid, interieur in blocs:
    lignes.append(f"export const {camel(gid)} = `{interieur.strip()}`;")
    lignes.append("")

SORTIE.write_text("\n".join(lignes), encoding="utf-8")
print(f"{SORTIE.name} <- {SVG.name} : {len(blocs)} groupes ({', '.join(g for g, _ in blocs)})")
