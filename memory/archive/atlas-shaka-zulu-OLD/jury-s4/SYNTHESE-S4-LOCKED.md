# Synthèse S4 Nandi — Décisions verrouillées

> Jury 4 LLMs (GPT-4o + Grok + Gemini + Kimi) + analyse stratégique Aziz
> Date : 2026-05-02
> Coût jury : ~$0.034
> **Ne pas remettre en question pendant le code. Ce fichier prime sur le code.**

---

## Décision stratégique (Aziz)

**Format retenu : carte d3-geo + inserts Remotion purs**
- Pas de Seedance pour S4 (rupture stylistique si Hook Seedance pas fait avant)
- PixelLab Nandi sprite = seul asset externe (breathing-idle + falling-back-death)
- Remotion orchestre, PixelLab donne la chair humaine — c'est le "bricolage" validé

**Philosophie** : pousser les inserts Remotion beaucoup plus loin que ce qu'on a fait.
Ce que Remotion ne peut pas faire seul = visage expressif → PixelLab le fait.
Tout le reste = SVG pur + spring + interpolate.

---

## Plan 5 actes verrouillé

### Act 1 — "Nandi était là" (local 0→398, 13.3s)

**Carte :**
- Zoom lent 1→1.15 centré sur uMgungundlovu
- Frontières pays voisins s'estompent (stroke-opacity 0.6→0.2) pour isoler ZAF
- Halo or pulsant sur uMgungundlovu (spring très doux `{damping:200, stiffness:50}`)
- Fill ZAF pulse breathing très doux

**Nandi :**
- Spawn frame 60 en `breathing-idle` direction south (face caméra)
- Position : sur uMgungundlovu sur la carte
- Scale 1.0→1.05 subtil sur les mots "elle était là"

**Texte :**
- "Nandi" apparaît seul d'abord, au-dessus du sprite, Cormorant Garamond
- Phrases suivantes déroulent en fade-in doux
- Couleur parchemin `#F5E6C8`

---

### Act 2 — "Nandi meurt" (local 398→468, 2.8s) — CHARNIÈRE

**Technique "cardio-stop" (Kimi — convergence 4/4) :**
1. Frame 398 : **1 frame noir complet** (subliminal, non explicite)
2. `falling-back-death` déclenché direction south
   - 2 layers : normal + feColorMatrix saturate(0) → noir&blanc 12 frames puis bordeaux
   - Rotation sprite -15° pendant la chute
   - Alpha 1→0.85 (12f) puis 0.85→0 (36f)
3. MourningWarp spring nerveux `{damping:10, stiffness:400}` → spasm
4. Rotation carte 0°→-1°→0° en 18 frames (sol qui manque)
5. Fill ZAF bascule or→bordeaux via HSL interpolation 60 frames

**Texte :**
- "Octobre 1827. Nandi meurt." blanc `#F5E6C8`
- Tremblement horizontal ±1px, 8Hz, 12 frames
- Point final rebondit (spring `{damping:8, stiffness:400}`)

---

### Act 3 — "4000 périssent" (local 468→777, 10.3s)

**Carte :**
- MourningWarp continue, vitesse ralentit progressivement
- feColorMatrix invert **6 frames** quand narration dit "quatre mille" (frame 777 local)
- Pays voisins deviennent bordeaux aussi (highlightFills spread = contagion du deuil)

**Nandi :**
- Absente totalement. Vide palpable.
- Ombre feDropShadow 1px/0.15 à l'endroit où elle est tombée, s'efface progressivement

**Texte — "Insert Décrets" (NOUVEAU) :**
- Chaque décret slide depuis les bords (translateX ±100px→0, ease-out exponentiel)
- "Toute naissance est proscrite pendant un an." → slide depuis gauche
- "Tout champ reste sans culture." → slide depuis droite
- Typographie froide : Source Sans Pro 28px, tracking +40, bordeaux clair `#AA4A4A`
- Le mot "proscrite" reste 12 frames plus long

---

### Act 4 — Insert 4000 (local 777→927, 5s)

- `InsertNombre4000` existant (déjà codé, ne pas toucher)
- Scale 0.3→1.0 avec overshoot `{damping:12, stiffness:200}`
- Cartouche "JAMES STUART ARCHIVE · 1913" en bas

---

### Act 5 — DramaLine + Assassinat (local 853→1361)

**DramaLine "Pour n'avoir pas pleuré assez fort." (frame 853) :**
- Position : centre-vertical, 18% depuis le bas
- Cormorant Garamond Bold 52px, bordeaux `#8B1A1A`
- Rectangle fond parchemin 10% opacity derrière
- Entrée : scaleY 0→1 en 8 frames (spring `{damping:14, stiffness:500}`) = drapeau qui se déploie
- Lettrine "P" 1.4em, décalée -2px vers le haut
- feTurbulence mask baseFrequency 0.02→0 pendant 12 frames (fragile qui s'apaise)
- Reste 36 frames, fade-out avec slide +8px (chute symbolique)
- Amendement GPT-4o : léger glow bordeaux feDropShadow pour "arrêter" le spectateur

**Spirale finale (frame 854→1149) :**
- "Ses demi-frères comprennent..." → texte scintillement opacity 0.9→1→0.9 à 12Hz
- "L'homme qui a tout bâti est en train de tout détruire." → mot "détruire" reste seul 12 frames
- Carte : warp ralentit, ZAF or très pâle `#C8A84B` à 15% opacity (survie du royaume)
- Frontières clignotent 3× (stroke-opacity 0→1→0.3 en 6 frames)

**Cartouche "22 SEPTEMBRE 1828" (frame 1149→1361) :**
- Style cohérent avec cartouches sources (Source Sans Pro Caps 24px, tracking 100)
- Filets 1px or `#C8A84B` de 120px qui se "draw" depuis le centre (strokeDasharray animé, 24 frames)
- Texte apparaît lettre par lettre après que les filets terminent
- Position : centre, 8% au-dessus du bas
- Fond carte : brightness 100%→85%→100% en 12 frames ("éteindre" subtil)
- Reste visible jusqu'à fin de scène

---

## À ÉVITER absolument (convergence 4/4 LLMs)

- Particules sang-like ou goutte stylisée → cheap + risque algo YouTube
- Ghost Nandi au-delà de 6-8 frames → kitsch
- Pathos explicite / violence littérale
- Transitions mécaniques sans charge émotionnelle

---

## Assets requis

| Asset | Statut | Fichier |
|-------|--------|---------|
| Nandi breathing-idle (4 frames × 4 dirs) | PRÊT | à télécharger ZIP PixelLab |
| Nandi falling-back-death (? frames × 4 dirs) | EN COURS PixelLab | à télécharger ZIP |
| InsertNombre4000 | PRÊT | `inserts/InsertNombre4000.tsx` |
| MourningWarp | PRÊT | `components/MourningWarp.tsx` |
| AtlasMercator (projection mourning) | PRÊT | `_shared/atlas-components` |
