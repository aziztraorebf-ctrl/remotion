#!/usr/bin/env python3
"""
check-links.py — Garde-fou liens morts dans les fichiers de NAVIGATION.

Verifie que tout chemin de fichier cite dans les fichiers d'aiguillage (CLAUDE.md,
ROUTAGE, les INDEX par pilier, SCRIPTS-INDEX, REVIEW-TOOLS-INDEX) pointe vers un
fichier qui EXISTE reellement. Cree apres le menage du 2026-06-15 (test agent vierge
a revele des liens morts post-deplacement). A lancer apres tout deplacement/renommage
de fichier memoire ou script.

Usage:
  python3 scripts/tools/check-links.py            # scanne les fichiers de navigation
  python3 scripts/tools/check-links.py --all      # scanne TOUS les .md du repo (hors archive)
  python3 scripts/tools/check-links.py <f1> <f2>  # scanne des fichiers precis

Exit 0 si aucun lien mort, 1 sinon (utilisable en pre-commit / CI).
"""
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Fichiers de navigation = ceux dont un lien mort coute le plus cher (lus en debut de tache).
NAV_FILES = [
    "CLAUDE.md",
    "memory/ROUTAGE.md",
    "src/projects/_shared/INDEX-DES-INDEX.md",
    "src/projects/souverain/SOUVERAIN-INDEX.md",
    "src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md",
    "src/projects/warmap/WARMAP-INDEX.md",
    "scripts/SCRIPTS-INDEX.md",
    "scripts/tools/REVIEW-TOOLS-INDEX.md",
]

# L'auto-memory MEMORY.md vit hors repo (chemin fixe). On le scanne aussi s'il existe.
AUTO_MEMORY = os.path.expanduser(
    "~/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/MEMORY.md"
)

# On extrait les chemins type `memory/...`, `src/...`, `scripts/...`, `public/...`,
# qu'ils soient dans un lien markdown [..](path) ou en inline `path`.
PATH_RE = re.compile(
    r"(?:\]\(|`)((?:memory|src|scripts|public)/[A-Za-z0-9_./-]+\.(?:tsx|ts|md|py|sh|json|png|mp4))"
)

# Liens markdown relatifs longs vers le repo depuis l'auto-memory.
REPO_REL_RE = re.compile(r"\]\((?:\.\./)+Workspace/remotion/([A-Za-z0-9_./-]+\.\w+)\)")


def scan_file(path, label=None):
    """Retourne la liste des (ligne, chemin_cite, existe?) pour un fichier."""
    label = label or path
    full = path if os.path.isabs(path) else os.path.join(ROOT, path)
    if not os.path.exists(full):
        return [("-", label, False, "FICHIER NAV ABSENT")]
    results = []
    with open(full, encoding="utf-8", errors="ignore") as f:
        for i, line in enumerate(f, 1):
            cited = set(PATH_RE.findall(line)) | set(REPO_REL_RE.findall(line))
            for c in cited:
                # ignorer les patterns/globs et les chemins avec wildcard
                if "*" in c or "|" in c:
                    continue
                target = os.path.join(ROOT, c)
                results.append((i, c, os.path.exists(target), label))
    return results


def main():
    args = sys.argv[1:]
    if args and args[0] == "--all":
        files = []
        for dirpath, dirnames, filenames in os.walk(ROOT):
            if any(skip in dirpath for skip in ("node_modules", ".git", "_archive", "/archive/", "__pycache__")):
                continue
            for fn in filenames:
                if fn.endswith(".md"):
                    files.append(os.path.relpath(os.path.join(dirpath, fn), ROOT))
    elif args:
        files = args
    else:
        files = list(NAV_FILES)

    broken = []
    checked = 0
    for f in files:
        for ln, cited, exists, label in scan_file(f):
            checked += 1
            if not exists:
                broken.append((label, ln, cited))

    # auto-memory (chemin fixe hors repo)
    if not args or args == ["--all"]:
        if os.path.exists(AUTO_MEMORY):
            for ln, cited, exists, label in scan_file(AUTO_MEMORY, label="AUTO-MEMORY/MEMORY.md"):
                checked += 1
                if not exists:
                    broken.append((label, ln, cited))

    print(f"check-links: {checked} chemins verifies dans {len(files)} fichier(s) de navigation.")
    if not broken:
        print("OK — aucun lien mort.")
        return 0
    print(f"\n{len(broken)} LIEN(S) MORT(S) :")
    for label, ln, cited in broken:
        print(f"  {label}:{ln}  ->  {cited}  (INTROUVABLE)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
