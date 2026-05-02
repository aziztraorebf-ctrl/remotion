"""Generate Thiaroye V5 source images -- Scenes 2, 3a, 3b, 4a, 4b, 5a, 5b, 6.
2 variations per scene (A = prompt_gemini_template, B = alternate composition).
Model: gemini-3.1-flash-image-preview
Cost: ~$0.04/image, 16 images total = ~$0.64

Usage: python -u scripts/tools/generate-thiaroye-v5-scenes-2to6.py [scene_id] [variation]
  scene_id: scene2, scene3a, scene3b, scene4a, scene4b, scene5a, scene5b, scene6
  variation: A or B
  (no args = generate all sequentially)
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

STYLE_ANCHOR = ROOT / "public" / "assets" / "thiaroye-1944" / "scene1" / "scene1-source-v4.png"
REFS = {
    "tirailleur_principal": ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "tirailleur-principal-charsheet.png",
    "officier_francais": ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "officier-francais-charsheet.png",
    "biram_senghor": ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "biram-senghor-charsheet.png",
    "jeune_temoin": ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "jeune-temoin-charsheet.png",
}

BASE_DIR = ROOT / "public" / "assets" / "thiaroye-1944"

# ============================================================================
# SCENE DEFINITIONS
# ============================================================================

SCENES = {
    "scene2": {
        "dir": BASE_DIR / "scene2",
        "refs": ["tirailleur_principal", "officier_francais"],
        "prompt_A": """Paper-craft scene illustration, 9:16 vertical frame.

SCENE: Interior of Thiaroye military camp, December 1944. Three Senegalese tirailleurs gathered around a rough wooden table. Foreground right: the shoulder and back of kepi of an absent French officer (blurred OTS silhouette). Barred window behind, cold indigo light filtering. The central tirailleur has his right hand open palm-up, extending toward the officer -- a quiet demand.

STYLE (match style anchor):
- REF 1 (style anchor): paper-craft storybook -- thick black outlines, flat color fills, paper kraft texture, rounded proportions, dot-eyes.
- REF 2 (tirailleur charref): uniform, beret, skin tone, dot-eyes.
- REF 3 (French officer charref): uniform, kepi -- visible only as OTS silhouette shoulder/back.

LIFE IN THE ROOM (vivid, not posed):
- Left tirailleur: leaning forward on elbows, one hand writing on paper, other hand resting flat on table, head tilted down in concentration
- Central tirailleur: right hand open palm-up extended forward at chest level, gaze steady on the absent officer, left hand gripping his knee (tension visible)
- Right tirailleur: mid-speech, lips parted, one hand gesturing toward the central tirailleur, torso turned inward toward the group
- OTS officer silhouette (foreground right, blurred): shoulder and back of kepi, indistinct dark shape

ENVIRONMENT:
- Rough wooden table, visible grain lines
- Barred window back-left: cold indigo-grey light beams crossing the table
- Stone walls muted grey-beige
- Papers scattered on the table, a tin cup, a folded army jacket draped on a chair
- Uniforms retain warm khaki-olive -- only warmth in the cold room

COMPOSITION ANTI-PARADE:
- Three tirailleurs staggered around the table (not in a line)
- Different head orientations and postures
- OTS officer in foreground creates depth

CRITICAL TECHNICAL RULES:
- Strict dot-eyes: single black dot, no iris, no white sclera, no eyelashes
- Flat color fills only, no hatching, no shading gradients
- Warmth comes from palette choice, not from shading
- Paper-craft Sonjata style, not semi-realistic BD
- No text, no readable writing on papers (just lines suggesting handwriting)
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft scene illustration, 9:16 vertical frame.

SCENE: Interior of Thiaroye military camp, December 1944. Close-up perspective from BEHIND the French officer (OTS view dominant, officer shoulder fills foreground left). Across the table: the central tirailleur faces him directly, open palm extended, gaze unwavering. Two other tirailleurs visible to either side of him, one standing, one seated.

STYLE (match style anchor):
- REF 1 (style anchor): paper-craft storybook -- thick black outlines, flat color fills, paper kraft texture, dot-eyes.
- REF 2 (tirailleur charref): exact uniform, beret, dark brown skin.
- REF 3 (French officer charref): uniform and kepi -- seen from behind/side only.

