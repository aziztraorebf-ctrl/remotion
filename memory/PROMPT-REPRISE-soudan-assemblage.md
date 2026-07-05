---
name: prompt-reprise-soudan-assemblage
description: Prompt à coller en début de prochaine session pour reprendre l'assemblage de la séquence Soudan Khartoum
metadata:
  type: project
---

# Prompt de reprise — Assemblage séquence Soudan (Khartoum, 15 avril 2023)

Copier-coller ce bloc en début de session :

---

On reprend le chantier des inserts tactiques Soudan. Lis `memory/STARTER-PROMPT-inserts-tactiques-soudan.md` en entier — il contient la décision finale (bâtiments = Gemini image + traitement, jetons/véhicules = SVG GLM→agent Sonnet 5), tous les chemins d'assets prêts à l'emploi, et les 4 points restants avant assemblage.

Objectif de cette session : **assembler la vraie séquence Remotion de 25-30s** du beat #5 (attaque RSF simultanée sur Khartoum, 15 avril 2023 — aéroport, palais présidentiel, tour TV), en combinant :
1. Le composant `src/projects/_rnd/svg-scenes/ProtoInsertTactiqueTopDown.tsx` (V2 déjà codé — terrain + chorégraphie 4-phases) comme socle.
2. Les 3 bâtiments Gemini intégrés posés en positions fixes (`public/_shared/sprites/soudan-batiments/palais-presidentiel-integre.png`, `station-tv-integre.png` — aéroport à trancher, voir point 2 ci-dessous).
3. La colonne RSF SVG en mouvement (`src/projects/_shared/svg-library/elements/militaire/khartoum-colonne-rsf-mouvement-glm.json`) glissant vers chaque cible, séquentiellement (pas simultané).
4. L'impact au contact — **attention, bug connu** : `khartoum-impact-batiment-glm-A-CORRIGER.json` a un halo trop grand qui couvre le bâtiment en superposition. À corriger AVANT usage (mono-focus GLM, rayon halo réduit à 15-18 unités max) ou remplacer par une variante plus simple pour ce premier assemblage.

Avant de coder, trancher ces 2 points avec moi si pas déjà fait :
1. **Aéroport : SVG existant ou régénérer en Gemini ?** Son SVG (`aeroport-topdown-v2.svg`) est déjà bon, mais les 2 autres bâtiments sont en Gemini — décider si on garde un mix ou si on uniformise en régénérant l'aéroport en Gemini pour la cohérence du set (pattern des 2 prompts déjà utilisés, `PROMPT-palais-gemini.txt`/`PROMPT-tourtv-gemini.txt`, à adapter).
2. **Contour géographique réel** (GeoJSON Khartoum/El Fasher) : aucun n'existe encore pour le Soudan (contrairement au Sahel). Décider si le terrain purement schématique de `ProtoInsertTactiqueTopDown.tsx` suffit pour ce premier insert, ou si on ancre un vrai contour de ville via d3-geo (`ProtoMap2dEncre.tsx` comme référence technique).

Une fois assemblé : rendre en vidéo réelle (`npx remotion render`, pas juste des frames fixes) et uploader sur catbox — je préfère toujours juger le mouvement réel, pas des images statiques. Utiliser `scripts/upload-catbox.sh` pour l'upload, et si besoin de convertir un artifact HTML en image/vidéo partageable sur mobile, la méthode validée est : Playwright + serveur HTTP local bindé `127.0.0.1` (jamais `0.0.0.0`) pour screenshot une page locale, puis upload catbox.

Rappel technique important : si un script Python fait une requête HTTPS (Gemini, OpenRouter, etc.) et semble bloqué sans erreur, c'est le gotcha IPv6 déjà identifié (`memory/tools/yt-dlp.md`) — utiliser `scripts/tools/run_ipv4.py <script> [args]` pour contourner.
