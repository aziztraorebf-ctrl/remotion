#!/usr/bin/env python3
"""
check-frame-continuity.py — garde-fou anti-trous avant tout assemblage multi-fichiers.

Contexte : bug 2026-07-01 (War-Map Sahel) — des renders faits en plusieurs morceaux
(--frames=X-Y par segment) avaient des trous entre segments (frames jamais rendues,
narration/visuel sautés silencieusement). Personne (agent ni humain) ne l'a détecté
avant présentation du livrable. Ce script rend l'erreur impossible à manquer.

Usage :
  python3 scripts/tools/check-frame-continuity.py 2055-2939 3196-5699 6118-9409

  Chaque argument est une plage "start-end" (frames absolues du moteur, mêmes unités
  que les triggers F_* du code et que --frames= passé à render-mapbox.sh).

Sortie : OK si les plages sont contiguës (end[i] == start[i+1] à 1 frame près), sinon
liste les trous/chevauchements avec leur durée en secondes (@30fps) et EXIT CODE 1.

RÈGLE : à lancer AVANT tout render multi-segments (sur les bornes prévues) ET après
(sur les bornes réellement utilisées) — jamais assembler ni présenter sans un OK ici.
"""
import sys

FPS = 30


def parse_range(s: str) -> tuple[int, int]:
    a, b = s.split("-")
    return int(a), int(b)


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: check-frame-continuity.py <start-end> <start-end> ... (au moins 2 plages, dans l'ordre)")
        return 2

    ranges = [parse_range(a) for a in sys.argv[1:]]
    problems = []

    for start, end in ranges:
        if end <= start:
            problems.append(f"  Plage invalide {start}-{end} : fin <= début")

    for i in range(len(ranges) - 1):
        end_prev = ranges[i][1]
        start_next = ranges[i + 1][0]
        gap = start_next - end_prev
        if gap > 1:
            problems.append(
                f"  TROU entre segment {i+1} (fin={end_prev}) et segment {i+2} (début={start_next}) "
                f"= {gap} frames MANQUANTES ({gap / FPS:.1f}s de narration/visuel jamais rendues)"
            )
        elif gap < 0:
            problems.append(
                f"  CHEVAUCHEMENT entre segment {i+1} (fin={end_prev}) et segment {i+2} (début={start_next}) "
                f"= {-gap} frames REJOUÉES EN DOUBLE ({-gap / FPS:.1f}s répétées, ex: dialogue qui se répète)"
            )

    total_frames = sum(e - s for s, e in ranges)
    span = ranges[-1][1] - ranges[0][0]
    coverage_pct = 100.0 * total_frames / span if span > 0 else 0

    print(f"Plages vérifiées : {len(ranges)} segment(s), de {ranges[0][0]} à {ranges[-1][1]}")
    print(f"Couverture : {total_frames}/{span} frames ({coverage_pct:.1f}%)")

    if problems:
        print("\n❌ ÉCHEC — trous/chevauchements détectés :\n")
        for p in problems:
            print(p)
        print(
            "\n⛔ NE PAS assembler ni présenter ces renders tant que ces écarts ne sont pas résolus.\n"
            "   Vérifier les triggers F_* du code source pour combler les trous avec les bonnes bornes."
        )
        return 1

    print("\n✅ OK — aucune frame manquante ni dupliquée entre les segments.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
