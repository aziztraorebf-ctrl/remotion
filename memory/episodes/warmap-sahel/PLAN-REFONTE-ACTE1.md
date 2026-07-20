# PLAN REFONTE ACTE 1 AES — session dédiée (créé 2026-06-16)

> ⭐ LIRE EN PREMIER à la reprise. Objectif : refondre l'ouverture/Acte 1 de la War-Map Sahel AES.
> Le contexte de la session 2026-06-15/16 était plein → on fige le plan ici pour repartir au propre.
> Branche actuelle : `feat/hooks-library` (contient bibliothèque hooks + recalage Acte 1 V5).

---

## CE QUI EST DÉJÀ FAIT (acquis, ne pas refaire)

1. ✅ **Bibliothèque de hooks livrée** (`src/projects/_shared/hooks-lib/`, commits 581542a + 21f7649).
   3 hooks (CrosshairLock=traquer / RedlineContagion=propager / MaskReveal=chiffre-masque) + insert
   ArteryDrain + `HookMapBackground` (fond agnostique : theme dark/parchemin + camKeys caméra serrée
   + countriesGeoJson raccord carte + litStagger + punchZoom) + `HookEffects` (grain + displacement).
   Catalogue : `hooks-lib/HOOKS-LIBRARY-CATALOGUE.md`. Synthèse DA : `memory/projects/HOOKS-LIBRARY-PLAN.md`.

2. ✅ **Acte 1 RECALÉ sur narration V5** (commit a43f2ab). La v1 était désynchro (visuel en retard,
   -14f au hook → -342f dans le corps). Recalé : bloc `A1.*` + `F_HOOK_*`/`F_*` + `ACTE1_CAM_KEYS` +
   waypoints jetons + durée compo 2300→2126. **Synchro voix/visuel VALIDÉE Aziz** (render catbox 18wsph).
   EIGS au nommage f1461, END f2096. Cartographie source : `CARTOGRAPHIE-TRIGGERS-ACTE1-V5.md`.
   ⚠️ Audio V5 déjà branché dans le moteur (`narration-v5-expressive.mp3`, ligne ~2259). C'est le bon.

3. ✅ **Prototype hook branché TESTÉ** : `HookAESActe1Proto.tsx` (CrosshairLock + audio V5 20s, calé sur
   les 3 verbes chassent f145/rompent f217/quittent f286). Render catbox **bu8tnl**. La MÉCANIQUE marche
   (viseur→lock→allumage cadencé sur la voix, caméra serrée parchemin). C'est la BASE du futur hook.

## TEXTE V5 DE L'OUVERTURE (source de vérité, frames @30fps)
« En moins de trois ans, trois pays ont tout changé en même temps. [f0-145] Ils **chassent** leurs
partenaires militaires [f145]. **Rompent** leurs alliances historiques [f217]. Et **quittent** la
principale organisation régionale du continent [f286-361]. Et **bâtissent** quelque chose de **nouveau**
[f477]. **Comment est-ce possible** [f539] ? Et surtout… **pourquoi maintenant** [~f560] ? Pour
**répondre** à cette question [f684], il faut d'abord regarder ce qui existait avant. » (transcript complet : /tmp/v5-transcript.txt — RE-GÉNÉRER si /tmp purgé via l'alignment json)

---

## PROBLÈMES À ADRESSER (relevés par Aziz, session 06-16)

P1. **La carte du hook n'est pas tout à fait OK** — le proto CrosshairLock utilise sa propre carte
    parchemin (HookMapBackground), pas EXACTEMENT le rendu du moteur Acte 1 (qui a vignette sépia + grain
    + régions + légende). Raccord visuel hook→corps à régler.

P2. ⭐ **IDÉE AZIZ** : après les ~10 premières secondes du hook, faire un **ZOOM de transition** qui
    bascule vers "notre version de la map" (le rendu du moteur Acte 1). Donc : hook (0-10s, look hook) →
    zoom → corps Acte 1 (look moteur). C'est le pont hook→corps à concevoir.

P3. **L'Acte 1 doit être retravaillé de toute façon** (la "baseline" du début de session n'en est plus
    une — beaucoup de changements depuis). Au-delà du hook : retirer **légende "CONTRÔLE TERRITORIAL"**
    (haut-gauche) + **timeline graduée** (bas) + passer les **gros blocs colorés** → grammaire P3/P4
    (contours qui flashent). C'est le chantier "grammaire P3/P4" mentionné de longue date.

P4. **Calage fin du hook** : dans le proto, la question "COMMENT EST-CE POSSIBLE ?" s'affiche trop tôt
    (~f196 vs voix f539). CrosshairLock a un `questionAt = lockAt+56` hardcodé → exposer un prop
    `questionAt` pour le caler sur f539. (petit fix technique)

---

## PLAN PROPOSÉ POUR LA SESSION DÉDIÉE (ordre)

**Décision d'architecture à trancher en début de session** : hook = module SÉPARÉ concaténé au montage,
OU intégré DANS le moteur (remplace l'ouverture 0-24s). Reco : commencer module séparé (réversible,
zéro risque sur le moteur recalé), décider l'intégration après validation du hook.

1. **Finaliser le HOOK isolé** (~10s) sur audio V5 : partir de `HookAESActe1Proto`, corriger P4 (timing
   question), affiner le calage des 3 verbes, décider le texte/label. Valider le hook SEUL d'abord.
2. **Concevoir le PONT hook→corps (P2)** : le zoom de transition à ~10s qui passe du look hook au look
   moteur Acte 1. Soit le hook finit dans l'état visuel du corps, soit transition au montage.
3. **Retravailler le corps Acte 1 (P3)** : retirer légende + timeline + grammaire contours P3/P4.
   (Gros chantier visuel, peut être une sous-session.)
4. **Assembler** : hook + corps Acte 1 recalé, rendre en entier, valider synchro+raccord.

## GARDE-FOUS (leçons de la session)
- CAMÉRA SERRÉE (zoom 4.5-4.8) + pan, JAMAIS vue continent figée (camKeys). Regarder ACTE1_CAM_KEYS.
- Hook ≠ insert (crée une tension, ne l'explique pas). Pas de variantes-déco du même squelette.
- Recalage de durée → vérifier les `interpolate` à bornes monotones (2 crashs corrigés : finalDarken,
  eigsZoneGrow — bornes qui dépassaient/égalaient le nouveau END=2096).
- Render Mapbox = `scripts/render-mapbox.sh`, capturer le LOG COMPLET (`> log 2>&1`), pas `tail -3`
  (masque les erreurs React). Acte 1 complet = ~71s = render long (background).
- Audio V5 = source de vérité ; alignment = `narration-v5-alignment.json` ; clip hook = `hook-test/v5-hook-20s.mp3`.

## RENDERS DE RÉFÉRENCE (catbox)
- Acte 1 recalé V5 (synchro validée) : `18wsph`
- Prototype hook CrosshairLock+V5 : `bu8tnl`
- CrosshairLock caméra serrée (sans audio) : `9q75sr`
