#!/usr/bin/env python3
"""
gemini-visual-playbook.py — Construit le SOUVERAIN-VISUAL-PLAYBOOK via 2 appels Gemini 3.1 Pro.

Appel 1 (principes) : 6 refs premium (Jacque a dit, etc.) + commentaires Aziz
  -> separer PRINCIPES transferables vs ESTHETIQUE generique a NE PAS copier.
Appel 2 (gap analysis) : 4 de nos videos + principes appel 1
  -> qu'est-ce qu'on fait de moins bien, comment combler a NOTRE maniere premium.

Anti-clonage : forte preference pour notre style (Mapbox dark navy+gold / beige Good News),
mais Gemini peut argumenter un element precis hors style s'il le justifie (Aziz tranche).

Sortie : memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md (2 masters : principes + template storyboard).
"""

import os
import sys
import time
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
from google import genai
from google.genai import types

MODEL = "gemini-3.1-pro-preview"
PROJECT_ROOT = Path(__file__).parent.parent.parent

REFS_DIR = Path("/tmp/mapbox-refs")
OUR_VIDEOS = [
    ("Or Africain", PROJECT_ROOT / "out/PRET-PUBLICATION/or-africain-FINAL.mp4"),
    ("Senegal Petrole Gaz", PROJECT_ROOT / "out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL-compressed.mp4"),
    ("Maroc Beat0 Hook", PROJECT_ROOT / "out/episodes/maroc-batteries/beat0-FINAL.mp4"),
    ("Maroc Beat1 animatic A2", PROJECT_ROOT / "out/episodes/maroc-batteries/wip/animatic_a2_v4.mp4"),
]

# Commentaires Aziz par ref (son "pourquoi j'aime" — l'or de l'analyse)
COMMENTAIRES_AZIZ = """
REF 1 & 2 (Jacque a dit) : "Je ne cherche pas les memes effets a 100% (lui = GeoLayer 3 / After Effects,
hors de notre portee). Ce que j'admire : le RYTHME, comment il fait apparaitre des choses sur la carte
de maniere SEQUENTIELLE (mot le plus important). Sa camera est TOUJOURS en mouvement (nous avons le drift
continu Mapbox, je ne sais plus ou il est passe). Comment il utilise differents artefacts pour rendre vivante
ce qui serait une image statique. On peut le faire a NOTRE maniere, en sequentiel."

REF 3 : "J'aime comment ils utilisent des FILL PATTERNS (After Effects pour eux, mais quand je regarde nos
templates ce n'est pas impossible pour nous). Comment ils remplissent la carte, les FLECHES. Le zoom est
assez PRONONCE (nous pas obliges d'autant zoomer, on est sur Mapbox). Mouvements camera toujours continus,
drift continu. Les choses apparaissent en sequentiel. La carte n'est JAMAIS plate/vide : tout le temps de
la couleur, quelque chose. Le rythme n'a pas besoin d'etre aussi rapide chez nous."

REF 4 : "Le tour de force de rester STATIQUE sur une seule partie, avec mouvement camera continu pour donner
un effet de satellite qui bouge. Parfaitement realisable. Aussi : on n'exploite pas assez les IMAGES qu'on
peut projeter sur la carte. On sait projeter des drapeaux, mais on peut projeter des IMAGES STATIQUES
(drapeaux de pays, colorisation, etc.). Technique adaptable a notre stack."

REF 5 : "Fascinant par sa SIMPLICITE — epurer les maps au maximum, au point qu'on ne dirait parfois plus
des maps. (Si c'etait nous / nos reviews critiques, ce serait peut-etre refuse). Prouve un point present dans
TOUTES mes videos : usage des couleurs ET des differents pop-ups d'objets. MAIS je prefere du beaucoup plus
CLASSIQUE. Eux utilisent des pop-ups immenses, emojis, etc. Nous on peut le faire AUTREMENT, plus classique,
plus premium. Pas besoin d'images qui font 500x leur taille. Mais ca montre comment meubler / faire apparaitre
des choses de temps en temps."

REF 6 : "LGO, After Effects, Google Earth, le classique. Montre les differentes manieres de faire. J'aime
beaucoup comment chaque PAYS est COLORE, l'usage des couleurs, le mouvement des cameras."

OBSERVATION STRATEGIQUE MAJEURE D'AZIZ (a mettre au centre) :
"Ils utilisent TOUS un style terre-plate / satellite realiste. Apres en avoir vu une dizaine, ils se
ressemblent TOUS, honnetement. Notre FORCE, notre template Mapbox dark (navy + gold) est DIFFERENT, OU notre
template beige (style carousel Good News). Je ne veux PAS imiter leur esthetique a 100%. Mais a travers les
commentaires, on voit des PRINCIPES qui reviennent souvent et qui valent la peine de s'inspirer."
"""

