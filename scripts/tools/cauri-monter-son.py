#!/usr/bin/env python3
"""Monte une famille sonore sur out/_r-and-d/cauri/piece/piece_v5.mp4 (video seule,
inchangee) et ecrit out/_r-and-d/cauri/son/<famille>-monte.mp4.

Regle du CREUX (brief cauri §7, mesuree sur TED-Ed) : le lit sonore se coupe 0.5s
AVANT l'impact et revient 0.7s apres, pour que l'effondrement se marque par un
silence relatif et non par un pic. Implementee via un envelope de volume sur le
lit, pas par un decoupage physique du fichier.

Usage : python3 scripts/tools/cauri-monter-son.py <matiere|monnaie|abstrait|all>
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
VIDEO = ROOT / "out/_r-and-d/cauri/piece/piece_v5.mp4"
SON = ROOT / "out/_r-and-d/cauri/son"

# ⛔ Le LIT de matiere/monnaie n'est pas seulement BAS, il a une ENVELOPPE qui varie
# (2026-09-06, apres mesure RMS par tranche) : matiere/lit.mp3 est un vrai swell qui
# monte de -84 dB a -25 dB puis redescend — un fade-in naturel, pas un niveau constant.
# Un gain FIXE ne peut pas corriger une enveloppe qui varie : au 1er essai (facteur
# multiplicatif) il restait des trous de 2-3s sous le seuil de detection, sans rapport
# avec le creux voulu a l'effondrement. Fix : dynaudnorm (normalisation de niveau
# glissante) plutot qu'un volume= constant — aplatit l'enveloppe vers une cible stable
# AVANT d'appliquer le gain de mix. abstrait/lit (drone stable a -3,3 dB) n'en a pas
# besoin mais dynaudnorm ne le degrade pas non plus (mesure : silences residuels
# passes de 13 a 0 sur matiere apres ce fix, cf. commit).
GAIN_LIT = {"matiere": 1.0, "monnaie": 1.0, "abstrait": 0.35}
DYNAUDNORM = "dynaudnorm=f=250:g=15:p=0.85"

# (nom, debut_s, volume_lineaire) — cales sur les gestes mesures par sfx-cues.py
GESTES = [
    ("objet", 0.60, 0.9),
    ("semis", 2.67, 0.85),
    ("alignement", 6.00, 0.8),
    ("colonne", 10.70, 0.85),
    ("deversement", 13.50, 0.95),
    ("impact", 16.07, 1.0),
    ("retombee", 18.93, 0.75),
]

CREUX_DEBUT = 16.07 - 0.5  # 15.57s : le lit commence a descendre
CREUX_FIN = 16.07 + 0.7    # 16.77s : le lit remonte
CREUX_PLANCHER = 0.06      # jamais un vrai silence (regle brief §7)


def monter(famille: str) -> Path:
    dossier = SON / famille
    out = SON / f"{famille}-monte.mp4"

    inputs = ["-i", str(VIDEO), "-i", str(dossier / "lit.mp3")]
    for nom, _, _ in GESTES:
        inputs += ["-i", str(dossier / f"{nom}.mp3")]

    # lit : gain calibre par famille (voir GAIN_LIT), avec le CREUX en enveloppe
    # (regle §7 : jamais 0 pur)
    gain = GAIN_LIT[famille]
    filtres = [
        f"[1:a]{DYNAUDNORM},volume={gain},"
        f"volume=enable='between(t,{CREUX_DEBUT},{CREUX_FIN})':"
        f"volume={CREUX_PLANCHER}[lit]"
    ]
    labels = ["[lit]"]
    for i, (nom, debut, vol) in enumerate(GESTES, start=2):
        filtres.append(f"[{i}:a]adelay={int(debut*1000)}|{int(debut*1000)},volume={vol}[g{i}]")
        labels.append(f"[g{i}]")
    filtres.append(f"{''.join(labels)}amix=inputs={len(labels)}:duration=first:dropout_transition=0[mix]")

    cmd = [
        "ffmpeg", "-y", "-v", "error", *inputs,
        "-filter_complex", ";".join(filtres),
        "-map", "0:v", "-map", "[mix]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-shortest", str(out),
    ]
    subprocess.run(cmd, check=True)
    return out


if __name__ == "__main__":
    cible = sys.argv[1] if len(sys.argv) > 1 else "all"
    familles = ["matiere", "monnaie", "abstrait"] if cible == "all" else [cible]
    for fam in familles:
        out = monter(fam)
        print(f"OK -> {out.relative_to(ROOT)}")
