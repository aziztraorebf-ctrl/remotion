#!/usr/bin/env python3
"""Niger uranium storyboard V2 — sans overlays texte, avec refs Or Africain V5.

Strategie :
- Frames Mapbox (S1, S3 gauche, S4, S5) : image-to-image avec refs Or Africain
- Frames non-Mapbox (S2, S6) : text-to-image, mais flat 2D realisable en Remotion
- AUCUN overlay texte dans les frames (zones marquees par rectangles vides)
- S6 echiquier 2D top-down plat (pas 3D)

Output : public/souverain/niger-uranium/assets/storyboard-v2/
Modele OBLIGATOIRE : gemini-3.1-flash-image-preview
Budget hard cap : $0.40 (6 images x ~$0.05 i2i)
"""
import os
import sys
import time
from datetime import datetime
from pathlib import Path

from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

REFS_DIR = PROJECT_ROOT / "public" / "souverain" / "niger-uranium" / "assets" / "refs"
OUT_DIR = PROJECT_ROOT / "public" / "souverain" / "niger-uranium" / "assets" / "storyboard-v2"
OUT_DIR.mkdir(parents=True, exist_ok=True)
COST_LOG = PROJECT_ROOT / "out" / "niger-cost-log.txt"

BUDGET_HARD_CAP_USD = 0.40
COST_PER_IMAGE_T2I = 0.04
COST_PER_IMAGE_I2I = 0.05
MODEL = "gemini-3.1-flash-image-preview"

REF_PAYS_ZOOM = REFS_DIR / "ref-mapbox-pays-zoom.jpg"
REF_MONDE_MULTI = REFS_DIR / "ref-mapbox-monde-multipays.jpg"
REF_GLOBE_PINS = REFS_DIR / "ref-mapbox-globe-pins.jpg"

COMMON_RULES = """
CRITICAL RULES (must follow):
- Format: 1080x1920 vertical (9:16 portrait, mobile-first).
- NO TEXT, NO LETTERS, NO NUMBERS rendered in the image. Empty placeholder zones only.
- NO logos, NO watermarks, NO Mapbox branding.
- Style reference: dark premium data-journalism, sober, restrained, NOT 3D, NOT cinematic concept art.
- Flat compositional graphics — what can realistically be reproduced with Mapbox GL JS + Remotion React overlays.
"""

