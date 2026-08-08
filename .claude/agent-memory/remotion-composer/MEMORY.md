# remotion-composer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Detail lourd (code complet, sessions archivees) -> `memory/tools/remotion.md` + `RULES-ACTIVE.md`.
> Last updated: 2026-08-08 (NorthShieldV3, refonte 7->5 panneaux apres retour Aziz)

---

## Regles absolues (rappel court — detail complet dans RULES-ACTIVE.md)

- Budget API : Remotion render = $0, jamais de raison de restreindre. Asset/SFX manquant au moment
  d'assembler -> STOP, lister, signaler a Aziz, JAMAIS appeler visual-producer/ElevenLabs soi-meme.
- Apres mini-render : analyser les frames soi-meme -> verdict -> presenter. Ne pas enchainer vers le
  full render sans validation.
- Agent Teams actif (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) : peut recevoir assets de
  visual-producer sans passer par Claude principal.

---

## Patterns par famille de projet

- **Shorts 9:16 30fps** : 1 composition + 1 sub-component/scene. Audio narration vol=1.0 + musique
  -18dB. Sans-serif hook / serif (Cormorant Garamond) corps. Marges top120/bottom200/sides60px.
- **Long-form vertical 9:16** : 1 composition + 1 fichier/Acte + 1 sub-component/sous-scene.
- **Long-form horizontal 16:9** : subtitle zone Y>=850 reservee.
- **GeoAfrique Shorts** : 9:16 30fps, Seedance/Kling clips + Ken Burns, paper-craft sepia, musique
  Minimax kora vol=0.07, narration ElevenLabs v2.

## Spring configs validees

`damping:200` = smooth ease-in/out · `damping:20,stiffness:200` = snappy entry · `damping:8` = bouncy
impact · `damping:100,mass:1.5` = intro longue.

## Remotion API gotchas

- `@remotion/transitions` : `totalComp = sum(durations) - sum(transitions)` (overlap adjacents).
- Vercel Sandbox : `public/audio/` gitignored -> render LOCAL obligatoire si narration/musique, puis
  upload MP4 compresse (`scripts/tools/upload-to-blob.py`). Quota Blob Hobby 1GB, cleanup si besoin.
- **Mapbox/WebGL headless** : `npx remotion still/render` brut ECHOUE ("Failed to initialize WebGL").
  OBLIGATOIRE : `scripts/render-mapbox.sh <CompId> <out.mp4> --frames=X-Y` (chrome-headless-shell +
  `--gl=angle`). D3/SVG pur compositions n'en ont pas besoin (`--gl=angle` seul suffit).
- HOOK PATTERN (Sonjata) : hook Sequence from=0 durationInFrames=HOOK_FRAMES, scenes decalees de
  HOOK_FRAMES, musique silence pendant hook (Option B). Reference : `SonjataShortFull.tsx`, template
  `memory/templates/hook-short.md`. OffthreadVideo `muted` obligatoire si clip source a deja de l'audio.
- **Mini-render multi-frames sur gros `public/`** : `npx remotion still/render` CLI recopie tout
  `public/` a chaque appel (>2min si 2.6+ Go) -> script Node local (`.scratch-composer/render-
  stills.mjs`, `@remotion/bundler`+`@remotion/renderer`, bundle() une fois puis N renderStill()
  dans le meme process). Doit vivre DANS le repo (pas `/tmp`) pour resoudre `node_modules`.

---

## Pattern SourcePlaque (bandeau source bas-droite)

Composant recopie a l'identique dans chaque fichier d'acte. Fade in 10f / hold 54f / fade out 12f
(~1.8s). `right/bottom:40`, `maxWidth:620`, fond parchemin `rgba(242,229,200,0.86)`, Georgia 20px
`#3A2A18`. Prop `rightOffset` si insert plein-ecran a cadre decoratif proche du bord. 1 SEULE
source courte "Nom, date". Reference : `src/projects/warmap/soudan-acte4/SoudanActe4.tsx`
(`SourcePlaque`). Gotchas : `whiteSpace:nowrap` deborde au lieu de clipper si texte trop long
(verifier en mini-render, noms >30 caracteres a risque) · frames absolues multi-Sequence = offset
section + F_local (la frame JSX reste locale, seule la conversion pour cibler `--frames=X-Y`
change) · fichiers actifs vs R&D perimes : SEUL Root.tsx (`id=`+`component=`) dit lequel est actif,
prefixe `D3-` = variante de test jamais assemblee au montage final.

---

## NorthShieldV3 — mix video H3 + SVG + refonte apres retour realisateur (2026-08-07/08)

