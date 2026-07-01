---
name: trypost
description: "Guide complet TryPost — rôle, limites, workflow MCP, erreurs connues, IDs comptes"
metadata:
  type: reference
---

# TryPost — Guide de référence complet

> TryPost = outil PRINCIPAL de publication Kora & Cartes pour YouTube + Instagram + Facebook.
> Claude le pilote via MCP (trypost:*). JAMAIS via REST `/api/uploads` (404 confirmé).

---

## Rôle dans l'architecture

| Plateforme | Outil | Pourquoi |
|------------|-------|---------|
| YouTube | **TryPost** | Analytics natifs, Claude pilote via MCP |
| Instagram | **TryPost** | Idem |
| Facebook | **TryPost** | Idem |
| TikTok | Postiz (pas TryPost) | TikTok API non supportée par TryPost |

**Règle d'or** : TryPost = tout sauf TikTok. TikTok → Postiz toujours.

---

## IDs comptes sociaux (Kora & Cartes)

```
YouTube  : 019e9de9-e350-70ce-a3cb-2570aab342db  (platform: youtube, content_type: youtube_short)
Instagram: 019e9de9-6c3d-71a3-b438-1f3a3fda9c37  (platform: instagram, content_type: instagram_reel)
Facebook : 019e9de9-291d-7305-ba18-ed46fbec26ea  (platform: facebook, content_type: facebook_reel)
```

---

## Limites techniques

| Contrainte | Valeur | Note |
|-----------|--------|------|
| **Taille max fichier** | **50 MB** | Au-delà → compresser avec `-crf 28 -preset fast` |
| **Caption YouTube Short** | **100 caractères MAX** | ⚠️ Limite dure — au-delà la plateforme rejette silencieusement (erreur confirmée 2026-06-11). Utiliser titre seul sans hashtags. |
| Formats vidéo acceptés | mp4 (h264) | aac audio obligatoire |
| Délai entre upload et publish | immédiat | pas de cooldown observé |
| Nombre de comptes | illimité | selon plan |

### Compression si > 50 MB
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac output-compressed.mp4
```
Résultats observés :
- mansa-moussa 81 MB → 16 MB (crf 28)
- senegal-short 62 MB → 13 MB (crf 28)
- sonjata 93 MB → 41 MB (crf 28)

---

## Workflow MCP — Cycle complet (4 étapes obligatoires)

```
1. request-media-upload-tool   → obtenir { upload_url, media_id }
2. Bash curl POST upload_url   → upload binaire du fichier mp4
3. create-post-tool            → créer le post (content + platforms + scheduled_at)
4. attach-media-from-upload-tool → lier media_id au post_id
5. publish-post-tool           → finaliser avec scheduled_at
```

### Étape 2 — curl upload (template)
```bash
curl -s -X POST "UPLOAD_URL_ICI" \
  -F "media=@/chemin/vers/video.mp4;type=video/mp4" \
  --max-time 300
```

### Paramètres create-post-tool
```json
{
  "content": "Caption ici",
  "platforms": [
    { "social_account_id": "ID_YT", "content_type": "youtube_short" },
    { "social_account_id": "ID_IG", "content_type": "instagram_reel" },
    { "social_account_id": "ID_FB", "content_type": "facebook_reel" }
  ],
  "scheduled_at": "2026-06-11T15:00:00Z"
}
```

---

## Erreurs connues et solutions

| Erreur | Cause | Solution |
|--------|-------|---------|
| REST `/api/uploads` → 404 | Endpoint n'existe pas | Toujours utiliser MCP `request-media-upload-tool` |
| Fichier rejeté silencieusement | > 50 MB | Compresser avant upload |
| `delete-post-tool` bloqué par auto-mode | Classifier permission | Utiliser Postiz REST DELETE si le post est sur Postiz |
| Post sans média après create | Oubli step 4 `attach-media` | Toujours faire attach AVANT publish |
| ⛔ Caption YouTube trop longue publiée quand même | `create-post-tool` / `update-post-tool` n'ont AUCUN champ caption par-plateforme (`platforms[].content` n'existe pas dans le schema, il est ignoré silencieusement à la création — vérifié via `tools/list`). Le `content` est TOUJOURS global au post, partagé par toutes les plateformes activées. | Créer un post SÉPARÉ par groupe de plateformes qui partage la même limite de caption (ex: 1 post YouTube seul avec caption ≤100 car, 1 post IG+FB avec caption longue+hashtags). Même vidéo (réuploader ou réutiliser le fichier), 2+ post_id distincts, même `scheduled_at`. TOUJOURS vérifier après création avec `get-post-tool` que `len(content)` correspond à ce qui a été demandé, PAS juste faire confiance à l'argument envoyé. |

---

## Lister les posts programmés

Via MCP : `list-posts-tool` (filtre par statut `scheduled`).
Via navigation : https://app.trypost.it/calendar

---

## Vérification rapide (Python)

```python
import os, requests
from dotenv import load_dotenv
load_dotenv('.env')
KEY = os.environ['TRYPOST_API_KEY']
r = requests.get('https://app.trypost.it/api/posts?limit=30', 
                 headers={'Authorization': f'Bearer {KEY}'}, timeout=30)
