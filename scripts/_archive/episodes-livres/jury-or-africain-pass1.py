"""
Jury LLM creatif - Or Africain (serie Souverain)
Pass 1 - Enrichissement visuel

Modeles:
- GPT-4o via OpenAI API directe (OPENAI_API_KEY)
- Grok-4 via xAI API (XAI_API_KEY) - modele grok-4-0709 avec vision
- Kimi K2.5 via Moonshot API moonshot.ai (MOONSHOT_API_KEY)

Images : redimensionnees a 400px width JPEG 75% pour reduire les tokens.
Interdit: Claude Sonnet comme jure, remplacer Grok ou Kimi.
"""

import base64
import io
import json
import os
import time
from pathlib import Path
from PIL import Image
from openai import OpenAI

STORYBOARD_DIR = Path("/Users/clawdbot/Workspace/remotion/public/souverain/or-africain/assets/storyboard")

FRAMES = {
    "f1_ouverture": "storyboard-f1-ouverture.png",
    "f2_record": "storyboard-f2-record.png",
    "f3_graphique": "storyboard-f3-graphique.png",
    "f4_rien": "storyboard-f4-rien.png",
    "f5_carte_ghana": "storyboard-f5-carte-ghana.png",
    "f6_menace": "storyboard-f6-menace.png",
    "f7_carte_4pays": "storyboard-f7-carte-4pays.png",
    "f8_verdict": "storyboard-f8-verdict.png",
    "b3_a_entree": "storyboard-b3-a-entree.png",
    "b3_b_zoom": "storyboard-b3-b-zoom.png",
    "b3_c_ghana": "storyboard-b3-c-ghana.png",
    "b3_d_drapeaux": "storyboard-b3-d-drapeaux.png",
    "b3_e_tension": "storyboard-b3-e-tension.png",
    "b3_f_coupure": "storyboard-b3-f-coupure.png",
}


def encode_image_compressed(path: Path, width: int = 400, quality: int = 75) -> str:
    """Encode image to base64 after resizing and JPEG compression to reduce token usage."""
    img = Image.open(path)
    ratio = width / img.width
    new_h = int(img.height * ratio)
    img_small = img.resize((width, new_h), Image.LANCZOS)
    if img_small.mode == "RGBA":
        img_small = img_small.convert("RGB")
    buf = io.BytesIO()
    img_small.save(buf, "JPEG", quality=quality, optimize=True)
    return base64.standard_b64encode(buf.getvalue()).decode("utf-8")


def build_image_content(keys: list) -> list:
    content = []
    for key in keys:
        filename = FRAMES[key]
        b64 = encode_image_compressed(STORYBOARD_DIR / filename)
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
        })
    return content


def load_key(key_name: str) -> str:
    dotenv_path = "/Users/clawdbot/Workspace/remotion/.env"
    with open(dotenv_path) as f:
        for line in f:
            if line.startswith(f"{key_name}="):
                return line.strip().split("=", 1)[1]
    raise ValueError(f"Key {key_name} not found in .env")


SYSTEM_PROMPT = """Tu es un directeur artistique senior specialise en data-journalism video mobile (Bloomberg, NYT Visual Investigations, Le Monde Interactif).

Tu analyses des storyboards pour une video Short 101s sur la souverainete miniere africaine.
Style : dark premium data-journalism. Stack : Remotion pur + Mapbox 3D globe.

DECISIONS LOCKED (ne pas remettre en question) :
- Beat 3 = Mapbox 3D globe dark (zoom espace vers Ghana) - valide et fort
- B3f = seul plein ecran couleur de toute la video
- $5,000 = insert flash 1.5s uniquement, pas HUD permanent
- Overlays texte ne doublent jamais les sous-titres karaoke
- Palette : #0a0a0a / #f5d547 / #e89b3c / #d32f2f / #ffffff

CONTRAINTE TECHNIQUE SVG (critique) :
- SVG pur INTERDIT pour textures et matieres (grain, metal, fibres, bruit)
- Geometrie pure acceptable en SVG/CSS : grilles, lignes, particules ponctuelles, arcs
- Textures organiques = obligatoirement asset PNG genere (Gemini), pas feTurbulence ou CSS noise
- Pour chaque idee : preciser explicitement SVG/CSS geometrique pur OU asset PNG Gemini requis

OBSERVATIONS D'AZIZ :
1. Frames texte-seul (F1, F2, F4, F8) : fond noir + texte blanc = lisible mais plat/froid
2. Les cartes 2D du storyboard seront Mapbox 3D globe en production
3. Beat 3 globe spatial = valide et fort, ne pas remettre en question

FORMAT DE REPONSE :
- 4 sections Q1 / Q2 / Q3 / Q4
- Par question : 2-3 idees max, tres concretes
- Pour chaque idee : [SVG/CSS] ou [PNG Gemini] + niveau de complexite Remotion (simple/moyen/complexe)
- Pas de Pass 2, pas de synthese finale : seulement les idees brutes
- Sois direct, pas de preambule"""

