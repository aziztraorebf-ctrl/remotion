"""Mini-test V2 hybride: Mapbox Static Images satellite tilted + parchment overlay.

Generates 1 tilted satellite view of West Africa at zoom 4, pitch 60.
Output: PNG ready for Remotion compositing test.
Cost: $0 (Mapbox Static Images free <= 50k req/month).
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import requests

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "quebec-jacques-poc" / ".env")
load_dotenv(ROOT / ".env")

TOKEN = os.environ.get("REMOTION_MAPBOX_TOKEN") or os.environ.get("MAPBOX_TOKEN")
if not TOKEN:
    print("ERROR: no Mapbox token found in .env")
    sys.exit(1)

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "v2" / "satellite"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# West Africa center: roughly Mali + Sahel + Atlantic + Niger river
# lon=-5, lat=15 = central Mali (Niger river bend area)
LON = -5.0
LAT = 15.0
ZOOM = 3.5
BEARING = 0
PITCH = 60
WIDTH = 720
HEIGHT = 1280

STYLE = "satellite-v9"

URL = (
    f"https://api.mapbox.com/styles/v1/mapbox/{STYLE}/static/"
    f"{LON},{LAT},{ZOOM},{BEARING},{PITCH}/"
    f"{WIDTH}x{HEIGHT}@2x"
    f"?access_token={TOKEN}"
)

OUT_FILE = OUT_DIR / "test-westafrica-tilted.png"

print(f"Mapbox Static Images request:")
print(f"  Style: {STYLE}")
print(f"  Center: lon={LON} lat={LAT}")
print(f"  Zoom: {ZOOM}, Bearing: {BEARING}, Pitch: {PITCH}")
print(f"  Size: {WIDTH}x{HEIGHT}@2x")
print(f"  Output: {OUT_FILE}")
print()

r = requests.get(URL, timeout=60)
print(f"HTTP {r.status_code}")
if r.status_code != 200:
    print(f"ERROR body: {r.text[:500]}")
    sys.exit(1)

OUT_FILE.write_bytes(r.content)
print(f"OK saved: {OUT_FILE} ({len(r.content)/1024:.1f} KB)")
