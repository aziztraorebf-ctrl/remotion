"""
Soundjata Phase 2 — Gemini refs for Acte I (tyrannie/prophetie/handicap) +
Acte IV (exil/Mema/messagers/retour).

11 refs total (Acte I x 5 + Acte IV x 6). All generated in parallel via asyncio.

Model : models/gemini-3.1-flash-image-preview
Key   : GEMINI_API_KEY (.env)
Budget: 11 * $0.08 = $0.88

Output:
  public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte1/
  public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4/

Special case:
  soundjata-exile-ref.png is a SURGICAL EDIT of soundjata-adult-warrior-ref.png
  (passed as input image). Adult warrior must finish generating FIRST.
"""

import asyncio
import io
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

REFS_ROOT = (
    ROOT / "public" / "assets" / "library" / "geoafrique" / "heros-oublies" / "soundjata" / "refs"
)
ACTE1_DIR = REFS_ROOT / "acte1"
ACTE4_DIR = REFS_ROOT / "acte4"


# ============================================================
# ACTE I — 5 refs (tyrannie / prophetie / handicap)
# ============================================================

PROMPT_VILLAGE_NIGHT_PLATE = """Generate a 2D flat illustrated BD-style LANDSCAPE / ENVIRONMENT plate.

STYLE: Flat illustration, vivid saturated colors, clean painterly style with confident outlines, no photorealism, no Pixar/3D. GeoAfrique YouTube series aesthetic.

SCENE: Mandingue village at NIGHT under a TYRANT's rule. Desaturated, oppressive atmosphere.
- Several round mud-brick huts with conical thatched roofs, some partially COLLAPSED / damaged (walls cracked, roofs caved in)
- Bare dusty ground, a few broken pottery shards
- A dead tree silhouette in the mid-ground
- Smoke plumes rising slowly from one ruined hut
- Sky: BLOOD-RED / DEEP CRIMSON and desaturated (muted, not vivid) — ominous tyrannical atmosphere — deep charcoal clouds overhead
- A distant thin crescent moon barely visible through the crimson haze
- Warm low firelight leaks weakly from one intact hut doorway (right side of frame)
- Overall mood: HEAVY, OPPRESSIVE, SILENT. Not bright. Not joyful.

CRITICAL - ZERO CHARACTERS:
- NO humans, NO animals, NO silhouettes of people
- Empty village street. Pure environment plate. Characters will be composited later.

COMPOSITION: 1080x1920 vertical (9:16). Horizon line in middle third. Sky occupies upper half.

COLOR PALETTE: desaturated crimson sky, muted ochre mud walls, deep charcoal shadows, one warm orange doorway accent.

CRITICAL: No text, no letters, no numerals, no signs, no banners, no writing visible anywhere. No characters."""


PROMPT_SOUNDJATA_BABY = """Generate a 2D flat illustrated BD-style CHARACTER REFERENCE PORTRAIT.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look, no painterly texture. GeoAfrique YouTube series aesthetic.

CHARACTER — CRITICAL AGE:
This character is a SMALL TODDLER 3-4 YEARS OLD. A YOUNG CHILD. NOT an adolescent. NOT an older child. NOT a teenager. NOT an adult.
- SMALL TODDLER, 3-4 YEARS OLD, clearly a YOUNG CHILD with rounded toddler proportions
- Chubby cheeks, large round head relative to body, short legs, small hands and feet
- Body proportions: LARGE head, SHORT stubby limbs (classic toddler proportions, NOT adolescent proportions)
- Dark brown skin (deep warm brown)
- Big expressive dark brown eyes, determined focused gaze looking slightly upward
- Short closely-cropped dark hair
- Simple short OCHRE-BROWN boubou tunic, child-sized, no ornaments
- Bare feet, seated cross-legged on the ground, hands resting on knees
- Posture: calm but DETERMINED — young child who cannot walk yet but whose spirit is strong

COMPOSITION: full-body portrait, centered, character occupies ~70% of vertical frame (small character, lots of breathing room above and below).

BACKGROUND: Soft suggested OCHRE / WARM TAN backdrop with gentle village textures — hint of mud-brick wall behind him, warm afternoon light. Background is painterly-soft / slightly out of focus. Not a flat solid color — suggests the Mandingue village environment.

FORMAT: 1080x1920 vertical (9:16).

CRITICAL AGE REMINDER (DO NOT IGNORE):
- He is a TODDLER 3-4 years old
- NEVER depict him as an adolescent or teenager
- NEVER add adult features (beard, defined jawline, tall body)
- His proportions MUST be those of a small child: large head, short arms and legs, chubby limbs

CRITICAL: No text, no letters, no numerals visible anywhere. No signs. No writing. Natural anatomy — correct 5 fingers per hand, correct toddler proportions, no morphing, no extra limbs."""


