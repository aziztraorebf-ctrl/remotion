"""
Gemini 3.1 Flash Image — generation text-to-image simple.
Usage:
    python3 scripts/tools/gemini-gen-image.py --prompt "..." --output path.png
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
import sys as _sys
_sys.path.insert(0, str(Path(__file__).resolve().parent))
from gemini_models import IMAGE_MODEL

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY missing")
    sys.exit(1)

MODEL = IMAGE_MODEL


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    client = genai.Client(api_key=API_KEY)
    print(f"Generating with {MODEL}...")
    resp = client.models.generate_content(
        model=MODEL,
        contents=[args.prompt],
    )

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    saved = False
    for part in resp.candidates[0].content.parts:
        if getattr(part, "inline_data", None) is not None:
            out.write_bytes(part.inline_data.data)
            saved = True
            print(f"Saved: {out}")
            break
    if not saved:
        print("ERROR: no image returned")
        for part in resp.candidates[0].content.parts:
            if getattr(part, "text", None):
                print(part.text)
        sys.exit(1)


if __name__ == "__main__":
    main()
