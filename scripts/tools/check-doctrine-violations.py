#!/usr/bin/env python3
"""
check-doctrine-violations.py — Verifie mecaniquement que le code respecte les
regles NON-NEGOTIABLE documentees dans CLAUDE.md / doctrines, au lieu de compter
sur la vigilance de l'agent qui ecrit le code.

Root-cause (audit 2026-07-11, rapport "flow agentique") : une decision doctrine
tranchee (ex: "Mapbox frame-driven, jamais flyTo/easeTo") peut etre violee dans le
code sans que rien ne le detecte — la regle est documentee, mais jamais VERIFIEE
mecaniquement contre le code deja ecrit. Exemple reel trouve le meme jour :
WarMapOverlayExplicatif.tsx utilisait un fond semi-transparent alors que
WARMAP-GRAMMAIRE.md §9 le bannit explicitement depuis le 2026-06-14 — decouvert
seulement un mois plus tard, par un audit manuel.

Regles verifiees (grep externe sur du code deja merge, PAS juste au moment de l'edit) :
  R1  Mapbox : flyTo/easeTo interdits (CLAUDE.md, doctrine Souverain regle 3)
  R2  Anti-patterns Remotion : CSS transition:, setTimeout, @keyframes, requestAnimationFrame
      (CLAUDE.md "Rappels techniques")
  R3  War-Map : mode="semitransp" sur WarMapOverlayDynamic (WARMAP-GRAMMAIRE.md §9,
      BANNI depuis 2026-06-14 — WarMapDimmedOverlay reste AUTORISE, ce n'est pas
      la meme regle : W3 ne flag PAS WarMapDimmedOverlay)
  R4  Emojis dans le code (CLAUDE.md "NO EMOJIS IN CODE" — .ts/.tsx/.js/.json/.yaml/.env)

Usage :
  python3 scripts/tools/check-doctrine-violations.py                 # scanne tout src/
  python3 scripts/tools/check-doctrine-violations.py src/projects/warmap/  # sous-dossier
  python3 scripts/tools/check-doctrine-violations.py --list-rules    # affiche les regles sans scanner

Exit code 0 si 0 violation, 1 sinon. Ne modifie jamais de fichier — diagnostic seul.
Ce script complete (ne remplace pas) les gates au moment de l'edit (hooks lint-on-edit,
gemini-model-guard.sh) : il rattrape la derive du code deja merge, jamais re-scanne depuis.
"""
import argparse
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
RED = "\033[91m"; YEL = "\033[93m"; GRN = "\033[92m"; DIM = "\033[2m"; BOLD = "\033[1m"; RST = "\033[0m"

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}
EMOJI_EXTENSIONS = {".ts", ".tsx", ".js", ".json", ".yaml", ".yml", ".env"}

# Plages emoji reelles (emoticones, symboles/pictogrammes, transport, drapeaux, dingbats
# colores) — exclut DELIBEREMENT les fleches U+2190-21FF et les symboles divers U+2600-26FF
# (⚠ ⭐ ⛔ etc.) car un premier essai de ce script a montre que ces plages capturent la
# typographie normale du repo (fleches narratives →, marqueurs ⭐/⛔ dans les commentaires,
# usage etabli sur 36 fichiers) — ce ne sont pas des "emojis" au sens vise par la regle
# CLAUDE.md (image couleur affichee), et les flagger produirait un bruit qui masquerait
# les vraies violations.
EMOJI_RE = re.compile(
    "[\U0001F300-\U0001F5FF\U0001F600-\U0001F64F\U0001F680-\U0001F6FF"
    "\U0001F900-\U0001F9FF\U0001FA70-\U0001FAFF\U00002702-\U000027B0\U0001F1E6-\U0001F1FF]"
)


def strip_comment(line: str) -> str:
    s = line.strip()
    if s.startswith("//") or s.startswith("*") or s.startswith("/*"):
        return ""
    m = re.search(r"(?<!:)//", line)
    return line[: m.start()] if m else line


def iter_source_files(target: Path, extensions: set[str]):
    if target.is_file():
        if target.suffix in extensions:
            yield target
        return
    for ext in extensions:
        yield from target.rglob(f"*{ext}")


def check_r1_mapbox_flyto(path: Path, lines: list[str]) -> list[tuple[int, str]]:
    hits = []
    for i, raw in enumerate(lines, 1):
        line = strip_comment(raw)
        if re.search(r"\.\s*flyTo\s*\(|\.\s*easeTo\s*\(", line):
            hits.append((i, f"Mapbox flyTo/easeTo detecte (incompatible headless) : {raw.strip()[:100]}"))
    return hits


def check_r2_remotion_antipatterns(path: Path, lines: list[str]) -> list[tuple[int, str]]:
    """setTimeout/requestAnimationFrame sont EXCLUS (pas juste WARN — vrai faux positif
    confirme) quand le fichier fait de l'integration Mapbox (delayRender/continueRender,
    map.on(...)) : la ou ils servent a attendre un evenement Mapbox asynchrone natif
    (carte qui charge) AVANT une capture de frame headless, pas a animer du contenu
    Remotion frame-par-frame. C'est le pattern officiel Remotion+Mapbox (delayRender),
    pas la derive que la regle CLAUDE.md vise (animation hors frame-driven)."""
    hits = []
    src = "".join(lines)
    is_mapbox_integration = bool(re.search(r"\bdelayRender\s*\(|\bcontinueRender\s*\(|\bmap\.on\s*\(", src))
    for i, raw in enumerate(lines, 1):
        line = strip_comment(raw)
        # "none" desactive explicitement toute transition — ce n'est pas l'anti-pattern vise
        # (une vraie transition CSS animee, ex: transition: "opacity 0.3s ease").
        if re.search(r"\bCSS\s*transition\s*:", line) or re.search(r'transition\s*:\s*[\"\'](?!none[\"\'])', line):
            hits.append((i, f"CSS transition: interdit (utiliser interpolate/spring) : {raw.strip()[:100]}"))
        if re.search(r"@keyframes\b", line):
            hits.append((i, f"@keyframes CSS interdit : {raw.strip()[:100]}"))
        if not is_mapbox_integration:
            if re.search(r"\bsetTimeout\s*\(", line):
                hits.append((i, f"setTimeout interdit (non frame-deterministe) : {raw.strip()[:100]}"))
            if re.search(r"\brequestAnimationFrame\s*\(", line):
                hits.append((i, f"requestAnimationFrame interdit (utiliser useCurrentFrame) : {raw.strip()[:100]}"))
    return hits


