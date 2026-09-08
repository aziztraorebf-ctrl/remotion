#!/usr/bin/env python3
"""Audite COMPOSANTS-INDEX.md contre la realite du disque.

POURQUOI (mesure le 2026-09-08) : l'index cite 196 noms de composants. 30 d'entre eux
ne sont exportes NULLE PART dans src/ — ce sont des promesses vides. Le cout est
documente : "une entree 'ca n'existe pas' (ou qui ment) ferme la recherche : personne
ne va verifier, et la brique reste invisible pour toujours"
(feedback_catalogue-position-liste-et-brief-restrictif-cachent-brique-existante.md).

Precedent direct : 5 entrees fausses (chemins faux, composants inventes) avaient deja
ete ecrites dans cet index. Un index qui ment est PIRE que pas d'index.

CE QUE FAIT CE SCRIPT — il VERIFIE, il ne reecrit rien :
  1. FANTOMES     : noms cites dans l'index, exportes nulle part dans src/
  2. ABSENTS      : composants exportes dans _shared/components/, jamais cites
  3. COLLISIONS   : un meme nom exporte depuis 2 fichiers differents (contrats opposes)

⛔ Il n'ECRIT PAS l'index. L'index porte une colonne "Quand Aziz dit..." qui encode
une INTENTION — seul un humain l'ecrit. Le generer automatiquement detruirait sa valeur.
Ce script dit OU il ment ; la correction reste un geste humain.

Usage:
    python3 scripts/tools/audit-composants-index.py            # rapport
    python3 scripts/tools/audit-composants-index.py --json     # sortie machine
    python3 scripts/tools/audit-composants-index.py --strict   # exit 1 si fantomes

Style: suit scripts/pipeline_gates.py — retourne un resultat structure, n'appelle
sys.exit() que depuis main(), jamais depuis les fonctions.
"""

import argparse
import json
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
INDEX = ROOT / "src/projects/_shared/COMPOSANTS-INDEX.md"
SHARED = ROOT / "src/projects/_shared/components"

# Noms cites dans l'index qui ne sont PAS des composants maison : ne pas les signaler.
NOT_OURS = {
    "AbsoluteFill", "Sequence", "Series", "Audio", "Video", "Img", "Composition",
    "OffthreadVideo", "Freeze", "Loop", "Still",       # Remotion
    "NomComposant", "Grp", "C", "CA",                  # exemples de doc / bruit de regex
}

# Un composant React : PascalCase, au moins 2 segments ou un nom parlant.
# Exclut les CONSTANTES (SCREAMING_SNAKE) que la regex d'export attrape sinon.
RE_COMPONENT = re.compile(r"^[A-Z][a-zA-Z0-9]*[a-z][a-zA-Z0-9]*$")

RE_EXPORT = re.compile(
    r"export\s+(?:const|function|class)\s+([A-Z][A-Za-z0-9_]*)"
    r"|export\s+default\s+(?:function\s+)?([A-Z][A-Za-z0-9_]*)"
)
# Declare mais SANS export : le composant existe, il n'est simplement pas importable.
RE_INTERNAL = re.compile(
    r"^\s*(?:const|function|class)\s+([A-Z][A-Za-z0-9_]*)\s*[:=(<]", re.MULTILINE
)
RE_CITED = re.compile(r"`([A-Z][A-Za-z0-9_]+)`")


def is_component(name: str) -> bool:
    """Ecarte les constantes (ARM_LENGTH_DEFAULT, BRAS_L) et le bruit."""
    return bool(RE_COMPONENT.match(name)) and name not in NOT_OURS and len(name) > 2


def scan_exports(root: Path, internal: bool = False):
    """Retourne {nom: [chemins relatifs]} des composants sous root.

    internal=False -> uniquement les composants EXPORTES (donc importables).
    internal=True  -> uniquement les declares SANS export (existent, pas reutilisables).
    """
    found = defaultdict(list)
    for f in root.rglob("*.tsx"):
        if "_archive" in f.parts or "/archive/" in str(f):
            continue
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        exported = {m.group(1) or m.group(2) for m in RE_EXPORT.finditer(text)}
        names = ({n for n in RE_INTERNAL.findall(text)} - exported) if internal else exported
        for name in names:
            if name and is_component(name):
                rel = str(f.relative_to(ROOT))
                if rel not in found[name]:
                    found[name].append(rel)
    return dict(found)


def cited_in_index(index_path: Path):
    if not index_path.exists():
        return set()
    text = index_path.read_text(encoding="utf-8", errors="ignore")
    return {n for n in RE_CITED.findall(text) if is_component(n)}


