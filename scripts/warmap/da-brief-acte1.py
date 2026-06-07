#!/usr/bin/env python3
"""
da-brief-acte1.py — Envoie le brief DA Acte 1 a Gemini 3.1 Pro + Kimi K2.5 EN PARALLELE.

Chaque modele recoit : le brief (da-brief-acte1.txt) + le catalogue Map Animation
compact + 2 frames de reference (hook Sahel V3, Sudan Epic). Reponses sauvegardees
dans /tmp/da-refs/ pour synthese par Claude.

Modeles VERROUILLES (CLAUDE.md) :
  - Gemini : gemini-3.1-pro-preview
  - Kimi   : moonshotai/kimi-k2.5 via OpenRouter

Usage : python3 scripts/warmap/da-brief-acte1.py
"""
import os
import sys
import json
import base64
import threading
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BRIEF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "da-brief-acte1.txt")
CATALOG = "/tmp/mapanim_compact.txt"
FRAME_SAHEL = "/tmp/da-refs/sahel-hook-v3-sm.jpg"
FRAME_SUDAN = "/tmp/da-refs/sudan-epic-v4-sm.jpg"
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


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


def build_prompt():
    brief = open(BRIEF, encoding="utf-8").read()
    catalog = open(CATALOG, encoding="utf-8").read()
    return (
        brief
        + "\n\n=== CATALOGUE MAP ANIMATION (89 templates scannes, format: #id [usage] titre) ===\n"
        + catalog
    )


# --------------------------------------------------------------------------
# GEMINI 3.1 PRO
# --------------------------------------------------------------------------
def call_gemini(prompt, results):
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        results["gemini"] = "[ERREUR] SDK google-genai absent (pip install google-genai)"
        return
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        results["gemini"] = "[ERREUR] GEMINI_API_KEY absente"
        return
    try:
        client = genai.Client(api_key=key)
        parts = [
            types.Part.from_text(text=prompt),
            types.Part.from_text(text="\n[FRAME 1 — hook Sahel ACTUEL, a ameliorer] :"),
            types.Part.from_bytes(data=open(FRAME_SAHEL, "rb").read(), mime_type="image/png"),
            types.Part.from_text(text="\n[FRAME 2 — Sudan Epic, plafond premium, 9:16 a adapter en 16:9] :"),
            types.Part.from_bytes(data=open(FRAME_SUDAN, "rb").read(), mime_type="image/png"),
        ]
        print("[gemini] envoi en cours...")
        resp = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=parts,
            config=types.GenerateContentConfig(max_output_tokens=8000, temperature=0.4),
        )
        results["gemini"] = resp.text or "[vide]"
        print("[gemini] OK")
    except Exception as e:
        results["gemini"] = f"[ERREUR gemini] {e}"
        print(f"[gemini] ERREUR: {e}")


# --------------------------------------------------------------------------
# KIMI K2.5 (OpenRouter)
# --------------------------------------------------------------------------
def call_kimi(prompt, results):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["kimi"] = "[ERREUR] OPENROUTER_API_KEY absente"
        return
    content = [
        {"type": "text", "text": prompt},
        {"type": "text", "text": "\n[FRAME 1 — hook Sahel ACTUEL, a ameliorer] :"},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64(FRAME_SAHEL)}"}},
        {"type": "text", "text": "\n[FRAME 2 — Sudan Epic, plafond premium, 9:16 a adapter en 16:9] :"},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64(FRAME_SUDAN)}"}},
    ]
    payload = {
        "model": KIMI_MODEL,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 8000,
        "temperature": 0.4,
    }
    try:
        print("[kimi] envoi en cours...")
        req = urllib.request.Request(
            OPENROUTER_URL,
            data=json.dumps(payload).encode(),
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://kora-cartes.local",
                "X-Title": "Kora Cartes DA Brief",
            },
        )
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
        msg = data["choices"][0]["message"]
        results["kimi"] = msg.get("content") or msg.get("reasoning") or "[vide]"
        print("[kimi] OK")
    except Exception as e:
        results["kimi"] = f"[ERREUR kimi] {e}"
        print(f"[kimi] ERREUR: {e}")


def main():
    load_env()
    for f in (BRIEF, CATALOG, FRAME_SAHEL, FRAME_SUDAN):
        if not os.path.exists(f):
            print(f"[ERREUR] fichier manquant: {f}")
            sys.exit(1)
    prompt = build_prompt()
    print(f"[brief] {len(prompt)} chars + 2 frames -> Gemini 3.1 Pro + Kimi K2.5 (parallele)\n")

    results = {}
    threads = [
        threading.Thread(target=call_gemini, args=(prompt, results)),
        threading.Thread(target=call_kimi, args=(prompt, results)),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    os.makedirs(OUT_DIR, exist_ok=True)
    for name in ("gemini", "kimi"):
        out = os.path.join(OUT_DIR, f"da-acte1-{name}.md")
        open(out, "w", encoding="utf-8").write(results.get(name, "[aucune reponse]"))
        print(f"\n[sauvegarde] {name} -> {out} ({len(results.get(name,''))} chars)")


if __name__ == "__main__":
    main()
