"""
Generate 3 Mapbox style comparison images for Atlas chaine choice.
Same content (Tombouctou map + 25 000 ETUDIANTS stat) — only the STYLE varies.
Aziz will pick A (sepia paper-craft), B (parchemin Mande), or C (monochrome editorial).
"""

import os
import sys
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUTPUT_DIR = Path(__file__).parent.parent.parent / "quebec-jacques-poc" / "research" / "style-comparison"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS = {
    "A-sepia-papercraft": """A historical map illustration of West Africa in the 16th century, focused on the Mali/Songhai empire region, with Timbuktu (Tombouctou) marked as a key city. Style: SEPIA PAPER-CRAFT aesthetic -- warm beige and ochre tones throughout, hand-drawn appearance with visible paper texture and subtle grain.

Composition: 16:9 horizontal frame. The map dominates the lower 70% of the frame. The Niger River flows through the center of the map in a darker brown ink line. The Sahara desert appears above as lightly textured beige. Country borders are inked with thin brown-black lines, slightly imperfect like handwork.

A small red pin marks Timbuktu's location with a white-on-black label badge "TOMBOUCTOU" in elegant SERIF typography (think Garamond or Caslon).

Top-right of the frame: a clean stat overlay reading "25 000 ETUDIANTS" in bold serif type, with a small comparison bar chart underneath showing two bars labeled "TOMBOUCTOU" (long bar) and "OXFORD" (very short bar).

Color palette: warm sepia (#C9A876 dominant beige, #6B4226 dark brown for ink, #A0522D ochre accents, #1A1A1A black for text, single small accent #B8252F red for the pin only).

The whole image has the quality of an aged archive document: subtle paper grain, faint vignette darkening the edges, no glossy modern look.

NO modern UI elements. NO bright saturated colors. NO 3D effects. NO photographic realism -- this is a stylized illustrated MAP, not a satellite photo.

Format: 1920x1080, 16:9 horizontal cinematic frame.""",

    "B-parchemin-mande": """A historical map illustration of West Africa in the 16th century, focused on the Mali/Songhai empire region, with Timbuktu (Tombouctou) marked as a key city. Style: MANDE PARCHMENT aesthetic -- inspired by ancient Mande/Songhai manuscript traditions, with mudcloth (bogolan) geometric border motifs and Adinkra-influenced design language.

Composition: 16:9 horizontal frame. The map dominates the central 70% of the frame, surrounded by a decorative border featuring stylized geometric mudcloth/bogolan patterns in the four corners (repeating triangular and diamond motifs, painted in dark indigo on ochre background).

Color palette: deep terracotta ochre (#A0522D), muted indigo blue (#2C3E5C), gold accents (#C9A227), warm earth brown (#5C3317), warm cream parchment background (#E8D9B8). Absolutely NO bright modern saturation.

The Niger River flows through the map in deep indigo ink. The Sahara appears as a pale ochre expanse above. Country borders are drawn with confident dark indigo strokes resembling Arabic calligraphic ink.

A small gold-circle medallion marks Timbuktu's location with the label "TOMBOUCTOU" rendered in a hybrid typography that mixes geometric Adinkra-inspired characters with clean modern sans-serif (so it remains readable but feels culturally rooted).

Top-right of the frame: stat overlay reading "25 000 ETUDIANTS" in the same hybrid Adinkra/sans typography, set inside a small terracotta cartouche with gold trim. Below it, a comparison showing two horizontal bars -- Timbuktu's bar in gold, Oxford's bar in dull grey, with bold differential.

The whole image evokes an ancient Mande manuscript page: visible parchment grain, hand-painted quality, deep saturation that feels earthy, never neon or digital.

NO Western/European medieval aesthetic. NO modern UI. NO photographic realism. NO bright pinks, purples, or neons. This is a culturally-rooted West African manuscript-style map.

Format: 1920x1080, 16:9 horizontal cinematic frame.""",

    "C-monochrome-editorial": """A historical map illustration of West Africa in the 16th century, focused on the Mali/Songhai empire region, with Timbuktu (Tombouctou) marked as a key city. Style: MODERN EDITORIAL MONOCHROME -- minimalist, premium news-magazine aesthetic (think Bloomberg, Le Monde, Vox Atlas).

Composition: 16:9 horizontal frame. The map fills the central 80% of the frame, very clean and spacious -- generous negative space.

Color palette: pure white background (#FFFFFF), deep charcoal black (#1A1A1A) for landmasses, medium grey (#7A7A7A) for borders and water, single accent color CRIMSON RED (#D72638) used ONLY for the Timbuktu pin and the Tombouctou stat highlight bar. NO other colors anywhere.

The Niger River is drawn as a thin grey line. Country borders are ultra-thin grey lines. The Sahara is indicated with very subtle grey gradient hatching, almost minimal. The whole map feels designed by a top editorial designer -- extreme precision, not cluttered.

A small crimson red pin marks Timbuktu's location with a clean black sans-serif label "TOMBOUCTOU" (think Sohne, Inter, or Helvetica Neue Bold).

Top-right of the frame: stat overlay reading "25 000 ETUDIANTS" in large bold black sans-serif on white, with the number in extra-bold weight. Below: a clean comparison chart with two horizontal bars -- Timbuktu in crimson red (long bar with "25 000" label), Oxford in grey (very short bar with "2 000" label).

The whole image feels like a contemporary infographic from a premium publication. Clean lines, mathematical precision, generous whitespace. Modern but timeless.

NO sepia tones. NO ancient/historical decoration. NO mudcloth or ethnic patterns. NO multiple colors. The aesthetic is RESTRAINT and PRECISION -- black, white, grey, and one strategic red accent.

Format: 1920x1080, 16:9 horizontal cinematic frame.""",
}


def generate(style_id: str, prompt: str) -> tuple[str, Path | None, float]:
    start = time.time()
    print(f"[{style_id}] Generating...")

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
        )

        image_bytes = None
        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                image_bytes = part.inline_data.data
                break

        elapsed = time.time() - start

        if not image_bytes:
            print(f"[{style_id}] FAIL: no image returned ({elapsed:.1f}s)")
            return style_id, None, elapsed

        out_path = OUTPUT_DIR / f"{style_id}.png"
        out_path.write_bytes(image_bytes)
        print(f"[{style_id}] OK: {out_path.name} ({len(image_bytes) // 1024}KB, {elapsed:.1f}s)")
        return style_id, out_path, elapsed
    except Exception as e:
        elapsed = time.time() - start
        print(f"[{style_id}] ERROR: {e} ({elapsed:.1f}s)")
        return style_id, None, elapsed


if __name__ == "__main__":
    print("=" * 60)
    print("Mapbox Style Comparison -- 3 styles, same content")
    print(f"Model: {MODEL}")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)

    results = {}
    with ThreadPoolExecutor(max_workers=3) as ex:
        futures = {ex.submit(generate, k, v): k for k, v in PROMPTS.items()}
        for fut in as_completed(futures):
            style_id, path, elapsed = fut.result()
            results[style_id] = (path, elapsed)

    print("\n" + "=" * 60)
    print("RESULTS:")
    for style_id in PROMPTS.keys():
        path, elapsed = results.get(style_id, (None, 0))
        status = "OK" if path else "FAIL"
        print(f"  {style_id}: {status} ({elapsed:.1f}s)")
    print("=" * 60)
