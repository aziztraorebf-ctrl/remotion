"""
Seedance 2.0 Reference-to-Video Test V2 — Choreography Transfer
Fixes from V1:
1. Anti-sword clause for Soumaoro (phantom sabre appeared at ~7.5s in V1)
2. Explicit facial expressions (V1 had neutral stoic faces during intense combat)

Inputs: same as V1 (Soundjata + Soumaoro refs + segment B).
Output: 10s 9:16 720p video.
Cost: ~$3.02
"""

import os
import time
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent.parent / ".env")

ROOT = Path(__file__).parent.parent.parent
SOUNDJATA_REF = ROOT / "public/assets/library/geoafrique/soundjata/combat-refs/soundjata-combat-ref.png"
SOUMAORO_REF = ROOT / "public/assets/library/geoafrique/soundjata/combat-refs/soumaoro-combat-ref.png"
VIDEO_REF = Path("/tmp/choreo-segments/seg_B_4-12s.mp4")

OUT_DIR = ROOT / "public/assets/library/geoafrique/soundjata/combat-tests"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """2D vivid flat anime illustration style, painted graphic novel aesthetic, bold clean outlines, cel-shaded flat colors.

SCENE: 13th century West Africa, rocky savanna at dusk. Two warriors face off on dusty ochre ground with scattered boulders, distant haze of golden-orange sky. Wide cinematic shot.

CHARACTERS:
@image1 is SOUNDJATA (right side of frame): young Mandinka warrior, dark brown skin, short braided hair, WHITE tunic with GOLD trim and RED sash, holding a CURVED STEEL SABRE in his RIGHT HAND throughout the entire fight.
@image2 is SOUMAORO (left side of frame): older Sosso sorcerer-king, dark brown skin, long black dreadlocks, BLACK robe with DARK RED geometric patterns, bone amulets on chest, BOTH HANDS open with dark red magical glow.

CRITICAL WEAPON RULE: Soundjata is the ONLY one with a weapon. Soumaoro NEVER touches a weapon, NEVER holds a sabre, NEVER wields a blade, NEVER picks up any object. His hands remain ALWAYS open with red magical glow. He fights EXCLUSIVELY with sorcery — dark red energy from his palms. If any blade appears, it belongs ONLY to Soundjata.

FACIAL EXPRESSIONS RULE: Both warriors show INTENSE physical effort throughout. Teeth CLENCHED or bared in battle snarls, eyebrows deeply FURROWED, mouths OPEN shouting battle cries, jaw muscles tight, veins visible on necks, sweat on brows. Every frame shows combat strain — NO neutral or calm expressions.

CHOREOGRAPHY (follow @video1 for camera movement, rhythmic timing, and fight staging):

0-2s (Wide shot, camera static): Both warriors in combat stance, facing each other. Soumaoro LEFT with BOTH palms raised and glowing red, Soundjata RIGHT with sabre raised diagonally. Both PLANT their feet firmly, bodies COILED, faces already SNARLING with anticipation. Dust drifts slowly.

2-4s (Snap zoom in toward the clash point): Soundjata LUNGES forward with explosive speed, sabre SLICING horizontally. Soundjata's face TWISTED in battle fury, teeth bared. Soumaoro SNAPS both open palms up, dark red energy BURSTING from his hands to block — his hands REMAIN OPEN, no weapon. Soumaoro's face SCOWLING, eyes wide with rage. DUST SWIRLS outward.

4-6s (Medium close-up, camera tracks): Soundjata STRIKES twice, blade flashing. His face FEROCIOUS, jaw clenched. Soumaoro PIVOTS, deflecting each strike with glowing open palms — sparks EXPLODING at each contact. Soumaoro grunts through gritted teeth. Both men GRUNTING, SHOUTING. No weapons in Soumaoro's hands.

6-8s (Pull back to wide shot, camera steady): Soundjata SPINS away and lands in a new stance on the right, sabre held low, chest HEAVING. Soumaoro STAGGERS one step back on the left, hands STILL OPEN and glowing red. Both panting heavily, mouths open, sweat dripping. Standoff. Dust settling. Soumaoro's hands remain empty.

COLOR GRADE: warm ochre dust, deep indigo shadows, white tunic pops, dark red magical glow confined to Soumaoro's hands only. Cinematic sunset warmth.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue. Clean skin, no markings or tattoos on bodies. The human body structure is normal, without motion distortion, without abrupt changes, no unnecessary spins. Soumaoro's hands ALWAYS EMPTY."""


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
    print("=" * 60)
    print("SEEDANCE 2.0 REFERENCE-TO-VIDEO — CHOREOGRAPHY TEST V2")
    print("Fixes: anti-sword clause + facial expressions")
    print("=" * 60)

    img1 = upload(SOUNDJATA_REF)
    img2 = upload(SOUMAORO_REF)
    vid1 = upload(VIDEO_REF)

    endpoint = "bytedance/seedance-2.0/reference-to-video"
    args = {
        "prompt": PROMPT,
        "image_urls": [img1, img2],
        "video_urls": [vid1],
        "duration": "10",
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "generate_audio": False,
    }

    print(f"\n[CALL] {endpoint}")
    print(f"       prompt: {len(PROMPT)} chars")
    print(f"       duration=10s, 720p, 9:16")
    print(f"       estimated cost: ~$3.02\n", flush=True)

    t0 = time.time()
    result = fal_client.subscribe(
        endpoint, arguments=args, with_logs=True, on_queue_update=on_queue_update
    )
    elapsed = time.time() - t0
    print(f"\n[DONE] {elapsed:.1f}s")

    video_url = result.get("video", {}).get("url") if isinstance(result.get("video"), dict) else None
    if not video_url:
        print(f"[WARN] no video url in result: {result}")
        return

    import urllib.request
    out_path = OUT_DIR / f"test-choreography-v2-{int(t0)}.mp4"
    print(f"\n[DOWNLOAD] {video_url}")
    urllib.request.urlretrieve(video_url, out_path)
    print(f"[SAVED] {out_path} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    main()
