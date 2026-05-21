"""
Regen Thiaroye Scene 1 V4 FRESH (R-PROMPT-LIBERAL v3).
Same liberal composition/expressions approach as V4-archive, but with MASSIVELY
reinforced technical locks on dot-eyes, flat fills, and REF1 style dominance.
Output: public/assets/thiaroye-1944/scene1/scene1-source-v4.png
Cost: ~$0.04 (Gemini 3.1 Flash Image).
"""
import base64
import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

REPO = Path("/Users/clawdbot/Workspace/remotion")
STYLE_ANCHOR = Path("/tmp/thiaroye-v5-style-anchors/scene1-assembled-frame.png")
CHAR_REF = REPO / "public/assets/thiaroye-1944/refs/tirailleur-principal-charsheet.png"
OUT_PNG = REPO / "public/assets/thiaroye-1944/scene1/scene1-source-v4.png"
OUT_PROMPT = REPO / "public/assets/thiaroye-1944/scene1/scene1-source-v4.prompt.txt"

PROMPT = """Paper-craft storybook illustration, 9:16 vertical frame.

SCENE: Cold December morning, 1944. On the deck of a French troop ship approaching the port of Dakar. Senegalese tirailleurs are returning home after fighting for France. The ship is APPROACHING -- not docked. Dakar's colonial waterfront emerges in cold misty distance. A lived-in moment of arrival -- weary, quiet, human.

STYLE ANCHORS (read this carefully):
- REFERENCE 1 is our canonical Sonjata paper-craft storybook style. This is the PRIMARY STYLE AUTHORITY. If any conflict arises between REF 1 and REF 2, REF 1 WINS on all style decisions (line quality, fill type, face rendering, proportions, texture).
- REFERENCE 2 is the exact tirailleur character design (khaki-green uniform, French tricolor flag patch on shoulder, dark green beret, dark brown West African skin). Use REF 2 ONLY for costume details and skin tone -- NOT for face rendering style. Face rendering style always comes from REF 1.

LIFE ON DECK (compose freely, organic):
- 6 to 8 Senegalese tirailleurs scattered naturally across the deck.
- Each soldier has his own small moment: some lean on the railing looking toward Dakar, some sit on crates or duffel bags, some stand quietly, some in small conversation of two or three, one perhaps smoking, one perhaps adjusting his kit or beret, one perhaps looking down lost in thought.
- Expressions are VARIED and HUMAN: weary, pensive, curious, tired, thoughtful, distant, one slight smile, one frown. NOT all identical, NOT frozen, NOT ceremonial. Each face tells its own small story.
- All soldiers are West African Senegalese with DARK BROWN skin. No ambiguity with North African or lighter tones. Distinct facial structures -- no two soldiers look like clones.

COMPOSITION -- ANTI-PARADE (critical):
- NO frontal line composition. NO duo walking synchronously side by side. NO soldiers aligned in a row facing the camera.
- Figures are STAGGERED IN DEPTH at multiple distances from camera: some close to foreground (large in frame), some mid-ground, some deeper near the railing or the ship cabin.
- Natural grouping with individual GAPS between them -- not clustered tight, not evenly spaced. Organic negative space. Some alone, some in pairs, some in loose group of three.
- Varied body orientations: some face the shore (backs or 3/4 back to camera), some face each other in profile, some at 3/4 angle, a few facing roughly toward us but at different depths.

ENVIRONMENT:
- Foreground: weathered wooden deck planks, a few tan canvas duffel bags, maybe a rope coil.
- Mid/background: the ship's low railing (iron or wood), a hint of the ship's cabin or chimney silhouette on one side, the harbor water with simple flat ripple shapes, Dakar's colonial port silhouette emerging in the cold distance (rooflines, a small lighthouse or warehouse shapes, all desaturated cold greys).
- PALETTE dual-tone THEMATIC: cold world (sky, water, Dakar buildings, deck surfaces, railings) in desaturated slate grey / cold blue-grey / muted steel / pale overcast; warm pockets (tirailleur uniforms, berets, boots, duffel bags, skin tones) in khaki-green / dark green / brown leather / tan canvas / dark brown skin. Cold overcast morning -- NO golden hour, NO warm sunset glow.

CRITICAL TECHNICAL RULES (NON-NEGOTIABLE -- these override absolutely everything else, including REF 2):

--- DOT-EYES LOCK (REPEATED BECAUSE IT MUST HAPPEN) ---
Every single face in this image has PURE DOT-EYES: one small solid black dot per eye. That is all. Two black dots per face. Nothing more on the eyes.
PURE DOT-EYES on every face. PURE DOT-EYES on every face. PURE DOT-EYES on every face.
NO iris. NO pupil detail. NO white sclera showing. NO eyelashes. NO cartoon-style round eyes. NO anime eyes. NO realistic eyes. NO BD / comic book eyes. NO expressive eye rendering of any kind.
This applies to EVERY face without exception: foreground soldiers, background soldiers, soldiers in profile (one dot visible), soldiers at 3/4 angle (two dots asymmetric), soldiers at distance (still two tiny dots, not omitted).
If you are tempted to draw anything other than a solid black dot on an eye, STOP and draw a dot.

--- FLAT COLOR FILLS LOCK (REPEATED BECAUSE IT MUST HAPPEN) ---
All color is applied in FLAT SOLID BLOCKS bounded by thick black outlines.
FLAT COLOR FILLS. FLAT COLOR FILLS. FLAT COLOR FILLS.
NO hatching. NO cross-hatching. NO pencil hatching. NO pen stroke shading. NO gradients on uniforms or faces. NO soft airbrushed shadows. NO painterly brushwork. NO watercolor bleeding. NO cartoon cel-shading with 2 tones per surface. NO comic book style inking with shadow hatches. NO BD (bande dessinee) ligne claire with multiple-tone shading.
This is PAPER-CRAFT SONJATA STYLE (REF 1) ONLY: flat solid color inside thick outlines, period.
Paper kraft texture is allowed ONLY on background surfaces (sky, distant Dakar buildings, water). Uniforms, faces, hands, duffel bags = pure flat color, zero texture.

--- STYLE PROPORTIONS LOCK ---
Rounded cartoon storybook proportions like REF 1 Sonjata. NOT semi-realistic BD. NOT Pixar 3D. NOT photorealism. NOT anime. NOT manga. NOT graphic novel realism.
Thick black outlines (2-3 px equivalent) on all figures and foreground objects, same weight as REF 1.

--- NEGATIVE LIST ---
NO text anywhere: no ship names, no signs, no banners, no writing on flag patches beyond the plain tricolor, no numerals, no letters.
NO motion lines, NO speed lines, NO drawn wind, NO drawn light rays, NO lens flares.
NO emotion marks: no sweat drops, no thought bubbles, no exclamation marks, no anime-style surprise lines.
NO weapons visible.
9:16 vertical aspect ratio.

MOOD: lived-in, quiet, human, cold arrival. Let the scene breathe -- natural staggered composition, varied humanity, paper-craft storybook warmth. This is deck life at the end of a long voyage home, not a staged ceremony.

FINAL REMINDER: REF 1 Sonjata paper-craft style dominates. Every face has PURE DOT-EYES. Every surface has FLAT COLOR FILLS. No exceptions, no drift, no cartoon eyes, no hatching."""


