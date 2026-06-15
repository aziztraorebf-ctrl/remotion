# Thiaroye Moodboard — Concept preview (BACKLOG, non-actif)

**Date** : 2026-04-23
**Statut** : BACKLOG CREATIF — pas pour production immediate
**Contexte** : Apres analyse du court-metrage "Ma chere Diane" (Leo Malaterre, 2026), Aziz a demande une preview visuelle du concept "Le dernier train" (tirailleurs senegalais, 4 min).

## But de ces images

Ces 3 images servent a **visualiser le potentiel** du concept long-form Thiaroye "Le dernier train" — pas a lancer la production. Elles montrent :
- L'arc chromatique 3 palettes (chaud ocre / froid plombe / sature vif)
- La faisabilite du style paper-craft pour une video 4 min contemplative
- Le profil lateral strict pour les scenes d'action

## Decision finale (2026-04-23)

**Ne pas lancer la production maintenant.** Conditions de declenchement :
1. Les 3 Shorts engages (Sonjata CTA + Abou Bakari + Thiaroye V5 95s) sont publies
2. La technologie de generation video est plus mature
3. Le pipeline paper-craft + Remotion + ElevenLabs est parfaitement maitrise

Voir details complets : `memory/project_long-form-concepts.md`

## Contenu du dossier

### `style-refs/`
Les 2 images de reference utilisees pour le style et le character :
- `thiaroye-camp-sombre-v1.png` — style anchor paper-craft palette froide (valide session precedente)
- `charref-thiaroye-tirailleur.png` — character reference uniforme tirailleur (3 vues)

### `scripts/`
Les 2 scripts Python de generation :
- `generate-thiaroye-moodboard.py` — v1 (3 images initiales)
- `regen-thiaroye-moodboard-v2.py` — v2 (corrections dot-eyes + anti-drift BD sur images 1 et 3)

### `images-v1/` — Premiere generation
- `moodboard-01-mere-village.png` — REJETEE (iris blancs sur mere, pas dot-eyes strict)
- `moodboard-02-somme-course.png` — VALIDEE (profil strict parfait, garde en v2)
- `moodboard-03-provence-baiser.png` — REJETEE (drift vers BD flat Disney-esque)

### `images-v2/` — Corrections
- `moodboard-01-mere-village-v2.png` — VALIDEE (dot-eyes stricts, emotion par posture)
- `moodboard-03-provence-baiser-v2.png` — VALIDEE (paper-craft enrichi, persistence mineure joues rosees acceptee)

## Galeries Vercel

- Galerie v1 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/thiaroye-moodboard/2026-04-23/gallery-thiaroye-moodboard-%E2%80%94-le-dernier-train-%28c-20260423-0855-wJuNCYie1jGITLXrmEtrQWGPR8UdvA.html
- Galerie v2 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/thiaroye-moodboard/2026-04-23-v2/gallery-thiaroye-moodboard-v2-%E2%80%94-le-dernier-train-20260423-0906-FAqv14wbMN4WuzMX32vYDxsqi6waXB.html

## Cout total

5 images Gemini 3.1 Flash Image Preview = ~$0.20

## Regles apprises (ajoutees a memory/style-papercraft-sepia.md)

- **R-PC17** : Dot-eyes stricts + emotion oculaire = conflit. Clause explicite a ajouter quand emotion forte.
- **R-PC18** : Atmosphere riche (sunlight, highlights, golden light) autorisee. Si drift BD observe, ajouter clause anti-shading en fin de prompt.

## Ne pas toucher

Ce dossier est une archive de backlog. Ne pas supprimer, ne pas deplacer, ne pas reutiliser les scripts pour la production (ils etaient pour preview uniquement). Quand le projet "Le dernier train" sera relance, creer de nouveaux scripts dans `scripts/tools/` avec refs canoniques propres.
