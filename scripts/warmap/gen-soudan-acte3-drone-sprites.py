"""
Genere les 2 sprites "drone" (marqueurs mobiles carte) pour Soudan Acte 3 ("Suivre l'or") :
  - drone-rsf-td : drone militaire type Shahed/loitering munition, teinte camp RSF (rouge brique)
  - drone-saf-td : MEME silhouette, teinte camp SAF (bleu armee)

Contexte rejet : tentative SVG (GLM-5.2, silhouette delta simple) jugee par Aziz "ressemble a un
avion, pas assez lisible/premium pour un drone". Retour au pipeline PNG raster deja valide du
projet (mine-or-td.png, dubai-hub-td.png, base-saf-td.png).

Style ancre sur les refs deja validees (mine-or-td.png, base-saf-td.png) : encre hachuree,
palette creme/kaki/sepia/ocre, contour encre marron fonce franc, fond transparent (checker) une
fois detoure. Passees en image-refs a Gemini pour ancrer palette/texture (regle "reference image
> description texte seule").

Regle "meme objet qui change de camp" : les 2 prompts sont IDENTIQUES en forme/texture, seule la
teinte d'accent change (rouge brique RSF #B14B3C vs bleu armee SAF #3E6E9E) -- coherence visuelle
piece maitresse du registre War-Map Soudan.

Modele : gemini-3.1-flash-image (verrouille CLAUDE.md).
Pipeline : Gemini (fond creme uniforme #d4c29d) -> Recraft removeBackground -> PNG transparent.
Sortie : public/_shared/sprites/warmap/{drone-rsf-td,drone-saf-td}.png
"""
import os, sys, base64, socket, requests
from pathlib import Path
from dotenv import load_dotenv
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[1] / "tools"))
from gemini_models import IMAGE_MODEL

# GOTCHA reseau (memory/tools/gemini.md) : la machine resout generativelanguage.googleapis.com
# en IPv6 sans route sortante reelle -> requests/httpx hang indefiniment sans erreur (curl a un
# fallback rapide que Python n'a pas). Forcer IPv4-only pour tous les DNS lookups du process.
_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _ipv4_only

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

BASE_SUBJECT = (
    "SUBJECT: a single small military reconnaissance/attack drone (loitering munition type, "
    "similar silhouette family to a Shahed-136 delta-wing drone) seen from directly above in "
    "flight over open ground -- slender delta/triangular wing body, small pusher-propeller engine "
    "pod at the rear, thin fixed landing skids barely visible, NO cockpit, NO canopy, NO pilot "
    "silhouette, NO passenger windows -- this MUST read unambiguously as an unmanned drone, NOT "
    "as a manned fighter jet or airliner. Compact elongated delta shape, wingspan clearly wider "
    "than a jet fighter relative to its short fuselage, minimal surface detail (a few rivet lines, "
    "a small sensor bump under the nose, thin antenna mast) -- deliberately simple and iconic so it "
    "stays instantly readable at tiny map-marker scale (~48-80px final render), NOT an intricate "
    "model-kit level of detail. Single object, centered, isolated -- casts a small soft ink-hatched "
    "shadow directly beneath it on the background to sell 'in flight' altitude."
)

ASSETS = [
    {
        "name": "drone-rsf-td",
        "prompt": (
            "STRICT TOP-DOWN view (seen directly from above, orthographic, pitch 0), as drawn on "
            "an old military staff map. Hand-drawn INK style matching a warm cream/khaki/sepia "
            "palette: confident dark brown ink outline (bold 2px), fine cross-hatching for volume "
            "and shading. Base tones warm cream/tan/khaki like the reference images, but this "
            "object carries a distinct FACTION ACCENT COLOR: brick-red/rust-red tint #B14B3C "
            "applied to the wing top surface and fuselage body (dull matte red-brown, NOT bright "
            "red, NOT glossy, blended into the ink-hatched shading like a stained/painted military "
            "surface) -- this red identifies the RSF faction, must be clearly the dominant color "
            "cue on the object while keeping the same dark brown ink outline and cross-hatch "
            "texture as the reference style.\n\n"
            f"{BASE_SUBJECT}\n\n"
            "Like a Jane's recognition drawing / antique military identification chart vignette, "
            "NOT a photo, NOT a 3D render, NOT a flat colored vector icon, NOT clip-art.\n\n"
            "UNIFORM solid CREAM background color #d4c29d, edge to edge, WITHOUT any transparency, "
            "checkered pattern, gradient, WITHOUT any circle/frame/border, WITHOUT any additional "
            "map, terrain, text, letters, numerals or decorative writing of any kind."
        ),
    },
    {
        "name": "drone-saf-td",
        "prompt": (
            "STRICT TOP-DOWN view (seen directly from above, orthographic, pitch 0), as drawn on "
            "an old military staff map. Hand-drawn INK style matching a warm cream/khaki/sepia "
            "palette: confident dark brown ink outline (bold 2px), fine cross-hatching for volume "
            "and shading. Base tones warm cream/tan/khaki like the reference images, but this "
            "object carries a distinct FACTION ACCENT COLOR: steel-blue tint #3E6E9E applied to "
            "the wing top surface and fuselage body (dull matte army blue, NOT bright blue, NOT "
            "glossy, blended into the ink-hatched shading like a stained/painted military surface) "
            "-- this blue identifies the SAF (Sudanese Armed Forces) faction, must be clearly the "
            "dominant color cue on the object while keeping the same dark brown ink outline and "
            "cross-hatch texture as the reference style.\n\n"
            f"{BASE_SUBJECT}\n\n"
            "Like a Jane's recognition drawing / antique military identification chart vignette, "
            "NOT a photo, NOT a 3D render, NOT a flat colored vector icon, NOT clip-art.\n\n"
            "UNIFORM solid CREAM background color #d4c29d, edge to edge, WITHOUT any transparency, "
            "checkered pattern, gradient, WITHOUT any circle/frame/border, WITHOUT any additional "
            "map, terrain, text, letters, numerals or decorative writing of any kind.\n\n"
            "CRITICAL CONSISTENCY: this drone must be the EXACT SAME shape, silhouette, wing "
            "geometry and proportions as the RSF drone variant already generated in this same "
            "series -- ONLY the accent color differs (steel-blue here vs brick-red on the RSF "
            "one). Same object, same camp-swap logic as the other faction-colored map assets."
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
    print(f"Generating {len(ASSETS)} Soudan Acte 3 drone sprites (Gemini + refs -> Recraft removeBg)\n")
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
    print("All Soudan Acte 3 drone sprites generated.")

if __name__ == "__main__":
    main()
