"""Sync dashboard scenes.json with actual asset files on disk.

Scans public/assets/thiaroye-1944/ and public/audio/thiaroye-1944/ to detect:
- Scene image sources (scene1-source-v*.png)
- Scene clip finals (sX-*.mp4)
- Updates data/scenes.json status field and paths

Usage:
  python3 thiaroye-v5-dashboard/scripts/sync-dashboard.py

Run whenever new assets are generated to keep dashboard in sync.
"""
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "thiaroye-v5-dashboard" / "data" / "scenes.json"
ASSETS_ROOT = ROOT / "public" / "assets" / "thiaroye-1944"


def find_latest_image(scene_dir: Path, scene_id: str) -> str | None:
    """Find the latest image source for a scene (highest version number)."""
    if not scene_dir.exists():
        return None
    candidates = sorted(
        scene_dir.glob(f"{scene_id}-source-v*.png"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    # Skip backups and archives
    for candidate in candidates:
        if "backup" in candidate.name or "archive" in candidate.name or "wrong" in candidate.name:
            continue
        rel = candidate.relative_to(ROOT).as_posix()
        return rel
    return None


def find_latest_clip(scene_id: str) -> tuple[str | None, float | None]:
    """Find the latest clip for a scene and its duration."""
    clips_dir = ASSETS_ROOT / "clips"
    if not clips_dir.exists():
        return None, None

    # Match patterns like s1-retour-v5.mp4, s3a-*.mp4, etc.
    base_id = scene_id.replace("scene", "s")
    candidates = sorted(
        clips_dir.glob(f"{base_id}-*.mp4"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    for candidate in candidates:
        if "archive" in candidate.name:
            continue
        rel = candidate.relative_to(ROOT).as_posix()
        # Get duration via ffprobe if available
        duration = None
        try:
            import subprocess
            out = subprocess.run(
                ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                 "-of", "default=noprint_wrappers=1:nokey=1", str(candidate)],
                capture_output=True, text=True,
            )
            if out.returncode == 0:
                duration = float(out.stdout.strip())
        except Exception:
            pass
        return rel, duration
    return None, None


def determine_status(scene: dict) -> str:
    """Determine scene status based on assets present."""
    has_image = bool(scene.get("image_source"))
    has_clip = bool(scene.get("clip_final"))

    if scene.get("id") == "hook":
        # Hook is special — reuses scene2 last frame
        return "pending" if scene.get("status") == "pending" else scene.get("status", "pending")

    needs_complement = scene.get("clip_needs_complement", False)

    if has_clip:
        if needs_complement:
            return "partial_done"
        return "done"
    if has_image:
        return "todo"
    return "todo"


def sync():
    with open(DATA_FILE) as f:
        data = json.load(f)

    print(f"Syncing dashboard from {ASSETS_ROOT}")
    print(f"Scenes to check: {len(data['scenes'])}")
    print()

    changes = 0
    for scene in data["scenes"]:
        scene_id = scene["id"]

        # Skip hook (special case)
        if scene_id == "hook":
            continue

        # Check image source
        scene_dir = ASSETS_ROOT / scene_id
        latest_image = find_latest_image(scene_dir, scene_id)
        if latest_image and latest_image != scene.get("image_source"):
            print(f"  [{scene_id}] image updated: {latest_image}")
            scene["image_source"] = latest_image
            changes += 1

        # Check clip
        latest_clip, duration = find_latest_clip(scene_id)
        if latest_clip and latest_clip != scene.get("clip_final"):
            print(f"  [{scene_id}] clip updated: {latest_clip} ({duration:.2f}s)" if duration else f"  [{scene_id}] clip updated: {latest_clip}")
            scene["clip_final"] = latest_clip
            if duration:
                scene["clip_duration_s"] = round(duration, 2)
            changes += 1

        # Update status
        new_status = determine_status(scene)
        if new_status != scene.get("status"):
            print(f"  [{scene_id}] status: {scene.get('status')} -> {new_status}")
            scene["status"] = new_status
            changes += 1

    # Update last_updated
    from datetime import date
    data["last_updated"] = date.today().isoformat()

    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print()
    print(f"Sync complete: {changes} change(s) applied.")
    print(f"Dashboard: {DATA_FILE}")


if __name__ == "__main__":
    sync()
