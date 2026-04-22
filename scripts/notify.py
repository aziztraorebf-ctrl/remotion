#!/usr/bin/env python3
"""
SMS notification via Textbelt for the video production pipeline.

Sends concise alerts when pipeline gates block or when clips are ready
for human review. Degrades gracefully when env vars are not configured.

Env vars required in .env:
    TEXTBELT_KEY   -- API key from https://textbelt.com
    TEXTBELT_PHONE -- Phone number in E.164 format (e.g. +15145551234)

Usage as module:
    from scripts.notify import send_sms, notify_gate_block, notify_review_ready

Usage standalone (test):
    python scripts/notify.py
"""

from __future__ import annotations

import json
import os
import urllib.request
import urllib.error
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

TEXTBELT_URL = "https://textbelt.com/text"
MAX_SMS_LENGTH = 480

# Load .env manually (avoid dependency on python-dotenv)
_env_file = Path(__file__).resolve().parent.parent / ".env"
if _env_file.exists():
    for line in _env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip()
        if key and value and key not in os.environ:
            os.environ[key] = value


def _get_config() -> tuple[str | None, str | None]:
    """Return (phone, key) from env, or (None, None) if not configured."""
    return os.environ.get("TEXTBELT_PHONE"), os.environ.get("TEXTBELT_KEY")


# ---------------------------------------------------------------------------
# Core send function
# ---------------------------------------------------------------------------

def send_sms(message: str) -> dict:
    """Send an SMS via Textbelt. Returns the API response dict.

    Returns {"success": False, "reason": "..."} if not configured or on error.
    Never raises exceptions (fire-and-forget pattern).
    """
    phone, key = _get_config()

    if not phone or not key:
        return {
            "success": False,
            "reason": "TEXTBELT_PHONE or TEXTBELT_KEY not configured in .env",
        }

    # Truncate if needed
    if len(message) > MAX_SMS_LENGTH:
        message = message[: MAX_SMS_LENGTH - 3] + "..."

    payload = json.dumps({
        "phone": phone,
        "message": message,
        "key": key,
    }).encode("utf-8")

    req = urllib.request.Request(
        TEXTBELT_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        return {"success": False, "reason": f"Request failed: {exc}"}


# ---------------------------------------------------------------------------
# Pipeline-specific notification helpers
# ---------------------------------------------------------------------------

def notify_gate_block(
    short_name: str,
    acte: str | int,
    failures: list[str],
) -> dict:
    """Notify that a pipeline gate blocked generation.

    Args:
        short_name: e.g. 'soundjata'
        acte: e.g. 'acte4' or 4
        failures: List of failure reason strings.
    """
    header = f"BLOCKED | {short_name} {acte}"
    body_lines = [f"- {f[:70]}" for f in failures[:5]]
    message = header + "\n" + "\n".join(body_lines)
    return send_sms(message)


def notify_review_ready(
    short_name: str,
    acte: str | int,
    step: str,
    url: str,
    gates_summary: str = "",
) -> dict:
    """Notify that a deliverable is ready for human review.

    Args:
        short_name: e.g. 'soundjata'
        acte: e.g. 'acte4' or 4
        step: e.g. 'storyboard', 'clip', 'assemblage'
        url: Vercel Blob URL or local path for review.
        gates_summary: Optional one-line summary of gates passed.
    """
    header = f"REVIEW | {short_name} {acte} - {step}"
    lines = [header]
    if gates_summary:
        lines.append(f"Gates: {gates_summary}")
    lines.append(url)
    lines.append("Reply GO or feedback")
    message = "\n".join(lines)
    return send_sms(message)


def notify_batch_complete(
    short_name: str,
    actes_done: list[str],
    actes_blocked: list[str],
) -> dict:
    """Notify that a batch of actes has finished processing.

    Args:
        short_name: e.g. 'soundjata'
        actes_done: List of acte labels that completed successfully.
        actes_blocked: List of acte labels that were blocked by gates.
    """
    lines = [f"BATCH DONE | {short_name}"]
    if actes_done:
        lines.append(f"OK: {', '.join(actes_done)}")
    if actes_blocked:
        lines.append(f"BLOCKED: {', '.join(actes_blocked)}")
    lines.append(f"{len(actes_done)}/{len(actes_done) + len(actes_blocked)} passed")
    message = "\n".join(lines)
    return send_sms(message)


# ---------------------------------------------------------------------------
# CLI test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    phone, key = _get_config()
    print(f"Config: phone={'SET' if phone else 'MISSING'}, key={'SET' if key else 'MISSING'}")

    if phone and key:
        print("\nSending test SMS...")
        result = send_sms("Pipeline gates test - ignore this message")
        print(f"Result: {result}")
    else:
        print("\nSkipping send (configure TEXTBELT_PHONE and TEXTBELT_KEY in .env)")
        print("\nDemo format - gate block:")
        print(notify_gate_block.__name__, "would send:")
        header = "BLOCKED | soundjata acte4"
        body = "- prompt_structure: Prompt too short: 67 chars (min 2000)"
        print(f"  {header}\n  {body}")

        print("\nDemo format - review ready:")
        header = "REVIEW | soundjata acte4 - clip"
        print(f"  {header}")
        print("  Gates: 6/6 passed")
        print("  https://blob.vercel-storage.com/xxx")
        print("  Reply GO or feedback")