def check_r3_warmap_semitransp(path: Path, lines: list[str]) -> list[tuple[int, str]]:
    """Ne flag QUE un appel actif JSX <WarMapOverlayDynamic mode="semitransp" .../> — pas
    la declaration du parametre par defaut dans la definition du composant lui-meme
    (WarMapOverlayDynamic.tsx redirige deja "semitransp" -> rendu "card" en interne,
    c'est de la retrocompat neutralisee, pas une violation active a signaler)."""
    hits = []
    src = "".join(lines)
    # La definition du composant (export const WarMapOverlay... = ({ ... mode = "semitransp" ...
    # est du cote DECLARATION (parametre par defaut), jamais un vrai appel a auditer.
    if "export const WarMapOverlayDynamic" in src or "export const WarMapOverlayExplicatif" in src:
        return hits
    if "<WarMapOverlayDynamic" not in src and "<WarMapOverlayExplicatif" not in src:
        return hits
    for i, raw in enumerate(lines, 1):
        line = strip_comment(raw)
        if re.search(r'mode\s*=\s*["\']semitransp["\']', line):
            hits.append((i, f"mode=\"semitransp\" utilise en appel actif — BANNI (WARMAP-GRAMMAIRE.md §9, 2026-06-14) : {raw.strip()[:100]}"))
    return hits


def check_r4_emojis(path: Path, lines: list[str]) -> list[tuple[int, str]]:
    """ERROR si l'emoji est dans du texte qui sera AFFICHE (JSX/string litteral hors
    commentaire) — le vrai risque de la regle CLAUDE.md. WARN si c'est dans un
    commentaire // ou /* */ — usage etabli sur 36 fichiers du repo (⭐/⛔ comme marqueurs
    de priorite dans les commentaires), tolere en pratique mais signale pour arbitrage."""
    hits = []
    for i, raw in enumerate(lines, 1):
        if not EMOJI_RE.search(raw):
            continue
        stripped = strip_comment(raw)
        if EMOJI_RE.search(stripped):
            hits.append((i, f"Emoji dans du texte affiche (JSX/string) — interdit : {raw.strip()[:100]}"))
        else:
            hits.append((i, f"[W] Emoji dans un commentaire (tolere en pratique, 36 fichiers existants) : {raw.strip()[:100]}"))
    return hits


RULES = {
    "R1_mapbox_flyto": (check_r1_mapbox_flyto, CODE_EXTENSIONS),
    "R2_remotion_antipatterns": (check_r2_remotion_antipatterns, CODE_EXTENSIONS),
    "R3_warmap_semitransp": (check_r3_warmap_semitransp, {".tsx", ".ts"}),
    "R4_no_emojis": (check_r4_emojis, EMOJI_EXTENSIONS),
}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("target", nargs="?", default="src", help="Fichier ou dossier a scanner (defaut: src/)")
    ap.add_argument("--list-rules", action="store_true", help="Afficher les regles sans scanner")
    args = ap.parse_args()

    if args.list_rules:
        print(f"{BOLD}Regles verifiees :{RST}")
        for name in RULES:
            print(f"  - {name}")
        return

    target = (REPO_ROOT / args.target).resolve()
    if not target.exists():
        print(f"{RED}ERROR{RST} Cible introuvable : {target}", file=sys.stderr)
        sys.exit(2)

    total_errors = 0
    total_warnings = 0
    files_scanned = 0

    print(f"{BOLD}=== check-doctrine-violations : {target} ==={RST}\n")

    for rule_name, (check_fn, extensions) in RULES.items():
        rule_errors = []
        for f in iter_source_files(target, extensions):
            if "_archive" in f.parts or "node_modules" in f.parts:
                continue
            try:
                lines = f.read_text(encoding="utf-8", errors="ignore").splitlines(keepends=True)
            except Exception:
                continue
            files_scanned += 1
            hits = check_fn(f, lines)
            for lineno, msg in hits:
                is_warning = msg.startswith("[W]")
                rule_errors.append((f, lineno, msg, is_warning))

        if rule_errors:
            print(f"{BOLD}{rule_name}{RST}")
            for f, lineno, msg, is_warning in rule_errors:
                rel = f.relative_to(REPO_ROOT)
                tag = f"{YEL}WARN{RST}" if is_warning else f"{RED}ERROR{RST}"
                print(f"  {tag} {rel}:{lineno} — {msg.removeprefix('[W] ')}")
                if is_warning:
                    total_warnings += 1
                else:
                    total_errors += 1
            print()

    print(f"{BOLD}=== Resume ==={RST}")
    print(f"Fichiers scannes (avec doublons inter-regles) : {files_scanned}")
    print(f"{RED if total_errors else GRN}{total_errors} erreur(s){RST}, {YEL if total_warnings else GRN}{total_warnings} avertissement(s){RST}")

    sys.exit(1 if total_errors else 0)


if __name__ == "__main__":
    main()
