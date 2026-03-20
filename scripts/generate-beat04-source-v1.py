"""
Beat04 — Generation image source unique pour multi-shot Kling
Vue de dos, Low Angle, roi + quelques pirogues sur la rive
References : roi REF plan large + style Beat03
"""

import os
import sys
import subprocess
import tempfile
from pathlib import Path
from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERREUR: GEMINI_API_KEY manquant dans .env")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)

OUT_DIR = Path("public/assets/geoafrique")
OUT_DIR.mkdir(parents=True, exist_ok=True)

REF_VIDEO = Path("public/assets/geoafrique/beat03-o3-fleet-v3.mp4")
REF_ROI   = Path("public/assets/library/geoafrique/characters/abou-bakari/abou-bakari-roi-plan-large-REF.png")

PROMPT = """Flat design 2D illustration, realistic vector style, 9:16 portrait format.

Back view, low angle camera. Mansa Abou Bakari II stands firmly at the bow of ONE single large wooden pirogue. He faces the vast western Atlantic ocean at night. His silhouette is strong and recognizable: traditional West African kufi hat, terracotta and dark brown fabric robes with subtle gold #D4AF37 details on his royal headdress.

CRITICAL: There is only ONE pirogue in the foreground. A single boat, clearly defined with simple wooden planks. NO double hull, NO nested boats, NO second pirogue inside the first one.

On each side of his pirogue, other separate pirogues are visible with silhouettes of sailors rowing or preparing. These side boats are clearly distinct and separated by water.

Lighting: soft diffuse moonlight from above. No spotlight, no cone of light, no theatrical beam. Just natural night ambiance — slightly luminous enough to see the king's terracotta robes and kufi details.

Color palette: deep dark background, dark ocean water, natural wood tones (light brown), terracotta fabric on the king, minimal gold #D4AF37 accent on headdress. Slightly brighter than pure black — moonlit night.

NO text, NO labels, NO watermark, NO decorative borders, NO spotlight, NO light beam."""


def extract_reference_frame(video_path: Path, out_path: Path) -> bool:
    cmd = ["ffmpeg", "-y", "-i", str(video_path), "-vframes", "1", "-q:v", "2", str(out_path)]
    result = subprocess.run(cmd, capture_output=True)
    return result.returncode == 0


def main():
    contents = []

    # Reference 1 : frame Beat03 pour style ocean + pirogues
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp_path = Path(tmp.name)

    if extract_reference_frame(REF_VIDEO, tmp_path):
        with open(tmp_path, "rb") as f:
            ref_bytes = f.read()
        contents.append(types.Part.from_bytes(data=ref_bytes, mime_type="image/jpeg"))
        contents.append(types.Part.from_text(
            text="OCEAN & PIROGUE STYLE REFERENCE: Use this as reference for the ocean style, dark background, and pirogue shapes. Maintain similar flat design proportions for the boats."
        ))
        tmp_path.unlink()
        print("Frame reference Beat03 chargee")
    else:
        print("Attention: frame reference Beat03 non disponible")

    # Reference 2 : personnage Abou Bakari II
    if REF_ROI.exists():
        with open(REF_ROI, "rb") as f:
            roi_bytes = f.read()
        contents.append(types.Part.from_bytes(data=roi_bytes, mime_type="image/png"))
        contents.append(types.Part.from_text(
            text="CHARACTER REFERENCE: This is King Abou Bakari II. His silhouette, kufi hat, robes and body proportions must be recognizable from behind. Same character, back view."
        ))
        print("Reference roi chargee")
    else:
        print(f"ERREUR: REF roi introuvable — {REF_ROI}")
        sys.exit(1)

    # Prompt principal
    contents.append(types.Part.from_text(text=PROMPT))

    print("\nGeneration image source Beat04...")

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    out_path = OUT_DIR / "beat04-source-v3.png"
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            with open(out_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"\nSauvegarde: {out_path}")
            print("A valider avant lancement Kling multi-shot.")
            return

    print("ERREUR: pas d'image generee")
    sys.exit(1)


if __name__ == "__main__":
    main()
