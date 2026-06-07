#!/usr/bin/env python3
"""
da-brief.py — DA-BRIEF-GATE générique : review créative AMONT avant de coder un acte/beat.

Envoie un brief DA + (catalogue optionnel) + (frames optionnelles, auto-downscalées)
à Gemini 3.1 Pro + Kimi K2.5 EN PARALLELE. Sorties dans /tmp/da-refs/.

Doctrine : memory/doctrines/DA-BRIEF-GATE.md (LIRE avant usage).
Modèles VERROUILLES : gemini-3.1-pro-preview + moonshotai/kimi-k2.5 (OpenRouter).

Usage :
  python3 scripts/tools/da-brief.py \\
    --brief path/to/brief.txt \\
    --label warmap-acte1 \\
    [--catalog /tmp/mapanim_compact.txt] \\
    [--frame path/to/frame1.png:"hook actuel a ameliorer"] \\
    [--frame path/to/frame2.png:"notre plafond premium (9:16 a adapter 16:9)"] \\
    [--only gemini|kimi] \\
    [--max-tokens 8000]

Les frames sont automatiquement downscalées (scale=1280, JPEG q4) — règle perf NON-NEGOTIABLE.
"""
import os
import sys
import json
import base64
import argparse
import subprocess
import threading
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = "/tmp/da-refs"
GEMINI_MODEL = "gemini-3.1-pro-preview"
KIMI_MODEL = "moonshotai/kimi-k2.5"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def downscale(path):
    """Downscale frame -> JPEG 1280px (règle perf DA-BRIEF-GATE). Retourne le chemin small."""
    os.makedirs(OUT_DIR, exist_ok=True)
    base = os.path.splitext(os.path.basename(path))[0]
    out = os.path.join(OUT_DIR, f"da-{base}-sm.jpg")
    subprocess.run(
        ["ffmpeg", "-y", "-i", path, "-vf", "scale=1280:-1", "-q:v", "4", out],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True,
    )
    return out


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


def build_prompt(brief_path, catalog_path):
    prompt = open(brief_path, encoding="utf-8").read()
    if catalog_path and os.path.exists(catalog_path):
        prompt += "\n\n=== CATALOGUE D'INSPIRATION (format compact) ===\n" + open(catalog_path, encoding="utf-8").read()
    return prompt


def call_gemini(prompt, frames, max_tokens, results):
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
        parts = [types.Part.from_text(text=prompt)]
        for fp, caption in frames:
            parts.append(types.Part.from_text(text=f"\n[{caption}] :"))
            parts.append(types.Part.from_bytes(data=open(fp, "rb").read(), mime_type="image/jpeg"))
        print("[gemini] envoi...")
        resp = client.models.generate_content(
            model=GEMINI_MODEL, contents=parts,
            config=types.GenerateContentConfig(max_output_tokens=max_tokens, temperature=0.4),
        )
        results["gemini"] = resp.text or "[vide]"
        print("[gemini] OK")
    except Exception as e:
        results["gemini"] = f"[ERREUR gemini] {e}"
        print(f"[gemini] ERREUR: {e}")


def call_kimi(prompt, frames, max_tokens, results):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["kimi"] = "[ERREUR] OPENROUTER_API_KEY absente"
        return
    content = [{"type": "text", "text": prompt}]
    for fp, caption in frames:
        content.append({"type": "text", "text": f"\n[{caption}] :"})
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64(fp)}"}})
    payload = {"model": KIMI_MODEL, "messages": [{"role": "user", "content": content}],
               "max_tokens": max_tokens, "temperature": 0.4}
    try:
        print("[kimi] envoi...")
        req = urllib.request.Request(
            OPENROUTER_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://kora-cartes.local", "X-Title": "Kora Cartes DA Brief"},
        )
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
        msg = data["choices"][0]["message"]
        results["kimi"] = msg.get("content") or msg.get("reasoning") or "[vide]"
        print("[kimi] OK")
    except Exception as e:
        results["kimi"] = f"[ERREUR kimi] {e}"
        print(f"[kimi] ERREUR: {e}")


def parse_frame(arg):
    """Parse 'path/to/frame.png:caption' -> (path, caption)."""
    if ":" in arg and not arg[1:3] == ":\\":
        path, caption = arg.rsplit(":", 1)
        return path.strip(), caption.strip()
    return arg.strip(), "frame de reference"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brief", required=True, help="Fichier texte du brief DA")
    ap.add_argument("--label", required=True, help="Label de sortie (ex: warmap-acte1)")
    ap.add_argument("--catalog", default=None, help="Catalogue d'inspiration compact (texte)")
    ap.add_argument("--frame", action="append", default=[], help="path:caption (repetable, auto-downscale)")
    ap.add_argument("--only", choices=["gemini", "kimi"], default=None, help="Un seul modele")
    ap.add_argument("--max-tokens", type=int, default=8000)
    args = ap.parse_args()

    load_env()
    if not os.path.exists(args.brief):
        print(f"[ERREUR] brief introuvable: {args.brief}"); sys.exit(1)

    # Frames : parse + downscale
    frames = []
    for fa in args.frame:
        path, caption = parse_frame(fa)
        if not os.path.exists(path):
            print(f"[ERREUR] frame introuvable: {path}"); sys.exit(1)
        sm = downscale(path)
        frames.append((sm, caption))
        print(f"[frame] {path} -> {sm} ({os.path.getsize(sm)//1024} Ko) | {caption}")

    prompt = build_prompt(args.brief, args.catalog)
    print(f"\n[brief] {len(prompt)} chars + {len(frames)} frame(s) -> "
          f"{'+'.join([m for m in ('gemini','kimi') if not args.only or args.only==m])}\n")

    results = {}
    targets = []
    if args.only in (None, "gemini"):
        targets.append(threading.Thread(target=call_gemini, args=(prompt, frames, args.max_tokens, results)))
    if args.only in (None, "kimi"):
        targets.append(threading.Thread(target=call_kimi, args=(prompt, frames, args.max_tokens, results)))
    for t in targets: t.start()
    for t in targets: t.join()

    os.makedirs(OUT_DIR, exist_ok=True)
    for name in ("gemini", "kimi"):
        if name in results:
            out = os.path.join(OUT_DIR, f"da-{args.label}-{name}.md")
            open(out, "w", encoding="utf-8").write(results[name])
            print(f"[sauvegarde] {name} -> {out} ({len(results[name])} chars)")


if __name__ == "__main__":
    main()
