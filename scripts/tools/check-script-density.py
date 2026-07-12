#!/usr/bin/env python3
"""
Verifie mecaniquement la densite de mots d'un script (narration voix-off) contre
la table "Densite cible par format" de memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md.

Contexte (2026-07-11) : un audit a trouve 3 fichiers donnant 3 chiffres differents
pour la densite d'un Short 90s. Corrige et unifie -- source de verite UNIQUE =
DOCTRINE-SCRIPT-UNIFIEE.md. Rien ne verifiait mecaniquement la regle avant ce script :
elle dependait de la discipline de l'agent qui ecrit le script. Ce script ferme ce trou.

Usage :
    python3 scripts/tools/check-script-density.py <script.md> --format short-90s
    python3 scripts/tools/check-script-density.py <script.md> --format midform-5min --duration-audio 298

Formats valides (voir --list-formats ou table ci-dessous) :
    short-90s       Short 90s            100-120 mots/min, 150-180 mots total
    midform-5min    Mid-form 5min        140 mots/min max,  700 mots max
    midform-8min    Mid-form 8min        140 mots/min max,  ~1100 mots max
    warmap-long     War-Map Long 5-7min  130-140 mots/min,  700-800 mots
    atlas           Atlas 4-6min         130 mots/min max,  650 mots max

Exit code 0 si dans la fourchette (mots total, et debit mots/min si --duration-audio
fourni), exit code 1 sinon (message avec ecart en % + conseil).

100% local/offline : comptage de mots + arithmetique. Aucun appel API.
"""

import argparse
import re
import sys
from pathlib import Path

# Table exacte lue depuis memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md
# section "## Densite cible par format" (ligne ~448-456). NE PAS modifier ces
# chiffres sans re-verifier la doctrine -- elle reste la source de verite unique.
#
# Format cle -> (label, mots/min min, mots/min max, mots total min, mots total max)
# Pour les lignes "max" uniquement (pas de plancher explicite dans la doctrine),
# le plancher mots/min est fixe a un ratio raisonnable (voir NOTE) et signale comme
# tel dans le message de sortie -- jamais invente en silence.
FORMATS = {
    "short-90s": {
        "label": "Short 90s",
        "wpm_min": 100,
        "wpm_max": 120,
        "words_min": 150,
        "words_max": 180,
        "wpm_is_ceiling_only": False,
    },
    "midform-5min": {
        "label": "Mid-form 5min",
        "wpm_min": None,
        "wpm_max": 140,
        "words_min": None,
        "words_max": 700,
        "wpm_is_ceiling_only": True,
    },
    "midform-8min": {
        "label": "Mid-form 8min",
        "wpm_min": None,
        "wpm_max": 140,
        "words_min": None,
        "words_max": 1100,  # doctrine: "~1100 max" (approximatif, note explicite)
        "wpm_is_ceiling_only": True,
        "words_max_is_approx": True,
    },
    "warmap-long": {
        "label": "War-Map Long 5-7min",
        "wpm_min": 130,
        "wpm_max": 140,
        "words_min": 700,
        "words_max": 800,
        "wpm_is_ceiling_only": False,
    },
    "atlas": {
        "label": "Atlas 4-6min",
        "wpm_min": None,
        "wpm_max": 130,
        "words_min": None,
        "words_max": 650,
        "wpm_is_ceiling_only": True,
    },
}

DOCTRINE_SOURCE = "memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md (section \"Densite cible par format\", ligne ~448-456)"


def list_formats_str():
    lines = []
    for key, f in FORMATS.items():
        wpm = (
            f"{f['wpm_min']}-{f['wpm_max']}"
            if f["wpm_min"] is not None
            else f"max {f['wpm_max']}"
        )
        words = (
            f"{f['words_min']}-{f['words_max']}"
            if f["words_min"] is not None
            else f"max {f['words_max']}"
        )
        lines.append(f"  {key:16s} {f['label']:22s} {wpm} mots/min, {words} mots total")
    return "\n".join(lines)


