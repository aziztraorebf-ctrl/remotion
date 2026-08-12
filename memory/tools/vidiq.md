# Outil — vidIQ (MCP)

> Créé 2026-08-12. Corrige [[feedback_strategie-chaine-midform-discovery]] qui affirmait à tort (2026-06-06)
> que VidIQ était un jardin fermé sans API — faux, un MCP connecté donne un accès direct et large.

## Ce que vidIQ couvre (2 familles d'outils, ne pas confondre)

**1. API YouTube Analytics officielle (données propres à NOS chaînes)** — `vidiq_channel_analytics`.
Remplace l'export CSV manuel depuis YouTube Studio. Reports disponibles via le paramètre `report` :
- `audience_retention` — courbe de rétention **seconde-par-seconde**, la donnée absente des CSV. Nécessite
  `filters: video==VIDEO_ID`. Détail d'usage/preuve : [[doctrines/DIAGNOSTIC-FLOP-VIDEO]].
- `traffic_sources` — distingue distribution (impressions) de conversion (CTR) par source (Suggested,
  Search, Browse...). Voir [[doctrines/DIAGNOSTIC-FLOP-VIDEO]] § distribution vs conversion.
- `audience_demographics`, `audience_geography` — âge/genre/pays/villes, sans export CSV.
- `top_videos` — classement par vues (ou revenu si monétisé).
- `shorts_vs_longform_split` — comparatif direct Shorts vs longues.
- `revenue_report` — nécessite chaîne monétisée.
- Query custom possible (metrics/dimensions/filters libres) si un report nommé ne suffit pas.

**Channel ID Kora & Cartes** (à ne pas re-chercher) : `UC9mydMMTPrjrdAU2qMHu6-w`.

**2. Outils de scoring/génération/recherche marché (portée large, pas propre à nos chaînes)** :
- `vidiq_score_title`, `vidiq_score_thumbnail` — score CTR potentiel /100, déjà utilisés dans le triage
  [[doctrines/DIAGNOSTIC-FLOP-VIDEO]].
- `vidiq_channel_performance_trends` — courbe de vélocité de vues typique d'une chaîne après publication.
- `vidiq_subscriber_insights` — chevauchement d'audience + meilleurs horaires de publication. ⚠️ Renvoie
  "No Results Yet" si la chaîne n'a pas assez d'activité/données (cas Kora & Cartes au 2026-08-12, chaîne
  jeune ~3 mois) — pas un bug, juste pas encore assez de volume.
- `vidiq_outliers`, `vidiq_similar_videos`, `vidiq_similar_thumbnails` — recherche marché large (hors nos
  chaînes), utile pour la validation SUJET-PRIME étape 1.
- `vidiq_keyword_research` — volume/compétition de mots-clés, plusieurs modes (research/country_search/
  country_top/rising).
- `vidiq_generate_script`, `vidiq_generate_thumbnail`, `vidiq_generate_titles` — génération, pas encore
  éprouvés en session.

## Gotcha vérifié 2026-08-12 — CSV YouTube Studio "abonnés" sur une fenêtre = gagnés, PAS le total

Un export CSV YouTube Studio filtré sur 30 jours affichant une colonne "Subscribers" = abonnés **gagnés
dans la fenêtre**, pas le total de la chaîne. Erreur vécue : lu "11" dans un CSV 30j et pris pour le total
— total réel vérifié via `TubeLab get_channel` = 109. Toujours croiser un chiffre d'abonnés d'export CSV
avec une source qui donne explicitement le TOTAL (`TubeLab get_channel`, YouTube Studio page d'accueil, ou
`vidiq_channel_stats`).

Liens : [[doctrines/DIAGNOSTIC-FLOP-VIDEO]] · [[feedback_strategie-chaine-midform-discovery]] · `tools/tubelab.md` (si existant, outil complémentaire recherche marché).
