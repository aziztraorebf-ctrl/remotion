# REPRODUCTION — « Foster With Confidence » (chantier prochaine session)

> **Décision d'Aziz, 2026-08-26** : arrêter d'inventer nos propres clients fictifs et
> **reproduire de A à Z une vidéo réellement vendue sur Fiverr**. Si on reproduit
> plusieurs vidéos dans des registres différents avec notre stack, on sait qu'on est
> outillé pour la plupart des scénarios.
>
> **Pourquoi c'est un meilleur test que tout ce qu'on a fait** : jusqu'ici on notait
> notre propre copie — on choisissait le sujet, le registre, le niveau d'ambition, donc
> on ne pouvait pas vraiment échouer. Une vidéo qu'on n'a pas choisie, avec ses
> contraintes à elle, est le premier test qui peut dire non.
> **Bénéfice commercial** : « voici une vidéo vendue sur Fiverr, voici la nôtre » vaut
> mieux que n'importe quel showreel de nos capacités.

## LA SOURCE (sécurisée sur disque)
`public/_client-sim/_references/foster/foster-with-confidence.mp4`
2460×1080 · 42,75 s · 1273 frames · 62 Mo · **musique seule, ZÉRO voix off** (Whisper
ne trouve aucune parole). Produit : SaaS pour familles d'accueil au Royaume-Uni
(Ofsted, conseils municipaux, £590k de récurrent annuel).
⚠️ Provenance : lien catbox fourni par Aziz — **copié sur disque, ne pas dépendre du lien**.
⛔ **NON VERSIONNÉ** (60 Mo, `.gitignore` exclut les `.mp4`) : le fichier vit sur disque
seulement. S'il disparaît, le lien d'origine était `https://files.catbox.moe/5f5w19.mp4`
(catbox n'est PAS une archive — vérifier qu'il répond avant de compter dessus).

## NIVEAU DE RÉUSSITE VISÉ (à trancher avec Aziz avant de coder)
1. **structure** — même découpage, même rythme, même durée
2. **gestes** — chaque mouvement reproduit avec notre stack
3. **pixel** — mêmes couleurs, même typo, timing exact
→ **Reco : viser 1 + 2, le pixel est un bonus.** Une reproduction qui raconte la même
chose avec nos briques prouve l'outillage ; une reproduction au pixel prouve surtout
qu'on sait recopier.

## DÉCOUPAGE MESURÉ — 13 transitions détectées

Coupes franches (seuil 0.30) : **1,60 · 5,60 · 18,03 · 18,41 · 25,06 · 27,07 · 28,07**
Transitions douces (seuil 0.12) ajoute : 11,44 · 11,51 · 11,57 · 11,64 · 13,59 · 40,46

| # | Temps | Contenu | Moteur | Notre brique | État |
|---|---|---|---|---|---|
| 1 | 0 → 1,6 | Téléphone seul sur noir, écran allumé **12:57** | 3D + UI | `PhoneModel` + plaque | ✅ |
| 2 | 1,6 → 5,6 | **Le décor s'allume** (bureau vu du dessus, tapis de découpe) puis **zoom continu de 4 s** jusqu'à l'intérieur de l'écran. Ellipse temporelle : 12:57 → 9:38 **sans coupe** | décor + caméra | `DeviceInScene` + décors générés | ✅ |
| 3 | 5,6 → 11,4 | Typo pure sur noir : *« Still unresolved, »* mot par mot | typo | `DeviceShowreel` ch. 3-4 | ✅ |
| 4 | 11,4 → 13,6 | **6 portraits d'enfants** en couronne autour de « Assembles », fond dégradé vert | images + compo | ⚠️ **à générer (Gemini)** | 🔶 |
| 5 | 13,6 → 18,0 | Suite typo sur dégradé vert | typo + fond | `GridBackdrop` (variante dégradé à faire) | 🔶 |
| 6 | 18,0 → 18,4 | **Google Earth**, vue satellite du Nebraska avec labels | carte | **Mapbox 3D** (supérieur : frame-driven) | ✅ |
| 7 | 18,4 → 25,1 | **Descente** vers une maison + **flou radial** qui masque le raccord + **vraie vidéo** de maison + cartouches iOS flottants | raccord | Mapbox + ⚠️ **clip à générer (H3)** | 🔶 |
| 8 | 25,1 → 27,1 | **Dashboard qui monte par le bas**, zoom sur les montants (£49,245 / £590,940) | UI produit | **`PageCam`** — notre point fort | ✅ |
| 9 | 27,1 → 28,1 | Transition | — | — | ✅ |
| 10 | 28,1 → 40,5 | Typo sur **dégradé vert-brun**, montée vers le CTA *« Foster With Clarity / Certainty / Confidence »* | typo + fond | idem #5 | 🔶 |
| 11 | 40,5 → 42,8 | Fondu au noir, texture pointillée | fondu | trivial | ✅ |

## LES 2 TROUS, ET LA DÉCISION D'AZIZ
1. **La maison filmée (#7)** → **Minimax H3**. Aziz : « juste les mouvements de caméra
   qui se rapprochent de la maison », donc un clip court suffit. Fiche : `memory/fiches/FICHE-CLIP-GENERE.md`.
2. **Les portraits d'enfants (#4)** → **images générées Gemini** (ce sont des photos
   fixes dans la référence, pas des vidéos). ⚠️ Passer par les templates avant tout prompt
   (règle projet : diversité des visages, ethnicity, enfant en scène — erreurs déjà payées).

## CE QUI EST DÉJÀ PRÊT (acquis de la session 2026-08-25/26)
- `devices/PhoneModel` · `LaptopModel` — mockups procéduraux, écran = zone d'accueil
- `devices/DeviceInScene` — objet posé dans un décor, ombre 3 couches, allumage 0,30 s
- `devices/DeviceShowreel` — texte derrière / à côté, rotations
- `devices/FlatDeviceMotion` — matériau aplati (le défaut retenu)
- `devices/GridBackdrop` — fond SVG à 6 paramètres
- Shotcraft : `PageCam`, `FlashCut`, `DigitRoll` + captures desktop ET mobile
- SFX : `public/_client-sim/noteshield/sfx/` (19 fichiers)

## ⛔ LES PIÈGES DÉJÀ PAYÉS SUR CETTE VIDÉO
- **Ne PAS juger sur des frames espacées.** J'ai analysé cette vidéo sur 16 frames sur
  1273 (une toutes les 2,7 s) et raté l'essentiel : les 12 transitoires sonores en 8 s,
  les micro-états, l'ellipse temporelle dans le zoom. **Juger un montage sur des photos
  ne marche pas.**
- **Le flou du raccord #7 n'est pas décoratif** : c'est le MASQUE de la coupe entre
  Google Earth et le plan filmé. Même principe que `FlashCut`.
- **Le fond CHANGE selon le registre** (noir plat pour l'objet, dégradé vert pour le
  produit). « Fond uni toujours » était une généralisation abusive tirée de Comma.
- **12 transitoires sonores en 8 s** : chaque apparition a son SFX. C'est ce qui rend
  « vrai ». ⛔ Pas de whoosh sur une UI.

## PREMIÈRE ACTION DE LA PROCHAINE SESSION
Trancher le niveau de réussite visé, puis attaquer dans l'ordre du découpage —
les plans ✅ d'abord (ils valident le rythme), les 🔶 ensuite (ils demandent des assets).
