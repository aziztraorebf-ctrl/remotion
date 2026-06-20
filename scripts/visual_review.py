#!/usr/bin/env python3
"""
Visual Review — Routeur multi-modèles pour review render Souverain / GéoAfrique
Remplace: review_with_kimi.py

Usage:
  python3 scripts/visual_review.py <video_ou_image> [options]

Options:
  --model kimi      Kimi K2.5 via Moonshot — feedback narratif DA (défaut)
  --model qwen      Qwen3 VL 235B via OpenRouter — audit JSON générique
  --model gemini    Gemini 3.1-pro-preview — review beat Souverain avec code_values (RECOMMANDÉ)
  --storyboard PATH Image storyboard de référence (optionnel, utilisé avec --model gemini)
  --frames N        Nombre de frames à extraire (défaut: 5)
  --offset FLOAT    Règle +30% : offset relatif dans chaque segment (défaut: 0.3)
  --output FILE     Sauvegarder le résultat dans un fichier
  --prompt TEXT     Override du prompt (tous modèles)

Modèles et cas d'usage:
  gemini  Review beat complet avec storyboard — retourne JSON actionnable (code_values, r1_violations)
  kimi    Feedback narratif prose — jugement DA créatif
  qwen    Audit JSON générique — sans storyboard de référence

Exemples:
  python3 scripts/visual_review.py out/episodes/ss/beat5_v3.mp4 --model gemini --storyboard public/souverain/silicon-savannah/beat5/storyboard-gemini.png
  python3 scripts/visual_review.py out/episodes/ss/beat4-FINAL.mp4 --model kimi
  python3 scripts/visual_review.py assets/bg.png --model qwen --output review.json
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

# ─── Clés API ───────────────────────────────────────────────────────────────
MOONSHOT_API_KEY  = os.getenv('MOONSHOT_API_KEY')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
GEMINI_API_KEY    = os.getenv('GEMINI_API_KEY')

MOONSHOT_URL   = 'https://api.moonshot.ai/v1/chat/completions'
OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
GEMINI_URL     = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent'

QWEN_MODEL = 'qwen/qwen3-vl-235b-a22b-thinking'
KIMI_MODEL = 'kimi-k2.5'

# ─── Prompts ─────────────────────────────────────────────────────────────────

GEMINI_BEAT_REVIEW_PROMPT = """Tu es directeur artistique senior pour la série "Souverain" par GéoAfrique (YouTube Shorts, 1080×1920, 30fps).

Palette locked : navy #112240, gold #c8a951, ivory #f0e8d8.
Police titres : Bebas Neue condensé. Police stats : monospace.
Règle R1 : aucun segment > 8s sans changement visuel (permanent motion comme glow/flottement ne compte PAS).

{storyboard_instruction}

Compare chaque frame rendu avec le storyboard correspondant si fourni.
Identifie les écarts visuels concrets avec les valeurs exactes pour corriger.

