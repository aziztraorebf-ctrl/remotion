# Kimi K2.5 — Jury S4 Nandi

> Modèle : moonshotai/kimi-k2 (via OpenRouter)
> Date : 2026-05-02
> Tokens : 2522 prompt + 2185 completion = 4707 total
> Coût estimé : ~$0.0065

## Q1 — Les 4 registres

### Registre 1 — Nandi était là
- **Animation carte** : Zoom lent (scale 1→1.15) depuis uMgungundlovu avec un léger parallax (translateX -12px). Fond passe de `#1A1208` à un sombre chauffé `#2A1810`. Les frontières des pays voisins s'estompent (stroke-opacity 0.6→0.2) pour isoler le territoire zoulou. Subtil breathing sur le fill du ZAF : `#C8A84B` pulse très doux (spring config `{damping: 200, stiffness: 50, mass: 2}`).

- **Personnage Nandi** : Spawn au frame 60 (local) en `east` sur le point `uMgungundlovu`. `breathing-idle` loop. Au frame 200 elle commence à marcher vers le centre de l'écran (translate 3%→7% de la largeur). Sprite scale 1.0→1.05 subtile sur les mots "elle était là".

- **Texte** : "Nandi" apparaît d'abord seul en Cormorant 48px au-dessus du sprite. Les mots suivants déroulent comme une dédicace : "Sa mère. La seule qui l'avait défendu." apparaissent lettre par lettre (spring `{damping: 20, stiffness: 300}`) avec un léger decalage Y (0→-2px) pour donner une sensation de soulagement.

### Registre 2 — Nandi meurt (charnière)
- **Animation carte** : Au frame 398 le breathing du ZAF s'arrête net. 6 frames plus tard le `MourningWarp` démarre (spring `{damping: 18, stiffness: 100}`) et le fill bascule `#C8A84B`→`#8B1A1A` en 60 frames via HSL interpolation. Les cercles concentriques partent de uMgungundlovu avec un delay stagger 30ms entre chaque anneau.

- **Personnage Nandi** : Au frame 398 précis : cut instantané vers `falling-back-death`. Le sprite tourne 15° anti-horaire pendant sa chute (rotate -15°). Son alpha passe 1→0.85 en 12 frames puis 0.85→0 en 36 frames. Le sprite reste 6 frames figé (freeze-frame) avant de disparaître.

- **Texte** : "Octobre 1827. Nandi meurt." apparaît en blanc `#F5E6C8` avec un tremblement horizontal (translateX ±1px, fréquence 8Hz, 12 frames). Le point final tombe verticalement 4px avec un petit rebond (spring `{damping: 8, stiffness: 400}`).

### Registre 3 — 4000 périssent
- **Animation carte** : Le warp continue mais sa vitesse diminue (spring plus lente). Les pays voisins deviennent bordeaux aussi (highlightFills spread) pour montrer la contagion du deuil. InsertNombre4000 apparaît frame 777 : le chiffre scale 0.3→1.0 avec un léger overshoot `{damping: 12, stiffness: 200}`. Le fond de la carte passe brièvement en négatif (feColorMatrix invert) pendant 6 frames quand la narration dit "quatre mille".

- **Personnage Nandi (post-mortem)** : Absente. On garde une ombre subtile (feDropShadow 1px/1px/1px/0.15) à l'endroit où elle est tombée jusqu'à la fin du registre, puis elle s'efface.

- **Texte** : Les décrets ("Toute naissance...") apparaissent en typographie plus froide : Source Sans Pro 28px, tracking +40, bordeaux clair `#AA4A4A`. Chaque ligne slide depuis les bords (translateX ±100px→0) avec un ease-out exponentiel. Le mot "proscrite" reste 12 frames plus long que le reste pour accentuer la gravité.

