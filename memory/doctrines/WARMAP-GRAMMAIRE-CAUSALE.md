---
name: War-Map — Grammaire causale (le standard narratif)
description: LA doctrine qui évite le "bordel confus" du départ. Montrer la CAUSE avant l'EFFET. Catalogue des techniques causales validées (avancée par jetons+sillage, chute de base en 3 temps, donnée qui se montre). Validé Aziz 2026-06-12 (Sahel P2).
type: project
---

# War-Map — GRAMMAIRE CAUSALE (NON-NEGOTIABLE, tout war-map)

> ⭐ **LIRE AVANT DE CODER TOUTE WAR-MAP.** Dérivé de la Sahel P2, refondue 4× avant de marcher.
> Le polish ne suffit PAS : une carte "belle mais qui montre des états qui poppent" est CONFUSE et rejetée.
> Ce qui sauve = la causalité visible. Référence vidéo : `out/episodes/warmap-sahel/p2-FINAL.mp4` (catbox gfsa3h).

## LA RÈGLE D'OR : CAUSE avant EFFET

Un territoire ne change JAMAIS par magie. **Un acteur AGIT → le territoire change EN CONSÉQUENCE.**
Ne jamais faire apparaître un RÉSULTAT (zone rouge qui pop, base qui s'efface, capitale qui bascule) sans
montrer d'abord sa CAUSE (les jetons qui avancent/encerclent/franchissent).

**TEST DE LISIBILITÉ (Kimi, à appliquer à chaque scène)** : *coupe le son. Si un œil neuf comprend
« des gens avancent, assiègent des forts, le territoire devient rouge » → gagné. S'il voit juste des taches
apparaître → c'est de l'AI-slop narratif, à refaire.*

**Pourquoi c'est vital** : sans causalité, on retombe dans le "bordel confus du départ" — le spectateur voit du
beau mouvement sans comprendre QUI fait QUOI ni POURQUOI. La causalité = ce qui sépare une carte météo
(états qui changent) d'une carte de bataille (récit de causes et d'effets).

---

## CATALOGUE DES TECHNIQUES CAUSALES VALIDÉES (recettes réutilisables)