def audit():
    """Retourne (ok: bool, rapport: dict). N'appelle jamais sys.exit()."""
    if not INDEX.exists():
        return False, {"erreur": f"index introuvable: {INDEX}"}

    all_exports = scan_exports(ROOT / "src")
    all_internal = scan_exports(ROOT / "src", internal=True)
    shared_exports = scan_exports(SHARED) if SHARED.exists() else {}
    cited = cited_in_index(INDEX)

    # 2 niveaux de gravite, volontairement distincts :
    #   fantome        = cite, n'existe NULLE PART -> l'index ment
    #   non_importable = cite, existe mais sans export -> promesse non tenable telle quelle
    fantomes, non_importables = [], {}
    for n in sorted(cited):
        if n in all_exports:
            continue
        if n in all_internal:
            non_importables[n] = sorted(all_internal[n])
        else:
            fantomes.append(n)

    absents = sorted(n for n in shared_exports if n not in cited)
    collisions = {n: p for n, p in all_exports.items() if len(p) > 1 and n in cited}

    rapport = {
        "index": str(INDEX.relative_to(ROOT)),
        "cites_dans_index": len(cited),
        "exportes_dans_src": len(all_exports),
        "exportes_dans_shared_components": len(shared_exports),
        "fantomes": fantomes,
        "non_importables": non_importables,
        "absents_de_shared": absents,
        "collisions": {n: sorted(p) for n, p in sorted(collisions.items())},
    }
    return not fantomes, rapport


def git_date(rel_path: str) -> str:
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cd", "--date=short", "--", rel_path],
            cwd=ROOT, capture_output=True, text=True, timeout=10,
        )
        return out.stdout.strip() or "?"
    except (subprocess.SubprocessError, OSError):
        return "?"


def render(r: dict) -> str:
    if "erreur" in r:
        return f"ERREUR: {r['erreur']}"
    L = []
    L.append("AUDIT COMPOSANTS-INDEX.md")
    L.append("=" * 60)
    L.append(f"  cites dans l'index          : {r['cites_dans_index']}")
    L.append(f"  exportes dans src/          : {r['exportes_dans_src']}")
    L.append(f"  exportes dans _shared/comp. : {r['exportes_dans_shared_components']}")
    L.append("")

    if r["fantomes"]:
        L.append(f"FANTOMES ({len(r['fantomes'])}) — cites, INTROUVABLES dans src/ :")
        L.append("  L'index promet une brique qui n'existe pas. Une entree qui ment")
        L.append("  ferme la recherche : personne ne verifie. A corriger ou retirer.")
        for n in r["fantomes"]:
            L.append(f"    - {n}")
        L.append("")
    else:
        L.append("FANTOMES : aucun. L'index ne promet rien d'inexistant.")
        L.append("")

    ni = r.get("non_importables", {})
    if ni:
        L.append(f"NON IMPORTABLES ({len(ni)}) — existent, mais declares SANS export :")
        L.append("  La brique est reelle mais pas reutilisable en l'etat : il faut")
        L.append("  l'extraire avant de pouvoir l'importer ailleurs.")
        for n, paths in sorted(ni.items()):
            L.append(f"    - {n}  <-  {paths[0]}")
        L.append("")

    if r["collisions"]:
        L.append(f"COLLISIONS ({len(r['collisions'])}) — meme nom, plusieurs fichiers :")
        L.append("  Risque: deux composants distincts aux contrats opposes.")
        for n, paths in r["collisions"].items():
            L.append(f"    - {n}")
            for p in paths:
                L.append(f"        {p}  ({git_date(p)})")
        L.append("")

    n_abs = len(r["absents_de_shared"])
    if n_abs:
        L.append(f"ABSENTS ({n_abs}) — exportes dans _shared/components, jamais cites :")
        L.append("  Ce sont les briques invisibles au moment de decider.")
        for n in r["absents_de_shared"][:25]:
            L.append(f"    - {n}")
        if n_abs > 25:
            L.append(f"    ... et {n_abs - 25} autres (--json pour la liste complete)")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--json", action="store_true", help="sortie machine")
    ap.add_argument("--strict", action="store_true", help="exit 1 si des fantomes")
    args = ap.parse_args()

    ok, rapport = audit()
    print(json.dumps(rapport, ensure_ascii=False, indent=2) if args.json else render(rapport))
    return 1 if (args.strict and not ok) else 0


if __name__ == "__main__":
    sys.exit(main())
