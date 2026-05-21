---
name: "Atlas — Séparation TECHNIQUE (forker) vs VISUEL (adapter par épisode)"
description: "Tableau exhaustif. Pour chaque élément Atlas, dire ce qui se forke tel quel (architecture) et ce qui s'adapte par épisode (identité visuelle). Évite contenu répétitif tout en gardant la solidité."
type: feedback
---

# Atlas — TECHNIQUE vs VISUEL

> Issue de la décision Aziz 2026-05-03 : on veut un **template technique réutilisable** (Mansa Moussa V2 = base) mais une **identité visuelle propre par épisode** (Empire du Ghana ≠ Mansa Moussa visuellement, sinon contenu répétitif sur les plateformes).

## Principe

Comme un site web :
- **Framework partagé** = patterns techniques (forker tel quel)
- **Design unique** = palette, typo, décorations, iconographie (adapter par projet)

---

## Tableau de séparation

### Architecture & code

| Élément | TECHNIQUE (forker) | VISUEL (adapter Ghana) |
|---------|---------------------|------------------------|
| SVG racine 720×1280 preserveAspectRatio | ✅ identique | — |
| Composants `_shared/atlas-components.tsx` | ✅ tous (AtlasMercator, AtlasGlobe, AtlasCartouche, etc.) | — |
| Pattern `<defs>` (gradients bg/vignette/hatch) | ✅ structure identique | Couleurs hatch adaptables (voir hachures empire) |
| Imports `staticFile` audio/asset | ✅ pattern | Chemin propre au projet |
| `useSpringCamera` config (drift speeds) | ✅ valeurs Mansa Moussa par défaut | Adaptable si scène demande +/- amplitude |
| Spring configs (SNAP_CONFIG, POP_CONFIG) | ✅ valeurs identiques | — |
| Transform order caméra (translate→rotate→scale→skew→translate-back) | ✅ INTERDIT de modifier | — |

### Sous-titres karaoke

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Position (bottom 120px, flex centered) | ✅ | — |
| Pattern `visualFrameToNarrationSec` | ✅ | — |
| `buildPhrases` (split silence>0.5s, max 7 mots) | ✅ | Seuils ajustables si rythme narration différent |
| Background (gradient noir 0.35→0.55, blur 2px) | ✅ structure | Couleur fond adaptable (ex: bordeaux Ghana au lieu noir) |
| Hard shadow texte non-prononcé | ✅ formule | — |
| Color glow texte prononcé | ✅ formule | **Couleur highlight = couleur signature de l'épisode** (Mansa = `#D4A574` or, Ghana = `#D4A574` or aussi mais variation possible) |
| Font (Cormorant Garamond 38px italic 600) | ✅ identique | Possible variation pour épisodes très différents |
| Spring fade-in (damping 35, stiffness 130) | ✅ | — |

### Caméra & mouvements

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Ken Burns drift (sin*0.014, cos*0.011) | ✅ formule | Amplitudes ajustables (10-22px) |
| Parallax FG vs BG (+3px/+2px delta) | ✅ pattern | — |
| Tilt respiratoire `sin*0.04*2` | ✅ | Tilt peak ajustable (20° Mansa, 15-30° autre) |
| Snap spring (damping 80 stiffness 400) | ✅ config | — |
| Bump scale arrival (+0.06) | ✅ pattern | — |
| Push-in lent (+0.05 sur sceneDuration) | ✅ | — |
| Pan caméra waypoints | ✅ via `useSpringCamera` | Coordonnées POI propres au projet |

### Cartouches

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Structure rect arrondi + texte + sous-texte | ✅ | — |
| Spring entrance (damping 14, stiffness 200) | ✅ | — |
| Wobble micro-rotation `sin*0.08*0.5` | ✅ | — |
| Fade-out 10 frames avant disappear | ✅ | — |
| **Couleur fond** | — | **Mansa = cream `#F2E5C8`. Ghana = à choisir : sépia `#E8DCC0` ou parchemin clair, ou rester cream pour cohérence cross-épisodes** |
| **Couleur bordure (stroke)** | — | **Mansa = empireGold `#D4A574` 3px. Ghana = OR Ghana `#D4A574` (proche) OU bordeaux `#7A1F1F` pour identité différente** |
| **Police** | Structure (font-family + weight) | **Mansa = Cormorant Garamond 700. Ghana = peut garder Cormorant OU passer à Cinzel pour identité plus monumentale** |
| **Couleur texte principal** | — | **Mansa = textInk `#3A2A18`. Ghana = textInk OU bordeaux profond** |

