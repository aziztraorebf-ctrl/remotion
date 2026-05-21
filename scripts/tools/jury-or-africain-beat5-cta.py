#!/usr/bin/env python3
"""
Jury Beat 5 + CTA — Or Africain (Short documentaire premium 9:16, serie Souverain).
Envoie les 2 MP4s a Kimi K2.5 ET Gemini 3 Pro pour avis croises.
Sauvegarde les reponses dans scripts/tools/jury-or-africain-beat5-cta-results.json.
"""

import os
import sys
import base64
import json
import time
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv()

MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

BEAT5_PATH = "out/or-africain/beat5-v1.mp4"
CTA_PATH = "out/or-africain/cta-v1.mp4"

CONTEXT = """CONTEXTE PROJET — Or Africain (serie Souverain, GeoAfrique YouTube/TikTok Short 9:16, 1080x1920, 30fps)

Total video : ~99.5s — Documentaire data-journalism premium sur le Ghana qui a augmente ses royalties sur l'or de 5% a 12% malgre la pression de 6 gouvernements (USA, UK, Chine, Canada, Australie + Nigeria implicite). Mouvement plus large : Mali, Burkina Faso, Niger nationalisent leur sous-sol. Sujet : souverainete economique africaine.

Structure du Short :
- Beat 1 (Hook 9.7s) : compteur or qui monte $1000 -> $5,589 sur fond parchemin moderne, badge "RECORD HISTORIQUE", sous-titres karaoke, narration "Le prix de l'or vient de battre tous les records / Six gouvernements se sont leves contre le Ghana / Le Ghana a signe quand meme"
- Beat 2 (Contexte 17.6s) : graphique +458% vs royalties 5% fixes, ecran "RIEN." plein cadre
- Beat 3a/3b (Le Fait + Pression 28.7s) : globe Mapbox zoom Ghana, drapeaux 5 pays, ecran rouge "N'ALLEZ PAS PLUS LOIN — CETTE LOI MENACE NOS INVESTISSEMENTS"
- Beat 4 (Twist 29.5s) : carte Afrique, cascade Mali $430M / Burkina / Niger, "4 PAYS — UN MEME SIGNAL"
- **Beat 5 (Verdict 10s) — A REVIEWER** : transition vers conclusion calme, 3 lignes typographiques serif sur fond parchemin, narration whispered "L'Afrique commence a changer les regles de son propre sous-sol. Discretement. Sans que personne n'en parle."
- **CTA (4s) — A REVIEWER** : fond noir, 2 lignes "Si tu veux des histoires que les medias ne racontent pas / — abonne-toi.", micro-scintillement or final

Identite visuelle Or Africain :
- Palette : noir profond #0a0a0a, or #f5d547, orange #e89b3c, rouge #d32f2f, gris #4a4a4a
- Typo serif elegant (Garamond/Georgia) pour les moments "verdict premium"
- Background recurrent : parchemin moderne (PNG, ornements coins)
- Style : data-journalism premium type FT/Le Monde, NOT TikTok-flashy
- Public : francophone curieux, niveau editorial Brut/Konbini upgrade

CONSIGNE REVIEW
Tu evalues UNIQUEMENT Beat 5 (10s) et CTA (4s) — les 2 derniers segments du Short. Pas la qualite technique pixel art, mais la **direction artistique premium** et **l'efficacite narrative pour cloturer le Short**.

Donne ton avis structure :

1. **BEAT 5 (verdict 10s)** :
   - Forces : ce qui fonctionne deja
   - Faiblesses : ce qui rate ou affaiblit l'impact
   - 3 ameliorations concretes (pas vagues, du type "ajoute X a Y position", "remplace Z par W")

2. **CTA (4s)** :
   - Forces, faiblesses, 3 ameliorations concretes

3. **Cohesion Beat 4 -> Beat 5 -> CTA** :
   - La transition fonctionne-t-elle ? Le rythme est-il le bon (apres l'intensite Beat 4) ?
   - Le CTA ferme-t-il bien la boucle visuelle/narrative ?

4. **Score /10** par segment, et **TOP PRIORITE** unique a fixer en premier.

Sois direct, factuel, pas de blabla. Pense pour un realisateur qui veut publier dans 30 minutes. Indique aussi s'il faut **simplifier davantage** vs **enrichir**.
"""


