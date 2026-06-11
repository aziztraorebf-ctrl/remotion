---
name: War-Map — Doctrine de partage Gemini vs PixelLab pour les objets sur carte
description: Règle de partage par NATURE de l'objet. Gemini = marqueurs/jetons/persos/véhicules (animés par nous). PixelLab = effets organiques (feu/fumée/explosion, animés par prompt). Validé Aziz 2026-06-11.
type: project
---

# Objets sur la War-Map : Gemini vs PixelLab (doctrine validée Aziz 2026-06-11)

Décision durable issue d'un test comparatif réel (proto beat 2.4 Sahel). Les deux outils sont excellents ;
la question n'est PAS "lequel est meilleur" mais "quel outil pour quel TYPE d'objet".

## La règle de partage — par NATURE de l'objet

| Type d'objet | Outil de création | Animation |
|---|---|---|
| **Marqueurs / jetons / personnages / véhicules** (formes nettes, identité forte, déplacement avec intention narrative) | **Gemini** (`gemini-3.1-flash-image-preview`) + détourage Recraft | **NOUS-MÊMES** dans Remotion : track/path frame-driven, walk-cycle, drift, rotation tangente, spring. On maîtrise déjà. |
| **Effets organiques** (feu, flammes, fumée, explosion, poussière, onde de souffle, débris) | **PixelLab** (`create_map_object` + `animate_object`) | **PAR PROMPT** : PixelLab génère les frames depuis une phrase ("la fumée monte"). Fin de la friction Lottie/JSON. |

## Pourquoi ce découpage (la logique)

1. **Le pixel ne se "voit" que là où il ne dérange pas.** Un effet de feu/fumée est une matière CHAOTIQUE —
   personne ne juge s'il est "100% 3D" ou pixel. Le pixel s'y fond. Alors qu'un marqueur/perso a un TRAIT
   que le pixel dégraderait → Gemini (encre fine) y est supérieur.
2. **On garde notre force pour ce qui a une INTENTION narrative.** Un convoi qui *avance vers* l'uranium,
   un jeton qui *prend* un territoire = mouvement contrôlé frame par frame (Remotion), PAS une boucle PixelLab.
   L'animation programmable reste à nous pour tout déplacement signifiant.
3. **On ne paie le coût du pixel** (pixels visibles à l'échelle full HD + PixelLab lent ~6min/anim) **que là
   où le bénéfice** (animation organique gratuite, impossible sans coder du Lottie) **le dépasse largement.**

## ⭐ Le pont Gemini→PixelLab pour les effets PREMIUM (clé)

Le seul vrai défaut du pixel pur = un feu "générique jeu vidéo". Solution : **créer l'effet via Gemini**
(NOTRE palette, style, intensité voulus) **puis le donner en image de référence à PixelLab** (`init_image` /
`style_image` sur bitforge, ou `style_images` sur create object) → PixelLab ne fait QUE l'animer.
On contrôle le LOOK (Gemini), PixelLab fait le MOUVEMENT. Meilleur des deux pour les effets.

## ⭐ RÈGLE PONCTUEL vs AMBIANT (classer AVANT d'animer — Aziz 2026-06-11, non-négociable)

Toutes les animations d'effet ne se jouent PAS de la même façon. Avant d'intégrer un effet PixelLab, le classer :

| Régime | Exemples | Lecture | Mécanique Remotion |
|---|---|---|---|
| **PONCTUEL (one-shot)** | explosion, impact, flash, largage, tir | joue UNE FOIS puis **DISPARAÎT** | 0→N puis `opacity→0`. JAMAIS de boucle (une explosion ne se "dé-explose" pas). |
| **AMBIANT (continu)** | fumée qui monte, feu qui brûle, drapeau qui ondule, poussière, brume | **BOUCLE tant que la condition dure** | ping-pong (0→N→0) ou loop seamless. JAMAIS figer (= effet statique = rejeté). |

Règle d'or : **ne jamais boucler un ponctuel, ne jamais figer un ambiant.** Le proto 2.4 : fumée = ambiant
(ping-pong) ; une explosion d'amorce sur la base = ponctuel (one-shot + fade). Discipline anti-saturation
maintenue : 1 foyer d'attention à la fois, ne pas multiplier les effets simultanés.

## Garde-fous techniques

- **Loop seamless (ambiant)** : un effet continu (base qui brûle 4s) doit boucler sans saut visible. PixelLab v3 ne
  garantit pas toujours le raccord frame N→0. Vérifier ; si ça saute → ping-pong (0→N→0) ou crossfade au raccord.
- **PixelLab est LENT** (~6 min/animation en charge). Lancer en async, programmer un réveil, jamais bloquer.
- **Bug lib REST locale** : utiliser le MCP PixelLab (la lib pip plante au parsing sur abonnement). Voir `memory/tools/pixellab.md`.
- **Taille sur carte** : les objets Gemini doivent être assez GROS pour être lisibles (Aziz 2026-06-11 : les
  objets PixelLab paraissaient plus gros/lisibles). Viser ~0.20-0.24 vmin de large pour un marqueur principal.

## Application proto 2.4 (cas de référence)
- Fortin FR (marqueur) = **Gemini** (`base-fr-td.png`).
- Base qui tombe → effet **fumée/effondrement PixelLab** (remplace le Lottie `extinctionCollapse` codé main).
- C'est le cas d'usage parfait : effet organique, moment fort, là où le Lottie était la friction.

Voir aussi : [[feedback_sprites-topdown-gemini-vs-recraft]] (recette sprites top-down) +
[[WARMAP-LONG-DOCTRINE]] (3 registres d'enrichissement) + `memory/tools/pixellab.md`.
