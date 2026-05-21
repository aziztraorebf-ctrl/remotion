#!/usr/bin/env python3
"""
prepare_beat.py — Pipeline officiel Souverain, Étape 3 automatisée.

Usage:
    python3 scripts/prepare_beat.py <episode> <beat_id>

Exemple:
    python3 scripts/prepare_beat.py zimbabwe-lithium beat3
    python3 scripts/prepare_beat.py niger-uranium beat2

Ce que ce script fait (sans décision humaine) :
  1. Lit le breakdown JSON du beat
  2. Identifie les assets "to_generate" manquants
  3. Détermine le fond adapté (noir pour fond sombre, crème pour fond clair)
  4. Génère les assets manquants via Gemini Flash avec le prompt EXACT du JSON
  5. Vérifie pixel(0,0) de chaque PNG — régénère si le fond est mauvais (max 2 tentatives)
  6. Produit un rapport final

Ce que ce script NE fait PAS :
  - Écrire du code Remotion
  - Modifier le breakdown JSON
  - Faire des choix créatifs

Après ce script : lancer validate_beat.sh avant de coder.
"""

import json
import os
import sys
import time
from pathlib import Path
from typing import Literal

try:
    from google import genai
    from google.genai import types
    from PIL import Image
    import io
except ImportError as e:
    print(f"Dépendance manquante: {e}")
    print("Installer: pip install google-genai Pillow")
    sys.exit(1)

# ── Config ──────────────────────────────────────────────────────────────────

BASE = Path(__file__).parent.parent  # racine du projet


def _load_gemini_key() -> str:
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    env_file = BASE / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    print("ERROR: GEMINI_API_KEY introuvable (env ou .env)")
    sys.exit(1)


GEMINI_API_KEY = _load_gemini_key()

# Fonds prédéfinis par type de contexte visuel
# L'épisode peut surcharger via une section "background_context" dans le JSON
DARK_BG_COLORS = {
    "navy": (8, 13, 20),        # #080d14
    "noir": (0, 0, 0),           # #000000
    "charcoal": (20, 20, 28),   # #14141c
}
CREAM_BG_COLOR = (212, 194, 157)  # #d4c29d

# Tolérance pour la détection du fond
BG_TOLERANCE = 30

# ── Helpers ──────────────────────────────────────────────────────────────────

def detect_bg_type(asset_def: dict) -> Literal["dark", "cream", "unknown"]:
    """Détermine le fond à utiliser selon l'asset et son contexte."""
    # Si le breakdown spécifie explicitement un fond
    filename = asset_def.get("filename", "").lower()
    purpose = asset_def.get("purpose", "").lower()
    prompt = asset_def.get("prompt", "").lower()

    # Mots-clés suggérant un fond sombre (assets sur fond navy/noir)
    dark_keywords = ["lithium", "rock", "ore", "mineral", "battery", "icon",
                     "tech", "corporate", "industrial", "3d", "isometric"]
    # Mots-clés suggérant un fond clair (assets sur cercles crème, documents)
    cream_keywords = ["kraft", "document", "paper", "dossier", "stamp",
                      "cream", "circle", "node"]

    text = f"{filename} {purpose} {prompt}"
    dark_score = sum(1 for k in dark_keywords if k in text)
    cream_score = sum(1 for k in cream_keywords if k in text)

    if cream_score > dark_score:
        return "cream"
    elif dark_score > 0:
        return "dark"
    return "dark"  # défaut : fond sombre (le plus courant)


def check_pixel(img_path: Path, bg_type: Literal["dark", "cream"]) -> tuple[bool, tuple]:
    """Vérifie que pixel(0,0) correspond au fond attendu."""
    img = Image.open(img_path).convert("RGB")
    p = img.getpixel((0, 0))

    if bg_type == "dark":
        # Noir : RGB tous < 30
        ok = all(c < 30 for c in p)
    else:
        # Crème : proche de (212, 194, 157) ± tolérance
        ok = all(abs(p[i] - CREAM_BG_COLOR[i]) < BG_TOLERANCE for i in range(3))

    return ok, p


def add_bg_instruction(prompt: str, bg_type: Literal["dark", "cream"]) -> str:
    """Injecte l'instruction de fond dans le prompt original."""
    if bg_type == "dark":
        instruction = (
            "CRITICAL: PURE BLACK BACKGROUND #000000 — "
            "the background must be completely black (RGB 0,0,0) with zero gray. "
            "The subject is rendered on pure black. High contrast render."
        )
    else:
        instruction = (
            "CRITICAL: UNIFORM solid CREAM #d4c29d color background filling the "
            "ENTIRE frame edge to edge. Background must be flat solid #d4c29d, "
            "NO transparency, NO checkered pattern, NO gradients."
        )
    return f"{prompt}\n\n{instruction}"


# ── Core ──────────────────────────────────────────────────────────────────────

