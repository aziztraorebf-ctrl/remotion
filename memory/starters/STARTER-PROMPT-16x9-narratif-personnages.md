# STARTER — Format 16:9 NARRATIF + PERSONNAGES (prochaine session)

> ⛔⛔ **MISE À JOUR 2026-07-28 — LE VOLET « PERSONNAGES » DE CE STARTER EST DÉPASSÉ.**
> Ce document date de juillet et suppose le **GeminiRig** (personnage riche articulé) — registre
> ÉCARTÉ en production (« pantin bien animé, pas maîtrisé »).
> **Le personnage narratif se fait désormais en STICK FIGURE**, registre passé en production le
> 2026-07-28 (6 scènes, socle validé par Aziz). Entrée :
> `remotion-cfa/src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` et le starter
> `remotion-cfa/memory/starters/STARTER-PROMPT-stick-figure-scene-narree.md`.
> ✅ **Ce qui reste VALIDE ici** : tout le volet DÉCOR/format 16:9 (parallaxe, palette chaud→froid,
> patron « plan large + véhicule »). C'est le volet PERSONNAGES qu'il ne faut plus suivre.


> ⭐⭐ **MISE À JOUR 2026-07-03** : `CargoVoyage16x9.tsx` (mentionné ci-dessous comme patron validé) est
> REMPLACÉ par `CargoVoyage16x9_LibreInspire.tsx` (`RND-CargoVoyage16x9-LibreInspire`) comme showcase final
> du format 16:9 — validé par Aziz. Les leçons du patron 2-scènes ci-dessous restent valides (parallaxe,
> palette chaud→froid), mais partir du nouveau fichier pour toute nouvelle scène. Détail :
> `memory/NEXT-ACTION.md` § 16:9 NARRATIF + PERSONNAGES, `memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md`.
>
> Créé 2026-06-29 (fin de session cacao). Dis « on reprend le 16:9 narratif » ou « on reprend les personnages ».
> Branche de travail : `feat/cacao-short-svg` (ou nouvelle branche `feat/svg-16x9-narratif`).
> ⭐ MIS À JOUR 2026-07-02 : 2 scènes prototypées ET VALIDÉES (voir § ÉTAT D'AVANCEMENT ci-dessous) — le patron
> « plan large parallaxe + véhicule + persos fond de plan » est PROUVÉ ET VALIDÉ Aziz sur les 2 scènes de la
> séquence port/usine. Lire ce paragraphe AVANT de repartir sur une piste ci-dessous (certaines sont déjà faites).

## ⭐ ÉTAT D'AVANCEMENT (2026-07-02) — à lire avant de relancer une piste

Session du 2026-07-02 : prototypage direct de 2 scènes narratives 16:9 séquentielles (pas les pistes 1-2
ci-dessous — parti directement piste 3 "scène narrative 16:9").
- ✅ **`CargoVoyage16x9.tsx`** (`_rnd/svg-scenes/`, compo Root `RND-CargoVoyage16x9`, 600f/20s) : plan large
  parallaxe 3 calques (ciel/horizon lent, cargo quasi-fixe qui tangue, océan qui défile vite), horizon
  PARAMÉTRIQUE interpolé entre 2 silhouettes (dunes/cacaoyers Afrique → pics enneigés Suisse), soleil qui
  traverse l'écran en arc → nuit étoilée, palette globale chaud→froid (`lerpHex`). Cueilleurs StickRig
  minuscules en fond de plan (`carry="none"` obligatoire à cette échelle, cf recette
  `personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md` § cueilleurs-fond-de-plan-16x9).
- ✅✅ **`PortDechargement16x9.tsx`** (compo Root `RND-PortDechargement16x9`, 500f/16.7s) : SUITE narrative
  directe (Scène 2 "l'arrivée et le paradoxe") — réutilise LITTÉRALEMENT les constantes de palette/dessin de
  CargoVoyage16x9 (v2 après un 1er rejet Aziz, voir doctrine ci-dessous). Grue qui décharge, usine qui se
  colorise neutre→premium, docker StickRig. **VALIDÉ PAR AZIZ (2026-07-02)**. Render de réf :
  `out/_r-and-d/16x9-narratif/port-dechargement-v1.mp4` · catbox https://files.catbox.moe/p58air.mp4.
  Le patron 2-scènes (voyage→arrivée/transformation) est donc PROUVÉ de bout en bout, réutilisable tel quel
  pour un autre sujet Souverain (or→raffinerie, minerai→usine…) — voir NEXT ci-dessous.
- ⭐⭐ **NOUVELLE DOCTRINE gravée** : `doctrines/SVG-MIDFORM-FORMAT.md` § 4bis (scène-VOYAGE = palette stable /
  scène-TRANSFORMATION = colorisation progressive obligatoire) + § 4ter (continuité de scène en séquence =
  réutiliser le CODE EXACT de la scène précédente, pas s'en inspirer — leçon d'un rejet Aziz puis fix réussi).
- NEXT possibles (évoqués par Claude en fin de session, PAS encore validés par Aziz) : Scène 3 au-delà du
  paradoxe port/usine, OU appliquer le même patron à un autre sujet Souverain (or→raffinerie, minerai→usine…).
  À CONFIRMER par Aziz avant de partir dessus.
- ✅✅ **8 DIRECTIONS COMPLÈTES (2026-07-01/02)** : profil/3-4/dos/face × miroir, consolidées dans
  `rig/StickRigMultiDir.tsx` (+ `rig/multiDirection.ts`). ⛔ DÉCISION AZIZ : pas de marche de FACE en plan large
  (réservée gros plans/statique — contrainte géométrique 2D, dos/face illisibles à petite échelle) — voir
  `personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md` § RÈGLE PRO DE MISE EN SCÈNE. Impacte toute scène narrative
  multi-plan à partir de maintenant.
- ✅✅ **3 doctrines R&D chaînes tierces FAITES et COMPACTÉES (2026-07-02)**, non encore testées sur notre
  matière — lire AVANT toute nouvelle scène narrative avec personnage ou format >90s :
  - [[doctrines/MISE-EN-SCENE-INFOGRAPHICS-SHOW]] (grammaire caméra) — règle clé RÉVISÉE : marche en plan
    large évitée SAUF si elle EST le sujet (colonne qui avance = animer pleinement, StickRigMultiDir pas
    gâché) ; profil=défaut si sujet mécanique ; dos=outil actif, pas à éviter.
  - [[doctrines/STRUCTURE-NARRATIVE-HYPOTHETICALLY]] (architecture macro, format 13-16min) — 2 architectures
    (boucle+escalade / paliers en U), objet-pivot recyclé, où investir l'effort d'animation.
  - [[doctrines/SCRIPTWRITING-MASTER-STORYTELLING-HYPOTHETICALLY]] (écriture phrase par phrase, LA plus
    actionnable des 3 — indépendante du visuel) : horloge concrète, fait placé au moment du besoin, climax
    = immobilité étirée, jamais de résolution complète.

## 🎯 OBJECTIF DE LA SESSION (vision Aziz)
Pousser le format **16:9 narratif** avec des **PERSONNAGES**. On a prouvé que le SVG transpose en horizontal
(profondeur, parallaxe, heure dorée) ET qu'un personnage d'encre est viable. Prochaine étape = de VRAIES SCÈNES
NARRATIVES, en partant de nos scènes existantes (Muraille Verte, Cacao) — en extraire des éléments et recomposer
en 16:9 **avec des personnages**. Tester aussi : **des personnages en VERTICAL** (donner une autre dimension aux shorts verticaux).

## ✅ CE QUI EST DÉJÀ PROUVÉ (acquis de la session 2026-06-29, NE PAS refaire)
- **Transposition 9:16 → 16:9** = re-composition (~70% réutilisé), pas reconstruction. Doctrine : `doctrines/SVG-MIDFORM-FORMAT.md` (§ TRANSPOSER + PROFONDEUR + PERSONNAGE).
- **Grammaire horizontale** : ombres/éléments rayonnent latéralement (œil G→D), SANS sous-titres (16:9 = écran/son activé),
  PROFONDEUR 3 plans (fond coloré varié + ciel vivant nuages/oiseaux), CAMÉRA lente + PARALLAXE (`camAt(p)` par profondeur) + HEURE DORÉE.
  Réf vidéo : `out/templates-souverain/svg-horizontal-16x9-REFERENCE.mp4` · catbox https://files.catbox.moe/ppqbb9.mp4
- ✅✅ **SYSTÈME PERSONNAGE VIVANT — PROUVÉ + RANGÉ (2026-06-30). SOURCE DE VÉRITÉ unique :**
  `src/projects/_shared/personnage-vivant-svg/` → `PERSONNAGE-VIVANT-INDEX.md` (doc) + `rig/poses.ts` (cinématique) +
  `rig/StickRig.tsx` (rig générique : ink + hat straw/cap/scarf + carry) + `rig/objectHandling.ts` (ramasser/déposer) +
  `scenes-proto/RecolteAuSol.tsx`. Gestes prouvés : marche (foot-plant), penché (compensation bassin), ramasser/tenir/
  transporter/déposer-dans-contenant, planter, porter. Prouvé 9:16 ET 16:9, cacao + GGW, 1 à 3 persos différenciés.
  ⛔ REPARTIR DE CE RIG (ne plus coder un perso de zéro). Leçon complète : `memory/key-learnings.md` § PERSONNAGE VIVANT
  + `episodes/souverain/cacao-chocolat-short/ANIMATION-STICKFIGURE-FEUILLE-ROUTE.md`.
  Scènes de réf (compos Root) : `PersoVivant-RecolteAuSol`, `Cacao-HistoirePlanteur`, `GGW-HistoirePlanteurs`, `Cacao-ChaineValeur-16x9`.
  ⛔ GARDE-FOU : silhouette stylisée pictogramme GGW, JAMAIS organique humain réaliste. Échelle : homme = ~1/3 cacaoyer.
- ⚠️ PRÉDÉCESSEUR (périmé, ne plus utiliser comme base) : `components/PlanteurEncre.tsx` + `beats/ProtoPlanteur.tsx`
  (rig minimal d'origine, segments raides, penché cassé). Remplacé et généralisé par `StickRig` ci-dessus.

## 🖼️ MODEL SHEETS PERSONNAGE (générés via LLM image, session 2026-06-29)
2 planches du planteur (5 poses : marche / récolte penché / panier épaule / s'essuie front / debout). MÊME brief.
- **Gemini (AVEC ref = ma silhouette)** ⭐ RETENU : reste dans NOTRE style encre épuré, plus expressif que la version manuelle.
  `public/_shared/refs/personnages/planteur-cacao-charsheet-GEMINI.png` · catbox https://files.catbox.moe/19rqw0.png
- **GPT (prompt seul, sans ref)** : plus illustratif/cartoon (vêtements, bottes) = SON style, hors-registre. Garder comme alternative.
  `public/_shared/refs/personnages/planteur-cacao-charsheet-GPT.png` · catbox https://files.catbox.moe/hc2ses.png
- **LEÇON CLÉ** : envoyer une REF de garde-fou change tout. Gemini-avec-ref pousse dans NOTRE direction ; GPT-sans-ref part dans la sienne.
  Outils : `scripts/tools/gemini-gen-image-ref.py` (--refs, gère la ref) · `scripts/tools/openrouter-gen-image.py` (--model, PAS de ref — prompt seul).
  ⚠️ GPT-image (`openai/gpt-5.4-image-2`) = LENT (>2min, lancer en background nohup). Gemini-image rapide.

## 🚀 PISTES À TESTER (par priorité)
> ⚠️ Pistes 1-2 périmées par la réalisation des 8 directions (voir § ÉTAT D'AVANCEMENT + PERSONNAGE-VIVANT-INDEX.md
> § 8 DIRECTIONS) — conservées pour traçabilité historique, ne pas relancer.
1. **PLANCHE EN SVG DIRECT vs redessin manuel** (la question d'Aziz) : demander à Gemini/GPT/GLM de générer le **CODE SVG**
   du personnage (pas un PNG) → paths manipulables/animables directement. Comparer qualité vs redessiner à la main d'après la planche PNG.
   Outils : `scripts/tools/llm-gen-svg.py` (GLM low-cost) ou GPT-5.5 (code SVG propre). Si le SVG généré est exploitable → énorme gain.
2. **Personnage SVG paramétrique multi-poses** : redessiner le planteur en squelette articulé (hanche/torse/bras/jambes en <path> props),
   d'après la planche Gemini. Interpoler ENTRE les poses (marche→récolte→repos) = séquence de geste continue, frame-driven.
3. **SCÈNE NARRATIVE 16:9** : reprendre une scène existante (verger cacao B3/B4, ou un beat GGW) + y placer un personnage qui VIT la scène
   (entre, traverse, agit) pendant que le décor défile en parallaxe + heure dorée. Le plan-séquence champ→usine (géo de l'injustice) = cible.
4. **PERSONNAGE EN VERTICAL** : tester si un personnage d'encre fonctionne en 9:16 → nouvelle dimension pour les shorts verticaux.

## 📂 FICHIERS CLÉS
- `components/PlanteurEncre.tsx` · `beats/ProtoPlanteur.tsx` · `beats/B5PontH.tsx` (16:9 réf) · `components/VergerCacao.tsx` (CacaoTree exporté).
- Doctrine : `doctrines/SVG-MIDFORM-FORMAT.md` (§§ 16:9 + personnage). Compos Root : `Cacao-B5PontH-16x9`, `Cacao-ProtoPlanteur-16x9`.

## 💡 3e SUJET ENVISAGÉ (discussion fin de session)
Reco = **le COBALT / la batterie (RDC)** : le CTA du cacao le promet déjà, sujet viral/contemporain, forme (mine→batterie→voiture)
faite pour l'horizontal+parallaxe. Sujet DIFFÉRENT du cacao (pas une redite). Alternatives : café (jumeau cacao, risque redite), or.

## ⭐⭐ REPRISE SESSION SUIVANTE (2026-07-02, priorités Aziz en fin de session) — LIRE EN PREMIER

Session du 2026-07-02 (suite) a produit : Scène 3 `RetourAuChamp16x9.tsx` prototypée mais PAS validée (reste
plate narrativement) + test comparatif Gemini vs GPT sur génération SVG de scène complète via
`svg-scene-narrative.py` (étendu avec `--ratio 16:9`, rétrocompatible 9:16 par défaut). Résultat : **GPT-5.5
nettement meilleur que Gemini 3.1 Pro sur une scène à plusieurs objets-héros** (Gemini a produit un arbre
déformé/incohérent) — Gemini https://files.catbox.moe/wmbt57.png · GPT https://files.catbox.moe/ofihq1.png.
SVG sources + JSON bruts : `out/_rnd/gemini-gpt-svg-test/`.

⚠️ **Ce résultat est L'INVERSE du test personnage-seul du 2026-06-29** (§ MODEL SHEETS ci-dessus : Gemini+ref
avait gagné, GPT-sans-ref était hors-registre). Hypothèse à vérifier en priorité : Gemini tiendrait mieux la
discipline de style sur un ASSET ISOLÉ, GPT composerait mieux une SCÈNE À PLUSIEURS OBJETS — pas de vainqueur
unique, le choix dépend de la tâche.

**4 priorités actées par Aziz pour la prochaine session (dans cet ordre — la 0 en tout premier)** :
0. **⭐⭐ OUVRIR PAR Seedance 2.5 (fal.ai) — image-to-video sur notre style SVG.** ⚠️ Notre mémoire
   (`memory/tools/seedance-rules.md`, 94 règles, MAJ 2026-04-26) ne connaît QUE Seedance 2.0 — "2.5" n'y
   apparaît nulle part et est hors knowledge cutoff Claude (janvier 2026) : NE RIEN AFFIRMER sur ses
   capacités sans vérifier d'abord. Étapes : (a) recherche Tavily rapide "Seedance 2.5 fal.ai" pour capacités
   réelles + doctrine différentielle vs 2.0 (durée annoncée par Aziz : jusqu'à 30s de scène, à confirmer) ;
   (b) si dispo sur fal.ai, tester image-to-video à partir d'une frame de nos scènes SVG déjà rendues
   (ex. `retour-champ-v2-frame350.png` ou une frame CargoVoyage/PortDechargement) — objectif : voir si
   Seedance peut ANIMER notre registre encre/stick-figure directement depuis une image fixe, complémentaire
   au SVG-animé-main plutôt qu'en remplacement. ⭐ Précédent positif déjà validé : Sonjata et d'autres épisodes
   ont prouvé qu'on peut prompter Seedance pour faire bouger des personnages exactement comme voulu depuis
   une image fixe (voir `memory/tools/seedance-rules.md` + `tools/seedance-storyboard-technique.md`) — mais
   PAS encore testé sur NOTRE style stick-figure minimaliste 16:9 spécifiquement. Coût : suivre la règle
   "montrer le prompt + coût estimé, attendre validation Aziz avant tout appel payant" (CLAUDE.md).
1. **Personnages Gemini/GPT poussés, STYLE LIBRE d'abord** : refaire un test génération personnage en SVG
   animable (pas un charsheet PNG statique comme le 29 juin) SANS la contrainte "stick-figure minimaliste" dès
   le 1er appel — viser explicitement le niveau de détail Hypothetically/Infographics Show (visage détaillé,
   torse vêtu, palette riche), PUIS SEULEMENT ENSUITE tenter de ramener vers notre registre encre. Le brief
   Scène 3 d'aujourd'hui était bridé par notre style dès le départ (`svg-scene-narrative.py` impose déjà
   "pictogramme digne" dans son brief) — probable cause de sous-exploitation du potentiel des modèles.
2. **Re-tester Gemini vs GPT sur les 2 cas d'usage (perso isolé ET scène complète)** pour confirmer/infirmer
   l'hypothèse ci-dessus avant de figer un choix de provider par tâche.
3. **Profondeur/parallaxe/mouvement de véhicules par les LLM eux-mêmes** : AUCUN test à date ne couvre ça —
   `svg-scene-narrative.py` ne génère QUE du statique (interdit explicite dans son propre brief : "AUCUNE
   animation de ta part"). Décider en ouverture de session : (a) brief de CHORÉGRAPHIE textuelle façon
   `storyboard-dual-gen.py` (le modèle décrit le mouvement, on code après) ou (b) rester sur du SVG statique
   qu'on anime nous-mêmes en Remotion (notre pratique actuelle). Objectif Aziz explicite : arrêter les tests
   isolés simples, passer à des preuves de concept concrètes/premium (voitures, vraie parallaxe, scènes riches).
