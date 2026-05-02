#!/usr/bin/env python3
"""
Kimi K2.5 pre-composition review for Atlas Mansa Moussa.
Text-only call (no video yet - we want composition guidance BEFORE coding).
Strict brief with hard caps + read-only context.
"""

import sys
import os
import json
from pathlib import Path

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

PROJECT_ROOT = Path(__file__).parent.parent
ALIGNMENT_PATH = PROJECT_ROOT / "out" / "atlas-mansa-moussa" / "narration-v3-alignment.json"

with open(ALIGNMENT_PATH) as f:
    alignment = json.load(f)

words = alignment.get("words", [])
keywords_of_interest = {
    "Mali", "Mali,", "Mali.", "Tombouctou", "Sankore", "Sankoré",
    "moitie", "moitié", "Caire", "Mecque", "Mecque.",
    "couronnement,", "Douze", "douze", "soixante", "chameaux",
    "Mansa", "Moussa", "Moussa.", "Rockefeller,", "Bezos,", "Musk.",
    "secret.", "ca.", "s'effondrer", "s'effondre.", "homme",
}
key_timings = []
for w in words:
    text = w.get("text", "").strip()
    if text in keywords_of_interest:
        key_timings.append(f"  {w['start']:6.2f}s -> {w['end']:6.2f}s : '{text}'")

key_timings_str = "\n".join(key_timings)

BRIEF = f"""Tu es un directeur artistique senior video / motion graphics, specialise en cartographie narrative pour Shorts YouTube.

# CONTEXTE — LECTURE SEULE (NE PAS REMETTRE EN QUESTION)

Aziz produit une chaine YouTube francophone "Atlas Geoafrique" — format Shorts 1080x1920, 80 secondes, narration cesar (densite haute, faits geo-record).

**Pilote 1 livre** : Tombouctou (Atlas V8 valide 2026-04-29).
**Episode 2 en production** : Mansa Moussa et l'or du Mali XIVe siecle.

## Style fige (NE PAS proposer de changer)
- Globe Parchemin Mande + ocean indigo `#1F2A4A` + relief 3D + halo dore `#D4A574`
- Palette : terracotta `#A85A3A` -> `#C4995A`, indigo `#1F2A4A`, dore `#D4A574`, creme parchemin `#F2E5C8`
- Typographie globale Helvetica 900 + Cinzel/Cormorant Bold pour chiffres-choc

## Stack technique fige (NE PAS proposer hors-stack)
- Remotion 4.0.452 + mapbox-gl 3.22 + react-map-gl 8.1
- Voix : Narratrice GeoAfrique v2 (eleven_v3, stability 0.22, style 0.55)
- Pattern overlay pays anime : SVG React + `map.project()` + Natural Earth 50m (PAS Mapbox addLayer en globe headless — ne fonctionne pas)

## Decisions deja arretees (NE PAS proposer ces idees)
- Skip nuages mer / grain papier sur mer (test V8 echoue, ajoute du bruit)
- Skip cliquetis or (conflit avec SFX D thud)
- Skip bulle info flottante (medaillon existant suffit, evite surcharge ecran 9:16)
- Skip Three.js / WebGL custom / Lottie

## Features deja adoptees pour Mansa Moussa (sont DANS le plan)
1. Rotation bearing continue post-zoom (~5°/s)
2. Multi-segment fly-to (4 keyframes au lieu de 3)
3. Pulse markers villes (Mali / Caire / Mecque)
4. Police Cinzel/Cormorant Bold sur chiffres-choc
5. Trace progressif route caravane (SVG dasharray, Mali -> Caire -> Mecque)
6. Pitch 60° pendant traversee Sahara
7. SFX vent Sahara diegetic (scene 3)
8. Drapeau Mali (deja pattern V8)
9. 2 portraits Mansa Moussa A/B (Paper-Craft vs BD flat) en medaillon scene 5
10. Asset Gemini Gizeh / Le Caire en medaillon scene 4

# DONNEES FOURNIES

## Script V3 LOCKED (avec tags eleven_v3 + duree 81.04s mesuree)

Hook (0-4s) : [mysterious] Cet homme a fait s'effondrer le cours de l'or pendant douze ans.

Scene 1 Setup (4-16s) : [fast] Mali, mille trois cent vingt-quatre. Tu regardes une carte d'Afrique de l'Ouest. Cette zone-la, c'est l'empire du Mali. Plus grand que l'Europe occidentale. [curious] Et il a un secret.

Scene 2 Densite (16-34s) : [fast] A cette epoque, le Mali produit la moitie de l'or qui circule dans le monde. [serious] La moitie. [fast] Tombouctou compte plus de bibliotheques que Paris. L'universite de Sankore accueille vingt-cinq mille etudiants. Pendant ce temps, la Sorbonne en a deux mille.

Scene 3 Climax Hadj (34-50s) : [dramatic] Mais le moment qui marque l'histoire, c'est ca. [fast] Douze ans apres son couronnement, l'empereur du Mali part a La Mecque. Avec lui : soixante mille hommes. Douze mille esclaves. Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur.

Scene 4 Consequence (50-62s) : [fast] Sur la route, il distribue tellement d'or au Caire que l'economie egyptienne s'effondre. Pendant douze ans, le prix de l'or chute dans toute la Mediterranee. [serious] Un seul homme. Un continent qui s'effondre.

Scene 5 CTA (62-81s) : [confident] Cet homme s'appelait Mansa Moussa. [fast] Demande qui est l'homme le plus riche de l'histoire. On te repondra Rockefeller, Bezos, Musk. [dramatic] Et pourtant, la vraie reponse, c'est Mansa Moussa.

## Forced alignment — timestamps cles (extraits)

```
{key_timings_str}
```

## Audio assets disponibles
- Narration MP3 81.04s (volume 1.0, dominante)
- Musique Mande Contemplatif (kora + balafon, volume 0.04, fade 2s in/out)
- SFX B impact stamp (0.8s) - reutilisable 3x pour Mali / Caire / Mecque
- SFX C ink-draw (2.5s) - trace caravane scene 3
- SFX D cartouche thud (0.7s) - reutilisable sur 4-5 stats
- SFX E vent Sahara (6.0s) - scene 3 traversee desert

## Coordonnees geographiques disponibles
- Mali centroid : ~lon=-3.5, lat=17 (variable selon polygone Natural Earth)
- Tombouctou : lon=-3.0026, lat=16.7666
- Le Caire : lon=31.2357, lat=30.0444
- La Mecque : lon=39.8262, lat=21.4225
- Polygones GeoJSON Natural Earth 50m disponibles : MLI (deja extrait), DZA / EGY / MAR / TCD a extraire si retenus

# CE QUE JE TE DEMANDE — 3 QUESTIONS PRECISES

## Q1 — Composition scene par scene (TABLEAU)

Pour chacune des 6 scenes (Hook / S1 Setup / S2 Densite / S3 Climax Hadj / S4 Consequence / S5 CTA), donne-moi :
- KEYFRAME camera (lon, lat, zoom, pitch, bearing)
- Overlay principal (1 element max, ce qui doit etre VU dominamment)
- Timing relatif au mot-cle (utilise les timestamps fournis)
- Easing recommande (cubic / spring damping X)

## Q2 — Detection de scene plate

Avec le plan actuel (10 features adoptees + 4 SFX + musique), y a-t-il UNE scene qui risque d'etre visuellement faible ? Si oui :
- Quelle scene
- Pourquoi (en 2 phrases max)
- UN seul remede dans le budget existant ($0 ou $0.07 max — un asset Gemini supplementaire seulement)

## Q3 — Coherence audio-visuel sur les moments [serious]

Trois moments cles utilisent le tag [serious] :
- "La moitie." (scene 2, ~22.6s)
- "Un seul homme. Un continent qui s'effondre." (scene 4, ~60-62s)

Quel traitement visuel renforce ces 2 micro-moments SANS rajouter d'asset ? (effet camera / overlay typo / freeze / blur / variation de bearing / etc.)

# CONTRAINTES DURES (HARD CAPS)

- Budget assets restant : **$0.21 MAX** (Gizeh medaillon + 2 portraits Mansa Moussa A/B). Pas un cent de plus.
- Pas d'asset additionnel non liste ci-dessus
- Si tu proposes un truc hors-budget ou hors-stack : marque-le explicitement `[OUT-OF-SCOPE]` en debut de ligne
- Si tu n'as pas de reponse sourcee, dis "intuition" plutot que d'inventer une reference
- Reponses concises : tableaux > prose. Listes > paragraphes.

# FORMAT DE REPONSE ATTENDU

```
## Q1 — Composition par scene
[Tableau Markdown : Scene | Camera | Overlay | Timing mot-cle | Easing]

## Q2 — Scene plate
Scene : ...
Pourquoi : ...
Remede ($0 / $0.07) : ...

## Q3 — Traitement [serious]
Moment 1 "La moitie." : ...
Moment 2 "Un seul homme..." : ...

## [OUT-OF-SCOPE] (optionnel)
- ...
```

Sois rigoureux. Cette review evite 60-90min de re-render si une scene foire.
"""


