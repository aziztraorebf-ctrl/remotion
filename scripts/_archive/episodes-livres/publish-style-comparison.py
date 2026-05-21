"""
Publish 3 Mapbox style comparison images to Vercel Blob with mobile-friendly comparison page.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env")

BLOB_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
BLOB_API_URL = "https://blob.vercel-storage.com"
COMPARISON_DIR = ROOT / "quebec-jacques-poc" / "research" / "style-comparison"
FOLDER = "jacques-research/style-comparison"

if not BLOB_TOKEN:
    sys.exit("ERROR: BLOB_READ_WRITE_TOKEN missing")


def upload_file(path: Path, pathname: str, content_type: str) -> str:
    response = requests.put(
        f"{BLOB_API_URL}/{pathname}",
        headers={
            "Authorization": f"Bearer {BLOB_TOKEN}",
            "x-content-type": content_type,
            "x-api-version": "7",
            "x-cache-control-max-age": "31536000",
            "x-add-random-suffix": "0",
            "x-allow-overwrite": "1",
        },
        data=path.read_bytes() if isinstance(path, Path) else path,
    )
    if response.status_code != 200:
        sys.exit(f"ERROR ({response.status_code}): {response.text}")
    return response.json().get("url", "")


def upload_bytes(data: bytes, pathname: str, content_type: str) -> str:
    response = requests.put(
        f"{BLOB_API_URL}/{pathname}",
        headers={
            "Authorization": f"Bearer {BLOB_TOKEN}",
            "x-content-type": content_type,
            "x-api-version": "7",
            "x-cache-control-max-age": "31536000",
            "x-add-random-suffix": "0",
            "x-allow-overwrite": "1",
        },
        data=data,
    )
    if response.status_code != 200:
        sys.exit(f"ERROR ({response.status_code}): {response.text}")
    return response.json().get("url", "")


STYLES = [
    {
        "id": "A-sepia-papercraft",
        "title": "A — Sépia Paper-Craft",
        "subtitle": "Continuité de marque (Sonjata, Abou Bakari, Thiaroye)",
        "pros": [
            "Cohérence directe avec ton ADN Paper-Craft existant",
            "Évoque l'archive et le savoir",
            "Lisibilité bonne, ton chaleureux",
            "Reuse direct de tes assets sépia déjà créés",
        ],
        "cons": [
            "Pas spécifiquement africain (pourrait être n'importe quel pays)",
            "Risque 'vieux' si trop assumé",
            "Géographie un peu approximative dans cet exemple",
            "Stat overlay manque 'OXFORD 2 000' en chiffre",
        ],
        "verdict": "Sécuritaire et cohérent, mais peu différenciant culturellement.",
    },
    {
        "id": "B-parchemin-mande",
        "title": "B — Parchemin Mande",
        "subtitle": "Signature culturelle ancrée (mudcloth + Adinkra + indigo)",
        "pros": [
            "DIFFÉRENCIATION MAXIMALE — personne d'autre n'a ça",
            "Ancrage culturel africain authentique (bogolan, manuscrits Sankoré)",
            "Palette ocre/indigo/or magnifique",
            "Renforce ton positionnement éditorial Géoafrique",
        ],
        "cons": [
            "'TIMBUKTU' au lieu de 'TOMBOUCTOU' dans la légende (mélange EN/FR à corriger)",
            "Comparaison barres moins lisible (sans chiffres explicites)",
            "Plus long à designer/calibrer (2-3 jours)",
            "Moins versatile pour sujets non-Mali",
        ],
        "verdict": "Le plus différenciant — risque de 'trop' si mal exécuté, mais ton avantage signature.",
    },
    {
        "id": "C-monochrome-editorial",
        "title": "C — Monochrome éditorial moderne",
        "subtitle": "Style Bloomberg/Vox/Le Monde (premium news-magazine)",
        "pros": [
            "Lisibilité maximale, hiérarchie d'info parfaite",
            "Comparaison barres ULTRA claire (25 000 vs 2 000)",
            "Audience internationale très large",
            "Versatile tous sujets",
        ],
        "cons": [
            "TRÈS proche de Jacques a dit (risque de ressembler aux concurrents)",
            "Aucune signature culturelle (pourrait être n'importe quelle chaîne)",
            "Tue ton avantage Paper-Craft existant",
            "Premium mais 'déjà vu'",
        ],
        "verdict": "Sécurité internationale, mais perd ton avantage culturel et visuel.",
    },
]


def main():
    print(f"Uploading 3 comparison images to Vercel Blob...\n")

    image_urls = {}
    for style in STYLES:
        img_path = COMPARISON_DIR / f"{style['id']}.png"
        if not img_path.exists():
            print(f"  SKIP (not found): {img_path}")
            continue
        pathname = f"{FOLDER}/{style['id']}.png"
        url = upload_file(img_path, pathname, "image/png")
        image_urls[style["id"]] = url
        print(f"  {style['id']} -> {url}")

    print("\nBuilding comparison page...")

    # Build HTML cards
    cards_html = ""
    for style in STYLES:
        url = image_urls.get(style["id"], "")
        pros_li = "".join(f"<li>{p}</li>" for p in style["pros"])
        cons_li = "".join(f"<li>{c}</li>" for c in style["cons"])
        cards_html += f"""