LIFE IN THE ROOM:
- Officer (foreground, back to camera): rigid shoulders, dark uniform kepi visible at frame left, creates a wall of authority
- Central tirailleur (facing officer, mid-ground center): palm fully open chest-high, chin raised, expression steady, body leaning slightly forward
- Left tirailleur (background left): standing, arms crossed loosely, watching the exchange
- Right tirailleur (seated right): hunched forward on the table, elbows on wood, both hands flat, watching intently

ENVIRONMENT:
- Rough wooden table between them
- Cold indigo window light from upper-left, casting long bar shadows on the table surface from the window bars
- Stone walls, papers on the table, a mess tin near the right tirailleur

COMPOSITION:
- Strong foreground/background contrast: officer dark silhouette near vs. tirailleurs mid-distance
- The open palm of the central tirailleur is the focal point -- centered, lit by the window light

CRITICAL TECHNICAL RULES:
- Strict dot-eyes on every visible face: single black dot, no iris, no white sclera
- Flat color fills only, no hatching, no gradients
- No text, no readable writing on papers
- 9:16 vertical (1080x1920)""",
    },

    "scene3a": {
        "dir": BASE_DIR / "scene3a",
        "refs": ["tirailleur_principal", "officier_francais"],
        "prompt_A": """Paper-craft illustration, 9:16 vertical. SCENE: Camp Thiaroye courtyard at dawn, December 1, 1944. Grey leaden sky, cold mist crossing the ground. Background left-third: a line of French army soldiers, rifles raised to shoulder level, paper-craft flat silhouette shapes, faces suggested by dot-eyes only. Foreground right-third: one Senegalese tirailleur close to camera, facing the soldiers -- upright, weight planted, gaze fixed straight at the firing line. His arms hang at his sides, fists loosely closed. Stoic. Unbroken.

STYLE: Match style anchor -- paper-craft, thick black outlines, flat color fills, paper kraft texture. Strict dot-eyes on every face, including distant soldiers.

PALETTE: cold grey-plomb sky, muted khaki uniforms, grey courtyard ground, deep cold blue shadows, one subtle warm accent on a lantern at courtyard edge (dying glow).

COMPOSITION:
- Tirailleur foreground-right, three-quarter view toward the soldiers, body fully visible
- French soldiers background-left in a staggered line (not geometric), 5-6 figures, rifles raised at varying heights
- Mid-ground courtyard: empty stone-dust surface, one fallen beret hints at prior confrontation
- Cold dawn light from upper-right casts long blue shadows

LIFE IN THE SCENE (not posed):
- Tirailleur: weight committed forward on one foot, jaw set, fists loosely closed at sides -- alive in his stillness
- French soldiers: not identical -- one leans into his rifle, one glances sideways, one stands rigid, postures varied
- Wisps of breath visible in cold air from both sides (small white puff shapes)

CRITICAL TECHNICAL RULES:
- Strict dot-eyes everywhere: single black dot, no iris, no white
- Flat color fills only, no hatching, no shading gradients
- No text, no banners, no readable insignia
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft illustration, 9:16 vertical. SCENE: Camp Thiaroye courtyard at dawn, December 1, 1944. Extreme wide shot -- the full courtyard visible. French soldiers form a loose arc across the upper half of the frame, rifles raised. In the lower half: three Senegalese tirailleurs stand their ground at varying distances, the closest in the foreground facing the soldiers squarely.

STYLE: paper-craft, thick black outlines, flat color fills, paper kraft texture, dot-eyes everywhere.

PALETTE: grey-plomb sky filling the upper third, cold stone ground filling the lower third, muted khaki uniforms on both sides.

COMPOSITION:
- Wide establishing shot of the full confrontation space
- French soldiers: background arc, 7-8 figures, rifles at shoulder in varied postures
- Senegalese tirailleurs: three figures in foreground-to-midground line, staggered in depth
- Cold dawn mist drifts across the mid-ground
- Abandoned gear (kit bag, canteen) at bottom frame edge
- Stone barrack walls at left edge of frame

