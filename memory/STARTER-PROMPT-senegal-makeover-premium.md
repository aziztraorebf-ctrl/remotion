# STARTER — Sénégal Pétrole & Gaz : MAKEOVER PREMIUM (reprise session)

> Créé 2026-06-16. Coller en début de session pour reprendre le chantier d'amélioration premium
> de la vidéo Sénégal (déjà publiable, on la fait MONTER EN GAMME). Branche : `feat/hooks-library`.
> ⭐ Remplace l'ancien `STARTER-PROMPT-senegal-assemblage-final.md` (PÉRIMÉ : ses corrections FC-2/FC-4
> sont déjà faites, voir ci-dessous).

---

## ÉTAT RÉEL VÉRIFIÉ (2026-06-16, dans la vraie vidéo — pas les notes)

La vidéo finale `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4` (7min39, 25 mai) est **DÉJÀ PUBLIABLE** :
- ✅ **FC-2 (dette 132%)** : DÉJÀ FAIT — calebasse 132% (Beat12) + audio "132% de la richesse annuelle". (STATUS/NEXT-ACTION disaient "à corriger" → PÉRIMÉ.)
- ✅ **FC-4 (Beat0 deux dates)** : DÉJÀ FAIT — visuel "22 MAI 2026" + audio "un mois plus tard... limogé".
- ✅ Assemblage : DÉJÀ FAIT (la vidéo complète existe).
- ⚠️ Postiz programmé le **20 juin 15h UTC** pointe vers cette version. Deadline = **DÉCALABLE** (décision Aziz) — la qualité prime.

⚠️ **CORRECTION DOC : la dette/calebasse est dans Beat12, PAS Beat11** (le STATUS se trompait de numéro).
Beat11 = contrat de concession (60%→36%). Beat12 = FONSIS + calebasse dette. Beat14 = carte "DE ZÉRO À EXPORTATEUR".

---

## CE QUI A ÉTÉ FAIT CETTE SESSION (commité, branche feat/hooks-library)

3 commits : `12d9148` (texture pétrole) + le commit kraft + le commit fix 132%.

1. ✅ **Fix fact-check 80%→132%** : Beat14 l.469 affichait "Dette 80% PIB" (incohérent avec Beat12 132%). Corrigé → "Dette 132% PIB". (Gemini l'avait MANQUÉ, Claude l'a trouvé.)
2. ✅ **Lot kraft premium** (registre B "dossier d'enquête") : nouveau composant `src/projects/_shared/components/overlays/KraftDepth.tsx` (`KraftShadowDefs` feDropShadow + `KraftGrain` feTurbulence, render-safe, PAS de blur CSS). Appliqué :
   - `LaCalebasse.tsx` : prop `depth` (ombre opt-in, rétrocompat) → Beat12 calebasse.
   - Beat11 : grain + ombre douce sur barres (la fiche contrat avait DÉJÀ son ombre, pas touchée).
   - Beat12 : grain global + ombre calebasse + ombre coffre FONSIS.
   - Beat13 : grain sur phases kraft (éteint pendant la carte via `1-opMap`).
   - Renders preuve validés. Direction VALIDÉE Aziz (catbox 2hkv7z).
3. ✅ **POC carte vivante** : `ResourceTextureFill` pétrole sur le Sénégal (Beat1) — remplace l'aplat jaune plat par la texture oil bichromie. Mécanique prouvée en render (catbox via t-senegal-oil.mp4). ⚠️ RÉGLAGE À AFFINER : motif un peu gros/dense → tester `drawResourceTexture("oil", 512)` ou baisser `fill-opacity` (actuellement 0.9). Code : Beat1.tsx l.68-82.
4. ✅ **DÉCOUVERTE TECHNIQUE** : l'upload VIDÉO complète à Gemini 3.1 Pro est FIABLE maintenant (bug 13 juin résolu). Voir `memory/gemini-video-upload-fiable.md`. Scripts : `gemini-video-upload-test.py` (test fiabilité) + `gemini-senegal-premium-review.py` + `gemini-senegal-mapbox-review.py`.

---

## ⭐ RESTE À FAIRE — PLAN CLAIR POUR LA PROCHAINE SESSION

