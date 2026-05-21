#!/usr/bin/env python3
"""
Visual Reviewer — Kimi K2.5 (Moonshot) + Qwen3 VL 235B (OpenRouter)
Usage:
  python3 scripts/review_with_kimi.py <file> [options]

Options:
  --model kimi      Kimi K2.5 via Moonshot (default, narration/creative DA)
  --model qwen      Qwen3 VL 235B via OpenRouter (structured JSON audit, Gemini-style)
  --prompt TEXT     Custom prompt override
  --output FILE     Save review to file
  --frames N        Number of frames to extract from video (default: 5)
"""

import os
import sys
import base64
import json
import argparse
import subprocess
import tempfile
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv()

MOONSHOT_API_KEY = os.getenv('MOONSHOT_API_KEY')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
MOONSHOT_URL = 'https://api.moonshot.ai/v1/chat/completions'
OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

QWEN_MODEL = 'qwen/qwen3-vl-235b-a22b-thinking'
KIMI_MODEL = 'kimi-k2.5'

SOUVERAIN_JSON_PROMPT = """Tu es expert en production de Shorts YouTube verticaux (1080x1920) pour la série "Souverain" par GéoAfrique — data journalism africain premium.

Analyse les frames fournies et retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après.

PALETTE LOCKED : navy #141c2e, gold #c8a951, ivory #f0e8d8. Bebas Neue pour les titres, monospace pour les stats.
RÈGLES PRODUCTION : max 8s sans changement visible, micro-motion permanent (glow, flottement, Ken Burns), spring physics, zéro particules/fumée/3D.

Réponds UNIQUEMENT avec ce JSON :
{
  "score": 8.5,
  "verdict": "APPROVE|NEEDS_WORK|REBUILD",
  "scroll_hook": "fail|pass",
  "scroll_hook_reason": "explication 1 phrase — le premier frame accroche-t-il en 0.8s ?",
  "hierarchy": "ok|fail",
  "hierarchy_reason": "explication 1 phrase",
  "background": "ok|fail",
  "background_reason": "explication 1 phrase",
  "motion_rule": "ok|fail",
  "motion_rule_reason": "max 8s sans changement — respecté ou non ?",
  "palette_compliance": "ok|fail",
  "palette_issues": ["liste des couleurs hors-palette détectées"],
  "fixes": [
    {"priority": "critical|major|minor", "element": "nom élément", "problem": "problème observé", "fix": "correction concrète et actionnable"}
  ],
  "strengths": ["point fort 1", "point fort 2"],
  "idea": "1 idée d'amélioration dans nos contraintes (pas de 3D, pas de particules, pas de photos réalistes)"
}"""

KIMI_NARRATIVE_PROMPT = """Evaluate this Short YouTube vertical video (1080x1920) for the "Souverain" series by GéoAfrique — African data journalism.

Assess:
1. SCROLL HOOK: Does the first frame stop the scroll in 0.8s on mobile?
2. VISUAL HIERARCHY: Are the key data points immediately readable?
3. MOTION QUALITY: Permanent micro-motion? Max 8s without visible change?
4. PALETTE: navy #141c2e, gold #c8a951, ivory #f0e8d8 respected?
5. EMOTIONAL IMPACT: Does the animation reinforce the narrative message?
6. LAYOUT: Elements within safe zones? Nothing cropped?

Provide:
- VERDICT: Score /10 with one-line reasoning
- CRITICAL FIXES: Max 3, priority-ordered, concrete and actionable
- STRENGTHS: What works, keep it
- ONE IDEA: Something premium we haven't tried yet, within our constraints (no particles, no 3D, no realistic photos)"""


def encode_image(filepath):
    with open(filepath, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def get_media_type(filepath):
    ext = Path(filepath).suffix.lower()
    if ext in ['.mp4', '.mov', '.avi', '.webm']:
        return 'video/mp4'
    elif ext in ['.jpg', '.jpeg']:
        return 'image/jpeg'
    elif ext in ['.png']:
        return 'image/png'
    elif ext in ['.webp']:
        return 'image/webp'
    return 'image/jpeg'


def extract_frames(video_path, n_frames=5):
    """Extract n evenly-spaced frames from video at 243px width for token efficiency."""
    result = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-select_streams', 'v:0',
         '-show_entries', 'stream=nb_frames', '-of', 'csv=p=0', video_path],
        capture_output=True, text=True
    )
    try:
        total = int(result.stdout.strip().replace(',', ''))
    except Exception:
        total = 300

    frame_indices = [int(total * i / n_frames) for i in range(n_frames)]
    select = '+'.join(f'eq(n,{f})' for f in frame_indices)

    tmp_dir = tempfile.mkdtemp()
    subprocess.run([
        'ffmpeg', '-y', '-i', video_path,
        '-vf', f"select='{select}',scale=243:432,setpts=N/TB",
        '-vsync', 'vfr', f'{tmp_dir}/frame_%02d.jpg'
    ], capture_output=True)

    frames = sorted(Path(tmp_dir).glob('frame_*.jpg'))
    print(f"Extracted {len(frames)} frames from {video_path}")
    return frames


