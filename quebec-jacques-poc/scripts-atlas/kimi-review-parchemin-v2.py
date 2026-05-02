#!/usr/bin/env python3
"""
Review Atlas Parchemin Mande v2 (video + reference image) with Kimi K2.5.
Sends the rendered MP4 + the reference target image, asks for cartographic critique.
"""

import sys
import os
import base64
import json
from pathlib import Path

# Load .env from project root
env_path = Path(__file__).parent.parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

import requests

MOONSHOT_KEY = os.environ.get("MOONSHOT_API_KEY", "")
if not MOONSHOT_KEY:
    print("ERROR: MOONSHOT_API_KEY not set")
    sys.exit(1)

BRIEF = """Tu es un directeur artistique cartographique senior, specialise dans les cartes narratives stylisees pour video YouTube.

# CONTEXTE DU PROJET

Aziz produit une nouvelle chaine YouTube francophone "Atlas Geoafrique" - format Shorts 1080x1920, 60-80 secondes, narration voix-off cesar (densite haute, faits geo-record).

Premier episode pilote : **Tombouctou** (Mali) - histoire de la bibliotheque de Sankore, 25 000 etudiants au 13e siecle, plus que Oxford a la meme epoque.

Style choisi apres comparison de 4 directions visuelles : **B Parchemin Mande** - inspire :
- Vieilles cartes au papier vieilli
- Motifs textiles Mande (mudcloth/Bogolan)
- Symboles Adinkra
- Palette ocre/terracotta/indigo
- Identite culturelle ouest-africaine forte (differenciation maximale vs cartes Mapbox standard)

# CE QUE TU REGARDES

1. **REFERENCE TARGET (image PNG)** : la cible visuelle ideale, design produit par un artiste pour le pitch initial. C'est ce vers quoi on veut tendre.

2. **VIDEO MP4 v2 actuelle (8 secondes, 240 frames)** : premiere implementation Mapbox+Remotion. Animation : zoom progressif (zoom 1.8 vue espace -> zoom 7 gros plan Tombouctou) + marker Tombouctou + label.

# CE QUE JE VEUX QUE TU EVALUES

## 1. ANIMATION & MOUVEMENT
- Le mouvement est-il evident ? Ressemble-t-il a une carte vivante ou a une image fixe avec un crop anime ?
- L'amplitude de zoom (1.8 -> 7) est-elle suffisante / trop / pas assez ?
- Le timing des keyframes (0 / 4s / 8s) est-il bon pour une narration cesar ?
- L'apparition du marker au frame 200 (~6.7s) est-elle bien timee ?

## 2. ESTHETIQUE PARCHEMIN MANDE
- A quel pourcentage la video v2 ressemble-t-elle a la reference ?
- Quels elements de la reference sont presents ? Lesquels manquent ?
- La palette terracotta/ocre/creme/indigo fonctionne-t-elle ?
- La distinction terre/ocean est-elle suffisante (ocean creme #E8DBB0 vs terre terracotta) ?

## 3. ELEMENTS MANQUANTS IMPORTANTS
On sait que ces elements manquent (probleme technique de filtrage Mapbox - sera resolu via upload sur Mapbox Studio) :
- Niger River en bleu indigo (qui passe juste au sud de Tombouctou)
- Label "SAHARA DESERT" en ocre
- Label "Niger River" en italique
- Bordures decoratives mudcloth/Adinkra autour de la carte (overlay Remotion, pas dans le style.json)

Mais : **a part ces elements connus, qu'est-ce qui manque selon toi ?** Brainstorme des idees auxquelles on n'a peut-etre pas pense :
- Texture papier (grain, taches sepia, vieillissement) ?
- Effets atmospheriques sur le Sahara (wash aquarelle ocre dans le nord) ?
- Cartouche decorative avec les chiffres "25 000 etudiants" ?
- Compass rose / vent rose ?
- Routes commerciales transsahariennes (lignes pointillees) ?
- Icones de chameaux, mosquees, manuscrits ?
- Vignette / vignettage pour donner profondeur ?

## 4. PROBLEMES VISIBLES
- Le marker Tombouctou final : le label se superpose mal au cercle indigo ? La position est-elle bonne ?
- Le frame final (zoom 7) montre uniquement un blob terracotta uniforme avec le label flottant. Manque-t-il du contexte geographique critique ?
- Logo Mapbox visible en bas-gauche (TOS Mapbox - on doit le garder, mais peut-etre l'integrer plus discretement ?)

## 5. RECOMMANDATIONS PRIORISEES
Donne-moi :
- TOP 3 ameliorations a faire EN PRIORITE pour la prochaine iteration
- TOP 3 idees creatives auxquelles on n'a peut-etre pas pense
- Note sur 10 vs la reference cible
- Verdict : continue ainsi / pivot necessaire / repenser le concept ?

Sois honnete et critique. Si la direction est bonne mais l'execution faible, dis-le. Si la direction elle-meme est a remettre en question, dis-le aussi.
"""


