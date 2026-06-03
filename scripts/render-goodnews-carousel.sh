#!/bin/bash
# render-goodnews-carousel.sh — Étape render du pipeline Good News.
# Rend les 8 slides (depuis CURRENT_EDITION via les compositions gn-XX) + ajoute la musique.
#
# PRÉREQUIS : carousel-data.ts à jour (CURRENT_EDITION = semaine voulue).
# Les compositions gn-XX dans Root.tsx doivent refléter l'édition courante
# (Claude les met à jour OU elles lisent CURRENT_EDITION — voir README).
#
# Usage : ./scripts/render-goodnews-carousel.sh
# Sortie : out/_r-and-d/good-news/final/gn-*.mp4 + with-audio/ + gn-FULL-tiktok.mp4

set -e
cd "$(dirname "$0")/.."

OUT="out/_r-and-d/good-news/final"
MUSIC="public/souverain/or-africain/audio/music-v1.mp3"
mkdir -p "$OUT/with-audio"

# Garantir le navigateur headless (Mapbox)
npx remotion browser ensure >/dev/null 2>&1 || true

echo "=== Render slides Light (7) ==="
for id in gn-00-hook gn-01-maroc-fait gn-02-maroc-macro gn-03-kenya-fait gn-04-kenya-macro gn-06-algerie-macro gn-07-cta; do
  echo "  $id..."
  npx remotion render src/index.ts "$id" "$OUT/$id.mp4" >/dev/null 2>&1
done

echo "=== Render slide Mapbox (Algérie) ==="
./scripts/render-mapbox.sh gn-05-algerie-fait "$OUT/gn-05-algerie-fait.mp4" >/dev/null 2>&1

echo "=== Ajout musique (par slide, piste continue) ==="
python3 - <<'PY'
import subprocess
OUT="out/_r-and-d/good-news/final"
MUSIC="public/souverain/or-africain/audio/music-v1.mp3"
import json
# durées réelles lues via ffprobe
order=["gn-00-hook","gn-01-maroc-fait","gn-02-maroc-macro","gn-03-kenya-fait",
       "gn-04-kenya-macro","gn-05-algerie-fait","gn-06-algerie-macro","gn-07-cta"]
def dur(p):
    r=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p],capture_output=True,text=True)
    return float(r.stdout.strip())
off=0.0
for sid in order:
    d=dur(f"{OUT}/{sid}.mp4")
    fo=max(0.1,d-0.4)
    af=f"[1:a]volume=0.5,afade=t=in:st=0:d=0.4,afade=t=out:st={fo:.3f}:d=0.4[a]"
    subprocess.run(["ffmpeg","-y","-i",f"{OUT}/{sid}.mp4","-ss",f"{off:.3f}","-t",f"{d:.3f}",
        "-i",MUSIC,"-filter_complex",af,"-map","0:v","-map","[a]","-c:v","copy","-c:a","aac",
        "-shortest",f"{OUT}/with-audio/{sid}.mp4"],capture_output=True)
    print(f"  {sid} (+music)")
    off+=d
PY

echo "=== Vidéo unique TikTok (concat + audio) ==="
cd "$OUT/with-audio"
for f in gn-00-hook gn-01-maroc-fait gn-02-maroc-macro gn-03-kenya-fait gn-04-kenya-macro gn-05-algerie-fait gn-06-algerie-macro gn-07-cta; do echo "file '$f.mp4'"; done > _l.txt
ffmpeg -y -f concat -safe 0 -i _l.txt -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k ../gn-FULL-tiktok.mp4 >/dev/null 2>&1
rm _l.txt
cd - >/dev/null

echo ""
echo "✅ Render terminé."
echo "   Slides IG/FB : $OUT/with-audio/gn-*.mp4"
echo "   Vidéo TikTok : $OUT/gn-FULL-tiktok.mp4"
echo "   Publier : python3 scripts/schedule-goodnews-carousel.py [--dry-run]"
echo "            python3 scripts/schedule-goodnews-tiktok.py [--dry-run]"
