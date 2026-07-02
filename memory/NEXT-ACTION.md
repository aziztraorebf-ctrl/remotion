# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-07-01 (session cacao+GGW publication + peste-1347 bugfix geo/audio). A relire en debut de session, APRES PIPELINE.md.
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"

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

## ⭐⭐ 16:9 NARRATIF + PERSONNAGES — 2 SCÈNES SÉQUENTIELLES PROTOTYPÉES (2026-07-02)
> Starter : `memory/STARTER-PROMPT-16x9-narratif-personnages.md` § ÉTAT D'AVANCEMENT (dis « on reprend le 16:9 narratif »).
> ⏳ **EN ATTENTE RETOUR AZIZ** : `PortDechargement16x9.tsx` (compo `RND-PortDechargement16x9`) vient d'être
>   présenté (suite de `CargoVoyage16x9.tsx`, compo `RND-CargoVoyage16x9`) — PAS validé, montrer en 1er en
>   prochaine session avant de continuer.
> ⭐⭐ Doctrine gravée cette session : `doctrines/SVG-MIDFORM-FORMAT.md` § 4bis (scène-VOYAGE=palette stable /
>   scène-TRANSFORMATION=colorisation progressive obligatoire) + § 4ter (continuité de scène en séquence SVG =
>   réutiliser le CODE EXACT de la scène précédente, jamais "s'en inspirer" — un 1er essai générique a été
>   rejeté par Aziz avant le fix). Pointeur croisé : `doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md` §2.
> ✅ ACQUIS 2026-06-30 : système « personnage vivant SVG » PROUVÉ + rangé — rig générique animé par CODE
>   (marche/penche/ramasse/manipule-objet/plante/porte), validé Aziz sur cacao + GGW, en 9:16 ET 16:9, 1 à 3 persos.
>   ⛔ SOURCE DE VÉRITÉ = `src/projects/_shared/personnage-vivant-svg/` (INDEX + rig/poses.ts + StickRig + objectHandling
>   + scène-proto RecolteAuSol). REPARTIR DE CE RIG, ne plus coder un perso de zéro. Leçon : [[key-learnings]] § PERSONNAGE VIVANT.
>   Nouvelle recette 2026-07-02 : `cueilleurs-fond-de-plan-16x9` (persos minuscules en fond, `carry="none"` obligatoire).
> Acquis antérieurs (2026-06-29) : transposition 16:9 (profondeur/parallaxe/heure dorée) + model sheets Gemini-avec-ref.
> NEXT possibles (non validés Aziz, juste évoqués) : Scène 3 au-delà du paradoxe port/usine ; OU même patron sur
>   un autre sujet Souverain (or→raffinerie, minerai→usine) ; faire INTERAGIR 2 persos ; évolution 8 directions
>   (`[[IDEE-PERSO-8-DIRECTIONS]]`, pour le plan-séquence champ→usine).

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
