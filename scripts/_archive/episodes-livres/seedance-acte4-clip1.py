"""
Seedance 2.0 Storyboard-to-Video - Soundjata Acte IV Clip 1 (Exil + Mema + Messagers, 15s).

Narrative: adult exiled prince Soundjata leaves his village at dusk, trains for
years in the foreign city of Mema, then three urgent horsemen arrive to summon
him home.

Storyboard: 9 panels read left-to-right, top-to-bottom.
Refs: storyboard, Soundjata adult warrior (CANON: braids, white tunic, red sash,
saber), Soundjata in exile (same canon, bundle, fatigue), 3 messengers
(indigo/ocher/forest green), Mema environment.

Endpoint: bytedance/seedance-2.0/reference-to-video
Params: 15s, 720p, 9:16, generate_audio=True (keep-and-duck in Remotion).
Cost: ~$4.54 (15s @ $0.3024/s).
"""

import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
REFS_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4"

STORYBOARD_REF = REFS_DIR / "storyboard-acte4-clip1.png"
WARRIOR_REF = REFS_DIR / "soundjata-adult-warrior-ref.png"
EXILE_REF = REFS_DIR / "soundjata-exile-ref.png"
MESSENGERS_REF = REFS_DIR / "messagers-cavaliers-ref.png"
MEMA_REF = REFS_DIR / "mema-environment.png"

OUT_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat illustration style, warm amber West African palette.

Use the references with strict priority and role separation:
[Image 1] = storyboard - primary guide for shot order, framing, timing, composition. Follow strictly, 9 shots in 15 seconds.
[Image 2] = Soundjata adult warrior CANONICAL identity anchor - woven braids on head, white tunic with gold collar trim, red sash tied at waist, gold bracelet on right wrist, curved saber, no beard, dark brown skin, mature adult 28 years old. LOCK THIS APPEARANCE.
[Image 3] = Soundjata in exile (same canonical character but with cloth bundle on shoulder, dusty tunic, fatigued posture, no saber visible). Same person as [Image 2].
[Image 4] = 3 messenger horsemen identity anchor (distinct colors: lead = indigo + white turban, second = ocher + red turban, third = forest green + brown turban).
[Image 5] = Mema oasis-city environment anchor (Sahelian architecture, ocher walls, minaret, palm trees).

Create a narrative 2D illustrated sequence: Soundjata, exiled adult prince with woven braids and white tunic, leaves his village at dusk, spends years in the foreign city of Mema learning the warrior arts, then three urgent horsemen arrive to summon him home.

Absolute priority:
1. Follow the storyboard strictly for all 9 shots and transitions.
2. Soundjata MUST keep his canonical look in EVERY shot: woven braids, white tunic with gold collar, red sash, gold bracelet, curved saber when armed, NO beard, NO short hair, NO indigo robe.
3. The three messengers' clothing colors stay DISTINCT: indigo, ocher, forest green.
4. Mema architecture stays Sahelian (ocher mud-brick walls, minaret) - NOT Manden (thatched huts).

Color palette: amber, ocher, indigo, dusty red. Warm dusk and dawn light. NO cold blue tones.

Important:
- No text, no banners, no letters, no numerals, no writing visible anywhere.
- Characters' ethnicity: medium-to-dark brown skin (West African).
- Saber, staff, and bundle must remain RIGID, SOLID, NON-DEFORMING, length constant.
- No music, no dialogue, no words - ambient sound only."""


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
    print("SEEDANCE 2.0 STORYBOARD-TO-VIDEO - Acte IV Clip 1 (15s, 9:16)")
    print("=" * 64)
    print(f"Storyboard  : {STORYBOARD_REF.name}")
    print(f"Warrior     : {WARRIOR_REF.name}")
    print(f"Exile       : {EXILE_REF.name}")
    print(f"Messengers  : {MESSENGERS_REF.name}")
    print(f"Mema env    : {MEMA_REF.name}")
    print(f"Prompt      : {len(PROMPT)} chars")
    print()

    for ref in [STORYBOARD_REF, WARRIOR_REF, EXILE_REF, MESSENGERS_REF, MEMA_REF]:
        if not ref.exists():
            raise FileNotFoundError(f"Missing ref: {ref}")

    img_storyboard = upload(STORYBOARD_REF)
    img_warrior = upload(WARRIOR_REF)
    img_exile = upload(EXILE_REF)
    img_messengers = upload(MESSENGERS_REF)
    img_mema = upload(MEMA_REF)

    endpoint = "bytedance/seedance-2.0/reference-to-video"
    args = {
        "prompt": PROMPT,
        "image_urls": [img_storyboard, img_warrior, img_exile, img_messengers, img_mema],
        "duration": "15",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       duration=15s, 720p, 9:16, audio=True")
    print(f"       estimated cost: ~$4.54\n", flush=True)

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

    out_path = OUT_DIR / "acte4-clip1-exil-mema-messagers-v1.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"\n[RESULT_URL] {video_url}")


if __name__ == "__main__":
    main()
