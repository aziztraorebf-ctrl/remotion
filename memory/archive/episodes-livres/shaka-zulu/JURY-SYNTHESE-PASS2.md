# Synthese Jury Pass 2 — Atlas Shaka Zulu Vague 2

> 3 LLMs : GPT-4o + Grok-4-fast + Gemini-3-flash-preview
> Cout : $0.0233 (cap $0.10)
> Date : 2026-05-02

---

## Q1 — Validation des 7 idees priorite haute

| # | Idee | GPT-4o | Grok | Gemini | Verdict final |
|---|------|--------|------|--------|---------------|
| 1 | Hook combo cinematique + typo | OUI | OUI | OUI + amendement | **OUI** + ajouter filtre grain papier sur composition entiere (Gemini) |
| 2 | Cartouches sources iklwa + bouclier | OUI | OUI | OUI | **OUI unanime** |
| 3 | Carte d3-geo reelle | OUI | OUI | OUI | **OUI unanime** + projection `geoAzimuthalEqualArea` (Gemini) |
| 4 | Cornes de buffle signature | OUI geometrique | OUI geometrique | Amendement majeur | **OUI geometrique 2 arcs Bezier**, pas Recraft (Grok). Approche tactique (epaisseur/courbure animees), pas illustration biologique (Gemini) |
| 5 | PixelLab caravane impi S3 | OUI | OUI | OUI | **OUI unanime** |
| 6 | Deformation S4 organique | OUI | OUI amendement | OUI | **OUI** mais limiter aux filtres SVG + ondes geometriques (pas Gemini pour les ondes — Grok) |
| 7 | Blueprint inserts existants | OUI | OUI | OUI | **OUI unanime** — "ce qui sauvera le projet du cliche ethnographique" (Gemini) |

**Toutes les 7 idees approuvees. 3 amendements convergents :**
1. Idee 4 : geometrique 2 arcs Bezier exclusivement, pas de Gemini→Recraft (Grok + GPT-4o convergent)
2. Idee 6 : filtres SVG purs + cercles geometriques, pas de Gemini (Grok)
3. Idee 1 : ajouter un filtre grain papier sur composition entiere pour unifier cinematique + carte (Gemini, novateur)

---

## Q2 — Implementation par outil (synthese consolidee)

### Idee 1 — Hook
- **Gemini → image source** : Shaka adulte de dos contemplant le KwaZulu-Natal, style paper-craft
- **Seedance** : clip 5s image-to-video a partir de l'image Gemini
- **SVG pur** : typographie Cormorant Garamond avec `mask-image` ou `stroke-dasharray` (effet gravure)
- **d3-geo** : carte cible apres zoom-out
- **NOUVEAU (Gemini Q3)** : filtre SVG `feTurbulence` grain papier applique sur TOUTE la composition pour unifier les textures

### Idee 2 — Cartouches sources
- **SVG pur** : rectangles bordures doubles + leader lines vers l'objet (Gemini)
- **React** : composant `<SourceCartouche />` reutilisable prenant `author` et `title` en props (Gemini)
- **Typo** : Cormorant Garamond pour la source

### Idee 3 — Carte d3-geo
- **d3-geo** : projection `geoAzimuthalEqualArea` centree sur KwaZulu-Natal (Gemini)
- **Natural Earth GeoJSON** : frontieres + cotes precises
- **SVG pur** : palette parchemin/bordeaux/or appliquee via filtres CSS/SVG
- **Filtre parchemin** : `feTurbulence` pour effet papier (Gemini)
- **Animations** : zoom/fade via spring/interpolate

### Idee 4 — Cornes de buffle
- **SVG pur** : 2 path Bezier animes via `stroke-dashoffset` (Gemini)
- **Animation tactique** : epaisseur (`stroke-width`) et courbure animees via spring pour simuler encerclement (Gemini — outil de guerre, pas illustration)
- **Recraft** : OPTION pour generer icone tete de buffle minimaliste au centre (Gemini, faible priorite)
- **Reutilisable** : aux transitions de segments

### Idee 5 — PixelLab caravane impi
- **PixelLab** : sprite sheet guerrier zoulou (walk cycle + idle), 3-4 sprites
- **d3-geo** : sprites positionnes sur paths d'expansion via `interpolate` mapping coordonnees GeoJSON → X/Y (Gemini)
- **Remotion** : animation deplacement via spring/interpolate

### Idee 6 — Deformation S4
- **SVG pur** : filtre `<filter id="mourning-warp">` avec `feTurbulence` dont `baseFrequency` est liee a un spring Remotion (Gemini)
- **Cercles concentriques** : geometriques animes via spring/interpolate depuis le palais (Grok — Echo Maternel reduit)
- **d3-geo** : carte KwaZulu comme base deformable
- **IMPORTANT (Grok amendement)** : pas de Gemini ici, tout en SVG pur + d3-geo

### Idee 7 — Blueprint inserts
- **SVG pur** : grille de fond (grid lines 1px opacite 0.1) — Gemini
- **React** : layout Flexbox
- **Typo** : Inter/JetBrains Mono pour donnees, Cormorant Garamond pour sources
- Application aux 5 inserts vague 1B existants

---

## Q3 — Transitions cinematique → carte (3 propositions par LLM = 9 au total)

**Convergence** : tous proposent un effet de transformation progressive avec textures unifiees.

### Recommandations a retenir

