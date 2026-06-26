"""
warmap/config.py — shared configuration for the War-Map research pipeline.

Subject-specific config (Sudan) lives here for now. When a second subject lands,
split into per-subject config modules. NO emojis (code file).
"""
from pathlib import Path

# --- paths ---------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT_DIR = Path(__file__).resolve().parent
FIXTURES_DIR = SCRIPT_DIR / "fixtures"
GEOJSON_SUDAN = REPO_ROOT / "public" / "_shared" / "geo-data" / "sudan" / "sudan-states.geojson"
OUT_DATASET_SUDAN = REPO_ROOT / "src" / "projects" / "warmap" / "data" / "sudan.warmap.json"
FACTCHECK_REPORT_SUDAN = REPO_ROOT / "memory" / "episodes" / "warmap-daybyday" / "sudan-fact-check.md"

# --- 17 Sudan states (EXACT names from sudan-states.geojson properties.name) ----
SUDAN_STATES = [
    "Northern", "River Nile", "Red Sea", "Kassala", "Gedarif",
    "Khartoum", "Gezira", "White Nile", "Blue Nile", "Sennar",
    "North Kordufan", "South Kordufan",
    "North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur",
]

# --- faction model -------------------------------------------------------
# control value: A=1 (SAF, blue) | B=0 (RSF, red) | 0.5 contested
FACTIONS = [
    {"id": "saf", "label": "Sudanese Armed Forces", "color": "#3E6E9E", "controlValue": 1},
    {"id": "rsf", "label": "Rapid Support Forces", "color": "#B14B3C", "controlValue": 0},
    {"id": "contested", "label": "Contested", "color": "#C99A3A", "controlValue": 0.5},
]

# ACLED actor string -> faction side ("A"=SAF/1, "B"=RSF/0). Substring match, case-insensitive.
# Unmapped actors are ignored for control but still count toward fatalities.
ACTOR_FACTION = {
    "rapid support forces": "B",
    "rsf": "B",
    "military forces of sudan": "A",
    "saf:": "A",
    "sudanese armed forces": "A",
    "military forces of sudan (2019-)": "A",
}

# --- aggregation tuning (all defaults, tunable) --------------------------
WINDOW_DAYS = 30            # trailing window [D-WINDOW_DAYS, D] per jalon
SNAP_DEADBAND = 0.25        # |dominance| < this -> contested (0.5)
SNAP_CONTROL = True         # snap to {0, 0.5, 1} for the clean tri-color look
CONF_SAT = 8.0             # event-weight sum that saturates confidence to ~1
EVENT_TYPE_WEIGHT = {
    "Battles": 2.0,
    "Strategic developments": 1.5,
    "Explosions/Remote violence": 1.2,
    "Violence against civilians": 1.0,
    "Riots": 0.5,
    "Protests": 0.2,
}
DEFAULT_EVENT_WEIGHT = 1.0

# editorial jalon dates (ISO) — "which dates tell the story" is a vision call.
# Mirrors the 6 hand-authored milestones in sudanControlData.ts.
SUDAN_JALON_DATES = [
    "2023-04-15",  # war erupts
    "2023-08-01",  # RSF takes Khartoum + Darfur
    "2023-12-18",  # RSF apogee (Wad Madani falls)
    "2024-10-01",  # SAF counter-attacks from the east
    "2025-03-26",  # SAF retakes Wad Madani then Khartoum
    "2026-05-01",  # de facto partition
]
SUDAN_JALON_LABELS = {
    "2023-04-15": "La guerre eclate — Khartoum bascule dans la bataille",
    "2023-08-01": "Le RSF s'empare de Khartoum et du Darfour",
    "2023-12-18": "Apogee du RSF — chute de Wad Madani",
    "2024-10-01": "L'armee contre-attaque depuis l'est",
    "2025-03-26": "L'armee reprend Wad Madani puis Khartoum",
    "2026-05-01": "Partition de fait — l'ouest au RSF, l'est a l'armee",
}

# --- LLM model ids (LOCKED per CLAUDE.md) --------------------------------
MODEL_SYNTHESIS = "perplexity/sonar-pro"      # via OpenRouter (NOT deep-research, too costly)
MODEL_FACTCHECK_GEMINI = "gemini-3.1-pro-preview"
# MODEL_FACTCHECK_GROK = "grok-4"              # non utilise — variable morte (jamais importee)

# --- ACLED API -----------------------------------------------------------
ACLED_OAUTH_URL = "https://acleddata.com/oauth/token"
ACLED_API_URL = "https://acleddata.com/api/acled/read"
ACLED_CLIENT_ID = "acled"