LIFE IN THE SCENE:
- Foreground tirailleur: back slightly to camera, facing the soldiers, weight planted, one fist raised briefly at his side
- Mid-ground tirailleur: profile view, standing straight, chin up
- Background tirailleur: further away, hands at sides, gaze ahead
- French soldiers: varied rifle-raise heights, one figure's head angled slightly toward his neighbor
- Mist drifts at ankle height across the courtyard stones

CRITICAL TECHNICAL RULES:
- Strict dot-eyes on all figures: single black dot, no iris, no white sclera
- Flat color fills only, no hatching, no gradients
- No text, no banners
- 9:16 vertical (1080x1920)""",
    },

    "scene3b": {
        "dir": BASE_DIR / "scene3b",
        "refs": [],
        "prompt_A": """Paper-craft illustration, 9:16 vertical. SCENE: Camp Thiaroye courtyard AFTER the shots. Continuity with previous scene (same courtyard, same lantern, same cold light).

3 to 4 paper-craft silhouettes lie on the ochre ground -- simple flat dark shapes, dignified postures (arms extended, not contorted). A crimson-red pool SPREADS on the earth around one of them (R-PC19: flat red aplat, no gradient, no photorealism -- stylized red suggesting loss).

Foreground center: a single rifle fallen on the ground, muzzle pointing away, bolt open -- synecdoque of the massacre.

STYLE: Match style anchor exactly. Paper-craft, thick black outlines, flat color fills. Silhouettes are simple shapes without facial detail.

PALETTE: cold grey-plomb sky above, grey courtyard ground, muted khaki on silhouettes -- ONE accent color: crimson-red pool (flat aplat). The red is the only warmth. The last life left is this color.

COMPOSITION:
- Fallen rifle in foreground center (synecdoque)
- Silhouettes scattered mid-ground at varying distances, postures dignified
- Background: the lantern from previous scene, now extinguished
- Cold dawn light holds the scene, long shadows

CRITICAL TECHNICAL RULES:
- Silhouettes are abstract flat shapes -- no facial detail needed
- Flat color fills only, no hatching, no shading
- Red pool is a flat aplat -- no gradient, no photoreal texture
- No text, no banners
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft illustration, 9:16 vertical. SCENE: Camp Thiaroye courtyard AFTER the shots. Close-up view. Single focus: the ground-level perspective.

Foreground extreme close: a fallen tirailleur's hand, flat and still, palm facing up on the ochre earth -- paper-craft shape, thick outline, simple. A small piece of folded paper falls from his open fingers (a letter? a list of names?). The paper rests half-open on the ground beside the hand.

Mid-ground: a wide crimson-red aplat pool spreading outward on the stone ground (flat red, no gradient, no photorealism). The edge of another silhouette visible at the pool's far edge.

Background: the stone barrack wall, cold grey, the extinguished lantern at the right.

STYLE: paper-craft, thick black outlines, flat color fills, paper kraft texture.

PALETTE: grey-ochre ground, cold grey walls, ONE accent: flat crimson-red pool. The hand in khaki-olive uniform sleeve. The letter in pale cream paper.

COMPOSITION:
- Extreme foreground: hand + letter in sharp paper-craft detail
- Mid-ground: red pool spreading to frame edges
- Background: wall and lantern establishing location

CRITICAL TECHNICAL RULES:
- Flat color fills only, no hatching, no gradients
- Red pool = flat aplat red, no photorealism
- No text on the letter -- just the suggestion of handwriting lines
- No text, no banners
- 9:16 vertical (1080x1920)""",
    },

    "scene4a": {
        "dir": BASE_DIR / "scene4a",
        "refs": [],
        "prompt_A": """Paper-craft illustration, 9:16 vertical. SCENE: French military archive interior, 1945. A vast wall of grey metal filing cabinets extending upward and into depth. Foreground center: a gloved black hand of a French administrator in dark uniform cuff, mid-push on a half-closed drawer. Visible inside the drawer: a cardboard folder with a blurred rectangular stamp shape (no readable text, just the stamp silhouette).

