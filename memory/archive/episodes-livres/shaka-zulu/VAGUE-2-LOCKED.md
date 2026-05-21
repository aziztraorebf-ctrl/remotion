# VAGUE 2 — VERROUILLE (source de verite)

> Lockee 2026-05-02 apres Jury Pass 2 ($0.052 total). Branche : `feat/atlas-shaka-zulu-vague1`.
> **Ne pas remettre en question pendant le code.** Si conflit code vs ce fichier, ce fichier prime.

---

## Audio + Structure (deja verrouille)
- Narration ElevenLabs v5 forced-aligned (loss 0.244)
- 6 segments : Hook / S1 / S2 (4 actes) / S3 / S4 / CTA
- Format 150s vertical 9:16 (YouTube Shorts max 3min depuis oct 2024 — confirme)

---

## Stack par tache

### Filtre transversal sur composition entiere
- `feTurbulence` douce (grain papier) applique au niveau Composition pour unifier Seedance + d3-geo + PixelLab + SVG
- Implementation : composant wrapper `<PaperGrain>` autour de tout

### Hook (idee 1)
- Image source : Gemini paper-craft, "Shaka adulte de dos contemplant le KwaZulu-Natal"
- Clip 5s : Seedance image-to-video
- Typo overlay : Cormorant Garamond "Il est ne paria" via `stroke-dasharray` (effet gravure)
- Transition vers S1 : "Depliage de Parchemin" (rotation 3D `rotateX` du clip + frontieres d3-geo qui se dessinent autour)

### Cartouches sources (idee 2)
- Composant React `<SourceCartouche author="J. LABAND" title="The Rise and Fall of the Zulu Kingdom" />`
- SVG pur : rectangle bordures doubles + leader line vers objet
- Typo : Cormorant Garamond
- A appliquer sur : iklwa + bouclier (les 2 inserts manquants vague 1B)

### Carte d3-geo (idee 3)
- Reutilisation moteur Mansa Moussa V2
- Projection : `geoAzimuthalEqualArea` centree KwaZulu-Natal
- Source : Natural Earth GeoJSON (50m), simplifier via topojson si perf
- Palette Shaka : parchemin (#F5E6C8) / bordeaux (#8B1A1A) / or (#D4A857)
- Filtre parchemin `feTurbulence` integre
- Utilisations : S1 (territoire), S3 (expansion), S4 (deformation)

### Cornes de buffle (idee 4)
- Composant `<CornesFrame />` reutilisable
- 2 path Bezier SVG pur (NO Recraft, NO Gemini)
- Animation tactique : `stroke-width` + courbure animees via spring (encerclement, pas illustration)
- Apparait aux transitions de segments S1→S2, S2→S3, S3→S4

### Caravane impi (idee 5)
- PixelLab : 4 sprites guerriers zoulous (walk cycle 4 frames) + 1 Shaka idle
- Generation a lancer EN PARALLELE du code (~5 min/sprite, 8h expiration)
- Positionnement sur d3-geo via `interpolate` mapping coordonnees GeoJSON → X/Y
- Animation S3 : caravane parcourt le territoire qui s'etend
- Equivalent Mansa Moussa qui sort du Mali

### Deformation S4 (idee 6)
- Filtre `<filter id="mourning-warp">` avec `feTurbulence` lie a un spring Remotion
- Cercles concentriques SVG pur (Echo Maternel) depuis le palais via spring/interpolate
- AUCUN Gemini ici (amendement Grok)
- Applique sur carte d3-geo KwaZulu

### Blueprint inserts (idee 7)
- Grille de fond SVG pur (1px opacite 0.1)
- Layout React Flexbox
- Typo : Inter ou JetBrains Mono pour donnees, Cormorant Garamond pour sources
- Polish des 5 inserts vague 1B existants (iklwa, bouclier, cornes, 4000, 1500)

### Animation typo 4 actes S2 (idee 8 — ajout pass 2 Grok)
- SVG pur, reveals sequentiels via spring/interpolate
- Synchronise sur narration ElevenLabs (timestamps S2)
- Structure visuellement les 4 actes (iklwa / bouclier / cornes / Gqokli Hill)

---

## Pieges techniques anticipes

1. **Perf d3-geo + filtres** : simplifier GeoJSON via topojson, appliquer filtres uniquement sur `<g>` specifiques
2. **Fonts** : `@remotion/google-fonts` pour Cormorant Garamond / Inter / JetBrains Mono
3. **Mini-render apres chaque idee importante** (Cf. regle re-render scenes assemblees)
4. **PixelLab** : lancer generation EN PARALLELE du code, 8h expiration max

---

## Assets PixelLab existants (verifies 2026-05-02 — AUCUNE generation necessaire)

- **Shaka** : rotations 4 directions + animations (walk-east, warcry, royal) dans `public/atlas-shaka-zulu/characters/shaka/` et `archive/`
- **Warrior zoulou** : rotations + animations (walk-east, warcry, attack) dans `archive/warrior-walk-east/` etc.
- **Nandi** : rotations 4 directions dans `public/atlas-shaka-zulu/characters/nandi/` (animations a generer si besoin S4)
- **Inserts** : `iklwa-side.png` et `bouclier-side.png` dans `public/atlas-shaka-zulu/inserts/pixellab/`
- **Statics** : `shaka-static.png` + `zulu-warrior-static.png` dans `assets/`

→ Caravane impi S3 = reutiliser warrior-walk-east + shaka-walk-east (deja dispo). Hook = reutiliser shaka-static.

## Ordre d'execution

1. Cartouches sources iklwa + bouclier (5 min)
2. Composant Cornes de buffle 2 arcs Bezier (15 min)
3. Composant `<PaperGrain>` filtre transversal (10 min)
4. Hook (Gemini image + Seedance clip + typo Cormorant + transition Depliage)
5. Carte d3-geo Shaka (adaptation moteur Mansa Moussa, projection geoAzimuthalEqualArea, palette parchemin/bordeaux/or)
6. Caravane impi sur S3 (assemblage sprites existants + d3-geo)
7. Deformation S4 (filtres SVG + ondes concentriques)
8. Animation typo 4 actes S2 (nouveaute Grok pass 2)
9. Polish Blueprint sur les 5 inserts vague 1B existants
10. Mini-render complet pour validation Aziz

---

## Vague 3 (apres validation vague 2)

- Voronoi-Conquete (alternative carte S3)
- Timeline Tracker vertical (test 1 segment)
- Compteur dynamique S3
- Citations academiques transitions
- Filtre blur progressif S4
- Fil d'Ariane narratif

A reconsiderer apres mini-render vague 2 complet.
