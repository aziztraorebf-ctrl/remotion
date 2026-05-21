# Dashboard URL — Empire du Ghana

## URL DASHBOARD LIVE (here.now) — v2 mise à jour 2026-05-04

**🌐 https://emerald-orbit-gs6x.here.now/**

> Dashboard 95% complet : render v2 intégré, 6 beats validés + B6 CTA à coder, 4 personnages PixelLab session, 7 SFX validés, test montagne Hannibal R&D, coûts cumulés ~$2.32, 3 fixes restants documentés.

### Versions précédentes
- ~~https://smooth-oyster-6zb2.here.now/~~ (v1 pré-production, peut être expirée)

> Production dashboard mobile-first hébergé sur here.now (gratuit, anonyme).
> Content-type: text/html servi correctement, mobile + desktop compatible.
> Publication via clé API `HERE_NOW_API_KEY` dans `.env`.

---

## ⚠️ CLAIM URL — IMPORTANT À RÉCUPÉRER (24H)

**Aziz doit cliquer sur ce lien dans les prochaines 24h pour transférer le site dans son compte here.now et avoir une URL permanente :**

🔐 **https://here.now/claim?slug=smooth-oyster-6zb2&token=9e53103ee96c0e9a707e4dbc3e93947b3b5e329bc4f9ff3352ccd2494dab6a70**

**Détails techniques** :
- Slug : `smooth-oyster-6zb2`
- Claim token : `9e53103ee96c0e9a707e4dbc3e93947b3b5e329bc4f9ff3352ccd2494dab6a70`
- Expiration anonyme : `2026-05-04T16:47:38Z` (24h après création)
- Si non-claimé sous 24h : le site sera supprimé

**Après claim** :
- URL devient permanente dans le compte Aziz
- Modifications futures possibles via API (avec sa clé)
- Pas besoin de re-créer un nouveau site à chaque update

---

## Historique tentatives

| Service | Statut | Pourquoi |
|---------|--------|----------|
| ~~Catbox.moe~~ | ❌ Échec | Sert HTML avec `content-length: 0`, navigateur affiche code source au lieu de la page |
| **here.now** | ✅ FONCTIONNE | Content-type correct + URL gratuite 24h, claimable |

---

## Process publication HTML via here.now

### Étape 1 : Créer site (anonyme)
```bash
curl -X POST "https://here.now/api/v1/publish" \
  -H "Content-Type: application/json" \
  -d '{"files":[{"path":"index.html","size":<SIZE>,"contentType":"text/html; charset=utf-8"}]}'
```
Retourne : `siteUrl`, `claimToken`, `claimUrl`, `upload.uploads[0].url` (presigned R2), `upload.versionId`, `upload.finalizeUrl`.

### Étape 2 : PUT HTML
```bash
curl -X PUT "<presigned R2 URL>" \
  -H "Content-Type: text/html; charset=utf-8" \
  --data-binary @dashboard.html
```

### Étape 3 : Finalize
```bash
curl -X POST "<finalizeUrl>" \
  -H "Content-Type: application/json" \
  -d '{"versionId":"<versionId>"}'
```

### Sauver claim URL avant 24h !
Sinon le site est perdu.

---

## Contenu du dashboard

- Métadonnées projet (durée, coût, statut, branche git)
- 6 scènes (B0-B5) avec statut, durée, frame range
- Audio narration v1 (player intégré)
- Musique choisie (B - Marché de l'or, player intégré)
- Variantes musique alternatives (player A et C, dépliables)
- Palette officielle (8 swatches couleur clés)
- Asset previews (carte hybride validée + palette complète)
- Marchands PixelLab (sahélien + berbère, sprites pixel art)
- Silent Barter V3 proof-of-concept (vidéo intégrée)
- VAGUE 1 — 8 idées validées (statut LOCK)
- Coûts cumulés détaillés
- Liens documentation (script, manifests, syntheses jury, alignment)

## Fichier source local

`/Users/clawdbot/Workspace/remotion/empire-ghana-dashboard/dashboard.html` (17.8 KB)

## Liens annexes (assets uploadés catbox)

- Palette PNG : https://files.catbox.moe/d9o3au.png
- Carte hybride still : https://files.catbox.moe/c91mcv.png
- Silent Barter V3 vidéo : https://files.catbox.moe/jkdz8o.mp4
- Narration v1 audio : https://files.catbox.moe/cchyv3.mp3
- Musique A (Caravane Touareg) : https://files.catbox.moe/3s9kwk.mp3
- Musique B (Marché de l'or) — CHOIX : https://files.catbox.moe/cb21xr.mp3
- Musique C (Empire de l'or) : https://files.catbox.moe/naqdwm.mp3