def encode_b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def call_kimi(prompt, files):
    if not MOONSHOT_API_KEY:
        return None, "no MOONSHOT_API_KEY"
    content = []
    for label, path in files:
        b64 = encode_b64(path)
        content.append({"type": "image_url", "image_url": {"url": f"data:video/mp4;base64,{b64}"}})
    content.append({"type": "text", "text": prompt})

    try:
        r = requests.post(
            "https://api.moonshot.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {MOONSHOT_API_KEY}", "Content-Type": "application/json"},
            json={"model": "kimi-k2.5", "messages": [{"role": "user", "content": content}], "max_tokens": 4096, "temperature": 1},
            timeout=180,
        )
        if r.status_code == 200:
            data = r.json()
            text = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})
            cost = (usage.get("prompt_tokens", 0) * 0.60 + usage.get("completion_tokens", 0) * 3.00) / 1_000_000
            return text, f"OK Kimi (${cost:.4f})"
        else:
            return None, f"Kimi {r.status_code}: {r.text[:200]}"
    except Exception as e:
        return None, f"Kimi exception: {e}"


def call_gemini(prompt, files):
    if not GEMINI_API_KEY:
        return None, "no GEMINI_API_KEY"
    # Gemini accepte les MP4 inline jusqu'a ~20MB. Nos fichiers font 1.4MB et 350KB.
    parts = [{"text": prompt}]
    for label, path in files:
        b64 = encode_b64(path)
        parts.append({"inline_data": {"mime_type": "video/mp4", "data": b64}})

    body = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 4096},
    }
    # Modele Gemini 3 Pro
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-latest:generateContent?key={GEMINI_API_KEY}"
    try:
        r = requests.post(url, headers={"Content-Type": "application/json"}, json=body, timeout=180)
        if r.status_code == 200:
            data = r.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            usage = data.get("usageMetadata", {})
            return text, f"OK Gemini (in:{usage.get('promptTokenCount','?')} out:{usage.get('candidatesTokenCount','?')})"
        else:
            # Fallback gemini-2.5-pro si gemini-3-pro indispo
            url2 = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}"
            r2 = requests.post(url2, headers={"Content-Type": "application/json"}, json=body, timeout=180)
            if r2.status_code == 200:
                data = r2.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text, "OK Gemini-2.5-pro fallback"
            return None, f"Gemini {r.status_code}: {r.text[:200]} | fallback {r2.status_code}: {r2.text[:200]}"
    except Exception as e:
        return None, f"Gemini exception: {e}"


def main():
    files = [("beat5", BEAT5_PATH), ("cta", CTA_PATH)]
    for label, p in files:
        if not os.path.exists(p):
            print(f"MISSING {p}")
            sys.exit(1)
        print(f"  {label}: {p} ({os.path.getsize(p)/1024:.0f} KB)")

    print()
    print("=== Kimi K2.5 ===")
    kimi_text, kimi_status = call_kimi(CONTEXT, files)
    print(kimi_status)
    if kimi_text:
        print(kimi_text[:500] + "..." if len(kimi_text) > 500 else kimi_text)

    print()
    print("=== Gemini 3 Pro ===")
    gem_text, gem_status = call_gemini(CONTEXT, files)
    print(gem_status)
    if gem_text:
        print(gem_text[:500] + "..." if len(gem_text) > 500 else gem_text)

    out = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "files": [{"label": l, "path": p} for l, p in files],
        "kimi": {"status": kimi_status, "review": kimi_text},
        "gemini": {"status": gem_status, "review": gem_text},
    }
    out_path = "scripts/tools/jury-or-africain-beat5-cta-results.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print()
    print(f"Saved: {out_path}")


if __name__ == "__main__":
    main()
