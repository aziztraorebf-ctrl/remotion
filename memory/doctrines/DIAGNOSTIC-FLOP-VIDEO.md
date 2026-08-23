# DOCTRINE — DIAGNOSTIC D'UNE VIDÉO QUI FLOP

> Source de vérité pour "une vidéo publiée ne décolle pas, pourquoi ?". Prouvé sur War-Map Sahel AES
> (2026-08-06) : 3 causes indépendantes coexistaient sur le même flop, aucune n'excluait les autres.

> ⭐ **Doctrine soeur — `memory/doctrines/PACKAGING-YOUTUBE.md`** : elle decide le packaging
> (titre/miniature/description/engagement) AVANT publication ; ce fichier-ci mesure APRES et dit
> laquelle des 4 dimensions a lache. Toujours enchainer les deux, ne pas les fusionner.

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

## ⭐ LES 5 FORMES DE COURBE — nommer le défaut d'écriture (mesuré 2026-08-23, 4 vidéos)

> Le § précédent dit **où** ça décroche. Celui-ci dit **quel défaut d'écriture** produit cette forme.
> Grille adaptée de FacelessOS Core v3 (`retention-coaching-skill.md`, Haris Mazhar) — le seul apport
> de ce corpus qui n'existait pas chez nous. ⚠️ Ses **benchmarks chiffrés** (23,7 % moyen, « 70 % à
> 30 s ») viennent de blogs d'outils SEO, PAS de sources primaires YouTube : ordres de grandeur, jamais
> des seuils de décision. **Les 5 formes, elles, sont utilisables — c'est de la lecture de courbe.**

| Forme | Signature | Défaut d'écriture correspondant |
|---|---|---|
| 1. **Falaise** | chute massive 0-30 s, puis plat | le hook a promis autre chose que la suite |
| 2. **Saignement lent** | déclin régulier, sans palier | aucune mécanique de relance : pas de re-hooks, structure « et ensuite » |
| 3. **Falaise en milieu** | chute nette à un instant précis | UNE section tue l'intérêt (ennui, confusion, promesse non tenue) |
| 4. **Pic de ré-engagement** | creux puis remontée | les gens scrubbent : ce qui précède le pic est du remplissage |
| 5. **Plateau** | chute initiale puis ligne stable | rien à corriger — c'est la forme cible |

**⭐ La règle méta (la vraie valeur) :** si **3 vidéos ou plus** ont la MÊME forme, ce n'est pas un
problème de vidéo — c'est un **défaut systématique du gabarit d'écriture**. On corrige le gabarit, pas
la vidéo.

### MESURE RÉELLE — Kora & Cartes, 4 vidéos longues (2026-08-23)

`audienceWatchRatio` aux ratios clés. ⚠️ Échantillons **très faibles** (35 à 97 vues) : la FORME est
lisible, les valeurs précises non.

| Vidéo | Vues | 1 % | 5 % | 10 % | 25 % | 50 % | fin | Forme |
|---|---|---|---|---|---|---|---|---|
| Sénégal Pétrole (8:17) | 97 | 99 % | 68 % | 56 % | 39 % | 27 % | 14 % | **saignement lent** |
| AES Sahel (7:31) | 48 | 100 % | 76 % | 52 % | 24 % | 19 % | 10 % | **saignement lent** |
| Franc CFA (4:29) | 54 | 100 % | 71 % | 51 % | 43 % | 39 % | 20 % | **plateau** (le meilleur) |
| Soudan (10:36) | 35 | 97 % | 42 % | 33 % | 30 % | 15 % | 9 % | **falaise** puis plateau |

⛔ **Ce que la mesure INFIRME.** L'hypothèse de départ (« nos 4 longues ont toutes la Falaise, donc
notre gabarit d'ouverture est cassé ») est **FAUSSE**. Les formes divergent. Il n'y a **pas** de défaut
systématique unique — la règle des 3+ ne se déclenche pas. Ne pas refondre le gabarit d'ouverture.

**Ce qu'elle établit, vidéo par vidéo :**
- **Soudan = le seul cas de Falaise.** 97 % → 51 % à 3 % du film (≈ 19 s) : la moitié part avant
  20 secondes. MAIS ensuite **plateau stable à 30 % jusqu'à 3 min 35**, et son
  `relativeRetentionPerformance` culmine à **0,42 vers 22 %** — sur ce segment il fait mieux que des
  vidéos comparables. Le corps tient ; c'est l'entrée qui saigne. Correction chirurgicale (20 s), pas
  une refonte.
- **Sénégal + AES = saignement lent**, pas falaise. Leur entrée est BONNE (68 % et 76 % à 5 %).
  Ils perdent en continu faute de relances. ✅ Cohérent avec le § précédent (mesure du 08-12) :
  « le problème n'était PAS le hook mais le corps entre 30 s et 2-3 min ».
- **CFA = notre meilleure courbe** (39 % à mi-film, ~2× les autres) et **la plus courte (4:29)**.
  Signal à vérifier, pas conclusion : la durée courte pourrait être ce qui protège la rétention.

### ⛔ LE CONSTAT QUI PRIME SUR TOUT LE RESTE — format, pas qualité

Même période (2026-07-01 → 08-23), même chaîne :

| | Vues | Source |
|---|---|---|
| **Shorts** (3 vidéos) | **3 015** | 2 781 via le flux `SHORTS` |
| **Longues** (toutes) | **231** | — |

**Facteur 13.** YouTube distribue les Shorts et ne distribue pas les longues (Soudan : 35 vues en 3 j).
⛔ **Ne pas lire un flop de vidéo longue comme un verdict sur sa qualité tant que ce déséquilibre de
distribution tient** — sur 35 vues, le contenu n'a pas été jugé, il n'a pas été vu. Les deux verrous
(conversion §DISTRIBUTION, entrée §ci-dessus) restent vrais et ne se contredisent pas ; celui-ci est
en amont des deux.

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
