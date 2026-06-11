# Architecture distribution FINALE — Kora & Cartes (decisions Aziz 2026-06-06)

> Complement de STRATEGIE-DISTRIBUTION-OUTIL.md. Decisions structurantes de la session.

## Repartition outil par plateforme
| Plateforme | Outil | Note |
|------------|-------|------|
| YouTube   | TryPost (MCP) | Claude pilote |
| Facebook  | TryPost (MCP) | Claude pilote |
| Instagram | TryPost (MCP) | Claude pilote |
| TikTok    | Postiz        | La FRAME 0 repare le bug couverture Postiz -> reste automatique |

- Cle : le bug Postiz ne concernait QUE la couverture custom. Avec la frame 0 INTEGREE a la video, Postiz prend la frame 0 (belle) -> probleme resolu. Postiz redevient viable pour TikTok.
- Filet de secours : si Postiz lache / plan gratuit bloque TikTok -> TikTok manuel (frame 0 = couverture propre quand meme). Aziz prefere ne pas surveiller en continu.

## Methode frame 0 retenue : VARIANTE B (0.5s quasi-invisible + fade)
- Verifie (Hypefury 2026 + premiumbeat) : IG/TikTok/FB utilisent STRICTEMENT la 1ere frame comme couverture par defaut, PAS d'analyse multi-secondes. Technique "title card tres court invisible" documentee et recommandee.
- Commande FIABLE (concat par FILTER, jamais demuxer) :
  ffmpeg -loop 1 -t 0.5 -i cover.png -i video.mp4 -filter_complex "[0:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p,fade=t=out:st=0.3:d=0.2[cov];[1:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[main];[cov][main]concat=n=2:v=1:a=0[outv];[1:a]adelay=500|500[outa]" -map "[outv]" -map "[outa]" -c:v libx264 -crf 18 -c:a aac out.mp4
- PIEGE A EVITER : concat par DEMUXER (-f concat) a produit des fichiers de 587s au lieu de 100s sur or-africain. NE JAMAIS utiliser le demuxer pour ca. Toujours concat par filter + adelay.

## Statut par plateforme (eviter doublons)
- vraie-taille : deja sur YouTube+Facebook (GARDER) -> republier IG+TikTok SEULEMENT.
- or-africain : idem -> republier IG+TikTok SEULEMENT.
- thiaroye : publie partout (YT/FB/IG/TikTok) le 6 juin -> NE PAS retoucher.
- 5 nouvelles (senegal-short, mansa-moussa, empire-ghana, sonjata, silicon-savannah) : jamais publiees -> publier sur les 4 plateformes.

## Niger
Retire du calendrier de lancement. Garde sur disque. A ressortir dans un futur lot.

## Mid-form Senegal 7min34 (paysage)
YouTube uniquement, HORS rotation Shorts.

## Covers frame 0 generees (out/episodes/_r-and-d/covers-B/) — TOUTES FAITES ✅
- or-africain : 9s "$5,589 RECORD HISTORIQUE" — genere 2026-06-07
- vraie-taille : 50s Afrique rouge Mercator — genere 2026-06-06
- senegal-short : 22s "$1500B"
- mansa-moussa : caravane vers Le Caire 60s
- empire-ghana : lingot "90 KG" 31s
- sonjata : main + barre de fer 0s (choix Aziz)
- silicon-savannah : M-Pesa "5% vs 0.22%" 61s
Planche HD des 8 : files.catbox.moe/mkgcd1.png

## STATUT FINAL — TERMINE (2026-06-07) ✅
Architecture réelle : TryPost (MCP) = YT+IG+FB. Postiz (REST) = TikTok ONLY.
7/7 vidéos programmées TryPost + 7/7 TikTok Postiz. Frame 0 coverB intégrée partout.
Logs : `scripts/tiktok-schedule-log.json` (TikTok) + TryPost IDs dans ORDRE-POSTS-POSTIZ-SAUVEGARDE.md.

## SESSION SEPAREE EN ATTENTE
Passe editoriale angle militant (Mansa Moussa "plus riche que Rockefeller", Thiaroye titrage).
Voir : `TODO-PASSE-EDITORIALE-ANGLE-MILITANT.md`.
