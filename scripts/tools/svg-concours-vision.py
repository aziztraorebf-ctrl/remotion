"""
svg-concours-vision.py — CONCOURS SVG multi-modeles a partir d'une IMAGE CIBLE.

But (2026-08-16, Gazoduc Acte 5) : on dispose d'une image de reference riche (generee ou editee) et on
veut la REPRODUIRE EN SVG CODE, pour recuperer des groupes <g id> animables au frame pres au lieu d'une
image figee. Plusieurs modeles VISION recoivent la MEME image + le MEME brief ; on compare les rendus.

Difference avec llm-gen-svg.py : celui-la genere des jetons a partir d'une description TEXTE. Ici les
modeles REGARDENT une image cible (vision) et doivent la restituer en SVG.

Methode validee (memory/tools/openrouter-svg.md) : N modeles meme brief -> rasteriser -> comparer ->
mix-and-match des groupes <g id> par element. Fable 5 n'est PAS ici (il s'appelle via l'outil Agent du
workspace, gratuit avec le plan Max — ne jamais le passer par OpenRouter).

Usage :
    python3 scripts/tools/svg-concours-vision.py --image /tmp/cible.png --label p4 \
        --brief-file /tmp/brief.txt --out-dir /tmp/concours [--models gpt,gemini,kimi,glm]
"""
import argparse
import base64
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel reseau (IPv6 mort en sandbox)

import requests  # noqa: E402
from dotenv import load_dotenv  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
OR_KEY = os.getenv("OPENROUTER_API_KEY")
OR_URL = "https://openrouter.ai/api/v1/chat/completions"

# Modeles VERROUILLES (cf CLAUDE.md). Tous doivent accepter la vision.
MODELS = {
    "gpt": "openai/gpt-5.5",
    "gemini": "google/gemini-3.1-pro-preview",
    "kimi": "moonshotai/kimi-k3",
    "glm": "z-ai/glm-5.2",
}


def call(model_id: str, brief: str, image: Path, timeout: int = 600) -> str:
    data_url = "data:image/png;base64," + base64.b64encode(image.read_bytes()).decode()
    payload = {
        "model": model_id,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": brief},
                {"type": "image_url", "image_url": {"url": data_url}},
            ],
        }],
    }
    r = requests.post(
        OR_URL,
        headers={"Authorization": f"Bearer {OR_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=timeout,
    )
    if r.status_code != 200:
        return f"__ERROR__ HTTP {r.status_code}: {r.text[:300]}"
    try:
        return r.json()["choices"][0]["message"]["content"]
    except Exception as e:  # noqa: BLE001
        return f"__ERROR__ parse: {e} / {str(r.json())[:300]}"


def extract_svg(text: str) -> str | None:
    """Recupere le bloc <svg>...</svg> (les modeles l'entourent souvent de ``` et de commentaires)."""
    m = re.search(r"<svg.*?</svg>", text, re.DOTALL | re.IGNORECASE)
    return m.group(0) if m else None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, help="image CIBLE a reproduire en SVG")
    ap.add_argument("--brief-file", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--label", required=True)
    ap.add_argument("--models", default="gpt,gemini,kimi,glm")
    a = ap.parse_args()

    if not OR_KEY:
        print("ERROR: OPENROUTER_API_KEY missing")
        return 1

    img = Path(a.image)
    brief = Path(a.brief_file).read_text()
    out = Path(a.out_dir)
    out.mkdir(parents=True, exist_ok=True)

    for name in [m.strip() for m in a.models.split(",") if m.strip()]:
        model_id = MODELS.get(name)
        if not model_id:
            print(f"  [{name}] inconnu, ignore")
            continue
        print(f"--- {name} ({model_id}) ...", flush=True)
        resp = call(model_id, brief, img)
        if resp.startswith("__ERROR__"):
            print(f"  [{name}] {resp[:200]}")
            continue
        svg = extract_svg(resp)
        if not svg:
            (out / f"{a.label}-{name}.raw.txt").write_text(resp)
            print(f"  [{name}] pas de <svg> trouve -> brut dans {a.label}-{name}.raw.txt")
            continue
        p = out / f"{a.label}-{name}.svg"
        p.write_text(svg)
        print(f"  [{name}] -> {p.name} ({len(svg)//1024} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
