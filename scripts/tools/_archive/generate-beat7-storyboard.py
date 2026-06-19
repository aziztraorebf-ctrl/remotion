"""
Generate storyboard for Silicon Savannah Beat 7 (CTA TypeReveal screen).
Model: gemini-3.1-flash-image-preview (obligatoire)
Output: public/souverain/silicon-savannah/beat7/storyboard-gemini.png
"""
import os
import sys
from pathlib import Path

from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).parent.parent.parent
OUTPUT_PATH = PROJECT_ROOT / "public/souverain/silicon-savannah/beat7/storyboard-gemini.png"

PROMPT = """Storyboard frame for a 9:16 vertical Short video, final CTA screen.
Very dark navy-black background (#0d1420) with subtle brushed dark concrete surface texture, nearly invisible.
9:16 aspect ratio (portrait vertical format, 1080x1920 equivalent proportions).

Centered text layout in ivory white (#f5efe0), clean modern sans-serif font, generous line spacing 1.8:
- Line 1 (upper section): "Et dans ton pays —" in smaller regular weight, softer
- Line 2 (middle, main): "une entreprise privée ou l'État ?" in medium weight, slightly larger
- Single empty line gap
- Line 3 (lower section): "Réponds en commentaire." in bold weight — the period "." has warm gold accent color #FFB800

At the very bottom of the frame, small minimal text: "GéoAfrique" in warm gold #FFB800, elegant, understated logo treatment.

Style: ultra-clean editorial documentary. Zero decorations. Zero gradients. Zero icons. Zero shapes.
The text floats in dark space — cinematic, confident, minimal.
The entire image reads as a premium CTA screen — not a social media post, a documentary question.
No text on the background itself. No watermarks. No UI chrome. No device frames.
"""


def generate_storyboard():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set in environment")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    print("Generating Beat 7 storyboard via gemini-3.1-flash-image-preview...")
    print(f"Output: {OUTPUT_PATH}")

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=PROMPT,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"]
        ),
    )

    parts = list(response.candidates[0].content.parts) if response.candidates[0].content.parts else []
    if not parts:
        print("ERROR: Generation refused — reformulate prompt")
        sys.exit(1)

    image_saved = False
    for part in parts:
        if part.inline_data:
            OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(OUTPUT_PATH, "wb") as f:
                f.write(part.inline_data.data)
            print(f"SUCCESS: Image saved to {OUTPUT_PATH}")
            image_saved = True
            break
        elif part.text:
            print(f"Gemini text: {part.text}")

    if not image_saved:
        print("ERROR: No image in response")
        sys.exit(1)


if __name__ == "__main__":
    generate_storyboard()
