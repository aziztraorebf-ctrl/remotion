"""
Gemini 3.1 Pro — vision-to-SVG avec max_output_tokens eleve (32000, vs 8000 de gemini-vision-breakdown.py).
Usage a privilegier quand la sortie attendue est un SVG texte long (risque de troncature sinon).
Usage: python3 scripts/tools/gemini-vision-breakdown-highoutput.py --image path.png --prompt-file prompt.txt --output out.svg
"""
import argparse
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY missing")
    sys.exit(1)

MODEL = "gemini-3.1-pro-preview"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--prompt-file", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    prompt = Path(args.prompt_file).read_text()
    client = genai.Client(api_key=API_KEY)

    print("[1/3] Upload image...")
    f = client.files.upload(file=args.image)
    print("[2/3] Attente ACTIVE...")
    t0 = time.time()
    while str(f.state) not in ("ACTIVE", "FileState.ACTIVE"):
        if str(f.state) in ("FAILED", "FileState.FAILED"):
            print("ECHEC.")
            sys.exit(2)
        time.sleep(4)
        f = client.files.get(name=f.name)
        if time.time() - t0 > 180:
            print("TIMEOUT.")
            sys.exit(3)
    print(f"      ACTIVE en {time.time()-t0:.0f}s")

    print(f"[3/3] Generation SVG {MODEL} (max_output_tokens=32000)...")
    resp = client.models.generate_content(
        model=MODEL,
        contents=[f, types.Part.from_text(text=prompt)],
        config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=32000),
    )
    txt = resp.text or ""
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(txt)
    print(f"Saved: {out} ({len(txt)} chars)")


if __name__ == "__main__":
    main()
