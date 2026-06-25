#!/usr/bin/env python3
"""
kimi-svg-ideation.py — Ideation NARRATIVE d'une scene SVG via Kimi K2.5 (multimodal).

Kimi propose des IDEES de scene narrative pour un beat, en connaissant le niveau SVG
faisable grace a des frames de reference JOINTES (calibrage du medium, PAS un modele a copier).

NOTES TECHNIQUES :
  - OpenRouter moonshotai/kimi-k2.5 (multimodal, valide 2026-06-24 : accepte image_url).
  - temperature=1 obligatoire (seule valeur acceptee par Kimi).
  - Fallback reasoning si content est null.
  - Images encodees en data URL base64 (jpeg/png).

Usage:
  python3 scripts/tools/kimi-svg-ideation.py --prompt-file /tmp/brief.txt \
    --image /tmp/refs/1.jpg --image /tmp/refs/2.png [--output out.md]
"""

import os
import sys
import base64
import argparse
import mimetypes
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
KIMI_MODEL = 'moonshotai/kimi-k2.5'


def encode_image(path):
    mime, _ = mimetypes.guess_type(path)
    if mime is None:
        mime = 'image/png'
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
    return f"data:{mime};base64,{b64}"


def call_kimi(prompt_text, image_paths, max_tokens=4000):
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("ERREUR: OPENROUTER_API_KEY manquant dans .env", file=sys.stderr)
        sys.exit(1)

    content = [{'type': 'text', 'text': prompt_text}]
    for p in image_paths:
        content.append({'type': 'image_url', 'image_url': {'url': encode_image(p)}})

    print(f"Envoi a Kimi K2.5 (OpenRouter)... [{len(prompt_text)} chars + {len(image_paths)} images]", flush=True)

    resp = requests.post(
        OPENROUTER_URL,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://geoafrique.com',
            'X-Title': 'GeoAfrique SVG Ideation',
        },
        json={
            'model': KIMI_MODEL,
            'messages': [{'role': 'user', 'content': content}],
            'max_tokens': max_tokens,
            'temperature': 1,
        },
        timeout=240,
    )

    if resp.status_code != 200:
        print(f"ERREUR {resp.status_code}: {resp.text[:500]}", file=sys.stderr)
        sys.exit(1)

    data = resp.json()
    choice = data['choices'][0]
    msg = choice['message']
    out = msg.get('content') or msg.get('reasoning') or ''
    finish = choice.get('finish_reason', '?')
    tin = data.get('usage', {}).get('prompt_tokens', 0)
    tout = data.get('usage', {}).get('completion_tokens', 0)
    cost = (tin * 0.60 + tout * 3.00) / 1_000_000
    print(f"finish_reason: {finish} | {tin}in + {tout}out = ${cost:.4f}", flush=True)
    print(f"Longueur reponse: {len(out)} chars", flush=True)
    return out


def main():
    parser = argparse.ArgumentParser(description='Ideation narrative scene SVG via Kimi K2.5 (multimodal)')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--prompt', help='Prompt complet en ligne de commande')
    group.add_argument('--prompt-file', help='Fichier texte contenant le prompt')
    parser.add_argument('--image', action='append', default=[], help='Image de reference (repetable)')
    parser.add_argument('--output', help='Sauvegarder la reponse dans ce fichier')
    parser.add_argument('--max-tokens', type=int, default=8000)
    args = parser.parse_args()

    if args.prompt:
        user_prompt = args.prompt
    else:
        with open(args.prompt_file, encoding='utf-8') as f:
            user_prompt = f.read()

    content = call_kimi(user_prompt, args.image, max_tokens=args.max_tokens)

    print(f"\n{'='*80}\n")
    print(content)
    print(f"\n{'='*80}\n")

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Sauvegarde: {args.output}")


if __name__ == '__main__':
    main()
