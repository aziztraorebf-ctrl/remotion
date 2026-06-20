"""
OpenRouter — generation text-to-image (GPT Image / autres modeles image).
Usage:
    python3 scripts/tools/openrouter-gen-image.py --model openai/gpt-5.4-image-2 \
        --prompt "..." --output path.png

Note: OpenRouter renvoie les images generees dans
choices[0].message.images[].image_url.url (data URL base64). Le script inspecte
la reponse de facon defensive et dump le JSON si rien n'est trouve.
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


def extract_data_url(s: str) -> bytes | None:
    if not isinstance(s, str):
        return None
    if s.startswith("data:") and "base64," in s:
        return base64.b64decode(s.split("base64,", 1)[1])
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": args.model,
        "messages": [{"role": "user", "content": args.prompt}],
        "modalities": ["image", "text"],
    }

    print(f"Generating with {args.model} via OpenRouter...")
    r = requests.post(URL, headers=headers, json=payload, timeout=300)
    if r.status_code != 200:
        print(f"ERROR HTTP {r.status_code}: {r.text[:1000]}")
        sys.exit(1)

    data = r.json()
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)

    # chemins connus + fallback recursif
    msg = data.get("choices", [{}])[0].get("message", {})
    candidates = []
    for img in msg.get("images", []) or []:
        u = (img.get("image_url") or {}).get("url") if isinstance(img, dict) else None
        if u:
            candidates.append(u)
    # certains modeles renvoient dans content[]
    content = msg.get("content")
    if isinstance(content, list):
        for part in content:
            if isinstance(part, dict):
                u = (part.get("image_url") or {}).get("url")
                if u:
                    candidates.append(u)

    for c in candidates:
        b = extract_data_url(c)
        if b:
            out.write_bytes(b)
            print(f"Saved: {out} ({len(b)} bytes)")
            return

    # rien trouve -> dump pour diagnostic
    dump = out.with_suffix(".response.json")
    dump.write_text(json.dumps(data, indent=2)[:20000])
    print(f"ERROR: no image extracted. Response dumped to {dump}")
    txt = msg.get("content") if isinstance(msg.get("content"), str) else None
    if txt:
        print("Model text:", txt[:500])
    sys.exit(1)


if __name__ == "__main__":
    main()
