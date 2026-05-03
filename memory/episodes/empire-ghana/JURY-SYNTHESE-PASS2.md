# JURY SYNTHÈSE PASS 2 — Empire du Ghana
> Date : 2026-05-03
> 3 LLMs : OpenAI GPT-4o, Google Gemini 3 Flash Preview, xAI Grok-4-fast
> Coût Pass 2 : $0.0230 | Coût total Pass 1 + Pass 2 : $0.0457

---

## Notations

| LLM | Note | Coût | Force notable |
|-----|------|------|---------------|
| OpenAI GPT-4o | 8/10 | $0.016 | Recettes minimalistes, sécurité |
| Gemini 3 Flash | 8.5/10 | $0.005 | Recettes techniques précises, idée "Compteur Richesse" forte |
| Grok-4-fast | 7/10 | $0.001 | Pseudocode opérationnel, idée "Indicateur temporal" |

---

## Validation Top 7 (Q1)

| # | Idée | OpenAI | Gemini | Grok | Statut final |
|---|------|--------|--------|------|--------------|
| 1 | Balance signature dynamique | OUI | OUI (AbsoluteFill persistant) | OUI | ✅ **OUI** |
| 2 | Beat 3 silent barter danse rituelle | OUI | **AMENDEMENT** (filter drop-shadow + mix-blend-mode screen au lieu de opacity 40%) | **AMENDEMENT** (idle+crouch symétriques, pas frames custom) | ✅ **OUI AMENDÉ** |
| 3 | Ligne front rouge bordeaux Almoravides | **AMENDEMENT** (interpolate simple) | OUI (stroke-dashoffset) | OUI | ✅ **OUI** (recette Gemini) |
| 4 | Sceau Mali sur ruines Sundiata | OUI | OUI (cheap & chic) | OUI | ✅ **OUI** |
| 5 | Pop-up Labels synchronisés | OUI | OUI (attention collisions) | OUI | ✅ **OUI** |
| 6 | Palette bordeaux profond #4A0E0E | OUI | OUI (lisible sur fond sombre) | OUI | ✅ **OUI** |
| 7 | Koumbi Saleh ville pierre/banco | **AMENDEMENT** (Gemini stylisée) | **AMENDEMENT** (Gemini fond opacity 0.6 + Lottie pulse-marker POI) | **AMENDEMENT** (Gemini static, SVG mosquée simple, pas Lottie) | ✅ **OUI AMENDÉ** (3/3) |

**Score : 7/7 idées validées, 3 amendements convergents intégrés.**

---

## Amendements convergents (à appliquer obligatoirement)

### A1. Beat 3 — éviter opacity 40% sur sprites
**Problème identifié** : opacity 40% rend les sprites PixelLab illisibles sur fond carte texturé.
**Solution Gemini** : `filter: drop-shadow(or)` + `mix-blend-mode: screen` pour effet fantomatique **sans perdre lisibilité**.
**Solution Grok** : garder dézoom + LightLeak mais simplifier l'animation (idle + crouch suffisent, pas besoin de frames custom).
**Décision** : **drop-shadow doré + mix-blend-mode + opacity 70%** (compromis : effet fantomatique mais sprites lisibles).

### A2. Idée 7 Koumbi Saleh — Gemini illustration STATIQUE + Lottie POI
**Problème identifié** : Lottie minaret = trop de vertices ; Gemini seule = trop statique.
**Solution combinée Gemini + Grok** :
- Gemini génère **1 illustration banco/pierre** (statique)
- Affichage en fond avec `opacity: 0.6`
- **Lottie pulse-marker** sur le point d3-geo Koumbi Saleh pour ancrer la data spatialement
- SVG simple pour la mosquée si besoin de POI

### A3. Idée 3 — animation simple (interpolate)
**Solution OpenAI/Gemini** : `interpolate()` ou `stroke-dashoffset` pour la ligne descend du nord. Pas de complexité.

---

## NOUVELLES IDÉES VAGUE 1 (proposées Pass 2)

### 💡 8e idée Gemini — "Le Compteur de Richesse" (Beat 2)
> Pendant Beat 2 (Koumbi Saleh), 2 petits compteurs en haut à droite avec icônes (sac sel + lingot or). S'incrémentent frénétiquement quand narratrice dit "taxait chaque caravane". Renforce l'aspect "Empire-Gestion" qui plaît sur YouTube.

**Évaluation** : excellente. Combat l'encyclopédisme par dynamisme UI. Petit effort (InsertNombre existe déjà).

**→ DÉCISION** : intégrer en VAGUE 1 (priorité MOYENNE).