PROMPT_VILLAGE_CHILDREN = """Generate a 2D flat illustrated BD-style GROUP CHARACTER REFERENCE.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look. GeoAfrique YouTube series aesthetic.

SUBJECT: 4 Mandingue village children (ages 5-10) running together joyfully across dusty village ground, frozen mid-stride as if captured during a chase game.

DIVERSITY — EACH CHILD MUST LOOK DISTINCT:
Child 1 (leftmost): age ~5, smallest, BRIGHT ORANGE short tunic, short cropped hair, mid-jump with both feet off ground, face lit with a big laugh showing teeth
Child 2: age ~7, medium build, EMERALD GREEN tunic with white trim, long braided hair down to shoulders, running forward with arms swinging, focused determined expression
Child 3: age ~8, slim tall build, INDIGO BLUE tunic, shaved head, leaning forward mid-run, looking BACK over his shoulder laughing
Child 4 (rightmost): age ~10, stocky build, YELLOW OCHRE tunic with red sash, short curly hair, arms outstretched, mouth wide in a joyful shout

All 4 children have DARK BROWN SKIN (same warm tone, consistent). Different face shapes, different body types, different expressions. No two faces alike.

COMPOSITION: full-body shot, all 4 children visible across horizontal frame, running left to right in loose formation. 1080x1920 vertical (9:16), but characters fit horizontally in lower 2/3 of frame.

BACKGROUND: Suggest a Mandingue village in better days — warm tan mud-brick wall behind, dust kicked up from their bare feet, hint of a baobab tree silhouette upper-right. Background is painterly-soft.

CRITICAL: No text, no letters, no numerals visible. No signs. Natural anatomy for each child — correct 5 fingers, correct child proportions, no morphing, no extra limbs. Four DISTINCT children, NEVER the same face repeated."""


PROMPT_TYRANT_SHADOW = """Generate a 2D flat illustrated BD-style ATMOSPHERIC SHADOW / SYMBOL piece.

STYLE: Flat illustration, clean confident outlines, dramatic lighting, NOT photorealistic, NOT Pixar. GeoAfrique YouTube series aesthetic.

SUBJECT: The LOOMING SHADOW of the sorcerer tyrant Soumaoro projected onto a MUD-BRICK VILLAGE WALL.

What is visible:
- The wall surface fills the frame: rough mud-brick texture, warm tan-brown color, small cracks, faint horizontal striations from hand-finishing
- A TORCH FLAME source off-frame to the lower-left casts a flickering warm orange-red GLOW across the wall
- The SHADOW of Soumaoro is cast onto the wall: a tall looming silhouette of a MENACING FIGURE wearing a SORCERER'S HORNED MASK (exaggerated horns sweeping upward, feathered headdress suggested), tall staff held vertically, long robe
- The shadow is NOT pure black — it is DEEP DESATURATED CHARCOAL-BROWN with SUBTLE TEXTURE (wall texture showing through faintly), and edges have a slight REDDISH BLEED from the torchlight
- The shadow is DISTORTED and ELONGATED by the angle of the flame, stretching upward across the wall
- Thin dark smoke tendrils curl off the shadow's outline (magic suggestion)

COMPOSITION: 1080x1920 vertical (9:16). The mud-brick wall is the full background. The shadow occupies the center-right of the frame, stretching from mid-frame upward. The warm torchlight glow is in the lower-left corner.

COLOR PALETTE: warm tan mud-brick, deep charcoal-brown shadow (NOT pure black), warm orange-red torchlight accent, thin dark smoke tendrils.

CRITICAL:
- The shadow is NOT pure black (#000000). Use deep charcoal-brown with subtle texture. The wall texture should be faintly visible through the shadow.
- No actual character body, only the shadow projection.
- No text, no letters, no numerals, no signs, no writing visible anywhere."""