def encode_file(filepath: Path) -> tuple[str, str]:
    ext = filepath.suffix.lower()
    mime_map = {
        ".mp4": "video/mp4",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }
    mime_type = mime_map[ext]
    with open(filepath, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    size_mb = len(data) * 3 / 4 / 1024 / 1024
    print(f"  {filepath.name} ({size_mb:.1f} MB, {mime_type})")
    return data, mime_type


def main():
    project_root = Path(__file__).parent.parent
    video_path = project_root / "out" / "perf-test" / "atlas-parchemin-v2-amplitude-marker.mp4"
    ref_path = project_root / "out" / "perf-test" / "kimi-frames" / "REF-parchemin-mande.png"

    if not video_path.exists():
        print(f"ERROR: video not found: {video_path}")
        sys.exit(1)
    if not ref_path.exists():
        print(f"ERROR: reference not found: {ref_path}")
        sys.exit(1)

    print("\nEncoding files...")
    video_b64, video_mime = encode_file(video_path)
    ref_b64, ref_mime = encode_file(ref_path)

    print("\nSending to Kimi K2.5 (Moonshot API)...")
    print(f"Brief size: {len(BRIEF)} chars")

    content = [
        {
            "type": "text",
            "text": "[REFERENCE TARGET - design vise]"
        },
        {
            "type": "image_url",
            "image_url": {"url": f"data:{ref_mime};base64,{ref_b64}"}
        },
        {
            "type": "text",
            "text": "[VIDEO V2 ACTUELLE - implementation Mapbox+Remotion 8s 1080x1920]"
        },
        {
            "type": "video_url",
            "video_url": {"url": f"data:{video_mime};base64,{video_b64}"}
        },
        {
            "type": "text",
            "text": BRIEF
        }
    ]

    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 4096,
        "temperature": 1,
    }

    response = requests.post(
        "https://api.moonshot.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {MOONSHOT_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=300,
    )

    if response.status_code != 200:
        print(f"\nERROR {response.status_code}: {response.text[:500]}")
        sys.exit(1)

    result = response.json()
    review = result["choices"][0]["message"]["content"]
    usage = result.get("usage", {})

    print("\n" + "=" * 70)
    print("KIMI K2.5 REVIEW - Atlas Parchemin Mande v2")
    print("=" * 70)
    print(review)
    print("=" * 70)

    if usage:
        print(f"\nTokens: prompt={usage.get('prompt_tokens')}, completion={usage.get('completion_tokens')}, total={usage.get('total_tokens')}")

    out_path = project_root / "out" / "perf-test" / "kimi-review-parchemin-v2.md"
    out_path.write_text(f"# Kimi K2.5 Review - Atlas Parchemin Mande v2\n\n{review}\n", encoding="utf-8")
    print(f"\nReview saved: {out_path}")


if __name__ == "__main__":
    main()
