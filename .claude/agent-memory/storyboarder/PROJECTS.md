# Storyboarder — Detail projets (entrees indexees dans MEMORY.md)

## Abou Bakari II — UPDATED 2026-04-30
- timing ACTIF : `src/projects/geoafrique-shorts/timing-abou-bakari.ts` (9 beats, fleet split)
- whisper mots : `src/projects/geoafrique-shorts/whisper-words-abou-bakari.ts` (228 mots,
  export `WHISPER_WORDS_ABOU_BAKARI`)
- Audio narration : `public/audio/abou-bakari/abou-bakari-narratrice-v1.mp3` | 82.80s
- Audio CTA : `public/audio/abou-bakari/beat09-cta.mp3` | 12.16s
- Forced-alignment source : `public/audio/abou-bakari/abou-bakari-alignment.json` (316 tokens)
- TOTAL_FRAMES : 2849 | NARRATION_FRAMES : 2484 | TOTAL_SECONDS : 94.96s
- Beats (ordre timeline) : ocean(13.5s) / empire(8.9s) / fleet_a(14.94s AUDIO_OFF) / fleet_b(1.14s)
  / name(12.86s) / abdication(13.32s) / obsession(5.86s) / colomb(6.42s) / close_cta(15.54s)
- Statut : LOCKED 2026-04-30. READY FOR STAGE 3 (remotion-composer).
- NOTE compositeur : fleet_b = 34 frames seulement ("On ne passe pas."), clip fait 6.06s -> a trancher.
- Ancien `timing.ts` (8 beats, format perime) OBSOLETE pour Abou Bakari II — ne pas reutiliser.

## Soudan Short — NEW 2026-08-01
- timing ACTIF : `src/projects/warmap/shorts/soudan-short/timing.ts` (7 blocs : mouvementA /
  pause1 / pivot / mouvementB / pause2 / chute / cta)
- whisper mots : `src/projects/warmap/shorts/soudan-short/whisper-words-soudan-short.ts`
  (311 mots, export `WHISPER_WORDS`, 311/311 verifies contre le script)
- Audio narration LOCKED, NE PAS REGENERER :
  `public/_shared/audio/soudan-short/narration-v1-pauses-v2.mp3` | 111.337506s (ffprobe) | FPS 30
  | TOTAL_FRAMES 3340
- Format : SCENES-only flat (7 blocs — Short lineaire, pas de nested malgre >90s, cf. RULES.md
  § SEUIL FORMAT)
- Decision non-evidente : brief annoncait 2 pauses deterministes de 1.0s (fin Mvt A, fin Mvt B),
  mais l'audio livre mesure des silences reels differents (0.94s et 0.66s). Regle appliquee :
  timestamps REELS Whisper priment toujours sur la valeur planifiee du script — signale dans le
  fichier plutot que force a 1.0s. 2 silences orphelins entre blocs (0.36s pivot->mouvementB,
  0.5s chute->cta) absorbes dans la scene precedente apres verification systematique (cf.
  RULES.md § LECON silences inter-blocs).
- BEATS : 26 frames-reperes (Darfour x2, Emirats x4, Egypte x2, Russie x2, Turquie x1, Hemeti,
  climax "incendie/main"...) — tous verifies par script Python contre le whisper source (aucune
  frame inventee, round(sec*30) exact + timestamp reellement present).
- Note Whisper : transcrit "Hemeti" en "Emeti" (perte H aspire) — bizarrerie orthographique
  signalee dans le fichier, PAS un bug d'alignement.
- Note CTA : audio dit "lien en description" mais texte AFFICHE doit dire "EN BIO" (Aziz tranche,
  reach Shorts) — documente dans SCENES.cta, ne jamais coder "en description" a l'ecran.
- GEO_SEQUENCE documentee : Sudan / United Arab Emirates / Egypt / Russia / Turkey — noms Natural
  Earth 110m verifies presents dans `public/_rnd/vox-repro/countries-110m.json`.
- Statut : LOCKED 2026-08-01. READY FOR STAGE 3 (visual-producer/remotion-composer doit adapter
  `GlobeRecitProto.tsx` — existe seulement sur worktree `remotion-soudan`, PAS sur master — au
  format 9:16 avec cette sequence geo).

## Archives (references seulement)
**Peste 1347** : projet SVG abandonne 2026-02-21 (pivot pixel art -> pur Remotion SVG enluminure).
Les 7 scenes `hook_*` et le code Godot/PixelLab des anciennes versions ne sont plus actifs. Voir
`memory/archive/` si besoin historique.
