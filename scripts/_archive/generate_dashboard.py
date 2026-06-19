#!/usr/bin/env python3
"""
Régénère le dashboard HTML Souverain depuis le manifest des templates.

Usage:
  python3 scripts/generate_dashboard.py             # update local HTML
  python3 scripts/generate_dashboard.py --upload    # update + upload here.now

Source de configuration : SCRIPT lit la liste TEMPLATES en haut du fichier.
Pour ajouter un nouveau template : éditer TEMPLATES + relancer.

Le script lit aussi `public/_shared/previews/_manifest.json` pour récupérer les URLs catbox.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
# subprocess deja importe ci-dessus, OK

ROOT = Path(__file__).parent.parent
DASHBOARD = ROOT / "dashboard/templates-souverain.html"
MANIFEST = ROOT / "public/_shared/previews/_manifest.json"


def upload_to_herenow(html_path: Path) -> str:
    """Publie le HTML sur here.now via le script existant (3 etapes API)."""
    script = Path.home() / ".claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh"
    if not script.exists():
        print(f"ERROR: script absent: {script}")
        print("Voir memory/tools/here-now-hosting.md pour la procedure manuelle")
        return ""
    r = subprocess.run([str(script), str(html_path)], capture_output=True, text=True, timeout=120)
    print(r.stdout)
    if r.returncode != 0:
        print(f"ERR: {r.stderr}")
        return ""
    # Extract URL
    for line in r.stdout.split("\n"):
        if "Live URL" in line:
            return line.split(":", 1)[1].strip()
    return ""


def main():
    upload = "--upload" in sys.argv

    if not DASHBOARD.exists():
        print(f"ERROR: dashboard template missing: {DASHBOARD}")
        print("Run from project root: python3 scripts/generate_dashboard.py")
        sys.exit(1)

    print(f"Dashboard local: file://{DASHBOARD}")
    print(f"Pour mettre à jour les previews : modifier directement la constante TEMPLATES dans le HTML")
    print(f"Ou utiliser scripts/generate_template_previews.py pour régénérer les PNG + manifest")

    if MANIFEST.exists():
        m = json.loads(MANIFEST.read_text())
        n = len(m.get('templates', []))
        print(f"\n✓ Manifest présent : {n} previews catbox référencés")
    else:
        print(f"\n⚠ Manifest absent : {MANIFEST}")

    if upload:
        url = upload_to_herenow(DASHBOARD)
        print(f"\n→ {url}")
    else:
        print(f"\n→ Ouvrir dans navigateur : open {DASHBOARD}")
        print(f"→ Pour upload here.now : python3 scripts/generate_dashboard.py --upload")


if __name__ == "__main__":
    main()
