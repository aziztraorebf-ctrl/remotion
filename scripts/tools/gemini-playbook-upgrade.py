#!/usr/bin/env python3
"""
gemini-playbook-upgrade.py — Envoie 6 refs + 2 nos beats a Gemini 3.1 Pro.
Mission : extraire les principes des refs et dire comment les appliquer
concretement dans notre stack Mapbox/Remotion pour Beat 1 Phosphate.
"""

import os
import time
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
from google import genai
from google.genai import types

MODEL = "gemini-3.1-pro-preview"

COMMENTAIRES_AZIZ = """
REF 1 & 2 (Jacque a dit - Xeb37qxnkSA, TagIkeS437Y) :
"Je ne cherche pas les memes effets a 100% — GeoLayer 3 / After Effects hors de notre portee.
Ce que j'admire : le RYTHME, comment il fait apparaitre des choses sur la carte de maniere
SEQUENTIELLE — c'est le mot le plus important. Sa camera est TOUJOURS en mouvement (drift continu).
Comment il utilise differents artefacts pour rendre vivante ce qui serait une image statique.
Nous avons nos propres manieres de faire avec nos templates. Je veux ce style de mouvement,
de rythme, de zooms — adapte a notre maniere sequentielle."

REF 3 (L4TWDyKcGVg) :
"J'aime comment ils utilisent des fill patterns (After Effects pour eux, mais realisable pour nous
a notre maniere avec nos templates Mapbox). Comment ils remplissent la carte, les fleches.
Le zoom est assez prononce — nous pas obliges d'autant zoomer sur Mapbox.
Mouvements camera toujours continus. Les choses apparaissent en sequentiel.
La carte n'est JAMAIS plate/vide — tout le temps de la couleur, quelque chose."

REF 4 (-E4dozZMhdU) :
"Le tour de force de rester sur une seule partie avec mouvement camera continu — effet satellite.
Parfaitement realisable. Ce que j'aime aussi : on n'exploite pas assez les IMAGES qu'on peut
projeter sur la carte. On sait projeter des drapeaux canvas, mais on peut projeter des images
statiques (drapeaux pays, colorisation, images illustratives bichromie). Technique adaptable
a notre stack Mapbox fill-pattern."

REF 5 (t6oPpgBYRwg) :
"Fascinant par sa SIMPLICITE — epurer les maps au maximum. Ce qui retient l'attention dans
TOUTES ces videos : usage des couleurs ET des pop-ups d'objets. Je prefere beaucoup plus classique.
Eux = pop-ups immenses, emojis. Nous = plus classique, plus premium. Pas besoin d'images
500 fois leur taille. Mais ca montre comment meubler et faire apparaitre des choses de temps en temps."

REF 6 (YAtC3FrNDX8) :
"LGO, After Effects, Google Earth, le classique. J'aime beaucoup comment chaque PAYS est COLORE
(grille chromatique narrative), l'usage des couleurs, le mouvement des cameras."

OBSERVATION STRATEGIQUE MAJEURE :
"Ils utilisent TOUS un style terre-plate / satellite realiste. Apres en avoir vu une dizaine,
ils se ressemblent TOUS. Notre FORCE = notre template Mapbox dark (navy #16213a + gold #c8a951)
est DIFFERENT. Je ne veux PAS imiter leur esthetique. Mais a travers les commentaires, il y a
des PRINCIPES qui reviennent et valent la peine.

RYTHME : pas frenetique comme TikTok — vivant. Un nouvel element toutes les 2-4 secondes max.
L'audience peut tenir 4-5 secondes, mais la carte doit rester vivante ENTRE les declencheurs
(drift continu, halos qui pulsent). Maintenabilite du code prime — 5-6 declencheurs bien
choisis valent mieux que 15 declencheurs spaghetti."
"""