### 1. L'AVANCÉE — jetons qui se déplacent + SILLAGE qui colore le territoire
**Effet narratif** : "les groupes armés prennent du terrain." Le territoire rouge NAÎT de leur passage.
**Recette** :
- Jetons = acteurs avec waypoints `{f, lon, lat}[]` interpolés frame-driven → `interpWaypoints()` (kit).
- Le SILLAGE : échantillonner les positions PASSÉES de chaque jeton (tous les ~12 frames depuis son apparition
  jusqu'à la frame courante) → cercles dans un `<mask>` flouté (`feGaussianBlur stdDeviation~16`) → une nappe
  rouge `mix-blend-mode: multiply` n'apparaît QUE sous le mask. "Wet ink" : chaque empreinte grandit avec l'âge.
- Résultat : le rouge se révèle DERRIÈRE le jeton, progressivement, jamais un pop.
**Anti-pattern** : une zone rouge qui apparaît seule (sans acteur) = incompréhensible. Un sillage en ronds
visibles (mask non flouté) = "taches rondes". Flouter pour une nappe continue.
**Code** : `Partie2Blocage.tsx` (sillageStamps + mask p2-sillage). Jetons 4-6 max à l'écran.

### 2. LA CHUTE D'UNE BASE — en 3 temps (jamais une disparition magique)
**Effet narratif** : "la base tombe parce qu'elle est attaquée." La cause (l'attaque) précède l'effet (la chute).
**Recette (3 temps)** :
1. APPROCHE : les jetons avancent jusqu'à la base (waypoints qui convergent vers sa coord).
2. PRESSION : un pulse d'alerte ROUGE qui bat (~30-40f) sur la base juste avant la chute (`baseState.alert`).
3. CHUTE : à `fallAt`, la base s'EFFACE TOTALEMENT (opacity→0 sur ~50f, grayscale+brightness) + fumée
   PixelLab (`smokePingPong`, ambiant, qui se DISPERSE après +9-15s, ne brûle pas éternellement).
**Anti-pattern** : base qui brûle/disparaît sans qu'on voie l'attaquant = "pourquoi ça disparaît ?". Fumée qui
persiste tout le reste de la scène = sature les beats suivants. Explosion en boucle = une explosion ne se dé-explose pas.
**Décision Aziz** : effacement TOTAL (territoire perdu = plus aucune présence), pas désaturation partielle.
**Code** : `Partie2Blocage.tsx` (baseState 3 temps + halos alerte + fumée disperse).

### 3. LA DONNÉE QUI SE MONTRE — le "40%" par le territoire qui se remplit
**Effet narratif** : "40% du Burkina échappe à l'État" → on VOIT 40% du pays devenir rouge, on ne le LIT pas.
**Recette** :
- Vrai contour du pays projeté (`sahelCountries.ts`, décimé depuis le geojson) → `clipPath`.
- Un `<rect>` rouge `multiply` qui MONTE depuis le bas du pays jusqu'à 40% de sa hauteur (clippé au contour).
- + contour flash (technique 4) au moment où le pays est nommé.
**Anti-pattern** : un overlay chiffré "40%" en coin d'écran qui répète la voix = inutile, hors-centre, supprimé.
La data-viz jauge circulaire = aussi supprimée (même raison). **Règle : la donnée se MONTRE, jamais ne s'écrit.**
**Code** : `Partie2Blocage.tsx` (burkinaFill + clipPath p2-burkina-clip).

### 4. LE CONTOUR DE TERRITOIRE NOMMÉ — se dessine + flash (technique SYSTÉMATIQUE)
**Effet narratif** : guider l'œil quand on nomme un pays. Le contour se TRACE + un flash pulse.
**Recette** : `countryOutline()` (kit) — stroke-dashoffset qui se trace sur ~40f + halo flash au bout du tracé.
Couleur PORTEUSE DE SENS : rouge=menace jihadiste, kaki=junte militaire, or=AES, orange=CEDEAO.
Renforcé : double trait (glow épais 7 + trait net 3.6) + halo de remplissage au flash.
**Anti-pattern** : nommer un pays sans repère visuel = l'œil ne sait pas où regarder. Caméra trop serrée = le
contour déborde du cadre (élargir pour que le pays entier soit visible quand on le nomme).
**Code** : `countryOutline` dans `warmapPremiumKit.ts`, contours dans `sahelCountries.ts`.

### 5. CASSER LA GRAMMAIRE pour un acteur DIFFÉRENT (le coup d'État ≠ les groupes armés)
**Effet narratif** : distinguer un coup d'État militaire (acteur institutionnel) de l'avancée jihadiste.
**Recette** : un JETON militaire distinct (jeton-junte, officier béret) se pose sur la capitale, couleur KAKI
(pas le rouge jihadiste), événement PONCTUEL (pas de sillage). Contour kaki du pays.
**Anti-pattern** : utiliser le même rouge/la même mécanique → le spectateur croit "les jihadistes ont pris le
pays". Une forme abstraite (losange/étoile) = cheap sur une carte riche. Tout marqueur = jeton/sprite à notre identité.

---

## LES RÈGLES TRANSVERSALES (rappel — voir aussi WARMAP-OBJETS-GEMINI-VS-PIXELLAB.md)
- **Combiner l'ARSENAL**, jamais un seul asset : jetons + zones + sprites Gemini + PixelLab + timeline + contours + plaques.
- **Jeton = cercle** (parchemin + bordure faction + portrait clippé, helper `chip()`), JAMAIS un portrait nu (= buste flottant).
- **Taille ancrée carte** (`spriteMapWidth`, en degrés), ne grossit pas au dézoom.
- **Timeline graduée** pleine largeur, présente dès le début (curseur date qui glisse = donne le sens du temps).
- **SFX seulement si support visuel** (retiré cedeao-snap : on ne voyait pas la CEDEAO). Silencieux sur poses/avancées.
- **1 foyer d'attention à la fois** (anti-saturation). Hiérarchie du regard : assombrir le reste pendant l'action.
- **EMPHASE CHIRURGICALE sur les territoires concernés** (Aziz 2026-06-11) : quand 1-2 territoires portent la scène
  (ex : Kidal repris, zone AES qui naît), les GARDER pleinement traités (couleur, contour, jetons) et ÉPURER tout
  le tour (carte calme, voisins atténués). On met l'emphase sur les deux parties concernées, pas sur le décor.

## LA MÉTHODE (avant de coder — la même qui a débloqué la P2)
1. Écouter l'audio phrase par phrase → `PLAN-NARRATIF-PN.md` : "que doit COMPRENDRE un œil neuf à cette phrase ?"
2. Pour chaque phrase, choisir la/les technique(s) causale(s) du catalogue ci-dessus.
3. DA-brief upstream sur le PLAN (Gemini+Kimi), signal jamais juge → filtrer les hallucinations.
4. Valider le plan avec Aziz, PUIS coder (copier `Partie2Blocage.tsx` comme modèle).

> Voir aussi : [[WARMAP-OBJETS-GEMINI-VS-PIXELLAB]] (Gemini vs PixelLab + 3 règles R-OBJ) ·
> `memory/key-learnings.md` (leçon grammaire causale) · `PLAN-NARRATIF-P2.md` (modèle de plan) ·
> `WARMAP-LONG-DOCTRINE.md` (format long, 100% carte).

---

## ⛔ RÈGLE UNIVERSELLE — OVERLAY SEMI-TRANSPARENT AVEC CARTE/CONTOURS AU TRAVERS = INTERDIT (Aziz 2026-06-14)

**Gravé après P4 v2 (capture "2024 Confédération AES" jugée "vraiment très moche", "interdit").**

Un overlay (cartouche texte/données) avec la CARTE ou des CONTOURS qui transparaissent dessous = BOUILLIE
illisible. On ne comprend pas ce qui se passe, les écrits sont noyés par les traits du fond. BANNI dans
TOUTES les vidéos (War-Map, Atlas, Souverain).

**Les 2 seules options autorisées pour présenter de l'info :**
1. **PLEIN ÉCRAN OPAQUE** — fond parchemin solide, la carte disparaît complètement. C'est notre force Remotion :
   l'overlay plein écran s'ANIME à fond (data-viz, icônes en cascade, camemberts/barres, objets PixelLab DANS
   l'overlay comme en Atlas). Jamais un bloc texte statique posé quelques secondes.
2. **SUR LA CARTE** — pas d'overlay du tout : l'info se représente directement sur le territoire (contour qui
   vire de couleur, jeton/sprite qui se pose, remplissage, sceau, plaque-nom ancrée). La carte porte le sens.

**JAMAIS l'entre-deux** (cartouche semi-transparent flottant avec territoires/contours visibles dessous).
Si on tient à un cartouche sur fond de carte : le fond DOIT être totalement assombri/neutralisé dessous
(aucun contour ni détail visible) — mais par défaut, préférer plein écran opaque ou représentation sur carte.

**Corollaire (règle gravée Aziz)** : un overlay Remotion DOIT être animé (c'est notre force). Un overlay statique
posé plusieurs secondes pendant que rien ne bouge = mort. Animer, ou ne pas mettre d'overlay.

**⛔ RENFORCEMENT (Aziz 2026-06-14, P4 Chantier 1) — ON ARRÊTE LES SEMI-TRANSPARENTS, POINT.**
`WarMapOverlayDynamic mode="semitransp"` est BANNI (le voile + carte au travers = exactement la bouillie ci-dessus,
les sprites/villes/jetons transparaissent à travers le cartouche). Ne plus l'utiliser nulle part. Aziz : "pourquoi
se compliquer la vie ? un overlay solide empêche les sprites de passer au travers." Toujours :
- chiffre/info ABSTRAITE (national, sans point géo : "3 M déplacés") → **plaque OPAQUE ancrée** (fond parchemin
  100% solide, AUCUN détail de carte visible dessous) avec le flux/action qui continue AUTOUR (pas dessous), OU
  **plein écran opaque animé** (Chantier 2 data-viz).
- info SPATIALE (territoire, ville, flux) → représentée SUR la carte (contour, jeton, remplissage, plaque-nom ancrée).
Le composant `WarMapOverlayDynamic` n'a que 2 modes (semitransp=banni, fullscreen=opaque) → pour une plaque opaque
ancrée locale, coder une plaque inline à fond solide (pas le composant). À terme : ajouter un mode "solid-anchor".
