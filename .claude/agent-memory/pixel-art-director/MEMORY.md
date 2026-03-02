# Pixel Art Director - Agent Memory

> Projet actif : **Peste 1347** — Style SVG Enluminure/Gravure pur (pivot 2026-02-21)
> Epoch PixelLab/Godot archivée : voir `archive/pixellab-godot-epoch.md`

## Index des fichiers thématiques
- `scene-compositions.md` : Toutes les décisions de composition par scène (archive PixelLab)
- `archive/pixellab-godot-epoch.md` : Règles PixelLab/Godot archivées
- Ce fichier : règles permanentes SVG actives

---

## Palette canonique SVG Projet (IMMUABLE — ne pas recalculer)
```
PARCHMENT = #F5E6C8   (source : ParcheminMapProto.tsx — référence absolue)
INK       = #1A1008
GOLD      = #C9A227
GOLD_DARK = #8B6914
VERMILLON = #C1392B
SKY_BLUE  = #2D3A8C
INK_LIGHT = #6B5030
```
- TopDownVillage utilise #f0e6c8 — DIVERGE de 0x05 sur R et G
- CharacterSheet utilise #f4e8c8 — DIVERGE de 0x01 sur R
- Toujours harmoniser sur #F5E6C8 AVANT assemblage multi-scènes

---

## Gravure SVG — Architecture Personnage (2026-02-21)

**Style cible** : pseudo-Doré/Dürer (YouTube), PAS Tacuinum Sanitatis (trop minimaliste)
**Référence principale** : Dürer Apocalypse 1498 + Doré anachronique = lisible/dramatique

### Architecture 7 régions pour profil 200px
1. Silhouette corps (path fermé, 1 path par membre, rotation sur pivot articulation)
2. Zone ombre (path suit contour gauche 35% du membre, fill hachures 45°)
3. Tête profil (path front→crâne→nuque→menton→nez)
4. Vêtement/tunique (path distinct, drapés 3-4 inflexions C Bézier)
5. Jambes (2 paths : cuisse+mollet+cheville, pivot hanche)
6. Bras (path avec inflexion coude, pivot épaule)
7. Détails : chaussure, main, ceinture

### Animation organique — règle absolue
- JAMAIS morphing d-attribute path : résultat imprévisible sur courbes cubiques
- Architecture correcte : `<g transform="rotate(angle, pivotX, pivotY)">` autour des articulations
- Path du membre = forme complète (cuisse+mollet = 1 path, pas 2 rects)
- Pivot jambe : hipY = feetY - LEG_H, pivot bras : shoulderY

### Niveau détail pour 200px hauteur
- strokeWidth contour : 2.5-3px (jamais <1.8px sur membre visible)
- 1 zone ombre par membre (pas cross-hatch à cette taille)
- 3 lignes de drapé max par tunique

---

## SVG Transition Rules (scènes enluminure/gravure)
- feColorMatrix saturate seul → gris terne. TOUJOURS coupler avec interpolation bg-color.
- bg interpolate ciel : #2D3A8C → #D4C4A0 (haut), #8B7020 → #F5E6C8 (bas), frames [30,90]
- Data overlay SVG = HORS du groupe feColorMatrix (sinon desature lui aussi)
- Hachures SVG voiles : opacity interpolate [80,90] 0→1 (activation gravure progressive)
- Vagues animees : translateY UNIQUEMENT (jamais morphing d-attribute)

---

## SVG Composition — Règles Hook (2026-02-22)

### HUD global sur plusieurs scènes SVG
- Pattern : AbsoluteFill React au-dessus de la TransitionSeries (zIndex top, pointerEvents:none)
- Jamais mettre le HUD dans le SVG de scène (serait affecté par feColorMatrix éventuels)

### Placement archétypes CharacterSheet.tsx
- TOTAL_H = 220px, HEAD_R = 38px, scale=1.1 -> hauteur affichée 242px
- Centres X recommandés (6 persos sur 1920px) : [200, 520, 840, 1080, 1400, 1720]
- Y pieds = 820px (zone sol perceptible sur fond parchemin)
- Entrée spring() décalée de +8f par personnage (gauche → droite)