PROMPT_STORYBOARD_ACTE1 = """Generate a NEW black-and-white sketch storyboard page.

CRITICAL LAYOUT:
- EXACTLY 9 panels in a 3x3 GRID (3 rows, 3 columns)
- Each panel is a rectangle with clean border
- Read order: top-left to top-right, then middle row, then bottom row
- All 9 panels same size, same aspect ratio
- NOT a 2x3 grid. NOT a 1x9 strip. THREE ROWS of THREE PANELS.

CONTENT STYLE:
- Loose graphite pencil sketch, rapid gestural lines
- Warm orange/ember dabs acceptable ONLY for fire / torchlight glow
- Desaturated crimson wash for the tyrannical sky in outdoor panels
- NO text, NO speech bubbles, NO panel numbers inside the panels, NO letters inside panels
- Above each panel, write a tiny cadrage label in the margin ABOVE the panel border: WIDE / MED / CLOSE / POV / EXTREME CU — these labels ARE allowed (cadrage labels only, no story text)
- Dynamic lines for motion and emotion

STORY: Acte I — the Mandingue village under the tyrant Soumaoro's oppression. The prophecy of a liberator is announced. But the liberator is a paralyzed child — the village doubts.

SHOT LIST (9 panels, 3x3 grid):

PANEL 1 (top-left) — WIDE ESTABLISHING, tyrannical atmosphere: Mandingue village at night under blood-red sky, a ruined hut collapsing, smoke rising, empty streets. NO characters.

PANEL 2 (top-middle) — MEDIUM on the tyrant's shadow: looming horned sorcerer shadow projected on a mud-brick wall, torchlight from low-left, smoke curling.

PANEL 3 (top-right) — CLOSE-UP on a frightened villager's face: dark-brown-skinned older man, deeply lined face, eyes wide, clutching a small child to his chest, looking off-screen in fear.

PANEL 4 (middle-left) — WIDE on a soothsayer/seer: an elder woman in long robes stands in a moonlit clearing, arms raised, a scattering of cowrie shells at her feet, beams of moonlight breaking through clouds onto her.

PANEL 5 (middle-middle) — EXTREME CLOSE-UP on the cowrie shells on the ground forming a pattern: a crude lion shape traced in the dust by the shells.

PANEL 6 (middle-right) — MEDIUM on villagers gasping in awe: 3 different adults, varied faces (young man, older woman, middle-aged father), mouths slightly open, eyes wide, hands rising toward their faces in disbelief.

PANEL 7 (bottom-left) — WIDE reveal inside a hut: the prophesied child — a SMALL TODDLER 3-4 years old, dark-brown-skinned, seated on the dusty floor, legs clearly not functional (thin, folded awkwardly), but his gaze is intense and determined.

PANEL 8 (bottom-middle) — CLOSE-UP on the toddler's FACE: fierce determination, small fists clenched, jaw set despite his tiny age.

PANEL 9 (bottom-right) — MEDIUM on two villagers turning away: silhouettes of adults walking away from the hut doorway, shoulders low, one shaking his head, the other gesturing dismissively. Dismissal, disbelief.

STYLE: loose graphite pencil sketch on cream paper, warm orange wash for fire only in panels 1, 2, muted crimson wash for sky in panels 1, 4. Emotional close-ups in panels 3, 5, 8. All panels predominantly black-and-white graphite.

FINAL LAYOUT REMINDER: 9 panels in a 3x3 GRID (3 rows x 3 columns). Not 1x9. Not 2x3 + 3. Exactly 3 rows of 3 panels each.

Only text ALLOWED: the tiny cadrage labels (WIDE / MED / CLOSE / POV / ECU) in the margin ABOVE each panel border. NO text inside the panels. NO speech bubbles. NO panel numbers."""


# ============================================================
# ACTE IV — 6 refs (Soundjata adulte / exil / Mema / messagers / retour)
# ============================================================