QUESTIONS = """Tu vois maintenant les 13 frames du storyboard de la video "Or Africain" (serie Souverain).

CONTEXTE NARRATIF :
F1 : compteur $1,000 (debut, avant le record)
F2 : $5,589 + badge RECORD HISTORIQUE (hook payoff)
F3 : courbe prix or vs royalties plates (injustice visualisee)
F4 : mot RIEN. seul sur noir (choc rhethorique)
F5 : carte Ghana 2D avec drapeaux 5 pays en haut, badge 5%->12% (sera Mapbox 3D en prod)
F6 : fond rouge "N'ALLEZ PAS PLUS LOIN / CETTE LOI MENACE NOS INVESTISSEMENTS" (citation)
F7 : carte Afrique 4 pays en orange/or + $430M + connexions blanches (mouvement simultanee)
F8 : 3 lignes serif verdict en blanc sur noir (cloture editoriale)
B3-a : globe spatial entier, Ghana micro-point lumineux, badge $5,000+ coin haut droit
B3-b : zoom 3/4 globe vers Ghana, Ghana s'illumine en jaune/or avec glow
B3-c : Ghana plein ecran sur globe, tooltip 5%->12% royalties progressives
B3-d : 5 drapeaux USA/UK/Chine/Canada/Australie en haut, Ghana or visible sur globe
B3-e : meme vue drapeaux, bordure rouge d'alerte autour du globe, sous-titres "n'allez pas plus loin"
B3-f : plein ecran rouge, citation blanche "N'ALLEZ PAS PLUS LOIN / CETTE LOI MENACE NOS INVESTISSEMENTS"

---

Q1 - ENRICHISSEMENT FRAMES TEXTE-SEUL
Les frames F1 ($1,000), F2 ($5,589 RECORD), F4 (RIEN.), F8 (verdict serif) sont fonctionnelles mais plates.
Quelles couches visuelles subtiles pourraient les enrichir sans surcharger ?
Rappel : SVG pur interdit pour textures. Geometrie pure ok en SVG/CSS. Textures = PNG Gemini.
2-3 idees max.

Q2 - ELEVER LES SCENES CARTOGRAPHIQUES
Au-dela du globe 3D Mapbox deja prevu, quelles couches additionnelles rendraient les scenes cartographiques premium ?
Contrainte stack : Remotion + Mapbox uniquement. Meme regle SVG/PNG.
2-3 idees max.

Q3 - COHERENCE VISUELLE CROSS-BEATS
Un element visuel recurrent qui lierait visuellement tous les beats sans etre repetitif ?
Doit etre implementable en Remotion (SVG geometrique ou asset PNG Gemini).
2-3 idees max.

Q4 - CE QUI MANQUE
En regardant ces 13 frames comme sequence narrative complete, qu'est-ce qui manque pour atteindre le niveau Bloomberg/NYT data-journalism mobile ?
Soyez direct et precis.
2-3 points max."""


def call_gpt4o(images_content: list) -> str:
    client = OpenAI(api_key=load_key("OPENAI_API_KEY"))

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": images_content + [{"type": "text", "text": QUESTIONS}]
        }
    ]

    print("  [GPT-4o] Envoi requete OpenAI API directe...")
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=2000,
        temperature=0.7,
    )
    return response.choices[0].message.content


def call_grok(images_content: list) -> str:
    client = OpenAI(
        base_url="https://api.x.ai/v1",
        api_key=load_key("XAI_API_KEY"),
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": images_content + [{"type": "text", "text": QUESTIONS}]
        }
    ]

    print("  [Grok] Envoi requete xAI API (grok-4-0709)...")
    response = client.chat.completions.create(
        model="grok-4-0709",
        messages=messages,
        max_tokens=2000,
        temperature=0.7,
    )
    return response.choices[0].message.content


def call_kimi(images_content: list) -> str:
    client = OpenAI(
        base_url="https://api.moonshot.ai/v1",
        api_key=load_key("MOONSHOT_API_KEY"),
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": images_content + [{"type": "text", "text": QUESTIONS}]
        }
    ]

    print("  [Kimi] Envoi requete Moonshot API (kimi-k2.5)...")
    response = client.chat.completions.create(
        model="kimi-k2.5",
        messages=messages,
        max_tokens=2000,
        temperature=0.7,
    )
    return response.choices[0].message.content


def main():
    print("=== JURY LLM CREATIF - OR AFRICAIN (PASS 1) ===\n")

    print("Encodage des 14 frames storyboard (400px JPEG 75%)...")
    all_frames_keys = list(FRAMES.keys())
    images_content = build_image_content(all_frames_keys)
    total_chars = sum(len(item["image_url"]["url"]) for item in images_content)
    print(f"  {len(images_content)} images encodees. Total: ~{total_chars // 1000}k chars\n")

    results = {}

    try:
        results["gpt4o"] = call_gpt4o(images_content)
        print("  [GPT-4o] OK\n")
    except Exception as e:
        results["gpt4o"] = f"ERREUR: {e}"
        print(f"  [GPT-4o] ERREUR: {e}\n")

    time.sleep(3)

    try:
        results["grok"] = call_grok(images_content)
        print("  [Grok] OK\n")
    except Exception as e:
        results["grok"] = f"ERREUR: {e}"
        print(f"  [Grok] ERREUR: {e}\n")

    time.sleep(3)

    try:
        results["kimi"] = call_kimi(images_content)
        print("  [Kimi] OK\n")
    except Exception as e:
        results["kimi"] = f"ERREUR: {e}"
        print(f"  [Kimi] ERREUR: {e}\n")

    output_path = Path("/Users/clawdbot/Workspace/remotion/scripts/tools/jury-or-africain-pass1-results.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nResultats sauvegardes : {output_path}")
    print("\n" + "="*60)

    for juror, response in results.items():
        print(f"\n{'='*60}")
        print(f"JURE : {juror.upper()}")
        print("="*60)
        print(response)

    print("\n=== FIN DU JURY ===")


if __name__ == "__main__":
    main()
