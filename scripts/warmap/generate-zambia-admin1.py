#!/usr/bin/env python3
"""
generate-zambia-admin1.py — Genere le GeoJSON admin-1 reel de la Zambie.

Contexte : brief client Peace Corps (evolution des volontaires 1995->2026).
Le brief nomme 7 provinces et INTERDIT explicitement d'en montrer d'autres.
Ce script separe donc les 7 provinces du brief des 3 restantes, pour que le
code de scene ne puisse pas afficher une province hors-brief par accident.

Pipeline (calque sur generate-sahel-admin1.py) :
  1. Telecharge ne_10m_admin_1_states_provinces.geojson (ou lit /tmp/ne_admin1.json)
  2. Filtre adm0_a3 == ZMB (10 provinces)
  3. Marque inBrief=true sur les 7 provinces nommees par le client
  4. Ecrit public/_shared/geo-data/zambia/zambia-admin1.geojson
"""
import json
import os
import subprocess

from shapely.geometry import shape, mapping

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = "/tmp/ne_admin1.json"
OUT = os.path.join(ROOT, "public/_shared/geo-data/zambia/zambia-admin1.geojson")
NE_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson"

# Les 7 provinces nommees dans le brief client, dans l'ordre narratif
# (Luapula = point de depart 1995).
BRIEF_PROVINCES = [
    "Luapula",
    "North-Western",
    "Eastern",
    "Western",
    "Northern",
    "Southern",
    "Lusaka",
]

# Les 3 autres provinces zambiennes. Presentes dans le fichier pour dessiner
# un contour national correct, mais inBrief=false : ne JAMAIS les mettre en avant.
OUT_OF_BRIEF = ["Central", "Copperbelt", "Muchinga"]


def ensure_src():
    if os.path.exists(SRC) and os.path.getsize(SRC) > 1_000_000:
        return
    print(f"[geojson] telechargement Natural Earth admin-1 -> {SRC}")
    subprocess.run(["curl", "-sL", "-o", SRC, NE_URL, "--max-time", "300"], check=True)


def main():
    ensure_src()
    ne = json.load(open(SRC))
    zm = {}
    for f in ne["features"]:
        if f["properties"].get("adm0_a3") == "ZMB":
            zm[f["properties"]["name"]] = f

    expected = set(BRIEF_PROVINCES) | set(OUT_OF_BRIEF)
    missing = expected - set(zm)
    if missing:
        raise SystemExit(f"[geojson] ERREUR provinces introuvables dans Natural Earth: {sorted(missing)}")

    out_features = []
    for name in BRIEF_PROVINCES + OUT_OF_BRIEF:
        geom = shape(zm[name]["geometry"])
        centroid = geom.centroid
        in_brief = name in BRIEF_PROVINCES
        out_features.append({
            "type": "Feature",
            "properties": {
                "name": name,
                "country": "ZMB",
                "iso_a2": "ZM",
                "inBrief": in_brief,
                # Ordre d'apparition narratif (1 = Luapula, depart 1995). null hors brief.
                "briefOrder": BRIEF_PROVINCES.index(name) + 1 if in_brief else None,
                "centroidLon": round(centroid.x, 4),
                "centroidLat": round(centroid.y, 4),
            },
            "geometry": mapping(geom),
        })

    fc = {
        "type": "FeatureCollection",
        "name": "zambia-admin1",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": out_features,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(fc, open(OUT, "w"), ensure_ascii=False)

    n_brief = sum(1 for f in out_features if f["properties"]["inBrief"])
    print(f"[geojson] ecrit {len(out_features)} provinces -> {OUT}")
    print(f"[geojson] dont {n_brief} dans le brief client : {BRIEF_PROVINCES}")
    print(f"[geojson] hors brief (ne pas mettre en avant) : {OUT_OF_BRIEF}")


if __name__ == "__main__":
    main()
