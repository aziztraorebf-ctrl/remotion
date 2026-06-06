"""
warmap/sudan_choreography.py — the VISION layer for Sudan (transcribed 1:1 from the
validated TS: warmapVehicles.ts (VEHICLES/REFUGEES), sudanControlData.ts (CITIES),
WarMapDataOverlay.tsx (overlay content)).

This is CHOREOGRAPHY, not data: not derivable from ACLED. The orchestrator preserves it
across data regenerations. Kept here so the first canonical JSON reproduces the current
render byte-for-byte. NO emojis.
"""

VEHICLES = [
    {"id": "rsf-1", "faction": "rsf", "sprite": "tech-td-red", "kind": "technical", "size": 58,
     "path": [{"t": 0.0, "lon": 27.0, "lat": 14.6}, {"t": 0.4, "lon": 31.8, "lat": 14.9},
              {"t": 0.7, "lon": 29.0, "lat": 14.2}, {"t": 1.0, "lon": 25.6, "lat": 13.6}]},
    {"id": "rsf-2", "faction": "rsf", "sprite": "tech-td-red", "kind": "technical", "size": 50,
     "path": [{"t": 0.0, "lon": 25.5, "lat": 12.4}, {"t": 0.4, "lon": 30.5, "lat": 13.8},
              {"t": 0.7, "lon": 27.5, "lat": 12.9}, {"t": 1.0, "lon": 24.9, "lat": 12.2}],
     "delay": 14},
    {"id": "rsf-3", "faction": "rsf", "sprite": "tech-td-red", "kind": "technical", "size": 46,
     "path": [{"t": 0.0, "lon": 26.2, "lat": 15.8}, {"t": 0.4, "lon": 30.0, "lat": 15.6},
              {"t": 0.7, "lon": 27.8, "lat": 15.0}, {"t": 1.0, "lon": 25.2, "lat": 14.6}],
     "delay": 26},
    {"id": "saf-1", "faction": "saf", "sprite": "tank-td-blue", "kind": "tank", "size": 58,
     "path": [{"t": 0.0, "lon": 35.2, "lat": 16.2}, {"t": 0.4, "lon": 34.0, "lat": 15.8},
              {"t": 0.7, "lon": 32.4, "lat": 15.5}, {"t": 1.0, "lon": 30.2, "lat": 14.8}]},
    {"id": "saf-2", "faction": "saf", "sprite": "tank-td-blue", "kind": "tank", "size": 50,
     "path": [{"t": 0.0, "lon": 36.0, "lat": 17.4}, {"t": 0.4, "lon": 34.6, "lat": 16.6},
              {"t": 0.7, "lon": 33.2, "lat": 14.4}, {"t": 1.0, "lon": 31.4, "lat": 13.9}],
     "delay": 18},
    {"id": "saf-3", "faction": "saf", "sprite": "tank-td-blue", "kind": "tank", "size": 46,
     "path": [{"t": 0.0, "lon": 34.4, "lat": 14.2}, {"t": 0.4, "lon": 33.6, "lat": 14.0},
              {"t": 0.7, "lon": 32.0, "lat": 15.2}, {"t": 1.0, "lon": 30.6, "lat": 15.4}],
     "delay": 32},
]

REFUGEES = [
    {"id": "ref-1", "portrait": "portrait-civil", "size": 56, "appearT": 0.34,
     "path": [{"t": 0.34, "lon": 32.5, "lat": 15.4}, {"t": 0.6, "lon": 34.4, "lat": 14.6},
              {"t": 1.0, "lon": 36.0, "lat": 14.2}]},
    {"id": "ref-2", "portrait": "portrait-civil", "size": 50, "appearT": 0.4,
     "path": [{"t": 0.4, "lon": 25.3, "lat": 13.6}, {"t": 0.7, "lon": 23.4, "lat": 13.3},
              {"t": 1.0, "lon": 21.9, "lat": 13.0}]},
    {"id": "ref-3", "portrait": "portrait-civil", "size": 46, "appearT": 0.46,
     "path": [{"t": 0.46, "lon": 33.4, "lat": 14.3}, {"t": 0.75, "lon": 34.6, "lat": 13.6},
              {"t": 1.0, "lon": 35.4, "lat": 13.2}]},
]

CITIES = [
    {"name": "Khartoum", "lon": 32.53, "lat": 15.50},
    {"name": "Port-Soudan", "lon": 37.22, "lat": 19.62},
    {"name": "El Fasher", "lon": 25.35, "lat": 13.63},
    {"name": "Nyala", "lon": 24.88, "lat": 12.05},
    {"name": "Wad Madani", "lon": 33.52, "lat": 14.40},
]

# overlays promoted from WarMapDataOverlay.tsx CONTENT into data (additive; engine keeps
# its hard-coded scheduling for now, this is forward-compatible metadata).
OVERLAYS = [
    {"variant": "displaced", "atT": 0.34, "hold": 300, "value": 12, "unit": "millions",
     "label": "Derriere le front", "sub": "de personnes deplacees",
     "tagline": "La plus grave crise de deplacement au monde"},
    {"variant": "famine", "atT": 0.7, "hold": 300, "value": 25, "unit": "millions",
     "label": "Le cout cache", "sub": "en insecurite alimentaire aigue",
     "tagline": "La moitie du pays a faim"},
]
