# TubeLab — inventaire outils + règle de routage (validation de SUJET)

> Outil de DÉCOUVERTE d'outliers/niches YouTube (abonnement mensuel). Sert le GATE de
> [[SUJET-PRIME-SUR-PRODUCTION]] (valider la demande d'un sujet AVANT de produire).
> ⚠️ NON DÉFINITIF : l'espace bouge vite. "L'outil de découverte d'outliers actuel = TubeLab" — si un meilleur/
> moins cher apparaît (VidIQ, TubeBuddy, autre), on remplace ICI, le gate ne change pas. Crédits : voir `get_credits_balance`.

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
| ⭐ `search_related_channels` | "qui sont les chaînes VOISINES de X ?" (pointer sur Sahel Chronicles/Bellona/TIH → cartographie de niche + concurrents) | ⬜ à exploiter |
| ⭐ `search_related_outliers` | "quels SUJETS gagnants chez les chaînes voisines de X ?" = sujets qui marchent dans NOTRE niche exacte | ⬜ à exploiter |
| ⭐ `search_channels` | "trouve des chaînes par niche + filtres" (faceless, ratio vues/subs, revenus, médiane) → modèles à étudier + créneaux sous-servis | ⬜ à exploiter |
| `get_channel` | stats d'une chaîne (subs, vues, médiane, ratio, revenus est.) | ✅ un peu |
| `get_channel_videos` | dernières vidéos + leurs stats (z-score par vidéo) | ✅ un peu |
| `get_channel_shorts` | shorts récents d'une chaîne → vital pour la stratégie SHORTS | ⬜ à exploiter (shorts) |
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
- GOTCHA : résultats volumineux → l'affichage tronque ; lire le fichier tool-result via python/jq.

## TEST 2026-06-16 — GATE COMPLET 6 ÉTAPES (rodé, ~22 crédits : 158→136)
Premier passage end-to-end du gate [[SUJET-PRIME-SUR-PRODUCTION]]. Validé : le workflow fonctionne et REDIRIGE.
- ÉTAPE 1 `search_outliers` mots-clés FR larges → pépites (Tõnd Média, Perduchan, Unveiling Marvels).
- ÉTAPE 2 `last30days` (skill) → sujet "grands projets africains" CHAUD (RDC/Inga, TGV CI, Tunisie <30j) → gardé.
- ÉTAPE 3 `search_related_outliers` par **videoId** (2 seeds croisés) + transcripts **yt-dlp gratuit** (routage respecté).
- ÉTAPES 4-5 → **GO** sur "mégaprojets africains / gazoduc Nigeria-Maroc-Europe", angle analyste+carte (libre). [[GAZODUC-MEGAPROJETS-SUJET]].
- ⛔⛔ LEÇON N°0 VÉRIFIÉE EN DIRECT : le seed RDC a pollué vers la guerre (M23/Rwanda, qualité negative) ; le seed
  mégaprojet-pur a convergé propre. Croiser 2 seeds = correction du biais. Confirme la règle, ne jamais 1 seul seed.

Liens : [[SUJET-PRIME-SUR-PRODUCTION]] · [[GAZODUC-MEGAPROJETS-SUJET]] · [[DECODE-modeles-fr-afrique]] · [[DECODE-sahel-chronicles]] · [[feedback_tubelab-editorial-filters]] · skill `last30days`.
