"""
kimi-video-review-custom.py — Review d'UNE vidéo par Kimi K2.5 avec un BRIEF LIBRE.

Équivalent Kimi de `gemini-video-review-custom.py` : il manquait à la boîte à outils. On avait
`kimi-video-compare.py` (2 vidéos, gabarit comparatif figé) et `kimi-frames-review.py` (frames
figées, donc aveugle au mouvement) — mais rien pour poser un brief libre sur UNE vidéo complète.
Créé 2026-07-29 pour obtenir un 2e regard indépendant sur l'assemblage CFA, en parallèle de Gemini.

POURQUOI un 2e modèle : la convergence de deux modèles indépendants est un signal fort.
⚠️ MAIS elle ne vaut QUE le critère qu'on leur donne (cf memory feedback
`convergence-modeles-vaut-le-critere-donne`) : ne JAMAIS souffler à Kimi les conclusions de
Gemini dans le brief, sinon il les confirme par construction et la convergence ne prouve rien.

Contraintes de l'API Moonshot (toutes documentées dans memory/tools/kimi-video-native-base64.md) :
  - vidéo en BASE64 uniquement (les liens HTTP publics sont refusés) ;
  - API Moonshot DIRECTE, pas OpenRouter (qui ne route pas l'input vidéo) ;
  - `temperature: 1` OBLIGATOIRE (le modèle rejette toute autre valeur) ;
  - `max_tokens` >= 16000 (modèle "thinking", tronque sinon) ;
  - fallback `content || reasoning_content` (content peut être null).
Fix IPv4 importé automatiquement (IPv6 mort en sandbox -> blocage indéfini sinon).

⛔ DOWNSCALER LA VIDÉO AVANT L'APPEL (720p CRF ~28). Le base64 gonfle de ~33 % : un full-HD de
48 Mo ferait un payload JSON de ~64 Mo.

USAGE :
  python3 scripts/tools/kimi-video-review-custom.py <video.mp4> <brief.txt> <out.md>
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel réseau

import json
import base64
import urllib.request
import urllib.error

KIMI_MODEL = "kimi-k2.5"
MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def to_data_url(path):
    with open(path, "rb") as f:
        return "data:video/mp4;base64," + base64.b64encode(f.read()).decode()


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    video, brief_path, out_path = sys.argv[1:4]

    for p in (video, brief_path):
        if not os.path.exists(p):
            print(f"[ERREUR] introuvable : {p}")
            sys.exit(1)

    load_env()
    key = os.getenv("MOONSHOT_API_KEY")
    if not key:
        print("[ERREUR] MOONSHOT_API_KEY absente du .env")
        sys.exit(1)

    size = os.path.getsize(video) / 1024 / 1024
    print(f"[kimi-video] {os.path.basename(video)} = {size:.1f} Mo")
    if size > 12:
        print("[kimi-video] ⚠️  >12 Mo : le payload base64 fera ~%.0f Mo. Downscaler d'abord." % (size * 1.34))

    brief = open(brief_path, encoding="utf-8").read()
    print("[kimi-video] encodage base64...")
    data_url = to_data_url(video)

    payload = {
        "model": KIMI_MODEL,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "video_url", "video_url": {"url": data_url}},
                {"type": "text", "text": brief},
            ],
        }],
        "max_tokens": 16000,   # modèle thinking : jamais moins
        "temperature": 1,      # SEULE valeur acceptée par kimi-k2.5
    }
    req = urllib.request.Request(
        MOONSHOT_URL, data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    print(f"[kimi-video] envoi à {KIMI_MODEL}...")
    try:
        with urllib.request.urlopen(req, timeout=900) as r:
            data = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        print(f"[kimi-video] HTTP {e.code}: {e.read().decode()[:1200]}")
        sys.exit(1)

    msg = data["choices"][0]["message"]
    text = msg.get("content") or msg.get("reasoning_content") or ""
    if not text.strip():
        print("[kimi-video] ⚠️  réponse VIDE (content ET reasoning_content) — payload trop gros ?")
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, "w", encoding="utf-8").write(text)
    print(f"\n[kimi-video] -> {out_path} ({len(text)} chars)\n")
    print("=" * 70)
    print(text)
    print("=" * 70)


if __name__ == "__main__":
    main()
