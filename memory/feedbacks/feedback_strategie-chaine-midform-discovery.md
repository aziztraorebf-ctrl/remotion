---
name: strategie-chaine-midform-discovery
description: Virage strategique Kora & Cartes — pivot mid-form + discovery data-driven (outlier scan) — session 2026-06-06
metadata:
  type: project
---

Virage strategique discute et acte avec Aziz le 2026-06-06.

## Decisions de direction
1. **Format signature = la PRODUCTION, pas le sujet.** Le differentiel de Kora & Cartes
   c'est COMMENT (carte vivante + PixelLab + war-map + overlays, en francais sur l'Afrique),
   pas QUOI. Personne ne replique ce pipeline. Strategie : sujet a demande validee + format
   qu'on est seul a pouvoir produire. Pas chasser les tendances saturees.
2. **Pivot vers le MID-FORM** comme pilier. Le mid-form (5-10min) = vrai test de chaine YouTube
   (watch time, retention, abonnements). Les Shorts = vues jetables sans audience. UN mid-form/semaine
   se DECLINE : 2-3 Shorts (TikTok/Reels/YT) + 1 carrousel IG + 1 post LinkedIn. Produire 1x, publier
   partout. Resout la dispersion. Mais : un mid-form rate coute 1 semaine -> selection du sujet CRITIQUE
   -> outlier scan + last30days deviennent indispensables.
3. **Eviter l'angle victimaire / anti-Europe.** Aziz veut l'Afrique comme ACTEUR de l'histoire
   mondiale, pas victime de l'actualite. La "vraie taille de l'Afrique" (correction carte) genere
   des commentaires anti-Europe -> signal d'AVERTISSEMENT, pas opportunite. Sujets construction/puissance
   (corridor, ressources, empires, demographie) > sujets grief.

## Discovery data-driven — ce qu'on a appris
- **3 methodes des createurs** : (1) format-jacking (rejouer un format viral sur sa niche) ;
  (2) outlier hunting (videos qui font x5-x10 leur chaine = signal) ; (3) demand validation (Google Trends).
- **Outils du marche** : VidIQ/TubeBuddy/1of10/ViewStats = jardins fermes, PAS d'API -> inutiles pour
  pipeline agentique. ⚠️ **CORRIGÉ 2026-08-12** : cette affirmation sur VidIQ est FAUSSE, contredite par
  l'usage réel — `mcp__claude_ai_vid_iq__vidiq_channel_analytics` donne un accès direct à l'API YouTube
  Analytics officielle (retention, traffic_sources, demographics, geography, top_videos, shorts_vs_longform)
  + `vidiq_score_title`/`vidiq_score_thumbnail` déjà utilisés dans [[DIAGNOSTIC-FLOP-VIDEO]]. Détail complet :
  [[tools/vidiq]]. Ligne gardée pour traçabilité de la décision initiale, ne plus s'y fier. **TubeLab** = seul dev-friendly avec MCP officiel Claude (public-api.tubelab.net/mcp)
  + API + base 400k chaines/4M outliers. ~29$/mois Pro (300 credits). **YouTube Data API v3** = plomberie
  brute gratuite (10k unites/jour, search.list=100 unites) mais AUCUN calcul d'outlier (a faire soi-meme).
- **`scripts/tools/outlier-scan.py` CODE cette session** : ScrapeCreators (search + channel-videos),
  calcule ratio vues/mediane-chaine. PROTOTYPE qui nous a appris ce qu'on cherche. 1er run a CORRIGE une reco :
  "Lobito Corridor" PAS viral cote createurs (600-11k vues, institutionnel only) malgre forte actualite presse.
- **last30days run niche** : la carte de l'Afrique est virale AUPRES de non-Africains (Japon, r/MapPorn 3119up).
  Format carte animee = niche etablie (Mapimator existe). Sujets cross-platform chauds : ressources vs pauvrete,
  Chine en Afrique, AES/Sahel, demographie 2100, gazoduc transsaharien.

**Why:** Aziz cherchait a clarifier l'identite de la chaine (sentie dispersee) + ne pas viser dans le vide.
**How to apply:** Avant tout nouveau sujet mid-form : last30days (pouls) -> outlier-scan ou TubeLab (signal precis)
-> croiser demande validee + format unique -> production. Voir [[warmap-script-process]] pour la rigueur factuelle.
Workflow d'eval stack discovery lance (TubeLab vs YouTube API v3 vs outlier-scan maison) — reco a venir.
