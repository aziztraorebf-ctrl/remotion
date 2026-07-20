#!/usr/bin/env python3
"""Gemini video review avec brief custom — reprend la mécanique fiable de gemini-video-da-brief.py."""
import os, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant google.genai (IPv6 mort en sandbox = SYN_SENT pendu)

from pathlib import Path
from google import genai
from google.genai import types

ROOT = Path("/Users/clawdbot/Workspace/remotion")
GEMINI_MODEL = "gemini-3.1-pro-preview"

def load_key():
    for line in (ROOT / ".env").read_text().splitlines():
        if line.startswith("GEMINI_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

def main():
    video, brief_file, out = sys.argv[1], sys.argv[2], sys.argv[3]
    brief = Path(brief_file).read_text(encoding="utf-8")
    client = genai.Client(api_key=load_key())
    print(f"Upload {video} ...", flush=True)
    f = client.files.upload(file=video)
    for _ in range(90):
        f = client.files.get(name=f.name)
        if f.state == "ACTIVE": break
        if f.state == "FAILED": print("upload FAILED"); sys.exit(2)
        time.sleep(2)
    print(f"ACTIVE. Appel Gemini...", flush=True)
    resp = client.models.generate_content(
        model=GEMINI_MODEL, contents=[f, brief],
        config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=4000),
    )
    txt = resp.text or "(reponse vide)"
    Path(out).write_text(txt, encoding="utf-8")
    print("\n" + "=" * 70 + "\n" + txt + "\n" + "=" * 70)

if __name__ == "__main__":
    main()
