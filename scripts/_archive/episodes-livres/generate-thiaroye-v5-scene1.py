"""Generate Thiaroye V5 Scene 1 source image — Le Retour.

Scene 1 spec v2 (regen 2026-04-23 — NAVIRE ARRIVE, pas quai, froid arrivee matinale):
- Title: "Le Retour"
- Duration: 14s (start 5s, end 19s)
- Type: contemplative
- Description v2: Pont d'un navire de troupes approchant Dakar, decembre 1944, matin froid.
  Trois tirailleurs principaux debout avec trinite d'activites (main sur sac+poche / beret
  en main+sangle / allumer cigarette). 3-5 figures secondaires sur le pont (accoude
  bastingage, assis sur caisse, conversation, marche). Dakar emerge au loin en silhouettes
  froides. Pas de golden hour — palette froide uniforme, les tirailleurs restent en tons
  ocre-khaki contre monde gris-bleu.
- Narration: "Decembre 1944. Le port de Dakar. Trois tirailleurs rentrent au pays.
  Ils ont combattu pour la France. Leur France. Ils attendent leur solde."
- Camera movement (for Seedance I2V next step): Slow dolly in toward central tirailleur
  (beret en main), then 45-degree cinematic arc around his profile. The cigarette smoke curl
  and sea ripples provide natural micro-motion anchors during the movement.

Pipeline: Gemini paper-craft image -> Seedance image-to-video (next step, I2V only per R-PC11)

STRICT STYLE FIDELITY: flat 2D paper-craft, cold grey-blue-olive palette for colonial
world, warm ochre-khaki tones retained on tirailleurs (thematic contrast per spec),
simple character shapes with dot-eyes, clean dark outlines, flat color fills,
paper texture.

Double anchor strategy (proven V4 charrefs pattern):
1. Sonjata scene1 frame (paper-craft canonical) — /tmp/thiaroye-v5-style-anchors/scene1-assembled-frame.png
2. Tirailleur V3 charref (validated cold palette + dot-eyes + R-PC17) —
   public/assets/thiaroye-1944/refs/tirailleur-principal-charsheet.png

Compositional anchor v2: R-PC1 neutral FACES + R-DYNAMIC v2 lived-in atmosphere.
The 3 principal tirailleurs stand with CALM NEUTRAL FACES but engage hands with personal
objects (bag+pocket / beret-in-hand+strap / lighting cigarette). 3-5 secondary figures
scattered on deck with varied activities (leaning railing, seated, conversing, walking).
Trinity of activities = natural posture, NOT ceremonial. Smoke curl + beret + ripples
provide intrinsic motion anchors for Seedance animation. Anti-parade, anti-homecoming.

No end-frame motion artifacts (R-PC6, R-PC7): clean dock surface, no motion blur, no
dust clouds, no drawn effects.

R-PC17 (strict dot-eyes): explicitly restated, applies even in profile.
R-PC18 (atmosphere without drift): cold overcast morning, anti-shading clause retained.
R-PC19: not applicable (no graphic violence in this scene).
R-DYNAMIC v2 (added 2026-04-23): lived-in atmosphere via trinity of activities on principals
+ secondary figures with varied actions. Anti-parade clause explicit.

Model: gemini-3.1-flash-image-preview
Cost: $0.04 for 1 image (single generation, no retries planned unless self-review fails).
"""
import asyncio
import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUT_DIR = ROOT / "public" / "assets" / "thiaroye-1944" / "scene1"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# DOUBLE ANCHOR — proven pattern from V4 charrefs regen
STYLE_ANCHOR_1 = Path("/tmp/thiaroye-v5-style-anchors/scene1-assembled-frame.png")
STYLE_ANCHOR_2 = (
    ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "tirailleur-principal-charsheet.png"
)


