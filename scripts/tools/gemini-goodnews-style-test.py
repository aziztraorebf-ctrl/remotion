"""Génère 2 illustrations test (styles A et B) pour le carrousel Good News Kenya/géothermie.

Modèle : gemini-3.1-flash-image-preview (seul autorisé pour génération image).
Sortie : out/_r-and-d/good-news/style-A-ligne-claire.png + style-B-iso.png
"""
import os
from pathlib import Path
from google import genai
from google.genai import types

# Charger .env (GEMINI_API_KEY)
env = Path(__file__).resolve().parents[2] / ".env"
for line in env.read_text().splitlines():
    if line.startswith("GEMINI_API_KEY="):
        os.environ["GEMINI_API_KEY"] = line.split("=", 1)[1].strip().strip('"')

OUT = Path(__file__).resolve().parents[2] / "out/_r-and-d/good-news"
OUT.mkdir(parents=True, exist_ok=True)

PROMPTS = {
    "style-A-ligne-claire": (
        "Editorial line-art illustration in the style of La Revue Dessinee / Monocle magazine. "
        "Scene: a geothermal power plant in the Kenyan Rift Valley at golden hour -- clean cooling "
        "towers releasing soft white steam, rolling volcanic hills in the background, a single acacia "
        "tree silhouette on the right. Strict limited palette: deep navy blue background (#16213a), "
        "warm gold (#c8a951) for the linework and highlights, ivory (#f5efe0) for light accents. "
        "Flat editorial shading, confident clean outlines, premium documentary press aesthetic. "
        "NO photorealism. NO text, NO letters, NO words anywhere in the image. "
        "Vertical 4:5 composition, the lower third kept calmer and darker for text overlay later."
    ),
    "style-B-iso": (
        "Isometric minimalist infographic illustration. Scene: a stylized geothermal energy facility "
        "-- geometric cooling towers, a turbine, clean pipes, and a small data-center server rack, all "
        "connected by glowing energy lines. Strict palette: deep navy blue background (#16213a), gold "
        "(#c8a951) and ivory (#f5efe0) geometric shapes, subtle soft gradients. Flat premium "
        "fintech / infographic aesthetic, clean vector look. NO photorealism. NO text, NO letters, "
        "NO words anywhere in the image. Vertical 4:5 composition with an empty calmer lower third "
        "reserved for a text overlay."
    ),
}

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

for name, prompt in PROMPTS.items():
    print(f"[gen] {name} ...")
    resp = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[prompt],
        config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
    )
    parts = list(resp.candidates[0].content.parts) if resp.candidates[0].content.parts else []
    if not parts:
        print(f"  ⚠️ Génération refusée pour {name} — reformuler.")
        continue
    saved = False
    for part in parts:
        if getattr(part, "inline_data", None):
            (OUT / f"{name}.png").write_bytes(part.inline_data.data)
            print(f"  ✓ {OUT / (name + '.png')}")
            saved = True
    if not saved:
        print(f"  ⚠️ Aucune image dans la réponse pour {name}.")

print("Done.")
