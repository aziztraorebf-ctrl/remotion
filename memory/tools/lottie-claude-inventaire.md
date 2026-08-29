---
name: "Lottie via Claude — inventaire de ce qui est faisable sans assets externes"
description: "Périmètre clair de ce que Claude peut générer en Lottie JSON pour Atlas et autres vidéos. Validé Shaka Zulu 2026-05-03 (couronne, iklwa, flèche-pulse)."
type: reference
---

# Lottie via Claude — inventaire complet

Validé après exploration Shaka Zulu (2026-05-03). Le format JSON canonique étant maîtrisé via skill Wiggle, Claude peut maintenant générer des animations Lottie autonomes pour les vidéos Atlas et autres projets.

⛔ **LIEN MORT corrigé au wrap 2026-08-24** : `feedback_remotion-lottie-headless-broken.md` n'existe
**dans aucune des 2 arborescences** — les « 4 règles critiques + pattern require() » qu'il portait sont
perdues. Ne pas partir à sa recherche. La référence de format vivante est ce fichier + le pipeline
maison (§ ci-dessous).

---

## ⭐⭐ L'ATELIER DE CONVERSION SVG → LOTTIE (mis à jour 2026-08-28)

> **C'est ici qu'on convertit un fichier qu'on n'a PAS écrit** (logo client, SVG d'un
> designer). Tout vit dans `src/projects/_client-sim/lottie-ui/tools/`.
> ⛔ Le chemin `scripts/tools/svg2lottie.py` cité ailleurs en mémoire **n'est pas** l'atelier.

| Outil | Ce qu'il fait | Quand |
|---|---|---|
| `svg2lottie_scene.py` | SVG → Lottie, **et déclare ce qu'il approxime ou refuse** | toujours en 1er |
| `planche_calques.py` | rend **chaque calque SEUL** en vignettes | pour VOIR ce qu'on a |
| ⭐ `proposer_carte.py` | propose des **blocs** géométriquement sûrs (contigus, contre-formes rattachées) | entre la planche et la carte |
| `group_layers.py` | applique une carte `{nom: [calques]}` → calques **nommés** | après avoir nommé les blocs |
| `animate_scene.py` | pose une animation depuis une **partition** | pour faire bouger |
| `compare_render.py` | **écart mesuré** entre le SVG et le Lottie, avec planche | ⛔ AVANT de conclure |
| `test_rendu.py` · `test_logo_client.py` | non-régression (7 assets · 4 volets) | avant de commiter |

**LA CHAÎNE COMPLÈTE** (prouvée de bout en bout sur 2 logos de vrais clients) :
`image → Recraft (vectorise) → svg2lottie_scene → planche_calques → proposer_carte → [NOMMER] → group_layers → animate_scene → Lottie`

### Ce qui est PORTÉ (mesuré, pas supposé)
- **Dégradés** linéaires et radiaux (`gf`), y compris sous un `transform` de groupe.
- ⭐ **`gradientTransform`** quand c'est une **similitude** (translation · rotation · échelle
  UNIFORME et leurs compositions) : Lottie porte un SEGMENT, déplacer ses 2 points suffit.
- ⭐⭐ **Le FLOU** (`feGaussianBlur` seul) via l'effet Lottie `ty: 29`. **MESURÉ le 2026-08-28** :
  `lottie-web` le rend — un carré passe de 0 à 5360 pixels de bord adouci, vérifié à l'image.
  ⛔ **La note « les filtres sont une limite du FORMAT » était FAUSSE** : le format sait, c'est
  notre convertisseur qui ne l'émettait pas.
- **`<use>`** (aplatis), **texte** (vectorisé), **feuilles `<style>`** (Illustrator).

### Ce qui reste REFUSÉ — et pourquoi
- **Filtres COMPOSITES** (`feOffset`+`feMerge` = ombre portée, `feColorMatrix`) : pas d'équivalent.
- **`gradientTransform` avec cisaillement ou échelle NON uniforme** : rendrait un radial
  elliptique, que le format n'exprime pas.
