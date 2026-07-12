---
name: War-Map — Animer un objet sur la carte (arbre de décision SVG / Gemini / PixelLab)
description: Quel outil pour animer quel TYPE d'objet sur la carte. Ordre de réflexe : SVG animé maison (le moins cher, le plus net) -> Gemini (objets à trait/identité) -> PixelLab (effets organiques chaotiques denses). Inclut les 3 règles structurelles R-OBJ + ponctuel vs ambiant + le pont Gemini->PixelLab. Fusion validée Aziz (2026-06-11 partage Gemini/PixelLab + 2026-06-14 3e voie SVG).
type: project
---

# War-Map — ANIMER UN OBJET SUR LA CARTE (arbre de décision)

> Fusion de 2 doctrines (2026-06-15) : `WARMAP-OBJETS-GEMINI-VS-PIXELLAB` (partage Gemini/PixelLab, 2026-06-11)
> + `WARMAP-SVG-ANIME-3E-VOIE` (la 3e voie SVG, 2026-06-14). La question n'est PAS « quel outil est meilleur »
> mais « quel outil pour quel TYPE d'objet ». Les trois sont excellents dans leur registre.

---

## ⭐ L'ARBRE DE DÉCISION (à parcourir DANS CET ORDRE pour TOUTE passe « rendre vivant »)

Avant de générer quoi que ce soit, se poser les questions dans l'ordre :

| # | Question | Si OUI → Outil | Pourquoi |
|---|----------|----------------|----------|
| **1** | Forme simple + déformation/tracé/pulsation ? (drapeau, onde, frontière, jauge, flux, icône, cartouche) | **SVG ANIMÉ MAISON** (le réflexe par défaut) | Net full HD, nos couleurs exactes, 0 coût, 0 risque, 0 détourage |
| **2** | Objet à TRAIT FIN / identité forte ? (jeton-portrait, sprite-lieu, véhicule détaillé, marqueur premium) | **GEMINI** (`gemini-3.1-flash-image-preview`) + détourage Recraft, animé par NOUS | Le trait net que SVG/pixel dégraderaient |
| **3** | Effet organique CHAOTIQUE DENSE ? (vraie explosion, fumée volumétrique, feu) | **PixelLab** (`create_map_object` + `animate_object`), animé par PROMPT | Le pixel se fond dans le chaos ; animation organique « gratuite » |
| — | Effet DIFFUS (poussière au sol, brume éparse top-down) | **PERSONNE** — renoncer | Ni SVG ni PixelLab ne le rendent (leçon poussière 2.1 + test ambient 2026-06-14). « Sobre = mieux ». |

**Le réflexe n°1 = SVG d'abord.** Déclencheur de la règle (Aziz 2026-06-14) : le drapeau touareg de l'Azawad qui
ondule sur Kidal (Ph5 Sahel) — « ça me fait penser aux animations que PixelLab aurait faites. Pourquoi ne pas
me l'avoir dit plus tôt ? ». Avant de générer un asset, toujours demander : une icône Lucide / une forme SVG
dessinée / une animation maison ferait-elle le travail ? Souvent OUI = plus net, gratuit, à notre charte.

## ⭐ OBJET QUI COUVRE UNE ÉTENDUE vs OBJET QUI VOYAGE (GradientPathReveal vs GeoFlowConnection, Soudan Acte 4, 2026-07-11)

Distinction structurelle à trancher AVANT de choisir un composant de flux sur la carte :
- **Objet qui VOYAGE d'un point A vers B** (or, argent, drones, armes qui transitent) → `GeoFlowConnection`
  (marqueur ponctuel qui se déplace le long d'un tracé, indépendant du tracé lui-même).
- **Territoire/ressource linéaire qui change D'ÉTAT sur toute sa longueur** (un fleuve qui « s'active »
  stratégiquement, une frontière qui bascule, un pipeline qui devient un enjeu) → `GradientPathReveal`
  (`src/projects/warmap/_shared/GradientPathReveal.tsx`) : un FRONT qui avance épaissit et teinte le tracé
  progressivement (stroke-width variable + dégradé de couleur + `feTurbulence` texture organique), pas un
  marqueur qui voyage dessus.

Corollaire direct de la règle « objet inerte ne glisse jamais » (CLAUDE.md, § Remotion) appliqué à une BANDE
entière plutôt qu'à un point unique. Née d'un diagnostic concret : le Nil censé « pulser » (Acte 4 Beat 4,
motif stratégique égyptien) utilisait `GeoFlowConnection` avec un marqueur — invisible sur render réel (diff
pixel quasi nul entre deux frames du même beat). La géométrie du sujet (une ligne entière à faire vivre, pas
un point à faire voyager) réclamait une masse, pas un marqueur. Validé par DA-brief upstream (Gemini 3.1 Pro +
Kimi K2.5 + DeepSeek V4, convergence 3/3 sur ce mécanisme précis) puis vérifié sur render isolé avant
intégration. Réutilisable pour tout futur beat avec un fleuve/pipeline/frontière-qui-s'active.

---

## 1. LA 3e VOIE — SVG animé par code (le réflexe par défaut)

