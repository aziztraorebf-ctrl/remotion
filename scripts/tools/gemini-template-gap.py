#!/usr/bin/env python3
"""
gemini-template-gap.py — Gap analysis des templates carte vs le Playbook (1 appel Gemini 3.1 Pro).

Gemini a deja vu nos videos (Or Africain, Senegal, Maroc) lors de la session Playbook.
Ici : analyse TEXTUELLE (pas video) — inventaire templates existants + principes Playbook
→ "lesquels on a et n'utilise pas, lesquels manquent, lesquels creer en hybride V+H".

Axe central (priorite Aziz) : EFFET VIVANT = couleur sur la carte + frontieres marquees +
projection image/couleur dans polygone + Lottie. PAS le 3D en priorite.

Sortie : JSON gap → /tmp/template-gap.json
"""
import os, sys, json
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types

MODEL = "gemini-3.1-pro-preview"
ROOT = Path(__file__).parent.parent.parent

INVENTAIRE = (ROOT / "src/projects/_shared/COMPOSANTS-INDEX.md").read_text()
# extraire juste la section carte + reveal pour rester compact
def section(txt, start, end):
    s = txt.find(start)
    e = txt.find(end, s) if s >= 0 else -1
    return txt[s:e] if s >= 0 and e >= 0 else txt[s:s+2000] if s >= 0 else ""

carte = section(INVENTAIRE, "## CARTE", "## RÉVÉLATION")
playbook = (ROOT / "memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md").read_text()

PROMPT = f"""Tu es directeur technique motion design cartographique (deja familier de nos videos
Or Africain / Senegal / Maroc analysees precedemment, style Mapbox dark navy+gold).

## NOTRE DOCTRINE (Playbook premium)
{playbook}

## NOS TEMPLATES CARTE EXISTANTS (inventaire)
{carte}

Templates Mapbox additionnels confirmes : MapboxBase (base), Camera Lab v2 (mouvements),
Overlay Lab v1+v2 (fill-pattern drapeau, dasharray, fill-extrusion 3D, markers spring, canvas anime,
gradients, noise, watermark SVG, Lottie off-screen VALIDE), Lottie Showcase v1.
CountryFlagFill = drapeau qui REMPLIT la silhouette du pays (pattern signature, sous-utilise).

## PRIORITE ABSOLUE D'AZIZ (l'axe de ton analyse)
L'EFFET VIVANT, PAS le 3D. Specifiquement :
- COULEUR sur la carte (pays colores, aplats elegants)
- FRONTIERES qui ressortent (le minimalisme premium vient de la)
- PROJECTION dans les polygones (images bichromie, couleurs, drapeaux)
- LOTTIE (effets After Effects projetes — sous-utilise alors que valide fonctionnel)
Aziz note : les meilleures refs sont MINIMALISTES mais premium — elles attirent l'oeil
par la couleur et le traitement des frontieres, pas par la complexite 3D.

## TA MISSION
1. ON A MAIS ON N'UTILISE PAS : quels templates existants servent deja l'effet vivant
   mais sont sous-exploites ? Comment les remettre au centre ?
2. ON N'A PAS : quels templates "effet vivant" manquent pour executer le Playbook
   (couleur/frontieres/projection/Lottie en priorite) ?
3. HYBRIDES V+H : pour chaque template a creer, comment le concevoir utilisable
   en vertical (Short 1080x1920) ET horizontal (YouTube 1920x1080) ?
4. PRIORISATION : classe les templates a creer par impact sur l'effet vivant (haut→bas).

## SORTIE — JSON STRICT
{{
  "sous_utilises": [
    {{ "template": "...", "ce_qu_il_fait": "...", "pourquoi_le_remettre_au_centre": "..." }}
  ],
  "manquants_a_creer": [
    {{ "nom_propose": "...", "effet_vivant": "couleur|frontieres|projection|lottie|autre",
       "description": "...", "technique_mapbox": "...", "priorite": "haute|moyenne|basse",
       "hybride_VH": "comment le rendre utilisable vertical ET horizontal" }}
  ],
  "synthese": "2-3 phrases : notre vrai gap sur l'effet vivant"
}}
"""

def main():
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    print("Analyse gap templates (1 appel Gemini)...")
    resp = client.models.generate_content(
        model=MODEL, contents=[types.Part(text=PROMPT)],
        config=types.GenerateContentConfig(max_output_tokens=6000, temperature=0.3),
    )
    raw = resp.text.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"): raw = raw[4:]
        raw = raw.strip()
    Path("/tmp/template-gap.json").write_text(raw)
    print("-> /tmp/template-gap.json\n")
    print(raw)

if __name__ == "__main__":
    main()
