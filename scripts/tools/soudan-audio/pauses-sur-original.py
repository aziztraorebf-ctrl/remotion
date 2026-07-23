#!/usr/bin/env python3
"""
Applique des pauses DETERMINISTES sur un audio ORIGINAL VALIDE, sans rien regenerer.
Pour chaque 'cut' du manifest : garde l'audio [prev_resume .. cut_s], insere un
silence de sil_s, puis reprend a resume_s. La voix originale (prononciation validee)
est preservee a 100% ; seuls les blancs entre phrases sont remplaces par des durees
exactes. Le gap naturel original (cut_s..resume_s) est SUPPRIME et remplace par sil_s.

Usage: pauses-sur-original.py <manifest.json> <out.mp3>
"""
import json, subprocess, sys, os, tempfile

def dur(p):
    r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","csv=p=0",p], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())

def slice_audio(src, start, end, out):
    # extrait [start,end] de src (re-encode pour coupe frame-exacte)
    subprocess.run(["ffmpeg","-y","-i",src,"-ss",f"{start:.3f}","-to",f"{end:.3f}",
        "-c:a","libmp3lame","-b:a","256k",out], capture_output=True, check=True)

def silence(sec, out):
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i","anullsrc=r=44100:cl=stereo",
        "-t",f"{sec:.3f}","-c:a","libmp3lame","-b:a","256k",out], capture_output=True, check=True)

def main():
    if len(sys.argv) != 3:
        print("Usage: pauses-sur-original.py <manifest.json> <out.mp3>"); sys.exit(1)
    mpath, out = sys.argv[1], sys.argv[2]
    with open(mpath) as f: m = json.load(f)
    src = m["source_audio"]
    if not os.path.isabs(src):
        src = os.path.join("/Users/clawdbot/Workspace/remotion", src)
    total_src = dur(src)
    cuts = sorted(m["cuts"], key=lambda c: c["cut_s"])

    tmp = tempfile.mkdtemp(prefix="soudan-orig-pauses-")
    parts = []

    prepend_s = m.get("prepend_silence_s", 0.0)
    if prepend_s > 0:
        pre = os.path.join(tmp, "prepend_sil.mp3")
        silence(prepend_s, pre)
        parts.append(pre)
        print(f"(prepend silence {prepend_s:.2f}s before start)")

    prev_resume = 0.0
    print(f"{'segment voix':40s} {'sil apres':>9s}")
    for i, c in enumerate(cuts):
        # tranche de voix : de la reprise precedente jusqu'a cette coupure
        # (si cut_s <= prev_resume : rien a couper, on insere juste le silence sans slice -
        #  cas d'une pause pure sans retrait de contenu, ex. cut_s==resume_s)
        if c["cut_s"] > prev_resume + 0.005:
            seg = os.path.join(tmp, f"voice_{i}.mp3")
            slice_audio(src, prev_resume, c["cut_s"], seg)
            parts.append(seg)
        print(f"[{prev_resume:7.2f}..{c['cut_s']:7.2f}]  {c['label'][:26]:26s}  {c['sil_s']:6.2f}s")
        # silence insere
        sil = os.path.join(tmp, f"sil_{i}.mp3")
        silence(c["sil_s"], sil)
        parts.append(sil)
        prev_resume = c["resume_s"]
    # derniere tranche : de la derniere reprise jusqu'a la fin
    tail = os.path.join(tmp, "voice_tail.mp3")
    slice_audio(src, prev_resume, total_src, tail)
    parts.append(tail)
    print(f"[{prev_resume:7.2f}..{total_src:7.2f}]  (fin)")

    append_s = m.get("append_silence_s", 0.0)
    if append_s > 0:
        post = os.path.join(tmp, "append_sil.mp3")
        silence(append_s, post)
        parts.append(post)
        print(f"(append silence {append_s:.2f}s after end)")

    listf = os.path.join(tmp, "list.txt")
    with open(listf,"w") as f:
        for p in parts: f.write(f"file '{os.path.abspath(p)}'\n")
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",listf,
        "-c:a","libmp3lame","-b:a","256k",out], capture_output=True, check=True)
    print(f"\nsource: {total_src:.2f}s  ->  {out}: {dur(out):.2f}s "
          f"(+{dur(out)-total_src:.2f}s de pauses ajoutees, {len(cuts)} pauses)")

if __name__ == "__main__":
    main()
