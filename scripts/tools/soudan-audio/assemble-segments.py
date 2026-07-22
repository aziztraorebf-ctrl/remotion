#!/usr/bin/env python3
"""
Assemblage DETERMINISTE de segments audio + silences exacts.
Lit un manifest JSON {segments:[{id, text, sil_after_s}]} et concatene
<seg_dir>/<id>.mp3 dans l'ordre, en inserant un silence de sil_after_s
apres chaque segment. Le silence est genere par ffmpeg (anullsrc), donc
exact au milliseconde. Ajuster le rythme = editer sil_after_s, re-lancer
CE script uniquement (pas de re-TTS).

Usage: assemble-segments.py <manifest.json> <seg_dir> <out.mp3>
"""
import json
import subprocess
import sys
import os
import tempfile

def dur(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True)
    return float(r.stdout.strip())

def main():
    if len(sys.argv) != 4:
        print("Usage: assemble-segments.py <manifest.json> <seg_dir> <out.mp3>")
        sys.exit(1)
    manifest_path, seg_dir, out = sys.argv[1], sys.argv[2], sys.argv[3]
    with open(manifest_path) as f:
        manifest = json.load(f)
    segments = manifest["segments"]

    tmpdir = tempfile.mkdtemp(prefix="soudan-seg-")
    parts = []       # liste ordonnee de fichiers a concatener
    total = 0.0
    missing = []
    print(f"{'id':10s} {'seg_s':>7s} {'sil_s':>6s}  cumul")
    for s in segments:
        seg = os.path.join(seg_dir, f"{s['id']}.mp3")
        if not os.path.isfile(seg):
            missing.append(s["id"]); continue
        d = dur(seg)
        parts.append(seg)
        total += d
        # silence apres
        sil = float(s.get("sil_after_s", 0))
        if sil > 0:
            silp = os.path.join(tmpdir, f"sil_{s['id']}.mp3")
            subprocess.run(
                ["ffmpeg", "-y", "-f", "lavfi", "-i",
                 "anullsrc=r=44100:cl=stereo", "-t", str(sil),
                 "-c:a", "libmp3lame", "-b:a", "256k", silp],
                capture_output=True, check=True)
            parts.append(silp)
            total += sil
        mark = "  <-- " + s["_aziz"] if "_aziz" in s else ""
        print(f"{s['id']:10s} {d:7.2f} {sil:6.2f}  {total:6.2f}{mark}")

    if missing:
        print(f"\nSEGMENTS MANQUANTS ({len(missing)}): {', '.join(missing)}")
        print("Genere-les d'abord dans", seg_dir)
        sys.exit(2)

    # concat demuxer (tous en mp3 256k stereo 44100 -> copy safe)
    listf = os.path.join(tmpdir, "list.txt")
    with open(listf, "w") as f:
        for p in parts:
            f.write(f"file '{os.path.abspath(p)}'\n")
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listf,
         "-c:a", "libmp3lame", "-b:a", "256k", out],
        capture_output=True, check=True)
    final = dur(out)
    print(f"\n-> {out}  ({final:.2f}s, {len(segments)} segments)")

if __name__ == "__main__":
    main()