NOTRE_STACK = """
STACK TECHNIQUE (contraintes strictes) :
- Mapbox GL JS headless — jumpTo() frame-driven UNIQUEMENT (pas flyTo/easeTo)
- Remotion React/TypeScript — spring(), interpolate(), useCurrentFrame()
- fill-color / fill-pattern layers Mapbox filtres par ISO
- fill-pattern avec canvas 2D API (drapeaux, textures, images bichromie)
- LineString dasharray anime frame par frame (flux, fleches)
- circle layers animes (dots, halos pulse)
- Overlay CSS React absolu positionne via map.project() (labels geolocalises)
- SVG overlay React (masques texte, icones)
- Lottie assets navy/gold disponibles (shockwaveDiscovery, networkFlow, orbitalDataCrown)
- Google Fonts Anton + IBM Plex Mono charges
- Palette : navy #16213a + gold #c8a951 + ivory #f2ebd9 + red #e63946

CE QU ON SAIT FAIRE (deja valide) :
- fill-pattern drapeau canvas dans silhouette pays
- line-dasharray anime (flux phosphate rouge visible)
- circle pulse halo
- SVG mask texte (slam 70%)
- labels geolocalises via map.project() qui suivent la camera
- drift bearing continu

CE QU ON N A PAS ENCORE ESSAYE :
- Projeter une IMAGE ILLUSTRATIVE (photo stylisee bichromie) dans un polygone pays via fill-pattern
- Grille chromatique multi-pays narrative (plus de 1 pays colore simultanement)
- Icones narratives geolocalises (mine, usine, port) — echec SVG trop petit, envisager images Gemini
- Arcs multi-destinations animes depuis un point source
"""

BEAT1_CONTEXT = """
BEAT 1 PHOSPHATE — 21 secondes (609 frames a 30fps)
Voix-off : "Sous le sol marocain dort 70% des reserves mondiales de phosphate, assez pour
equiper toutes les voitures electriques prevues d'ici 2040. Le phosphate est l'ingredient
cle des batteries nouvelle generation, celles qui equiperont la majorite des voitures
electriques d'entree et milieu de gamme."

Declencheurs actuels (5 total) :
- f53  : slam SVG "70%" (masque texte, carte visible dans les caracteres)
- f130 : dot Khouribga gold (mine phosphate)
- f280 : ligne rouge dasharray Khouribga->Kenitra
- f360 : dot Kenitra rouge (gigafactory) + label geolocalise
- f420 : tentative arcs vers Europe (ne fonctionne pas encore)

CE QUI FONCTIONNE : Maroc gold immediat, slam 70% propre, ligne rouge visible, labels geolocalises
CE QUI MANQUE : Europe grise/morte, pas d'image illustrative, pas de grille chromatique narrative,
arcs d'export invisibles, icones narratives (mine/usine) invisibles (trop petits)
"""

QUESTION_PRECISE = """
MISSION GEMINI — ANALYSE COMPARATIVE DIRECTE

Tu viens de regarder :
1. Les 6 videos de reference (chaines cartographiques premium)
2. Notre Beat 0 Hook (valide, satisfaisant)
3. Notre Beat 1 Phosphate (version actuelle, insatisfaisante)

QUESTIONS PRECISES :

A) GRILLE CHROMATIQUE : Dans les refs, chaque pays/bloc a une couleur narrative.
   Comment implementer ca dans notre stack pour Beat 1 ?
   Quels pays colorer, quelle couleur, quel moment de la narration ?
   (On peut faire fill-color par ISO filter sur n'importe quel pays)

B) IMAGES ILLUSTRATIVES : Les refs projettent des images dans les polygones.
   Notre technique : fill-pattern avec canvas 2D ou image fetchee.
   Pour Beat 1 (mine phosphate + gigafactory batteries) :
   - Quelle image projeter dans le Maroc ?
   - Comment la styliser pour rester dans notre bichromie navy/gold ?
   - A quel moment du beat la projeter ?

C) RYTHME SEQUENTIEL : Nos 5 declencheurs sont bien espaces (4-5s).
   En regardant les refs et notre beat actuel :
   - Les 5 declencheurs sont-ils au BON moment (synchro voix) ?
   - Y a-t-il 1-2 declencheurs supplementaires MAINTENABLES qui ajouteraient
     de la vie sans casser l'architecture ?

D) ARCS D'EXPORT : On veut tracer des arcs Kenitra->Europe (exportation batteries).
   Dans les refs, comment ces flux sont-ils rendus visuellement premium ?
   Couleur ? Epaisseur ? Avec ou sans label destination ?

E) CE QU'ON NE VOIT PAS : En comparant nos beats aux refs, qu'est-ce qui saute
   aux yeux comme manquant et qu'on n'a pas mentionne ?
   (Pas de generalites — technique concrete dans notre stack)

FORMAT DE REPONSE : JSON structure avec pour chaque point (A-E) :
- observation (ce que tu vois dans les refs vs notre beat)
- solution_concrete (technique exacte dans notre stack)
- timing_frames (si applicable — quand dans le beat)
- priorite (1=critique, 2=important, 3=nice-to-have)
- effort (FAIBLE/MOYEN/FORT)
"""