STYLE_CLAUSE = """STYLE - CRITICAL - MATCH BOTH REFERENCE IMAGES PRECISELY:

You are given TWO reference images that together define the target style.

REFERENCE 1 (Sonjata village scene): our canonical PAPER-CRAFT STORYBOOK ILLUSTRATION style.
- Observe the thick black outlines around every shape.
- Observe the flat color fills with no gradients.
- Observe the paper kraft texture of the background.
- Observe the rounded cartoon proportions.
- Observe the PURE DOT EYES on every character, including elderly faces.

REFERENCE 2 (tirailleur character sheet): the exact character appearance required in this scene.
- The three tirailleurs in the scene you are generating must match this character sheet EXACTLY — same face simplification level, same uniform, same beret, same skin tone, same dot-eyes.
- Observe especially the PROFILE VIEW (rightmost figure): the eye is ONE BLACK DOT. Not an almond. Not an iris. Not a pupil structure. Just a dot.
- Skin is completely smooth — no wrinkles, no texture, no age lines even on the older-looking soldier.
- Outlines are thick and confident. Color fills are flat.

YOU MUST MATCH THIS LEVEL OF SIMPLIFICATION.

STRUCTURAL STYLE (non-negotiable):
- THICK BLACK OUTLINES around every shape (bold, confident)
- FLAT COLOR FILLS inside each shape (NO gradients, NO shading, NO soft ambient occlusion)
- PAPER KRAFT TEXTURE visible in the background (subtle grain)
- ROUNDED CARTOON PROPORTIONS (rounded heads, simplified bodies — NOT semi-realistic BD)
- PURE DOT-EYES: each eye is ONE SIMPLE BLACK DOT in ALL views including profile — no iris, no white visible, no pupil structure, no eyelashes, no almond shape

PALETTE — Thiaroye 1944 colonial contrast (dual-tone, COLD MORNING):
- COLONIAL WORLD BACKGROUND (ship deck surfaces, port buildings of Dakar in distance, harbor water, sky, railings, crates, ropes) = DESATURATED COLD palette: slate grey, cold blue-grey, muted steel, washed-out beige, greyish water, pale cold clouds.
- TIRAILLEURS (the three principals + secondary figures + their duffel bags) = WARM OCHRE-KHAKI tones retained: khaki-green uniforms (same as reference charref), dark brown skin, dark green berets, brown leather boots, tan canvas duffel bags.
- SKY = COLD OVERCAST MORNING — pale slate-blue, muted grey clouds as flat shapes. NO golden hour, NO orange-gold sunset band, NO warm horizon. The scene is a weary cold arrival, not a cinematic sunset.
- CONTRAST: the colonial world (ship, Dakar, sky, water) reads as cold/indifferent/overcast; the tirailleurs read as warm/human pockets in that cold world. This is the thematic point — they return to a world that is cold to them.

STRICT RULES:
- NO photorealism, NO Pixar 3D, NO Disney BD flat
- NO iris or pupils (just black dots)
- NO shading gradients (flat fills only, warmth comes from color choice)
- NO thin lines (bold thick outlines)
- NO text, NO labels, NO banners, NO writing anywhere (no ship names, no signs, no flags with text)

FORMAT: 1080x1920 vertical (9:16)."""


# ==========================================================================
# Scene 1 prompt v2 — "Le Retour" (regen 2026-04-23)
# ==========================================================================
# Composition = R-PC1 neutral FACES + R-DYNAMIC v2 lived-in bodies/hands.
# 3 principal tirailleurs with trinity of activities (bag+pocket / beret-in-hand+strap /
# lighting cigarette). 3-5 secondary figures on deck with varied natural actions.
# No drawn motion lines, no drawn effects (R-PC6, R-PC7). Seedance will animate the
# slow dolly-in + arc in the NEXT step; smoke curl, beret, ripples = animation anchors.

