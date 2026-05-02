#!/usr/bin/env python3
"""Jury AI Hybride — vision creative pre-construction.

Envoie un brief textuel structure a plusieurs LLMs en parallele :
- OpenAI GPT-5
- xAI Grok-4.1-fast
- Google Gemini-3-flash

Chaque modele repond en markdown, sauve dans un fichier dedie.
Ensuite, produit une synthese comparative.

Usage:
    python -u scripts/tools/jury-creative-vision.py <brief.md> --out-dir <dir>
"""
import sys
import os
import json
import argparse
import time
import threading
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Load .env
env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
XAI_KEY = os.environ.get("XAI_API_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")

COST_LOG = PROJECT_ROOT / "out" / "shaka-cost-log.txt"

JURY = [
    {
        "name": "openai-gpt4o",
        "label": "OpenAI GPT-4o",
        "endpoint": "https://api.openai.com/v1/chat/completions",
        "model": "gpt-4o",
        "key": OPENAI_KEY,
        "cost_in_per_M": 2.50,
        "cost_out_per_M": 10.00,
        "format": "openai",
    },
    {
        "name": "xai-grok",
        "label": "xAI Grok-4.1-fast",
        "endpoint": "https://api.x.ai/v1/chat/completions",
        "model": "grok-4-fast",  # nom standard accessible (4.1-fast est l'alias commercial)
        "key": XAI_KEY,
        "cost_in_per_M": 0.20,
        "cost_out_per_M": 0.50,
        "format": "openai",
    },
    {
        "name": "gemini-3-flash",
        "label": "Google Gemini 3 Flash Preview",
        "endpoint_template": "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        "model": "gemini-3-flash-preview",
        "key": GEMINI_KEY,
        "cost_in_per_M": 0.50,
        "cost_out_per_M": 3.00,
        "format": "gemini",
    },
]

SYSTEM_PROMPT = """Tu es membre d'un jury de directeurs creatifs techniques qui evalue un projet de Short YouTube documentaire historique.
Stack maitrise : Remotion 4 + React/TypeScript + SVG natif + d3-geo + spring/interpolate.
Ton role : apporter une vision creative DANS LES CONTRAINTES du stack, etre audacieux mais realiste.
Reponse en francais, structure en sections claires, soyez critique et specifique."""


def log_cost(label: str, cost: float, status: str):
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] [jury-{label}] [${cost:.4f}] [{status}]\n"
    try:
        with open(COST_LOG, "a") as f:
            f.write(line)
    except Exception:
        pass
    print(line.rstrip())


def call_openai_compatible(member: dict, brief: str) -> tuple[bool, str, dict]:
    """Pour OpenAI et xAI (meme schema)."""
    import urllib.request, urllib.error

    payload = {
        "model": member["model"],
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": brief},
        ],
        "max_completion_tokens": 8000,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {member['key']}",
    }
    req = urllib.request.Request(
        member["endpoint"],
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        text = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})
        return True, text, usage
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else ""
        return False, f"HTTP {e.code}: {body[:400]}", {}
    except Exception as e:
        return False, f"ERROR: {str(e)[:300]}", {}


def call_gemini(member: dict, brief: str) -> tuple[bool, str, dict]:
    import urllib.request, urllib.error

    url = member["endpoint_template"].format(model=member["model"]) + f"?key={member['key']}"
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT + "\n\n" + brief}]}
        ],
        "generationConfig": {"maxOutputTokens": 8000, "temperature": 0.5},
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        # Extraire le texte
        candidates = data.get("candidates", [])
        if not candidates:
            return False, f"No candidates in response: {json.dumps(data)[:400]}", {}
        parts = candidates[0].get("content", {}).get("parts", [])
        text = "\n".join(p.get("text", "") for p in parts if "text" in p)
        usage = data.get("usageMetadata", {})
        usage_normalized = {
            "prompt_tokens": usage.get("promptTokenCount", 0),
            "completion_tokens": usage.get("candidatesTokenCount", 0),
        }
        return True, text, usage_normalized
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else ""
        return False, f"HTTP {e.code}: {body[:400]}", {}
    except Exception as e:
        return False, f"ERROR: {str(e)[:300]}", {}


def process_member(member: dict, brief: str, out_dir: Path, results: dict):
    """Thread worker."""
    if not member["key"] or member["key"].startswith("your-"):
        log_cost(member["name"], 0, f"SKIP no key for {member['label']}")
        results[member["name"]] = {"ok": False, "msg": "no key"}
        return

    print(f"  → Calling {member['label']}...")
    t0 = time.time()
    if member["format"] == "openai":
        ok, text, usage = call_openai_compatible(member, brief)
    else:
        ok, text, usage = call_gemini(member, brief)
    elapsed = time.time() - t0

    if ok:
        out_path = out_dir / f"{member['name']}.md"
        out_path.write_text(text, encoding="utf-8")
        prompt_tokens = usage.get("prompt_tokens", 0)
        completion_tokens = usage.get("completion_tokens", 0)
        cost = (prompt_tokens * member["cost_in_per_M"] + completion_tokens * member["cost_out_per_M"]) / 1_000_000
        log_cost(
            member["name"],
            cost,
            f"OK {len(text)}c ({elapsed:.1f}s, {prompt_tokens}in+{completion_tokens}out)",
        )
        results[member["name"]] = {"ok": True, "cost": cost, "path": str(out_path), "len": len(text)}
    else:
        log_cost(member["name"], 0, f"FAIL {text[:120]}")
        results[member["name"]] = {"ok": False, "msg": text}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("brief", help="Path to brief markdown")
    parser.add_argument("--out-dir", required=True, help="Output directory")
    parser.add_argument("--budget-cap", type=float, default=0.50, help="Max budget USD")
    parser.add_argument("--only", default=None, help="Comma-separated member names to run (skip others)")
    args = parser.parse_args()

    brief_path = Path(args.brief)
    if not brief_path.exists():
        print(f"ERROR: brief introuvable: {brief_path}")
        sys.exit(1)
    brief_text = brief_path.read_text(encoding="utf-8")
    print(f"Brief: {brief_path.name} ({len(brief_text)} chars)")
    print(f"Budget cap: ${args.budget_cap:.2f}")
    print(f"Jury members: {len(JURY)}")

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Filtre membres si --only
    members_to_run = JURY
    if args.only:
        only_set = set(args.only.split(","))
        members_to_run = [m for m in JURY if m["name"] in only_set]
        print(f"Filtered to: {[m['name'] for m in members_to_run]}")

    # Lancer en parallele via threads
    results = {}
    threads = []
    for member in members_to_run:
        t = threading.Thread(target=process_member, args=(member, brief_text, out_dir, results))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    print()
    print("=== RESULTATS JURY ===")
    total_cost = 0.0
    for name, r in results.items():
        if r["ok"]:
            total_cost += r["cost"]
            print(f"  {name}: OK ${r['cost']:.4f} ({r['len']} chars) → {r['path']}")
        else:
            print(f"  {name}: FAIL {r['msg'][:100]}")
    print(f"Cout total: ${total_cost:.4f} (cap ${args.budget_cap:.2f})")


if __name__ == "__main__":
    main()
