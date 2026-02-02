# Direction Artistique - Projet Remotion

## Ton & Ambiance
- **Humour leger** : situations absurdes, reactions exagerees
- **Joyeux et colore** : ambiance positive, pas de dark mode
- **Expressif** : les emotions passent par le corps ET le visage

---

## Palette de Couleurs

### Fond / Decors
| Role | Couleur | Hex |
|------|---------|-----|
| Ciel | Bleu ciel doux | #87CEEB |
| Herbe | Vert pastel | #90EE90 |
| Sol/Terre | Beige chaud | #F5DEB3 |
| Interieur mur | Creme | #FFF8DC |
| Interieur sol | Bois clair | #DEB887 |

### Personnages
| Role | Couleur | Hex |
|------|---------|-----|
| Corps principal | Noir charbon | #2D3436 |
| Remplissage tete | Blanc casse | #FAFAFA |
| Joues (emotion) | Rose doux | #FFB6C1 |
| Accent / action | Orange vif | #FF6B35 |

### Accents & UI
| Role | Couleur | Hex |
|------|---------|-----|
| Texte principal | Noir profond | #1A1A2E |
| Texte secondaire | Gris moyen | #636E72 |
| Bulle de dialogue | Blanc | #FFFFFF |
| Contour bulle | Gris doux | #B2BEC3 |
| Accent positif | Vert | #00B894 |
| Accent negatif | Rouge doux | #E17055 |

---

## Typographie (Google Fonts)

| Usage | Font | Style |
|-------|------|-------|
| Titres / gros texte | **Fredoka One** | Rond, fun, cartoon |
| Dialogue personnages | **Comic Neue** | Lisible, style BD |
| UI / sous-titres | **Nunito** | Clean, arrondi |

---

## Style des Personnages : Cartoon Simple

### Proportions
- **Tete** : cercle rempli blanc avec contour epais noir (strokeWidth: 5)
- **Yeux** : deux points noirs, grands et expressifs (rayon ~4px)
- **Bouche** : ligne simple ou courbe selon l'emotion
- **Corps** : ligne epaisse (strokeWidth: 5)
- **Bras** : lignes avec mains rondes (petits cercles) au bout
- **Jambes** : lignes avec pieds arrondis (petits ovales)
- **Pas de doigts** : les mains sont des cercles pleins

### Expressions
| Emotion | Yeux | Bouche | Extra |
|---------|------|--------|-------|
| Neutre | Points normaux | Ligne droite | - |
| Content | Points normaux | Courbe vers le haut | Joues roses |
| Surpris | Grands cercles | Petit cercle "O" | - |
| Triste | Points baisses | Courbe vers le bas | - |
| Excite | Points grands | Grand sourire | Joues roses + sautillement |

### Taille de reference
- Hauteur totale du personnage : ~200px (sur canvas 1920x1080)
- Ratio tete/corps : tete = 30% de la hauteur totale (style cartoon = grosse tete)

---

## Style de Mouvement

### Principes
- **Squash & Stretch** : les mouvements exagerent la forme (aplatir a l'atterrissage, etirer au saut)
- **Anticipation** : toujours un micro-mouvement avant l'action principale (accroupir avant sauter)
- **Overshoot** : depasser legerement la position finale puis revenir (spring avec damping bas)
- **Follow-through** : les extremites (mains, tete) continuent de bouger apres l'arret du corps

### Courbes d'animation
- Mouvements principaux : `spring()` avec damping 10-15
- Mouvements subtils (respiration) : `interpolate()` sinusoidal
- Transitions de scene : easeInOut

---

## Decors

### Style
- Minimalistes mais colores
- Ligne d'horizon nette
- Pas de details inutiles : juste assez pour situer la scene
- Elements de decor en formes simples (rectangles arrondis, cercles)

### Exemples de scenes
- **Exterieur** : ciel bleu + herbe verte + soleil (cercle jaune)
- **Interieur** : mur creme + sol bois + fenetre simple
- **Abstrait** : fond degrade uni pour focus sur le personnage

---

## Resolution & Format

- **Canvas** : 1920x1080 (16:9)
- **FPS** : 30
- **Duree type** : 5-15 secondes par clip
- **Export** : MP4 H.264
