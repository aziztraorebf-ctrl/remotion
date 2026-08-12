# DOCTRINE — DIAGNOSTIC D'UNE VIDÉO QUI FLOP

> Source de vérité pour "une vidéo publiée ne décolle pas, pourquoi ?". Prouvé sur War-Map Sahel AES
> (2026-08-06) : 3 causes indépendantes coexistaient sur le même flop, aucune n'excluait les autres.

## LE TRIAGE — 4 dimensions indépendantes à scorer SÉPARÉMENT avant de conclure

Ne JAMAIS s'arrêter au premier problème repéré. Sur l'AES : titre vidIQ 81/100 (bon), miniature vidIQ
35/100 (faible), script jury créatif 3-4.9/10 (faible) — les 3 étaient réels EN MÊME TEMPS. Un flop n'a
pas "une vraie cause", il peut en avoir plusieurs qui se cumulent.

1. **Titre** — `vidiq_score_title` (score CTR potentiel /100).
2. **Miniature** — `vidiq_score_thumbnail` (score CTR potentiel /100, feedback détaillé : guidage visuel,
   enjeu perçu).
3. **Script/contenu** — jury LLM créatif (`scripts/tools/jury-script-creatif-llm.py`), qui teste
   spécifiquement technicité/hook/rétention/ton — PAS le fact-check factuel (périmètre différent).
4. **Distribution vs conversion** — `vidiq_channel_analytics` (report `traffic_sources`), voir §
   ci-dessous. Distingue "l'algo ne montre pas la vidéo" de "l'algo la montre mais personne ne clique" —
   deux diagnostics différents qui appellent des corrections différentes (titre/miniature vs autre chose).

## DISTRIBUTION vs CONVERSION — CTR stable et faible ≠ problème de reach (preuve 2026-08-12)

Avant de conclure "l'algo nous ignore", vérifier les impressions réelles via `vidiq_channel_analytics`
(report `traffic_sources`). Cas vécu Kora & Cartes : CTR "Suggested videos" stable à 1,5-1,8% sur 30j
ET 90j pour 2 vidéos longues (AES, Sénégal/CFA), MAIS 1800-3600 impressions chacune — la distribution est
donc correcte, le problème est 100% conversion (titre/miniature), pas reach. Ne pas chercher un problème
d'algorithme quand les impressions sont déjà là — recentrer directement sur la dimension 1/2 ci-dessus.

## RÉTENTION SECONDE-PAR-SECONDE — localiser le vrai point de décrochage (preuve 2026-08-12)

`vidiq_channel_analytics` (report `audience_retention`, nécessite `filters: video==VIDEO_ID`) donne la
courbe seconde-par-seconde, comparable entre 2 vidéos — donnée absente des exports CSV YouTube Studio.
Cas vécu : comparaison AES vs Sénégal montre que les deux perdent un % similaire (~40-45%) dans les 30
premières secondes (hook comparable pour les deux) — mais Sénégal stabilise un palier de rétention
ensuite, AES continue de saigner en continu jusqu'à 3-4 min. **Conclusion actionnable : le problème
n'était PAS le hook** (suspect réflexe n°1) **mais le corps du script entre 30s et 2-3min.**
→ Avant de réécrire un hook suite à un flop, comparer sa courbe de rétention seconde-par-seconde à une
vidéo qui a mieux marché. Si le décrochage précoce (0-30s) est comparable entre les deux, chercher la
cause plus loin dans le script — retravailler un hook déjà correct est du temps perdu.

## PROFIL DÉMOGRAPHIQUE — donnée disponible, pas encore un signal d'action ferme

`vidiq_channel_analytics` (report `demographics`, `geography`) donne l'audience réelle sans export CSV
manuel. Mesure Kora & Cartes 2026-08-12 : 65+ ans dominant (22-30% des vues), 86-92% masculin, 85-89%
mobile/Android, 85,8% nouveaux viewers (acquisition pure) — mais le noyau de revenants (14%) a un CTR et
une durée de vue nettement supérieurs. ⚠️ Un seul point de mesure — ne pas en tirer une décision éditoriale
ferme (ex. "cibler du contenu pour 65+") sans un 2e relevé qui confirme la tendance dans le temps.

## MÉTHODE

1. Scorer les 3 dimensions indépendamment (vidIQ titre + vidIQ thumbnail + jury script) AVANT de
   prioriser une refonte.
2. Comparer aux vidéos précédentes de la MÊME chaîne à taille d'audience comparable (VPH, pas juste
   vues brutes — une chaîne à faible abonnement a peu de reach organique quel que soit le contenu, donc
   la comparaison relative entre 2 vidéos de la même chaîne est plus fiable que le chiffre absolu).
3. Vérifier aussi un écart de PROCESS, pas seulement de contenu : le titre/miniature effectivement en
   ligne correspond-il au titre/miniature validé par le jury/la doctrine en amont ? (vécu sur l'AES : le
   titre publié divergeait du titre gagnant d'un jury 4 modèles antérieur, convergence 3/4 — écart jamais
   expliqué, découvert seulement lors du diagnostic post-flop.)

## APRÈS DIAGNOSTIC

- Si le script est en cause et la vidéo déjà publiée : ne PAS retoucher les visuels/timing déjà validés
  si eux ne sont pas en cause — isoler ce qui doit changer. Voir la méthode complète "3 passes de jury"
  dans [[feedback_hook-retention-premiere-minute]] pour la refonte de script.
- Toujours vérifier AVANT publication (pas après) que le titre/miniature qui partent en ligne == ceux
  validés par le process de décision (jury, fichier de calendrier figé) — un diff texte simple suffit.

Cas vécu complet (AES) : `feedback_hook-retention-premiere-minute.md` § preuve vécue + méthode 3-passes.