PROMPT_SOUNDJATA_ADULT_WARRIOR = """Generate a 2D flat illustrated BD-style CHARACTER REFERENCE PORTRAIT.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look. GeoAfrique YouTube series aesthetic.

CHARACTER — CRITICAL AGE:
This character is an ADULT MAN, 28 YEARS OLD, mature adult warrior. He is NOT a child. He is NOT a teenager. He is NOT an adolescent. He is a MATURE ADULT MAN.
- ADULT MAN, 28 years old, in the prime of his strength
- ADULT body proportions: full adult height, BROAD shoulders, DEFINED muscled chest and arms, visible adult jawline
- Short well-groomed BEARD along the jawline, short neat dark hair
- Visible ADULT features: strong brow ridge, defined cheekbones, mature set jaw
- Tall powerful adult build, NOT slender adolescent build
- Medium-warm brown skin (slightly lighter than the toddler ref, adult tone)
- Calm confident gaze, eyes steady and forward, expression of a seasoned warrior
- Long deep-INDIGO BLUE boubou robe with leather accents, traditional Mandingue warrior cut
- LEATHER ARMOR details: chest piece with bronze studs over the indigo robe, leather belt, leather arm guards on forearms
- Right hand GRIPS a tall LANCE (spear) held vertically — the lance shaft is solid dark wood, thicker at the bottom, narrowing to a bronze leaf-shaped spearhead visible above his head
- Simple leather sandals

COMPOSITION: full-body portrait, centered, ADULT warrior occupies ~75% of vertical frame. Standing upright, feet planted firmly, 3/4 front angle.

BACKGROUND: Soft suggested SAVANNA LANDSCAPE in the background — warm ochre grass, hint of an acacia tree silhouette far right, golden-hour light, warm blue sky with scattered clouds. Background is painterly-soft / slightly out of focus so the character remains the focal point.

FORMAT: 1080x1920 vertical (9:16).

CRITICAL AGE REMINDER (DO NOT IGNORE):
- He is an ADULT MAN, 28 years old
- NEVER depict him as a teenager or adolescent
- NEVER make him slender or boyish
- His proportions MUST be FULL ADULT: broad shoulders, defined muscles, adult jawline + short beard

CRITICAL: No text, no letters, no numerals visible anywhere. No signs. No writing on robe or armor. Natural anatomy — correct 5 fingers per hand, correct adult male proportions, no morphing, no extra limbs. Lance shaft is SOLID, RIGID, NON-DEFORMING, constant thickness."""


PROMPT_MEMA_ENVIRONMENT = """Generate a 2D flat illustrated BD-style LANDSCAPE / ENVIRONMENT plate.

STYLE: Flat illustration, vivid saturated colors, clean painterly style with confident outlines, no photorealism, no Pixar/3D. GeoAfrique YouTube series aesthetic.

SCENE: The SAHARAN city of MEMA, 12th century Sahel. Wide establishing shot.
- Foreground: dusty sand-swept ground, a few scattered palm fronds, one curved CLAY POT
- Mid-ground: WALLED CITY of ochre-red mud brick — thick high outer walls with rounded crenellations, a recessed wooden gate on the left, walls show horizontal wooden beam supports (Sudano-Sahelian architecture with wooden scaffolding poles protruding)
- Behind the walls: a tall MINARET in Sudano-Sahelian style (square base tapering upward, horizontal wooden poles protruding from each side, crowned with a spiked pinnacle) rising above the city wall
- Clusters of DATE PALM TREES (tall slim trunks, feathery palm fronds at top) planted along the wall's base and inside the city, dark-green fronds against the ochre walls
- Background: Sahel desert landscape stretching to the horizon — dunes, sparse vegetation, atmospheric perspective fading to warm haze
- Sky: GOLDEN HOUR desert light — warm amber-gold near the horizon, fading to soft warm blue above, a few thin high clouds. Strong golden rim light on the walls and minaret from the right.
- Overall mood: WARM, MAJESTIC, DRY — a prosperous desert trading city

DISTINCTIVENESS FROM MANDEN:
- Sudano-Sahelian ARCHITECTURE (not round mud-brick huts)
- MINARET visible (Muslim Sahelian city)
- DATE PALMS (not baobabs, not acacias)
- Walled fortified city (not open village)
- DRIER / more desert-like than the Mandingue savanna

CRITICAL - ZERO CHARACTERS:
- NO humans, NO animals, NO silhouettes of people
- The city gate area is EMPTY. Pure environment plate.

COMPOSITION: 1080x1920 vertical (9:16). City walls and minaret dominate the middle third. Sky upper half, foreground sand lower third.

COLOR PALETTE: ochre-red mud brick, warm amber-gold sky, deep green palm fronds, pale sandy foreground.

CRITICAL: No text, no letters, no numerals, no signs, no writing visible anywhere (no Arabic calligraphy, no inscriptions). No characters."""


