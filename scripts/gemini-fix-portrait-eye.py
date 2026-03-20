"""
Nano Banana -- Ajouter patch cuir sur oeil droit portrait Amanirenas
Etape 1 : Gemini extrait JSON de la scene
Etape 2 : Modifier eye_right = leather eye patch dans le JSON et regenerer
Liberte creative assumee : patch cuir fonce sur oeil droit (historiquement elle a perdu un oeil)
"""
import os, json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

INPUT  = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-portrait-REF-CANONICAL.png"
OUTPUT = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-portrait-REF-v4-patch.png"

with open(INPUT, "rb") as f:
    image_bytes = f.read()

# --- ETAPE 1 : Extraire JSON ---
print("=== ETAPE 1 : Extraction JSON du portrait ===")
prompt_extract = """Analyse ce portrait illustre et retourne UNIQUEMENT un objet JSON valide (sans markdown).
Decris chaque element du visage avec precision :
{
  "style": "...",
  "background": { "color": "..." },
  "face": {
    "skin_color": "...",
    "eye_left": { "shape": "...", "state": "...", "outline_color": "...", "details": "..." },
    "eye_right": { "shape": "...", "state": "...", "scar": "...", "details": "..." },
    "eyebrow_left": { "color": "...", "style": "..." },
    "eyebrow_right": { "color": "...", "style": "..." },
    "nose": "...",
    "lips": "..."
  },
  "crown": { "color": "...", "style": "...", "decoration": "..." },
  "clothing": { "color": "...", "style": "..." }
}"""

resp = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[types.Part.from_bytes(data=image_bytes, mime_type="image/png"), prompt_extract]
)
raw = resp.text.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
scene_json = json.loads(raw)

print("JSON extrait :")
print(json.dumps(scene_json, indent=2, ensure_ascii=False))

# --- ETAPE 2 : Modifier eye_right ---
print("\n=== ETAPE 2 : Modification eye_right + regeneration ===")
modified = json.loads(json.dumps(scene_json))
modified["face"]["eye_right"] = {
    "shape": "leather eye patch",
    "color": "#1A0F0A",
    "style": "flat dark oval shape, slightly wider than tall, covers entire right eye area completely",
    "texture": "flat graphic, no texture detail, matches the flat 2D illustration style",
    "outline": "very thin gold line border matching the face outline style",
    "details": "no eye visible underneath -- completely opaque dark patch"
}

prompt_regen = f"""Regenere ce portrait avec UNE seule modification.

JSON modifie :
{json.dumps(modified, indent=2, ensure_ascii=False)}

SEULE MODIFICATION : remplacer la zone de l oeil droit par un patch sur l oeil.
- Forme ovale plate, couleur tres sombre (#1A0F0A, brun cuir tres fonce / presque noir)
- Couvre completement l oeil droit -- opaque, aucun oeil visible en dessous
- Mince contour dore autour du patch (meme style que le contour dore du reste du visage)
- Style flat 2D graphic -- pas de texture, pas de relief, pas d ombre
- Taille : un peu plus large que l oeil gauche pour bien couvrir la zone

Garde ABSOLUMENT tout le reste identique :
- L oeil gauche (ferme, ligne horizontale) -- ne pas toucher
- Les deux sourcils -- ne pas toucher
- Le nez, les levres -- ne pas toucher
- La couronne, le cobra, le fond jaune -- ne pas toucher
- Le corps, la robe, le col bleu -- ne pas toucher
- La forme et couleur du visage -- ne pas toucher"""

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
