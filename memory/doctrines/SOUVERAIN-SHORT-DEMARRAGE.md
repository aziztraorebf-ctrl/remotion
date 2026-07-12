# Démarrage Short Souverain — Procédure universelle

> Utiliser pour TOUT nouveau Short, peu importe le sujet ou le pays.
> Lire dans cet ordre avant de toucher au code.

## Étape 1 — Pré-production (si pas déjà faite)
→ Skill `/souverain-preproduction`
Résultat : script locked + audio ElevenLabs + musique Minimax + timing.ts + maroc-words.ts (forced alignment)

## Étape 2 — Créer le dossier épisode
```
src/projects/souverain/<nom-episode>/
  MarocBatteriesShort.tsx  ← renommer selon l'épisode
  timing.ts
  <episode>-words.ts       ← forced alignment complet
  maroc-flag.png           ← ou drapeau du pays concerné
```

## Étape 3 — Copier le skeleton A1 validé
Copier `MarocBatteriesShort.tsx` depuis Maroc Batteries comme base.
Adapter uniquement : LOC (coordonnées), F.A2_START (timing), C (palette si différent), audio paths.
Le pattern getCam, pushCanvas, DOM Marker, KaraokeSubtitles = copier tel quel.

## Étape 4 — Render A1 uniquement, valider
```bash
bash scripts/render-mapbox.sh <CompositionId> out/episodes/<ep>/wip/a1_v1.mp4 --frames 0-<F.A2_START>
```
Valider avec Aziz avant de continuer.

## Étape 5 — Pour chaque acte suivant (A2, A3...)

### 5a — Camera Brief (OBLIGATOIRE avant tout code getCam)

Claude produit un tableau 6 lignes — une par acte — AVANT d'écrire getCam() :

```
| Acte | Mouvement | Depuis → Vers | Zoom | Durée | Blur |
|------|-----------|---------------|------|-------|------|
| A1   | Zoom+Freeze | Atlantique → Kénitra | 4.2→7.0 | 8.3s | non |
| A2   | Whip Pan 60f | Kénitra → Ouarzazate | 7→9 | 7s | oui |
| A3   | Orbit lent 90° | autour Tanger Med | 8→8 | 10s | non |
| A4   | Pull Back Reveal | Kénitra → Maroc entier | 9→4 | 6s | non |
| A5   | Statique | Kénitra fixe | 8 | 8s | non |
| A6   | Pull Back Planétaire | Maroc → globe | 4→2 | 10s | non |
```

**Aziz valide ce tableau AVANT que Claude écrive une ligne de code.**
Friction : 30 secondes. Évite : 2h de surprise au render.

Mouvements disponibles (Camera Lab v2 validé headless) :
Drift · Orbit+Dolly · Whip Pan 60f · Zoom+Freeze · Tilt · Counter-Rotation
Blur Atmo · Pull Back Planétaire · Zoom Sol 3D · Fade Style Switch · Pull Back Reveal

### 5b — Animatic optionnel (pour doute sur le voyage caméra)

Si le Camera Brief laisse un doute : rendre la caméra seule sans overlays, basse résolution.
```bash
bash scripts/render-mapbox.sh <CompositionId> /tmp/animatic_a2.mp4 --frames <A2_START>-<A3_START> --scale 0.25
```
10 secondes de render. Valider le voyage géographique avant de coder les overlays.

### 5c — Décision Mapbox vs graphisme + CHOIX DU TEMPLATE

- Mapbox = carte avec mouvement caméra (Camera Brief requis)
- Graphisme = stat, texte, data viz, image Gemini (brief Gemini Flash)

**AVANT de coder un acte : PIOCHER un template existant (réutiliser > from scratch).** Ouvrir les catalogues selon le type :
- Acte Mapbox → `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` (17 templates : hooks, combos, inserts, territoire, dynamiques, séquentiel). Galerie visuelle : `dashboard/templates-carte-vivante.html`.
- Acte graphisme/data → `src/projects/_shared/COMPOSANTS-INDEX.md` (71 composants) + `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` (40+ templates data-viz).
- Vue d'ensemble de tous les catalogues : `src/projects/_shared/INDEX-DES-INDEX.md`.
- **A1 (hook) OBLIGATOIRE** : un hook du catalogue (KineticMaskSlam, FiberOpticFlagInvade, ou un Combo).
- **Inserts** : MapCutaway (4 modes) dès qu'on veut couper la carte pour appuyer un point.

**Puis coder dans le fichier unique**, render l'acte isolé, valider, passer au suivant.

## Étape 6 — Review globale vidéo complète
```bash
python3 /tmp/gemini-review-short.py  # ou recréer depuis le pattern documenté
```
Gemini 3.1 Pro analyse la vidéo MP4 complète → JSON fix_code_values.

## Étape 7 — Final
```bash
bash scripts/render-mapbox.sh <CompositionId> out/episodes/<ep>/wip/short_v1.mp4
cp out/episodes/<ep>/wip/short_v1.mp4 out/PRET-PUBLICATION/<ep>-FINAL.mp4
```

---

## Références à lire avant tout
- `memory/doctrines/SOUVERAIN-SHORT-SKELETON.md` — architecture + patterns techniques
- `memory/rules/rules-souverain-editorial.md` — règles éditoriales
- `memory/doctrines/DOCTRINE-SOUVERAIN.md` — règles visuelles premium
- `scripts/tools/kimi-mapbox-brief.py` — brief caméra Kimi (OpenRouter)
- `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx` — référence A1 validé
