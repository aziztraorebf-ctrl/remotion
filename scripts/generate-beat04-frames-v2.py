"""
Beat04 — Generation start frame + end frame via Gemini
Style: flat design 2D vector, vue de dos, flotte Abou Bakari II
Reference visuelle: beat03-o3-fleet-v3.mp4 (premiere frame extraite)
"""

import os
import sys
import base64
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
REF_ROI = Path("public/assets/library/geoafrique/characters/abou-bakari/abou-bakari-roi-plan-large-REF.png")

# Extraire premiere frame du clip Beat03 comme reference visuelle
def extract_reference_frame(video_path: Path, out_path: Path):
    cmd = [
        "ffmpeg", "-y", "-i", str(video_path),
        "-vframes", "1", "-q:v", "2",
        str(out_path)
    ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        print(f"Attention: impossible d'extraire la frame reference — {result.stderr.decode()}")
        return False
    return True

def generate_frame(prompt: str, ref_image_path: Path | None, out_filename: str) -> Path | None:
    out_path = OUT_DIR / out_filename
    print(f"\nGeneration: {out_filename}")
    print(f"Prompt: {prompt[:80]}...")

    contents = []

    # Reference 1 : style flotte Beat03
    if ref_image_path and ref_image_path.exists():
        with open(ref_image_path, "rb") as f:
            ref_bytes = f.read()
        contents.append(
            types.Part.from_bytes(data=ref_bytes, mime_type="image/jpeg")
        )
        contents.append(
            types.Part.from_text(
                text="STYLE REFERENCE: Use this image for the pirogue shapes, ocean style, and dark background. Maintain the same flat design 2D vector aesthetic, same dark background #0a0a0f, same pirogue proportions."
            )
        )

    # Reference 2 : personnage Abou Bakari II (coherence visuelle obligatoire)
    if REF_ROI.exists():
        with open(REF_ROI, "rb") as f:
            roi_bytes = f.read()
        contents.append(
            types.Part.from_bytes(data=roi_bytes, mime_type="image/png")
        )
        contents.append(
            types.Part.from_text(
                text="CHARACTER REFERENCE: This is King Abou Bakari II. Use his exact face, beard, kufi hat, golden robes, and body proportions. The king in the scene must be recognizably this same character, seen from behind or in silhouette."
            )
        )

    contents.append(types.Part.from_text(text=prompt))

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            with open(out_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Sauvegarde: {out_path}")
            return out_path

    print(f"ERREUR: pas d'image generee pour {out_filename}")
    print(f"Reponse texte: {response.text if hasattr(response, 'text') else 'N/A'}")
    return None


# ============================================================
# START FRAME
# ============================================================
PROMPT_START = """Flat design 2D illustration, vector aesthetic.

Scene: Back view, low angle. King Abou Bakari II standing at the bow of a large wooden pirogue near the dark shore, about to depart. Night scene. He wears terracotta and dark brown fabric robes, a traditional West African kufi hat. His silhouette is strong and determined, facing the open ocean. A few other pirogues and silhouettes of crew members are visible nearby in the dark water.

Background: solid dark #0a0a0f. Stars faintly visible in the sky. Dark ocean with subtle geometric waves.

Style: flat 2D vector illustration, simplified shapes, no gradients, no photorealism, no 3D shading. Inspired by modern African documentary illustration.

NO text, NO labels, NO watermark, NO decorative borders."""

# ============================================================
# END FRAME
# ============================================================
PROMPT_END = """Flat design 2D illustration, vector aesthetic.

Scene: Back view, same low angle as start frame. King Abou Bakari II's pirogue is now far out at sea, leading a massive fleet. The King stands at the bow, a small but powerful silhouette. Behind him, hundreds of identical wooden pirogues follow in a loose V-formation spreading across the dark Atlantic Ocean. The shore is no longer visible. The ocean is vast and black. Starry night sky fills the upper half of the frame.

Background: solid dark #0a0a0f. The fleet fills the lower portion of the image, shrinking toward the horizon.

Style: flat 2D vector illustration, simplified shapes, no gradients, no photorealism, no 3D shading. Same style as start frame.

NO text, NO labels, NO watermark, NO decorative borders."""


def main():
    # Extraire frame reference Beat03
    ref_frame = None
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp_path = Path(tmp.name)

    if extract_reference_frame(REF_VIDEO, tmp_path):
        ref_frame = tmp_path
        print(f"Frame reference extraite: {tmp_path}")
    else:
        print("Generation sans reference visuelle (ffmpeg indisponible)")

    # Generer start frame
    start_path = generate_frame(PROMPT_START, ref_frame, "beat04-start-frame-v1.png")
    if start_path:
        print(f"\nSTART FRAME OK: {start_path}")
    else:
        print("\nECHEC start frame")
        sys.exit(1)

    # Generer end frame
    end_path = generate_frame(PROMPT_END, ref_frame, "beat04-end-frame-v1.png")
    if end_path:
        print(f"\nEND FRAME OK: {end_path}")
    else:
        print("\nECHEC end frame")
        sys.exit(1)

    # Nettoyage
    if ref_frame and ref_frame.exists():
        ref_frame.unlink()

    print("\nDone. Deux frames generees — a valider avant lancement Kling.")
    print(f"  Start : {OUT_DIR}/beat04-start-frame-v1.png")
    print(f"  End   : {OUT_DIR}/beat04-end-frame-v1.png")


if __name__ == "__main__":
    main()
