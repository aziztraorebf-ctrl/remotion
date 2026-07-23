# remotion-composer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Detail lourd (code complet, sessions archivees) -> `memory/tools/remotion.md` + `RULES-ACTIVE.md`.
> Last updated: 2026-07-22 (correction SourcePlaque : migration fichiers perimes -> fichiers actifs)

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

---

## Pattern SourcePlaque (bandeau source bas-droite) — 2026-07-22

Composant recopie a l'identique (pas d'export cross-fichier sauf si `export const` present) dans
chaque fichier d'acte. Fade in 10f / hold 54f / fade out 12f (~1.8s). `right/bottom:40`,
`maxWidth:620`, fond parchemin `rgba(242,229,200,0.86)`, Georgia 20px `#3A2A18`. Prop optionnel
`rightOffset` si l'acte a un insert plein-ecran avec cadre decoratif proche du bord (defaut ne suffit
pas). Format texte : 1 SEULE source courte "Nom, date", jamais de liste, jamais "Source:". Reference
complete + code : `src/projects/warmap/soudan-acte4/SoudanActe4.tsx` (fonction `SourcePlaque`).

**Gotchas** :
- `whiteSpace:nowrap` ne clippe PAS un texte trop long — il deborde visuellement sur les elements
  sous-jacents au lieu d'etre tronque. Verifier en mini-render, surtout noms de source composes
  (>30 caracteres = risque avec un cadre decoratif a marge <40px).
- Frames absolues multi-Sequence : chaque section a un timing LOCAL (frame 0 = debut section). Frame
  absolue = `offset_section + F_local`. Ne jamais confondre avec la frame locale utilisee dans le JSX
  (celle-la reste correcte telle quelle, c'est seulement pour cibler un mini-render `--frames=X-Y`
  qu'il faut la conversion).
- Fichiers actifs vs R&D perimes : plusieurs projets ont des fichiers `_rnd/*` aux noms proches des
  fichiers reellement montes. SEUL Root.tsx (`id="CompId"` + `component={...}`) dit lequel est actif.
  Prefixe `D3-` dans l'id = variante de test isolee, jamais assemblee au montage final.

---

## Sessions archivees (resume 1 ligne — detail dans git log / PIPELINE.md si besoin)

- 2026-04-13 : setup initial, 8 regles non-negociables.
- 2026-04-22 : Sonjata, pattern Hook + Option B musique valide.
- 2026-04-24/25 : refactor memoire (RULES-ACTIVE.md, CHECKLIST-PRE-COMPOSE.md), safe zones tranchees.
- 2026-06-28 : Cacao Short VB — pattern transfusion cross-composition (raccord couleur+Y entre 2
  compositions separees), remplissage silhouette qui se VIDE (fillUp puis drain, jamais simultanes).
- 2026-07-17 : Kosti Acte4 K3 (station+drone SVG) — SVG dans son propre viewBox recale via
  `<g transform="translate(DX DY)">` ; wrapper `<svg>` pour corps SVG anime dans un `<div>` positionne
  (un div ne contient pas de SVG brut) ; gotcha "creux a l'impact" (droneOp=0 ET flashOp=0 pile a
  impactAt, tester impactAt+20 pour voir l'effet).
- 2026-07-22 (A) : Soudan A4->A5 continuite — élément persistant d'un acte precedent = pleine opacite
  des frame 0 (jamais fade-in, ca lirait comme une apparition), fade-out doux au pivot narratif propre.
- 2026-07-22 (B) : Soudan plaques SOURCE Actes 1-4 (8 plaques, voir PIPELINE.md pour le detail
  fait/source/frame) — pattern SourcePlaque documente ci-dessus, issu de cette session.
- 2026-07-22 (C) : CORRECTION — 2 des 4 fichiers edites en (B) etaient les REGISTRES MAPBOX PERIMES
  (`soudan-acte3/SoudanActe3.tsx`, `soudan-acte4/SoudanActe4.tsx`, remplaces par le globe D3 selon
  STATUS.md, confirme par extraction frames a3.mp4/a4.mp4 = globe orthographique visible). `git checkout
  --` a suffi pour revert (diff propre, 26 et 29 lignes ajoutees, 0 residu apres). Plaques REAPPLIQUEES
  sur les vrais fichiers actifs : `SoudanActe3Section1Globe.tsx` (fait "milliard" Jebel Amer, ancrage
  local `F.milliard=595`), `SoudanActe3GlobeInsert.tsx` (fait "EAU 1er importateur", 4e plaque ajoutee a
  cote des 3 deja presentes, ancrage `T.b3PremierImportateur` deja defini dans
  soudanActe3GlobeInsertTiming.ts — PAS invente, repris tel quel), `SoudanActe4B1toB4Globe.tsx` (fait
  "base navale", ancrage `T.soudanPasSigne` deja defini), `soudan-acte4/KostiInsertSVG.tsx` (fait "drone
  Kosti", ancrage local `impactAt = f4.droneFrappe`, ce fichier N'ETAIT PAS perime — reutilise tel quel
  dans `Kosti-Beat5-Standalone` de Root.tsx). Mini-renders `npx remotion still` sur les 4 emplacements =
  tous OK, aucun chevauchement (KostiInsertSVG a un cadre decoratif jusqu'a x=1892/1920 -> rightOffset=68
  necessaire, deja documente dans le gotcha ci-dessus).
  **LECON METHODE** : avant d'editer un fichier "acte" dans un projet avec plusieurs generations de
  moteur (Mapbox -> D3), TOUJOURS verifier STATUS.md du projet ET croiser avec une frame extraite du
  rendu reel AVANT d'assumer qu'un fichier au nom evident (`SoudanActeN.tsx`) est le fichier actif —
  Root.tsx peut encore l'enregistrer comme composition de test isolee sans qu'il soit dans le montage.
