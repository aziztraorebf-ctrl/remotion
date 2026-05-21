#!/usr/bin/env python3
"""
check-beat-registration.py — Verifie que durationInFrames dans Root.tsx
correspond a la duree du beat seul (pas la duree totale de l'episode).

Usage:
  python3 scripts/check-beat-registration.py --episode peste-1347 --beat 3
  python3 scripts/check-beat-registration.py --episode peste-1347 --beat 3 --start 714 --end 1222

Regles :
  - R1 : durationInFrames dans Root.tsx doit etre exactement END-START+1 pour le composant Beat
  - R2 : render standalone = --frames=START-END (pas besoin de modifier Root.tsx)
  - R3 : si durationInFrames = duree totale episode, signaler avec WARNING

Pourquoi ce script existe :
  Beat3 Peste 1347 avait durationInFrames={1223} (duree totale) au lieu de 509 (duree beat).
  Resultat : 23s de noir au debut de chaque render standalone. Decouvert apres 5 renders.
"""

import sys
import re
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
ROOT_TSX = PROJECT_ROOT / "src" / "Root.tsx"


def find_beat_component(episode: str, beat_num: int) -> tuple[str, int] | None:
    """
    Cherche le composant Beat dans Root.tsx.
    Retourne (component_name, duration_in_frames) ou None.
    """
    content = ROOT_TSX.read_text()

    episode_slug = episode.replace("-", "").replace("_", "").lower()
    patterns = [
        rf'Beat{beat_num}',
        rf'beat{beat_num}',
        rf'Beat0{beat_num}',
    ]

    lines = content.split("\n")
    for i, line in enumerate(lines):
        for pat in patterns:
            if re.search(pat, line, re.IGNORECASE):
                context = "\n".join(lines[max(0, i-5):i+10])
                m = re.search(r'durationInFrames=\{(\d+)\}', context)
                if m:
                    comp_match = re.search(r'id=["\']([^"\']+)["\']', context)
                    comp_name = comp_match.group(1) if comp_match else f"Beat{beat_num}"
                    return comp_name, int(m.group(1))
    return None


def check_registration(episode: str, beat_num: int, beat_start: int | None, beat_end: int | None) -> bool:
    """
    Verifie l'enregistrement du beat dans Root.tsx.
    """
    print(f"\n=== CHECK BEAT REGISTRATION : {episode} Beat {beat_num} ===\n")

    if not ROOT_TSX.exists():
        print(f"[ERROR] Root.tsx introuvable : {ROOT_TSX}")
        return False

    result = find_beat_component(episode, beat_num)
    if result is None:
        print(f"[WARN] Aucun composant Beat{beat_num} trouve dans Root.tsx")
        print(f"       Verifier le slug episode et le numero de beat.")
        return False

    comp_name, duration = result
    print(f"  Composant : {comp_name}")
    print(f"  durationInFrames dans Root.tsx : {duration}")

    if beat_start is not None and beat_end is not None:
        expected = beat_end - beat_start + 1
        print(f"  Frames beat (--start/--end)    : {beat_start} → {beat_end} = {expected} frames")

        if duration == expected:
            print(f"\n  [OK] durationInFrames = duree beat exacte ({duration})")
            print(f"       Render standalone : npx remotion render <comp> --frames={beat_start}-{beat_end}")
            return True
        elif duration > expected * 2:
            print(f"\n  [ERREUR R1] durationInFrames={duration} est la duree totale de l'episode !")
            print(f"              Ca produit {(duration - expected) // 30}s de noir au debut du render.")
            print(f"              Corriger : durationInFrames={{{expected}}} dans Root.tsx")
            print(f"              OU render standalone avec --frames={beat_start}-{beat_end}")
            return False
        else:
            print(f"\n  [WARN] durationInFrames={duration} != duree beat {expected}")
            print(f"         Verifier les bornes du beat (BEAT_START / BEAT_END).")
            return False
    else:
        print(f"\n  durationInFrames = {duration}")
        if duration > 1500:
            print(f"  [WARN] durationInFrames={duration} est probablement la duree totale de l'episode.")
            print(f"         Passer --start <BEAT_START> --end <BEAT_END> pour verification precise.")
        else:
            print(f"  [INFO] Semble OK (duree raisonnable pour un beat).")
            print(f"         Passer --start <BEAT_START> --end <BEAT_END> pour verification precise.")
        return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Verifie l'enregistrement d'un beat dans Root.tsx")
    parser.add_argument('--episode', type=str, required=True, help='Slug episode (ex: peste-1347)')
    parser.add_argument('--beat', type=int, required=True, help='Numero du beat')
    parser.add_argument('--start', type=int, default=None, help='Frame de debut du beat (BEAT_START)')
    parser.add_argument('--end', type=int, default=None, help='Frame de fin du beat (BEAT_END)')
    args = parser.parse_args()

    ok = check_registration(args.episode, args.beat, args.start, args.end)
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
