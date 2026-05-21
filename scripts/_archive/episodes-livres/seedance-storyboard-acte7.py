"""
Seedance 2.0 Storyboard-to-Video - Soundjata Acte VII (Griots, 12s).

Contemplative nocturnal scene: elder griot passing the oral tradition
of Soundjata to a young adult male griot and a female griotte around a
campfire in modern Mali.

Storyboard: 9 panels in a 3x3 grid (read left-to-right, top-to-bottom).
Refs: elder, young (ADULT), female (griotte), environment (savanna night plate).

Endpoint: bytedance/seedance-2.0/reference-to-video
Params: 12s, 720p, 9:16, generate_audio=True (keep-and-duck in Remotion).
Cost: ~$3.63 (12s @ $0.3024/s).
"""

import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
REFS_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte7"

STORYBOARD_REF = REFS_DIR / "storyboard.png"
ELDER_REF = REFS_DIR / "elder.png"
YOUNG_REF = REFS_DIR / "young.png"
FEMALE_REF = REFS_DIR / "female.png"
ENV_REF = REFS_DIR / "environment.png"

OUT_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat anime illustration style, painted graphic novel aesthetic, bold clean outlines, cel-shaded flat colors. Contemplative warm firelight nocturnal mood, West African epic tone.

Use the 5 reference images with STRICT priority and role separation:

@image1 is [REF_STORYBOARD] - PRIMARY GUIDE for shot order, framing, camera angles, composition, and scene progression. 9 panels arranged in a 3x3 grid, read left-to-right top-to-bottom. Each panel has a shot label (WIDE ESTABLISHING, EXTREME CLOSE-UP HANDS, MEDIUM CLOSE-UP, EXTREME CLOSE-UP EYES, LOW ANGLE, OVER-THE-SHOULDER, EXTREME CLOSE-UP EMBERS, MEDIUM, WIDE FINAL). Follow the shot sequence strictly.

@image2 is [REF_ELDER] - identity anchor for the elder griot (aged 60-70, deep indigo boubou with gold trim, small embroidered cap, grey beard, holding a kora with calabash body and straight neck). Lock his face, costume, and kora.

@image3 is [REF_YOUNG] - identity anchor for the young adult male griot (aged 25-32, deep brown dark skin, short-cropped black hair, no beard, earth-ochre terracotta boubou). Lock his face and costume. He is an ADULT man, not a child, not a teenager.

@image4 is [REF_FEMALE] - identity anchor for the griotte jelimusow (aged 35-45, burgundy-red head-wrap with gold patterns, burgundy-and-gold wax-print boubou, dignified bearing). Lock her face and costume.

@image5 is [REF_ENVIRONMENT] - environment and color palette anchor (Mali savanna at night, campfire, starry indigo sky, acacia silhouettes, amber firelight). All backgrounds must feel continuous with this plate.

SCENE: Modern Mali, timeless nocturnal gathering around a campfire. An elder griot sings the story of Soundjata Keita, passing it to a young adult griot and a female griotte. They transmit the oral tradition across generations. Near the end, the young adult griot takes up the kora himself.

ABSOLUTE PRIORITIES:
1. Follow the 9-panel storyboard strictly for shot order and progression.
2. Keep the elder locked to [REF_ELDER] at all times.
3. Keep the young adult locked to [REF_YOUNG] - ADULT, not a child.
4. Keep the female griotte locked to [REF_FEMALE].
5. Every shot happens at night around the campfire, environment continuous with [REF_ENVIRONMENT] - warm firelight below, starry indigo sky above, acacia silhouettes.

IMPORTANT: calm contemplative pace, NOT action. Subtle natural motion - fingers plucking kora strings, lips moving in song, firelight flickering, embers drifting up, head-wrap fabric slightly moving. Camera moves are slow and gentle (subtle push-in, gentle pan). No hard cuts that break the nocturnal atmosphere - let the firelight bind the shots.

No text, no banners, no signs, no writing visible anywhere. Clean skin, no markings or tattoos on bodies. Natural human anatomy, no distortion, no unnecessary spins, no 360-degree turns. No hands morphing. Kora shape stays RIGID and CONSTANT - calabash body half-sphere, straight neck, visible strings. No words, no music."""


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
    print("SEEDANCE 2.0 STORYBOARD-TO-VIDEO - Acte VII Griots (12s, 9:16)")
    print("=" * 64)
    print(f"Storyboard  : {STORYBOARD_REF.name}")
    print(f"Elder       : {ELDER_REF.name}")
    print(f"Young       : {YOUNG_REF.name}")
    print(f"Female      : {FEMALE_REF.name}")
    print(f"Environment : {ENV_REF.name}")
    print(f"Prompt      : {len(PROMPT)} chars")
    print()

    for ref in [STORYBOARD_REF, ELDER_REF, YOUNG_REF, FEMALE_REF, ENV_REF]:
        if not ref.exists():
            raise FileNotFoundError(f"Missing ref: {ref}")

    img_storyboard = upload(STORYBOARD_REF)
    img_elder = upload(ELDER_REF)
    img_young = upload(YOUNG_REF)
    img_female = upload(FEMALE_REF)
    img_env = upload(ENV_REF)

    endpoint = "bytedance/seedance-2.0/reference-to-video"
    args = {
        "prompt": PROMPT,
        "image_urls": [img_storyboard, img_elder, img_young, img_female, img_env],
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

    out_path = OUT_DIR / f"acte7-griots-v1.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"\n[RESULT_URL] {video_url}")


if __name__ == "__main__":
    main()
