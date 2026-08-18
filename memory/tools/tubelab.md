# TubeLab — inventaire outils + règle de routage (validation de SUJET)

> Outil de DÉCOUVERTE d'outliers/niches YouTube (abonnement mensuel). Sert le GATE de
> [[SUJET-PRIME-SUR-PRODUCTION]] (valider la demande d'un sujet AVANT de produire).
> ⚠️ NON DÉFINITIF : l'espace bouge vite. "L'outil de découverte d'outliers actuel = TubeLab" — si un meilleur/
> moins cher apparaît (VidIQ, TubeBuddy, autre), on remplace ICI, le gate ne change pas. Crédits : voir `get_credits_balance`.
>
> ⭐⭐ **TubeLab et `last30days` s'utilisent TOUJOURS ENSEMBLE, jamais l'un sans l'autre (Aziz 2026-07-11).**
> TubeLab = SIGNAL YouTube seul (quel FORMAT/sujet a déjà cartonné, historique). `last30days` = SIGNAL CHAUD
> cross-plateformes (Reddit/X/TikTok/IG/HN en plus de YouTube — qu'est-ce qui se dit VIVANT maintenant, quels
> angles émergent). Un sujet validé par TubeLab seul peut être un evergreen mort ; un sujet chaud sur `last30days`
> seul peut ne pas avoir de format YouTube qui marche. Les deux se croisent systématiquement, dans n'importe
> quel ordre selon ce qu'on a sous la main en premier.

## CE QUI EST PROPRIÉTAIRE (irremplaçable gratuitement) vs WRAPPING (gratuit ailleurs)
TubeLab n'est PAS un wrapper : c'est un INDEX pré-calculé de millions de chaînes/vidéos + analytics dessus.
- 🔒 **Propriétaire (la valeur, à PAYER)** : recherche d'OUTLIERS (zScore/averageViewsRatio = suppose l'historique
  de chaque chaîne indexé), recherche SÉMANTIQUE de thème, graphe de chaînes RELIÉES, classifs IA (faceless/qualité/
  sentiment), estimations revenus/RPM. L'API YouTube ne sait PAS faire "trouve les outliers sur tel sujet".
- 🆓 **Wrapping (gratuit via yt-dlp / API YouTube Data v3)** : détails d'UNE vidéo connue, transcript, commentaires,
  vidéos d'une chaîne connue. → NE PAS cramer de crédits TubeLab pour ça.

## ⭐ RÈGLE DE ROUTAGE (économise les crédits)
- **DÉCOUVERTE (sujet/niche inconnus) → TubeLab** : `search_outliers`, `search_related_outliers`, `search_channels`,
  `search_related_channels`. C'est l'unique, ça vaut les crédits.
- **BRUT (cible déjà connue) → yt-dlp / API YouTube GRATUITE** : transcript, commentaires, frames, stats d'une
  chaîne/vidéo précise. (yt-dlp `--write-auto-sub`, `--write-comments`, `--dump-json`.) Gratuit = priorité.
- Gate 2 niveaux : Niveau 1 (découverte) = TubeLab large + `last30days` (demande VIVANTE). Niveau 2 (validation) =
  transcripts/commentaires des 2-3 candidats → yt-dlp gratuit de préférence.
