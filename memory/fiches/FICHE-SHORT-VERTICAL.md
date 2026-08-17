# SHORT / FORMAT VERTICAL 9:16 — fiche de déclenchement
> Les Shorts contiennent des techniques éprouvées qui n'étaient documentées NULLE PART. 6 d'entre elles sont récupérées ici.
> ⚠️ Si ce que tu lis ici ne correspond PAS au code sous tes yeux : **c'est la fiche qui a tort**. Corrige-la immédiatement.
> Dernière vérification contre le code : 2026-08-17.

## LES SHORTS DE RÉFÉRENCE
- ⭐ **AES 90s** (le plus abouti) — `src/projects/warmap/shorts/aes-short-90s/` · compo `AesShortFull.tsx` (Part1 0-36s + Part2 36-93.4s, crossfade 14f). Carte vivante **d3-geo pur, zéro Mapbox**, fond navy quadrillé. → `out/PRET-PUBLICATION/aes-short-90s-FINAL.mp4`.
- **Sénégal Pétrole&Gaz D3** — `src/projects/souverain/senegal-petrole-gaz-short-d3/ShortComplet.tsx` (5 beats, 3387f). Le plus abouti côté SFX/timing.
- **Franc CFA 9x16** — `src/projects/souverain/cfa-short-9x16/ShortComplet.tsx` : 3 scènes SVG Fable + `SceneCta.tsx`, narration unique, scènes en `muteNarration`.
- **Cacao** `souverain/cacao-chocolat-short/` (origine du karaoké) · **Soudan** `warmap/shorts/soudan-short/` (globe D3, timing.ts) · **Maroc Batteries** `souverain/maroc-batteries/MarocBatteriesShort.tsx`.

## TECHNIQUES RÉUTILISABLES
- **Jetons/emblèmes en cascade** · `aes-short-90s/LiptakoRevealSVG9x16.tsx` L46-51 · `spring({damping:11, stiffness:140, durationInFrames:12})`, stagger f2/f20/f42 (~0.6s), gate `f >= start ? pop : 0`. [transposable 16:9]
- **Tracé de ligne progressif (geste signature)** · helper `draw(f, start, dur, dash)` L14-17 = `strokeDasharray: dash` + `strokeDashoffset: dash*clampI(...,1,0)`. **Pas de @remotion/paths** : longueur en dur (620/400/300/1400) ou pré-calculée (`c.len`). [transposable 16:9]
- **Contour de pays qui se trace, intérieur TRANSPARENT** · `AesShortPart1.tsx` L115-137 : `strokeWidth 3.9`, `strokeDasharray={c.len}`, `strokeDashoffset={c.len*(1-draw)}`, durée **40f = lent** (demande Aziz). Le fill n'est qu'un ÉVÉNEMENT d'activation à `opacity*0.18`. [transposable 16:9]
- **Flux animé le long d'un arc** · Part1 L289-302 : 3 paths superposés (halo 13px pulsé `0.16+0.12*sin(f*0.3)`, base 4px, dash mobile `"22 22"` + `strokeDashoffset:-fluxT*len`). [transposable 16:9]
- **Territoire perdu = trame hachurée `<pattern>` clippée au pays** · Part1 L193-207 : rotation DIFFÉRENTE par pays (-45/45/0), `strokeWidth 3` (≥3 sinon bruit sur mobile), cercle `fill:url(#hatch)` qui grandit `r=210+120*x+500*spread`, `spread = t³`. [transposable 16:9]
- **Caméra = `<g transform>` sur le groupe, JAMAIS le viewBox** · `aesGeo.ts` L156-190 `getCamera()` : easeInOut, respiration monotone `1+0.012*(frame/total)`, ancrage `H*0.37 → H*0.44`. Texte contre-scalé `fontSize={54/cam.scale}`. [mécanique transposable]
- **Karaoké phrases courtes piloté par forced-alignment** · `SubtitlesWordByWord.tsx` : `MAX_WORDS=5`, `PAUSE_GAP=0.42s`, fade `[start-0.15, +0.08, end+0.18, end+0.35]`, mot dit = GOLD `#f5d98a`, à venir = ivoire opacity .5. Table `SPELL_FIX` pour corriger Whisper. Helper partagé `cacao-chocolat-short/audio/karaokeWords.ts`. [⛔ 9:16 SEULEMENT — voir Contraintes]
- **CTA de fin** (2 variantes) : plein cadre `CtaCard.tsx` (frame de la vidéo longue + dim 0.72 + carte pop `spring damping:14/stiffness:120` f10) OU overlay sur la carte `AesShortPart2.tsx` L441-447. Texte : « L'HISTOIRE COMPLÈTE » / sous-ligne 3 mots / « VIDÉO COMPLÈTE EN BIO ». [transposable]
- **Chiffre-choc filigrane** · Part2 L437 : `fontSize 340` Bebas, `lineHeight 0.9`, opacity .92 SUR la carte + `counter-tick.mp3` en `loop` pendant le count-up. Sénégal Scene1Hook : count-up **ralenti f70→f205 (~4.5s)**, police **monospace** pour tuer le tremblement horizontal. [transposable]
- **SFX pilotés par timings audio réels** · Sénégal `ShortComplet.tsx` L38-105 : helper `<Sfx at={sec} .../>`, banque `_shared/sfx/`, **volume plancher 0.50**, musique de l'épisode long réutilisée à **0.10-0.12**. [transposable]
- **Retirer un élément qui a fini son rôle** pour recentrer/zoomer (Libye absente en Part2) = plus gros/lisible, zéro perte narrative. [9:16 surtout]