- **`<pattern>`** (motifs répétés).
- ~~masques~~ → ✅ **PORTÉS le 2026-08-29**, voir la section ci-dessous.

### ⭐⭐ 2026-08-29 — LE POCHOIR, LA PRÉCOMPOSITION ET LE RIG (statut **proto**)

> ⚠️ Statut **proto** assumé : mesurés (0,03 %) et couverts par **8 tests de non-régression**, mais
> **un seul projet consommateur** (`repro-chien`). Le critère « prouvé » du projet demande ≥2 sites
> d'usage — il n'est pas satisfait. Passer à « prouvé » au 2e usage réel.

| Brique | Ce qu'elle fait | Mesure |
|---|---|---|
| **Pochoir** (`decoupe_referencee`) | `mask`/`clip-path` SVG → paire Lottie `td:1` (la découpe) / `tt:1` (le contenu) | **0,00 %** sur géométrie pro |
| **Précomposition** | emballe un groupe de N calques en asset — ⛔ Lottie ne découpe **qu'UN calque** par pochoir | 1 pochoir sur 5 → **5 sur 5** |
| **Rig** (`_rig_de`) | `data-parent` + `data-pivot` déclarés dans le SVG → `parent` + ancre Lottie | chaîne main→bras→torse, **0,01 %** |
| **Garde-fou** (`Rapport`) | compte les clips **vus** vs **traités** ; tout écart **interdit** le verdict vert | 3e occurrence de la famille |

**La convention de déclaration** (SVG n'a aucune notion de parentage ; ces attributs sont ignorés
par les navigateurs) :

    <g id="bras" data-parent="torse" data-pivot="haut">
    <g id="main" data-parent="bras"  data-pivot="150,198">

⛔ `data-parent` vise le **NOM DE CALQUE produit** (`head-base`), pas l'id du groupe.
⛔ `data-pivot` = `haut`/`bas`/`centre`/`gauche`/`droite` (déduits de la boîte du GROUPE) ou `x,y`.
⛔ Dans Lottie, `a` est le point qui vient se poser sur `p` : **déplacer l'ancre seule DÉCALE le
dessin**. Les deux bougent ensemble.

⭐ **Fixture de référence** : `src/projects/_client-sim/repro-chien/assets/chien-tete.svg`
(17 calques nommés, 5 clip-path, 10 `data-pivot`, 4 `data-parent`). ⛔ **Pas une brique à réutiliser**
— c'est l'exemple à COPIER quand on redemande un dessin riggable à un modèle.

**2 primitives d'animation neuves** (`repro-chien/animer.py`) — le reste doublonne `animate_scene.py` :
- `souleve()` — montée vive, retombée molle (**1 pour 3**), easing **par clé**. ⛔ Caler la retombée
  sur la période laissait l'oreille dressée **2 secondes**.
- `saccades()` — déplacements **instantanés** (0,02 s). Relevé sur une pièce pro : un regard change
  de cible d'un coup, il ne glisse jamais.
⚠️ `clignement()` et `oscille()` **doublonnent** `cligne` et `balance` de `animate_scene.py` — leur
apport réel (écrasement en Y ; paramètre `phase`) est à porter comme **option sur l'existant**,
pas à cataloguer à part.

### ⛔⛔ LES 3 RÈGLES QUI ONT COÛTÉ
1. **Un rapport VERT ne prouve rien.** « transportable à l'identique » a menti **3 fois**
   (logo tout noir, blason amputé, dégradés hors cadre). **RENDRE ET REGARDER.**
2. **Un groupe doit être CONTIGU.** L'ordre de peinture est une séquence : grouper par NATURE
   (« tous les éléments de blouse ») fait passer un groupe devant ce qui doit rester entre ses
   membres → tache noire entre les yeux du renard, 0,37 % d'écart. Un nom parlant qui casse la
   séquence est pire qu'un nom terne qui la respecte.
3. **Une contre-forme voyage avec sa lettre.** Séparée, elle bouche le trou — le « o » sort en
   disque plein, et le chiffre global (0,14 %) passe pour bon.

