# Brief Jury AI — S4 Nandi (Scène dédiée)

> Envoyé en parallèle à GPT-4o (OpenAI), Grok (xAI), Gemini Flash (Google), Kimi K2.5 (Moonshot).
> Objectif : recueillir des visions créatives sur les 45s de la scène S4 AVANT de coder.
> Cette scène est l'arc émotionnel de toute la vidéo.

---

## 1. CONTEXTE RAPIDE

**Format** : Atlas YouTube Short vertical 9:16, 150s total, 30fps
**Stack maîtrisé** : Remotion + React/TS + SVG natif + d3-geo + PixelLab MCP (sprites pixel art) + spring/interpolate

**Ce qui est VERROUILLÉ (ne pas remettre en question) :**
- Audio narration ElevenLabs, 150.32s, forcée alignée — on ne coupe pas, on ne redit pas
- Palette : or `#C8A84B` / bordeaux `#8B1A1A` / parchemin `#F5E6C8` / fond sombre `#1A1208`
- Format 150s (YouTube Shorts = max 3min depuis oct 2024)
- La carte d3-geo est la toile principale (pas de clip vidéo AI pour S4)

**Ce qui est OUVERT (vos propositions bienvenues) :**
- Séquencement visuel des 5 actes
- Utilisation du personnage Nandi (PixelLab sprite)
- Traitements SVG et filtres
- Textes/overlays qui accompagnent la narration

---

## 2. SCRIPT S4 EXACT avec timestamps

**S4 dure 45.4s — frames locales 0 → 1361 (global 2827 → 4189)**

```
[S4 début — local 0 → 398, 13.3s]
"Mais rien de tout cela ne peut se comprendre sans Nandi.
Sa mère. La seule qui l'avait défendu.
Quand tous le rejetaient, Nandi était là."
→ timestamp 94.24s à 107.48s

[NANDI MEURT — local 398, timestamp 107.48s]
"Octobre mil huit cent vingt-sept. Nandi meurt."
→ timestamp 107.48s à 110.24s (2.8s)

[Deuil national — local 398 → 468, ~2.3s]
"Shaka décrète un deuil national."
→ timestamp 109.36s à 111.0s

[Décrets en cascade — local 468 → 777, ~10.3s]
"Toute naissance est proscrite pendant un an.
Tout champ reste sans culture."
→ timestamp 111.0s à 120.12s

[INSERT 4000 — local 777 → 927, 5s]
"Selon les chroniques, James Stuart Archive,
quatre mille Zulus périssent."
→ timestamp 120.12s à 125.1s

[DramaLine — local 853, timestamp 122.68s]
"Pour n'avoir pas pleuré assez fort."
→ C'est la phrase la plus forte de la vidéo

[Spirale finale — local 854 → 1149, ~10s]
"Ses demi-frères Dingane et Mhlangana comprennent.
L'homme qui a tout bâti est en train de tout détruire."
→ timestamp 122.68s à 132.54s

[Assassinat — local 1149 → 1361, ~7.1s]
"Le vingt-deux septembre mil huit cent vingt-huit, ils l'assassinent."
→ timestamp 132.54s à 139.64s
```

---

## 3. ASSETS DISPONIBLES pour S4

### Personnage Nandi (PixelLab MCP — ID: 12715dae)
- **Taille canvas** : 92×92px, personnage ~55px de haut
- **Description** : femme zouloue mature, peau brun-chocolat chaud, cheveux tressés avec mèches grises, tenue traditionnelle (umbhaco brun, isidwaba cuir, collier perlé), posture calme et protectrice
- **Rotations disponibles** : south / east / north / west
- **Animations disponibles** :
  - `breathing-idle` : 4 frames × 4 directions (respiration lente) ✅ PRÊT
  - `falling-back-death` : en cours de génération PixelLab ⏳ (~2 min)
- **Note** : Nandi south face caméra, east face droite

### Composant MourningWarp (déjà codé)
- Filtre SVG feTurbulence animé via spring Remotion
- baseFrequency 0.008 → 0.028 (déformation progressive de la carte)
- feDisplacementMap scale 0 → 18px
- Cercles concentriques bordeaux depuis `uMgungundlovu` (palais de Shaka)
- Anneaux secondaires or × 0.88 radius
- Halo central pulsant

### InsertNombre4000 (déjà codé)
- "4 000" géant en bordeaux
- Apparaît à local frame 777 (timestamp 120.12s)
- Durée 150 frames (5s)
- Cartouche source "JAMES STUART ARCHIVE · 1913" en bas

