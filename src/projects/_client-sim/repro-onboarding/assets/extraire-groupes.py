#!/usr/bin/env python3
"""Genere `../planche.ts` depuis `planche-onboarding.svg` (source de verite).

⛔ POURQUOI : sans ce script, quelqu'un (moi) recopie les formes a la main dans le
TSX et les deux versions divergent en silence. Le SVG dessine par l'agent est LA
reference ; le TSX ne fait que le piloter.

Chaque <g id> de 1er niveau devient une constante exportee contenant son INTERIEUR
(pas la balise <g> elle-meme), pour qu'on puisse l'envelopper dans nos propres
transformations animees.
"""
import pathlib
import re

ICI = pathlib.Path(__file__).resolve().parent
svg = (ICI / "planche-onboarding.svg").read_text(encoding="utf-8")

# ⛔ Commentaires retires AVANT analyse : un commentaire contenant « <g> »
# desynchronise le compteur de profondeur -> 0 groupe extrait, EN SILENCE.
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

ids_presents = re.findall(r'<g\s+id="([^"]+)"', svg)
if not blocs:
    raise SystemExit(
        f"ABANDON : 0 groupe extrait alors que le SVG contient "
        f"{len(ids_presents)} <g id>. Parseur desynchronise."
    )
lignes = [
    "// GENERE — ne pas editer a la main.",
    "// Source de verite : `assets/planche-onboarding.svg`, dessine par l'agent svg-dessinateur.",
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

(ICI.parent / "planche.ts").write_text("\n".join(lignes), encoding="utf-8")
print(f"planche.ts <- planche-onboarding.svg : {len(blocs)} groupes ({', '.join(g for g, _ in blocs)})")