def build_content(filepath, prompt, n_frames=5):
    """Build message content — handles images directly, extracts frames from video."""
    ext = Path(filepath).suffix.lower()
    images = []

    if ext in ['.mp4', '.mov', '.avi', '.webm']:
        frame_paths = extract_frames(filepath, n_frames)
        for fp in frame_paths:
            images.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{encode_image(fp)}"}
            })
    else:
        images.append({
            "type": "image_url",
            "image_url": {"url": f"data:{get_media_type(filepath)};base64,{encode_image(filepath)}"}
        })

    return [{"type": "text", "text": prompt}] + images


def send_to_kimi(content, filepath):
    """Kimi K2.5 via Moonshot — narrative/creative DA mode."""
    if not MOONSHOT_API_KEY:
        print("No MOONSHOT_API_KEY — skipping Kimi")
        return None

    print("Sending to Kimi K2.5 (Moonshot)...")
    try:
        resp = requests.post(
            MOONSHOT_URL,
            headers={'Authorization': f'Bearer {MOONSHOT_API_KEY}', 'Content-Type': 'application/json'},
            json={'model': KIMI_MODEL, 'messages': [{'role': 'user', 'content': content}],
                  'max_tokens': 2000, 'temperature': 1},
            timeout=120
        )
        if resp.status_code != 200:
            print(f"Kimi error {resp.status_code}: {resp.text[:300]}")
            return None

        result = resp.json()
        tokens_in = result['usage']['prompt_tokens']
        tokens_out = result['usage']['completion_tokens']
        cost = (tokens_in * 0.60 + tokens_out * 3.00) / 1_000_000
        text = result['choices'][0]['message']['content']

        print(f"\n{'='*80}")
        print(f"KIMI K2.5 — NARRATIVE REVIEW")
        print(f"Tokens: {tokens_in} in + {tokens_out} out = ${cost:.4f}")
        print(f"{'='*80}\n")
        print(text)
        print(f"\n{'='*80}\n")
        return {'text': text, 'tokens_in': tokens_in, 'tokens_out': tokens_out,
                'cost': cost, 'provider': 'kimi-moonshot'}
    except Exception as e:
        print(f"Kimi request failed: {e}")
        return None


