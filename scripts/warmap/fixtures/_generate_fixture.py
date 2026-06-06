"""
_generate_fixture.py — produces acled_sudan_sample.json, a realistic ACLED-shaped
response seeded so aggregate.py reproduces ~the hand-authored JALONS in sudanControlData.ts.

This is a DEV helper (run once). The committed fixture is the artifact; this documents
how it was seeded. NO emojis.

Seeding logic: for each jalon window and each state, emit N events of the controlling
faction at the state centroid (jittered). RSF holds Khartoum+Darfur in 2023, flips
Gezira RSF(2023.12)->SAF(2025.03), SAF holds the east throughout, etc. — matching the
6 milestones' control maps.
"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent / "acled_sudan_sample.json"

# state centroids (inside polygon), computed from sudan-states.geojson
CENTROIDS = {
    "Central Darfur": (23.51, 12.41), "Southern Darfur": (24.50, 9.87),
    "Gedarif": (34.82, 13.86), "Blue Nile": (34.24, 11.00), "Sennar": (34.25, 13.22),
    "Northern": (29.00, 21.20), "River Nile": (33.55, 19.47), "North Darfur": (25.45, 14.53),
    "Western Darfur": (22.74, 14.06), "Red Sea": (36.51, 19.54), "Kassala": (36.25, 16.12),
    "White Nile": (32.25, 13.80), "South Kordufan": (29.89, 11.55), "Eastern Darfur": (26.34, 11.10),
    "Gezira": (33.16, 14.49), "Khartoum": (32.98, 15.67), "North Kordufan": (29.79, 13.17),
}

SAF = "Military Forces of Sudan (2019-)"
RSF = "Rapid Support Forces"

# control maps mirroring sudanControlData.ts JALONS (0=RSF, 0.5=contested, 1=SAF)
def ctrl(rsf, contested=()):
    m = {s: 1 for s in CENTROIDS}
    for s in rsf:
        m[s] = 0
    for s in contested:
        m[s] = 0.5
    return m

JALONS = [
    ("2023-04-15", ctrl([], ["Khartoum"])),
    ("2023-08-01", ctrl(["Khartoum", "North Darfur", "Western Darfur", "Central Darfur",
                          "Southern Darfur", "Eastern Darfur"], ["North Kordufan", "South Kordufan"])),
    ("2023-12-18", ctrl(["Khartoum", "Gezira", "North Darfur", "Western Darfur", "Central Darfur",
                          "Southern Darfur", "Eastern Darfur", "South Kordufan"],
                         ["North Kordufan", "Sennar", "White Nile"])),
    ("2024-10-01", ctrl(["Gezira", "North Darfur", "Western Darfur", "Central Darfur",
                          "Southern Darfur", "Eastern Darfur"],
                         ["Khartoum", "North Kordufan", "South Kordufan"])),
    ("2025-03-26", ctrl(["North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur",
                          "Eastern Darfur"], ["North Kordufan", "South Kordufan"])),
    ("2026-05-01", ctrl(["North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur",
                          "Eastern Darfur"], ["South Kordufan", "North Kordufan"])),
]

# emit events a few days BEFORE each jalon date (inside the 30d trailing window)
def days_before(iso, n):
    from datetime import date, timedelta
    y, m, d = map(int, iso.split("-"))
    return (date(y, m, d) - timedelta(days=n)).isoformat()

events = []
eid = 1000
for jdate, cmap in JALONS:
    for state, val in cmap.items():
        lon, lat = CENTROIDS[state]
        # number of events + faction split encodes the control value
        if val == 1:          # SAF holds: SAF-dominant cluster
            plan = [(SAF, 3), (RSF, 0)]
        elif val == 0:        # RSF holds
            plan = [(RSF, 3), (SAF, 0)]
        else:                 # contested: even split
            plan = [(SAF, 2), (RSF, 2)]
        for k, (actor, count) in enumerate(plan):
            for i in range(count):
                eid += 1
                jit = 0.05 * (i + 1) * (1 if k == 0 else -1)
                fatal = 40 + 30 * i + (60 if state == "Khartoum" else 0)
                events.append({
                    "event_id_cnty": f"SUD{eid}",
                    "event_date": days_before(jdate, 3 + i * 2),
                    "year": int(jdate[:4]),
                    "event_type": "Battles",
                    "sub_event_type": "Armed clash",
                    "actor1": actor,
                    "actor2": RSF if actor == SAF else SAF,
                    "admin1": state,
                    "longitude": round(lon + jit, 3),
                    "latitude": round(lat + jit, 3),
                    "fatalities": fatal,
                })

payload = {"success": True, "count": len(events), "data": events}
OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"wrote {OUT} with {len(events)} events")
