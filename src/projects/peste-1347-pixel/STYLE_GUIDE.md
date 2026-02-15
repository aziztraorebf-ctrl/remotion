# Style Guide: Terminal Tactique Medieval
## Direction Artistique Permanente - Chaine YouTube Aziz

> Ce document est le framework de direction artistique. Il s'applique a TOUTE video produite
> dans ce style. Ne pas coder sans l'avoir lu.

---

## 1. Concept Central

**"Un terminal d'analyse de donnees expert qui dissecte l'histoire."**

Le spectateur ne regarde pas une animation retro. Il regarde un SYSTEME qui analyse des
evenements historiques. Le pixel art est le recit humain. La DataViz est le cerveau froid.

Le contraste entre les deux est ce qui cree la tension visuelle.

---

## 2. La Regle d'Or du Contraste

```
DataViz Hi-Fi (SVG nets, courbes vectorielles, compteurs precis)
        vs
Pixel Art Lo-Fi (sprites 16-bit, grain, CRT)
```

Ces deux registres coexistent mais ne se melangent JAMAIS en resolution.
- Les graphiques sont NETS, vectoriels, mathematiques
- Les sprites sont GRANULEUX, pixelises, imageRendering: "pixelated"
- Le fond est SOMBRE, subtil, subordonn a l'action

---

## 3. Palette de Couleurs Signature

### Couleurs Primaires
| Role              | Nom             | Hex       | Usage                                    |
|-------------------|-----------------|-----------|------------------------------------------|
| Fond principal    | Charcoal Abyss  | `#0D0D0D` | Background de base, toujours sombre      |
| Interface/System  | Terminal Green   | `#00FF41` | Texte terminal, ticker, labels systeme   |
| Danger/Mort       | Plague Red       | `#C62828` | Courbes mortalite, feu, infection        |
| Texte narratif    | Parchment Cream  | `#F5F5DC` | Titres, corps de texte, noms de villes   |

### Couleurs Secondaires
| Role              | Nom             | Hex       | Usage                                    |
|-------------------|-----------------|-----------|------------------------------------------|
| Comparaison       | Data Blue        | `#1565C0` | Courbe COVID, donnees comparatives       |
| Accent subtil     | Amber Warning    | `#D4A017` | Accents rares, elements de focalisation  |
| Texte secondaire  | Dust Grey        | `#8B7355` | Labels d'axes, informations mineures     |
| Fond Acte 2       | Charcoal Warm    | `#1A0F0A` | Variation chaude pour scenes de recit    |
| Fond Acte 3       | Charcoal Blood   | `#1A0808` | Variation rouge pour scenes de mort      |

### Regles strictes
- Le vert terminal (#00FF41) est RESERVE a l'interface systeme (ticker, status, labels techniques)
- Le rouge (#C62828) est RESERVE aux donnees de mort/infection
- Le creme (#F5F5DC) est pour le texte narratif/humain
- JAMAIS de fond clair. Le fond est TOUJOURS sombre.
- JAMAIS de degradees. Flat colors uniquement.

---

## 4. Typographie

| Usage            | Font            | Style                    |
|------------------|-----------------|--------------------------|
| Titres/Labels    | Press Start 2P  | MAJUSCULES, letter-spacing: 2 |
| Corps/Chiffres   | VT323           | Monospace pixel, lisible |
| Terminal/System  | VT323           | Vert (#00FF41), taille 16-20px |

- Les titres sont TOUJOURS en majuscules
- Les chiffres utilisent TOUJOURS VT323 (pas Press Start 2P qui est trop large pour les nombres)
- Le terminal ticker utilise VT323 en vert sur fond noir

---

## 5. Architecture de Couches (Layer System)

Chaque frame est composee de 4 couches empilees :

```
Couche 4 (top)  : CRT Overlay (scanlines + vignette) -- PERMANENT, ne change jamais
Couche 3        : UI/Data (graphiques, compteurs, ticker) -- NET, vectoriel
Couche 2        : Sprites (personnages, rats, feu) -- PIXEL, anime
Couche 1 (base) : Fond (couleur + grain subtil) -- SOMBRE, presque statique
```

### Regles d'interaction entre couches
- La couche 3 (Data) est toujours DEVANT la couche 2 (Sprites)
- Les sprites ne chevauchent JAMAIS les graphiques
- Le CRT s'applique a TOUT (il unifie visuellement les couches)
- Le fond peut varier de teinte entre actes mais reste sombre

---

## 6. Ancres Visuelles (Elements Permanents)

Ces elements ne changent JAMAIS entre les videos. Ils sont la signature de la chaine.

1. **CRT Overlay** : Scanlines 3px, opacite 0.10, vignette sombre avec teinte rouge subtile
2. **Terminal Ticker** : Bandeau noir en bas de l'ecran, texte VT323 vert qui defile
3. **Grain de film** : SVG feTurbulence, seed qui change toutes les 3 frames
4. **Style d'animation des graphiques** : Courbes en escalier (stepped), pixel par pixel

---

## 7. Regles d'Animation

### Ce qui est AUTORISE
- Spring physics pour les labels et apparitions (mass 0.6, damping 10, stiffness 150)
- Crossfade 15 frames entre actes
- Typewriter effect sur les textes
- Draw progressif sur les courbes (pixel par pixel)
- Sprite animation (background-position sur spritesheets)
- Slow zoom tres subtil (max 5% sur 10 secondes) sur les fonds

### Ce qui est INTERDIT
- Screen shake
- Flash/strobe
- Glitch excessif
- Parallaxe complexe
- Transitions brutales (jump cuts)
- Mouvement decoratif (tout mouvement = information)

---

## 8. Integration des Sprites (Assets Pixel Art)

### Regle de base
Chaque sprite a l'ecran represente quelque chose dans les donnees.
- Rat qui traverse = route de propagation
- Feu sur une ville = infection active
- Paysan/Squelette = victime comptabilisee

### Scaling
Tous les sprites sont affiches avec `imageRendering: "pixelated"` et scales par multiples
entiers (x2, x3, x4) pour preserver la nettete des pixels. Pas de scale fractionnaire.

### Densete pixel
Si deux sprites coexistent dans la meme scene, ils doivent avoir la meme densite pixel
apparente. Un sprite 32x32 a scale x4 (128px) ne doit pas voisiner un sprite 128x128 a
scale x1 (128px) -- meme taille finale, mais pixels de tailles differentes.

---

## 9. Template de Scene

Chaque scene suit cette structure :

```
Fond sombre (couleur d'acte)
  + Grain anime
    + Contenu principal (carte / graphique / scene pixel)
      + Labels et compteurs (UI Data)
        + Terminal ticker (bas de l'ecran)
          + CRT overlay (toujours en top)
```

### Modes de scene
- **Mode Carte** : Carte Europe en couche mediane, donnees en overlay
- **Mode Graphique** : Courbe/bar chart en plein ecran, sprites en bas
- **Mode Recit** : Fond pixel art (tilemap), sprites au premier plan, data en overlay

---

## 10. Audio

### Architecture 3 pistes
1. **Voix** : Volume 1.0, priorite absolue
2. **Musique** : Volume 0.15, loop 30s, 8-bit ambient sombre
3. **SFX** : Volume 0.3-0.5, lies aux evenements visuels (feu, apparition, ticker)

### Regle de timing
L'audio drive le visuel, jamais l'inverse. Mesurer le voiceover avec ffprobe,
puis caler les animations sur les silences detectes.

---

## Changelog

| Date       | Version | Modification                              |
|------------|---------|-------------------------------------------|
| 2026-02-13 | 1.0     | Creation initiale - Terminal Tactique Medieval |
