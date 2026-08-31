"""
chill-meter-metal-concours.py — concours SVG multi-modeles pour le CHASSIS METAL du Chill Meter.

CONTEXTE (contrat Upwork AbiGirl Reacts, jalon 1)
------------------------------------------------
Notre compteur actuel est structurellement fidele a la reference de la cliente, mais son metal se
lit comme un aplat graphique la ou sa reference est photorealiste. Le brief exige que le givre
(jalons 2-3) paraisse « physically attached to the metal surface, not like a flat graphic placed
on top » : sans vrai metal, le givre ressemblera toujours a un calque pose.

⭐ On DELEGUE le dessin aux modeles (workflow maison : « le modele dessine le statique, NOUS
animons ») au lieu de redoser les gradients a la main.

CHAQUE modele produit les DEUX variantes, sur le MEME brief, avec la MEME image de reference :
  - BRUSHED  : acier brosse, reflets doux, lisible en petit
  - MACHINED : metal usine, speculaires nets, plus proche de la reference photorealiste

Modeles (tous VISION — verifie sur l'API OpenRouter le 2026-08-30) :
  glm     z-ai/glm-5.3-flash          in=[text,image,video]   $0.07/$0.25   <- le moins cher, teste en 1er
  gpt     openai/gpt-5.5              in=[file,image,text]    $5.00/$30.00
  kimi    moonshotai/kimi-k3          in=[text,image,video]   $2.85/$14.25
  grok    x-ai/grok-4.6               in=[text,image,file]    $2.00/$6.00
  gemini  google/gemini-3.1-pro-preview in=[audio,file,image,text,video] $2.00/$12.00

⛔ z-ai/glm-5.3 (sans -flash) est TEXT-ONLY. C'est bien `glm-5.3-flash` qui a la vision.

Usage :
    python3 scripts/tools/chill-meter-metal-concours.py --provider glm
    python3 scripts/tools/chill-meter-metal-concours.py --provider all
"""
import argparse
import base64
import json
import os
import re
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

REF_IMAGE = ROOT / "memory/client-sim-tests/upwork-chill-meter/ref-cliente.png"
OUT_DIR = ROOT / "out/_r-and-d/chill-meter-upwork/concours-metal"

MODELS = {
    "glm": "z-ai/glm-5.3-flash",
    "gpt": "openai/gpt-5.5",
    "kimi": "moonshotai/kimi-k3",
    "grok": "x-ai/grok-4.6",
    "gemini": "google/gemini-3.1-pro-preview",
}

# Le brief. Il DICTE les noms de <g id> : c'est ce qui rend les planches interchangeables et
# permet le mix-and-match mecanique (leçon des 4 planches d'aout — sans ca, il faut choisir une
# seule planche et vivre avec ses defauts).
PROMPT = r"""You are drawing a STATIC SVG of a physical device. Look at the attached reference image
carefully: it is the client's own reference for this device.

WHAT THE DEVICE IS
A "Max Chill Factor Meter" — a retro-futuristic, icy-blue measuring device used as a branded overlay
on a YouTube reaction channel. Think a rugged piece of frozen lab equipment.

YOUR TASK
Draw the METAL CHASSIS of this device in TWO variants. Everything about the layout, proportions and
components must be IDENTICAL between the two variants — only the metal treatment differs:

  1. "brushed"  — brushed steel. Soft, diffuse reflections along the grain. Mid-tone greys with a
                  cool blue cast. Readable and calm; it must stay legible when the whole device is
                  only ~750px wide on screen.
  2. "machined" — machined/CNC metal. Crisper specular highlights on every edge and bevel, deeper
                  shadows in the recesses, visible material thickness on the panels, more contrast.
                  Closer to the photoreal look of the reference image.

CRITICAL — WHAT TO DRAW AND WHAT NOT TO DRAW
Draw ONLY the metal casing and its hardware:
  - the outer shell / body of the device, with panel seams and thickness
  - the inner recessed panel that the screen sits in (draw the recess, NOT the screen content)
  - a raised title plate at the top (the nameplate housing, NOT the text)
  - screws / rivets at the corners and along the panels
  - a vertical side panel on the RIGHT that houses a small power button (draw the housing and the
    button bezel; the button itself is a small circle you may fill dark green #1f7a3a)
  - a row of 5 small rectangular button housings along the BOTTOM edge
  - side pipes / conduits running along the left and right edges

Do NOT draw: any text or lettering, the glowing meter bar, the 0-100 graduation, snowflakes, ice,
frost, icicles, or any glow effects. We composite those ourselves. Leave the screen recess empty
(a dark fill is fine).

TECHNICAL CONSTRAINTS (non-negotiable)
- viewBox="0 0 1448 1086". Design to fill that frame, as in the reference.
- Pure static SVG. NO CSS animation, NO @keyframes, NO <animate>, NO JavaScript, NO <image>.
- Use <linearGradient> and <radialGradient> generously — that is what makes metal read as metal.
  Give every gradient a UNIQUE id prefixed with the variant, e.g. id="brushed_shell", so the two
  variants can coexist in one document without id collisions.
- You MAY use <filter> with feGaussianBlur for soft shading, but keep it light.
  ⛔ Do NOT put a blur filter on a large solid shape — it rasterizes to an opaque rectangle in
  headless rendering.
- Colors: cool greys and steel blues. Silver/frosted metal, per the brief. Only the power button
  may be green. No warm tones.
- Use attribute names in kebab-case (stop-color, stroke-width), never camelCase.

REQUIRED STRUCTURE — wrap each variant in a group with EXACTLY these ids:

<g id="brushed"> ... </g>
<g id="machined"> ... </g>

Inside each, use these sub-group ids so the parts are addressable:
  <g id="shell">, <g id="inner_panel">, <g id="title_plate">, <g id="screws">,
  <g id="power_panel">, <g id="bottom_buttons">, <g id="side_pipes">

OUTPUT FORMAT
Return ONE complete SVG document and NOTHING else — no markdown fences, no commentary:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1448 1086">
  <defs>...all gradients for both variants...</defs>
  <g id="brushed">...</g>
  <g id="machined">...</g>
</svg>
"""