def upload_video(client, path, display_name):
    print(f"  Upload {display_name} ({Path(path).stat().st_size // 1024}KB)...")
    f = client.files.upload(file=path, config={"display_name": display_name, "mime_type": "video/mp4"})
    # Attendre traitement
    while f.state.name == "PROCESSING":
        time.sleep(3)
        f = client.files.get(name=f.name)
    if f.state.name != "ACTIVE":
        raise RuntimeError(f"Upload echoue pour {display_name}: {f.state.name}")
    print(f"  OK -> {f.name}")
    return f

def main():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        # Lire depuis .env manuellement
        env_path = Path(__file__).parent.parent.parent / ".env"
        for line in env_path.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                key = line.split("=", 1)[1].strip().strip('"')
                break
    if not key:
        raise RuntimeError("GEMINI_API_KEY introuvable")

    client = genai.Client(api_key=key)

    print("\n=== UPLOAD DES VIDEOS ===")
    files = []

    # 6 refs
    refs = [
        ("/tmp/refs-cartographie/Xeb37qxnkSA.mp4", "Ref1_JacqueADit_A"),
        ("/tmp/refs-cartographie/TagIkeS437Y.mp4",  "Ref2_JacqueADit_B"),
        ("/tmp/refs-cartographie/L4TWDyKcGVg.mp4",  "Ref3_FillPatterns"),
        ("/tmp/refs-cartographie/-E4dozZMhdU.mp4",  "Ref4_ImageProjection"),
        ("/tmp/refs-cartographie/t6oPpgBYRwg.mp4",  "Ref5_Simplicite"),
        ("/tmp/refs-cartographie/YAtC3FrNDX8.mp4",  "Ref6_CouleursPays"),
    ]
    for path, name in refs:
        files.append(upload_video(client, path, name))

    # Nos 2 beats
    nos_beats = [
        ("/Users/clawdbot/Workspace/remotion/out/episodes/maroc-batteries/beat0-FINAL.mp4", "NOS_Beat0_Hook_FINAL"),
        ("/Users/clawdbot/Workspace/remotion/out/episodes/maroc-batteries/wip/beat1_v10.mp4", "NOS_Beat1_Phosphate_v10"),
    ]
    for path, name in nos_beats:
        files.append(upload_video(client, path, name))

    print(f"\n=== {len(files)} videos uploadees ===")

    # Construire le prompt avec les fichiers
    content_parts = []
    labels = ["REF 1 (Jacque a dit A):", "REF 2 (Jacque a dit B):", "REF 3 (Fill patterns):",
              "REF 4 (Image projection):", "REF 5 (Simplicite):", "REF 6 (Couleurs pays):",
              "NOTRE Beat 0 Hook (VALIDE):", "NOTRE Beat 1 Phosphate (A AMELIORER):"]

    for label, f in zip(labels, files):
        content_parts.append(f"\n\n{label}")
        content_parts.append(types.Part.from_uri(file_uri=f.uri, mime_type="video/mp4"))

    prompt_text = f"""
Tu es directeur artistique senior en motion design cartographique premium.

## COMMENTAIRES DU REALISATEUR SUR LES REFS
{COMMENTAIRES_AZIZ}

## NOTRE STACK TECHNIQUE
{NOTRE_STACK}

## CONTEXTE BEAT 1
{BEAT1_CONTEXT}

## MISSION
{QUESTION_PRECISE}
"""
    content_parts.append(prompt_text)

    print("\n=== APPEL GEMINI 3.1 PRO ===")
    response = client.models.generate_content(
        model=MODEL,
        contents=content_parts,
    )

    result_text = response.text
    print("\n=== REPONSE GEMINI ===")
    print(result_text)

    # Sauvegarder
    out_path = Path("/tmp/gemini-playbook-upgrade-result.txt")
    out_path.write_text(result_text)
    print(f"\nSauvegarde -> {out_path}")

    # Cleanup files Gemini
    for f in files:
        try:
            client.files.delete(name=f.name)
        except:
            pass

if __name__ == "__main__":
    main()
