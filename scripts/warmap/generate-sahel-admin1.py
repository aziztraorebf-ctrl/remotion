#!/usr/bin/env python3
"""
generate-sahel-admin1.py — Genere le GeoJSON admin-1 reel Mali + Burkina + Niger.

Remplace les bbox rectangulaires de sahel-admin1.geojson par les vraies formes
Natural Earth 10m admin-1.

Pipeline :
  1. Telecharge ne_10m_admin_1_states_provinces.geojson (ou lit /tmp/ne_admin1.json)
  2. Mali (9 regions NE) + Niger (8 regions NE) : reprises directement
  3. Burkina (45 provinces NE) : dissoutes en 13 regions via le champ `region`
  4. Mappe les noms NE -> nos 32 noms canoniques (sahel.warmap.json stateNames)
  5. Ecrit public/_shared/geo-data/sahel/sahel-admin1.geojson

Regions absentes de Natural Earth (creees recemment) : Taoudenit + Menaka (Mali).
Elles sont decoupees depuis les regions parentes (Tombouctou/Gao) par bbox-clip.
"""
import json
import os
import sys
import subprocess
from shapely.geometry import shape, mapping, box
from shapely.ops import unary_union

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = "/tmp/ne_admin1.json"
OUT = os.path.join(ROOT, "public/_shared/geo-data/sahel/sahel-admin1.geojson")
NE_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson"

# Nos 32 noms canoniques (sahel.warmap.json) -> nom Natural Earth correspondant
# Mali
MALI_MAP = {
    "Kidal": "Kidal", "Gao": "Gao", "Tombouctou": "Timbuktu", "Mopti": "Mopti",
    "Ségou": "Ségou", "Koulikoro": "Koulikoro", "Kayes": "Kayes",
    "Sikasso": "Sikasso", "Bamako": "Bamako",
    # Crees recemment, absents de NE -> derives par clip bbox (voir DERIVED)
    "Taoudénit": None, "Ménaka": None,
}
# Niger
NIGER_MAP = {
    "Agadez": "Agadez", "Tahoua": "Tahoua", "Tillabéri": "Tillabéri",
    "Dosso": "Dosso", "Maradi": "Maradi", "Zinder": "Zinder",
    "Diffa": "Diffa", "Niamey": "Niamey",
}
# Burkina : nos 13 noms canoniques == valeurs du champ NE `region`
BURKINA_REGIONS = [
    "Sahel", "Nord", "Centre-Nord", "Est", "Boucle du Mouhoun", "Hauts-Bassins",
    "Centre", "Centre-Est", "Centre-Ouest", "Centre-Sud", "Cascades",
    "Plateau-Central", "Sud-Ouest",
]
# Normalisation des libelles region NE -> nos noms (NE peut ecrire differemment)
BF_REGION_NORMALIZE = {
    "Boucle du Mouhoun": "Boucle du Mouhoun",
    "Hauts-Bassins": "Hauts-Bassins", "Hauts Bassins": "Hauts-Bassins",
    "Centre-Nord": "Centre-Nord", "Centre Nord": "Centre-Nord",
    "Centre-Est": "Centre-Est", "Centre Est": "Centre-Est",
    "Centre-Ouest": "Centre-Ouest", "Centre Ouest": "Centre-Ouest",
    "Centre-Sud": "Centre-Sud", "Centre Sud": "Centre-Sud",
    "Plateau-Central": "Plateau-Central", "Plateau Central": "Plateau-Central",
    "Sud-Ouest": "Sud-Ouest", "Sud Ouest": "Sud-Ouest",
}

# Regions derivees par clip bbox (absentes de NE). bbox = (minlon, minlat, maxlon, maxlat)
# Taoudenit = extreme nord Mali (decoupe depuis Tombouctou nord). Menaka = est (depuis Gao est).
DERIVED = {
    "Taoudénit": {"parent": "Timbuktu", "bbox": (-6.5, 19.0, 4.3, 25.2), "country": "MLI", "iso": "ML"},
    "Ménaka":    {"parent": "Gao",      "bbox": (1.0, 14.5, 4.3, 17.5),  "country": "MLI", "iso": "ML"},
}


