"""
Regeneration Thiaroye V5 — Scenes 3B, 4B, 5A, 6 (v2)
Corrections validees par Aziz 2026-04-24.
Cost: ~$0.08 per image x 4 = ~$0.32
"""
import base64
import os
import time
from pathlib import Path

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

REPO = Path("/Users/clawdbot/Workspace/remotion")
STYLE_ANCHOR = Path("/tmp/thiaroye-v5-style-anchors/scene1-assembled-frame.png")
BIRAM_REF = REPO / "public/assets/thiaroye-1944/refs/biram-senghor-charsheet.png"
JEUNE_REF = REPO / "public/assets/thiaroye-1944/refs/jeune-temoin-charsheet.png"
SCENE3B_V1B = REPO / "public/assets/thiaroye-1944/scene3b/scene3b-source-v1b.png"


def load_image(path: Path) -> types.Part:
    data = path.read_bytes()
    ext = path.suffix.lower()
    mime = "image/png" if ext == ".png" else "image/jpeg"
    return types.Part.from_bytes(data=data, mime_type=mime)


def generate(client, parts: list, out_path: Path, prompt_path: Path, prompt_text: str):
    print(f"\n--- Generating {out_path.name} ...")
    prompt_path.write_text(prompt_text, encoding="utf-8")

    contents = parts + [types.Part.from_text(text=prompt_text)]

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            out_path.write_bytes(part.inline_data.data)
            size_kb = out_path.stat().st_size // 1024
            print(f"    Saved: {out_path} ({size_kb} KB)")
            return True
        elif hasattr(part, "text") and part.text:
            print(f"    Text response: {part.text[:200]}")

    print("    ERROR: no image in response")
    return False


PROMPT_4B = """Paper-craft storybook illustration, 9:16 vertical frame.

SCENE: Modern French courtroom interior, 2026.
Close-up: a lawyer's hands in dark charcoal-grey suit sleeves place a thick folded legal document on a honey-blond wooden desk. The document is cream-beige, thick, folded. The hands are mid-placement — fingers just releasing the paper.

BACKGROUND (blurred, suggested): a tricolor republican flag rendered as three vertical color-aplat stripes (blue / white / red). NO heraldic details. NO coat of arms. NO emblem. NO writing. Just three flat color bands. Wooden paneling suggestion in grey-blue.

STYLE (match REF 1 exactly): Paper-craft STRICT. Thick black outlines on all elements. Flat color fills ONLY — zero gradients, zero hatching, zero shadows, zero shading. Paper kraft texture allowed on background surfaces only.

PALETTE: cold grey-blue courtroom air. Honey-blond desk (flat amber-ochre aplat). Cream-beige document. Dark charcoal-grey suit sleeves. Tricolor flag in background: flat blue / flat white / flat red strips. NOT photorealistic fabric. NOT gradient. Pure aplat.

COMPOSITION 9:16 VERTICAL:
- Lawyer's hands center-frame, slightly low, document in mid-placement on the desk
- Desk surface fills mid-frame horizontally
- Tricolor flag blurred in upper-left background (color bands only)
- No faces, no bodies visible — hands and sleeves only

CRITICAL RULES (NON-NEGOTIABLE):
- FLAT COLOR FILLS ONLY. No gradients. No hatching. No shading.
- Thick black outlines on hands, sleeves, desk edges, document edges.
- NO readable text on the document — blank cream surface only.
- Flag = THREE FLAT COLOR STRIPES ONLY. No heraldry. No text. No emblem.
- No text anywhere in the image.
- Paper-craft style matches REF 1 exactly: storybook rounded forms, flat fills, thick lines.
- 9:16 vertical aspect ratio.

MOOD: institutional cold, restrained authority."""

