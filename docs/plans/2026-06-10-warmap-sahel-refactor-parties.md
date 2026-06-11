# Refactor War-Map Sahel — Moteur fin + Parties séparées — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transformer le moteur monolithique `SahelWarMapEngine.tsx` (3261 lignes) en un moteur-fin (carte/caméra/état partagé) + un fichier React par Partie du récit V5, pour que chaque partie soit éditable sans risque de régression sur les autres — tout en gardant l'état continu propre à la War-Map (différentiel "plan-séquence sans coupe").

**Architecture :** La War-Map a un ÉTAT CONTINU (jetons/taches qui persistent, caméra qui glisse sans coupe) — donc on NE peut PAS la découper en fichiers indépendants concaténés façon Atlas/Souverain. Solution : UN moteur conteneur qui détient carte + projection géo + caméra + état + grain/vignette + audio, et qui passe à chaque `<PartieX>` un CONTEXTE (frame courante, fonction de projection lon/lat→px, état de contrôle). Chaque Partie est un composant pur qui dessine SA couche par-dessus la carte. L'Acte 1 reste un cas dans le moteur (intact, validé). Les Parties 1-4 (récit V5) deviennent 4 fichiers isolés.

**Tech Stack :** React + Remotion + Mapbox GL (frame-driven, `useCurrentFrame` + `interpolate` + `map.jumpTo`), TypeScript, SVG overlays (mixBlendMode multiply), forced-alignment (`narration-v5-alignment.json`) comme source unique des triggers.

---

## CONTEXTE CRITIQUE (lire avant toute tâche)

1. **L'Acte 1 est VALIDÉ et INTACT** (`acte1-FINAL.mp4`, catbox slchjv). Toute tâche doit prouver la NON-RÉGRESSION de l'Acte 1 (frames identiques avant/après). C'est le test de référence (pas de tests unitaires — vérification VISUELLE par render comparé).
2. **Les triggers du moteur sont DÉCALÉS** : le code V5 actuel est calé sur un audio antérieur. Audio V5 final = `narration-v5-alignment.json`. Écarts mesurés : Kidal f7279→**f7084** (-195), flotte f8683→**f8132** (-551), Djibo f10294→**f9790** (-504). TOUT trigger récit doit être recalé sur cet alignment.
3. **Du code V5 est DÉJÀ câblé** dans le monolithe (F_AES_NEE, F_KIDAL_*, F_REF_*, F_ICON_*) sur l'ancien `acte2`/legacy. Le refactor RÉORGANISE ce code, il ne part pas de zéro. Ne RIEN perdre.
4. **Plan Partie 1 validé** (DA 3 voix + Aziz) : `memory/episodes/warmap-sahel/BEATS-V5.md` section CANARI + `reviews-p1/`. Soustraction (flux d'encre + taches d'impact + vide par opacité + hachures), PAS d'overlay, PAS d'objets.
5. **Vérification = render Mapbox** : `./scripts/render-mapbox.sh <CompoId> <out.mp4> [--scale=N]`. `remotion still` NE marche PAS (WebGL). Netteté = full HD only. Validation rapide = scale 0.4.
6. **Commits fréquents** sur branche `feat/da-brief-gate-warmap-sahel`.

---

## Task 0 : Filet de sécurité — render de référence Acte 1 AVANT tout

**Files:** aucun (capture baseline).

**Step 1 :** Render 3 frames-clés de l'Acte 1 actuel (état validé) comme RÉFÉRENCE non-régression.
Run: `./scripts/render-mapbox.sh SahelActe1-Final out/episodes/warmap-sahel/_refactor-baseline/acte1.mp4 --scale=0.5`
Puis extraire f1400, f2167, f2299 : `ffmpeg -i ...acte1.mp4 -vf "select=eq(n\,N)" ...`

**Step 2 :** Sauvegarder ces 3 PNG dans `out/episodes/warmap-sahel/_refactor-baseline/`. Ce sont les images-témoins.
Expected: 3 PNG nets. Toute tâche ultérieure re-render ces frames et compare visuellement.

**Step 3 : Commit** (baseline, pas de code) — skip, juste garder les fichiers locaux.

---

## Task 1 : Extraire le CONTEXTE moteur (type + projection) sans rien changer au rendu

**Files:**
- Create: `src/projects/warmap/engine/SahelContext.ts`
- Modify: `src/projects/warmap/engine/SahelWarMapEngine.tsx` (exporter la fn de projection + type contexte)

