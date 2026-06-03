# mapanimation.io — veille concurrentielle + GeoFlowConnection

> 2026-06-03. Aziz a partagé mapanimation.io (templates vidéo de cartes animées). Mission : comprendre la techno + juger reproductibilité + combler les gaps.

## Verdict techno (prouvé par scraping + sondage réseau)

mapanimation.io = **générateur AI text-to-map-video**. Architecture en 2 temps :
1. LLM traduit un prompt en JSON de paramètres (villes, style ligne, caméra, timing). Compréhension de langage, PAS génération d'image.
2. Renderer serveur déterministe rend chaque frame → mp4 (`cdn.mapanimation.io/{user}/VideoOutput/{id}.mp4`, CloudFront signé).

- **PAS After Effects / GeoLayers** ("No After Effects" = leur marketing). Carte vivante (Mapbox/MapLibre-like) + overlays, rendue en vidéo.
- **Sprites avion/voiture "premium"** = juste une image posée sur la carte + position interpolée le long du path + rotation tangente. Aucune 3D temps réel. Le "premium" = l'asset réservé aux payants, pas la technique.
- **= NOTRE architecture exacte** (Mapbox + Remotion frame-driven + breakdown JSON). Intégralement reproductible.

## Endpoint utile (re-scraper le catalogue)

`GET https://mapanimation.io/Animation/Templates/GetLandingPageTemplates` (header `X-Requested-With: XMLHttpRequest`, pas d'auth). Renvoie 89 templates avec **`userPrompt` COMPLET** (= storyboard scène-par-scène, même grammaire que nos Production Briefs). Catalogue sauvegardé : `memory/_r-and-d-mapanimation-catalog.json`. Analyse : `memory/_r-and-d-mapanimation-ANALYSE.md`. Clips R&D : `out/_r-and-d/mapanimation/`.

## Process veille (validé Aziz)

**Capture de page + prompt SUFFISENT** dans 90% des cas (je récupère le reste via l'API). Joindre la vidéo seulement si je le demande pour un mouvement subtil (easing, accel d'un marqueur).

## ⚠️ DOCTRINE "inspiration externe" — version FINALE corrigée (post 2 tests, 2026-06-03)

La 1re version de la doctrine était PIÉGEUSE ("toujours un élément mobile, jamais 1,2s sans mouvement" = LEUR philo d'outil de masse, PAS la nôtre). **Test réel beat A5 Maroc** : on a empilé 6 couches → illisible → rejeté Aziz → revenu au V3. **Corrigée** :
- **Complémentarité de FINITION, pas étape de production.** N'ouvrir le décode qu'APRÈS qu'une scène passe déjà la self-review. Notre playbook a déjà l'essentiel (nos templates ressemblent déjà aux leurs).
- **"Mieux voir peu que voir énormément."** Plafond chiffré : **max 2 couches narratives actives en 9:16** (3 en 16:9).
- **4 garde-fous** : (1) plafond simultanéité, (2) suit-la-voix, (3) lisible + TEST DE RETRAIT, (4) séquentiel pas métronome.
- **2D-flat-satellite (eux) ≠ 3D-pitch-vectoriel (nous)** : tout se TRADUIT, jamais copier. Sprite top-view FAUX en pitch>0.
- Ce qu'on capture chez eux : SÉQUENTIEL maîtrisé + traitement COULEUR/FRONTIÈRES (pas "faire apparaître des objets").
Détail complet : `SOUVERAIN-VISUAL-PLAYBOOK.md` section 2bis. Décode premium : `_r-and-d-mapanimation-PREMIUM-DECODE.md`.

## Méthode de validation qui a marché (à réutiliser)

DEUX tests successifs ont durci la doctrine mieux que toute relecture : (1) **test réel** sur un beat existant (révèle l'erreur de fond), (2) **agent vierge** sans contexte (révèle les trous opérationnels qu'on ne voit pas quand on a le contexte en tête). L'agent vierge a trouvé 4 dettes réelles (self-review scriptée non câblée, seuil Gemini contradictoire, pas de plafond chiffré, pas de warning sprite/pitch) — toutes corrigées. À refaire en double (Claude + agent) en session propre.

## 2e voie : Atlas Pur (piste validée prélim. 2026-06-03)

La veille s'applique MIEUX à Atlas Pur (2D flat) qu'à Souverain (3D pitch) — friction projection nulle. Adapter le PROCÉDÉ (sprites qui avancent, flèches qui se dessinent, fill à l'impact, comet-trail) pour troupes/batailles (Hannibal) et propagation (Peste 1347). Réf : template #132 "Iran Tension" (prompt complet lisible). Voir [[NEXT-ACTION]] point B.

## Gaps identifiés vs notre arsenal (28 templates Mapbox)

On est au niveau/au-dessus sur ~90%. 2 vrais gaps :
1. ⛔ **Flux/route séquentiel** → COMBLÉ par `GeoFlowConnection` (ci-dessous).
2. ⚠️ **Globe sphérique rotatif → zoom** (leur signature #197/#141/#264). Mapbox `projection:'globe'` à valider headless AVANT de coder. Idéal sujets historiques africains (empires) en variante parchemin. NON FAIT.

## GeoFlowConnection (créé cette session)

`src/projects/_shared/mapbox/GeoFlowConnection.tsx` — route ville→ville qui se DESSINE (dashed doré + dash animé) + city markers Spring Pop + labels + sprite mobile (avion orienté tangente / dot) + caméra-follow puis dézoom final. Headless-safe (Catmull-Rom + map.project frame-driven + halo opacité, PAS de feGaussianBlur/filter:blur). Compositions Root : `GeoFlowConnection-SilkRoad-H/-V`. Référencé CATALOGUE-CARTE-VIVANTE (section ROUTE/FLUX).

**Différent de l'existant** : `ConvergingFlows` (multi-source→1 dest), `FlowArrowsMap` (SVG pur non géo-attaché), `AnimatedCaravan` (POC hors-prod). GeoFlow fait l'enchaînement complet.

**Leçons polish V1→V2** : tracé fin/pâle = augmenter épaisseur (5px) + double halo opacité + dash clair par-dessus ; caméra-follow trop timide = zoom +1.8 serré sur la tête, dézoom UNIQUEMENT sur les 20% finaux (pas tout du long) ; fond à assombrir fort (#070b14 eau) pour faire claquer le doré.

Liens : voir [[NEXT-ACTION]] (backlog GeoFlowConnection). Previews : V1 https://files.catbox.moe/vxj76w.mp4
