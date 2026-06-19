# STARTER — Sénégal Pétrole & Gaz : MAKEOVER PREMIUM + RE-TIMING V3 (source unique)

> ⛔⛔ **PÉRIMÉ (2026-06-18). NE PAS UTILISER.** L'approche "makeover/re-timing de la V1" a été REMPLACÉE par
> une **refonte V3 scène par scène**. SOURCE DE VÉRITÉ UNIQUE = **`memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md`**
> (+ `V3-REFONTE/STARTER-SCENE-1.md`). Ce fichier ne sert plus que d'archive. Aller directement au README V3.

> **MAJ 2026-06-17.** Coller en début de session pour reprendre le chantier. Branche : `feat/hooks-library`.
> ⭐ **SEULE SOURCE DE VÉRITÉ** — fusionne l'ancien makeover + l'ancien retiming-v3 + l'état réel du 17 juin.
> Les starters `-assemblage-final` et `-retiming-v3` ont été SUPPRIMÉS (fusionnés ici).
> ⚠️ Règle Aziz : vérifier l'état RÉEL dans le livrable (frames + code), pas les notes. Ce starter peut périmer.

---

## ⛔ AVANT TOUT — LIRE la doctrine HOOK (nouvelle, 2026-06-17)
`memory/doctrines/HOOK-PREMIERE-MINUTE.md` — le hook = TENSION TENUE ~1 min (pas accroche de 8s).
4 règles + 6 archétypes + checklist. S'applique au Beat0 Sénégal ET à toute ouverture future.
Sources tracées : `feedback_hook-retention-premiere-minute.md` (terrain 14M vidéos + jury 3 modèles).

## ÉTAT RÉEL VÉRIFIÉ (2026-06-17, frames + code — pas les notes)

**La vidéo du 25 mai (`out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4`, 7min39) est DÉJÀ PUBLIABLE** (FC-2 dette 132% ✅, FC-4 Beat0 deux dates ✅, assemblage ✅). On la fait MONTER EN GAMME avec l'audio V3 vivant + carte vivante.

**⭐ LE HOOK (Beat0) A ÉTÉ REFAIT CETTE SESSION (17 juin) — travail valide, ne pas perdre :**
- `Beat0Accroche.tsx` refondu → hook **« Compteur → Courbe → Crash »** (breakdown Gemini 3.1 Pro validé 17 juin).
- Dernier render : `out/episodes/senegal-petrole-gaz/wip/beat0_v5_premium.mp4` (32s) — « 8 000 000 $ / JOUR » en or sur navy, grain + particules dorées, Lottie shockwave au crash. **PAS encore validé Aziz / pas FINAL.**
- Spec : `out/episodes/senegal-petrole-gaz/_audio-v3/BREAKDOWN-HOOK.json` + storyboard `public/souverain/senegal-petrole-gaz/beat0/storyboard-gemini.png`.
- Compo Root : `Senegal-Beat0-Accroche`. Frames audio dans l'en-tête de `Beat0Accroche.tsx` (forced-align @30fps, F_TOTAL=979).
- ⚠️ Acte "carte Yakaar" du Beat0 original NE COLLE PLUS au nouveau timing → DISSOUS. Le hook est désormais data-viz (compteur/courbe), pas carte.
- **NEXT Beat0** : présenter v5 à Aziz pour validation → ajustements → promouvoir FINAL. Vérifier qu'il respecte la doctrine HOOK (open loop ? re-hook 8-12s ? pas d'ouverture molle ?).

## AUDIO V3 — FAIT et VALIDÉ
- `out/episodes/senegal-petrole-gaz/_audio-v3/narration-v3-VALIDEE.mp3` (8min12, 492s, 8 scènes).
- Forced-align : `forced-align-v3.json` (loss 0.14, timing au mot). Whisper : `whisper-words-v3.ts`.

## SOURCES DE VÉRITÉ À LIRE (toutes dans `_audio-v3/`) :
1. `RETIMING-MAP.md` — frontières scènes en frames + startFrom par beat.
2. `PLAN-CARTE-VIVANTE-V2.md` — quels templates carte, où, synchro (validé Gemini).
3. `SCRIPT-V3-senegal.md` — script narratif final (vérité texte).

---

