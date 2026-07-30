---
name: here.now — Hosting HTML anonyme (remplace catbox pour dashboards)
description: Découverte 2026-05-03 — catbox.moe sert HTML avec content-length 0. here.now est la bonne solution pour héberger les dashboards HTML.
type: reference
---

# here.now — Hosting HTML anonyme

## Contexte du problème

**Catbox.moe NE FONCTIONNE PAS pour HTML** :
- Headers servis : `content-type: text/html` (correct)
- MAIS : `content-length: 0` (fichier vide chez catbox)
- Résultat : navigateur affiche le code source au lieu de rendre la page
- Déduplication par hash content : re-upload retourne la même URL cassée
- CSP très restrictive bloque assets externes

**Marche pour** : images (.png), vidéos (.mp4), audio (.mp3) — confirmé sur 7+ uploads Empire Ghana
**Ne marche PAS pour** : HTML (.html)

## Solution : here.now

API gratuite, anonyme (claimable 24h pour permanence), 3 étapes.

### Étape 1 — Créer site
```bash
curl -X POST "https://here.now/api/v1/publish" \
  -H "Content-Type: application/json" \
  -d "{\"files\":[{\"path\":\"index.html\",\"size\":$SIZE,\"contentType\":\"text/html; charset=utf-8\"}]}"
```

Retour JSON contient :
- `siteUrl` : URL live (ex: `https://smooth-oyster-6zb2.here.now/`)
- `claimToken` + `claimUrl` : à sauvegarder IMMÉDIATEMENT dans 24h
- `upload.uploads[0].url` : presigned R2 Cloudflare pour PUT
- `upload.versionId` : à passer au finalize
- `upload.finalizeUrl` : endpoint étape 3
- `expiresAt` : 24h après création si non claimé

### Étape 2 — PUT HTML
```bash
curl -X PUT "<presigned R2 URL>" \
  -H "Content-Type: text/html; charset=utf-8" \
  --data-binary @dashboard.html
# Retour : HTTP 200
```

### Étape 3 — Finalize
```bash
curl -X POST "<finalizeUrl>" \
  -H "Content-Type: application/json" \
  -d "{\"versionId\":\"<versionId>\"}"
# Retour : {"success":true, "siteUrl":"..."}
```

## Script ready-to-use (mise à jour 2026-05-09)

`~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh` — 2 modes :

```bash
# Nouveau site (première fois)
./publish-here-now.sh path/to/dashboard.html
# → retourne slug + claimToken à sauvegarder dans dashboard-url.md

# Mise à jour site existant (même URL)
./publish-here-now.sh path/to/dashboard.html <slug> <claimToken>
# → même URL, contenu remplacé, aucun claim requis
```

## Règle critique : sauvegarder slug + claimToken

Le `claimToken` est retourné UNE SEULE FOIS à la création. Sauvegarder immédiatement dans `dashboard/dashboard-url.md` avec la commande de mise à jour complète. Après ça, chaque update réutilise ce token — plus jamais de nouveau slug.

## Mise à jour sans nouveau lien — confirmé 2026-05-09

`PUT /api/v1/publish/:slug` avec `claimToken` dans le body = même URL pour toujours. Testé et validé sur slug `united-quasar-n4qp`.

## Cas validés

### Empire du Ghana dashboard 2026-05-03
- Slug : `smooth-oyster-6zb2`
- URL : https://smooth-oyster-6zb2.here.now/
- Claim URL sauvegardé dans memory/episodes/empire-ghana/dashboard-url.md

### Souverain Templates Library dashboard 2026-05-09
- Slug : `hollow-desert-9tz6`
- URL : https://hollow-desert-9tz6.here.now/
- Claim URL sauvegardé dans `dashboard/dashboard-url.md` (deadline 2026-05-10 19:12 UTC)
- Source locale : `dashboard/templates-souverain.html` (vanilla HTML, mobile-first, 8 templates avec previews)
- Workflow update : éditer constante TEMPLATES dans le HTML + republier via `~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh`

## Récap décisionnel hosting par type

| Type fichier | Outil | Notes |
|--------------|-------|-------|
| HTML (dashboards, pages) | **here.now** | catbox cassé, here.now = solution |
| Images PNG/JPG | catbox.moe | Marche bien, lien permanent |
| Vidéos MP4 | catbox.moe | Marche bien, lien permanent |
| Audio MP3 | catbox.moe | Marche bien, lien permanent |
| Fichiers >200 MB | catbox.moe ne marche pas | Vercel ou GitHub LFS |

### Banc d'ecoute musique CFA 2026-07-30
- Slug : `earthy-parcel-d3gg`
- URL : https://earthy-parcel-d3gg.here.now/
- claimToken : `22616a63baa500fe33763c90e5ed04588af6253c9ba5c687f69f23b09280e673`
- Expire si non claime : 2026-07-31T04:21:32Z
- Source : `scratchpad/cfa-musique-ecoute.html` (5 lecteurs, audios sur Vercel Blob)
- Update : `publish-here-now.sh <fichier> earthy-parcel-d3gg 22616a63baa500fe33763c90e5ed04588af6253c9ba5c687f69f23b09280e673`

⚠️ **Claude Code MOBILE ne peut pas ouvrir les Artifacts claude.ai** (constate par Aziz
2026-07-30). Pour toute page HTML destinee au mobile : here.now directement, pas Artifact.
