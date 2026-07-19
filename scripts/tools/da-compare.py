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

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel réseau (IPv6 mort en sandbox)

import time
import argparse

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = "/tmp/da-refs"
GEMINI_MODEL = "gemini-3.1-pro-preview"

# Références validées par pilier (LA vidéo qui MARCHE, étalon de qualité).
# Mettre à jour quand une nouvelle référence est validée par Aziz.
REFERENCES = {
    # ETALON WAR-MAP = Sahel P2 (grammaire causale validée Aziz 2026-06-12) : jetons qui avancent -> sillage
    # rouge -> chute des bases · timeline pleine largeur · contours flash · plaques parchemin · SFX. Montre ~80%
    # de ce qu'on sait faire. Fallback Acte 1 si P2 absente. Catbox P2 gfsa3h.
    "warmap": "out/episodes/warmap-sahel/p2-FINAL.mp4",
    "warmap_acte1": "out/episodes/warmap-sahel/acte1-FINAL.mp4",   # hook allumage pays + jetons + friction (catbox slchjv)
    "atlas": "out/PRET-PUBLICATION/mansa-moussa-atlas-v2-FINAL.mp4",  # Mansa Moussa = etalon Atlas (caravane/route/or)
    # "souverain": "...", # à remplir : un beat Souverain validé
}

# Contexte technique PAR PILIER (figé, modifiable). Seul le contexte change selon --ref ;
# la STRUCTURE de question + le socle d'angles restent identiques -> mêmes résultats partout.
CONTEXT_BY_PILLAR = {
    "warmap": {
        "desc": "war-map géopolitique : carte parchemin permanente, contrôle territorial, GRAMMAIRE CAUSALE "
                "(les acteurs AGISSENT -> le territoire change ; jamais d'état qui pop)",
        "stack": "Remotion + Mapbox reskin parchemin",
        "axes": "lisibilité oeil-neuf (la cause est-elle visible ?) · combinaison de l'arsenal · "
                "rythme audio/visuel · échelle ancrée carte · densité (1 foyer à la fois)",
        "outils": "ARSENAL DISPONIBLE (combiner, jamais 1 seul) : jetons circulaires qui avancent par waypoints "
                  "(acteurs) · sillage rouge révélé derrière eux par mask (territoire qui NAÎT de l'action) · "
                  "sprites Gemini ancrés carte (bases/villes/junte) · effets PixelLab (fumée/explosion) · "
                  "timeline graduée pleine largeur (curseur date) · contour de territoire qui se dessine + flash "
                  "(couleur porteuse de sens) · plaques de noms parchemin (WarMapPlaque) · data qui se MONTRE "
                  "(contour qui se remplit, jamais overlay chiffré) · SFX si support visuel · caméra serrée frame-driven",
    },
    "atlas": {
        "desc": "style Atlas : cartes verticales, géographie historique, sprites pixel art",
        "stack": "Remotion + d3-geo carte parchemin terracotta + sprites PixelLab (or = prospérité)",
        "axes": "usage des SPRITES en mouvement (échelle, ancrage au sol, rapport caméra/sprite, "
                "vitesse, cadence d'anim, direction, transitions entre trajets) · enchaînement/rythme "
                "(respiration, temps morts, climax) · lisibilité/hiérarchie",
        "outils": "d3-geo, SVG, PixelLab, opacité, couleurs, cadrage, timing, track caméra",
    },
    "souverain": {
        "desc": "data-viz documentaire premium : chiffres-événements, comparaisons",
        "stack": "Remotion + Tailwind + D3 utility-only, rendu SVG/React",
        "axes": "hiérarchie data-viz · contraste d'échelle · séquençage · transitions seamless · "
                "discipline chromatique · lisibilité des chiffres",
        "outils": "Tailwind, D3 (scale/array/format), SVG, opacité, timing, spring",
    },
}

