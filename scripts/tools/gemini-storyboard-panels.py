#!/usr/bin/env python3
"""
gemini-storyboard-panels.py — Génère un storyboard VISUEL multi-panels via Gemini Flash.

NON-NEGOTIABLE dans le pipeline Beat Remotion : tout beat passe par un storyboard visuel
Gemini Flash AVANT le code. Le storyboard multi-panels montre la PROGRESSION du beat
(intro -> developpement -> climax/verdict), comme une planche. C'est de lui qu'on tire
le breakdown JSON et c'est lui qui permet de coder sans hesiter.

Usage :
  python3 scripts/tools/gemini-storyboard-panels.py \
    --episode maroc-batteries --beat 3 \
    --prompt-file /tmp/maroc-batteries-beat3-storyboard-prompt.txt

Le prompt (--prompt-file) DOIT etre redige par Claude depuis le scan (templates choisis
+ combinaisons) et VALIDE par Aziz AVANT l'appel. Modele : gemini-3.1-flash-image-preview.
Sortie : public/souverain/<episode>/beat<N>/storyboard-gemini.png (chemin attendu par preflight).
"""

import io
import os
import sys
import argparse
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent.parent
load_dotenv(PROJECT_ROOT / ".env")

MODEL = "gemini-3.1-flash-image-preview"

# Ratio cible : 16:9 par defaut (Souverain mid-form / long, render HORIZONTAL).
# ⛔ Generer au ratio du RENDER (pas vertical par defaut) : sinon panneaux portrait ->
# espaces vides en 16:9 ET faux-bas du gate review. Doctrine : STORYBOARD-DATAVIZ.md [1].
RATIO_TARGETS = {
    "16:9": "1920x1080 (16:9, HORIZONTAL)",
    "9:16": "1080x1920 (9:16, VERTICAL, Short)",
    "1:1":  "1080x1080 (1:1, CARRE, carrousel Instagram)",
}

# Backgrounds : registre de fond. "libre" = Gemini choisit (pour explorer hors parchemin).
BACKGROUND_TARGETS = {
    "parchemin": "Fond PARCHEMIN creme #ece3cb quadrille (grille ocre desaturee). Accent OCRE/terre cuite #b06a2c.",
    "navy":      "Fond NAVY #141c2e (uni ou pointille). Accent GOLD #c8a951, texte IVORY #f0e8d8.",
    "neon":      "Fond NOIR #111111 + grille sombre. Glow cyan/magenta/vert (registre marche/tech UNIQUEMENT).",
    "libre":     "CHOISIS toi-meme le fond le plus premium pour ce sujet (autre que parchemin clair) — "
                 "propose une direction de fond + palette d'accent coherente et editoriale. Surprends-nous, reste sobre et premium.",
}

# PREAMBULE PREMIUM DATA-VIZ — pendant symetrique du preambule carte (STORYBOARD-MAPBOX.md).
# Comble le TROU 3 du CHANTIER-PEAUFINAGE-GRAPHISMES : donne au modele une CIBLE de qualite a
# viser (chaines premium + ce qu'on leur vole + notre matiere Hera), pas juste un "tone".
# Doctrine complete : memory/doctrines/STORYBOARD-DATAVIZ.md.
PREMIUM_PREAMBLE = """
PREMIUM TARGET (ce que tu DOIS viser — pas le minimum) :
Inspire-toi de ces chaines data-viz premium et VOLE-leur leur force :
- Bloomberg Originals -> profondeur 2.5D (drop-shadow dynamique, parallaxe fond/avant-plan), chiffre incruste avec autorite.
- Vox / Johnny Harris -> rigueur editoriale, annotations propres, transitions seamless (match cut, zoom intra-element), JAMAIS de cut franc.
- Kurzgesagt -> secondary motion (tout respire), springs anticipation+overshoot, discipline du vide, metaphore visuelle qui porte le chiffre.
- Polymatter / Wendover -> registre eco/geopolitique, chart au service du propos, montee en tension narrative.
- Financial Times / The Economist -> autorite du chiffre, sobriete, hierarchie typographique impeccable, labels directs (PAS de legende).

NOTRE MATIERE (ce qu'on sait deja faire a ce niveau — va PLUS LOIN) :
- Grammaire narrative 5 beats : (1) pose la question, (2) baseline/comparaison, (3) anime le chiffre cle (le geste),
  (4) traduit en langage simple (le takeaway), (5) source/CTA. Pause APRES le chiffre le plus important (count-up land + breathe).
- On sait faire : count-up odometre, hero vertical bars, chart-sur-vraie-carte, donut, timeline medaillons,
  texte cinetique d'emphase, metaphore physique (balance, piece).

DIRECTIVE DATA-VIZ VIVANTE (le coeur) :
Le data-viz doit etre VIVANT et PREMIUM — jamais un PowerPoint, jamais un plan fixe fige, jamais des carres vides.
A chaque etat, quelque chose EVOLUE pour porter l'intention (le chiffre se construit, une metaphore apparait, la donnee
se met en scene). REMPLIS l'espace du cadre. A TOI de proposer COMMENT — ose des partis pris visuels forts.
"""