### Carte mourning (shaka-zulu-data.json)
- Version de la carte avec pays ZAF + voisins
- `places.uMgungundlovu` : coordonnées SVG du palais
- Pays ZAF peut changer de couleur dynamiquement via `highlightFills`

---

## 4. DÉFI CENTRAL de cette scène

**Le problème :**
S4 passe en 3 secondes d'un contexte "géopolitique/militaire" (S3 finit avec des guerriers qui marchent sur la carte) à une "tragédie intime" (la mort d'une mère), puis explose vers une "tragédie collective" (4000 morts sur décret), puis termine sur un "effondrement politique" (fratricide).

Ce sont 4 registres émotionnels distincts en 45 secondes.

**Le risque actuel (notre plan initial) :**
Juste changer la couleur de la carte (or→bordeaux) + afficher le compteur 4000. C'est trop mécanique pour un arc aussi chargé.

**Ce qu'on cherche :**
Une grammaire visuelle qui ACCOMPAGNE chaque registre sans les illustrer littéralement — pas de sang qui coule, pas d'animation de mort spectaculaire, pas de pathos cheap.

---

## 5. NOS 4 QUESTIONS — réponse précise sur CHACUNE

### Q1 — Les 4 registres émotionnels

Comment traduire visuellement ces 4 moments distincts dans nos contraintes SVG/Remotion ?

```
Registre 1 : "Nandi était là" (0→398) — intime, chaleur, protection
Registre 2 : "Nandi meurt" (398→468) — rupture, choc, instant
Registre 3 : "4000 périssent" (468→777) — absurdité du pouvoir, collectif
Registre 4 : "ils l'assassinent" (1149→1361) — conséquence, fatalité
```

Pour chacun :
- Quelle **animation de carte** ou **overlay SVG** ?
- Quel rôle pour le personnage **Nandi** (avant sa mort) ?
- Quel traitement **typographique** (texte qui arrive différemment) ?

### Q2 — Le moment "Nandi meurt" (2.8 secondes)

C'est la charnière de toute la scène. Actuellement on a :
- Bascule couleur or→bordeaux progressive (60 frames)
- MourningWarp qui s'active

**Comment rendre ce basculement inoubliable en ≤3s ?**
Propose une technique concrète dans notre stack (SVG filter, spring config, Nandi falling-back-death animation, flash frame, etc.).

Contrainte : pas de sang visible, pas d'illustration de mort explicite. L'abstraction est préférable.

### Q3 — "Pour n'avoir pas pleuré assez fort." (DramaLine à local 853)

C'est la phrase la plus puissante de toute la vidéo (timestamp 122.68s).
Actuellement : apparaît en bas de l'écran en Cormorant Garamond bordeaux, spring fade-in.

**Comment faire de cette phrase un moment visuellement singulier ?**
Elle doit arrêter le spectateur. Pas la même entrée que les autres textes.

Technique précise dans Remotion (spring config, transform, filtre SVG, couleur, position, taille).

### Q4 — Cartouche "22 SEPTEMBRE 1828" (assassinat, local 1149)

On doit terminer la scène avec la date de l'assassinat de Shaka.
Actuellement : rien de codé pour ce moment.

**Propose le design de ce cartouche final.**
- Style (en lien avec les cartouches sources existants du projet)
- Animation d'entrée
- Position sur l'écran
- Lien visuel avec la carte (montrer le territoire qui "survit" après la mort)

---

## 6. FORMAT DE RÉPONSE

```
## Q1 — Les 4 registres

### Registre 1 — Nandi était là
- Animation carte : [...]
- Personnage Nandi : [...]
- Texte : [...]

### Registre 2 — Nandi meurt (charnière)
- Animation carte : [...]
- Personnage Nandi : [...]
- Texte : [...]

### Registre 3 — 4000 périssent
- Animation carte : [...]
- Personnage Nandi (post-mortem) : [...]
- Texte : [...]

### Registre 4 — ils l'assassinent
- Animation carte : [...]
- Personnage absent (Nandi morte, Shaka seul) : [...]
- Texte : [...]

## Q2 — Nandi meurt (2.8s)
[Technique concrète]

## Q3 — DramaLine "Pour n'avoir pas pleuré assez fort"
[Design précis]

## Q4 — Cartouche "22 SEPTEMBRE 1828"
[Design + animation]
```

À la fin : **VERDICT** — 3 idées priorité haute + 1 idée à ÉVITER absolument.

Réponse en français. Sois critique et concret.
