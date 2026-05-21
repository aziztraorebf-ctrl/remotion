"""
Upload Kora & Cartes brand identity images to Vercel Blob
and generate a mobile-first HTML review page.
"""

import os
import sys
from pathlib import Path
from datetime import datetime
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

BLOB_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
BLOB_API_URL = "https://blob.vercel-storage.com"
SOURCE_DIR = ROOT / "branding" / "koraetcartes"
FOLDER = "koraetcartes/branding-v1"
PUBLIC_BASE = "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com"

if not BLOB_TOKEN:
    sys.exit("ERROR: BLOB_READ_WRITE_TOKEN missing")


def upload(data: bytes, pathname: str, content_type: str) -> str:
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
    if response.status_code not in (200, 201):
        raise RuntimeError(f"Upload failed {response.status_code}: {response.text[:300]}")
    return response.json()["url"]


LOGO_FILES = [
    ("logo-B-carte-kora-v2.png", "⭐ Logo B v2 — Carte + Kora corrigée (1 manche)", "Note Claude : 7.5/10 (vs 6/10 v1). Kora maintenant à 1 seul manche, anatomiquement correcte. Continent indigo + cuivre intact. Compromis : la kora cache encore le Sahel central (zones Mansa Moussa/Tombouctou)."),
    ("logo-C-monogramme-KC-v2.png", "⭐ Logo C v2 — Monogramme K&C (lettre C corrigée)", "Note Claude : 8/10 (vs 7/10 v1). Lettre C maintenant clairement ouverte sur la droite, on lit nettement K&C. Premium, intemporel, parfait en miniature. Top pick Claude."),
    ("logo-A-kora-stylisee.png", "Logo A — Kora stylisée frontale (v1)", "Note Claude : 7/10. Lisible, élégant. Petit défaut technique : 2 manches latéraux (vraie kora a 1 seul manche). Très bon en miniature."),
    ("logo-B-carte-kora.png", "Logo B v1 — Carte Afrique + Kora (avant correction)", "Note Claude : 6/10. Version originale avant correction de la kora. Pour comparaison avec v2."),
    ("logo-C-monogramme-KC.png", "Logo C v1 — Monogramme K&C (avant correction)", "Note Claude : 7/10. Version originale avant correction de la lettre C. Pour comparaison avec v2."),
    ("logo-D-cordon-meridien.png", "Logo D — Cordon → Méridien", "Note Claude : 5/10. Concept conceptuellement le plus fort mais exécution échoue. Trop minimaliste, ressemble à un point d'interrogation. Kora microscopique."),
]

BANNER_FILES = [
    ("banner-A-carte-stylisee.png", "Bannière A — Carte stylisée", "Note Claude : 9/10. ⭐ La meilleure. Cohérence éditoriale parfaite, lisibilité max. Continent indigo + routes copper = signature claire."),
    ("banner-B-cordon-route.png", "Bannière B — Cordon-route", "Note Claude : 3/10. ⚠️ Texte '1546px' apparaît littéralement sur l'image (bug Gemini). Kora photo-réaliste tranche avec style. À régénérer."),
    ("banner-C-galerie-portraits.png", "Bannière C — Galerie portraits", "Note Claude : 6/10. Format incorrect (~1.9:1 au lieu de 16:9). Les 4 portraits sont quasi-identiques. Concept intéressant mais exécution moyenne."),
]