def prepare_beat(episode: str, beat_id: str):
    client = genai.Client(api_key=GEMINI_API_KEY)

    # Chemins
    episode_dir = BASE / "public" / "souverain" / episode
    breakdown_path = episode_dir / "assets" / "breakdown" / f"{beat_id}_breakdown.json"
    assets_dir = episode_dir / "assets" / beat_id
    assets_dir.mkdir(parents=True, exist_ok=True)

    if not breakdown_path.exists():
        print(f"ERREUR : breakdown JSON introuvable : {breakdown_path}")
        print("Générer d'abord le breakdown via Gemini 3.1-pro-preview.")
        sys.exit(1)

    # Lire le breakdown
    breakdown = json.loads(breakdown_path.read_text(encoding="utf-8"))
    assets_to_generate = breakdown.get("background_assets_to_generate", [])

    print(f"\n{'='*60}")
    print(f"PREPARE BEAT — {episode} / {beat_id}")
    print(f"{'='*60}")
    print(f"Breakdown: {breakdown_path.name}")
    print(f"Assets à générer: {len(assets_to_generate)}")
    print(f"Output dir: {assets_dir}\n")

    report = []

    for asset in assets_to_generate:
        filename = asset["filename"]
        prompt_original = asset["prompt"]
        out_path = assets_dir / filename

        # Vérifier si l'asset existe déjà avec le bon fond
        if out_path.exists():
            bg_type = detect_bg_type(asset)
            ok, pixel = check_pixel(out_path, bg_type)
            if ok:
                print(f"  SKIP {filename} — existe déjà, pixel(0,0)={pixel} ✓")
                report.append({"file": filename, "status": "skipped_ok", "pixel": pixel})
                continue
            else:
                print(f"  RÉGÉNÈRE {filename} — pixel(0,0)={pixel} incorrect (fond {bg_type} attendu)")

        # Déterminer le type de fond
        bg_type = detect_bg_type(asset)
        prompt_final = add_bg_instruction(prompt_original, bg_type)

        print(f"  Génération: {filename} (fond {bg_type})...")

        success = False
        for attempt in range(1, 3):  # max 2 tentatives
            try:
                response = client.models.generate_content(
                    model="gemini-3.1-flash-image-preview",
                    contents=[prompt_final],
                    config=types.GenerateContentConfig(
                        response_modalities=["image", "text"],
                        temperature=0.3,
                    ),
                )

                img_data = None
                for part in response.candidates[0].content.parts:
                    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                        img_data = part.inline_data.data
                        break

                if not img_data:
                    print(f"    Tentative {attempt}: pas d'image dans la réponse")
                    continue

                img = Image.open(io.BytesIO(img_data)).convert("RGB")
                img.save(out_path, "PNG")

                ok, pixel = check_pixel(out_path, bg_type)
                if ok:
                    print(f"    ✓ Tentative {attempt}: pixel(0,0)={pixel} — fond {bg_type} OK")
                    report.append({"file": filename, "status": "generated_ok",
                                   "pixel": pixel, "bg_type": bg_type, "attempts": attempt})
                    success = True
                    break
                else:
                    print(f"    ✗ Tentative {attempt}: pixel(0,0)={pixel} — fond incorrect")
                    if attempt < 2:
                        # Renforcer l'instruction de fond
                        prompt_final = add_bg_instruction(prompt_original, bg_type).replace(
                            "CRITICAL:", "CRITICAL (VERY IMPORTANT, previous attempt failed):"
                        )

            except Exception as e:
                print(f"    Tentative {attempt}: ERREUR — {e}")

            time.sleep(2)

        if not success:
            print(f"    ✗ ÉCHEC après 2 tentatives — vérifier manuellement")
            report.append({"file": filename, "status": "failed"})

    # Rapport final
    print(f"\n{'='*60}")
    print("RAPPORT FINAL")
    print(f"{'='*60}")
    ok_count = sum(1 for r in report if r["status"] in ("generated_ok", "skipped_ok"))
    fail_count = sum(1 for r in report if r["status"] == "failed")

    for r in report:
        icon = "✓" if r["status"] in ("generated_ok", "skipped_ok") else "✗"
        status_str = {
            "generated_ok": f"généré (fond {r.get('bg_type','?')}, {r.get('attempts',1)} tentative(s))",
            "skipped_ok": "existait déjà (fond OK)",
            "failed": "ÉCHEC — vérifier manuellement",
        }.get(r["status"], r["status"])
        print(f"  {icon} {r['file']}: {status_str}")

    print(f"\n{ok_count}/{len(report)} assets OK, {fail_count} échec(s)")

    if fail_count > 0:
        print("\n⚠️  Des assets ont échoué. Ne pas coder avant de les corriger.")
        print("   Lancer validate_beat.sh pour confirmer l'état avant de coder.")
        sys.exit(1)
    else:
        print("\n✅ Tous les assets sont prêts.")
        print(f"   Étape suivante : ./scripts/validate_beat.sh {episode} {beat_id}")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 scripts/prepare_beat.py <episode> <beat_id>")
        print("Exemple: python3 scripts/prepare_beat.py zimbabwe-lithium beat3")
        sys.exit(1)

    prepare_beat(sys.argv[1], sys.argv[2])
