"""
Beat02 — End frame : roi tourne la tete vers l'ouest
Gemini multimodal REF : beat04-endframe-v2.png comme reference faciale
Start frame REF : beat04-name-scene-v2.png pour le style/trone
Output : beat02-endframe-westlook.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
REF_FACE = ASSETS_DIR / "beat04-endframe-v2.png"
REF_SCENE = ASSETS_DIR / "beat04-name-scene-v2.png"
OUTPUT = ASSETS_DIR / "beat02-endframe-westlook-v3.png"


def main():
    print("=== Beat02 End Frame — Roi regarde vers l'ouest ===\n")

    ref_face_bytes = REF_FACE.read_bytes()
    ref_scene_bytes = REF_SCENE.read_bytes()

    prompt = """Using the two reference images (image 1 = face details, image 2 = style/scene):

Draw a flat 2D vector illustration portrait of this West African king in LEFT SIDE PROFILE view — like a coin or medal profile portrait where we see the face from the side.

What we see:
- His face is pointing to the LEFT of the image — we see his LEFT side profile (left eye, left cheek, nose pointing left, chin pointing left)
- His right ear is on the FAR RIGHT edge of the image
- His left eye is visible looking forward/left
- His shoulders still face somewhat forward but his head is in full left profile
- The golden kufi hat is seen from the side (right side of hat visible on right, left profile of hat on left)
- His beard profile visible from the side
- Expression: distant gaze, as if watching the horizon

Same flat 2D vector style, black background (#050208), gold spotlight from above, gold/amber clothing palette.
Bust portrait, 9:16 vertical. NO text."""

    print("Generation en cours (Gemini 2.0 Flash image generation)...")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[
            types.Part.from_bytes(data=ref_face_bytes, mime_type="image/png"),
            types.Part.from_bytes(data=ref_scene_bytes, mime_type="image/png"),
            types.Part.from_text(text=prompt),
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
            break
        elif hasattr(part, "text") and part.text:
            print(f"[TEXT] {part.text[:200]}")

    if not image_bytes:
        print("ERREUR : pas d'image dans la reponse")
        return

    OUTPUT.write_bytes(image_bytes)
    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Sauvegarde : {OUTPUT.name} ({size_kb:.0f} KB)")
    import subprocess
    subprocess.run(["open", str(OUTPUT)], check=False)


if __name__ == "__main__":
    main()
