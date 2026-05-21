#!/usr/bin/env python3
"""Send a TEXT-ONLY creative brief to Kimi K2.5 (no media).

Usage:
    python -u scripts/tools/kimi-creative-brief.py <brief.md> [--output reply.md]
"""
import sys
import os
import json
import argparse
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

MOONSHOT_KEY = os.environ.get("MOONSHOT_API_KEY", "")
OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")

BACKENDS = {
    "moonshot": {
        "url": "https://api.moonshot.ai/v1/chat/completions",
        "model": "kimi-k2.5",
        "key": MOONSHOT_KEY,
    },
    "openrouter": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "model": "moonshotai/kimi-k2.5",
        "key": OPENROUTER_KEY,
    },
}

SYSTEM = """Tu es Kimi, directeur creatif technique pour une chaine YouTube documentaire pixel art / cartographique.

Stack disponible et MAITRISEE par l'equipe :
- Remotion 4.0.452 (React, 30fps, 1920x1080)
- React + TypeScript pour toutes animations (interpolate, spring, useCurrentFrame)
- d3-geo + Natural Earth + Historical Basemaps pour cartes vectorielles animees
- PixelLab MCP : sprites characters (rotations 4-dir + animations walking/idle/breathing/fight-stance), objets isometrique/side/front/top
- ElevenLabs Forced Alignment (timestamps mot-par-mot)
- Whisper (sous-titres karaoke)
- Gemini 3 Pro / Imagen pour illustrations parchemin
- Seedance pour clips video courts paper-craft (5-15s)
- Fal.ai Minimax pour musique generative
- Mapbox GL JS (mais lent, on prefere d3-geo)

Ce qu'on NE PEUT PAS / NE FAIT PAS :
- Pas de After Effects, pas de GEOlayers, pas de Google Earth Studio
- Pas de 3D vraie (Three.js exclus)
- Pas d'Aseprite CLI (validation visuelle PixelLab seulement)
- Pas de Live2D, pas de rigging avance
- Pas de generation video AI longue (>15s instable)

Ton role : repondre au brief avec des idees CREATIVES + CONCRETES + 100% FAISABLES dans ce stack.

Format de reponse :
- Pour chaque suggestion : (1) idee en une phrase, (2) HOW dans notre stack (technique precise, pas vague), (3) impact dynamisme/lisibilite, (4) cout estime (frames de prod, asset count)
- Tu peux refuter ou reformuler nos choix si tu vois un meilleur chemin DANS le stack
- Sois specifique aux timestamps fournis - cite les frames quand pertinent
- Pas de blabla generique - on veut du tactique
- Reponse en francais"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("brief", help="Path to brief markdown file")
    parser.add_argument("--output", "-o", help="Save reply to file")
    parser.add_argument("--backend", "-b", choices=["moonshot", "openrouter"], default="moonshot")
    args = parser.parse_args()

    backend = BACKENDS[args.backend]
    if not backend["key"] or backend["key"].startswith("your-"):
        print(f"ERROR: {args.backend.upper()}_API_KEY missing in .env")
        sys.exit(1)

    brief_path = Path(args.brief)
    if not brief_path.exists():
        print(f"ERROR: brief introuvable: {brief_path}")
        sys.exit(1)

    brief_text = brief_path.read_text(encoding="utf-8")
    print(f"Brief: {brief_path.name} ({len(brief_text)} chars)")

    payload = {
        "model": backend["model"],
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": brief_text},
        ],
        "max_tokens": 8192,
    }
    if args.backend == "moonshot":
        payload["thinking"] = {"type": "disabled"}
    else:
        payload["temperature"] = 0.4

    import urllib.request
    import urllib.error

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {backend['key']}",
    }
    if args.backend == "openrouter":
        headers["HTTP-Referer"] = "https://github.com/remotion-video"
        headers["X-Title"] = "Atlas Shaka Creative Brief"

    req = urllib.request.Request(
        backend["url"],
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    print(f"Envoi a {backend['model']} via {args.backend}...")
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else ""
        print(f"HTTP {e.code}: {body[:500]}")
        sys.exit(1)

    reply = result["choices"][0]["message"]["content"]
    usage = result.get("usage", {})
    if usage:
        inp = usage.get("prompt_tokens", 0)
        out = usage.get("completion_tokens", 0)
        cost = inp * 0.60 / 1_000_000 + out * 3.00 / 1_000_000
        print(f"Tokens: {inp} in + {out} out = ${cost:.4f}")

    print("\n" + "=" * 60)
    print("KIMI K2.5 — REPONSE")
    print("=" * 60)
    print(reply)

    if args.output:
        Path(args.output).write_text(reply, encoding="utf-8")
        print(f"\nSauve dans {args.output}")


if __name__ == "__main__":
    main()