def strip_non_narration(text):
    """
    Retire du texte tout ce qui ne serait pas lu a voix haute par la narration :
    - frontmatter YAML markdown (--- ... ---) en tete de fichier
    - titres de section markdown (lignes commencant par #, ##, ### ...)
    - notes techniques entre crochets, ex: [tense], [pause], [note technique]
      (tags TTS V3 ElevenLabs inclus -- ils ne sont pas prononces tels quels)
    - lignes de metadonnees type "> commentaire" (blockquote markdown, notes de version)
    - separateurs markdown seuls sur une ligne (---, ***, ___)
    - lignes de tableau markdown (| ... | ...) -- ce sont des notes de gate, pas de la voix
    """
    # Frontmatter YAML en tete de fichier (--- ... ---)
    text = re.sub(r"^---\s*\n.*?\n---\s*\n", "", text, count=1, flags=re.DOTALL)

    lines = text.split("\n")
    kept = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        # Titres markdown
        if re.match(r"^#{1,6}\s", stripped):
            continue
        # Separateurs seuls
        if re.match(r"^(-{3,}|\*{3,}|_{3,})$", stripped):
            continue
        # Blockquote (notes de version, meta)
        if stripped.startswith(">"):
            continue
        # Lignes de tableau markdown (gate checklists, tables de reference)
        if stripped.startswith("|") and stripped.endswith("|"):
            continue
        kept.append(line)
    text = "\n".join(kept)

    # Notes techniques entre crochets : [tense], [pause], [note ...], tags TTS V3
    text = re.sub(r"\[[^\]]*\]", " ", text)

    return text


def count_words(text):
    """
    Compte les mots du texte narratif restant. Les nombres en toutes lettres
    comptent tel quel (ex: "treize cent vingt-six" = 3 mots) -- pas de deviner
    l'intention, pas de fusionner les mots composes.
    """
    # Un "mot" = sequence de caracteres alphanumeriques (accents FR inclus),
    # apostrophes/tirets internes toleres (ex: "qu'ils", "au-dela").
    words = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*", text)
    return words


