# REPRISE — SCÈNE 1 V3 (état au 2026-06-19, fin de session)

> Session très dense. Contexte plein → arrêt propre. Voici l'état EXACT pour reprendre à froid.
> Branche : `feat/senegal-v3-refonte`. Tous les commits sont faits.

## ✅ CE QUI EST FAIT ET VALIDÉ (méthode)
On a retrouvé/validé un PIPELINE complet, à réutiliser pour chaque moment de scène :
1. **Storyboard image multi-planche** (début/milieu/fin) sur 2 modèles : Gemini 3.1 Flash (concept/lisible)
   + GPT-image-1 via fal.ai (matière/profondeur). Script : `scripts/tools/storyboard-dual-gen.py`.
2. **Breakdown JSON** sur GPT-5.5 (ÉCRASE Gemini au breakdown : 13 étapes précises, valeurs spring, positions).
   Script : `scripts/tools/storyboard-breakdown-dual.py`. ⚠️ OpenRouter limite hebdo (était 5$→passée 20$).
3. **Code** Remotion guidé par le breakdown. **Assets : Gemini 3.1 Flash défaut, GPT secours.**
Détail gravé : `memory/tools/openrouter-gpt-image-et-breakdown.md` (section test 2026-06-19).
Décodage Data-Hero (grammaire pivot central) : `memory/atlas-decode/DECODE-mpesa-data-hero-MOTION.md`.

## ✅ DÉCISIONS ACTÉES (scène 1)
- **Périmètre** : moments ABSTRAITS → graphique Data-Hero Remotion (intro 2 récits + 60%). Gisements →
  CARTE Mapbox (spatial). ⛔ Pas de vidéo 100% graphisme. Règle [[spatial-carte-abstrait-remotion]].
- **Intro 2 récits** = COIN-FLIP. Storyboard retenu = GEMINI (`V3-REFONTE/storyboards-scene1/intro-recits-gemini.png`,
  catbox nd08cl). Face A "LA MALÉDICTION" (navire+derrick rouge, mer rouge) → FLIP → Face B "LE MIRACLE"
  (monument souveraineté) → FISSURE → "DEUX ILLUSIONS CONSTRUITES".
- **60%** = BARIL-JAUGE (Gemini, catbox 78dcbs) : baril vide → se remplit or 60%/rouge 40% → chiffre dégonflé.

## 🔧 ÉTAT DU CODE INTRO COIN-FLIP (À PEAUFINER, pas fini)
- Composant : `src/projects/_proto-16-9/SenegalScene1IntroCoin.tsx` (commit 2c10eee).
- Utilise le VRAI template `src/projects/_shared/components/layouts/CoinFlip.tsx` (étendu rétro-compat :
  props `custom` React par face + `rotateYExternal` sync voix + `diameter` + `showDotGrid`).
- Dernier render : https://files.catbox.moe/qx51mw.mp4 (timing CORRIGÉ : pièce dès f0, vraie 3D, DIAM 620).
- **Verdict Aziz : "meilleure, avec des détails à changer"** (détails PAS encore précisés par Aziz).
- **Détails repérés par Claude (à confirmer/compléter avec Aziz)** :
  1. Data greffées Face A pâles/peu lisibles → renforcer contraste+taille.
  2. Face B SANS data greffées (asymétrie Data-Hero) → ajouter "souveraineté renforcée / développement durable".
  3. Monument Face B (Landmark navy sur or) un peu sombre → plus présent.
  4. Bord crénelé de la pièce discret sur les faces pleines.

## ▶ NEXT (à froid)
1. Demander à Aziz SES détails à changer sur l'intro coin-flip + ajouter ceux de Claude → corriger → re-render →
   AUTO-VÉRIFIER (comparer au storyboard) AVANT de présenter.
2. Puis coder le BARIL 60% (baril-jauge, storyboard Gemini prêt + faire son breakdown GPT-5.5).
3. Puis les GISEMENTS sur carte Mapbox (Sangomar/GTA/Yakaar) — voir STORYBOARD-SCENE-1-PREMIUM.md (déjà fait par DA).

## ⚠️ CHANTIER SÉPARÉ EN ATTENTE (session dédiée, desktop/mode élevé)
`memory/CHANTIER-AUTOMATISATION-ANTI-FOUILLIS.md` = élaguer le fouillis scripts/hooks/doctrines + porte
d'entrée unique + auto-vérif imposée par hook + remise en question branche systématique & structure dossiers.
Cause racine des erreurs d'exécution de Claude. Prompt de démarrage fourni à Aziz.

## POINTEURS
- Diagnostic global 8 scènes : `V3-REFONTE/DIAGNOSTIC-GLOBAL-8-SCENES.md`
- Storyboard premium détaillé : `V3-REFONTE/STORYBOARD-SCENE-1-PREMIUM.md`
- Breakdowns : `V3-REFONTE/breakdowns/` (intro-COIN-gpt5.md = le plus détaillé)
- Audio V3 + alignment : `public/souverain/senegal-petrole-gaz/audio/` (narration-v3-VALIDEE.mp3, scene1-alignment.json)