L'animation SVG procédurale frame-driven (déformation de chemins via `interpolate`/`Math.sin`, par frame).

| Besoin | Technique SVG | Preuve |
|---|---|---|
| Drapeau/fanion/voile/tissu qui ondule | déformation sinusoïdale de paths | PROUVÉ Ph5 (drapeau touareg) |
| Ondes (radio, choc, propagation, halo pulsant) | cercles concentriques animés | PROUVÉ Ph4/Ph5 |
| Tracés qui se dessinent (frontières, routes, flux, pipelines) | `stroke-dashoffset` | `countryOutline` dans warmapPremiumKit |
| Jauges/barres/compteurs/flux de points le long d'un chemin | `interpolate` sur largeur/position | — |
| Fumée/flammes STYLISÉES simples (formes qui montent/vacillent) | paths animés | si stylisé charte, pas photoréaliste |

### La 3e voie inclut AUSSI (Aziz 2026-06-14, P4) — 3 briques toujours disponibles
1. **Icônes Lucide** (`lucide-react` INSTALLÉ, compatible render Remotion). ~1500 icônes vectorielles nettes,
   animables (size/color/strokeWidth/fill dynamiques, spring, cascade). VALIDÉ P4 : `MapPin` (marqueur ville sur
   disque parchemin) + `User` (icônes-personnes du compteur coût 3M→15M en cascade). Quand un marqueur/pictogramme
   net suffit (lieu, personne, ressource, alerte, flèche) → Lucide AVANT de générer un sprite.
   Import : `import { MapPin, User, ... } from "lucide-react"`.
2. **Formes géométriques simples dessinées en SVG** (cercle, rect, path, polygone, ligne) qu'on COMPOSE et ANIME :
   disque + anneau + silhouette de bâti, pastille-lieu, cartouche, jauge, repère. Souvent supérieur à un sprite
   (ex P4 : marqueur ville SVG/Lucide a remplacé le sprite town-td répété + mal détouré).
3. **Animations maison frame-driven** : countup amorti, cascade d'icônes, ondulation, ondes, tracés, pulsation,
   slide/fade — tout via `interpolate`/`spring`/`Math.sin`. VALIDÉ P4 (cartouche coût animé).

**RÈGLE pour le DA et le plan** : ces 3 briques sont TOUJOURS dans le champ des options. La boîte à outils
envoyée aux modèles externes (DA-brief) DOIT les citer (cf. `scripts/tools/da-brief.py`), pour qu'ils les proposent.

### Recette du drapeau ondulant (réutilisable — Ph5 `Partie3Rupture.tsx`)
Voile = N colonnes (seg=5), chaque bord sup/inf décalé par `Math.sin(frame*k + i*phase)*amp`, bandes = paths
fermés entre yTop et yBot. Hampe = line encre + cap. Ombre = `feDropShadow #1A1005`. Apparition/sortie =
interpolate sur opacité. Couleurs DÉSATURÉES (charte parchemin, anti AI-slop). Code : bloc « DRAPEAU TOUAREG
ondulant » dans `src/projects/warmap/parties/Partie3Rupture.tsx`.

---

## 2. GEMINI — marqueurs / jetons / personnages / véhicules

Objets à formes nettes, identité forte, déplacement avec intention narrative. Création **Gemini**
(`gemini-3.1-flash-image-preview`) + détourage Recraft. Animation **NOUS-MÊMES** dans Remotion : track/path
frame-driven, walk-cycle, drift, rotation tangente, spring. On maîtrise déjà.

- **On garde notre force pour ce qui a une INTENTION narrative.** Un convoi qui avance vers l'uranium, un jeton
  qui prend un territoire = mouvement contrôlé frame par frame (Remotion), PAS une boucle PixelLab.
- Taille sur carte : objets Gemini assez GROS pour être lisibles. Viser ~0.20-0.24 vmin pour un marqueur principal.

---

## 3. PixelLab — effets organiques chaotiques denses

Feu, flammes, fumée, explosion, poussière dense, onde de souffle, débris. Création **PixelLab**
(`create_map_object` + `animate_object`), animation **PAR PROMPT** (frames depuis une phrase, « la fumée monte »).

- **Le pixel ne se « voit » que là où il ne dérange pas.** Un effet de feu/fumée est CHAOTIQUE — le pixel s'y fond.
- **On ne paie le coût du pixel** (pixels visibles full HD + PixelLab lent ~6 min/anim) **que là où le bénéfice**
  (animation organique gratuite, impossible sans coder du Lottie) **le dépasse largement.**

### ⭐ Le pont Gemini→PixelLab pour les effets PREMIUM
Le seul vrai défaut du pixel pur = un feu « générique jeu vidéo ». Solution : **créer l'effet via Gemini** (NOTRE
palette/style/intensité) **puis le donner en image de référence à PixelLab** (`init_image`/`style_image` sur
bitforge, ou `style_images` sur create object) → PixelLab ne fait QUE l'animer. On contrôle le LOOK (Gemini),
PixelLab fait le MOUVEMENT.

