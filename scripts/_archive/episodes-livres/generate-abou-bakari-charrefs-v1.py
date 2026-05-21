"""Generate Abou Bakari II character reference sheets — V1 (with beard).

VERSION 1: Abou Bakari Royal (grand boubou indigo, bonnet dome africain, barbe courte)
VERSION 2: Abou Bakari Marin (tenue voyage, turban tissu indigo simple, barbe courte)

Refs used as input:
- public/assets/thiaroye-1944/refs/tirailleur-principal-charsheet.png  (FORMAT ref)
- public/assets/abou-bakari/refs/style-anchor-scene1-village.png       (STYLE ref)
- public/assets/abou-bakari/refs/mansa-moussa-charref-v2.png            (OPULENCE ref)

Model: gemini-3.1-flash-image-preview
Output: public/assets/abou-bakari/refs/abou-bakari-royal-charref-v1.png
        public/assets/abou-bakari/refs/abou-bakari-marin-charref-v1.png
"""
import io
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUT_DIR = ROOT / "public" / "assets" / "abou-bakari" / "refs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

REF_FORMAT = ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "tirailleur-principal-charsheet.png"
REF_STYLE = ROOT / "public" / "assets" / "abou-bakari" / "refs" / "style-anchor-scene1-village.png"
REF_MOUSSA = ROOT / "public" / "assets" / "abou-bakari" / "refs" / "mansa-moussa-charref-v2.png"


def load_image_part(path: Path) -> types.Part:
    img = Image.open(path).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return types.Part.from_bytes(data=buf.getvalue(), mime_type="image/jpeg")


PROMPT_ROYAL = """Character reference sheet, paper-craft cartoon style, 9:16 vertical.

FORMAT: Three views — front (left), three-quarter (center), profile (right). Same chibi proportions as REF FORMAT. Plain warm parchment background (pale ochre). No scene, no environment.

STYLE: Match REF FORMAT for proportions and format. Match REF STYLE for warm sepia palette. Match REF MOUSSA for level of opulence.

CHARACTER: Abou Bakari II in royal court attire, Mansa of Mali, ~45 years old. Dark skin, strong build. Expression: visionary, determined, gaze slightly toward the horizon. SHORT NEAT BEARD (3-4 days, well-groomed, royal).

COSTUME — Royal Mansa Mali XIVe siecle:
- Grand boubou INDIGO PROFOND with HEAVY gold embroidery — collar, chest panel, sleeves, hem
- Headwear: TALL DOMED CAP in gold fabric with indigo geometric embroidery. Wide flat-topped dome, sits high on the head — African royal, NOT a kofia cylinder, NOT a turban, NOT European crown
- Massive gold necklace with large pendants
- Gold bracelets both wrists (multiple stacked)
- Leather sandals with gold details
- NO paddle, NO weapon — hands at sides

EYES: Dot-eyes — single small black dot, no iris, no eyelashes.
OUTLINES: Thick black outlines. Flat color fills — no hatching, no gradients.
CRITICAL: 3 views. Chibi proportions (large round head, short body). Short neat beard on all 3 views. Warm sepia palette. NO paddle. 9:16 vertical."""

PROMPT_MARIN = """Character reference sheet, paper-craft cartoon style, 9:16 vertical.

FORMAT: Three views — front (left), three-quarter (center), profile (right). Same chibi proportions as REF FORMAT. Plain warm parchment background (pale ochre). No scene, no environment.

STYLE: Match REF FORMAT for proportions. Match REF STYLE for palette. Same person as VERSION 1 — same face, same short neat beard, same dark skin — but different clothing.

CHARACTER: Abou Bakari II in seafaring travel attire. Same man as royal version — SHORT NEAT BEARD, same face, ~45 years old. Dark skin, strong build. Expression: resolute, free — a king who chose the ocean over his throne.

COSTUME — Voyage/marin, simplified but still noble:
- Boubou medium weight linen, indigo but simpler than court dress
- Cloth wrap around waist (sienna/ochre — practical for sea travel)
- Headwear: SIMPLE INDIGO CLOTH WRAP (low profile, practical for wind) — not the tall dome cap of court
- ONE gold pendant necklace only (kept one token of royalty)
- Bare forearms (rolled sleeves)
- Simple leather sandals, no gold details
- NO paddle in hands — hands at sides or arms crossed

EYES: Dot-eyes — single small black dot, no iris, no eyelashes.
OUTLINES: Thick black outlines. Flat color fills — no hatching, no gradients.
CRITICAL: 3 views. Chibi proportions. SHORT NEAT BEARD on all 3 views (same as royal version). Clearly the same person, different attire. NO paddle. 9:16 vertical."""


def generate_charref(version: str, prompt: str, output_path: Path) -> None:
    print(f"\n--- Generating {version} ---")
    print(f"Output: {output_path}")

    ref_format = load_image_part(REF_FORMAT)
    ref_style = load_image_part(REF_STYLE)
    ref_moussa = load_image_part(REF_MOUSSA)

    contents = [
        types.Content(role="user", parts=[
            types.Part.from_text(text="REF FORMAT — use this for chibi proportions and 3-view layout:"),
            ref_format,
            types.Part.from_text(text="REF STYLE — use this for the warm sepia paper-craft palette:"),
            ref_style,
            types.Part.from_text(text="REF MOUSSA — use this for the level of royal opulence (gold, embroidery):"),
            ref_moussa,
            types.Part.from_text(text=prompt),
        ])
    ]

    response = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
            temperature=1.0,
        ),
    )

    image_saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data and "image" in part.inline_data.mime_type:
            img_data = part.inline_data.data
            img = Image.open(io.BytesIO(img_data))
            img.save(output_path, "PNG")
            print(f"Saved: {output_path} ({img.size[0]}x{img.size[1]})")
            image_saved = True
            break
        elif hasattr(part, "text") and part.text:
            print(f"Text response: {part.text[:200]}")

    if not image_saved:
        print("ERROR: No image in response.")
        sys.exit(1)


def main():
    versions = [
        ("VERSION 1 — Abou Bakari Royal", PROMPT_ROYAL, OUT_DIR / "abou-bakari-royal-charref-v1.png"),
        ("VERSION 2 — Abou Bakari Marin", PROMPT_MARIN, OUT_DIR / "abou-bakari-marin-charref-v1.png"),
    ]

    for version_name, prompt, output_path in versions:
        generate_charref(version_name, prompt, output_path)
        if version_name != versions[-1][0]:
            print("Waiting 3s between requests...")
            time.sleep(3)

    print("\nDone. Both character refs generated.")


if __name__ == "__main__":
    main()