def ensure_src():
    if os.path.exists(SRC) and os.path.getsize(SRC) > 1_000_000:
        return
    print(f"[geojson] telechargement Natural Earth admin-1 -> {SRC}")
    subprocess.run(["curl", "-sL", "-o", SRC, NE_URL, "--max-time", "180"], check=True)


def main():
    ensure_src()
    ne = json.load(open(SRC))
    by_country = {"MLI": [], "BFA": [], "NER": []}
    for f in ne["features"]:
        a3 = f["properties"].get("adm0_a3")
        if a3 in by_country:
            by_country[a3].append(f)

    out_features = []

    def geom_by_ne_name(country, ne_name):
        for f in by_country[country]:
            if f["properties"].get("name") == ne_name:
                return shape(f["geometry"])
        return None

    # --- MALI (sauf derives) ---
    for canon, ne_name in MALI_MAP.items():
        if ne_name is None:
            continue
        g = geom_by_ne_name("MLI", ne_name)
        if g is None:
            print(f"  [WARN] Mali region NE introuvable: {ne_name}")
            continue
        out_features.append(_feat(canon, g, "MLI", "ML"))

    # --- MALI derives (Taoudenit, Menaka) par clip bbox du parent ---
    for canon, spec in DERIVED.items():
        parent = geom_by_ne_name(spec["country"], spec["parent"])
        if parent is None:
            print(f"  [WARN] parent introuvable pour {canon}: {spec['parent']}")
            continue
        clip = box(*spec["bbox"])
        g = parent.intersection(clip)
        if g.is_empty:
            print(f"  [WARN] clip vide pour {canon}")
            continue
        out_features.append(_feat(canon, g, spec["country"], spec["iso"]))

    # --- NIGER ---
    for canon, ne_name in NIGER_MAP.items():
        g = geom_by_ne_name("NER", ne_name)
        if g is None:
            print(f"  [WARN] Niger region NE introuvable: {ne_name}")
            continue
        out_features.append(_feat(canon, g, "NER", "NE"))

    # --- BURKINA : dissoudre les 45 provinces en 13 regions via champ `region` ---
    bf_groups = {}
    for f in by_country["BFA"]:
        reg_raw = f["properties"].get("region")
        reg = BF_REGION_NORMALIZE.get(reg_raw, reg_raw)
        if reg not in BURKINA_REGIONS:
            # tenter sans accents/tirets
            print(f"  [WARN] province BF '{f['properties'].get('name')}' region='{reg_raw}' non mappee")
            continue
        bf_groups.setdefault(reg, []).append(shape(f["geometry"]))
    for reg in BURKINA_REGIONS:
        geoms = bf_groups.get(reg)
        if not geoms:
            print(f"  [WARN] aucune province pour region BF: {reg}")
            continue
        merged = unary_union(geoms)
        out_features.append(_feat(reg, merged, "BFA", "BF"))

    fc = {
        "type": "FeatureCollection",
        "name": "sahel-admin1",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": out_features,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(fc, open(OUT, "w"), ensure_ascii=False)
    print(f"\n[geojson] ecrit {len(out_features)} regions -> {OUT}")
    names = sorted(f["properties"]["name"] for f in out_features)
    print(f"[geojson] regions: {names}")

    # Verifier la couverture des 32 noms attendus
    expected = set(MALI_MAP) | set(NIGER_MAP) | set(BURKINA_REGIONS)
    got = set(f["properties"]["name"] for f in out_features)
    missing = expected - got
    if missing:
        print(f"\n[geojson] ⚠ MANQUANTES: {sorted(missing)}")
    else:
        print(f"\n[geojson] ✓ Les {len(expected)} regions attendues sont toutes presentes")


def _feat(name, geom, country, iso):
    return {
        "type": "Feature",
        "properties": {"name": name, "name_fr": name, "country": country, "iso_a2": iso},
        "geometry": mapping(geom),
    }


if __name__ == "__main__":
    main()