## OBJECTIF : RE-TIMING SÉQUENTIEL, PASSE COMPLÈTE PAR BEAT (décidé Aziz)
Pour CHAQUE beat dans l'ordre, faire TOUT d'un coup avant le suivant :
1. Brancher `narration-v3-VALIDEE.mp3` avec le startFrom de RETIMING-MAP.
2. Recaler les animations Remotion internes sur les timestamps forced-align.
3. Arbitrer les désaccords structurels audio/visuel (texte RESTRUCTURÉ, pas juste raccourci).
4. Appliquer la carte vivante du beat (PLAN-CARTE-VIVANTE-V2).
5. Rendre full HD (Mapbox = `--gl=angle`) + vérifier synchro AVANT le beat suivant.

**ORDRE** : ✅ Beat0 (hook v5 fait, à valider) → **Acte1 (Beat1-9, GROS morceau −85s) ← REPRENDRE ICI** → Beat10 → Beat11-12-13-14 → CRÉER scène bonus (~85s, n'existe pas).

## CARTE VIVANTE À AJOUTER (détail dans PLAN-CARTE-VIVANTE-V2) :
- `ResourceTextureFill` (pétrole/gaz coule) — POC Beat1 fait, à AFFINER (motif gros → `drawResourceTexture("oil",512)` ou baisser fill-opacity, actuellement 0.9, Beat1.tsx l.68-82).
- Pitch 32° (relief) via interpolate/jumpTo, JAMAIS flyTo.
- `LottieGeoAura` (ondes sonar) sur gisements offshore.
- `SweepRevealTerritory` (faisceau) sur Norvège/Congo/Botswana + texture sémantique.
- `GeoFlowConnection` (cargo mobile) pour l'export maritime.
- Frontière maritime GTA 50/50 Sénégal-Mauritanie (`FiberOpticBorderDraw` + plaque).
- `GlassmorphismGeoPopup` (verre) pour FONSIS/ITIE.
- Scène bonus 3 phases : triomphe → fracture (pulse rouge Dakar) → pont AES (dézoom + frontières Mali/Burkina/Niger ambre).
- Lot kraft premium DÉJÀ fait (Beat11/12/13, composant `KraftDepth.tsx`, validé Aziz catbox 2hkv7z).

## ASSEMBLAGE FINAL (session séparée, à la fin) :
- PAS une compo unique — chaque beat = mp4 séparé → concat ffmpeg.
- Re-render beats touchés full HD → concat → mix : VOIX 1.0 / MUSIQUE existante 0.18 / fondus.
- Musique : GARDER pistes existantes (music-A-ambient/B-kora/C-sabar), re-mixer sur audio V3.
- Remplacer le média Postiz du 20 juin. Deadline DÉCALABLE (qualité prime).

## RÈGLES NON-NÉGOCIABLES :
- Render Mapbox = `--gl=angle` (scripts/render-mapbox.sh). Remotion pur = render standard.
- Pitch/caméra = useCurrentFrame + interpolate + jumpTo. JAMAIS flyTo/easeTo (interdit headless).
- Acte 2 = UNE Map continue (`SenegalActe2Continu`) : recaler la trajectoire entière, pas beat par beat.
- Netteté jugée SEULEMENT en render scale=1 (scale 0.4 = flou trompeur).
- Beats Mapbox : 0(plus maintenant→data-viz),1,2,5,6,7,8,10,13,14,Acte2Continu. Remotion pur : 3,4,9,11,12,14PhaseC.
- Gemini = signal jamais juge. Vérifier l'état RÉEL dans le code, pas les notes.
- `spring()` partout, jamais easing linéaire. Doctrine HOOK appliquée sur les ouvertures.

## COMMENCER PAR :
1. Lire `HOOK-PREMIERE-MINUTE.md` + les 3 sources `_audio-v3/`.
2. Présenter `beat0_v5_premium.mp4` à Aziz (valider le hook v5) OU attaquer Acte1 si Beat0 déjà tranché.
3. Annoncer le plan du beat AVANT de coder.

## FAIT cette session (commité branche feat/hooks-library) — historique :
- Fix fact-check 80%→132% (Beat14). Lot kraft premium (KraftDepth, Beat11/12/13). POC ResourceTexture pétrole (Beat1).
- Upload vidéo Gemini fiable confirmé (`memory/gemini-video-upload-fiable.md`).
- Audio V3 généré + validé + forced-align. Hook Beat0 refondu (Compteur→Courbe→Crash, v5).
