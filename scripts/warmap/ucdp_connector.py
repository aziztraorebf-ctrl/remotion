"""
warmap/ucdp_connector.py — UCDP GED connector. STUB / interface.

UCDP 2026 access (verified):
  - API: token by EMAIL request to the maintainer (see https://ucdp.uu.se/apidocs/),
    submitted per request as header `x-ucdp-access-token`.
  - SIMPLER START: download the GED CSV/JSON from https://ucdp.uu.se/downloads
    (v26 = April 2026), no token. Load it locally and normalize to the pipeline event shape.

UCDP is academic / peer-validated: better for HISTORICAL or long-form subjects (incontestable,
de-propagandized) than for real-time fronts (ACLED is better there). Use UCDP as a 2nd source
KIND in fact-check convergence.

This session: STUB. Implement `fetch_events` to read a downloaded GED file and map to:
  {event_id_cnty, event_date, year, event_type, actor1, actor2, admin1, longitude, latitude, fatalities}
NO emojis (code file).
"""
import os

UCDP_TOKEN = os.getenv("UCDP_ACCESS_TOKEN")
UCDP_API_URL = "https://ucdpapi.pcr.uu.se/api/gedevents/24.1"  # version-pinned endpoint


def fetch_events(country="Sudan", date_start=None, date_end=None, ged_csv_path=None):
    """STUB. Either read a downloaded GED CSV (ged_csv_path) or call the API with token."""
    print("[ucdp] STUB: not implemented this session. "
          "Provide GED CSV (ucdp.uu.se/downloads) or UCDP_ACCESS_TOKEN.")
    return []
