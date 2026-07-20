---
name: starter-grok-imagine-app-test
description: Prompt de reprise pour tester Grok Imagine via l'app SuperGrok (multi-image storyboard + Extend from Frame) apres abonnement pris.
metadata:
  type: project
---

# Starter — Test Grok Imagine app (SuperGrok) apres abonnement

Copier-coller ce prompt en debut de prochaine session Grok Imagine.

---

J'ai pris l'abonnement SuperGrok ($30/mois). On reprend la R&D Grok Imagine 1.5 la ou on l'a laissee.

Lis d'abord ces 3 fichiers dans l'ordre :
1. `memory/checklists/GROK-IMAGINE.md` — section "Protocole de test — App SuperGrok" en bas du fichier, c'est le plan d'action exact a executer maintenant
2. `memory/tools/grok-imagine-rules.md` — les 8 regles prouvees (R1-R8) par nos tests API du 2026-07-04, notamment R7 (raccord de clips independants juxtaposes = echec visible) qu'on cherche a corriger avec l'app
3. `memory/tools/grok-imagine-prompts.md` — les prompts exacts deja testes, le tableau des 6 tests avec couts reels

Contexte en une phrase : on a teste l'API `grok-imagine-video-1.5` sur un pecheur en pirogue qui lance un filet et pose un poisson dans un panier. Le meilleur resultat (v3, prompt complet dans `grok-imagine-prompts.md`) a corrige la duplication d'objets et le morphing de visage en verrouillant l'image de depart via Gemini AVANT le prompt video. Mais on n'a pas reussi a chainer proprement plusieurs clips (Video Extension cassee sur l'API pour ce modele, clips independants juxtaposes = raccord visible).

Objectif de cette session : verifier si l'app resout ca via (a) le multi-image storyboard natif (`@image1`/`@image2`, jusqu'a 7 images, rapporte par la recherche mais jamais teste par nous) et (b) le bouton "Extend from Frame" natif de l'app (different de l'API qui a echoue 2x avec `internal_error`).

Les images-cles sont deja pretes : `public/assets/pecheur-grok-test/scenes/pecheur-etat-A-filet-plie.png` (filet deja en main, panier vide) et `pecheur-etat-B-poisson-en-main.png` (poisson en main, filet range) — ou via catbox si plus simple a uploader depuis mobile : https://files.catbox.moe/l2gz6p.png

Guide-moi pas a pas dans l'app (je n'ai pas encore l'interface sous les yeux, donc demande-moi ce que je vois a chaque etape plutot que de presumer les boutons). A la fin, on compare le resultat a notre v3 API et on met a jour `grok-imagine-rules.md` (deplacer R13/R14 de [RAPPORTE] vers [PROUVE] ou [INFIRME] selon ce qu'on observe).
