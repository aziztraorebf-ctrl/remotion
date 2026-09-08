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
    check_budget_lignes()
    return 0


# --- ajout 2026-08-29 : le rapport VERT ne prouvait que la couverture du script ---
# Vecu au wrap : 13/13 fiches [OK] pendant que les 13 depassaient TOUTES leur budget
# (2050 lignes pour 715). Une fiche est du contexte INJECTE a chaque edition : elle
# gonfle exactement comme MEMORY.md a gonfle, et la regle ecrite seule n'a rien empeche
# (cf. feedback regle-ecrite-insuffisante-sans-gate-outille). Le seuil est mecanique,
# chiffre, zero faux positif — contrairement a la veracite du contenu qui ne s'automatise pas.
BUDGET_LIGNES = 55

# --- ajout 2026-09-08 : ne pas crier sur ce qui est DEJA arbitre ---
# Le script signalait 12 fiches hors budget alors que le README en exempte 7 par un
# arbitrage ECRIT et motive (« la camera est le pain point n°1 », « le storyboard
# deplace le jugement avant le code, 49 % de re-travail »...). Une alerte qui repete
# du connu devient du bruit, et le bruit fait desactiver les gates — c'est exactement
# le mecanisme documente dans index-composants-gate.sh. Les exemptions sont LUES depuis
# le README (source de verite unique) : en durcir la liste ici la ferait diverger.
def _exemptions() -> set:
    """Fiches dont le depassement est arbitre par ecrit dans memory/fiches/README.md."""
    import pathlib
    import re
    readme = pathlib.Path(__file__).resolve().parents[2] / "memory" / "fiches" / "README.md"
    if not readme.is_file():
        return set()
    txt = readme.read_text(encoding="utf-8")
    m = re.search(r"hors budget assum(.{0,900}?)⛔⛔", txt, re.S)
    if not m:
        return set()
    return {n if n.endswith(".md") else n + ".md"
            for n in re.findall(r"`(FICHE-[A-Z0-9-]+)`", m.group(1))}


def check_budget_lignes():
    import pathlib

    dossier = pathlib.Path(__file__).resolve().parents[2] / "memory" / "fiches"
    if not dossier.is_dir():
        return []
    exempt = _exemptions()
    trop = []
    total = 0
    n_exempt = 0
    for f in sorted(dossier.glob("FICHE-*.md")):
        n = len(f.read_text(encoding="utf-8").splitlines())
        total += n
        if n > BUDGET_LIGNES:
            if f.name in exempt:
                n_exempt += 1
                continue
            trop.append((f.name, n))
    if not trop:
        if n_exempt:
            print(f"\n   ({n_exempt} fiche(s) hors budget, depassement ARBITRE dans README.md)")
        return []
    print(f"\n⚠️  BUDGET DE LIGNES DEPASSE ({len(trop)} fiche(s) NON arbitree(s), "
          f"{total} lignes au total, {n_exempt} exemptee(s) par README.md)")
    print(f"   Chaque fiche est injectee dans le contexte a chaque edition — budget {BUDGET_LIGNES} lignes.")
    for nom, n in sorted(trop, key=lambda x: -x[1]):
        print(f"   {n:>4} l. ({n / BUDGET_LIGNES:.1f}x)  {nom}")
    print("   -> retirer la ligne la plus faible en cout documente, ou DEPLACER un bloc")
    print("      hors-sujet vers son foyer naturel en laissant un pointeur d'une ligne.")
    return trop


if __name__ == "__main__":
    sys.exit(main())

# --- ajout 2026-08-19 : un chemin qui EXISTE mais est GITIGNORE est une bombe a retardement ---
# Vecu : les generateurs de previs cites par FICHE-CLIP-GENERE vivaient sous out/ (gitignore +
# purge 7j). check-fiches disait [OK] car il testait l'existence sur disque, pas le versionnement.
def check_gitignored(paths):
    import subprocess
    flagged = []
    for c in paths:
        r = subprocess.run(['git', 'check-ignore', '-q', c], capture_output=True)
        if r.returncode == 0:
            flagged.append(c)
    if flagged:
        print("\n⛔ CHEMINS CITES MAIS GITIGNORES (existent ici, disparaitront ailleurs) :")
        for c in flagged:
            print(f"   {c}")
        print("   -> rapatrier en zone versionnee (scripts/tools/, src/, memory/) avant de les citer.")
    return flagged
