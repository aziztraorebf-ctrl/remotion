# VAGUE 1 LOCKED — Empire du Ghana
> Source de vérité pour le code de production
> Validée Aziz 2026-05-03 après Jury Pass 1 + Pass 2
> Ne PAS modifier sans nouvelle validation

---

## 8 Idées VAGUE 1 (à coder)

### Idée 1 — Balance signature dynamique (toute la vidéo)
- **Outil** : Lottie `balance.json` (déjà codé dans `tests/balance.json`, à déplacer en `_shared/lottie/balance.json`)
- **Effort** : Petit
- **Specs** :
  - Présente en `AbsoluteFill` persistant tout au long de la vidéo
  - Position : haut écran (au-dessus karaoke), opacité subtile 0.5-0.8
  - Oscille selon mots-clés sel/or via `interpolate(currentTime, [...], [...])`
  - **Beat 0-1** : balance penche selon mots ("sel" → gauche, "or" → droite)
  - **Beat 2** : oscillations plus fortes aux stats (90kg, vingt mille)
  - **Beat 3 silent barter** : équilibre PARFAITEMENT au midpoint narration "sans un mot"
  - **Beat 4** : balance se brise visuellement (tilt extrême + saturation grise) à mention Almoravides
  - **Transition 4→5** : balance perd son éclat doré, devient grise, oscillation mourante (damping élevé)
  - **Beat 5 CTA** : balance fixe horizontale, blanche/grise

### Idée 2 — Beat 3 silent barter danse rituelle (AMENDÉ)
- **Outils** : PixelLab sprites + d3-geo positions + LightLeak + spring camera
- **Effort** : Gros
- **Specs production** :
  - **2 sprites** : Berbère (vient du nord, dépose sel) + Sahélien (vient du sud, dépose or)
  - Positions calculées via `projection([lon, lat])` d3-geo (Taghaza nord, Bambouk sud, dépôt centre Koumbi Saleh)
  - **AMENDEMENT validé** : pas opacity 40% — utiliser `filter: drop-shadow(2px 2px 4px #D4A574)` + `mix-blend-mode: screen` + `opacity: 0.7`
  - Dézoom caméra de 2.5x → 1.2x au moment "Mais le moment qui marque l'histoire" (entrée Beat 3)
  - LightLeak doré (8 frames, opacity cap 0.35) au midpoint narration "sans un mot"
  - Balance signature équilibre PARFAITEMENT à ce midpoint
  - Sacs sel + or persistent (logique validée test silent barter v2)
- **Frames clés timing audio-derived** : à calculer après Forced Alignment

### Idée 3 — Beat 4 ligne de front rouge bordeaux (Almoravides)
- **Outils** : SVG path + d3-geo + interpolate
- **Effort** : Petit
- **Specs** :
  - Ligne tracée du nord vers le sud sur la carte
  - Couleur `BORDEAUX_PROFOND #4A0E0E`
  - Animation : `stroke-dashoffset` depuis `node.getTotalLength()` (Gemini)
  - Au moment "Almoravides coupèrent" : ligne descend rapidement
  - Au moment "les routes du sel" : la ligne CROISE/COUPE le tracé route du sel (visible)
  - Effet visuel : la route du sel est désaturée derrière (effet "coupé")

### Idée 4 — Beat 4 pivot Sundiata (sceau Mali sur ruines)
- **Outils** : Lottie sceau + LightLeak + fade Remotion
- **Effort** : Petit
- **Specs** :
  - Pas de nouvelle carte
  - Fade-to-black partiel (opacity 1 → 0.3) sur la carte Wagadou
  - LightLeak doré (8-10 frames) au moment "Sundiata Keïta détruit Koumbi Saleh"
  - **Sceau Empire Mali** apparaît en surimpression : Lottie ou SVG simple (couronne stylisée or sur fond bordeaux)
  - Cross-promo Sonjata Papercraft V7 implicite (audience qui a vu Sonjata reconnaît)
  - Texte cartouche : "1240 — Sundiata Keïta · Empire du Mali" en bas

### Idée 5 — Beat 2 Pop-up Labels synchronisés
- **Outils** : Forced Alignment ElevenLabs + composant React `StatPop`
- **Effort** : Moyen
- **Specs** :
  - Chaque stat = 1 pop-up timée précisément au mot via Forced Alignment
  - Style : style "notification UI moderne" (Mono JetBrains, fond PARCHEMIN, bordure or)
  - Stats à pop-up :
    - "quatre-vingt-dix kilos" → pop "90 kg" à côté de Taghaza nord
    - "par poignées" → icône poignée or à côté de Bambouk sud
    - "vingt mille habitants" → "20 000" à côté de Koumbi Saleh
    - "une mosquée" → icône mosquée discrète
    - "taxait chaque caravane" → trigger Compteur Richesse (idée 8)
  - Entrée : `spring(scale: 0 → 1.2 → 1)` (overshoot)
  - Anti-collision : décaler les pop-ups si trop simultanées (Gemini alerte)