PROMPT_SCENE1 = f"""Generate a paper-craft scene illustration for a 9:16 vertical frame.

SCENE: Cold December morning, 1944. Aboard the deck of a French troop ship arriving at the port of Dakar. Three Senegalese tirailleurs stand together among other returning soldiers on the deck as the ship approaches the harbor, Dakar's colonial waterfront emerging in the misty grey distance. They are not yet disembarked — the ship is still approaching.

{STYLE_CLAUSE}

COMPOSITION (9:16 vertical, cinematic wide shot, SHIP ARRIVING, NOT docked):
- FOREGROUND (lower third): the wooden deck planks of the troop ship itself (we are ON the ship approaching Dakar, not on the quay yet). Deck planks are weathered paper-craft flat color, slightly worn. A few canvas TAN duffel bags rest grouped near the feet of the three principal tirailleurs. Deck has a ship's low railing visible at the very bottom edge, suggesting the vessel's side.
- MID-GROUND (center of frame): THREE principal Senegalese tirailleurs standing together on the ship's deck — NOT a parade, NOT a homecoming welcome line. They are quiet, weary men arriving, with a TRINITY OF ACTIVITIES that reads as life, not ceremony:
  - LEFT tirailleur: facing slightly left, 3/4 view, looking off-frame-left (toward the approaching city). ONE HAND rests on the top of his duffel bag at his feet, OTHER HAND tucked into his uniform pocket — weight shifted slightly to one leg, natural relaxed stance. Calm neutral face.
  - CENTRAL tirailleur (principal, focus of upcoming camera dolly-in): directly facing the camera in near-front 3/4 view, HOLDING HIS BERET IN ONE HAND at chest level (like a man who just removed it to feel the sea air), OTHER HAND resting on the canvas strap of his shoulder bag. Gaze forward and slightly down, thoughtful. Calm neutral face. He is the emotional anchor.
  - RIGHT tirailleur: in partial profile facing right, looking off-frame-right (toward the horizon). HE IS LIGHTING A CIGARETTE — one hand cupped near his mouth shielding the flame, the other hand holding a small match or lighter. A THIN SIMPLE WISP OF WHITE-GREY SMOKE curls up from the cigarette tip (flat paper-craft curl shape, not photoreal smoke). Calm neutral face, focused on the cigarette.
  - All three match the tirailleur character sheet exactly: khaki-green uniform with French flag patch on sleeve, dark green beret (CENTRAL has his in hand, LEFT and RIGHT wear theirs), dark brown skin, brown leather boots, PURE DOT EYES (one black dot per eye, even in profile), NO wrinkles, NO visible age, young adult proportions.
- SECONDARY FIGURES on the deck around them (LIFE ON DECK — essential for organic atmosphere, NOT a parade):
  - 3 to 5 additional tirailleur figures scattered naturally across the deck mid and background, each doing a DIFFERENT small activity:
    - One leaning both elbows on the ship's railing looking out at Dakar.
    - One seated on a wooden crate with elbows on knees, head slightly down, resting.
    - Two standing close together in quiet conversation, one gesturing slightly.
    - One walking across the deck carrying a rolled blanket or small kit.
  - These secondary figures match the charref style exactly (same khaki uniforms, dot-eyes, paper-craft) but are painted smaller / further back. They create LIVED-IN DECK ATMOSPHERE.
- BACKGROUND (upper half) — SHIP ARRIVING AT DAKAR:
  - The ship we stand on is approaching the port. Visible at the mid-background sides: the ship's own railing and part of its superstructure (a simple paper-craft silhouette of a cabin / chimney shape on the right edge, flat dark grey-blue).
  - MID-DISTANCE: the city of Dakar emerging on the horizon — simple paper-craft silhouettes of colonial port buildings (rooflines, a small lighthouse, 1 or 2 warehouse shapes), all in DESATURATED COLD greys and muted steel blues. A few distant simplified building silhouettes suggest human presence but NO text visible on any facade, NO signs, NO named landmarks.
  - HARBOR WATER (between us and Dakar): muted cold grey-blue flat color with a few simple flat lighter-grey ripple shapes (paper-craft waves, not photoreal reflections). The water reads as COLD, NOT warm.
  - UPPER BACKGROUND SKY: overcast pale cold slate-blue and muted grey clouds (paper-craft flat shapes). NO golden hour, NO warm sunset glow. This is a COLD DECEMBER MORNING arrival, not a romantic return.
  - Optional: a thin wisp of ship smoke from the chimney in the upper right, similar flat paper-craft curl.

INTRINSIC MOTION ANCHORS (compositional hint — ensure elements that will animate are clearly visible in the frame):
- The cigarette smoke curl on the RIGHT tirailleur must be visible and readable (it will animate as rising wisp later).
- The CENTRAL tirailleur's beret held in hand must be clearly shown (subtle turn / adjustment possible later).
- At least one secondary figure gesturing slightly must be visible (micro-motion anchor).
- The harbor water surface must have visible flat ripple shapes (will animate as gentle wave motion later).
- These are COMPOSITIONAL CUES ensuring animatable content exists — they are drawn as flat static shapes in this source image, NOT animated here.

CHARACTER STATE — CRITICAL (R-PC1 neutral start + R-DYNAMIC v2 lived-in atmosphere):
- The three principal tirailleurs have CALM NEUTRAL FACES — no dramatic emotion, no tears, no smiles, no grimaces, no raised arms, no salutes, no pointing gestures, no open mouths shouting. Dignified restraint.
- Their BODIES are neutral-readable (weight shifts, hand placements describe normal standing), their HANDS engage with personal objects (beret, bag strap, cigarette) — NOT ceremonial or parade gestures.
- Secondary figures show varied natural postures (leaning, seated, walking, conversing) — this is deck life, NOT a staged homecoming welcome.
- EXPLICIT ANTI-PATTERNS: NO parade formation, NO welcome committee behind them, NO crowd waving from the quay, NO flag ceremony, NO officers greeting them, NO homecoming music cue vibe. This is a weary arrival at dawn, quiet and lived-in.
- Motion of the clip (dolly-in + arc) will be added by Seedance — the SOURCE IMAGE must be a quiet still moment with clear animatable anchors.

CLEAN FRAME — CRITICAL (R-PC6, R-PC7):
- NO motion lines, NO speed lines, NO dust clouds, NO drawn wind effects, NO debris lifting, NO drawn light rays, NO drawn lens flares.
- NO drawn musical notes, NO drawn emotion marks, NO action bubbles.

ETHNIC SPECIFICATION (non-negotiable for historical accuracy):
- All three tirailleurs are West African, Senegalese, DARK BROWN skin.
- No ambiguity with North African or lighter tones.

ANTI-TROPISM — CRITICAL:
- NO romantic Western BD flat style (rosy cheeks, gradient shading, detailed hair strands).
- NO photorealism.
- NO semi-3D Pixar lighting.
- NO iris or eyelashes on any face. Pure dot-eyes, including the left and right soldiers' profile views.
- NO visible text, no banners, no signs, no ship names, no flag text. The French flag patch on the sleeves matches the charref exactly (a small tricolor rectangle, no writing).

FINAL REMINDER:
- Match the paper-craft style of Reference 1 exactly.
- Match the tirailleur character design of Reference 2 exactly (same uniform, same face simplification, same dot-eyes, same skin tone) — applies to ALL figures, principals AND secondary.
- COLD palette uniformly for the colonial world (cold overcast morning, NO golden hour), warm ochre-khaki retained only on soldiers and their bags.
- The SHIP IS ARRIVING — we are on its deck, Dakar emerges in the distance. We are NOT on the quay, NOT docked.
- Faces are STILL and NEUTRAL. Bodies engage in the trinity of activities (bag+pocket / beret+strap / cigarette). Secondary figures show lived-in deck life. Anti-parade, anti-welcome-committee.
- 9:16 vertical. Clean frame. No text. No motion lines/speed lines. The smoke curl and water ripples are DRAWN FLAT SHAPES (animation anchors), not drawn motion effects."""


