"""
Seedance 2.0 Storyboard-to-Video - Soundjata Acte I SETUP (13s).

Three-beat narrative: tyrannie village -> prophetie griots -> handicap bebe.
Triple color grade: sepia tyrannie -> amber prophetie -> ochre handicap.

Storyboard: 9 panels in a 3x3 grid (read left-to-right, top-to-bottom).
  Row 1: tyrannie village  (WIDE village in ruins / MED tyrant shadow silhouette / CLOSE villager holding baby)
  Row 2: prophetie griots  (WIDE prophet arms raised / EXTREME CU lion symbol in sand / MED three griots awed)
  Row 3: handicap bebe     (WIDE baby alone in hut / CLOSE baby face determined / MED children running away)

Refs (8 total, under the 9-ref Seedance cap):
  1. storyboard-9panels      (primary guide)
  2. soundjata-baby-ref      (toddler identity anchor)
  3. acte7 elder             (elder griot reused)
  4. acte7 young             (young male griot reused)
  5. acte7 female             (female griotte reused)
  6. village-children-ref     (other village kids, for MED children running away)
  7. tyrant-shadow-symbol     (tyrant silhouette symbol)
  8. village-night-plate      (environment/color-palette anchor)

Endpoint: bytedance/seedance-2.0/reference-to-video
Params: 13s, 720p, 9:16, generate_audio=True (keep-and-duck in Remotion).
Cost: ~$3.93 (13s @ $0.3024/s).
"""

import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
REFS_ACTE1 = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte1"
REFS_ACTE7 = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte7"

STORYBOARD_REF = REFS_ACTE1 / "storyboard-9panels.png"
BABY_REF = REFS_ACTE1 / "soundjata-baby-ref.png"
ELDER_REF = REFS_ACTE7 / "elder.png"
YOUNG_REF = REFS_ACTE7 / "young.png"
FEMALE_REF = REFS_ACTE7 / "female.png"
CHILDREN_REF = REFS_ACTE1 / "village-children-ref.png"
TYRANT_REF = REFS_ACTE1 / "tyrant-shadow-symbol.png"
VILLAGE_REF = REFS_ACTE1 / "village-night-plate.png"

OUT_DIR = ROOT / "public/assets/library/geoafrique/heros-oublies/soundjata/clips-validated"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat illustration style, semi-detailed painted graphic novel aesthetic, bold clean outlines, cel-shaded flat colors. West African epic tone. Medium-to-dark brown skin tones throughout. Three-beat narrative with TRIPLE COLOR GRADE shift.

Use the 8 reference images with STRICT priority and role separation:

@image1 is [REF_STORYBOARD] - PRIMARY GUIDE for shot order, framing, camera angles, composition, and scene progression. 9 panels arranged in a 3x3 grid, read left-to-right top-to-bottom. Panel labels: ROW 1 (WIDE tyrannie village, MED tyrant shadow, CLOSE villager holding baby) / ROW 2 (WIDE prophet arms raised, EXTREME CU lion symbol in sand, MED three griots awed) / ROW 3 (WIDE baby alone in hut, CLOSE baby face determined, MED children running away). Follow the shot sequence strictly.

@image2 is [REF_BABY] - identity anchor for baby Soundjata, a TODDLER aged 2-3 years old, deep brown dark skin, ochre tunic, large expressive eyes. Lock his face, body proportions (TODDLER, not infant, not older child), and costume. He must look exactly like this in every shot where he appears.

@image3 is [REF_GRIOT_ELDER] - identity anchor for the elder griot prophet (aged 60-70, deep INDIGO boubou with gold trim, small embroidered cap, grey beard). Lock face and costume.

@image4 is [REF_GRIOT_YOUNG] - identity anchor for the young male griot (aged 25-32, deep brown dark skin, short-cropped hair, earth-ochre TERRACOTTA boubou). ADULT, not a child.

@image5 is [REF_GRIOT_FEMALE] - identity anchor for the female griotte (aged 35-45, BURGUNDY-red head-wrap with gold patterns, burgundy-and-gold boubou).

@image6 is [REF_CHILDREN] - identity anchor for the other village children (ages 6-10, colorful tunics, deep brown skin). Used in the MED children running away shot.

