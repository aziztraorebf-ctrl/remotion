#!/usr/bin/env python3
"""
Reverse-engineering d'un clip motion-graphic (style Vox papercraft) via Gemini 3.1 Pro.
Upload la VIDEO complete (Files API, force IPv4 via REST car le SDK Python stalle en IPv6 sandbox)
et demande un breakdown JSON pret-a-produire.

V2 (2026-07-17) : prompt NEUTRE, ZERO biais SVG. On force Gemini a TRANCHER pour CHAQUE element :
image-a-generer (rendu 3D/photo/texture) VS overlay-code (SVG/Remotion natif). C'est LE point : ne
pas plaquer du vectoriel a plat sur ce qui est en realite du 3D papercraft genere.

Usage : python3 scripts/tools/gemini-vox-reverse-breakdown.py <clip.mp4> [--out breakdown.json]
"""
import os
import sys
import time
import json
import subprocess
import argparse
from pathlib import Path

GEMINI_MODEL = "gemini-3.1-pro-preview"

PROMPT = """Tu es directeur technique motion-design senior. On te donne une SEQUENCE de motion graphics
"style Vox / explainer editorial" (esthetique papier : collage papier, objets a l'air decoupe/papercraft,
photos d'archive tramees, annotations, fond papier). Elle a ete produite par un outil de generation IA
(Higgsfield / Seedance / presets "3D papercraft"). On veut la RE-PRODUIRE avec notre propre pipeline :
Remotion (code React/SVG deterministe) + generation d'images IA (Gemini Flash image / Recraft) pour ce
qui ne peut PAS etre du code.

MISSION CRITIQUE — pour CHAQUE element visible, TRANCHE sa vraie nature :
  * "image_generee"  = a du VOLUME 3D, de la matiere, des ombres douces realistes, une texture (papier
                       froisse, grain, relief), un rendu photographique ou 3D papercraft. IMPOSSIBLE a
                       refaire fidelement en SVG plat. -> il FAUT le generer comme image.
  * "overlay_code"   = graphisme plat net (texte, chiffres, fleches, barres de chart, bandeaux, traits
                       d'axe, formes geometriques simples). Reproductible en SVG/Remotion natif.
Ne te laisse PAS influencer : si un objet (avion, decor, personnage) a manifestement du relief/matiere 3D,
classe-le "image_generee" MEME s'il "ressemble" a une forme simple. C'est l'erreur a eviter.

REGLE : decris UNIQUEMENT ce que tu VOIS reellement. Si incertain sur un detail -> "uncertain": true.

Reponds STRICTEMENT en JSON valide (aucun texte hors JSON) :

{
  "constat_nature": "1-2 phrases : globalement, qu'est-ce qui est image generee 3D vs overlay code dans ce clip ?",
  "elements": [
    {
      "id": "avion-cutaway",
      "label": "description courte",
      "nature": "image_generee | overlay_code",
      "pourquoi": "justification de la nature (relief/matiere -> image ; plat/net -> code)",
      "si_image_generee": {
        "moteur_conseille": "Gemini 3.1 Flash image | Recraft (style 3D papercraft/paper craft)",
        "prompt_exact": "prompt complet, pret a coller, decrivant precisement CE rendu (style, matiere, couleurs #hex, cadrage, fond, ombres)",
        "fond": "transparent | plein (a detourer ?)",
        "reutilisable": true
      },
      "si_overlay_code": {
        "police": "famille exacte OU substitut web proche (Google Fonts) + graisse + italique",
        "couleur": "#hex",
        "taille_approx": "px a l'ecran (base 1920x1080)",
        "position": "zone ecran precise",
        "fond_du_texte": "bandeau papier dechire ? scotch ? aucun ?",
        "animation": "spring pop / slide / cut / typewriter",
        "comment_remotion": "note d'implementation (composant, filtre, timing)"
      }
    }
  ],
  "background": {
    "nature": "image_generee | overlay_code",
    "prompt_exact_si_image": "prompt pret a coller pour generer CE fond exact (papier journal ? grain ? colonnes de texte ? vignette ? couleur #hex)",
    "note": "ce fond change-t-il entre les plans ? lesquels ?"
  },
  "palette": ["#hex", ...],
  "grammaire_animation": "regles de mouvement recurrentes (pop overshoot, wiggle stop-motion, drop-shadow papier, whip pan...)",
  "timeline": [
    {"plan": 1, "t_start": "0:00", "t_end": "0:06", "description": "...",
     "elements_ids": ["id1","id2"], "texte_exact_ecran": "chiffres/dates/labels relus caractere par caractere",
     "transition_sortie": "cut | whip | recouvrement papier | fondu"}
  ],
  "plan_de_production": {
    "assets_images_a_generer": ["liste des ids nature=image_generee, dans l'ordre de priorite"],
    "overlays_a_coder": ["liste des ids nature=overlay_code"],
    "verdict_cout": "1 phrase : quelle part = generation image (payante mais 1x reutilisable) vs code (gratuit)"
  }
}

Sois EXHAUSTIF : couvre l'avion, les sieges, le fond journal, les etiquettes type '1978', les sous-titres,
le graphique a barres, les cartes/fleches, les photos halftone. Chiffres/dates relus caractere par caractere."""


