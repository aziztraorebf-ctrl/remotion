"""Gemini 3.1 Flash Image — image-to-image generique (ref + prompt).
Usage:
    python3 scripts/tools/gemini-i2i.py --ref REF.png --prompt "..." --output OUT.png
Garde le STYLE de la ref, applique le prompt. Pour generer des variations coherentes.
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


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help="image de reference (style)")
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    ref = Path(args.ref)
    if not ref.exists():
        print(f"ERROR: ref not found: {ref}")
        return 2
    image_bytes = ref.read_bytes()

    client = genai.Client(api_key=API_KEY)
    parts = [
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        types.Part.from_text(text=args.prompt),
    ]
    print(f"i2i {MODEL} <- {ref.name}")
    resp = client.models.generate_content(
        model=MODEL, contents=parts, config=types.GenerateContentConfig(response_modalities=["IMAGE"])
    )

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    for part in resp.candidates[0].content.parts:
        if getattr(part, "inline_data", None) is not None:
            out.write_bytes(part.inline_data.data)
            print(f"Saved: {out} ({len(part.inline_data.data)//1024} KB)")
            return 0
    print("ERROR: no image returned")
    for part in resp.candidates[0].content.parts:
        if getattr(part, "text", None):
            print("text:", part.text[:300])
    return 1


if __name__ == "__main__":
    sys.exit(main())