**Step 1 :** Définir le type `SahelRenderContext` :
```typescript
export type SahelRenderContext = {
  frame: number;
  width: number;
  height: number;
  project: (lon: number, lat: number) => { x: number; y: number }; // lon/lat -> px écran
  controlAt: number; // état de contrôle territorial à cette frame (0..1) si pertinent
  breathe: number;   // facteur de respiration/color-pacing global (0..1)
};
```

**Step 2 :** Dans le moteur, identifier la fonction qui projette lon/lat→px (via `map.project()` ou équivalent). L'exposer proprement pour la passer aux Parties.

**Step 3 : Render non-régression** Acte 1 (scale 0.4, f1400/f2167). Comparer aux baselines Task 0.
Expected: IDENTIQUE (on n'a fait qu'ajouter un type, zéro changement de rendu).

**Step 4 : Commit** `refactor(warmap): extract SahelRenderContext type + projection`

---

## Task 2 : Créer la coquille `<Partie1Origine>` VIDE branchée, legacy acte2 OFF

**Files:**
- Create: `src/projects/warmap/parties/Partie1Origine.tsx`
- Modify: `SahelWarMapEngine.tsx` (rendre le bloc `acte2` conditionnel à un nouveau mode, insérer `<Partie1Origine ctx={...} />`)

**Step 1 :** Créer `Partie1Origine.tsx` = composant qui reçoit `ctx: SahelRenderContext` et retourne `null` pour l'instant (coquille vide).

**Step 2 :** Dans le moteur, ajouter prop `partie1?: boolean`. Quand `partie1`, le bloc B1 legacy (lignes ~2941+) est DÉSACTIVÉ et on rend `<Partie1Origine ctx={buildCtx(frame)} />`.

**Step 3 :** Enregistrer une compo Root `SahelPartie1` (mode partie1, durée = f1850→f2940 ~ couvre board clearing + 3 beats).

**Step 4 : Render** `SahelPartie1` scale 0.4. Expected: carte + Acte 1 visible jusqu'au board clearing, puis RIEN de neuf (coquille vide). Acte 1 non touché (legacy OFF mais Acte 1 ON).

**Step 5 : Commit** `refactor(warmap): scaffold Partie1Origine shell + partie1 mode`

---

## Task 3 : Beat 1.0 — Board clearing + repère LIBYE + "2012" (dans Partie1Origine)

**Files:** Modify `src/projects/warmap/parties/Partie1Origine.tsx`

**Step 1 :** Triggers recalés sur alignment V5. "Tout bascule en 2012" = chercher dans alignment le mot "bascule"/"2012". Board clearing AVANT (≈ -1.5s). Définir `F_P1_CLEAR`, `F_P1_2012`.

