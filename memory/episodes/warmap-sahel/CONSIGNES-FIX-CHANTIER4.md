# CONSIGNES FIX CHANTIER 4 (fin habitée) — à appliquer en SESSION SÉPARÉE

> Créé 2026-06-14. Le DA downstream (Gemini+Kimi) a diagnostiqué 2 problèmes RÉELS non résolus + donné les fixes.
> Synthèse complète tracée dans `PLAN-REFONTE-P4.md` (section "DA-BRIEF DOWNSTREAM CHANTIER 4"). Ici = consignes
> code PRÉCISES (valeurs avant→après) pour appliquer sans tâtonner.
>
> ⚠️ **CONFLIT DE SESSION DÉTECTÉ 2026-06-14 14:34** : une session PARALLÈLE codait+rendait le CHANTIER 1 (Exode)
> sur le MÊME fichier `Partie4Cout.tsx` (render chrome-headless actif). J'ai ARRÊTÉ d'éditer pour ne pas corrompre.
> AVANT d'appliquer ces fixes : `git status` + vérifier qu'aucun render n'est en cours + relire le fichier en entier
> (il a changé : Chantier 1 ajouté). Ne pas éditer en aveugle.

## ❌ PITCH — NE PAS appliquer (re-testé + rejeté avec preuve)
Les modèles recommandaient pitch 40°. RE-TESTÉ 2026-06-14 (preuve `wip/p4-pitch-test-{0,40}.mp4`) → frames quasi
identiques. Notre carte = aplat sans relief Mapbox → pitch ne crée aucune profondeur. ÉCARTÉ. Top-down pur.
(Leçon gravée DA-BRIEF-GATE.md : vérifier chaque solution modèle contre nos contraintes réelles + tester si testable.)

## ✅ FIX A — CAMÉRA QUI PANE (équilibre géo)
Fichier : `engine/SahelWarMapEngine.tsx`, keyframes `PARTIE4_CAM_KEYS` (zone fin habitée f12640+).
But : commencer SERRÉ sur l'axe Bamako-Ouaga (est hors-champ), puis PAN lent vers le nord-est + léger dézoom =
"dévoiler le Niger comme un rideau qui se lève". Le vide désertique devient révélation de la taille, pas un trou.
- Cluster d'action sur le tiers GAUCHE/bas (règle des tiers), jamais centré sur le centre géométrique.
- Drift continu, jamais à l'arrêt. (NB : la dernière passe avait élargi à zoom 4.05 centré — déséquilibré. Préférer
  un PAN progressif : f12640 serré ouest zoom ~4.8 → f13030 cadre élargi mais centré plus à l'EST zoom ~4.2 → fin.)

## ✅ FIX B — HIÉRARCHIE ÉCHELLE + OPACITÉ (lisibilité, le vrai fix)
Fichier : `parties/Partie4Cout.tsx`. Valeurs EXACTES (peuvent avoir bougé si Chantier 1 a touché le fichier — relire) :

1. **DIRIGEANTS → fantômes 0.35 dès les soldats** (ligne ~706) :
   AVANT : `const attenuate = interpolate(frame, [F_THREAT, F_THREAT + 40], [1, 0.7], ...)`
   APRÈS : `const attenuate = interpolate(frame, [F_SOLDIERS, F_SOLDIERS + 40], [1, 0.35], ...)`
   (parapluie politique en filigrane, encadre sans boucher. Déclenché à F_SOLDIERS, pas F_THREAT. 0.35 pas 0.7.)

2. **SOLDATS plus petits** (ligne ~684) : `const D = vmin * 0.05;` → `const D = vmin * 0.037;` (pions tactiques).

3. **MENACE = forme DIFFÉRENTE des soldats** (le "qui est qui") : actuellement jeton rond `D = vmin*0.055` (ligne ~661).
   → Réduire le jeton à `vmin*0.032` ET le placer À L'INTÉRIEUR de la tache rouge SVG (pas à côté). La tache organique
   (déjà codée, cercles #8B0000 multiply qui pulsent) PORTE l'identité "danger" ; le petit jeton-combattant est dedans.
   Différenciation : dirigeant = GROS chip or · soldat = petit chip vert · menace = tache rouge + micro-jeton dedans.
   ⛔ JAMAIS 3 bordures (or/vert/rouge) à 100% dans un rayon de 100px (bruit chromatique).

4. **Étagement temporel STRICT** : soldats (F_SOLDIERS=12820) puis menaces (F_THREAT=13000) = 180f = 6s d'écart, OK.
   Garder la cascade stagger entre soldats (déjà en place via `s.at` décalés).

5. **Z-index** : petites pastilles (soldats/menaces) au-dessus des gros portraits ; taches rouges SOUS les chips.

## ✅ DÉJÀ FAIT (acquis, ne pas refaire)
- Portraits dirigeants DÉTOURÉS (Recraft remove_background) → fond opaque retiré, plus de carré/clipping.
  Assets : `p4-assets/leader-{mali,burkina,niger}.png` (versions détourées en place). Leçon : `gemini.md`.
- Menaces DISPERSÉES (7 zones JNIM/EIGS sur tout le Sahel, plus de cluster central) — `THREAT_ZONES` ligne ~182.

## APRÈS CES FIXES
Render scale 0.5 segment f12640-13290 → juger équilibre+lisibilité → full HD → reste de la refonte (Chantiers 1/3/2
si pas finis par la session parallèle) → assemblage final. Voir `BRIEF-PASSATION-P4-REFONTE.md`.
