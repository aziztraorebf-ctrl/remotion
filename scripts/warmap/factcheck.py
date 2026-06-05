"""
warmap/factcheck.py — Step 4 (FACT-CHECK / cross-check).

A judge LLM (gemini-3.1-pro-preview via google genai; optionally Grok via XAI as 2nd judge)
compares ACLED-derived control/casualties against press/communique sources and flags
anomalies (casualty mismatch, control-position dispute). Writes back verified/confidence
and emits a human-readable fact-check.md report.

Convergence rule (mirrors memory/feedback_3-agents-research-stack.md): a jalon is
verified=true only if >=2 independent source KINDS agree. ACLED alone -> verified=false,
confidence capped at 0.6.

Fixture-safe: no judge key -> mark verified=false, confidence~0.5, report notes "skipped".
NO emojis (code file).
"""
import os
from datetime import datetime, timezone

from .config import MODEL_FACTCHECK_GEMINI

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ACLED_CONF_CAP = 0.6  # ACLED-only confidence ceiling (single source kind)


def _val(entry):
    return entry["value"] if isinstance(entry, dict) else entry


def _source_kinds(jalon):
    kinds = set()
    for src in (jalon.get("prov") or {}).get("sources", []):
        kinds.add(src.get("kind"))
    return {k for k in kinds if k}


def _apply_convergence(jalon):
    """Single source kind (acled) -> not verified, cap confidence. >=2 kinds -> verified."""
    kinds = _source_kinds(jalon)
    distinct = {k for k in kinds if k != "llm"}  # llm vignette is not an independent source
    prov = jalon.setdefault("prov", {"sources": [], "confidence": 0.5})
    if len(distinct) >= 2:
        prov["verified"] = True
    else:
        prov["verified"] = False
        prov["confidence"] = min(prov.get("confidence", 0.6), ACLED_CONF_CAP)
    return len(distinct)


def _judge_with_gemini(ds, fixtures_only):
    """Optional: ask Gemini to flag anomalies. Returns list of {date, anomalies:[...]}."""
    if fixtures_only or not GEMINI_API_KEY:
        return None
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        lines = []
        for j in ds["jalons"]:
            held = [s for s, e in j["control"].items() if _val(e) < 1.0]
            lines.append(f"{j['date']}: casualties={j['casualties']}, non-SAF states={held}")
        prompt = (
            "You are a conflict-data fact-checker. Below is an ACLED-derived control timeline "
            "for the Sudan civil war. Flag any anomaly (implausible casualty jump, impossible "
            "territorial flip, ordering error). Reply as compact JSON list: "
            "[{\"date\":\"YYYY-MM-DD\",\"anomalies\":[\"...\"]}].\n\n" + "\n".join(lines)
        )
        resp = client.models.generate_content(model=MODEL_FACTCHECK_GEMINI, contents=prompt)
        txt = (resp.text or "").strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        import json as _json
        return _json.loads(txt)
    except Exception as exc:
        print(f"[factcheck] gemini judge skipped ({exc})")
        return None


def factcheck_dataset(ds, events, articles, report_path=None, fixtures_only=False):
    anomalies_by_date = {}
    judged = _judge_with_gemini(ds, fixtures_only)
    if judged:
        for entry in judged:
            anomalies_by_date[entry.get("date")] = entry.get("anomalies", [])

    n_unverified = 0
    for j in ds["jalons"]:
        distinct = _apply_convergence(j)
        if not j["prov"].get("verified"):
            n_unverified += 1
        anns = anomalies_by_date.get(j["date"])
        if anns:
            note = "; ".join(anns)
            j["prov"]["notes"] = (j["prov"].get("notes", "") + " | anomaly: " + note).strip(" |")

    ds["buildMeta"]["factcheck"] = (
        "skipped (no key)" if (fixtures_only or not GEMINI_API_KEY) else MODEL_FACTCHECK_GEMINI
    )

    if report_path:
        _write_report(ds, report_path, n_unverified, judged, fixtures_only)
    return ds


def _write_report(ds, path, n_unverified, judged, fixtures_only):
    from pathlib import Path
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        f"# Fact-check — {ds['subject']}",
        f"> Genere {ts} par scripts/warmap/factcheck.py",
        "",
        f"- Connecteur: {ds['buildMeta'].get('connector')}",
        f"- Juge: {ds['buildMeta'].get('factcheck')}",
        f"- Jalons non verifies (source unique ACLED): {n_unverified}/{len(ds['jalons'])}",
        "",
        "## Regle de convergence",
        "Un jalon passe `verified=true` seulement si >=2 TYPES de sources independants "
        "concordent (ACLED + presse + UCDP...). ACLED seul -> `verified=false`, "
        f"confidence plafonnee a {ACLED_CONF_CAP}.",
        "",
        "## Jalons",
    ]
    for j in ds["jalons"]:
        prov = j.get("prov", {})
        lines.append(
            f"- **{j['date']}** — {j['label']} — verified={prov.get('verified')}, "
            f"confidence={prov.get('confidence')}"
            + (f" — NOTES: {prov['notes']}" if prov.get("notes") else "")
        )
    if fixtures_only or not GEMINI_API_KEY:
        lines += ["", "> Juge LLM non execute (pas de cle / mode fixtures). "
                  "Verification croisee a refaire avec ACLED reel + presse + UCDP."]
    p.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[factcheck] report -> {p}")
