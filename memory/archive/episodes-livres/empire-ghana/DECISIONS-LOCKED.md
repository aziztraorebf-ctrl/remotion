# Décisions verrouillées — Empire du Ghana
> Validations finales Aziz session planification 2026-05-03
> Source de vérité pour la production scène par scène (prochaine session)

---

## Palette CARTE — VERROUILLÉ

**Palette hybride** : ATLAS_COLORS pour la carte, GHANA_PALETTE pour éléments narratifs.

### Carte (réutilise Mansa Moussa V2)
- Océan : `ATLAS_COLORS.oceanDeep #3A5A7E` (bleu canard)
- Terre : `ATLAS_COLORS.land #C97D5A` (terracotta sable)
- Frontières pays : `ATLAS_COLORS.landStroke #5A3A2A` (marron foncé)
- Empire Wagadou : fill `ATLAS_COLORS.empireFillCream #F5EBD8` + outline `ATLAS_COLORS.empireGold #D4A574`
- Labels villes : `ATLAS_COLORS.textInk #3A2A18` (marron foncé sur fond clair)
- POI Koumbi Saleh : `ATLAS_COLORS.empireGold` (cercle 9px + stroke `GHANA_PALETTE.BORDEAUX 2.5px`)

### Note Aziz (à appliquer en production)
**Aziz a noté** : pour les pop-ups, les routes, les contours des pays, **on appliquera la palette GHANA pour les éléments d'identité épisode** (touches finales). À tester en production scène par scène — pas critique tant que la base carte = ATLAS_COLORS.

### Éléments narratifs (GHANA_PALETTE)
- Routes commerciales : `GHANA_PALETTE.BORDEAUX_PROFOND #4A0E0E` (signature épisode)
- Sacs sel : `GHANA_PALETTE.BLANC_SEL #E8E0D0`
- Sacs or : `GHANA_PALETTE.OR #D4A574`
- Balance Lottie : or principal
- Pop-up Labels : fond `GHANA_PALETTE.PARCHEMIN #E8DCC0` + bordure `ATLAS_COLORS.empireGold` + texte `ATLAS_COLORS.textInk`
- Sceau Mali : `GHANA_PALETTE.OR` + détails `GHANA_PALETTE.BORDEAUX`
- Ligne front Almoravides : `GHANA_PALETTE.BORDEAUX_PROFOND`

---

## Musique — VERROUILLÉ

**Choix Aziz : Variante B — Marché de l'or**
- Fichier : `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3` (6.6 MB)
- URL catbox : https://files.catbox.moe/cb21xr.mp3
- Description : Kora + balafon + drums hand, contemplatif/dignifié (style Toumani Diabaté)
- Volume cible : ~0.07 sous narration (à ajuster en production)

---

## Pop-up Labels (idée 5 Top 7) — VERROUILLÉ style

Style de référence validé sur SilentBarterTestV3 frame 180 :
- Fond : `GHANA_PALETTE.PARCHEMIN #E8DCC0`
- Bordure : `2px solid ATLAS_COLORS.empireGold #D4A574`
- Border-radius : 6px
- Padding : `10px 16px`
- Box-shadow : `0 4px 12px rgba(0,0,0,0.3)`
- Typo principale (chiffre) : `JetBrains Mono 22px`, `font-weight 700`, `color: ATLAS_COLORS.textInk`
- Typo secondaire (unité/contexte) : `JetBrains Mono 14px`, `font-weight 400`, `color: GHANA_PALETTE.OR_TERNI`
- Letter-spacing : `0.05em`

Référence visuelle : https://files.catbox.moe/c91mcv.png

---

## Validations production (rappel pour prochaine session)

### Ce qui change vs SilentBarterTestV3
- ✅ Palette carte = ATLAS_COLORS (validé)
- ✅ Pop-up Labels style notification UI (validé)
- ⚠️ Production scène par scène ajoutera : zooms caméra, pans, LightLeak, Compteur Richesse, transitions, balance qui interpole au lieu de loop, sceau Mali Beat 4, Koumbi Saleh banco Gemini

### Mots-pivots ElevenLabs Forced Alignment
- Source : `src/projects/atlas/empire-ghana/ghana-alignment.ts` (loss 0.094, excellent)
- Sous-titres karaoke : `whisper-words.ts` (211 mots)

### Stack assets prêts
- 2 marchands PixelLab (3 anims chacun × 4 dirs) : `public/empire-ghana/characters/`
- Carte d3-geo Sahel + POI projetés : `data/geo/empire-ghana-data.json`
- Balance Lottie : `src/projects/atlas/empire-ghana/tests/balance.json`
- Palette : `src/projects/atlas/empire-ghana/components/GhanaPalette.ts`
- Audio narration : `public/audio/atlas-empire-ghana/narration-v1.mp3` (104.9s)
- Musique : `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3`
