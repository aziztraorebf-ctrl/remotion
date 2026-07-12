#!/usr/bin/env python3
"""Kimi K2.5 review avec FRAMES — recette fiable (OpenRouter, temp=1, max_tokens haut, fallback reasoning).
Usage: python3 kimi-frames-review.py <brief.txt> <out.md> <img1> <img2> ...
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "moonshotai/kimi-k2.5"

def main():
    brief_file, out = sys.argv[1], sys.argv[2]
    imgs = sys.argv[3:]
    brief = Path(brief_file).read_text(encoding="utf-8")
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("OPENROUTER_API_KEY manquant", file=sys.stderr); sys.exit(1)

    content = [{"type": "text", "text": brief + "\n\nCi-joint 6 frames-clés de la vidéo (une par beat, dans l'ordre)."}]
    for p in imgs:
        b64 = base64.b64encode(Path(p).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}})

    print(f"Envoi Kimi K2.5 ({len(imgs)} frames)...", flush=True)
    resp = requests.post(URL, headers={
        "Authorization": f"Bearer {key}", "Content-Type": "application/json",
        "HTTP-Referer": "https://geoafrique.com", "X-Title": "GeoAfrique Souverain",
    }, json={
        "model": MODEL,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 4000, "temperature": 1,
    }, timeout=240)

    if resp.status_code != 200:
        print(f"ERREUR {resp.status_code}: {resp.text[:600]}", file=sys.stderr); sys.exit(1)

    data = resp.json()
    choice = data["choices"][0]
    msg = choice["message"]
    txt = msg.get("content") or msg.get("reasoning") or ""
    finish = choice.get("finish_reason", "?")
    usage = data.get("usage", {})
    print(f"finish_reason: {finish} | {usage.get('prompt_tokens',0)}in + {usage.get('completion_tokens',0)}out | {len(txt)} chars", flush=True)
    if finish == "length" and len(txt) < 200:
        print("AVERT: tronqué+vide. Réduire frames/prompt.", file=sys.stderr)
    Path(out).write_text(txt, encoding="utf-8")
    print("\n" + "=" * 70 + "\n" + txt + "\n" + "=" * 70)

if __name__ == "__main__":
    main()