ASSETS = [
    {
        "name": "s1-hook-arlit",
        "mode": "i2i",
        "ref": REF_PAYS_ZOOM,
        "prompt": f"""{COMMON_RULES}

TASK: Use the reference image as the EXACT base style. It shows a Mapbox map of West Africa with a single country (Ghana) highlighted in gold. Same dark blue ocean, same desaturated gray landmass, same white country borders, same vertical 9:16 framing.

MODIFICATIONS:
1. Re-frame the map: zoom to NIGER (large landlocked country in the Sahel, north of Nigeria, east of Mali, west of Chad). Niger should occupy the center of the frame.
2. Highlight Niger's territory with a muted dark green fill (like #2d5a3d, NOT bright). Same flat fill style as the Ghana gold reference.
3. Add a small subtle radar pulse animation centered on northern Niger (Arlit region): 3 thin concentric circles in radioactive green #9eff00, fading outward, very minimal.
4. In the LOWER THIRD of the frame, place 4 small simple radioactive drum icons (cylinder silhouettes with radiation trefoil), aligned horizontally, dark metallic gray, with a subtle green glow underneath. NOT 3D, NOT photorealistic — flat sober icon style, like a data-journalism infographic element.
5. Leave the TOP 80px and BOTTOM 200px as empty dark zones (text overlays will be added later in Remotion code — DO NOT render any text).

The image should look like a still frame from our Or Africain video, just adapted for Niger uranium narrative.""",
    },
    {
        "name": "s2-partage-timeline",
        "mode": "t2i",
        "ref": None,
        "prompt": f"""{COMMON_RULES}

NO MAP. Pure data-visualization frame, dark background near-black #0a0a0a, very subtle horizontal ledger grid lines at 4% opacity.

COMPOSITION:
- Center: a horizontal timeline axis line in muted gold (#d9b410), running across the width, with year tick marks (small vertical lines) at 1971, 1980, 1990, 2000, 2010, 2024.
- TWO vertical bars rising upward FROM the timeline (both bars start at the timeline as baseline):
  - Bar 1 (LEFT): tall, dark corporate blue #003D7A, height = 86% of available frame space above timeline. Solid flat color, no gradient, no 3D.
  - Bar 2 (RIGHT, next to bar 1): very short, niger-green #00833D, height = 9.2% of bar 1 (much smaller).
- The bars are clean rectangles, sharp edges, flat fills.

NO TEXT, NO NUMBERS, NO LABELS. Just the visual structure.

Empty dark zones at top (~150px) and bottom (~250px) for future text overlays.

Style: Bloomberg / Le Monde Diplomatique / FT data-journalism. Sober, restrained, professional.""",
    },
    {
        "name": "s3-nationalisation-split",
        "mode": "i2i",
        "ref": REF_PAYS_ZOOM,
        "prompt": f"""{COMMON_RULES}

TASK: Create a vertical split-screen 50/50 (left half / right half), separated by a thin gold vertical line.

LEFT HALF: Use the reference image style (Mapbox dark with country highlight) but adapted for NIGER. Show Niger's full territory highlighted in muted niger-green #00833D (not bright), against the same dark blue ocean and desaturated gray surrounding countries. Same border treatment as the reference. The country fills most of the left half.

RIGHT HALF: Dark monochrome silhouette of a generic corporate office tower / glass skyscraper viewed from below (vertical perspective). Sober, faceless, austere. Flat color treatment in deep corporate blue #003D7A with minimal architectural line-detail. NOT photorealistic, NOT 3D rendered — graphic illustration style, like a French press editorial illustration.

NO TEXT, NO LETTERS, NO LABELS anywhere. Empty dark zones at top and bottom for future text overlays added in code.

The left and right halves should feel visually balanced — neither dominates.""",
    },
    {
        "name": "s4-procedures-flux-moscou",
        "mode": "i2i",
        "ref": REF_MONDE_MULTI,
        "prompt": f"""{COMMON_RULES}

TASK: Use the reference image as the EXACT base style — Mapbox world map with multiple countries highlighted, dark blue ocean, desaturated gray landmass, white borders, 9:16 vertical framing.

MODIFICATIONS:
1. Keep the same world map framing (centered on Atlantic-Europe-Africa).
2. Highlight only TWO countries:
   - NIGER: muted niger-green #00833D fill
   - RUSSIA: muted corporate blue #003D7A fill
   All other countries stay neutral gray like in the reference.
3. Draw a smooth curved Bezier arc from NIGER (north, Arlit area) up through North Africa, across the Mediterranean, into central RUSSIA (Moscow region). The arc is a thin solid orange line #e89b3c (~3-4px), with subtle dashed segments along it. Add a small arrowhead at the Moscow end.
4. Place a simple ornamental circular marker on Niger's Arlit position: thin gold circle (#d9b410), with 8 tick marks around the circumference (atlas-style chiffré marker). Empty interior — no number rendered.
5. In the lower-left corner, add a small sober ornamental seal: 3 concentric thin gold circles (CIRDI seal style), minimal, no text inside.

NO TEXT, NO NUMBERS, NO COUNTRY NAMES, NO LABELS rendered anywhere. Empty dark zones at top (~150px) and bottom (~400px) for future text overlays.""",
    },
    {
        "name": "s5-etranglement-symetrique",
        "mode": "i2i",
        "ref": REF_GLOBE_PINS,
        "prompt": f"""{COMMON_RULES}

TASK: Create a vertical split-screen 50/50, separated by a thin gold vertical line. Both halves use the SAME Mapbox style as the reference image (dark blue ocean, gray landmass, white borders).

LEFT HALF: Map zoomed tight on NIGER's territory only (centered). Niger highlighted with muted niger-green #00833D fill. Surrounding countries in neutral gray. The country fills most of the left half.

RIGHT HALF: World map view (large global perspective like the reference), with 3 small glowing pins in corporate blue #003D7A placed on:
- CANADA (north of USA)
- FRANCE (western Europe)
- KAZAKHSTAN (central Asia)
The 3 pins should be visible without zoom. Other countries stay neutral gray (no other highlights).

The map style on both halves must match the reference image exactly — same colors, same border thickness, same desaturation.

NO TEXT, NO LABELS, NO COUNTRY NAMES, NO ICONS, NO PINS-WITH-TEXT. Just the cartographic visuals.

Empty dark zones at top (~200px) and bottom (~400px) for future text overlays and icons added in code.""",
    },
    {
        "name": "s6-echiquier-flat",
        "mode": "t2i",
        "ref": None,
        "prompt": f"""{COMMON_RULES}

NO MAP. Top-down flat 2D view of a chessboard, sober editorial style, NOT 3D, NOT photorealistic.

COMPOSITION:
- Frame center: a square chessboard viewed from directly above (top-down, no perspective). 8x8 grid of alternating dark-gray and very-dark-gray squares. Sharp edges, flat fills, no shadows, no wood texture. Pure graphic 2D.
- Chess pieces represented as flat silhouette icons (top-down silhouettes — knight as horse-head shape, king as crown shape, pawn as round dot, etc.) in two colors:
  - 4 ORANO pieces in corporate blue #003D7A: a king, a knight, a bishop, a rook, distributed across multiple squares on the upper half of the board.
  - 1 NIGER piece in niger-green #00833D: a single pawn, alone on the lower half of the board, with several empty squares around it.
- Background outside the chessboard: very dark near-black #0a0a0a with subtle scattered flat 2D paper rectangles (legal documents) at low opacity (~25%), no readable text on them, just suggestion of papers. Flat 2D illustration style, like an editorial illustration in Le Monde.

NO TEXT anywhere. NO chess piece labels. NO subtitles. NO headlines. NO country names.

Empty dark zones at top (~300px) and bottom (~300px) for future text overlays.

Style: editorial flat 2D illustration, restrained, melancholic. NOT a cinematic 3D render.""",
    },
]


