#!/usr/bin/env python3
"""
svg-image-cible-compare.py — IMAGE-CIBLE SVG chez N modeles + planche comparative, en UN geste.

Automatise la partie MECANIQUE du pipeline SVG generatif (doctrine SVG-SCENES-GENERATIVES.md) :
    brief -> N modeles EN PARALLELE -> parse JSON -> .svg -> .png -> planche labellisee -> upload

⛔ CE QUE CE SCRIPT NE FAIT PAS, ET NE DOIT JAMAIS FAIRE : choisir. La FUSION mix-and-match
   (prendre le sac du modele A, l'etiquette du modele B) est un travail d'EDITION fait par Claude,
   qui a les codes sources sous la main — pas par un modele, pas par un script. Cf.
   memory/.../feedbacks/feedback_svg-generatif-2-appels-fusion-par-claude.md (2 appels MAX).

FABLE n'est PAS ici : c'est un agent Claude Code (outil Agent, model="fable"), pas une API.
   Le lancer en parallele de ce script, avec le MEME brief, et deposer son JSON dans le dossier
   de sortie sous le nom <label>-fable.json — il sera ramasse par --assemble-only.

USAGE :
  # 1. generation + planche (appels API)
  python3 scripts/tools/svg-image-cible-compare.py --brief b.txt --label cfa-5a --models gpt,kimi

  # 2. re-assembler sans regenerer (apres avoir ajoute le JSON de Fable, ou pour retoucher)
  python3 scripts/tools/svg-image-cible-compare.py --label cfa-5a --assemble-only

  # 3. avec upload direct (lien a envoyer sur mobile)
  python3 scripts/tools/svg-image-cible-compare.py --brief b.txt --label cfa-5a --upload

Sortie : /tmp/svg-refs/<label>-<modele>.{json,svg,png} + <label>-COMPARATIF.png
"""
import argparse
import json
import os
import re
import subprocess
import sys
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = Path("/tmp/svg-refs")
SCENE_GEN = ROOT / "scripts" / "tools" / "svg-scene-narrative.py"
UPLOADER = ROOT / "scripts" / "tools" / "upload-to-blob.py"

# providers delegues a svg-scene-narrative.py (source unique des appels API — on ne duplique pas)
API_MODELS = ["gpt", "kimi", "gemini"]


def gen_one(provider: str, brief: str, label: str, ratio: str, results: dict) -> None:
    out = OUT_DIR / f"{label}-{provider}.json"
    cmd = [sys.executable, str(SCENE_GEN), "--provider", provider,
           "--brief", brief, "--ratio", ratio, "--out", str(out)]
    print(f"[{provider}] generation...")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not out.exists():
        results[provider] = f"ECHEC ({r.stderr.strip()[:120]})"
        print(f"[{provider}] ECHEC")
        return
    results[provider] = "ok"
    print(f"[{provider}] OK -> {out.name}")


def extract_svg(json_path: Path) -> str | None:
    """Recupere scene_svg, en tolerant les fences markdown et le bavardage autour du JSON."""
    raw = json_path.read_text(encoding="utf-8")
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", raw, re.DOTALL)
        if not m:
            return None
        try:
            data = json.loads(m.group(0))
        except json.JSONDecodeError:
            return None
    svg = data.get("scene_svg")
    return svg if svg and svg.strip().startswith("<svg") else None


def label_svg(svg: str, text: str) -> str:
    """Incruste le nom du modele DANS le SVG (ffmpeg drawtext n'est pas toujours compile).
    ⚠️ A INSERER EN FIN de document : en SVG l'ordre du document EST l'ordre de rendu, donc un
    bandeau place juste apres <svg> passe DERRIERE le rect de fond plein cadre et devient invisible."""
    bar = (f'<rect x="0" y="0" width="520" height="72" fill="#000" opacity="0.75"/>'
           f'<text x="20" y="50" font-family="sans-serif" font-size="38" font-weight="bold" '
           f'fill="#fff">{text}</text>')
    if "</svg>" in svg:
        return svg.replace("</svg>", bar + "</svg>", 1)
    return svg + bar