async def generate_scene(anchor1_bytes: bytes, anchor2_bytes: bytes) -> bool:
    out_path = OUT_DIR / "scene1-source-v2-navire.png"

    # Preserve v1 untouched (Aziz feedback "ils sont deja arrives"); v2 = regen navire arrivee

    print("[scene1] generating v2 source image (navire arrivee, R-DYNAMIC v2)...")
    try:
        contents = [
            types.Part.from_bytes(data=anchor1_bytes, mime_type="image/png"),
            types.Part.from_bytes(data=anchor2_bytes, mime_type="image/png"),
            PROMPT_SCENE1,
        ]
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img_bytes = part.inline_data.data
                out_path.write_bytes(img_bytes)
                img = Image.open(io.BytesIO(img_bytes))
                print(f"[scene1] SAVED: {out_path} ({img.size[0]}x{img.size[1]})")

                # Save sidecar metadata (prompt + model + timestamp)
                sidecar = OUT_DIR / "scene1-source-v2-navire.prompt.txt"
                sidecar.write_text(
                    f"# Scene 1 source image prompt\n"
                    f"Model: {MODEL}\n"
                    f"Anchor 1: {STYLE_ANCHOR_1}\n"
                    f"Anchor 2: {STYLE_ANCHOR_2}\n\n"
                    f"---PROMPT---\n{PROMPT_SCENE1}\n"
                )
                print(f"[scene1] sidecar prompt saved: {sidecar.name}")
                return True

        print("[scene1] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[scene1] EXCEPTION: {e}")
        return False


async def main():
    if not STYLE_ANCHOR_1.exists():
        print(f"ERROR: style anchor 1 not found: {STYLE_ANCHOR_1}")
        return 1
    if not STYLE_ANCHOR_2.exists():
        print(f"ERROR: style anchor 2 not found: {STYLE_ANCHOR_2}")
        return 1

    anchor1_bytes = STYLE_ANCHOR_1.read_bytes()
    anchor2_bytes = STYLE_ANCHOR_2.read_bytes()
    print(f"Anchor 1: {STYLE_ANCHOR_1.name} (paper-craft canonical)")
    print(f"Anchor 2: {STYLE_ANCHOR_2.name} (tirailleur charref validated)")
    print(f"Output: {OUT_DIR}")
    print(f"[COST PREVIEW] 1 * $0.04 = $0.04")
    print()

    ok = await generate_scene(anchor1_bytes, anchor2_bytes)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