def main():
    parser = argparse.ArgumentParser(
        description="Verifie la densite de mots d'un script contre la table DOCTRINE-SCRIPT-UNIFIEE.md.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"Formats valides :\n{list_formats_str()}\n\nSource : {DOCTRINE_SOURCE}",
    )
    parser.add_argument("script_path", nargs="?", help="Chemin vers le fichier script .md ou .txt")
    parser.add_argument(
        "--format",
        required=False,
        help="Format cible (voir --list-formats pour la liste). Requis sauf avec --list-formats.",
    )
    parser.add_argument(
        "--duration-audio",
        type=float,
        default=None,
        help="Duree audio reelle mesuree en secondes (ffprobe) -- calcule le debit reel mots/min",
    )
    parser.add_argument(
        "--list-formats",
        action="store_true",
        help="Liste les formats valides et quitte",
    )

    args = parser.parse_args()

    if args.list_formats:
        print(list_formats_str())
        sys.exit(0)

    if not args.script_path:
        parser.error("script_path est requis (sauf avec --list-formats)")
    if not args.format:
        parser.error("--format est requis (sauf avec --list-formats)")

    fmt_key = args.format.strip().lower()
    if fmt_key not in FORMATS:
        print(f"ERREUR : format inconnu '{args.format}'.", file=sys.stderr)
        print(f"Formats valides :\n{list_formats_str()}", file=sys.stderr)
        sys.exit(1)

    fmt = FORMATS[fmt_key]

    script_path = Path(args.script_path)
    if not script_path.exists():
        print(f"ERREUR : fichier introuvable : {script_path}", file=sys.stderr)
        sys.exit(1)
    if not script_path.is_file():
        print(f"ERREUR : n'est pas un fichier : {script_path}", file=sys.stderr)
        sys.exit(1)

    raw_text = script_path.read_text(encoding="utf-8")
    if not raw_text.strip():
        print(f"ERREUR : fichier vide : {script_path}", file=sys.stderr)
        sys.exit(1)

    narration_text = strip_non_narration(raw_text)
    words = count_words(narration_text)
    total_words = len(words)

    if total_words == 0:
        print(
            f"ERREUR : aucun mot de narration detecte dans {script_path} "
            "(tout le contenu a ete filtre comme metadonnee/titre/note technique). "
            "Verifier le fichier -- probablement pas un script de narration.",
            file=sys.stderr,
        )
        sys.exit(1)

    words_min = fmt["words_min"]
    words_max = fmt["words_max"]
    approx_note = " (~ approximatif dans la doctrine)" if fmt.get("words_max_is_approx") else ""

    problems = []
    advices = []

    # --- Verification total de mots ---
    if words_max is not None and total_words > words_max:
        pct = (total_words - words_max) / words_max * 100
        cut = total_words - words_max
        problems.append(
            f"total de mots ({total_words}) DEPASSE le plafond ({words_max}{approx_note}) de {pct:.0f}%"
        )
        advices.append(f"couper environ {cut} mots pour revenir dans la cible")
    elif words_min is not None and total_words < words_min:
        pct = (words_min - total_words) / words_min * 100
        missing = words_min - total_words
        problems.append(
            f"total de mots ({total_words}) EN DESSOUS du plancher ({words_min}) de {pct:.0f}%"
        )
        advices.append(f"densite insuffisante pour la duree cible -- ajouter environ {missing} mots ou resserrer la duree")

    # --- Verification debit reel mots/min (si duree audio fournie) ---
    real_wpm = None
    if args.duration_audio is not None:
        if args.duration_audio <= 0:
            print("ERREUR : --duration-audio doit etre > 0", file=sys.stderr)
            sys.exit(1)
        real_wpm = total_words / (args.duration_audio / 60.0)
        wpm_min = fmt["wpm_min"]
        wpm_max = fmt["wpm_max"]
        if wpm_max is not None and real_wpm > wpm_max:
            pct = (real_wpm - wpm_max) / wpm_max * 100
            problems.append(
                f"debit reel ({real_wpm:.0f} mots/min) DEPASSE le plafond ({wpm_max} mots/min) de {pct:.0f}%"
            )
            advices.append("debit trop rapide pour la duree audio reelle -- couper des mots ou ralentir la narration")
        elif wpm_min is not None and real_wpm < wpm_min:
            pct = (wpm_min - real_wpm) / wpm_min * 100
            problems.append(
                f"debit reel ({real_wpm:.0f} mots/min) EN DESSOUS du plancher ({wpm_min} mots/min) de {pct:.0f}%"
            )
            advices.append("debit trop lent -- densite insuffisante pour la duree audio reelle")

    # --- Rapport ---
    words_range_str = (
        f"{words_min}-{words_max}" if words_min is not None else f"max {words_max}"
    )
    header = f"Format : {fmt['label']} ({fmt_key}) -- cible {words_range_str} mots total"
    if fmt["wpm_min"] is not None or fmt["wpm_max"] is not None:
        wpm_range_str = (
            f"{fmt['wpm_min']}-{fmt['wpm_max']}"
            if fmt["wpm_min"] is not None
            else f"max {fmt['wpm_max']}"
        )
        header += f", {wpm_range_str} mots/min"

    print(header)
    print(f"Source : {DOCTRINE_SOURCE}")
    print(f"Fichier : {script_path}")
    print(f"Mots comptes (narration seule) : {total_words}")
    if real_wpm is not None:
        print(f"Duree audio : {args.duration_audio:.1f}s -> debit reel : {real_wpm:.0f} mots/min")

    if problems:
        print()
        print(f"HORS FOURCHETTE -- {' ; '.join(problems)}")
        for adv in advices:
            print(f"Conseil : {adv}")
        sys.exit(1)
    else:
        cible = f"{words_min}-{words_max}" if words_min is not None else f"max {words_max}"
        print()
        print(f"OK -- {total_words} mots (cible {cible})" + (
            f", debit {real_wpm:.0f} mots/min dans la fourchette" if real_wpm is not None else ""
        ))
        sys.exit(0)


if __name__ == "__main__":
    main()
