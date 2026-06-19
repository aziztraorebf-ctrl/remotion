#!/usr/bin/env python3
"""
gemini-hook-ideas.py — Consultation Gemini 3.1 Pro pour templates de HOOK (debut de video).

Contexte Aziz : les 5-30 premieres secondes sont primordiales (long format ET short). Il est
souvent insatisfait des debuts. Il veut des templates SPECIALISES ouverture : rapides, dynamiques,
tape-a-l'oeil, PAS contemplatifs. Inspiration : grandes chaines carto, GeoLayers 3 / After Effects,
rythme rapide des le depart — MAIS avec NOTRE charte navy/gold (pas le clone satellite/TikTok cheap).

Envoie les 10 frames de nos templates valides pour que Gemini VOIE notre niveau et notre style.

CONTRAINTE TECHNIQUE A RESPECTER (importante) : Mapbox en mouvement camera ultra-rapide = probleme
de chargement de tuiles (blur force ou effet rate). Donc pour les hooks RAPIDES, privilegier une
carte Mapbox FIXE (cadrage stable) + toute l'energie en OVERLAY SVG/Canvas/Remotion par-dessus.

Sortie : JSON → /tmp/hook-ideas.json
"""
import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types

MODEL = "gemini-3.1-pro-preview"
ROOT = Path(__file__).parent.parent.parent
FRAMES_DIR = Path("/tmp/gemini-templates")

playbook = (ROOT / "memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md").read_text()

TEMPLATES_VALIDES = """
Nos 10 templates carte valides (vois les 10 frames jointes), tous Mapbox dark navy+gold,
hybrides V+H, render headless :
1 MapboxFlagFill (drapeau remplit le pays) · 2 MapboxIsolateZone (spotlight + zone) ·
3 SequentialBorderPulse (frontieres s'allument en sequence) · 4 GlassmorphismGeoPopup (encarts
donnees ancres) · 5 SequentialFlagReveal (pays s'allument avec drapeau) · 6 LottieGeoAura (Lottie
ancre) · 7 SweepRevealTerritory (faisceau revele le pays) · 8 DominoContagionFill (couleur se
propage) · 9 FiberOpticBorderDraw (frontiere se trace en laser) · 10 FiberOpticFlagInvade
(frontiere se trace PUIS drapeau envahit, sequentiel — DEJA notre meilleur candidat hook).

Aziz a deja retenu 2 idees de hook a coder : RapidFireCountries (pays qui flashent en rafale
facon montage cut) et GlitchMapIntro (carte en glitch numerique qui se stabilise).
"""

