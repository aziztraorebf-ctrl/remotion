#!/usr/bin/env python3
"""
CAPTURE MAPBOX STUDIO — Export WebGL compositions to MP4

WHY: Mapbox uses WebGL → cannot render headless via CLI (black screen).
     This script captures Remotion Studio frame-by-frame via Playwright.

REQUIREMENTS:
  pip install playwright
  python -m playwright install chromium
  Remotion Studio must be running: npx remotion studio

USAGE:
  python3 scripts/capture-mapbox-studio.py --comp MapboxGhanaHighlight --frames 180 --fps 30 --out out/mapbox-ghana.mp4
  python3 scripts/capture-mapbox-studio.py --comp MapboxTypeBVertical --frames 870 --fps 30 --out out/typeb.mp4 --width 1080 --height 1920

SPEED: ~1-3s per frame depending on WebGL complexity. 180 frames ≈ 3-9 minutes.

NOTE: headless=False required for WebGL. A browser window will open during capture.

INTERNALS (how frame control works):
  - Remotion Studio uses React Router: navigating to /<compositionId> loads the comp.
  - The frame input has className "__remotion_input_dragger" — we fill it + press Enter.
  - Fallback: Remotion exposes Internals.timeValueRef.current.seek(n) in the React tree,
    accessible via window.__remotionSeek injected by this script.
  - Preview canvas is captured via screenshot of the composition player area,
    identified by finding the largest canvas element on screen.
"""

import argparse
import asyncio
import os
import subprocess
import sys
import time
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("Installing playwright...")
    subprocess.run([sys.executable, "-m", "pip", "install", "playwright"], check=True)
    subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"], check=True)
    from playwright.async_api import async_playwright


STUDIO_URL = "http://localhost:3000"
FRAMES_DIR = Path("/tmp/remotion_frames")

# JS snippet injected once to wire up a reliable seek function.
# It polls for the Remotion internals ref and exposes window.__remotionSeek(n).
INJECT_SEEK_JS = """
(function installSeek() {
  if (window.__remotionSeek) return 'already_installed';

  // Strategy A: hunt for the timeValueRef via React fiber tree
  function findSeekInFiber(root) {
    if (!root) return null;
    if (root.memoizedState) {
      // look for the imperative handle that has .seek
      let state = root.memoizedState;
      while (state) {
        if (state.memoizedState &&
            typeof state.memoizedState === 'object' &&
            typeof state.memoizedState.seek === 'function') {
          return state.memoizedState.seek;
        }
        state = state.next;
      }
    }
    // recurse into children
    if (root.child) {
      const found = findSeekInFiber(root.child);
      if (found) return found;
    }
    if (root.sibling) {
      const found = findSeekInFiber(root.sibling);
      if (found) return found;
    }
    return null;
  }

  function tryInstallViaFiber() {
    const root = document.getElementById('remotion-canvas') ||
                 document.querySelector('[class*="remotion"]') ||
                 document.body;
    if (!root) return false;
    const fiber = root._reactFiber || root.__reactFiber || root._reactInternals ||
                  root.__reactInternals ||
                  Object.keys(root).find(k => k.startsWith('__reactFiber'));
    const fiberNode = typeof fiber === 'string' ? root[fiber] : fiber;
    if (!fiberNode) return false;
    const seek = findSeekInFiber(fiberNode);
    if (seek) {
      window.__remotionSeek = seek;
      return true;
    }
    return false;
  }

  tryInstallViaFiber();
  return window.__remotionSeek ? 'installed_via_fiber' : 'fiber_failed';
})();
"""

# JS: fill the visible frame input and press Enter (most reliable method)
SEEK_VIA_INPUT_JS = """
(function seekViaInput(frameNum) {
  // Find the InputDragger used for frame navigation (has class __remotion_input_dragger)
  // There may be several — the one in the timeline area is the frame counter
  const inputs = Array.from(document.querySelectorAll('input.__remotion_input_dragger, input[class*="remotion_input"]'));

  // Prefer the one that currently shows a frame number (numeric value)
  let target = null;
  for (const inp of inputs) {
    const val = parseInt(inp.value, 10);
    if (!isNaN(val) && val >= 0) {
      target = inp;
      break;
    }
  }

  if (!target && inputs.length > 0) {
    target = inputs[0];
  }

  if (!target) return 'no_input_found';

  // Use native input value setter so React picks up the change
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(target, String(frameNum));
  target.dispatchEvent(new Event('input', { bubbles: true }));
  target.dispatchEvent(new Event('change', { bubbles: true }));

  // Also press Enter to confirm
  target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
  target.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));

  return 'ok:' + target.value;
})(%d);
"""

