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
FAL_EDIT_URL = "https://fal.run/fal-ai/gpt-image-1/edit-image"  # accepte des refs (image_urls)

# --- xAI / Grok images (branche 2026-08-18, audit) ---
# VERIFIE PAR APPEL REEL : les 3 modeles image declarent input_modalities=["text","image"].
# Sans refs -> /v1/images/generations ; avec refs -> /v1/images/edits, champ PLURIEL "images"
# (le singulier "image" renvoie 422 sur une liste). 4 refs acceptees (la doc annonce 3).
XAI_KEY = os.getenv("XAI_API_KEY")
XAI_MODEL = "grok-imagine-image-2.0"   # 0.04 $/image (prix officiel verifie 2026-08-18)
XAI_GEN_URL = "https://api.x.ai/v1/images/generations"
XAI_EDIT_URL = "https://api.x.ai/v1/images/edits"

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
    # ⛔ 2 BUGS CORRIGES LE 2026-08-17 (diagnostic : 36 appels API reels) :
    #  1. L'ancien code faisait `return` sur la 1re image. Or Gemini renvoie SOUVENT 3 images
    #     (1 par concept, entrelacees de texte) — on jetait 2 planches sur 3, silencieusement.
    #     Mesure : `parts=7 img=3` sur un appel typique. On ecrit maintenant TOUTES les images
    #     (out.png, out-2.png, out-3.png...).
    #  2. Le modele renvoie du image/JPEG mais on ecrivait toujours en `.png` -> fichier mal
    #     etiquete (gotcha "bandes vertes/jaunes" deja documente dans memory/tools/gemini.md,
    #     fixe dans gemini-genimg-ipv4.sh mais jamais retro-porte ici). On choisit desormais
    #     l'extension d'apres les MAGIC BYTES reels, jamais d'apres le nom demande.
    written = []
    for c in r.json().get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            inl = p.get("inlineData") or p.get("inline_data")
            if not (inl and inl.get("data")):
                continue
            raw = base64.b64decode(inl["data"])
            ext = ".jpg" if raw[:3] == b"\xff\xd8\xff" else ".png"
            dest = out.with_suffix(ext) if not written else out.with_name(f"{out.stem}-{len(written)+1}{ext}")
            dest.write_bytes(raw)
            written.append(dest)
            print(f"  [gemini] -> {dest.name} ({dest.stat().st_size//1024}KB)")
    if written:
        return written[0]
    # Diagnostic : sans ca on perdait la raison de l'echec. Le texte renvoye dit presque toujours
    # pourquoi (le modele a redige au lieu de dessiner -> revoir la DERNIERE LIGNE du brief, qui
    # doit interdire la prose : cf memory/fiches/FICHE-STORYBOARD.md).
    data = r.json()
    for c in data.get("candidates", []):
        fr = c.get("finishReason")
        txt = "".join(p.get("text", "") for p in c.get("content", {}).get("parts", []))
        print(f"  [gemini] no image (finishReason={fr}, {len(txt)} car. de texte)")
        if txt:
            print(f"  [gemini] debut du texte recu : {txt[:300]}...")
    return None


def gen_gpt(prompt: str, out: Path, refs: list | None = None):
    # ⭐ 2026-08-18 : jusqu'ici gen_gpt tapait TOUJOURS le text-to-image et IGNORAIT --ref en
    # silence — l'appelant croyait envoyer ses refs aux 2 modeles, seul Gemini les recevait.
    # fal-ai/gpt-image-1/edit-image accepte image_urls (data URI) + input_fidelity.
    if refs:
        imgs = []
        for r in refs:
            r = Path(r)
            if not r.exists():
                print(f"  [gpt] ref absente, ignoree : {r}"); continue
            raw = _downscale_ref(r.read_bytes())
            mime = "image/png" if raw[:4] == b"\x89PNG" else "image/jpeg"
            imgs.append(f"data:{mime};base64,{base64.b64encode(raw).decode()}")
        if imgs:
            payload = {"prompt": prompt, "image_urls": imgs, "image_size": "1536x1024",
                       "num_images": 1, "quality": "high", "input_fidelity": "high"}
            try:
                r = requests.post(FAL_EDIT_URL, headers={"Authorization": f"Key {FAL_KEY}",
                                  "Content-Type": "application/json"}, json=payload, timeout=300)
            except requests.exceptions.RequestException as e:
                print(f"  [gpt] ERREUR reseau : {e}"); return
            if r.status_code != 200:
                print(f"  [gpt] ERROR {r.status_code}: {r.text[:200]}"); return
            imgs_out = r.json().get("images", [])
            if imgs_out:
                out.write_bytes(requests.get(imgs_out[0]["url"], timeout=120).content)
                print(f"  [gpt] -> {out.name} ({out.stat().st_size//1024}KB, edit-image {len(imgs)} ref)")
            else:
                print(f"  [gpt] no image: {r.text[:200]}")
            return
    _gen_gpt_t2i(prompt, out)


