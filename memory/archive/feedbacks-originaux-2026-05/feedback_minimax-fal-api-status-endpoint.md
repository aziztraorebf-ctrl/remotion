---
name: Minimax fal.ai API — endpoint status change 2026-04-29
description: L'endpoint status fal.ai pour minimax-music a change. status_url ne contient plus la version, et les anciens scripts hardcodaient v2.6 dans le poll URL.
type: feedback
---

# Minimax fal.ai — endpoint status change

**Regle :** ne JAMAIS hardcoder l'URL `/v2.6/requests/{id}/status`. Toujours utiliser le `status_url` retourne par le submit response.

**Why :** test 2026-04-29 sur Atlas Mansa Moussa. Le script `generate-music-v2.py` qui marchait en session Tombouctou V8 (2026-04-29 matin) construisait l'URL status comme `https://queue.fal.run/fal-ai/minimax-music/v2.6/requests/{id}/status` avec GET. Reponse : **HTTP 405 Method Not Allowed** (allow: POST seulement). Resultat : timeout 600s, 0/1 OK.

**Cause racine :** fal.ai a change le routing — l'endpoint status ne contient plus `v2.6` dans l'URL. Le submit retourne maintenant explicitement le `status_url` correct : `https://queue.fal.run/fal-ai/minimax-music/requests/{id}/status` (sans v2.6).

**How to apply :**

```python
def submit_job(prompt: str) -> tuple[str, str, str]:
    """Returns (request_id, status_url, response_url)."""
    url = "https://queue.fal.run/fal-ai/minimax-music/v2.6"
    payload = {"prompt": prompt, "is_instrumental": True}
    headers = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}
    r = requests.post(url, json=payload, headers=headers, timeout=60)
    data = r.json()
    return (
        data.get("request_id", ""),
        data.get("status_url", ""),     # use this, don't construct yourself
        data.get("response_url", ""),
    )

def poll(status_url: str, result_url: str):
    headers = {"Authorization": f"Key {FAL_KEY}"}
    # GET on status_url returned by submit (no v2.6 in path)
    r = requests.get(status_url, headers=headers, timeout=30)
    ...
```

**Detection** : si tu vois 405 sur poll status → tu as hardcode l'URL. Verifier que tu utilises bien le `status_url` retourne par submit.

**Fichiers a corriger** : tous les scripts qui appellent fal.ai queue. Au moins :
- `quebec-jacques-poc/scripts-atlas/generate-music-v2.py` (Tombouctou)
- `quebec-jacques-poc/scripts-atlas/generate-music-mansa-moussa.py` (corrige 2026-04-29)
- Verifier aussi si autres projets utilisent fal.ai queue (Seedance, etc.)
