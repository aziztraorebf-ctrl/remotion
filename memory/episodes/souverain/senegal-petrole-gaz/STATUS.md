# STATUS — Sénégal Pétrole & Gaz (Mid-form 7min34s)
> Mis à jour : 2026-06-01

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

## PROCHAINE ACTION

**Étape 1 (30 min)** : Appliquer FC-2 et FC-4 en priorité AVANT l'assemblage

**Étape 2** : Lancer l'assemblage
```
Lire : memory/STARTER-PROMPT-senegal-assemblage-final.md
```

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
