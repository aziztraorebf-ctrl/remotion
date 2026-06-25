# Refonte Acte 1 — Hook crosshair sur la VRAIE carte + épuration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refondre l'ouverture (Acte 1) de la War-Map Sahel AES : un hook crosshair (~15s) posé sur la VRAIE carte du moteur (pas le look sépia parchemin de la biblio), carte épurée (sans légende factions, sans timeline, sans blocs colorés de contrôle), puis zoom continu vers le corps de l'Acte 1.

**Architecture :** Tout se fait DANS le moteur `SahelWarMapEngine.tsx` (1 seule Map continue, doctrine Souverain). Le viseur crosshair devient un calque SVG dessiné par-dessus la carte du moteur (PAS le composant `CrosshairLock` de la biblio qui amène sa propre carte parchemin). Le fond passe au look P3/P4 déjà validé : carte épurée + contours nationaux colorés (Mali ocre / Burkina brique / Niger sarcelle). Les triggers V5 validés (`F_HOOK_*`, `ACTE1_CAM_KEYS`) ne sont PAS touchés. Réversible : nouveau flag moteur `acte1Refonte` qui n'active les changements que sur l'Acte 1 refondu, l'ancien `acte1Final` reste intact comme filet.

**Tech Stack :** React + Remotion + Mapbox GL JS (headless WebGL), TypeScript. Render via `scripts/render-mapbox.sh` (flag `--gl=angle` obligatoire). Pas de tests unitaires — vérification = render + jugement visuel (matière finale d'abord).

**Contexte source de vérité :**
- Plan narratif / problèmes : `memory/episodes/warmap-sahel/PLAN-REFONTE-ACTE1.md`
- Triggers V5 : `F_HOOK_MALI`=145 (chassent), `F_HOOK_BURKINA`=217 (rompent), `F_HOOK_NIGER`=286 (quittent), `F_HOOK_CEDEAO`=361, `F_HOOK_LIPTAKO`=477, `F_HOOK_FREEZE`=539, `F_HOOK_DRIFT`=684.
- Caméra Acte 1 : `ACTE1_CAM_KEYS` (moteur l.531-549) — déjà calée V5, zoom 4.62→4.78. NE PAS TOUCHER.
- Contours colorés P3/P4 : `SAHEL_COUNTRY_COLORS` dans `engine/SahelControlData.ts` ; logique de rendu = `countryBordersTest`/`partie3`/`partie4` dans le moteur. Compo de réf `SahelCountryBordersTest`.
- Combattants AES commencent ~f960 (seconde ~32).
- Baseline non-régression : `out/episodes/warmap-sahel/_acte1-refonte/baseline-hook-f0-960.mp4`.

**Décisions Aziz verrouillées (cette session) :**
1. Carte = LE vrai look du moteur dès le départ, JAMAIS sépia/parchemin (`HookMapBackground` proscrit pour ce hook).
2. Épurer TOTALEMENT : virer légende "CONTRÔLE TERRITORIAL" (haut-gauche) + timeline/date (bas).
3. Plus de blocs colorés de contrôle (bleu/jaune/rouge) → look épuré P3/P4 (contours nationaux colorés).
4. Le crosshair EST le hook : ~15s, SANS carton, SANS question "COMMENT EST-CE POSSIBLE ?", SANS label texte.
5. 0→~15s : viseur + les 3 pays s'allument un par un (f145/217/286) + frontières qui se dessinent.
6. ~15s : zoom caméra léger plus serré (déjà dans `ACTE1_CAM_KEYS`).
7. ~15→32s : meublage à concevoir (Tâche dédiée, décision Aziz).
8. Architecture intégrée au moteur, 1 Map continue.

---

## Garde-fous (leçons gravées — NON-NÉGOCIABLES)

- **`semitransp` est BANNI** — ne PAS recréer un fill semi-transparent. Le look épuré = contours colorés, pas un fill translucide.
- **Render = capturer le LOG COMPLET** (`> log 2>&1`), jamais `tail -3` (masque les erreurs React).
- **Recalage de durée / bornes `interpolate`** : vérifier que toutes les bornes sont monotones et dans la plage (2 crashs passés : `finalDarken`, `eigsZoneGrow`).
- **Netteté** : juger la qualité visuelle UNIQUEMENT sur render `scale=1` (full HD). Les extraits scale<1 sont flous et trompeurs.
- **Piège JSX légende+timeline** (moteur l.3275) : la légende factions ET la timeline graduée sont dans le MÊME fragment `<>`. Gater le fragment entier masque les deux. Gater chaque bloc par sa CONDITION PROPRE, pas le fragment parent.
- **Caméra serrée + pan, jamais vue continent figée** : respecter `ACTE1_CAM_KEYS`.
- **NE PAS toucher** : `acte1Final` (filet), triggers V5, audio V5 branché. Tout passe par le nouveau flag `acte1Refonte`.
- **Mémoire** : si du code contredit une décision documentée, le CODE est faux → signaler, ne pas continuer.

---

## Task 0 : Baseline non-régression (EN COURS / FAIT)

**Files:** aucun (render seul).

**Step 1 :** Render baseline de l'Acte 1 actuel, fenêtre hook+début.
Run : `./scripts/render-mapbox.sh SahelActe1-Final out/episodes/warmap-sahel/_acte1-refonte/baseline-hook-f0-960.mp4 --frames=0-960 > /tmp/baseline-acte1-render.log 2>&1`
Expected : EXIT 0, fichier .mp4 créé (~32s). (Lancé en arrière-plan au début de session.)

**Step 2 :** Vérifier le log pour 0 erreur React + lire quelques frames pour constater l'état AVANT (légende active, timeline active, blocs colorés).

---

## Task 1 : Flag `acte1Refonte` + raccordement compo (réversibilité)

**Files:**
- Modify: `src/projects/warmap/engine/SahelWarMapEngine.tsx` (interface props + destructuring + gates dérivés)
- Modify: `src/Root.tsx` (nouvelle compo `SahelActe1-Refonte`)

**Step 1 :** Ajouter `acte1Refonte?: boolean;` à l'interface des props du moteur (près de `partie4?: boolean;`, l.1073).

**Step 2 :** L'ajouter au destructuring avec défaut `acte1Refonte = false,` (près de l.1105).

**Step 3 :** Le raccorder aux gates existants. Il doit se comporter comme l'Acte 1 pour la caméra et l'allumage des 3 pays MAIS comme P3/P4 pour le look épuré. Donc :
- L'inclure dans `isFinalLook` (l.1119) pour hériter jetons/palette/grain/caméra Acte 1.
- L'inclure dans `useActe1Cam` (l.1135) pour la trajectoire caméra Acte 1 (via `isFinalLook`, déjà couvert — vérifier).
- NE PAS l'inclure dans `isPartie` (sinon il prendrait les caméras getPartieNCam). Vérifier ligne 1121.

**Step 4 :** Enregistrer la compo dans `src/Root.tsx`, copie exacte de `SahelActe1-Final` (même durée, même fps) mais `defaultProps={{ acte1Refonte: true }}`. id `SahelActe1-Refonte`.

**Step 5 :** Render de sanité — DOIT être identique à la baseline (le flag ne change encore rien).
Run : `./scripts/render-mapbox.sh SahelActe1-Refonte out/episodes/warmap-sahel/_acte1-refonte/t1-sanity-f0-600.mp4 --frames=0-600 > /tmp/t1-render.log 2>&1`
Expected : EXIT 0, rendu identique baseline. Si différent → le flag fuit quelque part, corriger avant de continuer.

**Step 6 :** Commit.
```bash
git add src/projects/warmap/engine/SahelWarMapEngine.tsx src/Root.tsx
git commit -m "feat(warmap-sahel): flag acte1Refonte (filet reversible, identique a acte1Final)"
```

---

## Task 2 : Épuration — masquer légende factions + timeline en `acte1Refonte`

**Files:**
- Modify: `src/projects/warmap/engine/SahelWarMapEngine.tsx` (bloc HUD l.3279-3360 environ)

**Step 1 :** Localiser le bloc légende factions (l.3279, condition de visibilité) et la timeline graduée (l.3322+). Lire les conditions propres de CHAQUE bloc (PAS le fragment parent — piège l.3275).

**Step 2 :** Ajouter `&& !acte1Refonte` à la condition propre de la légende factions.

**Step 3 :** Ajouter `&& !acte1Refonte` à la condition propre de la timeline graduée. Vérifier qu'aucun autre élément HUD (label événement) ne reste indésirable ; si oui, le gater aussi.

**Step 4 :** Render de contrôle (hook 0-600).
Run : `./scripts/render-mapbox.sh SahelActe1-Refonte out/episodes/warmap-sahel/_acte1-refonte/t2-epure-f0-600.mp4 --frames=0-600 > /tmp/t2-render.log 2>&1`
Expected : EXIT 0. Lire 3-4 frames : PLUS de légende haut-gauche, PLUS de timeline en bas. Les blocs colorés sont ENCORE là (Tâche 3).

**Step 5 :** Commit.
```bash
git add src/projects/warmap/engine/SahelWarMapEngine.tsx
git commit -m "feat(warmap-sahel): acte1Refonte epure le HUD (legende factions + timeline off)"
```

---

## Task 3 : Look épuré — contours nationaux colorés P3/P4 à la place des blocs de contrôle

**Files:**
- Modify: `src/projects/warmap/engine/SahelWarMapEngine.tsx` (gate du rendu contours + gate `sahel-fill`)

**Step 1 :** Identifier comment les contours nationaux colorés sont activés (gate `partie3 || partie4 || countryBordersTest` autour du rendu SVG `countryBorderPaths`). Ajouter `|| acte1Refonte` à ce gate.

**Step 2 :** Neutraliser les BLOCS COLORÉS de contrôle (`sahel-fill` palette factions bleu/jaune/rouge) en mode `acte1Refonte`. Approche : passer le fill à un look neutre/épuré comme en P4 (parchemin uniforme) plutôt que la palette factions. Repérer où `sahel-fill` reçoit ses couleurs (l.1271-1325) et le `fill-opacity` séquentiel (`effSeqIgnite` l.1286). En `acte1Refonte`, le fill doit rester neutre — l'allumage des 3 pays se fait par le CONTOUR qui se dessine + pulse (Tâche 4), pas par le bloc plein.
  - ⚠️ Décision technique : soit forcer la couleur du fill à neutre quand `acte1Refonte`, soit baisser fortement l'opacité du fill factions et laisser les contours porter la lecture. À trancher en lisant le code exact ; préférer la solution qui reproduit EXACTEMENT le look P4 (vérifier comment P4 neutralise `sahel-fill`).

**Step 3 :** Vérifier les `CONTOUR_HIDE_WINDOWS` — elles concernent P3/P4 (f6118+), aucune ne tombe dans 0-960, donc les contours seront visibles sur tout le hook. OK, rien à changer.

**Step 4 :** Render de contrôle (hook 0-960, full HD).
Run : `./scripts/render-mapbox.sh SahelActe1-Refonte out/episodes/warmap-sahel/_acte1-refonte/t3-contours-f0-960.mp4 --frames=0-960 > /tmp/t3-render.log 2>&1`
Expected : EXIT 0. Lire frames clés (f100 avant allumage, f300 après les 3 pays, f600 freeze) : carte épurée + contours nationaux colorés visibles, PLUS de gros blocs bleu/jaune/rouge. Comparer netteté à scale=1.

**Step 5 :** PRÉSENTER à Aziz (catbox + ntfy) — c'est un changement de look majeur, validation requise AVANT le viseur.

**Step 6 :** Commit (après validation Aziz).
```bash
git add src/projects/warmap/engine/SahelWarMapEngine.tsx
git commit -m "feat(warmap-sahel): acte1Refonte look epure = contours nationaux colores P3/P4 (plus de blocs de controle)"
```

---

## Task 4 : Allumage des 3 pays par le contour (draw-in + pulse sur f145/217/286)

**Files:**
- Modify: `src/projects/warmap/engine/SahelWarMapEngine.tsx`

**Step 1 :** Vérifier que `effFrontDraw`/`effSeqIgnite` (déjà actifs en `isFinalLook`) produisent bien un "draw-in" du contour de chaque pays sur `F_HOOK_MALI`/`BURKINA`/`NIGER`. Si l'allumage actuel passait par le FILL (neutralisé en Tâche 3), il faut que le CONTRARY coloré prenne le relais : ajouter les frames 145/217/286 à la logique de pulse/draw-in des contours nationaux (référence `COUNTRY_PULSES` l.407, mais ces frames-là sont >1300 ; pour l'Acte 1 le commentaire l.405 dit "géré à part").

