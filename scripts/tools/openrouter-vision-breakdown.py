"""
OpenRouter — analyse vision (image + prompt -> texte/JSON).
Usage:
    python3 scripts/tools/openrouter-vision-breakdown.py --model openai/gpt-5.5 \
        --image path.png --prompt-file prompt.txt --output out.json
"""
import argparse
import base64
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
    ap.add_argument("--image", required=True)
    ap.add_argument("--prompt-file", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    prompt = Path(args.prompt_file).read_text()
    img_b64 = base64.b64encode(Path(args.image).read_bytes()).decode()
    data_url = f"data:image/png;base64,{img_b64}"

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": args.model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            }
        ],
    }

    print(f"Vision breakdown with {args.model} via OpenRouter...")
    r = requests.post(URL, headers=headers, json=payload, timeout=600)
    if r.status_code != 200:
        print(f"ERROR HTTP {r.status_code}: {r.text[:1000]}")
        sys.exit(1)

    txt = r.json()["choices"][0]["message"]["content"]
    if isinstance(txt, list):
        txt = "".join(p.get("text", "") for p in txt if isinstance(p, dict))

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    # tenter d'isoler le JSON
    clean = txt.strip()
    if clean.startswith("```"):
        clean = clean.split("```", 2)[1]
        if clean.startswith("json"):
            clean = clean[4:]
    clean = clean.strip()
    try:
        parsed = json.loads(clean)
        out.write_text(json.dumps(parsed, indent=2, ensure_ascii=False))
        print(f"Saved valid JSON: {out} ({len(parsed.get('phases', []))} phases)")
    except Exception as e:
        out.write_text(txt)
        print(f"WARNING: not strict JSON ({e}). Raw text saved: {out}")


if __name__ == "__main__":
    main()