### Idée 6 — Palette bordeaux #4A0E0E (déjà locked)
- **Outil** : `GhanaPalette.ts` (déjà créé)
- **Effort** : Petit
- **Specs** :
  - Routes/frontières d3-geo : `BORDEAUX_PROFOND #4A0E0E`
  - Or réservé aux POI clés (Koumbi Saleh, Wagadou)
  - Sépia/sable pour fond carte
  - Indigo pour fleuves + voile berbère
  - Application globale dès la carte de base

### Idée 7 — Koumbi Saleh banco (AMENDÉ)
- **Outils** : Gemini illustration statique + Lottie pulse-marker POI + SVG mosquée simple
- **Effort** : Moyen
- **Specs** :
  - **Étape 1** : Générer 1 illustration Gemini : panorama Koumbi Saleh en pierre/banco (pas huttes), mosquée centrale stylisée, palette sépia/or
  - **Étape 2** : Image Gemini affichée en fond pendant Beat 1-2 (frames 13s-40s) avec opacity 0.6 (pas dominante)
  - **Étape 3** : Lottie `pulse-marker` (cercle bordeaux qui pulse) sur le point d3-geo exact Koumbi Saleh pour ancrer la data
  - **Étape 4** : SVG simple de mosquée (minaret) qui apparaît brièvement au mot "mosquée"

### Idée 8 (NEW Pass 2) — Compteur de Richesse Beat 2
- **Outils** : `InsertNombre` existant + icônes SVG (sac sel, lingot or)
- **Effort** : Petit
- **Specs** :
  - 2 petits compteurs en haut à droite (sac sel + lingot or)
  - Au moment "taxait chaque caravane" : compteurs s'incrémentent **frénétiquement** (effet "kaching")
  - Compteur sel : 0 → 90 (kg) en 0.5s
  - Compteur or : 0 → ? (un chiffre dramatique style "1 200 dinars")
  - Effet : renforce "Empire-Gestion", combat encyclopédisme par dynamisme UI
  - Doit être discret pour ne pas écraser le Pop-up Labels au sol (idée 5)

---

## Transition Beat 4 → Beat 5 (recette unanime jury Pass 2)

- **Durée** : ~30 frames (1 seconde)
- **Visuel** :
  - Désaturation totale carte vers `GRIS_CENDRE #7A6E66`
  - Slow Zoom Out continu (caméra se détache)
  - Balance signature : perd son éclat doré → devient grise (couleur `GRIS_CENDRE`)
  - Oscillation balance ralentit (spring damping élevé) jusqu'à parfaite horizontale fixe
- **Audio** : silence 0.5s avant "Wagadou" final pour marquer le respect

---

## VAGUE 2 (à voir plus tard, hors session)

### V2.1 — Indicateur temporal (Grok)
- Barre chronologique SVG en bas écran qui pulse aux dates clés (1076, 1240)
- À tester si la composition manque d'info temporelle
- Risque conflit avec karaoke subtitles (bas d'écran)

### V2.2 — Drinking animation marchands (atmosphère caravane)
- Si on veut enrichir Beat 1 ou Beat 2 avec une scène "marchand qui boit dans une caravane"
- Crédits PixelLab dispo

---

## 6 Pièges techniques anticipés (à surveiller)

1. **Sprite drift framerate** → `Math.floor(frame / (60/12)) % totalFrames` (on est à 30fps, moins critique mais surveiller)
2. **Surcharge SVG d3-geo** → `memo` + animer `<g>` transformations seulement, pas les paths
3. **Z-Index LightLeaks vs subtitles** → `pointer-events: none` + Subtitles toujours dernier enfant
4. **Sprites symétrie 4 dirs** → max 4 dirs/beat (OK pour nous, max 2 sprites simultanés Beat 3)
5. **Sync alignment ElevenLabs imprécise** → Whisper API debug si décalage >0.5s
6. **Lottie >5 instances simultanées** → Beat 4 critique (sceau Mali + balance + LightLeak = 3, OK)

---

## Stack technique verrouillé

- **Cartes** : `_shared/AtlasMercator.tsx` (réutilisé Mansa Moussa V2) + adaptation viewport Sahel
- **Sprites** : `public/empire-ghana/characters/sahelien/` + `berbere/` (3 anims chacun, validés)
- **Lottie** : `tests/balance.json` (à déplacer `_shared/lottie/`) + nouveaux Lottie (sceau Mali, pulse-marker)
- **Palette** : `components/GhanaPalette.ts` (locked)
- **Audio** : ElevenLabs Narratrice GeoAfrique v2 + Forced Alignment
- **Sous-titres** : Whisper API + template `subtitles-shorts.md`
- **Timing** : `timing.ts` produit après alignment (frame-précis)
- **Manifest** : `empire-ghana-manifest.json` source de vérité visuelle

---

## Coût total Jury

- Pass 1 : $0.0227
- Pass 2 : $0.0230
- **Total : $0.0457** (largement sous tout cap)
