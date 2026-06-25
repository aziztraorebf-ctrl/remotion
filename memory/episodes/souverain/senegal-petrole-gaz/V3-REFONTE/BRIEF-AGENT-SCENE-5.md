# BRIEF AGENT AUTONOME — Scène 5 "les coulisses / Yakaar" (Sénégal V3, MAPBOX)

> Tu es un agent de production vidéo Remotion autonome. Tu produis la SCÈNE 5 de l'épisode Sénégal Pétrole & Gaz V3,
> A→Z, en quasi-autonomie, AVEC UN CHECKPOINT obligatoire (voir FLUX). C'est le 1er test du système agentique sur
> du MAPBOX — sois rigoureux, auto-évalue tes trous. Doctrine : `memory/doctrines/PRODUCTION-AGENTIQUE-REMOTION.md`.

## RÈGLE N°1 — 16:9 HORIZONTAL (1920×1080). Jamais vertical/empilé. Image centrée, cadre large.

## MODÈLES API VERROUILLÉS (ta knowledge cutoff est PÉRIMÉE — ne PAS inventer) — voir CLAUDE.md :
- Gemini vision/breakdown : `gemini-3.1-pro-preview` · image : `gemini-3.1-flash-image-preview`
- Kimi : `kimi-k2.5` · DeepSeek : `deepseek/deepseek-v4-pro` (OpenRouter)
- Mapbox token : dans `.env` racine (clé MAPBOX). NE PAS hardcoder.

## INTENTION (1 verbe) : BASCULER
Montrer une case d'échiquier géopolitique laissée vacante : l'Occident (Europe/USA) RALENTIT sur le dernier champ
gazier (Yakaar-Teranga, loin de Dakar, encore non développé), et un nouveau joueur (Pékin) s'avance. La scène
quitte le Sénégal pour un RAPPORT DE FORCES EN SUSPENS. Cœur émotionnel = la question ouverte qui clôt l'enquête :
« qui prend leur place… et à quel prix ? »

## FORME VALIDÉE PAR AZIZ : MIXTE carte Mapbox -> bascule encart conceptuel navy+or
1. DÉBUT = carte Mapbox frame-driven sur Yakaar-Teranga offshore (coords [-18.00, 14.20], au large, "loin de Dakar")
   + les acteurs actuels reliés (Kosmos / BP / Petrosen).
2. BASCULE = quand on passe au duel de financement (Europe qui recule / Pékin qui observe) et à la question finale,
   on QUITTE la carte pour un encart conceptuel navy+or (registre data-viz, comme sc.3/4). C'est le PONT VISUEL que
   la V1 n'avait pas. À toi de proposer la mécanique de bascule dans ton PLAN (transition, whip pan, fondu...).

## REGISTRE VISUEL (continuité V3 — NON négociable)
- Navy `#16213a` + grille or qui respire + BebasNeue (cohérence sc.1b/3/4). Drapeaux = vraies images via `useClipFlags`.
- ⛔ NE PAS reprendre le fond KRAFT/BEIGE de la V1 Beat13 (`#e8d5b0`) — c'est ce qui ne raccordait pas. Aziz l'a écarté.
- Mapbox = style navy/sombre cohérent (voir SceneComparaisonV3 pour le style exact). 1 SEULE Map continue, frame-driven
  (`useCurrentFrame` + `interpolate` + `map.jumpTo()`). JAMAIS `flyTo`/`easeTo` (incompatibles headless).

## MODÈLE À ÉTUDIER ET RÉUTILISER (ne pas réinventer la grammaire)
- **`src/projects/souverain/senegal-petrole-gaz/beats/SceneComparaisonV3.tsx`** = la sc.2, MAPBOX FINALE validée Aziz.
  Étudie sa grammaire : 1 Map continue, getCam/overlays frame-driven, drapeaux drapés, plaques factuelles, jeton
  pétrole offshore relié, SFX millimétré, musique. RÉUTILISE ces patterns.
- Pour la partie encart navy+or (bascule) : `SceneContratV3.tsx` (sc.3) et `SceneDetteV3.tsx` (sc.4) = grammaire data-viz.
- V1 de référence pour le CONTENU (pas le style) : `src/.../beats/Beat13.tsx` + render `out/.../beat13-FINAL.mp4`.