Retourne UNIQUEMENT du JSON brut — pas de markdown, pas de texte autour, pas de blocs ```. JSON direct.

{{
  "score": 7.5,
  "verdict": "APPROVE|NEEDS_WORK|REBUILD",
  "r1_violations": [
    {{"segment": "Phase A", "static_duration_s": 10.5, "fix": "subdiviser — ajouter count-up ou ping ring"}}
  ],
  "phase_a": {{
    "status": "ok|partial|fail",
    "match_pct": 70,
    "comment": "description concise",
    "fixes": [
      {{
        "priority": "critical|major|minor",
        "element": "nom exact composant React",
        "problem": "description précise du problème visuel",
        "code_values": {{
          "fontSize": 220,
          "color": "#c8a951",
          "strokeWidth": 16,
          "opacity": 0.8,
          "filter": "drop-shadow(0px 0px 20px rgba(200,169,81,0.8))",
          "note": "toute valeur CSS/SVG concrète nécessaire pour corriger"
        }}
      }}
    ]
  }},
  "phase_b": {{
    "status": "ok|partial|fail",
    "match_pct": 60,
    "comment": "...",
    "fixes": []
  }},
  "phase_c": {{
    "status": "ok|partial|fail",
    "match_pct": 65,
    "comment": "...",
    "fixes": []
  }},
  "strengths": ["point fort 1", "point fort 2"],
  "overall_comment": "synthèse 1-2 phrases"
}}"""

QWEN_JSON_PROMPT = """Tu es expert en production de Shorts YouTube verticaux (1080x1920) pour la série "Souverain" par GéoAfrique — data journalism africain premium.

Analyse les frames fournies et retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après.

PALETTE LOCKED : navy #112240, gold #c8a951, ivory #f0e8d8. Bebas Neue pour les titres, monospace pour les stats.
RÈGLES PRODUCTION : max 8s sans changement visible, micro-motion permanent (glow, flottement, Ken Burns), spring physics, zéro particules/fumée/3D.

JSON attendu :
{
  "score": 8.5,
  "verdict": "APPROVE|NEEDS_WORK|REBUILD",
  "scroll_hook": "fail|pass",
  "scroll_hook_reason": "le premier frame accroche-t-il en 0.8s ?",
  "hierarchy": "ok|fail",
  "hierarchy_reason": "1 phrase",
  "background": "ok|fail",
  "background_reason": "1 phrase",
  "motion_rule": "ok|fail",
  "motion_rule_reason": "max 8s sans changement — respecté ou non ?",
  "palette_compliance": "ok|fail",
  "palette_issues": ["couleurs hors-palette détectées"],
  "fixes": [
    {"priority": "critical|major|minor", "element": "nom", "problem": "...", "fix": "correction actionnable"}
  ],
  "strengths": ["point fort 1"],
  "idea": "1 idée d'amélioration dans nos contraintes"
}"""

KIMI_NARRATIVE_PROMPT = """Evaluate this Short YouTube vertical video (1080x1920) for the "Souverain" series by GéoAfrique — African data journalism.

Assess:
1. SCROLL HOOK: Does the first frame stop the scroll in 0.8s on mobile?
2. VISUAL HIERARCHY: Are the key data points immediately readable?
3. MOTION QUALITY: Permanent micro-motion? Max 8s without visible change?
4. PALETTE: navy #112240, gold #c8a951, ivory #f0e8d8 respected?
5. EMOTIONAL IMPACT: Does the animation reinforce the narrative message?
6. LAYOUT: Elements within safe zones? Nothing cropped?

Provide:
- VERDICT: Score /10 with one-line reasoning
- CRITICAL FIXES: Max 3, priority-ordered, concrete and actionable
- STRENGTHS: What works, keep it
- ONE IDEA: Something premium we haven't tried yet, within our constraints (no particles, no 3D, no realistic photos)"""


# ─── Utilitaires ─────────────────────────────────────────────────────────────

def encode_b64(filepath: str) -> str:
    return base64.b64encode(Path(filepath).read_bytes()).decode()


def get_mime(filepath: str) -> str:
    ext = Path(filepath).suffix.lower()
    return {'mp4': 'video/mp4', 'mov': 'video/mp4', 'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}.get(ext, 'image/jpeg')


def extract_frames(video_path: str, n_frames: int = 5, offset: float = 0.3) -> list[Path]:
    """
    Extrait n frames selon la règle +offset% (défaut +30%).
    offset=0.3 signifie : frame_i = segment_start + 30% de la durée du segment.
    Pour une extraction uniforme sur toute la vidéo, distribue les points à +offset dans chaque tranche.
    Scale : 243px de largeur (token-efficient).
    """
    result = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-select_streams', 'v:0',
         '-show_entries', 'stream=nb_frames', '-of', 'csv=p=0', video_path],
        capture_output=True, text=True
    )
    try:
        total = int(result.stdout.strip().replace(',', ''))
    except Exception:
        total = 300

    # Divise en n_frames segments égaux, extrait à offset% dans chaque segment
    segment_size = total / n_frames
    frame_indices = [int(segment_size * i + segment_size * offset) for i in range(n_frames)]
    frame_indices = [min(f, total - 1) for f in frame_indices]

    select = '+'.join(f'eq(n,{f})' for f in frame_indices)
    tmp_dir = tempfile.mkdtemp()
    subprocess.run([
        'ffmpeg', '-y', '-i', video_path,
        '-vf', f"select='{select}',scale=243:432,setpts=N/TB",
        '-vsync', 'vfr', f'{tmp_dir}/frame_%02d.jpg'
    ], capture_output=True)

    frames = sorted(Path(tmp_dir).glob('frame_*.jpg'))
    print(f"Frames extraites ({n_frames} × +{int(offset*100)}%) : indices {frame_indices}")
    return frames


def build_openai_content(filepath: str, prompt: str, n_frames: int, offset: float) -> list:
    """Construit le content array pour APIs OpenAI-compatible (Kimi, Qwen)."""
    ext = Path(filepath).suffix.lower()
    images = []
    if ext in ['.mp4', '.mov', '.avi', '.webm']:
        for fp in extract_frames(filepath, n_frames, offset):
            images.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encode_b64(fp)}"}})
    else:
        images.append({"type": "image_url", "image_url": {"url": f"data:{get_mime(filepath)};base64,{encode_b64(filepath)}"}})
    return [{"type": "text", "text": prompt}] + images


# ─── Review Gemini ───────────────────────────────────────────────────────────

def review_gemini(filepath: str, storyboard_path: str | None, prompt_override: str | None,
                  n_frames: int, offset: float) -> dict | None:
    """
    Gemini 3.1-pro-preview — review beat Souverain avec code_values.
    Retourne JSON actionnable. responseMimeType=application/json force JSON propre, jamais tronqué.
    """
    if not GEMINI_API_KEY:
        print("Erreur : GEMINI_API_KEY absent du .env")
        return None

    storyboard_instruction = (
        "Le PREMIER bloc image est le STORYBOARD DE RÉFÉRENCE. "
        "Les images suivantes sont les frames du rendu. Compare chaque phase rendu vs storyboard."
        if storyboard_path else
        "Aucun storyboard fourni — évaluer les frames sur les critères Souverain uniquement."
    )

    prompt = prompt_override or GEMINI_BEAT_REVIEW_PROMPT.format(
        storyboard_instruction=storyboard_instruction
    )

    parts = []

    if storyboard_path:
        parts.append({"inline_data": {"mime_type": get_mime(storyboard_path), "data": encode_b64(storyboard_path)}})
        parts.append({"text": "=== STORYBOARD DE RÉFÉRENCE ==="})

    ext = Path(filepath).suffix.lower()
    if ext in ['.mp4', '.mov', '.avi', '.webm']:
        frames = extract_frames(filepath, n_frames, offset)
        for i, fp in enumerate(frames, 1):
            parts.append({"inline_data": {"mime_type": "image/jpeg", "data": encode_b64(fp)}})
            parts.append({"text": f"=== FRAME RENDU {i}/{len(frames)} ==="})
    else:
        parts.append({"inline_data": {"mime_type": get_mime(filepath), "data": encode_b64(filepath)}})

    parts.append({"text": prompt})

    url = f"{GEMINI_URL}?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json"
            # Pas de maxOutputTokens — Gemini gère la longueur, jamais tronqué
        }
    }

    print("Envoi à Gemini 3.1-pro-preview...")
    try:
        resp = requests.post(url, json=payload, timeout=120)
        resp.raise_for_status()

        resp_json = resp.json()
        candidates = resp_json.get("candidates", [])
        if not candidates:
            print(f"Gemini: aucun candidat retourné. Réponse brute : {str(resp_json)[:400]}")
            return None

        content = candidates[0].get("content", {})
        # content peut être un dict {"parts": [...]} ou directement une liste (edge case)
        if isinstance(content, list):
            parts_list = content
        elif isinstance(content, dict):
            parts_list = content.get("parts", [])
        else:
            print(f"Gemini: structure content inattendue : {type(content)} — {str(content)[:200]}")
            return None

        if not parts_list:
            print("Gemini: parts vides dans la réponse")
            return None

        raw = parts_list[0].get("text", "") if isinstance(parts_list[0], dict) else str(parts_list[0])

        try:
            parsed = json.loads(raw)
            # Gemini renvoie parfois un TABLEAU [{...}] au lieu d'un objet {...}.
            # (bug constaté 2026-06-20 : score restait '?' car parsed.get() sur une liste echoue.)
            obj = parsed[0] if isinstance(parsed, list) and parsed else parsed
            obj = obj if isinstance(obj, dict) else {}
            score = obj.get('score', '?')
            verdict = obj.get('verdict', '?')
            r1_raw = obj.get('r1_violations', [])
            # r1_violations peut être une liste de dicts ou de strings selon Gemini
            r1 = []
            for v in r1_raw:
                if isinstance(v, dict):
                    r1.append(v)
                elif isinstance(v, str):
                    r1.append({'segment': v, 'static_duration_s': '?', 'fix': ''})
            # SIGNAL STABLE : moyenne des match_pct par phase. Le score GLOBAL Gemini est
            # BRUITÉ (non monotone : il peut baisser quand le render s'ameliore). Le gate
            # de la boucle review doit s'appuyer sur phase_match_avg, PAS sur score seul.
            # (leçon cobaye 2026-06-20.)
            phase_pcts = [obj[k].get('match_pct') for k in obj
                          if k.startswith('phase_') and isinstance(obj.get(k), dict)
                          and isinstance(obj[k].get('match_pct'), (int, float))]
            phase_match_avg = round(sum(phase_pcts) / len(phase_pcts), 1) if phase_pcts else None
        except (json.JSONDecodeError, TypeError, KeyError):
            parsed = None
            score = '?'
            verdict = '?'
            r1 = []
            phase_match_avg = None

        print(f"\n{'='*80}")
        print(f"GEMINI 3.1-PRO — BEAT REVIEW (JSON actionnable)")
        print(f"Score global (BRUITÉ, indicatif): {score}/10 — {verdict}")
        if phase_match_avg is not None:
            print(f"Phase match avg (SIGNAL STABLE pour le gate): {phase_match_avg}% "
                  f"— gate boucle review : viser >= 80% par phase, PAS le score global.")
        if r1:
            print(f"R1 violations: {len(r1)}")
            for v in r1:
                print(f"  - {v.get('segment', '?')} : {v.get('static_duration_s', '?')}s statique → {v.get('fix', '')}")
        print(f"{'='*80}\n")
        print(json.dumps(parsed, ensure_ascii=False, indent=2) if parsed else raw)
        print(f"\n{'='*80}\n")

        return {'text': raw, 'parsed': parsed, 'score': score, 'verdict': verdict,
                'phase_match_avg': phase_match_avg,
                'r1_violations': r1, 'provider': 'gemini-3.1-pro-preview'}

    except requests.HTTPError as e:
        print(f"Gemini HTTP error {e.response.status_code}: {e.response.text[:400]}")
        return None
    except Exception as e:
        print(f"Gemini request failed: {e}")
        return None


# ─── Review Kimi ─────────────────────────────────────────────────────────────

def review_kimi(filepath: str, prompt: str, n_frames: int, offset: float) -> dict | None:
    if not MOONSHOT_API_KEY:
        print("Erreur : MOONSHOT_API_KEY absent du .env")
        return None

    content = build_openai_content(filepath, prompt, n_frames, offset)
    print("Envoi à Kimi K2.5 (Moonshot)...")
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
        tokens_in  = result['usage']['prompt_tokens']
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


# ─── Review Qwen ─────────────────────────────────────────────────────────────

def review_qwen(filepath: str, prompt: str, n_frames: int, offset: float) -> dict | None:
    if not OPENROUTER_API_KEY:
        print("Erreur : OPENROUTER_API_KEY absent du .env")
        return None

    content = build_openai_content(filepath, prompt, n_frames, offset)
    print("Envoi à Qwen3 VL 235B (OpenRouter)...")
    try:
        resp = requests.post(
            OPENROUTER_URL,
            headers={'Authorization': f'Bearer {OPENROUTER_API_KEY}', 'Content-Type': 'application/json',
                     'HTTP-Referer': 'https://geoafrique.com', 'X-Title': 'GeoAfrique Souverain'},
            json={'model': QWEN_MODEL, 'messages': [{'role': 'user', 'content': content}],
                  'max_tokens': 2000},
            timeout=180
        )
        if resp.status_code != 200:
            print(f"Qwen error {resp.status_code}: {resp.text[:300]}")
            return None

        result  = resp.json()
        msg     = result['choices'][0]['message']
        tokens_in  = result.get('usage', {}).get('prompt_tokens', 0)
        tokens_out = result.get('usage', {}).get('completion_tokens', 0)
        cost = (tokens_in * 0.40 + tokens_out * 1.20) / 1_000_000
        raw = msg.get('content', '')

        clean = raw.strip()
        for marker in ['```json', '```']:
            if marker in clean:
                clean = clean.split(marker)[1].split('```')[0].strip()
                break

        try:
            parsed    = json.loads(clean)
            formatted = json.dumps(parsed, ensure_ascii=False, indent=2)
            score     = parsed.get('score', '?')
            verdict   = parsed.get('verdict', '?')
        except Exception:
            formatted = raw
            score = verdict = '?'

        print(f"\n{'='*80}")
        print(f"QWEN3 VL 235B — STRUCTURED AUDIT")
        print(f"Score: {score}/10 — {verdict}")
        print(f"Tokens: {tokens_in} in + {tokens_out} out = ${cost:.4f}")
        print(f"{'='*80}\n")
        print(formatted)
        print(f"\n{'='*80}\n")
        return {'text': formatted, 'tokens_in': tokens_in, 'tokens_out': tokens_out,
                'cost': cost, 'provider': 'qwen3-openrouter'}
    except Exception as e:
        print(f"Qwen request failed: {e}")
        return None


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='Visual Review — Gemini / Kimi / Qwen pour renders Souverain',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  # Review beat avec storyboard (RECOMMANDÉ pour sessions autonomes)
  python3 scripts/visual_review.py out/episodes/ss/beat5_v3.mp4 \\
    --model gemini \\
    --storyboard public/souverain/silicon-savannah/beat5/storyboard-gemini.png

  # Review narrative DA
  python3 scripts/visual_review.py out/episodes/ss/beat4-FINAL.mp4 --model kimi

  # Audit JSON générique
  python3 scripts/visual_review.py assets/bg.png --model qwen --output review.json

  # Review avec frames personnalisées (règle +40% au lieu de +30%)
  python3 scripts/visual_review.py beat5_v3.mp4 --model gemini --frames 3 --offset 0.4
        """
    )
    parser.add_argument('file', help='Vidéo ou image à reviewer')
    parser.add_argument('--model', choices=['gemini', 'kimi', 'qwen'], default='kimi',
                        help='Modèle reviewer (défaut: kimi)')
    parser.add_argument('--storyboard', help='Image storyboard de référence (--model gemini)')
    parser.add_argument('--frames', type=int, default=5,
                        help='Frames à extraire depuis la vidéo (défaut: 5)')
    parser.add_argument('--offset', type=float, default=0.3,
                        help='Règle +X%% dans chaque segment (défaut: 0.3 = +30%%)')
    parser.add_argument('--prompt', help='Override du prompt')
    parser.add_argument('--output', help='Sauvegarder le résultat dans un fichier')

    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Erreur : fichier introuvable : {args.file}")
        sys.exit(1)

    if args.storyboard and not os.path.exists(args.storyboard):
        print(f"Erreur : storyboard introuvable : {args.storyboard}")
        sys.exit(1)

    result = None

    if args.model == 'gemini':
        result = review_gemini(args.file, args.storyboard, args.prompt, args.frames, args.offset)
    elif args.model == 'qwen':
        prompt = args.prompt or QWEN_JSON_PROMPT
        result = review_qwen(args.file, prompt, args.frames, args.offset)
    else:
        prompt = args.prompt or KIMI_NARRATIVE_PROMPT
        result = review_kimi(args.file, prompt, args.frames, args.offset)

    if result is None:
        print("Review échouée. Vérifier les clés API dans .env")
        sys.exit(1)

    if args.output:
        with open(args.output, 'w') as f:
            json.dump({
                'file': args.file,
                'model': args.model,
                'storyboard': args.storyboard,
                'provider': result.get('provider'),
                'score': result.get('score'),
                'verdict': result.get('verdict'),
                'phase_match_avg': result.get('phase_match_avg'),
                'r1_violations': result.get('r1_violations', []),
                'review': result.get('parsed') or result.get('text'),
            }, f, ensure_ascii=False, indent=2)
        print(f"Review sauvegardée → {args.output}")


if __name__ == '__main__':
    main()
