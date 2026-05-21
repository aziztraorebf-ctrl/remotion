---
name: Jury LLM — APIs et commandes exactes
description: Commandes Python exactes pour appeler GPT-4o, Grok, Kimi dans les jurys créatifs
type: feedback
---

Le visual-producer DOIT utiliser ces commandes exactes. Ne pas improviser les endpoints.

**Why:** Or Africain 2026-05-06 — 48 appels d'outils pour un jury de 3 modèles. Cause : agent cherchait les bons endpoints. Ces commandes sont validées et fonctionnelles.

---

## GPT-4o — OpenAI directe

```python
import openai, base64, os

client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def encode_image(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": PROMPT},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{encode_image(IMAGE_PATH)}"}}
        ]
    }],
    max_tokens=1500
)
print(response.choices[0].message.content)
```

---

## Grok — xAI API

```python
import openai, base64, os

client = openai.OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1"
)

response = client.chat.completions.create(
    model="grok-4-fast-non-reasoning",  # MAJ 2026-05-08 : grok-2-vision-1212 retire
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": PROMPT},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{encode_image(IMAGE_PATH)}"}}
        ]
    }],
    max_tokens=1500
)
print(response.choices[0].message.content)
```

---

## Kimi K2.5 — Moonshot API

```python
import requests, base64, os

def kimi_review(image_path, prompt):
    with open(image_path, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode("utf-8")

    response = requests.post(
        "https://api.moonshot.ai/v1/chat/completions",  # MAJ 2026-05-08 : .ai (international), pas .cn
        headers={
            "Authorization": f"Bearer {os.environ['MOONSHOT_API_KEY']}",
            "Content-Type": "application/json"
        },
        json={
            "model": "moonshot-v1-8k",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}}
                ]
            }],
            "max_tokens": 1500
        }
    )
    return response.json()["choices"][0]["message"]["content"]
```

---

## Workflow jury standard (à copier dans chaque brief visual-producer)

1. Charger toutes les images storyboard en base64
2. Appeler GPT-4o sur toutes les images + prompt jury
3. Appeler Grok sur toutes les images + même prompt
4. Appeler Kimi sur toutes les images + même prompt
5. Compiler les 3 réponses par question
6. Présenter à Aziz pour tri

**Durée cible : 5-8 minutes max pour 3 jurés + 14 images.**
