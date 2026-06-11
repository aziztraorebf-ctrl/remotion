# BRIEF DE PASSATION — War-Map Sahel — 2026-06-10 (soir)

> Pour reprendre en session parallèle SANS perte de contexte. Branche : `feat/da-brief-gate-warmap-sahel`.
> Lire CE brief en premier, puis les fichiers pointés. Tout est commité (commits `9273241` voix + `08226ff` plan).

---

## CE QUI EST FAIT (état verrouillé — ne pas re-litiger)

### 1. SCRIPT V5 — LOCKED
- `memory/episodes/warmap-sahel/SCRIPT-V5-LINEAIRE-2026-06-10.md` = LE script. Chronologie LINÉAIRE 2012→2026
  (règle le bug "timeline qui recule"), ton Tremblay, 4 parties + ouverture, fact-check Sonar Pro appliqué.
- Décision structurante : le problème "B1 confus" était une SURCHARGE narrative de TOUT le script (pas juste B1).
  Le plan "B1 sprites vivants" (avion "11 jours", convoi) est **ABANDONNÉ**. Ne pas y revenir.

### 2. VOIX — PIPELINE VIVANT VALIDÉ + AUDIO GÉNÉRÉ
- Pipeline (résout la monotonie GéoAfrique) : texte taggé V3 → **Océane V3** (`CqTrL0ThT2GJVJEIiLcY`) →
  **Speech-to-Speech GéoAfrique** (`z3gESu49naEZW8Af2Upm`, `eleven_multilingual_sts_v2`, **stability 0.45**).
  Doctrine complète : `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`.