def image_data_url(p: Path) -> str:
    b64 = base64.b64encode(p.read_bytes()).decode()
    return f"data:image/png;base64,{b64}"


def extract_svg(text: str) -> str:
    """Isole le document SVG d'une reponse qui peut contenir des fences ou du bavardage."""
    m = re.search(r"<svg\b.*?</svg>", text, re.S | re.I)
    return m.group(0) if m else text


def call(provider: str) -> None:
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY manquant dans .env")
        sys.exit(1)
    if not REF_IMAGE.exists():
        print(f"ERROR: image de reference absente : {REF_IMAGE}")
        sys.exit(1)

    model = MODELS[provider]
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    {"type": "image_url", "image_url": {"url": image_data_url(REF_IMAGE)}},
                ],
            }
        ],
        "max_tokens": 32000,
    }
    # ⛔ Kimi K3 ET GLM 5.3 Flash : sans borne sur le raisonnement, le modele consomme TOUT son
    # budget en reflexion et rend content VIDE avec finish_reason="length" — mesure le 2026-08-30
    # sur glm-5.3-flash : 24 492 tokens de reasoning sur 32 000, zero caractere produit, 0,016 $
    # depenses pour rien. Le symptome etait deja documente pour Kimi (kimi-k3-reasoning-borne.md),
    # il vaut AUSSI pour GLM 5.3 Flash.
    if provider in ("kimi", "glm"):
        payload["reasoning"] = {"max_tokens": 3000}

    print(f"[{provider}] {model} — appel en cours (vision + brief)...")
    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json=payload,
        timeout=1200,
    )
    if r.status_code != 200:
        print(f"[{provider}] HTTP {r.status_code}: {r.text[:400]}")
        return

    data = r.json()
    msg = data["choices"][0]["message"]
    text = msg.get("content") or ""
    if not text.strip():
        print(f"[{provider}] ⛔ content VIDE. finish_reason={data['choices'][0].get('finish_reason')}")
        print(f"[{provider}] usage={data.get('usage')}")
        return

    svg = extract_svg(text)
    out = OUT_DIR / f"metal-{provider}.svg"
    out.write_text(svg, encoding="utf-8")

    u = data.get("usage", {})
    cost = u.get("cost")
    has_brushed = 'id="brushed"' in svg
    has_machined = 'id="machined"' in svg
    ngrad = svg.count("<linearGradient") + svg.count("<radialGradient")
    print(
        f"[{provider}] OK {len(svg)} car · {ngrad} gradients · "
        f"brushed={has_brushed} machined={has_machined} · "
        f"cout={cost if cost is not None else '?'}$ · {out}"
    )
    if not (has_brushed and has_machined):
        print(f"[{provider}] ⚠️ une des 2 variantes manque — a verifier avant de comparer")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=[*MODELS, "all"])
    args = ap.parse_args()
    providers = list(MODELS) if args.provider == "all" else [args.provider]
    for p in providers:
        try:
            call(p)
        except Exception as e:  # un modele qui echoue ne doit pas bloquer les autres
            print(f"[{p}] ECHEC: {type(e).__name__}: {e}")


if __name__ == "__main__":
    main()