PROMPT_1 = """Tu es DIRECTEUR ARTISTIQUE expert en motion design cartographique (geotainment / edutainment).

On te montre 6 videos de reference (Shorts verticaux) de chaines cartographiques populaires
(Jacque a dit et similaires). Le realisateur (Aziz) les a choisies et commentees.

## COMMENTAIRES D'AZIZ (son jugement — l'or de cette analyse)
{commentaires}

## TA MISSION (Appel 1/2 — EXTRACTION DE PRINCIPES)

Separe RIGOUREUSEMENT deux categories :

(A) PRINCIPES TRANSFERABLES — la mecanique reproductible independamment de l'outil :
   - rythme sequentiel (apparition une-par-une rythmee)
   - camera toujours en mouvement (drift/orbit continu)
   - carte jamais plate/vide (couleur, remplissage, texture permanents)
   - projection d'images sur la carte (drapeaux, colorisation pays, images statiques)
   - meublage (pop-ups d'objets, fleches, labels) — le QUOI, pas le COMMENT esthetique
   - gestion du zoom (prononce chez eux)
   - tout autre principe que tu observes

(B) ESTHETIQUE GENERIQUE INTERCHANGEABLE — ce qui rend ces videos toutes pareilles, A NE PAS COPIER :
   Observation d'Aziz : "ils se ressemblent tous". Nomme explicitement ce look commun
   (satellite realiste, Google Earth, terre-plate, emojis, pop-ups geants, etc.).

Pour CHAQUE principe (A) : decris la mecanique + a quel moment l'utiliser + pourquoi ca capte l'attention.
Pour (B) : liste ce qui est a eviter pour ne pas devenir un clone.

## SORTIE — JSON STRICT
{{
  "principes_transferables": [
    {{ "nom": "...", "mecanique": "...", "quand_utiliser": "...", "pourquoi_ca_marche": "...",
       "exemple_ref": "quelle video le montre le mieux" }}
  ],
  "esthetique_generique_a_eviter": [
    {{ "element": "...", "pourquoi_eviter": "..." }}
  ],
  "synthese": "2-3 phrases : qu'est-ce qui distingue une carte vivante d'une carte morte, selon ces refs"
}}
"""

PROMPT_2 = """Tu es DIRECTEUR ARTISTIQUE expert en motion design cartographique.

## CONTEXTE
Tu viens d'analyser 6 refs premium et extrait ces PRINCIPES :
{principes_json}

## MAINTENANT — nos 4 videos (notre style actuel)
On te montre 4 de NOS videos : Or Africain, Senegal Petrole&Gaz, Maroc Hook (Beat0), Maroc Beat1 animatic A2.

## NOTRE STYLE SIGNATURE (a PRESERVER — c'est notre force de differenciation)
- Mapbox dark : fond navy #16213a + accents gold #c8a951 + ivory #f2ebd9
- Alternative : template beige (style carousel "Good News")
- Frame-driven obligatoire (jumpTo, jamais flyTo/easeTo) — contrainte headless
- R1 : max 8s sans changement visuel
- Premium et CLASSIQUE : Aziz refuse explicitement emojis, pop-ups geants, images 500x leur taille.
  Version elegante et sobre, PAS le look generique du genre.

## ANTI-CLONAGE — REGLE (forte preference, mais ecoute)
Notre esthetique reste le DEFAUT. Ne suggere PAS de passer au satellite/Google Earth/emojis.
EXCEPTION : si un element precis (ex: une technique de projection d'image) vaut vraiment la peine,
tu peux le proposer EN LE JUSTIFIANT explicitement — Aziz tranchera. Mais ne derive pas vers le clone.

## TA MISSION (Appel 2/2 — GAP ANALYSIS + DOCTRINE)

1. Pour CHAQUE principe transferable de l'analyse precedente : est-ce qu'on l'applique deja dans nos videos ?
   (oui / partiellement / non). Sois precis, cite quelle video.
2. Pour les principes qu'on applique mal ou pas : COMMENT les combler a NOTRE maniere premium/classique,
   dans notre stack Mapbox dark, SANS emojis ni pop-ups geants ?
3. Diagnostic specifique : notre faiblesse #1 est la "carte grise/vide" et les "plans statiques".
   Donne des solutions concretes dans NOTRE style.
4. Produis un TEMPLATE DE CREATION DE STORYBOARD pour beat Mapbox : la structure qu'on remplira a chaque
   acte (mouvement camera + overlays sequentiels + remplissage anti-gris + meublage + SFX), pour concevoir
   RICHE des le depart (pas reparer apres).

## SORTIE — JSON STRICT
{{
  "gap_analysis": [
    {{ "principe": "...", "on_applique": "oui|partiellement|non", "preuve": "quelle video",
       "comment_combler_notre_style": "..." }}
  ],
  "solutions_anti_gris": [
    {{ "probleme": "...", "solution_notre_style": "...", "technique_mapbox": "..." }}
  ],
  "propositions_hors_style": [
    {{ "element": "...", "justification": "...", "decision": "a_trancher_par_aziz" }}
  ],
  "template_storyboard_beat_mapbox": {{
    "description": "comment l'utiliser",
    "champs_par_acte": [ "..." ]
  }},
  "synthese_doctrine": "le coeur de la doctrine en 3-5 phrases"
}}
"""