# soundjata-exile-ref.png is a SURGICAL EDIT of adult-warrior. Built after adult-warrior succeeds.
PROMPT_SOUNDJATA_EXILE_EDIT = """Take this image exactly as it is. Make the following SURGICAL changes, preserve everything else intact:

CHANGES TO APPLY:
1. REMOVE the tall lance / spear from his hand completely — the hand is now empty, fingers relaxed.
2. ADD a small cloth BALUCHON / BINDLE SACK slung over his left shoulder — a simple cream-and-brown checkered cloth bundle tied to a short wooden stick resting on his shoulder. The hand holding the stick is at chest height.
3. CHANGE his boubou to look TRAVEL-WORN: add subtle DUSTY PATCHES on the fabric (lighter ochre dust smudges on the indigo), a small FRAYED tear at the hem, slightly faded color overall. Keep the indigo base color recognizable.
4. REMOVE the bronze-studded leather chest armor and arm guards entirely — he is no longer armored. Just the travel-worn boubou.
5. SOFTEN his posture — shoulders slightly lowered (fatigue), head angled slightly down, expression more pensive and weary (not defeated, still dignified — but tired). Keep the adult age, beard, body proportions EXACTLY the same.
6. REPLACE the savanna background with a SIMPLE NEUTRAL WARM TAN backdrop (soft uniform tan color, slight texture, no specific landscape) — portable reference, NOT a scene.

DO NOT CHANGE:
- His face (same features, same adult jawline, same short beard)
- His skin tone
- His adult body proportions (broad shoulders, adult build)
- His age (still 28-year-old adult man, NEVER younger, NEVER older)
- The boubou base indigo color
- His overall identity as the same person

CRITICAL: Output must be clearly the SAME ADULT MAN, just in travel/exile state. Adult age preserved. No text, no letters, no signs. 1080x1920 vertical."""


PROMPT_MESSAGERS_CAVALIERS = """Generate a 2D flat illustrated BD-style ACTION SCENE.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D. GeoAfrique YouTube series aesthetic.

SUBJECT: THREE Mandingue messengers on horseback GALLOPING across open savanna, left-to-right, kicking up dust, urgent mission.

THREE DISTINCT RIDERS — COLORS MUST BE DIFFERENT:
Rider 1 (lead, front of group, slightly ahead):
- DEEP INDIGO-BLUE BOUBOU, WHITE TURBAN wrapped high
- Young adult man, dark brown skin, determined forward gaze
- Horse: chestnut-brown with white blaze on forehead

Rider 2 (middle, slightly behind lead):
- OCHRE-TAN BOUBOU, DEEP RED TURBAN
- Older adult man with short beard, dark brown skin, intense focused expression
- Horse: dark bay (near black) with a dark mane

Rider 3 (rear, visible behind the other two):
- FOREST-GREEN BOUBOU, BROWN TURBAN
- Adult man, dark brown skin, slightly younger face than rider 2, jaw set
- Horse: pale grey/white horse

All 3 horses at full GALLOP — all four hooves off the ground where possible, manes flying, tails streaming behind, nostrils flared. Dust clouds kicked up from the hooves trailing behind them.

All 3 riders lean forward into the gallop, boubou robes and turban tails flaring backward in the wind.

COMPOSITION: 1080x1920 vertical (9:16). The 3 riders fill the middle third of the frame horizontally, moving left-to-right. Dust trail behind them fills the lower third. Sky fills the upper half.

BACKGROUND: Open MANDEN savanna — tall dry golden grass in the foreground, scattered acacia trees in the mid-ground, one baobab silhouette far right, warm blue sky with a few scattered cumulus clouds, golden afternoon light.

CRITICAL COLOR DISTINCTION:
- 3 DIFFERENT boubou colors (indigo, ochre-tan, forest-green) — NEVER the same color twice
- 3 DIFFERENT turban colors (white, red, brown) — NEVER the same color twice
- 3 DIFFERENT horse coats — NEVER the same horse color twice
- 3 DIFFERENT faces — varied ages and features, NEVER the same face repeated

CRITICAL: No text, no letters, no numerals visible. No signs. Natural anatomy — correct 5 fingers for each rider, realistic horse anatomy (4 legs each), no morphing, no extra limbs."""


