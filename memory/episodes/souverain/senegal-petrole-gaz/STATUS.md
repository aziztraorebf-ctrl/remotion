# STATUS — Sénégal Pétrole & Gaz (Mid-form 7min39s)

> ⛔⛔ **CE FICHIER DÉCRIT LA V1 (ancienne version). NE PAS L'UTILISER POUR LA REFONTE EN COURS.**
> Depuis le 2026-06-18, le projet est en **REFONTE V3 scène par scène**. SOURCE DE VÉRITÉ UNIQUE =
> **`V3-REFONTE/README.md`** (+ `V3-REFONTE/STARTER-SCENE-1.md`). V1 = filet/comparatif, supprimée quand V3 complète.
> Ce STATUS reste seulement comme référence de l'état V1. NE PAS partir d'ici pour AGIR.
>
> ✅✅ **2026-07-05 — V3 TERMINÉE + PRÊT-PUBLICATION.** Passe de finition ROUND 1 (dédoublements audio,
> écran gris Mapbox, carte gisements harmonisée) + ROUND 2 (mot "précise" tronqué, mot "trois"
> répété/coupé, musique gisements absente, silence "décide...vraiment du résultat", labels texte scène
> coin supprimés, écran gris de transition supprimé, +1.5s de respiration avant coupe gisements→Norvège)
> — tous corrigés et validés Aziz. Commits `207d223` + `606aff4` sur branche `fix/senegal-v3-passe-finition`.
> **Livrable final** : `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4` (+ `-compressed.mp4`).
> Plus aucune action technique en attente — NEXT = programmer la publication (décision Aziz).

> Mis à jour : 2026-06-16 (MAKEOVER PREMIUM en cours — ⚠️ approche abandonnée au profit de la refonte V3)

> ⭐ **REPRISE : `memory/STARTER-PROMPT-senegal-makeover-premium.md`** (état réel + plan A-E).
> ⚠️ **CE STATUS CI-DESSOUS (sections FC) EST PARTIELLEMENT PÉRIMÉ** — vérifié dans la vraie vidéo le 2026-06-16 :
> - FC-2 (dette 132%) : ✅ DÉJÀ FAIT (calebasse 132% Beat12 + audio). PAS "à corriger".
> - FC-4 (Beat0 deux dates) : ✅ DÉJÀ FAIT (visuel "22 MAI 2026" + audio "un mois plus tard").
> - La dette/calebasse est dans **Beat12**, PAS Beat11 (le tableau ci-dessous se trompait de numéro).
> - Incohérence 80% vs 132% (Beat14) : trouvée + corrigée le 2026-06-16.
> - La vidéo du 25 mai est DÉJÀ PUBLIABLE. Le chantier en cours = MAKEOVER premium (carte vivante + kraft + audio V3), deadline décalable.

---

## ÉTAT

| Segment | Fichier(s) | Render FINAL | Notes |
|---------|-----------|-------------|-------|
| Beat0 Accroche | Beat0Accroche.tsx | beat0-FINAL.mp4 ✅ | Validé |
| Acte 1 | Beat1→Beat9 | senegal-acte1-FINAL.mp4 ✅ | Assemblage acte validé |
| Acte 2 | SenegalActe2Continu.tsx | acte2-FINAL.mp4 ✅ | Assemblage acte validé |
| Beat10 | Beat10.tsx | beat10-FINAL.mp4 ✅ | Validé |
| Beat11 | Beat11.tsx | beat11-FINAL.mp4 ✅ | Validé — contient erreur FC-2 (voir corrections) |
| Beat12 | Beat12.tsx | beat12-FINAL.mp4 ✅ | Validé |
| Beat13 | Beat13.tsx | beat13-FINAL.mp4 ✅ | Validé |
| Beat14 | Beat14.tsx | beat14-FINAL.mp4 ✅ | Validé |
| **Assemblage final** | — | **AUCUN** ⛔ | Tous les beats sont FINAL, l'épisode complet reste à assembler |

**Audio** : `public/souverain/senegal-petrole-gaz/narration-v1-clean.mp3` ✅
**Musiques** : `public/souverain/senegal-petrole-gaz/music-A/B/C.mp3` ✅

---

## BLOQUÉ SUR

Pas bloqué techniquement — les beats sont tous validés. Ce qui reste :