### "50%" typo choc (Bloc D)
- Font-size : 260px Georgia bold, fill INK #1A1008, x=960 y=520
- Apparition instantanée (opacity = frame >= localStart ? 1 : 0) — PAS de fade-in
- Sous-texte 48px italic, délai +8-12f après le chiffre

### Bloc A (TopDownVillage) hors-timing
- hook_00 ABSENT de hookTiming.ts — ne pas intégrer dans TransitionSeries principale
- Architecture recommandée : Composition "HookPrelude" 150f séparée
- HUD compteur NE démarre PAS dans HookPrelude

---

## 5 Archétypes SVG Enluminure (Peste 1347)
| Perso | Rôle | Accessoire distinctif | Couleur dominante |
|-------|------|----------------------|------------------|
| Pierre | Laboureur | Faux/bêche | Brun ocre |
| Martin | Prêtre | Croix + tonsure | Noir + blanc |
| Isaac | Prêteur | Bourse + document | Bleu royal |
| Guillaume | Seigneur | Épée + manteau | Or + vermillon |
| Agnès | Guérisseuse | Bouquet/pot herbier | Vert olive |

---

## Recurring Issues (SVG epoch)
| Issue | Count | Status |
|-------|-------|--------|
| Path morphing d-attribute en Remotion | 0 | INTERDIT |
| feColorMatrix sans bg-color transition | 1 | REGLE : toujours coupler les deux |
| Palette PARCHMENT tripartite (3 valeurs) | 1 | Harmoniser sur #F5E6C8 avant assemblage |
| Sprites on painted background | 10+ | ARCHIVÉ — epoch PixelLab révolue |
| Silhouettes noires sur fond tres sombre | 1 | REGLE : fond min L*=12 dans zone persos + halo SVG filter S2 |

---

## Silhouette Style — Theatre d'Ombres (2026-02-24)

**Projet** : "Le Lion et la Riviere qui Parle" — prototype hors Peste 1347

### Regles de contraste silhouette
- Fond sombre (L* < 12) + silhouette noire = invisible sur YouTube compresse. TOUJOURS verifier.
- Solution A (preferable) : relever le fond minimum a #1E3A5F (L* ~15) dans la zone personnages
- Solution B (exception) : halo SVG filter (feGaussianBlur + feFlood bleu) — ne casse pas le style

### Proportions personnages (canvas 1920x1080, ground line Y=800)
- Lion marche : 420px hauteur, 600px largeur
- Lion assis/incline : 340x380px
- Riviere-entite : 500px vertical, 180px large
- Enfant : 240px hauteur (ratio min 1.75x vs lion pour lisibilite narrative)
- Baobab loin (couche 1) : 180px max
- Baobab pres (couche 2) : 320px max

### Walk cycle lion SVG
- 8 frames @ 12fps = 20 frames Remotion @ 30fps par cycle
- `const walkCycle = Math.sin((frame / 20) * Math.PI * 2);`
- `const legAngle = walkCycle * 20;` (rotation +/- 20 degres)
- Architecture : <g transform="rotate(angle, pivotX, pivotY)"> autour pivot hanche

### Ondulations riviere-entite
- translateY UNIQUEMENT (jamais morphing d-attribute — confirme)
- 3 couches de vagues, phases decalees : /18, /24, /30 avec offsets 0 / 1.2 / 2.4

### S4 lumiere explosive
- radialGradient avec r anime de 0 -> 1500px en ~60 frames
- r depasse le viewport = valide, navigateur clip automatiquement, pas besoin de clipPath

### Densite narrative : 4 scenes / 60s
- S1 (13s) : risque drop attention a T+8s si zero action. Ajouter element a f120-150.
- S3 (18s) : noeud narratif, ne pas couper
- Transitions : 4-6 frames noires entre scenes (respiration theatrale, pas temps mort)
