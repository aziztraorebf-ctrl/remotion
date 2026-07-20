# Cacao → Chocolat SHORT — SOURCES (vérifiables, réutilisables en vidéo)

> Toutes les sources qui ont construit le script + les chiffres. Verifiees au fact-check (Tavily + Deep Research,
> 2026-06-28). Reutilisables pour : (a) re-verifier un chiffre, (b) afficher une source EN BAS D'ECRAN dans la
> video (principe : pas de cartouche, mais sources discretes en bas). Fichiers bruts complets : voir § ARCHIVE.

## 1. CHIFFRES DU SCRIPT — source par affirmation (verrouilles)

| Chiffre (script V4) | Valeur verifiee | Source primaire | A afficher comme |
|---|---|---|---|
| Afrique Ouest = ~3/4 du cacao | 75-77% (campagne 2020/21) | ICCO "Global Review of Cocoa Farming Systems" | "ICCO" |
| Cote d'Ivoire + Ghana | ~60% a deux (CI ~44%, Ghana ~15%) | ICCO 2019/20 | "ICCO" |
| Paysan touche moins de 10% | 6-11% du prix final (FAO ~10-11% moyenne) | FAO / BASIC (etude chaine de valeur 2018-2020) | "FAO / BASIC" |
| 70% valeur + 90% marges aux marques/distributeurs | confirme | FAO / BASIC | "FAO / BASIC" |
| Ghana 15% prod / 1,5% (2 Mds$) de 130 Mds$ | confirme (estimation datee) | Oxfam (communique World Fair Trade Day) | "selon Oxfam" |
| Cacao ne pousse pas en Europe (climat tropical) | ceinture 20°N-20°S | ICCO / FAO + Parlement UE "Cocoa in figures" | (geo, pas de source ecran) |
| ~60% feves echangees -> UE | importations mondiales (NON dit en narration V4) | Parlement UE / etudes marche | (ecarte du script) |

## 2. ACTU 2026 (pour le Beat 5 "comment ca change" + futur format long)
- Cote d'Ivoire BAISSE prix planteur -57% le 4 mars 2026 (2800->1200 FCFA/kg). Source : RFI (4 mars 2026),
  African Agribusiness. -> https://africanagribusiness.com/ivory-coast-slashes-farmgate-cocoa-price-by-57-percent/5453
- Ghana baisse -28,6% ; LID +400$/t retire par traders (Bloomberg fev 2026).
- LID introduit 2020 "n'a pas atteint ses objectifs" : paysans ~53% du prix CIF en 2024. Source : USDA Cote d'Ivoire
  Cocoa Sector Overview 2025.
- CI vise transformer 100% de sa recolte d'ici 2030. Source : Deep Research (refs ICCO/presse).
- Fairtrade Living Income Reference Prices 2026 : fairtrade.net (note explicative avril 2026).

## 3. SOURCES EDITORIALES / ANGLE (validation de la demande, pas des chiffres)
> Ces videos+commentaires ont PROUVE la demande et donne l'angle. Reutilisables : phrases-titres, angle, comprehension audience.
- **Machi — "The Africa They Don't Show You"** (1,96M vues) : https://www.youtube.com/watch?v=Q71Q9eOndw4
  - Angle "western gaze" + extraction. Transcript : § ARCHIVE.
  - ⭐ COMMENTAIRE-CLE 14k likes (StarRose108) : "the best chocolate comes from Switzerland, but where are the cacao
    bushes in Switzerland?" = LA METAPHORE-MERE du short.
  - ⭐ COMMENTAIRE 21k likes (TRUTH-SEEK3R) : "Africa isn't poor, Africans are. Big difference." = la chute.
  - COMMENTAIRE 4,6k (elim9054, citant Parenti) : "not underdeveloped, they're overexploited."
  - COMMENTAIRE 4,1k (thilivhalieasy) : "we allow neocolonialism... our thieves parading as leaders" = nuance interne.
- **Aneesh Bhargav — "Why Colonialism Made Some Countries Poor But Others Rich"** (1,96M) :
  https://www.youtube.com/watch?v=EYfCtHj-bCA
  - Parle de l'Inde (pas l'Afrique) MAIS meme these : colonie d'EXTRACTION vs PEUPLEMENT (Nobel eco 2024,
    "institutions detruites"). Reutilisable pour le concept. Commentaire 10k (parthkhanolkar) : "Settler colony vs
    extraction colony. Big difference." + commentaires reclamant la responsabilite interne (#5,6,8,12).
- **History Scope — "Why is Africa Still So Poor?"** (5,78M, 40min) : https://www.youtube.com/watch?v=TW46xDXNO3Q
  - Preuve que le LONG-format serieux cartonne. Technique visuelle = Data-Hero simpliste (continents sur barres-cubes).
- Autres outliers (demande, contexte) : Economics Explained "MIT Study Why Africa Is Poor" (2,36M,
  youtube.com/watch?v=1k8TXQWVsoI) · The Invisible Hand "Why Giving Money to Africa Makes it Poor" (1,7M).

## 4. ARCHIVE — fichiers bruts (scratchpad session 2026-06-28, A COPIER si on veut les garder durablement)
> ⚠️ scratchpad = volatil. Si besoin de garder : copier vers ce dossier. Sinon, les transcripts/commentaires
> sont re-extractibles gratuitement via yt-dlp (videoId ci-dessus) — c'est la methode, pas besoin de tout stocker.
- Transcripts : `scratchpad/validate-svg/machi.en.vtt`, `bhargav.en.vtt`
- Top commentaires (JSON) : `scratchpad/validate-svg/machi_comments.info.json`, `bhargav_c.info.json`
- Fact-check brut Deep Research : `scratchpad/cacao-deepresearch-RESULT.md` (8 affirmations, verdicts detailles)
- Jury LLM brut : `scratchpad/cacao-jury-RESULT.md` (GPT-5.5 + Gemini 3.1 Pro + Kimi, 8,5/10)
- Methode de re-extraction (gratuite) : `yt-dlp --write-auto-sub --sub-lang en --skip-download <url>` (transcript) ·
  `yt-dlp --write-comments --extractor-args "youtube:comment_sort=top;max_comments=60,all,0" --skip-download <url>` (commentaires).
