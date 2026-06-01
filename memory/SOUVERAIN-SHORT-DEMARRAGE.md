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
**AVANT de coder :**
1. Décider : Mapbox ou graphisme CSS ?
   - Mapbox = carte avec mouvement caméra
   - Graphisme = stat, texte, data viz, image Gemini
2. Si Mapbox → brief Kimi : `python3 scripts/tools/kimi-mapbox-brief.py --prompt "..."`
3. Si Graphisme → brief Gemini Flash pour storyboard visuel
4. Valider la décision avec Aziz

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
- `memory/SOUVERAIN-SHORT-SKELETON.md` — architecture + patterns techniques
- `memory/rules-souverain-editorial.md` — règles éditoriales
- `memory/DOCTRINE-SOUVERAIN.md` — règles visuelles premium
- `scripts/tools/kimi-mapbox-brief.py` — brief caméra Kimi (OpenRouter)
- `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx` — référence A1 validé
