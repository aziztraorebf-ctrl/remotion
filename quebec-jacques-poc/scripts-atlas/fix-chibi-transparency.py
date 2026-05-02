"""Fix caravane chibi PNG: remove gray-checkered background, restore true transparency.

Gemini returned RGB instead of RGBA. We chroma-key the gray background
(detected as ~RGB(212,212,212) pattern) and produce a clean RGBA PNG.
"""
from PIL import Image
import sys

import sys
from pathlib import Path

# Process all 3 frames: A (original), B, C
SRC_DIR = Path("/Users/clawdbot/Workspace/remotion/quebec-jacques-poc/out/atlas-mansa-moussa/v2/chibi")
PUB_DIR = Path("/Users/clawdbot/Workspace/remotion/quebec-jacques-poc/public/atlas-mansa-moussa/v2/chibi")
PUB_DIR.mkdir(parents=True, exist_ok=True)

INPUTS = [
    ("caravane-chibi-transparent.png", "caravane-A.png"),
    ("caravane-B-walk-mid.png", "caravane-B.png"),
    ("caravane-C-walk-other.png", "caravane-C.png"),
]


def process(src_path: Path, dst_path: Path):
    print(f"\n=== {src_path.name} -> {dst_path.name} ===")
    im = Image.open(src_path).convert("RGBA")
    px = im.load()
    W, H = im.size
    removed = 0
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if abs(r - g) < 12 and abs(g - b) < 12 and abs(r - b) < 12 and r > 195:
                px[x, y] = (0, 0, 0, 0)
                removed += 1
    print(f"  Removed {removed} bg pixels ({100*removed/(W*H):.1f}%)")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(dst_path, optimize=True)
    print(f"  Saved {im.size} -> {dst_path}")


for src_name, dst_name in INPUTS:
    src = SRC_DIR / src_name
    dst = PUB_DIR / dst_name
    if not src.exists():
        print(f"SKIP {src_name} (not found)")
        continue
    process(src, dst)
