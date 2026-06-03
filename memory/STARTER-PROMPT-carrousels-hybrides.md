# Starter Prompt — Carrousels hybrides animés (Thiaroye, Mansa Moussa, Vraie Taille)

> Session du 2026-05-31. Coller en début de prochaine session. Or Africain = DÉJÀ FAIT (référence).

---

## Contexte en une phrase

On produit des **carrousels Instagram 4:5 animés** dérivés de nos vidéos Souverain : chaque slide = un **fond animé propre** (matière re-rendue des vidéos Remotion/Mapbox, SANS overlays) + texte premium par-dessus. Le carrousel Or Africain (8 slides) est terminé et validé — il sert de modèle exact.

## ⛔ LIRE EN PREMIER (dans cet ordre, avant toute action)

1. `memory/STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.md` — doctrine complète + règles + décisions (payant écarté, ratio 4:5, source-de-vérité).
2. `src/projects/souverain/carousels/hybrid/README.md` — **index compact des 7 composants réutilisables + recette d'une slide**. C'est LA référence technique.
3. `memory/DOCTRINE-SOUVERAIN.md` — premium d'abord, fond `#16213a`, Mapbox frame-driven.

## ⛔ LES 4 RÈGLES NON-NEGOTIABLE (ne pas se planter)

1. **SOURCE DE VÉRITÉ = transcript de la vidéo finale, JAMAIS `carousel-data.ts`.**
   - Avant d'écrire UNE slide : lire la narration de la vidéo. Reconstruire le texte :
     `grep 'word:' src/_archive/episodes-livres/souverain/<episode>/whisper-words-*.ts` (ou transcript).
   - `carousel-data.ts` contient des chiffres PRÉ-fact-check (Or Africain y avait 3 erreurs). Ne JAMAIS lui faire confiance pour les chiffres/dates/faits.
   - Tout chiffre du carrousel doit correspondre EXACTEMENT à ce que dit la vidéo.

2. **Ratio 4:5 (1080×1350) pour Instagram.** JAMAIS 9:16 unique (IG crope à 4:5). 9:16 = export TikTok séparé seulement.

3. **Fonds PROPRES obligatoires.** Re-render le composant source SANS overlays (labels, sous-titres karaoké, compteurs narratifs, ProgressBar, Audio). Les vidéos ont des sous-titres incrustés permanents → un simple crop ffmpeg ne suffit pas, il FAUT re-render le beat nettoyé.

4. **Header SANS "SLIDE X/8".** 1 seule rangée de barres de progression. CTA = "clique sur notre nom @koraetcartes" (PAS "en haut" — avatar en bas sur Reels).

## Pipeline d'une slide (recette validée)

1. Repérer la matière animée dans la vidéo (extraire frames toutes les ~4s, crop 4:5, contact sheet ffmpeg pour mapper slide→segment).
2. Re-render un fond PROPRE :
   - Carte Mapbox → créer variante `*MapClean.tsx` (copier `Beat3bMapClean.tsx`/`GhanaMapClean.tsx`), puis `./scripts/render-mapbox.sh <compId> public/_carousel-test/<nom>.mp4`
   - Graphique/compteur Remotion → variante `*Clean.tsx`, puis `npx remotion render src/index.ts <compId> public/_carousel-test/<nom>.mp4`
   - Slide statique → Ken Burns léger SI nécessaire (surtout Hook + 2 premières)
3. Composer : `<CarouselSlideHybrid bgClip="_carousel-test/<nom>.mp4" highlight=... body=... slideIndex=... totalSlides=... />` — texte ISSU DU TRANSCRIPT.
4. Enregistrer la composition dans `src/Root.tsx` (Folder dédié par épisode).
5. Render slide → `out/_r-and-d/carousel-hybrid/`, **review visuelle soi-même** (Read la frame), corriger.
6. Contact sheet ffmpeg (tile 4x2) + upload catbox → présenter à Aziz pour validation mobile.
7. Validé → promouvoir dans `out/PRET-PUBLICATION/carousels/<episode>/` (01→NN nommées) + purger R&D.

## Specs V2 (charte)

navy `#16213a` · gold `#c8a951` · ivory `#f5efe0` · serif Georgia · highlight ~96px · corps ~52px ·
animation ~5s (180f) · padding bas **250px** (safe-zone IG) · CTA typewriter (voir `CarouselCtaSlide.tsx`).

## Priorité de production

Le **HOOK animé** d'abord (scroll-stopper). Puis ordre : Thiaroye → Mansa Moussa → Vraie Taille.
- **Mansa Moussa** : fichiers slides absents → tout régénérer.
- Les 3 ont des dates de pub Postiz (Thiaroye 6 juin, etc.) — voir MEMORY.md projets actifs.

## Composants existants à réutiliser (NE PAS recréer)

`CarouselSlideHybrid` (générique) · `CarouselCtaSlide` (CTA typewriter) · `Beat1HookClean` (compteur) ·
`CurveChartClean` (courbe) · `Beat3bMapClean` / `GhanaMapClean` / `AfriqueOuestMapClean` (cartes).
Tous dans `src/projects/souverain/carousels/hybrid/`. Pour un nouvel épisode : copier le pattern, adapter pays/données.

## Anti-pièges (erreurs déjà commises, ne pas répéter)

- ❌ Coder les slides avant de lire le transcript → chiffres faux → tout refaire (arrivé sur Or Africain).
- ❌ Export 9:16 pour Instagram → croppé.
- ❌ Extrait vidéo direct comme fond → sous-titres incrustés visibles.
- ❌ Faire confiance aux stats de Gemini (90% conversion DM, etc.) → folklore non sourcé.
- ❌ Recréer des composants qui existent déjà dans `hybrid/`.

## État branche

Branche actuelle : `feat/carousel-hybrid-or-africain`. Or Africain committé. Décider avec Aziz : continuer sur cette branche ou en créer une nouvelle par épisode.

## Publication Postiz (À FAIRE en lot, quand les 4 carrousels sont prêts — PAS avant)

Décision Aziz (2026-05-31) : **ne PAS publier les carrousels au coup par coup. Tout programmer en lot** dans une session de programmation dédiée, une fois les 4 carrousels (Or Africain ✅, Thiaroye, Mansa, Vraie Taille) terminés.

Ce qu'il faudra préparer pour cette session :
1. **Slides = MP4 animés tels quels** (carrousel vidéo, le mouvement = le premium). Pas d'images fixes.
2. **Étendre `scripts/schedule-postiz.py`** : `media` (ligne 162) est une LISTE → carrousel = uploader les N slides + les passer ORDONNÉES dans `image`. Plateformes carrousel : Instagram + Facebook + TikTok (PAS YouTube, pas de carrousel). Vérifier le `post_type` carrousel de l'API Postiz avant (champ `instagram-standalone` / `post_type`).
3. **Écrire les CAPTIONS** (= légende SOUS le post, ≠ texte des slides qui est déjà incrusté). Contexte + hook + "vidéo complète sur notre profil" + hashtags. Une caption par plateforme (IG/FB/TikTok).
4. **Créneau** : carrousel à un moment DIFFÉRENT de la vidéo du même épisode (1-2j après) pour ne pas cannibaliser. Vidéos = mar/jeu/sam 15:00 UTC (= 11h Montréal).
5. Toujours `--dry-run` d'abord. Vérifier sur Postiz avant publication réelle.

Livrables prêts : `out/PRET-PUBLICATION/carousels/or-africain/` (8 slides 01→08 + README).
