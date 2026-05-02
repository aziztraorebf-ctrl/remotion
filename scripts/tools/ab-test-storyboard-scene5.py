#!/usr/bin/env python3
"""A/B Test: Gemini 3 Pro vs GPT Image 2 (fal.ai) for Sonjata Scene 5 storyboard 3x3.

Generates SAME prompt + SAME REF char-sheet on both models.
Output: tests/2026-05-01-gpt-image2-vs-gemini-scene5/
"""

import base64
import os
import sys
import time
from pathlib import Path

import fal_client
from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
REF_PATH = PROJECT_ROOT / "sonjata-papercraft" / "images" / "scene3-ref-soundjata-charsheet.png"
OUTPUT_DIR = PROJECT_ROOT / "tests" / "2026-05-01-gpt-image2-vs-gemini-scene5"

PROMPT = """9-panel papercraft storyboard, 3x3 grid layout, format 9:16 vertical.
Bold black borders between panels, white gutters between cells, panels clearly numbered 1 through 9 in small black numerals at top-left of each panel.

Consistent character across ALL 9 panels: young African boy, dark chocolate brown skin, curly black hair, red sash tied at waist, bare-chested, chibi proportions (big head, small body), thick black outlines, expressive face. Same character, same outfit, same hairstyle in every panel.

Setting: Mande village, golden hour, warm sepia aged paper texture, straw huts with conical thatched roofs and giant baobab trees in background, clay-red ground.

Panel 1: Wide shot — boy stands defiant in village center, fists clenched, diverse village crowd watching from edges (old bearded elder leaning on staff, mother holding baby, children, adults of varied African ethnicities and ages).
Panel 2: Medium — boy walks toward giant baobab, determined expression, eyebrows furrowed.
Panel 3: Close-up — boy's small hands grip the massive baobab trunk.
Panel 4: Medium — boy pulls hard, muscles tensing, sweat on brow, teeth gritted.
Panel 5: Wide — baobab roots beginning to crack the clay-red ground around the trunk.
Panel 6: Low angle — boy lifting baobab off ground, roots tearing free of soil.
Panel 7: Wide — baobab fully uprooted, held above boy's head, triumphant.
Panel 8: Medium — boy walks carrying the baobab over his shoulder, heading toward his mother.
Panel 9: Wide — boy lays baobab at his hunched mother's feet, the diverse crowd watching in awe with hands covering mouths.

Style anchor: papercraft cutout aesthetic, warm sepia palette (sepia, amber, honey, warm browns, terra-red), thick black outlines on every character and object, chibi super-deformed proportions throughout, aged paper texture visible, storybook illustration. NO floating particles, NO dust motes, NO sparkles, NO pollen. Dot-eyes for all background characters. All characters dark brown skin appropriate to West African Mandinka people, varied facial features and ages — no two background faces alike."""


