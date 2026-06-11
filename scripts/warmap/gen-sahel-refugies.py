"""
Génère les 5 jetons-réfugiés War-Map Sahel Acte 2 (B6 - exode).
Remplace l'ancien jeton-refugie.png (faciès trop européen).

Diversité = ampleur de l'exode : 2 femmes distinctes + homme + enfant + famille.
Dispersés sur la carte (vague dense) puis évacués par les corridors RefugeeFlow.

REGLE CRITIQUE (template) : ethnicité OUEST-AFRICAINE / SAHELIENNE explicite
(peau noire, traits africains marqués) — corrige l'oubli du 1er jet.

Style cohérent jetons-combattants Acte 1 : encre hachuré sepia, fond cream #d4c29d
-> removeBackground Recraft. Modèle gemini-3.1-flash-image-preview.
Sortie : public/_shared/sprites/warmap/refugie-{femme1,femme2,homme,enfant,famille}.png
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
RECRAFT_KEY = os.getenv("RECRAFT_API_KEY")
OUT = ROOT / "public/_shared/sprites/warmap"
OUT.mkdir(parents=True, exist_ok=True)

if not GEMINI_KEY:
    print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
if not RECRAFT_KEY:
    print("ERROR: RECRAFT_API_KEY missing"); sys.exit(1)

# Ethnicité imposée EN TETE de chaque prompt (règle template, oubliée au 1er jet)
ETHNIE = (
    "A BLACK WEST AFRICAN / SAHELIAN person with clearly African facial features, dark brown "
    "skin, of the Sahel region (Mali/Burkina/Niger). "
)

PORTRAIT_TAIL = (
    "Hand-drawn INK ILLUSTRATION with fine cross-hatching shading (same style as a military "
    "recognition portrait: confident ink lines, sepia/earth cross-hatch shadows, NOT a photo, "
    "NOT a smooth 3D render, NOT a European face). Bust framing (head + shoulders), facing "
    "forward, centered, for insertion into a circular token. Weary but dignified neutral "
    "expression. A displaced CIVILIAN — NO weapon, NO military gear, NO uniform. "
    "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
    "WITHOUT any transparency, checkered pattern, gradient, WITHOUT any circle/frame/border, "
    "WITHOUT any map, terrain, text or decorative elements."
)

ASSETS = [
    {
        "name": "refugie-femme1",
        "prompt": (
            ETHNIE + "A displaced Sahelian woman, wearing a colorful West African headwrap "
            "(foulard noué), carrying a bundle balanced on her head. Tones: muted earth, dust "
            "ochre, warm sepia. " + PORTRAIT_TAIL
        ),
    },
    {
        "name": "refugie-femme2",
        "prompt": (
            ETHNIE + "A different displaced Sahelian woman, older, wearing a plain dark "
            "headscarf wrapped under the chin, a baby wrapped on her back (pagne). Tired, "
            "resilient. Tones: dust grey, muted earth, warm sepia. " + PORTRAIT_TAIL
        ),
    },
    {
        "name": "refugie-homme",
        "prompt": (
            ETHNIE + "An older displaced Sahelian man, wearing a worn boubou robe and a small "
            "knitted cap, a sack carried over one shoulder. Lined, weathered face. Tones: faded "
            "indigo, dust, warm sepia. " + PORTRAIT_TAIL
        ),
    },
    {
        "name": "refugie-enfant",
        "prompt": (
            ETHNIE + "A young displaced Sahelian child, short hair, simple dusty t-shirt, large "
            "uncertain eyes, clutching a small cloth bundle. Tones: dust, muted earth, warm "
            "sepia. " + PORTRAIT_TAIL
        ),
    },
    {
        "name": "refugie-famille",
        "prompt": (
            ETHNIE + "A displaced Sahelian FAMILY GROUP huddled together inside the frame — an "
            "adult woman with a headwrap, a man behind her, and a child held close (three "
            "figures grouped tightly). Suggests numbers and togetherness in flight. Tones: muted "
            "earth, dust, warm sepia. " + PORTRAIT_TAIL
        ),
    },
]

def gen_gemini(prompt: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={GEMINI_KEY}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.35},
    }
    r = requests.post(url, json=body, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"Gemini {r.status_code}: {r.text[:300]}")
    data = r.json()
    for part in data["candidates"][0]["content"]["parts"]:
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

def main():
    print(f"Generating {len(ASSETS)} Sahel refugee tokens (Gemini -> Recraft removeBg)\n")
    for sp in ASSETS:
        name = sp["name"]
        print(f"[{name}] Gemini...")
        raw = gen_gemini(sp["prompt"])
        (OUT / f"{name}-raw.png").write_bytes(raw)
        print(f"  raw saved ({len(raw)//1024}KB)")
        print(f"  Recraft removeBg...")
        (OUT / f"{name}.png").write_bytes(remove_bg_recraft(raw))
        print(f"  DONE: {name}.png\n")
    print("All Sahel refugee tokens generated.")

if __name__ == "__main__":
    main()