## CONTRAINTES DU VERTICAL
- ⛔ **Bas d'écran = SOURCES uniquement** (~2s + fade) en 16:9. Aucun sous-titre qui répète la voix.
- ✅ **DÉCISION AZIZ 2026-08-17 — le karaoké mot-à-mot est autorisé en 9:16, JAMAIS en vidéo longue.** Pattern validé sur 3 Shorts publiés (Cacao, AES, Sénégal), `bottomPx={150}`. La règle « bas d'écran réservé aux sources » reste entière pour le 16:9.
- **Caméra fixe privilégiée** en 9:16 (principe validé Aziz sur AES) : tout apparaît/mute/fade dans un cadre immobile ; un seul dézoom motivé, plus une respiration ≤1.2%.
- Zone basse libérée pour le karaoké → carte ancrée à **y = H*0.37 à 0.44** (jamais centrée à 0.50).
- Tailles réelles : karaoké 62px · titre carte 50-64px · sous-ligne CTA 24-30px · label sur carte 20-22px. Un portrait/PNJ à 44px est **illisible** (testé) → picto géométrique.
- **Format étiré non-standard (≠1920)** : `preserveAspectRatio="xMidYMid meet"` + viewBox étendu à la taille cible ; JAMAIS `slice` (recadre). Fond de wipe = `<rect>` plein, jamais un `<path>`.
- **Un Short teaser doit garder la DA de sa vidéo longue** (vrais assets/frames extraits) — les composants génériques `_shared/mapbox/` déjà en 9:16 ont fait rejeter la V1 AES.

## PIPELINE SHORT
1. **Script** : script long fact-checké → boucle **NotebookLM** (`memory/tools/notebooklm-boucle-short.md`, éprouvée 3x) : Video Overview → on extrait la STRUCTURE (hook/arc/chute/durée), on jette le visuel et l'anglais → script FR condensé. ⚠️ NotebookLM perd le climax : gabarit avec section « intouchable ». Transcript = **API OpenAI Whisper**, jamais le binaire local.
2. **Audio** : TTS ElevenLabs (`scripts/generate-narration-expressive.py`) → **forced alignment** → `whisper-words-*.ts` dans le dossier du Short → tous les timings du code en découlent.
3. **Code** : beats séparés + un `ShortComplet.tsx`/`*Full.tsx` qui porte narration + musique + SFX, chaque scène en `muteNarration`/`noAudio`. Skill amont : `souverain-preproduction`.
4. **Publication** : YouTube Short + Instagram + Facebook → **TryPost** (MCP) · TikTok → **Postiz** (`scripts/schedule-postiz.py`). Cover verticale : `scripts/tools/gemini-cover-vertical.py`. Livrable → `out/PRET-PUBLICATION/<ep>-FINAL.mp4`.

## NON EXPLORÉ (dette connue)
`AesShortPart2.tsx` lu partiellement · scènes Sénégal 2-5, `_rnd/fable-svg/CfaShort*9x16.tsx`, Maroc Batteries et Soudan Short **non lus** — d'autres techniques y dorment. Aucun rendu regardé (valeurs issues du code seul).
