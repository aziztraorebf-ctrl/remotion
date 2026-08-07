# Grok (xAI) — capacités confirmées

> Créé 2026-08-07. Modèle texte déjà utilisé dans le projet pour jury créatif (voir
> `scripts/tools/jury-script-saas-llm.py`, `jury-script-creatif-llm.py` : `grok-4.20-reasoning`
> via `https://api.x.ai/v1/chat/completions`).

## Grok vision — confirmé fonctionnel (2026-08-07)

`grok-4.20-reasoning` accepte une image en payload multimodal, **même format qu'OpenAI/GPT** :

```python
payload = {
    "model": "grok-4.20-reasoning",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}},
            ],
        }
    ],
}
r = requests.post(
    "https://api.x.ai/v1/chat/completions",
    headers={"Authorization": f"Bearer {XAI_API_KEY}", "Content-Type": "application/json"},
    json=payload, timeout=300,
)
```

Testé la première fois sur une planche contact (grille de frames début/milieu/fin par panneau,
composée en une seule image) dans le cadre d'un jury motion design à 4 modèles (NorthShield,
2026-08-07) — statut HTTP 200, réponse exploitée directement, verdict cohérent avec les 3 autres
modèles (Gemini, Kimi, GPT).

Jusqu'ici, aucun script dédié n'expose ce mode vision — l'appel a été fait ad hoc (script Python
inline). Si le besoin se répète (jury vidéo/motion à 4 modèles), envisager un script
`scripts/tools/grok-vision-breakdown.py` sur le modèle de
`scripts/tools/openrouter-vision-breakdown.py` (même contrat : `--model`, `--image`,
`--prompt-file`, `--output`).

## Pattern jury motion design vidéo (4 modèles, pas de script unique existant)

Pour juger une vidéo de motion design/animation (pas juste script/thumbnail — les jurys
existants `jury-*-llm.py` ne couvrent pas ce cas) :
- **Gemini 3.1 Pro + Kimi K2.5** : vidéo complète en natif via
  `scripts/tools/gemini-video-review-custom.py <video> <brief.txt> <out.md>` et
  `scripts/tools/kimi-video-compare.py --ref <video> --new <video> --question "<brief>"`
  (même vidéo aux 2 slots pour neutraliser le mode comparatif, cf `memory/tools/review-video-llm-scripts.md`).
- **GPT-5.5 + Grok** : pas de vidéo native fiable pour ces deux → composer une **planche
  contact** (grille N panneaux × 3 colonnes début/milieu/fin, avec labels) en une seule image
  PNG, envoyée via `openrouter-vision-breakdown.py` (GPT) et l'appel direct ci-dessus (Grok).
  Préciser explicitement dans le prompt que l'image est une planche contact et que le jugement
  de mouvement doit se faire par comparaison entre les 3 frames d'une même ligne.