PROMPT_5A = """Paper-craft storybook illustration, 9:16 vertical frame.

REFERENCE INSTRUCTIONS:
- REF 1 is the canonical paper-craft style (PRIMARY STYLE AUTHORITY). REF 1 wins on all style decisions.
- REF 2 is Biram Senghor's exact character design. Use REF 2 for costume details and skin tone. Face rendering always comes from REF 1.

SCENE: Biram Senghor at the Thiaroye Memorial, 2026. An elderly Senegalese man in a dark navy suit, holding a folded legal document in both hands at chest level. His grip is firm, committed. His gaze is directed toward the portrait wall (three-quarter view, not facing camera directly).

BACKGROUND: a wall of portrait silhouettes in an irregular grid (7-9 frames, varying sizes). Each portrait frame contains a paper-craft silhouette of a tirailleur — simple flat dark shapes. All portraits in muted grey-black tones. Cold overcast memorial lighting from upper left.

Small eternal flame at bottom-right corner: a tiny flat orange aplat shape. No glow. No gradient. Just a flat paper-craft flame shape.

STYLE: Paper-craft STRICT (REF 1 rules). Thick black outlines. Flat color fills only. Paper kraft texture on background wall only.

PALETTE: cold overcast memorial tones. Biram in dark navy suit. Portrait wall in muted grey-black. Eternal flame: small flat orange (ONLY warm element).

COMPOSITION 9:16 VERTICAL:
- Biram center-left, three-quarter view toward the portraits
- Portrait wall fills right two-thirds of background
- Cold directional light from upper left
- Eternal flame small shape at bottom-right
- Document held at chest level, both hands gripping firmly

DOT-EYES LOCK (NON-NEGOTIABLE — REPEATED):
Every face in this image has PURE DOT-EYES: one small solid black dot per eye. That is ALL.
PURE DOT-EYES. PURE DOT-EYES. PURE DOT-EYES.
NO iris. NO pupil detail. NO white sclera. NO eyelashes. NO realistic eyes.
This applies to Biram AND to any tirailleur silhouettes in portrait frames.
If you are tempted to draw anything other than a solid black dot — STOP. Draw a dot.

FLAT COLOR FILLS LOCK (NON-NEGOTIABLE — REPEATED):
FLAT COLOR FILLS. FLAT COLOR FILLS. FLAT COLOR FILLS.
No hatching. No gradients. No cel-shading. No painterly strokes.

CRITICAL RULES:
- NO readable text anywhere: no names on portraits, no text on document, no captions.
- NO text of any kind visible anywhere in the image.
- NO banners, no signs, no writing, no numerals.
- NO glow effects on the eternal flame.
- 9:16 vertical aspect ratio.
- Match Biram charref (REF 2) for costume + skin tone. REF 1 governs style.

LIFE IN THE SCENE:
- Biram's thumb presses the document edge
- His torso leans slightly forward, weight committed
- Portrait silhouette heads at varied angles (profile, frontal, three-quarter)

MOOD: dignified, historic, weighted."""

PROMPT_6 = """Paper-craft storybook illustration, 9:16 vertical frame.

REFERENCE INSTRUCTIONS:
- REF 1 is the canonical paper-craft style (PRIMARY STYLE AUTHORITY).
- REF 2 is the jeune temoin character design. Use REF 2 for costume silhouette and skin tone.

SCENE: Dakar coast at sunset, present day. A young Senegalese man (20s) stands at the water's edge, BACK TO CAMERA OBLIGATORY — we never see his face. His posture is dignified, weight committed, feet planted. He wears simple modern clothes: open jacket over a light shirt, rolled-up jeans. His hair is rendered in FLAT FILLS with thick black outlines — NO realistic hair strands, NO gradients in hair.

STYLE: Paper-craft STRICT (REF 1). Thick black outlines on all elements. Flat color fills ONLY — zero gradients, zero shading, zero hatching. Paper kraft texture on sky and water only.

PALETTE: FULL WARM RESTORED:
- Sky: warm golden orange to deep indigo at the very top (aplat stepped color bands, NOT photorealistic gradient)
- Ocean: deep blue-green flat aplat with simple flat ripple lines
- Earth at his feet: warm red-ochre flat fill
- Young man's jacket: flat dark fill, contrasting against warm sky
- Sun: flat warm disc shape low on the horizon, reflection as simple vertical strip on the water

COMPOSITION 9:16 VERTICAL:
- Young man center-foreground, BACK TO CAMERA, three-quarter back angle
- Ocean fills horizontal mid-ground band
- Sun disc low at center of horizon line
- Sky occupies upper two-thirds — stepped sunset color zones
- At his feet on the sand: one old photograph face-down (flat rectangle, no text visible), one small shell shape, one piece of driftwood flat shape
- 2-3 bird silhouettes in the sky — simple flat two-wing shapes

LIFE IN THE SCENE:
- Shirt collar caught by wind (flat aplat shape suggesting hem lift)
- Jacket hem suggests slight billow (flat shape variation)
- One foot slightly forward, natural weight shift
- Wave lines at the shoreline (flat horizontal paper-craft ripple shapes)
- Tiny pirogue silhouette in far distance at horizon

CRITICAL RULES (NON-NEGOTIABLE):
- BACK TO CAMERA — absolutely no face visible. No profile. No three-quarter front. Back only.
- FLAT COLOR FILLS ONLY. No gradients in the figure. No realistic hair rendering.
- Hair = flat filled shape with thick outline.
- Thick black outlines on the figure, birds, driftwood, objects at feet.
- NO readable text anywhere.
- 9:16 vertical aspect ratio.
- Warm palette is aplat stepped color zones — NOT photorealistic sunset.

MOOD: contemplative, open, hopeful. First breath of warmth after a film of cold greys."""

