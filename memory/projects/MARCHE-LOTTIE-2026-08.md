# Marché LOTTIE / animation freelance — état mesuré au 2026-08-26

> Première donnée COMMERCIALE jamais collectée sur le canal Lottie. Toute la veille antérieure
> (5 vendeurs Fiverr, personas, ~10 $ CA/seconde) portait sur des livrables VIDÉO.
> Source : 5 agents lancés le 2026-08-26 (Fiverr 106 gigs scrapés · Upwork 7 annonces lues clause
> par clause · mémoire interne · Rive · outils sans AE).
> ⚠️ **Se périme vite.** Les CHIFFRES sont des ordres de grandeur, les TENDANCES sont solides.

## ⭐ LES 5 VERDICTS (ce que la journée a tranché)

| Question | Verdict | Force de preuve |
|---|---|---|
| Le fichier `.aep` est-il un mur ? | ⛔ **NON** | ⭐⭐⭐ mesuré des 2 côtés |
| Rive paie-t-il plus que Lottie ? | ⛔ **NON** | ⭐⭐ gigs réels comparés |
| Le Lottie simple est-il commoditisé ? | ✅ **OUI, acté** | ⭐⭐⭐ pages de prix officielles |
| Le revenu passif Lottie existe-t-il ? | ⛔ **MORT** | ⭐⭐ témoignages vendeurs |
| Où reste la valeur ? | **déterminisme · échelle par données · fidélité mesurée** | ⭐⭐ déduction convergente |

## 1. ⛔ Le `.aep` n'est PAS exigé — le client veut de la RÉVERSIBILITÉ

**Fiverr** : la source AE est un **Gig Extra payant**, pas un livrable. Verbatim alan_art (Vetted Pro,
539 avis) : « Source files (After Effects) are available as a **Gig Extra**. The standard delivery
includes the compiled JSON/Lottie file. » Les listes « File format » des gros vendeurs ne contiennent
**JAMAIS** `.aep` — c'est JSON, dotLottie, SVG, GIF, MP4.

**Upwork** : **1 annonce sur 7** exige un `.aep` verrouillé — et c'est **la moins bien payée** (5-15 $/h).
Les 6 autres écrivent « **or equivalent** », « **depending on the workflow** », « **SVG or** », ou rien.

⭐ **Ce que le client veut vraiment**, verbatim de 2 annonces :
« because the animations may need to be **maintained or modified later** » ·
« **clean, predictable layer naming** so our developers can target layers reliably ».
→ C'est une demande de RÉVERSIBILITÉ, pas de logiciel. **Un JSON aux calques nommés y répond.**
→ ⭐ Le **NOMMAGE des calques** n'est donc pas un détail technique : c'est la CLAUSE CONTRACTUELLE.
   (cf. `client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md` : nos SVG structurés passent,
   un SVG Recraft sort en `path-248` = illisible = inlivrable).
⚠️ **Vigilance** : la page officielle Fiverr Pro définit encore le métier comme « Adobe After Effects
(the primary animation engine) + Bodymovin ». La plateforme PRÉSUME AE. Ne rien promettre, mais
anticiper la question en avant-vente.

**Chemin Lottie → AE (si jamais exigé)** : Bodymovin CONTIENT un importeur (`lottieImporter.jsx`,
464 lignes, route UI `fileImport`) qui reconstruit des calques natifs AVEC vraies keyframes et easing
bézier. ⛔ Limites codées : dégradés animés (saisie manuelle), texte « not fully supported ».
Prix : Name-Your-Own-Price, **0 $ pour un particulier MAIS ~20 $ obligatoires pour un usage COMMERCIAL**.
⛔ **JAMAIS TESTÉ EN RÉEL** (AE pas installé au 08-26) — code lu, aller-retour jamais fait.

## 2. Prix RÉELS (Fiverr, 106 gigs scrapés — la donnée la plus solide)

Tags : `lottie` **910** services · `lottie-animation` 889 · `lottie-json` 280 · `svg-animation` 241 ·
`logo-animation` **5 700+** (⛔ saturé, ne pas y aller).
**35 gigs sur 106 ont ≥100 avis** → marché mûr et profond, pas naissant.

