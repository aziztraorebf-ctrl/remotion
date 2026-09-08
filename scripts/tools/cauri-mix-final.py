#!/usr/bin/env python3
"""Monte le mix final de la piece "Le cauri" : musique de soutien + narration
GeoAfrique + gestes ponctuels (registre Abstrait) tres attenues, sur piece_v6.mp4
(693 frames = 23,08s, timing etire pour caler sur la narration).

Decision Aziz (2026-09-08) : le registre Abstrait est retenu, MAIS le lit texture
genere ("bruit de fond agacant") est retire et remplace par une musique du
catalogue existant. Les 8 gestes ponctuels sont conserves mais tres attenues
(la voix porte le sens, la musique porte l'emotion en soutien).

Regle du CREUX (brief §7) conservee sur la MUSIQUE (qui joue le role du lit) :
coupee 0.5s avant l'impact, revient 0.7s apres.

Usage : python3 scripts/tools/cauri-mix-final.py
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SON = ROOT / "out/_r-and-d/cauri/son"
MUSIQUE = SON / "musique-candidats/data-viz-explainer.mp3"
NARRATION = SON / "narration-v2.mp3"
GESTES_DIR = SON / "abstrait"

# ⭐ Video source et sortie parametrables (2026-09-08) : ce script montait initialement
# uniquement sur piece_v6.mp4 (fond aplat). Aziz veut comparer le meme mix son sur
# plusieurs candidats de fond (decor dessine, test H3) — plutot que dupliquer le script,
# on accepte video/sortie en argv. Usage :
#   python3 scripts/tools/cauri-mix-final.py [video_source] [sortie.mp4]
VIDEO = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "out/_r-and-d/cauri/piece/piece_v6.mp4"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else SON / "cauri-mix-final.mp4"

# Timecodes RECALCULES pour le timing etire (facteur x1,120419 vs piece_v5 20,6s).
# Les gestes avaient ete cales sur piece_v5.mp4 par sfx-cues.py ; ce sont les memes
# EVENEMENTS mais a leurs nouveaux instants sur piece_v6.mp4 (23,08s).
GESTES = [
    ("objet", 0.672, 0.35),
    ("semis", 2.992, 0.32),
    ("alignement", 6.723, 0.30),
    ("colonne", 11.988, 0.32),
    ("deversement", 15.126, 0.35),
    ("impact", 18.005, 0.55),  # le seul geste qui reste net : c'est le pic dramatique
    ("retombee", 21.210, 0.28),
]

IMPACT_T = 18.005
IMPACT_DUREE = 1.2  # duree reelle du fichier abstrait/impact.mp3

# ⛔ Bug de conception trouve le 2026-09-08 (pas un bug de filtre — verifie par agent dedie
# que volume=enable= fonctionne correctement) : le creux CHEVAUCHAIT le son de l'impact au
# lieu de le PRECEDER puis le LAISSER SEUL. La fenetre remontait a IMPACT_T+0.7, alors que
# le fichier impact.mp3 joue jusqu'a IMPACT_T+1.2 — musique et voix remontaient donc PENDANT
# que l'impact sonnait encore, noyant tout dans un plateau plat (mesure : -31,5/-31,0/-29,6
# dB avant/pendant/apres, aucune baisse detectable). Le creux doit REMONTER apres la FIN du
# son de l'impact, pas 0.7s apres son DEBUT.
CREUX_DEBUT = IMPACT_T - 0.5
CREUX_FIN = IMPACT_T + IMPACT_DUREE + 0.15  # creux tenu jusqu'apres la fin reelle du son
CREUX_PLANCHER = 0.05  # jamais un vrai silence (regle brief §7)

MUSIQUE_GAIN = 0.24  # remonte de 0.16 le 2026-09-08 (retour Aziz : "ne s'entend pas si bien")
NARRATION_GAIN = 1.0

# ⭐ Ducking de la VOIX pendant le creux (2026-09-08, apres mesure).
# La narration parle encore ("la valeur s'effondre") exactement dans la fenetre du
# creux a l'impact : mesure -35dB plat sur 17.0-19.2s, le creux sur la musique SEULE
# etait donc inaudible, noye sous la voix active. Decision Aziz : attenuer la voix
# elle-meme dans cette fenetre (pas un vrai silence, un ducking court) plutot que de
# regenerer le texte ou d'abandonner la regle du creux (brief §7).
NARRATION_CREUX_PLANCHER = 0.45  # attenue, jamais coupe (on entend encore le mot)


def main() -> None:
    inputs = ["-i", str(VIDEO), "-i", str(MUSIQUE), "-i", str(NARRATION)]
    for nom, _, _ in GESTES:
        inputs += ["-i", str(GESTES_DIR / f"{nom}.mp3")]

    filtres = [
        f"[1:a]volume={MUSIQUE_GAIN},"
        f"volume=enable='between(t,{CREUX_DEBUT},{CREUX_FIN})':volume={CREUX_PLANCHER}[mus]",
        f"[2:a]volume={NARRATION_GAIN},"
        f"volume=enable='between(t,{CREUX_DEBUT},{CREUX_FIN})':volume={NARRATION_CREUX_PLANCHER}[voix]",
    ]
    labels = ["[mus]", "[voix]"]
    for i, (nom, debut, vol) in enumerate(GESTES, start=3):
        filtres.append(f"[{i}:a]adelay={int(debut*1000)}|{int(debut*1000)},volume={vol}[g{i}]")
        labels.append(f"[g{i}]")
    filtres.append(f"{''.join(labels)}amix=inputs={len(labels)}:duration=first:dropout_transition=0[mix]")

    cmd = [
        "ffmpeg", "-y", "-v", "error", *inputs,
        "-filter_complex", ";".join(filtres),
        "-map", "0:v", "-map", "[mix]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-shortest", str(OUT),
    ]
    subprocess.run(cmd, check=True)
    try:
        print(f"OK -> {OUT.relative_to(ROOT)}")
    except ValueError:
        print(f"OK -> {OUT}")


if __name__ == "__main__":
    main()
