"""DA-brief mouvement — Flowdesk Volet 2A, 3 voix EN PARALLELE (Gemini 3.1 Pro + GPT-5.5 + Kimi K2.5).

Envoie le brief texte (da-brief-2a-mouvement.txt) + les 4 frames du storyboard abstrait au 3
modeles vision, en parallele. Pattern calque sur scripts/tools/da-brief.py (doctrine
DA-BRIEF-GATE) mais avec GPT-5.5 comme 3e voix vision (au lieu de DeepSeek texte-only, pas
pertinent ici -- on a besoin des 3 voix EN VISION sur les memes images).

Usage :
  python3 da-brief-mouvement.py
"""
import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "..", "..", ".."))
TOOLS_DIR = os.path.join(ROOT, "scripts", "tools")
sys.path.insert(0, TOOLS_DIR)
import force_ipv4  # noqa: E402,F401 -- DOIT s'importer avant tout appel reseau (IPv6 mort en sandbox)

import json
import base64
import subprocess
import threading
import urllib.request
OUT_DIR = os.path.join(PROJECT_DIR, "da-brief-2a-mouvement-out")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"
KIMI_MODEL = "moonshotai/kimi-k2.5"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

BRIEF_PATH = os.path.join(PROJECT_DIR, "da-brief-2a-mouvement.txt")
FRAMES = [
    (os.path.join(PROJECT_DIR, "mix-fable5-gpt56sol-chaos.svg"), "Panneau 1 - CHAOS (SVG source)"),
    (os.path.join(PROJECT_DIR, "proto-fable5-reproduce-bascule.svg"), "Panneau 2 - BASCULE (SVG source)"),
    (os.path.join(PROJECT_DIR, "proto-fable5-mecanisme.svg"), "Panneau 3 - MECANISME (SVG source, NOTE: vide a gauche du cadre, probleme a resoudre)"),
    (os.path.join(PROJECT_DIR, "proto-fable5-resolution.svg"), "Panneau 4 - RESOLUTION (SVG source)"),
]


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def svg_to_jpeg(svg_path):
    """SVG source -> JPEG downscale 1280px (regle perf DA-BRIEF-GATE, meme si depart different de da-brief.py)."""
    os.makedirs(OUT_DIR, exist_ok=True)
    base = os.path.splitext(os.path.basename(svg_path))[0]
    png_full = os.path.join(OUT_DIR, f"{base}-full.png")
    out = os.path.join(OUT_DIR, f"{base}-sm.jpg")
    subprocess.run(
        ["rsvg-convert", "-w", "1280", "--background-color=#0B1F3A", svg_path, "-o", png_full],
        check=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", png_full, "-q:v", "4", out],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True,
    )
    return out


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


def call_gemini(prompt, frames, results):
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
            config=types.GenerateContentConfig(max_output_tokens=16000, temperature=0.5),
        )
        results["gemini"] = resp.text or "[vide]"
        print("[gemini] OK")
    except Exception as e:
        results["gemini"] = f"[ERREUR gemini] {e}"
        print(f"[gemini] ERREUR: {e}")


def call_openrouter_vision(model_key, model_id, prompt, frames, results, max_tokens=16000):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results[model_key] = "[ERREUR] OPENROUTER_API_KEY absente"
        return
    content = [{"type": "text", "text": prompt}]
    for fp, caption in frames:
        content.append({"type": "text", "text": f"\n[{caption}] :"})
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64(fp)}"}})
    payload = {"model": model_id, "messages": [{"role": "user", "content": content}],
               "max_tokens": max_tokens, "temperature": 0.5}
    try:
        print(f"[{model_key}] envoi...")
        req = urllib.request.Request(
            OPENROUTER_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://kora-cartes.local", "X-Title": "Flowdesk DA Brief Mouvement"},
        )
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
        msg = data["choices"][0]["message"]
        results[model_key] = msg.get("content") or msg.get("reasoning") or "[vide]"
        print(f"[{model_key}] OK")
    except Exception as e:
        results[model_key] = f"[ERREUR {model_key}] {e}"
        print(f"[{model_key}] ERREUR: {e}")


def main():
    load_env()
    if not os.path.exists(BRIEF_PATH):
        print(f"[ERREUR] brief introuvable: {BRIEF_PATH}")
        sys.exit(1)

    frames = []
    for svg_path, caption in FRAMES:
        if not os.path.exists(svg_path):
            print(f"[ERREUR] SVG introuvable: {svg_path}")
            sys.exit(1)
        jpg = svg_to_jpeg(svg_path)
        frames.append((jpg, caption))
        print(f"[frame] {os.path.basename(svg_path)} -> {jpg} ({os.path.getsize(jpg)//1024} Ko)")

    prompt = open(BRIEF_PATH, encoding="utf-8").read()
    print(f"\n[brief] {len(prompt)} chars + {len(frames)} frame(s) -> gemini+gpt55+kimi\n")

    results = {}
    threads = [
        threading.Thread(target=call_gemini, args=(prompt, frames, results)),
        threading.Thread(target=call_openrouter_vision, args=("gpt55", GPT_MODEL, prompt, frames, results)),
        threading.Thread(target=call_openrouter_vision, args=("kimi", KIMI_MODEL, prompt, frames, results)),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    os.makedirs(OUT_DIR, exist_ok=True)
    for name in ("gemini", "gpt55", "kimi"):
        if name in results:
            out = os.path.join(OUT_DIR, f"da-brief-2a-mouvement-{name}.md")
            open(out, "w", encoding="utf-8").write(results[name])
            print(f"[sauvegarde] {name} -> {out} ({len(results[name])} chars)")


if __name__ == "__main__":
    main()