# Gabarit FIGÉ universel (la structure qui a produit nos bons résultats). {placeholders} = contexte pilier.
COMPARE_TEMPLATE = """RÔLE
Tu es directeur artistique expert en motion design cartographique documentaire ({desc}).
Analyste lucide, sans concession, pas flatteur.

CONTEXTE
Les DEUX vidéos sont faites avec EXACTEMENT le même moteur/stack ({stack}), la même palette,
la même grammaire visuelle. Elles racontent peut-être des choses DIFFÉRENTES — ne compare pas
"la même histoire", compare la MAÎTRISE DE LA GRAMMAIRE.
- VIDÉO 1 (RÉFÉRENCE) = un travail VALIDÉ qui FONCTIONNE de bout en bout. L'étalon de qualité.
- VIDÉO 2 (NOUVEAU) = ne décolle PAS — sans qu'on sache exactement pourquoi.

QUESTION CENTRALE
Puisque stack et palette sont IDENTIQUES, ils n'expliquent PAS l'écart. Qu'est-ce que la
RÉFÉRENCE fait bien que le NOUVEAU rate ? Axes spécifiques à ce pilier : {axes}.

FORMAT
1. Classement des différences, de LA PLUS DÉTERMINANTE à la moins importante.
2. Diagnostic SPÉCIFIQUE du point qui bloque (mouvement / rythme / lisibilité) : qu'est-ce qui le
   rend "raté", et comment la référence fait-elle mieux ? Très concret.
3. Les 3-4 corrections les PLUS RENTABLES pour amener le NOUVEAU au niveau de la référence
   (réalisables dans la stack : {outils} — PAS d'After Effects/3D).
4. VERDICT TRANCHÉ : le VRAI problème n°1 ? Y a-t-il un FAUX coupable (qu'on croit être le pb mais
   qui n'en est pas un — ex. la palette pour le Sahel) ? Sauvable par ajustements, ou CONCEPT à repenser ?
Sois précis et honnête, on veut la VRAIE cause."""


def build_default_question(pillar):
    """Construit la question depuis le gabarit figé + contexte du pilier."""
    ctx = CONTEXT_BY_PILLAR.get(pillar, CONTEXT_BY_PILLAR["warmap"])
    return COMPARE_TEMPLATE.format(**ctx)


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def resolve_ref(ref):
    """Retourne (chemin_ref, pilier). Si --ref est un pilier connu -> contexte auto.
    Si c'est un chemin .mp4, on tente d'inférer le pilier depuis le chemin, défaut warmap."""
    if ref in REFERENCES:
        path = os.path.join(ROOT, REFERENCES[ref])
        if not os.path.exists(path):
            print(f"[ERREUR] référence pilier '{ref}' introuvable: {path}"); sys.exit(1)
        return path, ref
    if os.path.exists(ref):
        low = ref.lower()
        pillar = ("atlas" if "atlas" in low or "mansa" in low or "ghana" in low or "peste" in low
                  else "souverain" if "souverain" in low or "senegal" in low or "maroc" in low
                  else "warmap")
        return ref, pillar
    print(f"[ERREUR] --ref doit être un pilier {list(REFERENCES)} ou un chemin .mp4 valide"); sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help=f"Pilier {list(REFERENCES)} ou chemin .mp4 référence")
    ap.add_argument("--new", required=True, help="Chemin .mp4 du nouveau travail à comparer")
    ap.add_argument("--label", required=True, help="Label de sortie")
    ap.add_argument("--question", default=None, help="Question custom (sinon gabarit figé du pilier)")
    ap.add_argument("--pillar", choices=list(CONTEXT_BY_PILLAR), default=None,
                    help="Forcer le pilier (sinon déduit de --ref)")
    ap.add_argument("--expert", action="store_true", help="Approfondir le point de vue expert")
    ap.add_argument("--no-aislop", action="store_true", help="Désactiver l'approfondissement AI-slop")
    ap.add_argument("--no-angles", action="store_true", help="Désactiver le socle d'angles obligatoires (déconseillé)")
    ap.add_argument("--max-tokens", type=int, default=8000)
    args = ap.parse_args()

    load_env()
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("[ERREUR] GEMINI_API_KEY absente"); sys.exit(1)
    ref_path, pillar = resolve_ref(args.ref)
    if args.pillar:
        pillar = args.pillar
    if not os.path.exists(args.new):
        print(f"[ERREUR] --new introuvable: {args.new}"); sys.exit(1)

    # Importer le socle d'angles + blocs depuis da-brief (source unique de vérité)
    import importlib.util
    spec = importlib.util.spec_from_file_location("dab", os.path.join(os.path.dirname(__file__), "da-brief.py"))
    dab = importlib.util.module_from_spec(spec); spec.loader.exec_module(dab)

    # Gabarit figé + contexte du pilier (ou question 100% custom si fournie)
    prompt = args.question or build_default_question(pillar)
    # SOCLE D'ANGLES OBLIGATOIRES (spectateur/narration/transitions/aislop/expert) — toujours.
    if not args.no_angles:
        prompt += dab.ANGLES_BLOCK
    if not args.no_aislop:
        prompt += dab.AISLOP_BLOCK
    if args.expert:
        prompt += dab.EXPERT_BLOCK
    print(f"[compare] pilier={pillar} · angles={'OFF' if args.no_angles else 'ON'} · "
          f"aislop={'OFF' if args.no_aislop else 'ON'} · expert={'ON' if args.expert else 'OFF'}")

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
