# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-07-02 (catalogue de 7 gestes du personnage cacao Gemini COMPLET — voir § PERSONNAGE
> VOLUMÉTRIQUE SVG ci-dessous). A relire en debut de session, APRES PIPELINE.md.
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"
> ✅ Catalogue de gestes personnage-vivant TERMINÉ (7/7), plus une priorité active — voir § PERSONNAGE
> VOLUMÉTRIQUE SVG pour le détail complet. Seule extension optionnelle en backlog : `planter-arbre`
> (2 personnages). Doctrine complète : `src/projects/_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md`
> § "Deux systèmes distincts : rig capsule = mécanique, personnage Gemini = habillage".

---

## ✅✅ PESTE 1347 — BUG GÉO + AUDIO CORRIGÉS, VALIDÉ AZIZ (2026-07-01)

> Livrable : `out/PRET-PUBLICATION/peste-1347-FINAL.mp4` (42 Mo, 103.4s). Catbox : files.catbox.moe/hptvlc.mp4
> Fix géo (territoires d'outre-mer rouges Beat1/2/3) + fix mix (musique 0.04, narration continue sans cuts).
> **VALIDÉ AZIZ** — transitions fluides, musique bien dosée. NEXT = programmer publication TryPost (comme cacao/GGW).
> **2 chantiers actés pour PROCHAINE SESSION** (détail : `episodes/peste-1347/STATUS.md` § PROCHAINE SESSION) :
>   1. Régénérer la narration avec le pipeline voix vivante (`PIPELINE-VOIX-VIVANTE-VALIDE.md`, Océane V3 + tags
>      + Speech-to-Speech GéoAfrique) — la narration actuelle (2026-05-15) est antérieure à ce pipeline (2026-06-10),
>      jugée "monotone" par Aziz par comparaison avec cacao/GGW.
>   2. Lancer un système multi-agent pour proposer des idées d'amélioration sur l'épisode (post-fix), en tenant
>      compte des acquis récents (personnage-vivant-svg, patterns SVG, etc.) — décider le type d'agents en session.

## ✅✅ CACAO + GGW — PUBLICATIONS PROGRAMMÉES (2026-07-01)

> Cacao : YT 2026-07-01 14h UTC · GGW : YT 2026-07-03 14h UTC (posts séparés YT vs IG+FB, TryPost n'a pas de
> caption par-plateforme — leçon gravée dans `memory/tools/trypost.md`). GGW coverB corrigé (bug sample-rate
> 44100/48000 qui ralentissait l'audio). TikTok reste manuel (compte en quarantaine).

## ✅✅ CACAO → CHOCOLAT SHORT — TERMINÉ, PRET PUBLICATION (2026-06-29)

> Short SVG vertical 9:16 (98,5s), pilier Souverain, registre encre/parchemin GGW. COMPLET et validé Aziz.
> **Livrable : `out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4`** · Catbox 72h : https://files.catbox.moe/bvbm63.mp4
> 5 beats (B1-B5) + musique B + SFX (palette GGW réutilisée + 4 créés, ALIGNÉS force alignment) + usine aux couleurs CI.
> Compo Remotion = `Cacao-FULL` (CacaoChocolatFull.tsx). ⛔ NE PAS refaire/re-rendre sans raison.
> **NEXT = PUBLIER** : trypost (YT+IG+FB) / postiz (TikTok — mais TikTok en quarantaine, cf bilan distrib).
>   Vu le bilan : prioriser YouTube + Facebook. Le short = teaser vers la version LONGUE (CTA renvoie au long).
> Détail session : `episodes/souverain/cacao-chocolat-short/STATUS.md` (§ TERMINE). Decisions Aziz tracees dedans.

## ✅✅ 16:9 NARRATIF + PERSONNAGES — patron 2-scènes PROUVÉ (plus une priorité active, backlog optionnel)
> Starter : `memory/STARTER-PROMPT-16x9-narratif-personnages.md` § REPRISE SESSION SUIVANTE (dis « on reprend le 16:9 narratif »).
> ✅✅ **VALIDÉ AZIZ (2026-07-02)** : patron 2-scènes "voyage→arrivée/transformation" PROUVÉ de bout en bout —
>   `CargoVoyage16x9.tsx` (`RND-CargoVoyage16x9`) + `PortDechargement16x9.tsx` (`RND-PortDechargement16x9`),
>   archivés `out/templates-souverain/FINAL-CargoVoyage16x9-v1.mp4` + `FINAL-PortDechargement16x9-v1.mp4`.
>   Réutilisable tel quel pour un autre sujet Souverain (or→raffinerie, minerai→usine).

## ✅ PERSONNAGE VOLUMÉTRIQUE SVG — SYSTÈME GRAVÉ, catalogue de 7 gestes complet (2026-07-02)
> Rétrogradé depuis ⭐⭐ PRIORITÉ IMMÉDIATE — le catalogue est maintenant COMPLET (7/7 gestes), plus une
> priorité active. Seule extension optionnelle en backlog : `planter-arbre` (2 personnages). Contenu
> conservé ci-dessous pour l'historique des décisions.

> Contexte complet : `src/projects/_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md` (§ Segments
> VOLUMÉTRIQUES, § GPT-5.5 générant du vrai code SVG, § LE VRAI TEST DÉCISIF, § Chaîne d'actions complète,
> § Extension du set de poses) + `memory/tools/pixellab.md` (§ PixelLab vs registre SVG, § Gamelabs Studio).

**✅ Priorité 1 — TERMINÉE cette session : rig volumétrique SVG intégré.** `capsuleSegment.ts` +
`StickRig.tsx` (nouveau prop `volumetric?: boolean`, défaut false = zéro régression) : jambes (cuisse+mollet+
genou+pied) ET bras avant (épaule+coude+main) en capsules tapered fermées, testé sur 3 poses
(debout/marche/bras tendu récolte) via `_rnd/svg-scenes/ProtoCapsuleLimb.tsx` (compo Root
`RND-ProtoCapsuleLimb`). Cinématique `computePose()` 100% inchangée. **Reste (mineur, pas bloquant)** : léger
décrochage visuel cheville/pied observé sur la pose marche (à fixer si le rig est adopté en scène réelle),
torse/bottes/chapeau restent en formes rigides existantes (pas encore en capsule), vérification 8-directions
(`StickRigMultiDir`) pas faite.

**✅ Priorité 2 — TESTÉE 2026-07-02, RÉSULTAT NÉGATIF : prompt GPT "rig-first" écarté.** GPT-5.5 a produit un
SVG 15 groupes + JSON de pivots syntaxiquement parfait, mais dès qu'on applique les rotations déclarées
(`transform="rotate(angle,pivot)"`), les jointures coude/épaule se DISLOQUENT visuellement (paths dessinés en
pose figée, pas d'emboîtement géométrique garanti sous rotation). Le rig capsule (`capsuleSegment.ts`,
priorité 1) reste la seule approche production-ready — la robustesse vient du recalcul géométrique par le
code à chaque frame, pas de la qualité du prompt. Détail + fichiers test : `PERSONNAGE-VIVANT-INDEX.md`
§ "Nuance importante — reproduire une pose ≠ concevoir pour l'animation" (verdict en fin de section).
**NEXT = Priorité 3 ci-dessous (déjà traitée, voir résultats) ou reprendre le rig capsule pour finir les
points mineurs (décrochage cheville/pied pose marche, torse/bottes/chapeau en capsule, vérif 8-directions).**

**✅✅✅ Priorité 3 — TESTÉE A FOND 2026-07-02, VERDICT FINAL : Gemini 3.1 Pro gagne pour marche/statique,
squat écarté, personnalisation validée.** 1er passage avait conclu GPT meilleur sur images fixes — Aziz a
challengé et posé LA question décisive : est-ce que ça bouge vraiment ? **Gemini produit un vrai rig FK
imbriqué** (`translate(joint) rotate(angle)` parent→enfant) → marche FLUIDE par interpolation continue.
**GPT produit des paths en coordonnées absolues SANS hiérarchie** → cut sec obligatoire, ça saute. Chaîne
d'actions codée (`ProtoGeminiActionChain.tsx`) : marche→arrêt→repart→idle solide (viewBox élargi pour ne
plus couper le pied avant en pleine foulée — bug réel confirmé par Aziz). **Volet accroupissement/squat
TESTÉ PUIS ÉCARTÉ** : la pose générée par un appel Gemini séparé donnait un personnage aux couleurs
DIFFÉRENTES de celui qui marche (Aziz a détecté ça à l'œil, confirmé par grep des couleurs) — ET c'est un
registre marginal selon notre propre doctrine (`MISE-EN-SCENE-INFOGRAPHICS-SHOW.md` : statique+marche =
dominant chez les studios pro, actions articulées au sol = rares). Leçon gravée : générer toutes les poses
d'un personnage en UN SEUL appel avec description figée, jamais pose par pose séparément. **Personnalisation
par palette VALIDÉE** : `GeminiRig` paramétré par un objet couleurs (6 clés), 3 variantes démontrées
synchronisées en marche, zéro coût API, zéro risque d'incohérence — approche à privilégier pour différencier
des personnages. Détail complet : `PERSONNAGE-VIVANT-INDEX.md` § "LE VRAI TEST DÉCISIF" + § "Chaîne
d'actions complète" + § "Pose accroupissement/squat — ÉCARTÉE".

**✅✅✅ DERNIER TEST DE SESSION — méthode "1 appel, personnage figé" PROUVÉE (2026-07-02)** : set étendu à
5 poses (idle/walk-a/walk-b + **offer** bras tendu + **reach-up** cueillette) généré en 1 SEUL appel Gemini
avec 6 couleurs hex explicites données dans le prompt + consigne "même personnage, pas 5 différents".
Résultat vérifié par grep : couleurs **strictement identiques** sur les 5 SVG (zéro variation, contraste
net avec l'échec squat). Scène narrative test codée (`ProtoGeminiOfferScene.tsx`, compo Root
`RND-ProtoGeminiOfferScene`) : marche→arrêt→tend le bras→hold→repart, rendu fluide et cohérent
(`out/_rnd/pose-bank-test/gemini-offer-scene.mp4`). **C'est la procédure à suivre pour toute extension
future du set de poses** — jamais un appel séparé par pose.

**NEXT si repris en prod** : étendre encore le set (porte-charge, immobile-contemplatif) avec la même
méthode 1-appel-personnage-figé, écrire un script d'extraction automatique JSX depuis le SVG brut (fait à
la main pour ces tests). Le rig capsule (`capsuleSegment.ts`, zéro dépendance LLM) reste l'option la plus
robuste pour la PRODUCTION immédiate si on veut zéro dépendance API.
> ✅ MISE À JOUR 2026-07-02 (session suivante) : porte-charge et immobile-contemplatif sont désormais
> FAITS (voir catalogue 7/7 plus bas dans cette section) — seul `planter-arbre` reste en extension
> optionnelle. La méthode a aussi été affinée : 1 pose par appel Gemini (pas un lot de 5+), SVG source
> littéral en patron plutôt que l'image PNG seule — voir § "Deux systèmes distincts" dans
> `PERSONNAGE-VIVANT-INDEX.md` pour le détail complet.

**✅✅✅ SESSION 2026-07-02 (suite) — "Demander à Gemini ses propres capacités" TESTÉE, catalogue de 7
gestes COMPLET.** Consultation en 2 questions séparées (script Cacao précis vs éventail large) : réponses
concrètes et actionnables, aucune hallucination (Gemini a bien respecté le contexte technique donné,
marquant même l'accroupissement "Borderline/Risky" — cohérent avec notre propre écart déjà acté).
**Insight inattendu** : le short Cacao publié n'utilise en fait AUCUN personnage — 100% data-viz
symbolique (tablette, carte, arbres, usine). Comparaison aux propositions Gemini restée théorique de ce
fait, mais a débloqué la vraie question de fond.

**⭐⭐⭐ RECADRAGE MAJEUR (Aziz) — 2 systèmes complémentaires, pas concurrents** : le rig capsule
(`capsuleSegment.ts`/`StickRig.tsx`/`poses.ts`) = la MÉCANIQUE de mouvement (comment un bras porte un
poids crédiblement, comment plier un genou, 8 directions), 100% code, zéro dépendance API. Le personnage
Gemini = l'HABILLAGE (silhouette/couleurs/style), décliné en poses figées. Le vrai travail de la session a
été de **transposer la mécanique du rig capsule vers le personnage Gemini**, geste par geste, PAS une
"migration" en un coup. Détail complet + leçons : `PERSONNAGE-VIVANT-INDEX.md` § "Deux systèmes distincts".

**Catalogue complet, 7/7 gestes** (tous testés en rendu réel, pas juste en théorie) :
1. `ProtoGeminiHandBasketWalk.tsx` — panier tenu à la main, balancier amorti par le poids.
2. `ProtoGeminiShoulderSackWalk.tsx` — sac à l'épaule, torse penché, cadence ralentie.
3. `ProtoGeminiBendPickup.tsx` — recolte-au-sol (marche→penche→ramasse→redresse→repart).
4. `ProtoGeminiManipulateObject.tsx` — ramasse→transporte→dépose dans un contenant.
5. `ProtoGeminiHandoff.tsx` — 2 personnages, transfert d'objet main-à-main.
6. `ProtoGeminiTreeCueillette.tsx` — cueillette-arbre (bras levé), 1er geste SANS référence rig capsule.
7. `ProtoGeminiContemplatif.tsx` — immobile-contemplatif, respiration en boucle.

**Leçons gravées les plus importantes** (détail complet dans `PERSONNAGE-VIVANT-INDEX.md`) :
- Donner le SVG SOURCE littéral en patron (pas juste l'image PNG rendue) est nécessaire pour préserver la
  continuité du personnage — image seule fait dériver la géométrie.
- 1 pose par appel Gemini >> lot de plusieurs poses d'un coup (instructions oubliées si trop cumulées).
- **Bug structurel répété 2 fois** : un bras qui tient un objet ne peut PAS suivre le grand balancier de la
  marche libre (±45°) — doit être figé à un angle réduit. Repéré la 1ère fois sur `marche-porte-charge`,
  RE-repéré sur `cueillette-arbre` malgré la leçon déjà gravée — signal qu'une leçon en mémoire doit être
  activement relue avant de coder un geste similaire, pas seulement découverte après un nouveau bug.
- Un membre qui ne doit pas suivre un tilt de torse doit être structurellement SORTI du groupe SVG qui
  applique ce tilt (bug "effet planche" sur le penché, jambes qui héritaient à tort de `rotate(torsoTilt)`).
- Un objet mal positionné vs invisible sont deux bugs différents à diagnostiquer séparément — test debug
  (couleur/taille volontairement absurdes) pour trancher vite.
- Les gestes qui RECOMBINENT des briques déjà validées (`passer-objet-main-a-main`) réussissent du 1er
  coup ; ceux qui inventent une mécanique from scratch demandent systématiquement 2-3 corrections.

**Position sur la délégation à un agent (question Aziz)** : PAS ENCORE — le goulot d'étranglement de
cette session était le jugement visuel itératif (repérer qu'un rendu est faux, comprendre pourquoi,
corriger), pas la génération de code. Un agent sans supervision visuelle serrée déclarerait "fait" sur un
rendu cassé. Reprendre l'idée une fois que le catalogue est assez stable pour qu'un agent ait une check-list
de vérification visuelle explicite à suivre.

**NEXT si repris** : `planter-arbre` (2 personnages, creuser+déposer un jeune plant — seul item du §
Recettes rapides encore non transposé). Fichiers scratch de toute la session :
`out/_rnd/pose-bank-test/response-capabilities-{A-script,B-broad}.md` + `Proto*.tsx` (7 composants Root).

**Priorité 4 — Exploration continue Gamelabs Studio pour un registre RASTER séparé** (pas urgent, en fond).
Pipeline API REST complet validé et documenté (`memory/tools/pixellab.md` § Gamelabs) : image→video→spritesheet
fonctionnel, résultat NET une fois le personnage correctement cadré (règle : sujet doit remplir ≥80% du cadre).
Walk cycle testé et cohérent (jambes qui alternent, bras en balancier). Bug MCP contourné (appeler l'API REST
directement, PAS le serveur MCP qui route vers localhost:8000 — 401 systématique). ⛔ Reste un moteur RASTER
(PNG/MP4) — pas un remplacement de StickRig pour notre registre SVG mixte actuel, mais piste sérieuse pour un
FUTUR projet 100% raster où le contrôle frame-exact importe moins que la richesse visuelle immédiate (animations
pré-générées directionnelles, comme fait pour Atlas/PixelLab). 14 crédits gratuits restants sur le compte Aziz.
Clé dans `.env` (`GAMELABS_API_KEY`), config `.mcp.json` → `gamelabs` (bugué, contourner via REST direct).
> ✅ **Scène 3 "RetourAuChamp16x9" prototypée mais PAS validée** (`_rnd/svg-scenes/`, `RND-RetourAuChamp16x9`) —
>   jugée "plate narrativement" après comparaison avec des propositions LLM plus riches (voir ci-dessous).
> ⭐⭐ **3 doctrines R&D gravées cette session** (5 chaînes tierces analysées, yt-dlp+vision+lecture script) :
>   `doctrines/MISE-EN-SCENE-INFOGRAPHICS-SHOW.md` (grammaire caméra — marche plan large OK SI elle est le
>   sujet), `doctrines/STRUCTURE-NARRATIVE-HYPOTHETICALLY.md` (architecture narrative format long),
>   `doctrines/SCRIPTWRITING-MASTER-STORYTELLING-HYPOTHETICALLY.md` (écriture phrase par phrase, la plus
>   actionnable). ⚠️ Hypothèses de studios tiers — PAS ENCORE testées sur notre propre matière.
> 🔧 **Test comparatif Gemini vs GPT (svg-scene-narrative.py --ratio 16:9, nouveau flag)** : GPT-5.5 bat
>   nettement Gemini 3.1 Pro sur une scène complète (Gemini a produit un arbre déformé) — INVERSE du test
>   personnage-seul du 2026-06-29 (Gemini+ref avait gagné). Hypothèse à vérifier : Gemini meilleur sur asset
>   isolé, GPT meilleur en composition de scène. Résultats : `out/_rnd/gemini-gpt-svg-test/`.
> ⭐⭐ **OUVRIR LA PROCHAINE SESSION PAR Seedance 2.5 (fal.ai)** — modèle inconnu de notre mémoire projet
>   (`memory/tools/seedance-rules.md` ne documente que 2.0) et hors knowledge cutoff Claude : Tavily d'abord,
>   ne rien affirmer sur ses capacités avant vérification. Objectif : image-to-video sur une frame de nos
>   propres scènes SVG (registre stick-figure), voir si Seedance anime notre style directement. Puis
>   priorités 1-3 : personnages Gemini/GPT en style libre d'abord (pas bridé), re-test Gemini vs GPT sur les
>   2 cas d'usage, parallaxe/mouvement de véhicules générés par les LLM (jamais testé — outil actuel = statique).

## 📊 BILAN DISTRIBUTION 1 MOIS (2026-06-28) — niche VIABLE, prioriser YouTube long + Facebook
> Premiere donnee perf reelle a J+1mois : YouTube 88 abos/8 vidéos · Facebook 1100 followers (croissance ATYPIQUE) ·
> Instagram 24 · TikTok = shadowban (apres suppression de masse — NE PLUS supprimer en masse). DÉCISION : niche
> viable, prioriser YouTube LONG + Facebook ; depriorise Instagram ; TikTok en quarantaine.
> Detail : `memory/BILAN-DISTRIBUTION-1MOIS-2026-06.md`. Conforte le pari format LONG (cacao = teaser vers long).

---

## 🆕 PROCHAINE SESSION DÉDIÉE — Grand Inga : Zoom Inversé (Powers of Ten)

> Session R&D Grand Inga 2026-06-28 : physicalité du sujet PROUVÉE. 4 prototypes produits (`IngaMondeVivant`, `IngaMondeV2` avec option C désaturation, `IngaDualScene`, `IngaSplitScreen`). Review Gemini reçue.
> **NEXT :** coder le "Zoom Inversé" (proposition Gemini, technique la plus forte) : macro turbine → dé-zoom carte SVG → câble d'or qui se trace → zoom sur village → bougies. Session dédiée.
> **À appliquer avant le Zoom Inversé :** turbine toujours ACTIVE en scène B (erreur narrative dans DualScene), câble émet halo froid sur les toits des maisons sans entrer dans les fenêtres, "siphon effect" sur les bougies au passage du câble.
> **Doctrine gravée :** Scène-Monde Persistante + Split-screen règle d'usage + 3ème voie Zoom Inversé → `memory/doctrines/SVG-MIDFORM-FORMAT.md`.
> **Prototypes R&D :** `src/projects/_rnd/svg-scenes/Inga*.tsx` (4 fichiers). Renders : `out/_r-and-d/inga-*.mp4`.

## 🆕 PROCHAINE SESSION SUGGÉRÉE (2026-06-28) — La PHYSICALITÉ du sujet
> ⭐ Point de départ donné par Aziz en fin de session R&D SVG. Hypothèse : c'est la PROPRIÉTÉ du sujet (scènes
> vivantes incarnées vs concepts abstraits) qui fait vivre ou mourir le style encre. GGW (arbres = gestes) vit ;
> CFA (mécanisme = métaphore froide) peine. → ajouter un 5e axe "physicalité" au gate [[SUJET-PRIME-SUR-PRODUCTION]],
> et TESTER sur le MÉGAPROJET BARRAGE (Grand Inga, déjà validé GO dans [[GAZODUC-MEGAPROJETS-SUJET]]).
> **STARTER COMPLET** : `STARTER-PROCHAINE-SESSION-physicalite-sujet.md` (tableau + livrable + test + rappels acquis).

---

## 🆕 FRANC CFA — MID-FORM SVG (pré-prod faite, 2026-06-27)
> ✅ Sujet validé + angle (B) "le courage + le coût réel" + TRIPLE fact-check + script de référence (V6) + jury LLM.
> ⭐ Pivot acté : MID-FORM, pas short (sujet à MÉCANISME → veut de la construction visuelle séquentielle, cf règle
> sujet→format dans [[SUJET-PRIME-SUR-PRODUCTION]]). Tout se transpose. → `episodes/souverain/franc-cfa-short/STATUS.md`.
> **NEXT** : étendre script V6 → mid-form 4-6min + storyboard SVG-d'abord (scènes parité/Dakar/entrée déjà esquissées dans STATUS §7).
> ⚙️ MÉTA prouvé cette session : la CHAÎNE [[RECHERCHE-PRESCRIPT-UNIFIEE]] (valider→écrire→fact-check 3 niveaux→jury) fonctionne A→Z.

## 🆕 MÉTA — TYPAGE SUJET enrichi : moteur narratif + trousseau de style (2026-06-27)
> Décortiqué avec Aziz suite au CFA. Conclusion : le CFA n'était pas un MAUVAIS sujet, il était mal FORMATÉ.
> Cause racine = on ne typait pas le **moteur narratif** (ce qui crée la tension), seulement la durée.
> ✅ GRAVÉ : (1) axe « moteur narratif » (retournement/mécanisme/récit/révélation-chiffre → dynamisme+format+style)
> dans [[SUJET-PRIME-SUR-PRODUCTION]] § TYPER LE MOTEUR NARRATIF. (2) Trousseau « encre » 3 clés (parchemin/blanc-cassé/
> blanc-froid selon le TON, accent sémantique unique, N&B intégral proscrit) dans [[SUJET-PRIME]] + [[SVG-MIDFORM-FORMAT]].
> Comparaison visuelle 3 registres : files.catbox.moe/jb8puk.png. **À éprouver au prochain typage de sujet réel.**

## 🔧 BACKLOG STRATÉGIQUE — Shorts SVG ↔ Longs Mapbox (Hub & Spoke) — assemblage short SVG désormais PROUVÉ (GGW)
> 🗂️ Analyse Hub & Spoke gravée dans `memory/doctrines/SVG-SCENES-GENERATIVES.md` § Hub & Spoke + `ETAT-GGW-MURAILLE-VERTE.md` (acquis GGW). Aziz veut s'y lancer « pendant que c'est frais ».
> En bref : 2 formats séparés MÊME niche — longs analytiques (Mapbox/3D, autorité) + shorts SVG génératifs
> (paper-cut/blueprint, pédagogiques, multi-plateforme, gardent la chaîne vivante). PAS de la dilution = Hub & Spoke.
> ⚠️ AVANT d'industrialiser : (1) créer une SIGNATURE VISUELLE commune longs↔shorts · (2) tunnel = NOTORIÉTÉ
> cross-plateforme, pas conversion directe · (3) garder le gate [[SUJET-PRIME-SUR-PRODUCTION]] sur les shorts.
> Assemblage de PLUSIEURS scènes SVG en récit court = PROUVÉ (Short GGW Muraille Verte terminé ; cacao-chocolat
> 2e short SVG multi-scènes terminé 2026-06-29). Le chantier restant = INDUSTRIALISER (signature commune longs↔shorts,
> cadence). Prérequis prouvé = [[SVG-SCENES-GENERATIVES]].

## 🔧 BACKLOG TECHNIQUE — Système CARTO V5 (reprendre quand Sénégal V3 fini)

> ✅ Système prouvé. Doctrine gravée dans `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`. Point d'entrée : `REPRISE-SYSTEME-CARTO-V5.md`.
> ⛔ Carte canonique = **GéoAfrique V5 (navy/gris/or)**. Les fichiers d3-geo parchemin V2 = PÉRIMÉS.
>
> **▶ RESTE** : (1) coder la vraie scène Mapbox Sénégal branchée audio · (2) peaufinage scène gisements (popup E4, plaque E2, jauge 18%) · (3) merger dans master. Session dédiée, pas urgent avant Sénégal V3 scène 6.

## ✅ Workflow Data-viz — SYSTÈME GRAVÉ (plus une priorité active)

> **MERGÉ DANS MASTER le 2026-06-20.** Pipeline complet dans `memory/doctrines/WORKFLOW-DATAVIZ.md`.
> Ce qui reste = optionnel (gate format phase 0 = doublon inutile). **Prochain vrai pas = l'éprouver sur une scène de prod réelle** (ex : Sénégal V3 scène 6).
> Détails dans `REPRISE-WORKFLOW-DATAVIZ.md` si besoin de relire le système.

---

## ⏳ ACTION OUVERTE — Activer les routines /schedule (NON FAIT, rappeler à Aziz)

> **Statut : EN ATTENTE.** Aziz a demandé un rappel persistant jusqu'à confirmation.
> Tant qu'Aziz n'a pas dit "c'est activé / fait", **re-signaler en début de session** et proposer de fournir les instructions.

**Quoi** : créer 2 routines cloud `/schedule` pour le monitoring Postiz (Aziz les crée lui-même — clé API en env cloud = sa décision sécurité).
**Comment (instructions que Claude peut redonner sur demande)** :
1. Commandes à taper :
   - `/schedule jeudi 9h exécute scripts/postiz-weekly-check.py et préviens-moi si un post a échoué`
   - `/schedule samedi 10h exécute scripts/postiz-weekly-report.py et donne-moi le bilan`
2. Lors de la création, ajouter Environment variable : `POSTIZ_API_KEY=<la clé du .env>`
3. Notification : connecteur Slack/email OU consulter https://claude.ai/code/routines
**Doc détaillée** : `src/projects/souverain/carousels/good-news/README.md` section "Monitoring publications (anti-scroll)".
**Quand Aziz confirme l'activation** → supprimer cette section et noter la date d'activation.

---

## Projets en cours — décision immédiate

### ⭐ SUJET VALIDÉ EN RÉSERVE (gate 2026-06-16) — Mégaprojets / Gazoduc Nigeria-Maroc-Europe
**Etat** : SUJET passé GO par le gate complet [[SUJET-PRIME-SUR-PRODUCTION]].
**Decision Aziz** : à produire en SESSION DÉDIÉE quand War-Map/Sénégal/Maroc seront finis.
**Reprise** : ouvrir `memory/GAZODUC-MEGAPROJETS-SUJET.md` + `DECODE-modeles-fr-afrique.md` (camp 3).

### 0. Carrousel "Good News" — pipeline hebdo PRET (2026-06-02)
**Etat** : Pipeline semi-auto data-driven COMPLET.
**Decision en attente** : aucune — pour le carrousel #2, lancer le workflow (voir README good-news section "Pipeline DATA-DRIVEN").
**Demarrer** : `python3 scripts/prepare-goodnews-weekly.py` puis suivre le BRIEF généré.

### 1. Maroc Batteries Short — RESTE A5 GÉOGRAPHIE + ASSEMBLAGE (vérifié 2026-06-03)

**ÉTAT EXACT (vérifié render par render 2026-06-03) :**
| Beat | État | Render |
|------|------|--------|
| Beat 0 Hook (Mapbox) | ✅ FINAL | `beat0-FINAL.mp4` |
| A2 Phosphate (Mapbox) | ✅ FINAL | `beat1-FINAL.mp4` |
| A3 Cailloux (Remotion) | ✅ FINAL | `a3-cailloux-FINAL.mp4` |
| A4 Acteurs (Mapbox) | ✅ FINAL | `beat3-FINAL.mp4` |
| **A5 Géographie (Mapbox)** | ❌ **STUB — À PRODUIRE** | `Beat4Geographie.tsx` = placeholder |
| A6 Question (Remotion) | ✅ FINAL | `a6-question-FINAL.mp4` |

**NEXT (2 tâches) — STARTER COMPLET : `memory/archive/starters-perimes-2026-06-15/STARTER-PROMPT-maroc-a5-geographie.md`** (scan templates + enchaînement premium + 3 signalements déjà faits) :
1. **A5 Géographie** (~37s, MAPBOX). 3 sub-moments : Maroc (monter dans la chaîne) / Europe (proximité Espagne, Volkswagen) / **triangle Maroc—Europe—Chine**. Pipeline Mapbox (`mapbox-session.py`).
2. **Assemblage final** : ffmpeg concat des 6 beats + 1 narration globale + mix.

### 2. Senegal Petrole & Gaz — REFONTE V3 SCÈNE PAR SCÈNE (MAJ 2026-06-25) ⭐⭐
**⭐ SOURCE DE VÉRITÉ UNIQUE : `memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md`**
**+ `out/episodes/senegal-petrole-gaz/_ASSEMBLAGE-V3.md`** (renders FINAUX).
- ✅ **SCÈNES 0, 1, 2, 3, 4, 5 = FAITES, gravées FINALES.** Audio 0→344.46s ≈ 70% narration.
- ⬜ **SCÈNE 6 = NEXT** (bilan : de zéro à exportateur, Beat14, ~344.46s→). Remotion data-viz.
ℹ️ PÉRIMÉS (supprimés 2026-06-25) : `STARTER-PROMPT-senegal-makeover-premium.md`, `STATUS.md` (V1), `REPRISE-SCENE-1.md`, `STARTER-SCENE-1.md`, `REPRISE-SCENE-2-COMPARAISON.md`, `REPRISE-SCENE-4-DETTE.md`.

### 3. Carousels Instagram (PRIORITE 3)
**Etat** : Or Africain + Thiaroye PRET-PUBLICATION. Mansa Moussa a refaire.
**Decision en attente** : commencer par Mansa Moussa ou Senegal Petrole ?
**Ma recommandation** : Senegal Petrole d'abord — la video vient d'etre publiee, la matiere est fraiche.

### 4bis. Peste 1347 — MI-FORME HORIZONTAL (CONCEPT VALIDÉ 2026-06-07 — BACKLOG)
**Statut** : concept validé, backlog — NE PAS commencer avant fin AES + Maroc Batteries.
**Fiche complète** : `memory/projects/peste-1347-midform.md`.

### 4. Peste 1347 Atlas — VALIDÉ AZIZ, voir section ✅✅ en tête de fichier
**État à jour** : voir la section "✅✅ PESTE 1347 — BUG GÉO + AUDIO CORRIGÉS, VALIDÉ AZIZ" tout en haut de ce fichier
(cette entrée-ci datait d'avant le bugfix du 2026-07-01, conservée seulement comme redirection).

---

## ⛔⛔ PRIORITÉ 2 — WAR-MAP SAHEL : BLOQUÉ SUR BUG CRITIQUE (2026-07-01)

> ⛔⛔ **BUG CRITIQUE DÉCOUVERT (2026-07-01, visionnage Aziz)** : les renders multi-segments présentés
> avaient des TROUS DE FRAMES aux jonctions (jusqu'à 40s de fin JAMAIS rendues sur P4, un chevauchement
> qui fait répéter une phrase, des trous de 8.6s et 14s ailleurs) — perçu par Aziz comme "voix qui
> saute/se répète/coupures brutales" sur ~8 des 20 points de son retour détaillé. Ce n'est PAS un problème
> de contenu/script manquant, juste de mauvais calcul des bornes `--frames=` lors du découpage en renders
> séparés. Garde-fou créé : `python3 scripts/tools/check-frame-continuity.py <bornes>` — DOIT renvoyer OK
> avant tout `ffmpeg concat` ou présentation future (règle gravée `DOCTRINE-SOUVERAIN.md` §3.8.6).
>
> **NEXT SESSION (lire `memory/episodes/warmap-sahel/STATUS.md` § REPRISE SESSION SUIVANTE en tête du
> fichier — c'est la source de vérité complète, ne pas dupliquer ici)** :
> 1. Poser la question process à Aziz en ouverture (agentique vs direct) — ne pas présumer.
> 2. Re-render en plages CONTINUES (P1+P2 en un seul fichier, P3, P4 en un seul fichier `9416-13500`)
>    + vérifier `check-frame-continuity.py` = OK avant tout assemblage.
> 3. Traiter les 20 retours détaillés d'Aziz (contours P2 manquants, sources visibles au lieu de
>    "données estimées", flèches CEDEAO à repenser, casques bleus ONU à Kidal, retirer texte Moura ajouté,
>    évaluer SVG narratif pour triple-screen ressources et franc CFA — prototype CFA déjà existant à
>    `out/_r-and-d/cfa-svg/`).
>
> ✅ Ce qui EST fait et validé côté code (ne pas refaire) : chantier SFX unifié P1-P4, raccord CEDEAO
> renforcé (mais visuel rejeté par Aziz, à repenser), drone Moura retiré, bugs P4 corrigés, contours P1 +
> drapeau libyen géographique réel, timeline retirée P2/P3, Acte1 validé (2026-06-27, catbox `6azb9e`).

---

## ⭐ PRIORITÉ 1 (APRÈS AES) — SOUDAN MID-FORM 7-8min (pré-prod TRÈS AVANCÉE, session 2026-06-16)

> **SUJET VALIDÉ GO** + grosse session de pré-prod faite le 2026-06-16.
> 🗂️ **POINT D'ENTRÉE = `memory/projects/soudan-midform.md`**
>
> **DÉJÀ FAIT (2026-06-16)** : données fact-checkées · scripts Actes 1+2 figés · audio GéoAfrique V3 · storyboards Actes 1-2 · mini-render pipeline validé · positionnement tranché.
>
> **NEXT (reprise pré-prod Soudan)** :
> 1. **Acte 3** : combler 2 trous recherche (Russie/Wagner-or-sanctions + Égypte) → `soudan-midform-ACTE3-NOTE-ACTEURS-EXTERNES.md`, PUIS écrire l'acte.
> 2. Actes 4 (coût humain — inclure nuance génocide ciblé Darfour) + 5 (perspective ouverte).
> 3. Au lock audio : check + régénération sélective acte par acte (`soudan-midform-AUDIO-ETAT.md`).
> 4. Production : vrais jetons Hemeti + Al-Burhan (Gemini) → coder Acte 1 complet cadrage serré.
>
> **Short Soudan en attente** : ACLED toujours inaccessible.

---

## 💡 CHANTIER SCRIPT — Système hook + CTA commentaire (2026-06-13, session dédiée)

**Deux livrables à construire en session dédiée :**
1. **Checklist hook universelle** à intégrer dans `SCRIPT-ORAL-DOCTRINE.md` — les 20 premières secondes DOIVENT contenir soit une contradiction choquante, soit une honte réhabilitée, soit un fait qui renverse une croyance commune.
2. **Template CTA commentaire** à insérer à 30-60s dans chaque script.

---

## 💡 BACKLOG ENRICHI — Xénophobie SA (2026-07-01)

> Statut : MISE EN PAUSE enrichie. Angle validé ("double face" / colère mal dirigée / apartheid économique).
> Données 2026 intégrées (25k expulsés, ultimatums, March and March, réaction continentale).
> Format Hub & Spoke (Long Mapbox + Short SVG) intellectuellement pertinent mais complexe — Short SVG testé (images-cibles GPT/Gemini générées, faisable pour scènes symboliques, difficile pour foule/paradoxe).
> **Gate AVANT production** : TubeLab validation demande audience → candidat pour "3e sujet" prochain cycle.
> Dossier : `memory/episodes/souverain/xenophobie-sa-EXPLORATION/`. État complet : `04-DECISIONS-OUVERTES.md` § 7-8.

## 💡 IDÉE BACKLOG — Pipeline Shorts automatisé trending (2026-06-13)

**Décision** : ne pas commencer maintenant — y revenir quand Long Format bien en place.

---

## Techniques a exploiter (session future)

**⭐ BACKLOG GeoFlowConnection (pipeline Mapbox)** — Coder `GeoFlowConnection` headless-safe (lignes/arcs animés entre pays, centroïdes dérivés des bbox projetées) au PREMIER sujet à flux. Détails : `feedback_pipeline-mapbox-maturite-autonomie.md`.

Dossier `_reference-atlas-poc/` : patterns pas encore portés dans le pipeline :
- `AtlasParcheminGlobe.tsx` → mouvements camera spheriques a adapter en Mercator
- `AnimatedCaravan.tsx` → route commerciale animee (applicable Atlas + Souverain)
- `atlas-parchemin-mande.json` → style Mapbox historique (Empire Mali, etc.)

---

## 🧹 CHANTIERS DE NETTOYAGE — FAITS (2026-06-25)

1. ✅ **svg-scenes archivés** : 29 composants R&D écartés → `_archive/`, Root.tsx nettoyé (44 imports + ~35 Composition supprimés), build propre. Commit `0150ddf`.
2. ✅ **atlas-v2-components.tsx** : PAS à extraire — c'est la bibliothèque partagée de toute la V2 Atlas (12+ scènes l'importent). Aucune action.
3. ✅ **Purge `out/`** : ~1 GB libéré (5.8G → 4.8G). Purgés : hooks-lib, chantier3-test, carto-v5, scene-gisements-diagnostic, b2-compare, svg-scenes-refs, warmap-sahel/_r-and-d, gisements-v2, scene-gisements, carto-protos, test-orchestration-cobalt, sa1-frames + warmap-sahel/wip (219M). Conservés : decode-hera + wip Sénégal (scene4 en cours).
4. ✅ **Frontière 2-mémoires clarifiée** : NE PAS fusionner. `.claude/.../memory/` = navigation (MEMORY.md index + feedbacks courts) ; `memory/` workspace = contenu (doctrines, STATUS, outils). Règle gravée dans MEMORY.md header.
5. **Items "À CONFIRMER"** : `PLAN-ASSEMBLAGE-FINAL` War-Map (validations ouvertes) + `PIXELLAB-MASTER-INDEX` (statuts à confirmer quand on attaque ces prods).

## 🧹 NETTOYAGE CODE — FAITS (2026-06-25, session agentique 3 agents parallèles)

1. ✅ **Root.tsx protos A→D** : -34 imports, -57 compositions (Prototype_A→R, ProtoHera, ProtoCarto, HeraFidele, Matter, IntroProto, Lobito, Poc). Commit `d6b9348`. Build propre (6 erreurs pré-existantes inchangées).
2. ✅ **CLAUDE.md vides + dashboards** : 33 CLAUDE.md supprimés, 2 dashboards orphelins retirés. Commit `e27ca73`.
3. ✅ **Audit src/+public/ .md** (77 fichiers) : 3 périmés supprimés (senegal parchemin V2 + niger url). Commit `d0d782b`. Cobaye maroc GARDÉ (base peaufinage).
4. 🟡 **CLAUDE.md principal** : à dégraisser si besoin — surveiller taille en session. PAS urgent.
5. 🟡 **Purge out/ restante** : 4.8 GB. Re-scanner >7j en session dédiée si besoin d'espace.

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

Format : 3 lignes max par projet (Etat / Decision en attente / Recommandation).
