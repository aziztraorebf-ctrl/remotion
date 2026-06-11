# BRIEF DE PASSATION — War-Map Sahel — 2026-06-11 (soir)

> Pour la prochaine instance Claude. Lire CE fichier EN PREMIER, puis les fichiers pointés.
> Branche : `feat/da-brief-gate-warmap-sahel`. Tout est commité (~25 commits).

---

## EN UNE PHRASE
La **Partie 1 est validée** (premium, bon). La **Partie 2 a été codée PUIS REJETÉE** (trop plate/morte) — la
prochaine action est de **prototyper le beat 2.4 en PREMIUM** avant de refaire toute la P2.

---

## CE QUI EST FAIT (verrouillé)

### 1. REFACTOR MOTEUR — FAIT
Le moteur monolithique `src/projects/warmap/engine/SahelWarMapEngine.tsx` a été refactoré en :
- `engine/SahelContext.ts` = type `SahelRenderContext` (frame, project lon/lat→px, état) passé à chaque Partie.
- `parties/Partie1Origine.tsx` + `parties/Partie2Blocage.tsx` = 1 couche React isolée par Partie.
- Modes `partie1` / `partie2` (props) + `getPartie1Cam` / `getPartie2Cam` (caméra, raccord exact sans coupe).
- Compos Root `SahelPartie1` (2940f) + `SahelPartie2` (5700f).
- **Pattern `<PartieX>` documenté** dans `STATUS.md` (section pattern) — à réutiliser pour P3/P4.

### 2. PARTIE 1 "ORIGINE 2012" (canari) — ✅ VALIDÉE AZIZ
Direction SOUSTRACTION. Render : `out/episodes/warmap-sahel/wip/partie1-fullhd-v3.mp4` (catbox `m12kke`).
Beats : board clearing (jetons→0.05) · pulse Libye · trait d'encre route réelle Sebha→Kidal · **propagation
Kidal→Gao/Tombouctou** (traits rouges) · pulse villes (onde+teinte) · vide d'État · hachures · micro-labels villes.
NE PAS retoucher sans raison — Aziz a validé.

