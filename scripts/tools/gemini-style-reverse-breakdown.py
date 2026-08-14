#!/usr/bin/env python3
"""
Reverse-engineering GENERIQUE d'un clip motion-graphic (n'importe quel registre : doodle,
poster vector, hand-drawn...) via Gemini 3.1 Pro. Upload la VIDEO complete (Files API, force
IPv4 via REST car le SDK Python stalle en IPv6 sandbox) et demande un breakdown JSON.

Variante generique de gemini-vox-reverse-breakdown.py (qui est cable "style Vox papercraft").
Meme architecture technique, prompt NEUTRE qui laisse Gemini identifier le registre lui-meme
au lieu de presupposer papercraft/3D.

Usage : python3 scripts/tools/gemini-style-reverse-breakdown.py <clip.mov> [--out breakdown.json]
"""
import os
import sys
import time
import json
import subprocess
import argparse
from pathlib import Path

GEMINI_MODEL = "gemini-3.1-pro-preview"

PROMPT = """Tu es directeur technique motion-design senior specialise en generation video IA
(Higgsfield/Seedance/MiniMax H3) et en reproduction de style en pipeline deterministe
(Remotion/SVG + generation d'images IA pour ce qui ne peut pas etre du code).

On te donne une SEQUENCE de motion graphics dont on ne connait PAS a l'avance le registre exact
(peut etre : flat vector poster, doodle main levee, hand-drawn crayon, autre). NE PRESUPPOSE RIEN
sur le style avant d'avoir regarde. Decris ce que tu VOIS reellement.

MISSION 1 — IDENTIFIER LE REGISTRE : nomme precisement le style visuel (ex: "flat vector poster,
formes geometriques nettes, aplats de couleur, contours noirs epais" ou "doodle crayon main levee,
hachures, ligne irreguliere"). Compare-le si pertinent a des references connues (Kurzgesagt, TED-Ed,
Vox, RSA Animate, Saul Bass...).

MISSION 2 — MECANISMES D'ANIMATION : c'est le plus important. Pour ce type de motion design, le
"mecanisme" (COMMENT ca bouge/apparait) compte souvent plus que le style graphique seul. Identifie
precisement pour CHAQUE beat :
  - reveal/materialisation d'un objet (glow -> forme qui se dessine ? pop soudain ? trace progressif ?)
  - split-screen / multi-panneaux (combien de zones ? bordures ? matérialisation independante par zone ?)
  - transitions entre plans (cut dur ? whip pan ? morph ? recouvrement ?)
  - mouvement des personnages/objets deja presents ("vie continue" : idle motion, ou fige ?)
  - particules/effets physiques (pluie, poussiere, impact...)
  - synchronisation geste/evenement (un geste qui declenche un effet graphique)

MISSION 3 — TRANCHER LA NATURE DE CHAQUE ELEMENT :
  * "image_generee" = a du relief/matiere/texture qui necessite un moteur de generation d'image
                       (Gemini Flash image / Recraft) pour etre reproduit fidelement.
  * "overlay_code"  = graphisme plat net (texte, chiffres, fleches, formes geometriques simples,
                       bandeaux) reproductible en SVG/Remotion natif, gratuit.
Ne te laisse pas influencer par l'apparence globale "simple" : verifie chaque element individuellement.

REGLE : decris UNIQUEMENT ce que tu VOIS reellement. Si incertain -> "uncertain": true.
Chiffres/texte a l'ecran : relis caractere par caractere.

Reponds STRICTEMENT en JSON valide (aucun texte hors JSON) :

{
  "registre_identifie": "nom du style + description courte + comparaison a une reference connue si pertinent",
  "mecanismes_animation": [
    {
      "type": "reveal | split_screen | transition | vie_continue | particules | sync_geste_evenement | autre",
      "description": "ce qui se passe precisement, avec timing approx",
      "reproductible_minimax_h3": "oui/non/partiel + pourquoi (en te basant sur les capacites connues : R2V, FLF2V, attribute_transfer, retention_analysis, references positionnelles <Picture N>)"
    }
  ],
  "elements": [
    {
      "id": "id-court",
      "label": "description courte",
      "nature": "image_generee | overlay_code",
      "pourquoi": "justification",
      "si_image_generee": {
        "moteur_conseille": "Gemini 3.1 Flash image | Recraft | MiniMax H3 (si mouvement inherent)",
        "prompt_exact": "prompt complet pret a coller, style/couleurs #hex/cadrage/fond",
        "fond": "transparent | plein",
        "reutilisable": true
      },
      "si_overlay_code": {
        "police": "famille ou substitut Google Fonts + graisse",
        "couleur": "#hex",
        "position": "zone ecran",
        "animation": "spring pop / slide / cut / typewriter",
        "comment_remotion": "note d'implementation"
      }
    }
  ],
  "background": {
    "nature": "image_generee | overlay_code",
    "note": "change entre les plans ? comment ?"
  },
  "palette": ["#hex", ...],
  "grammaire_animation": "regles de mouvement recurrentes observees sur tout le clip",
  "timeline": [
    {"plan": 1, "t_start": "0:00", "t_end": "0:06", "description": "...",
     "mecanisme_ids": ["reveal-1"], "texte_exact_ecran": "relu caractere par caractere",
     "transition_sortie": "cut | whip | morph | fondu"}
  ],
  "verdict_kora_cartes": "1-2 phrases : ce registre est-il adapte a une narration mythologique/conceptuelle
    (incarner une force economique, une figure historique) pour la chaine Kora & Cartes ? sur quel type
    de moment precis ce mecanisme serait-il le plus utile ?"
}

Sois EXHAUSTIF sur les mecanismes d'animation (c'est la partie la plus utile pour nous), plus concis
sur le detail exhaustif des elements graphiques si le clip en contient beaucoup."""


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
    mime = "video/quicktime" if vp.suffix.lower() == ".mov" else "video/mp4"

    print(f"[1/4] Start resumable upload ({size/1e6:.1f} Mo, IPv4, {mime})...", flush=True)
    r = curl([
        "-D", "-", "-o", "/dev/null", "-X", "POST",
        f"{base}/upload/v1beta/files?key={key}",
        "-H", "X-Goog-Upload-Protocol: resumable",
        "-H", "X-Goog-Upload-Command: start",
        "-H", f"X-Goog-Upload-Header-Content-Length: {size}",
        "-H", f"X-Goog-Upload-Header-Content-Type: {mime}",
        "-H", "Content-Type: application/json",
        "-d", '{"file":{"display_name":"style_ref_clip"}}',
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
            {"file_data": {"mime_type": mime, "file_uri": uri}},
            {"text": PROMPT},
        ]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 12000, "responseMimeType": "application/json"},
    }
    pf = Path(f"/tmp/style_payload_{vp.stem}.json")
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
