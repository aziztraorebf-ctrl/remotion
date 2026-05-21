"""
Seedance 2.0 Storyboard-to-Video - Soundjata Acte V Segment B v3 (12s).

Major redesign vs v1:
- POV-first approach (Shots 1-2 are first-person through Soundjata's eyes)
- Lateral arrow in flight (Shot 3)
- Physical impact with proper orientation (Shot 4)
- Soumaoro staggered in terror, no literal fleeing (Shot 5)

Storyboard : storyboard-segment-B-v3.png (Gemini produced 6 cells in 2x3
grid instead of 5 cells in 1 row - Shots 3 and 4 are duplicate "arrow in
flight" cells; we instruct Seedance to treat them as ONE shot).

Covers narration:
  kirinaDate (78.00-80.22s) : "Bataille de Kirina, 1235"
  flecheAtteint (80.58-83.86s) : "la fleche atteint Soumaoro, ses pouvoirs disparaissent"
  tyranFuite (83.86-87.28s) : "le tyran s'enfuit dans la montagne et ne revient jamais"

Cost: ~$3.63 (12s @ $0.3024/s, 720p, 9:16, reference-to-video).
"""

import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
REFS_DIR = ROOT / "public/assets/library/geoafrique/soundjata/combat-refs"

STORYBOARD_REF = REFS_DIR / "storyboard-segment-B-v3d.png"
SOUNDJATA_REF = REFS_DIR / "soundjata-combat-ref.png"
SOUMAORO_REF = REFS_DIR / "soumaoro-combat-ref.png"
SAVANNA_REF = REFS_DIR / "savanna-environment-plate.png"

OUT_DIR = ROOT / "public/assets/library/geoafrique/soundjata/combat-tests"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat anime illustration style, painted graphic novel aesthetic, bold clean outlines, cel-shaded flat colors. Warm earthy palette, West African historical epic tone.

Use the 4 reference images with STRICT priority and role separation:

@image1 is [REF_STORYBOARD] - the PRIMARY GUIDE for shot order, framing, camera angles, composition, and scene progression. IMPORTANT: even though the storyboard shows 6 cells in a 2x3 grid, treat this as 5 DISTINCT SHOTS. Cells 3 and 4 both show the arrow in flight from slightly different angles - MERGE them into ONE arrow-in-flight shot. The 5 shots are: (1) POV draw, (2) POV release, (3) arrow in flight lateral view, (4) impact on Soumaoro, (5) Soumaoro staggered in terror. Follow this 5-shot order strictly.

@image2 is [REF_SOUNDJATA] - identity anchor for Soundjata's hands and costume details (dark brown skin, white tunic sleeve, gold bracelet on left wrist, red sash). In this segment, ONLY his hands and forearms are visible - in POV first-person perspective - during Shots 1 and 2. His face and full body do NOT appear. Just his hands gripping the bow.

@image3 is [REF_SOUMAORO] - identity anchor for Soumaoro (older sorcerer-king, dark brown skin, long black dreadlocks, BLACK robe with DARK RED geometric patterns, bone amulets on chest, dark red magical aura on hands). Lock his face, body, and costume to this reference.

@image4 is [REF_SAVANNA] - environment and color palette anchor (Mali savanna late afternoon, golden-ochre grass, warm amber sky, acacia trees, distant red-ochre mesas). All environmental backgrounds must feel continuous with this plate.

SCENE: 13th century Mali, battle of Kirina 1235. Continuation from a previous sequence where Soundjata just finished binding a rooster spur to an arrowhead. Now he fires the arrow, it strikes Soumaoro, the tyrant's magic dies, terror replaces tyranny.

