"""
warmap/github_geojson_fetcher.py — community front-line GeoJSON/KML fetcher. STUB / interface.

The OSINT community (GitHub, Discord) maintains daily-updated GeoJSON/KML control polygons
for major conflicts. Instead of scraping articles, fetch these directly: they give SURFACES
(control polygons that move) where ACLED gives POINTS (events). Complementary.

This session: STUB. Implement `fetch_control_geojson(repo_url_or_raw)` to download a raw
.geojson/.kml and normalize to per-state control (or to dated control snapshots feeding jalons).
Use as a 2nd source KIND in fact-check convergence (kind="github-geojson").
NO emojis (code file).
"""


def fetch_control_geojson(url):
    """STUB. Download + parse a community control GeoJSON/KML into dated control snapshots."""
    print(f"[github-geojson] STUB: would fetch {url}")
    return None