def load_key():
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")


def curl(args, timeout=120):
    """curl force IPv4 (le SDK google-genai stalle en IPv6 dans la sandbox)."""
    return subprocess.run(["curl", "-4", "-s"] + args, capture_output=True, text=True, timeout=timeout)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    vp = Path(args.video)
    if not vp.exists():
        print(f"introuvable: {vp}")
        sys.exit(1)
    key = load_key()
    if not key:
        print("GEMINI_API_KEY manquante")
        sys.exit(1)

    size = vp.stat().st_size
    base = "https://generativelanguage.googleapis.com"

    print(f"[1/4] Start resumable upload ({size/1e6:.1f} Mo, IPv4)...", flush=True)
    r = curl([
        "-D", "-", "-o", "/dev/null", "-X", "POST",
        f"{base}/upload/v1beta/files?key={key}",
        "-H", "X-Goog-Upload-Protocol: resumable",
        "-H", "X-Goog-Upload-Command: start",
        "-H", f"X-Goog-Upload-Header-Content-Length: {size}",
        "-H", "X-Goog-Upload-Header-Content-Type: video/mp4",
        "-H", "Content-Type: application/json",
        "-d", '{"file":{"display_name":"vox_clip"}}',
    ])
    upurl = None
    for line in r.stdout.splitlines():
        if line.lower().startswith("x-goog-upload-url:"):
            upurl = line.split(":", 1)[1].strip()
    if not upurl:
        print("echec start upload:\n", r.stdout)
        sys.exit(2)

    print("[2/4] Upload bytes + finalize...", flush=True)
    r = curl([
        "-X", "POST", upurl,
        "-H", f"Content-Length: {size}",
        "-H", "X-Goog-Upload-Offset: 0",
        "-H", "X-Goog-Upload-Command: upload, finalize",
        "--data-binary", f"@{vp}",
    ])
    finfo = json.loads(r.stdout)["file"]
    name, uri = finfo["name"], finfo["uri"]
    print(f"      {name} state={finfo.get('state')}", flush=True)

    print("[3/4] Poll ACTIVE...", flush=True)
    t0 = time.time()
    while True:
        r = curl(["-G", f"{base}/v1beta/{name}?key={key}"])
        st = json.loads(r.stdout).get("state")
        if st == "ACTIVE":
            break
        if st == "FAILED" or time.time() - t0 > 300:
            print(f"      etat={st} -> abandon")
            sys.exit(3)
        time.sleep(3)
    print(f"      ACTIVE en {time.time()-t0:.0f}s", flush=True)

    print("[4/4] generateContent (breakdown JSON)...\n", flush=True)
    payload = {
        "contents": [{"parts": [
            {"file_data": {"mime_type": "video/mp4", "file_uri": uri}},
            {"text": PROMPT},
        ]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 12000, "responseMimeType": "application/json"},
    }
    pf = Path("/tmp/vox_payload_v2.json")
    pf.write_text(json.dumps(payload))
    r = curl([
        "-X", "POST",
        f"{base}/v1beta/models/{GEMINI_MODEL}:generateContent?key={key}",
        "-H", "Content-Type: application/json",
        "--data-binary", f"@{pf}",
    ], timeout=300)
    d = json.loads(r.stdout)
    if "error" in d:
        print("ERREUR:", d["error"].get("message"))
        sys.exit(4)
    cand = d["candidates"][0]
    print("finishReason:", cand.get("finishReason"))
    txt = cand["content"]["parts"][0]["text"]
    print("=" * 60)
    print(txt)
    print("=" * 60)
    if args.out:
        Path(args.out).write_text(txt)
        print(f"\n-> ecrit dans {args.out}")


if __name__ == "__main__":
    main()
