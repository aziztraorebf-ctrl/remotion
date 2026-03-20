"""
Gemini Kling Prompt Writer
--------------------------
Gemini analyse les assets visuels + le contexte de la scene
et genere des prompts Kling O3 optimises.

Usage : python -u scripts/gemini-write-kling-prompt.py

Fournir dans SCENE_BRIEF :
  - Description de la scene en francais
  - Ce qui a mal marche sur les versions precedentes
  - Contraintes specifiques
"""

import os
import base64
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY = os.getenv("GEMINI_API_KEY", "")

REF_DIR = Path(__file__).parent.parent / "tmp/brainstorm/references"

ASSETS = {
    "startframe": REF_DIR / "amanirenas-startframe-v2-clean.png",
    "endframe":   REF_DIR / "amanirenas-endframe-v4-silhouette.png",
    "portrait":   REF_DIR / "amanirenas-portrait-REF-CANONICAL.png",
    "warrior":    REF_DIR / "amanirenas-warrior-type-REF-canonical.png",
}

SCENE_BRIEF = """
SCENE : Beat 01 — Revelation d'Amanirenas et de son armee
FORMAT : 9:16 vertical, 10 secondes, Kling O3 image-to-video

STYLE VISUEL : Illustration flat 2D graphique, palette navire fonce + or + ivoire creme.
Silhouettes navy sur fond creme/desertique. Style affiche propagande / graphic novel.

CE QU'ON VEUT VOIR (en francais, a toi de traduire en prompt Kling optimal) :
- La reine Amanirenas est au centre. Elle tient une lance.
- Elle fait un geste puissant avec sa lance (planter, brandir, frapper le sol).
- Son vetement blanc bouge avec energie.
- Des guerriers arrivent et prennent position autour d'elle.
- Mouvement rapide et energique, pas lent et cinematique.
- Se termine sur un tableau graphique fort : reine + armee en position.

CE QUI A MAL MARCHE SUR LES VERSIONS PRECEDENTES :
1. v1/v2 : zero animation, effet parallaxe statique. Raison : prompt trop "slow/steady",
   et startframe trop statique sans direction de mouvement.
2. v3 : leger mouvement mais la reine avait deux yeux (la cicatrice disparaissait quand elle tournait la tete).
3. v4 "energy" : les guerriers morphaient en fin de clip — collision au centre car
   "explode from both sides" dans un 9:16 = intenable physiquement.
4. v5 "multishot" : Kling a bien suivi la structure SHOT 1/2/3/4 mais les guerriers
   se sont empiles en pyramide bizarre car ils arrivaient des deux cotes et se heurtaient.

ELEMENTS KLING (2 references) :
- @Element1 = portrait de la reine (frontal ref)
- @Element2 = guerrier type (frontal ref)

CONTRAINTES TECHNIQUES :
- duration: 10s
- aspect_ratio: 9:16
- cfg_scale: 0.5
- Modele : Kling O3 standard (fal-ai/kling-video/o3/standard/image-to-video)
- startframe ET endframe fournis (image_url + tail_image_url)

QUESTION A GEMINI :
En tant qu'expert en prompting video AI (Kling, Sora, Runway), genere 3 variantes de prompts.
Pour chaque variante :
1. Le prompt principal (en anglais, optimise Kling)
2. Le negative_prompt
3. Explication de ta strategie (en francais, 2-3 phrases)
4. Risque principal de cette approche

Variante A : approche "un seul geste fort" (reine seule, armee implicite)
Variante B : approche "camera révèle" (le mouvement de camera fait le travail)
Variante C : approche "armee pre-positionnee" (guerriers deja en place, seul le mouvement compte)
"""


def encode(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def build_parts():
    parts = []
    for label, path in ASSETS.items():
        if not path.exists():
            print(f"WARNING: Asset missing: {path.name} — skipping")
            continue
        parts.append({
            "inline_data": {
                "mime_type": "image/png",
                "data": encode(path)
            }
        })
        parts.append({"text": f"[Asset: {label} — {path.name}]"})
    parts.append({"text": SCENE_BRIEF})
    return parts


if __name__ == "__main__":
    print("Checking assets...")
    for label, path in ASSETS.items():
        status = "OK" if path.exists() else "MISSING"
        print(f"  {label}: {status}")

    print("\nSending to Gemini 2.5 Pro for prompt generation...")

    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"gemini-2.5-pro:generateContent?key={API_KEY}")

    payload = {
        "contents": [{"parts": build_parts()}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 4096,
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=180) as resp:
        result = json.loads(resp.read().decode())

    text = result["candidates"][0]["content"]["parts"][0]["text"]

    output_path = Path(__file__).parent.parent / "tmp/brainstorm/gemini-kling-prompts.md"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(text, encoding="utf-8")

    print(f"\nSaved: {output_path}")
    print("\n" + "=" * 60)
    print(text)
    print("=" * 60)
