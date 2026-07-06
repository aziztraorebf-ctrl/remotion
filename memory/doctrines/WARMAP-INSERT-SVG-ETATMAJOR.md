# WARMAP INSERT SVG "ÉTAT-MAJOR" — Doctrine + workflow réutilisable

> Créé 2026-07-06. Prototype VALIDÉ par Aziz (Khartoum beat #5, attaque RSF 15 avril 2023).
> **C'est NOTRE manière de faire** un insert "carte de guerre" quand on veut représenter une
> **prise de territoire / mouvement de forces / assaut coordonné** — SANS Mapbox, en SVG pur,
> registre « médaillon d'état-major gravé » (sable/or/rouge, top-down, style Kings & Generals /
> Battle Probe humanisé). Réutilisable pour tout insert de ce type dans une vidéo war-map.
>
> ⛔ **Quand PAS l'utiliser** : si la scène a besoin de la VRAIE géographie situable (frontières
> exactes, zoom sur un pays réel, franchissement géographique précis) → c'est Mapbox/d3-geo
> ([[WARMAP-PLAYBOOK]]). Cet insert-ci est une ILLUSTRATION de plan de bataille, pas une carte de
> données géo. Diagnostic clé (prouvé en session) : Mapbox = moteur de DONNÉES, pas d'ILLUSTRATION.

## Le livrable de référence

- **Composition Remotion** : `KhartoumEtatMajorSVG` (`src/projects/warmap/KhartoumEtatMajorSVG.tsx`).
- **Render validé** : `out/_rnd/khartoum-etatmajor-svg/versions/khartoum-etatmajor-PROTOTYPE-VALIDE.mp4`
  · catbox `https://files.catbox.moe/t96in1.mp4`.
- **Fond SVG source** (statique, source de vérité visuelle) : `out/_rnd/khartoum-etatmajor-svg/khartoum-svg-RECOMPOSE.svg`.
- **Planche R&D effets animés** : `KhartoumFxDemo` (`src/projects/warmap/_rnd/KhartoumFxDemo.tsx`),
  render `out/_rnd/khartoum-etatmajor-svg/fx-demo/fx-demo-anim.mp4`.
- **Décodage méthode + pistes écartées** : `out/_rnd/khartoum-etatmajor-svg/DECODE-NOTES.md`.

## Les briques du pattern (ce qui compose l'insert, tout en SVG frame-driven)

1. **Fond « carte d'état-major »** : terrain organique + fleuve + cadre/cartouche + légende, palette
   sable `#d9c092` / or `#e7bd78` / rouge encre `#8a2a20` / ivoire `#f2ebd9`, traits `#2b2117`.
   Top-down strict (jamais de 3D/perspective).
2. **Cibles = bâtiments illustrés top-down** (pas des croix nues) : ex. aéroport (piste+terminal+avions),
   palais (cour+colonnade+grille), tour TV (mât+haubans). Chacun dans un `<g id="target-*">`, révélé
   par sonar + crosshair.
3. **Forces = FORMATION de 4 portraits ronds** (`portrait-rsf.png` en cercle parchemin, bordure rouge,
   liseré faction) qui AVANCENT vers la cible. Choix validé vs véhicules SVG et vs pion NATO : le
   portrait donne la **touche humaine** (on voit QUI attaque) et reste lisible à toute échelle.
   ⚠️ Le visage NE TOURNE JAMAIS (translate seul, pas de rotate) — « un visage ne tourne pas ».
