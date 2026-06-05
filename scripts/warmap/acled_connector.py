"""
warmap/acled_connector.py — ACLED data connector (fixture-first).

ACLED 2026 uses OAuth password grant:
  POST https://acleddata.com/oauth/token
       username, password (myACLED account), grant_type=password, client_id=acled
  -> access_token (24h) + refresh_token (14j)
  Then GET the read endpoint with Authorization: Bearer <token>.

Creds in .env: ACLED_USERNAME, ACLED_PASSWORD. If absent -> FIXTURE fallback so the
whole pipeline runs to completion with zero keys this session. NO emojis.
"""
import json
import os

from .config import (
    ACLED_OAUTH_URL, ACLED_API_URL, ACLED_CLIENT_ID, FIXTURES_DIR,
)

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

ACLED_USERNAME = os.getenv("ACLED_USERNAME")
ACLED_PASSWORD = os.getenv("ACLED_PASSWORD")


def _have_creds():
    return bool(ACLED_USERNAME and ACLED_PASSWORD)


def get_token():
    """OAuth password grant -> access_token (valid 24h). Requires creds."""
    import requests  # local import: not needed in fixture path
    resp = requests.post(
        ACLED_OAUTH_URL,
        data={
            "username": ACLED_USERNAME,
            "password": ACLED_PASSWORD,
            "grant_type": "password",
            "client_id": ACLED_CLIENT_ID,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()
    token = data.get("access_token")
    if not token:
        raise RuntimeError(f"ACLED token response missing access_token: {data}")
    return token
    # TODO refresh: data['refresh_token'] valid 14j -> POST grant_type=refresh_token


def _normalize(raw_event):
    """Map an ACLED record to the pipeline's event shape (the shape aggregate.py expects)."""
    return {
        "event_id_cnty": raw_event.get("event_id_cnty"),
        "event_date": raw_event.get("event_date"),
        "year": raw_event.get("year"),
        "event_type": raw_event.get("event_type"),
        "sub_event_type": raw_event.get("sub_event_type"),
        "actor1": raw_event.get("actor1"),
        "actor2": raw_event.get("actor2"),
        "admin1": raw_event.get("admin1"),
        "longitude": _to_float(raw_event.get("longitude")),
        "latitude": _to_float(raw_event.get("latitude")),
        "fatalities": _to_int(raw_event.get("fatalities")),
    }


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


def _load_fixture():
    payload = json.loads((FIXTURES_DIR / "acled_sudan_sample.json").read_text(encoding="utf-8"))
    events = [_normalize(e) for e in payload.get("data", [])]
    print(f"[acled] no creds -- using fixture ({len(events)} events)")
    return events


def fetch_events(country="Sudan", date_start=None, date_end=None, force_fixture=False):
    """Return normalized ACLED events for country/date-range. Fixture fallback if no creds or auth fails."""
    if force_fixture or not _have_creds():
        return _load_fixture()

    import requests
    try:
        token = get_token()
    except Exception as exc:
        print(f"[acled] OAuth failed ({exc}). "
              "Check ACLED_USERNAME/ACLED_PASSWORD are your myACLED account credentials "
              "(email + password at acleddata.com, NOT the old API key). Using fixture.")
        return _load_fixture()
    headers = {"Authorization": f"Bearer {token}"}
    params = {"country": country, "limit": 0}  # limit=0 -> all (paginated by API)
    if date_start and date_end:
        params["event_date"] = f"{date_start}|{date_end}"
        params["event_date_where"] = "BETWEEN"

    out = []
    page = 1
    while True:
        params["page"] = page
        resp = requests.get(ACLED_API_URL, headers=headers, params=params, timeout=60)
        resp.raise_for_status()
        body = resp.json()
        batch = body.get("data", [])
        if not batch:
            break
        out.extend(_normalize(e) for e in batch)
        if len(batch) < 500:  # ACLED default page size; last page reached
            break
        page += 1
    print(f"[acled] fetched {len(out)} events for {country} ({date_start}..{date_end})")
    return out


if __name__ == "__main__":
    evs = fetch_events()
    print(f"total {len(evs)} events; first: {evs[0] if evs else None}")
