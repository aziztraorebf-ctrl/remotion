"""
warmap/geo.py — pure-Python geo helpers (zero external deps).

point_in_polygon uses ray-casting so the pipeline runs in a plain `python3` call
(the Mapbox MCP point_in_polygon_tool is a planning-time convenience only, NOT a
runtime dependency). NO emojis (code file).
"""
import json
from functools import lru_cache
from .config import GEOJSON_SUDAN


@lru_cache(maxsize=4)
def load_geojson(path_str: str):
    with open(path_str, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _ring_contains(ring, lon, lat):
    """Ray-casting point-in-ring. ring = list of [lon, lat]."""
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        intersect = ((yi > lat) != (yj > lat)) and (
            lon < (xj - xi) * (lat - yi) / ((yj - yi) or 1e-12) + xi
        )
        if intersect:
            inside = not inside
        j = i
    return inside


def _polygon_contains(polygon, lon, lat):
    """polygon = [outer_ring, hole1, hole2, ...]. Inside outer and outside holes."""
    if not polygon:
        return False
    if not _ring_contains(polygon[0], lon, lat):
        return False
    for hole in polygon[1:]:
        if _ring_contains(hole, lon, lat):
            return False
    return True


def _feature_contains(feature, lon, lat):
    geom = feature.get("geometry") or {}
    gtype = geom.get("type")
    coords = geom.get("coordinates") or []
    if gtype == "Polygon":
        return _polygon_contains(coords, lon, lat)
    if gtype == "MultiPolygon":
        return any(_polygon_contains(poly, lon, lat) for poly in coords)
    return False


def point_in_state(lon, lat, geojson_path=None):
    """Return the state name (properties.name) containing (lon,lat), or None."""
    path_str = str(geojson_path or GEOJSON_SUDAN)
    data = load_geojson(path_str)
    for feat in data.get("features", []):
        if _feature_contains(feat, lon, lat):
            return (feat.get("properties") or {}).get("name")
    return None