def build_style_block(ratio: str, background: str = "parchemin") -> str:
    """Charte + style + preambule premium, parametre par le ratio cible ET le fond."""
    ratio_desc = RATIO_TARGETS.get(ratio, RATIO_TARGETS["16:9"])
    bg_desc = BACKGROUND_TARGETS.get(background, BACKGROUND_TARGETS["parchemin"])
    horizontal = ratio == "16:9"
    return PREMIUM_PREAMBLE + f"""
STYLE RULES (NON-NEGOTIABLE) :
- Flat editorial illustration, NOT 3D, NOT photorealistic, NOT cartoon
- {bg_desc}
  Rouge #cc2200 / vert #4caf7d UNIQUEMENT pour un verdict.
- Multi-panels : bordure fine, numerotees, montrant la PROGRESSION temporelle du beat
  (gauche->droite). Timestamp dans un coin de chaque panel.
- NO subtitles, NO voiceover text inside panels (sauf labels data/geo explicitement demandes)

⛔ RATIO DE CHAQUE PANNEAU = LE RATIO DU RENDER ({ratio_desc}) — c'est LE point critique :
- CHAQUE cellule individuelle est un MINI-ECRAN au format {ratio}, PAS une vignette carree.
  {"Chaque panneau est donc plus LARGE que haut (paysage). Compose le contenu de chaque panneau"
   " ETALE HORIZONTALEMENT pour remplir toute la largeur du panneau — le chiffre/heros d'un cote,"
   " les labels/metaphore de l'autre cote, RIEN au centre avec des bords vides." if horizontal else
   "Chaque panneau est au format portrait " + ratio + "."}
- Si tu traduis un seul panneau en plein ecran, il DOIT deja remplir un cadre {ratio} sans bord vide.
  (Un panneau carre force a remplir un ecran {ratio} = bords vides au render = ECHEC.)
- Disposition de la planche : {"si 3 panneaux 16:9 ne tiennent pas sur une rangee sans devenir minuscules,"
  " empile-les sur 2-3 RANGEES (chacun garde son ratio 16:9 large). Le ratio du panneau PRIME sur le"
  " 'tout sur une rangee'." if horizontal else "panneaux en rangee(s) reguliere(s)."}

DISCIPLINE PANNEAUX (NON-NEGOTIABLE — sinon le storyboard est inutilisable) :
- Produis EXACTEMENT le nombre d'etats decrits dans le prompt, ni plus ni moins. N'AJOUTE
  AUCUN panneau supplementaire, AUCUN agrandissement, AUCUN "zoom plein cadre", AUCUN doublon
  d'un etat deja montre. Si le prompt decrit 3 etats -> 3 cellules, point final.
- Cadres ETANCHES : chaque element reste DANS sa cellule. RIEN ne deborde ni ne chevauche
  une cellule voisine (pas de barre/objet qui traverse deux panneaux).
- Disposition reguliere : cellules de MEME taille, alignees en une grille propre (1 rangee si
  3 etats tiennent ; sinon grille reguliere). Pas de grande case isolee a cote de petites.
- TOUT le texte EN FRANCAIS (titres, labels, annotations). AUCUN mot anglais (jamais "CRUSHES",
  "RESERVES" ok car francais). Les labels = ceux du prompt, traduits si besoin.
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--episode", required=True)
    ap.add_argument("--beat", type=int, required=True)
    ap.add_argument("--prompt-file", required=True,
                    help="Fichier texte avec le prompt storyboard (redige par Claude, valide par Aziz)")
    ap.add_argument("--ratio", default="16:9", choices=list(RATIO_TARGETS.keys()),
                    help="Ratio cible du RENDER (defaut 16:9 horizontal). ⛔ Doit matcher le format de sortie "
                         "(sinon panneaux mal cadres + faux-bas gate review). 9:16 = Short, 1:1 = carrousel.")
    ap.add_argument("--background", default="parchemin", choices=list(BACKGROUND_TARGETS.keys()),
                    help="Registre de fond (defaut parchemin). 'libre' = Gemini choisit le fond (exploration hors parchemin).")
    ap.add_argument("--out", default=None, help="Override chemin de sortie")
    args = ap.parse_args()

    prompt_path = Path(args.prompt_file)
    if not prompt_path.exists():
        print(f"[ERROR] Prompt introuvable : {prompt_path}", file=sys.stderr)
        sys.exit(1)
    user_prompt = prompt_path.read_text().strip()

    out_path = Path(args.out) if args.out else (
        PROJECT_ROOT / "public" / "souverain" / args.episode / f"beat{args.beat}" / "storyboard-gemini.png"
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)

    full_prompt = user_prompt + "\n\n" + build_style_block(args.ratio, args.background)

    print(f"=== STORYBOARD GEMINI FLASH — {args.episode} Beat{args.beat} ===")
    print(f"  Modele : {MODEL}")
    print(f"  Ratio  : {args.ratio}  (preambule premium DATA-VIZ injecte — STORYBOARD-DATAVIZ.md)")
    try:
        sortie_disp = out_path.relative_to(PROJECT_ROOT)
    except ValueError:
        sortie_disp = out_path  # --out hors repo (ex /tmp) : afficher le chemin absolu
    print(f"  Sortie : {sortie_disp}")
    print(f"  Prompt : {len(full_prompt)} chars\n")

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model=MODEL,
        contents=[full_prompt],
        config=types.GenerateContentConfig(response_modalities=["image", "text"]),
    )

    saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            img = Image.open(io.BytesIO(part.inline_data.data))
            img.save(out_path)
            print(f"[OK] Storyboard sauve : {out_path}")
            print(f"     Taille : {img.size}, mode : {img.mode}")
            saved = True
            break
        elif hasattr(part, "text") and part.text:
            print(f"[text] {part.text[:200]}")

    if not saved:
        print("[ERROR] Aucune image retournee par Gemini.", file=sys.stderr)
        sys.exit(1)

    print(f"\n[NEXT] Presenter le storyboard a Aziz. Apres validation :")
    print(f"       python3 scripts/beat-session.py --episode {args.episode} --beat {args.beat} --phase breakdown")


if __name__ == "__main__":
    main()
