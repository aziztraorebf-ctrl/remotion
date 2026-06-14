# BRIEF DE PASSATION — Partie 4 "Coût / Levier / Perspective" (DERNIÈRE PARTIE)

> Créé 2026-06-14 (fin session contours nationaux). Brief AUTONOME pour démarrer la session P4.
> ⭐ P4 EST LA DERNIÈRE PARTIE. Après P4 → il ne reste que l'ASSEMBLAGE FINAL (concat 5 + mix).

---

## ÉTAT DE LA VIDÉO (avant P4)

| Partie | État | Render |
|---|---|---|
| Acte 1 | ✅ FINAL (intouché) | `out/episodes/warmap-sahel/acte1-FINAL.mp4` (catbox slchjv) |
| P1 Origine | ✅ FINAL (promu 2026-06-14, re-rendu full HD) | `out/episodes/warmap-sahel/p1-FINAL.mp4` (35s) |
| P2 Blocage | ✅ FINAL | `out/episodes/warmap-sahel/p2-FINAL.mp4` (catbox gfsa3h) |
| P3 Rupture | ✅ FINAL (avec contours nationaux) | `out/episodes/warmap-sahel/p3-FINAL.mp4` (catbox xbyurg) |
| **P4 Coût/Levier/Perspective** | ❌ **À CODER** | — |
| Assemblage final | ❌ après P4 | — |

✅ **P1 promu** (2026-06-14) : re-rendu full HD → `p1-FINAL.mp4` (35s). Les 4 parties sont en FINAL.
Pour l'assemblage : Acte1 + P1 + P2 + P3 + P4 → tous les FINAL sont dans `out/episodes/warmap-sahel/`.

---

## ORDRE DE DÉMARRAGE P4 (STRICT — comme P3)

1. **REPRÉVOIR LE VISUEL phrase par phrase** : créer `PLAN-NARRATIF-P4.md` (miroir PLAN-NARRATIF-P3.md)
   — comment chaque phrase s'expose sur la carte. Le découpage beat existe déjà → `BEATS-V5.md` PARTIE 4.
2. **DA-BRIEF-GATE upstream** (`scripts/tools/da-brief.py`) : Gemini 3.1 Pro + Kimi sur le brief P4.
3. **CODER** : copier la structure `Partie3Rupture.tsx` (PAS Proto24 = legacy). Mode moteur `partie4` à créer
   (miroir `partie3` : table rase chrome/HUD, timeline graduée, SFX dédiés, getPartie4Cam).

---

## DÉCOUPAGE P4 (déjà fait — `BEATS-V5.md` PARTIE 4, f9410 → f12996, audio 313,8→445,9s)

| Beat | Frame | Texte | Visuel prévu |
|---|---|---|---|
| 4.1 transition | ~9410 | "une autre [réalité]... populations vivent autre chose" | bascule armées→populations |
| 4.2 réfugiés | f9732 | "familles ont fui Djibo/Ménaka/Tillabéri" | JETONS-VISAGE réfugiés géo-ancrés + traînées de fuite séquentielles |
| 4.3 coût chiffré | f10038 | "~3M déplacés, 15M insécurité" | FIGÉE 2s, overlay "~2,5-3M déplacés · 15-18M insécurité", source OCHA/PAM/HCR |
| 4.7 confédération | f11076 | "2024 confédération + force conjointe" | 3 pays fusionnent bloc uni, picto + étoile, "2024 Confédération AES", QG Niamey ex-Barkhane |
| 4.8 CFA | f11763 | "question du franc CFA" | overlay "Franc CFA · encore lié à Paris" (CONCEPT → plein écran OK, dézoom légitime) |
| 4.11 chute | f12996 | "résister / construire / durer..." | extinction progressive, carte s'estompe, 3 drapeaux AES fondu, noir |

(Beats intermédiaires 4.4-4.6 / 4.9-4.10 : voir BEATS-V5.md ligne 72+.)

---

## ASSETS & BRIQUES DISPONIBLES POUR P4

- **Audio** : `public/_shared/audio/sahel-warmap/narration-v5-p4.mp3` (132s) + alignment global `narration-v5-alignment.json`.
- **Réfugiés** : brique `RefugeeFlow` (`warmap/_shared/RefugeeFlow.tsx`, données `REFUGEE_FLOWS_ACT4`) + jetons-visage `REFUGEES`.
- **Overlays concepts** (CFA, coût chiffré) : `WarMapOverlayDynamic` (semitransp OU fullscreen) — le PLEIN ÉCRAN
  est VALIDÉ pour les CONCEPTS non-spatiaux de P4 (vs overlay semi-transp pour le territorial). Décision Aziz.
- **Données majeures** : `WarMapOverlayData` (fond solide, chiffre sans équivalent carto).
- **Triggers déjà dans le moteur** : `F_DJIBO_REF=10294`, cam ACTE 4/5 (lignes 478-481), villes réfugiés (ligne 850).

## ⭐ CONTOURS NATIONAUX COLORÉS — RÉUTILISER en P4 (fait en P3)

Mécanisme validé 2026-06-14 (Mali ocre / Burkina brique / Niger sarcelle, draw-in + pulse + effacement overlay).
Pour l'activer en P4 :
1. Ajouter `partie4` au gate `(countryBordersTest || partie3)` → `(countryBordersTest || partie3 || partie4)`
   dans `SahelWarMapEngine.tsx` (2 endroits : calcul `countryBorderPaths` ~ligne 1589 + bloc render ~ligne 3795).
2. Ajouter les **fenêtres d'overlay P4** dans `CONTOUR_HIDE_WINDOWS` (overlay coût chiffré f10038, CFA f11763,
   confédération f11076 si plein écran) → contours effacés sous overlay (sinon bouillie, leçon P3).
3. Les pulses P4 sont DÉJÀ dans `COUNTRY_PULSES` (f10709/10729/10851).
Détail complet : STATUS.md section "CONTOURS NATIONAUX COLORÉS" + `WARMAP-COMPOSANTS-INDEX.md`.

---

## DOCTRINE (LIRE AVANT DE CODER)

- ⭐⭐ `memory/doctrines/WARMAP-GRAMMAIRE-CAUSALE.md` — règle CAUSE avant EFFET (un acteur AGIT → effet).
- `memory/doctrines/WARMAP-LONG-DOCTRINE.md` — overlay vs plein écran, 3 régimes audio-visuel.
- P1 direction = SOUSTRACTION (vide d'État par chute opacité). P4 reprend cet esprit pour la chute finale (4.11).

## MÉTHODE QUI MARCHE (gravée key-learnings 2026-06-14)

- **Mini-renders VIDÉO comparatifs côte-à-côte** pour juger un effet en mouvement (jamais des stills pour décision Aziz).
- **Instrumenter (debug magenta) pour PROUVER** qu'une couche est peinte avant de re-rendre à l'aveugle.
- Itérer en scale 0.5 (vite), juger netteté en full HD scale 1.
- Render Mapbox : `bash scripts/render-mapbox.sh <Compo> <out.mp4> --frames=A-B --scale=X` (flags GPU --gl=angle inclus).

---

## APRÈS P4 → ASSEMBLAGE FINAL (dernière étape de toute la vidéo)

Concat Acte1 + P1 + P2 + P3 + P4 (ffmpeg) + 1 narration globale (`narration-v5-expressive.mp3`, 7min26) + mix
(musique + SFX). Voir pattern audio dans les épisodes précédents. C'est la TOUTE DERNIÈRE étape.
