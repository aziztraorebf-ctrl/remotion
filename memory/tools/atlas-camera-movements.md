# Atlas — Bibliothèque mouvements caméra Remotion

> Catalogue centralisé des mouvements caméra éprouvés et suggérés pour épisodes Atlas.
> Créé 2026-05-03 fin session Beat 3 Empire Ghana sur demande Aziz.
> **Philosophie Remotion** : zéro coût par tentative (vs Seedance). On DOIT oser les mouvements risqués — un render perdu coûte 0$ contre un échec créatif coûteux narrativement.

## Pourquoi cette bibliothèque

Constat session Beat 1-3 Empire Ghana : on a passé 70s sur la même région (Sahel/Wagadou) sans bouger activement la caméra → risque de statique. À chaque épisode Atlas où l'histoire reste ancrée géographiquement, **anticiper les mouvements caméra dès le storyboard**, pas en réaction.

Règle directrice : **tous les 5-8s, la caméra doit BOUGER de manière narrative.** Sinon le spectateur décroche.

## Mouvements VALIDÉS (utilisés et fonctionnels)

### 1. Camera-track sprite (S3 Mansa Moussa, Beat 3 Ghana)
La caméra suit en temps réel un sprite qui se déplace. Zoom 2.5-3.0x.
- **Quand** : un personnage/objet se déplace sur la carte
- **Effet** : intimité, attention focalisée
- **Référence** : `feedback_atlas-camera-track-css-sprites.md`

### 2. Ken Burns subtil (tous beats Atlas)
Drift sin/cos sur translate de 4-8px d'amplitude.
- **Quand** : caméra "fixe" — toujours actif en arrière-plan
- **Effet** : évite le statique pur
- **Code** : `driftX = sin(frame * 0.014) * 4; driftY = cos(frame * 0.011) * 3;`

### 3. Pull-back / Dolly-out dramatique (Beat 3 Ghana v4)
Zoom passe de 2.4x → 1.0x sur 60-90 frames pendant un moment narratif fort.
- **Quand** : moment de révélation ("tout cet empire reposait sur ce silence")
- **Effet** : "wow factor", contexte global
- **Doit être justifié** : cartouche + illumination empire + routes qui s'allument sinon spectateur perdu
- **Amplitude** : minimum 2x différentiel pour que ce soit visible

### 4. Push-in / Zoom-in continu (Beat 1 Ghana)
Zoom 1.0 → 2.5+ progressive sur 3-5s.
- **Quand** : focalisation sur un POI ("Wagadou avait un secret")
- **Effet** : tension croissante
- **Variante validée** : zoom non-linéaire (slow start, fast middle, slow end) via `interpolate` avec keyframes intermédiaires

### 5. Spotlight insert (3e mode visuel signature Atlas)
Background dim + cartouche centré ornementé + asset PixelLab.
- **Quand** : insert chiffre/concept sur la carte sans la quitter
- **Effet** : pause narrative + lecture facile
- **Référence** : `feedback_atlas-spotlight-insert-pattern.md`

### 6. Tilt + skewX (axonométrique Atlas)
Effet "Mande style", carte vue d'angle.
- **Quand** : tous beats sauf zooms forts (>2.5x → annuler le tilt)
- **Effet** : signature visuelle Atlas
- **Code** : `skewX = tilt * 0.15; scaleY = 1 - tilt * 0.008;`

### 7. Pulse / Pump (Beat 1 Ghana — Koumbi POI)
Scale qui respire continuellement (1.0 ⇌ 1.04, sin frame * 0.08).
- **Quand** : POI vivant, élément central
- **Effet** : "ça vit"
- **Limite** : max 3-5 instances simultanées sinon visuel cacophonique

## Mouvements À ESSAYER (suggérés, jamais utilisés en Atlas)

### 8. Whip-pan entre POI
Pan ultra-rapide (6-10 frames) entre 2 POI éloignés avec motion blur via opacity flash blanc.
- **Quand** : transition entre 2 lieux narratifs distants ("De Taghaza... à Bambouk")
- **Effet** : énergie, voyage condensé
- **Code suggéré** :
  ```tsx
  // Frames 0-5 : translate vers cible
  // Frame 3-4 : flash blanc opacity 0.6 brief
  // Frame 5+ : nouveau cadrage stable
  ```

### 9. Match-cut zoom (transition invisible entre beats)
Beat N finit zoomé sur objet X → Beat N+1 commence zoomé sur même objet X dans nouveau contexte.
- **Quand** : continuité narrative entre deux beats
- **Effet** : transition magique
- **Exemple Atlas** : sac d'or zoom max fin Beat 3 → sac d'or zoom max début Beat 4 (ailleurs sur la carte)

### 10. Caméra orbitale (rotation autour d'un POI)
Rotation 5-15° autour d'un point fixe pendant 2-3s.
- **Quand** : moment contemplatif sur un lieu central
- **Effet** : "drone qui regarde"
- **Code** : `transform={\`rotate(${rotAngle} ${POI_X} ${POI_Y})\`}`
- **Risque** : disorientation si trop fort — rester sous 15°

### 11. Dutch tilt (rotation 3-8° sur tension)
La caméra penche brièvement, revient au neutre.
- **Quand** : moment d'angoisse, instabilité ("effondrement", "invasion")
- **Effet** : tension subliminale
- **Code** : `transform={\`rotate(${dutchAngle})\`}` avec dutchAngle qui passe de 0 → 5 → 0