### 💡 8e idée Grok — "Indicateur temporal" (toute la vidéo)
> Barre chronologique SVG en bas écran qui pulse OR_VIF aux dates clés (1076, 1240). Renforce ancrage historique sans alourdir.

**Évaluation** : utile mais redondant avec narration "huitième au treizième siècle" + "1076" + "1240" déjà explicite. Risque de sursaturer le bas d'écran (déjà occupé par karaoke).

**→ DÉCISION** : VAGUE 2 conditionnel (à tester si la composition manque d'info temporelle).

---

## Q3 — Transition Beat 4 → Beat 5 (3/3 LLMs convergent)

Toutes les recettes vont dans le même sens : **désaturation progressive + zoom out + balance qui ralentit**.

| LLM | Recette |
|-----|---------|
| OpenAI | Fond sépia plus clair + spring() pour éviter saccade |
| Gemini | Désaturation totale carte 30 frames vers GRIS_CENDRE + Slow Zoom Out + balance devient blanche/grise + silence 0.5s |
| Grok | Balance damping élevé (oscillation mourante) + désaturation territoire GRIS_CENDRE + zoom out subtil |

**Synthèse** : ✅ **désaturation 30 frames vers GRIS_CENDRE + zoom out lent + balance perd son éclat doré (devient grise) + petit silence audio**. Implémenter selon recette **Gemini** (la plus complète).

---

## Pièges techniques anticipés

### 🚨 Piège 1 — Sprite drift framerate (Gemini)
> "Si la composition Remotion est en 60fps et le sprite en 12fps, l'animation sera saccadée."

**Solution** : `Math.floor(frame / (60 / 12)) % totalFrames` dans `getSpriteFramePath`. Mais on est à 30fps, donc moins critique. À tester.

### 🚨 Piège 2 — Surcharge SVG d3-geo (Gemini + Grok)
> "Animer 5000 points de frontière en SVG natif peut faire ramer la preview Remotion."

**Solution** : `memo` sur `StaticMap` + n'animer que les `<g>` de transformation (zoom/pan), pas les paths.

### 🚨 Piège 3 — Z-Index LightLeaks vs subtitles (Gemini)
> "Un LightLeak mal placé peut masquer les sous-titres Karaoke."

**Solution** : wrapper LightLeak en `pointer-events: none` + composant Subtitles toujours en dernier enfant de la `Composition`.

### 🚨 Piège 4 — Surcharge sprites PixelLab symétrie (Grok)
> "Multi-instances (2+ dirs) peuvent laguer en headless."

**Solution** : pré-rendre frames clés en séquence PNG, limiter à 4 dirs max par beat. (On est déjà à 2 sprites max simultanés sur Beat 3 → OK)

### 🚨 Piège 5 — Sync alignment ElevenLabs imprécis (Grok)
> "Décalages mot-par-mot >0.5s sur narration GeoAfrique."

**Solution** : post-aligner via Whisper API en debug si nécessaire. **Précédent Mansa Moussa V2 OK donc à confirmer**.

### 🚨 Piège 6 — Lottie >5 instances simultanées (Grok)
> "Vertices cumulés crashent render."

**Solution** : `require()` lazy, stagger imports, valider <5 actives par beat. **À surveiller surtout en Beat 4** (sceau Mali + balance + LightLeak = déjà 3).

---

## DÉCISIONS POST-PASS2 (à acter avec Aziz)

1. **VAGUE 1 = 8 idées** (Top 7 + Compteur Richesse Gemini)
2. **Indicateur temporal Grok** = VAGUE 2 conditionnel
3. **Amendement Beat 3** : drop-shadow + mix-blend-mode + opacity 70% (pas 40%)
4. **Amendement Idée 7** : Gemini illustration + Lottie pulse-marker POI
5. **Transition Beat 4→5** : recette Gemini (désaturation + zoom out + balance grise + silence 0.5s)
6. **6 pièges techniques** documentés et anticipés

---

## LEÇONS WORKFLOW PASS 2

- **Convergence forte** : 3/3 LLMs valident 7/7 idées (avec 3 amendements convergents)
- **Pas de gap critique manqué** : aucun LLM n'a soulevé de problème majeur non-anticipé
- **Coût total Pass 1 + Pass 2 = $0.046** (largement sous tout cap)
- **Recettes opérationnelles** : Gemini fournit le pseudocode le plus réutilisable, Grok donne les frames clés exactes, OpenAI valide la sécurité
- **Le brief Pass 2 a bien fonctionné** : aucun LLM n'a essayé de modifier le script ou les marchands (verrouillage respecté)