PROMPT = f"""Tu es directeur artistique motion design, expert des INTROS/HOOKS de videos
cartographiques (style GeoLayers 3 / After Effects, grandes chaines carto YouTube + formats verticaux).

## NOTRE DOCTRINE (Playbook premium)
{playbook}

## CE QU'ON A DEJA (vois les 10 frames)
{TEMPLATES_VALIDES}

## LE BRIEF D'AZIZ (le realisateur) — PRECIS
"Les 5 a 30 premieres secondes d'une video sont PRIMORDIALES (long format ET short). Je suis
souvent INSATISFAIT des debuts. Je veux des templates SPECIALISES pour le DEBUT : rapides,
dynamiques, TAPE-A-L'OEIL, PAS contemplatifs du tout. Je m'en fous un peu si ca fait un peu
'TikTok' dans le rythme — je veux du PUNCH des la frame 0. Inspiration : grandes chaines carto,
GeoLayers 3, rythme rapide des le depart. MAIS avec NOTRE charte navy/gold premium."
Nos autres templates (les 10) sont excellents mais servent APRES, une fois la video etablie.
Ici il faut le COUP DE POING initial qui empeche le scroll.

## CONTRAINTE TECHNIQUE A RESPECTER (nuancee)
Les MOUVEMENTS DE CAMERA Mapbox SONT PERMIS et encourages tant qu'ils sont FLUIDES :
- le DRIFT CONTINU (pano/bearing lent, ~+0.05-0.1/frame) qu'on utilise tout le temps = OK des le depart
- les mouvements fluides sur une carte (zoom progressif, pano) = OK
- a EVITER UNIQUEMENT : les mouvements "epileptiques" — snaps/zooms brutaux ultra-rapides qui ne
  laissent pas les tuiles Mapbox charger (→ blur force ou effet rate). Pas de cut-camera frenetique.
Donc : un hook PEUT avoir une camera qui bouge (drift, zoom doux), MAIS l'energie/punch rapide
(flashs, rafale, glitch, texte qui slamme) se joue de preference en OVERLAY (SVG/Canvas/Remotion)
par-dessus une camera fluide — pas en secouant la camera Mapbox elle-meme.
Combine intelligemment : camera Mapbox fluide (drift) + overlays energiques rapides = le meilleur des deux.

## TA MISSION
Propose des templates de HOOK (ouverture) qui :
- creent du PUNCH immediat (energie des la frame 0, rythme rapide, accroche le scroll)
- restent dans NOTRE charte navy/gold premium (jamais cheap/TikTok cphoto, jamais satellite)
- respectent la contrainte tuiles (carte fixe + overlays pour le rapide)
- sont hybrides V (1080x1920) ET H (1920x1080)
- NE dupliquent pas nos 10 templates ni RapidFireCountries / GlitchMapIntro (deja prevus)
- incluent une ACCROCHE TEXTE forte quand pertinent (question, chiffre choc, paradoxe)

Pense aux mecaniques d'intro qui marchent : compte a rebours, chiffre geant qui slamme, question
plein ecran qui se dechire sur la carte, rafale de lieux, "zoom" simule par scale d'overlay (pas
camera Mapbox), typographie kinetique, masque qui revele la carte d'un coup, barres de
chargement/scan, etc. Sois SPECIFIQUE et premium.

## SORTIE — JSON STRICT
{{
  "observations": "2-3 phrases : ce qui dans nos 10 frames pourrait deja servir d'intro, et ce qui manque pour le PUNCH",
  "hooks": [
    {{ "nom_propose": "...",
       "punch": "ce qui accroche l'oeil des la 1ere seconde",
       "mecanique": "deroule seconde par seconde (0-1s, 1-2s, 2-4s...)",
       "carte_mapbox": "fixe ou mouvement leger — comment on respecte la contrainte tuiles",
       "overlay_energie": "ce qui se passe en overlay (le coeur de l'effet)",
       "accroche_texte": "exemple de texte d'accroche si pertinent",
       "technique": "Mapbox + SVG/Canvas + Remotion — comment le coder headless",
       "hybride_VH": "adaptation V et H",
       "priorite": "haute|moyenne|basse",
       "cas_usage": "exemple concret sujet eco/geopo Afrique" }}
  ],
  "synthese": "2-3 phrases : notre signature de HOOK ideale (ce qui nous rendrait reconnaissables des l'intro)"
}}
Propose 5 a 7 hooks, classes par priorite (punch + faisabilite).
"""

def main():
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    parts = [types.Part(text=PROMPT)]
    for f in sorted(FRAMES_DIR.glob("*.png")):
        parts.append(types.Part.from_bytes(data=f.read_bytes(), mime_type="image/png"))
    print(f"Consultation Gemini HOOKS ({len(parts)-1} frames jointes)...")
    resp = client.models.generate_content(
        model=MODEL, contents=parts,
        config=types.GenerateContentConfig(max_output_tokens=9000, temperature=0.7),
    )
    raw = resp.text.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"): raw = raw[4:]
        raw = raw.strip()
    Path("/tmp/hook-ideas.json").write_text(raw)
    print("-> /tmp/hook-ideas.json\n")
    print(raw)

if __name__ == "__main__":
    main()