- ⛔⭐ **RÈGLE OBLIGATOIRE (Aziz 2026-06-28) — JAMAIS conclure sur une vidéo de la SHORTLIST sans avoir extrait
  son TRANSCRIPT + ses TOP COMMENTAIRES (yt-dlp gratuit).** Un titre + des vues MENTENT sur le contenu réel
  (prouvé 2× le même jour : (1) Bhargav "Why Colonialism Made Some Poor" 1,96M = parle de l'INDE pas l'Afrique ;
  (2) Machi "The Africa They Don't Show You" semblait anti-Afrique au titre → en fait critique brillante du
  "western gaze" + mine d'or en commentaires). On ne le fait PAS pour tout le scan, mais pour TOUTE vidéo de la
  shortlist = OUI, systématiquement.
  ⛔ **NE JAMAIS REJETER sur le titre seul, ni même sur "le sujet n'est pas pile le nôtre" (Aziz 2026-06-28).**
  Si une vidéo a fait la shortlist, c'est qu'il y a une DEMANDE PROUVÉE — donc on lit le transcript + commentaires
  jusqu'au bout AVANT de décider. Un sujet hors-créneau peut contenir un ANGLE ou une MÉCANIQUE transposable à
  notre style (ex. Bhargav parle de l'Inde, mais sa thèse "les institutions pré-coloniales détruites" va dans le
  MÊME sens que Machi sur l'Afrique → réutilisable). Ça ne coûte rien (yt-dlp gratuit). On ne rejette QUE si,
  après lecture complète, rien n'est pertinent ni transposable. C'EST ÇA YouTube : trouver des sujets prouvés et
  les traiter sous un angle/méthode que les autres ne voient pas. Les commentaires = vérité-terrain sur ce que le
  public RESSENT/RÉCLAME (matière à angle + phrases-titres déjà validées par les likes). Commande : gotcha yt-dlp ci-dessous.

## LES 11 OUTILS — quand utiliser lequel
| Outil | Quand l'utiliser | Statut usage |
|---|---|---|
| `search_outliers` | "ce SUJET/mot-clé a-t-il produit des viraux ?" (query sémantique, filtres langue/durée/ratio) | ✅ rôdé |
| ⭐ `search_related_channels` | "qui sont les chaînes VOISINES de X ?" (pointer sur Sahel Chronicles/Bellona/TIH → cartographie de niche + concurrents) | ✅ testé 2026-06-16 |
| ⭐ `search_related_outliers` | "quels SUJETS gagnants chez les chaînes voisines de X ?" = sujets qui marchent dans NOTRE niche exacte | ✅ testé 2026-06-16 |
| ⭐ `search_channels` | "trouve des chaînes par niche + filtres" (faceless, ratio vues/subs, revenus, médiane) → modèles à étudier + créneaux sous-servis | ✅ testé 2026-07-11 (mais résultats sans stats exploitables tels quels — préférer `search_related_channels`/`get_channel_shorts` pour de vraies stats) |
| `get_channel` | stats d'une chaîne (subs, vues, médiane, ratio, revenus est.) | ✅ un peu |
| `get_channel_videos` | dernières vidéos + leurs stats (z-score par vidéo) | ✅ un peu |
| `get_channel_shorts` | shorts récents d'une chaîne → vital pour la stratégie SHORTS | ✅ testé 2026-07-11 (donne stats complètes + averageViewsRatio par short, très riche) |
| `get_video` | détails complets d'une vidéo (souvent remplaçable yt-dlp) | 🆓 préférer yt-dlp |
| `get_video_transcript` | transcript via TubeLab (mais yt-dlp gratuit fait pareil) | 🆓 préférer yt-dlp |
| `get_video_comments` | top commentaires (mine d'or sur ce que le public aime/reproche — cf. Sahel Chronicles) | 🆓 préférer yt-dlp |
| `get_credits_balance` | solde crédits (admin) | — |

## NOTES D'USAGE (gotchas)
- `search_outliers` : `averageViewsRatio` élevé (≥3-5) = vrai outlier. `query` accepte FR+EN (multilingue). Filtrer
  `durationFrom: 360` pour exclure les shorts si on cherche du long-form. `classificationIsFaceless: true` pour notre format.
- ⚠️ Un titre + des vues ≠ validation (peut être podcast recyclé / désinfo virale). TOUJOURS lire le transcript au niveau 2.
- ⚠️ Repérer le piège d'angle : si les outliers sont tous militants/pompeux (registre qu'on refuse), le sujet "marche"
  mais pas pour nous → angle analyste distinct OU écarter (charte).
- Réévaluer le ROI de l'abonnement après 1-2 mois d'usage COMPLET (pas 3 outils sur 11).
- ⚠️ **`publishedAtFrom` casse `search_outliers` (erreur 400)**, confirmé 2026-08-13. Ne pas l'utiliser pour
  filtrer par date — passer par le tri `averageViewsRatio`/`viewCount` post-résultat ou croiser avec `last30days`.

## ⭐ AUDIT TRANSCRIPTS CHAÎNE OFFICIELLE (2026-07-11) — 4 leviers sous-exploités
Agent dédié a extrait (yt-dlp, gratuit) + lu les transcripts des 13 vidéos tutoriels de
`youtube.com/@tubelabhq` (aucune manquante). Confirme/précise ce qui est déjà listé ci-dessus :
- **Ratio vues/abonnés = LE critère de tri actif**, pas un chiffre qu'on lit après coup. Ex donné dans leurs
  vidéos : 40k abonnés / 100k vues moyennes (ratio 2.5x+) = signal de niche chaude, supérieur au volume de vues brut.
  Trier/filtrer `search_outliers`/`search_channels` PAR CE RATIO dès la requête, pas juste `viewCount`.
- **Filtre LANGUE = sous-exploité chez nous, pertinent pour notre créneau.** TubeLab le présente comme LE hack pour
  trouver des niches à faible concurrence (ex. marchés FR/DE/JP moins saturés qu'EN). On n'a cherché qu'en anglais
  jusqu'ici → tester `language: "fr"` (ou liste FR+EN) sur nos recherches Afrique/Sahel, marché probablement sous-servi.
- **Sujets ADJACENTS, pas le mot-clé exact** — leur conseil verbatim : ne pas chercher QUE "NBA" mais aussi "football
  star controversies", "NFL underdog stories" etc. Transposé chez nous : pour un sujet Sahel/AES, chercher aussi
  "coup d'état explainer", "war documentary map" — pas seulement le mot-clé du sujet précis.
- **Filtre "recent outliers only"** pour capter la tendance ACTUELLE plutôt qu'un pic ancien (à date de publication).
- **Taxonomie 5 niveaux pour trouver des idées** (grille de lecture AVANT de lancer une recherche) : C = remake de ses
  propres tops ; B = sujet tendance hors-YouTube ; A = "competition stealing" (copier un format qui marche dans SA
  niche) ; S = "audience first" (piocher niches adjacentes déjà regardées par son audience) ; S bonus = "format
  transfer" (voler un format d'une niche totalement différente — c'est ce qu'on fait avec le moteur AES/aesGeo.ts
  transposé à d'autres sujets, cf. session 2026-07-11).
- **Fonctionnalités NON exposées dans le MCP (web-only, à date)** : Collections (bookmark de vidéos/chaînes +
  génération d'idées "twist" à partir d'une collection), rapports hebdomadaires automatiques par chaîne suivie
  (proche watchlist — "add a channel, get weekly trend reports"), Rank Tracker (suivi quotidien du classement de
  NOS vidéos sur des mots-clés + comparaison SERP vs concurrents), nœud n8n officiel pour automatiser un pipeline
  hebdo (TubeLab Node → LLM analyse → rapport). Si besoin de veille continue/automatique (pas juste ponctuelle
  comme aujourd'hui) ou de suivre le rang de nos propres vidéos publiées → passer par l'interface web, pas le MCP.

## VidIQ MCP — comparatif fait (2026-07-11), verdict : PAS prioritaire
VidIQ propose un MCP (18 outils, plan Max requis, 5 crédits/requête) avec un outil `outliers` cross-chaînes
comparable à `search_outliers`. MAIS son cœur de métier reste SEO/optimisation de SA PROPRE chaîne (`score_title`,
`score_thumbnail`, `keyword_research`, analytics connectées) — angle que TubeLab ne couvre pas du tout.
**Verdict : complémentaire, pas redondant, mais gain marginal pour notre veille cross-chaînes.** TubeLab reste
supérieur pour repérer des sujets/formats viraux ailleurs (filtres plus fins, pas de coût crédit additionnel).
VidIQ ne vaudrait le coup QUE si on veut aussi scorer nos titres/thumbnails avant publication (post-production,
pas pré-production) — pas un besoin actuel, à réévaluer si ce besoin émerge.
- 🆓 **TOP COMMENTAIRES via yt-dlp (gratuit, mine d'or à angle)** : `yt-dlp --write-comments --extractor-args "youtube:comment_sort=top;max_comments=N" --skip-download <url>`. Donne les commentaires les + likés (ce que le public dit/reproche/réclame = matière à angle + phrases-titres). Préférer à `get_video_comments` TubeLab (économise des crédits). Parser le `.info.json` (champ `comments`, filtrer `parent=='root'`, trier par `like_count`). Prouvé recherche CFA 2026-06-27.
- ⚠️ **Cross-plateforme via `/last30days`** (le "poumon présent") : Reddit/HN/YouTube = commentaires natifs ; TikTok/IG/Threads = clé ScrapeCreators (`~/.config/last30days/.env`). GOTCHA : `INCLUDE_SOURCES` n'est PAS lu depuis le `.env` du skill → le passer en variable d'environnement au lancement si besoin d'activer youtube_comments/threads.

## TEST 2026-06-16 — `search_related_channels` + `search_related_outliers` sur Sahel Chronicles (CONCLUANT)
2 appels = cartographie complète de NOTRE niche, impossible gratuitement :
- **12 chaînes voisines** + ratio vues/subs : `cascade` (ratio 16, ~398k vues/vid = modèle à étudier),
  `Africa Reloaded` (277k subs), `Adamslink Media` (435k, ~10k$/mois est.), `Blacklogic`, `NaTivi`, etc.
- **30 sujets gagnants de la niche** : SUJET ROI = **tensions/rivalités inter-pays africains** (Nigeria↔Afrique
  du Sud ×15 / 77k vues ; "Nigeria on the lips of foreigners" 165k ×7). ⚠️ MAIS angle des outliers = majoritairement
  `negative`/`critical`/racoleur ("SHOCK YOU", "EXPOSED") = registre qu'on REFUSE → opportunité de le traiter en
  ANALYSTE (angle libre). Contre-modèle validant : "How Nigeria Destroyed Itself" (History of Everything Podcast,
  510k vues, 55min, qualité `positive`) = preuve que le LONG SÉRIEUX cartonne aussi sur l'Afrique.
- LEÇON : on sous-exploitait TubeLab (3 outils/11). `search_related_outliers` = LE détecteur de sujets gagnants
  dans notre niche exacte. À lancer en début de toute recherche de sujet.
- GOTCHA : résultats volumineux → l'affichage tronque ; lire le fichier tool-result via python/jq. Confirmé
  aussi sur `get_channel_videos`/`get_channel_shorts` (2026-08-13, 75K+ caractères sur un catalogue de 120 vidéos).

## TEST 2026-06-16 — GATE COMPLET 6 ÉTAPES (rodé, ~22 crédits : 158→136)
Premier passage end-to-end du gate [[SUJET-PRIME-SUR-PRODUCTION]]. Validé : le workflow fonctionne et REDIRIGE.
- ÉTAPE 1 `search_outliers` mots-clés FR larges → pépites (Tõnd Média, Perduchan, Unveiling Marvels).
- ÉTAPE 2 `last30days` (skill) → sujet "grands projets africains" CHAUD (RDC/Inga, TGV CI, Tunisie <30j) → gardé.
- ÉTAPE 3 `search_related_outliers` par **videoId** (2 seeds croisés) + transcripts **yt-dlp gratuit** (routage respecté).
- ÉTAPES 4-5 → **GO** sur "mégaprojets africains / gazoduc Nigeria-Maroc-Europe", angle analyste+carte (libre). [[GAZODUC-MEGAPROJETS-SUJET]].
- ⛔⛔ LEÇON N°0 VÉRIFIÉE EN DIRECT : le seed RDC a pollué vers la guerre (M23/Rwanda, qualité negative) ; le seed
  mégaprojet-pur a convergé propre. Croiser 2 seeds = correction du biais. Confirme la règle, ne jamais 1 seul seed.

Liens : [[SUJET-PRIME-SUR-PRODUCTION]] · [[GAZODUC-MEGAPROJETS-SUJET]] · [[DECODE-modeles-fr-afrique]] · [[DECODE-sahel-chronicles]] · [[feedback_tubelab-editorial-filters]] · skill `last30days`.

## ⛔ GOTCHAS `search_channels` + LIMITE DU RATIO (2026-08-17)
- ⚠️ **`joinedDateFrom` casse `search_channels` (erreur 400)** — même famille que `publishedAtFrom` sur
  `search_outliers`. Ne pas l'utiliser pour isoler les chaînes récentes.
- ⚠️ **`search_channels` renvoie `subscribers: 0` et `averageViews: 0`** dans les hits (confirmé 2026-08-17,
  déjà pressenti en 2026-07-11). Seuls le **ratio** et `semantic.niches` sont exploitables tels quels.
  → Repasser par **`get_channel`** sur chaque candidat pour les vraies stats.
- ⚠️ Résultat volumineux (~88 K caractères sur 20 hits) → tronqué à l'affichage, parser le fichier tool-result.

### ⛔⛔ LE RATIO VUES/ABONNÉS SEUL MENT — le croiser avec `viewVariationCoefficient`
TubeLab enseigne le ratio vues/abonnés comme détecteur de niche chaude (cf. audit ci-dessus). **Vrai mais
insuffisant** : le ratio ne distingue pas une NICHE QUI MONTE d'une chaîne à UN SEUL COUP DE CHANCE.
**Cas vécu** — `@Matthis-B` (FR, history/geopolitics) remonte avec un ratio de **7,0**. Vérification
`get_channel` : 3 270 abonnés, 8 vidéos, moyenne 22 960 vues mais **médiane 3 800**. Une seule vidéo à
127 000 vues porte tout le ratio ; les autres font 674 à 19 000. `viewVariationCoefficient` = **1,87**,
`positiveOutliersCount` = 1.
> **RÈGLE** : ratio élevé + `viewVariationCoefficient` > ~1,5 = **coup isolé**, PAS une niche chaude.
> Toujours regarder la **MÉDIANE** (`medianViewsEstimate`), jamais la moyenne seule.

### ℹ️ Pas d'outil « niches qui explosent » dans le MCP (vérifié 2026-08-17)
Question posée par Aziz. **Réponse : non.** Les 11 outils cherchent des VIDÉOS ou des CHAÎNES, jamais des
niches comme objet. Ce qui s'en rapproche (Collections, rapports hebdo de tendance, Rank Tracker) est
**web-only, non exposé au MCP** (déjà listé dans l'audit ci-dessus). Le seul proxy disponible côté MCP =
le ratio vues/abonnés + `semantic.niches` dans les résultats — avec la limite ci-dessus.
