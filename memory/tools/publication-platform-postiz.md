---
name: Publication platform retenue — Postiz
description: Decision 2026-04-23 : Postiz sera la plateforme de publication multi-canaux pour les Shorts GeoAfrique (Facebook, Instagram, TikTok). Reference technique et tarifaire.
type: reference
originSessionId: current
---
# Postiz — Plateforme de publication retenue (2026-04-23)

## Pourquoi Postiz

- **Multi-plateformes** : 28+ canaux (FB, IG, TikTok, YouTube, X, LinkedIn, Pinterest, Threads, Reddit, Bluesky, etc.)
- **Direct upload MP4 9:16** : conforme specs TikTok/Reels (nos renders Remotion passent sans transformation)
- **AI text/image integree** : aide a la redaction de captions adaptees par plateforme
- **Open-source** : possibilite de basculer vers self-hosted plus tard (economie $29/mois)
- **Trial 7 jours gratuit** : permet de tester avant de payer

## Plans (2026)

| Plan | Prix/mois | Channels | AI images | AI videos | Usage |
|------|-----------|----------|-----------|-----------|-------|
| Standard | $29 | 5 | 0-20 (divergence sources) | 3 | **Notre cible** — FB+IG+TT = 3/5 |
| Team | $39 | 10 | 100 | 10 | Si ajout YouTube Shorts + X + LinkedIn |
| Pro | $49 | 30 | 300 | 30 | Agence |
| Ultimate | $99 | 100 | 500 | 60 | Grosse agence |

Annual billing = ~20% de reduction.

## Limites a connaitre

- **Instagram via Graph API** : posts via outils tiers marques "via API" parfois, certaines features natives (collab tags, musique tendance native IG) non accessibles
- **Pas de cover upload separe sur tous canaux** : TikTok prend le first frame
- **AI video integree mediocre** : on genere nos videos avec Remotion, pas besoin de leur AI video
- **Divergence sources sur quotas plan Standard** : verifier pendant trial

## Alternatives evaluees et rejetees

| Outil | Raison rejet |
|-------|--------------|
| Buffer | Pas d'AI integree, pas de video AI, UI simple mais limite |
| Metricool | $22 moins cher mais controls YouTube Shorts limites |
| Publer | Bon budget mais moins feature-complet pour AI |
| Hootsuite | Trop cher et trop enterprise |

## Specs video compatibles (verifiees 2026-04-23)

| Plateforme | Format | Resolution | Codec | Audio | Fps | Taille max |
|------------|--------|------------|-------|-------|-----|------------|
| TikTok | MP4/MOV | 1080x1920 9:16 | H.264 | AAC | 30 (60 diminishing returns) | 287MB mobile / 10GB web |
| Instagram Reels | MP4 | 1080x1920 9:16 | H.264 | AAC | 30 (max) | 4GB |
| Facebook Reels | MP4/MOV/M4V | 1080x1920 9:16 | H.264 | AAC | 30 | 4GB |

Nos renders Remotion compresses (1080x1920, H.264, AAC, 30fps, ~85MB pour 162s) passent sans souci sur les 3 plateformes.

## Lancement Kora & Cartes — Opérationnel (2026-05-29)

**Clé API :** `POSTIZ_API_KEY` dans `.env` racine projet.

**Script de scheduling :** `scripts/schedule-postiz.py` — upload + schedule 9 vidéos en une commande.

**Intégrations connectées :**
| Plateforme | ID | Handle |
|---|---|---|
| YouTube | `cmpsuxkke00h9ru0yk8mcfubf` | @koracartes |
| Instagram | `cmpsydwti013eru0y5skhzjm1` | @koraetcartes |
| TikTok | `cmpsuyefy00hbru0yqe2ez8ip` | @koraetcartes |
| Facebook | `cmpsuzy1p00horu0yga3na02r` | @koraetcartes |

**9 vidéos planifiées (2-20 juin 2026, lun/mer/ven, 15h UTC) :**
- 2 juin : Or Africain | 4 juin : Vraie Taille Afrique | 6 juin : Thiaroye
- 9 juin : Niger Uranium | 11 juin : Mansa Moussa | 13 juin : Empire Ghana
- 16 juin : Soundjata | 18 juin : Silicon Savannah | 20 juin : Sénégal Pétrole

**Gotchas API découverts :**
- `PUT /posts/{id}` n'existe pas — impossible de modifier un post existant via API
- Pour modifier : DELETE puis recréer avec nouveau contenu
- Les vidéos uploadées restent sur `uploads.postiz.com` même après DELETE du post — réutilisables
- Limit upload : 50 MB par fichier via API directe

**Titres — règle des 2 couches obligatoires :**
- Couche 1 : règle hybride Test Tokyo (audience non-africaine doit cliquer)
- Couche 2 : format empirique (50 car. max, zéro date, chiffre quotidien, tension binaire 48 premiers car.)
- Formules interdites : "Ce qu'ils cachent", "La vraie raison de X", "On vous a caché ça à l'école"

## Reference

- Site : https://postiz.com
- Pricing : https://postiz.com/pricing
- Open-source : https://github.com/gitroomhq/postiz-app
