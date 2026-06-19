#!/usr/bin/env python3
"""
Breakdown MAPBOX DEDIE de la video Senegal (upload video complete a Gemini 3.1 Pro).
Cible UNIQUEMENT les segments carte (Acte1, Acte2, Mecanisme3, Beat10, Beat13, Beat14).
Gemini voit la video (timecodes/mouvement) MAIS on lui DONNE notre catalogue carte vivante
en contexte -> il raisonne avec NOS vrais templates (qu'il ignore sinon).

Usage : python3 scripts/tools/gemini-senegal-mapbox-review.py <video.mp4> [out.md]
"""
import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3.1-pro-preview"


def load_key():
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")


# Notre catalogue carte vivante condense (ce que Gemini IGNORE — on le lui donne)
STACK_CARTE = """\
NOTRE ARSENAL CARTE VIVANTE MAPBOX (templates DEJA codes, headless frame-driven, dispo immediatement) :

TERRITOIRE / FILL (remplir un pays) :
- MapboxFlagFill : drapeau OU image clippe dans la silhouette du pays + bichromie.
- ResourceTextureFill ⭐⭐ : TEXTURE de ressource (oil/gas/gold/phosphate/lithium) bichromie navy/gold
  projetee DANS la silhouette — "le pays est rempli de sa ressource". (Senegal = petrole+gaz !)
- WavingFlagFill ⭐ : drapeau qui ONDULE dans la silhouette (le drapeau respire).
- HeatGradientFill : choropleth dynamique, la couleur "monte" avec la narration.
- PulsingRegionFill : tout le territoire respire (opacity sin) — zone de tension/point chaud.
- ImageProjectionFill : image reelle (mine/usine/ville) bichromisee clippee dans un pays.
- SequentialFlagReveal / FlagFillSequence : pays s'allument un par un avec drapeau (synchro voix).

DYNAMIQUES (mouvement de couleur, accroche l'oeil) :
- SweepRevealTerritory ⭐ : faisceau scanner traverse le pays et revele sa couleur.
- FiberOpticBorderDraw ⭐ : frontiere/ZEE se dessine en laser dore (dasharray+glow) puis fill.
- DominoContagionFill / ContagionFlagSpread : influence se propage en vagues de pays en pays.

DATA SUR CARTE (ancrer des chiffres) :
- GlassmorphismGeoPopup : encarts donnees navy translucide+or relies au point geo par ligne fine.
- GeoCountryPlaque ⭐ : pilule NOM + encart STAT (serif gold glow) + SOURCE — annoncer pays+donnee+source.
- SequentialBorderPulse : frontieres s'allument en sequence (synchro syllabe).
- LottieGeoAura ⭐ : Lottie premium (onde de choc / anneau HUD / flux) ancre a un point geo.

INSERTS (couper la carte puis revenir) :
- MapCutaway ⭐⭐ : carte -> overlay plein ecran -> retour carte + target lock (modes image/stat/reveal/flag).

CAMERA :
- camCountryApproach(center) : zoom 4.7 + PITCH 32° + bearing leger = RELIEF 3D (pas de terrain 3D, juste l'inclinaison).
  C'est ce relief incline qu'Aziz aime. Une carte a plat (pitch 0) perd ce relief.
- Pull back climax : zoom 3.4, pitch 15. Doctrine : 1 seule Map continue, jumpTo+interpolate frame-driven, JAMAIS flyTo/easeTo.

HELPERS : useClipFlags (vrais drapeaux HD clippes, net a toute echelle — JAMAIS drawFlagCanvas approximatif),
ResourceTextures (6 textures), GeoFlowConnection (route ville->ville qui se dessine, sprite mobile, camera suit).

INTERDITS : flyTo/easeTo Mapbox, filter:blur CSS, 3D terrain lourd, After Effects.
"""