def send_to_qwen(content, filepath):
    """Qwen3 VL 235B via OpenRouter — structured JSON audit mode (Gemini-style)."""
    if not OPENROUTER_API_KEY:
        print("No OPENROUTER_API_KEY — skipping Qwen")
        return None

    print("Sending to Qwen3 VL 235B (OpenRouter)...")
    try:
        resp = requests.post(
            OPENROUTER_URL,
            headers={
                'Authorization': f'Bearer {OPENROUTER_API_KEY}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://geoafrique.com',
                'X-Title': 'GeoAfrique Souverain'
            },
            json={'model': QWEN_MODEL, 'messages': [{'role': 'user', 'content': content}],
                  'max_tokens': 2000},
            timeout=180
        )
        if resp.status_code != 200:
            print(f"Qwen error {resp.status_code}: {resp.text[:300]}")
            return None

        result = resp.json()
        msg = result['choices'][0]['message']
        tokens_in = result.get('usage', {}).get('prompt_tokens', 0)
        tokens_out = result.get('usage', {}).get('completion_tokens', 0)
        # Qwen3 235B pricing via OpenRouter: ~$0.40/$1.20 per M tokens
        cost = (tokens_in * 0.40 + tokens_out * 1.20) / 1_000_000

        raw = msg.get('content', '')
        thinking = msg.get('reasoning_content', '')

        # Parse JSON
        clean = raw.strip()
        if '```json' in clean:
            clean = clean.split('```json')[1].split('```')[0].strip()
        elif '```' in clean:
            clean = clean.split('```')[1].split('```')[0].strip()

        try:
            parsed = json.loads(clean)
            formatted = json.dumps(parsed, ensure_ascii=False, indent=2)
            score = parsed.get('score', '?')
            verdict = parsed.get('verdict', '?')
        except Exception:
            formatted = raw
            score = '?'
            verdict = '?'

        print(f"\n{'='*80}")
        print(f"QWEN3 VL 235B — STRUCTURED AUDIT (JSON)")
        print(f"Score: {score}/10 — {verdict}")
        print(f"Tokens: {tokens_in} in + {tokens_out} out = ${cost:.4f}")
        print(f"{'='*80}\n")
        if thinking:
            print(f"[THINKING — {len(thinking)} chars]\n")
        print(formatted)
        print(f"\n{'='*80}\n")

        return {'text': formatted, 'parsed': parsed if 'parsed' in dir() else None,
                'tokens_in': tokens_in, 'tokens_out': tokens_out,
                'cost': cost, 'provider': 'qwen3-openrouter'}
    except Exception as e:
        print(f"Qwen request failed: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(
        description='Visual review — Kimi K2.5 (narrative) or Qwen3 VL 235B (JSON audit)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Models:
  kimi   Kimi K2.5 via Moonshot — narrative DA feedback (default)
  qwen   Qwen3 VL 235B via OpenRouter — structured JSON audit, Gemini-style

Examples:
  python3 scripts/review_with_kimi.py out/episodes/ss/beat3-FINAL.mp4
  python3 scripts/review_with_kimi.py out/episodes/ss/beat4_v1.mp4 --model qwen
  python3 scripts/review_with_kimi.py assets/bg.png --model qwen --output review.json
        """
    )
    parser.add_argument('file', help='Video or image file to review')
    parser.add_argument('--model', choices=['kimi', 'qwen'], default='kimi',
                        help='Reviewer model (default: kimi)')
    parser.add_argument('--prompt', help='Custom prompt override')
    parser.add_argument('--output', help='Save review to file')
    parser.add_argument('--frames', type=int, default=5,
                        help='Frames to extract from video (default: 5)')

    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: File not found: {args.file}")
        sys.exit(1)

    if args.model == 'qwen':
        prompt = args.prompt or SOUVERAIN_JSON_PROMPT
        content = build_content(args.file, prompt, args.frames)
        result = send_to_qwen(content, args.file)
    else:
        prompt = args.prompt or KIMI_NARRATIVE_PROMPT
        content = build_content(args.file, prompt, args.frames)
        result = send_to_kimi(content, args.file)
        if result is None and OPENROUTER_API_KEY:
            print("Falling back to Kimi via OpenRouter...")
            resp = requests.post(
                OPENROUTER_URL,
                headers={'Authorization': f'Bearer {OPENROUTER_API_KEY}',
                         'Content-Type': 'application/json',
                         'HTTP-Referer': 'https://geoafrique.com'},
                json={'model': KIMI_MODEL, 'messages': [{'role': 'user', 'content': content}],
                      'max_tokens': 2000, 'temperature': 1},
                timeout=120
            )
            if resp.status_code == 200:
                r = resp.json()
                text = r['choices'][0]['message']['content']
                tokens_in = r.get('usage', {}).get('prompt_tokens', 0)
                tokens_out = r.get('usage', {}).get('completion_tokens', 0)
                cost = (tokens_in * 0.60 + tokens_out * 3.00) / 1_000_000
                print(f"\n{'='*80}\nKIMI K2.5 (OpenRouter fallback)\n${cost:.4f}\n{'='*80}\n")
                print(text)
                result = {'text': text, 'tokens_in': tokens_in,
                          'tokens_out': tokens_out, 'cost': cost,
                          'provider': 'kimi-openrouter'}

    if result is None:
        print("All reviewers failed. Check API keys.")
        sys.exit(1)

    if args.output:
        with open(args.output, 'w') as f:
            f.write(f"File: {args.file}\n")
            f.write(f"Model: {args.model}\n")
            f.write(f"Provider: {result['provider']}\n")
            f.write(f"Tokens: {result['tokens_in']} in + {result['tokens_out']} out = ${result['cost']:.4f}\n\n")
            f.write(result['text'])
        print(f"Review saved to {args.output}")


if __name__ == '__main__':
    main()