**Step 2 :** Implémenter : en `acte1Refonte`, sur f145 le contour MLI se dessine + pulse ocre ; f217 BFA brique ; f286 NER sarcelle. Réutiliser la mécanique draw-in/pulse existante des contours (countryOutline / draw-in P3/P4).

**Step 3 :** Render de contrôle (0-400, voir les 3 allumages).
Run : `./scripts/render-mapbox.sh SahelActe1-Refonte out/episodes/warmap-sahel/_acte1-refonte/t4-allumage-f0-400.mp4 --frames=0-400 > /tmp/t4-render.log 2>&1`
Expected : EXIT 0. f150 Mali allumé seul, f230 +Burkina, f300 +Niger. Allumage par contour, pas par bloc.

**Step 4 :** Commit.
```bash
git add src/projects/warmap/engine/SahelWarMapEngine.tsx
git commit -m "feat(warmap-sahel): acte1Refonte allumage 3 pays par contour (draw-in+pulse f145/217/286)"
```

---

## Task 5 : Viseur crosshair en calque SVG (hook ~0-15s), SANS carton/question/label

**Files:**
- Modify: `src/projects/warmap/engine/SahelWarMapEngine.tsx` (nouveau calque SVG, gaté `acte1Refonte`)

**Step 1 :** Concevoir le calque. Réutiliser la GRAMMAIRE visuelle du viseur de `CrosshairLock.tsx` (grille de coords qui s'efface au lock, anneau double, crochets de coin qui claquent, lignes guides HUD) MAIS :
  - dessiné par-dessus la carte du moteur (pas via HookMapBackground) ;
  - cible projetée via la closure `project()` du moteur (centre AES) ;
  - SANS label, SANS subLabel, SANS question, SANS pulsation rouge de tension (épuration) ;
  - phase recherche 0→~lock, lock vers ~f140 (juste avant "chassent" f145), viseur s'efface après ~f350 (après que les 3 pays soient allumés), bien avant le freeze f539.
  - timing : le viseur vit f0→~f400, la caméra + allumage prennent le relais.

**Step 2 :** Implémenter le calque SVG inline dans le moteur, gaté `acte1Refonte && frame < ~420`. Couleurs : ink = teinte carte épurée (brun foncé lisible), lockColor = accent rouge sobre `#B14B3C` (cohérent biblio). Projeter le centre via la fonction de projection du moteur déjà utilisée pour les jetons/labels.

**Step 3 :** Vérifier les bornes `interpolate` (monotones, clamp). Pas de borne qui dépasse.

**Step 4 :** Render de contrôle (0-450, voir recherche→lock→effacement).
Run : `./scripts/render-mapbox.sh SahelActe1-Refonte out/episodes/warmap-sahel/_acte1-refonte/t5-viseur-f0-450.mp4 --frames=0-450 > /tmp/t5-render.log 2>&1`
Expected : EXIT 0. f30 viseur cherche, f140 lock (crochets claquent), f300 viseur s'efface, allumage visible. AUCUN texte/carton/question.

**Step 5 :** PRÉSENTER à Aziz (le hook isolé).

**Step 6 :** Commit (après validation).
```bash
git add src/projects/warmap/engine/SahelWarMapEngine.tsx
git commit -m "feat(warmap-sahel): acte1Refonte viseur crosshair en calque (sans carton/question/label)"
```

---

## Task 6 : Meublage ~15→32s (f450→960) — CONCEPTION avec Aziz

**Files:** TBD (décision Aziz d'abord).

**Step 1 :** AVANT de coder : présenter à Aziz 2-3 options de meublage du creux (entre la fin du hook ~f450 et l'arrivée des combattants AES ~f960). La voix V5 sur cette fenêtre dit "comment / pourquoi maintenant ? Pour répondre à cette question il faut d'abord regarder ce qui existait avant" (freeze f539, drift f684). Options à proposer : drift caméra lent sur la zone + pulse doux des contours / amorce de transition vers le corps / autre. NE PAS coder avant le choix (goût + coûteux à défaire).

**Step 2+ :** Implémenter l'option choisie, render de contrôle, commit. (Détail à compléter une fois l'option tranchée.)

---

## Task 7 : Render Acte 1 complet refondu + jugement final

**Files:** aucun (render).

**Step 1 :** Render full HD de l'Acte 1 refondu complet (0 → fin Acte 1 f2096, avec audio).
Run : `./scripts/render-mapbox.sh SahelActe1-Refonte out/episodes/warmap-sahel/_acte1-refonte/acte1-refonte-FULL.mp4 > /tmp/acte1-full-render.log 2>&1`
Expected : EXIT 0. Vérifier log 0 erreur React, synchro voix/visuel conservée (triggers V5 intacts), raccord hook→corps fluide, look épuré cohérent.

**Step 2 :** Self-review (frames + audio + timing) PUIS présenter à Aziz (catbox + ntfy).

**Step 3 :** Si validé : promouvoir, mettre à jour `STATUS.md` + `NEXT-ACTION.md` + `PLAN-REFONTE-ACTE1.md` (problèmes P1-P4 résolus), décider l'intégration définitive (remplacer `acte1Final` ou garder les deux).

---

## Notes d'exécution

- Entre chaque tâche : render de contrôle + lecture de frames AVANT de continuer. Matière finale d'abord.
- Tâches 3, 5, 6, 7 = points de validation Aziz (look, hook, meublage, final). Les autres = techniques, on enchaîne.
- Si un render échoue : lire le LOG COMPLET, appliquer systematic-debugging, ne pas empiler les modifs sur un état cassé.
- Le `CrosshairLock.tsx` de la biblio reste intact (utilisable pour d'autres vidéos en look parchemin). On en COPIE la grammaire, on ne le réutilise pas tel quel ici.
