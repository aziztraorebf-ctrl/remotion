# STARTER — Inserts tactiques plein écran pour la vidéo Soudan

> Session R&D du 2026-07-05 (longue, plusieurs sous-chantiers). Prochaine session = **ASSEMBLAGE** de la séquence Remotion complète du beat #5 (voir tout en bas). Tous les livrables sont rapatriés à des emplacements permanents (pas scratchpad) — chemins exacts ci-dessous.

## Contexte

Vidéo Soudan (script Acte 2 déjà écrit, `memory/projects/soudan-midform-STORYBOARD-ACTE2.md`). Aziz veut des inserts tactiques plein écran (façon carte d'état-major) pour montrer des manœuvres militaires, absents du système War-Map actuel. Séquence cible choisie : **beat #5 — 15 avril 2023, matin, la RSF attaque simultanément Khartoum** (aéroport international, palais présidentiel, tour TV + bases Merowe/Soba — on se limite à 3 cibles pour rester lisible en 25-30s).

## ⭐⭐ DÉCISION FINALE (tranchée, ne pas re-débattre sans raison nouvelle)

**Deux registres de rendu différents selon le type d'élément** :

| Type d'élément | Technique | Pourquoi |
|---|---|---|
| **Bâtiments/infrastructures complexes, statiques, un seul par carte** (aéroport, palais, tour TV) | **Gemini image-gen top-down + traitement d'intégration** (désaturation+cadre, script `scripts/tools/gemini-batiment-integration.py`) | Testé et confirmé : Gemini compose l'image en une seule étape (voit ce qu'il génère), bat largement le SVG codé à l'aveugle sur les formes sans vocabulaire géométrique universel. Preuve : https://files.catbox.moe/buuq4d.png |
| **Jetons/véhicules/effets mobiles, en nombre, à animer individuellement** (infanterie, technicals, explosions, flèches) | **SVG, pipeline GLM-5.2 (premier jet) → agent Sonnet 5 contexte vierge (raffinement)** | SVG garde le registre plat sans rupture, contrôle total pour animer plusieurs éléments en même temps. Preuve : https://files.catbox.moe/o1o76m.png |

Root cause du clivage (si besoin de le réexpliquer) : coder du SVG en coordonnées pures, sans jamais voir le rendu, marche pour des formes univoques (piste = rectangle long) mais échoue à composer une forme originale complexe (palais, tour) — le dosage visuel (ex: un élément qui devient trop petit/trop grand) échappe au raisonnement spatial pur. Gemini n'a pas ce problème car sa composition = son rendu.

## 📁 Assets prêts à l'emploi (chemins permanents, projet)

**Bâtiments Gemini (traités, prêts à poser sur la carte)** — `public/_shared/sprites/soudan-batiments/` :
- `palais-presidentiel-integre.png` (+ `-brut.png` sans traitement, + `PROMPT-palais-gemini.txt`)
- `station-tv-integre.png` (+ `-brut.png`, + `PROMPT-tourtv-gemini.txt`)
- `storyboard-reference-5-elements.png` (planche de référence initiale, 5 éléments)
- **Aéroport : PAS ENCORE régénéré en Gemini** (son SVG actuel `aeroport-topdown-v2.svg` est déjà bon — décider si on le garde en SVG ou si on le régénère en Gemini pour cohérence du set. Si oui : réutiliser le pattern des 2 prompts ci-dessus).

**SVG jetons/véhicules/effets (GLM + raffinements)** — `src/projects/_shared/svg-library/elements/militaire/` :
- `storyboard-elargi-12-elements-glm.json` — 12 éléments : infanterie isolée/groupe SAF+RSF, blindé léger, convoi, frappe aérienne, zone assiégée, ligne de front, flèche manœuvre, médaillon ville, icône déplacés. **Certains jugés "trop simples" (infanterie isolée) — à passer au pipeline GLM→agent Sonnet 5 si besoin de plus de détail.**
- `vehicule-technical-mono-focus-glm.json` — véhicule technical, version mono-focus détaillée (meilleure version SVG du technical).
- `khartoum-batiments-cibles-glm.json` — 3 bâtiments-cibles en SVG (dépassé, remplacé par les PNG Gemini ci-dessus — gardé comme trace).
- `khartoum-colonne-rsf-mouvement-glm.json` — colonne RSF en mouvement (3 véhicules + lignes de vitesse), OK mais canon peu visible à cette échelle.
- `khartoum-impact-batiment-glm-A-CORRIGER.json` — **BUG CONNU** : le halo d'impact est trop grand, couvre le bâtiment dessous en superposition réelle malgré `fill-opacity:0.4` annoncé. Corriger avant usage : rayon halo max 15-18 unités, ou contour sans aplat de fond.
- `aeroport-topdown-v2.svg`, `palais-presidentiel-topdown-v2.svg`, `station-tv-topdown-v2.svg` — versions SVG "libres" (agent Sonnet 5, méthode description-architecturale-d'abord). Le palais et la tour TV sont dépassés par leur version Gemini ; l'aéroport reste la référence SVG si on ne le régénère pas en Gemini.
- `batiments-glm-brut-v1.json` — les 3 bâtiments GLM bruts (avant tout raffinement), gardé comme trace de comparaison.

**Prototype vidéo Remotion (déjà dans le vrai code, pas scratchpad)** :
- `src/projects/_rnd/svg-scenes/ProtoInsertTactiqueTopDown.tsx`, composition `RND-ProtoInsertTactiqueTopDown` (Root.tsx). V2 : terrain hybride SVG + jetons 50px+ + véhicule 3-couches + explosion 4-couches + chorégraphie 4-phases (lecture→manœuvre→contact+shake→résolution) sur 150 frames (5s@30fps). Rendu vidéo réel : https://files.catbox.moe/kjuke8.mp4 — **jugement Aziz sur le mouvement en attente**.

**Scripts réutilisables (permanents, `scripts/tools/`)** :
- `run_ipv4.py` — wrapper obligatoire pour tout script Python faisant des requêtes HTTPS dans ce sandbox (IPv6 mort, voir `memory/tools/yt-dlp.md`). Usage : `python3 scripts/tools/run_ipv4.py <script.py> [args...]`.
- `gemini-batiment-integration.py` — traitement désaturation+cadre pour toute nouvelle icône de bâtiment Gemini. Usage : `python3 scripts/tools/gemini-batiment-integration.py --input x.png --output x-integre.png`.
- `llm-gen-svg.py` (préexistant) — génération SVG en lot GLM/GPT/Gemini, patron pour toute nouvelle demande GLM.

## 🔧 Reste à faire avant l'assemblage complet

1. **Corriger `khartoum-impact-batiment-glm-A-CORRIGER.json`** (halo trop grand) — mono-focus GLM ciblé, rayon halo réduit.
2. **Décider aéroport SVG vs Gemini** — régénérer en Gemini pour cohérence du set, ou garder le SVG actuel (déjà bon).
3. **Raffiner l'infanterie isolée** du storyboard élargi (jugée trop simple) via le pipeline GLM→agent Sonnet 5 si besoin, une fois qu'on voit son poids réel dans la composition finale.
4. **Obtenir/créer un GeoJSON Soudan** si on veut ancrer un contour réel (El Fasher/Khartoum) — aucun n'existe encore, contrairement au Sahel (`public/_shared/geo-data/sahel/*.geojson`). Cf. `memory/tools/d3-geo-vector-pipeline.md`.

## 🎬 PROCHAINE SESSION = ASSEMBLAGE

Construire la vraie séquence Remotion de 25-30s (beat #5, 15 avril 2023) en combinant :
- Le terrain + chorégraphie 4-phases déjà codés dans `ProtoInsertTactiqueTopDown.tsx` (V2).
- Les 3 bâtiments Gemini intégrés (`palais-presidentiel-integre.png`, `station-tv-integre.png`, aéroport à trancher) posés en positions fixes sur la carte, avec labels de nom.
- Les jetons/colonnes RSF SVG en mouvement (`khartoum-colonne-rsf-mouvement-glm.json`) glissant vers chaque cible.
- L'impact (une fois corrigé) à l'arrivée sur chaque cible, séquentiellement (pas simultané — cohérent avec R3 de `episodes/warmap-sahel/DECISION-jetons-vs-vehicules.md`, "jamais simultané, ça devient bordélique").
- Rendre en vidéo réelle (pas juste des frames fixes) et uploader sur catbox pour jugement — Aziz préfère toujours juger le mouvement réel.

**Avant de coder** : relire ce fichier en entier + `memory/tools/openrouter-svg.md` (section GLM/Sonnet/Gemini, détail complet des tests) si le contexte de la session précédente est nécessaire pour un point précis.

## Pont technique (déjà en place, contexte général)

- `src/projects/_shared/svg-library/palette.ts` : couleurs encre/parchemin (`INK #2b2117`, `PARCH #e8dcc0`, `PARCH_DIM #b0a58a`).
- `src/projects/_rnd/svg-scenes/ProtoMap2dEncre.tsx` : projection d3-geo fonctionnelle, utile si contour géo réel ajouté.
- Chantier cadre : `memory/STARTER-PROMPT-refactoring-svg-et-map2d.md` (CHANTIER 2, décision Aziz 2026-07-02 : carte 2D flat d3-geo, jamais Mapbox 3D pour ce style).
- Précédent système comparable déjà validé : `episodes/warmap-daybyday/STATUS.md` (`SudanWarMapEpic60`, sprites Gemini + médaillons, prototype 9:16 — technique transposable en 16:9).
