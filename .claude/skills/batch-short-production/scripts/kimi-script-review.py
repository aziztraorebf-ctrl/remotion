"""
Batch Short Production — Phase 2.5: Kimi K2.5 Script Review + Storyboard Direction
Sends script to Kimi K2.5 for two-pass analysis:
  Pass 1: Script review (narrative, pacing, hook strength, suggestions)
  Pass 2: Storyboard direction (shot types, camera, rhythm, transitions)

Usage:
    python kimi-script-review.py --script path/to/script.txt --output path/to/kimi-review.md
    python kimi-script-review.py --script path/to/script.txt --timing path/to/timing.json --output path/to/kimi-review.md

With --timing: includes beat durations in the storyboard direction prompt for more precise framing.
Without --timing: works with script alone (less precise but still valuable).

Requires MOONSHOT_API_KEY in .env (preferred) or OPENROUTER_API_KEY (fallback).
Cost: ~$0.01 total for both passes.
"""

import argparse
import json
import os
import sys
import pathlib
import urllib.request
import urllib.error
from datetime import datetime


BACKENDS = {
    "moonshot": {
        "url": "https://api.moonshot.ai/v1/chat/completions",
        "model": "kimi-k2.5",
        "key_env": "MOONSHOT_API_KEY",
        "extra_params": {"thinking": {"type": "disabled"}},
        "pricing": {"input": 0.60, "output": 3.00},
    },
    "openrouter": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "model": "moonshotai/kimi-k2.5",
        "key_env": "OPENROUTER_API_KEY",
        "extra_params": {"temperature": 0.3},
        "extra_headers": {
            "HTTP-Referer": "https://github.com/remotion-video",
            "X-Title": "GeoAfrique Script Review",
        },
        "pricing": {"input": 0.50, "output": 2.80},
    },
}


def find_env():
    path = pathlib.Path.cwd()
    while path != path.parent:
        env_file = path / ".env"
        if env_file.exists():
            return str(env_file)
        path = path.parent
    return None


def load_env():
    env_path = find_env()
    if env_path:
        for line in pathlib.Path(env_path).read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, val = line.partition("=")
                os.environ.setdefault(key.strip(), val.strip())


def select_backend():
    for name in ("moonshot", "openrouter"):
        key = os.environ.get(BACKENDS[name]["key_env"], "")
        if key and not key.startswith("your-"):
            return name, key
    print("ERROR: No API key found. Set MOONSHOT_API_KEY or OPENROUTER_API_KEY in .env")
    sys.exit(1)


