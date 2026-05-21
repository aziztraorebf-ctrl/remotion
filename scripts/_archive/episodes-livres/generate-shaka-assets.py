"""Generate Shaka Zulu pixel art assets for Atlas video.

Assets to generate:
  1. shaka-static.png        - Shaka portrait (royal stance, assegai + shield)
  2. zulu-warrior-static.png - Generic Zulu warrior
  3. Walk cycle E+W          - shaka-walk-east/, shaka-walk-west/
  4. Walk cycle E+W          - warrior-walk-east/, warrior-walk-west/
  5. Lance levee / war cry   - shaka-warcry/, warrior-warcry/
  6. Attaque (frappe)        - warrior-attack/
  7. Posture royale statique - shaka-royal/ (for CTA)

All output in: public/atlas-shaka-zulu/assets/
Credits used: ~14 (6 animate + 2 static + 6 walk frames x2)
"""
import os
import sys
import time
import json
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

sys.path.insert(0, str(ROOT))

try:
    from pixellab import Client
    from pixellab.generate_image_pixflux import generate_image_pixflux
except ImportError:
    print("ERROR: pixellab SDK not found. Run: pip install pixellab")
    sys.exit(1)

API_KEY = os.getenv("PIXELLAB_API_KEY")
if not API_KEY:
    print("ERROR: PIXELLAB_API_KEY missing from .env")
    sys.exit(1)

client = Client(secret=API_KEY)

OUT_DIR = ROOT / "public" / "atlas-shaka-zulu" / "assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)

LOG_FILE = OUT_DIR / "generation-log.json"
log_entries = []


def save_log():
    with open(LOG_FILE, "w") as f:
        json.dump(log_entries, f, indent=2)


def log(msg):
    ts = time.strftime("%H:%M:%S")
    print(f"[{ts}] {msg}")
    log_entries.append({"time": ts, "msg": msg})
    save_log()


# === 1. Static sprites ===

STATIC_ASSETS = [
    {
        "id": "shaka-static",
        "filename": "shaka-static.png",
        "prompt": (
            "Shaka Zulu, 19th century Zulu king, adult male, dark skin, "
            "muscular build, wearing traditional Zulu warrior regalia, "
            "leopard skin headband, feather headdress, carrying large cowhide shield "
            "and short assegai spear (iklwa), standing proud upright royal stance, "
            "pixel art, side view, 128x128, transparent background, "
            "no text, no shadow"
        ),
        "size": 128,
    },
    {
        "id": "warrior-static",
        "filename": "zulu-warrior-static.png",
        "prompt": (
            "Zulu warrior, 19th century, adult male, dark skin, muscular build, "
            "wearing traditional Zulu regalia, cowhide shield, short iklwa spear, "
            "izicwe headring (married warrior), combat ready stance, "
            "pixel art, side view, 128x128, transparent background, "
            "no text, no shadow"
        ),
        "size": 128,
    },
]

# === 2. Walk cycle definitions ===
# Generated frame by frame via generate_image_pixflux (no subscription needed)

WALK_PROMPTS = {
    "shaka-walk-east": {
        "base": (
            "Shaka Zulu, adult male, dark skin, Zulu king regalia, feather headdress, "
            "cowhide shield, iklwa spear, walking east rightward, "
            "pixel art, side view facing right, 128x128, transparent background"
        ),
        "frames": 6,
        "subfolder": "shaka-walk-east",
    },
    "warrior-walk-east": {
        "base": (
            "Zulu warrior, adult male, dark skin, cowhide shield, iklwa spear, "
            "walking east rightward, determined march, "
            "pixel art, side view facing right, 128x128, transparent background"
        ),
        "frames": 6,
        "subfolder": "warrior-walk-east",
    },
}

# === 3. Action animations ===