@image7 is [REF_TYRANT_SHADOW] - symbol anchor for the tyrant: a menacing horned silhouette against a torch-lit wall. Used for the MED tyrant shadow shot - never show a real human, only the shadow silhouette with horned crown and staff.

@image8 is [REF_VILLAGE] - environment and base color palette anchor (Mandingue village at dusk, earth-brick huts, baobab tree, dusty ground). All environments should feel continuous with this plate, shifted by the color grade of the current beat.

SCENE: Ancient Mandingue village under the tyranny of Soumaoro Kante. Three narrative beats unfold. BEAT 1 (tyrannie, sepia grade): village in ruins under a blood-red sky, the menacing horned shadow of the tyrant looms against a wall, a father holds his infant protectively. BEAT 2 (amber-gold grade): a prophet griot raises his arms toward the sun, a lion paw-print emerges in the sand as sacred symbol, three griots (elder + young male + female) watch in awe - the prophecy of the Lion King is born. BEAT 3 (ochre-warm grade): the toddler Soundjata sits alone inside a dim hut, unable to walk, his face shifts from sadness to determination, while outside other village children run and play past the doorway.

ABSOLUTE PRIORITIES:
1. Follow the 9-panel storyboard strictly for shot order, framing, and progression.
2. Baby Soundjata is a TODDLER (aged 2-3), locked to [REF_BABY] - never an infant, never an older child.
3. Griots colors must stay DISTINCT: elder=INDIGO, young male=TERRACOTTA, female=BURGUNDY. Never swap.
4. Color grade shifts across the 3 beats: BEAT 1 sepia-red tyrannie, BEAT 2 amber-gold prophetie, BEAT 3 warm ochre handicap. The palette must clearly change between beats.
5. All characters West African, medium-to-dark brown skin, natural human anatomy, no distortion.

IMPORTANT: narrative pace, not action. Subtle natural motion - shadow flickering in torchlight, prophet's boubou swaying, lion symbol appearing in sand, baby's eyes shifting from sad to determined, children running past a doorway. Gentle camera moves (slow push-in on CLOSE shots, subtle pan on WIDE). Each panel gets roughly 1.2-1.5 seconds.

No text, no banners, no signs, no writing, no letters visible anywhere. No tattoos or markings on skin. No extra limbs or hand morphing. The tyrant in BEAT 1 MED shot is ONLY a shadow silhouette on a wall - never a real face. Natural anatomy throughout. No music, no words, no dialogue in the audio."""


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
    print("SEEDANCE 2.0 STORYBOARD-TO-VIDEO - Acte I Setup (13s, 9:16)")
    print("=" * 64)
    print(f"Storyboard : {STORYBOARD_REF.name}")
    print(f"Baby       : {BABY_REF.name}")
    print(f"Elder      : {ELDER_REF.name}")
    print(f"Young      : {YOUNG_REF.name}")
    print(f"Female     : {FEMALE_REF.name}")
    print(f"Children   : {CHILDREN_REF.name}")
    print(f"Tyrant     : {TYRANT_REF.name}")
    print(f"Village    : {VILLAGE_REF.name}")
    print(f"Prompt     : {len(PROMPT)} chars")
    print()

    refs = [
        STORYBOARD_REF,
        BABY_REF,
        ELDER_REF,
        YOUNG_REF,
        FEMALE_REF,
        CHILDREN_REF,
        TYRANT_REF,
        VILLAGE_REF,
    ]
    for ref in refs:
        if not ref.exists():
            raise FileNotFoundError(f"Missing ref: {ref}")

    urls = [upload(r) for r in refs]

    endpoint = "bytedance/seedance-2.0/reference-to-video"
    args = {
        "prompt": PROMPT,
        "image_urls": urls,
        "duration": "13",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": True,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       duration=13s, 720p, 9:16, audio=True, 8 refs")
    print(f"       estimated cost: ~$3.93\n", flush=True)

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

    out_path = OUT_DIR / "acte1-setup-v1.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"\n[RESULT_URL] {video_url}")


if __name__ == "__main__":
    main()
