# STARTER — Format 16:9 NARRATIF + PERSONNAGES (prochaine session)

> Créé 2026-06-29 (fin de session cacao). Dis « on reprend le 16:9 narratif » ou « on reprend les personnages ».
> Branche de travail : `feat/cacao-short-svg` (ou nouvelle branche `feat/svg-16x9-narratif`).

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
