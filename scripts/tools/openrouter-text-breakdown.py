"""
OpenRouter — breakdown texte pur (prompt -> texte/JSON), sans image jointe.
Usage:
    python3 scripts/tools/openrouter-text-breakdown.py --model openai/gpt-5.5 \
        --prompt-file prompt.txt --output out.json
"""
import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("ERROR: OPENROUTER_API_KEY missing")
    sys.exit(1)

URL = "https://openrouter.ai/api/v1/chat/completions"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--prompt-file", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    prompt = Path(args.prompt_file).read_text()
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": args.model,
        "messages": [{"role": "user", "content": prompt}],
    }

    print(f"Text breakdown with {args.model} via OpenRouter...")
    r = requests.post(URL, headers=headers, json=payload, timeout=600)
    if r.status_code != 200:
        print(f"ERROR HTTP {r.status_code}: {r.text[:1000]}")
        sys.exit(1)

    txt = r.json()["choices"][0]["message"]["content"]
    # Extraire le JSON (parfois entoure de ```json ... ```)
    cleaned = txt.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    try:
        parsed = json.loads(cleaned)
        Path(args.output).write_text(json.dumps(parsed, indent=2, ensure_ascii=False))
        print(f"Saved valid JSON: {args.output}")
    except json.JSONDecodeError as e:
        Path(args.output).write_text(txt)
        print(f"WARNING: not valid JSON ({e}), saved raw text: {args.output}")


if __name__ == "__main__":
    main()