### Hachures empire (très important pour identité)

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Pattern SVG `<pattern id="empireHatch">` | ✅ structure | — |
| `patternTransform="rotate(45)"` | ✅ angle | Possible 30° ou 60° pour variation |
| Stroke dasharray "10 5" sur outline empire | ✅ | — |
| **Couleur lignes hachures** | — | **Mansa = drapeau Mali tricolore (vert/jaune/rouge alternés). Ghana = soit "drapeau Wagadou" inventé (or/bordeaux/sable), soit hachures monochrome or pour différencier** |
| **Espacement hachures (6px)** | ✅ | Ajustable si carte plus serrée |
| Outline empire (noir mat #1A1A1A vs cream) | ✅ choix structurel | Gardé noir mat (universel haute lisibilité) |
| **Fond empire (cream 0.18 opacity)** | ✅ pattern | **Couleur adaptable : Mansa cream, Ghana = sable/parchemin warmer** |

### Inserts plein écran

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Background plein écran (#0F1530) | ✅ | **Adaptable : Mansa = bleu marine très foncé. Ghana = peut passer à NOIR_PROFOND `#1A0D0D` (sépia sombre) pour identité Wagadou** |
| AtlasSubtleStars overlay (opacity 0.45) | ✅ | — |
| Title zone (y=240) Cormorant 600-700 | ✅ structure | Couleur titre = signature épisode |
| Pie/Bar/Line chart structure | ✅ composants Mansa | Couleurs accent = palette projet |
| Cartouche bottom sources | ✅ structure | Mêmes adaptations couleur que cartouches normaux |
| Wipe transitions (gradient overlay 24px) | ✅ pattern | Couleur wipe = signature (blanc Mansa ou or Ghana) |

### Iconographie

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Pattern IconCartouche (rect + image inset) | ✅ | — |
| Mansa Moussa = PNG Gemini transparent (livre, mosquée, médaillon Gizeh) | Pattern | **Ghana = générer assets propres (lingot, sceau Wagadou, balance, sacs sel) via PixelLab map_object** |
| Spring pop entrance (damping 14, stiffness 300) | ✅ | — |
| AtlasPulseMarker (ring expand) | ✅ formule | **Couleur dot central = couleur signature (Mansa or, Ghana or ou bordeaux)** |
| AtlasLabel pill | ✅ structure | Couleur fond + texte adaptables |

### Personnages PixelLab

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Composant `AtlasPixelChar` ou équivalent | ✅ | — |
| Walk cycle 4 directions | ✅ pipeline | Sprite propre au projet |
| Hopping vertical sin(frame*0.4)*5 | ✅ formule | — |
| Décalage caravane sur `t` (-0.06, -0.10, -0.14) | ✅ pattern | — |
| **Sprites** | — | **Mansa = caravane médiévale (Mansa+chameau+porteurs). Ghana = marchands sahéliens + berbères touaregs** (déjà générés !) |

### Effets de scène

| Élément | TECHNIQUE | VISUEL |
|---------|-----------|--------|
| Vignette overlay (`url(#vignette)`) opacity respiration | ✅ pattern | — |
| Halo Mali (2 layers stroke or, opacity 0.15+0.30) | ✅ pattern | **Couleur halo = couleur empire (Mansa or, Ghana or, autre = couleur identité)** |
| Grisaillement post-effondrement (lerp couleur) | ✅ pattern | Couleurs source/cible adaptables |
| Particules tombantes (or chez Mansa) | ✅ pattern | **Type particule adaptable : Mansa = pièces or. Ghana = grains de sable ? gouttes ? selon narration** |
| Glow rouge crise (Egypte chez Mansa) | ✅ pattern | Couleur du glow = signature crise |

---

## Checklist par épisode

Pour chaque nouvelle vidéo Atlas :

### Phase visuelle (à décider AVANT coder)

```
[ ] Palette principale décidée (5-8 couleurs principales)
[ ] Couleur cartouches (fond + bordure + texte)
[ ] Couleur hachures empire (monochrome ou tricolore stylisé)
[ ] Police titres (Cinzel ou Cormorant ou autre)
[ ] Couleur signature highlight (sous-titres karaoke + pulses)
[ ] Type d'iconographie (PixelLab assets propres au sujet)
[ ] Background inserts plein écran (adapter sépia/bleu marine selon ambiance)
[ ] Couleur wipe transitions
[ ] Type de personnages PixelLab (sprites propres)
```

### Phase technique (à forker, ne RIEN modifier)

```
[ ] SVG racine 720×1280 preserveAspectRatio
[ ] Composants _shared utilisés via props
[ ] Spring configs identiques (SNAP, POP)
[ ] Drift Ken Burns formules identiques
[ ] Tilt respiratoire formule identique
[ ] Pattern transform caméra identique
[ ] Sous-titres karaoke pattern identique
[ ] Wipe transitions pattern identique
```

---

## Why ce séparation matters

**Problème** : si on forke 100% de Mansa Moussa visuellement, les vidéos paraissent toutes identiques sur les plateformes → algorithme moins favorable, spectateur sent la copie, marque "GeoAfrique" pas distinctive par épisode.

**Solution** : techniques solides forkées (zéro risque architecture), couches visuelles propres à chaque épisode (identité forte).

**Empire du Ghana** doit visuellement évoquer :
- L'or (or vif `#E8B878`, or `#D4A574`)
- Le sable du Sahara (sable `#4A2E15`, parchemin `#E8DCC0`)
- Le bordeaux des routes commerciales (`#4A0E0E`)
- La sépia (`#2D1810`) pour l'âge ancien

**Mansa Moussa** évoque :
- Le bleu nuit / pourpre (`#1A1F3A` / `#2A1F2E`)
- Le cream cartouche
- Le drapeau Mali tricolore

**Différence visuelle = différenciation perçue** sans coût architectural.

---

## How to apply

À chaque nouvelle scène, faire le check :
1. **Architecture** = forké de Mansa Moussa V2 ? OUI obligatoire.
2. **Couleurs/typo/déco** = adaptés à l'épisode ? OUI sinon répétitif.

Si une scène a son architecture qui diverge de Mansa Moussa = bug. Si une scène est visuellement identique à Mansa Moussa = manque d'identité.
