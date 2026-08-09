#!/usr/bin/env python3
"""
da-brief-compare-2videos.py — DA-BRIEF comparatif A/B avec DEUX videos natives (Gemini + Kimi).
Variante de da-brief-video-3voix.py (meme pattern IPv4/API) pour un cas different : comparer
NOTRE rendu contre une REFERENCE externe, dans le meme appel, plutot que d'analyser une seule
video isolement.

Usage :
  python3 scripts/tools/da-brief-compare-2videos.py \\
    --reference path/to/original.mp4 --ours path/to/notre-v4.mp4 \\
    --focus "texte libre du point d'attention prioritaire" \\
    --label mochit-v4 --out-dir /tmp/da-refs

Sorties : <out-dir>/da-compare-<label>-{gemini,kimi}.md
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel réseau

import json
import time
import base64
import argparse
import threading
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEMINI_MODEL = "gemini-3.1-pro-preview"
KIMI_MODEL = "kimi-k2.5"
KIMI_MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions"

PROMPT_TEMPLATE = """Tu es un motion designer senior et directeur artistique, expert en publicites
courtes premium (registre SaaS/agence, type Bloomberg/Vox ou motion design haut de gamme).

On te montre DEUX videos dans cet ordre :
1. LA REFERENCE — une publicite Fiverr existante, deja livree et approuvee par un client.
2. NOTRE VERSION — notre reproduction/tentative de depassement de cette reference, faite avec
   notre propre stack (SVG anime frame-driven en React/Remotion, pas d'After Effects/3D).

TA TACHE : comparer les deux, identifier les ECARTS MAJEURS (ce qui manque, ce qui est plus
faible, ce qui pourrait etre ameliore dans NOTRE version), et proposer des pistes CONCRETES et
ACTIONNABLES pour nous rapprocher du niveau de la reference, voire la depasser.

{focus_block}

=== STRUCTURE DE REPONSE OBLIGATOIRE ===

## 1. Verdict global
En 2-3 phrases : notre version est-elle au niveau, en dessous, ou depasse-t-elle la reference ?
Quel est LE probleme le plus important a corriger en priorite ?

## 2. Comparaison panneau par panneau
Pour CHAQUE moment cle de la video (hook, pivot/probleme, solution/workflow, benefice, CTA) :
- Ce que fait la reference
- Ce que fait notre version
- L'ecart precis (pas vague : dimensions, espacement, timing, couleurs, style)
- Une piste concrete pour corriger, dans NOTRE stack (SVG/React/Remotion frame-driven,
  PAS d'icones stock/librairie externe a moins de le justifier explicitement)

## 3. Icones et elements graphiques (point d'attention prioritaire de cette review)
Compare specifiquement :
- Taille relative des icones a l'ecran (trop petites/trop grandes chez nous ?)
- Espacement entre les icones et le texte
- Richesse visuelle (style plat vs illustratif, nombre de couleurs, ombres/profondeur)
- Coherence du systeme d'icones (memes proportions/epaisseurs entre elles)
- Qualite du motion design SPECIFIQUE aux icones (comment elles entrent, bougent, sortent)
Donne des valeurs approximatives si possible (ex: "l'icone de la reference occupe environ 15% de
la largeur de l'ecran, la notre environ 8%").

## 4. Trois priorites pour une derniere passe
Les 3 corrections qui auraient le plus d'impact, classees par ordre d'impact/effort.

CONTRAINTE : reste dans notre boite a outils (SVG anime frame-driven, pas de nouvelle librairie
d'icones externe sauf si tu la nommes et justifies pourquoi c'est le bon choix). Sois technique et
precis, pas de generalites ("c'est plus joli") sans expliquer QUOI precisement et COMMENT corriger.
"""


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def b64_file(path):
    return base64.b64encode(open(path, "rb").read()).decode()


def build_prompt(focus):
    focus_block = ""
    if focus:
        focus_block = f"=== POINT D'ATTENTION PRIORITAIRE (demande explicite) ===\n{focus}\n"
    return PROMPT_TEMPLATE.format(focus_block=focus_block)


def call_gemini_compare(prompt, ref_path, ours_path, max_tokens, results):
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        results["gemini"] = "[ERREUR] SDK google-genai absent"
        return
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        results["gemini"] = "[ERREUR] GEMINI_API_KEY absente"
        return
    try:
        client = genai.Client(api_key=key)
        print("[gemini] upload reference...")
        f_ref = client.files.upload(file=ref_path)
        print("[gemini] upload notre version...")
        f_ours = client.files.upload(file=ours_path)
        for f in (f_ref, f_ours):
            for _ in range(60):
                fs = client.files.get(name=f.name)
                if fs.state == "ACTIVE":
                    break
                if fs.state == "FAILED":
                    results["gemini"] = f"[ERREUR] upload FAILED sur {f.name}"
                    return
                time.sleep(2)
        print("[gemini] videos ACTIVE, envoi prompt...")
        contents = [
            "=== VIDEO 1 : LA REFERENCE (Fiverr, deja livree) ===", f_ref,
            "=== VIDEO 2 : NOTRE VERSION ===", f_ours,
            prompt,
        ]
        resp = client.models.generate_content(
            model=GEMINI_MODEL, contents=contents,
            config=types.GenerateContentConfig(max_output_tokens=max_tokens, temperature=0.4),
        )
        results["gemini"] = resp.text or "[vide]"
        print("[gemini] OK")
    except Exception as e:
        results["gemini"] = f"[ERREUR gemini] {e}"
        print(f"[gemini] ERREUR: {e}")


def call_kimi_compare(prompt, ref_path, ours_path, max_tokens, results):
    moonshot_key = os.getenv("MOONSHOT_API_KEY")
    if not moonshot_key:
        results["kimi"] = "[ERREUR] MOONSHOT_API_KEY absente"
        return
    try:
        print("[kimi] encodage base64 des 2 videos...")
        ref_b64 = b64_file(ref_path)
        ours_b64 = b64_file(ours_path)
        content = [
            {"type": "text", "text": "=== VIDEO 1 : LA REFERENCE (Fiverr, deja livree) ==="},
            {"type": "video_url", "video_url": {"url": f"data:video/mp4;base64,{ref_b64}"}},
            {"type": "text", "text": "=== VIDEO 2 : NOTRE VERSION ==="},
            {"type": "video_url", "video_url": {"url": f"data:video/mp4;base64,{ours_b64}"}},
            {"type": "text", "text": prompt},
        ]
        payload = {"model": KIMI_MODEL, "messages": [{"role": "user", "content": content}],
                   "max_tokens": max_tokens, "temperature": 1}
        print("[kimi] envoi (API Moonshot native)...")
        req = urllib.request.Request(
            KIMI_MOONSHOT_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {moonshot_key}", "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=420) as r:
            data = json.loads(r.read().decode())
        msg = data["choices"][0]["message"]
        results["kimi"] = msg.get("content") or msg.get("reasoning") or "[vide]"
        print("[kimi] OK")
    except Exception as e:
        results["kimi"] = f"[ERREUR kimi] {e}"
        print(f"[kimi] ERREUR: {e}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reference", required=True, help="Video de reference (originale)")
    ap.add_argument("--ours", required=True, help="Notre version")
    ap.add_argument("--focus", default="", help="Point d'attention prioritaire (texte libre)")
    ap.add_argument("--label", required=True)
    ap.add_argument("--out-dir", default="/tmp/da-refs")
    ap.add_argument("--max-tokens", type=int, default=16000)
    ap.add_argument("--only", choices=["gemini", "kimi"], default=None)
    args = ap.parse_args()

    load_env()
    if not os.path.exists(args.reference):
        print(f"[ERREUR] reference introuvable: {args.reference}"); sys.exit(1)
    if not os.path.exists(args.ours):
        print(f"[ERREUR] ours introuvable: {args.ours}"); sys.exit(1)

    prompt = build_prompt(args.focus)
    print(f"\n[brief] {len(prompt)} chars -> gemini(2 videos) + kimi(2 videos)\n")

    results = {}
    targets = []
    if args.only in (None, "gemini"):
        targets.append(threading.Thread(target=call_gemini_compare, args=(prompt, args.reference, args.ours, args.max_tokens, results)))
    if args.only in (None, "kimi"):
        targets.append(threading.Thread(target=call_kimi_compare, args=(prompt, args.reference, args.ours, args.max_tokens, results)))
    for t in targets: t.start()
    for t in targets: t.join()

    os.makedirs(args.out_dir, exist_ok=True)
    for name in ("gemini", "kimi"):
        if name in results:
            out = os.path.join(args.out_dir, f"da-compare-{args.label}-{name}.md")
            open(out, "w", encoding="utf-8").write(results[name])
            print(f"[sauvegarde] {name} -> {out} ({len(results[name])} chars)")


if __name__ == "__main__":
    main()
