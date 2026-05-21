#!/usr/bin/env python3
"""
Jury LLM 3 modeles — Pass Jour 3 templates Souverain.
Envoie le brief + 8 frames (URLs catbox) a Kimi K2.5, Gemini 2.5 Pro, GPT-5.
Sauvegarde chaque verdict dans memory/templates-research/jury-pass-jour3/
"""

import os, sys, json, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from dotenv import load_dotenv

load_dotenv()

MOONSHOT_API_KEY = os.getenv('MOONSHOT_API_KEY')
GEMINI_API_KEY   = os.getenv('GEMINI_API_KEY')
OPENAI_API_KEY   = os.getenv('OPENAI_API_KEY')

OUT_DIR = Path('memory/templates-research/jury-pass-jour3')
OUT_DIR.mkdir(parents=True, exist_ok=True)

BRIEF_PATH = OUT_DIR / 'brief.md'
BRIEF = BRIEF_PATH.read_text(encoding='utf-8')

# 8 frames hostees catbox
FRAMES = [
    ('01-smg-cream',     'https://files.catbox.moe/m64nbj.png'),
    ('02-smg-kraft',     'https://files.catbox.moe/kqrqd1.png'),
    ('03-kraftcard-opt1','https://files.catbox.moe/8w5m2p.png'),
    ('04-kraftcard-opt2','https://files.catbox.moe/5dzkt4.png'),
    ('05-kraftcard-opt3','https://files.catbox.moe/t9pcuh.png'),
    ('06-atlas3d-A',     'https://files.catbox.moe/q5289i.png'),
    ('07-atlas3d-B',     'https://files.catbox.moe/mawimd.png'),
    ('08-atlas3d-C',     'https://files.catbox.moe/7dmds0.png'),
]

# ============================================================
# Kimi K2.5 via Moonshot
# ============================================================
def call_kimi():
    if not MOONSHOT_API_KEY:
        return 'ERROR: MOONSHOT_API_KEY missing'
    import base64
    content = [{'type': 'text', 'text': BRIEF}]
    base = Path('out/templates-v2/jury-frames')
    paths = [
        '01-smg-cream-f140.png','02-smg-kraft-f140.png',
        '03-kraftcard-opt1-f80.png','04-kraftcard-opt2-f200.png','05-kraftcard-opt3-f320.png',
        '06-atlas3d-phaseA.png','07-atlas3d-phaseB.png','08-atlas3d-phaseC.png',
    ]
    for (name, _), p in zip(FRAMES, paths):
        with open(base / p, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode('utf-8')
        content.append({'type': 'text', 'text': f'\n--- Frame {name} ---'})
        content.append({'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}})
    payload = {
        'model': 'kimi-k2.5',
        'messages': [{'role': 'user', 'content': content}],
        'max_tokens': 4000,
    }
    r = requests.post(
        'https://api.moonshot.ai/v1/chat/completions',
        headers={'Authorization': f'Bearer {MOONSHOT_API_KEY}', 'Content-Type': 'application/json'},
        json=payload, timeout=180,
    )
    if r.status_code != 200:
        return f'ERROR Kimi {r.status_code}: {r.text[:500]}'
    return r.json()['choices'][0]['message']['content']

# ============================================================
# Gemini 2.5 Pro
# ============================================================
def call_gemini():
    """Gemini 2.5 Pro via OpenRouter (URLs catbox plus stable que base64 inline)."""
    if not os.getenv('OPENROUTER_API_KEY'):
        return 'ERROR: OPENROUTER_API_KEY missing'
    content = [{'type': 'text', 'text': BRIEF}]
    for name, url in FRAMES:
        content.append({'type': 'text', 'text': f'\n--- Frame {name} ---'})
        content.append({'type': 'image_url', 'image_url': {'url': url}})
    payload = {
        'model': 'google/gemini-2.5-pro',
        'messages': [{'role': 'user', 'content': content}],
        'temperature': 0.3,
        'max_tokens': 4000,
    }
    r = requests.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={'Authorization': f'Bearer {os.getenv("OPENROUTER_API_KEY")}', 'Content-Type': 'application/json'},
        json=payload, timeout=300,
    )
    if r.status_code != 200:
        return f'ERROR Gemini OR {r.status_code}: {r.text[:500]}'
    return r.json()['choices'][0]['message']['content']

# ============================================================
# GPT-4o via OpenAI (base64 inline car catbox timeout cote OAI)
# ============================================================
def call_gpt5():
    if not OPENAI_API_KEY:
        return 'ERROR: OPENAI_API_KEY missing'
    import base64
    content = [{'type': 'text', 'text': BRIEF}]
    # Charger frames depuis disque local
    base = Path('out/templates-v2/jury-frames')
    paths = [
        '01-smg-cream-f140.png','02-smg-kraft-f140.png',
        '03-kraftcard-opt1-f80.png','04-kraftcard-opt2-f200.png','05-kraftcard-opt3-f320.png',
        '06-atlas3d-phaseA.png','07-atlas3d-phaseB.png','08-atlas3d-phaseC.png',
    ]
    for (name, _), p in zip(FRAMES, paths):
        with open(base / p, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode('utf-8')
        content.append({'type': 'text', 'text': f'\n--- Frame {name} ---'})
        content.append({'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}})
    payload = {
        'model': 'gpt-4o',
        'messages': [{'role': 'user', 'content': content}],
        'max_tokens': 4000,
    }
    r = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'},
        json=payload, timeout=300,
    )
    if r.status_code != 200:
        return f'ERROR GPT-4o {r.status_code}: {r.text[:500]}'
    return r.json()['choices'][0]['message']['content']

# ============================================================
# Run en parallele
# ============================================================
def main():
    jurys = {
        'kimi-k25':      call_kimi,
        'gemini-25-pro': call_gemini,
        'gpt-5':         call_gpt5,
    }
    results = {}
    print(f'Brief len: {len(BRIEF)} chars, {len(FRAMES)} frames')
    print(f'Lancement {len(jurys)} jurys en parallele...\n')
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=3) as ex:
        futures = {ex.submit(fn): name for name, fn in jurys.items()}
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                results[name] = fut.result()
                print(f'[OK] {name} ({len(results[name])} chars)')
            except Exception as e:
                results[name] = f'EXCEPTION: {e}'
                print(f'[ERR] {name}: {e}')
    dt = time.time() - t0
    print(f'\nDuree totale: {dt:.1f}s\n')

    for name, text in results.items():
        out = OUT_DIR / f'verdict-{name}.md'
        out.write_text(f'# Verdict {name}\n\n{text}\n', encoding='utf-8')
        print(f'Sauvegarde: {out}')

if __name__ == '__main__':
    main()