Prix d'entrée sur 106 gigs : **médiane 25 $**, moyenne 39 $, de 5 à 180 $. Marché **BIMODAL** :
masse à 10-35 $ (imbattable sans avis) · poche Pro à 120-600 $ qui vend sur l'argument technique.

| Vendeur | Avis | Basic/Standard/Premium |
|---|---|---|
| exitmedia (Top Rated) | 836 | **45 / 95 / 195 $** |
| zuzuza (Top Rated) | 824 | 35 / 70 / 160 $ |
| alan_art (**Vetted Pro**) | 539 | **180 / 350 / 600 $** |
| motioneugene (Top Rated) | 362 | 120 / 220 / 300 $ |

⭐ **Transactions RÉELLES** (pas des prix affichés) visibles dans les avis d'alan_art :
**600-800 $ · 400-600 $ · 1 000-2 500 $**. C'est la meilleure preuve que le haut de gamme se vend.

**Délais normatifs** : Basic 2-3 j · Standard 2-4 j · Premium 3-5 j. ⛔ Ne pas descendre à 24 h
(= segment low-cost). Les **Pro assument des délais PLUS LONGS et les facturent** (7-10 j) — la
vitesse n'est pas le levier du haut de gamme. Rush payant systématique (+5 à +50 $ ; +300-800 $ chez le Pro).

**Titre** — gabarit confirmé par **98 titres sur 106** :
> `I will create custom lottie json animation for your website or app`
Fréquence dans les titres : `lottie` 98 · `animation` 76 · `json` **52** · `app` 51 · `svg` **50** ·
`web` 40 · **`rive` 14**. → mettre `svg` plutôt que `gif` (tag moins encombré : 241 vs 889).
⛔ Ces fréquences mesurent l'**OFFRE**, pas la demande. Aucune donnée de volume de recherche acheteur.

**Vignette** : quasi toujours une **VIDÉO** (`og:video` sur toutes les pages) — une image fixe est un
désavantage structurel. ⭐ **Le geste qui sépare 20 $ de 180 $** : les Pro ne montrent pas de jolis
dessins, ils montrent **l'animation DANS une interface** (alan_art : « Fintech dashboard promo », logo
client Olympics).

