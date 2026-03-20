#!/usr/bin/env python3
"""
Recraft V4 Vector — generation directe via API
Contourne les limitations du MCP (recraftv3 uniquement)
Permet : recraftv4_vector + parametre controls (fond noir, palette)
"""

import os
import json
import urllib.request
import urllib.error
from pathlib import Path

API_TOKEN = os.environ.get("RECRAFT_API_TOKEN") or os.environ.get("RECRAFT_API_KEY")
BASE_URL = "https://external.api.recraft.ai/v1"
OUTPUT_DIR = Path(__file__).parent.parent / "public/assets/geoafrique/recraft-v4"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PALETTE_GEOAFRIQUE_V4 = {
    "background_color": {"rgb": [5, 2, 8]},
    "colors": [
        {"rgb": [165, 42, 42]},    # terracotta Afrique
        {"rgb": [200, 130, 10]},   # ocre
        {"rgb": [212, 175, 55]},   # or D4AF37
        {"rgb": [245, 230, 200]},  # creme F5E6C8
        {"rgb": [8, 13, 26]},      # indigo ocean
    ],
    # no_text non supporte par recraftv4_vector
}

PALETTE_GEOAFRIQUE_V3 = {
    "background_color": {"rgb": [5, 2, 8]},
    "colors": [
        {"rgb": [165, 42, 42]},
        {"rgb": [200, 130, 10]},
        {"rgb": [212, 175, 55]},
        {"rgb": [245, 230, 200]},
        {"rgb": [8, 13, 26]},
    ],
    "no_text": True,
    "artistic_level": 2,
}

REQUESTS = [
    {
        "filename": "beat01-free-A1.svg",
        "model": "recraftv4_vector",
        "prompt": (
            "West Africa coastline map, Senegal peninsula visible, "
            "Atlantic Ocean on the left, wavy ocean lines, "
            "vertical portrait format, no text, no labels, historical map style"
        ),
    },
    {
        "filename": "beat01-free-A2.svg",
        "model": "recraftv4_vector",
        "prompt": (
            "West Africa coastline map, Senegal peninsula visible, "
            "Atlantic Ocean on the left, wavy ocean lines, "
            "vertical portrait format, no text, no labels, historical map style"
        ),
    },
    {
        "filename": "beat01-free-B1.svg",
        "model": "recraftv4_vector",
        "prompt": (
            "Flat vector illustration, west coast of Africa silhouette on the right, "
            "Atlantic Ocean on the left with horizontal wavy lines, "
            "coastline border accent, no text, vertical format, premium historical aesthetic"
        ),
    },
    {
        "filename": "beat01-free-B2.svg",
        "model": "recraftv4_vector",
        "prompt": (
            "Flat vector illustration, west coast of Africa silhouette on the right, "
            "Atlantic Ocean on the left with horizontal wavy lines, "
            "coastline border accent, no text, vertical format, premium historical aesthetic"
        ),
    },
]


def generate(req: dict) -> None:
    filename = req["filename"]
    body = {
        "prompt": req["prompt"],
        "model": req["model"],
        "response_format": "b64_json",
        "size": "9:16",
    }
    if req.get("controls") == "v4":
        body["controls"] = PALETTE_GEOAFRIQUE_V4
    elif req.get("controls") == "v3":
        body["controls"] = PALETTE_GEOAFRIQUE_V3
    if "style" in req:
        body["style"] = req["style"]

    data = json.dumps(body).encode("utf-8")
    http_req = urllib.request.Request(
        f"{BASE_URL}/images/generations",
        data=data,
        headers={
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    print(f"Generating {filename} avec {req['model']}...")
    try:
        with urllib.request.urlopen(http_req, timeout=120) as resp:
            result = json.loads(resp.read())
            import base64
            b64 = result["data"][0]["b64_json"]
            svg_content = base64.b64decode(b64)
            print(f"  -> Recu {len(svg_content)} bytes")

            out_path = OUTPUT_DIR / filename
            out_path.write_bytes(svg_content)
            print(f"  -> Sauvegarde : {out_path}")

    except urllib.error.HTTPError as e:
        body_err = e.read().decode("utf-8")
        print(f"  ERREUR HTTP {e.code}: {body_err}")
    except Exception as e:
        print(f"  ERREUR: {e}")


if __name__ == "__main__":
    if not API_TOKEN:
        print("ERREUR: RECRAFT_API_KEY non trouve dans l'environnement")
        exit(1)

    print(f"Output dir: {OUTPUT_DIR}")
    print(f"Token: {API_TOKEN[:8]}...")
    print()

    for req in REQUESTS:
        generate(req)

    print("\nTermine.")
