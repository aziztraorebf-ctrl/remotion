# R&D — Chaîne de clips générés (test « scribe de Tombouctou »)

> Session 2026-08-18. **Point d'entrée unique** de tout ce qui a été prouvé sur la production de
> vidéo par clips générés + montage. Ce fichier NE DUPLIQUE PAS le détail : il pointe vers les fiches
> qui font autorité.

## Pourquoi ce chantier
Analyse de la chaîne **Animistry** (@ytAnimistry, 3,6k abonnés en 2 semaines, 22-60k vues/vidéo dans un
voisinage de 30 chaînes IA plafonnant à 1-3k). Son auteur a publié son workflow : previs Blender →
Seedance, personnages Midjourney, nettoyage Photoshop. Objectif : reproduire ce que ça permet **sans
Seedance ni Blender**, sur notre GPU H3 gratuit.

## Ce qui est PROUVÉ (mesuré, pas jugé à l'œil)
| acquis | mesure | où est le détail |
|---|---|---|
| Chaîne de 4 clips 5 s raccordés | 496 frames, 0 gel, style stable | `memory/fiches/FICHE-ASSEMBLAGE.md` |
| Raccord invisible = **coupe sur changement d'échelle** | 3 raccords tenus | ↑ |
| Continuité décor entre 2 plans même cadrage | **1,0-1,4 %** hors-sujet, 6,6 % sujet | `edition-video-ciblee-omni-seedance.md` |
| Édition chirurgicale d'un OBJET | cible 5-7 %, hors-cible 1 % | ↑ |
| ⛔ Édition d'un ÉCLAIRAGE = redessin global | hors-cible 10-11 % | ↑ |
| **seed + prompt identiques → même animation** | corrélation **0,823** | [[seed-prompt-archives-regenerer-sans-perdre-animation]] |
| ⛔ Modifier 1 clip casse les plans voisins | robe verte au plan 3, indigo au 4 | `edition-video-ciblee-omni-seedance.md` |
| **Previs → mouvements de caméra** | 0,68 → **38-45**/255 | `memory/fiches/FICHE-CLIP-GENERE.md` ⭐ |
| ⭐⭐⭐ **Previs en NIVEAUX DE GRIS = fix du décrochage** | gradient min 3,4 → **8,52** (orbite), 11,39 (10 s) | `memory/fiches/FICHE-CLIP-GENERE.md` |
| ✅ Orbite 180° réussie (défaut restant : caméra traverse le mur à 2,5 s) | contraste sujet 14,4 vs 37-42 | ↑ |
| ⛔ H3 suit la DIRECTION du previs, pas son RYTHME | 75 % du mouvement fait à 25 % du temps | ↑ |
| ✅ **Crane-up** : 4 s exploitables sur 5 | plongée 3/4, gradient 14,2 | ↑ |
| ⛔ H3 génère de la parole non demandée | -39,8 dB vs -58,1 dB | `minimax-h3-comfy-cloud.md` |
| ⛔ Gros plan en style simplifié → recadrer | l'édition refuse de simplifier un visage | [[gros-plan-style-simplifie-recadrer-pas-generer]] |
| ⭐⭐⭐⭐ **Previs d'ACTION** : piloter le GESTE (pas que la caméra) | bords 0,6-1,1 (caméra fixe) · centre 6,9-9,6 (geste) | `memory/fiches/FICHE-CLIP-GENERE.md` |
| ⭐⭐⭐⭐⭐ **ACTION + CAMÉRA dans le même clip 10 s** | bords 2,79 (fixe) → 43,48 (push-in) · style 11,8→13,1 | ↑ |
| ✅ Objet manipulé : posé, il RESTE en place | previs objet à chaque frame + état déclaré + négatifs | ↑ |
| ✅ Clip **10 s** sans décrochage | gradient 11,4 → 15,8 | ↑ |

## Registre visuel retenu
**Sunjata** (trait brun chaud, aplats mats, grain papier, palette ocre) — pas Thiaroye (froid,
documentaire), pas Poster Vector (décor vide, visage sans traits, incompatible gros plan).
Motif : Animistry va vers du 3D-like façon Pixar = le rendu par défaut de l'IA, que tout le monde
imitera. Notre trait dessiné est **différenciant et ne porte pas les tells du « slop »**.

## Livrables — ⭐ TOUT SUR DISQUE
**`out/_r-and-d/scribe-tombouctou/MANIFESTE.md`** = table clip → previs → seed → prompt, pour chaque clip
validé ET chaque échec conservé. 54 Mo, 104 fichiers : 18 clips, 3 montages, 12 previs (mp4+gif),
6 générateurs `mkprevis*.py`, graphes API, prompts, images sources.
⚠️ Les liens Vercel Blob peuvent expirer — le disque fait foi.
Montage final https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/scribe-MONTAGE-v2-BzaSBuaYtWgTmlErMLEvVy2d0Kd7lK.mp4

## PROCHAINE SESSION — décidé avec Aziz (2026-08-19)

### ⭐ Priorité 1 — SORTIR DU TEST : un vrai plan dans un épisode réel
Prendre un moment d'un épisode existant (Gazoduc ou autre) **où la couche humaine manque**, et produire
8-10 s pour de bon. C'est ce qui dira si la méthode survit à une contrainte narrative réelle.
**Usage visé (décision Aziz)** : insertion **chirurgicale** — hook d'ouverture, relance à mi-parcours,
là où l'attention retombe. ⛔ PAS une vidéo entièrement animée pour l'instant (40 plans = 40 raccords,
on en a validé 3). ⭐ Corollaire d'écriture : **penser ces scènes DÈS le script**, comme un moteur
visuel à part entière — « ici on quitte la carte pour un visage ».

### Défauts identifiés à corriger
1. ⚠️ **Morphing des jambes au lever** (repéré par Aziz) : assis en tailleur, il passe à debout par un
   fondu des jambes au lieu de les décroiser puis pousser. Subtil mais « crie l'IA ».
   → Décomposer le lever dans le previs en 3 temps (décroiser → genou au sol → se redresser), avec des
   blocs de jambes distincts. Même logique que la décomposition de la caméra.
2. ⚠️ **Orbite : la caméra traverse le mur** à 2,5 s (contraste sujet 14,4 vs 37-42).
   → Mur sur 270° avec ouverture côté caméra · rayon < distance aux murs · ou orbite 90-120°.
3. ⚠️ **Deux mouvements de CAMÉRA consécutifs** (push PUIS latéral) : non acquis, H3 précipite 75 % du
   mouvement dans le premier quart. NB : action+caméra marche, car natures différentes.
   → Marqueur visuel de phase dans le previs · timecodes explicites dans le prompt.

### Paliers non testés
4. **Previs d'action à 2 personnages** (combat, échange) — cumule 2 sujets + contact + dynamique.
5. **Chaîne longue** : tenir 4 raccords ≠ tenir 20.
6. **Raccord sur le même axe** (sans changement d'échelle) — le cas qui avait échoué sur canada-red-bay.
7. **Outiller le previs en Remotion** (`interpolate` sur des formes) — prérequis d'une vidéo complète,
   pas de l'usage chirurgical.
