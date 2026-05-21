# Remotion Project - Auto Memory Index
> Mis a jour 2026-05-19. **Charte éditoriale Souverain LOCK 2026-05-19. Peste 1347 Beats 1+2+3+4 FINAUX confirmés. Beat5 Mali Vivant = prochaine étape Atlas.**

## ✅ SILICON SAVANNAH — FINAL livré (2026-05-19)

- [**Silicon Savannah corrections + patterns**](feedback_silicon-savannah-final.md) — Beat3 redesigné (Nokia+badges), double audio Beat2 fixé, offsets audio-dérivés, SubtitleBar permanent réutilisable. Fichier : `out/PRET-PUBLICATION/silicon-savannah-FINAL.mp4`

## ⭐⭐⭐ CHARTE ÉDITORIALE SOUVERAIN (LOCK 2026-05-19) — LIRE AVANT TOUT SCRIPT

- [**CHARTE-EDITORIALE-SOUVERAIN.md**](../../../Workspace/remotion/memory/CHARTE-EDITORIALE-SOUVERAIN.md) — Positionnement analyste (ni militant, ni neutre). 4 règles fermes : pas de méchant désigné / chiffres vérifiés Perplexity / test couper l'audio / format-aware Short vs Mid-form. Test 3 filtres avant audio lock. Formule titre hybride. Application : tout script Souverain.
- [**MIDFORM-FORMAT-RULES.md**](../../../Workspace/remotion/memory/MIDFORM-FORMAT-RULES.md) — Règles spécifiques Mid-form 4-5 min. Structure 4 actes, 3-4 respirations obligatoires, ratio map/data/text 50/30/20, multi-perspective explicite, 140 mots/min max. Palier A (4-5 min, test rétention) avant Palier B (8 min, mid-rolls AdSense).
- [**MIDFORM-CHECKLIST-VULGARISATION.md**](../../../Workspace/remotion/memory/MIDFORM-CHECKLIST-VULGARISATION.md) — 5 tests bloquants anti-jargon (ami non-spécialiste / unité concrète / nom propre tampon / image dans la tête / demi-phrase de lien). Liste noire de mots bannis + substitutions. Workflow d'application en 6 étapes. À passer sur tout script Mid-form AVANT audio lock.

## ⏭️ PROCHAINE SESSION — Peste 1347 Beat5 Mali Vivant

**Commande de démarrage :** `python3 scripts/atlas-session.py --episode peste-1347 --beat 5`

**Frames :** f2323→f2974 (651f, ~21.7s) | beatStart = 2323
**Storyboard :** `public/atlas/peste-1347/storyboard/beat5-storyboard.md` — COMPLET, 4 phases, 4 mouvements
**Spec table :** À générer en début de session via `beat-session --phase spec-table` (ou utiliser storyboard directement)

