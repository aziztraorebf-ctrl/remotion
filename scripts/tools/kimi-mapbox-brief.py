#!/usr/bin/env python3
"""
Kimi K2.5 — Brief Mapbox camera + overlays pour épisodes Souverain.

Usage:
  python3 scripts/tools/kimi-mapbox-brief.py --prompt "votre prompt complet" [--output fichier.md]
  python3 scripts/tools/kimi-mapbox-brief.py --prompt-file /tmp/mon-brief.txt [--output fichier.md]

NOTES TECHNIQUES (validées 2026-05-31) :
  - Moonshot direct API : content=null bug (mode thinking only). NE PAS UTILISER.
  - OpenRouter moonshotai/kimi-k2.5 : finish_reason=stop, contenu complet. TOUJOURS utiliser.
  - max_tokens=3000 optimal (assez pour 2-3 beats détaillés). Splitter si >3 beats.
  - temperature=1 obligatoire (seule valeur acceptée par Kimi).
  - Fallback reasoning si content est null (bug Venice provider sur certains appels).
"""

import os
import sys
import argparse
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
KIMI_MODEL = 'moonshotai/kimi-k2.5'

MAPBOX_CONTEXT = """RÈGLES MAPBOX HEADLESS (non-négociables) :
- Mouvements : jumpTo UNIQUEMENT dans useCurrentFrame Remotion. JAMAIS flyTo/easeTo.
- Projection Mercator obligatoire.
- Style carte : dark-v11 + GéoAfrique V5 (océan #1a3a5c, terres #4a4a4a, frontières blanches)
- Carte TOUJOURS plein écran. Texte en overlay CSS positionné absolument.
- R1 : max 8 secondes sans nouvel événement visuel.
- Pas le même mouvement deux fois dans un même épisode.

MOUVEMENTS DISPONIBLES (Camera Lab v2 validés headless) :
1. Drift Continu — pan lent frame-driven (~0.001°/frame), vitesse constante
2. Orbit+Dolly — rotation bearing 0→N° + zoom simultané autour d'un point fixe
3. Multi-Stop Whip Pan — jumpTo rapides 2-4 lieux, blur CSS 60 frames entre chaque
4. Zoom+Freeze — zoom in rapide vers zoom 14-16, freeze sur le lieu
5. Tilt+Pull Back — pitch 60→0 + zoom out simultané (révélation géographique)
6. Counter-Rotation — deux zones pivotent en sens opposés
7. Blur Atmo — blur CSS progressif, texte reste net
8. Pull Back Planétaire — zoom out continent entier
9. Zoom Sol 3D — satellite pitch 65° zoom 15+, vue drone industriel
10. Fade Style Switch — transition opacity entre deux styles Mapbox
11. Whip Pan+Style Switch — whip pan 60f blur + changement style à mi-blur
12. Zoom Out+Style+Zoom In — voyage entre deux réalités géographiques

OVERLAYS DISPONIBLES (tous validés headless) :
A. Fill-color pays — colorier territoire entier via fill-color Mapbox (pas fill-pattern)
B. SVG overlay React — halos, lignes, triangles en coordonnées écran absolues 1080x1920
C. Markers plaques DOM — navy rect (#0d1525) + barre gold (#c08820) + texte blanc IBM Plex Mono, spring pop
D. Line Dasharray animé — flux qui courent le long d'un tracé geo (stroke-dashoffset animation)

OVERLAYS INTERDITS (headless non supporté) :
- Fill-extrusion 3D — timeout headless
- Fill-pattern tuilé pour gradient — artefact répétition visible
- CSS transitions/keyframes — incompatible Remotion

PRINCIPES DIRECTORIAUX (style Caspian Report, pas TikTok) :
- Max 2-3 mouvements par beat, pas 6 (éviter l'épilepsie visuelle)
- Chaque transition doit être justifiée par la voix-off, pas juste "dynamisme"
- Les overlays racontent quelque chose, ils ne décorent pas
- Cohérence stylistique de bout en bout = même palette, même logique visuelle
"""


def call_kimi(prompt_text, max_tokens=3000):
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("ERREUR: OPENROUTER_API_KEY manquant dans .env", file=sys.stderr)
        sys.exit(1)

    print(f"Envoi à Kimi K2.5 (OpenRouter)... [{len(prompt_text)} chars prompt]", flush=True)

    resp = requests.post(
        OPENROUTER_URL,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://geoafrique.com',
            'X-Title': 'GeoAfrique Souverain'
        },
        json={
            'model': KIMI_MODEL,
            'messages': [{'role': 'user', 'content': prompt_text}],
            'max_tokens': max_tokens,
            'temperature': 1,
        },
        timeout=180
    )

    if resp.status_code != 200:
        print(f"ERREUR {resp.status_code}: {resp.text[:500]}", file=sys.stderr)
        sys.exit(1)

    data = resp.json()
    choice = data['choices'][0]
    msg = choice['message']

    # Fallback reasoning si content est null (bug Venice provider)
    content = msg.get('content') or msg.get('reasoning') or ''
    finish = choice.get('finish_reason', '?')
    tokens_in  = data.get('usage', {}).get('prompt_tokens', 0)
    tokens_out = data.get('usage', {}).get('completion_tokens', 0)
    cost = (tokens_in * 0.60 + tokens_out * 3.00) / 1_000_000

    print(f"finish_reason: {finish} | {tokens_in}in + {tokens_out}out = ${cost:.4f}", flush=True)
    print(f"Longueur réponse: {len(content)} chars", flush=True)

    if finish == 'length' and len(content) < 100:
        print("AVERTISSEMENT: réponse tronquée et vide. Réduire le prompt ou splitter en plusieurs appels.", file=sys.stderr)

    return content


def main():
    parser = argparse.ArgumentParser(description='Brief Kimi K2.5 pour plans caméra Mapbox Souverain')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--prompt', help='Prompt complet en ligne de commande')
    group.add_argument('--prompt-file', help='Fichier texte contenant le prompt')
    parser.add_argument('--output', help='Sauvegarder la réponse dans ce fichier')
    parser.add_argument('--max-tokens', type=int, default=3000, help='max_tokens (défaut: 3000)')
    parser.add_argument('--no-context', action='store_true', help='Ne pas injecter le contexte Mapbox automatiquement')
    args = parser.parse_args()

    if args.prompt:
        user_prompt = args.prompt
    else:
        with open(args.prompt_file, encoding='utf-8') as f:
            user_prompt = f.read()

    # Injecter contexte Mapbox sauf si --no-context
    if not args.no_context:
        full_prompt = MAPBOX_CONTEXT + "\n\n---\n\n" + user_prompt
    else:
        full_prompt = user_prompt

    content = call_kimi(full_prompt, max_tokens=args.max_tokens)

    print(f"\n{'='*80}\n")
    print(content)
    print(f"\n{'='*80}\n")

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Sauvegardé: {args.output}")


if __name__ == '__main__':
    main()