**Step 2 :** Board clearing : estomper jetons Acte 1 → opacity 0.2 (le moteur doit exposer un facteur `fighterFade` piloté par la Partie, OU la Partie reçoit l'info et le moteur applique). Décision technique : le moteur lit un `partieFade` calculé. Implémenter le fondu 1.5s.

**Step 3 :** Repère "LIBYE" (texte encre opacity 0.6, géo-ancré via `ctx.project(LIBYE)`) + "2012" en encre qui se remplit (mask animé). Timeline démarre glissement.

**Step 4 : Render** `SahelPartie1` scale 0.4 sur f1850→f2150. Expected: jetons s'estompent en fantômes, "LIBYE" + "2012" apparaissent. PUIS non-régression Acte 1 (re-render baseline).

**Step 5 : Commit** `feat(warmap-p1): beat 1.0 board clearing + reperes Libye/2012`

---

## Task 4 : Beat 1.1 — Pulse Libye (effondrement)

**Files:** Modify `Partie1Origine.tsx`

**Step 1 :** Au F_P1_2012 (recalé), pulse sombre sur Libye via `ctx.project(LIBYE_COORD)`. Réutiliser la logique onde-radar (cercles concentriques opacity décroissante), couleur encre, ~2-3s lent.

**Step 2 :** Libye reste "chaude" (teinte fixe légère) après le pulse. Caméra plan large (sud-Libye + Sahel) — vérifier que getCam couvre la Libye dans le cadre à cette frame.

**Step 3 : Render** scale 0.4 sur le beat. Expected: pulse lisible sur la Libye, dans le cadre.

**Step 4 : Commit** `feat(warmap-p1): beat 1.1 pulse Libye effondrement`

---

## Task 5 : Beat 1.2 — Trait d'encre Libye→Mali + taches d'impact

**Files:** Modify `Partie1Origine.tsx`

**Step 1 :** Trigger "flot d'armes" (recalé alignment). Trait d'encre : `<path>` stroke-dashoffset animé, route RÉELLE Libye→nord Mali (points via Ghat/Aouzou, PAS ligne droite). Épaisseur variable (épais source→fin pointe). Couleur brun-encre. mixBlendMode multiply.

**Step 2 :** Arrivée = 3 taches d'impact (Kidal/Gao/Tombouctou) : taches d'encre `#8B3A3A` multiply, scale 0→1 overshoot, délai 0.2s entre les 3. PAS de flammes.

**Step 3 :** Caméra FIXE pendant la descente du trait (l'œil suit le trait). Vérifier getCam.

**Step 4 : Render** scale 0.4. Expected: trait se dessine de la Libye au Mali, 3 taches "splat" décalées. Lisible, pas TikTok.

**Step 5 : Commit** `feat(warmap-p1): beat 1.2 trait encre + taches impact`

---

## Task 6 : Beat 1.3 — Vide d'État (soustraction) + hachures tensions

**Files:** Modify `Partie1Origine.tsx`

**Step 1 :** Trigger "État absent" (recalé). Caméra Ken Burns lent vers centre Mali/nord Burkina APRÈS pose des taches.

**Step 2 :** Trait 1.2 → veine fine (opacity 0.2) persistante Libye→Mali.

**Step 3 :** VIDE = chute fill-opacity des zones rurales → ~0.1, opacité forte gardée près des capitales seulement. Frontières restent (structure fantôme). Implémentation : le moteur expose le contrôle d'opacité des polygones rural vs capitale, piloté par la Partie.

**Step 4 :** TENSIONS = hachures (pattern SVG `<line>` répétées, opacity 0→0.35) fade-in au mot "tensions". PAS d'icônes.

**Step 5 : Render** scale 0.4 sur le beat. Expected: l'État "s'évapore" visuellement, hachures dans le vide. Le paradoxe se lit sans texte.

**Step 6 : Commit** `feat(warmap-p1): beat 1.3 vide d'Etat soustraction + hachures`

---

## Task 7 : Render Partie 1 FULL HD + non-régression Acte 1 finale

**Files:** aucun (validation).

**Step 1 :** Render `SahelPartie1` FULL HD (pas de scale) avec audio `narration-v5-expressive.mp3`.

**Step 2 :** Vérifier : netteté, sync voix↔visuel (triggers alignment justes), les 4 beats lisibles, aucun élément TikTok, palette parchemin.

**Step 3 :** Render Acte 1 complet FULL HD → comparer aux baselines Task 0. NON-RÉGRESSION absolue.

**Step 4 :** Upload catbox, présenter à Aziz (jugement goût). DA-BRIEF downstream optionnel.

**Step 5 : Commit** `feat(warmap-p1): Partie 1 canari complete (full HD valide)`

---

## Task 8 (APRÈS validation Aziz) : Supprimer le legacy acte2 + généraliser le pattern

**Files:** Modify `SahelWarMapEngine.tsx` (supprimer bloc B1 legacy + constantes B1_*/ACTE2_* mortes)

**Step 1 :** Une fois la Partie 1 validée, supprimer le code B1 legacy (avion/convoi/emprises/relay) + constantes mortes. Vérifier non-régression Acte 1 + Partie 1.

**Step 2 :** Documenter le pattern `<PartieX ctx={...} />` dans STATUS.md pour que les Parties 2-4 le suivent.

**Step 3 : Commit** `refactor(warmap): remove B1 legacy, document Partie pattern`

---

## NOTES D'EXÉCUTION
- Une tâche à la fois. Render de vérification + non-régression Acte 1 entre chaque tâche visuelle.
- Si un beat échoue 2× : STOP → `superpowers:systematic-debugging` (instrumenter, prouver la valeur réelle).
- Gemini/Kimi = signal jamais juge. Aziz tranche le goût.
- Les Parties 2-4 réutiliseront ce pattern (objets Gemini sur carte : drapeau P3, or/uranium P4 — à générer le moment venu).