STYLE: paper-craft, thick black outlines, flat color fills, paper kraft texture. Strict dot-eyes style applied to any visible figure (the administrator's face should not be visible -- only gloved hand and dark cuff).

PALETTE: cold bureaucratic grey (grey metal cabinets, beige manila folder, black leather glove, muted grey-white plaster wall). No warmth. One thin diagonal beam of weak light crossing the scene, carrying dust motes.

COMPOSITION:
- Gloved hand on drawer in foreground-right, mid-motion
- Half-closed drawer center-frame with folder visible inside
- Wall of cabinets extending up and receding into depth on left
- Diagonal beam of cold light from upper-left
- One stack of folders on the floor in background (more work to file)

CRITICAL TECHNICAL RULES:
- Strict dot-eyes (no face visible here, but style applies to the whole scene)
- Flat color fills only, no hatching, no shading gradients
- No readable text on folder, just the stamp shape
- No text on cabinet labels (just shapes)
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft illustration, 9:16 vertical. SCENE: French military archive interior, 1945. Bird-eye view pulling back: we see the top of ROWS of filing cabinets stretching in perspective to a distant wall. The cabinets recede into depth, row after row, suggesting an infinite bureaucratic space.

Foreground: one open drawer slightly ajar, a folder visible with a blurred stamp (no readable text). A dark-uniformed administrator's hand (gloved) rests on the top of the nearest cabinet, about to close the last open drawer.

STYLE: paper-craft, thick black outlines, flat color fills, paper kraft texture.

PALETTE: all grey and beige -- grey metal cabinets in different grey tones creating depth, pale yellow-beige folders, black glove, white ceiling with one weak fluorescent light strip (flat aplat).

COMPOSITION:
- Strong perspective lines: cabinets recede from foreground to background in a vanishing point
- Hand in foreground-center pushing the ajar drawer closed
- Infinite rows of sealed cabinets filling the frame -- names erased, facts buried
- A single small window at the far back wall: cold grey-blue rectangle of winter light

CRITICAL TECHNICAL RULES:
- Flat color fills only, no hatching, no gradients
- No readable text on any folder, label, or cabinet
- The only non-grey: the pale manila folders (beige) and the black glove
- 9:16 vertical (1080x1920)""",
    },

    "scene4b": {
        "dir": BASE_DIR / "scene4b",
        "refs": [],
        "prompt_A": """Paper-craft illustration, 9:16 vertical. SCENE: Modern French courtroom interior, 2026. Close-up: a lawyer's hands in dark suit sleeves placing a thick folded legal document on a honey-blond wooden desk. Background blurred: a tricolor republican flag shape, suggestion of wooden paneling.

STYLE: paper-craft continuity with the archive scene. Thick black outlines, flat color fills, paper kraft texture.

PALETTE: cold grey-blue courtroom air, honey-blond desk surface, muted beige document, dark suit -- slight warmth restored vs. the archive scene (the warm wood desk color).

COMPOSITION:
- Hands center-frame, document mid-placement on the desk
- Desk surface fills mid-frame
- Tricolor flag blurred in background-left (color shapes only, no heraldry)
- No other objects on the desk

CRITICAL TECHNICAL RULES:
- No readable text on the document
- Flag shows only color aplats, no heraldry readable
- Flat color fills only, no hatching, no gradients
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft illustration, 9:16 vertical. SCENE: Modern French courtroom interior, 2026. Wider establishing shot. A lawyer stands at a podium or desk, seen from the waist down only -- dark suit, one hand gripping the podium edge, the other resting flat on a thick legal document.

Background: the courtroom gallery suggested by rows of wooden benches (paper-craft flat shapes), a few indistinct silhouettes of seated figures. A tricolor flag stands tall at the back right. A large arched window brings in grey-blue winter light.

STYLE: paper-craft, thick black outlines, flat color fills, paper kraft texture.

PALETTE: honey-blond wood in the podium and benches (warmth returning vs. grey archives), cold grey courtroom air, dark navy lawyer's suit, beige legal document, tricolor flag as the only strong color accent.

COMPOSITION:
- Lawyer from waist down, foreground center
- Document on the podium surface prominent
- Courtroom space receding into background with benches and silhouettes
- High arched window at back providing structural depth

CRITICAL TECHNICAL RULES:
- No readable text on the document or any surface
- Flag: three color bands only, no heraldry
- Silhouettes in gallery: abstract paper-craft shapes, dot-eyes if any faces visible
- Flat color fills only, no hatching, no gradients
- 9:16 vertical (1080x1920)""",
    },

    "scene5a": {
        "dir": BASE_DIR / "scene5a",
        "refs": ["biram_senghor"],
        "prompt_A": """Paper-craft illustration, 9:16 vertical. SCENE: Biram Senghor at the Thiaroye Memorial, 2026. Elderly Senegalese man in a dark sober suit, holding a folded legal document in both hands at chest level -- his grip firm, weight committed forward.

BACKGROUND: a wall of black-and-white portrait photographs in an irregular grid (7-10 frames, varying sizes). Faces in the portraits are paper-craft silhouettes with dot-eyes -- the tirailleurs of Thiaroye. Portraits are all in muted grey-black tones.

STYLE: Match style anchor + Biram charref. Paper-craft, thick black outlines, flat color fills, paper kraft texture. Strict dot-eyes on Biram.

PALETTE: cold overcast memorial lighting. Biram in dark navy suit. Portrait wall in muted grey-black. A small eternal flame burns at bottom-right of frame -- the only warm accent.

COMPOSITION:
- Biram center-left, three-quarter view toward the portraits
- Portrait wall fills right two-thirds of background
- Cold light from upper left
- Eternal flame small flicker shape at bottom-right

LIFE IN THE SCENE (R-DYNAMIC):
- Biram: thumb pressing document edge, torso leaning slightly forward, chin lifted
- Portrait silhouettes: heads at varied angles (profile, frontal, 3/4)
- Eternal flame: flickering paper-craft flame shape

CRITICAL TECHNICAL RULES:
- Strict dot-eyes on Biram: single black dot, no iris, no white, no tears
- Flat color fills only, no hatching, no gradients
- No readable text on document, no readable names on portraits
- Match Biram charref precisely (elderly, dark skin, sober suit)
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft illustration, 9:16 vertical. SCENE: Biram Senghor at the Thiaroye Memorial, 2026. Close-up portrait framing -- Biram from chest up, centered in the frame. His face is dignified, jaw set, eyes (dot-eyes) looking slightly off-camera toward the portrait wall at frame right edge.

He holds the folded legal document pressed against his chest with both hands -- not extended, but held close, like a shield or a vow. The document corner is visible at the bottom of the frame.

BACKGROUND: partially visible portrait wall behind him -- a few black-and-white portrait frames visible at both sides, blurred slightly. The cold grey memorial stone wall behind the portraits. One portrait frame catches a glint of the eternal flame light (warm single dot on the frame edge).

STYLE: Match style anchor + Biram charref. Paper-craft, thick black outlines, flat color fills, dot-eyes.

PALETTE: cold memorial grey. Biram in dark navy suit. His dark skin, his suit, and the grey background create strong graphic contrast. The warm accent is the eternal flame glow touching the nearest portrait frame.

COMPOSITION:
- Biram bust portrait, centered, close-up
- Document held at chest, hands visible
- Portrait wall blurred at edges of background
- Cold directional light from left giving structure without gradients

CRITICAL TECHNICAL RULES:
- Strict dot-eyes on Biram: single black dot, no iris, no white, no tears
- Flat color fills only, no hatching, no shading gradients
- Warmth comes from palette, not from shading
- 9:16 vertical (1080x1920)""",
    },

    "scene5b": {
        "dir": BASE_DIR / "scene5b",
        "refs": [],
        "prompt_A": """Paper-craft illustration, 9:16 vertical. SCENE: Macro close-up of a stone memorial wall. Center of frame: a single engraved name -- letter silhouettes only, no readable text. Sharp engraving, shadow line inside the letters (flat dark aplat).

Around the center: 4-5 blurred engraving silhouettes suggesting other names -- just shapes, no detail.

STYLE: paper-craft on stone -- flat color fills (cool grey-beige stone), paper-kraft texture, thick dark outlines around engraved recesses.

PALETTE: cool grey-beige stone. Raking cold light from the left casting long shadows inside the engravings. No color -- stark and monolithic.

COMPOSITION:
- Central engraved name: sharp letter silhouettes, centered
- Surrounding names: blurred shapes at varying distances
- Lower-left corner: a single dried leaf resting on the stone ledge (paper-craft flat shape, dark brown)
- No other objects

CRITICAL TECHNICAL RULES:
- NO readable text -- just engraving silhouettes
- Flat color fills only, no hatching, no gradients
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft illustration, 9:16 vertical. SCENE: Wider view of a stone memorial wall -- the full inscription panel visible. Multiple columns of engraved names as abstract letter silhouettes. The names are dense in some areas, sparse in others (lives cut short at different moments).

One name in the center of the panel is slightly larger or bolder than the others -- set apart by its isolation in a small empty field of stone. No readable text.

At the base of the wall: small offerings left by visitors -- a few paper-craft flower shapes (flat, stylized), a folded piece of paper against the stone base. Cold winter light rakes across the surface from the left.

STYLE: paper-craft, thick black outlines, flat color fills, paper kraft texture.

PALETTE: cool grey-beige stone wall. The flowers are the only color accents -- one green stem, one red/orange bloom (flat aplat). Cold directional light. Grey-blue sky visible at the very top of the frame.

COMPOSITION:
- Stone wall fills the full frame, edge to edge
- Columns of engraving silhouettes visible across the surface
- One bold name isolated in center-lower area
- Base offerings in foreground-bottom: flowers, paper

CRITICAL TECHNICAL RULES:
- NO readable text anywhere
- Flat color fills only, no hatching, no gradients
- Flowers: flat paper-craft shapes, no photorealism
- 9:16 vertical (1080x1920)""",
    },

    "scene6": {
        "dir": BASE_DIR / "scene6",
        "refs": ["jeune_temoin"],
        "prompt_A": """Paper-craft illustration, 9:16 vertical. SCENE: Dakar coast at sunset, present day. A young Senegalese man (20s) stands at the water's edge, BACK TO CAMERA, gaze toward the horizon. His posture echoes the tirailleurs from Scene 1 -- dignified, weight committed, feet planted. He wears simple modern clothes (an open jacket over a light shirt, rolled-up jeans).

STYLE: Match style anchor + jeune-temoin charref. Paper-craft, thick black outlines, flat color fills, paper kraft texture. Strict dot-eyes style (not visible from behind, applied to any visible face).

PALETTE: RESTORED full warm palette -- golden sunset sky (warm orange to deep indigo gradient at the top), warm red-ochre earth at his feet, deep ocean blue-green, silver highlights on the water. Warmth returns for the first time in the film.

COMPOSITION:
- Young man center-foreground, back to camera, three-quarter back view
- Ocean mid-ground filling horizontal band across the frame
- Sun low on the horizon, its reflection a warm vertical strip on the water
- Sky background occupies upper two-thirds -- gradient sunset
- A few small personal objects at his feet on the sand: an old photograph (face down), a small shell
- 2-3 bird silhouettes already in the sky

LIFE IN THE SCENE (R-DYNAMIC -- multiple anchors):
- The young man: shirt collar caught by wind (hem lifting), hair tousled by the wind, one foot slightly forward, weight committed
- Waves lapping at the shoreline (paper-craft flat ripple lines)
- Wind in his clothing (visible billow in jacket)
- Birds in the sky (flat silhouettes)
- A small piece of driftwood on the shore

CRITICAL TECHNICAL RULES:
- Flat color fills only, no hatching, no shading gradients
- Warmth comes from palette choice, not from shading
- No text visible anywhere
- 9:16 vertical (1080x1920)""",
        "prompt_B": """Paper-craft illustration, 9:16 vertical. SCENE: Dakar coast at sunset, present day. Side-profile view of the young Senegalese man -- facing right toward the sea. We see his full face in 3/4 view, eyes (dot-eyes) looking toward the horizon. He holds something loosely in one hand at his side -- an old black-and-white photograph (face down, not readable).

The ocean is behind him and to his right, the shore sand fills the lower third. Sunset fills the upper two-thirds of the frame.

STYLE: Match style anchor + jeune-temoin charref. Paper-craft, thick black outlines, flat color fills, dot-eyes.

PALETTE: full warm restoration -- golden orange sky bleeding to deep violet-indigo at the top, warm red-ochre sand, ocean blue-green. After the grey of war and bureaucracy, full color returns.

COMPOSITION:
- Young man in profile, center-frame, full figure visible
- Sunset sky occupying the upper half, the most vivid palette of the entire film
- Ocean behind him with flat wave-ripple shapes
- 2-3 bird silhouettes gliding across the sky
- His photograph held at side, face toward his leg (not shown)
- Small waves at his feet in the sand

LIFE IN THE SCENE:
- Wind lifts the front of his open jacket, collar and shirt hem billow
- Hair lifted by the wind
- The photograph in his hand flutters slightly at the corner
- Birds glide across the sunset sky
- Wave ripples at shoreline

CRITICAL TECHNICAL RULES:
- Strict dot-eyes: single black dot, no iris, no white
- Flat color fills only, no hatching, no gradients
- No text on the photograph or anywhere else
- Match jeune-temoin charref (young Senegalese man, 20s, dark skin)
- 9:16 vertical (1080x1920)""",
    },
}


# ============================================================================
# Generation function
# ============================================================================

async def generate_image(scene_id: str, variation: str) -> bool:
    scene = SCENES[scene_id]
    out_dir = scene["dir"]
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{scene_id}-source-v1{variation.lower()}.png"
    prompt = scene["prompt_A"] if variation == "A" else scene["prompt_B"]
    ref_keys = scene["refs"]

    print(f"\n[{scene_id} {variation}] generating...")
    print(f"[{scene_id} {variation}] prompt length: {len(prompt)} chars")
    print(f"[{scene_id} {variation}] refs: style_anchor + {ref_keys}")

    # Build contents: style anchor first, then charrefs, then prompt
    contents = []
    if not STYLE_ANCHOR.exists():
        print(f"ERROR: style anchor not found: {STYLE_ANCHOR}")
        return False
    contents.append(types.Part.from_bytes(data=STYLE_ANCHOR.read_bytes(), mime_type="image/png"))

    for ref_key in ref_keys:
        ref_path = REFS[ref_key]
        if not ref_path.exists():
            print(f"ERROR: ref not found: {ref_path}")
            return False
        contents.append(types.Part.from_bytes(data=ref_path.read_bytes(), mime_type="image/png"))

    contents.append(prompt)

    try:
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
                print(f"[{scene_id} {variation}] SAVED: {out_path} ({img.size[0]}x{img.size[1]})")

                sidecar = out_dir / f"{scene_id}-source-v1{variation.lower()}.prompt.txt"
                sidecar.write_text(
                    f"# {scene_id} variation {variation} source image prompt\n"
                    f"Model: {MODEL}\n"
                    f"Style anchor: {STYLE_ANCHOR}\n"
                    f"Charrefs: {ref_keys}\n\n"
                    f"---PROMPT---\n{prompt}\n"
                )
                return True

        print(f"[{scene_id} {variation}] ERROR: no image in response")
        return False

    except Exception as e:
        print(f"[{scene_id} {variation}] EXCEPTION: {e}")
        return False


async def main():
    scene_order = ["scene2", "scene3a", "scene3b", "scene4a", "scene4b", "scene5a", "scene5b", "scene6"]

    if len(sys.argv) == 3:
        target_scene = sys.argv[1]
        target_var = sys.argv[2].upper()
        if target_scene not in SCENES:
            print(f"Unknown scene: {target_scene}. Choose from: {list(SCENES.keys())}")
            return 1
        if target_var not in ("A", "B"):
            print(f"Unknown variation: {target_var}. Choose A or B.")
            return 1
        print(f"PREVIEW: {target_scene} {target_var} -- ~$0.04 -- REFs: style_anchor + {SCENES[target_scene]['refs']}")
        ok = await generate_image(target_scene, target_var)
        return 0 if ok else 1

    # Generate all sequentially
    results = {}
    for scene_id in scene_order:
        for var in ("A", "B"):
            ref_list = ["style_anchor"] + SCENES[scene_id]["refs"]
            print(f"PREVIEW: {scene_id} {var} -- ~$0.04 -- REFs: {ref_list}")
            ok = await generate_image(scene_id, var)
            results[f"{scene_id}_{var}"] = ok
            if not ok:
                print(f"FAILED: {scene_id} {var} -- continuing to next...")

    print("\n=== GENERATION SUMMARY ===")
    success = sum(1 for v in results.values() if v)
    total = len(results)
    print(f"Success: {success}/{total}")
    print(f"Estimated cost: ${total * 0.04:.2f}")
    for key, ok in results.items():
        status = "OK" if ok else "FAIL"
        print(f"  {key}: {status}")

    return 0 if success == total else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