PROMPT_3B = """Take this paper-craft illustration exactly as it is. Make these SURGICAL CHANGES ONLY:

CHANGE 1 — REMOVE the realistic white hand with teardrop completely.
Replace that area with the ochre courtyard ground texture already present in the image — flat ochre-brown paper-craft fill, consistent with the surrounding ground color.

CHANGE 2 — REMOVE the bright red-scarlet blood pool completely.
Replace that area with the same ochre-brown courtyard ground flat fill. The silhouettes on the ground remain exactly as they are. The ground around them becomes ochre — no red pool, no scarlet.

DO NOT CHANGE ANYTHING ELSE:
- Keep all silhouettes exactly as they are (position, shape, posture, flat fills)
- Keep the fallen rifle exactly as it is
- Keep the lantern exactly as it is
- Keep the cold grey sky exactly as it is
- Keep all other compositional elements intact
- Keep the paper-craft style, thick outlines, flat fills throughout
- Keep the courtyard ground color (ochre-brown) in all other areas

Result: courtyard ground + silhouettes + rifle + lantern. Realistic hand GONE. Red pool GONE. Ochre ground everywhere."""


def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env")

    client = genai.Client(api_key=api_key)

    style = load_image(STYLE_ANCHOR)

    scenes = [
        {
            "name": "4B",
            "parts": [style],
            "prompt": PROMPT_4B,
            "out": REPO / "public/assets/thiaroye-1944/scene4b/scene4b-source-v2.png",
            "prompt_out": REPO / "public/assets/thiaroye-1944/scene4b/scene4b-source-v2.prompt.txt",
        },
        {
            "name": "5A",
            "parts": [style, load_image(BIRAM_REF)],
            "prompt": PROMPT_5A,
            "out": REPO / "public/assets/thiaroye-1944/scene5a/scene5a-source-v2.png",
            "prompt_out": REPO / "public/assets/thiaroye-1944/scene5a/scene5a-source-v2.prompt.txt",
        },
        {
            "name": "6",
            "parts": [style, load_image(JEUNE_REF)],
            "prompt": PROMPT_6,
            "out": REPO / "public/assets/thiaroye-1944/scene6/scene6-source-v2.png",
            "prompt_out": REPO / "public/assets/thiaroye-1944/scene6/scene6-source-v2.prompt.txt",
        },
        {
            "name": "3B (chirurgical)",
            "parts": [load_image(SCENE3B_V1B)],
            "prompt": PROMPT_3B,
            "out": REPO / "public/assets/thiaroye-1944/scene3b/scene3b-source-v2.png",
            "prompt_out": REPO / "public/assets/thiaroye-1944/scene3b/scene3b-source-v2.prompt.txt",
        },
    ]

    for scene in scenes:
        try:
            ok = generate(client, scene["parts"], scene["out"], scene["prompt_out"], scene["prompt"])
            if ok:
                print(f"    Scene {scene['name']}: OK")
            else:
                print(f"    Scene {scene['name']}: FAILED — no image returned")
        except Exception as e:
            print(f"    Scene {scene['name']}: ERROR — {e}")
        time.sleep(3)

    print("\nDone.")


if __name__ == "__main__":
    main()