- Script industrialisé : `scripts/generate-narration-expressive.py`. Flags : `--dry-run` (coût sans API),
  `--sample`, `--only-part pX` (réparation chirurgicale d'UNE partie), `--sts-stability X`. **Génère PAR PARTIES**
  (règle Aziz : jamais en bloc). Texte source taggé : `SCRIPT-V5-TAGGED.txt` (marqueurs `### PARTIE`).
- Réglage gravé : **stability STS 0.45** corrige l'artefact de prononciation (0.30 bavait sur "épreuve").
  Tags SOBRES (21 émotion + 4 ellipses, 0 [pause] explicite) = vivant SANS rallonger/coûter.
- **Audio FINAL validé Aziz** : `public/_shared/audio/sahel-warmap/narration-v5-expressive.mp3` (7min26).
  catbox `udflj9`. Micro-coupures NON bloquantes (disparaissent sous SFX/musique). NE PAS regénérer sans raison.
- **Forced alignment** : `public/_shared/audio/sahel-warmap/narration-v5-alignment.json` (loss 0.167, 1096 mots).
  = **SOURCE DE VÉRITÉ UNIQUE des triggers de beat.** (mp3 gitignorés ; alignment JSON versionné.)
- **Découpé en 5 parties** : `narration-v5-p0→p4.mp3` (p0 62,8s · p1 35,2s · p2 104,1s · p3 111,8s · p4 132,1s).
  ⚠️ Ces mp3 servent à la RÉPARATION (`--only-part`), PAS à border les séquences (les frontières mp3 ≠ frontières
  narratives de beat — voir note dans `BEATS-V5.md`). Pour coder : utiliser l'audio COMPLET + l'alignment global.
- Plan ElevenLabs : passé à **Creator** ($22, 100k crédits/mois). 1 narration ≈ 8700 crédits.

### 3. DÉCOUPAGE BEATS + PLAN VISUEL PARTIE 1
- `memory/episodes/warmap-sahel/BEATS-V5.md` = les 5 parties découpées en ~30 beats, frame-précis sur l'alignment.
- Plan visuel **Partie 1 (canari)** VALIDÉ (DA upstream 3 voix Gemini+Kimi+DeepSeek + tranché Aziz) :
  direction **SOUSTRACTION**. Détail dans `BEATS-V5.md` section CANARI. Réponses : `reviews-p1/`.
  - Beat 1.0 board clearing (jetons Acte 1 → 0.2 fantômes) + repère "LIBYE" + "2012" encre.
  - Beat 1.1 pulse Libye (effondrement).
  - Beat 1.2 TRAIT D'ENCRE Libye→Mali (stroke-dashoffset, route réelle, PAS particules TikTok) + taches
    d'impact `#8B3A3A` multiply sur Kidal/Gao/Tombouctou (PAS flammes).
  - Beat 1.3 VIDE D'ÉTAT par chute d'opacité du fill rural (l'État s'évapore) + hachures tensions (PAS icônes).
  - **PAS d'overlay, PAS d'objets** en P1 (origine 2012 = abstraite, 100% cartographiable).

---

## CE QU'IL FAUT FAIRE MAINTENANT (la prochaine session de CODE)

### ⭐ EXÉCUTER LE PLAN DE REFACTOR
`docs/plans/2026-06-10-warmap-sahel-refactor-parties.md` (Tasks 0-8). Skill : `superpowers:executing-plans`.

**Pourquoi un refactor d'abord :** le moteur `src/projects/warmap/engine/SahelWarMapEngine.tsx` fait 3261 lignes
(monolithe). Décision Aziz : extraire en **moteur-fin (carte/caméra/état partagé) + 1 fichier React par Partie**.
La War-Map a un ÉTAT CONTINU (jetons/taches persistent, caméra glisse sans coupe) → on NE peut PAS la découper en
fichiers indépendants concaténés comme Atlas/Souverain. Solution = 1 moteur conteneur qui passe un CONTEXTE
(`SahelRenderContext` : frame, projection lon/lat→px, état) à chaque `<PartieX ctx={...}/>`. Chaque Partie = couche isolée.

**Ordre (résumé du plan) :**
- **Task 0** : render baseline Acte 1 (3 frames-témoins) = FILET non-régression. À FAIRE EN PREMIER.
- **Task 1** : extraire `SahelContext.ts` (type + projection). Non-régression.
- **Task 2** : coquille `<Partie1Origine>` vide branchée (mode `partie1`), legacy acte2 OFF.
- **Tasks 3-6** : coder beats 1.0→1.3 (board clearing → pulse Libye → trait+taches → vide+hachures).
- **Task 7** : render Partie 1 FULL HD + audio + non-régression Acte 1 → présenter Aziz.
- **Task 8** (après validation) : supprimer legacy acte2 + documenter le pattern `<PartieX>` pour P2-P4.

### ⚠️ PIÈGE VÉRIFIÉ — triggers moteur DÉCALÉS
Le code V5 déjà câblé dans le moteur (F_KIDAL_*, F_REF_*, F_ICON_*, F_AES_NEE...) est calé sur un audio
ANTÉRIEUR. Écarts vs `narration-v5-alignment.json` : Kidal f7279→**f7084** (-195), flotte f8683→**f8132** (-551),
Djibo f10294→**f9790** (-504), uranium →**f10804**. **Recaler TOUT trigger récit sur l'alignment V5.**
(Pour trouver un mot : lire `narration-v5-alignment.json`, mot × 30 fps = frame.)

### Acte 1 = INTACT
`acte1-FINAL.mp4` (catbox `slchjv`) validé blueprint. Le refactor NE le touche pas. Plus tard seulement :
retirer son curseur timeline (le récit V5 redémarre la timeline à 2012 en Partie 1) + recaler ses triggers.

---

## DÉCISIONS DE GOÛT/VISION (Aziz — fermes)
1. Script V5 LOCKED. Voix = V3 tags → STS GéoAfrique 0.45. NE PAS rouvrir.
2. Direction Partie 1 = SOUSTRACTION (validée). Pas d'overlay/objets en P1.
3. **Registre à ENRICHIR (Parties 3-4)** : objets Gemini encre top-down sur la carte — drapeau malien qui se
   déploie sur Kidal au mot "flotte" (P3), lingots d'or (Bamako/Ouaga), cristal uranium + goutte pétrole (Niamey),
   picto confédération (P4). À générer le moment venu (recette Gemini encre validée). On SOUS-utilisait ce registre.
4. Overlays réservés aux idées ABSTRAITES sans équivalent cartographique : P2 (présence FR pré-positionnée,
   GeoConvergenceOverlay existe) + P4 (franc CFA). PAS en P1/P3 (tout cartographiable).
5. Jetons circulaires (2 archétypes JNIM chèche clair / EIGS cagoule sombre) = signature. Pas de véhicules en long.

---

## DOCTRINES & FICHIERS DE RÉFÉRENCE (à lire selon le besoin)
- `memory/episodes/warmap-sahel/STATUS.md` — état épisode complet (assets, triggers Acte 1, prochaine étape).
- `memory/episodes/warmap-sahel/BEATS-V5.md` — découpage beats + plan Partie 1 détaillé.
- `memory/episodes/warmap-sahel/reviews-p1/` — DA 3 voix sur Partie 1 (la matière du plan).
- `docs/plans/2026-06-10-warmap-sahel-refactor-parties.md` — LE plan d'exécution (Tasks 0-8).
- `memory/doctrines/WARMAP-VIVANTE-GRAMMAIRE.md` — R-V1..R-V4 (board clearing, Ken Burns, 1 transfo/plan, soustraction).
- `memory/doctrines/WARMAP-LONG-DOCTRINE.md` — format long (carte permanente, overlays 3 niveaux).
- `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md` — pipeline voix (si une partie audio à refaire : `--only-part`).
- `memory/episodes/warmap-sahel/DECISION-jetons-vs-vehicules.md` + `FACTS-PREPOSITIONNEMENT-2013.md`.

## OUTILS
- Render Mapbox : `./scripts/render-mapbox.sh <CompoId> <out.mp4> [--scale=N]`. `remotion still` NE marche PAS (WebGL).
  Netteté = FULL HD only (scale 0.4 = flou, fait douter à tort). Validation rapide itération = scale 0.4.
- Voix : `python3 scripts/generate-narration-expressive.py --text-file <txt> --out <mp3> [--only-part pX] [--dry-run]`.
- Alignment : `scripts/sahel-align-and-split-v5.py` (forced alignment + découpe par parties).
- DA-BRIEF : `scripts/tools/da-brief.py --brief <md> --label <x> [--upstream] --frame "path:caption"`.
  Gemini/Kimi = SIGNAL jamais juge (ils hallucinent). Vérifier chaque point contre le code/frames réels. Aziz tranche le goût.

## RÈGLES PROCESS
- Une tâche du plan à la fois. Render de vérification + non-régression Acte 1 entre chaque tâche visuelle.
- Bug visuel qui échoue 2× sur le même symptôme : STOP → `superpowers:systematic-debugging` (instrumenter, prouver).
- Trancher le technique seul (frames, imports, fix évident), regrouper le goût pour Aziz (couleurs, structure, effet).
- Commits fréquents sur `feat/da-brief-gate-warmap-sahel`. Ménage : ne pas committer Peste/Kora/templates (autres chantiers).