## DOCTRINES MAPBOX À LIRE AVANT DE CODER (gate bloquant)
- `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md` (5 principes premium carte)
- `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` + `MAPBOX-COMPOSANTS.md` (SCAN templates AVANT code)
- `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md` (jetons hexa, projection drapeau sans dérive)
- Effet vivant obligatoire (couleur/frontières/projection). La carte n'est jamais nue.

## TEXTE VO + DÉCOUPAGE AUDIO (forced-align V3, @30fps, AUDIO_START = 288.7s)
Audio narration : `public/souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3`
  startFrom = round(288.7*30) = 8661 ; endAt = round(344.46*30) = 10334 (la scène fait ~55.8s = 1673 frames @30)
Musique : `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3` (startFrom=0, vol ~0.055, fadeIn/Out).
Frames RELATIVES (frame 0 = 288.7s) :
- F_26   "Reste le dernier terrain. Et celui-là, il se joue loin de Dakar."
- F_138  "Souvenez-vous du troisième champ — Yakaar-Teranga, celui qui attendait."
- F_353  "Il est déjà sous contrat entre l'Américain Kosmos, BP et Petrosen."
- F_546  "Mais la décision finale d'investir n'est pas prise. Le champ attend toujours."
- F_715  "Et pendant ce temps, on regarde qui paiera son développement."
- F_869  "Des discussions avec des entreprises chinoises ont été rapportées."
- F_986  "Rien de signé — mais Pékin observe."
- F_1130 "Pourquoi ça compte ?"
- F_1212 "Parce que l'Europe, sous pression climatique, ralentit ses investissements dans le gaz."
- F_1385 "Si les Occidentaux reculent sur Yakaar-Teranga, une question se posera très vite :"
- F_1603 "qui prend leur place..."
- F_1627 "et à quel prix ? Voilà où en est le Sénégal."
- END ~1673 (NE PAS déborder sur "En à peine dix mois" = sc.6 à 345.10s).
⚠️ Calage AUDIO-DERIVED obligatoire (jamais hardcodé au pif) ; ces frames viennent du forced-align réel.

## FLUX EN 2 PHASES — CHECKPOINT OBLIGATOIRE
**PHASE A** : vérifie l'existant (frames V1 Beat13 + audio forced-align — DÉJÀ extraits/mesurés ci-dessus, confirme),
SCAN les catalogues Mapbox, consulte le jury si utile (`scripts/tools/da-brief.py --upstream`), puis ÉCRIS
`memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/PLAN-SCENE-5.md` (découpage carte→bascule, effets, SFX).
=> STOP. Remonte ton plan + 1 question de goût groupée. ⛔ NE CODE PAS avant validation Aziz (Claude relaie).
**PHASE B** (après validation) : code la scène (compo `SceneCoulissesV3`, enregistrée dans Root.tsx), render full HD
`npx remotion render src/index.ts SceneCoulissesV3 out/episodes/senegal-petrole-gaz/wip/scene5-coulisses-v1.mp4`,
self-review sur frames + `python3 scripts/tools/mapbox-selfreview.py <tsx>` (0 erreur), review (signal), upload catbox.
Compte-rendu lucide final (fait / trous / avec plus de temps).

## GATES TECHNIQUES (déjà actifs — ne pas contourner)
- `mapbox-selfreview.py` (0 erreur avant review) · `pre-presentation-review.sh` (review à jour avant upload catbox ;
  si faux positif Gemini → `<mp4>.review-override.md` tracé, JAMAIS modifier le hook) · `gemini-model-guard.sh`.

## SI TU TOURNES EN WORKTREE ISOLÉ (assets gitignorés ABSENTS — trou connu)
Branche source à checkout : `feat/senegal-v3-scene4-final` (contient tout le V3 + sc.4 FINAL).
Copier depuis le repo principal `/Users/clawdbot/Workspace/remotion/` (gitignorés, donc absents du worktree) :
- `public/souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3`
- `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3`
- les SFX nécessaires dans `public/_shared/sfx/` (ui/data/impact — voir ce qui existe)
- `out/episodes/senegal-petrole-gaz/beat13-FINAL.mp4` (réf V1, pour extraire des frames si besoin)
- `out/episodes/senegal-petrole-gaz/_audio-v3/forced-align-v3.json` (le calage)
- `.env` : NON copiable (harness bloque `cp .env`) → le `source .env` au runtime pour le token Mapbox.
