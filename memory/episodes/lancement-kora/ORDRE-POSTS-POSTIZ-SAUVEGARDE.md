# Ordre des publications Kora & Cartes — SAUVEGARDE (avant toute suppression/refonte)

> Sauvegardé le 2026-06-06 sur demande d'Aziz, AVANT de supprimer/republier ou tenter la frame 0.
> Source : `scripts/postiz-schedule-log.json` + `scripts/schedule-postiz.py`.
> But : ne jamais perdre l'ordre narratif prevu, meme si on supprime les posts Postiz a venir.

## Calendrier original
- Depart : **2 juin 2026**, rythme Lun/Mer/Ven 15h00 UTC (11h EST).
- 4 plateformes simultanees : YouTube / Instagram / TikTok / Facebook.
- Offsets script (jours depuis le 2 juin) : 0, 2, 4, 7, 9, 11, 14, 16, 18.
  NOTE : les 3 derniers (14/16/18) tombent Dim/Mar/Jeu, pas Lun/Mer/Ven — decalage 3e semaine.

## Ordre (NE PAS PERDRE)

| # | Date | Fichier | Titre YouTube | Statut 6 juin |
|---|------|---------|---------------|---------------|
| 1 | 2 juin  | or-africain-FINAL.mp4 | L'empire qui produisait la moitie de l'or mondial | PUBLIE |
| 2 | 4 juin  | vraie-taille-afrique-FINAL.mp4 | La vraie taille de l'Afrique va vous surprendre | PUBLIE |
| 3 | 6 juin  | thiaroye-v5-FINAL.mp4 | Thiaroye 1944 : le massacre que l'histoire a efface | AUJOURD'HUI 15h UTC |
| 4 | 8 juin  | niger-uranium-FINAL.mp4 | Le Niger et l'uranium : ce que la France ne dit pas | A VENIR |
| 5 | 10 juin | mansa-moussa-atlas-v2-FINAL.mp4 | Mansa Moussa : l'homme le plus riche de tous les temps | A VENIR |
| 6 | 12 juin | empire-ghana-FINAL-v2.mp4 | L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest | A VENIR |
| 7 | 14 juin | sonjata-v7-FINAL.mp4 | Soundjata Keita : le fondateur de l'empire qui domina l'Afrique | A VENIR |
| 8 | 16 juin | silicon-savannah-FINAL.mp4 | Silicon Savannah : quand l'Afrique invente la tech de demain | A VENIR |
| 9 | 18 juin | senegal-petrole-gaz-FINAL-compressed.mp4 | Senegal petrole et gaz : la souverainete en jeu | A VENIR |

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
