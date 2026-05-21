---
name: Twelve Labs — Video Intelligence API
description: Outil d'analyse vidéo par IA — résumé, ton, rétention, artefacts, cohérence personnage. Intégré pipeline GeoAfrique mai 2026.
type: reference
---

# Twelve Labs

## Accès
- API Key : dans `.env` → `TWELVE_LABS_API_KEY`
- Base URL : `https://api.twelvelabs.io/v1.3`
- Free tier : 600 minutes offertes, pas de carte requise

## Index actifs
- `69fd2aeb0907b01eec7983f1` → **GeoAfrique-Analyse** (Pegasus 1.2) — index de production
- `69fd261a0907b01eec7981bc` → My Index Default (Marengo 3.0) — search only, pas de génération texte

## Modèles
- **Pegasus 1.2** : génération de texte (résumé, analyse, questions) — à utiliser pour notre pipeline
- **Marengo 3.0** : recherche sémantique dans la vidéo (search par timestamp) — usage secondaire

## Upload + poll (pattern validé)
```bash
# Upload
curl -X POST "https://api.twelvelabs.io/v1.3/tasks" \
  -H "x-api-key: $TWELVE_LABS_API_KEY" \
  -F "index_id=69fd2aeb0907b01eec7983f1" \
  -F "video_file=@/chemin/vers/video.mp4" \
  -F "language=fr"
# Retourne : {"_id": "TASK_ID", "video_id": "VIDEO_ID"}

# Poll jusqu'à ready
curl "https://api.twelvelabs.io/v1.3/tasks/TASK_ID" \
  -H "x-api-key: $TWELVE_LABS_API_KEY"
# Attendre status = "ready" (typiquement 15-30s pour 90-166s de vidéo)
```

## Analyse (pattern validé)
```bash
curl -X POST "https://api.twelvelabs.io/v1.3/analyze" \
  -H "x-api-key: $TWELVE_LABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"video_id": "VIDEO_ID", "prompt": "..."}'
# Retourne un stream NDJSON — extraire avec : grep '"text"' | sed 's/.*"text":"//;s/".*//' | tr -d '\n'
```

## Endpoints dépréciés (ne pas utiliser)
- `/generate` → n'existe pas
- `/summarize` → déprécié depuis jan 2026, utiliser `/analyze`

## Ce qu'il fait bien (validé sur Or Africain + Sonjata)
- Résumé narratif complet et précis — lit le texte à l'écran, comprend l'arc
- Détection du ton (militant vs narratif vs informatif) avec exemples précis
- Timestamps de risque de perte d'attention — fiable à 70-80%
- Recommandation plateforme (YouTube vs TikTok) — raisonnement solide
- Reformulation CTA — utile comme base, à affiner
- Cohérence personnage sur vidéos avec continuité narrative construite (ex: Sunjata enfant→adulte via Gemini)

## Limites (validées)
- Détection morphing subtil Seedance : partielle (60-70%) — manque les cas fins
- Cohérence personnage entre runs Seedance distincts : interprète narrativement au lieu de détecter techniquement
- Style visuel : trop indulgent, dit "aucune rupture" même quand il y en a
- Logs : streaming NDJSON, pas de JSON simple — parser avec grep/sed

## Place dans le pipeline GeoAfrique
Étape après render final, AVANT publication :

```
Render final → Twelve Labs (analyse globale) → Kimi (vérification artefacts précis) → Aziz (validation finale)
```

### Questions standard à poser à chaque vidéo
1. Description générale + arc narratif
2. Ton perçu (militant ? informatif ? narratif ?) + exemples précis
3. Timestamps risque de perte d'attention
4. YouTube Shorts vs TikTok/Reels
5. Reformulation CTA (3 versions)
6. Détection artefacts visuels (morphing, déformations, transitions ratées)
7. Cohérence du personnage principal

## Coût estimé
- Upload + indexation : gratuit (déduit des 600 min)
- Analyse Pegasus : ~$0.042/min indexée + tokens output
- Or Africain (96s) + Sonjata (166s) = ~4.4 min consommées sur free tier
- Budget estimé par vidéo : $0.05-0.15 après free tier épuisé