SHOT 1 (0-2.5s) FIRST-PERSON POV - SOUNDJATA DRAWS THE BOW: We see through Soundjata's own eyes, looking forward. His left hand is extended forward gripping a wooden bow vertically at center of frame, his right hand is pulled back to his cheek holding the bowstring fully drawn. A single arrow with a small white rooster spur tied near the arrowhead is nocked and pointing forward into the distance. Partial view of his white tunic sleeve and GOLD bracelet on left wrist. In the far distance at the center of the frame, Soumaoro's tiny distant figure stands on the savanna, arms raised outward, glowing red aura around his palms - unaware. Warm amber savanna, acacia silhouettes on the horizon. Camera very slight forward tension (like taking aim). DO NOT show Soundjata's face - ONLY his hands and arms from first-person perspective.

SHOT 2 (2.5-5s) SAME FIRST-PERSON POV - INSTANT OF RELEASE: Keep the exact same camera angle as Shot 1. His right-hand fingers SNAP OPEN, the bowstring VIBRATES VIOLENTLY backward in a motion blur. The arrow WHOOSHES off into the distance, rapidly shrinking as it flies away from us toward Soumaoro. Only motion streaks remain where the arrow just departed. His left hand still grips the bow. Soumaoro still tiny on the horizon, still unaware. Same savanna, same POV angle. DO NOT show Soundjata's face - still first-person only.

SHOT 3 (5-7.5s) LATERAL SIDE-VIEW OF THE ARROW IN FLIGHT: Camera now outside (no longer POV). The arrow flies HORIZONTALLY through the frame from LEFT to RIGHT. Arrowhead is at the RIGHT side of the frame, pointing RIGHT, with rooster spur clearly visible tied near it. Tail feathers on the LEFT. Motion streaks and radial speed lines TRAIL BEHIND the arrow to the left. Dust-blurred warm savanna visible in background. At the far RIGHT edge, Soumaoro's distant figure is visible, arms still raised, aura glowing red, unaware the arrow is about to reach him. Sharp whistling whoosh sense of speed and inevitability.

SHOT 4 (7.5-9.5s) MEDIUM SHOT - IMPACT: Soumaoro struck HARD by the arrow, which ENTERS his upper torso / left chest-shoulder area FROM THE FRONT. The wooden shaft is visibly lodged in his chest with the tip having just passed through. His body JERKS BACKWARD VIOLENTLY - torso cambered back, both arms FLYING UP and OUTWARD in a reflex recoil, one foot LIFTING off the ground from the impact. His red magical aura EXPLODES into scattered dispersing wisps and fragments all around him - no longer contained, blown apart by the blow. Dreadlocks WHIP back wildly. Face contorted in SHARP SHOCK and pain - eyes wide, mouth open in a silent scream, teeth visible. Dust kicks up at his feet from the staggering. Dynamic action radiating lines around the impact point. This is NOT a static pose - his whole body is in violent reactive motion.

SHOT 5 (9.5-12s) MEDIUM CLOSE - SOUMAORO STAGGERED AND TERRIFIED: Soumaoro now standing but visibly wounded and UNSTABLE. The arrow is still lodged in his upper body. His LEFT HAND clutches the wound tightly (gripping the arrow shaft where it enters his flesh). His body hunched forward slightly, knees slightly bent. His face shows PURE TERROR: eyes wide open, mouth open in a silent gasp, jaw slack, teeth bared, dreadlocks disheveled and hanging around his face. He glances SIDEWAYS over his wounded shoulder with wild fearful eyes - the look of a fallen tyrant realizing he is mortal. NO MORE AURA - only faint wisps of dissipating red smoke floating in the air around him, fading. Savanna and dust behind him, slightly cooler atmosphere than earlier. His body language communicates IMMINENT FLIGHT - the posture of someone about to break and run - but he has not yet moved. SUSPENDED MOMENT OF DEFEAT.