PROMPT_STORYBOARD_ACTE4 = """Generate a NEW black-and-white sketch storyboard page.

CRITICAL LAYOUT:
- EXACTLY 9 panels in a 3x3 GRID (3 rows, 3 columns)
- Each panel is a rectangle with clean border
- Read order: top-left to top-right, then middle row, then bottom row
- All 9 panels same size
- NOT a 2x3 grid. NOT a 1x9 strip. THREE ROWS of THREE PANELS.

CONTENT STYLE:
- Loose graphite pencil sketch, rapid gestural lines
- Small WARM OCHRE / GOLDEN dabs acceptable for desert sun glow and torchlight
- NO text inside panels, NO speech bubbles, NO panel numbers inside panels
- Above each panel, write a tiny cadrage label in the margin ABOVE the panel border: WIDE / MED / CLOSE / POV / ECU — these labels ARE allowed
- Dynamic motion lines for riders and wind

STORY: Acte IV — Soundjata in EXILE in Mema (Saharan city). Messengers from the Manden arrive with urgent news. Soundjata realizes his hour has come. He rises to return home.

SHOT LIST (9 panels, 3x3 grid):

PANEL 1 (top-left) — WIDE ESTABLISHING: Saharan city of Mema, walled ochre-red mud-brick, minaret rising above, date palms, golden hour light. Lone figure walking the outer wall's shadow.

PANEL 2 (top-middle) — MEDIUM SHOT of Soundjata in EXILE: adult man (28yo), travel-worn indigo boubou with dusty patches, small bindle sack over shoulder, standing in a Mema street, shoulders slightly low, pensive expression. Adult body, adult jawline, short beard visible.

PANEL 3 (top-right) — CLOSE-UP on Soundjata's weary face in profile: adult features (short beard, defined adult jawline), staring into the desert horizon, one bead of sweat on his temple.

PANEL 4 (middle-left) — WIDE on 3 MESSENGERS galloping across the savanna: dust trails behind, 3 horses at full gallop moving left-to-right, 3 distinct riders in boubous and turbans.

PANEL 5 (middle-middle) — MEDIUM on the lead messenger arriving: he leaps off his horse at the Mema city gate, turban trailing, reaching forward urgently. Dust settling.

PANEL 6 (middle-right) — CLOSE-UP on a messenger's FACE: intense urgency, mouth open mid-shout, sweat on brow, eyes wide with crisis news to deliver.

PANEL 7 (bottom-left) — MEDIUM on Soundjata receiving the news: still in exile clothing, the messenger kneels before him offering a rolled cloth scroll, Soundjata's face tightens — the moment of recognition. Adult features.

PANEL 8 (bottom-middle) — CLOSE-UP on Soundjata's eyes narrowing — jaw clenching, brow furrowing, the decision being made silently. Adult adult adult features (strong jaw, short beard).

PANEL 9 (bottom-right) — WIDE silhouette of Soundjata mounted on a dark horse on a ridge-line, facing east toward the Manden horizon, sun rising behind him, cape flaring in the wind. The LION RETURNS posture: determined, epic, adult warrior silhouette.

STYLE: loose graphite pencil sketch on cream paper, warm golden ochre wash for Mema panels (1, 2, 5), warm amber wash for sunrise in panel 9. Emotional close-ups in panels 3, 6, 8.

FINAL LAYOUT REMINDER: 9 panels in a 3x3 GRID (3 rows x 3 columns). Not 1x9. Not 2x3 + 3. Exactly 3 rows of 3 panels each.

AGE CRITICAL: In all panels featuring Soundjata, he is an ADULT MAN 28 years old (short beard, adult body). NEVER a child, NEVER a teenager.

Only text ALLOWED: the tiny cadrage labels (WIDE / MED / CLOSE / POV / ECU) in the margin ABOVE each panel border. NO text inside panels. NO speech bubbles. NO panel numbers."""


