#!/usr/bin/env python3
"""Generate Niger uranium storyboard frames via Gemini 3.1 Flash Image.

6 frames 1080x1920 (Souverain ep.2), une par section S1-S6.
Frames Mapbox-aware : S1, S3 (split), S4, S5 (split) montrent le rendu cible
avec carte + overlays texte intégrés (locator, headline, caption).
Frames non-Mapbox : S2 (data viz timeline+barres), S6 (échiquier metaphor).

Output : public/souverain/niger-uranium/assets/storyboard/
Modèle OBLIGATOIRE : gemini-3.1-flash-image-preview
Budget hard cap : $0.30 (6 images x ~$0.04)
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

OUT_DIR = PROJECT_ROOT / "public" / "souverain" / "niger-uranium" / "assets" / "storyboard"
OUT_DIR.mkdir(parents=True, exist_ok=True)
COST_LOG = PROJECT_ROOT / "out" / "niger-cost-log.txt"
COST_LOG.parent.mkdir(parents=True, exist_ok=True)

BUDGET_HARD_CAP_USD = 0.30
COST_PER_IMAGE = 0.04
MODEL = "gemini-3.1-flash-image-preview"

# Style commun toutes frames
COMMON_STYLE = """
FORMAT: 1080x1920 vertical (9:16 portrait, mobile-first).
BACKGROUND: very dark near-black #0a0a0a with subtle grain texture overlay.
SUBTLE LEDGER GRID: faint horizontal lines opacity 4%, financial-document feel.
PALETTE: dark dominant, accents only (gold #f5d547, niger green #00833D, orano blue #003D7A, uranium yellow #d9b410, hot radioactive green #9eff00, red #d32f2f for contested-data captions).
TYPOGRAPHY: Inter sans-serif uppercase for headlines, IBM Plex Mono for captions.
STYLE REFERENCE: dark premium data-journalism — Bloomberg / Le Monde Diplomatique infographic / Felipe Pantone restraint.
NO LOGOS, NO WATERMARKS, NO MAPBOX BRANDING visible.
"""

ASSETS = [
    {
        "name": "s1-hook-arlit",
        "prompt": f"""Mobile vertical infographic frame, dark data-journalism style.
{COMMON_STYLE}

COMPOSITION:
Top half: dark Mapbox-style map of Niger (West Africa), sahel desert tones desaturated, country borders highlighted in muted niger-green #00833D. Camera zoomed to upper-north Niger near Arlit. A radar pulse animation visible: 3 concentric green circles (#9eff00, fading outward) centered on Arlit's location.

Mid-frame: 4 cylindrical industrial drum silhouettes (radioactive waste barrels), aligned in a row, dark metallic finish with subtle hot-green glow #9eff00 radiating from beneath each one. The radioactive trefoil symbol faintly visible on one drum.

OVERLAYS (must be rendered in the image with these exact texts):
- TOP CENTER: "NIGER" — uppercase, gray #4a4a4a, 28px Inter, wide letter-spacing 0.15em
- BOTTOM LARGE HEADLINE: "400 FÛTS RADIOACTIFS" — uppercase, white #ffffff, 56px Inter ExtraBold
- UNDER HEADLINE (smaller, red caption): "Annonce Min. Justice Niger, 4 fév. 2026 — Orano conteste" — IBM Plex Mono 24px, red #d32f2f opacity 85%
- BOTTOM-RIGHT MARKER: a small ornamental circular marker badge containing the number "400" in gold #f5d547 with 8 tick marks around its perimeter (atlas-style chiffré marker)

Mood: ominous, investigative, geopolitical thriller documentary.""",
    },
    {
        "name": "s2-partage-timeline",
        "prompt": f"""Mobile vertical infographic frame, dark data-journalism style.
{COMMON_STYLE}

NO MAP. Pure data visualization frame.

COMPOSITION:
Center-left: a horizontal timeline running 1971 → 2024 across the width, with year tick marks (1971, 1980, 1990, 2000, 2010, 2024). The timeline line is muted yellow #d9b410, ticks are white opacity 60%.

Right side: TWO vertical comparative bars rising from the timeline:
- LEFT BAR: tall, color orano corporate blue #003D7A, labeled "ORANO 86%" at top in bold white. The bar reaches near the top of the frame.
- RIGHT BAR: short (about 1/9 the height of the left bar), color niger green #00833D, labeled "NIGER 9.2%" at top in bold white.

Big yellow uranium-yellow numbers floating: "86%" near the tall bar, "9,2%" near the short bar — Inter ExtraBold 180px, color #d9b410.

OVERLAYS (rendered in image):
- TOP CENTER: "NIGER · 1971-2024" — uppercase locator, gray #4a4a4a, 28px Inter, wide letter-spacing
- MID HEADLINE: "53 ANS D'EXTRACTION" — uppercase, white, 56px Inter ExtraBold
- UNDER BARS (red caption): "Min. Justice Niger, fév. 2026 / Orano conteste — redevances et impôts" — IBM Plex Mono 24px, red #d32f2f
- BOTTOM-RIGHT CORNER (small neutral caption): "Capital Somaïr : Orano 63,4% — État du Niger 36,6%" — IBM Plex Mono 22px, white opacity 70%

Subtle horizontal ledger grid in background. No map, no people. Bloomberg-style chart aesthetic.""",
    },
    {
        "name": "s3-nationalisation-split",
        "prompt": f"""Mobile vertical infographic frame, dark data-journalism style.
{COMMON_STYLE}

COMPOSITION: VERTICAL SPLIT-SCREEN 50/50 (left half / right half).

LEFT HALF: dark Mapbox-style map zoomed on Niger's full territory, country shape highlighted with muted niger-green fill #00833D opacity 60%. A circular medallion marker showing the Niger flag — described visually: a horizontal tri-band flag (top orange band, middle white band with a small orange disc in center, bottom green band) — placed on the country.

RIGHT HALF: a dark stylized silhouette of a corporate office tower / glass skyscraper, La Défense Paris vibe, monochromatic orano corporate blue #003D7A with subtle glass reflections. Sober, austere, faceless multinational aesthetic. Faint traces of architectural detail.

A thin vertical separator line (gold #f5d547 opacity 40%) divides the two halves.

OVERLAYS (rendered in image):
- TOP CENTER (spanning both halves): "JUIN 2025" — uppercase locator, gray #4a4a4a, 28px Inter, wide letter-spacing
- LEFT-BOTTOM (over the green map area): "NIAMEY — SOUVERAINETÉ RETROUVÉE" — uppercase, niger green #00833D, 36px Inter Bold
- RIGHT-BOTTOM (over the silhouette): "ORANO — EXPROPRIATION" — uppercase, orano blue #003D7A or light blue for legibility, 36px Inter Bold
- BOTTOM CENTER (spanning, dramatic): "NATIONALISATION SOMAÏR" — uppercase, white, 56px Inter ExtraBold
- UNDER MAIN HEADLINE: "Décret nigérien, 19 juin 2025" — IBM Plex Mono 24px, white opacity 70%

Mood: confrontational, two opposing camps, perfect symmetric composition. Neither side dominates visually.""",
    },
    {
        "name": "s4-procedures-flux-moscou",
        "prompt": f"""Mobile vertical infographic frame, dark data-journalism style.
{COMMON_STYLE}

COMPOSITION:
Background: dark Mapbox-style world map, large view centered on Atlantic-Europe-Africa region. Niger highlighted with muted niger-green fill #00833D, Russia highlighted with muted orano-blue fill #003D7A. Other countries dark gray.

CURVED FLOW ARROW: a smooth Bézier curve in burnt orange #e89b3c arcing from northern Niger (Arlit) up through North Africa, across the Mediterranean, and into Moscow region. The arrow has animated dashed segments visible. A small rectangular badge in the middle of the arc displaying "JUILLET 2025" in white IBM Plex Mono 22px.

ON ARLIT: an ornamental circular chiffré marker showing "1 300 t" in gold #f5d547 with 8 tick marks around perimeter.

BOTTOM-LEFT: a sober ornamental circular seal (CIRDI / World Bank style) — concentric thin gold #f5d547 circles, "CIRDI" engraved in the center. Diameter ~150px.

OVERLAYS (rendered in image):
- TOP CENTER: "CIRDI · BANQUE MONDIALE" — uppercase locator, gray #4a4a4a, 28px Inter, wide letter-spacing
- CENTER-MID (huge data numbers): "1 300 TONNES" stacked over "250 M€" — Inter ExtraBold 180px, uranium yellow #d9b410
- UNDER NUMBERS (small caption): "≈ 1 300 t — yellowcake Somaïr" — IBM Plex Mono 24px, white opacity 70%
- BOTTOM HEADLINE: "STOCK BLOQUÉ" — uppercase, white, 56px Inter ExtraBold
- UNDER BOTTOM HEADLINE: "Sept. 2025 — décision tribunal arbitral" — IBM Plex Mono 24px, white opacity 70%

Mood: legal entanglement, geopolitical chess, financial data density.""",
    },
    {
        "name": "s5-etranglement-symetrique",
        "prompt": f"""Mobile vertical infographic frame, dark data-journalism style.
{COMMON_STYLE}

COMPOSITION: VERTICAL SPLIT-SCREEN 50/50, perfectly symmetric.

LEFT HALF (Niger): dark Mapbox-style map zoomed tight on Niger's territory only, isolated, muted niger-green fill #00833D. Below the map, a stacked column of 3 small minimalist line-art icons with white labels:
- soldier helmet icon → "Soldats à payer"
- yellow warning triangle icon → "Insurrection jihadiste au nord"
- group-of-people silhouette icon → "Population sous pression"

RIGHT HALF (Orano): dark Mapbox-style world map zoomed out (large view of globe), 3 visible orano-blue pins on these locations: Canada (north), Kazakhstan (central Asia), France (HQ Paris). Pins glowing soft blue #003D7A. Below the map, a stacked column of 3 small minimalist line-art icons with white labels:
- factory with X mark icon → "Actif majeur perdu"
- padlock with euro symbol icon → "Centaines de M€ gelés"
- globe with multiple pins icon → "Diversifié : Canada, Kazakhstan"

Thin gold #f5d547 vertical separator between halves.

OVERLAYS (rendered in image):
- TOP-LEFT (over Niger half): "LE NIGER DOIT TENIR" — uppercase, niger green #00833D, 44px Inter ExtraBold
- TOP-RIGHT (over Orano half): "ORANO DIVERSIFIE" — uppercase, orano blue or light blue for legibility, 44px Inter ExtraBold
- BOTTOM-RIGHT CORNER (small caption stacked): "Katco (Kazakhstan) — Orano 51%" + "Cigar Lake / McArthur River — Orano Canada" — IBM Plex Mono 22px, white opacity 70%

Mood: forced parity, two camps both under pressure differently. Visual balance is the point — neither side wins the frame composition.""",
    },
    {
        "name": "s6-echiquier-metaphore",
        "prompt": f"""Mobile vertical infographic frame, dark cinematic metaphor.
{COMMON_STYLE}

NO MAP. Pure metaphorical scene.

BACKGROUND: very dark, near black, table surface viewed from a 3/4 high angle. Behind and around the chess board, blurred legal documents and procedural papers scattered, with faint cursive handwriting and embossed wax seals barely visible — out of focus, atmospheric depth, suggesting endless legal contention. Subtle grain.

FOREGROUND: a sober chess board, top-down 3/4 perspective. Two opposing sides clearly differentiated:

ORANO SIDE (orano-blue pieces #003D7A): 4 chess pieces (a king, a knight, a bishop, a rook), each with a tiny glowing pin marker on top showing a country: Canada, Kazakhstan, France, USA. Pieces arranged confidently across multiple board squares, suggesting territorial dominance.

NIGER SIDE (niger-green pieces #00833D): a SINGLE pawn, alone on the opposite side, with a tiny pin marker reading "ARLIT". Surrounded by empty squares.

OVERLAYS (rendered in image):
- MID-CENTER (large headline-thesis): "PARTIE D'ÉCHECS\\nASYMÉTRIQUE" — uppercase, gold #f5d547, 64px Inter ExtraBold, two lines centered
- LOWER CENTER (smaller subtitle, gray): "Sans vainqueur. Pour l'instant." — Inter 36px, gray #4a4a4a opacity 80%

NO source captions. NO sourcing line. This is the analytical conclusion — voice-only, no attribution overlay.

Mood: cinematic, melancholic, legalistic. The board game as metaphor for power asymmetry. Slight desaturation, premium documentary aesthetic.""",
    },
]


def log_cost(name: str, cost: float, status: str, cumul: float):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {name} | ${cost:.4f} | {status} | cumul=${cumul:.4f}\n"
    with open(COST_LOG, "a") as f:
        f.write(line)


def generate(client, asset, retry_count=0):
    out_path = OUT_DIR / f"{asset['name']}.png"
    if out_path.exists():
        return True, "already-exists"

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[asset["prompt"]],
            config=types.GenerateContentConfig(response_modalities=["image", "text"]),
        )

        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                out_path.write_bytes(part.inline_data.data)
                size_kb = out_path.stat().st_size / 1024
                return True, f"saved {size_kb:.1f}KB"

        return False, "no image in response"

    except Exception as e:
        msg = str(e)[:200]
        if "400" in msg or "invalid" in msg.lower() or "permission" in msg.lower():
            return False, f"semantic-error: {msg}"
        if retry_count == 0:
            print(f"  Transient error, waiting 60s before retry: {msg}")
            time.sleep(60)
            return generate(client, asset, retry_count=1)
        return False, f"failed-after-retry: {msg}"


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY missing")
        sys.exit(1)

    estimated_total = COST_PER_IMAGE * len(ASSETS)
    if estimated_total > BUDGET_HARD_CAP_USD:
        print(f"BUDGET REFUSED: ${estimated_total:.2f} > cap ${BUDGET_HARD_CAP_USD:.2f}")
        sys.exit(1)

    print(f"Model: {MODEL}")
    print(f"Budget cap: ${BUDGET_HARD_CAP_USD:.2f} | Estime: ${estimated_total:.2f}")
    print(f"Output: {OUT_DIR}")
    print()

    client = genai.Client(api_key=api_key)
    cumul = 0.0
    results = []

    for i, asset in enumerate(ASSETS, 1):
        print(f"[{i}/{len(ASSETS)}] {asset['name']}...")
        t0 = time.time()
        success, msg = generate(client, asset)
        elapsed = time.time() - t0

        if success:
            cumul += COST_PER_IMAGE
            log_cost(asset["name"], COST_PER_IMAGE, f"OK {msg} ({elapsed:.1f}s)", cumul)
            results.append((asset["name"], "OK"))
            print(f"  -> OK {msg} ({elapsed:.1f}s)")
        else:
            log_cost(asset["name"], 0.0, f"FAIL {msg}", cumul)
            results.append((asset["name"], f"FAIL: {msg}"))
            print(f"  -> FAIL {msg}")

        if i < len(ASSETS):
            time.sleep(3)

    print()
    print("=== RESUME ===")
    for name, status in results:
        print(f"  {name}: {status}")
    print(f"Cout total: ${cumul:.4f}")


if __name__ == "__main__":
    main()
