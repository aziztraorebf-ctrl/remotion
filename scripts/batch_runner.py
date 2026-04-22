#!/usr/bin/env python3
"""
Batch runner for the video production pipeline.

Orchestrates parallel generation of independent actes, respects sequential
dependencies for chained clips within an acte, and sends SMS notifications
at each decision point.

This is the "brain" that connects:
- pipeline_gates.py (validation before API spend)
- notify.py (SMS alerts to your phone)
- ffmpeg (last-frame extraction for chained clips)

Usage:
    # Dry run (no API calls, no SMS, shows what would happen)
    python scripts/batch_runner.py --dry-run

    # Real run with a manifest file
    python scripts/batch_runner.py manifest.json
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from pipeline_gates import (
    GateResult,
    pre_seedance_check,
    pre_gemini_check,
    format_sms_alert,
)
from notify import (
    notify_gate_block,
    notify_review_ready,
    notify_batch_complete,
    send_sms,
)

# ---------------------------------------------------------------------------
# .env loading (for FAL_KEY, BLOB_READ_WRITE_TOKEN)
# ---------------------------------------------------------------------------

_env_file = Path(__file__).resolve().parent.parent / ".env"
if _env_file.exists():
    import os as _os
    for _line in _env_file.read_text().splitlines():
        _line = _line.strip()
        if not _line or _line.startswith("#") or "=" not in _line:
            continue
        _key, _, _val = _line.partition("=")
        _key, _val = _key.strip(), _val.strip()
        if _key and _val and _key not in _os.environ:
            _os.environ[_key] = _val

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MAX_PARALLEL_ACTES = 3  # Limit concurrent actes to control API spend

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------


@dataclass
class ClipTask:
    """A single clip to generate within an acte."""

    clip_id: str                          # e.g. "clip1", "clip2"
    clip_duration: float                  # seconds
    narration_duration: float             # seconds
    prompt: str = ""
    image_refs: list[str] = field(default_factory=list)
    character_name: str = ""
    character_ref_paths: list[str] = field(default_factory=list)
    has_environment: bool = True
    is_chained: bool = False              # depends on previous clip in this acte
    previous_clip_path: str | None = None
    # Outputs (filled during execution)
    output_path: str | None = None
    last_frame_path: str | None = None
    status: str = "pending"               # pending | gates_passed | gates_failed | generated | review_pending


@dataclass
class ActeTask:
    """An acte containing one or more clips."""

    acte_id: str                          # e.g. "acte1"
    short_name: str                       # e.g. "soundjata"
    clips: list[ClipTask] = field(default_factory=list)
    depends_on: list[str] = field(default_factory=list)  # other acte_ids
    is_remotion_pure: bool = False        # no Seedance needed
    status: str = "pending"               # pending | in_progress | done | blocked


# ---------------------------------------------------------------------------
# Last-frame extraction
# ---------------------------------------------------------------------------

def extract_last_frame(clip_path: str | Path) -> Path | None:
    """Extract the last frame of a video clip using ffmpeg.

    Saves as <clip_path>.last-frame.png alongside the clip.
    Returns the output path, or None on failure.
    """
    clip = Path(clip_path)
    if not clip.exists():
        print(f"  [extract] Clip not found: {clip}")
        return None

    output = clip.with_suffix(".last-frame.png")

    cmd = [
        "ffmpeg", "-y",
        "-sseof", "-0.1",
        "-i", str(clip),
        "-frames:v", "1",
        "-q:v", "2",
        str(output),
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode == 0 and output.exists():
            print(f"  [extract] Last frame saved: {output.name}")
            return output
        else:
            print(f"  [extract] ffmpeg failed: {result.stderr[:200]}")
            return None
    except (subprocess.TimeoutExpired, FileNotFoundError) as exc:
        print(f"  [extract] Error: {exc}")
        return None


# ---------------------------------------------------------------------------
# Seedance API integration
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_BASE = ROOT / "public" / "assets" / "library" / "geoafrique" / "heros-oublies"


def _call_seedance_api(acte: ActeTask, clip: ClipTask) -> bool:
    """Call Seedance 2.0 reference-to-video via fal.ai.

    Uploads image refs, submits generation, polls for completion,
    downloads the result. Sets clip.output_path on success.

    Returns True on success, False on failure.
    """
    import os

    fal_key = os.environ.get("FAL_KEY", "")
    if not fal_key:
        print("  [ERROR] FAL_KEY not set in environment")
        return False

    try:
        import fal_client
    except ImportError:
        print("  [ERROR] fal_client not installed. Run: pip install fal-client")
        return False

    # Resolve image ref paths to absolute
    image_paths = []
    for ref in clip.image_refs:
        p = Path(ref)
        if not p.is_absolute():
            p = ROOT / p
        if not p.exists():
            print(f"  [ERROR] Ref not found: {p}")
            return False
        image_paths.append(p)

    # Upload refs to fal.ai CDN
    print(f"  [API] Uploading {len(image_paths)} refs to fal.ai CDN...")
    ref_urls = []
    for p in image_paths:
        try:
            url = fal_client.upload_file(str(p))
            print(f"    {p.name} -> uploaded")
            ref_urls.append(url)
        except Exception as exc:
            print(f"  [ERROR] Upload failed for {p.name}: {exc}")
            return False

    # Determine clip duration (Seedance accepts string integer)
    duration_s = str(int(clip.clip_duration))

    # Submit
    print(f"  [API] Submitting to Seedance 2.0 ({duration_s}s, 9:16, 720p)...")
    args = {
        "prompt": clip.prompt,
        "reference_image_urls": ref_urls,
        "duration": duration_s,
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
    }

    try:
        handler = fal_client.submit(
            "bytedance/seedance-2.0/reference-to-video",
            arguments=args,
        )
        request_id = handler.request_id
        print(f"  [API] Request ID: {request_id}")
    except Exception as exc:
        print(f"  [ERROR] Submit failed: {exc}")
        return False

    # Poll for completion
    print(f"  [API] Polling...")
    start = time.time()
    last_status = ""
    while True:
        try:
            status = fal_client.status(
                "bytedance/seedance-2.0/reference-to-video",
                request_id,
                with_logs=False,
            )
            elapsed = int(time.time() - start)
            status_name = type(status).__name__
            if status_name != last_status:
                print(f"    [{elapsed}s] {status_name}")
                last_status = status_name
            if status_name == "Completed":
                break
            if elapsed > 600:
                print("  [ERROR] Timeout after 10 min")
                return False
            time.sleep(5)
        except Exception as exc:
            print(f"  [ERROR] Poll failed: {exc}")
            return False

    # Get result
    try:
        result = fal_client.result(
            "bytedance/seedance-2.0/reference-to-video",
            request_id,
        )
    except Exception as exc:
        print(f"  [ERROR] Result fetch failed: {exc}")
        return False

    video_url = result.get("video", {}).get("url", "")
    if not video_url:
        print("  [ERROR] No video URL in result")
        return False

    # Download
    output_dir = OUTPUT_BASE / acte.short_name / "clips-validated"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{acte.acte_id}-{clip.clip_id}-auto.mp4"

    print(f"  [API] Downloading to {output_path.name}...")
    import urllib.request
    try:
        urllib.request.urlretrieve(video_url, str(output_path))
    except Exception as exc:
        print(f"  [ERROR] Download failed: {exc}")
        return False

    # Save metadata
    meta = {
        "request_id": request_id,
        "seed": result.get("seed"),
        "video_url": video_url,
        "file_size": result.get("video", {}).get("file_size"),
        "duration_s": int(clip.clip_duration),
        "cost_estimate_usd": round(clip.clip_duration * 0.30, 2),
    }
    meta_path = output_path.with_suffix(".meta.json")
    meta_path.write_text(json.dumps(meta, indent=2))

    clip.output_path = str(output_path)
    file_size_mb = output_path.stat().st_size / 1024 / 1024
    print(f"  [API] DONE: {output_path.name} ({file_size_mb:.1f} MB)")
    return True


def _upload_to_vercel_blob(
    local_path: str | None,
    acte: ActeTask,
) -> str | None:
    """Upload a file to Vercel Blob for mobile review.

    Returns the public URL, or None if upload fails or is not configured.
    """
    import os

    if not local_path or not Path(local_path).exists():
        return None

    token = os.environ.get("BLOB_READ_WRITE_TOKEN", "")
    if not token:
        print("  [BLOB] BLOB_READ_WRITE_TOKEN not set — skipping upload")
        return None

    filename = Path(local_path).name
    blob_path = f"renders/{acte.short_name}/{filename}"

    import urllib.request
    import urllib.error

    try:
        with open(local_path, "rb") as f:
            data = f.read()

        req = urllib.request.Request(
            f"https://blob.vercel-storage.com/{blob_path}",
            data=data,
            headers={
                "Authorization": f"Bearer {token}",
                "x-api-version": "7",
                "Content-Type": "video/mp4",
                "x-content-type": "video/mp4",
            },
            method="PUT",
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            url = result.get("url", "")
            print(f"  [BLOB] Uploaded: {url}")
            return url

    except (urllib.error.URLError, TimeoutError, Exception) as exc:
        print(f"  [BLOB] Upload failed: {exc}")
        return None


# ---------------------------------------------------------------------------
# Single acte processor
# ---------------------------------------------------------------------------

def process_acte(acte: ActeTask, dry_run: bool = False) -> ActeTask:
    """Process all clips in an acte sequentially (for chain continuity).

    For each clip:
    1. Run gates
    2. If gates pass and not dry_run: would call Seedance API (placeholder)
    3. Extract last frame if chained
    4. Send SMS notification
    """

    print(f"\n{'='*50}")
    print(f"Processing: {acte.short_name} / {acte.acte_id} ({len(acte.clips)} clip(s))")
    print(f"{'='*50}")

    # Skip already-validated actes and Remotion-pure actes (no Seedance needed)
    if acte.is_remotion_pure or not acte.clips:
        print(f"  [SKIP] {'Remotion pure' if acte.is_remotion_pure else 'No clips to generate'} — already done")
        acte.status = "done"
        return acte

    acte.status = "in_progress"

    for i, clip in enumerate(acte.clips):
        print(f"\n  --- {acte.acte_id}/{clip.clip_id} ---")

        # Wire up chain dependency from previous clip
        if clip.is_chained and i > 0:
            prev_clip = acte.clips[i - 1]
            clip.previous_clip_path = prev_clip.output_path

        # Build gate config
        config: dict[str, Any] = {
            "prompt": clip.prompt,
            "image_refs": clip.image_refs,
            "clip_duration": clip.clip_duration,
            "narration_duration": clip.narration_duration,
            "character_name": clip.character_name,
            "character_ref_paths": clip.character_ref_paths,
            "has_environment": clip.has_environment,
            "is_chained": clip.is_chained,
            "previous_clip_path": clip.previous_clip_path,
        }

        # Run gates
        passed, results = pre_seedance_check(config)

        for r in results:
            print(f"    {r}")

        if not passed:
            clip.status = "gates_failed"
            failures = [r.reason for r in results if not r.passed]
            print(f"\n  BLOCKED - {len(failures)} gate(s) failed")

            if not dry_run:
                notify_gate_block(acte.short_name, acte.acte_id, failures)

            # Block the entire acte if any clip fails
            acte.status = "blocked"
            return acte

        clip.status = "gates_passed"
        print(f"\n  All gates passed")

        if dry_run:
            print(f"  [DRY RUN] Would call Seedance API here")
            print(f"  [DRY RUN] Would upload to Vercel Blob")
            print(f"  [DRY RUN] Would send review SMS")
            clip.status = "review_pending"
            clip.output_path = f"/tmp/dry-run-{acte.acte_id}-{clip.clip_id}.mp4"
        else:
            generated = _call_seedance_api(acte, clip)
            if not generated:
                clip.status = "gates_failed"
                acte.status = "blocked"
                notify_gate_block(acte.short_name, acte.acte_id, ["Seedance API call failed"])
                return acte

            clip.status = "review_pending"

            # Upload to Vercel Blob for mobile review
            blob_url = _upload_to_vercel_blob(clip.output_path, acte)
            if blob_url:
                notify_review_ready(
                    acte.short_name,
                    acte.acte_id,
                    f"clip {clip.clip_id}",
                    url=blob_url,
                    gates_summary=f"{len(results)}/{len(results)} passed",
                )

        # Extract last frame for potential chaining
        if clip.output_path and Path(clip.output_path).exists():
            last_frame = extract_last_frame(clip.output_path)
            if last_frame:
                clip.last_frame_path = str(last_frame)

    acte.status = "done"
    return acte


# ---------------------------------------------------------------------------
# Batch orchestrator
# ---------------------------------------------------------------------------

def resolve_execution_order(actes: list[ActeTask]) -> list[list[ActeTask]]:
    """Resolve actes into parallel batches based on dependencies.

    Returns a list of batches. Each batch contains actes that can run
    in parallel. Batches are executed sequentially.
    """

    completed: set[str] = set()
    remaining = {a.acte_id: a for a in actes}
    batches: list[list[ActeTask]] = []

    while remaining:
        # Find actes whose dependencies are all completed
        ready = [
            a for a in remaining.values()
            if all(dep in completed for dep in a.depends_on)
        ]

        if not ready:
            # Deadlock -- remaining actes have unresolvable dependencies
            stuck = list(remaining.keys())
            print(f"\n[WARN] Unresolvable dependencies for: {stuck}")
            # Force them into a final batch
            batches.append(list(remaining.values()))
            break

        batches.append(ready)
        for a in ready:
            completed.add(a.acte_id)
            del remaining[a.acte_id]

    return batches


def run_batch(
    actes: list[ActeTask],
    dry_run: bool = False,
    max_parallel: int = MAX_PARALLEL_ACTES,
) -> dict[str, str]:
    """Run a list of independent actes in parallel.

    Returns a dict of {acte_id: status}.
    """

    results: dict[str, str] = {}

    if len(actes) == 1 or max_parallel == 1:
        # Sequential fallback
        for acte in actes:
            processed = process_acte(acte, dry_run=dry_run)
            results[processed.acte_id] = processed.status
    else:
        # Parallel execution
        with ThreadPoolExecutor(max_workers=min(len(actes), max_parallel)) as executor:
            futures = {
                executor.submit(process_acte, acte, dry_run): acte.acte_id
                for acte in actes
            }
            for future in as_completed(futures):
                acte_id = futures[future]
                try:
                    processed = future.result()
                    results[processed.acte_id] = processed.status
                except Exception as exc:
                    print(f"\n[ERROR] {acte_id} raised: {exc}")
                    results[acte_id] = "error"

    return results


def run_pipeline(
    actes: list[ActeTask],
    dry_run: bool = False,
    max_parallel: int = MAX_PARALLEL_ACTES,
) -> None:
    """Run the full pipeline: resolve order, execute batches, notify."""

    short_name = actes[0].short_name if actes else "unknown"

    print(f"\n{'#'*60}")
    print(f"  PIPELINE START: {short_name}")
    print(f"  Actes: {len(actes)} | Dry run: {dry_run} | Max parallel: {max_parallel}")
    print(f"{'#'*60}")

    batches = resolve_execution_order(actes)
    print(f"\n  Resolved into {len(batches)} batch(es):")
    for i, batch in enumerate(batches):
        ids = [a.acte_id for a in batch]
        print(f"    Batch {i+1}: {ids} (parallel)")

    all_done: list[str] = []
    all_blocked: list[str] = []

    for i, batch in enumerate(batches):
        print(f"\n{'='*60}")
        print(f"  BATCH {i+1}/{len(batches)}")
        print(f"{'='*60}")

        # Check if any batch dependency is blocked
        blocked_deps = [
            a for a in batch
            if any(dep in all_blocked for dep in a.depends_on)
        ]
        for a in blocked_deps:
            print(f"\n  [SKIP] {a.acte_id} -- dependency blocked")
            a.status = "blocked"
            all_blocked.append(a.acte_id)

        runnable = [a for a in batch if a not in blocked_deps]

        if not runnable:
            continue

        results = run_batch(runnable, dry_run=dry_run, max_parallel=max_parallel)

        for acte_id, status in results.items():
            if status == "done":
                all_done.append(acte_id)
            else:
                all_blocked.append(acte_id)

    # Final summary
    print(f"\n{'#'*60}")
    print(f"  PIPELINE COMPLETE: {short_name}")
    print(f"  Done: {all_done}")
    print(f"  Blocked: {all_blocked}")
    print(f"  Score: {len(all_done)}/{len(actes)}")
    print(f"{'#'*60}")

    # Send batch summary SMS
    if not dry_run:
        notify_batch_complete(short_name, all_done, all_blocked)


# ---------------------------------------------------------------------------
# Manifest loader
# ---------------------------------------------------------------------------

def load_manifest(path: str | Path) -> list[ActeTask]:
    """Load acte definitions from a JSON manifest file.

    Expected format:
    {
        "short_name": "soundjata",
        "actes": [
            {
                "acte_id": "acte1",
                "depends_on": [],
                "clips": [
                    {
                        "clip_id": "clip1",
                        "clip_duration": 13.0,
                        "narration_duration": 12.1,
                        "prompt": "...",
                        "image_refs": ["path/to/ref1.png"],
                        "character_name": "soundjata",
                        "is_chained": false
                    }
                ]
            }
        ]
    }
    """
    data = json.loads(Path(path).read_text())
    short_name = data["short_name"]
    actes = []

    for acte_data in data["actes"]:
        clips = []
        for clip_data in acte_data.get("clips", []):
            clips.append(ClipTask(
                clip_id=clip_data["clip_id"],
                clip_duration=clip_data.get("clip_duration", 0.0),
                narration_duration=clip_data.get("narration_duration", 0.0),
                prompt=clip_data.get("prompt", ""),
                image_refs=clip_data.get("image_refs", []),
                character_name=clip_data.get("character_name", ""),
                character_ref_paths=clip_data.get("character_ref_paths", []),
                has_environment=clip_data.get("has_environment", True),
                is_chained=clip_data.get("is_chained", False),
            ))

        # Determine if this acte should be skipped
        acte_status = acte_data.get("status", "")
        acte_type = acte_data.get("type", "")
        is_already_done = acte_status == "validated"
        is_remotion = acte_type == "remotion_pure" or acte_data.get("is_remotion_pure", False)

        actes.append(ActeTask(
            acte_id=acte_data["acte_id"],
            short_name=short_name,
            clips=clips if not is_already_done else [],
            depends_on=acte_data.get("depends_on", []),
            is_remotion_pure=is_remotion or is_already_done,
        ))

    return actes


# ---------------------------------------------------------------------------
# Demo manifest (for testing)
# ---------------------------------------------------------------------------

def _build_demo_actes() -> list[ActeTask]:
    """Build a demo pipeline mimicking the Soundjata structure."""

    style = (
        "2D vivid flat anime illustration, painted graphic novel, "
        "bold clean outlines, cel-shaded flat colors."
    )
    anti = "RIGID body proportions throughout. No morphing, no deformation. Maintain proportions."

    def make_prompt(shots: list[str]) -> str:
        return "\n\n".join([style, anti] + shots)

    shot_template = (
        "SECONDS {start} TO {end}: {desc} Camera tracks smoothly. "
        "Golden dust particles catch afternoon light. Warriors move with "
        "purpose across the laterite plains. Bold outlines frame every figure. "
        "Color grade: warm amber versus deep indigo shadow. Cel-shaded flat "
        "colors maintain graphic novel feel throughout. Environment: sub-Saharan "
        "savanna with scattered baobabs and tall golden grass."
    )

    return [
        ActeTask(
            acte_id="acte1",
            short_name="soundjata",
            clips=[ClipTask(
                clip_id="clip1",
                clip_duration=13.0,
                narration_duration=12.1,
                prompt=make_prompt([
                    shot_template.format(start=0, end=4, desc="Wide aerial establishing shot of the kingdom."),
                    shot_template.format(start=4, end=8, desc="Medium shot of the tyrant king on his throne."),
                    shot_template.format(start=8, end=13, desc="Close-up of the prophet delivering the prophecy."),
                ]),
                image_refs=["refs/soundjata-enfant-ref.png", "refs/kingdom-env.png"],
                character_name="soundjata",
                has_environment=True,
            )],
        ),
        ActeTask(
            acte_id="acte2",
            short_name="soundjata",
            clips=[ClipTask(
                clip_id="clip1",
                clip_duration=10.0,
                narration_duration=9.5,
                prompt=make_prompt([
                    shot_template.format(start=0, end=3, desc="Wide shot of the village courtyard."),
                    shot_template.format(start=3, end=7, desc="Medium shot of the confrontation scene."),
                    shot_template.format(start=7, end=10, desc="Close reaction shot of humiliation."),
                ]),
                image_refs=["refs/soundjata-enfant-ref.png", "refs/village-env.png"],
                character_name="soundjata",
                has_environment=True,
            )],
        ),
        ActeTask(
            acte_id="acte3",
            short_name="soundjata",
            clips=[ClipTask(
                clip_id="clip1",
                clip_duration=15.0,
                narration_duration=14.2,
                prompt=make_prompt([
                    shot_template.format(start=0, end=5, desc="Medium shot of young Soundjata gripping the iron bar."),
                    shot_template.format(start=5, end=10, desc="Dramatic low-angle as he bends the bar and rises."),
                    shot_template.format(start=10, end=15, desc="Wide triumphant shot with the baobab in background."),
                ]),
                image_refs=["refs/soundjata-combat-ref.png", "refs/village-env.png"],
                character_name="soundjata",
                has_environment=True,
            )],
        ),
        # Acte 4 has 2 chained clips
        ActeTask(
            acte_id="acte4",
            short_name="soundjata",
            clips=[
                ClipTask(
                    clip_id="clip1",
                    clip_duration=15.0,
                    narration_duration=14.5,
                    prompt=make_prompt([
                        shot_template.format(start=0, end=5, desc="Wide shot of child exile walking away from the kingdom."),
                        shot_template.format(start=5, end=10, desc="Medium shot of warrior forging himself in Mema."),
                        shot_template.format(start=10, end=15, desc="Over-the-shoulder shot of messengers approaching."),
                    ]),
                    image_refs=["refs/soundjata-combat-ref.png", "refs/mema-env.png"],
                    character_name="soundjata",
                    has_environment=True,
                    is_chained=False,
                ),
                ClipTask(
                    clip_id="clip2",
                    clip_duration=5.0,
                    narration_duration=4.8,
                    prompt=make_prompt([
                        shot_template.format(start=0, end=2, desc="Medium tracking shot of warrior mounting his horse."),
                        shot_template.format(start=2, end=5, desc="Wide epic shot of cavalry riding toward sunrise."),
                    ]),
                    image_refs=["refs/soundjata-combat-ref.png", "refs/savanna-env.png"],
                    character_name="soundjata",
                    has_environment=True,
                    is_chained=True,  # depends on clip1's last frame
                ),
            ],
        ),
        # Assemblage depends on all actes
        ActeTask(
            acte_id="assemblage",
            short_name="soundjata",
            clips=[],  # Remotion pure, no Seedance clips
            depends_on=["acte1", "acte2", "acte3", "acte4"],
            is_remotion_pure=True,
        ),
    ]


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Batch runner for video production pipeline"
    )
    parser.add_argument(
        "manifest",
        nargs="?",
        default=None,
        help="Path to manifest.json (omit for demo)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate gates without calling APIs or sending SMS",
    )
    parser.add_argument(
        "--max-parallel",
        type=int,
        default=MAX_PARALLEL_ACTES,
        help=f"Max parallel actes (default: {MAX_PARALLEL_ACTES})",
    )
    args = parser.parse_args()

    if args.manifest:
        actes = load_manifest(args.manifest)
    else:
        print("[DEMO MODE] Using built-in Soundjata demo manifest")
        actes = _build_demo_actes()

    run_pipeline(actes, dry_run=args.dry_run, max_parallel=args.max_parallel)


if __name__ == "__main__":
    main()
