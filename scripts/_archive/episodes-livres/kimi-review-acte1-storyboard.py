"""Send Acte I storyboard v3 to Kimi K2.5 for narrative pacing review.

Kimi is asked to evaluate the mapping between narration (3 sub-scenes) and visual
panels (6), detect structural issues, and recommend adjustments BEFORE we commit
to a ~$4.50 Seedance generation.

Output: JSON + human-readable markdown to /tmp/kimi-acte1-review.md
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
STORYBOARD = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte1/storyboard-6panels-v3.png"
OUTPUT = Path("/tmp/kimi-acte1-review.md")

PROMPT = """Tu es Kimi, directeur artistique senior pour une production video d'histoires africaines (format YouTube Shorts 9:16, 1080x1920).

Je te montre un storyboard 6 panneaux pour l'Acte I d'un Short biographique sur Soundjata Keita (fondateur de l'empire du Mali, XIIIe siecle). Ce storyboard va etre envoye a Seedance 2.0 (bytedance reference-to-video) pour generer un clip video de 15 secondes.

Voici les 3 phrases de narration qui accompagnent ce clip, avec leurs timings precis mesures par Whisper :

PHRASE 1 (0.00s -> 4.94s, duree 4.94s) :
"XIIIe siecle, le pays mandingue est ecrase sous la tyrannie d'un roi-sorcier."

PHRASE 2 (5.38s -> 9.48s, duree 4.10s) :
"Mais une prophetie circule, un enfant naitra qui liberera le peuple."

PHRASE 3 (9.78s -> 12.12s, duree 2.34s) :
"Le probleme, cet enfant ne peut pas marcher."

MAPPING PREVU narration -> panneaux :
- Panneaux 1-2 (WIDE TYRANNY + MEDIUM TYRANT SHADOW) pour Phrase 1 : 2.47s par panneau
- Panneaux 3-4 (WIDE PROPHECY + CLOSE PROPHET) pour Phrase 2 : 2.05s par panneau
- Panneaux 5-6 (MEDIUM SOGOLON & BABY + CLOSE BABY SOUNDJATA) pour Phrase 3 : 1.17s par panneau

CONTEXTE IMPORTANT POUR TON ANALYSE :
- Ce clip est l'OUVERTURE du Short (les 12 premieres secondes). C'est donc le hook - si le viewer decroche ici, il decroche pour toute la video.
- Le viewer cible : grand public curieux d'histoire africaine, attention span Shorts (3-4s pour accrocher).
- Soundjata sera montre enfant handicape qui ne peut pas marcher - c'est un paradoxe par rapport a la prophetie "il liberera le peuple". C'est la tension narrative principale du Short.
- Sogolon (panneau 5) est la mere de Soundjata. Elle reviendra dans l'Acte II (humiliation publique).
- Les clips precedents (versions v1) etaient trop rapides : 9 panneaux en 13s = 1.4s par plan = les images n'avaient pas le temps de vivre. On est passe a 6 panneaux pour donner plus de temps.

TA MISSION : Analyse ce storyboard avec le mapping timing. Reponds aux 5 questions suivantes :

## Q1 - Fidelite narrative
Est-ce que la sequence visuelle (6 panneaux dans l'ordre) raconte la meme histoire que la narration ? Y a-t-il des panneaux qui detournent ou contredisent le texte ?

## Q2 - Rythme narration vs visuel
Le mapping panneau-phrase est-il equilibre ? Specifiquement : le panneau 6 (punchline "il ne peut pas marcher") n'a que 1.17s - est-ce suffisant pour qu'un viewer l'enregistre emotionnellement ? Si non, comment redistribuer le temps ?

## Q3 - Impact d'ouverture (hook)
Les 2 premiers panneaux (2.47s chacun) sont le hook absolu. Est-ce que WIDE TYRANNY + MEDIUM TYRANT SHADOW suffisent a accrocher un viewer Shorts en 4.94s ? Y a-t-il un meilleur ordre ?

## Q4 - Redondance ou maillon faible
Parmi les 6 panneaux, y en a-t-il un qui n'apporte rien d'unique et pourrait etre remplace par quelque chose de plus fort ?

## Q5 - Recommandations pour Seedance
Sachant que Seedance 2.0 reference-to-video tend a :
- sur-decouper (creer des coupes rapides entre panneaux au lieu de tenir chaque plan)
- inventer des personnages non presents dans le storyboard (ex: clip v1 avait un homme adulte en meditation absent du storyboard)
- oublier le panneau final (ex: clip v1 n'avait PAS de close baby Soundjata a la fin)

Que conseillerais-tu d'ecrire dans le prompt Seedance pour forcer la fidelite au storyboard et le respect du rythme 2-2.5s par panneau ?

FORMAT DE REPONSE : pour chaque question, verdict clair (1-2 phrases) + justification courte (2-3 phrases max). Pas de blabla, pas de compliments, je veux du feedback actionnable."""


def call_kimi(image_path: Path, prompt: str) -> str:
    with open(image_path, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode()

    payload = {
        "model": "kimi-k2.5",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_b64}"},
                    },
                ],
            }
        ],
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
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"HTTP {e.code}: {body}")
        raise

    if "choices" not in data:
        print("ERROR from Moonshot:", json.dumps(data, indent=2))
        sys.exit(1)
    # Debug full response
    print("DEBUG response keys:", list(data.keys()))
    print("DEBUG choice keys:", list(data["choices"][0].keys()))
    print("DEBUG finish_reason:", data["choices"][0].get("finish_reason"))
    print("DEBUG usage:", data.get("usage"))
    msg = data["choices"][0]["message"]
    print("DEBUG message keys:", list(msg.keys()))
    return msg.get("content") or msg.get("reasoning_content") or ""


def main():
    if not STORYBOARD.exists():
        print(f"ERROR: storyboard not found at {STORYBOARD}")
        sys.exit(1)

    print(f"[1/3] Storyboard: {STORYBOARD.name} ({STORYBOARD.stat().st_size} bytes)")
    print("[2/3] Sending to Kimi K2.5...")
    review = call_kimi(STORYBOARD, PROMPT)

    print("[3/3] Saving review...")
    OUTPUT.write_text(
        f"# Kimi K2.5 - Review Acte I Storyboard v3\n\n"
        f"Storyboard: {STORYBOARD}\n\n"
        f"---\n\n{review}\n"
    )
    print(f"  SAVED {OUTPUT}")
    print()
    print("=" * 80)
    print(review)
    print("=" * 80)


if __name__ == "__main__":
    main()