### ⛔⛔ LA FAMILLE DE BUGS À CONNAÎTRE — 6 occurrences en 4 jours
**L'élément est CORRECT, c'est son AIGUILLAGE qui l'annule** — sans erreur, JSON valide :
flamme figée · tri `fl`/`st` qui jetait les `gf` · sonde de test à un niveau fixe ·
`centre_du_calque` → ancre à `[0,0]` (la forme pivote depuis le coin de l'écran) · ménage
« dégradé sans arrêt » qui supprimait les `<filter>` · `len(entree)==4` pris pour « c'est du texte ».
⭐ **2 règles** : chercher les `sh`/les defs **EN PROFONDEUR**, jamais à un niveau fixe ·
ne jamais discriminer sur la **LONGUEUR** d'une structure, c'est le **CONTENU** qui discrimine.

### Le nommage : ce qui est outillé, ce qui ne l'est pas
`proposer_carte.py` fait le travail **mécanique** (quelles formes vont ensemble) mais **ne nomme
rien** — il sort `bloc-1`, `bloc-2`. Rendement mesuré : **40 % sur un logotype**, **6 % sur une
mascotte** — et **il le dit** en sortie au lieu de laisser croire qu'il a travaillé.
⭐ Pourquoi cet écart : la règle suppose un détail **ENFERMÉ et CLAIR** (le trou d'un « o »).
Une mascotte **juxtapose** ses éléments au lieu de les emboîter. Là, le regroupement reste
MANUEL — en croisant **forme + couleur + position** sur la planche annotée.

---

## Ce que Claude PEUT faire seul (zéro asset externe)

### Icônes géométriques simples (validé)
- **Couronne** : base + 3 pointes triangulaires + 3 gemmes (validé Shaka Zulu)
- **Lance/iklwa/épée** : lame triangulaire + manche rectangulaire + garde
- **Flèche** : triangle pointu + ligne d'empennage
- **Bouclier** : ellipse ou forme custom + motifs internes
- **Croissant lunaire** : intersection 2 ellipses (mask) ou path bezier
- **Étoile/polygone** : `ty: "sr"` natif (5 à 12 branches)
- **Cercle d'écho** : ellipse stroke qui s'agrandit + fade (validé arrow-pulse)
- **Couronne de laurier** : 2 paths bezier symétriques
- **Ankh, croix, symboles** : géométrie simple
- **Flammes stylisées** : path bezier avec courbes douces
- **Goutte d'eau / larme** : ellipse + path triangulaire fusionnés visuellement
- **Tente/case ronde** : triangle + rectangle ou cercle
- **Sablier** : 2 triangles inversés + sable (animation niveau)
- **Clé géométrique** : cercle + rectangle + dents
- **Œil stylisé** : ellipse externe + ellipse interne + pupille
- **Soleil** : cercle central + N rayons (rectangles fins en rotation)
- **Pyramide** : 3 paths triangulaires (face + ombre)

### Animations possibles sur ces icônes
- **Pulse/breathe** : scale 85% → 100% → 92% → 85% (validé)
- **Oscillation/sway** : rotation -3° → +3° → -3° (validé iklwa)
- **Fade in/out** : opacité 0 → 100 → 0
- **Slide** : translation X ou Y
- **Spin** : rotation 0° → 360°
- **Draw-on (trim path)** : trace progressive d'un contour
- **Echo concentrique** : 2-3 cercles qui s'agrandissent en cascade (validé arrow-pulse)
- **Bounce** : scale avec ease back (overshoot)
- **Color shift** : couleur or → bordeaux progressive
- **Flicker** : opacité saccadée (ex: flamme)
- **Ripple** : ondulation de scale séquentielle
- **Magnétisme** : 2 éléments qui se rapprochent puis s'écartent

### Combinaisons multi-layers (validé jusqu'à 3 simultanés)
- Anneau + flèche centrale (validé arrow-pulse : echo + triangle)
- Couronne + étincelles autour (4-6 layers possible)
- Compteur visuel : 5 cercles qui s'allument séquentiellement
- Légende avec icône + texte (texte = composant Remotion à côté, pas dans le Lottie)

### Effets de modifier
- **Trim path** : draw-on pour traces, signatures, contours
- **Rounded corners** : adoucir n'importe quelle forme
- **Repeater** : dupliquer N fois en rotation (couronne de pétales, mandalas)
- **Twist** : torsion légère

---

## Ce que Claude PEUT faire avec effort modéré (50-200 lignes JSON)

### Compositions pédagogiques pour Atlas
- **Indicateur de population** : silhouettes humaines simples qui s'empilent
- **Timeline horizontale** : ligne avec ticks animés + dots qui apparaissent
- **Compteur numérique** : chiffres qui s'incrémentent (utiliser Remotion + Lottie ensemble)
- **Diagramme cause-effet** : 2-3 cercles + flèches connectrices
- **Hiérarchie pyramidale** : 3 niveaux empilés qui apparaissent du bas
- **Comparaison taille** : 2 silhouettes côte-à-côte avec scale animé
- **Indicateur de progression** : barre qui se remplit

### Marqueurs cartographiques (très utile pour Atlas)
- **Pin de localisation** : goutte d'eau + cercle interne, drop-down animé
- **Marqueur capitale** : étoile dorée pulsante
- **Marqueur bataille** : 2 lances croisées + halo bordeaux
- **Marqueur commerce** : balance + pièces
- **Onde de conquête** : pulse depuis un point
- **Trajectoire** : path bezier qui se trace progressivement (caravane, armée)

### Patterns décoratifs Atlas
- **Bordure manuscrite** : motifs géométriques répétés en rotation
- **Cartouche royal** : forme ovale + détails ornementaux
- **Sceau royal** : cercle + symboles internes
- **Compass rose** : étoile à 8 branches + N/S/E/O

---

## ⭐⭐ 2026-08-24 — LE PIPELINE SVG→LOTTIE EXISTE MAINTENANT (dette de juin refermée)

> ⛔ **Ce fichier disait depuis juin « Reproduction d'un dessin/photo → Outil SVG→Lottie »
> sans que cet outil existe.** Il existe. Le tableau « NE PEUT PAS » ci-dessous reste vrai
> pour la génération À LA MAIN par Claude, mais la ligne « reproduction d'un dessin » a
> désormais une réponse maison.

**La chaîne** : image → **Fable mode MAX** (SVG structuré, ids imposés, ZÉRO animation dedans)
→ script Python → `.json` Lottie. C'est le réflexe maison « le modèle dessine le STATIQUE,
NOUS animons », appliqué à un nouveau format de sortie.

**Outil** : `src/projects/_client-sim/lottie-ui/tools/animate_start.py` (statut **proto**, 1 usage).
Récit complet, gotchas et suites : `memory/client-sim-tests/lottie-ui-lcd/STATUS.md`.

**Validé sur 4 moteurs**, dont les 2 officiels de LottieFiles (Preview + Creator) : calques nommés,
dépliables, **éléments déplaçables un par un**. 1382 octets compressé.

⛔ **Les 4 limites de l'outil** (à annoncer à un client, jamais à cacher) :
1. ✅ **LEVÉE le 2026-08-25** (commit `4ce4b9ee`) — disait « segments DROITS uniquement, toute
   courbe lève une `ValueError` ». **FAUX** : grammaire SVG complète (cubiques exactes à 1e-14,
   arcs sous 5e-04 px) + primitives. ⛔ Ce fichier ne porte plus aucun verdict propre — la table
   de décision est `memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md`.
2. **Source `.aep` : ⛔ NON VÉRIFIABLE ICI** (requalifié le 2026-08-29) — j'avais affirmé qu'AE
   n'importait pas le Lottie, **c'est FAUX** (corrigé 08-24) : Bodymovin et LottieFiles-for-AE font
   l'import. Mais vérifier si NOS fichiers passent demande **After Effects, qui n'est pas installé**.
   ⛔ Ce n'est donc PAS une action en attente, c'est un **blocage matériel** — elle était reconduite
   à chaque wrap et polluait la liste des dettes. ⚠️ Ne pas l'annoncer à un client comme acquis.
   Nos sources = le SVG + le code. → `memory/client-sim-tests/lottie-ui-lcd/STATUS.md` § 4 bis.
3. **Aplatit `transform="translate(x,y)"`** dans les points (Lottie n'a pas d'équivalent de
   transform sur une forme).
4. ⚠️ **SÉCURITÉ — note CORRIGÉE le 2026-08-29** : le fichier qui parse en **regex** est `src/projects/_client-sim/lottie-ui/tools/animate_start.py` (`re.finditer` l.73, `re.findall` l.97), **pas** `svg2lottie.py` — celui-ci est DÉJÀ durci (defusedxml + `_SafeParser` qui refuse toute déclaration d'entité, l.22-43). ⛔⛔ L'ancienne note désignait le fichier **déjà sûr** et laissait le vrai trou non signalé : une note de sécurité qui RASSURE À TORT est pire qu'une dette ouverte. → ne pas exposer `animate_start.py` (statut **proto**, 1 usage) à un SVG client non fiable. ⭐ L'outil courant de la chaîne, `svg2lottie_scene.py`, n'est pas concerné.
   sans reprendre le durcissement XXE de `svg2lottie.py` (parseur qui refuse toute déclaration
   d'entité — faille signalée par le hook sécurité le 2026-08-24).

⛔ **Piège d'affichage LottieFiles Creator** : à l'import, il enveloppe l'animation dans un
`[Precomp Layer ...]` et le panneau ne montre QU'UNE ligne. **Les calques sont derrière l'onglet
du même nom, en bas à côté de « Main Scene »** — cliquer dessus. Rien n'est aplati. (A failli
être diagnostiqué comme un défaut du fichier.)

⛔ **Un `tr` Lottie n'agit QUE sur les formes de son PROPRE groupe `it`.** Posé à côté des formes
au lieu de les envelopper → le groupe ne tourne pas, alors que le JSON est **valide et se charge
sans erreur**. Seul le rendu visuel le dit. (Bug payé 2 fois cette session.)

---

## Ce que Claude NE PEUT PAS faire (utiliser un autre outil)

### Trop complexe pour génération manuelle
| Besoin | Pourquoi pas Lottie-Claude | Solution recommandée |
|--------|---------------------------|----------------------|
| Silhouette de personnage réaliste | >50 vertices bezier, tangentes ingérables | PixelLab (sprite) ou Gemini (illustration) |
| Visage humain | Trop d'éléments subtils | Gemini ou PixelLab |
| Reproduction d'un dessin/photo | Conversion pixels → vecteurs nécessaire | Outil SVG→Lottie ou Lottie Creator |
| Animation de marche | Walk cycle = 4-8 keyframes par membre × 4 membres | PixelLab walk cycle (validé) |
| Carte géographique | Trop de polygones | d3-geo + Natural Earth (validé Atlas) |
| Texture organique (eau, fumée, feu réaliste) | Particules + noise impossible à coder à la main | Lottie Creator + LottieFiles, ou MP4 stock |
| Logo de marque existant | Reproduction fidèle = path bezier complexe | Lottie Creator (import SVG) |

### Limitations techniques
- **Path morphing** (forme A → forme B fluide) : nombre de vertices doit matcher entre les 2 paths. Faisable sur 3-4 vertices, infaisable sur 20+
- **Particules** : pas de système natif, dupliquer 10 layers manuellement c'est lourd
- **3D vrai** : Lottie est 2.5D. Pour vrai 3D → Three.js dans Remotion
- **Effets WebGL** (glow, distorsion forte) : renderer-dependent, peut ne pas marcher en headless
- **Texte dynamique** : possible mais complexe ; mieux vaut utiliser un composant Remotion `<div>` à côté

---

## Règles d'usage pour Atlas (validées Shaka Zulu)

### Quand utiliser Lottie-Claude
- Légende d'une carte (icônes pour expliquer : "voici le royaume", "voici l'armée")
- Marqueurs animés sur une carte (pulse, écho, drop-down)
- Indicateurs visuels pédagogiques (pyramide, compteurs, comparaisons)
- Éléments d'ouverture ou de transition (couronne qui pulse, sceau qui se trace)
- Décorations de cartouche, ornements

### Quand NE PAS utiliser Lottie-Claude
- Personnages → PixelLab
- Cartes → d3-geo
- Photos/illustrations → Gemini
- Captures vidéo → Seedance/Kling
- Texte → composant Remotion natif (pas Lottie)

### Limite pratique de complexité par scène
- **Max 5 instances `<Lottie>` simultanées** (jamais testé au-delà, mais 3 OK)
- **Max ~150 lignes de JSON par animation** (au-delà, devient difficile à maintenir)
- **Max ~10 vertices par path bezier** (au-delà, calcul tangentes ingérable)

---

## Pipeline de génération d'une icône Lottie

1. **Définir la forme** en termes simples (3 pointes triangulaires + 3 gemmes circulaires)
2. **Définir l'animation** (pulse 60 frames, scale 85→100→92→85)
3. **Coder le JSON** en suivant le canon Wiggle (voir `feedback_remotion-lottie-headless-broken.md`)
4. **Charger via require()** dans le composant Remotion
5. **Mini-render** pour valider avant intégration

---

## Réutilisabilité

Les JSON Lottie générés sont **portables** : peuvent servir dans plusieurs vidéos Atlas. Les fichiers validés vivent dans :
- ⛔ **`src/projects/atlas/_shared/lottie-icons/` N'A JAMAIS ÉTÉ CRÉÉ** (annoncé le 2026-06-15, vérifié
  absent le 2026-08-24). Les 3 `.json` ci-dessous vivent en réalité dans
  `src/_archive/episodes-livres/atlas/shaka-zulu/tests/`. Une promesse de dossier n'est pas un dossier.
- En attendant : dans le dossier `tests/` du projet en cours

Bibliothèque actuelle (Shaka Zulu) :
- `crown-pulse.json` — couronne royale qui pulse
- `iklwa.json` — lance zulu qui oscille
- `arrow-pulse.json` — flèche bordeaux + écho doré (territoire/conquête)

---

## Assets premium Souverain navy/gold (Chantier C, 2026-06-02)

Générés par code dans `src/projects/_shared/lottie/premiumLottieAssets.ts` (fonctions paramétrables couleur, format 5.7.8, renderer canvas headless OK). Ancrés à un point geo via `MapboxLottieGeoAura.tsx` (Lottie off-screen → goToAndStop frame-driven → overlay à map.project(coord)).

- `shockwaveDiscovery()` — onde de choc "découverte" : flash central + 3 anneaux en cascade (easing out cubic). VERDICT : excellent (à juger en vidéo, paraît faible sur frame fixe entre 2 pulses).
- `orbitalDataCrown()` — anneau de ticks rotatifs (repeater) + contre-rotation, look HUD war-room. VERDICT : bon, lisible même en frame fixe.
- `networkFlow()` — particules dorées le long d'une route dasharray, taille/opacité variables. VERDICT : correct.

### Gotcha critique (appris 2026-06-02) — décalage de phase
`goToAndStop(frame)` force une frame ABSOLUE sur la timeline → le décalage de layers via `st`/`ip`/`op` négatifs (start-time) est IGNORÉ. Pour étaler des particules dans le temps, décaler les KEYFRAMES (t:) de chaque layer dans la MÊME timeline, pas le start-time du layer. Erreur initiale networkFlow : particules invisibles car offset via `st` négatif.

### Règle : Lottie se juge EN VIDÉO, jamais en frame fixe
Le Lottie est temporel. Une frame fixe peut tomber entre 2 pulses et donner une fausse impression de faiblesse. Toujours valider sur la vidéo rendue.
