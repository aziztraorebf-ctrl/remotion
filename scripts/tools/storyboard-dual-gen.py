"""Genere des STORYBOARDS (planches de reference visuelle) sur DEUX generateurs en parallele :
  - Gemini 3.1 Flash Image (gemini-3.1-flash-image-preview) — RESPECTE le fond impose meme en milieu de prompt.
  - GPT-image-1 via fal.ai (fal-ai/gpt-image-1) — meilleur relief, mais retombe sur son fond sombre SAUF si
    le fond est en 1ere phrase + formule negatif (« LIGHT … NOT dark/navy »). Voir _PALETTE-BACKGROUNDS.md.

⛔ Le prompt de l'APPELANT n'est JAMAIS pollue par un registre hardcode (correction 2026-06-19 : l'ancien
   REGISTRE M-Pesa/navy etait force en prefixe -> chaque appelant devait le contourner). L'appelant fournit
   SON prompt complet (registre + palette de SON choix). Les fonctions gen_gemini/gen_gpt envoient ce prompt tel quel.

Usage CLI (recommande pour un agent) :
  python3 scripts/tools/storyboard-dual-gen.py --prompt-file brief.txt --out-prefix /tmp/sb-x/scene \
      [--ref bg.png] [--models gemini,gpt]
  -> ecrit <out-prefix>-gemini.png et/ou <out-prefix>-gpt.png
Usage module : importer gen_gemini(prompt, refs, out) / gen_gpt(prompt, out) — prompt = exactement ce qui part au modele.
Le bloc __main__ historique (storyboards Senegal M-Pesa) est conserve sous --demo-senegal.
"""
import os, sys, base64, time, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
FAL_KEY = os.getenv("FAL_KEY")
OUT = Path("/tmp/storyboard-gen"); OUT.mkdir(exist_ok=True)

GEMINI_MODEL = "gemini-3.1-flash-image-preview"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_KEY}"
FAL_URL = "https://fal.run/fal-ai/gpt-image-1/text-to-image"

REF_NOKIA = Path("/tmp/ref-mpesa-nokia.jpg")  # pivot Nokia + data greffees
REF_COIN = Path("/tmp/ref-mpesa-coin.jpg")    # pivot piece + comparaison 5%/0.22%

# === BRIEF COMMUN (registre Data-Hero + charte + marge creative) ===
REGISTRE = (
    "Editorial data-visualization motion-design frame, 16:9, premium documentary style (like Bloomberg/Vox). "
    "DATA-HERO grammar: ONE central hero object locked in the center, data labels grafted AROUND it (left/right, "
    "never stacked), a soft radial halo around the hero so it breathes. Color charter STRICT: deep navy background "
    "#16213a, warm gold/ocre accents #e7bd78, ivory text #f2ebd9, crisis red #b23a2e only for the 'cost/bad' side. "
    "Subtle paper grain texture, soft drop shadows (semi-3D, NOT flat vector), gentle glow on key numbers, vignette. "
    "Clean, sober, sophisticated — NOT busy, NOT clip-art, NOT neon. French labels."
)

# MULTI-PLANCHE : chaque moment = UNE image montrant 3 etats (debut / milieu / fin) cote a cote,
# comme un storyboard de Silicon Savannah. Concepts RETENUS (Aziz) : coin-flip pour l'intro, baril pour 60%.
MULTIPANEL = (" Output a SINGLE storyboard image arranged as a horizontal STRIP of 3 panels side by side "
    "(labelled BEGINNING / MIDDLE / END), showing how this DATA-HERO scene EVOLVES over time. Same central "
    "hero across the 3 panels — only the grafted data and the state change. Clear thin separators between panels.")

MOMENTS = {
    "intro-recits": (
        "SCENE: opening of a Senegal oil documentary that DECONSTRUCTS two opposing myths. CENTRAL HERO = a "
        "premium 3D GOLD COIN with TWO faces (a coin-flip). FACE A = 'LA MALEDICTION' (resource curse, a ship/"
        "extraction icon, cold red tone). FACE B = 'LE MIRACLE' (sovereignty, a flag/landmark icon, warm gold). "
        "The COIN FLIP itself is the gesture of 'flipping the narrative'. "
        "PANEL 1 (beginning): the coin appears showing FACE A 'LA MALEDICTION' with 1-2 data labels grafted around. "
        "PANEL 2 (middle): the coin is mid-flip (edge/tranche visible, motion blur), narratives in tension. "
        "PANEL 3 (end): coin shows FACE B 'LE MIRACLE', then a crack — both myths revealed as constructed lies "
        "('DEUX ILLUSIONS'). Deep navy, gold, crisis red for the curse side, soft 3D depth, halo, grain."
        + MULTIPANEL
    ),
    "soixante-pourcent": (
        "SCENE: reveal of a key statistic. CENTRAL HERO = an OIL BARREL that acts as a GAUGE — filled with gold "
        "(Senegal's share) at the bottom and red (foreign operators' share) at top, the fill LEVEL encodes the split. "
        "PANEL 1 (beginning): empty/outline barrel, label 'PART DES REVENUS'. "
        "PANEL 2 (middle): the barrel FILLS up with gold to ~60%, a counter rising toward '60%', data labels "
        "'PART DE L'ETAT SENEGALAIS' (gold) vs 'OPERATEURS ETRANGERS' (red) grafted left/right. "
        "PANEL 3 (end): '60%' locked in the gold zone + subtext 'moyenne des emergents, ni scandale ni jackpot', "
        "the number deliberately DEFLATED (slight desaturation). Deep navy, gold/red barrel, halo, grain, semi-3D."
        + MULTIPANEL
    ),
}


