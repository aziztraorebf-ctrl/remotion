"""
Nano Banana -- Fix warrior REF : supprimer les details musculaires dores
Etape 1 : Gemini extrait JSON
Etape 2 : Modifier body_details = "none" + shield = "plain flat circle"
"""
import os, json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

INPUT  = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-warrior-REF-v2-silhouette.png"
OUTPUT = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-warrior-REF-v3-pure.png"

with open(INPUT, "rb") as f:
    image_bytes = f.read()

# --- ETAPE 1 : Extraire JSON ---
print("=== ETAPE 1 : Extraction JSON du warrior ===")
prompt_extract = """Analyse ce guerrier illustre et retourne UNIQUEMENT un objet JSON valide (sans markdown).
{
  "style": "...",
  "background": { "color": "..." },
  "warrior": {
    "body_color": "...",
    "body_outline_color": "...",
    "body_detail_lines": { "present": true/false, "color": "...", "description": "..." },
    "clothing": { "type": "...", "color": "..." },
    "shield": { "shape": "...", "color": "...", "patterns": "...", "decoration": "..." },
    "spear": { "shaft_color": "...", "tip_color": "...", "position": "..." }
  },
  "ground": { "description": "..." }
}"""

resp = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[types.Part.from_bytes(data=image_bytes, mime_type="image/png"), prompt_extract]
)
raw = resp.text.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
scene_json = json.loads(raw)

print("JSON extrait :")
print(json.dumps(scene_json, indent=2, ensure_ascii=False))

# --- ETAPE 2 : Modifier body_details + shield ---
print("\n=== ETAPE 2 : Modification + regeneration ===")
modified = json.loads(json.dumps(scene_json))
modified["warrior"]["body_detail_lines"]["present"] = False
modified["warrior"]["body_detail_lines"]["description"] = "zero lines -- all gold outline lines on arms, legs, torso, clothing removed completely"
modified["warrior"]["body_outline"] = "outer silhouette edge only -- no internal gold lines whatsoever"

prompt_regen = f"""Regenere ce guerrier avec UNE seule correction.

JSON modifie :
{json.dumps(modified, indent=2, ensure_ascii=False)}

SEULE CORRECTION : supprimer toutes les lignes de contour dorees a l interieur du corps.
Les bras, les jambes, le torse, le pagne ont des fines lignes dorees dessus.
Efface toutes ces lignes -- le corps devient une silhouette navy completement unie et opaque.
Zero ligne interieure. Zero contour musculaire. Zero tracé de vêtement sur le corps.

Garde ABSOLUMENT identiques :
- La forme de la silhouette (proportions, posture, contour exterieur)
- La lance (position, couleur)
- Le bouclier (forme, couleur)
- Le fond creme et le sol dore
- La taille et position du personnage dans le cadre"""

regen = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[types.Part.from_bytes(data=image_bytes, mime_type="image/png"), prompt_regen],
    config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"])
)

saved = False
for part in regen.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image"):
        OUTPUT.write_bytes(part.inline_data.data)
        print(f"Saved: {OUTPUT}")
        import subprocess; subprocess.run(["open", str(OUTPUT)], check=False)
        saved = True
        break

if not saved:
    for part in regen.candidates[0].content.parts:
        if part.text: print("Text:", part.text[:300])
