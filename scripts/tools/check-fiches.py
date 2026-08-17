#!/usr/bin/env python3
"""
check-fiches.py — garde-fou anti-peremption des fiches de declenchement.

POURQUOI : le projet a 4 cas documentes de fiche qui MENT (un catalogue declarant
"inexistant" un composant qui existait, un registre "canonique" sur une branche jamais
mergee, un fix ecrit en memoire mais jamais applique au code, deux compositions
quasi identiques dont une seule etait la vraie). Point commun : la fiche decrivait le
code, et le code a change sans elle.

Une fiche qui ment est PIRE que pas de fiche : elle cloture la recherche.

Ce script verifie mecaniquement que tout chemin cite dans une fiche existe encore.
A lancer en fin de session. Sortie 2 si au moins un chemin est mort.

Usage :
  python3 scripts/tools/check-fiches.py
  python3 scripts/tools/check-fiches.py --dir memory/fiches
"""

import argparse
import os
import re
import sys

# Chemins repo-relatifs cites dans les fiches : src/..., public/..., scripts/...,
# memory/..., .claude/... Capture jusqu'a l'extension ou la fin du segment.
PATH_RE = re.compile(
    r'(?<![\w/.])((?:src|public|scripts|memory|out|tests|\.claude)/[A-Za-z0-9_\-./*]+)')

# Suffixes de ponctuation a retirer d'une capture.
TRAIL = ".,;:)`'\"]}>"


def clean(p):
    while p and p[-1] in TRAIL:
        p = p[:-1]
    return p


def main():
    ap = argparse.ArgumentParser(description="Verifie que les chemins cites dans les fiches existent.")
    ap.add_argument("--dir", default="memory/fiches")
    ap.add_argument("--root", default=".")
    a = ap.parse_args()

    fiches_dir = os.path.join(a.root, a.dir)
    if not os.path.isdir(fiches_dir):
        print(f"ERREUR : {fiches_dir} introuvable", file=sys.stderr)
        return 1

    fiches = sorted(f for f in os.listdir(fiches_dir)
                    if f.endswith(".md") and f != "README.md")
    if not fiches:
        print("Aucune fiche a verifier.")
        return 0

    total_dead = 0
    for fn in fiches:
        path = os.path.join(fiches_dir, fn)
        text = open(path, encoding="utf-8").read()
        seen, dead = set(), []
        for m in PATH_RE.finditer(text):
            p = clean(m.group(1))
            if not p or p in seen:
                continue
            seen.add(p)
            # Les chemins avec joker sont indicatifs : on ne peut pas les resoudre ici.
            if "*" in p:
                continue
            if not os.path.exists(os.path.join(a.root, p)):
                dead.append(p)

        status = "OK " if not dead else "MORT"
        print(f"[{status}] {fn} — {len(seen)} chemins cites, {len(dead)} introuvable(s)")
        for d in dead:
            print(f"         ⛔ {d}")
        total_dead += len(dead)

    print()
    if total_dead:
        print(f"⛔ {total_dead} chemin(s) mort(s). Une fiche qui ment cloture la recherche —")
        print("   corriger MAINTENANT (le fichier a-t-il bouge ? la brique a-t-elle ete supprimee ?).")
        return 2
    print("✅ Toutes les fiches pointent vers des chemins existants.")
    print("   Rappel : ce script verifie l'EXISTENCE, pas que le contenu dit encore vrai.")
    print("   La verification du CONTENU se fait a l'usage (cf. en-tete de chaque fiche).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