def gen_gemini(out_path: Path) -> dict:
    """Generate via Gemini 3.1 Flash Image (gemini-3.1-flash-image-preview)."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {"ok": False, "error": "GEMINI_API_KEY not set"}

    print("\n[Gemini] Loading REF + sending request...")
    client = genai.Client(api_key=api_key)
    ref_bytes = REF_PATH.read_bytes()
    ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")

    t0 = time.time()
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            contents=[ref_part, PROMPT],
            config=types.GenerateContentConfig(response_modalities=["image", "text"]),
        )
    except Exception as e:
        return {"ok": False, "error": f"Gemini API error: {e}"}

    elapsed = time.time() - t0

    saved = False
    text_resp = ""
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            out_path.write_bytes(part.inline_data.data)
            saved = True
        elif part.text:
            text_resp += part.text

    if not saved:
        return {"ok": False, "error": f"Gemini: no image in response. Text: {text_resp}"}

    return {
        "ok": True,
        "path": str(out_path),
        "elapsed_s": round(elapsed, 2),
        "model": "gemini-3.1-flash-image-preview",
        "estimated_cost_usd": 0.039,
    }


def gen_gpt_image_2(out_path: Path, quality: str = "medium") -> dict:
    """Generate via fal.ai openai/gpt-image-2/edit (with REF as image_url)."""
    if not os.environ.get("FAL_KEY"):
        return {"ok": False, "error": "FAL_KEY not set"}

    print(f"\n[GPT Image 2] Uploading REF to fal storage...")
    t0 = time.time()
    try:
        ref_url = fal_client.upload_file(str(REF_PATH))
        print(f"[GPT Image 2] REF uploaded: {ref_url[:80]}...")
    except Exception as e:
        return {"ok": False, "error": f"fal upload error: {e}"}

    print(f"[GPT Image 2] Submitting request (quality={quality}, size=portrait_16_9)...")
    try:
        result = fal_client.subscribe(
            "openai/gpt-image-2/edit",
            arguments={
                "prompt": PROMPT,
                "image_urls": [ref_url],
                "quality": quality,
                "image_size": "portrait_16_9",
            },
            with_logs=True,
        )
    except Exception as e:
        return {"ok": False, "error": f"fal API error: {e}"}

    elapsed = time.time() - t0
    images = result.get("images") or []
    if not images:
        return {"ok": False, "error": f"No image in fal response. Raw: {result}"}

    img = images[0]
    img_url = img.get("url") if isinstance(img, dict) else None
    if not img_url:
        return {"ok": False, "error": f"Missing image URL. Raw: {result}"}

    import urllib.request
    urllib.request.urlretrieve(img_url, out_path)

    cost_map = {"low": 0.006, "medium": 0.053, "high": 0.211}
    return {
        "ok": True,
        "path": str(out_path),
        "elapsed_s": round(elapsed, 2),
        "model": f"openai/gpt-image-2/edit (quality={quality})",
        "estimated_cost_usd": cost_map.get(quality, 0.053),
        "remote_url": img_url,
    }


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not REF_PATH.exists():
        print(f"ERROR: REF not found: {REF_PATH}")
        sys.exit(1)

    print(f"REF: {REF_PATH}")
    print(f"Output dir: {OUTPUT_DIR}")
    print(f"Prompt length: {len(PROMPT)} chars\n")

    # Save the shared prompt for traceability
    (OUTPUT_DIR / "PROMPT.md").write_text(
        f"# A/B Test Prompt — Sonjata Scene 5 Baobab\n"
        f"Date: 2026-05-01\n"
        f"REF: {REF_PATH.relative_to(PROJECT_ROOT)}\n\n"
        f"## Shared prompt (sent to BOTH models)\n\n{PROMPT}\n"
    )

    results = {}
    out_a = OUTPUT_DIR / "A-gemini-3-1-flash-storyboard.png"
    out_b = OUTPUT_DIR / "B-gpt-image-2-medium-storyboard.png"

    print("=" * 70)
    print("VARIANT A: Gemini 3.1 Flash Image")
    print("=" * 70)
    results["A"] = gen_gemini(out_a)
    print(f"Result A: {results['A']}")

    print("\n" + "=" * 70)
    print("VARIANT B: GPT Image 2 (fal.ai, quality=medium)")
    print("=" * 70)
    results["B"] = gen_gpt_image_2(out_b, quality="medium")
    print(f"Result B: {results['B']}")

    # Summary
    print("\n" + "=" * 70)
    print("A/B TEST SUMMARY")
    print("=" * 70)
    total_cost = 0.0
    for label, r in results.items():
        if r.get("ok"):
            print(f"[{label}] OK  | {r['elapsed_s']}s | ~${r['estimated_cost_usd']:.3f} | {r['model']}")
            print(f"     -> {r['path']}")
            total_cost += r["estimated_cost_usd"]
        else:
            print(f"[{label}] FAIL | {r.get('error')}")
    print(f"\nTotal estimated cost: ~${total_cost:.3f}")

    # Write summary file
    (OUTPUT_DIR / "RESULTS.md").write_text(
        f"# A/B Test Results — 2026-05-01\n\n"
        f"## Variant A (Gemini 3.1 Flash Image)\n```\n{results['A']}\n```\n\n"
        f"## Variant B (GPT Image 2 medium via fal.ai)\n```\n{results['B']}\n```\n\n"
        f"Total estimated cost: ~${total_cost:.3f}\n"
    )

    return 0 if all(r.get("ok") for r in results.values()) else 2


if __name__ == "__main__":
    sys.exit(main())