# JS: find the best canvas element for screenshot (largest non-UI one)
FIND_CANVAS_JS = """
(function() {
  const canvases = Array.from(document.querySelectorAll('canvas'));
  if (!canvases.length) return null;
  // Return bounding rect of the largest canvas
  let best = null;
  let bestArea = 0;
  for (const c of canvases) {
    const r = c.getBoundingClientRect();
    const area = r.width * r.height;
    if (area > bestArea) {
      bestArea = area;
      best = r;
    }
  }
  return best ? {x: best.left, y: best.top, width: best.width, height: best.height} : null;
})();
"""


async def wait_for_studio(page, timeout_s=30):
    """Wait until the Remotion Studio has finished loading."""
    print("Waiting for Remotion Studio to be ready...")
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            result = await page.evaluate("typeof window.remotion_finishedBuilding")
            if result != "undefined":
                break
        except Exception:
            pass
        await asyncio.sleep(0.5)
    # Extra buffer for React hydration
    await asyncio.sleep(1.5)


async def navigate_to_composition(page, comp_id):
    """Navigate to the target composition in the Studio."""
    # Remotion Studio uses SPA routing: /<compositionId> shows that comp
    target_url = f"{STUDIO_URL}/{comp_id}"
    print(f"Navigating to: {target_url}")
    await page.goto(target_url, wait_until="domcontentloaded")
    await asyncio.sleep(2)

    # Try injecting the fiber-based seek helper (best-effort; input method is primary)
    try:
        result = await page.evaluate(INJECT_SEEK_JS)
        print(f"  Fiber seek injection: {result}")
    except Exception as e:
        print(f"  Fiber seek injection skipped: {e}")


async def seek_to_frame(page, frame_num):
    """Set the Studio to a specific frame using the best available method."""
    # Method 1: window.__remotionSeek (fiber-based, fastest)
    try:
        result = await page.evaluate(f"window.__remotionSeek && window.__remotionSeek({frame_num})")
        if result is not None:
            return
    except Exception:
        pass

    # Method 2: fill the frame input in the Studio timeline
    try:
        result = await page.evaluate(SEEK_VIA_INPUT_JS % frame_num)
        if result and result.startswith("ok:"):
            return
    except Exception:
        pass

    # Method 3: keyboard shortcut — press 'g', type frame number, Enter
    try:
        await page.keyboard.press("g")
        await asyncio.sleep(0.1)
        await page.keyboard.type(str(frame_num))
        await page.keyboard.press("Enter")
        await asyncio.sleep(0.1)
    except Exception:
        pass


async def take_frame_screenshot(page, frame_path, width, height):
    """Screenshot the composition preview area."""
    # Try to find the main canvas (Mapbox WebGL renders here)
    try:
        canvas_rect = await page.evaluate(FIND_CANVAS_JS)
        if canvas_rect and canvas_rect["width"] > 100 and canvas_rect["height"] > 100:
            await page.screenshot(
                path=str(frame_path),
                clip={
                    "x": canvas_rect["x"],
                    "y": canvas_rect["y"],
                    "width": canvas_rect["width"],
                    "height": canvas_rect["height"],
                },
            )
            return
    except Exception:
        pass

    # Fallback: screenshot the full viewport and crop to requested dimensions
    await page.screenshot(
        path=str(frame_path),
        clip={"x": 0, "y": 0, "width": width, "height": height},
    )


def assemble_mp4(frames_dir, fps, output, width, height):
    """Use ffmpeg to assemble frames into an MP4."""
    out_dir = os.path.dirname(output)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    cmd = [
        "ffmpeg",
        "-y",
        "-r", str(fps),
        "-i", str(frames_dir / "frame_%05d.png"),
        "-vf", f"scale={width}:{height}:flags=lanczos",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "slow",
        output,
    ]
    print(f"\nAssembling MP4 with ffmpeg...")
    print("  " + " ".join(cmd))
    subprocess.run(cmd, check=True)
    print(f"\nDone: {output}")

    size_mb = os.path.getsize(output) / (1024 * 1024)
    print(f"Output size: {size_mb:.1f} MB")


