"""
Seedance 2.0 Storyboard-to-Video Test - Soundjata Acte V Segment B (10s).

Segment B covers:
  SHOT 1 (0-2.5s)  Aerial pulling up: armies charging, just before clash
  SHOT 2 (2.5-5s)  Low angle heroic: Soundjata drawing the bow to full tension
  SHOT 3 (5-7.5s)  Foreshortened arrow in flight toward the viewer
  SHOT 4 (7.5-10s) Soumaoro struck, red aura disperses, turns back and flees

Key choices:
- generate_audio: True (let Seedance auto-sync SFX on the battle motion)
- Aspect ratio: 9:16 (native portrait for YouTube Shorts - never crop 16:9 to 9:16)
- SHOT 1 uses camera pull-up + concentric dust SWIRLS + VARIED warriors
  (mitigation for multi-army collision complexity)
- Prompt ~3400 chars

Cost estimate: ~$3.02 (10s x $0.3024/s @ 720p standard reference-to-video).
"""

import os
import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
REFS_DIR = ROOT / "public/assets/library/geoafrique/soundjata/combat-refs"

STORYBOARD_REF = REFS_DIR / "storyboard-segment-B.png"
SOUNDJATA_REF = REFS_DIR / "soundjata-combat-ref.png"
SOUMAORO_REF = REFS_DIR / "soumaoro-combat-ref.png"
SAVANNA_REF = REFS_DIR / "savanna-environment-plate.png"

OUT_DIR = ROOT / "public/assets/library/geoafrique/soundjata/combat-tests"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat anime illustration style, painted graphic novel aesthetic, bold clean outlines, cel-shaded flat colors. Warm earthy palette, West African historical epic tone. Dynamic action.

Use the 4 reference images with STRICT priority and role separation:

@image1 is [REF_STORYBOARD] - the PRIMARY GUIDE for shot order, framing, camera angles, composition, and scene progression. Follow the 4 panels in strict order: top-left -> top-right -> bottom-left -> bottom-right. Each panel = one distinct shot with a clear cut between them.

@image2 is [REF_SOUNDJATA] - identity anchor for Soundjata (young Mandinka warrior, dark brown skin, short braided hair, WHITE tunic with GOLD trim, RED sash). Lock his face, body proportions, and costume to this reference. In this segment he uses a LONGBOW (not a sabre) - same identity, different weapon.

@image3 is [REF_SOUMAORO] - identity anchor for Soumaoro (older sorcerer-king, dark brown skin, long black dreadlocks, BLACK robe with DARK RED geometric patterns, dark red magical aura on hands). Lock his face, body, and costume to this reference.

@image4 is [REF_SAVANNA] - environment and color palette anchor (Mali savanna late afternoon, golden-ochre grass, warm amber sky, acacia trees, distant red-ochre mesas). All backgrounds should feel continuous with this plate.

SCENE: 13th century Mali, battle of Kirina 1235. The climax of the epic - Soundjata fires the rooster-spur arrow at Soumaoro, the tyrant's magic dies, and he flees forever.

SHOT 1 (0-2.5s) BIRD'S-EYE AERIAL view, camera PULLS UP slowly: vast savanna plain from above, matching [REF_SAVANNA] palette. Two massive armies CHARGE at each other from opposite sides of the frame, hundreds of tiny warrior figures CLOSING IN on the center. VARIED warriors - different armor, different shields, different heights, different skin tones, no two warriors alike. Huge concentric rings of dust SWIRL outward from the approaching impact point. The camera PULLS UP higher as the armies close in, so we see the whole battlefield. CUT before they actually clash.

SHOT 2 (2.5-5s) LOW ANGLE HEROIC CLOSE-UP on Soundjata: matching [REF_SOUNDJATA] for face and costume. He stands with feet planted wide, both arms extended, DRAWING BACK a LONGBOW to full tension. A single arrow is nocked, a small WHITE rooster spur clearly visible tied near the arrowhead. His eyes are SHARPLY FOCUSED, brow furrowed, jaw clenched with determination. Shot from below looking up at him. Amber sky and rising dust behind him. Wind whips his red sash.

SHOT 3 (5-7.5s) EXTREME FORESHORTENED shot of the arrow MID-FLIGHT: the arrowhead FLIES directly toward the camera, the rooster spur visibly tied near the tip, motion streaks and speed lines TRAILING behind. The arrow FILLS most of the frame. Blurred battlefield in the background far behind. Sense of incredible speed and inevitability. Sharp whistling WHOOSH of an arrow cutting through air.

SHOT 4 (7.5-10s) MEDIUM SHOT: Soumaoro matching [REF_SOUMAORO] is STRUCK by the arrow in his LEFT shoulder, body JOLTS backward from the impact. His dark red magical aura DISPERSES into thin wisps and FADES away completely from his hands. His face shows SHOCK and PANIC, eyes wide, mouth open in a scream. He immediately TURNS his back to the camera and RUNS AWAY into a thick cloud of swirling dust. His black robe and dreadlocks flow behind him mid-motion. We see him from a 3/4 back angle disappearing into the dust.

CRITICAL RULES:
- Soumaoro NEVER holds a weapon, NEVER picks up anything. He fights only with sorcery that DIES when hit.
- The rooster spur on the arrow is WHITE and clearly organic (a small curved claw-like bone), not metal.
- In SHOT 1, the armies do NOT actually collide on screen. Camera cuts before impact.
- SHOT 2 Soundjata uses a LONGBOW, not the sabre from [REF_SOUNDJATA] - same character, different weapon.
- SHOT 3 arrow rule: the arrow is a RIGID, SOLID, NON-DEFORMING wooden shaft - its length MUST remain CONSTANT throughout the shot. The arrow does NOT stretch, does NOT extend, does NOT grow longer over time, does NOT change size between frames. The motion blur and speed lines can intensify but the physical arrow shape stays fixed.
- Follow [REF_STORYBOARD] strictly for composition and shot order.

COLOR GRADE: warm ochre and amber tones, deep indigo shadows, white tunic pops, dark red magical glow confined to Soumaoro's hands and fading in SHOT 4. Cinematic late-afternoon battlefield warmth.

No text, no banners, no signs, no writing visible anywhere. Warriors have VARIED faces and armor, no cloned figures. The human body structure is normal, without motion distortion, without abrupt changes, no unnecessary spins, no unnecessary 360-degree turns."""


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
    print("SEEDANCE 2.0 STORYBOARD-TO-VIDEO - Soundjata Acte V Segment B")
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
        "duration": "10",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       duration=10s, 720p, 9:16, audio=True")
    print(f"       estimated cost: ~$3.02\n", flush=True)

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

    out_path = OUT_DIR / f"storyboard-segment-B-v1-{int(t0)}.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    main()
