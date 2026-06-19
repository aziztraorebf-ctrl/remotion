"""Genere 2 textures seamless (oil + gas) via Gemini 3.1 Flash Image (verrouille CLAUDE.md).
But : comparer une texture PHOTOREALISTE generee a la matiere canvas (resourceMatter.ts).
Sortie : /tmp/matter-gemini-oil.png + /tmp/matter-gemini-gas.png
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
KEY = os.getenv("GEMINI_API_KEY")
if not KEY:
    print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)

MODEL = "gemini-3.1-flash-image-preview"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}"

PROMPTS = {
    "oil": ("Seamless tileable texture, top-down aerial view of a crude oil slick on dark water. "
            "Viscous black-amber hydrocarbon surface with subtle iridescent petroleum sheen — cool "
            "teal-green and warm gold reflections catching light. Organic flowing ripples, no objects, "
            "no icons, no text, no logos. Dark navy-black base (#16213a family). Premium editorial "
            "cartography style, matte finish, fine grain. Perfectly square, high detail, tiles seamlessly."),
    "gas": ("Seamless tileable texture, top-down view of cool blue-grey natural gas haze over dark water. "
            "Translucent gaseous volutes and soft veils, slow drifting smoke-like swirls, no objects, no "
            "icons, no text, no flames. Dark navy base (#0b1222 family) with pale cold blue highlights. "
            "Premium editorial cartography style, matte, subtle grain. Perfectly square, tiles seamlessly."),
}


def gen(prompt: str, out: Path):
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.3},
    }
    r = requests.post(URL, json=payload, timeout=180)
    if r.status_code != 200:
        print(f"  ERROR {r.status_code}: {r.text[:300]}"); return False
    data = r.json()
    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                out.write_bytes(base64.b64decode(inline["data"]))
                print(f"  -> {out} ({out.stat().st_size//1024}KB)")
                return True
    print("  No image in response"); return False


if __name__ == "__main__":
    for name, prompt in PROMPTS.items():
        print(f"[{name}] generation...")
        gen(prompt, Path(f"/tmp/matter-gemini-{name}.png"))