async def capture_composition(
    comp_id,
    total_frames,
    fps,
    output,
    width=1920,
    height=1080,
    warmup_frames=3,
    frame_settle_ms=80,
):
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)

    # Clean up previous frames
    for f in FRAMES_DIR.glob("frame_*.png"):
        f.unlink()

    print(f"\n{'='*60}")
    print(f"Composition : {comp_id}")
    print(f"Frames      : {total_frames} @ {fps}fps")
    print(f"Resolution  : {width}x{height}")
    print(f"Output      : {output}")
    print(f"Frames dir  : {FRAMES_DIR}")
    print(f"{'='*60}\n")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,  # REQUIRED for WebGL/Mapbox to render correctly
            args=[
                "--use-gl=desktop",
                "--enable-webgl",
                "--enable-webgl2",
                "--ignore-gpu-blocklist",
                "--disable-gpu-sandbox",
                "--enable-gpu-rasterization",
                "--enable-zero-copy",
                f"--window-size={width + 300},{height + 200}",  # extra room for Studio chrome
            ],
        )

        context = await browser.new_context(
            viewport={"width": width + 300, "height": height + 200},
        )
        page = await context.new_page()

        # Load the Studio
        await page.goto(STUDIO_URL, wait_until="domcontentloaded")
        await wait_for_studio(page)

        # Navigate to our composition
        await navigate_to_composition(page, comp_id)

        # Warmup: seek back and forth a few times so Mapbox tiles are loaded
        print(f"Warming up ({warmup_frames} frames to pre-load WebGL resources)...")
        for wf in range(min(warmup_frames, total_frames)):
            await seek_to_frame(page, wf)
            await asyncio.sleep(0.2)

        print(f"\nCapturing {total_frames} frames...")
        t_start = time.time()

        for frame_num in range(total_frames):
            if frame_num % 30 == 0:
                elapsed = time.time() - t_start
                if frame_num > 0:
                    eta = elapsed / frame_num * (total_frames - frame_num)
                    print(
                        f"  Frame {frame_num:5d}/{total_frames}  "
                        f"({frame_num * 100 // total_frames}%)  "
                        f"ETA: {eta:.0f}s"
                    )
                else:
                    print(f"  Frame {frame_num:5d}/{total_frames}")

            await seek_to_frame(page, frame_num)
            # Wait for WebGL to finish rendering this frame
            await asyncio.sleep(frame_settle_ms / 1000)

            frame_path = FRAMES_DIR / f"frame_{frame_num:05d}.png"
            await take_frame_screenshot(page, frame_path, width, height)

        elapsed_total = time.time() - t_start
        print(
            f"\nCapture complete: {total_frames} frames in {elapsed_total:.1f}s "
            f"({elapsed_total / total_frames:.2f}s/frame)"
        )

        await browser.close()

    assemble_mp4(FRAMES_DIR, fps, output, width, height)


def main():
    parser = argparse.ArgumentParser(
        description="Capture Remotion Studio WebGL/Mapbox compositions to MP4 via Playwright"
    )
    parser.add_argument(
        "--comp",
        required=True,
        help="Composition ID as registered in Root.tsx (e.g. MapboxGhanaHighlight)",
    )
    parser.add_argument(
        "--frames",
        type=int,
        required=True,
        help="Total number of frames to capture",
    )
    parser.add_argument(
        "--fps",
        type=int,
        default=30,
        help="Frames per second for the output MP4 (default: 30)",
    )
    parser.add_argument(
        "--out",
        default="out/capture.mp4",
        help="Output MP4 path (default: out/capture.mp4)",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=1920,
        help="Composition width in pixels (default: 1920)",
    )
    parser.add_argument(
        "--height",
        type=int,
        default=1080,
        help="Composition height in pixels (default: 1080)",
    )
    parser.add_argument(
        "--settle-ms",
        type=int,
        default=80,
        dest="settle_ms",
        help="Milliseconds to wait after seeking before screenshot (default: 80). "
             "Increase if Mapbox tiles are not fully loaded (try 150-300 for complex maps).",
    )
    parser.add_argument(
        "--warmup",
        type=int,
        default=3,
        dest="warmup_frames",
        help="Number of warmup frames to pre-load WebGL resources (default: 3)",
    )

    args = parser.parse_args()

    asyncio.run(
        capture_composition(
            comp_id=args.comp,
            total_frames=args.frames,
            fps=args.fps,
            output=args.out,
            width=args.width,
            height=args.height,
            warmup_frames=args.warmup_frames,
            frame_settle_ms=args.settle_ms,
        )
    )


if __name__ == "__main__":
    main()
