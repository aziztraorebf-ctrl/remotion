"""Send Acte IV Clip 1 storyboard to Kimi K2.5 for creative second opinion.

Context: we are stuck between v1 (3 major defects) and v2 (1 residual defect -
Soundjata exile looks too adult, should be the young child who just uprooted
the baobab, aged between child and young-adult warrior).

We ask Kimi: if YOU were the art director, what storyboard WOULD you propose
for this Acte IV Clip 1? Keep it simple but dynamic.

Input: our current v2 storyboard + full narration context + the young Soundjata
reference (frame from Acte III ending).

Output: Kimi's alternative proposal + critique of ours.
"""

import os
import sys
import base64
import json
import urllib.request
from pathlib import Path

# Load .env
env_path = Path(__file__).parent.parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

MOONSHOT_KEY = os.environ.get("MOONSHOT_API_KEY", "")
if not MOONSHOT_KEY:
    print("ERROR: MOONSHOT_API_KEY not set in .env")
    sys.exit(1)

REPO = Path("/Users/clawdbot/Workspace/remotion")
REFS_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4"

# Images to send to Kimi
CURRENT_STORYBOARD = REFS_DIR / "storyboard-acte4-clip1-4panels-v2.png"
YOUNG_SOUNDJATA = REFS_DIR / "soundjata-young-exile-ref.jpg"
ADULT_WARRIOR = REFS_DIR / "soundjata-adult-warrior-ref.png"
MESSAGERS = REFS_DIR / "messagers-cavaliers-ref.png"
MEMA_ENV = REFS_DIR / "mema-environment.png"

OUTPUT = Path("/tmp/kimi-acte4-storyboard-review.md")

PROMPT = """Tu es Kimi, directeur artistique senior pour une production video d'histoires africaines (format YouTube Shorts 9:16, 1080x1920, style flat BD illustre, ~13s par clip).

## CONTEXTE

Je produis l'Acte IV Clip 1 du Short biographique sur Soundjata Keita (fondateur de l'empire du Mali, XIIIe siecle). Ce clip doit raconter en 13 secondes une sequence de 3 phrases de narration + preparer une 4e phrase qui sera dans le clip suivant :

**PHRASE 1 (0.00s -> 3.70s, duree 3.70s) - sous-scene EXIL :**
"Chasse par la jalousie de la cour, il s'exile loin de sa terre."

**PHRASE 2 (4.48s -> 8.00s, duree 3.52s) - sous-scene MEMA :**
"Sept longues annees a Mema, a apprendre, a attendre."

**PHRASE 3 (8.00s -> 14.32s, duree 6.32s) - sous-scene MESSAGERS :**
"Quand le roi-sorcier Soumaoro ecrase son peuple, des messagers traversent tout le pays pour le retrouver."

(La phrase 4 "Le lion du Manden revient" est dans le clip 2 deja genere et valide - Soundjata chevauchant sabre leve au coucher de soleil.)

## CE QUE J'AI ESSAYE (v1 et v2 storyboard 4 panels)

L'image 1 que je te montre est mon storyboard v2 actuel (4 panels : WIDE EXIL, MEDIUM MEMA TRAINING, WIDE MESSAGERS GALOP, MEDIUM MESSAGERS KNEEL).

**Defauts v2 identifies par Aziz (le realisateur) :**
- Panel 1 EXIL : le Soundjata qui part est trop adulte. Il devrait etre le jeune Soundjata qui vient juste de soulever le baobab (Acte III). Voir image 2 = ref authentique du Soundjata jeune (enfant/adolescent torse nu, pagne simple, pieds nus, bras levés contre un baobab). C'est CE Soundjata qui s'exile, pas un jeune adulte en tunique blanche.
- Panel 2 : OK, mais Soundjata doit correspondre a la ref guerrier (image 3 = Soundjata adulte avec tunique blanche, sash rouge, sabre). La maturation entre panel 1 et panel 2 = 7 ans a Mema.
- Panel 3 GALOP : j'ai corrige v1 (de profil lateral -> slow-mo Seedance) vers v2 (cavaliers 3/4 frontal vers camera) mais ca reste statique. A revoir.
- Panel 4 KNEEL : fonctionne correctement.

## CONTRAINTES TECHNIQUES IMPORTANTES

- **Seedance 2.0 reference-to-video** va generer le clip. Paliers 1s, max 15s, palier choisi 13s.
- Seedance a des biais connus : (a) scenes contemplatives = quasi-statique, (b) animaux en mouvement lateral strict = slow-mo parasite, (c) transitions d'etat narratives (exil triste -> maturation fiere) = pas toujours bien rendues.
- Densite optimale : **4-5 panels pour 13s contemplatif multi-beats** (pas 9, pas 6 - on a teste). 4 panels = 3.25s par plan, respiration OK.
- Style : flat BD illustre semi-detaille, XIIIe siecle ouest-africain strict (pas d'elements modernes).

## REFS DISPONIBLES (images jointes)

- **Image 1** : storyboard v2 actuel (4 panels) - a critiquer
- **Image 2** : Soundjata JEUNE (frame extraite du clip Acte III, moment baobab) - doit etre le perso panel 1
- **Image 3** : Soundjata GUERRIER ADULTE (canon apres 7 ans a Mema) - panels 2 et 4
- **Image 4** : 3 messagers Mande (turbans bleu/rouge/vert, chevaux bai/noir/blanc)
- **Image 5** : environnement Mema (architecture rouge-terre + minaret + palmiers)

## TA MISSION

Repond aux 3 questions :

### Q1 - Critique du v2
Quelle est ta critique structurelle du storyboard v2 actuel (image 1) au-dela du defaut age Soundjata panel 1 deja identifie ? Est-ce que le decoupage 4 panels est pertinent ou tu proposerais une autre structure ?

### Q2 - Ta version du storyboard
Si TU etais le directeur artistique, quel storyboard proposerais-tu pour ces 13s ? Decris 4-5 panels avec pour chacun :
- Shot type (WIDE/MEDIUM/CLOSE)
- Angle camera (frontal / 3/4 / aerien / low angle...)
- Action precise (quoi bouge, comment)
- Duree (mapping avec la narration)
- Personnages presents (Soundjata jeune / Soundjata adulte / messagers)
- Element emotionnel dominant (melancolie, determination, supplication...)

**Garder simple mais dynamique.** Eviter la complexite (Seedance rate les trucs complexes). Privilegier **mouvement authentique** (pas le slow-mo trap) et **transitions emotionnelles lisibles**.

### Q3 - Panel le plus faible v2
Dans mon v2 actuel, quel panel est le plus faible narrativement et pourquoi ?

**FORMAT REPONSE** : concis, actionnable, pas de blabla. Je veux pouvoir implementer directement tes recommandations."""