**Session 1 (assemblage initial, 7 panneaux, mix H3+SVG)** :
- Splitter un plan H3 en 2 sous-clips complementaires : mesurer les cues audio (`alignment.json`)
  pour placer le cut, sauf si les 2 clips sont deja litteralement complementaires (verifie par
  extraction de frames avant de coder).
- Composant d'animation existant (ex P5DashboardMorphBosse) reutilise apres un clip H3 d'intro :
  le nester dans sa PROPRE `<Sequence from={clipDur-fade}>` pour que son `useCurrentFrame()`
  reparte a 0 — sinon tous ses seuils T_XXX internes tombent au mauvais moment.
- Budget de frames insuffisant pour un composant repris tel quel : COMPRESSER le clip d'intro (pas
  le composant), le beat le plus important doit rester entierement dans le budget (verifier en
  extrayant une frame pile sur ce beat).
- Extraire des frames du clip H3 AVANT de coder le split/overlay (`ffmpeg -vf select`) : seule
  facon fiable de savoir ou est cadre le personnage pour placer les annotations sans superposition.

**Session 2 (refonte majeure 7->5 panneaux apres retour Aziz detaille)** :
- Supprimer des panneaux redistribue les frames (toutes vers un panneau juge trop court), ne les
  retire pas de la composition totale — decision explicite a confirmer, pas a deduire seul.
- Un playbackRate peut changer de SENS (accelere->ralenti) quand la fenetre change : meme clip,
  fenetre elargie -> le clip devient plus court que la fenetre -> recalculer le rapport a chaque
  changement, ne jamais assumer le sens.
- Un bug de dimensionnement (`width * 1.3` debordant le cadre) peut etre duplique dans 2 fichiers
  differents qui partagent un composant (LaptopMockup, present tel quel dans P5VideoSarah ET
  P5DashboardMorphBosse) : grep le nom du composant partage dans TOUT le projet des qu'un bug de
  ce type est signale, pas seulement le fichier explicitement cite dans le brief.
- Extraire un pattern reference (ex disque+anneau Flowdesk) en composant partage (`ui/DiscFrame.tsx`)
  AVANT de le dupliquer dans 2 endroits — evite la divergence, fix futur a 1 seul endroit.
- Rendre un mecanisme "abstrait" visible = faire voyager un delta numerique vers un compteur, pas
  juste ajouter du texte statique. Dupliquer EN LECTURE SEULE les constantes de timing du
  composant source dans le wrapper (jamais diverger) pour rester synchronise.
- "Vivant" = ajouter une consequence visuelle physique (camera punch-in sur le `<svg>` global +
  onde de choc radiale separee), pas seulement augmenter l'amplitude d'un pulse existant deja
  present — un pulse ampli seul (0.06->0.11) n'aurait probablement pas suffi a rendre un pic
  "impossible a manquer".
- Mini-render "stills cibles" : choisir les frames PRECISEMENT sur les evenements internes
  calcules (ex frame du punch-in derivee de `T_X + 0.22s` -> frame absolue), pas juste
  debut/mid/fin generique — necessaire pour verifier un beat ponctuel (<0.5s dans une seq de 15s).

---

## Sessions archivees (resume 1 ligne — detail dans git log / PIPELINE.md si besoin)

- 2026-04-13 : setup initial, 8 regles non-negociables.
- 2026-04-22 : Sonjata, pattern Hook + Option B musique valide.
- 2026-04-24/25 : refactor memoire (RULES-ACTIVE.md, CHECKLIST-PRE-COMPOSE.md), safe zones tranchees.
- 2026-06-28 : Cacao Short VB — transfusion cross-composition (raccord couleur+Y entre 2
  compositions separees), remplissage silhouette qui se VIDE (fillUp puis drain, jamais simultanes).
- 2026-07-17 : Kosti Acte4 K3 — SVG recale via `<g transform="translate(DX DY)">` dans son propre
  viewBox ; wrapper `<svg>` obligatoire pour corps SVG anime dans un `<div>` positionne ; gotcha
  "creux a l'impact" (droneOp=0 ET flashOp=0 pile a impactAt, tester impactAt+20).
- 2026-07-22 : Soudan A4->A5 continuite (element persistant = pleine opacite des frame 0, jamais
  fade-in) · 8 plaques SOURCE Actes 1-4 (pattern SourcePlaque ci-dessus) · correction : 2 fichiers
  edites etaient des REGISTRES MAPBOX PERIMES (remplaces par le globe D3) — `git checkout --` a
  suffi pour revert, plaques reappliquees sur les vrais fichiers actifs. Lecon methode : avant
  d'editer un fichier "acte" multi-generations (Mapbox->D3), TOUJOURS croiser STATUS.md + une
  frame extraite du rendu reel avant d'assumer qu'un fichier au nom evident est actif — Root.tsx
  peut l'enregistrer comme composition de test isolee sans qu'il soit dans le montage.
