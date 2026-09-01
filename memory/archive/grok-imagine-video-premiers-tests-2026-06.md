# Grok Imagine Video 1.5 — état des tests, pipelines validés, décisions (premiers tests, 2026-06-01)

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** par les découvertes plus mûres de
> `memory/tools/grok-imagine-rules.md` (R6 Video Extension cassée sur 1.5, gotchas prompts, etc.)
> — conservé pour les infos fal.ai pricing/routes et les refs de style qui n'apparaissent pas
> dans le fichier actuel.

Modèle sorti le 31 mai 2026. Décision à l'époque : attendre stabilisation avant tests sérieux.

## Pipelines disponibles (état 2026-06-01)

| Route | Statut | Notes |
|---|---|---|
| fal.ai `xai/grok-imagine-video/v1.5/image-to-video` | STABLE | Testé par Aziz — style respecté, ethnicité correcte |
| fal.ai `xai/grok-imagine-video/reference-to-video` | INSTABLE | 504 persistant au lancement |
| API xAI directe `grok-imagine-video-1.5-preview` | INSTABLE | Contamination entre requêtes, ethnicité non respectée |

## Résultats observés (2026-06-01)

- Test Aziz via fal.ai image-to-video v1.5 + image Thiaroye → style cartoon respecté, personnages africains corrects, animation naturelle
- Test Claude via API xAI directe → personnage asiatique, éléments mélangés entre requêtes, sous-titres résiduels

## Pricing (fal.ai, 2026-06-01)

- image-to-video standard : $0.07/s à 720p
- image-to-video v1.5 : $0.14/s à 720p
- reference-to-video : $0.07/s à 720p (multi-ref jusqu'à 7 images)
- text-to-video : $0.07/s à 720p

## Clés disponibles

- `XAI_API_KEY` dans `.env` — API xAI officielle
- `FAL_KEY` dans `.env` — fal.ai PAYG

## REF utilisées pour les tests

- Style : `public/_shared/refs/style/sonjata-storybook-warm/REF-sonjata-ironbar.png`
- Style froid : `public/_shared/refs/style/thiaroye-storybook-cold/REF-camp-soldiers.png`
- Catbox Sonjata : `https://files.catbox.moe/is7lup.png`
- Catbox Thiaroye : `https://files.catbox.moe/4508f5.png`

## Polling API xAI (référence historique)

```python
# Soumettre
POST https://api.x.ai/v1/videos/generations
{"model": "grok-imagine-video-1.5-preview", "prompt": "...", "image": {"url": "..."}, "duration": 8}
# Réponse : {"request_id": "..."}

# Poller
GET https://api.x.ai/v1/videos/{request_id}
# 202 = pending, 200 + status "done" = terminé, 400 + "rejected" = modération
```