def render(label: str, width: int) -> list[Path]:
    """JSON -> SVG -> PNG labellise. Retourne les PNG produits, dans l'ordre des modeles."""
    pngs = []
    for jf in sorted(OUT_DIR.glob(f"{label}-*.json")):
        model = jf.stem.replace(f"{label}-", "")
        if model.endswith("COMPARATIF"):
            continue
        svg = extract_svg(jf)
        if not svg:
            print(f"  ! {model} : JSON illisible ou sans scene_svg — ignore")
            continue
        svg_path = OUT_DIR / f"{label}-{model}.svg"
        svg_path.write_text(svg, encoding="utf-8")
        lbl_path = OUT_DIR / f"{label}-{model}-lbl.svg"
        lbl_path.write_text(label_svg(svg, model), encoding="utf-8")
        png = OUT_DIR / f"{label}-{model}.png"
        r = subprocess.run(["rsvg-convert", "-w", str(width), str(lbl_path), "-o", str(png)],
                           capture_output=True)
        if r.returncode == 0:
            pngs.append(png)
            print(f"  rendu : {model}")
        else:
            print(f"  ! {model} : rsvg-convert a echoue")
    return pngs


def montage(pngs: list[Path], out: Path) -> bool:
    if not pngs:
        return False
    if len(pngs) == 1:
        subprocess.run(["cp", str(pngs[0]), str(out)], check=True)
        return True
    cmd = ["ffmpeg", "-y", "-loglevel", "error"]
    for p in pngs:
        cmd += ["-i", str(p)]
    cmd += ["-filter_complex", f"hstack=inputs={len(pngs)}", str(out)]
    return subprocess.run(cmd, capture_output=True).returncode == 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brief", help="Fichier texte du brief (requis sauf --assemble-only)")
    ap.add_argument("--label", required=True, help="Prefixe des fichiers (ex: cfa-5a)")
    ap.add_argument("--models", default="gpt,kimi", help=f"Parmi {API_MODELS} (defaut: gpt,kimi)")
    ap.add_argument("--ratio", default="16:9", choices=["16:9", "9:16"])
    ap.add_argument("--width", type=int, default=960, help="Largeur de chaque vignette")
    ap.add_argument("--assemble-only", action="store_true",
                    help="Ne regenere rien : re-rend et re-assemble depuis les JSON deja presents")
    ap.add_argument("--upload", action="store_true", help="Upload la planche (lien mobile)")
    a = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if not a.assemble_only:
        if not a.brief:
            ap.error("--brief est requis (ou utiliser --assemble-only)")
        models = [m.strip() for m in a.models.split(",") if m.strip()]
        bad = [m for m in models if m not in API_MODELS]
        if bad:
            ap.error(f"modeles inconnus : {bad}. Disponibles : {API_MODELS} "
                     f"(Fable = agent Claude Code, a lancer separement)")
        results: dict = {}
        threads = [threading.Thread(target=gen_one, args=(m, a.brief, a.label, a.ratio, results))
                   for m in models]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        for m, st in results.items():
            print(f"  {m}: {st}")

    print("\nRendu des image-cibles :")
    pngs = render(a.label, a.width)
    if not pngs:
        print("Aucune image-cible exploitable — rien a assembler.")
        return 1

    out = OUT_DIR / f"{a.label}-COMPARATIF.png"
    if not montage(pngs, out):
        print("ERREUR : montage impossible")
        return 1
    print(f"\nPlanche ({len(pngs)} modeles) -> {out}")

    if a.upload:
        r = subprocess.run([sys.executable, str(UPLOADER), str(out), "--folder", a.label],
                           capture_output=True, text=True)
        url = re.search(r"https://\S+", r.stdout)
        print(f"URL : {url.group(0) if url else '(upload echoue)'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
