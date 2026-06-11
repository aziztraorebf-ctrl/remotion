---
name: postiz
description: "Guide complet Postiz — rôle TikTok ONLY, limites, workflow REST API, IDs intégrations, erreurs connues"
metadata:
  type: reference
---

# Postiz — Guide de référence complet

> Postiz = outil EXCLUSIF TikTok pour Kora & Cartes. RIEN d'autre.
> Claude le pilote via REST API (pas de MCP Postiz — utiliser `requests` Python directement).

---

## Rôle dans l'architecture

| Plateforme | Outil | Pourquoi |
|------------|-------|---------|
| TikTok | **Postiz** | Frame 0 = thumbnail automatique, pas de config manuelle |
| YouTube | TryPost (pas Postiz) | Analytics TryPost |
| Instagram | TryPost (pas Postiz) | Analytics TryPost |
| Facebook | TryPost (pas Postiz) | Analytics TryPost |

**Règle absolue** : Postiz = TikTok uniquement. Toute autre plateforme sur Postiz = erreur d'architecture.

---

## IDs intégrations (Kora & Cartes)

```
TikTok : cmpsuyefy00hbru0yqe2ez8ip
```

> Les autres IDs (YouTube/IG/FB) existent dans Postiz mais NE PAS LES UTILISER — TryPost pour ça.

---

## Limites techniques

| Contrainte | Valeur | Note |
|-----------|--------|------|
| **Taille max fichier** | Pas de limite observée | 93 MB (sonjata) uploadé sans problème |
| Formats vidéo | mp4 | |
| Rate limit API | Non documenté | Pas de throttle observé sur 7 uploads consécutifs |
| `GET /posts` sans params | 400 | Requiert `startDate` + `endDate` ISO 8601 |
| Plan gratuit TikTok | Fonctionne | Vérifié actif 2026-06-07 |

**Avantage vs TryPost** : Postiz accepte les gros fichiers sans compression (81 MB, 93 MB OK).

---

## Workflow REST API — Cycle complet (2 étapes)

### Base URL
```
https://api.postiz.com/public/v1
```

### Headers
```python
PH = {"Authorization": POSTIZ_API_KEY}  # PAS "Bearer", juste la clé brute
```

### Étape 1 — Upload
```python
with open(filepath, 'rb') as f:
    r = requests.post(
        'https://api.postiz.com/public/v1/upload',
        headers=PH,
        files={'file': (filename, f, 'video/mp4')},
        timeout=600  # gros fichiers
    )
up = r.json()  # { "id": "...", "path": "...", ... }
```

### Étape 2 — Créer + programmer le post
```python
payload = {
    "type": "schedule",
    "date": "2026-06-11T15:00:00.000Z",  # noter .000Z pas juste Z
    "shortLink": False,
    "tags": [],
    "posts": [{
        "integration": {"id": "cmpsuyefy00hbru0yqe2ez8ip"},  # TikTok ID
        "value": [{"content": "Caption #fyp", "image": [{"id": up["id"], "path": up["path"]}]}],
        "settings": {
            "__type": "tiktok",
            "privacy_level": "PUBLIC_TO_EVERYONE",
            "duet": True,
            "stitch": True,
            "comment": True,
            "autoAddMusic": "no",
            "brand_content_toggle": False,
            "brand_organic_toggle": False,
            "content_posting_method": "DIRECT_POST",
        },
    }],
}
pr = requests.post(
    'https://api.postiz.com/public/v1/posts',
    headers={**PH, 'Content-Type': 'application/json'},
    json=payload,
    timeout=60
)
res = pr.json()
post_id = res[0].get('postId') if isinstance(res, list) else res.get('id')
```

---

## Supprimer un post

```python
r = requests.delete(
    f'https://api.postiz.com/public/v1/posts/{post_id}',
    headers=PH,
    timeout=30
)
# 200 = supprimé. 404 = déjà supprimé ou ID incorrect.
```

---

## Lister les posts (avec dates obligatoires)

```python
r = requests.get(
    'https://api.postiz.com/public/v1/posts',
    headers=PH,
    params={
        'startDate': '2026-06-01T00:00:00.000Z',
        'endDate': '2026-06-30T23:59:59.000Z',
    },
    timeout=30
)
```

---

## Erreurs connues et solutions

| Erreur | Cause | Solution |
|--------|-------|---------|
| `GET /posts` → 400 "startDate must be ISO 8601" | Appel sans dates | Toujours passer `startDate` + `endDate` |
| Post TikTok sans thumbnail | Pas de frame 0 forte dans la vidéo | Utiliser coverB (0.5s cover PNG + fade en tête de vidéo) |
| Upload échoue silencieusement | timeout < 600s sur gros fichier | `timeout=600` minimum |
| Post crée mais ne publie pas | `content_posting_method` manquant | Inclure `"content_posting_method": "DIRECT_POST"` dans settings |

---

## Bug thumbnail TikTok — résolu par coverB

TikTok (et IG/FB) utilisent **strictement la première frame** comme vignette par défaut.
Un post sans frame 0 forte = vignette noire/floue = 0 vue (prouvé sur 7 posts originaux).

**Solution** : prépendre 0.5s de cover PNG en fondu quasi-invisible avant la vidéo (Variante B).

Commande ffmpeg (JAMAIS utiliser `-f concat` demuxer — produit des fichiers de 587s) :
```bash
ffmpeg -loop 1 -t 0.5 -i cover.png -i video.mp4 \
  -filter_complex "[0:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p,fade=t=out:st=0.3:d=0.2[cov];[1:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[main];[cov][main]concat=n=2:v=1:a=0[outv];[1:a]adelay=500|500[outa]" \
  -map "[outv]" -map "[outa]" -c:v libx264 -crf 18 -c:a aac coverB.mp4
```

---

## Calendrier actif TikTok (9–16 juin 2026)

| Date | Vidéo | postId Postiz |
|------|-------|---------------|
| 9 juin 15h UTC | or-africain | `cmq41coaf07x2mv0yx40udl8g` |
| 9 juin 15h UTC | vraie-taille | `cmq41crd107x3mv0yrvwwjjkq` |
| 11 juin 15h UTC | senegal-short | `cmq41d2i407x4mv0yqsol08zn` |
| 11 juin 15h UTC | mansa-moussa | `cmq41dfn507x6mv0yen6aiyg5` |
| 13 juin 15h UTC | empire-ghana | `cmq41dls107x8mv0ym7eb19ee` |
| 13 juin 15h UTC | sonjata | `cmq41e2iz07xamv0y09a4t7qd` |
| 16 juin 15h UTC | silicon-savannah | `cmq41e96j07xbmv0yll7wscr6` |

Log complet : `scripts/tiktok-schedule-log.json`.

---

## Vérification rapide (Python)

```python
import os, requests, json
from dotenv import load_dotenv
load_dotenv('.env')
KEY = os.environ['POSTIZ_API_KEY']
PH = {'Authorization': KEY}
r = requests.get(
    'https://api.postiz.com/public/v1/posts',
    headers=PH,
    params={'startDate': '2026-06-01T00:00:00.000Z', 'endDate': '2026-06-30T23:59:59.000Z'},
    timeout=30
)
print(json.dumps(r.json(), indent=2)[:3000])
```
