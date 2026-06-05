"""
warmap/llm_synthesis.py — Step 3 (LLM BRAIN): per-jalon contextual vignette.

Uses OpenRouter -> perplexity/sonar-pro (established fact-check/synthesis model, NOT
deep-research: too costly). Pattern cloned from scripts/visual_review.py. Fixture-safe:
if no OPENROUTER_API_KEY, returns a templated placeholder so the JSON stays well-formed.

NO emojis (code file).
"""
import json
import os

from .config import MODEL_SYNTHESIS

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _val(entry):
    return entry["value"] if isinstance(entry, dict) else entry


def _flipped_states(jalon):
    """States held by RSF (0) or contested (0.5) -- the interesting ones to explain."""
    out = []
    for s, e in jalon["control"].items():
        v = _val(e)
        if v < 1.0:
            out.append((s, v))
    return out


def synthesize_vignette(jalon, events, articles, fixtures_only=False):
    flips = _flipped_states(jalon)
    if fixtures_only or not OPENROUTER_API_KEY:
        focus = flips[0][0] if flips else "le front"
        return {
            "vignette": f"[placeholder] Autour du {jalon['date']}, {focus} bascule. "
                        f"Pertes cumulees estimees: {jalon['casualties']}.",
            "sources": [],
        }

    import requests
    state_lines = ", ".join(f"{s} (controle={v})" for s, v in flips[:6]) or "aucun changement majeur"
    prompt = (
        "Tu es analyste pour la chaine Kora & Cartes (angle macro africain, ton sobre, factuel).\n"
        f"Date du jalon: {jalon['date']} — evenement: {jalon['label']}.\n"
        f"Etats non tenus par l'armee a cette date: {state_lines}.\n"
        f"Pertes cumulees estimees (ACLED): {jalon['casualties']}.\n\n"
        "En 2 phrases maximum (francais), explique POURQUOI le front a bouge a cette date. "
        "Cite tes sources. Reponds en JSON: {\"vignette\": \"...\", \"sources\": [\"url\", ...]}."
    )
    try:
        resp = requests.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://koraetcartes.local",
                "X-Title": "warmap-synthesis",
                "Content-Type": "application/json",
            },
            json={"model": MODEL_SYNTHESIS,
                  "messages": [{"role": "user", "content": prompt}]},
            timeout=120,
        )
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]
        content = content.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(content)
        srcs = [{"kind": "press", "ref": u} for u in (data.get("sources") or [])]
        return {"vignette": data.get("vignette", ""), "sources": srcs}
    except Exception as exc:
        print(f"[synthesis] sonar-pro failed ({exc}); placeholder used")
        return {"vignette": f"[fallback] {jalon['label']}", "sources": []}