PROMPT_SOUNDJATA_LION_RETURNS = """Generate a 2D flat illustrated BD-style EPIC CHARACTER SCENE.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look. GeoAfrique YouTube series aesthetic.

CHARACTER — CRITICAL AGE:
This character is the SAME ADULT MAN (Soundjata, 28 years old, mature adult warrior) — NOT a child, NOT a teenager, NOT an adolescent. Full adult body.
- ADULT MAN, 28 years old, broad shoulders, defined muscled build, visible adult jawline, short beard
- Medium-warm brown skin
- Long deep-INDIGO BOUBOU with leather accents — freshly dusted off, no longer travel-worn
- LEATHER ARMOR: chest piece with bronze studs, leather belt, arm guards
- Ornate DARK CAPE flowing from his shoulders, caught dramatically in the wind behind him
- Right arm raised HIGH overhead, gripping a tall LANCE (solid dark wood shaft, bronze leaf-shaped head), lance tip pointing upward to the sky — a commanding gesture
- Expression: FIERCE DETERMINATION, jaw set, eyes blazing toward the horizon

MOUNT: a BLACK STALLION (deep black coat, sleek muscled body, long black mane flying in the wind). The stallion rears up slightly on its hind legs, front hooves pawing the air, mouth open in a neigh, nostrils flared.

COMPOSITION: 3/4 REAR ANGLE — we see Soundjata and the stallion from slightly behind and to the right, looking OUT over the horizon with them. Soundjata's raised lance and cape silhouette against the sky.

SETTING: Soundjata and his stallion stand at the CREST of a savanna hillside ridge. Tall golden grass on the ridge. The terrain falls away below them into a vast savanna plain stretching to the horizon.

LIGHTING — EPIC RIM LIGHT:
- A rising SUN is behind and below them on the horizon, HUGE, deep warm ORANGE-GOLD disc, just breaking above the distant hills
- Strong golden RIM LIGHT outlines Soundjata, the stallion, and the cape from behind — warm glow hugs every edge
- Their bodies are partially in silhouette against the sun but retain color and detail (rim-lit silhouette effect, not pure black)
- Long dramatic golden shadows stretch forward/left from the pair
- Sky: warm orange-gold near horizon, fading to soft warm blue and then deeper blue upward, a few thin streaky clouds catching gold

MOOD: TRIUMPHANT, EPIC, THE HERO RETURNS. The Lion of Mali reclaims his birthright.

FORMAT: 1080x1920 vertical (9:16).

CRITICAL AGE REMINDER:
- He is an ADULT MAN, 28 years old
- Same adult identity as our adult-warrior ref: broad shoulders, adult jawline, short beard
- NEVER depict him as a child, teenager, or adolescent

CRITICAL: No text, no letters, no numerals, no signs, no writing visible anywhere. Natural anatomy — correct 5 fingers per hand, correct adult male proportions, realistic horse anatomy, no morphing, no extra limbs. Lance shaft RIGID, SOLID, NON-DEFORMING, constant thickness."""


# ============================================================
# TASKS — list of (filename, output_dir, prompt, is_edit_based_on)
# ============================================================