def gen_gemini(prompt: str, refs: list, out: Path, edit: bool = False):
    # prompt = EXACTEMENT ce qui part au modele (aucun registre injecte). Les refs sont des images
    # d'ancrage de registre/fond (ex: un background de la palette) — facultatives.
    #
    # ⛔⛔ ORDRE DES PARTS = COMPORTEMENT COMPLETEMENT DIFFERENT (bug trouve 2026-08-16, Acte 5) :
    #   TEXTE puis IMAGE  -> GENERATION : le modele suit le texte, l'image n'est qu'une inspiration
    #                        faible. C'est le bon mode pour "cree une planche de storyboard".
    #   IMAGE puis TEXTE  -> EDITION : le modele RETOUCHE l'image fournie et garde tout le reste
    #                        identique. C'est le SEUL mode qui marche pour "enleve les ecritures et
    #                        ne touche a rien d'autre".
    # Vecu : 3 tentatives d'edition en mode TEXTE-puis-IMAGE ont rendu du hors-sujet total (une coupe
    # anatomique de tete, un schema de rein, une photo de circuit imprime) alors que le modele DECRIT
    # parfaitement l'image quand on l'interroge — la vision marchait, c'est l'ordre qui etait faux.
    # => Passer edit=True pour toute retouche d'une image existante.
    img_parts = []
    for r in refs:
        r = Path(r)
        if r.exists():
            mime = "image/png" if r.suffix.lower() == ".png" else "image/jpeg"
            img_parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(r.read_bytes()).decode()}})
    parts = ([*img_parts, {"text": prompt}] if edit else [{"text": prompt}, *img_parts])
    payload = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.6}}
    r = requests.post(GEMINI_URL, json=payload, timeout=180)
    if r.status_code != 200:
        print(f"  [gemini] ERROR {r.status_code}: {r.text[:200]}"); return
    for c in r.json().get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            inl = p.get("inlineData") or p.get("inline_data")
            if inl and inl.get("data"):
                out.write_bytes(base64.b64decode(inl["data"])); print(f"  [gemini] -> {out.name} ({out.stat().st_size//1024}KB)"); return
    print("  [gemini] no image")


def gen_gpt(prompt: str, out: Path):
    # prompt = EXACTEMENT ce qui part au modele (text-to-image, aucun registre injecte).
    # Rappel biais GPT : mettre le FOND en 1ere phrase + formule negatif si fond clair voulu.
    payload = {"prompt": prompt, "image_size": "1536x1024", "num_images": 1}
    r = requests.post(FAL_URL, headers={"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}, json=payload, timeout=240)
    if r.status_code != 200:
        print(f"  [gpt] ERROR {r.status_code}: {r.text[:200]}"); return
    imgs = r.json().get("images", [])
    if imgs:
        url = imgs[0]["url"]
        out.write_bytes(requests.get(url, timeout=120).content)
        print(f"  [gpt] -> {out.name} ({out.stat().st_size//1024}KB)")
    else:
        print(f"  [gpt] no image: {r.text[:200]}")


def _run_demo_senegal():
    """Historique : les 2 storyboards Senegal M-Pesa (registre navy hardcode, refs M-Pesa)."""
    for key, prompt in MOMENTS.items():
        print(f"\n=== {key} ===")
        full = REGISTRE + "\n\n" + prompt  # le registre M-Pesa est explicite ICI, pas dans gen_*
        gen_gemini(full, [REF_NOKIA, REF_COIN], OUT / f"{key}-gemini.png")
        gen_gpt(full + "\n\nReference register: premium M-Pesa data explainer, central hero + stats grafted, navy bg.",
                OUT / f"{key}-gpt.png")
    print(f"\n-> {OUT}")


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Storyboard dual-gen (Gemini + GPT-image). Prompt fourni par l'appelant, non pollue.")
    ap.add_argument("--prompt-file", type=Path, help="Fichier texte du prompt complet (registre + contenu, palette au choix).")
    ap.add_argument("--prompt", type=str, help="Prompt inline (alternative a --prompt-file).")
    ap.add_argument("--out-prefix", type=str, help="Prefixe de sortie : <prefix>-gemini.png / <prefix>-gpt.png")
    ap.add_argument("--ref", action="append", default=[], help="Image(s) d'ancrage de fond/registre (Gemini). Repetable.")
    ap.add_argument("--models", default="gemini,gpt", help="Modeles a lancer (defaut: gemini,gpt).")
    ap.add_argument("--demo-senegal", action="store_true", help="Rejoue les storyboards historiques Senegal M-Pesa.")
    args = ap.parse_args()

    if args.demo_senegal:
        _run_demo_senegal()
        sys.exit(0)

    prompt = args.prompt_file.read_text() if args.prompt_file else args.prompt
    if not prompt or not args.out_prefix:
        ap.error("Fournir (--prompt-file | --prompt) ET --out-prefix. Sinon --demo-senegal.")
    out_prefix = Path(args.out_prefix)
    out_prefix.parent.mkdir(parents=True, exist_ok=True)
    models = [m.strip() for m in args.models.split(",") if m.strip()]
    if "gemini" in models:
        print("--- Gemini ---"); gen_gemini(prompt, args.ref, Path(f"{out_prefix}-gemini.png"))
    if "gpt" in models:
        print("--- GPT-image ---"); gen_gpt(prompt, Path(f"{out_prefix}-gpt.png"))
    print(f"-> {out_prefix.parent}")
