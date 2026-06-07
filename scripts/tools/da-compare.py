#!/usr/bin/env python3
"""
da-compare.py — Test COMPARATIF : compare un NOUVEAU travail à une RÉFÉRENCE VALIDÉE.

Envoie 2 VIDÉOS COMPLÈTES à Gemini 3.1 Pro (Files API — lui seul ingère la vidéo entière,
pas juste des frames → capte le MOUVEMENT et le RYTHME). Brief : "la référence marche, le
nouveau non, MÊME stack — qu'est-ce qui DIFFÈRE vraiment ?". Isole la vraie cause au lieu de
blâmer un faux coupable (ex. la palette — leçon Sahel 2026-06-07 : vrai pb = fragmentation géo).

Gemini SEULEMENT (Kimi = frames only). À lancer aux MOMENTS-CLÉS (doute qu'un travail atteigne
le niveau de la référence, validation d'un acte/template), pas à chaque petit fix.

Modèle VERROUILLÉ : gemini-3.1-pro-preview.

Usage :
  python3 scripts/tools/da-compare.py \\
    --ref <pilier|chemin.mp4> --new chemin-nouveau.mp4 --label warmap-acte1 \\
    [--question "texte question custom"] [--expert] [--no-aislop]

Références par pilier (--ref warmap|atlas|souverain) : voir REFERENCES ci-dessous.
"""
import os
import sys
import time
import argparse

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = "/tmp/da-refs"
GEMINI_MODEL = "gemini-3.1-pro-preview"

# Références validées par pilier (LA vidéo qui MARCHE, étalon de qualité).
# Mettre à jour quand une nouvelle référence est validée par Aziz.
REFERENCES = {
    "warmap": "out/_r-and-d/sudan-warmap-epic60-v4.mp4",   # Soudan = étalon war-map (catbox 4dwqit)
    # "atlas": "...",     # à remplir : Mansa Moussa ou Ghana validé
    # "souverain": "...", # à remplir : un beat Souverain validé
}

DEFAULT_QUESTION = """RÔLE
Tu es directeur artistique expert en motion design cartographique documentaire. On te soumet
une énigme de diagnostic. Analyste, pas flatteur.

CONTEXTE
Deux vidéos faites avec EXACTEMENT le même moteur/stack (Remotion + Mapbox reskin parchemin),
la même palette, les mêmes types d'éléments.
- VIDÉO 1 (RÉFÉRENCE) : celle-ci FONCTIONNE — lisible, premium, on comprend l'action.
- VIDÉO 2 (NOUVEAU TRAVAIL) : celle-ci marche MOINS bien — chargée/confuse/moins premium.

QUESTION CENTRALE
Puisque stack et palette sont IDENTIQUES, ces facteurs ne peuvent PAS seuls expliquer l'écart.
=> Qu'est-ce qui DIFFÈRE RÉELLEMENT et explique que la 1 marche et la 2 non ?
Analyse : cadrage/format, granularité géographique, densité d'éléments simultanés, ratio
carte/espace négatif, échelle des éléments, rythme/mouvement (tu vois les vidéos en entier).

FORMAT
1. Classement des différences, de LA PLUS DÉTERMINANTE à la moins importante.
2. Les 3 corrections les PLUS RENTABLES pour rapprocher la vidéo 2 du niveau de la 1
   (réalisables en Remotion/Mapbox : SVG, opacité, couleurs, cadrage, densité, timing —
   PAS d'After Effects/3D).
3. Verdict tranché : quel est le VRAI problème n°1 ? Y a-t-il un FAUX coupable évident ?
Sois précis et honnête, on veut la VRAIE cause."""


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def resolve_ref(ref):
    if ref in REFERENCES:
        path = os.path.join(ROOT, REFERENCES[ref])
        if not os.path.exists(path):
            print(f"[ERREUR] référence pilier '{ref}' introuvable: {path}"); sys.exit(1)
        return path
    if os.path.exists(ref):
        return ref
    print(f"[ERREUR] --ref doit être un pilier {list(REFERENCES)} ou un chemin .mp4 valide"); sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help=f"Pilier {list(REFERENCES)} ou chemin .mp4 référence")
    ap.add_argument("--new", required=True, help="Chemin .mp4 du nouveau travail à comparer")
    ap.add_argument("--label", required=True, help="Label de sortie")
    ap.add_argument("--question", default=None, help="Question custom (sinon défaut diagnostic)")
    ap.add_argument("--expert", action="store_true", help="Ajouter le point de vue expert")
    ap.add_argument("--no-aislop", action="store_true", help="Désactiver le bloc AI-slop")
    ap.add_argument("--max-tokens", type=int, default=7000)
    args = ap.parse_args()

    load_env()
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("[ERREUR] GEMINI_API_KEY absente"); sys.exit(1)
    ref_path = resolve_ref(args.ref)
    if not os.path.exists(args.new):
        print(f"[ERREUR] --new introuvable: {args.new}"); sys.exit(1)

    # Importer les blocs depuis da-brief (source unique de vérité)
    import importlib.util
    spec = importlib.util.spec_from_file_location("dab", os.path.join(os.path.dirname(__file__), "da-brief.py"))
    dab = importlib.util.module_from_spec(spec); spec.loader.exec_module(dab)

    prompt = args.question or DEFAULT_QUESTION
    if not args.no_aislop:
        prompt += dab.AISLOP_BLOCK
    if args.expert:
        prompt += dab.EXPERT_BLOCK

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        print("[ERREUR] pip install google-genai"); sys.exit(1)

    client = genai.Client(api_key=key)
    print(f"[compare] upload RÉFÉRENCE: {ref_path}")
    ref_file = client.files.upload(file=ref_path)
    print(f"[compare] upload NOUVEAU: {args.new}")
    new_file = client.files.upload(file=args.new)

    # Attendre que les fichiers soient ACTIVE (traitement vidéo Gemini)
    for f in (ref_file, new_file):
        waited = 0
        while f.state and f.state.name == "PROCESSING" and waited < 180:
            time.sleep(5); waited += 5
            f = client.files.get(name=f.name)
        print(f"[compare] {f.name}: {f.state.name if f.state else '?'}")

    print("[compare] envoi à Gemini 3.1 Pro (vidéos complètes)...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            types.Part.from_text(text="VIDÉO 1 — RÉFÉRENCE (celle qui MARCHE) :"),
            types.Part.from_uri(file_uri=ref_file.uri, mime_type="video/mp4"),
            types.Part.from_text(text="VIDÉO 2 — NOUVEAU TRAVAIL (marche moins bien) :"),
            types.Part.from_uri(file_uri=new_file.uri, mime_type="video/mp4"),
            types.Part.from_text(text=prompt),
        ],
        config=types.GenerateContentConfig(max_output_tokens=args.max_tokens, temperature=0.3),
    )
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"da-compare-{args.label}.md")
    open(out, "w", encoding="utf-8").write(resp.text or "[vide]")
    print(f"\n[compare] -> {out} ({len(resp.text or '')} chars)")


if __name__ == "__main__":
    main()
