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

## Script ready-to-use

`~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh` automatise les 3 étapes :
```bash
./publish-here-now.sh path/to/dashboard.html
```
Output : URL live + claimUrl à sauvegarder + expiration.

## Règle critique : sauvegarder claimUrl avant 24h

**Si non-claimé sous 24h** : site supprimé. Le `claimToken` est retourné UNE SEULE FOIS dans la réponse de l'étape 1 — non-récupérable après.

**Toujours** sauvegarder `claimUrl` dans `memory/episodes/<project>/dashboard-url.md` immédiatement après publish.

## Premier cas validé

Empire du Ghana dashboard 2026-05-03 :
- Slug : `smooth-oyster-6zb2`
- URL : https://smooth-oyster-6zb2.here.now/
- Claim URL sauvegardé dans `memory/episodes/empire-ghana/dashboard-url.md`

## Récap décisionnel hosting par type

| Type fichier | Outil | Notes |
|--------------|-------|-------|
| HTML (dashboards, pages) | **here.now** | catbox cassé, here.now = solution |
| Images PNG/JPG | catbox.moe | Marche bien, lien permanent |
| Vidéos MP4 | catbox.moe | Marche bien, lien permanent |
| Audio MP3 | catbox.moe | Marche bien, lien permanent |
| Fichiers >200 MB | catbox.moe ne marche pas | Vercel ou GitHub LFS |
