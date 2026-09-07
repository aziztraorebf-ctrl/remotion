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
import subprocess
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
    # Ajoute 2026-07-25 : CLAUDE.md en fait une lecture OBLIGATOIRE de debut de session (etape 2),
    # mais ses liens n'etaient jamais verifies -> un pointeur vers un fichier absent y a survecu.
    "memory/NEXT-ACTION.md",
    # Ajoutes 2026-08-27 (wrap) : MEME INCIDENT QUE CI-DESSUS, 2e occurrence. Le script rapportait
    # "OK, aucun lien mort" sur 558 chemins alors que PILIERS-B2B.md portait 2 pointeurs MORTS vers
    # freelance-dataviz-fiverr-pro.md (fichier en auto-memoire, pas dans le repo). Cause : couverture
    # du gate trop etroite, pas defaut de logique. PILIERS-B2B est marque ⭐⭐⭐ dans MEMORY.md et
    # sert de doctrine d'aiguillage ; RECHERCHE-MARCHE-INDEX est la porte d'entree du marche.
    "memory/doctrines/PILIERS-B2B.md",
    "memory/projects/RECHERCHE-MARCHE-INDEX.md",
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

# Liens markdown relatifs COURTS `[texte](chemin/fichier.md)` sans préfixe memory/src/scripts/public
# ni ../../.. — le cas de l'auto-memory qui pointe vers un fichier du MÊME dossier (ex: feedbacks/x.md).
# Ajouté 2026-07-11 : un lien mort de ce type (feedbacks/feedback_deux-agents-creatifs-...) a survécu
# à check-links.py jusqu'à découverte accidentelle, car ni PATH_RE ni REPO_REL_RE ne le couvraient.
SHORT_REL_RE = re.compile(r"\]\(((?!https?://|\.\./)[A-Za-z0-9_./-]+\.(?:tsx|ts|md|py|sh|json))\)")


def scan_file(path, label=None, base_dir=None):
    """Retourne la liste des (ligne, chemin_cite, existe?) pour un fichier.
    base_dir : dossier de résolution pour les liens relatifs courts (défaut = ROOT,
    mais l'auto-memory doit résoudre relatif à SON PROPRE dossier, pas ROOT)."""
    label = label or path
    full = path if os.path.isabs(path) else os.path.join(ROOT, path)
    if not os.path.exists(full):
        return [("-", label, False, "FICHIER NAV ABSENT")]
    # ⛔ 3e occurrence du meme pattern (2026-08-27, wrap) : le script rapportait « OK, aucun lien
    # mort » alors que NEXT-ACTION.md portait 4 liens RELATIFS casses. Cause : sans base_dir, les
    # liens courts etaient resolus depuis ROOT, alors qu'un lien markdown se resout depuis le
    # DOSSIER DU FICHIER qui le contient. `[x](projects/A.md)` ecrit dans memory/NEXT-ACTION.md
    # pointe sur memory/projects/A.md, pas sur projects/A.md.
    # Defaut de RESOLUTION cette fois, pas seulement de couverture.
    resolve_dir = base_dir or os.path.dirname(full) or ROOT
    results = []
    with open(full, encoding="utf-8", errors="ignore") as f:
        for i, line in enumerate(f, 1):
            repo_rooted = set(PATH_RE.findall(line)) | set(REPO_REL_RE.findall(line))
            for c in repo_rooted:
                if "*" in c or "|" in c:
                    continue
                target = os.path.join(ROOT, c)
                results.append((i, c, os.path.exists(target), label))
            for c in SHORT_REL_RE.findall(line):
                if "*" in c or "|" in c:
                    continue
                # valide si le lien resout depuis le dossier du fichier (comportement markdown
                # reel) OU depuis ROOT (convention historique de certains fichiers de navigation)
                ok = (os.path.exists(os.path.join(resolve_dir, c))
                      or os.path.exists(os.path.join(ROOT, c)))
                results.append((i, c, ok, label))
    return results


def branches_portant(chemin: str) -> list:
    """Les branches locales qui portent ce chemin. Vide si git echoue.

    Sert a distinguer « le chemin est faux » (absent partout) de « la branche est
    en retard » (present ailleurs) — voir le commentaire dans main().
    """
    chemin = chemin.lstrip("./")
    try:
        refs = subprocess.run(
            ["git", "for-each-ref", "--format=%(refname:short)", "refs/heads/"],
            cwd=ROOT, capture_output=True, text=True, timeout=10)
        if refs.returncode != 0:
            return []
        out = []
        for b in refs.stdout.split():
            r = subprocess.run(["git", "cat-file", "-e", f"{b}:{chemin}"],
                               cwd=ROOT, capture_output=True, timeout=10)
            if r.returncode == 0:
                out.append(b)
        return out
    except (subprocess.SubprocessError, OSError):
        return []


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

    # auto-memory (chemin fixe hors repo) — base_dir = son propre dossier pour les liens
    # relatifs courts (feedbacks/x.md), PAS ROOT (le repo Remotion) sinon faux positifs massifs.
    if not args or args == ["--all"]:
        if os.path.exists(AUTO_MEMORY):
            auto_memory_dir = os.path.dirname(AUTO_MEMORY)
            for ln, cited, exists, label in scan_file(AUTO_MEMORY, label="AUTO-MEMORY/MEMORY.md", base_dir=auto_memory_dir):
                checked += 1
                if not exists:
                    broken.append((label, ln, cited))

    print(f"check-links: {checked} chemins verifies dans {len(files)} fichier(s) de navigation.")
    if not broken:
        print("OK — aucun lien mort.")
        return 0
    # Un chemin absent du worktree COURANT peut exister sur une autre branche :
    # les fichiers de navigation (dont MEMORY.md, qui vit hors du repo) indexent
    # l'union de ce qui a ete appris, le worktree n'en porte qu'une intersection.
    # Sans ce tri, le rapport dit « INTROUVABLE » pour du contenu bien vivant et
    # pousse a supprimer la ligne d'index. Mesure du 2026-09-07 : 2 liens sur 2
    # etaient dans ce cas (presents sur 4 et 5 branches).
    ailleurs, absents = [], []
    for label, ln, cited in broken:
        if branches_portant(cited):
            ailleurs.append((label, ln, cited, branches_portant(cited)))
        else:
            absents.append((label, ln, cited))

    if absents:
        print(f"\n{len(absents)} LIEN(S) MORT(S) — absents de TOUTE branche :")
        for label, ln, cited in absents:
            print(f"  {label}:{ln}  ->  {cited}  (INTROUVABLE)")

    if ailleurs:
        print(f"\n{len(ailleurs)} lien(s) presents SUR UNE AUTRE BRANCHE "
              f"(branche courante en retard) :")
        for label, ln, cited, br in ailleurs:
            suffixe = f" (+{len(br) - 1})" if len(br) > 1 else ""
            print(f"  {label}:{ln}  ->  {cited}  [{br[0]}{suffixe}]")
        print("  ⛔ NE PAS supprimer ces lignes : le savoir existe, c'est la branche "
              "qui est en retard.")
        print("  Recuperer sans rien ecraser : git show <branche>:<chemin> > <chemin>")

    return 1 if absents else 0


if __name__ == "__main__":
    sys.exit(main())