#### Transition GAGNANTE — "Depliage de Parchemin" (Gemini A)
- Clip Seedance subit rotation 3D (`rotateX`) pour s'aplatir sur le plan de la carte
- Frontieres d3-geo se dessinent autour de lui comme si le clip etait une illustration collee sur le parchemin
- **Outils** : Remotion 3D transform + d3-geo + filtre grain papier unificateur
- **Cout** : moyen (~30-45 min pour Claude)
- **Pourquoi gagnante** : narrative ("on deplie une carte ancienne"), exploite filtre grain papier de Q1

#### Transition ALTERNATIVE — "Texture parchemin progressive" (Grok A)
- Clip Seedance zoome out + textures parchemin SVG superposees + dissolution en projection 2D d3-geo
- Typo "Il est ne paria" reste fixe et s'integre comme label sur carte finale
- **Outils** : Remotion + SVG pur + d3-geo + Seedance
- **Cout** : 2-3h (estimation Grok, en realite ~30 min Claude)

#### Transition FAIBLE — "Effacement tactique blueprint" (Gemini B)
- Clip devient bleu monochrome (`feColorMatrix`) → schema technique → dezoom carte
- **Probleme** : casse l'esthetique parchemin/bordeaux/or, introduit du bleu non-aligne palette

**Decision lockee : Transition "Depliage de Parchemin" (Gemini A)**

---

## Q4 — Gap detection

### 8e idees proposees

| LLM | 8e idee | Verdict |
|-----|---------|---------|
| GPT-4o | Compteur dynamique morts (deja en priorite moyenne — #10) | **Garder en priorite moyenne** |
| Grok | Animation typographique pour 4 actes de S2 (reveals sequentiels SVG synchronises narration) | **NOUVEAU — a integrer en priorite haute** car structure visuellement S2 sans alourdir la carte |
| Gemini | "Timeline Tracker" vertical sur bord gauche (regle graduee ou lance qui descend) | **A discuter avec Aziz** — risque charge en portrait mais aide rétention sur 150s |

### Pieges techniques signales (CRITIQUES — a anticiper avant code)

1. **Performance d3-geo + filtres SVG simultanes** (Gemini + Grok convergent)
   - Risque : `feTurbulence` sur SVG avec milliers de points GeoJSON (Natural Earth) → ralentit rendu Remotion, potentiel crash export
   - **Solution Gemini** : simplifier GeoJSON via `topojson` AVANT integration, appliquer filtres uniquement sur `<g>` specifiques (pas toute la scene)
   - **Solution Grok** : tester export MP4 tot, attention frame drops >10% sur mobile

2. **Fonts Google manquantes au render** (Gemini + Grok convergent)
   - Risque : Cormorant Garamond / Inter / JetBrains Mono peuvent crasher l'export
   - **Solution** : charger via `@remotion/google-fonts` ou `staticFile` + `<link>` manuel
   - Tester export local AVANT render final

3. **Combinaison PixelLab + d3-geo + filtres** (Grok)
   - Risque : sprites raster en overlay sur SVG vectoriel + filtres = perf degradee
   - **Solution** : tests offscreen rendering, mini-renders 5s avant scenes completes

---

## ✅ LISTE FINALE VERROUILLEE — Vague 2

### Code dans cet ordre (priorite execution)

1. **PixelLab generation sprites** (lance EN PARALLELE de tout le reste car ~5 min/sprite + 8h expiration)
   - 4 sprites guerriers zoulous (walk cycle) pour caravane impi
   - 1 sprite Shaka idle pour ref
2. **Hook** (idees 1 + transition Depliage Parchemin combinees)
3. **Cartouches sources iklwa + bouclier** (quick win, 5 min)
4. **Carte d3-geo Shaka** (reutilisation moteur Mansa Moussa V2 + palette Shaka + projection `geoAzimuthalEqualArea`)
5. **Composant Cornes de buffle** (geometrique 2 arcs Bezier)
6. **Caravane impi sur carte S3** (PixelLab + d3-geo)
7. **Deformation S4** (filtres SVG + cercles concentriques)
8. **Blueprint inserts existants** (polish 5 inserts vague 1B)
9. **NOUVEAU : Animation typo 4 actes S2** (Grok Q4 — reveals sequentiels)

### Filtre transversal a appliquer
**Filtre grain papier (`feTurbulence` douce) sur la composition entiere** pour unifier toutes les sources visuelles (Seedance + d3-geo + PixelLab + SVG pur). Recommande par Gemini.

### Anti-pieges techniques (verifier AVANT code)
- Charger fonts via `@remotion/google-fonts`
- Simplifier GeoJSON via topojson si trop de points
- Mini-render 5s apres chaque idee importante
- Tester export MP4 final tot

### Priorite MOYENNE (vague 3 si temps)
- Voronoi-Conquete (alternative carte S3)
- Timeline Tracker vertical (Gemini Q4 — a tester)
- Compteur dynamique S3
- Citations academiques entre transitions
- Filtre blur progressif S4
- Fil d'Ariane narratif bas ecran

---

## 📊 Cout total des 2 pass jury

- Pass 1 : $0.029
- Pass 2 : $0.0233
- **Total : $0.052** pour 2 visions creatives complete + plan d'implementation par outil

ROI exceptionnel : on a un plan d'execution detaille avec recettes techniques, pieges anticipes, et signatures visuelles converge.
