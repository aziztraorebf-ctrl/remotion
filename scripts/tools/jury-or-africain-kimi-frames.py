#!/usr/bin/env python3
"""
Jury Kimi sur frames PNG (Kimi ne supporte pas MP4 direct).
"""

import os
import sys
import base64
import json
import requests
from dotenv import load_dotenv

load_dotenv()

MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY")

FRAMES = [
    ("beat5-f30-afrique", "out/or-africain/frames/beat5-f30-afrique.png"),
    ("beat5-f100-soussol", "out/or-africain/frames/beat5-f100-soussol.png"),
    ("beat5-f160-discretement-flash", "out/or-africain/frames/beat5-f160-discretement-flash.png"),
    ("beat5-f240-parle", "out/or-africain/frames/beat5-f240-parle.png"),
    ("cta-f60-line2", "out/or-africain/frames/cta-f60-line2.png"),
    ("cta-f110-scintillement", "out/or-africain/frames/cta-f110-scintillement.png"),
]

CONTEXT = """CONTEXTE — Or Africain (Short documentaire 9:16, GeoAfrique YouTube/TikTok, ~99.5s)

Sujet : Le Ghana augmente ses royalties or de 5% a 12% malgre la pression de 6 gouvernements (USA/UK/Chine/Canada/Australie). Le Mali, Burkina Faso, Niger suivent. Souverainete economique africaine.

Tu vois 6 frames : 4 frames du **Beat 5 (verdict 10s)** + 2 frames du **CTA (4s)**.

Beat 5 narration (whispers) : "L'Afrique commence a changer les regles de son propre sous-sol. Discretement. Sans que personne n'en parle."
CTA narration : "Si tu veux des histoires que les medias ne racontent pas — abonne-toi."

Identite visuelle Or Africain :
- Palette : noir #0a0a0a, or #f5d547, orange #e89b3c, rouge #d32f2f
- Typo serif Garamond/Georgia pour moments "verdict premium"
- Background recurrent (Beats 1-2) : parchemin moderne PNG avec ornements coins
- Style : data-journalism premium type FT/Le Monde

Frames :
- f30 (1s in Beat5) : ligne 1 "L'Afrique commence a changer les regles / de son propre sous-sol."
- f100 (3.3s in Beat5) : meme moment plus tard
- f160 (5.3s in Beat5) : "Discretement" apparait avec flash crimson
- f240 (8s in Beat5) : 3 lignes empilees avec "Sans que personne n'en parle" en dernier
- CTA f60 (2s) : "Si tu veux des histoires que les medias ne racontent pas / — abonne-toi."
- CTA f110 (3.6s) : scintillement or final

QUESTIONS PRECISES POUR TOI

1. **Hierarchie typo Beat 5** : la taille du texte est-elle assez dominante ? Ou est-ce que le texte se perd dans un cadre vide ?
2. **Lisibilite + contraste** : le texte ressort-il bien sur le fond noir/parchemin ? Y a-t-il des problemes de halo, blur ou gris-sur-gris ?
3. **Closure badge "$5,589" en haut a droite Beat 5** : est-il pertinent ici (cloture la boucle avec Beat 1 = compteur or) ou parasite (hors-sujet du verdict politique) ?
4. **Empilement 3 lignes Beat 5 (frame 240)** : est-ce visuellement charge / etouffant, ou OK / lisible ?
5. **Rupture Beat 5 -> CTA** : passer du parchemin texture au noir pur du CTA — rupture trop brutale ou bien marquee comme final ?
6. **Cloture du Short** : qu'est-ce qui MANQUE absolument pour rendre ce Short publishable niveau premium documentaire ?

Format : reponse courte et factuelle, 1 paragraphe par question. Score Beat5 /10, CTA /10. Top 1 priorite a fixer.
"""


def encode_b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def main():
    if not MOONSHOT_API_KEY:
        print("MOONSHOT_API_KEY missing"); sys.exit(1)

    content = []
    for label, path in FRAMES:
        if not os.path.exists(path):
            print(f"MISSING {path}"); sys.exit(1)
        b64 = encode_b64(path)
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    content.append({"type": "text", "text": CONTEXT})

    print(f"Sending {len(FRAMES)} frames to Kimi K2.5...")
    r = requests.post(
        "https://api.moonshot.ai/v1/chat/completions",
        headers={"Authorization": f"Bearer {MOONSHOT_API_KEY}", "Content-Type": "application/json"},
        json={"model": "kimi-k2.5", "messages": [{"role": "user", "content": content}], "max_tokens": 4096, "temperature": 1},
        timeout=180,
    )
    if r.status_code != 200:
        print(f"Kimi {r.status_code}: {r.text[:500]}")
        sys.exit(1)
    data = r.json()
    text = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})
    cost = (usage.get("prompt_tokens", 0) * 0.60 + usage.get("completion_tokens", 0) * 3.00) / 1_000_000
    print(f"\n=== KIMI K2.5 (${cost:.4f}) ===\n")
    print(text)

    with open("scripts/tools/jury-or-africain-kimi-results.json", "w", encoding="utf-8") as f:
        json.dump({"review": text, "cost": cost, "tokens": usage}, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