PROMPT = f"""\
Tu es directeur artistique cartographique expert (niveau Kings & Generals, Vox, Bloomberg, Johnny Harris).
Tu analyses une video documentaire FINIE (7min39, francais, eco-geopolitique Senegal petrole/gaz).

OBJECTIF SPECIFIQUE : audit des SEGMENTS CARTE / MAPBOX uniquement. Cette video a ete produite AVANT que
l'equipe developpe son arsenal carte vivante actuel. On veut savoir : avec NOS templates actuels (ci-dessous),
qu'est-ce qu'on pourrait FORTEMENT ameliorer sur les passages carte, sans tout refaire ?

{STACK_CARTE}

LES SEGMENTS CARTE A AUDITER (donne le TIMECODE de chacun que tu identifies) :
- Ouverture : carte Senegal qui apparait (FlagFill jaune plat ?).
- Sangomar / Yakaar : marqueurs offshore + halos sur la carte.
- Vue Atlantique large (GTA / 1ere cargaison gaz).
- Donut "revenus petroliers" sur fond navy.
- Carte Afrique (NBIM) + Botswana (mine de diamants).
- Mecanisme 3 "coulisses Yakaar" + carte "DE ZERO A EXPORTATEUR" avec 3 plates (FONSIS/ITIE/LOI).

POUR CHAQUE SEGMENT CARTE, reponds :
1. CE QUI EST LA : decris ce que la carte fait actuellement (fill, camera plate ou inclinee, marqueurs, mouvement).
2. CE QUI MANQUE / FAIBLESSE : carte plate sans relief ? aplat de couleur mort ? marqueur generique ?
   espace vide ? mouvement gratuit ou absent ? pas de texture/vie ?
3. QUEL(S) TEMPLATE(S) DE NOTRE ARSENAL appliquer (cite le nom EXACT de la liste ci-dessus) et POURQUOI
   ca eleverait le passage. Ex : "Senegal en FlagFill jaune plat -> ResourceTextureFill oil+gas : le pays
   se remplit de sa ressource, raconte le sujet au lieu d'un aplat decoratif."
4. CAMERA : la carte est-elle a plat (pitch 0, sans relief) ou inclinee ? Si plate, signale-le (on peut
   passer en pitch 32 via camCountryApproach pour le relief).

Puis un TOP 5 des ameliorations carte classees IMPACT/EFFORT (timecode + template a appliquer + effort).

REGLE : ne propose QUE des templates de la liste ci-dessus (c'est notre stack reel). Si tu vois une idee hors
liste, signale-la comme "hors stack actuel". Sois CONCRET (timecode + nom de template exact). Markdown dense.
"""


def main():
    if len(sys.argv) < 2:
        print("usage: gemini-senegal-mapbox-review.py <video.mp4> [out.md]")
        sys.exit(1)
    video_path = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "out/episodes/senegal-petrole-gaz/_review-prepub/GEMINI-MAPBOX-REVIEW.md"

    key = load_key()
    client = genai.Client(api_key=key)
    print(f"[1/3] Upload {Path(video_path).name}...")
    f = client.files.upload(file=video_path)
    print("[2/3] Attente ACTIVE...")
    t0 = time.time()
    while str(f.state) not in ("ACTIVE", "FileState.ACTIVE"):
        if str(f.state) in ("FAILED", "FileState.FAILED"):
            print("ECHEC."); sys.exit(2)
        time.sleep(5)
        f = client.files.get(name=f.name)
        if time.time() - t0 > 300:
            print("TIMEOUT."); sys.exit(3)
    print(f"      ACTIVE en {time.time()-t0:.0f}s")
    print("[3/3] Breakdown Mapbox dedie...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[f, types.Part.from_text(text=PROMPT)],
        config=types.GenerateContentConfig(temperature=0.5, max_output_tokens=8000),
    )
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    Path(out).write_text(resp.text or "(vide)")
    print(f"\n=== ECRIT : {out} ===\n")
    print(resp.text)


if __name__ == "__main__":
    main()
