#!/usr/bin/env python3
"""
Remplace UN segment fautif dans un audio TTS deja valide, sans regenerer le reste.

Contexte : le Speech-to-Speech ElevenLabs n'est pas deterministe (memory/tools/
PIPELINE-VOIX-VIVANTE-VALIDE.md). Regenerer un bloc entier pour corriger un mot
remet en jeu au hasard tout le reste du bloc (deja bon). Ce script isole le
segment fautif via ses timestamps (obtenus par forced-align.py), le remplace par
un nouveau clip regenere separement, et recolle avec un crossfade ffmpeg.

Usage :
  python3 scripts/tools/splice-segment.py <original.mp3> <replacement.mp3> \
      <cut_s> <resume_s> <out.mp3> [--crossfade 0.08]

  <original.mp3>     audio deja valide, contenant le segment fautif
  <replacement.mp3>  nouveau clip regenere (meme voix/pipeline) pour le remplacement
  <cut_s>             fin du segment "avant" (juste apres le dernier mot bon)
  <resume_s>           debut du segment "apres" (juste avant le premier mot bon suivant)
  <out.mp3>            fichier de sortie

Trouver cut_s/resume_s : scripts/tools/forced-align.py <original.mp3> <texte.txt> <mots-cles>
puis lire le JSON <original>.alignment.json pour les timestamps exacts mot-a-mot.

GARDE-FOU OBLIGATOIRE apres splice : re-lancer forced-align.py sur le resultat et
verifier le nombre de mots retrouve == nombre de mots du texte complet corrige.
Aucune perte a la jonction ne doit etre supposee, toujours verifiee.
"""
import argparse
import subprocess
import sys
from pathlib import Path


def dur(p):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(p)],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def slice_audio(src, start, end, out):
    cmd = ["ffmpeg", "-y", "-i", str(src), "-ss", f"{start:.3f}"]
    if end is not None:
        cmd += ["-to", f"{end:.3f}"]
    cmd += ["-c:a", "libmp3lame", "-b:a", "256k", str(out)]
    subprocess.run(cmd, capture_output=True, check=True)


def crossfade(a, b, out, d):
    cmd = [
        "ffmpeg", "-y", "-i", str(a), "-i", str(b),
        "-filter_complex",
        f"[0:a]aformat=sample_rates=44100:channel_layouts=stereo[a0];"
        f"[1:a]aformat=sample_rates=44100:channel_layouts=stereo[a1];"
        f"[a0][a1]acrossfade=d={d}:c1=tri:c2=tri[out]",
        "-map", "[out]", "-c:a", "libmp3lame", "-b:a", "256k", str(out),
    ]
    subprocess.run(cmd, capture_output=True, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("original", type=Path)
    ap.add_argument("replacement", type=Path)
    ap.add_argument("cut_s", type=float)
    ap.add_argument("resume_s", type=float)
    ap.add_argument("out", type=Path)
    ap.add_argument("--crossfade", type=float, default=0.08)
    args = ap.parse_args()

    if args.resume_s <= args.cut_s:
        print(f"ERREUR : resume_s ({args.resume_s}) doit etre > cut_s ({args.cut_s})")
        sys.exit(1)

    total = dur(args.original)
    tmp = args.out.parent / f"_splice_tmp_{args.out.stem}"
    tmp.mkdir(parents=True, exist_ok=True)

    has_before = args.cut_s > 0.005
    has_after = args.resume_s < total - 0.005

    part1 = tmp / "part1.mp3"
    part3 = tmp / "part3.mp3"
    step1 = tmp / "step1.mp3"

    if has_before:
        slice_audio(args.original, 0, args.cut_s, part1)
    if has_after:
        slice_audio(args.original, args.resume_s, None, part3)

    # replacement en tete (rien avant) : pas de crossfade d'ouverture, juste une jonction simple
    if has_before:
        crossfade(part1, args.replacement, step1, args.crossfade)
    else:
        step1 = args.replacement

    # replacement en queue (rien apres) : pas de crossfade de fin
    if has_after:
        crossfade(step1, part3, args.out, args.crossfade)
    else:
        subprocess.run(["cp", str(step1), str(args.out)], check=True)

    new_total = dur(args.out)
    removed = args.resume_s - args.cut_s
    added = dur(args.replacement)
    print(f"original     : {total:.2f}s")
    print(f"segment coupe: [{args.cut_s:.2f}..{args.resume_s:.2f}] ({removed:.2f}s retires)")
    print(f"remplacement : {added:.2f}s")
    print(f"resultat     : {new_total:.2f}s -> {args.out}")
    print(f"\n⚠️  GARDE-FOU : relancer forced-align.py sur {args.out.name} et verifier")
    print("   le nombre de mots retrouve == nombre de mots du texte complet corrige.")


if __name__ == "__main__":
    main()