1. **Assemblage** : concaténer Beat0 + Acte1 + Acte2 + Beat10→14 dans une composition `SenegalEpisodeComplet`
2. **SFX** : ajouter les effets sonores documentés dans le JSON Gemini storyboard
3. **Corrections fact-check** : 2 corrections prioritaires avant publication (FC-2 et FC-4 ci-dessous)
4. **Mix audio** : vérifier les niveaux sur l'assemblage complet (transitions entre actes)

---

## PROCHAINE ACTION (MAJ 2026-06-17)

> ⚠️ Sections ci-dessous PÉRIMÉES : FC-2 (132%) et FC-4 sont DÉJÀ FAITS. La vidéo 25 mai est publiable.
> Chantier actuel = MAKEOVER PREMIUM + audio V3 + carte vivante.

**SOURCE UNIQUE** : `memory/STARTER-PROMPT-senegal-makeover-premium.md` (retiming-v3 + assemblage-final fusionnés/supprimés).
**État** : audio V3 validé · hook Beat0 refondu (v5 « Compteur→Courbe→Crash », à valider Aziz).
**NEXT** : valider Beat0 v5 → re-timing séquentiel Acte1 (Beat1-9) → suite. Lire aussi `memory/doctrines/HOOK-PREMIERE-MINUTE.md`.

---

## CORRECTIONS OUVERTES (obligatoires avant publication)

### FC-2 — Dette 70% → 132% du PIB ⚠️ PRIORITÉ HAUTE
- **Beat** : Beat11 (LaCalebasse)
- **Problème** : audio dit "soixante-dix pour cent", chiffre réel = 132% (révisé FMI 2025)
- **Action requise** :
  1. Re-générer segment audio avec ElevenLabs (phrase "soixante-dix" → "cent trente-deux")
  2. Modifier Beat11 : calebasse niveau 132% avec débordement + animation gouttes
  3. Remplacer "70%" par "132%" dans tous les overlays Beat11
- **Fichier** : `src/projects/souverain/senegal-petrole-gaz/beats/Beat11.tsx`

### FC-4 — Beat0 : Yakaar (avril) et dissolution gouvernement (mai) sont deux événements distincts ⚠️ PRIORITÉ HAUTE
- **Beat** : Beat0Accroche.tsx
- **Problème** : présentés comme simultanés alors qu'ils sont séparés d'un mois
- **Action requise** : Beat0 est à refaire de toute façon (refonte visuelle prévue) — intégrer la correction dans la nouvelle version
- **Fichier** : `src/projects/souverain/senegal-petrole-gaz/beats/Beat0Accroche.tsx`

### FC-1 — "8 millions $/jour" (Acte 1, ~0:25) — PRIORITÉ BASSE
- Label overlay discret : `"(estimation au cours marché — Woodside : 100 000 b/j)"`
- **Beat** : Beat1, BigStat

### FC-3 — Fonds norvégien 1 500→2 000 milliards — PRIORITÉ BASSE
- Valeur historique toujours vraie. Label optionnel `"(plus de 2 000 Mds$ en 2026 — NBIM)"`.
- **Beat** : Beat10

---

## ASSETS DISPONIBLES

- Tous les beats FINAL dans `out/episodes/senegal-petrole-gaz/`
- Audio narration : `public/souverain/senegal-petrole-gaz/narration-v1-clean.mp3`
- Musiques A/B/C : `public/souverain/senegal-petrole-gaz/`
- Composant LaCalebasse (Beat11) : `src/projects/_shared/components/layouts/LaCalebasse.tsx`
- Composant SenegalActe2Continu (Mapbox continu) : `src/projects/souverain/senegal-petrole-gaz/SenegalActe2Continu.tsx`

---

## TECHNIQUES DÉVELOPPÉES DEPUIS QUI S'APPLIQUENT ICI

| Technique | Source | Application Sénégal |
|---|---|---|
| **Audio music loop tardif** | memory/feedback_audio-music-loop-startfrom-tardif.md | Vérifier que la musique ne coupe pas en fin d'Acte 3/4 à l'assemblage |
| **D3.js StackedBars** | `memory/feedbacks/feedback_d3-pattern-utility-only.md` | Si on veut améliorer Beat11 (calebasse → bar chart D3 pour le 132%) |
| **Render cloud Vercel** | `scripts/tools/render-on-vercel.py` | L'assemblage final (~7min34s) = render long → utiliser Vercel par défaut |
| **Downscale avant review** | `scripts/downscale-for-review.sh` | Review de l'assemblage complet — 453s = beaucoup de frames |
