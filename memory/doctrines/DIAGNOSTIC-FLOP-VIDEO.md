# DOCTRINE — DIAGNOSTIC D'UNE VIDÉO QUI FLOP

> Source de vérité pour "une vidéo publiée ne décolle pas, pourquoi ?". Prouvé sur War-Map Sahel AES
> (2026-08-06) : 3 causes indépendantes coexistaient sur le même flop, aucune n'excluait les autres.

## LE TRIAGE — 3 dimensions indépendantes à scorer SÉPARÉMENT avant de conclure

Ne JAMAIS s'arrêter au premier problème repéré. Sur l'AES : titre vidIQ 81/100 (bon), miniature vidIQ
35/100 (faible), script jury créatif 3-4.9/10 (faible) — les 3 étaient réels EN MÊME TEMPS. Un flop n'a
pas "une vraie cause", il peut en avoir plusieurs qui se cumulent.

1. **Titre** — `vidiq_score_title` (score CTR potentiel /100).
2. **Miniature** — `vidiq_score_thumbnail` (score CTR potentiel /100, feedback détaillé : guidage visuel,
   enjeu perçu).
3. **Script/contenu** — jury LLM créatif (`scripts/tools/jury-script-creatif-llm.py`), qui teste
   spécifiquement technicité/hook/rétention/ton — PAS le fact-check factuel (périmètre différent).

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
