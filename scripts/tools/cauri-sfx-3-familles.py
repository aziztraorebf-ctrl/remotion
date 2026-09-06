#!/usr/bin/env python3
"""Genere les 3 familles sonores de test pour la piece "Le cauri" (8 sons chacune).

Chaque son est cale sur un GESTE MESURE par scripts/tools/sfx-cues.py sur le rendu
final (piece_v5.mp4), pas invente : voir la colonne "debut" ci-dessous. Deux verdicts
de l'outil ont ete corriges a la main (il dit OU l'image bouge, jamais CE QUE CA VEUT
DIRE) : le geste le plus intense de la piece tombait dans l'etat 7 "le calme" (c'est
la remontee du zoom de la boucle) -> corrige en RETOMBEE qui descend ; et l'outil ne
voyait presque rien a l'effondrement (etat 6, le pic dramatique) -> impact place a la
main sur le geste mesure le plus proche.

Usage : python3 scripts/tools/cauri-sfx-3-familles.py [--dry-run]
Lit ELEVENLABS_API_KEY depuis .env. Ecrit dans out/_r-and-d/cauri/son/<famille>/.
"""
import os
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent.parent
for line in (ROOT / ".env").read_text().splitlines():
    if line.startswith("ELEVENLABS_API_KEY="):
        os.environ["ELEVENLABS_API_KEY"] = line.split("=", 1)[1].strip()

API_KEY = os.getenv("ELEVENLABS_API_KEY")
URL = "https://api.elevenlabs.io/v1/sound-generation"
OUT_ROOT = ROOT / "out" / "_r-and-d" / "cauri" / "son"

# (nom, debut_s, duree_s, role) — le plan, identique pour les 3 familles
PLAN = [
    ("lit",         0.00, 20.60, "texture continue tout du long, tres bas"),
    ("objet",       0.60,  1.20, "etat 1 : la coquille seule"),
    ("semis",       2.67,  1.00, "etat 2 : demultiplication (geste mesure f80-104)"),
    ("alignement",  6.00,  1.20, "etat 3 : GESTE LONG, duree = duree du geste (R7)"),
    ("colonne",    10.70,  0.80, "etat 4 : accumulation, montee"),
    ("deversement",13.50,  1.00, "etat 5 : 1845, le flux court"),
    ("impact",     16.07,  1.20, "etat 6 : APRES le creux (couper le lit 15.57-17.27s)"),
    ("retombee",   18.93,  1.60, "etat 7 : la boucle. DESCEND, ne monte pas"),
]

FAMILLES = {
    "matiere": {
        "lit":         "Very low distant ocean swell, soft continuous air movement, almost inaudible, no waves breaking, no music",
        "objet":       "A single small seashell placed gently on a hard surface, one soft dry click, intimate, close-miked, no music",
        "semis":       "A handful of small cowrie shells scattering onto stone, dry clicks spreading apart, sparse, no music",
        "alignement":  "Many small shells sliding into a continuous stream over stone, dry granular texture, sustained, no music",
        "colonne":     "Small shells stacking and settling into a pile, accumulating dry clicks rising in density, no music",
        "deversement": "A heavy sack of shells poured out at once, dense low rushing cascade, no music",
        "impact":      "A tall pile of shells collapsing, single dry crash then scattering debris, no music",
        "retombee":    "Last few shells settling and coming to rest, sparse clicks fading to stillness, no music",
    },
    "monnaie": {
        "lit":         "Very low room tone, deep neutral hum, almost inaudible, no music",
        "objet":       "A single coin set down on wood, one clear soft chime, intimate, no music",
        "semis":       "A few coins dropped one by one on a counting table, spaced metallic clicks, no music",
        "alignement":  "Coins being counted rapidly in a continuous run, steady metallic ticking, sustained, no music",
        "colonne":     "Coins stacking into a tall column, accumulating clicks rising in pitch and density, no music",
        "deversement": "A large quantity of coins poured from a sack, dense metallic cascade, overwhelming, no music",
        "impact":      "A tall stack of coins collapsing across a table, single crash then rolling and scattering, no music",
        "retombee":    "Last coins spinning to a stop on wood, slowing wobble settling into silence, no music",
    },
    "abstrait": {
        "lit":         "Deep sub bass sine drone, very low level, clean and steady, no melody, no music",
        "objet":       "Single clean high-pitched synthetic tick, short dry decay, minimal UI sound, no music",
        "semis":       "Sparse scattered synthetic ticks, high-pitched, dry, spreading apart in space, no music",
        "alignement":  "Continuous fine granular synthetic texture, high-pitched particles streaming, sustained, no music",
        "colonne":     "Rising sequence of synthetic ticks accumulating into dense pulse, building, no music",
        "deversement": "Dense low synthetic rush, dark granular flood arriving fast, no music",
        "impact":      "Single deep synthetic impact, dry and clean, short tail, no reverb wash, no music",
        "retombee":    "Sparse synthetic ticks slowing and fading, descending into silence, no music",
    },
}


def generate(out_path: Path, prompt: str, duration: float) -> bool:
    duration = max(0.5, min(30.0, duration))
    payload = {"text": prompt, "duration_seconds": duration, "prompt_influence": 0.5}
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    print(f"-> {out_path.relative_to(ROOT)} ({duration}s)")
    r = requests.post(URL, json=payload, headers=headers, timeout=120)
    if r.status_code != 200:
        print(f"   ERROR {r.status_code}: {r.text[:300]}")
        return False
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(r.content)
    print(f"   OK ({len(r.content)} bytes)")
    return True


def main() -> int:
    dry = "--dry-run" in sys.argv
    total = len(PLAN) * len(FAMILLES)
    print(f"Plan : {len(FAMILLES)} familles x {len(PLAN)} sons = {total} generations")
    if dry:
        for fam in FAMILLES:
            for nom, debut, duree, role in PLAN:
                print(f"  [{fam}] {nom:<12} t={debut:>5.2f}s dur={duree:>5.2f}s | {role}")
        print("\n--dry-run : rien de genere, rien de facture.")
        return 0

    if not API_KEY:
        print("ERROR: ELEVENLABS_API_KEY manquante")
        return 1

    ok = True
    for fam, prompts in FAMILLES.items():
        for nom, debut, duree, role in PLAN:
            out = OUT_ROOT / fam / f"{nom}.mp3"
            if out.exists():
                print(f"-> {out.relative_to(ROOT)} deja present, skip")
                continue
            ok = generate(out, prompts[nom], duree) and ok
            time.sleep(0.6)  # eviter le rate-limit
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
