"""
Genere les 2 objets isometriques top-down neufs pour Soudan Acte 3 ("Suivre l'or") :
  - dubai-hub-td   : hub commercial de transit (port/hangar), lisible "hub", PAS une ville
  - suakin-dock-td : dock/port ancien ottoman, mer Rouge, visiblement plus modeste que Dubai

Style ancre sur les refs deja validees du dossier (mine-or-td.png, base-saf-td.png) :
encre hachuree, palette creme/kaki/sepia/ocre, contour encre marron fonce franc, fond
transparent (checker) une fois detoure. Passees en image-refs a Gemini pour ancrer la
palette/texture exactement (regle "reference image > description texte seule").

Modele : IMAGE_MODEL (defaut Lite, importe depuis scripts/tools/gemini_models.py --
source de verite unique ; IMAGE_MODEL_HQ uniquement si l'image est publiee telle quelle).
Pipeline : Gemini (fond creme uniforme #d4c29d) -> Recraft removeBackground -> PNG transparent.
Sortie : public/_shared/sprites/warmap/{dubai-hub-td,suakin-dock-td}.png

Prompts valides par Aziz avant lancement (session Acte 3 visual-producer).
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[1] / "tools"))
from gemini_models import IMAGE_MODEL

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
RECRAFT_KEY = os.getenv("RECRAFT_API_KEY")
SPRITES_DIR = ROOT / "public/_shared/sprites/warmap"
OUT = SPRITES_DIR

if not GEMINI_KEY:
    print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
if not RECRAFT_KEY:
    print("ERROR: RECRAFT_API_KEY missing"); sys.exit(1)

REF_PATHS = [
    SPRITES_DIR / "mine-or-td.png",
    SPRITES_DIR / "base-saf-td.png",
]

ASSETS = [
    {
        "name": "dubai-hub-td",
        "prompt": (
            "STRICT TOP-DOWN isometric view (seen directly from above, orthographic diamond angle, "
            "pitch 0), as drawn on an old military/trade staff map. Hand-drawn INK style matching a "
            "warm cream/khaki/sepia palette: confident dark brown ink outline (bold 2px), fine "
            "cross-hatching for volume and shading, warm cream and tan base tones with muted ochre "
            "and khaki accents, subtle desaturated gold accent on ONE small element only (a stack of "
            "sealed crates or a cargo pallet) to suggest gold/commodity transit -- NOT shiny, NOT "
            "glowing, just a dull warm gold tint. High contrast so it detaches cleanly from a light "
            "parchment background.\n\n"
            "SUBJECT: a small commercial transit hub -- a single modest dockside warehouse/hangar "
            "complex with a short loading pier, 2-3 shipping containers stacked, one small cargo "
            "crane, a paved yard with a few parked cargo trucks seen from above. Reads clearly as "
            "\"commercial transit port/hangar\", NOT as a city, NOT skyscrapers, NOT a skyline -- no "
            "tall buildings, no urban sprawl. Compact single structure cluster, not larger than the "
            "reference scale of a single map object (comparable footprint to a small military base "
            "icon, NOT a city block). Some fine architectural richness through roof paneling, "
            "container ridges and dock timber texture -- not through piled objects.\n\n"
            "Like a Jane's recognition / antique cartography vignette, NOT a photo, NOT a 3D render, "
            "NOT a flat colored vector icon. Single object cluster centered, clean enough to stay "
            "readable as a small map marker (~140px final render).\n\n"
            "UNIFORM solid CREAM background color #d4c29d, edge to edge, WITHOUT any transparency, "
            "checkered pattern, gradient, WITHOUT any circle/frame/border, WITHOUT any additional "
            "map, terrain, water, text, letters, numerals or decorative writing of any kind."
        ),
    },
    {
        "name": "suakin-dock-td",
        "prompt": (
            "STRICT TOP-DOWN isometric view (seen directly from above, orthographic diamond angle, "
            "pitch 0), as drawn on an old military/trade staff map. Hand-drawn INK style matching a "
            "warm cream/khaki/sepia palette: confident dark brown ink outline (bold 2px), fine "
            "cross-hatching for volume and shading, warm cream and tan base tones with muted ochre "
            "accents. High contrast so it detaches cleanly from a light parchment background.\n\n"
            "SUBJECT: a small, modest, ancient Ottoman-era coastal dock on a tiny island -- a short "
            "weathered stone jetty/pier jutting into water, a handful of old coral-stone buildings "
            "with flat roofs clustered tightly (traditional Red Sea Ottoman port architecture, NOT "
            "modern), one or two small traditional wooden dhow boats moored at the dock, no cranes, "
            "no containers, no modern port equipment. Visibly SMALLER, SIMPLER and MORE RUSTIC than "
            "a modern commercial hub -- fewer structures, fewer details, a weathered/aged feel "
            "(cracked stone texture, worn edges) to read as a modest historical outpost, not a major "
            "hub. Some fine texture through coral-stone masonry and weathered wood grain -- not "
            "through piled objects.\n\n"
            "Like a Jane's recognition / antique cartography vignette, NOT a photo, NOT a 3D render, "
            "NOT a flat colored vector icon. Single object cluster centered, clean enough to stay "
            "readable as a small map marker (~100px final render, smaller footprint than a "
            "comparable hub icon).\n\n"
            "UNIFORM solid CREAM background color #d4c29d, edge to edge, WITHOUT any transparency, "
            "checkered pattern, gradient, WITHOUT any circle/frame/border, WITHOUT any additional "
            "map, terrain, water beyond the immediate dock edge, text, letters, numerals or "
            "decorative writing of any kind."
        ),
    },
]

def load_refs():
    parts = []
    for p in REF_PATHS:
        if not p.exists():
            print(f"  WARNING: ref missing {p}")
            continue
        b64 = base64.b64encode(p.read_bytes()).decode()
        parts.append({"inline_data": {"mime_type": "image/png", "data": b64}})
    return parts

def gen_gemini(prompt: str, ref_parts: list) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{IMAGE_MODEL}:generateContent?key={GEMINI_KEY}"
    parts = list(ref_parts) + [{"text": prompt}]
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.3},
    }
    r = requests.post(url, json=body, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"Gemini {r.status_code}: {r.text[:300]}")
    data = r.json()
    candidates = data.get("candidates", [])
    if not candidates or candidates[0].get("content", {}).get("parts") is None:
        raise RuntimeError(f"No parts in Gemini response (refused?): {str(data)[:400]}")
    for part in candidates[0]["content"]["parts"]:
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    raise RuntimeError("No image in Gemini response")

def remove_bg_recraft(img_bytes: bytes) -> bytes:
    url = "https://external.api.recraft.ai/v1/images/removeBackground"
    r = requests.post(url, headers={"Authorization": f"Bearer {RECRAFT_KEY}"},
                      files={"file": ("image.png", img_bytes, "image/png")}, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"Recraft {r.status_code}: {r.text[:300]}")
    return requests.get(r.json()["image"]["url"], timeout=60).content

def verify_cream(img_bytes: bytes) -> bool:
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        px = img.getpixel((4, 4))
        diff = sum(abs(px[i]-(212,194,157)[i]) for i in range(3))
        print(f"  pixel(4,4) = {px}, diff from cream = {diff}")
        return diff < 80
    except ImportError:
        return True

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"Generating {len(ASSETS)} Soudan Acte 3 top-down sprites (Gemini + refs -> Recraft removeBg)\n")
    ref_parts = load_refs()
    print(f"Loaded {len(ref_parts)} style refs (mine-or-td, base-saf-td)\n")
    for sp in ASSETS:
        name = sp["name"]
        print(f"[{name}] Gemini...")
        raw = gen_gemini(sp["prompt"], ref_parts)
        (OUT / f"{name}-raw.png").write_bytes(raw)
        print(f"  raw saved ({len(raw)//1024}KB)")
        if not verify_cream(raw):
            print("  WARNING: bg may not be cream -- proceeding")
        print("  Recraft removeBg...")
        final_bytes = remove_bg_recraft(raw)
        (OUT / f"{name}.png").write_bytes(final_bytes)
        print(f"  DONE: {name}.png ({len(final_bytes)//1024}KB)\n")
    print("All Soudan Acte 3 hub sprites generated.")

if __name__ == "__main__":
    main()