def call_kimi(images: list, prompt: str) -> str:
    content = [{"type": "text", "text": prompt}]
    for img_path in images:
        with open(img_path, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode()
        mime = "image/jpeg" if img_path.suffix.lower() in (".jpg", ".jpeg") else "image/png"
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:{mime};base64,{img_b64}"},
        })

    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": content}],
        "temperature": 1,
        "max_tokens": 8000,
    }

    req = urllib.request.Request(
        "https://api.moonshot.ai/v1/chat/completions",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {MOONSHOT_KEY}",
            "Content-Type": "application/json",
        },
    )
    print("[calling Kimi K2.5 via Moonshot API...]")
    try:
        with urllib.request.urlopen(req, timeout=240) as resp:
            data = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"HTTP {e.code}: {body}")
        raise

    if "choices" not in data:
        print("ERROR from Moonshot:", json.dumps(data, indent=2))
        sys.exit(1)
    print("DEBUG usage:", data.get("usage"))
    msg = data["choices"][0]["message"]
    return msg.get("content") or msg.get("reasoning_content") or ""


def main():
    images = [CURRENT_STORYBOARD, YOUNG_SOUNDJATA, ADULT_WARRIOR, MESSAGERS, MEMA_ENV]
    print(f"[1/3] Sending {len(images)} images to Kimi...")
    for img in images:
        if not img.exists():
            print(f"ERROR: missing {img}")
            sys.exit(1)
        print(f"  OK {img.name} ({img.stat().st_size} bytes)")

    print("[2/3] Calling Kimi K2.5...")
    review = call_kimi(images, PROMPT)

    print("[3/3] Saving review...")
    OUTPUT.write_text(
        f"# Kimi K2.5 - Creative Second Opinion for Acte IV Clip 1 Storyboard\n\n"
        f"Images sent: {[i.name for i in images]}\n\n"
        f"---\n\n{review}\n"
    )
    print(f"  SAVED {OUTPUT}")
    print()
    print("=" * 80)
    print(review)
    print("=" * 80)


if __name__ == "__main__":
    main()