def main():
    print(f"Brief size: {len(BRIEF)} chars")
    print(f"Key timings extracted: {len(key_timings)} entries")
    print()
    print("Sending to Kimi K2.5 (text-only pre-composition review)...")

    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": BRIEF}],
        "max_tokens": 16384,
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
    # Debug: dump full response if content is empty
    raw_path = PROJECT_ROOT / "out" / "atlas-mansa-moussa" / "kimi-raw-response.json"
    raw_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Raw response dumped: {raw_path}")
    msg = result["choices"][0]["message"]
    review = msg.get("content") or ""
    if not review and "reasoning_content" in msg:
        review = msg["reasoning_content"]
    if not review:
        print(f"WARNING: empty content. Message keys: {list(msg.keys())}")
    usage = result.get("usage", {})

    print("\n" + "=" * 70)
    print("KIMI K2.5 PRE-COMPOSITION REVIEW — Atlas Mansa Moussa")
    print("=" * 70)
    print(review)
    print("=" * 70)

    if usage:
        prompt_tokens = usage.get("prompt_tokens", 0)
        completion_tokens = usage.get("completion_tokens", 0)
        total = usage.get("total_tokens", 0)
        # Kimi K2.5 pricing (Moonshot 2026): ~$0.60/M input, ~$2.50/M output (approximate)
        cost = prompt_tokens * 0.60 / 1_000_000 + completion_tokens * 2.50 / 1_000_000
        print(f"\nTokens: prompt={prompt_tokens}, completion={completion_tokens}, total={total}")
        print(f"Estimated cost: ~${cost:.4f}")

    out_path = PROJECT_ROOT / "out" / "atlas-mansa-moussa" / "kimi-precomposition-review.md"
    out_path.write_text(
        f"# Kimi K2.5 Pre-Composition Review — Atlas Mansa Moussa\n\n{review}\n",
        encoding="utf-8"
    )
    print(f"\nReview saved: {out_path}")


if __name__ == "__main__":
    main()