### 12. Freeze-frame avec zoom sur détail
Toute la carte se fige + zoom violent sur un détail (1.0 → 4.0 en 8 frames).
- **Quand** : moment-pivot ("1076" — date Almoravides)
- **Effet** : impact maximum, mémorable
- **Doit être suivi de** : retour au mouvement normal sinon "écran bloqué"

### 13. Speed ramping (ralenti / accélération)
Mouvement caméra qui ralentit progressivement puis accélère.
- **Quand** : impact narratif (chute Wagadou) ou montée tension
- **Effet** : émotion non-verbale
- **Code** : interpolation non-linéaire via Bezier ou keyframes serrées

### 14. Flash-cut (1-2 frames noir/blanc entre beats)
Transition brutale via 1-2 frames pleine couleur + cut.
- **Quand** : changement temporel ("5 siècles plus tard...")
- **Effet** : ellipse temporelle marquée
- **Code** : `<rect fill="white" opacity={frame === FLASH_FRAME ? 1 : 0}/>`

### 15. Fade-to-color narratif
Fade vers couleur sémantique (rouge sang = guerre, gris = effondrement, or = richesse).
- **Quand** : changement d'état émotionnel d'un beat
- **Effet** : codage couleur subliminal
- **Limite** : max 1 par épisode sinon perd son impact

### 16. Pan vertical (haut → bas, désert → savane)
Translate vertical lent qui révèle un territoire dans une direction logique.
- **Quand** : exploration géographique narrative ("du Sahara... aux savanes")
- **Effet** : sentiment d'échelle continentale
- **Variante** : combiner avec changement de couleur (sable → vert)

## Anti-patterns détectés

### ❌ "Caméra fixe avec ken burns subtil = mouvement"
Le ken burns SEUL ne suffit pas pour 60s+ d'écran. Il faut au moins 1 mouvement caméra majeur toutes les 8-10s.

### ❌ "Mouvement caméra sans justification narrative"
Un dolly-out qui n'est pas accompagné d'un changement visuel (cartouche, illumination, désaturation) = spectateur confus. Le mouvement doit DIRE quelque chose.

### ❌ "Zoom 2.0x considéré comme gros plan"
Sur SVG 720×1280 affiché 1080×1920, zoom 2.0x = cadrage moyen. **Vrai gros plan = 2.5-3.0x minimum.**

### ❌ "Combiner 4+ mouvements simultanés"
Tilt + ken burns + zoom + pan + rotation = chaos visuel. Max 2-3 mouvements actifs en même temps.

## Règle "Remotion permet d'oser"

**Différence Seedance vs Remotion** :
- Seedance : chaque tentative de mouvement caméra = $0.50-$2.00, échec = argent perdu
- Remotion : chaque tentative = quelques minutes de render, échec = 0$ perdu

**Implication** : sur Atlas, on DOIT essayer des mouvements risqués régulièrement. Le coût d'un échec = négligeable. Le coût de la monotonie = abandon spectateur.

**Pratique** : à chaque scène, proposer 1-2 mouvements "safe" + 1 mouvement "à essayer". Si le risqué ne marche pas, fallback safe.

## Polish final = ajouter inserts plein écran (validé Aziz 2026-05-03)

Une scène carte validée n'est PAS finale. Pendant le polish final (après tous beats codés), on peut :
- Insérer 1-2 plein écran par scène pour casser monotonie
- Couper la carte pendant 2-4s pour montrer un asset Gemini/PixelLab/Recraft plein écran
- Revenir sur la carte naturellement après

**Limite** : 1-2 inserts max par scène (pas 3+, devient saccadé). Et seulement si l'insert apporte VRAIMENT quelque chose — pas pour décorer.

**Exemples qui méritent un insert plein écran** :
- Chiffre marquant (ex : "90 KG par bloc" avec homme à l'échelle)
- Date pivot (ex : "1076" qui pulse)
- Portrait personnage central (Mansa Moussa, Sundiata)
- Concept abstrait visualisable (sécheresse comme terre craquelée, peste, naissance)

**Exemples qui NE méritent PAS** :
- Mot prononcé 1-2s sans densité narrative
- Concept déjà visible sur la carte (route, frontière)
- Variation mineure (changement de saison)

## How to apply

À chaque nouveau beat Atlas :
1. **Storyboard** : noter quel mouvement caméra par segment de 8s
2. **Mix safe + risqué** : au moins 1 mouvement "à essayer" par scène
3. **Justifier narrativement** : un mouvement = un message
4. **Render et juger** : si raté, fallback safe en 5min
5. **Polish final** : ajouter 1-2 inserts plein écran si la scène carte est trop monotone

## Référence code

- Camera-track CSS : `src/projects/atlas/empire-ghana/scenes/Beat3Barter.tsx` (`computeCameraState` + `svgToCompWithCam`)
- Camera-track SVG : `src/projects/atlas/mansa-moussa/scenes/AtlasV2S3Scene.tsx` (legacy mais référence)
- Spotlight insert : `src/projects/atlas/empire-ghana/scenes/Beat1Setup.tsx`
- Pulse/breathing : `src/projects/atlas/empire-ghana/scenes/Beat1Setup.tsx` (Koumbi POI)
