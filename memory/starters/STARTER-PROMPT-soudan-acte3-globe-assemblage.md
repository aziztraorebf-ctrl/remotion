# STARTER — Assemblage + promotion Acte 3 « Suivre l'or » version GLOBE D3

> Créé 2026-07-19. L'insert globe D3 (beats 3-7) est FAIT et validé Aziz. Il reste à l'ASSEMBLER avec la
> Section 1 Mapbox (beats 1-2bis) pour former l'Acte 3 complet, puis promouvoir en FINAL.
> ⛔ L'insert seul (87s) N'EST PAS l'Acte 3 complet (~126s) — il manque le début. Ne pas promouvoir l'insert seul.

## Ce qui est DÉJÀ FAIT (branche `feat/soudan-acte3-globe-d3`, commits ea5e3def→9c776adf)

- **Insert globe D3 = beats 3-7** (~87s, frames 1166→3773 de l'Acte 3) : `src/projects/_rnd/d3-16x9/SoudanActe3GlobeInsert.tsx`
  (compo Root `D3-SoudanActe3-GlobeInsert`). Palette mixte (terres kaki + océan bleu + frontières premium),
  arcs geoInterpolate, réactions cible (onde+illumination+drapeau+hangar), portraits factions (Hemedti/al-Burhan,
  recette Mapbox), drone-sprites sur flux retour, volume globe (ombre sphérique), reveal système, raccords
  zoom-out (entrée) + zoom-in (sortie). Audio branché sur portion [1166→3773] du fichier FULL (déjà calé).
- **Rendu final** : `out/_r-and-d/soudan-a3-globe-insert-v4.mp4` (62 Mo, 87s, avec audio).
  Lien Vercel Blob : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/soudan-a3-insert-v4-raccord-sortie-IX7Sj7sH3SN6zBtf7tcj0EdaIvkvUD.mp4
- Décisions Aziz : palette mixte validée · jetons = portraits · Égypte gardée visible (pas atténuée) ·
  raccord entrée = zoom-out continu · raccord sortie = zoom-in/replongée · assemblage = CONCATÉNATION de 2 mp4
  (pas de compo Remotion mixte WebGL+D3) · compo d'assemblage SÉPARÉE (l'Acte 3 FINAL Mapbox reste INTACT).

## CE QU'IL RESTE À FAIRE (cette délégation)

### 1. Rendre la Section 1 Mapbox SEULE (beats 1-2-2bis, 0→1166 frames = 38.87s)
⚠️ La Section 1 dépend de Mapbox/WebGL → **`scripts/render-mapbox.sh` OBLIGATOIRE**, jamais `npx remotion render` brut.
⚠️ Il n'existe PAS de compo Section 1 isolée dans Root — seule `SoudanActe3` (compo complète, 126s).
Deux options (choisir la plus simple) :
- **Option A (recommandée)** : créer une compo `SoudanActe3-Section1` dans Root.tsx qui rend UNIQUEMENT
  `<Section1 sectionOffset={0} />` sur `durationInFrames={1166}` (S1_FRAMES). Section1 est dans SoudanActe3.tsx
  (l'exporter si besoin). Puis : `./scripts/render-mapbox.sh SoudanActe3-Section1 out/episodes/soudan-midform/wip/a3-section1-mapbox.mp4`
- **Option B** : rendre l'Acte 3 complet (`./scripts/render-mapbox.sh SoudanActe3 <out>`) et couper les 38.87
  premières secondes avec ffmpeg (`-t 38.87`). Plus lourd (render 126s Mapbox) mais zéro modif de code.

### 2. Concaténer Section 1 Mapbox + insert globe D3
```bash
# les 2 mp4 doivent avoir MÊME résolution/fps/codec — ré-encoder si besoin avant concat.
# concat filter (ré-encode, sûr) :
ffmpeg -i a3-section1-mapbox.mp4 -i out/_r-and-d/soudan-a3-globe-insert-v4.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
  -c:v libx264 -crf 18 -c:a aac out/episodes/soudan-midform/wip/a3-globe-complet.mp4
```

### 3. VÉRIFIER LE RACCORD à la jonction (frame ~1166 = 38.87s)
- La dernière frame Section 1 Mapbox (Soudan au Darfour) doit matcher approximativement la 1re frame de
  l'insert (globe très zoomé sur le Darfour, scale 4.4). Extraire les frames autour de 38.87s et juger.
- Si le raccord saute (échelle/position trop différentes) : ajuster le scale de départ de l'insert
  (`globeCamera.ts`, keyframe `b3Start` scaleMul) OU ajouter un court cross-fade de 8-12 frames à la jonction
  au montage. Idem pour la SORTIE (frame ~3773) vers l'Acte 4.
- ⛔ Doctrine : vérifier CODE + VISUEL (extraire frames début/jonction/fin + écouter l'audio), pas juste "ça concatène".

### 4. Comparer à l'Acte 3 FINAL Mapbox actuel + faire valider Aziz
- Ancien FINAL (INTACT) : `out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-FINAL.mp4`
- Uploader le nouveau (Vercel Blob durable, `scripts/tools/upload-to-blob.py`) et présenter à Aziz.
- ⛔ Le hook pre-presentation-review peut exiger un review.json — voir `scripts/tools/REVIEW-TOOLS-INDEX.md`.

### 5. Si validé → promouvoir
- `out/episodes/soudan-midform/wip/a3-globe-complet.mp4` → `out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-globe-FINAL.mp4`
  (NOM DIFFÉRENT de l'ancien — garder les deux, Aziz choisit lequel publier).
- Purger wip/. Mettre à jour `memory/episodes/soudan-midform/STATUS.md` + `NEXT-ACTION.md`.

## Références
- Moteur globe D3 (réutilisable, doctrine) : `.claude/.../memory/feedbacks/feedback_globe-d3-moteur-cartographique-reutilisable.md`
- Timing insert (dérivé de l'Acte 3) : `src/projects/_rnd/d3-16x9/soudanActe3GlobeInsertTiming.ts`
- Scripts review vidéo (si review LLM) : `memory/tools/review-video-llm-scripts.md` (fix IPv4 obligatoire pour Gemini).
