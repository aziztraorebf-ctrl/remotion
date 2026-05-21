"""
Seedance 2.0 Storyboard-to-Video - Soundjata Acte V Segment A v2 (9:16).

Fixes vs v1:
1. aspect_ratio: "9:16" (v1 was erroneously 16:9 - crop to Short would lose ~55%)
2. SHOT 4 anti-arrow-elongation clause added to CRITICAL RULES
   (v1 had the arrow shaft stretching progressively between 11s and 12s)

Rest is identical to v1. Same 4 refs, same 4 shots, same 12s duration.
Cost estimate: ~$3.63 (12s x $0.3024/s @ 720p standard reference-to-video).
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

STORYBOARD_REF = REFS_DIR / "storyboard-segment-A.png"
SOUNDJATA_REF = REFS_DIR / "soundjata-combat-ref.png"
SOUMAORO_REF = REFS_DIR / "soumaoro-combat-ref.png"
SAVANNA_REF = REFS_DIR / "savanna-environment-plate.png"

OUT_DIR = ROOT / "public/assets/library/geoafrique/soundjata/combat-tests"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat anime illustration style, painted graphic novel aesthetic, bold clean outlines, cel-shaded flat colors. Warm earthy palette, West African historical epic tone.

Use the 4 reference images with STRICT priority and role separation:

@image1 is [REF_STORYBOARD] - the PRIMARY GUIDE for shot order, framing, timing, camera angles, composition, and scene progression. Follow the 4 panels in strict order: top-left -> top-right -> bottom-left -> bottom-right. Each panel = one distinct shot with a clear cut between them.

@image2 is [REF_SOUNDJATA] - identity anchor for Soundjata (young Mandinka warrior, dark brown skin, short braided hair, WHITE tunic with GOLD trim, RED sash). Lock his face, body proportions, and costume to this reference.

@image3 is [REF_SOUMAORO] - identity anchor for Soumaoro (older sorcerer-king, dark brown skin, long black dreadlocks, BLACK robe with DARK RED geometric patterns, bone amulets, dark red magical aura on hands). Lock his face, body, and costume to this reference.

@image4 is [REF_SAVANNA] - environment and color palette anchor (Mali savanna late afternoon, golden-ochre grass, warm amber sky, acacia trees, distant red-ochre mesas). All environmental backgrounds should feel continuous with this plate.

SCENE: 13th century Mali, epic of Sundiata. Soumaoro Kante's invulnerability displayed, then Soundjata discovers the secret weakness through a griot's whisper.

SHOT 1 (0-3s) WIDE: Soumaoro stands at center of an open savanna plain matching [REF_SAVANNA], arms raised outward with both palms open, dark red magical aura SWIRLING around his hands. Three arrows STREAK in from off-screen and SHATTER against an invisible shield around him - broken shafts FALLING to the ground at his feet. He THROWS his head back and LAUGHS triumphantly, chin lifted high. Camera slow push in toward him. Dust drifts in the golden light. Warm amber late afternoon light.

SHOT 2 (3-6s) EXTREME CLOSE-UP on Soumaoro face: cruel triumphant grin, eyes intense and menacing, wisps of dark red magical smoke CURLING around his dreadlocks. He SNARLS with contempt, mouth opening in a dark laugh revealing teeth. Camera holds steady. Shallow depth of field, soft blur behind. Dreadlocks drift in light wind.

SHOT 3 (6-9s) MEDIUM SHOT: Soundjata crouched low on one knee in partial shade near acacia trees, body concealed, matching [REF_SOUNDJATA] for face and costume. Beside him, an OLD GRIOT SAGE - an elderly African man with a LONG WHITE BEARD, simple earth-toned BOUBOU robe, holding a wooden walking staff - leans close to Soundjata's ear and WHISPERS urgently. The griot's free hand POINTS off to the distant side. Soundjata's eyes WIDEN with sudden understanding, mouth slightly OPEN in realization. Quiet tense moment. Natural dappled lighting through the acacia leaves.

SHOT 4 (9-12s) TIGHT CLOSE-UP on Soundjata hands: both hands visible, carefully and deliberately BINDING a small white curved rooster spur (a small claw-shaped bone, clearly rooster-like, clearly organic and WHITE not metal) to the iron tip of an arrowhead using thin brown cord. Strong side-light catching the detail. Fingers move with focused precision. Pure detail shot, no face visible in frame. Dust motes float in the light.

CRITICAL IDENTITY RULES:
- Soumaoro's hands are ALWAYS open with red magical glow, NEVER holding any weapon, NEVER picking up anything.
- Soundjata wears ONLY the white tunic with gold trim and red sash from [REF_SOUNDJATA], NEVER another outfit.
- The griot sage in SHOT 3 is a NEW THIRD character (old man with white beard, earth-toned boubou, staff) - NOT Soundjata, NOT Soumaoro, do NOT confuse their faces.
- SHOT 4 arrow rule: the arrow is a RIGID, SOLID, NON-DEFORMING wooden shaft - its length MUST remain CONSTANT throughout the shot. The arrow does NOT stretch, does NOT extend, does NOT grow longer over time, does NOT change size between frames. Keep the framing tight enough that only the arrowhead, the rooster spur, and the binding point near the tip are visible in frame - the rest of the shaft extends off-frame and stays off-frame.
- Follow [REF_STORYBOARD] strictly for composition and shot order.

COLOR GRADE: warm ochre and amber tones throughout, deep indigo shadows, white tunic pops against earth tones, dark red magical glow confined strictly to Soumaoro's hands, clean cel-shading with soft painterly light.

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
    print("SEEDANCE 2.0 STORYBOARD-TO-VIDEO - Segment A v2 (9:16, anti-arrow)")
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

    out_path = OUT_DIR / f"storyboard-segment-A-v2-{int(t0)}.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    main()