### Registre 4 — ils l'assassinent
- **Animation carte** : Le warp s'arrête net (spring `{damping: 200, stiffness: 600}`). Le territoire zoulou redevient or très pâle `#C8A84B` à 15 % opacity pour suggérer la survie du royaume sans son roi. Les frontières clignotent 3 fois (stroke-opacity 0→1→0.3 en 6 frames chaque) puis restent à 0.3. Subtil zoom-out 1.15→1.0 pour "respirer" la fin.

- **Personnage absent (Nandi morte, Shaka seul)** : On projette brièvement (6 frames) le sprite de Nandi en `north` à 5 % opacity au-dessus du palais comme fantôme, puis dissolve. Cela crée un "revenir de la mémoire" juste avant l'assassinat.

- **Texte** : Les phrases défilent en scintillement (opacity 0.9→1→0.9 à 12Hz). Le mot "assassinent" reste 18 frames seul sur écran avant d'être remplacé par le cartouche date.

## Q2 — Nandi meurt (2.8s)

**Technique "cardio-stop"** :
1. Frame 398 : audio "meurt" tombe → on coupe 1 frame de carte du global (tout devient noir `#000`) puis 1 frame plus tard on revient. Cela crée un flash subliminal sans être explicite.
2. Simultanément on trigger `MourningWarp` avec un spring très nerveux `{damping: 10, stiffness: 400}` pour un "spasm".
3. Le sprite `falling-back-death` est composé en deux layers : un layer normal + un layer avec `feColorMatrix` type saturate(0) pour un noir&blanc instantané qui dure 12 frames avant de fondre vers bordeaux.
4. On ajoute une très légère rotation de la carte (0°→-1°→0°) en 18 frames pour donner une sensation de sol qui manque.

## Q3 — DramaLine "Pour n'avoir pas pleuré assez fort."

- **Position** : centre-vertical, 18 % depuis le bas (donc pas full-bottom)
- **Typo** : Cormorant Garamond Bold 52px, line-height 110 %, bordeaux `#8B1A1A`, fond parchemin 10 % opacity rectangle derrière pour isoler
- **Animation** :
  - Échelle Y 0→1 en 8 frames (spring `{damping: 14, stiffness: 500}`) comme un drapeau qui se déploie
  - Lettrine "P" 1.4em, décalée -2px vers le haut
  - Pendant 12 frames on applique un `feTurbulence` mask sur le texte (baseFrequency 0.02→0) pour un fragile tremblement qui s'apaise
  - Le texte reste 36 frames, puis opacity 1→0 en 12 frames avec un léger slide 0→+8px (chute symbolique)

## Q4 — Cartouche "22 SEPTEMBRE 1828"

- **Style** : même graisse que les cartouches sources (Source Sans Pro Caps 24px, tracking 100), mais filet supérieur & inférieur 1px or `#C8A84B` de 120px de long qui "draw" en 24 frames (strokeDasharray animé)
- **Position** : centre, 8 % au-dessus du bas
- **Animation** :
  - Opacity 0→1 en 18 frames avec spring très doux
  - Les filets se draw depuis le centre vers l'extérieur (scaleX 0→1)
  - Quand le filet supérieur termine, le texte apparait lettre-par-lettre (12 frames)
  - Le fond de la carte fait un dernier "souffle" : brightness 100%→85%→100% en 12 frames pour donner un "éteindre" subtil
  - Le cartouche reste visible jusqu'à la fin de la vidéo (fade-out global 12 frames)

---

## VERDICT

**3 idées priorité haute :**
1. Flash 1-frame noir au moment "Nandi meurt" + sprite falling-back-death en B&W instantané → le seul moyen rapide et non-littéral de marquer la rupture
2. DramaLine avec déploiement vertical (scaleY) + légère turbulence → donne la fragilité nécessaire sans pathos
3. Filets or qui se "draw" pour le cartouche final → relie élégamment aux sources archives tout en apportant cérémonie

**À ÉVITER absolument :**
- Toute particule ou goutte sang-like (même abstrait) : tomberait dans le cheap et ferait fuir l'algo YouTube
- Faire réapparaître Nandi en tant que "ghost" plus de 6-8 frames : risque de kitsch visuel et de surcharge émotionnelle
