"""image-to-3d.py — Pipeline asset 3D maison : image (Gemini) → modele 3D .glb (fal.ai Trellis).

But (2026-06-17, chantier 3D avec Aziz) : generer NOS propres assets 3D (jetons war-map, objets
ressource) au lieu de fouiller des marketplaces. Image stylisee navy/gold → vrai volume .glb
→ a poser/animer dans @remotion/three.

Usage :
    python3 scripts/tools/image-to-3d.py --image out/.../token-source.png --output public/_shared/assets-3d/token.glb

Modele : fal-ai/trellis (~$0.07/generation, sortie GLB). Voir memory/tools/grok-imagine-video.md
(fal via @fal-ai/client) + memory/remotion-effects-rack-natif.md.
"""
import argparse
import os
import sys
import urllib.request
from pathlib import Path

import fal_client
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing dans .env", file=sys.stderr)
    sys.exit(1)


def upload_catbox(path: Path) -> str:
    """Upload une image sur catbox et renvoie l'URL publique (Trellis exige une image_url)."""
    with open(path, "rb") as f:
        r = requests.post(
            "https://catbox.moe/user/api.php",
            data={"reqtype": "fileupload"},
            files={"fileToUpload": f},
            timeout=120,
        )
    r.raise_for_status()
    url = r.text.strip()
    if not url.startswith("http"):
        raise RuntimeError(f"catbox upload failed: {url}")
    return url


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, help="image source locale (png/jpg)")
    ap.add_argument("--output", required=True, help="chemin .glb de sortie")
    ap.add_argument("--model", default="fal-ai/trellis", help="modele fal image->3D")
    args = ap.parse_args()

    img = Path(args.image)
    if not img.exists():
        print(f"[ERROR] image introuvable: {img}", file=sys.stderr)
        sys.exit(1)

    print(f"[1/3] Upload {img.name} -> catbox...")
    image_url = upload_catbox(img)
    print(f"      {image_url}")

    print(f"[2/3] {args.model} (image->3D)... (peut prendre 30-120s)")
    result = fal_client.subscribe(
        args.model,
        arguments={"image_url": image_url},
        with_logs=False,
    )

    # Trellis renvoie typiquement {"model_mesh": {"url": ...}} ou {"model_glb": {...}}
    mesh = (
        result.get("model_mesh")
        or result.get("model_glb")
        or (result.get("model_urls") or {}).get("glb")
    )
    if not mesh or not mesh.get("url"):
        print(f"[ERROR] pas de mesh dans la reponse: {result}", file=sys.stderr)
        sys.exit(1)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    print(f"[3/3] Download .glb -> {out}")
    urllib.request.urlretrieve(mesh["url"], out)
    size = out.stat().st_size
    print(f"      OK ({size/1024:.0f} KB)")
    print(f"DONE: {out}")


if __name__ == "__main__":
    main()
