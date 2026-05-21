"""
Mali Savanna Environment Plate Generator.

Generates a wide landscape plate matching the art style of Soundjata/Soumaoro
combat refs. Will be used as [REF_BACKGROUND] in Seedance storyboard-to-video
test for Acte V Kirina.

Output: 1 PNG, 16:9 landscape, Mali savanna late afternoon, no characters.
Refs passed: soundjata-combat-ref.png + soumaoro-combat-ref.png (for style lock).
"""

import io
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

ROOT = Path(__file__).parent.parent.parent
REFS_DIR = ROOT / "public" / "assets" / "library" / "geoafrique" / "soundjata" / "combat-refs"
OUT_PATH = REFS_DIR / "savanna-environment-plate.png"

STYLE_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW wide cinematic landscape illustration.

CRITICAL STYLE INSTRUCTION: Match EXACTLY the art style of the two reference
images provided. Same bold clean outlines, same flat color fills with soft
painterly cel-shading, same warm earthy palette, same 2D graphic novel
aesthetic. This landscape plate MUST feel visually continuous with those
two character images when placed side by side.

FORMAT: Wide landscape 16:9 horizontal (1920x1080).

SCENE: Mali savanna plain at late afternoon, golden hour light. Vast
rolling grassland of dry golden grass stretching to the horizon. A few
scattered acacia trees (flat umbrella-shaped silhouettes) sparse on the
horizon line. Distant red-ochre rocky outcrops or low mesa formations in
the far background haze. Warm amber sky with soft hazy clouds, no visible
sun disc. Fine dust particles in the air catching the warm light.

LIGHTING: Warm golden-hour light from the left, long soft shadows on the
grass, hazy depth toward the horizon.

COLOR PALETTE: Warm amber and peach sky, golden-ochre grass, red-brown
earth, deep olive-green acacia silhouettes. Same chromatic warmth as the
beige-tan background tone in the reference character images.

NO characters, NO people, NO animals, NO weapons, NO text, NO labels, NO
banners. Pure empty landscape plate for use as a background reference.

COMPOSITION: Horizon line around the lower third. Open sky in the upper
two-thirds. Foreground grass with subtle detail. The scene invites
characters to be added later — keep the center-left and center-right
areas clean and uncluttered.

Art style: highly stylized 2D graphic novel, bold outlines, flat colors
with soft painterly shading. NO photorealism. NO 3D render. NO manga screen
tones. Exactly matching the two reference character illustrations in feel
and palette."""


def load_ref_parts():
    parts = []
    for ref in STYLE_REFS:
        if not ref.exists():
            raise FileNotFoundError(f"Reference image missing: {ref}")
        with open(ref, "rb") as f:
            data = f.read()
        parts.append(types.Part.from_bytes(data=data, mime_type="image/png"))
        print(f"[REF] loaded {ref.name} ({len(data)} bytes)")
    return parts


def generate():
    print(f"[GEN] Mali savanna environment plate -> {OUT_PATH.name}")
    contents = load_ref_parts() + [PROMPT]
    resp = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
    )
    for part in resp.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            img = Image.open(io.BytesIO(part.inline_data.data))
            OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            img.save(OUT_PATH, "PNG")
            print(f"[OK] {OUT_PATH} ({img.size})")
            return OUT_PATH
    print("[FAIL] no image returned in response")
    return None


if __name__ == "__main__":
    generate()
