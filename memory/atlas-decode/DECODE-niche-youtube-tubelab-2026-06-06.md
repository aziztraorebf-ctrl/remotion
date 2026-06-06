# DECODE — Niche YouTube Afrique via TubeLab (session 2026-06-06)

> Premier décodage data-driven de la niche via TubeLab MCP (Pro 29$/mois, connecté à claude.ai).
> Outils : `search_outliers` (2 cr) + `get_video_transcript` (gratuit) + yt-dlp frames (notre stack).
> Solde départ : 300 crédits. averageViewsRatio = ratio vues/médiane-chaîne (le vrai outlier score).

## SETUP TUBELAB (acquis durable)
- MCP connecté via claude.ai/settings/connectors → `https://public-api.tubelab.net/mcp` → login OAuth (pas de clé API à copier).
- **Visible dans Claude Code après redémarrage VS Code.** 11 outils : search_outliers/channels/related, get_channel/videos/shorts, get_video/transcript/comments, get_credits_balance.
- Filtres puissants de search_outliers : `language`, `averageViewsRatioFrom`, `classificationIsFaceless`, `durationFrom/To`, `type` (video/short), `revenueEstimationFrom`, `publishedAtFrom`. sortBy: averageViewsRatio/zScore/views/revenue.
- **Complémentarité clé** : TubeLab donne le CONTENU (transcript, ratio, revenus, langue) ; notre yt-dlp donne le VISUEL (frames) que TubeLab ne fait pas. Combiner les deux = décodage complet contenu+forme.
- **`outlier-scan.py` maison = OBSOLÈTE** (TubeLab fait tout en mieux : ratio exact, z-score, langue, faceless, revenus, base historique 400k chaînes). À archiver.

## DEUX CRÉNEAUX VALIDÉS PAR LES DONNÉES

### A. SAHEL / AES / Traoré — CHAUD, format concurrent FAIBLE
Outliers : "Deadly African Soldiers" x19 (6.4M), "France SURROUNDS Sahel—Traoré STRIKES BACK" x15.8 (chaîne 3k subs!),
"Traoré's New Agenda" x9.3 (160k), "Burkina Faso Under FIRE" x5.9 (96k), "Mali Expand Her Territory" x5.1.
- Chaîne modèle : **SAHEL TODAY** (@saheltoody, 31k subs, FR+EN, x5-x9 régulier).
- **Décodage VISUEL** ("Burkina Faso Under FIRE", frames yt-dlp) : ZÉRO animation/carte. Stock footage + archives
  recyclées (téléphone gros plan, foule rue, soldats désert) + watermark chaîne + ton sensationnaliste.
  Valeur 100% dans le SCRIPT, pas le visuel.
- **Décodage HOOK** (transcript) : "Villages stormed... Most people scrolling think they understand... but here's
  what almost nobody asks... if you miss it you'll misunderstand where this conflict is heading." = curiosity gap + "tu crois savoir mais non".
- **OPPORTUNITÉ** : notre war-map premium (Soudan déjà construit) ÉCRASE ce visuel. Même histoire (attaques Dortenga,
  AES qui se consolide, territoire Mali qui s'étend) mais cartographiée + lisible.
- **DÉFI = LE TON.** Toute la niche surfe anti-France/sensationnalisme ("STRIKES BACK Shocks the West"). Notre
  différenciant = SOBRIÉTÉ ANALYTIQUE premium (façon Johnny Harris dans un océan criard). Angle factuel cartographique, sans prendre parti.

### B. HISTOIRE AFRICAINE FACELESS LONG-FORM — PROUVÉ + MONÉTISÉ (le plus aligné)
Outliers : **"Timbuktu/Mansa Musa — Richer Than European Capitals"** x8.7, **559k vues, ~3633-4751$ revenus** (LONG 66min, faceless) ·
"Ancient African Timeline" x10.2 (120k, 58min) · "Kushite Empire Forgotten Powerhouse" x8.6 (128k) ·
"What happened to African Kingdoms" (Jabzy) x4.9 **1.4M** · "Richest Man In History" (Jordan Welch) x5.8 **6.6M** (Short).
- **Mansa Musa = le sujet africain le plus viral qui existe** (6.6M Short + 559k long), transposable mondialement, ZÉRO angle militant. **Et Aziz l'a DÉJÀ produit en Atlas.**
- Format LONG faceless domine (40-66 min, x8-x10) → valide le pivot mid-form.
- **Décodage HOOK Timbuktu** (transcript, ouvre exactement comme nos scripts Souverain/César) :
  "While European nobles ate off wooden plates and relieved themselves in courtyards, there was an African city
  where scholars debated philosophy in marble halls... when its ruler went on vacation he accidentally crashed
  the Mediterranean economy for a decade. This isn't a fairy tale." = CONTRASTE CHOC + anecdote-pivot + "but here's what they don't want you to know".
- Note : le "they don't want you to know" est leur formule (qu'on évite par charte — formules mortes). Mais le
  contraste-choc d'ouverture = exactement notre méthode ebauche-v1.

## CONCLUSIONS STRATÉGIQUES
1. **Deux pistes prochaine vidéo** : (A) Sahel/AES war-map [chaud, actuel, défi du ton] OU (B) Histoire africaine
   premium mid-form [prouvé, monétisé, aligné charte, Mansa Musa déjà fait]. **B est le moins risqué éditorialement.**
2. **Le format faceless long-form histoire = notre océan.** Les concurrents font des images IA/stock ; nous = carte
   animée + PixelLab + war-map. Même créneau prouvé, visuel incomparable.
3. **Le pivot mid-form est doublement validé** : tous les gros outliers histoire sont LONG (40-66min).
4. **TubeLab résout titres/hooks/sujets** : transcripts des outliers = matière directe pour modéliser nos hooks (en gardant notre sobriété).

## NEXT SESSION
- Décider piste A (Sahel war-map) vs B (histoire premium mid-form) — décision de GOÛT/vision Aziz.
- Si B : Mansa Musa / Timbuktu en mid-form premium est le candidat n°1 (sujet le plus viral + déjà des assets Atlas).
- Approfondir : Trending Formats de TubeLab (title frameworks), comments mining (idées sujets), search_channels FR.
- Voir aussi [[strategie-chaine-midform-discovery]] (virage acté) + [[warmap-script-process]] (rigueur factuelle).
