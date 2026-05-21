#!/usr/bin/env python3
"""
Jury LLM 3 modeles — Pass Jour 4 templates Souverain.
Kimi K2.6 (Moonshot, thinking model) + Gemini 3.1 Flash Lite (Google genai) + GPT-4o (OpenAI direct)
"""
import os, sys, json, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from dotenv import load_dotenv

load_dotenv()

MOONSHOT_API_KEY  = os.getenv('MOONSHOT_API_KEY')
OPENAI_API_KEY    = os.getenv('OPENAI_API_KEY')

OUT_DIR = Path('memory/templates-research/jury-pass-jour4')
OUT_DIR.mkdir(parents=True, exist_ok=True)

BRIEF = (OUT_DIR / 'brief.md').read_text(encoding='utf-8')

FRAMES = [
    ('A1-BrutalHeadline-noir',       'https://litter.catbox.moe/1kaked.png'),
    ('A2-DataCard-kraft',            'https://litter.catbox.moe/j1hqsy.png'),
    ('A3-DataCard-dark',             'https://litter.catbox.moe/jqwo57.png'),
    ('A4-BigStat',                   'https://litter.catbox.moe/sm61ij.png'),
    ('B1-NewsClipping-V1-jauni',     'https://litter.catbox.moe/xm5m57.png'),
    ('B2-DateBar-fullscreen',        'https://litter.catbox.moe/2l9uos.png'),
    ('B3-DateBar-bottom',            'https://litter.catbox.moe/xhr1yl.png'),
    ('V2A-NewsClipping-V2-creme',    'https://litter.catbox.moe/bxmpwd.png'),
    ('V2B-NewsClipping-V2-grain',    'https://litter.catbox.moe/dtuvbd.png'),
    ('V2C-BrutalHeadline-BW',        'https://litter.catbox.moe/5oh30j.png'),
    ('V2D-BrutalHeadline-illus',     'https://litter.catbox.moe/o5a1y1.png'),
    ('V2E-BrutalHeadline-drapeau',   'https://litter.catbox.moe/8qdhz2.png'),
]

def call_kimi():
    """Kimi K2.6 — thinking model : réponse dans reasoning_content (content peut être vide)."""
    if not MOONSHOT_API_KEY:
        return 'ERROR: MOONSHOT_API_KEY missing'
    import base64
    content = [{'type': 'text', 'text': BRIEF}]
    for name, url in FRAMES:
        r = requests.get(url, timeout=30)
        if r.status_code != 200:
            continue
        b64 = base64.b64encode(r.content).decode('utf-8')
        content.append({'type': 'text', 'text': f'\n--- Frame {name} ---'})
        content.append({'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}})
    payload = {
        'model': 'kimi-k2.6',
        'messages': [{'role': 'user', 'content': content}],
        'max_tokens': 16000,
    }
    r = requests.post(
        'https://api.moonshot.ai/v1/chat/completions',
        headers={'Authorization': f'Bearer {MOONSHOT_API_KEY}', 'Content-Type': 'application/json'},
        json=payload, timeout=300,
    )
    if r.status_code != 200:
        return f'ERROR Kimi {r.status_code}: {r.text[:500]}'
    msg = r.json()['choices'][0]['message']
    # K2.6 thinking model : réponse principale dans reasoning_content
    verdict = msg.get('content') or msg.get('reasoning_content') or ''
    return verdict

def call_gemini():
    """Gemini 3.1 Flash Lite via Google genai SDK."""
    try:
        import google.genai as genai
        import base64 as b64mod
        client = genai.Client(api_key=os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY'))
        parts = [BRIEF]
        for name, url in FRAMES:
            r = requests.get(url, timeout=30)
            if r.status_code != 200:
                continue
            parts.append(f'\n--- Frame {name} ---')
            parts.append(genai.types.Part.from_bytes(data=r.content, mime_type='image/png'))
        response = client.models.generate_content(
            model='models/gemini-3.1-flash-lite',
            contents=parts,
            config=genai.types.GenerateContentConfig(max_output_tokens=4000),
        )
        return response.text
    except Exception as e:
        return f'ERROR Gemini: {e}'

def call_gpt4o():
    """GPT-4o via OpenAI API direct."""
    if not OPENAI_API_KEY:
        return 'ERROR: OPENAI_API_KEY missing'
    content = [{'type': 'text', 'text': BRIEF}]
    for name, url in FRAMES:
        content.append({'type': 'text', 'text': f'\n--- Frame {name} ---'})
        content.append({'type': 'image_url', 'image_url': {'url': url}})
    payload = {
        'model': 'gpt-4o',
        'messages': [{'role': 'user', 'content': content}],
        'max_tokens': 4000,
    }
    r = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'},
        json=payload, timeout=180,
    )
    if r.status_code != 200:
        return f'ERROR GPT-4o {r.status_code}: {r.text[:500]}'
    return r.json()['choices'][0]['message']['content']

TASKS = {
    'kimi-k26':              call_kimi,
    'gemini-31-flash-lite':  call_gemini,
    'gpt-4o':                call_gpt4o,
}

def main():
    print(f'Jury Jour 4 — {len(FRAMES)} frames, 3 modeles (K2.6 + Gemini 3.1 Flash Lite + GPT-4o)\n')
    t0 = time.time()
    results = {}
    with ThreadPoolExecutor(max_workers=3) as ex:
        futures = {ex.submit(fn): name for name, fn in TASKS.items()}
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                verdict = fut.result()
                results[name] = verdict
                path = OUT_DIR / f'verdict-{name}.md'
                path.write_text(f'# Verdict {name}\n\n{verdict}\n', encoding='utf-8')
                print(f'[OK] {name} — {len(verdict)} chars — sauvegarde: {path}')
            except Exception as e:
                results[name] = f'ERROR: {e}'
                print(f'[ERR] {name}: {e}')
    elapsed = time.time() - t0
    print(f'\nTermine en {elapsed:.0f}s')
    return results

if __name__ == '__main__':
    main()
