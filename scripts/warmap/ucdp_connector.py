"""
warmap/ucdp_connector.py — UCDP GED connector (CSV-based, no token needed).

UCDP GED 25.1 downloaded to: scripts/warmap/fixtures/ucdp/GEDEvent_v25_1.csv
Source: https://ucdp.uu.se/downloads/ — licensed CC BY 4.0, no registration for bulk download.
1080 Sudan 2023+ events. Academic/peer-validated: 2nd source KIND for fact-check convergence.
Use AFTER ACLED: fills gaps, cross-validates casualties, extends to historical subjects.

UCDP field mapping -> pipeline event shape:
  id            -> event_id_cnty
  date_start    -> event_date (normalized YYYY-MM-DD)
  type_of_violence -> event_type (1=state-based battle, 2=non-state, 3=one-sided violence)
  side_a/side_b -> actor1/actor2
  adm_1         -> admin1 (strip " state" suffix, normalize to match SUDAN_STATES keys)
  latitude/longitude -> coordinates
  best          -> fatalities (best estimate)

API fallback: token by email to UCDP maintainer (header x-ucdp-access-token). Rarely needed
since bulk CSV is available. NO emojis (code file).
"""
import csv
import os
import re
from datetime import datetime
from pathlib import Path

from .config import FIXTURES_DIR, SUDAN_STATES

DEFAULT_GED_PATH = FIXTURES_DIR / "ucdp" / "GEDEvent_v25_1.csv"

# type_of_violence -> event_type string (pipeline-compatible with ACLED nomenclature)
VIOLENCE_TYPE = {
    "1": "Battles",          # state-based (SAF vs RSF)
    "2": "Battles",          # non-state (armed group vs armed group)
    "3": "Violence against civilians",
}

# normalize UCDP adm_1 -> SUDAN_STATES keys (strips state/State suffix, fixes known variants)
_ADM1_ALIASES = {
    "khartoum state": "Khartoum",
    "north darfur state": "North Darfur",
    "north darfur": "North Darfur",
    "south darfur state": "Southern Darfur",
    "south darfur": "Southern Darfur",
    "west darfur state": "Western Darfur",
    "west darfur": "Western Darfur",
    "central darfur state": "Central Darfur",
    "east darfur state": "Eastern Darfur",
    "east darfur": "Eastern Darfur",
    "northern state": "Northern",
    "river nile state": "River Nile",
    "red sea state": "Red Sea",
    "kassala state": "Kassala",
    "gedaref state": "Gedarif",
    "gezira state": "Gezira",
    "white nile state": "White Nile",
    "blue nile state": "Blue Nile",
    "sennar state": "Sennar",
    "north kordofan state": "North Kordufan",
    "north kordofan": "North Kordufan",
    "south kordofan state": "South Kordufan",
    "south kordofan": "South Kordufan",
}


def _normalize_adm1(raw):
    if not raw:
        return None
    key = raw.strip().lower()
    if key in _ADM1_ALIASES:
        return _ADM1_ALIASES[key]
    # strip trailing " state"
    stripped = re.sub(r"\s+state$", "", key).strip()
    # title-case match against SUDAN_STATES
    candidate = stripped.title()
    if candidate in SUDAN_STATES:
        return candidate
    return None


def _parse_date(ds):
    """'2023-04-15 00:00:00.000' -> '2023-04-15'"""
    return ds.split(" ")[0] if ds else None


def _to_float(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _to_int(v):
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return 0


def _normalize(row):
    return {
        "event_id_cnty": f"UCDP{row.get('id', '')}",
        "event_date": _parse_date(row.get("date_start")),
        "year": _to_int(row.get("year")),
        "event_type": VIOLENCE_TYPE.get(row.get("type_of_violence"), "Battles"),
        "sub_event_type": "UCDP",
        "actor1": row.get("side_a", ""),
        "actor2": row.get("side_b", ""),
        "admin1": _normalize_adm1(row.get("adm_1")),
        "longitude": _to_float(row.get("longitude")),
        "latitude": _to_float(row.get("latitude")),
        "fatalities": _to_int(row.get("best")),
    }


def fetch_events(country="Sudan", date_start=None, date_end=None, ged_csv_path=None):
    """Read UCDP GED CSV and return normalized events matching country + optional date range."""
    path = Path(ged_csv_path) if ged_csv_path else DEFAULT_GED_PATH
    if not path.exists():
        print(f"[ucdp] CSV not found at {path}. "
              "Download from https://ucdp.uu.se/downloads/ (GED v25.1 CSV, no token needed).")
        return []

    ds_filter = None
    de_filter = None
    if date_start:
        ds_filter = datetime.strptime(date_start, "%Y-%m-%d")
    if date_end:
        de_filter = datetime.strptime(date_end, "%Y-%m-%d")

    out = []
    with open(path, encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            if row.get("country", "").strip() != country:
                continue
            ev = _normalize(row)
            if ev["event_date"] is None:
                continue
            if ds_filter or de_filter:
                try:
                    ed = datetime.strptime(ev["event_date"], "%Y-%m-%d")
                    if ds_filter and ed < ds_filter:
                        continue
                    if de_filter and ed > de_filter:
                        continue
                except ValueError:
                    continue
            out.append(ev)

    print(f"[ucdp] {len(out)} events for {country}"
          + (f" ({date_start}..{date_end})" if date_start else ""))
    return out


if __name__ == "__main__":
    evs = fetch_events("Sudan", "2023-04-01")
    print(f"total {len(evs)}, first: {evs[0] if evs else None}")
    # show adm1 coverage
    from collections import Counter
    c = Counter(e["admin1"] for e in evs)
    print("top states:", c.most_common(8))