CRITICAL RULES:
- Shots 1 and 2 are STRICT FIRST-PERSON POV: ONLY Soundjata's hands, forearms, tunic sleeve, and gold bracelet visible. NEVER show his face or body. We see what HE sees.
- The arrow is a RIGID, SOLID, NON-DEFORMING wooden shaft throughout all shots - its length stays CONSTANT, does NOT stretch, does NOT grow, does NOT change size between frames.
- In Shot 3, the arrow flies LEFT to RIGHT. Arrowhead at right, feathers at left. Unambiguous direction.
- In Shot 4, the arrow enters Soumaoro's LEFT SHOULDER FROM THE FRONT and LODGES there. The arrow does NOT pass through his body - only the tail feathers and half the shaft protrude from the FRONT of his left shoulder, the arrowhead is buried in the flesh. Never show the arrow in his chest or back. Only the left shoulder, from the front. His body REACTS PHYSICALLY with violent backward motion. Soumaoro is NOT static - he is in full reactive movement.
- In Shot 5, the SAME arrow is still lodged in the SAME left shoulder from the FRONT. Never show a second arrow. Never show the arrow in chest or back. Soumaoro staggered, terrified.
- Soumaoro's aura EXPLODES and DISPERSES into wisps upon impact - it does not simply fade.
- In Shot 5, Soumaoro is WOUNDED and TERRIFIED but still standing. Do NOT show him fleeing, running, or falling - just suspended panic. The viewer understands flight is imminent.
- Soundjata does NOT appear in Shots 3, 4, or 5 at all - the camera is now on Soumaoro and the arrow.
- Follow the 5-shot structure from the storyboard strictly.

COLOR GRADE: warm ochre and amber tones throughout, deep indigo shadows, white tunic sleeve pops in POV shots, gold bracelet catches light, dark red magical glow confined strictly to Soumaoro's aura (which dies in Shots 4-5), clean cel-shading with soft painterly light. Shot 5 slightly cooler/dimmer to suggest the defeated mood.

No text, no banners, no signs, no writing visible anywhere. Clean skin, no markings or tattoos on bodies. The human body structure is normal, without motion distortion, without abrupt changes, no unnecessary spins, no unnecessary 360-degree turns."""


def upload(path: Path) -> str:
    print(f"[UPLOAD] {path.name}...", flush=True)
    url = fal_client.upload_file(str(path))
    print(f"         -> {url}", flush=True)
    return url


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"  [fal] {log.get('message', '')}", flush=True)


def main():
    print("=" * 64)
    print("SEEDANCE 2.0 STORYBOARD-TO-VIDEO - Segment B v3 (POV, 12s, 9:16)")
    print("=" * 64)
    print(f"Storyboard : {STORYBOARD_REF.name}")
    print(f"Soundjata  : {SOUNDJATA_REF.name}")
    print(f"Soumaoro   : {SOUMAORO_REF.name}")
    print(f"Savanna    : {SAVANNA_REF.name}")
    print(f"Prompt     : {len(PROMPT)} chars")
    print()

    img_storyboard = upload(STORYBOARD_REF)
    img_soundjata = upload(SOUNDJATA_REF)
    img_soumaoro = upload(SOUMAORO_REF)
    img_savanna = upload(SAVANNA_REF)

    endpoint = "bytedance/seedance-2.0/reference-to-video"
    args = {
        "prompt": PROMPT,
        "image_urls": [img_storyboard, img_soundjata, img_soumaoro, img_savanna],
        "duration": "12",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       duration=12s, 720p, 9:16, audio=True")
    print(f"       estimated cost: ~$3.63\n", flush=True)

    t0 = time.time()
    result = fal_client.subscribe(
        endpoint, arguments=args, with_logs=True, on_queue_update=on_queue_update
    )
    elapsed = time.time() - t0
    print(f"\n[DONE] {elapsed:.1f}s")

    video_url = None
    if isinstance(result.get("video"), dict):
        video_url = result["video"].get("url")

    if not video_url:
        print(f"[WARN] no video url in result: {result}")
        return

    out_path = OUT_DIR / f"storyboard-segment-B-v3-{int(t0)}.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    main()
