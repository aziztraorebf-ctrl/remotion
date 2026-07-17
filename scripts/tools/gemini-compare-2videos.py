#!/usr/bin/env python3
"""
Compare 2 videos via Gemini 3.1 Pro (Files API, upload REST curl -4 — SDK stalle IPv6 sandbox).
Usage : gemini-compare-2videos.py <notre_rendu.mp4> <reference.mp4> [--out diff.json]

But : notre reproduction VS l'original tiers -> breakdown des ECARTS pret-a-corriger (V2).
Gemini = SIGNAL, jamais juge : on croise ses retours avec notre propre analyse.
"""
import sys, time, json, subprocess, argparse
from pathlib import Path

GEMINI_MODEL = "gemini-3.1-pro-preview"
BASE = "https://generativelanguage.googleapis.com"

PROMPT = """On te donne DEUX vidéos courtes de motion graphics "style Vox papercraft".
- VIDEO A = NOTRE reproduction (à améliorer).
- VIDEO B = la RÉFÉRENCE originale (le rendu cible qu'on veut égaler).

Compare-les précisément et dis-nous COMMENT rendre A identique à B. Concentre-toi sur les ÉCARTS
CONCRETS et ACTIONNABLES, pas les généralités. Regarde : taille/échelle des éléments, placement/
composition, couleurs, le graphique à barres (forme, nombre, épaisseur, couleur, animation), l'étiquette
"1978" (police, sticker/scotch present ?), le sous-titre, le mouvement (pop, wiggle, timing), la matière,
les éléments PRÉSENTS dans B mais ABSENTS dans A (et inversement).

Réponds STRICTEMENT en JSON :
{
  "verdict_global": "1-2 phrases : à quel point A est proche de B, et les 2-3 écarts les plus visibles",
  "ecarts": [
    {
      "element": "avion | graphique_barres | etiquette_1978 | sous_titre | fond | mouvement | autre",
      "dans_A": "ce qu'on voit dans NOTRE version",
      "dans_B": "ce qu'on voit dans la RÉFÉRENCE",
      "ecart": "la différence précise",
      "correction": "action concrète à coder/régénérer (ex: 'agrandir l'avion x1.8 et recentrer', 'ajouter un sticker rond sur 1978', 'chart: barres plus épaisses, 4 barres au lieu de 3')",
      "priorite": "haute | moyenne | basse"
    }
  ],
  "elements_manquants_dans_A": ["liste des choses présentes dans B et absentes chez nous"],
  "plan_v2": ["étapes ordonnées par priorité pour passer de A à B"]
}
Sois exhaustif sur les écarts. Relis les chiffres/textes à l'écran caractère par caractère."""


def curl(args, timeout=180):
    return subprocess.run(["curl", "-4", "-s"] + args, capture_output=True, text=True, timeout=timeout)


def load_key():
    for line in (Path(__file__).resolve().parents[2] / ".env").read_text().splitlines():
        if line.startswith("GEMINI_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")


def upload(key, vp, label):
    size = Path(vp).stat().st_size
    print(f"[upload {label}] {Path(vp).name} ({size/1e6:.1f} Mo)...", flush=True)
    r = curl(["-D", "-", "-o", "/dev/null", "-X", "POST", f"{BASE}/upload/v1beta/files?key={key}",
              "-H", "X-Goog-Upload-Protocol: resumable", "-H", "X-Goog-Upload-Command: start",
              "-H", f"X-Goog-Upload-Header-Content-Length: {size}", "-H", "X-Goog-Upload-Header-Content-Type: video/mp4",
              "-H", "Content-Type: application/json", "-d", '{"file":{"display_name":"'+label+'"}}'])
    upurl = next((l.split(":", 1)[1].strip() for l in r.stdout.splitlines() if l.lower().startswith("x-goog-upload-url:")), None)
    r = curl(["-X", "POST", upurl, "-H", f"Content-Length: {size}", "-H", "X-Goog-Upload-Offset: 0",
              "-H", "X-Goog-Upload-Command: upload, finalize", "--data-binary", f"@{vp}"])
    finfo = json.loads(r.stdout)["file"]
    name, uri = finfo["name"], finfo["uri"]
    t0 = time.time()
    while True:
        r = curl(["-G", f"{BASE}/v1beta/{name}?key={key}"])
        st = json.loads(r.stdout).get("state")
        if st == "ACTIVE":
            break
        if st == "FAILED" or time.time() - t0 > 300:
            print(f"  echec {label} state={st}"); sys.exit(2)
        time.sleep(3)
    print(f"  ACTIVE {label}", flush=True)
    return uri


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video_a")
    ap.add_argument("video_b")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    key = load_key()

    uri_a = upload(key, args.video_a, "A_notre_rendu")
    uri_b = upload(key, args.video_b, "B_reference")

    print("[compare] generateContent...\n", flush=True)
    payload = {"contents": [{"parts": [
        {"text": "VIDEO A (notre reproduction) :"},
        {"file_data": {"mime_type": "video/mp4", "file_uri": uri_a}},
        {"text": "VIDEO B (référence originale) :"},
        {"file_data": {"mime_type": "video/mp4", "file_uri": uri_b}},
        {"text": PROMPT},
    ]}], "generationConfig": {"temperature": 0.2, "maxOutputTokens": 12000, "responseMimeType": "application/json"}}
    Path("/tmp/cmp_payload.json").write_text(json.dumps(payload))
    r = curl(["-X", "POST", f"{BASE}/v1beta/models/{GEMINI_MODEL}:generateContent?key={key}",
              "-H", "Content-Type: application/json", "--data-binary", "@/tmp/cmp_payload.json"], timeout=300)
    d = json.loads(r.stdout)
    if "error" in d:
        print("ERREUR:", d["error"].get("message")); sys.exit(3)
    txt = d["candidates"][0]["content"]["parts"][0]["text"]
    print("=" * 60); print(txt); print("=" * 60)
    if args.out:
        Path(args.out).write_text(txt)
        print(f"\n-> {args.out}")


if __name__ == "__main__":
    main()
