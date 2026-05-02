# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-05-02 — RESTRUCTURATION WORKSPACE COMPLETE
> **WORKSPACE REORGANISE** — Nouvelle structure propre executee. ~8 GB liberes. Seedance centralisé dans `public/seedance/`. Atlas composants dans `src/projects/atlas/_shared/`. Mémoire épisodes dans `memory/episodes/`. Voir section "Structure workspace" ci-dessous.
> **ATLAS SHAKA ZULU = VAGUE 1 TERMINEE** — Structure + timing + inserts solides. Vague 2 = remplacer fake globes CSS par vraie carte d3-geo. Branche `feat/atlas-shaka-zulu-vague1`.
> **ATLAS MANSA MOUSSA V2 = PRET PUBLICATION** (render final validé 2026-05-01).
> **THIAROYE V5 = RENDU FINAL SUR VERCEL** (pret Postiz).
> **SONJATA V7 = RENDU FINAL VALIDE** (pret Postiz).
> **ABOU BAKARI II = TOUS CLIPS GENERES** (manuel Aziz). Reste assemblage + render.

---

## STRUCTURE WORKSPACE (post-restructuration 2026-05-02)

```
src/projects/
  atlas/
    _shared/          ← AtlasMercator, AtlasGlobe, AtlasLabel, AtlasCaravane, etc. + ATLAS-COMPOSANTS.md
    mansa-moussa/     ← AtlasMansaMoussaV2Final.tsx + timing + narration
    shaka-zulu/       ← AtlasShakaFull.tsx + scenes/ + components/ + inserts/
    _archive/         ← silhouette-conte, silhouette-questions, veilleur-ombre, peste-1347-pixel
  geoafrique-shorts/  ← INCHANGE

public/seedance/      ← NOUVEAU — tout Seedance centralisé
  style-refs/         ← images style (gemini/, gpt/, thiaroye/, sonjata-papercraft/, refs canoniques)
  test-clips/         ← clips bruts (fal-seedance-tests, sonjata-papercraft, yaroflasher, seedance-examples)
  heros-oublies-refs/ ← character sheets Soundjata, Yaa Asantewaa
  historical-refs/    ← sheets Abou Bakari, Amanirenas (LoRA training)
  moodboards/         ← soundjata-charte, lat-dior, vivid-tests, gpt-vs-gemini, thiaroye-backlog
  INDEX.md            ← guide navigation + fichiers clés pour prompts

memory/episodes/      ← NOUVEAU
  mansa-moussa/       ← ex atlas-mansa-moussa/
  shaka-zulu/         ← ex atlas-shaka-zulu/
memory/atlas/         ← NOUVEAU
  ATLAS-COMPOSANTS.md ← catalogue composants (aussi dans _shared/)

data/geo/             ← NOUVEAU — données géo centralisées
  atlas-v2-data.json
  shaka-zulu-data.json

scripts/atlas/        ← NOUVEAU — scripts precompute
  precompute-mansa-moussa.mjs
  precompute-globe-paths.mjs
  precompute-africa-svg-paths.mjs

out/PRET-PUBLICATION/ ← SEUL DOSSIER DANS out/ (3 MP4 finals)
lora-training/        ← GARDE (usage futur)
```

---
> **ATLAS MANSA MOUSSA V2 = PRET PUBLICATION** (render final validé 2026-05-01).
> **THIAROYE V5 = RENDU FINAL SUR VERCEL** (pret Postiz).
> **SONJATA V7 = RENDU FINAL VALIDE** (pret Postiz).
> **ABOU BAKARI II = TOUS CLIPS GENERES** (manuel Aziz). Reste assemblage + render.

---

## PROJET ACTIF — ATLAS MANSA MOUSSA V2 (BLOCS 1-6 valides)

### Statut 2026-05-01 fin session
- Stack : d3-geo + Natural Earth 50m + Historical Basemaps + Remotion vectoriel SVG (zero Mapbox) — VALIDE DEFINITIF
- **Composition finale** : `AtlasMansaMoussaV2Final` (111.8s, 3355 frames) — EXISTE dans src/
- **Toutes scenes codees et validees** : Hook, S1, S2, S3, S4, Insert1 Pie, Insert2 Bar, Insert3 Line, CtaScene
- **Audio inserts generes** : insert-1-bambouk.mp3 (7.84s), insert-2-expeditions.mp3 (8.48s), insert-3-mediterranee.mp3 (6.72s)
- Render command : `npx remotion render AtlasMansaMoussaV2Final out/... --gl=angle --concurrency=1`

### DECISIONS ACTEES S4 (session 2026-05-01)
- Grisaille "Un seul homme" : **Afrique seulement** (pas Europe/Arabie) — Mali or, Egypte rouge, reste Afrique → gris
- Fleches Mediterranee : **supprimees** — cartouche + glow rouge suffit
- Medaillon Gizeh : dans groupe tilt/camera (coordonnees mercator Caire), pas ecran fixe
- Insert 3 cartouche : "AL-UMARI 1338 · AL-MAQRIZI XVe / DUREE DOCUMENTEE ~12 ANS" (sans doublon)
- CTA abonnement : **scene separee BLOC 8**, pas dans CtaScene comparative

### PROCHAINE ACTION — BLOC 7 karaoke
Brief complet + starter prompt : `memory/atlas-mansa-moussa/NEXT-SESSION-mansa-moussa-v2-finition.md`
- Composant `AtlasV2Subtitles` — Whisper word-level, or #D4A574, desactive pendant inserts+CTA
- Fix audio "marche" (accent aigu drop ElevenLabs) — patch ou regeneration segment

### Cout cumule V2
~$0.60 (pipeline vectoriel + mini-renders + ElevenLabs inserts).

---

## PROJET TERMINE — THIAROYE V5

- **STATUT** : RENDU FINAL SUR VERCEL. Pret publication Postiz.
- **URL** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/thiaroye-1944/renders/thiaroye-v5-FINAL-compressed-KzMQnwVZtYLExnaGnaOz8PdyFGFBmk.mp4
- **Alternative locale** : `out/thiaroye-v5-music-005.mp4` (musique 0.05)
- Voir MEMORY.md pour details complets.

---

## PROJET TERMINE — SONJATA V7 FINAL

- **STATUT** : RENDU FINAL VALIDE. Pret publication Postiz.
- **URL** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/sonjata-papercraft/v7-final/sonjata-final-v7-compressed-M5mA0ElRb3n0LUdzf8gAMmWYuUeZte.mp4
- Duration : 166s. Voir MEMORY.md pour details complets.

---

## PROJET EN COURS — ABOU BAKARI II

- **STATUT 2026-04-29** : TOUS CLIPS GENERES manuellement par Aziz. Reste 1-2 extraits + assemblage Remotion + render final.
- Dashboard : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-6LXCXjaaPNMOJyWMynqk8dc11JGfy5.html
