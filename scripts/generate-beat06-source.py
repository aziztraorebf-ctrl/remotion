"""
Beat06 Obsession — source image pour Kling V3 locked
Silhouette Abou Bakari de profil + double exposition ocean interieur
Output : public/assets/geoafrique/beat06-obsession-source-v1.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """Vertical 1080x1920 flat 2D vector graphic image.

COMPOSITION:
- Right third of frame: a silhouette of a West African king seen in profile, facing LEFT. He stands tall, wearing a simple crown. The silhouette is a dark solid shape.
- INSIDE the silhouette (double exposure effect): turbulent dark navy ocean waves swirling slowly, contained entirely within the silhouette outline. The ocean lives inside him — this is his obsession made visible. The waves are flat 2D vector shapes in dark navy and deep blue.
- Left two-thirds of frame: vast empty void, deep ink black. Completely empty except for a single thin horizontal golden line at mid-height — the Atlantic horizon. Minimal. Dramatic.
- Above the golden horizon line: deep blue-black sky with a few tiny cream-white star dots scattered sparsely.

COLOR PALETTE — use ONLY these colors:
- Deep ink black: #050208 (background, void)
- Dark navy: #0a1628 (ocean waves inside silhouette)
- Medium navy: #1a2a4a (wave highlights)
- Gold: #d4af37 (horizon line, crown outline)
- Cream white: #f5e6c8 (stars, tiny details)
- Silhouette body: #0d0810 (slightly lighter than pure black)

STYLE:
- 2D flat vector graphic. Crisp clean edges. No photorealism. No gradients except the wave shapes inside the silhouette.
- Cinematic vertical composition (9:16 format).
- No background texture. No noise. Pure flat shapes.
- The mood: solitude, obsession, the crushing weight of an impossible dream facing the unknown.

IMPORTANT: No text in the image. No labels. Pure visual storytelling."""

response = client.models.generate_content(
    model="models/gemini-3.1-flash-image-preview",
    contents=[types.Part.from_text(text=PROMPT)],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"]
    )
)

saved = False
for part in response.candidates[0].content.parts:
    if hasattr(part, "inline_data") and part.inline_data:
        img_bytes = part.inline_data.data
        out = OUTPUT_DIR / "beat06-obsession-source-v1.png"
        with open(out, "wb") as f:
            f.write(img_bytes)
        print(f"Saved: {out} ({len(img_bytes) // 1024} KB)")
        saved = True
        import subprocess
        subprocess.run(["open", str(out)], check=False)
        break

if not saved:
    print("Parts received:")
    for i, part in enumerate(response.candidates[0].content.parts):
        print(f"  Part {i}: inline_data={bool(part.inline_data)}, text={getattr(part, 'text', '')[:100] if hasattr(part, 'text') else 'N/A'}")
    print("No image generated")
