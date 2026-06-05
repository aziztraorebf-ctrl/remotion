"""
warmap/aggregate.py — THE CORE: ACLED point events -> admin-1 control jalons.

Algorithm (see plan + WARMAP-RESEARCH-PLAYBOOK.md):
  1. actor -> faction side (A=SAF/1, B=RSF/0) via ACTOR_FACTION substring match
  2. point-in-polygon -> state (geo.point_in_state)
  3. temporal binning -> for jalon date D, trailing window [D-WINDOW_DAYS, D]
  4. per-state dominance score -> control 0..1, carry-forward if no events, optional snap
  5. cumulative fatalities -> casualties
  6. provenance attach (top event ids, confidence from corroboration)

Run standalone for the golden test:
  python3 -m scripts.warmap.aggregate --fixtures-only
NO emojis (code file).
"""
import argparse
import json
import math
from datetime import date, timedelta

from .config import (
    SUDAN_STATES, ACTOR_FACTION, WINDOW_DAYS, SNAP_DEADBAND, SNAP_CONTROL,
    CONF_SAT, EVENT_TYPE_WEIGHT, DEFAULT_EVENT_WEIGHT,
    SUDAN_JALON_DATES, SUDAN_JALON_LABELS, FIXTURES_DIR, GEOJSON_SUDAN,
)
from .geo import point_in_state


def _iso(d):
    return d.isoformat()


def _parse(iso):
    y, m, dd = map(int, iso.split("-"))
    return date(y, m, dd)


def actor_side(actor):
    """Return 'A' (SAF/1), 'B' (RSF/0), or None for an ACLED actor string."""
    if not actor:
        return None
    a = actor.lower()
    for key, side in ACTOR_FACTION.items():
        if key in a:
            return side
    return None


def event_weight(ev):
    base = EVENT_TYPE_WEIGHT.get(ev.get("event_type"), DEFAULT_EVENT_WEIGHT)
    fatal = ev.get("fatalities") or 0
    return base * (1.0 + math.log1p(fatal))


def _resolve_state(ev, geojson_path):
    """Prefer point-in-polygon; fall back to the admin1 string if it is a known state."""
    lon, lat = ev.get("longitude"), ev.get("latitude")
    if lon is not None and lat is not None:
        st = point_in_state(lon, lat, geojson_path)
        if st in SUDAN_STATES:
            return st
    a1 = ev.get("admin1")
    return a1 if a1 in SUDAN_STATES else None


def events_to_jalons(events, jalon_dates=None, labels=None, geojson_path=None,
                     states=None, snap=None):
    jalon_dates = jalon_dates or SUDAN_JALON_DATES
    labels = labels or SUDAN_JALON_LABELS
    geojson_path = str(geojson_path or GEOJSON_SUDAN)
    states = states or SUDAN_STATES
    snap = SNAP_CONTROL if snap is None else snap

    # pre-resolve each event's state + side once
    enriched = []
    for ev in events:
        st = _resolve_state(ev, geojson_path)
        if st is None:
            # still keep for casualty totals via date
            enriched.append({"ev": ev, "state": None, "side": None,
                             "w": event_weight(ev), "d": _parse(ev["event_date"])})
            continue
        enriched.append({"ev": ev, "state": st, "side": actor_side(ev.get("actor1")),
                         "w": event_weight(ev), "d": _parse(ev["event_date"])})

    jalons = []
    prev_control = {s: 1.0 for s in states}  # nominal SAF before the war
    for jd in jalon_dates:
        D = _parse(jd)
        w_start = D - timedelta(days=WINDOW_DAYS)

        # per-state A/B weighted scores within the window + driving event ids
        scoreA = {s: 0.0 for s in states}
        scoreB = {s: 0.0 for s in states}
        drivers = {s: [] for s in states}
        for e in enriched:
            if e["state"] is None or not (w_start <= e["d"] <= D):
                continue
            if e["side"] == "A":
                scoreA[e["state"]] += e["w"]
                drivers[e["state"]].append((e["w"], e["ev"]["event_id_cnty"]))
            elif e["side"] == "B":
                scoreB[e["state"]] += e["w"]
                drivers[e["state"]].append((e["w"], e["ev"]["event_id_cnty"]))

        control = {}
        for s in states:
            a, b = scoreA[s], scoreB[s]
            tot = a + b
            if tot <= 0:
                # carry forward: no activity -> territory does not flip
                control[s] = _build_state_control(prev_control[s], 0.0, [], snap, carried=True)
                continue
            dominance = (a - b) / tot
            raw = max(0.0, min(1.0, 0.5 + 0.5 * dominance))
            conf = min(1.0, tot / CONF_SAT)
            top_ids = [eid for _, eid in sorted(drivers[s], reverse=True)[:3]]
            control[s] = _build_state_control(raw, conf, top_ids, snap)

        # cumulative casualties up to and including D
        casualties = sum((e["ev"].get("fatalities") or 0) for e in enriched if e["d"] <= D)

        jalons.append({
            "date": jd,
            "label": labels.get(jd, ""),
            "control": control,
            "casualties": casualties,
            "casualtiesProv": {
                "sources": [{"kind": "acled", "ref": "acled-events"}],
                "confidence": 0.7, "verified": False, "method": "acled-cumulative-fatalities",
            },
            "prov": {
                "sources": [{"kind": "acled", "ref": "acled-events", "date": jd}],
                "confidence": 0.6, "verified": False, "method": "acled-agg",
            },
        })
        prev_control = {s: _val(control[s]) for s in states}

    return jalons


def _snap(raw):
    if abs(raw - 0.5) < SNAP_DEADBAND:
        return 0.5
    return 1.0 if raw > 0.5 else 0.0


def _build_state_control(raw, conf, top_ids, snap, carried=False):
    value = _snap(raw) if (snap and not carried) else (raw if not carried else _snap(raw))
    # carried values come from prev (already snapped); keep as-is
    if carried:
        value = raw if raw in (0.0, 0.5, 1.0) else _snap(raw)
    prov = {
        "sources": [{"kind": "acled", "ref": eid} for eid in top_ids],
        "confidence": round(conf, 3),
        "verified": False,
        "method": "acled-agg:pip+actor-control" + ("+carry" if carried else ""),
        "notes": f"raw={raw:.3f}",
    }
    return {"value": value, "prov": prov}


def _val(entry):
    return entry["value"] if isinstance(entry, dict) else entry


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fixtures-only", action="store_true")
    ap.add_argument("--write-golden", action="store_true",
                    help="write expected_jalons.json from the fixture (dev helper)")
    args = ap.parse_args()

    fixture = FIXTURES_DIR / "acled_sudan_sample.json"
    payload = json.loads(fixture.read_text(encoding="utf-8"))
    events = payload["data"]
    jalons = events_to_jalons(events)

    if args.write_golden:
        golden = FIXTURES_DIR / "expected_jalons.json"
        golden.write_text(json.dumps(jalons, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"wrote golden {golden}")
        return

    # print a compact control table
    print(f"{'state':<18} " + " ".join(j["date"][2:] for j in jalons))
    for s in SUDAN_STATES:
        row = " ".join(f"{_val(j['control'][s]):>8.1f}" for j in jalons)
        print(f"{s:<18} {row}")
    print("casualties:        " + " ".join(f"{j['casualties']:>8}" for j in jalons))


if __name__ == "__main__":
    main()
