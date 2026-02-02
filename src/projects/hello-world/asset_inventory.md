# Asset Inventory - Hello World

## Personnage : Bob (Shared - src/characters/)

### Composants SVG a creer
| Composant | Fichier | Description |
|-----------|---------|-------------|
| StickFigure | `characters/StickFigure/index.tsx` | Assemblage parent de tous les membres |
| Head | `characters/StickFigure/Head.tsx` | Cercle blanc + yeux + bouche dynamique |
| Torso | `characters/StickFigure/Torso.tsx` | Ligne epaisse verticale |
| Arm | `characters/StickFigure/Arm.tsx` | Ligne + main ronde (reutilise gauche/droite) |
| Leg | `characters/StickFigure/Leg.tsx` | Ligne + pied arrondi (reutilise gauche/droite) |
| Types | `characters/StickFigure/types.ts` | Interfaces TypeScript |
| Constants | `characters/StickFigure/constants.ts` | Dimensions et couleurs par defaut |

### Parametres visuels Bob
- Couleur corps : #2D3436 (noir charbon)
- Remplissage tete : #FAFAFA (blanc casse)
- Epaisseur traits : 5px
- Taille tete : rayon 30px
- Hauteur totale : ~200px
- Mains : cercles pleins rayon 6px
- Pieds : ovales 8x5px

### Expressions a supporter
- Neutre (yeux points, bouche ligne)
- Content (yeux points, bouche courbe up, joues #FFB6C1)
- Surpris (yeux grands cercles, bouche "O")
- Excite (yeux grands, grand sourire, joues roses)

---

## Decor : Exterieur (Shared - src/components/)

### Composants a creer
| Composant | Fichier | Description |
|-----------|---------|-------------|
| OutdoorBackground | `components/OutdoorBackground.tsx` | Ciel + herbe + ligne horizon |
| Sun | `components/Sun.tsx` | Cercle jaune avec rayons optionnels |

### Parametres visuels
- Ciel : #87CEEB (bleu ciel doux)
- Herbe : #90EE90 (vert pastel)
- Ligne horizon : #228B22 (vert fonce), epaisseur 3px
- Position horizon : y = 700 (sur 1080)
- Soleil : #FFD93D, rayon 40px, position top-right

---

## Element de scene : Point Orange (Project-specific)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| OrangeOrb | `projects/hello-world/scenes/OrangeOrb.tsx` | Cercle orange qui apparait et grossit |

### Parametres
- Couleur : #FF6B35 (orange vif)
- Taille initiale : rayon 5px (apparition)
- Taille finale : rayon 20px (quand Bob est proche)
- Position : x: 1300, y: 650 (au niveau du sol, a droite)

---

## Animations (Shared - src/animations/)

| Animation | Fichier | Scenes utilisees |
|-----------|---------|-----------------|
| idle | `animations/idle.ts` | Scene 1, transition Scene 2 |
| reaction | `animations/reaction.ts` | Scene 2 |
| walking | `animations/walking.ts` | Scene 3 |
| waving | `animations/waving.ts` | Scene 4 |
| jumping | `animations/jumping.ts` | Scene 5 |
| Types | `animations/types.ts` | Toutes |
| Easing | `animations/easing.ts` | Toutes |

---

## Scenes (Project-specific)

| Scene | Fichier | Frames |
|-------|---------|--------|
| Scene complete | `projects/hello-world/scenes/HelloWorld.tsx` | 0-300 |

---

## Resume : Total des fichiers a creer

### Partages (reutilisables pour futurs projets)
- 7 fichiers personnage (characters/StickFigure/)
- 2 fichiers decor (components/)
- 7 fichiers animation (animations/)
- **Total partage : 16 fichiers**

### Specifiques a Hello World
- 1 fichier OrangeOrb
- 1 fichier scene principale
- **Total projet : 2 fichiers**

### Grand total : 18 fichiers a creer
