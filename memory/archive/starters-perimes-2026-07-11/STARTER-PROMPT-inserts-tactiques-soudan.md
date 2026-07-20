# STARTER — Inserts tactiques plein écran pour la vidéo Soudan

> ⛔ **PÉRIMÉ 2026-07-06** — la recomposition SVG + intégration + animation décrites plus bas sont
> FAITES et VALIDÉES par Aziz (prototype `KhartoumEtatMajorSVG`, commit `c59d0dd`). Ne PAS repartir
> de ce plan. **État à jour = `memory/episodes/soudan-midform/STATUS.md`** + méthode réutilisable
> = `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`. **NEXT réel = assembler la séquence beat #5
> avec la narration** (pas recomposer). Le contenu ci-dessous est conservé comme référence
> (inventaire jetons en stock, point factuel Tavily confluent Nil, chemins fichiers) mais le
> « plan en 6 étapes » de la section finale est EXÉCUTÉ.

## ⭐⭐ ÉTAT ACTUEL (lire en premier, avant de recoder quoi que ce soit)

Le chantier a fait un long détour cette session (Mapbox zoom trop fort → Mapbox zoom correct mais
mauvais registre → décodage Battle Probe → retrouvé un proto interne oublié → génération SVG par
LLM) avant d'aboutir à une méthode et un résultat validés. **Lire `out/_rnd/khartoum-etatmajor-svg/
DECODE-NOTES.md` en entier** avant de continuer — il contient : ce qui a été écarté (et pourquoi,
pour ne pas le retenter), la méthode qui marche (image-cible → SVG texte via 2 LLM en parallèle),
et le plan exact de la prochaine session (6 étapes précises).

## Décision finale (registre visuel)

Carte façon **médaillon d'état-major gravé** (sable/or/rouge #e7bd78/#dca95e/#8a2a20), PAS Mapbox,
PAS blueprint bleu (jugé "trop froid"). Inspiré de `_rnd/svg-scenes/_archive/EtatMajorGptAnimee.tsx`
(proto interne retrouvé, oublié) + décodage chaîne YouTube **Battle Probe** (masses de troupes en
formation, terrain texturé sans aucun élément cartographique réel).

## 📁 Fichiers prêts à l'emploi (permanents)

**SVG sources à recomposer** — `out/_rnd/khartoum-etatmajor-svg/` :
- `khartoum-svg-gemini.svg` — **FOND À GARDER** (le plus lisible, cibles en simples croix).
- `khartoum-svg-gpt.svg` — **BÂTIMENTS À TRANSPLANTER** (groupes `target-tower-structure`,
  `target-palace-compound`, `target-airport-site` — vérifier les id exacts dans le fichier, pas
  supposés figés) + boussole/échelle/flèches RSF déjà tracées, en bonus si utile.
- `khartoum-em-reference-composition.png` — frame de référence envoyée aux 2 LLM (issue du proto codé).
- `PROMPT-khartoum-finition-svg.txt` — prompt utilisé (contraintes fonctionnelles minimales +
  liberté créative sur l'exécution — NE PAS re-verrouiller comme le tout premier essai raté).
- `khartoum-finition-gemini.png` / `khartoum-finition-gpt.png` — 2 tentatives bitmap (avant SVG
  texte), gardées comme inspiration visuelle seulement, PAS exploitables en code (vérifié : JPEG/PNG
  bitmap, pas de vecteur).

**Prototype fonctionnel codé** (base d'intégration animation, pas le fond final) :
`src/projects/warmap/KhartoumEtatMajorSVG.tsx` (composition `KhartoumEtatMajorSVG`) — zoom/registre/
timing corrects, structure de phases (`PHASE_STARTS`, `CONTACT_OFFSET`, `draw()` stroke-dashoffset)
réutilisable, mais les FORMES codées à la main (terrain, cibles) seront probablement remplacées par
la recomposition Gemini+GPT.

**Jetons/véhicules déjà générés (NE PAS regénérer avant de les avoir comparés en contexte)** —
`src/projects/_shared/svg-library/elements/militaire/` :
- `khartoum-colonne-rsf-mouvement-glm.json` — colonne RSF SVG (3 véhicules + lignes de vitesse).
- `vehicule-technical-mono-focus-glm.json` — meilleure version SVG technical isolé.
- `khartoum-impact-batiment-glm-A-CORRIGER.json` — **BUG CONNU non corrigé** : halo trop grand
  (rayon ~29 au lieu de max 15-18), couvre le bâtiment. À corriger avant usage si repris.
- `storyboard-elargi-12-elements-glm.json`, `batiments-glm-brut-v1.json` — autres éléments en stock.
- Alternative déjà validée en prod (pas GLM) : `public/_shared/sprites/warmap/tech-td-red.png`
  (sprite Gemini top-down, utilisé dans `SudanWarMapEpic60` + `WarMapEngine.tsx`) — Aziz a tranché
  qu'on part de celui-ci en priorité pour la colonne RSF plutôt qu'un nouvel appel GLM.

**Décodage Battle Probe** (référence chaîne, gardé pour retour éventuel) — `out/_r-and-d/
decode-battleprobe/` : `cannae.mp4`, `zama.mp4`, `DECODE-NOTES.md`.

**Scripts créés/promus cette session** — `scripts/tools/` :
- `gemini-vision-breakdown-highoutput.py` — variante de `gemini-vision-breakdown.py` avec
  `max_output_tokens=32000` (le script partagé, 8000, tronque silencieusement un SVG détaillé).
- `openrouter-img2img.py` — image-to-image via OpenRouter (image ref + prompt → image générée),
  pattern absent du script `openrouter-gen-image.py` existant (text-to-image seul).

## 🔧 Point factuel vérifié cette session (Tavily)

Le confluent Nil Bleu/Nil Blanc à Khartoum est réel (Omdurman est bien de l'autre côté du fleuve
par rapport au centre-ville/palais/aéroport) — ce n'est PAS une invention des LLM à corriger, juste
à bien rendre lisible (fleuve net, pas confondu avec une route). Si la scène montre un franchissement
du fleuve : historiquement les forces sont passées par les PONTS existants (pas de bateaux) — mais
le 15 avril 2023 au matin précisément, la RSF avait déjà des unités prépositionnées des deux côtés
(pas une colonne unique traversant en direct) — la scène "colonne qui converge depuis 1 point" reste
une simplification narrative assumée.

## 🎬 PROCHAINE SESSION = plan exact (voir DECODE-NOTES.md section finale pour le détail)

1. Inventaire des jetons déjà en stock (fichiers ci-dessus) AVANT tout nouvel appel API.
2. Recomposition fond : transplanter les 3 groupes bâtiments GPT dans le fichier SVG Gemini.
3. Passe premium de nettoyage sur l'assemblage (raccords, cohérence des traits).
4. Intégrer en JSX Remotion (reprendre la structure de phases de `KhartoumEtatMajorSVG.tsx`).
5. Comparer `tech-td-red.png` vs `khartoum-colonne-rsf-mouvement-glm.json` en contexte réel, choisir,
   animer en formation (pattern `warmapVehicles.ts` : waypoints + lerp + orientation atan2).
6. Première passe d'animation complète, render test, juger le mouvement réel.
