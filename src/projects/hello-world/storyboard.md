# Storyboard - Premiere Video : "Hello World"

## Informations techniques
- **Duree totale** : 10 secondes (300 frames a 30fps)
- **Resolution** : 1920x1080
- **Decor** : Exterieur simple (ciel bleu #87CEEB + herbe verte #90EE90)
- **Personnage** : "Bob" - stick figure cartoon simple, noir #2D3436

---

## Scene 1 : Idle (frames 0-60 / 0s-2s)

**Role** : Introduction du personnage. Etablir le calme avant l'action.

| Detail | Valeur |
|--------|--------|
| Position Bob | Centre-gauche de l'ecran (x: 500, y: sol) |
| Animation | Idle - respiration douce |
| Expression | Neutre |
| Decor | Ciel + herbe, soleil en haut a droite |

**Description visuelle** : Bob est la, debout sur l'herbe. Il respire doucement (leger mouvement vertical du corps, micro-balancement des bras). Rien ne se passe. C'est calme.

**Transition vers scene 2** : Aucune transition formelle. L'action change naturellement.

---

## Scene 2 : Reaction (frames 60-120 / 2s-4s)

**Role** : Creer la curiosite. Quelque chose attire l'attention de Bob.

| Detail | Valeur |
|--------|--------|
| Position Bob | Meme position (x: 500) |
| Animation | Arret de l'idle, tilt de tete a droite |
| Expression | Neutre -> Surpris (frame 75) |
| Element decor | Un petit point orange apparait a droite de l'ecran (frame 70) |

**Description visuelle** : Bob arrete de respirer normalement. Sa tete penche a droite (15 degres). Ses yeux s'agrandissent (expression surprise). Un petit objet orange (cercle) apparait au loin a droite de l'ecran, comme quelque chose qui attire son regard.

**Timing detaille** :
- Frame 60-70 : La tete commence a pencher
- Frame 70-75 : Le point orange apparait (fade in)
- Frame 75 : Expression passe a "surpris"
- Frame 75-120 : Bob reste dans cette pose, regardant a droite

---

## Scene 3 : Marche (frames 120-210 / 4s-7s)

**Role** : Le mouvement principal. Bob va vers l'objet mysterieux.

| Detail | Valeur |
|--------|--------|
| Position Bob | Se deplace de x:500 a x:1100 |
| Animation | Walking - cycle de marche complet |
| Expression | Content (il est curieux et enthousiaste) |
| Decor | Le point orange grossit au fur et a mesure qu'on s'approche |

**Description visuelle** : Bob commence a marcher vers la droite. Ses bras et jambes bougent en opposition (bras gauche avance avec jambe droite). Leger rebond vertical a chaque pas. Le point orange a droite grossit progressivement pendant qu'il s'approche.

**Timing detaille** :
- Frame 120-125 : Transition idle -> marche (premier pas)
- Frame 125-205 : Cycle de marche continu (~6 cycles de pas)
- Frame 205-210 : Deceleration, dernier pas

---

## Scene 4 : Salut (frames 210-240 / 7s-8s)

**Role** : Interaction sociale. Bob fait coucou a l'objet/au spectateur.

| Detail | Valeur |
|--------|--------|
| Position Bob | Arrete a x:1100 |
| Animation | Waving - bras droit leve, oscillation de la main |
| Expression | Content (sourire) |
| Decor | Le point orange est maintenant proche et visible |

**Description visuelle** : Bob s'arrete net. Son bras droit se leve au-dessus de sa tete (spring avec overshoot). Sa main oscille de gauche a droite (mouvement de "coucou"). Sa tete penche legerement (5 degres) avec un sourire.

**Timing detaille** :
- Frame 210-220 : Le bras monte (spring, 10 frames)
- Frame 220-240 : Oscillation de la main (2-3 cycles de wave)

---

## Scene 5 : Saut de joie (frames 240-300 / 8s-10s)

**Role** : Finale energique. Emotion pure.

| Detail | Valeur |
|--------|--------|
| Position Bob | x:1100 (meme position) |
| Animation | Jumping - accroupi, envol, atterrissage |
| Expression | Excite (grand sourire + joues roses) |
| Decor | Statique |

**Description visuelle** : Bob se prepare a sauter (micro-accroupissement). Puis il s'envole - les deux bras montent, les jambes se plient. Au sommet du saut, expression "excite" avec joues roses. Atterrissage avec squash (aplatissement) puis retour a la normale.

**Timing detaille** :
- Frame 240-248 : Preparation (accroupissement, 8 frames)
- Frame 248-265 : Envol vers le haut (spring rapide)
- Frame 265-275 : Sommet du saut (expression excite)
- Frame 275-290 : Descente
- Frame 290-295 : Atterrissage avec squash
- Frame 295-300 : Retour position normale, sourire

---

## Resume Timeline

```
|-- Scene 1: Idle --|-- Scene 2: Reaction --|-- Scene 3: Marche ---------|-- S4: Wave --|-- Scene 5: Saut --------|
0s                  2s                      4s                           7s             8s                       10s
Frame 0             Frame 60                Frame 120                   Frame 210      Frame 240                Frame 300
```

---

## Notes de mise en scene

- **Le point orange** est un MacGuffin (objet sans importance narrative). Il sert juste a donner une raison a Bob de bouger. On pourra le remplacer par n'importe quoi dans les futures versions.
- **Les transitions** sont naturelles, pas de cuts ou de fades entre scenes. Le personnage enchaine fluidement.
- **Le rythme** : calme -> curiosite -> mouvement -> social -> joie. C'est une mini-histoire emotionnelle complete.