### A. CHANTIER CARTE VIVANTE (le gros morceau, breakdown Gemini+Claude fait, tri validé)
> Source breakdown : `out/episodes/senegal-petrole-gaz/_review-prepub/GEMINI-MAPBOX-REVIEW.md` + synthèse tracée
> dans l'historique de session. Catalogue templates : `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md`.
> Décision Aziz : faire TOUT le makeover (ne pas sauter d'étapes). Délégable à des agents (1 beat/agent, séquentiel, `git add` chirurgical).

1. **CARTE 1/4 ResourceTexture Sénégal** — POC FAIT (Beat1). RESTE : (a) affiner finesse texture, (b) appliquer aussi à Beat2 + Beat5 (mêmes beats Acte 1 avec aplat jaune via `addCountryHighlight`), (c) décider oil vs gas vs mixte.
2. **CARTE 2/4 Beat10** (Norvège/Congo/Botswana) : `SweepRevealTerritory` (faisceau scanner) + `ResourceTextureFill` différenciée (oil Norvège/Congo, mineral/lithium Botswana). Beat séparé = sûr.
3. **CARTE 3/4 Beat14** (Mécanisme 3, où le 132% a été corrigé) : remplacer blocs UI / triangles rouges flottants par `GlassmorphismGeoPopup` (FONSIS/ITIE/LOI) + `PulsingRegionFill` (zones tension). + Lucide sur labels.
4. **CARTE 4/4 Export GTA** (~01:36, dans Acte 2 OU Beat séparé) : `GeoFlowConnection` (route + cargo mobile) + `PulsingRegionFill` Europe/Asie.
5. **PITCH 32° relief** (camCountryApproach) : Gemini insiste, cartes à plat (pitch 0). ⚠️ ATTENTION : l'Acte 2 est une **Map continue** (`SenegalActe2Continu`) — changer le pitch touche TOUTE la trajectoire + recale les labels screen-space (Beat1 LABEL_X/Y l.107-108). Faire avec prudence, beat par beat, PAS globalement d'un coup.

### B. DONUT + temps morts navy (1er breakdown premium)
Donut "revenus pétroliers" (Acte 2) petit/collé gauche sur grand navy vide. Option : grille SVG glissante en fond + draw-in stroke. OU `MapCutaway` (mais touche la Map continue). Source : `GEMINI-PREMIUM-REVIEW.md`.

### C. OUTRO refonte (décidé Aziz)
Carton final "Prochaine vidéo" très nu → split-screen premium. **CTA = teaser de la PROCHAINE VIDÉO sur l'alliance AES (Sahel : Mali/Burkina/Niger)**. Pont thématique Sénégal→AES.

### D. ⭐⭐ CHANTIER AUDIO V3 EXPRESSIF (gros, session dédiée, deadline décalable)
La narration actuelle (`narration-v1-clean.mp3`) est PLATE/monotone — d'avant le pipeline voix vivante V3.
Refaire avec pipeline `generate-narration-expressive.py` (texte taggé V3 Océane → STS GéoAfrique stability 0.45,
doctrine `PIPELINE-VOIX-VIVANTE-VALIDE.md`). ⚠️ NON TRIVIAL : tous les beats sont timés au frame près sur l'audio V1
(ex Beat12 `startFrom=7182`). Nouvel audio = débit différent = **re-timer les 8 beats** (comme recalage Acte1 War-Map V5).
PROCÉDURE : 1) extraire transcript V1 (Whisper), 2) mesurer durées beats actuelles, 3) générer audio V3, 4) force-align,
5) **MESURER le décalage** beat par beat AVANT de s'engager. Si décalage faible → re-timer. Si gros → garder V1 pour la pub, sortir V3 ensuite.

### E. ASSEMBLAGE FINAL (après corrections)
Re-render groupé des beats touchés (Mapbox = flag `--gl=angle` OBLIGATOIRE) → concat ffmpeg
(beat0→acte1→acte2→beat10→11→12→13→14) → mix (voix 1.0 / musique 0.18 / fade 6s) →
**remplacer le média Postiz du 20 juin** (sinon vieille version part). Sources beats : `out/episodes/senegal-petrole-gaz/`.

---

## FICHIERS CLÉS
- Beats source : `src/projects/souverain/senegal-petrole-gaz/beats/` (Beat0-14, +SenegalActe2Continu)
- Composant premium kraft : `src/projects/_shared/components/overlays/KraftDepth.tsx`
- Catalogue carte vivante : `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md`
- Breakdowns Gemini : `out/episodes/senegal-petrole-gaz/_review-prepub/GEMINI-*.md`
- Frames + audio extraits (vérif) : `out/episodes/senegal-petrole-gaz/_review-prepub/` (peut purger les t-*.mp4 de test)
- Doctrine review premium : `memory/doctrines/REVIEW-PREMIUM-TEMPLATE.md`
- Render Mapbox : `--gl=angle` obligatoire. Beats Remotion purs : render standard.
