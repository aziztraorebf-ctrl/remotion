"""
kimi-video-compare.py — Test COMPARATIF via Kimi K2.5 natif (Moonshot API, vidéo en base64).

Pendant Gemini Files API (da-compare.py), Kimi n'a jamais eu d'équivalent vidéo-native fonctionnel
dans ce repo (liens HTTP publics REFUSÉS par l'API Moonshot — confirmé 2026-07-18, seul base64 ou
ms://file_id fonctionnent). Ce script envoie 2 vidéos COMPLÈTES en base64 à Kimi K2.5, même gabarit
de question que da-compare.py (référence qui marche vs nouveau qui décolle pas).

Fix IPv4 importé automatiquement (force_ipv4.py) — plus besoin du wrapper run_ipv4.py en CLI.

Downscale les 2 vidéos AVANT appel (ex. 720p CRF 28) — le payload base64 gonfle la taille de ~33%,
un fichier full-HD ferait exploser le payload JSON.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel réseau (IPv6 mort en sandbox)

import json
import base64
import argparse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = "/tmp/da-refs"
KIMI_MODEL = "kimi-k2.5"
MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions"

COMPARE_TEMPLATE = """RÔLE
Tu es directeur artistique expert en motion design cartographique documentaire (war-map géopolitique :
carte parchemin permanente, contrôle territorial, GRAMMAIRE CAUSALE — les acteurs AGISSENT, le territoire
change ; jamais d'état qui pop). Analyste lucide, sans concession, pas flatteur.

CONTEXTE
Les DEUX vidéos sont faites avec EXACTEMENT le même moteur/stack (Remotion + Mapbox reskin parchemin),
la même palette, la même grammaire visuelle. Elles racontent des choses DIFFÉRENTES — ne compare pas
"la même histoire", compare la MAÎTRISE DE LA GRAMMAIRE.
- VIDÉO 1 (RÉFÉRENCE) = un travail VALIDÉ qui FONCTIONNE de bout en bout. L'étalon de qualité.
- VIDÉO 2 (NOUVEAU) = ne décolle PAS — sans qu'on sache exactement pourquoi.

QUESTION CENTRALE
Puisque stack et palette sont IDENTIQUES, ils n'expliquent PAS l'écart. Qu'est-ce que la RÉFÉRENCE
fait bien que le NOUVEAU rate ? Axes : lisibilité oeil-neuf (la cause est-elle visible ?) ·
combinaison de l'arsenal · rythme audio/visuel · échelle ancrée carte · densité (1 foyer à la fois).

FORMAT
1. Classement des différences, de LA PLUS DÉTERMINANTE à la moins importante.
2. Diagnostic SPÉCIFIQUE du point qui bloque (mouvement / rythme / lisibilité) : qu'est-ce qui le
   rend "raté", et comment la référence fait-elle mieux ? Très concret.
3. Les 3-4 corrections les PLUS RENTABLES pour amener le NOUVEAU au niveau de la référence
   (réalisables dans la stack : Mapbox drift/zoom frame-driven, SVG maison, icônes Lucide, GeoFlowConnection,
   ArrivalLabel, teintes de contrôle territorial, PixelLab si besoin — PAS d'After Effects/3D/blur).
4. VERDICT TRANCHÉ : le VRAI problème n°1 ? Y a-t-il un FAUX coupable ? Sauvable par ajustements, ou
   CONCEPT à repenser ?
Sois précis et honnête, on veut la VRAIE cause."""


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def to_data_url(path):
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:video/mp4;base64,{b64}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help="Chemin .mp4 référence (downscalé)")
    ap.add_argument("--new", required=True, help="Chemin .mp4 nouveau (downscalé)")
    ap.add_argument("--label", required=True)
    ap.add_argument("--question", default=None)
    ap.add_argument("--max-tokens", type=int, default=16000)  # Kimi thinking model, jamais <16000
    args = ap.parse_args()

    load_env()
    key = os.getenv("MOONSHOT_API_KEY")
    if not key:
        print("[ERREUR] MOONSHOT_API_KEY absente"); sys.exit(1)
    if not os.path.exists(args.ref):
        print(f"[ERREUR] --ref introuvable: {args.ref}"); sys.exit(1)
    if not os.path.exists(args.new):
        print(f"[ERREUR] --new introuvable: {args.new}"); sys.exit(1)

    ref_size = os.path.getsize(args.ref) / 1024 / 1024
    new_size = os.path.getsize(args.new) / 1024 / 1024
    print(f"[kimi-video] ref={ref_size:.1f}Mo new={new_size:.1f}Mo (downscale AVANT appel recommandé si >5Mo)")

    print("[kimi-video] encodage base64...")
    ref_url = to_data_url(args.ref)
    new_url = to_data_url(args.new)

    prompt = args.question or COMPARE_TEMPLATE
    payload = {
        "model": KIMI_MODEL,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "VIDÉO 1 — RÉFÉRENCE (celle qui MARCHE) :"},
                {"type": "video_url", "video_url": {"url": ref_url}},
                {"type": "text", "text": "VIDÉO 2 — NOUVEAU TRAVAIL (marche moins bien) :"},
                {"type": "video_url", "video_url": {"url": new_url}},
                {"type": "text", "text": prompt},
            ],
        }],
        "max_tokens": args.max_tokens,
        "temperature": 1,  # Kimi K2.5 n'accepte QUE temperature=1 (erreur explicite sinon)
    }
    req = urllib.request.Request(
        MOONSHOT_URL, data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    print("[kimi-video] envoi à Kimi K2.5 (2 vidéos base64)...")
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"[kimi-video] HTTP {e.code}: {body[:1000]}")
        sys.exit(1)
    msg = data["choices"][0]["message"]
    text = msg.get("content") or msg.get("reasoning_content") or "[vide]"

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"kimi-compare-{args.label}.md")
    open(out, "w", encoding="utf-8").write(text)
    print(f"\n[kimi-video] -> {out} ({len(text)} chars)")


if __name__ == "__main__":
    main()