ACTION_PROMPTS = {
    "shaka-warcry": {
        "base": (
            "Shaka Zulu, adult male, dark skin, Zulu king regalia, feather headdress, "
            "raising iklwa spear high above head, mouth open war cry, "
            "dramatic pose, pixel art, side view, 128x128, transparent background"
        ),
        "frames": 4,
        "subfolder": "shaka-warcry",
    },
    "warrior-warcry": {
        "base": (
            "Zulu warrior, adult male, dark skin, cowhide shield raised, "
            "iklwa spear thrust forward, war cry battle pose, "
            "pixel art, side view, 128x128, transparent background"
        ),
        "frames": 4,
        "subfolder": "warrior-warcry",
    },
    "warrior-attack": {
        "base": (
            "Zulu warrior, adult male, dark skin, mid-strike attacking pose, "
            "iklwa spear thrusting forward, shield pushed out, "
            "dynamic action frame, pixel art, side view, 128x128, transparent background"
        ),
        "frames": 4,
        "subfolder": "warrior-attack",
    },
    "shaka-royal": {
        "base": (
            "Shaka Zulu, adult male, dark skin, Zulu king, "
            "standing tall proud frontal pose, arms crossed or at sides, "
            "full regalia, commanding presence, "
            "pixel art, front view, 128x128, transparent background"
        ),
        "frames": 1,
        "subfolder": "shaka-royal",
    },
}


def generate_static(asset):
    out_path = OUT_DIR / asset["filename"]
    if out_path.exists():
        log(f"SKIP {asset['id']} - already exists")
        return

    log(f"Generating static: {asset['id']}...")
    try:
        result = generate_image_pixflux(
            client=client,
            description=asset["prompt"],
            image_size={"width": asset["size"], "height": asset["size"]},
            no_background=True,
        )
        img = result.image.pil_image()
        img.save(str(out_path))
        log(f"  Saved: {out_path.name} ({img.size[0]}x{img.size[1]})")
    except Exception as e:
        log(f"  ERROR {asset['id']}: {e}")


def generate_animation_frames(anim_id, config):
    subfolder = OUT_DIR / config["subfolder"]
    subfolder.mkdir(parents=True, exist_ok=True)

    for i in range(config["frames"]):
        frame_path = subfolder / f"frame_{str(i).zfill(3)}.png"
        if frame_path.exists():
            log(f"  SKIP frame_{i:03d} - already exists")
            continue

        walk_phases = [
            "right foot forward mid-stride",
            "both feet together upright",
            "left foot forward mid-stride",
            "both feet together upright",
            "right foot forward arms swinging",
            "left foot back push-off",
        ]

        if config["frames"] == 6:
            phase = walk_phases[i % 6]
            prompt = f"{config['base']}, walk cycle frame {i+1} of 6, {phase}"
        elif config["frames"] == 4:
            action_phases = ["pose start", "mid action", "peak action", "return"]
            phase = action_phases[i % 4]
            prompt = f"{config['base']}, animation frame {i+1} of 4, {phase}"
        else:
            prompt = config["base"]

        log(f"  Frame {i+1}/{config['frames']} [{anim_id}]...")
        try:
            result = generate_image_pixflux(
                client=client,
                description=prompt,
                image_size={"width": 128, "height": 128},
                no_background=True,
            )
            img = result.image.pil_image()
            img.save(str(frame_path))
            log(f"    Saved frame_{i:03d}.png ({img.size[0]}x{img.size[1]})")
            time.sleep(1.5)
        except Exception as e:
            log(f"    ERROR frame_{i}: {e}")


def main():
    log("=== Shaka Zulu PixelLab Asset Generation ===")
    log(f"Output dir: {OUT_DIR}")

    log("\n--- Phase 1: Static sprites ---")
    for asset in STATIC_ASSETS:
        generate_static(asset)
        time.sleep(2)

    log("\n--- Phase 2: Walk cycles ---")
    for anim_id, config in WALK_PROMPTS.items():
        log(f"Generating walk cycle: {anim_id} ({config['frames']} frames)...")
        generate_animation_frames(anim_id, config)
        time.sleep(2)

    log("\n--- Phase 3: Action animations ---")
    for anim_id, config in ACTION_PROMPTS.items():
        log(f"Generating action: {anim_id} ({config['frames']} frames)...")
        generate_animation_frames(anim_id, config)
        time.sleep(2)

    log("\n=== GENERATION COMPLETE ===")
    log(f"Assets saved to: {OUT_DIR}")
    log(f"Log: {LOG_FILE}")


if __name__ == "__main__":
    main()
