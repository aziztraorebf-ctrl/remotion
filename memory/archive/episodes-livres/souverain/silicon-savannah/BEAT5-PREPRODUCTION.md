# Beat 5 — Le Monopole — Pré-Production

**Durée :** 24.33s / 730 frames
**Manifest :** `src/projects/souverain/silicon-savannah/beat5/manifest.ts`
**Storyboard Gemini :** `public/souverain/silicon-savannah/beat5/storyboard-gemini.png`
**Narration :** `public/souverain/silicon-savannah/beat5/narration.mp3`
**Composition :** `SS-Beat5Monopole` (à enregistrer dans Root.tsx)

---

## Structure 3 phases — Plan motion enrichi (R1 validé : max 8s sans changement)

### Phase A — 3 micro-moments (0→349f / 11.6s)

**A1 — 0→97f (~3.2s) : Cercle vide + "7 ANS" apparaît**
- Fond : `beat5/bg.png` texture ardoise à opacity 0.25 + Ken Burns scale 1.0→1.04
- Cercle gold SVG apparaît en spring — contour VIDE (arc à 0%)
  - Diamètre 400px, centré, strokeWidth 7, stroke `#c8a951`, rotation -90° (part de midi)
- **"7 ANS"** pop-in TYPE A au centre — Bebas Neue 200px GOLD
  - `spring({ damping: 12, stiffness: 80 })` + slow zoom 1.0→1.05 continu
  - Float sinusoïdal léger ±4px permanent

**A2 — 97→279f (~6s) : Cercle se remplit + années défilent**
- Arc du cercle se remplit progressivement (strokeDashoffset interpolé 0→~28% de la circumférence)
- **Count-up des années TYPE G** à l'intérieur ou sous "7 ANS" :
  - "2007 → 2008 → ... → 2013" défilent rapidement (~15f chacune) — changement toutes les ~2s = motion constant garanti
  - Font monospace 28px GOLD opacity 0.6, sous le "7 ANS"
- Ping ring autour du cercle (TYPE F) — cycle 60f, scale 1.0→1.8, opacity fade out

**A3 — 279→349f (~2.3s) : Cercle complet + légende**
- Arc atteint 100% → flash gold 3f (opacity 1→1 brightness 1.5→1)
- "7 ANS" bounce léger (spring overshoot damping 6)
- Légende **"SANS CADRE RÉGLEMENTAIRE COMPLET"** fadeIn monospace 22px IVORY opacity 0.55
  - Apparaît centré sous le cercle (~60px en dessous)

---

### Phase B — Tour reveal + transition (349→585f / 7.8s)

- Cercle : zoom-out fade simultané (scale 1→1.6, opacity 1→0, durée 40f)
- **`assets/tower-hero.png`** reveal depuis le bas via clipPath qui monte (durée 80f)
  - Position : centrée, hauteur ~600px
  - Float vertical lent ±8px (sinus cycle 150f) — permanent motion
  - Glow radial gold pulsant derrière la tour (radial-gradient animé, cycle 60f)
- Radial depuis le bas du fond s'illumine gold (opacity 0→0.12 en 60f)
- Légende reste visible et fade out à frame 480

---

### Phase C — Verdict froid double impact (585→730f / 4.8s)

- Tour reste en fond opacity 0.35, scale respire légèrement (1.0→1.03 sinus)
- **"1 SEUL SERVICE."** — spring depuis bas, frame 585 — Bebas Neue 100px IVORY
  - `spring({ damping: 14, stiffness: 90 })`, slide 60→0px
- **"LES RAILS DU PAYS."** — spring depuis bas, frame 635 (+50f) — Bebas Neue 100px GOLD
  - Même config spring
  - textShadow gold pulsant après apparition (comme verdict Beat4)
- Ton : FROID (ivory/gold) — PAS rouge, PAS de strobe. Constat d'ampleur.
- Source `"Safaricom · CBK 2024"` fadeIn frame 700, monospace 20px IVORY opacity 0.45

---

## Mapping narration → frames (Whisper validé 2026-05-15)

| SEG | Frame | Mot Whisper | Action visuelle |
|-----|-------|-------------|-----------------|
| `debut` | 0 | "a laissé M-PESA opérer" | Cercle SVG + "7 ANS" apparaissent |
| `testlearn` | 306 | "test and learn" | Arc ~80% — count-up années accélère |
| `sept_ans` | 339 | "7 ans" | Arc 100% — flash gold — légende fadeIn |
| `rails1` | 574 | "Un seul service" | "1 SEUL SERVICE." spring ivory |
| `rails2` | 632 | "Les rails" | "LES RAILS DU PAYS." spring gold |
| `end` | 700 | fin narration | Source fadeIn |

**Phase B (tour)** : démarre à frame 339 (après cercle complet), tour reveal jusqu'à frame 574.

---

## Légende Phase A

- Texte : **"SANS CADRE RÉGLEMENTAIRE COMPLET"**
- Font : monospace, ~20px, IVORY opacity 0.5
- Apparition : frame 349 (après stabilisation cercle), fadeIn 20f
- Position : centré sous le cercle, ~80px en dessous

---

## Décisions techniques lockées

1. **Cercle** : SVG pur Remotion — `strokeDasharray={circumference}` + `strokeDashoffset` interpolé. PAS d'image.
2. **Tour** : `assets/tower-hero.png` existant — fond transparent, wireframe gold. PAS de génération Gemini. Animation via wrapper div (clipPath reveal + float + glow).
3. **Background** : `beat5/bg.png` existant — texture ardoise à opacity 0.25. PAS de génération.
4. **Audio** : `<Audio src={staticFile(M.AUDIO)} />` + musique continue — vérifier startFrom dans Root.tsx.
5. **Verdict couleur** : IVORY + GOLD (pas RED). Constat d'ampleur, pas accusation.
6. **Pattern** : NE PAS utiliser `DataRevealSouverain` — Beat5 est une révélation temporelle progressive, pas une comparaison 2 barres.
7. **Zéro génération Gemini nécessaire** — tous les assets sont présents.

---

## Assets à générer / vérifier

| Asset | Status | Action |
|-------|--------|--------|
| `beat5/narration.mp3` | PRESENT | Faire alignment Whisper avant session |
| `beat5/bg.png` | PRESENT | Texture ardoise noire — réutiliser à opacity 0.25 |
| `assets/tower-hero.png` | PRESENT | Tour wireframe gold fond transparent — asset principal Phase B/C |
| Alignment JSON | ABSENT | `python3 scripts/generate-audio-alignment.py beat5` |

**Zéro génération Gemini nécessaire.** Les deux assets clés existent déjà.

---

## Ordre de construction session autonome

1. Générer alignment Whisper `beat5/alignment.json`
2. Vérifier/ajuster SEG dans manifest vs alignment réel
3. Phase A — cercle SVG + "7 ANS" + float
4. Phase A — légende monospace frame 349
5. Phase B — tour wireframe SVG build animation
6. Phase C — verdict double ligne spring
7. Sous-titres calés sur alignment
8. Source + render + review Gemini

---

## Leçons Beat4 à appliquer ici

- Lire le storyboard IMAGE avant tout (déjà fait)
- Manifest d'abord, code ensuite
- Maximum 8s sans changement visible (R1) — le cercle qui tourne = permanent motion, ok
- PAS de Gemini pour les éléments géométriques SVG — coder direct
- Valider la narration à l'oreille avant de locker les SEG

---

*Créé : 2026-05-15 | Storyboard analysé par Claude depuis mpesa 2.png*