def upload_and_wait(client, path, label):
    print(f"  upload {label} ({Path(path).stat().st_size // 1024} KB)...")
    f = client.files.upload(file=str(path), config=types.UploadFileConfig(mime_type="video/mp4"))
    while f.state.name == "PROCESSING":
        time.sleep(3)
        f = client.files.get(name=f.name)
    if f.state.name != "ACTIVE":
        raise RuntimeError(f"{label} etat={f.state.name}")
    return f


def main():
    api_key = os.environ["GEMINI_API_KEY"]
    client = genai.Client(api_key=api_key)

    # ── APPEL 1 — principes ──
    print("=== APPEL 1/2 — Extraction des principes (6 refs) ===")
    ref_files = sorted(REFS_DIR.glob("ref*.mp4"))
    if len(ref_files) < 6:
        print(f"ERREUR : {len(ref_files)} refs trouvees (attendu 6)", file=sys.stderr)
        sys.exit(1)
    uploaded_refs = [upload_and_wait(client, p, p.name) for p in ref_files]

    prompt1 = PROMPT_1.format(commentaires=COMMENTAIRES_AZIZ)
    contents1 = [types.Part.from_uri(file_uri=f.uri, mime_type="video/mp4") for f in uploaded_refs]
    contents1.append(types.Part(text=prompt1))

    print("  analyse appel 1...")
    resp1 = client.models.generate_content(
        model=MODEL, contents=contents1,
        config=types.GenerateContentConfig(max_output_tokens=8000, temperature=0.3),
    )
    raw1 = resp1.text.strip()
    if raw1.startswith("```"):
        raw1 = raw1.split("```", 2)[1]
        if raw1.startswith("json"): raw1 = raw1[4:]
        raw1 = raw1.strip()
    Path("/tmp/playbook-appel1.json").write_text(raw1)
    print("  -> /tmp/playbook-appel1.json")

    for f in uploaded_refs:
        try: client.files.delete(name=f.name)
        except Exception: pass

    # ── APPEL 2 — gap analysis ──
    print("\n=== APPEL 2/2 — Gap analysis (nos 4 videos) ===")
    uploaded_ours = []
    for label, p in OUR_VIDEOS:
        if not p.exists():
            print(f"  [WARN] absent : {p}")
            continue
        uploaded_ours.append((label, upload_and_wait(client, p, label)))

    prompt2 = PROMPT_2.format(principes_json=raw1)
    contents2 = [types.Part.from_uri(file_uri=f.uri, mime_type="video/mp4") for _, f in uploaded_ours]
    contents2.append(types.Part(text=prompt2))

    print("  analyse appel 2...")
    resp2 = client.models.generate_content(
        model=MODEL, contents=contents2,
        config=types.GenerateContentConfig(max_output_tokens=8000, temperature=0.3),
    )
    raw2 = resp2.text.strip()
    if raw2.startswith("```"):
        raw2 = raw2.split("```", 2)[1]
        if raw2.startswith("json"): raw2 = raw2[4:]
        raw2 = raw2.strip()
    Path("/tmp/playbook-appel2.json").write_text(raw2)
    print("  -> /tmp/playbook-appel2.json")

    for _, f in uploaded_ours:
        try: client.files.delete(name=f.name)
        except Exception: pass

    print("\n=== TERMINE ===")
    print("Appel 1 (principes) : /tmp/playbook-appel1.json")
    print("Appel 2 (gap+doctrine) : /tmp/playbook-appel2.json")
    print("\n--- APPEL 1 ---")
    print(raw1)
    print("\n--- APPEL 2 ---")
    print(raw2)


if __name__ == "__main__":
    main()
