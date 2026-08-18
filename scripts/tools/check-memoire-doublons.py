#!/usr/bin/env python3
"""
check-memoire-doublons.py — garde-fou anti-FRAGMENT INVISIBLE entre les 2 arborescences memoire.

POURQUOI : notre memoire vit dans DEUX arborescences, volontairement, et les deux peuvent
contenir du contenu a jour. Mais l'index (MEMORY.md) ne peut pointer que vers UN chemin.
Donc un meme basename present des deux cotes ne cree PAS un doublon inoffensif :
il cree un fragment PRESENT MAIS INVISIBLE — le contenu n'est pas perdu, il est
faux-negatif a toute recherche par l'index.

2 cas reels trouves le 2026-08-17/18, tous deux invisibles depuis des semaines :
  - feedback_worktree-git-isolation-gotchas.md : la copie COURTE contenait un gotcha
    absent de la longue (« fichier totalement absent du worktree »). MEMORY.md pointait
    vers la longue -> gotcha invisible ~3 semaines.
  - tools/openrouter-gpt-image-et-breakdown.md : les 2 versions etaient COMPLEMENTAIRES
    (slugs de modeles + gotcha alpha d'un cote, tests de breakdown de l'autre) et
    MEMORY.md pointait vers la PLUS PAUVRE.

⛔ LA DATE ET LA TAILLE NE DISENT RIEN. Dans les 2 cas ci-dessus, la version la plus
ANCIENNE (ou la plus PETITE) contenait l'unique exemplaire d'une information.
Ce script ne tranche donc JAMAIS : il SIGNALE et demande un diff humain.

Usage :
  python3 scripts/tools/check-memoire-doublons.py
  python3 scripts/tools/check-memoire-doublons.py --quiet   # sortie courte

Sortie 2 si au moins une collision non resolue (= ni stub, ni identique).
"""
import argparse
import hashlib
import sys
from pathlib import Path

REPO = Path("/Users/clawdbot/Workspace/remotion/memory")
AUTO = Path("/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory")

# Memes basenames mais sujets DIFFERENTS — verifie a la main le 2026-08-18.
# Ne pas les re-signaler a chaque passe.
FAUX_POSITIFS = {
    "BEAT-1-COMPLETE.md",        # empire-ghana (repo) vs hannibal (auto)
    "PIXELLAB-WALK-PIPELINE.md", # mansa-moussa archive vs atlas-mansa-moussa
    "current-project.md",
    "CLAUDE.md",                 # fichiers d'instructions distincts
    "MEMORY.md",
}

# Un fichier qui redirige vers l'autre arborescence = collision DEJA RESOLUE.
MARQUEURS_STUB = (
    "DEPLACE", "DÉPLACÉ",
    "Source de vérité désormais unique", "source de verite desormais unique",
    "a été fusionné", "a ete fusionne", "fusionné dans", "fusionne dans",
    "Ne pas recréer de contenu ici", "Ne rien écrire ici",
)


def index(root: Path) -> dict:
    out = {}
    if not root.exists():
        return out
    for p in root.rglob("*.md"):
        out.setdefault(p.name, []).append(p)
    return out


def digest(p: Path) -> str:
    try:
        return hashlib.md5(p.read_bytes()).hexdigest()
    except OSError:
        return "?"


def est_stub(p: Path) -> bool:
    try:
        txt = p.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False
    if len(txt) > 2000:          # un stub est court par construction
        return False
    return any(m in txt for m in MARQUEURS_STUB)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    a, b = index(REPO), index(AUTO)
    collisions = sorted(set(a) & set(b) - FAUX_POSITIFS)

    a_traiter, resolues = [], []
    for name in collisions:
        pa, pb = a[name][0], b[name][0]
        if digest(pa) == digest(pb):
            resolues.append((name, "identiques a l'octet"))
        elif est_stub(pa) or est_stub(pb):
            resolues.append((name, "stub de redirection en place"))
        else:
            a_traiter.append((name, pa, pb))

    if not args.quiet:
        print(f"2 arborescences : {len(a)} fichiers (repo) / {len(b)} fichiers (auto-memory)")
        print(f"Collisions de basename : {len(collisions)}  "
              f"(dont {len(resolues)} deja resolues, {len(FAUX_POSITIFS)} faux positifs connus ignores)\n")
        for name, why in resolues:
            print(f"  [ok  ] {name} — {why}")
        if resolues:
            print()

    for name, pa, pb in a_traiter:
        sa, sb = pa.stat().st_size, pb.stat().st_size
        flag = "  ⚠️ auto-memory PLUS GROS -> contenu unique probable" if sb > sa else ""
        print(f"  [DIFF] {name}{flag}")
        print(f"         repo : {sa:>7} o  {pa}")
        print(f"         auto : {sb:>7} o  {pb}")

    if a_traiter:
        print(f"\n⛔ {len(a_traiter)} collision(s) NON resolue(s).")
        print("   ⛔ NE PAS trancher sur la date ni la taille — 2 cas reels ou la version la plus")
        print("      ancienne/petite portait l'unique exemplaire d'une info (2026-08-17/18).")
        print("   Procedure : diff -> rapatrier le contenu unique vers le chemin pointe par MEMORY.md")
        print("               -> remplacer l'autre par un STUB de redirection (jamais une suppression seche).")
        return 2

    print("✅ Aucune collision non resolue entre les 2 arborescences memoire.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