<div class="card">
  <h2>{style['title']}</h2>
  <p class="subtitle">{style['subtitle']}</p>
  <img src="{url}" alt="{style['title']}" loading="lazy" onclick="this.classList.toggle('zoomed')">
  <div class="pros-cons">
    <div class="pros">
      <h3>POUR</h3>
      <ul>{pros_li}</ul>
    </div>
    <div class="cons">
      <h3>CONTRE</h3>
      <ul>{cons_li}</ul>
    </div>
  </div>
  <p class="verdict"><strong>Verdict :</strong> {style['verdict']}</p>
</div>"""

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    index_url = "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/index.html"

    page = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Comparaison styles Mapbox - 3 options</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0d0d0d; color: #e8e8e8;
  padding: 16px; max-width: 760px; margin: 0 auto;
  line-height: 1.6; font-size: 16px;
}}
h1 {{ font-size: 1.5em; margin: 8px 0 6px; color: #fff; }}
.meta {{ color: #888; font-size: 0.85em; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #222; }}
.intro {{
  background: #161616; padding: 14px 16px; border-radius: 8px;
  border: 1px solid #2a2a2a; margin-bottom: 24px;
  font-size: 0.95em; color: #c8c8c8;
}}
.intro strong {{ color: #fff; }}
.card {{
  background: #161616; border-radius: 10px; padding: 18px;
  margin-bottom: 24px; border: 1px solid #2a2a2a;
}}
.card h2 {{ color: #ffd57a; font-size: 1.25em; margin-bottom: 4px; }}
.card .subtitle {{ color: #9ad9ff; font-size: 0.9em; margin-bottom: 14px; }}
.card img {{
  width: 100%; display: block; border-radius: 6px; cursor: pointer;
  border: 1px solid #2a2a2a; margin-bottom: 14px;
  transition: transform 0.2s;
}}
.card img.zoomed {{
  transform: scale(1.5); z-index: 100; position: relative;
  cursor: zoom-out;
}}
.pros-cons {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }}
.pros, .cons {{ background: #0d0d0d; padding: 10px; border-radius: 6px; }}
.pros h3 {{ color: #6fcf6f; font-size: 0.85em; margin-bottom: 6px; letter-spacing: 0.5px; }}
.cons h3 {{ color: #f08080; font-size: 0.85em; margin-bottom: 6px; letter-spacing: 0.5px; }}
.pros ul, .cons ul {{ margin-left: 18px; font-size: 0.85em; }}
.pros li, .cons li {{ margin: 4px 0; line-height: 1.4; }}
.verdict {{ font-size: 0.9em; color: #c8c8c8; padding-top: 10px; border-top: 1px solid #2a2a2a; }}
.back {{
  display: inline-block; margin-bottom: 16px;
  color: #6cb4ee; text-decoration: none;
  background: #1a1a1a; padding: 8px 14px; border-radius: 6px;
  border: 1px solid #2a2a2a;
}}
.decision {{
  background: #1a1a1a; padding: 14px 16px; border-radius: 8px;
  border: 1px solid #2a2a2a; margin-top: 24px;
  text-align: center; font-size: 1em; color: #ffd57a;
}}
@media (max-width: 600px) {{
  body {{ padding: 12px; font-size: 15px; }}
  .pros-cons {{ grid-template-columns: 1fr; }}
}}
</style>
</head>
<body>
<a href="{index_url}" class="back">← Index recherche</a>
<h1>Comparaison styles Mapbox — 3 options</h1>
<div class="meta">{timestamp} · Generated by Gemini 3.1 Flash Image Preview</div>

<div class="intro">
<strong>Sujet test identique sur les 3 :</strong> carte Tombouctou XVIe siècle, comparaison "25 000 ÉTUDIANTS" vs Oxford 2 000.
<br><br>
<strong>Ce qui change :</strong> uniquement le STYLE (palette, typo, motifs, ambiance).
<br><br>
<strong>Tap sur une image pour zoomer.</strong> Compare attentivement avant de choisir.
</div>

{cards_html}

<div class="decision">
Une fois ton choix fait (A, B ou C), réponds simplement avec la lettre.<br>
Ce style devient ta signature visuelle Géoafrique pour toutes les vidéos Atlas futures.
</div>
</body>
</html>"""

    page_url = upload_bytes(page.encode("utf-8"), f"{FOLDER}/comparison.html", "text/html; charset=utf-8")

    print(f"\n{'='*60}")
    print(f"COMPARAISON URL (a partager):")
    print(f"  {page_url}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
