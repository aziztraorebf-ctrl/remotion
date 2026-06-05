"""
warmap/build_warmap_data.py — ORCHESTRATOR.

Chains: ACLED events -> aggregate to admin-1 control jalons -> LLM vignettes (Step 3)
-> fact-check (Step 4) -> emit the canonical WarMapDataset JSON the engine consumes.

Preserves choreography (vehicles/refugees/cities/overlays): regenerates ONLY
jalons+casualties+provenance, keeps the vision layer from sudan_choreography.py (or from
an existing dataset on disk if present).

  python3 -m scripts.warmap.build_warmap_data --fixtures-only
  python3 -m scripts.warmap.build_warmap_data            # uses real ACLED creds if in .env

NO emojis (code file).
"""
import argparse
import json

from .config import (
    OUT_DATASET_SUDAN, SUDAN_STATES, FACTIONS, FACTCHECK_REPORT_SUDAN,
)
from . import acled_connector, aggregate, sudan_choreography
from . import llm_synthesis, factcheck, web_preresearch


def _val(entry):
    return entry["value"] if isinstance(entry, dict) else entry


def _load_existing_choreography():
    """Preserve vision layer from an existing dataset if present, else use the module."""
    if OUT_DATASET_SUDAN.exists():
        try:
            ds = json.loads(OUT_DATASET_SUDAN.read_text(encoding="utf-8"))
            return (ds.get("vehicles") or sudan_choreography.VEHICLES,
                    ds.get("refugees") or sudan_choreography.REFUGEES,
                    ds.get("cities") or sudan_choreography.CITIES,
                    ds.get("overlays") or sudan_choreography.OVERLAYS)
        except Exception:
            pass
    return (sudan_choreography.VEHICLES, sudan_choreography.REFUGEES,
            sudan_choreography.CITIES, sudan_choreography.OVERLAYS)


def build(fixtures_only=False):
    # Step 1 - HARD DATA
    events = acled_connector.fetch_events("Sudan", force_fixture=fixtures_only)

    # Step 2 - PRE-RESEARCH (web) -- stub returns {} this session
    articles = web_preresearch.gather([])

    # Step (core) - aggregate events -> jalons
    jalons = aggregate.events_to_jalons(events)

    # Step 3 - LLM BRAIN: synthesize a vignette per jalon (thin, fixture-safe)
    for j in jalons:
        vign = llm_synthesis.synthesize_vignette(j, events, articles, fixtures_only=fixtures_only)
        if vign:
            j["vignette"] = vign.get("vignette")
            if vign.get("sources"):
                j["prov"]["sources"].extend(vign["sources"])

    vehicles, refugees, cities, overlays = _load_existing_choreography()

    ds = {
        "schemaVersion": 1,
        "subject": "sudan-civil-war",
        "adminLevel": "admin-1",
        "geojson": "/_shared/geo-data/sudan/sudan-states.geojson",
        "stateNames": SUDAN_STATES,
        "factions": FACTIONS,
        "jalons": jalons,
        "vehicles": vehicles,
        "refugees": refugees,
        "cities": cities,
        "overlays": overlays,
        "buildMeta": {
            "connector": "acled-fixture" if fixtures_only else "acled",
            "factcheck": "pending",
            "sourceCommentary": "ACLED-derived admin-1 control (estimates, genre convention)",
        },
    }

    # Step 4 - FACT-CHECK: verified/confidence write-back + report
    ds = factcheck.factcheck_dataset(ds, events, articles,
                                     report_path=FACTCHECK_REPORT_SUDAN,
                                     fixtures_only=fixtures_only)

    OUT_DATASET_SUDAN.parent.mkdir(parents=True, exist_ok=True)
    OUT_DATASET_SUDAN.write_text(json.dumps(ds, indent=2, ensure_ascii=False), encoding="utf-8")
    return ds


def _print_summary(ds):
    jalons = ds["jalons"]
    print(f"\nwrote {OUT_DATASET_SUDAN}")
    print(f"{'state':<18} " + " ".join(j["date"][2:] for j in jalons))
    for s in ds["stateNames"]:
        row = " ".join(f"{_val(j['control'][s]):>8.1f}" for j in jalons)
        print(f"{s:<18} {row}")
    print("casualties:        " + " ".join(f"{j['casualties']:>8}" for j in jalons))
    print("verified:          " + " ".join(
        f"{str(j['prov'].get('verified')):>8}" for j in jalons))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fixtures-only", action="store_true")
    args = ap.parse_args()
    ds = build(fixtures_only=args.fixtures_only)
    _print_summary(ds)


if __name__ == "__main__":
    main()
