"""
Gemini 3.1 Pro — analyse vision (image + prompt -> JSON breakdown).
Usage:
    python3 scripts/tools/gemini-vision-breakdown.py --image path.png \
        --prompt-file prompt.txt --output out.json
"""
import argparse
import json
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

    print(f"[1/3] Upload image...")
    f = client.files.upload(file=args.image)
    print(f"[2/3] Attente ACTIVE...")
    t0 = time.time()
    while str(f.state) not in ("ACTIVE", "FileState.ACTIVE"):
        if str(f.state) in ("FAILED", "FileState.FAILED"):
            print("ECHEC."); sys.exit(2)
        time.sleep(4)
        f = client.files.get(name=f.name)
        if time.time() - t0 > 180:
            print("TIMEOUT."); sys.exit(3)
    print(f"      ACTIVE en {time.time()-t0:.0f}s")

    print(f"[3/3] Breakdown {MODEL}...")
    resp = client.models.generate_content(
        model=MODEL,
        contents=[f, types.Part.from_text(text=prompt)],
        config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=8000),
    )
    txt = resp.text or ""
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
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
        print(f"WARNING: not strict JSON ({e}). Raw saved: {out}")


if __name__ == "__main__":
    main()
