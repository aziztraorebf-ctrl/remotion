# Calendrier éditorial Kora & Cartes — Juin 2026

> Sauvegarde définitive. Source de vérité pour la période 2–16 juin 2026.
> Architecture : TryPost (YT+IG+FB) + Postiz (TikTok). CoverB partout.

---

## Vidéos déjà publiées (avant republication)

| Date | Vidéo | Statut |
|------|-------|--------|
| 2 juin | or-africain-FINAL.mp4 | PUBLIÉ YT+FB (pas IG ni TikTok à l'époque) |
| 4 juin | vraie-taille-afrique-FINAL.mp4 | PUBLIÉ YT+FB |
| 6 juin | thiaroye-v5-FINAL.mp4 | PUBLIÉ YT+IG+FB+TikTok ✅ complet, ne pas toucher |

---

## Republication Phase 2 — 7 vidéos avec coverB (programmées 2026-06-07)

| Date | Heure | Vidéo | YT | IG | FB | TikTok | TryPost ID | Postiz ID |
|------|-------|-------|----|----|----|---------|-----------:|-----------:|
| 9 juin | 15h UTC | or-africain | — | ✅ | ✅ | ✅ | `019ea307-bb9f-73d8-a678-6fdab6e357f4` | `cmq41coaf07x2mv0yx40udl8g` |
| 9 juin | 15h UTC | vraie-taille | — | ✅ | ✅ | ✅ | `019ea309-1f1c-7141-a0bb-85d12caf4176` | `cmq41crd107x3mv0yrvwwjjkq` |
| 11 juin | 15h UTC | senegal-short | ✅ | ✅ | ✅ | ✅ | `019ea309-9698-705a-9c2f-8f2443965fce` | `cmq41d2i407x4mv0yqsol08zn` |
| 11 juin | 15h UTC | mansa-moussa | ✅ | ✅ | ✅ | ✅ | `019ea30a-1176-72a4-b8cf-228dd2c9749f` | `cmq41dfn507x6mv0yen6aiyg5` |
| 13 juin | 15h UTC | empire-ghana | ✅ | ✅ | ✅ | ✅ | `019ea30a-8d38-703d-b20e-d102a8d26eaa` | `cmq41dls107x8mv0ym7eb19ee` |
| 13 juin | 15h UTC | sonjata | ✅ | ✅ | ✅ | ✅ | `019ea30b-10a2-7150-97d5-05327f74903b` | `cmq41e2iz07xamv0y09a4t7qd` |
| 16 juin | 15h UTC | silicon-savannah | ✅ | ✅ | ✅ | ✅ | `019ea30b-9c71-70cc-be71-933554847b27` | `cmq41e96j07xbmv0yll7wscr6` |

> or-africain et vraie-taille : pas de YT (déjà publiés sur YouTube, on ne re-publie pas deux fois).
> — = non programmé sur cette plateforme pour ce post.

---

## CoverB utilisées

| Vidéo | Fichier | Frame clé |
|-------|---------|-----------|
| or-africain | `or-africain-coverB.mp4` (40 MB) | 9s — "$5,589 RECORD HISTORIQUE" |
| vraie-taille | `vraie-taille-coverB.mp4` (15 MB) | 50s — Afrique rouge Mercator |
| senegal-short | `senegal-short-coverB.mp4` (62 MB, Postiz) / `-compressed.mp4` 13 MB (TryPost) | 22s — "$1500B" |
| mansa-moussa | `mansa-moussa-coverB.mp4` (81 MB, Postiz) / `-compressed.mp4` 16 MB (TryPost) | caravane vers Le Caire |
| empire-ghana | `empire-ghana-coverB.mp4` (38 MB) | 31s — lingot "90 KG" |
| sonjata | `sonjata-coverB.mp4` (93 MB, Postiz) / `-compressed.mp4` 41 MB (TryPost) | 0s — main + barre de fer |
| silicon-savannah | `silicon-savannah-coverB.mp4` (41 MB) | 61s — M-Pesa "5% vs 0.22%" |

Tous dans : `out/episodes/_r-and-d/covers-B/`

---

## Décisions éditoriales actées

- **Niger uranium** : retiré du lot de lancement. Garde sur disque. Futur lot.
- **Thiaroye** : publié le 6 juin, complet sur toutes plateformes. Ne pas retoucher.
- **Sénégal mid-form 7min34** : YouTube uniquement, hors rotation Shorts. DEADLINE publication 20 juin.
- **Rythme** : Lun/Mer/Ven 15h UTC (11h EST). Les 9-11-13-16 = Mer-Jeu-Sam-Mar (légère dérive OK pour republication).

---

## Architecture outils (NON-NEGOTIABLE)

```
TryPost (MCP Claude)  →  YouTube + Instagram + Facebook
Postiz (REST Python)  →  TikTok UNIQUEMENT
```

Références :
- `memory/tools/trypost.md` — limites, workflow, IDs comptes
- `memory/tools/postiz.md` — limites, workflow REST, IDs intégrations