def _gen_gpt_t2i(prompt: str, out: Path):
    # prompt = EXACTEMENT ce qui part au modele (text-to-image, aucun registre injecte).
    # Rappel biais GPT : mettre le FOND en 1ere phrase + formule negatif si fond clair voulu.
    # `quality` (low|medium|high, defaut "auto") etait accepte par fal.ai mais jamais envoye.
    # ⚠️ Gain modeste et NON prouve isolement (2026-08-17) : sur une planche chargee de texte il ne
    # rattrape rien — la vraie variable est la quantite de texte demandee au modele. On l'envoie
    # quand meme, c'est gratuit.
    payload = {"prompt": prompt, "image_size": "1536x1024", "num_images": 1, "quality": "high"}
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


def _downscale_ref(raw: bytes, max_px: int = 1280) -> bytes:
    """Reduit une ref avant envoi. Un payload base64 de 1.6 Mo a fait timeout a 2 min (audit 2026-08-18)."""
    try:
        from PIL import Image
        import io
        im = Image.open(io.BytesIO(raw))
        if max(im.size) <= max_px:
            return raw
        im.thumbnail((max_px, max_px))
        buf = io.BytesIO()
        im.convert("RGB").save(buf, format="JPEG", quality=88)
        return buf.getvalue()
    except Exception:
        return raw  # Pillow absent ou format exotique : on envoie tel quel


def gen_grok(prompt: str, refs: list, out: Path, aspect: str = "16:9", resolution: str = "2k"):
    """Grok images (xAI). refs vides -> generation ; refs fournies -> edition multi-references.

    ⚠️ En mode edits la REFERENCE PESE TRES LOURD : sur le test d'audit elle a ecrase le style
    demande (un rendu crayon a ete ignore au profit de l'image source). Pour une PROPOSITION de
    scene, dire explicitement dans le prompt que la ref sert de REGISTRE et non de modele a copier.
    """
    if not XAI_KEY:
        print("  [grok] XAI_API_KEY absente — skip"); return
    headers = {"Authorization": f"Bearer {XAI_KEY}", "Content-Type": "application/json"}
    body = {"model": XAI_MODEL, "prompt": prompt, "n": 1}
    if refs:
        imgs = []
        for r in refs:
            r = Path(r)
            if not r.exists():
                print(f"  [grok] ref absente, ignoree : {r}"); continue
            raw = _downscale_ref(r.read_bytes())
            mime = "image/png" if raw[:4] == b"\x89PNG" else "image/jpeg"
            b64 = base64.b64encode(raw).decode()
            imgs.append({"url": f"data:{mime};base64,{b64}", "type": "image_url"})
        if imgs:
            body["images"] = imgs
        url = XAI_EDIT_URL if imgs else XAI_GEN_URL
        if not imgs:
            body |= {"aspect_ratio": aspect, "resolution": resolution}
    else:
        body |= {"aspect_ratio": aspect, "resolution": resolution}
        url = XAI_GEN_URL
    try:
        r = requests.post(url, headers=headers, json=body, timeout=300)
    except requests.exceptions.RequestException as e:
        print(f"  [grok] ERREUR reseau : {e}"); return
    if r.status_code != 200:
        print(f"  [grok] ERROR {r.status_code}: {r.text[:200]}"); return
    d = r.json()
    ticks = d.get("usage", {}).get("cost_in_usd_ticks", 0)
    if ticks:
        print(f"  [grok] cout ~{ticks/15e9:.3f} $")
    data = (d.get("data") or [{}])[0]
    if data.get("b64_json"):
        raw = base64.b64decode(data["b64_json"])
    elif data.get("url"):
        raw = requests.get(data["url"], timeout=120).content  # URL imgen.x.ai TEMPORAIRE
    else:
        print(f"  [grok] no image: {str(d)[:200]}"); return
    dest = out.with_suffix(".jpg" if raw[:3] == b"\xff\xd8\xff" else ".png")
    dest.write_bytes(raw)
    print(f"  [grok] -> {dest.name} ({dest.stat().st_size//1024}KB)")
    return dest


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
    ap.add_argument("--ref", action="append", default=[], help="Image(s) d'ancrage de fond/registre (Gemini, GPT, Grok). Repetable.")
    ap.add_argument("--models", default="gemini,gpt,grok", help="Modeles a lancer (defaut: gemini,gpt,grok).")
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
        print("--- GPT-image ---"); gen_gpt(prompt, Path(f"{out_prefix}-gpt.png"), args.ref)
    if "grok" in models:
        print("--- Grok ---"); gen_grok(prompt, args.ref, Path(f"{out_prefix}-grok.png"))
    print(f"-> {out_prefix.parent}")
