# Bibliothèque SVG partagée — Index principal

> Point d'entrée pour tout agent vierge qui veut réutiliser un élément SVG ou une technique d'animation.
> Consulter en début de production d'une scène SVG, AVANT d'écrire du code.
> Table intention → technique/élément : `INTENTION-FORME-SVG.md` (question « comment faire X ? »).

---

## Éléments disponibles

| Élément | SVG | Fiche .md | Registre | Source (beats) |
|---|---|---|---|---|
| Arbre Sahel (tronc double + houppier 9 cercles) | `elements/nature/arbres/arbre-sahel-ggw.svg` | `arbre-sahel-ggw.md` | Encre narrative | GGW B2, B3, B5, B7 |
| Souche FMNR (petite + gros-plan + cambium) | `elements/nature/souches/souche-fmnr-ggw.svg` | `souche-fmnr-ggw.md` | Encre narrative | GGW B4, B5 |
| Bulbes dormants + épi récolte | `elements/nature/graines/bulbes-dormants-ggw.svg` | `bulbes-dormants-ggw.md` | Encre narrative | GGW B5, B6 |
| Soleil radiant (variante jaune + or ardent) | `elements/nature/astre/soleil-radiant-ggw.svg` | `soleil-radiant-ggw.md` | Encre narrative | GGW B2, B3, B4, B5, B7 |
| Sol aride + craquelures (3 variantes) | `elements/nature/sol/sol-craquele-ggw.svg` | `sol-craquele-ggw.md` | Encre narrative | GGW B3, B4, B6 |
| Structures (bâtiments, murs, remparts) | — | — | — | extension future |

---

## Techniques disponibles

| Fiche | Chemin | Quand l'utiliser |
|---|---|---|
| `reveal-clippath-bottom-up.md` | `techniques/` | Un élément grandit de bas en haut : arbre, eau qui monte, barre de remplissage |
| `buvard-circulaire.md` | `techniques/` | Une couleur se répand depuis un point central : feuille qui verdit, territoire qui s'étend |
| `spring-elastique-overshoot.md` | `techniques/` | Apparition avec rebond organique : vivant, pas mécanique (damping:9, stiffness:140, mass:0.8) |
| `strokeDashoffset-drawing.md` | `techniques/` | Un trait se dessine progressivement : hachures du sol, lignes de contour, silhouette |
| `glow-pulse-sinusoidal.md` | `techniques/` | Un élément respire ou brille en boucle : soleil, lueur de vie, pulsation |
| `sway-houppier.md` | `techniques/` | Un feuillage se balance au vent : rotation sinusoïdale sur le houppier isolé |

> Les fiches `techniques/*.md` sont créées séparément (agent dédié). Ce tableau en liste les noms définitifs et leur rôle.

---

## Registre encre GGW — palette narrative complète (extraite du code source)

| Rôle narratif | Valeur | Quand apparaît |
|---|---|---|
| Fond parchemin | `#e8dcc0` | permanent |
| Encre (contours, texte) | `#2b2117` | permanent |
| Vert tendre (jaillissement initial) | `#6fa85a` | arbres qui repoussent (début) |
| Vert vif (apogée végétal) | `#3e8f34` | climax vie, FMNR prouvé |
| Vert foncé (contours végétaux) | `#295c1c` | stroke houppier + feuilles |
| Vert-terre vie cachée (cambium) | `#5d7d3a` | cambium souche, sol vivant |
| Vert-terre sol vivant | `#5e8a3a` | tige épi, herbe au sol |
| Or soleil jaune | `#e8b44a` | soleil B4/B5 (espoir) |
| Or ardent (embrasement) | `#f2b53a` | soleil B2 (menace) |
| Or glow (flare) | `#ffd86b` | halo flou derrière soleil |
| Doré récolte (grains) | `#c9a13b` | épis de blé, grains |
| Doré récolte foncé | `#977418` | détails grains + barbes |
| Ocre terre (couleur diagnostic) | `#b5651d` | sol mort, la cause de l'échec |
| Terre vivante (racine remontante) | `#8a5a2c` | connexion sol→arbres (B6) |
| Gris neutre mort | `#cdbd9a` | arbre encre neutre, ombre |
| Gris mort (mort sans vie) | `#8f8a7e` | arbres encre sur sécheresse |

**Règle de progression chromatique GGW** : encre pure (#2b2117) → vert tendre (#6fa85a) → vert vif (#3e8f34). L'ocre (#b5651d) est la seule touche "diagnostic de l'échec". La couleur arrive toujours en dernier (le climax), pas au début.

---

## Registres visuels disponibles

> Source de vérité complète (palettes hex, harnais, règles modèle LLM) : `memory/doctrines/SVG-SCENES-GENERATIVES.md` § REGISTRES VISUELS PROUVÉS.
> Ce tableau = résumé de décision rapide. Protos animés validés : `svg-library/RD-INDEX.md`.

| Registre | Ton | Brille pour | Modèle LLM | Harnais |
|---|---|---|---|---|
| `encre` | Parchemin crème #e8dcc0, traits brun-noir #2b2117 | Figures historiques, emblèmes, scènes narratives (GGW) | Gemini (organique) ou GPT-5.5 (géométrie) | `SvgSceneParchemin.tsx` |
| `médaille` | Or patiné #e7bd78, traits rouges #8a2a20, ivoire #f2ebd9 | Objet-symbole, scène narrative chaude (port, ville) | Gemini (ville/profondeur) · GPT (schéma net) | `SvgSceneCoin.tsx` |
| `blueprint` | Bleu nuit #0d1b3a, cyan #7fd4ff, or #c8a951 | Infrastructure, mécanisme, schéma technique (gazoduc, barrage) | Gemini (justesse technique) · GPT (lisibilité flux) | `SvgScenePlanche.tsx` |
| `tactique` | Bleu très sombre #0b1526, rouge #d6552e (menace), or #c8a951 | Encart conceptuel : pacte, rapport de force, doctrine (War-Map/AES) | GPT-5.5 | compo dédiée |
| `braise-or` | Terre sombre #1c1108, ocres #7a4a22→#b8763a, or lumineux #e8b44a | Scène chaude matérée : mine, ressource, désert ardent | Gemini | compos dédiées |
| `or-jour` | Ciel ambre #f2cf72, nuages ivoire #f7eccf, terre ocre CLAIRE #c98a4a | Scène chaude LUMINEUSE et premium (matin doré, héros en action) | GPT-5.5 | `HeroGptAnimee.tsx` |
| `papier-decoupe` | Couches pleines empilées + ombre portée, palette claire chaude (ciel pastel, crème, verts étagés) | Scène pédagogique/explainer : cycle, croissance, processus (façon Kurzgesagt) | Gemini (couches organiques) | `GraineGeminiAnimee.tsx` |

**Règle de choix** : intention ORGANIQUE/profondeur → Gemini. Intention GÉOMÉTRIE/schéma → GPT-5.5. Toujours générer les 2 et choisir sur render statique.

---

## R&D et protos validés

Voir `svg-library/RD-INDEX.md` — index des scènes R&D validées avec render catbox, verdict, et fichier source. À consulter avant de coder une nouvelle scène pour éviter de recoder l'existant.
