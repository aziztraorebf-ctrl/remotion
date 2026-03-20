"""
Test methode Nano Banana sur beat01-v5.png
Etape 1 : Gemini analyse l'image et retourne un JSON structure
Etape 2 : On modifie 1 champ du JSON et on regenere l'image
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

IMAGE_PATH = Path("public/assets/geoafrique/beat01-v5.png")
OUT_DIR = Path("tmp/nano-banana-test")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- ETAPE 1 : Extraire le JSON de l'image ---
print("=== ETAPE 1 : Extraction JSON ===")

with open(IMAGE_PATH, "rb") as f:
    image_bytes = f.read()

prompt_extract = """Analyse cette image et retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks).
Le JSON doit decrire tous les elements visuels de facon exhaustive :
- style global (flat design, realiste, etc.)
- fond / background (couleur, texture, gradient)
- chaque element principal avec : nom, couleur (hex), position, taille relative, details
- eclairage (direction, couleur)
- atmosphere

Format attendu :
{
  "style": "...",
  "background": { "color": "...", "type": "..." },
  "lighting": { "type": "...", "color": "...", "position": "..." },
  "elements": [
    { "name": "...", "color": "...", "position": "...", "size": "...", "details": "..." }
  ],
  "atmosphere": "..."
}"""

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        prompt_extract,
    ],
)

raw = response.text.strip()
if raw.startswith("```"):
    raw = raw.split("```")[1]
    if raw.startswith("json"):
        raw = raw[4:]
raw = raw.strip()

print("JSON extrait :")
print(raw)

try:
    scene_json = json.loads(raw)
    json_path = OUT_DIR / "beat01-scene.json"
    with open(json_path, "w") as f:
        json.dump(scene_json, f, indent=2, ensure_ascii=False)
    print(f"\nJSON sauvegarde : {json_path}")
except json.JSONDecodeError as e:
    print(f"ERREUR parsing JSON : {e}")
    exit(1)

# --- ETAPE 2 : Modifier 1 element et regenerer ---
print("\n=== ETAPE 2 : Modification + Regeneration ===")

modified_json = json.loads(json.dumps(scene_json))
for el in modified_json.get("elements", []):
    name = el.get("name", "").lower()
    if "afric" in name or "continent" in name:
        print(f"Element trouve : {el['name']} — couleur originale : {el.get('color', '?')}")
        el["color"] = "#D4AF37"
        print(f"Nouvelle couleur : #D4AF37 (or/gold)")

modified_json_str = json.dumps(modified_json, indent=2, ensure_ascii=False)

prompt_regen = f"""Regenere cette image en appliquant UNIQUEMENT les changements specifies dans le JSON ci-dessous.
Ne change PAS la composition, la perspective, le style, ni les elements non modifies.

JSON modifie :
{modified_json_str}

Regles strictes :
- Meme composition exacte (angles, positions, proportions)
- Meme style flat design
- Meme fond spatial noir avec etoiles
- Meme arc de lumiere doree a l'horizon
- SEUL changement : continent africain en couleur or #D4AF37
- Pas de texte dans l'image
- Format vertical 9:16"""

print("Envoi a Gemini Image pour regeneration...")

regen_response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        prompt_regen,
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
    ),
)

out_image_path = OUT_DIR / "beat01-africa-gold-pro.png"
saved = False
for part in regen_response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image"):
        with open(out_image_path, "wb") as f:
            f.write(part.inline_data.data)
        print(f"Image regeneree sauvegardee : {out_image_path}")
        saved = True
        break

if not saved:
    print("ERREUR : pas d'image dans la reponse")
    for part in regen_response.candidates[0].content.parts:
        if part.text:
            print("Texte recu:", part.text[:300])
