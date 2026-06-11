# Ordre des publications Kora & Cartes — SAUVEGARDE (avant toute suppression/refonte)

> Sauvegardé le 2026-06-06 sur demande d'Aziz, AVANT de supprimer/republier ou tenter la frame 0.
> Source : `scripts/postiz-schedule-log.json` + `scripts/schedule-postiz.py`.
> But : ne jamais perdre l'ordre narratif prevu, meme si on supprime les posts Postiz a venir.

## Calendrier original
- Depart : **2 juin 2026**, rythme Lun/Mer/Ven 15h00 UTC (11h EST).
- 4 plateformes simultanees : YouTube / Instagram / TikTok / Facebook.
- Offsets script (jours depuis le 2 juin) : 0, 2, 4, 7, 9, 11, 14, 16, 18.
  NOTE : les 3 derniers (14/16/18) tombent Dim/Mar/Jeu, pas Lun/Mer/Ven — decalage 3e semaine.

## Ordre ORIGINAL Postiz (photo du systeme avant suppression — NE reflete PAS les decisions editoriales recentes)

| # | Date | Fichier | Statut reel |
|---|------|---------|-------------|
| 1 | 2 juin  | or-africain-FINAL.mp4 | PUBLIE |
| 2 | 4 juin  | vraie-taille-afrique-FINAL.mp4 | PUBLIE |
| 3 | 6 juin  | thiaroye-v5-FINAL.mp4 | PUBLIE (6 juin, vrai thumbnail, 122 vues) |
| 4 | 8 juin  | niger-uranium-FINAL.mp4 | REMPLACE (voir calendrier a jour) |
| 5 | 10 juin | mansa-moussa-atlas-v2-FINAL.mp4 | a republier |
| 6 | 12 juin | empire-ghana-FINAL-v2.mp4 | a republier |
| 7 | 14 juin | sonjata-v7-FINAL.mp4 | a republier |
| 8 | 16 juin | silicon-savannah-FINAL.mp4 | a republier |
| 9 | 18 juin | senegal-petrole-gaz-FINAL-compressed.mp4 | MID-FORM paysage -> YouTube uniquement, HORS lot Shorts |

## CALENDRIER A JOUR (decisions Aziz 2026-06-06) — SOURCE DE VERITE

> Le snapshot ci-dessus = ancien plan Postiz. CE bloc = la verite editoriale actuelle.

Decisions :
- Thiaroye = DEJA PUBLIE (6 juin) -> sort de la liste a republier.
- 8 juin : SWITCH Niger -> **Short Senegal** (`petrole-patience-short-FINAL.mp4`, 91s, 1080x1920 vertical). Niger retire/decale.
- Senegal mid-form 7min34 (`senegal-petrole-gaz-FINAL*.mp4`, 1920x1080 paysage) = YouTube uniquement, PAS dans la rotation Shorts IG/TikTok.

## REPUBLICATION PHASE 2 — TERMINE (2026-06-07) ✅

Architecture finale : TryPost = YT+IG+FB (MCP Claude). Postiz = TikTok ONLY (API REST).
Logs : `scripts/republish-kora-log.json` (anciens posts Postiz supprimés) + `scripts/tiktok-schedule-log.json` (TikTok Postiz).

| Date | Short | TryPost (YT+IG+FB) | Postiz TikTok | CoverB |
|------|-------|---------------------|----------------|--------|
| 9 juin 15h UTC | or-africain | `019ea307-bb9f-73d8-a678-6fdab6e357f4` IG+FB | `cmq41coaf07x2mv0yx40udl8g` | or-africain ($5,589 frame 9s) |
| 9 juin 15h UTC | vraie-taille | `019ea309-1f1c-7141-a0bb-85d12caf4176` IG+FB | `cmq41crd107x3mv0yrvwwjjkq` | vraie-taille (Afrique rouge 50s) |
| 11 juin 15h UTC | senegal-short | `019ea309-9698-705a-9c2f-8f2443965fce` YT+IG+FB | `cmq41d2i407x4mv0yqsol08zn` | senegal-short ($1500B 22s) |
| 11 juin 15h UTC | mansa-moussa | `019ea30a-1176-72a4-b8cf-228dd2c9749f` YT+IG+FB | `cmq41dfn507x6mv0yen6aiyg5` | mansa-moussa (caravane 60s) |
| 13 juin 15h UTC | empire-ghana | `019ea30a-8d38-703d-b20e-d102a8d26eaa` YT+IG+FB | `cmq41dls107x8mv0ym7eb19ee` | empire-ghana (lingot 90KG 31s) |
| 13 juin 15h UTC | sonjata | `019ea30b-10a2-7150-97d5-05327f74903b` YT+IG+FB | `cmq41e2iz07xamv0y09a4t7qd` | sonjata (main+barre 0s) |
| 16 juin 15h UTC | silicon-savannah | `019ea30b-9c71-70cc-be71-933554847b27` YT+IG+FB | `cmq41e96j07xbmv0yll7wscr6` | silicon-savannah (M-Pesa 61s) |

Niger : retire du lot de lancement, garde sur disque pour futur lot.
Session separee en attente : passe editoriale angle militant.

## postId Postiz (pour suppression programmatique si besoin)
Voir `scripts/postiz-schedule-log.json` — chaque entree a 4 postId (1 par plateforme).
Integration IDs : youtube=cmpsuxkke00h9ru0yk8mcfubf, instagram=cmpsydwti013eru0y5skhzjm1,
tiktok=cmpsuyefy00hbru0yqe2ez8ip, facebook=cmpsuzy1p00horu0yga3na02r.

## Diagnostic valide ce jour (2026-06-06)
- CAUSE des blocs vides = bug Postiz (pas de champ couverture dans le payload). Confirme : GitHub issue #1572 gitroomhq/postiz-app + code schedule-postiz.py L162-208.
- PREUVE analytics : sur IG et TikTok, la vignette vide = 0 vue, la vignette avec contenu = 1571 vues (TikTok) / 138 vues (IG). Lien mecanique direct.
- Warm-up : NON pertinent. Comptes ~2 semaines, deja navigues par Aziz avant lancement. Le blocage vient de la thumbnail, pas du warm-up ni de l'automatisation.
- Metricool/Buffer gerent la couverture custom (interface confirmee). API couverture custom NON encore verifiee (a confirmer avant migration).
- Solution racine = frame 0 forte dans l'export Remotion (marche quel que soit l'outil).