### 3. DOCTRINE VERROUILLÉE (Aziz 2026-06-11)
**War-Map = 100% CARTE, ZÉRO plein écran** (gravé dans `memory/doctrines/WARMAP-LONG-DOCTRINE.md`). Les moments
forts se font PAR la carte (caméra, pulses, vide d'opacité), jamais par une coupe hors-carte. Le plein écran =
Souverain Mid-form uniquement. 3 registres d'enrichissement autorisés : portraits/visages projetés · objets Gemini
encre top-down (P3-P4) · données animées dans overlay ancré.

### 4. TASK 8 (nettoyage refactor) — réglé
- 8b cartouches blancs des labels de ville → corrigés (encre + halo parchemin). FAIT.
- 8a legacy `acte2` (avion/convoi) → GARDÉ comme filet/référence (décision Aziz). À supprimer quand P2-P4 le couvrent.
- 8c recalage triggers Acte 1 → SANS OBJET (les triggers décalés appartiennent au legacy, réécrit par P2-P4).
- Bug corrigé : `<Audio narration-v2.mp3>` (supprimé au ménage) → repointé `narration-v5-expressive.mp3`.

---

## CE QUI EST FAIT MAIS REJETÉ — la Partie 2

La Partie 2 "Le Blocage" (6 beats : Serval/Barkhane, convergence FR, MINUSMA, échec 10 ans, villes/campagnes,
Burkina/CEDEAO) a été **entièrement codée** (`Partie2Blocage.tsx`) avec un DA-brief amont 3 voix.

**MAIS Aziz l'a REJETÉE** au visionnage (`partie2-fullhd.mp4`, catbox `hdca14`) : trop plate, morte, niveau-1
(cercles/étoiles/X SVG statiques), caméra plan large avec du vide autour, pas premium, "exposé pédagogique".
**Gemini (analyse vidéo) CONFIRME : 4/10**, "trop plate et statique, recadrage serré + textures organiques nécessaires".

**Cause racine (leçon gravée)** : j'ai sauté la RÈGLE RECHERCHE TEMPLATES — on a une bibliothèque de 30+ composants
"carte vivante" PREMIUM (`CATALOGUE-CARTE-VIVANTE.md`) + Lottie géo-ancré + sprites, jamais utilisés. "Sobre" ≠ "plat".

---

## ▶ PROCHAINE ACTION = PROTOTYPE PREMIUM beat 2.4

**Décisions Aziz prises (ne pas re-litiger) :**
1. Prototyper UN seul beat d'abord : **2.4 = extinction d'une base FR encerclée** (le moment le plus mort).
2. Tester **DEUX versions** : à-plat (pitch 0, comme P1) VS **pitch 3D (~32)** — comparer le look.
3. **Lottie SUR-MESURE** à créer (pas juste réutiliser l'existant).
4. Marqueurs = **sprites à ombre portée** (`base-france.png`) pas étoiles SVG.
5. Caméra **SERRÉE qui suit l'action** (jamais vue continentale/vide), drift permanent.
6. Jihadisme = **front mouvant organique** (path morphé / track-matte) pas cercle qui scale.
7. "40%" → data-viz animée OU supprimé (la voix le dit déjà).
8. Après proto validé Aziz → généraliser aux autres beats P2 → refaire la P2 complète.

**TOUT le plan + techniques + inventaire des capacités est dans :**
> ⭐ `memory/episodes/warmap-sahel/REFONTE-PREMIUM-P2-techniques.md` (LIRE EN PREMIER pour le proto)

Il contient : inventaire vérifié de nos capacités (LottieGeoAura, premiumLottieAssets, sprites warmap,
CAM_COUNTRY_APPROACH pitch 32, 30+ composants carte-vivante avec chemins) + 15 techniques des chaînes premium
(K&G/Johnny Harris/Vox, sourcées) classées par catégorie (caméra/animation/textures/profondeur/rythme).

**Workflow** : DA-brief upstream sur le proto (Gemini+Kimi via `scripts/tools/da-brief.py`) → Aziz tranche → généraliser.

---

## DONNÉES TECHNIQUES UTILES
- **Triggers V5 Partie 2** (alignment `narration-v5-alignment.json`, ×30fps) : Serval f3196 · Barkhane f3268 ·
  présente f3419 · MINUSMA f3660 · échec("dix") f3887 · villes f4384 · campagnes f4421 · débordent f4955 ·
  Burkina f4976 · Niger f5380 · CEDEAO f5639.
- **Render** : `./scripts/render-mapbox.sh SahelPartie2 <out.mp4> [--scale=N] [--muted] [--frames=A-B]`.
  Netteté = full HD only. `--frames=A-B` = check rapide. Indices valides 0..durationInFrames-1 (off-by-one piège).
- **Audio** : `public/_shared/audio/sahel-warmap/narration-v5-expressive.mp3` (validé) + alignment JSON (source triggers).
- **Sprites** : `public/_shared/sprites/warmap/` (base-france, base-africacorps, jeton-fama, fighter-*, etc.).
- **Lottie** : `src/projects/_shared/mapbox/LottieGeoAura.tsx` + `lottie/premiumLottieAssets.ts`.

## RÉFÉRENCES (lire selon besoin)
- `STATUS.md` — état épisode complet (section "REPRISE PROCHAINE SESSION" en tête).
- `REFONTE-PREMIUM-P2-techniques.md` ⭐ — LE plan du prototype premium.
- `reviews-p2/SYNTHESE-DA-UPSTREAM-P2.md` + `SYNTHESE-DA-DOWNSTREAM-P2.md` — DA P2 vérifiés.
- `memory/doctrines/WARMAP-LONG-DOCTRINE.md` — doctrine 100% carte verrouillée.
- `memory/key-learnings.md` — leçon "scanner catalogue avant de coder".

## RÈGLES PROCESS (rappel)
- Premium d'abord (doctrine). "Sobre" n'autorise pas "plat/pauvre". Scanner CATALOGUE-CARTE-VIVANTE AVANT de coder.
- Trancher le technique seul, regrouper le goût pour Aziz. DA = signal jamais juge (vérifier chaque point).
- Commits fréquents. Ménage : ne committer QUE warmap-sahel (pas Peste/Kora/templates — autres chantiers).
