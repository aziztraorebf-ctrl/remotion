#!/usr/bin/env python3
"""
gemini-template-ideas-v2.py — Consultation Gemini 3.1 Pro pour NOUVELLES idees de templates
carte vivante, APRES le Chantier C (6 templates valides).

Difference vs gemini-template-gap.py : on envoie les PREVIEWS REELLES (frames) des templates
valides pour que Gemini VOIE notre style abouti, et on demande des idees NOUVELLES qui ne
dupliquent pas l'existant. Axe = territoires vivants (couleur/pattern/drapeaux/flux DANS la carte).

Sortie : JSON → /tmp/template-ideas-v2.json
"""
import os, json
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types

MODEL = "gemini-3.1-pro-preview"
ROOT = Path(__file__).parent.parent.parent
FRAMES_DIR = Path("/tmp/gemini-templates")

playbook = (ROOT / "memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md").read_text()

# Description des 6 templates valides (correspond aux 6 frames envoyees)
TEMPLATES_VALIDES = """
1. MapboxFlagFill (frame 01) — le drapeau d'un pays REMPLIT exactement sa silhouette, sur vraie
   carte vivante (drift, ocean navy, voisins ivory 10%). Technique clip SVG + reprojection
   frame-driven. Peut projeter N'IMPORTE QUELLE image (drapeau, texture, portrait) + bichromie.
2. MapboxIsolateZone (frame 02) — isolation d'un pays (le reste assombri facon spotlight) +
   zone offshore hachuree + badge pin geo-ancre + bloc stat.
3. SequentialBorderPulse (frame 03) — frontieres de plusieurs pays qui s'allument EN SEQUENCE
   (synchro syllabe), flash gold + glow, restent allumees. Drift adaptatif V/H.
4. GlassmorphismGeoPopup (frame 04) — encarts (fond navy translucide, bordure or) relies par
   une ligne fine au point geo, apparition sequentielle. Pour afficher des donnees sur la carte.
5. SequentialFlagReveal (frame 05) — plusieurs pays s'allument EN SEQUENCE avec LEUR DRAPEAU
   rempli dans leur silhouette, restent allumes (technique chaines).
6. LottieGeoAura (frame 06) — animations Lottie premium generees par code (onde de choc,
   anneau de donnees orbital HUD, flux de particules) ancrees a un point geo.

DEJA PREVUS / EN COURS (ne pas re-proposer) :
- Choropleth anime (pays colores selon une valeur, degrade navy→gold)
- Texture ressource dans le polygone (or/petrole/lithium en bichromie — variante de FlagFill)
- Flux inter-pays animes (lignes/fleches dorees reliant des pays, line-dasharray + particules)
"""

PROMPT = f"""Tu es directeur artistique motion design cartographique, familier de notre chaine
Souverain (cartes Mapbox dark navy #16213a + gold #c8a951 + ivory, style analyste premium,
PAS le clone satellite/Google Earth des chaines populaires).

## NOTRE DOCTRINE (Playbook premium)
{playbook}

## CE QU'ON A DEJA VALIDE (6 templates — vois les 6 frames jointes)
{TEMPLATES_VALIDES}

## CONSTAT + AXE DIRECTEUR ABSOLU D'AZIZ (le realisateur) — LIRE EN PRIORITE
"Ce qui est le PLUS IMPORTANT : le DYNAMISME sur la map. Prendre avantage de NOTRE carte et de
la COULEUR. Faire RESSORTIR le tout, ACCROCHER L'OEIL. LE VIVANT, quoi."
Traduction de cet axe pour toi :
- Priorise les idees qui font BOUGER et VIBRER la carte (mouvement, couleur qui pulse/se propage/
  balaye, territoires qui s'animent) — l'effet doit accrocher l'oeil immediatement.
- La COULEUR sur les territoires est notre force #1 : exploite-la a fond (degrades, glow, sweeps,
  teintes qui se propagent de pays en pays, contrastes navy/gold qui claquent).
- MINIMALISTE mais premium : pas de surcharge, mais chaque element doit etre VIVANT, jamais statique.
- ECARTE : extrusion 3D, satellite, tout ce qui est intello/statique/decoratif sans punch visuel.
Si une idee n'accroche pas l'oeil dans la 1ere seconde, ne la propose pas.

## TA MISSION
En regardant nos 6 frames validees, propose des IDEES NOUVELLES de templates "carte VIVANTE"
qui :
- font DU DYNAMISME + DE LA COULEUR le coeur de l'effet (accrocher l'oeil = critere #1)
- NE dupliquent PAS les 6 valides ni les 3 deja prevus (choropleth/texture/flux inter-pays)
- restent dans NOTRE langage (premium navy/gold, frontieres soignees, pas 3D, pas satellite)
- sont realisables en Mapbox + overlay SVG/Canvas + Remotion frame-driven (headless)
- sont hybrides V (1080x1920) ET H (1920x1080)

Privilegie les MOUVEMENTS DE COULEUR sur les territoires : balayage lumineux qui traverse un
pays, teinte qui se propage de voisin en voisin, pulsation de couleur synchro a la voix, gradient
anime, sweep de lumiere sur les frontieres, "chauffe" progressive d'une zone (heat), reveal de
couleur par vague. Le mouvement et la couleur AVANT tout le reste.

## SORTIE — JSON STRICT
{{
  "observations_sur_nos_frames": "2-3 phrases : ce qui marche deja visuellement dans nos 6 templates",
  "idees_nouvelles": [
    {{ "nom_propose": "...",
       "dimension": "temps|sous-divisions|relations|hierarchie|matiere|lumiere|autre",
       "description": "ce que ca montre et l'effet vivant",
       "pourquoi_premium": "en quoi ca reste dans notre langage minimaliste (pas clone)",
       "technique": "comment le faire en Mapbox+SVG/Canvas+Remotion",
       "hybride_VH": "adaptation vertical ET horizontal",
       "priorite": "haute|moyenne|basse",
       "cas_usage_souverain": "exemple concret pour un sujet eco/geopo Afrique" }}
  ],
  "synthese": "2-3 phrases : la prochaine frontiere pour rendre nos cartes encore plus vivantes"
}}
Propose 5 a 7 idees, classees par priorite.
"""

def main():
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    parts = [types.Part(text=PROMPT)]
    # joindre les 6 frames
    for f in sorted(FRAMES_DIR.glob("*.png")):
        parts.append(types.Part.from_bytes(data=f.read_bytes(), mime_type="image/png"))
    print(f"Consultation Gemini ({len(parts)-1} frames jointes)...")
    resp = client.models.generate_content(
        model=MODEL, contents=parts,
        config=types.GenerateContentConfig(max_output_tokens=8000, temperature=0.6),
    )
    raw = resp.text.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"): raw = raw[4:]
        raw = raw.strip()
    Path("/tmp/template-ideas-v2.json").write_text(raw)
    print("-> /tmp/template-ideas-v2.json\n")
    print(raw)

if __name__ == "__main__":
    main()