**4 mouvements caméra planifiés (ordre d'exécution) :**
1. Pan vertical ↓ Sahara→Mali (f0→f100) — JAMAIS TESTÉ
2. Camera-track Souleymane trône→walk (f47→f200) — connu
3. Orbital Tombouctou 0°→8°→0° (f260→f380) — JAMAIS TESTÉ
4. Pan rapide Option C easing serré 6f Florence/Venise (f400→f406) — JAMAIS TESTÉ

**Assets TOUS prêts :**
- Souleymane walk east/west (6fr) + trône ✅
- Chameau walk east (4fr) ✅
- Marchand berbère walk east/west (4fr) — NOUVEAU 2026-05-17 ✅
- Marché/étal Tombouctou static.png — NOUVEAU 2026-05-17 ✅
- Mosquée Tombouctou ✅

**Source Beat5 :** Ibn Battuta *Rihla* (1352) · World History Encyclopedia — f530→fin, même pattern Beat4
**Dette sources Beats 1-2-3 :** documentée dans `memory/episodes/peste-1347/manifeste.md` — traiter à la composition finale
- [Leçons Beat3 — 6 règles non-négociables](feedback_peste-beat3-lessons.md) — LIRE avant tout nouveau beat Atlas

## ⭐ TEMPLATE BRUTAL HOOK SPLIT (VALIDÉ — 2026-05-14)

- [**BrutalHookSplit — hook photo + Ken Burns diagonal + typewriter**](feedback_brutal-hook-split-template.md) — `src/projects/_shared/components/layouts/BrutalHookSplit.tsx`. Photo 55% haut / texte 45% bas. Ken Burns diagonal zoom 1.0→1.15 + drift latéral dans overflow:hidden. Typewriter 9f/mot calé alignment. Accent Bebas Neue 128px. Validé Silicon Savannah Beat1. Proposer pour tout hook Souverain avec photo.

## ⭐ HOOKS BEAT PRODUCTION (INSTALLÉS — 2026-05-14)

- [**beat-preflight + beat-gemini-review hooks**](feedback_hooks-beat-production.md) — Deux hooks actifs sur tout Beat*.tsx. Preflight vérifie storyboard + composants lus. Post-render lance auto review Gemini 3.1-pro-preview. Score min 8.5/10. Règle rythmique : **max 8s sans changement visible**. Modèle : gemini-2.5-pro-preview-06-05 hardcodé.

## ⭐ RÈGLE STRUCTURE TEMPLATES SOUVERAIN (NON-NÉGOCIABLE — 2026-05-14)

- [**Séparation photo/texte BrutalHeadline**](feedback_brutalheadline-structure-separation.md) — Ne JAMAIS poser le texte directement sur l'image. Photo = haut, zone sombre propre = bas. Lire le composant `_shared/` avant de coder. Validé douloureux sur Beat1 Silicon Savannah (V1+V2 incorrects, V3 correct).

## ⭐ CANON ATLAS PUR — philosophie carte-scène (LOCKÉ 2026-05-13)

- [**Atlas pur = ciné-théâtre cartographique**](../../../Workspace/remotion/memory/rules-atlas-production.md) — Section 9 dédiée. La carte est la SCÈNE, pas un fond. Personnages PixelLab portent l'action. Inserts <10-15% temps écran. 5 questions de conception OBLIGATOIRES avant tout insert. Validé sur Yaa Asantewaa lors de l'exploration sujets Atlas hybrides (qui ont révélé qu'Atlas pur n'est PAS adapté aux sujets contemporains → Souverain). Réflexe Souverain (empiler inserts) = anti-pattern à bloquer.

## ⭐ WORKFLOW OFFICIEL SOUVERAIN (lire systématiquement)

- [**Pipeline Gemini 3.1-pro vision (4 étapes)**](../../../Workspace/remotion/memory/workflow-souverain-gemini-pipeline.md) — storyboard → 3.1-pro breakdown JSON → assets → Claude code. Fidélité 85-90%. Validé Niger Uranium + Zimbabwe Lithium.
- [**Gemini assets sans fond transparent — 2 solutions**](../../../Workspace/remotion/memory/feedback_gemini-assets-fond-transparent.md) — **Solution A** : fond crème solide (sur fond clair). **Solution B** : fond noir + `mix-blend-mode: screen` (sur fond sombre). Ne jamais tenter alpha_composite ou chroma key manuel. Validé Zimbabwe 2026-05-13.
- [**Review MP4 soi-même AVANT présentation — frames obligatoires**](../../../Workspace/remotion/memory/feedback_review-mp4-avant-presentation.md) — Extraire 4-5 frames, lire chacune, vérifier remplissage écran + alignement + taille carte. Grille 9:16 référence incluse. Jamais présenter sans avoir regardé.
- [**Backgrounds Souverain — 3 types valides, interdictions strictes**](../../../Workspace/remotion/memory/feedback_souverain-backgrounds-valides.md) — Dots CSS navy / Paper kraft PNG / Geometric SVG. INTERDIT : fumée, nuages, textures organiques photographiques. Code CSS dots standard inclus.
- [**Géographie zéro approximation — d3-geo obligatoire partout**](../../../Workspace/remotion/memory/feedback_geo-zero-approximation.md) — Toute forme pays = d3-geo + Natural Earth 50m. Jamais SVG approximatif de 3.1-pro. ISO codes + snippet Node.js inclus. S'applique hors Atlas aussi.
- [**Rythme animation Souverain — règle 4-5s max**](../../../Workspace/remotion/memory/feedback_animation-rythme-souverain.md) — springs amortis, permanent motion obligatoire.
- [**Claude code direct (pas le composer)**](../../../Workspace/remotion/memory/feedback_aziz-prefere-claude-code-vs-remotion-composer.md) — composer prend des libertés. Claude code à la main jusqu'à validation.

## Config & Outils
- [DeepSeek/CCR — DÉSACTIVÉ](deepseek-setup.md) — CCR+OpenRouter fonctionnel mais mis en pause (vision-heavy workflow). 3 conditions de réactivation documentées.
- [APIs & Tools](apis-and-tools.md) — clés API, scripts, infrastructure
- [d3-geo Comparaison surfaces](tools/d3-geo-taille-comparative.md) — technique thetruesize.com : translate lat=0 + clip contour exact. Validé Vraie Taille Afrique. Réutilisable pour tout épisode comparaison surface.
- [PixelLab](memory/tools/pixellab.md) — SDK Python v1, walk cycle, sprites Atlas. 2000 crédits/mois.
- [PixelLab MASTER INDEX](../PIXELLAB-MASTER-INDEX.md) — 48 characters + 50+ objects. Lire AVANT toute génération.
- [Seedance 2.0](seedance-2.md) — référence technique, 13+ tests
- [Seedance CSV Ref Library](seedance-csv-ref-library.md) — 1830 clips prouvés
- [Style Paper-Craft Sepia](style-papercraft-sepia.md) — 19 règles R-PC + R-DYNAMIC v2
- [Key Learnings](key-learnings.md) — leçons transversales

## ⭐ Sources de vérité (lire en priorité)
- [ASSETS-INDEX](../../../Workspace/remotion/public/_shared/ASSETS-INDEX.md) — inventaire templates + assets + refs Gemini/Seedance + SFX + backlog. Lire avant tout prompt.
- [Dashboard Souverain LIVE](https://hollow-desert-9tz6.here.now/) — galerie templates. Source locale : `dashboard/templates-souverain.html`.
- [ATLAS-COMPOSANTS.md](src/projects/atlas/_shared/ATLAS-COMPOSANTS.md) — lire AVANT tout code Atlas.
- [MAPBOX-COMPOSANTS.md](../src/projects/_shared/mapbox/MAPBOX-COMPOSANTS.md) — MapboxBase, lerpCam, styles, WebGL only.

## ⏭️ Prochaines sessions
- [Niger Uranium — FINAL AUDIO](NEXT-SESSION-niger-uranium-final-audio.md) — 1 fix audio (Sequence wrapper narration v5), puis full render + publication. ~30min.
- [Vraie Taille Afrique](episodes/souverain/vraie-taille-afrique/FACT-SHEET.md) — Short 65s. **PIPELINE VALIDÉ.** Beat1 Mapbox✅ Beat2 d3-geo SVG✅ Musique A choisie✅. Prochaine session : manifest → Beats 2/3/4/5.
- [Grand Retour Diaspora](NEXT-SESSION-grand-retour-diaspora.md) — Short factuel-nuancé. 100% templates existants. ~8h. Après Niger.
- [Abou Bakari II](NEXT-SESSION-abou-bakari-ii.md) — tous clips générés (manuel). Reste assemblage + render final.

## ⭐ Workflows validés (Jour 6)
- [Pipeline Souverain Gemini 3.1-pro vision](../../../Workspace/remotion/memory/workflow-souverain-gemini-pipeline.md) — storyboard image → 3.1-pro breakdown JSON → assets → code. Fidélité 85-90%.
- [Pourquoi code > storyboard](../../../Workspace/remotion/memory/feedback_pourquoi-code-bat-storyboard.md) — 5 facteurs. Vectoriel > raster, second pass 3.1-pro, permanent motion.
- [Gemini 3.1-pro > 2.5-flash pour vision](../../../Workspace/remotion/memory/feedback_gemini-3.1-pro-vs-2.5-flash-vision.md) — hex codes complets, coords SVG exactes. NE PAS utiliser gemini-3.1-flash (inexistant).
- [Icônes Gemini fond crème solide](../../../Workspace/remotion/memory/feedback_gemini-icones-fond-cream-solid.md) — prompt "UNIFORM solid CREAM #d4c29d filling ENTIRE square frame". Vérifier pixel(0,0).
- [Rythme animation Souverain 4-5s max](../../../Workspace/remotion/memory/feedback_animation-rythme-souverain.md) — springs amortis (damping 80-100, stiffness 50-70), permanent motion obligatoire.
- [Claude code direct > remotion-composer](../../../Workspace/remotion/memory/feedback_aziz-prefere-claude-code-vs-remotion-composer.md) — composer prend des libertés avec storyboard. Coder à la main jusqu'à validation.

## Lessons Jour 5 (2026-05-09)
- [Composants livrés Jour 5](feedback_souverain-templates-jour5-recap.md) — SplitScreen V2, EntityDiagram V2, ComparisonTable V2, GlobeLocationReveal V4.
- [Globe Mapbox pattern validé](feedback_globe-mapbox-pattern-validated.md) — projection 'globe' + réticule SVG. NE PAS coder globe SVG custom. Coordonnées via MCP Mapbox.
- [Globe reveal 2 styles canoniques](feedback_globe-reveal-2-styles-locked.md) — Style 1 souverain (sombre+jaune) pour dramatique. Style 2 caspian (lumineux+terracotta) pour apaisé.
- [Caspian palettes Niger uranium](feedback_caspian-niger-palettes-validated.md) — 4 variantes. Sepia = défaut Niger, Noir = climax.

## Lessons Jour 3 (2026-05-09)
- [Jury 3 LLMs gotchas API](feedback_jury-3llms-api-gotchas.md) — ~$0.04/run, 91s parallèle. Kimi base64 + kimi-k2.5. GPT-4o. Gemini via OpenRouter.
- [Vérifier mémoire AVANT outils](feedback_verifier-memoire-avant-outils.md) — grep memory/tools/ avant d'essayer upload/intégration.
- [Hygiène out/](feedback_hygiene-out-folder.md) — wip=itération, V3=review, FINAL=validé. Codé dans CLAUDE.md.
- [Previews start/mid/end](feedback_previews-start-mid-end.md) — 3 frames pour templates animés. GIF optionnel.

## Backlog templates (Jour 4 — à compléter)
BrutalHeadline, DataCard, NewsClipping, BigStat, DateBar, OsintSplitScreen, Templates E/F. Détails : ASSETS-INDEX section Backlog.

## Souverain — règles éditoriales
- [Storyboard Souverain refs Or Africain V5](../../../Workspace/remotion/memory/feedback_storyboard-souverain-refs-or-africain.md) — JAMAIS générer storyboard Mapbox sans refs i2i.
- [Grille sources 3 niveaux](feedback_grille-sources-3-niveaux.md) — faits vérifiables / voix-narratifs / sources douteuses. 3 chiffres max Short.
- [Fact-Sheet Souverain v2](../../../Workspace/remotion/memory/templates/fact-sheet-souverain-v1.md) — template pré-production. Perplexity intégré étape 6.5.
- [Couleurs narratives Souverain](feedback_souverain-couleurs-narratives.md) — pas de jugement moral subliminal. Test "couper audio" avant render.
- [Cohérence éthique narrative](feedback_coherence-ethique-narrative.md) — nommer tout pays africain qui s'oppose à un autre. Anti-piège binaire.
- [Gemini drift annotations style](../../../Workspace/remotion/memory/feedback_gemini-style-annotations-leak.md) — sortir les indications style des blocs guillemets.
- [Xénophobie SA — GELÉ](../../../Workspace/remotion/memory/episodes/souverain/xenophobie-sa-EXPLORATION/00-INDEX.md) — 8/10 format Long. Reprendre 2-3 mois.
- [Mali blocus carburant — EN PAUSE](../../../Workspace/remotion/memory/episodes/souverain/mali-blocus-carburant-NOTE.md) — 6.5/10. Reprendre juin 2026+.

## Audio & TTS
- [**Minimax Speech 2.8 HD + Voice Clone**](../../../Workspace/remotion/memory/tools/minimax.md#minimax-speech-28-hd--voice-clone--guide-tts) — alternative ElevenLabs validée 2026-05-19. Voice clone $1.50, TTS $0.10/1k chars. **Markers FR : seuls `<#0.X#>` et `(sighs)` fonctionnent — autres interjections prononcées comme texte**. Auto-adapte sémantiquement. Workflow A/B : ElevenLabs + Minimax neutral + Minimax happy.
- [Pattern audio fichiers séparés par beat](feedback_audio-fichiers-separes-par-beat.md) — re-record = fichier dédié + AUDIO_SEGMENTS relatives. Jamais splicer.
- [Audio overlap trim chirurgical](feedback_audio-overlap-handoff-master-vs-beat-dedie.md) — trim master 4-11f avant mot pivot. Mini-render avant full.
- [Perplexity fact-check OBLIGATOIRE](feedback_perplexity-fact-check-rule.md) — après script lock, avant TTS. Modèle : **sonar-pro** (deep-research retiré, trop cher).
- [Perplexity OpenRouter pricing](feedback_perplexity-openrouter-pricing.md) — sonar-pro $3/$15 par M tokens. Défaut workflow depuis 2026-05-11.
- [ElevenLabs SFX trim pattern](feedback_elevenlabs-sfx-trim-pattern.md) — générer 0.5s puis trim ffmpeg. SFX à l'apparition seulement.

## Mapbox
- [Mapbox effets catalogue R&D](../../../Workspace/remotion/memory/tools/mapbox-effets-et-tests.md) — validés + à tester. Ouvrir avant toute pré-prod épisode Mapbox.
- [Render Mapbox via render-mapbox.sh](feedback_remotion-mapbox-render-script.md) — TOUTE composition WebGL → `./scripts/render-mapbox.sh`. `npx remotion render` direct = fail.
- [Mapbox labels fade séquentiel](feedback_mapbox-labels-fade-out-sequentiel.md) — chaque label disparaît à l'arrivée du suivant. Validé Or Africain Beat 3b.
- [MapboxBrandingHide](feedback_mapbox-branding-hide-pattern.md) — `<MapboxBrandingHide />` en 1er enfant AbsoluteFill. Attribution description vidéo.
- [Mapbox zoom delta min 0.3](feedback_mapbox-zoom-delta-minimum.md) — <0.3 = invisible. Min 0.3-0.5 + drift lon/lat.
- [Style GéoAfrique](feedback_mapbox-style-geo-afrique.md) — Océan #03224c + Terre #2a1e0e + Frontières #5a3e1e. `STYLE_GEO_AFRIQUE`.
- [Mapbox overlay SVG vs layer](../../../Workspace/remotion/memory/feedback_mapbox-overlay-svg-vs-layer.md) — globe mode : `addLayer` ne fonctionne pas. Utiliser overlay SVG React + `map.project()`.

## Remotion
- [Beats standalone — pas d'offset BEAT_START](feedback_remotion-beat-standalone-frame-offset.md) — frame commence à 0. Offset seulement pour Audio startFrom + Subtitles.
- [Liens Remotion Studio localhost](feedback_remotion-studio-vscode-links.md) — donner localhost:PORT par défaut. Pas Vercel sauf mobile.
- [Audio overlap trimAfter obligatoire](feedback_audio-overlap-trim-after.md) — `trimAfter={frameLastSegmentAudio}` sur tout beat avec `<Audio startFrom>`.
- [Manifest non-négociable](feedback_manifest-non-negotiable.md) — proposer manifest AVANT de coder. Pas de manifest = itérations perdues.
- [Freeze-frame 1s avant CTA](feedback_atlas-freeze-frame-transitions.md) — hold 30f après punchline. interpolate clamp + bgOpacity=1.

## Atlas — patterns techniques
- [Atlas — Architecture 2 couches zoom POI](feedback_atlas-2couches-zoom-poi.md) — SVG carte + CSS assets séparés = zoom 2.8x sans vide. svgToComp() + focus offset -100px.
- [Atlas — Action geo vs Lieu geo](feedback_atlas-action-geo-vs-lieu-geo.md) — Lieu = carte SVG. Action = insert plein écran + Gemini/PixelLab.
- [Atlas — Règle inserts plein écran](feedback_inserts-rule-hannibal.md) — max 1-2/beat. Si animable sur carte = pas d'insert.
- [Atlas — RPG/HUD patterns 3 couches](feedback_atlas-rpg-hud-patterns.md) — fond/action/HUD. Zoom+blur focus contextuel.
- [Atlas — Camera-track CSS sprites](feedback_atlas-camera-track-css-sprites.md) — walk 2.8x, crouch 3.2x. Helper svgToCompWithCam.
- [Atlas — 16 mouvements caméra](../../../Workspace/remotion/memory/tools/atlas-camera-movements.md) — 7 validés + 9 à tester. Règle : 1 mouvement narratif tous les 5-8s.
- [Atlas — 13 règles non-négociables](feedback_atlas-non-negotiable-rules.md) — fork avant reconstruire, SVG racine unique, vérif géo, Lottie primitives only.
- [Atlas — Catalogue sujets purs](feedback_atlas-sujets-purs-catalogue.md) — Top 5 post-Hannibal : Songhaï, Tombouctou, Bénin, Route Épices, Kongo.
- [PixelLab RPG-pattern Atlas](feedback_pixellab-rpg-pattern.md) — Characters + map_objects + animations = rendu RPG. Validé Empire Ghana.
- [Géographie zéro approximation](feedback_geo-zero-approximation.md) — toute coordonnée = source vérifiée + d3-geo. Jamais à la main.
- [GeoJSON Natural Earth 50m](../../../Workspace/remotion/memory/feedback_geojson-natural-earth-50m.md) — JAMAIS écrire polygone à la main. Codes ISO_A3 africains documentés.
- [Historical Basemaps empires](../../../Workspace/remotion/memory/feedback_historical-basemaps-empires-medievaux.md) — GitHub aourednik, GeoJSON par siècle. Empire Mali 1300 validé.
- [aourednik fallback](feedback_historical-basemaps-source-academic.md) — CC BY-SA 4.0. world_1300.geojson validé Ghana + Mali.

## Atlas — épisodes
- [Hannibal Beat 1 COMPLET](episodes/hannibal/BEAT-1-COMPLETE.md) — v10d validé. 4 helpers dans _shared/.
- [Hannibal Beat 2 état](episodes/hannibal/BEAT-2-STATE.md) — Phase A+B validées. Phase C (f450→905) à coder.
- [Hannibal ASSETS INDEX](episodes/hannibal/ASSETS-INDEX.md) — lire AVANT génération PixelLab.
- [Hannibal Jury Pass 1](../../../Workspace/remotion/memory/episodes/hannibal/DECISIONS-JURY-PASS1.md) — décisions architecturales lockées.
- [Empire Ghana Beat 1-3 COMPLETS](episodes/empire-ghana/BEAT-1-COMPLETE.md) — walk cycle, camera-track, Spotlight Insert.
- [Or Africain FINAL v7](../../../Workspace/remotion/memory/episodes/money-legends/OR-AFRICAIN-NEXT-SESSION.md) — 96.3s livré. `out/or-africain/or-africain-FINAL.mp4`.
- [Or Africain script V2 locked](../../../Workspace/remotion/memory/episodes/money-legends/OR-AFRICAIN-SCRIPT-V2-LOCKED.md) — 9.5/10. Reprendre post-Hannibal.
- [Mansa Moussa script V2 locked](../../../Workspace/remotion/memory/episodes/money-legends/SCRIPT-V2-LOCKED.md) — 7.4/10. Assets dispos.

## Pipelines validés
- [d3-geo Vector Pipeline Atlas](../../../Workspace/remotion/memory/d3-geo-vector-pipeline.md) — pipeline final V2. 4x render time, zero saccade.
- [Atlas Gemini composite + Seedance i2v](feedback_atlas-gemini-composite-seedance-i2v.md) — Gemini place persos, Seedance anime. Endpoint `fal-ai/bytedance/seedance-2.0/image-to-video`.
- [PixelLab Walk Cycle Pipeline](../../../Workspace/remotion/memory/atlas-mansa-moussa/PIXELLAB-WALK-PIPELINE.md) — sprites, walk cycle, changement animation. Assets dans `public/pixellab-walk-test/`.
- [Template Atlas v1](../../../Workspace/remotion/memory/templates/atlas-template-v1.md) — pipeline production complet épisodes Atlas.
- [Template Subtitles Shorts](../../../Workspace/remotion/memory/templates/subtitles-shorts.md) — TikTok/Karaoke Whisper + camera shake. Validé Sonjata.
- [Hook Template 5s](../../../Workspace/remotion/memory/templates/hook-short.md) — pattern teaser réutilisable.
- [Hybride Seedance+Remotion](hybrid-seedance-remotion-strategy.md) — quand l'un vs l'autre.
- [Workflow Gemini Breakdown Schema](../../../Workspace/remotion/memory/workflow-gemini-breakdown-schema.md) — lire avant tout script breakdown Souverain.

## Règles consolidées
- [Rules Seedance](rules-seedance.md) — prompts, storyboards, process Seedance
- [Rules Pipeline](rules-pipeline.md) — alignment, manifest, pre-API, budget
- [Rules Production](rules-production.md) — ElevenLabs/TTS, workflow, collaboration
- [R-NO-PARTICLES](feedback_no-particles.md) — interdit dust/sparkles dans prompts. Exception : poussière combat.
- [R-VIVANT-PARTOUT](rule_vivant-partout.md) — bannir still/motionless. Contemplatif = observationnel.
- [Delegation stricte Claude → Agents](feedback_claude-delegation-stricte.md) — Claude orchestre. Jamais de prompts Gemini/Seedance rédigés par Claude.
- [Validation BLOQUANTE avant call payant](feedback_validation-bloquante-avant-paid-call.md) — toute révision post-"je valide" = nouvelle validation.
- [Review MP4 soi-même](feedback_review-mp4-avant-presentation.md) — lire le MP4 avant d'écrire "voici le résultat".
- [Collaboration — demander capture d'écran](feedback_collaboration-ask-when-stuck.md) — après 1-2 tentatives ratées, demander annotée plutôt que s'acharner.
- [Remotion permet d'oser](feedback_remotion-permet-doser.md) — $0/render. Proposer 1 mouvement "à essayer" par scène.

## Projets terminés (références)
- **Sonjata V7** FINAL — `out/sonjata-final-v7-FINAL-MASTER.mp4` (204MB). Prêt Postiz.
- **Thiaroye V5** FINAL — Vercel Blob. Prêt Postiz.
- **Mansa Moussa Atlas V2** FINAL — 114s validé 2026-05-01.
- [Leçons Shaka Zulu](feedback_lecons-shaka-zulu-pause.md) — 5 critères Atlas-natif. Composants préservés pour réutilisation.
- [PixelLab animations spritesheet](feedback_pixellab-animations-spritesheet.md) — GIF→PNG→Remotion clipPath. Validé Beat 1 Ghana.

## Système & Référence
- [5 agents production vidéo](5-agents-production-video.md) — pipeline 6 étapes. Voir `.claude/agent-memory/shared/PIPELINE.md`.
- [Stratégie pilier GéoAfrique](strategie-pilier-heros-atlas.md) — UN pilier, 3 modes, critères sélection figures.
- [Stack chaines pro cartographiques](feedback_chaines-pro-cartographic-stack.md) — After Effects + GEOlayers 3. Outils à NE PAS copier documentés.
- [here.now hosting](../../../Workspace/remotion/memory/tools/here-now-hosting.md) — Catbox NE fonctionne PAS pour HTML. Toujours here.now pour dashboards. 24h pour claim.
- [Vercel Blob quota Hobby 1GB](feedback_vercel-blob-quota-hobby.md) — error 400 quand atteint. Nettoyer après validation.
- [Minimax fal.ai status endpoint](../../../Workspace/remotion/memory/feedback_minimax-fal-api-status-endpoint.md) — POLL via `status_url` retourné. Jamais hardcoder.

---
## Archives
Fichiers obsolètes dans `memory/archives/`. Consultables mais non chargés.
