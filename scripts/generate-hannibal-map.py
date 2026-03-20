"""
Genere une carte Mediterranee pour Hannibal
Style : vivid_shapes flat graphic, sans texte
Carthage (Tunisie) -> Espagne -> Alpes -> Italie
Format 9:16 portrait
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "tmp/brainstorm/maps"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """
Bold flat vector graphic map of the western Mediterranean region. NO TEXT, NO LABELS, NO ANNOTATIONS, NO WRITING anywhere.

Vertical 9:16 portrait format. Geographic layout:
- Top quarter: green Europe — Iberian Peninsula (Spain/Portugal) on left, France/Gaul in center, Italian peninsula on right
- White bold triangles for the Alps mountain range across the top-center
- Center: Mediterranean Sea as a large solid deep navy blue (#1a2a6e) — the dominant central element
- Bottom half: North Africa coast — solid warm ochre/sand (#d4a040) with Tunisia/Carthage area clearly visible as a peninsula jutting into the sea
- Far bottom: suggestion of Sahara desert as darker ochre

Style: BOLD vivid flat shapes. Maximum color contrast. Hard clean edges. Graphic novel / Kurzgesagt poster style. NO gradients, NO textures, NO photorealism, NO text of any kind.
The Mediterranean sea must be the dominant central blue mass. The Alps must be clearly visible as white triangular peaks.
"""


def generate():
    print("=== Gemini Flash Image — Carte Mediterranee Hannibal ===")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=PROMPT,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            out = OUTPUT_DIR / "map-mediterranee-gemini-v1.png"
            out.write_bytes(part.inline_data.data)
            size_kb = out.stat().st_size // 1024
            print(f"Saved: {out} ({size_kb} KB)")
            return str(out)

    print("No image in response")
    return None


if __name__ == "__main__":
    path = generate()
    if path:
        import subprocess
        subprocess.run(["open", path], check=False)
        print(f"\nDone: {path}")