4. **Mouvement organique** : Bézier directe RSF→cible, easing `inOut(quad)` + swagger latéral
   sinusoïdal déphasé par jeton + léger cahot vertical. ⛔ PAS de saccade/charge finale (testé,
   rejeté par Aziz : « ça fait bizarre »). Poussière de traînée derrière chaque jeton (particules
   déterministes qui s'effacent — sens du déplacement).
5. **Impact** : flash + 2 anneaux d'onde de choc (ripple) qui s'étendent.
6. **Statut CAPTURÉE (le dénouement, crucial)** : après l'impact, (a) le BÂTIMENT devient
   semi-transparent (`buildingOpacityFor`, ~0.32 = vidé/détruit) + (b) un **sceau « R »** s'installe
   dessus (le losange de nos jetons = marqueur de possession) + (c) fumée montante (`feTurbulence`)
   persistante. Lecture immédiate : « détruit ET pris par la RSF ». ⛔ PAS de teinte rouge
   par-dessus (testé, rejeté : le bâtiment lui-même qui change est plus propre).
7. **Séquence en phases** : établissement → cible 1 → cible 2 → cible 3 → résolution. JAMAIS
   simultané (une cible à la fois). Sous-titre qui change par phase. Camera shake au contact.

## Identité RSF réutilisable (généralisable)

Le **losange biseauté + lettre** = notre système de pion faction, réutilisable pour toute faction
(« R » = RSF ; un « S » pour SAF le jour où les deux camps s'affrontent). Le monogramme lettre est
lisible net à toute échelle (testé vs texte « RSF » entier = illisible en petit, vs rosette/sabre =
motifs abstraits sans identité). Le même « R » sert de sceau de capture → langage unifié : le symbole
qui attaque marque la possession.

## ⭐ LE WORKFLOW qui a mené au prototype (à reproduire pour un nouvel insert de ce type)

Ordre chronologique prouvé (5 sessions). Ne pas sauter d'étape — c'est la cause des boucles passées.

1. **DÉCODER la référence** (une fois) : télécharger 1-2 vidéos du genre (Battle Probe, Kings &
   Generals) via yt-dlp, extraire des frames, noter la GRAMMAIRE réelle (ex. Battle Probe = masses
   de cercles simples identiques en formation + portrait de commandant par groupe, PAS des jetons
   détaillés individuels). → `out/_r-and-d/decode-battleprobe/`.
2. **PROTOTYPE codé simple** : coder un proto fonctionnel (positions/timing/phases prouvés,
   esthétique brute). Rendre UNE frame propre = image de référence de composition.
3. **FOND SVG via LLM** (la recette qui marche) : envoyer la frame de réf à Gemini 3.1 Pro ET
   GPT-5.5 en PARALLÈLE (même prompt), en séparant EXPLICITEMENT : contraintes FONCTIONNELLES à
   garder (positions, labels, palette, cadre, viewBox 1920x1080, top-down) vs LIBERTÉ créative
   totale sur l'exécution (style terrain, richesse, comment dessiner les bâtiments). ⛔ NE PAS
   sur-verrouiller (« garde EXACTEMENT ce contour » → rejeté ; « garde la fonction, invente la
   forme » → marche). Script : `scripts/tools/gemini-vision-breakdown-highoutput.py`
   (`max_output_tokens=32000` — le défaut 8000 tronque un SVG détaillé) + `openrouter-vision-breakdown.py`.
   Toujours rendre le SVG reçu (`rsvg-convert`) pour VÉRIFIER que c'est du vrai vecteur avant de juger.
4. **RECOMPOSER** : prendre le meilleur fond (souvent le plus sobre/lisible = Gemini) et y
   transplanter les meilleurs éléments de l'autre (bâtiments GPT, ou fichiers `-topdown-v2.svg`
   régénérés via pipeline GLM→agent Sonnet, cf. [[tools/openrouter-svg]]). Ajuster échelles/positions
   à la main. Vérifier chevauchements en review visuelle (ex. fleuve qui coupe un bâtiment).
5. **INTÉGRER en JSX Remotion** : porter le SVG recomposé comme fond statique + la logique
   d'animation (phases, spring/interpolate, sonar, impacts) au-dessus. Attributs camelCase.
6. **JETONS/EFFETS** : générer les éléments mobiles (jetons, véhicules, effets) en SVG — c'est là
   que le SVG bat le bitmap (recolorable, léger, animable par sous-partie). Pour les visages :
   PNG portrait en cercle (le SVG génératif est mauvais sur les visages — assumé).
7. **ITÉRER par A/B render VIDÉO** (pas frames figées) : à chaque choix de goût (style jeton, effet,
   mouvement), rendre 2-3 vidéos complètes et laisser Aziz trancher sur le mouvement réel. Un effet
   peut être bon figé et raté animé (ou l'inverse).
8. **EFFETS SVG** disponibles (planche `KhartoumFxDemo`) : fumée (`feTurbulence`+volutes montantes),
   poussière (particules déterministes), incendie (flammes vacillantes), tirs radiaux. Validés pour
   ce registre : **fumée + poussière** (sobres, servent le récit). Écartés : incendie + tirs
   (basculent vers « jeu vidéo », alourdissent). Doser TRÈS petit si utilisés.

## Gotchas techniques (ne pas reperdre)

- `feTurbulence` : `seed` doit varier par frame (`Math.floor(frame/4)`) pour animer la déformation.
  ⛔ `Math.random()` interdit en Remotion (casse la reproductibilité frame) → jag déterministe
  (`Math.sin(i*12.9898)*43758.5453`).
- Filtres SVG : `id` unique par cible (dériver de la position) sinon collision de `<defs>`.
- Narrowing TS : une `const STYLE: "a"|"b" = "a"` jamais réassignée est resserrée par TS au littéral
  → caster `(STYLE as string)` dans les comparaisons, ou passer par une variable non-const.
- Rendu net = juger UNIQUEMENT sur `scale=1` full HD (les stills suffisent, mais le mouvement se
  juge en vidéo complète).

## Ce que ce prototype ouvre (pistes prochaine session — voir NEXT-ACTION)

- Réutiliser tel quel pour d'autres beats de prise de territoire (Soudan et au-delà) — changer
  fond/cibles/faction, garder toute la mécanique.
- Bibliothèque de sceaux-factions (R=RSF, S=SAF…) + généraliser en composant paramétré.
- Tester : lignes de front qui reculent (déjà codé, `FrontLine`), zones de contrôle qui se remplissent,
  contre-attaque (2 factions qui s'affrontent), flèches de manœuvre qui se tracent.
- Industrialiser le workflow §étapes en un `/beat`-like dédié aux inserts SVG état-major.

Voir aussi : [[WARMAP-PLAYBOOK]] (war-map Mapbox/d3-geo, le cas géo réel) · [[CONTINUITE-SCENE-INTENTION-DABORD]]
(INTENTION→FORME→template) · [[tools/openrouter-svg]] (pipeline GLM→agent Sonnet pour les assets) ·
[[SVG-SCENES-GENERATIVES]] (SVG génératif LLM).
