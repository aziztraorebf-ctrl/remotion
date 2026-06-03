# STARTER — Maroc Batteries : reprise Beat 0 (hook) + Beat 1 À ZÉRO

> À coller au début d'une session propre. Objectif : refaire Beat 0 + Beat 1 du Short Maroc en exploitant l'arsenal templates carte vivante (test grandeur nature de la chaîne de production consolidée le 2026-06-02).
> Décision Aziz : effacer/recommencer le CODE de ces 2 beats. GARDER toute la pré-prod (script, audio, brief) — elle est validée.

---

## 1. Lire AVANT de toucher au code (dans cet ordre)

1. `src/projects/_shared/INDEX-DES-INDEX.md` — la carte de tous les catalogues
2. `memory/SOUVERAIN-SHORT-DEMARRAGE.md` — procédure 7 étapes (Camera Brief + choix template par acte)
3. `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` — les 17 templates (galerie : `dashboard/templates-carte-vivante.html`)
4. `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md` — doctrine (drift, altitude, anti-gris, synchro syllabe)
5. `memory/SOUVERAIN-SHORT-SKELETON.md` — structure du code (1 fichier TSX, getCam, actes)
6. `memory/episodes/souverain/maroc-batteries-kenitra/PRODUCTION-BRIEF.md` — le brief beat par beat (validé 2026-06-01)

## 2. État réel du projet (vérifié 2026-06-02)

- **Audio validé** : `public/souverain/maroc-batteries/audio/narration-maroc-v3.mp3` (**109.5s**). Musique : plusieurs options dans le même dossier.
- **Fichier code actuel** : `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx` (A1 ancien codé, ligne Détroit). → ARCHIVER dans `src/_archive/` avant de recommencer ces beats.
- **Brief** : Beat 1 Phosphate = f248→f931 (~20s, Mapbox), Beat 2 Cailloux (Remotion), etc. Structure 6 actes.

## 3. CE QUI MANQUE — à combler AVANT de coder (bloquant)

1. **Forced alignment ABSENT** ⚠️ — aucun timing mot-à-mot sur narration-maroc-v3.mp3. PREMIÈRE ACTION : Whisper sur l'audio → timestamps de "70%", "phosphate", "Khouribga", "Kénitra"... Sans ça, la synchro syllabe (P1) est devinée. Voir `memory/tools/` pour le pattern Whisper / `scripts/`.
2. **Décision de hook à trancher avec Aziz** ⚠️ — DIVERGENCE à clarifier :
   - L'ancien brief décrit un hook narratif "Dans 2 ans... une usine qui n'existait pas" + ligne Détroit.
   - Les tests de la session 2026-06-02 ont validé `KineticMaskSlam` avec "70% DU PHOSPHATE MONDIAL".
   - → DEMANDER à Aziz : garde-t-on l'angle "usine surgie" (suspense) OU l'angle "70% phosphate" (chiffre choc) pour le hook ? Le choix conditionne le template.

## 4. Plan Beat 0 + Beat 1 (choix pré-validés session 2026-06-02, à confirmer)

**Beat 0 — HOOK** (selon décision §3.2) :
- Option chiffre choc → `KineticMaskSlam` : `bigText="70%"`, `subText="DU PHOSPHATE MONDIAL"`, `focusIso="MAR"`, `geoName=["Morocco","W. Sahara"]`. `slamAt`/`revealAt` calés sur le mot "70%" du forced alignment.
- Option premium 3 temps → `ComboMaskSweep` (chiffre choc → révèle carte → faisceau allume le Maroc). Plus riche pour une ouverture.
- (Si angle "usine surgie" retenu → plutôt un hook narratif : à composer, possiblement `ClassifiedRedactReveal` ou un MapCutaway reveal.)

**Beat 1 — PHOSPHATE** (Khouribga → Kénitra) :
- `SweepRevealTerritory` pour révéler le Maroc en gold (dynamisme couleur) OU garder l'orbit+pull back du brief.
- Flux `FiberOpticBorderDraw` style OU ligne dasharray gold Khouribga→Kénitra (déjà au brief) — le "phosphate qui voyage".
- Dot pulse Khouribga + label DOM Marker (déjà spécifié au brief).
- Insert possible : `MapCutaway` mode stat pour le "70%" si pas déjà dans le hook.

## 5. Process (résumé DEMARRAGE)

1. Whisper forced alignment (combler §3.1)
2. Trancher le hook avec Aziz (§3.2)
3. Remplir le Camera Brief tableau (mvt/de→vers/zoom/durée/blur) pour B0+B1 → **valider avec Aziz AVANT code**
4. Optionnel : envoyer `BRIEF-GEMINI-TEMPLATES-CARTE.md` + script à Gemini → proposition template-par-moment + 1 combo
5. Coder (assembler les templates, pas from scratch) dans 1 fichier TSX (SKELETON)
6. `render-mapbox.sh` → review perso frames → présenter Aziz → ntfy mobile

## 6. Règles à ne pas oublier

- Carte JAMAIS nue (au moins 1 template effet vivant par acte Mapbox) + caméra JAMAIS statique (drift).
- Hook obligatoire frame 0 (punch).
- Timing audio-derived (forced alignment), jamais hardcodé.
- Review perso AVANT présentation. Upload catbox + ntfy avant validation Aziz.
- Format : décider V (1080×1920) et/ou H (1920×1080). Les templates sont hybrides.