for p in r.json().get('data', []):
    if '2026-06' in p.get('scheduled_at',''):
        plats = [pl.get('platform','') for pl in p.get('platforms',[])]
        print(f"{p['scheduled_at'][:10]} | {p['id']} | {'+'.join(plats)}")
```

---

## Calendrier actif (9–16 juin 2026)

| Date | Vidéo | Post ID TryPost | Plateformes |
|------|-------|-----------------|-------------|
| 9 juin 15h UTC | or-africain | `019ea307-bb9f-73d8-a678-6fdab6e357f4` | IG+FB |
| 9 juin 15h UTC | vraie-taille | `019ea309-1f1c-7141-a0bb-85d12caf4176` | IG+FB |
| 11 juin 15h UTC | senegal-short | `019ea309-9698-705a-9c2f-8f2443965fce` | YT+IG+FB |
| 11 juin 15h UTC | mansa-moussa | `019ea30a-1176-72a4-b8cf-228dd2c9749f` | YT+IG+FB |
| 13 juin 15h UTC | empire-ghana | `019ea30a-8d38-703d-b20e-d102a8d26eaa` | YT+IG+FB |
| 13 juin 15h UTC | sonjata | `019ea30b-10a2-7150-97d5-05327f74903b` | YT+IG+FB |
| 16 juin 15h UTC | silicon-savannah | `019ea30b-9c71-70cc-be71-933554847b27` | YT+IG+FB |

> or-africain et vraie-taille = IG+FB uniquement (déjà sur YouTube avant la republication).

## Calendrier actif (1–3 juillet 2026) — 1er cas concret de la règle "2 posts séparés"

| Date | Vidéo | Post ID TryPost | Plateformes |
|------|-------|-----------------|-------------|
| 1 juil 14h UTC | cacao-chocolat | `019f1b9a-482d-70a7-989d-4ec1ea6ee6af` | YT seul |
| 1 juil 14h UTC | cacao-chocolat | `019f1b9a-48e3-70a7-b714-2a921a26df6d` | IG+FB |
| 3 juil 14h UTC | ggw-muraille-verte | `019f1b9a-49ae-7046-a920-f7c8f6a8da4e` | YT seul |
| 3 juil 14h UTC | ggw-muraille-verte | `019f1b9a-4a7c-73a9-bc12-44f127cf7b80` | IG+FB |

> Chaque vidéo = 2 posts (pas 1) car TryPost n'a pas de caption par-plateforme (cf § Erreurs connues).
> TikTok manuel pour les deux (compte en quarantaine, cf `NEXT-ACTION.md`).

---

## Règle thumbnail / couverture

TryPost prend la **première frame de la vidéo** comme thumbnail par défaut.
Utiliser les vidéos coverB (0.5s cover PNG + fade) garantit une belle vignette sans config manuelle.
Voir `ARCHITECTURE-DISTRIBUTION-FINALE.md` pour la commande ffmpeg Variante B.