def main() -> int:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set", file=sys.stderr)
        return 1

    if not STYLE_ANCHOR.exists():
        print(f"ERROR: style anchor missing: {STYLE_ANCHOR}", file=sys.stderr)
        return 1
    if not CHAR_REF.exists():
        print(f"ERROR: char ref missing: {CHAR_REF}", file=sys.stderr)
        return 1

    client = genai.Client(api_key=api_key)

    anchor_bytes = STYLE_ANCHOR.read_bytes()
    charref_bytes = CHAR_REF.read_bytes()

    print(f"Style anchor (REF 1): {STYLE_ANCHOR} ({len(anchor_bytes)} bytes)")
    print(f"Char ref (REF 2): {CHAR_REF} ({len(charref_bytes)} bytes)")
    print(f"Prompt length: {len(PROMPT)} chars, {PROMPT.count(chr(10)) + 1} lines")
    print("Calling Gemini 3.1 Flash Image...")

    t0 = time.time()
    resp = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[
            types.Part.from_bytes(data=anchor_bytes, mime_type="image/png"),
            types.Part.from_bytes(data=charref_bytes, mime_type="image/png"),
            PROMPT,
        ],
    )
    dt = time.time() - t0
    print(f"Response in {dt:.1f}s")

    image_saved = False
    for cand in resp.candidates or []:
        for part in cand.content.parts or []:
            inline = getattr(part, "inline_data", None)
            if inline and inline.data:
                OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
                OUT_PNG.write_bytes(inline.data)
                print(f"Saved: {OUT_PNG} ({len(inline.data)} bytes)")
                image_saved = True
                break
        if image_saved:
            break

    if not image_saved:
        print("ERROR: no image in response", file=sys.stderr)
        for cand in resp.candidates or []:
            for part in cand.content.parts or []:
                if getattr(part, "text", None):
                    print("TEXT PART:", part.text[:500])
        return 2

    header = (
        "# Scene 1 V4 FRESH source image prompt (R-PROMPT-LIBERAL v3)\n"
        "Model: models/gemini-3.1-flash-image-preview\n"
        f"Anchor 1 (PRIMARY STYLE): {STYLE_ANCHOR}\n"
        f"Anchor 2 (costume only): {CHAR_REF}\n"
        "Reinforcements vs v2 (archive): REF1 dominance clause, triple repetition dot-eyes, "
        "triple repetition flat fills, explicit NO cartoon/BD/anime/painterly, "
        "explicit lock uniforms = zero texture.\n\n"
        "---PROMPT---\n"
    )
    OUT_PROMPT.write_text(header + PROMPT + "\n", encoding="utf-8")
    print(f"Saved prompt: {OUT_PROMPT}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