TASKS_INDEPENDENT = [
    # Acte I
    ("village-night-plate.png", ACTE1_DIR, PROMPT_VILLAGE_NIGHT_PLATE, None),
    ("soundjata-baby-ref.png", ACTE1_DIR, PROMPT_SOUNDJATA_BABY, None),
    ("village-children-ref.png", ACTE1_DIR, PROMPT_VILLAGE_CHILDREN, None),
    ("tyrant-shadow-symbol.png", ACTE1_DIR, PROMPT_TYRANT_SHADOW, None),
    ("storyboard-9panels.png", ACTE1_DIR, PROMPT_STORYBOARD_ACTE1, None),
    # Acte IV (except exile — depends on adult-warrior)
    ("soundjata-adult-warrior-ref.png", ACTE4_DIR, PROMPT_SOUNDJATA_ADULT_WARRIOR, None),
    ("mema-environment.png", ACTE4_DIR, PROMPT_MEMA_ENVIRONMENT, None),
    ("messagers-cavaliers-ref.png", ACTE4_DIR, PROMPT_MESSAGERS_CAVALIERS, None),
    ("storyboard-acte4-clip1.png", ACTE4_DIR, PROMPT_STORYBOARD_ACTE4, None),
    ("soundjata-lion-returns-ref.png", ACTE4_DIR, PROMPT_SOUNDJATA_LION_RETURNS, None),
]

# This one is run AFTER soundjata-adult-warrior-ref.png is generated.
TASK_DEPENDENT = (
    "soundjata-exile-ref.png",
    ACTE4_DIR,
    PROMPT_SOUNDJATA_EXILE_EDIT,
    ACTE4_DIR / "soundjata-adult-warrior-ref.png",
)


async def generate_one(filename, out_dir, prompt, source_image_path=None):
    """Generate a single Gemini image (optionally editing a source image)."""
    out_path = out_dir / filename
    print(f"[START] {filename}")
    t0 = time.time()

    try:
        if source_image_path is not None and source_image_path.exists():
            # Surgical edit mode: pass source image as input
            src_img = Image.open(source_image_path)
            contents = [prompt, src_img]
        else:
            contents = [prompt]

        # client.models.generate_content is sync — run in executor
        loop = asyncio.get_event_loop()
        resp = await loop.run_in_executor(
            None,
            lambda: client.models.generate_content(
                model=MODEL,
                contents=contents,
                config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
            ),
        )

        for part in resp.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img = Image.open(io.BytesIO(part.inline_data.data))
                out_path.parent.mkdir(parents=True, exist_ok=True)
                img.save(out_path, "PNG")
                dt = time.time() - t0
                print(f"[OK]    {filename} ({img.size[0]}x{img.size[1]}, {dt:.1f}s)")
                return (filename, out_path, True)

        print(f"[FAIL]  {filename} — no image in response")
        return (filename, None, False)
    except Exception as e:
        print(f"[ERROR] {filename} — {e}")
        return (filename, None, False)


async def main():
    print(f"[INFO] Output root: {REFS_ROOT}")
    ACTE1_DIR.mkdir(parents=True, exist_ok=True)
    ACTE4_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[INFO] Launching {len(TASKS_INDEPENDENT)} independent tasks in parallel...")
    t_start = time.time()

    # Phase 1: all 10 independent tasks in parallel
    coros = [
        generate_one(filename, out_dir, prompt, src)
        for (filename, out_dir, prompt, src) in TASKS_INDEPENDENT
    ]
    results_phase1 = await asyncio.gather(*coros)

    # Phase 2: dependent task (exile edit) — only if adult-warrior succeeded
    filename_dep, out_dir_dep, prompt_dep, src_dep = TASK_DEPENDENT
    if src_dep.exists():
        print(f"\n[INFO] Launching dependent task: {filename_dep} (edit of {src_dep.name})")
        result_dep = await generate_one(filename_dep, out_dir_dep, prompt_dep, src_dep)
    else:
        print(f"\n[SKIP]  {filename_dep} — source {src_dep} not available")
        result_dep = (filename_dep, None, False)

    dt_total = time.time() - t_start
    all_results = list(results_phase1) + [result_dep]

    print("\n" + "=" * 70)
    print(f"SUMMARY — Total time: {dt_total:.1f}s")
    print("=" * 70)
    ok = 0
    for filename, path, success in all_results:
        if success and path and path.exists():
            size_kb = path.stat().st_size // 1024
            print(f"  [OK]   {filename:<40} {size_kb} KB")
            ok += 1
        else:
            print(f"  [FAIL] {filename}")
    print(f"\n{ok}/{len(all_results)} images generated")
    print(f"Estimated cost: ${ok * 0.08:.2f}")
    sys.exit(0 if ok == len(all_results) else 1)


if __name__ == "__main__":
    asyncio.run(main())