def log_cost(name: str, cost: float, status: str, cumul: float):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] V2 {name} | ${cost:.4f} | {status} | cumul=${cumul:.4f}\n"
    with open(COST_LOG, "a") as f:
        f.write(line)


def generate(client, asset, retry_count=0):
    out_path = OUT_DIR / f"{asset['name']}.png"
    if out_path.exists():
        return True, "already-exists", 0.0

    cost = COST_PER_IMAGE_I2I if asset["mode"] == "i2i" else COST_PER_IMAGE_T2I

    try:
        contents = [asset["prompt"]]
        if asset["mode"] == "i2i" and asset["ref"]:
            ref_bytes = asset["ref"].read_bytes()
            contents.append(types.Part.from_bytes(data=ref_bytes, mime_type="image/jpeg"))

        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(response_modalities=["image", "text"]),
        )

        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                out_path.write_bytes(part.inline_data.data)
                size_kb = out_path.stat().st_size / 1024
                return True, f"saved {size_kb:.1f}KB ({asset['mode']})", cost

        return False, "no image in response", 0.0

    except Exception as e:
        msg = str(e)[:200]
        if "400" in msg or "invalid" in msg.lower() or "permission" in msg.lower():
            return False, f"semantic-error: {msg}", 0.0
        if retry_count == 0:
            print(f"  Transient error, waiting 60s before retry: {msg}")
            time.sleep(60)
            return generate(client, asset, retry_count=1)
        return False, f"failed-after-retry: {msg}", 0.0


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY missing")
        sys.exit(1)

    estimated = sum(
        COST_PER_IMAGE_I2I if a["mode"] == "i2i" else COST_PER_IMAGE_T2I for a in ASSETS
    )
    if estimated > BUDGET_HARD_CAP_USD:
        print(f"BUDGET REFUSED: ${estimated:.2f} > cap ${BUDGET_HARD_CAP_USD:.2f}")
        sys.exit(1)

    print(f"Model: {MODEL}")
    print(f"Budget cap: ${BUDGET_HARD_CAP_USD:.2f} | Estime: ${estimated:.2f}")
    print(f"Output: {OUT_DIR}")
    print(f"Refs: {REFS_DIR}")
    print()

    # Verify refs exist
    for asset in ASSETS:
        if asset["mode"] == "i2i":
            if not asset["ref"].exists():
                print(f"ERROR: Ref missing: {asset['ref']}")
                sys.exit(1)

    client = genai.Client(api_key=api_key)
    cumul = 0.0
    results = []

    for i, asset in enumerate(ASSETS, 1):
        mode_tag = f"[{asset['mode']}]"
        print(f"[{i}/{len(ASSETS)}] {asset['name']} {mode_tag}...")
        t0 = time.time()
        success, msg, cost = generate(client, asset)
        elapsed = time.time() - t0

        if success:
            cumul += cost
            log_cost(asset["name"], cost, f"OK {msg} ({elapsed:.1f}s)", cumul)
            results.append((asset["name"], "OK"))
            print(f"  -> OK {msg} ({elapsed:.1f}s)")
        else:
            log_cost(asset["name"], 0.0, f"FAIL {msg}", cumul)
            results.append((asset["name"], f"FAIL: {msg}"))
            print(f"  -> FAIL {msg}")

        if i < len(ASSETS):
            time.sleep(3)

    print()
    print("=== RESUME V2 ===")
    for name, status in results:
        print(f"  {name}: {status}")
    print(f"Cout total V2: ${cumul:.4f}")


if __name__ == "__main__":
    main()