def main():
    print(f"Uploading from: {SOURCE_DIR}")
    print(f"Target: {FOLDER}/")
    print()

    uploaded = {}

    print("--- LOGOS ---")
    for filename, title, note in LOGO_FILES:
        src = SOURCE_DIR / filename
        if not src.exists():
            print(f"  MISSING: {filename}")
            continue
        url = upload(src.read_bytes(), f"{FOLDER}/{filename}", "image/png")
        uploaded[filename] = url
        print(f"  {filename} -> {url}")

    print("\n--- BANNERS ---")
    for filename, title, note in BANNER_FILES:
        src = SOURCE_DIR / filename
        if not src.exists():
            print(f"  MISSING: {filename}")
            continue
        url = upload(src.read_bytes(), f"{FOLDER}/{filename}", "image/png")
        uploaded[filename] = url
        print(f"  {filename} -> {url}")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    logo_html = ""
    for filename, title, note in LOGO_FILES:
        if filename not in uploaded:
            continue
        logo_html += f"""
<div class="card">
  <h3>{title}</h3>
  <img src="{uploaded[filename]}" alt="{title}" />
  <p class="note">{note}</p>
  <p class="filename"><code>{filename}</code></p>
</div>
"""

    banner_html = ""
    for filename, title, note in BANNER_FILES:
        if filename not in uploaded:
            continue
        banner_html += f"""
<div class="card banner-card">
  <h3>{title}</h3>
  <img src="{uploaded[filename]}" alt="{title}" />
  <p class="note">{note}</p>
  <p class="filename"><code>{filename}</code></p>
</div>
"""

    page = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kora &amp; Cartes — Review identité visuelle V1</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0D1B3D;
  color: #F5F1E8;
  padding: 20px 16px 60px;
  max-width: 760px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 16px;
}}
h1 {{
  font-size: 28px;
  margin-bottom: 8px;
  color: #F5F1E8;
  font-family: Georgia, 'Times New Roman', serif;
}}
.tagline {{
  color: #B87333;
  font-style: italic;
  margin-bottom: 24px;
  font-size: 15px;
}}
.meta {{
  color: #8a93a8;
  font-size: 13px;
  margin-bottom: 32px;
  border-bottom: 1px solid #1a2a52;
  padding-bottom: 16px;
}}
h2 {{
  font-size: 20px;
  color: #B87333;
  margin: 32px 0 16px;
  border-left: 3px solid #B87333;
  padding-left: 12px;
}}
.card {{
  background: #0a1530;
  border: 1px solid #1a2a52;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}}
.card h3 {{
  font-size: 17px;
  color: #F5F1E8;
  margin-bottom: 12px;
  font-family: Georgia, serif;
}}
.card img {{
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  background: #fff;
}}
.note {{
  font-size: 14px;
  color: #c4cce0;
  margin-top: 12px;
  line-height: 1.5;
}}
.filename {{
  font-size: 12px;
  color: #6e7896;
  margin-top: 8px;
}}
.filename code {{
  background: #1a2a52;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 11px;
}}
.recap {{
  background: #B87333;
  color: #0D1B3D;
  padding: 16px;
  border-radius: 12px;
  margin: 24px 0;
}}
.recap h3 {{
  font-size: 16px;
  margin-bottom: 8px;
  color: #0D1B3D;
}}
.recap p {{
  font-size: 14px;
  line-height: 1.5;
}}
</style>
</head>
<body>

<h1>Kora &amp; Cartes</h1>
<p class="tagline">Cartes animées et héros oubliés. Ce que l'école n'a pas raconté.</p>
<p class="meta">Review identité visuelle V1 — {timestamp}<br>
Palette : Indigo nuit #0D1B3D · Cuivre brossé #B87333 · Crème #F5F1E8</p>

<div class="recap">
  <h3>Top picks Claude (après itération v2)</h3>
  <p><strong>Bannière A</strong> = 9/10, à garder telle quelle. Pour le logo : <strong>Logo C v2</strong> (8/10, monogramme K&amp;C corrigé) ou <strong>Logo B v2</strong> (7.5/10, carte+kora corrigée). À départager selon : signal éditorial premium (C) ou signal africain immédiat (B).</p>
</div>

<h2>4 concepts logos</h2>
{logo_html}

<h2>3 concepts bannières</h2>
{banner_html}

<div class="recap">
  <h3>Prochaine étape</h3>
  <p>Choisis 1 logo + 1 bannière. Si besoin, on lance 1-2 itérations chirurgicales pour ajuster (corriger lettre C, ajuster format, etc.) avant validation finale.</p>
</div>

</body>
</html>
"""

    page_url = upload(page.encode("utf-8"), f"{FOLDER}/review.html", "text/html; charset=utf-8")
    print()
    print("=" * 70)
    print(f"REVIEW PAGE: {page_url}")
    print("=" * 70)


if __name__ == "__main__":
    main()