### ⚠️ LIMITE du pont (vérifiée 2026-06-11) : effets DENSES oui, DIFFUS non
Le pont marche pour les effets avec un **centre net / une masse** (explosion, fumée qui monte, feu). Il **rate sur
les effets DIFFUS/vaporeux** (poussière au sol, brume éparse) : `create_map_object` veut une FORME solide → il
« remplit » le panache en **boule pleine** (test poussière 2.1 = sphère ocre type planète, raté). Pour du diffus :
SVG plat (gradient/particules main) ou renoncer. Ne PAS forcer le pont sur un effet sans masse.

---

## ⭐⭐ 3 RÈGLES STRUCTURELLES R-OBJ (Aziz 2026-06-11, non-négociables, TOUTE War-Map)

### R-OBJ-1 — Taille ANCRÉE À LA CARTE (jamais en unités-écran)
Un objet posé sur la carte doit être dimensionné en **unités géographiques**, pas en `vmin` fixe. Sinon au
DÉZOOM la carte rétrécit mais l'objet garde sa taille écran → il paraît GROSSIR (bug P2 : bases grandissaient au
pull-back). Fix : dériver la taille du `zoom` courant (`taille = base * 2^(zoom - zoomRef)`). Le `ctx` doit
exposer le zoom courant. Vaut pour TOUS les objets carte (helper `spriteMapWidth`, en degrés).

### R-OBJ-2 — Un objet = une IMAGE (Gemini ou SVG dessiné), JAMAIS un dot/point SVG froid
Plus de points/cercles bleus « infographie froide » (le niveau-1 qu'on a fui). Tout ce qui marque un lieu (base,
mission ONU, ville tenue, capitale, ressource) = un sprite Gemini top-down OU une forme/icône SVG dessinée maison.
Si un marqueur manque, on le GÉNÈRE/dessine, on ne tombe pas sur un dot par défaut. Exception unique : le point EST
littéralement le propos et rien ne ferait mieux (rare).

### R-OBJ-3 — Zones d'emprise TRANSITOIRES, jamais cumulatives
Une zone rouge (territoire perdu) apparaît QUAND on en parle, puis **s'estompe** au beat suivant (comme la fumée).
JAMAIS toutes les zones affichées en permanence (elles s'empilent = brouillon, bug P2 : 3 zones cumulées
40s→1min29). **1 seule emprise active à la fois.** Et la zone PROGRESSE avec intention (le rouge AVANCE, FRANCHIT
la frontière), pas un état figé qui poppe.

---

## ⭐ RÉGIME PONCTUEL vs AMBIANT (classer AVANT d'animer — Aziz 2026-06-11, non-négociable)

| Régime | Exemples | Lecture | Mécanique Remotion |
|---|---|---|---|
| **PONCTUEL (one-shot)** | explosion, impact, flash, largage, tir | joue UNE FOIS puis **DISPARAÎT** | 0→N puis `opacity→0`. JAMAIS de boucle (une explosion ne se « dé-explose » pas). |
| **AMBIANT (continu)** | fumée qui monte, feu qui brûle, drapeau qui ondule, poussière, brume | **BOUCLE tant que la condition dure** | ping-pong (0→N→0) ou loop seamless. JAMAIS figer (= statique = rejeté). |

Règle d'or : **ne jamais boucler un ponctuel, ne jamais figer un ambiant.** Proto 2.4 : fumée = ambiant
(ping-pong) ; explosion d'amorce = ponctuel (one-shot + fade). Anti-saturation : 1 foyer à la fois.

---

## Garde-fous transversaux

- **Mouvement = intention OU ambiant ancré.** Drapeau qui ondule sur un lieu tenu = ambiant ancré = légitime.
  Particule qui dérive sans ancrage = rejeté (leçon 2026-06-14). (cf. CLAUDE.md « mouvement = intention narrative »)
- **Max 2 mouvements simultanés**, 20% d'écran toujours « vide ». Ne pas transformer la carte d'analyse en sapin
  de Noël (garde-fou DA-brief P3 Gemini+Kimi, 2026-06-14).
- **Loop seamless (ambiant)** : PixelLab v3 ne garantit pas le raccord frame N→0. Vérifier ; si ça saute →
  ping-pong (0→N→0) ou crossfade au raccord.
- **PixelLab est LENT** (~6 min/anim en charge). Async, programmer un réveil, jamais bloquer.
- **Bug lib REST locale** : utiliser le MCP PixelLab (la lib pip plante au parsing). Voir `memory/tools/pixellab.md`.

## Application proto 2.4 (cas de référence)
- Fortin FR (marqueur) = **Gemini** (`base-fr-td.png`).
- Base qui tombe → effet **fumée/effondrement PixelLab** (remplace le Lottie `extinctionCollapse` codé main).
- Cas d'usage parfait : effet organique, moment fort, là où le Lottie était la friction.

Voir aussi : [[WARMAP-GRAMMAIRE]] (grammaire de réalisation) · [[WARMAP-LONG-DOCTRINE]] (3 registres) ·
[[feedback_sprites-topdown-gemini-vs-recraft]] (recette sprites top-down) · `memory/tools/pixellab.md`.