**Budgets Upwork observés** : Lottie unitaire 100-500 $ · pack onboarding 150 $ · Lottie complexe
(couches dynamiques runtime) 500 $ · **set UI produit SaaS 2 000-3 000 $** (⚠️ **1 SEULE annonce**,
client à 149 k$ dépensés / 96 embauches — PAS un segment courant, cf. objection d'Aziz).

⛔⛔ **Les tarifs 80-150 $/h et 200-800 $/interaction relayés le 08-26 viennent de SITES DE CONSEIL
TARIFAIRE** (WhatShouldICharge, Biztoolkit, Jobbers) — parties intéressées, aucune transaction observée.
**Ne pas les utiliser comme seuil de décision.** Observation d'Aziz sur la page Upwork réelle : 10-25 $,
majoritairement hors Occident. C'est une donnée plus fiable que ces 3 sites.

## 3. ✅ LA COMMODITISATION EST ACTÉE (pages de prix officielles)

| Outil | Prix réel |
|---|---|
| **Cavalry** | ⭐ **GRATUIT pour les individus** (racheté par Canva) — *et* procédural/data-driven |
| Lottie Creator | gratuit **5 exports**, puis 19,99 $/mois |
| Lottielab | gratuit MAIS **l'export Lottie est payant** |
| SVGator | gratuit avec **filigrane sur le JSON** |
| Jitter | gratuit bridé 720p |
| **Figma Motion** | ⛔ **N'EXPORTE PAS en Lottie** (MP4/GIF/SVG animé ; Lottie = « format futur ») |

⛔ **Icône, loader, micro-interaction, transition simple = ne se vendent plus** (n'importe qui les fait
gratuitement en navigateur). **Ça invalide la liste de démos « logo/icône/loader ».**

⭐ **Où la valeur a migré — 3 constats convergents** :
1. **Le marché monétise le FICHIER LIVRABLE PROPRE** (Lottielab fait payer exactement l'export,
   SVGator filigrane le gratuit). C'est là où notre chaîne est prouvée (maison-gaz, 16 Ko).
2. **Le plafond est dans le FORMAT, pas dans les outils** : expressions, effets, blend modes, luma
   mattes ne survivent à AUCUN export Lottie. **Aucun éditeur web ne franchira ce mur — il est spécifié.**
   → Ce qui reste rare : **savoir CE QUI PASSE avant de le promettre**. On a exactement ça
   (`CE-QUI-PASSE-EN-LOTTIE.md`, mesuré sur 8 fichiers).
3. **Le déficit est en AMONT** : ces outils donnent une timeline, pas une intention narrative, pas de
   données réelles, pas de reproductibilité. **Cavalry gratuit ET data-driven** = preuve que la valeur
   migre vers le pilotage par la DONNÉE, terrain où le code bat le clic.

⭐⭐ **Prestation vendable identifiée : la QA DE FIDÉLITÉ.** LottieFiles le dit eux-mêmes — « un fichier
valide n'est pas une animation fidèle ». Notre outillage mesure l'écart pixel par pixel. Plus il y a
d'éditeurs gratuits, plus il y a de fichiers qui s'affichent mal → ce service devient PLUS nécessaire.

## 4. RIVE — une case de format à 9 $/mois, PAS un pilier

**Le MCP officiel EXISTE mais ne génère PAS de `.riv` hors éditeur** : il **télécommande l'éditeur
desktop ouvert** (« available only in the desktop Editor », « must have the app opened »). Même geste
que notre MCP LottieFiles Creator — **et même limite : l'export final reste manuel.**
⛔ MCP tiers `paradoxsyn/rivemcp-releases` (prétend générer du `.riv` sans éditeur) : **binaire
closed-source, non officiel, 3 exports gratuits puis licence payante à prix non public**. Rétro-ingénierie
d'un format binaire propriétaire = casse à chaque montée de version. **Non recommandé.**

**Format `.riv` = binaire propriétaire, AUCUN équivalent texte/JSON, aucune API d'écriture.**
⛔ **On ne peut pas produire du `.riv` par code seul.** L'éditeur est sur le chemin critique.

| Voie d'entrée | Verdict |
|---|---|
| **SVG → Rive** | ✅ **import natif, éditable** (styles INLINE, pas CSS) ← **notre SVG est l'actif transférable** |
| **Lottie → Rive** | ⛔ **réservé Enterprise 120 $/siège/mois** (exige 10 M$ de CA) → notre chaîne Lottie NE se recycle PAS |

**Prix** : Free = 3 fichiers seulement (ingérable dès le 4e client) · **Cadet 9 $/mois = exports
illimités** (suffit) · Voyager 32 $ · Enterprise 120 $. **Runtimes MIT, zéro contrainte commerciale.**

⛔ **AUCUN premium tarifaire Rive vs Lottie** : gigs Fiverr Rive 15-100 $ (dohcasrive 15 $, zuzuza 35 $,
cole_82 40 $, feyisara 100 $) vs médiane Lottie ~39 $/h. Les fourchettes se SUPERPOSENT.
⚠️ **Piège** : l'affirmation « Rive commande un premium » qui circule porte sur des **SALAIRES TEMPS
PLEIN tech (120-160 k$)**, pas sur du freelance. Ne pas transposer.
⭐ Ce qui marche : les gigs qui **GROUPENT Rive + Lottie** (timir69, cole_82) → « je livre dans le format
que votre équipe consomme » = notre 2e axe B2B. **Rive = 4e case de format** (MP4 · MOV alpha · `.json` · `.riv`).

⭐ **`@remotion/rive` EXISTE officiellement** (https://www.remotion.dev/docs/rive/) → un `.riv` se rend
dans notre pipeline actuel. Test peu coûteux et réversible.
⚠️ Obstacle réel : **gestuel, pas conceptuel** — Rive demande de dessiner et keyframer À LA MAIN, ce que
toute notre méthode évite. La state machine, elle, nous serait facile (on écrit déjà des machines à états).

## 5. ⛔ REVENU PASSIF LOTTIE = MORT (mais la vitrine est vivante)

Le marketplace LottieFiles **migre vers IconScout**. Un vendeur refuse publiquement : « **their payout
model is not transparent** » (4 relances sans réponse claire). Seul gain chiffré trouvé :
« **I'm at $186 after 2 or 3 years** » (indice Reddit, thread derrière login — pas une donnée).
⛔ Barrière 5 animations publiques minimum, review lente, payout opaque.

⭐⭐ **MAIS le retournement utile** : les annonces Upwork jugent sur des **liens Lottie QUI JOUENT**
(« Link to **LottieFiles.com previews** if possible », « links preferred »). **Sans profil peuplé, on est
filtré AVANT que la qualité du code compte.**
→ **Publier sur LottieFiles = VITRINE et PREUVE, JAMAIS revenu.** Chaque pièce devient un lien à coller
dans une candidature. La piste passive morte devient l'actif d'ACQUISITION.

## 6. Autres plateformes

⭐ **`remotion.dev/experts`** = annuaire officiel de freelances Remotion — endroit où coder la vidéo en
React est **le critère d'entrée**, pas une bizarrerie à défendre. ⛔ Conditions d'accès NON VÉRIFIÉES.

Upwork = candidature ciblée (banc d'essai, 2-3 premières reviews) · Fiverr = gig packagé, offre durable ·
Freelancer.com ⛔ prix cassés 2-8 $/h · Toptal screening sévère · Malt ⛔ **accès Canada NON CONFIRMÉ**
(bloquant depuis 2 sessions) · Dribbble/Behance inbound portfolio · IconScout payout opaque.

## 7. ⚠️ CE QUI RESTE NON PROUVÉ (ne pas bâtir dessus sans vérifier)

1. ⛔ **L'angle « code / sans After Effects » n'est vendu par PERSONNE** : **0 gig sur 106**.
   Différenciation réelle et inoccupée — mais **aucun acheteur ne la réclame** dans les données.
   **Angle à TESTER, pas un gagnant supposé.**
2. ⛔ Aucune donnée de **volume de recherche acheteur** (pas d'outil public Fiverr).
3. ⛔ Le segment **UI produit SaaS 2-3 k$** repose sur **1 seule annonce**. Objection d'Aziz retenue :
   ça demande un gros portfolio et de la crédibilité, ce n'est pas courant.
4. ⛔ « **Le bas du marché s'effondre à cause de l'IA** » : relayé depuis un site de conseil, **non vérifié**.
   ✅ Le seul signal SOLIDE (source gouvernementale, dans la mémoire) : *Web & Digital Interface Designers*
   **+17,8 %** de salaire réel sur 10 ans vs **video editors −10,1 %**. → la fracture est
   **« construire des systèmes » vs « produire des artefacts »**.
5. ⛔ **Motif** (outil cité le 08-26 comme signal anti-AE) : **INTROUVABLE** après ~8 recherches.
   Ne pas le citer. ⚠️ Homonymie avec **Motiff** (2 f), sans rapport.
6. **μLottie** (cometkim, MIT) : compilateur AOT Lottie→JS, résout le poids des players (lottie-web
   ~300 Ko ; player LottieFiles 369 Ko + ~1 Mo WASM). ⚠️ **Proof of concept jamais publié, pas d'API.**
   À surveiller, pas à mettre en production.

## 8. Ce que ça implique pour les DÉMOS et l'OFFRE

⛔ **NE PAS** faire des démos « logo / icône / loader » : couche commoditisée et gratuite.
⛔ **NE PAS** vendre « je fais du Lottie » : c'est devenu gratuit.
⛔ **NE PAS** viser le tag `logo-animation` (5 700+ gigs).

✅ Vendre **le déterminisme et l'échelle** : N variantes générées par données, versionnées en git,
re-rendues à l'identique, livrées au format que le client consomme.
✅ Montrer **l'animation DANS une interface** (le geste qui sépare 20 $ de 180 $).
✅ **Calques nommés** systématiquement (= la clause contractuelle « source or equivalent »).
✅ Déclarer proactivement « optimized JSON, no AE dependency » plutôt que le laisser deviner.

→ Table de décision technique : `memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md`
→ Positionnement : `memory/doctrines/PILIERS-B2B.md` · page de gig : `memory/freelance-linkedin/GIG-PAGE-VALIDEE.md`
  ⚠️ cette page vend une **VIDÉO EXPLAINER**, PAS du Lottie — le mot « Lottie » n'y apparaît pas.
→ Cas client en cours : `memory/client-sim-tests/upwork-chill-meter/STATUS.md`
