# Format Atlas — "Le concept expliqué comme un jeu vidéo"

> **Nouveau registre Atlas, créé 2026-06-14.** Dérivé de l'analyse de la chaîne Ear to Hear
> (@eartohear, 909k abonnés). Voir `feedback_explain-like-video-game.md` pour l'analyse source.
>
> ⚠️ Ce fichier = doctrine de FORMAT (script + visuel ensemble). Pour le niveau oral des phrases,
> appliquer EN PLUS `DOCTRINE-SCRIPT-UNIFIEE.md`. Pour la couche PixelLab, voir `ATLAS-PIXELLAB-PLAYBOOK.md`.

---

## Le concept

Transformer un concept abstrait ou un système en **mécaniques de jeu vidéo** : niveaux, barre de vie,
avatar, power-ups, combat, attaques nommées. Le spectateur devient le protagoniste ("imaginez que vous
êtes un personnage dans un jeu appelé...").

**Pourquoi ça marche** (Ear to Hear : 1,4M vues sur "explained as a video game", ratio 1.5x à 909k subs) :
- Le jeu vidéo est un langage universel, compris instinctivement
- Il rend tangible et VISUEL ce qui est abstrait
- La progression par niveaux = rétention mécanique (on reste pour le niveau suivant)
- Le spectateur-protagoniste = engagement émotionnel maximal

---

## ⛔ RÈGLE ÉDITORIALE D'OR — concepts OUI, tragédies NON (NON-NÉGOCIABLE)

Le format convient aux **concepts, systèmes et mécanismes**. Il NE convient JAMAIS aux **drames humains réels**.

| ✅ Adapté (concepts/systèmes) | ❌ Proscrit (tragédies réelles) |
|---|---|
| "Comment fonctionne le franc CFA, expliqué comme un jeu vidéo" | Tout conflit en cours (Sahel, guerres) |
| "L'indépendance économique, niveau par niveau" | Morts réels, famines, massacres |
| "Comment un pays sort de la dette" | Drames humains identifiables |
| "Les règles du commerce transsaharien médiéval" | Esclavage, colonisation (sujets de douleur) |

**Pourquoi :** la métaphore ludique banaliserait la souffrance. C'est l'INVERSE de la grammaire causale
War-Map (qui traite le drame avec gravité — voir `WARMAP-GRAMMAIRE-CAUSALE.md`). Un sujet ne peut pas
être à la fois un "jeu vidéo" et un drame respecté. En cas de doute : ne pas utiliser ce format.

---

## Les 3 couches visuelles (méthode Ear to Hear)

Le format n'est PAS que du pixel art. C'est l'ALTERNANCE de 3 couches qui tient sur la durée :

1. **Pixel art jeu vidéo** (cœur du concept) — perso pixel dans décor pixel, HUD (barres de vie, "LEVEL X",
   noms en pixel font, power-ups), framing combat (perso gauche / "ennemi" droite) ou side-scroller.
2. **Images documentaires réelles** (ancrage/crédibilité) — photos, cartes, archives créditées. Chez nous :
   cartes Mapbox/d3-geo, data réelle, sources. C'est ce qui empêche le format de devenir gadget.
3. **Couche de liaison humaine** — chez Ear to Hear = face-cam. Chez nous (pas de face-cam) = la narration
   GéoAfrique + les respirations carte. Notre équivalent du "lien humain".

L'alternance des 3 = anti-lassitude sur format long. Chaque couche a un rôle distinct.

---

## Ce qu'on a DÉJÀ (le format est à ~80% dans notre stack)

| Brique nécessaire | Ce qu'on a | Statut |
|---|---|---|
| Personnage pixel qui se déplace | `AtlasPixelChar.tsx` (cadence, flip, ancrage-pied) + ~50 assets PixelLab | ✅ existe |
| Déplacement avec intention sur carte | moteur War-Map (jetons/unités) + AtlasPixelChar track | ✅ existe |
| Barres/jauges/compteurs | data-viz HERO DATA (CountUp, barres) | ✅ existe |
| Décors pixel art de fond | générables via Gemini (paysages pixel élaborés) | ⚠️ à générer au besoin |
| HUD jeu vidéo (barre de vie, LEVEL, pixel font) | À CODER (brique nouvelle) | ❌ manque |
| Framing combat / side-scroller | À CODER (cadrage) | ❌ manque |

**Conclusion :** la technique de base existe. Ce qui manque = l'HABILLAGE (HUD pixel, framing) + le SCRIPT
(métaphore filée). Pas la mécanique de déplacement, qu'on maîtrise déjà via PixelLab Atlas.

---

## Méthode de script (métaphore filée)

1. **Poser la règle du jeu en ouverture** : "Imaginez que vous êtes un personnage dans un jeu appelé [X].
   Le but est de [objectif]. Mais il y a un problème : [obstacle]."
2. **Nommer les éléments en termes de jeu** : l'avatar, les niveaux, les ennemis/attaques (nommés), les
   power-ups, la barre de vie. Chaque concept abstrait = un élément de jeu.
3. **Progression par niveaux/étapes** : structurer le contenu comme des niveaux à franchir (rétention).
4. **Le spectateur EST le personnage** : "vous" d'immersion (compatible règle 8 : "vous"/"on", jamais "tu").
5. **Raccorder à la réalité régulièrement** : après chaque mécanique de jeu, la couche documentaire réelle
   (la vraie donnée, la vraie carte, la vraie source) ferme la boucle crédibilité.

Appliquer PAR-DESSUS toutes les règles de `DOCTRINE-SCRIPT-UNIFIEE.md` (clarté, incarnation, rétention).

---

## NEXT (quand on produira un premier épisode de ce format)

1. Coder la brique HUD jeu vidéo (barre de vie, "LEVEL X", pixel font, power-up popup) — réutilisable.
2. Générer 2-3 décors pixel art de fond via Gemini (style cohérent avec nos sprites PixelLab existants).
3. Choisir un PREMIER sujet "concept" sûr (ex : franc CFA, ou un mécanisme économique) — JAMAIS un drame.
4. POC sur 60-90s avant un format long, pour valider l'habillage HUD + le framing.

Lié à : [[medieval-mindset-methode]] (autre technique d'angle), `ATLAS-PIXELLAB-PLAYBOOK.md` (couche perso),
`ATLAS-PLAYBOOK.md` (doctrine Atlas générale), `DOCTRINE-SCRIPT-UNIFIEE.md` (niveau oral).
