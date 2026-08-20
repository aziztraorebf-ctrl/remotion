"""
Gemini 3.1 Flash Image — generation AVEC image(s) de reference jointe(s).
Permet de passer une IMAGE-CIBLE (ex wuar68 = gravure visee) + un prompt, pour que le modele
calibre le rendu sur la ref. Modele : IMAGE_MODEL, importe depuis gemini_models.py
(source de verite unique ; IMAGE_MODEL_HQ si l'image est publiee telle quelle).
Usage:
    python3 scripts/tools/gemini-gen-image-ref.py --prompt "..." --refs a.png,b.png --output path.png
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parent))
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
    ap.add_argument("--refs", default="", help="png paths comma-separated")
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    refs = [r.strip() for r in args.refs.split(",") if r.strip()]
    parts = [types.Part.from_text(text=args.prompt)]
    for r in refs:
        parts.append(types.Part.from_bytes(data=Path(r).read_bytes(), mime_type="image/png"))

    client = genai.Client(api_key=API_KEY)
    print(f"Generating with {MODEL} ({len(refs)} ref(s))...")
    resp = client.models.generate_content(
        model=MODEL, contents=parts, config=types.GenerateContentConfig(response_modalities=["IMAGE"])
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
