# BRIEF DE PASSATION — War-Map Sahel (fin session 2026-06-07)

> Pour la prochaine instance Claude. Session très productive : on est parti d'un système
> frustrant (deviner → coder → rater → faire juger les ratés) à un système VALIDÉ
> (faire juger le plan AVANT de coder). Lire ce brief en entier, puis les fichiers pointés.

---

## CE QU'ON A FAIT CETTE SESSION (résumé)

1. **Formalisé le DA-BRIEF-GATE** (review créative externe Gemini + Kimi) avec 3 piliers +
   2 moments d'usage. Outils : `scripts/tools/da-brief.py` (flags `--aislop` ON défaut, `--expert`,
   `--upstream`) + `scripts/tools/da-compare.py` (comparatif vidéo vs référence, Gemini seul).
   Doctrine complète : `memory/doctrines/DA-BRIEF-GATE.md`.
2. **Diagnostiqué l'Acte 1 War-Map Sahel** via 5 reviews externes (AI-slop + expert + comparatif).
   Verdict décisif : la PALETTE était un FAUX coupable ; vrai problème = FRAGMENTATION
   géographique ("carte de pixels" vs "carte de blocs"). Intuition Aziz (cadrage 16:9) confirmée.
3. **La session parallèle d'Aziz a appliqué le socle correctif** (6 mécaniques validées par render :
   fusion Turf, vignettage géo, caméra continue, allumage séquentiel, villes pulsantes, fronts
   draw-in). L'état actuel est BEAUCOUP plus propre (frames jointes le prouvent).
4. **1er usage du mode `--upstream`** (review préventive AVANT de coder) sur l'état actuel validé.
   Gemini + Kimi ont produit un PLAN DE CONSTRUCTION complet de l'Acte 1, convergent.

---

## ⭐ À LIRE EN PREMIER, DANS CET ORDRE (lecture BRUTE obligatoire)

> Aziz veut que tu lises les réponses upstream COMPLÈTES de Gemini et Kimi toi-même, en brut,
> exactement comme l'instance précédente l'a fait — pour voir mot pour mot ce qu'ils proposent
> et adapter AVEC Aziz. Ne te contente PAS de la synthèse.

1. `memory/episodes/warmap-sahel/etat-actuel-acte1/da-acte1-construction-gemini.md` ⭐ LIRE EN ENTIER
   (plan de montage beat par beat + ordre de construction + anti-slop, par Gemini)
2. `memory/episodes/warmap-sahel/etat-actuel-acte1/da-acte1-construction-kimi.md` ⭐ LIRE EN ENTIER
   (même structure, vision artistique Kimi — tableaux templates + 8 parades anti-slop)
3. `memory/episodes/warmap-sahel/etat-actuel-acte1/PLAN-CONSTRUCTION-ACTE1.md`
   (MA synthèse vérifiée des deux — à confronter aux bruts ci-dessus)
4. Frames de l'état actuel : `etat-actuel-acte1/0{1,2,3,4}-*.jpg` + vidéo `B3-complet.mp4`

Puis le contexte de diagnostic (si besoin de remonter à la source) :
5. `memory/episodes/warmap-sahel/review-acte1/SYNTHESE-REVIEW.md` (les 3 tests croisés)
6. `memory/episodes/warmap-sahel/STATUS.md` (état complet + 6 commentaires Aziz + véhicules)

---

## DÉCISIONS VERROUILLÉES (ne pas re-débattre)

- **Palette factions INCHANGÉE** : bleu #3E6E9E état · rouge #B14B3C JNIM · or #C99A3A contesté.
  (faux coupable prouvé — elle est excellente).
- **Fragmentation réglée** par fusion Turf (32 régions → grandes masses). NE PAS revenir aux micro-régions.
- **Contours/villes = BEIGE #F3E9C8** (l'or se confondait avec l'or contesté). Vignette sépia #241809 42%.
- **Allumage SÉQUENTIEL** (Mali→Burkina→Niger) retenu comme hook, calé sur forced-alignment réel
  (Mali f151, Burkina f231, Niger f301).
- **VÉHICULES = GARDÉS** = différentiel signature. Les modèles disent "camions 2D = amateur" →
  NE PAS GOBER (règle CLAUDE.md L254). Vrai enjeu = bonne EXÉCUTION (taille/intégration/mouvement
  avec but/différenciation), pas le concept.

---

## PROCHAINE ÉTAPE = RECODER L'ACTE 1 en suivant le plan validé

Suivre l'ORDRE DE CONSTRUCTION (Gemini, dans PLAN-CONSTRUCTION-ACTE1.md) :
1. Track caméra seul (f0→f2299) → valider rythme + pause f572.
2. Allumer zones en "cut" aux frames exactes → valider synchro voix/image.
3. Easings (springs + stroke-dashoffset).
4. Chrome (véhicules, pulses, tampons, ondes de choc).
⚠️ Piège anticipé : coder les véhicules APRÈS la caméra (sinon moonwalk).

**Avant de coder** : confronter avec Aziz les bruts Gemini/Kimi → décider ensemble quoi appliquer
(staggering, anneau CEDEAO qui se rompt, nettoyage cognitif f727, hiérarchie pulses, texte décalé, etc.).

---

## ÉTAT TECHNIQUE
- Moteur : `src/projects/warmap/engine/SahelWarMapEngine.tsx`. Le socle 6 mécaniques de la session
  parallèle est en props de TEST optionnelles (off par défaut) — vérifier l'état du fichier au démarrage.
- Compositions test : `SahelActe1Test10s-{A,B,B2,B3}` dans Root.tsx.
- GeoJSON réel : `public/_shared/geo-data/sahel/sahel-admin1.geojson` (32 régions) +
  `sahel-countries.geojson` (silhouettes). Véhicules : `public/_shared/sprites/warmap/technical-{jnim,eigs}.png`.
- Render : `./scripts/render-mapbox.sh <Compo> <out.mp4>` (remotion still NE marche PAS pour Mapbox).
- ⚠️ Branche `feat/da-brief-gate-warmap-sahel` (cette session) + session PARALLÈLE d'Aziz (socle).
  VÉRIFIER l'état git au démarrage (merge éventuel des deux).

---

## OUTILS NOUVEAUX RÉUTILISABLES (tous projets, pas que war-map)
- `da-brief.py --upstream` : review préventive du PLAN avant code (AI-slop + expert prospectifs).
- `da-brief.py --aislop` (ON défaut) / `--expert` : sur un rendu (correctif).
- `da-compare.py --ref <pilier|mp4> --new <mp4>` : comparatif vs référence (Gemini, vidéo complète).
- Doctrine : `memory/doctrines/DA-BRIEF-GATE.md`. Catalogue Map Animation : `/tmp/mapanim_compact.txt`
  (⚠️ /tmp purgeable → régénérer depuis `memory/_r-and-d-mapanimation-catalog.json` si absent).