def call_kimi(backend_name, api_key, system_prompt, user_prompt):
    backend = BACKENDS[backend_name]

    payload = {
        "model": backend["model"],
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 4096,
        **backend.get("extra_params", {}),
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        **backend.get("extra_headers", {}),
    }

    req = urllib.request.Request(
        backend["url"],
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        reply = result["choices"][0]["message"]["content"]
        usage = result.get("usage", {})
        inp = usage.get("prompt_tokens", 0)
        out = usage.get("completion_tokens", 0)
        pricing = backend["pricing"]
        cost = inp * pricing["input"] / 1_000_000 + out * pricing["output"] / 1_000_000
        return reply, inp, out, cost


def build_review_prompt(script_text):
    return f"""Voici un script de YouTube Short (~60-120s) pour un documentaire historique anime.

SCRIPT:
---
{script_text}
---

Analyse ce script et donne-moi :

## 1. FORCE NARRATIVE
- Le hook est-il assez fort pour retenir dans les 3 premieres secondes ?
- Le rythme de tension est-il bien construit ?
- Le twist ou la revelation principale est-il bien amene ?

## 2. FAIBLESSES
- Y a-t-il des passages qui perdent le spectateur ?
- Des phrases trop longues ou trop complexes pour du Short ?
- Des moments ou le rythme faiblit ?

## 3. SUGGESTIONS CONCRETES
- 3 modifications precises (avec le texte exact avant/apres)
- Sont-elles compatibles avec la duree du Short ?

## 4. VERDICT
- Score /10 pour un YouTube Short historique
- Ce script est-il pret pour la production ou necessite-t-il des modifications ?

Sois direct et precis. Pas de complaisance."""


def build_storyboard_prompt(script_text, timing_info=None):
    timing_section = ""
    num_frames = 9
    if timing_info:
        num_frames = len(timing_info.get("beats", []))
        timing_section = "\nDUREES PAR BEAT (derivees de l'audio) :\n"
        for b in timing_info["beats"]:
            timing_section += f"- Beat {b['beat']}: {b['duration']}s — {b.get('description', '')}\n"

    return f"""Voici le script final d'un YouTube Short historique (~60-120s, 9:16).

SCRIPT:
---
{script_text}
---
{timing_section}

Propose un storyboard en {num_frames} frames pour ce script.

Pour chaque frame, donne :
1. **Beat narratif** : quelle partie du script cette frame illustre
2. **Type de plan** : close-up / medium / wide / extreme close-up / overhead
3. **Sujet visuel** : ce qu'on voit (SANS texte, dates, ou chiffres visibles)
4. **Mouvement camera** : dolly in, pan, tracking, static, zoom out...
5. **Dynamisme** : lent/atmospherique OU rapide/fast-cut OU impactant/freeze
6. **Transition vers la frame suivante** : cut sec, fondu, zoom, match cut...

REGLES :
- Varie les types de plans (pas {num_frames} medium shots)
- Au moins 2 fast cuts dans la sequence (pour le rythme)
- Au moins 1 frame geographique (carte/map) si le sujet s'y prete
- Le climax visuel doit etre le plus impactant
- La derniere frame doit etre un portrait fort pour le CTA
- ZERO texte dans les frames — reimaginer toute scene qui contiendrait du texte

Sois cinematographique et precis."""


SYSTEM_REVIEW = """Tu es Kimi, directeur artistique et narratif pour des YouTube Shorts historiques animes (60-120s, format 9:16).
Tu travailles sur des documentaires courts style GeoAfrique : narration francaise, ton grave et cinematique, flat 2D illustration.
Tu es exigeant sur le rythme, l'impact emotionnel, et la structure narrative."""

SYSTEM_STORYBOARD = """Tu es Kimi, directeur artistique specialise dans la mise en scene de YouTube Shorts animes.
Tu maitrises les techniques de montage dynamique : fast cuts, slow reveals, split screens, zoom progressifs, contrastes visuels.
Tu travailles en 2D vivid flat illustration, format 9:16 vertical.
Tu sais que les images seront generees par Gemini (storyboard 3x3) puis animees par un generateur I2V.
CONTRAINTE : zero texte visible dans les frames — tout texte est ajoute en post-prod Remotion."""


def main():
    parser = argparse.ArgumentParser(description="Kimi K2.5 script review + storyboard direction")
    parser.add_argument("--script", required=True, help="Path to script text file")
    parser.add_argument("--timing", default=None, help="Path to timing.json (optional, improves storyboard)")
    parser.add_argument("--output", required=True, help="Output markdown file")
    parser.add_argument("--review-only", action="store_true", help="Only run Pass 1 (script review)")
    parser.add_argument("--storyboard-only", action="store_true", help="Only run Pass 2 (storyboard direction)")
    args = parser.parse_args()

    load_env()
    backend_name, api_key = select_backend()

    script_path = pathlib.Path(args.script)
    if not script_path.exists():
        print(f"ERROR: Script not found: {script_path}")
        sys.exit(1)
    script_text = script_path.read_text(encoding="utf-8").strip()

    timing_info = None
    if args.timing:
        timing_path = pathlib.Path(args.timing)
        if timing_path.exists():
            with open(timing_path) as f:
                timing_info = json.load(f)

    output_parts = []
    total_cost = 0
    output_parts.append(f"# Kimi K2.5 Direction — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    output_parts.append(f"> Backend: {backend_name} | Model: {BACKENDS[backend_name]['model']}\n")

    # Pass 1: Script Review
    if not args.storyboard_only:
        print("=" * 60)
        print("PASS 1: SCRIPT REVIEW")
        print("=" * 60)
        print(f"Sending to {BACKENDS[backend_name]['model']} via {backend_name}...")

        review, inp, out, cost = call_kimi(
            backend_name, api_key,
            SYSTEM_REVIEW,
            build_review_prompt(script_text),
        )
        total_cost += cost
        print(f"Tokens: {inp} in + {out} out = ${cost:.4f}")
        print()
        print(review)

        output_parts.append("## Pass 1: Script Review\n")
        output_parts.append(review)
        output_parts.append(f"\n*Cost: ${cost:.4f}*\n")

    # Pass 2: Storyboard Direction
    if not args.review_only:
        print()
        print("=" * 60)
        print("PASS 2: STORYBOARD DIRECTION")
        print("=" * 60)
        print(f"Sending to {BACKENDS[backend_name]['model']} via {backend_name}...")

        storyboard, inp, out, cost = call_kimi(
            backend_name, api_key,
            SYSTEM_STORYBOARD,
            build_storyboard_prompt(script_text, timing_info),
        )
        total_cost += cost
        print(f"Tokens: {inp} in + {out} out = ${cost:.4f}")
        print()
        print(storyboard)

        output_parts.append("## Pass 2: Storyboard Direction\n")
        output_parts.append(storyboard)
        output_parts.append(f"\n*Cost: ${cost:.4f}*\n")

    # Summary
    output_parts.append(f"\n---\n**Total cost: ${total_cost:.4f}**")

    output_path = pathlib.Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(output_parts), encoding="utf-8")

    print()
    print("=" * 60)
    print(f"Total cost: ${total_cost:.4f}")
    print(f"Saved to: {output_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
