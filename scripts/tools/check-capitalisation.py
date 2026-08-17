#!/usr/bin/env python3
"""
check-capitalisation.py — le garde-fou qui empeche d'OUBLIER de capitaliser.

LE PROBLEME (constat d'Aziz, 2026-08-17)
----------------------------------------
Deux mecanismes capitalisent le travail d'une session :
  - EXTRACTOR   : indexe les composants reutilisables dans les catalogues (l'EXISTENCE)
  - CHRONIQUEUR : verifie/enrichit memory/fiches/ (le JUGEMENT)
Les deux ne tournent QU'EN CLOTURE, via /wrap. Double risque d'oubli :
  1. on oublie de lancer /wrap (session qui s'arrete, contexte plein, interruption)
  2. on le lance mais la matiere n'a pas ete capitalisee (cas historique : le
     Mecanisme 1 "Gardien" concu en detail, jamais code, oublie pendant des semaines ;
     le circuit-breaker code puis mort le 2026-07-12 sans que personne ne le remarque)
Un mecanisme qui ne se declenche qu'a la fin, et dont l'oubli est SILENCIEUX, finit
toujours par etre oublie. C'est le pattern `regle-ecrite-insuffisante-sans-gate-outille`.

CE QUE FAIT CE SCRIPT
---------------------
Il compare la DATE du dernier travail de production (commits touchant du .tsx de scene)
a la DATE de la derniere capitalisation (commits touchant les catalogues ou memory/fiches/).
Si de la matiere s'est accumulee sans etre capitalisee, il le DIT — au demarrage de session,
au moment ou on peut encore agir, pas en cloture ou on est deja fatigue.

Il ne bloque RIEN. Il informe.

USAGE
  python3 scripts/tools/check-capitalisation.py          # rapport lisible
  python3 scripts/tools/check-capitalisation.py --quiet  # une ligne, ou rien si tout va bien
"""

import argparse
import subprocess
import sys
from datetime import datetime, timedelta

CATALOGUES = [
    "src/projects/_shared/COMPOSANTS-INDEX.md",
    "src/projects/_shared/INTENTION-FORME-INDEX.md",
    "src/projects/_shared/svg-library/SVG-LIBRARY-INDEX.md",
    "src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md",
]
FICHES_DIR = "memory/fiches"

# Seuil : au-dela de N jours de production sans capitalisation, on alerte.
SEUIL_JOURS = 3
# Ou : au-dela de N fichiers de scene distincts touches depuis la derniere capitalisation.
SEUIL_FICHIERS = 8


def git(*args):
    r = subprocess.run(["git", *args], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else ""


def last_commit_date(paths):
    """Date du dernier commit touchant l'un de ces chemins."""
    best = None
    for p in paths:
        out = git("log", "-1", "--format=%at", "--", p)
        if out:
            try:
                ts = int(out)
                if best is None or ts > best:
                    best = ts
            except ValueError:
                pass
    return datetime.fromtimestamp(best) if best else None


def scenes_since(since_ts):
    """Fichiers .tsx de scene modifies depuis un timestamp."""
    out = git("log", f"--since=@{int(since_ts)}", "--format=", "--name-only")
    files = set()
    for line in out.splitlines():
        line = line.strip()
        if not line.endswith(".tsx"):
            continue
        if not line.startswith("src/projects/"):
            continue
        if "_archive" in line or line.endswith("Root.tsx"):
            continue
        files.add(line)
    return sorted(files)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--quiet", action="store_true",
                    help="une seule ligne, et rien du tout si tout va bien")
    a = ap.parse_args()

    cat_date = last_commit_date(CATALOGUES)
    fiche_date = last_commit_date([FICHES_DIR])
    derniere_capi = max([d for d in (cat_date, fiche_date) if d], default=None)

    if derniere_capi is None:
        print("check-capitalisation : aucun historique trouve (catalogues et fiches jamais commites ?)")
        return 0

    scenes = scenes_since(derniere_capi.timestamp())
    jours = (datetime.now() - derniere_capi).days
    alerte = len(scenes) >= SEUIL_FICHIERS or (jours >= SEUIL_JOURS and scenes)

    if not alerte:
        if not a.quiet:
            print("✅ Capitalisation a jour.")
            print(f"   Derniere : il y a {jours} j "
                  f"(catalogues {cat_date.date() if cat_date else '—'}, "
                  f"fiches {fiche_date.date() if fiche_date else '—'})")
            print(f"   {len(scenes)} fichier(s) de scene touche(s) depuis — sous les seuils "
                  f"({SEUIL_FICHIERS} fichiers / {SEUIL_JOURS} j).")
        return 0

    if a.quiet:
        print(f"⚠️  CAPITALISATION EN RETARD : {len(scenes)} scenes produites depuis "
              f"{jours} j sans passage EXTRACTOR/CHRONIQUEUR → lancer /wrap")
        return 1

    print("⚠️  CAPITALISATION EN RETARD")
    print()
    print(f"   Derniere capitalisation : il y a {jours} jour(s) ({derniere_capi.date()})")
    print(f"   Depuis : {len(scenes)} fichier(s) de scene modifie(s), non capitalises.")
    print()
    for f in scenes[:12]:
        print(f"     - {f}")
    if len(scenes) > 12:
        print(f"     ... et {len(scenes) - 12} autre(s)")
    print()
    print("   → Lancer `/wrap` : EXTRACTOR indexera les briques reutilisables (l'EXISTENCE),")
    print("     CHRONIQUEUR verifiera/enrichira memory/fiches/ (le JUGEMENT).")
    print("   → Ces 2 agents ne tournent QU'EN CLOTURE. Une session fermee sans /wrap")
    print("     perd sa matiere : elle n'est retrouvable par personne a la session suivante.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
