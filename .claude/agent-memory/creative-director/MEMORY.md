# Creative Director - Persistent Memory

> Projet actif : **Peste 1347** — Style SVG Enluminure/Gravure pur (pivot 2026-02-21)
> Epoch PixelLab/Godot archivée : voir `archive/pixellab-godot-epoch.md`

---

## Aziz's Visual Preferences (learned from rejections)
| What he rejected | Why | Lesson |
|-----------------|-----|--------|
| Sprites on black backgrounds | "Low effort", slideshow feel | Rich scene compositions required |
| Characters floating in sky | Incorrect Y positioning | Must validate ground plane before placement |
| Scene 7 scatter/flee | NOT in script, confabulated | Always verify against scenes.json verbatim |
| Kimi's "frozen tableau" direction | Too flat | Aziz wants MOVEMENT, not static compositions |
| Incremental patches on same failure | Gets worse | Rebuild from zero after 2 failed attempts |

## Aziz's Visual Preferences (learned from approvals)
| What he approved | Context | Lesson |
|-----------------|---------|--------|
| SVG enluminure/gravure dual-style | 4 reviewers validés | Style de référence pour toute la vidéo |
| HookBlocA board-game token aesthetic | Scène d'intro village | Fond parchemin + bordure or + personnages SVG |
| HookBlocB Via Pestis carte propagation | 7.0-7.5/10 Kimi | Galères + route vermillon + ondes concentriques |
| spring() + interpolate() Remotion | EffectsLab sandbox | Jamais Framer Motion ni CSS keyframes |
| EffectsLab S5 torche/vignette | "le plus impressionnant" | PRIORITAIRE pour scènes nocturnes |
| EffectsLab S9 carte propagation | "très impressionnant et très belle" | Technique géo-historique validée |

---

## EffectsLab — Catalogue des Effets Valides (2026-02-22)
> Sandbox : `src/projects/style-tests/EffectsLab.tsx` (3000f, 10 segments, 30fps)
> Planche contact : `effectslab-contact-sheet.png` (racine workspace)
> Regles intégration : `memory/key-learnings.md` section "Effets SVG"

| Seg | Effet | Technique clé | Quand l'utiliser | Aziz verdict |
|-----|-------|--------------|-----------------|--------------|
| S1  | Baseline | interpolate() pur | Référence | N/A |
| S2  | Grain + Fumée SVG | feTurbulence overlay + cercles | Village vivant, toute scène | "assez bons" |
| S3  | spring() apparitions | spring() position | Entrées personnages | "glissement" (scale 0→1 mieux) |
| S4  | Dessin progressif plume | stroke-dasharray | Intro scène, cartes, titres | Validé |
| S5  | Torche + vignette nocturne | radial gradient pulsant Math.sin | Nuit, mort, bûchers, tension | **"le plus impressionnant"** |
| S6  | Split-screen Enluminure/Gravure | clipPath + feColorMatrix | Transition temporelle AVANT/PENDANT | Validé — PARCIMONIE (max 1×) |
| S7  | Lottie vs SVG comparatif | @remotion/lottie | Test only — SVG gagne | Lottie abandonné |
| S8  | Marche Math.sin() | Math.sin() membres opposition | Personnages en déplacement | Validé (ancrage production requis) |
| S9  | Carte propagation géo | stroke-dasharray + ondes | Visualisation historique | "très impressionnant et très belle" |
| S10 | Micro-expressions | ry blink + pupille + bouche + flash + taches | Choc, peur, contamination | Validé |

### Règles de choix d'effet pour une scène (utiliser lors du Direction Brief)
- **Scène nocturne / mort / bûcher** → S5 OBLIGATOIRE (torche + vignette)
- **Intro de scène (village qui apparaît)** → S4 (dessin progressif)
- **Personnage entre en scène** → S3 spring() MAIS scale 0→1 (pas slide from off-screen)
- **Personnage se déplace** → S8 (Math.sin walking)
- **Choc émotionnel / contamination visible** → S10 (micro-expressions)
- **Carte géographique / propagation** → S9 (routes progressives + ondes)
- **Village vivant, texture atmosphère** → S2 (grain overlay + fumée SVG légère)
- **Transition temporelle AVANT/PENDANT/APRÈS** → S6 (split-screen, max 1× par vidéo)
- **Règle absolue** : 1 effet dominant par scène. Maximum 1 effet subtil de texture en plus.

### Anti-patterns détectés EffectsLab
- Grain en blend mode `multiply` : assombrit l'image (Aziz rejeté). Utiliser `overlay`.
- spring() sur entrée latérale : "glissement subit". Préférer scale 0→1 (apparition in situ).
- Superposition torche + grain fort + split-screen = interdit.
- Lottie `smoke_postin.json` : couleurs cartoon sombre (#333) incompatibles palette médiévale.

---

## Direction Briefs History (Epoch SVG Enluminure)

### 2026-02-24 - "Le Lion et la Riviere qui Parle" - Direction Brief V2 (REBUILD)
- CIRCUIT BREAKER declenche : V1 trop rudimentaire vs S06Silhouette (baobabs champignons, lion blob, zero filtres)
- Verdict V2 : READY TO CODE — specifications precises, 0 questions bloquantes
- Standard cible : S06Silhouette.tsx — techniques extractes et mappees scene par scene
- Filtres SVG V2 : 13 filtres declares (glow stdDev=18-50, soft stdDev=2-3, water-blur=4, heat distort, flash=50)
- Palettes V2 : S1=#C0391B->D4922A / S2=#040D2E->1E3A5F / S3=#1B2A4A->E8A88A / S4=#F0C060->F5EDD8
- Baobab V2 : tronc bulge path quadratique + branches horizontales + touffes terminales (PAS ellipses)
- Lion V2 : ellipse corps + circle tete + criniere 12 pics triangulaires + pattes Q curves + queue S
- Hutte V2 : corps arrondi path Q + toit parabolique Q (PAS triangle) + lueur foyer Math.sin flickering
- Lune S2 : technique S06 exacte (halo radialGradient + glow filter + disque + ombre decalee croissant)
- Etoiles S2 : 60x, twinkle = 0.4 + Math.sin(frame*0.06 + i*0.8)*0.3 (identique S06)
- Aura danger S2 f700-800 : radialGradient rouge #7A1A14, filter stdDev=25, technique S06
- Explosion S4 f1600 : flash radialGradient blanc-or, filter stdDev=50

### 2026-02-22 - BlocB (hook_01+02+03) - ParcheminMapEurope
- Verdict: NEEDS ANSWERS (Q1: cadavres hook_02 visuels? Q2: zoom-out ou coupure nette?)
- Style prescrit: parchemin medieval, vocabulaire portulan/Mappa Mundi
- Metaphore unique: route vermillon 3 segments (Issyk-Kul->Caffa->Messine)
- Assets reutilisables: ParcheminMapProto.tsx (galere SVG), HookBlocA.tsx (bordure/parchemin), hookTiming.ts (VISUAL_CUES deja mappes)

### 2026-02-22 - Hook Complet hook_00 a hook_07
- Verdict: NEEDS ANSWERS (Q1-Q4 bloquantes)
- ALERT CRITIQUE : hook_00 absent de scenes.json V3.1 — hors-script non valide
- Assets confirmes : TopDownVillage + ParcheminMapProto + EnluminureGravureProto + CharacterSheet + ParchmentTransition
- Palette : 3 variantes parchemin dans le code — harmonisation requise avant production (#F5E6C8)

### 2026-02-22 - BlocB Direction Brief série de révisions
- HookBlocB scores Kimi : v1 7.5/10 → v2 7.5/10 → v5 7.0/10 (MINOR FIXES)
- Issue récurrente : narrative closure faible (ship state pas changé au climax)
- P1 BLOQUANT toujours ouvert : torn sail + darkened hull + glow par f800

### 2026-02-22 - S3 Fuite des Elites (seg3_01 a seg3_08, ~52s)
- Verdict: READY (toutes questions résolues — en attente audio S3 + ffprobe pour Stage 1.8)
- 4 sous-scenes : A=Départ (enluminure), B=Abandon (transition gravure), C=Data pause (gravure), D=Constante (gravure+vermillon retour)
- Guillaume : marche en A (scale 1.1, sort à droite), absent en B+C, silhouette scale 0.55 en D (sort progressivement)
- Corps sous-scène B : silhouette anonyme enluminure (PAS le bonnet de Pierre — universalise l'abandon)
- Désaturation A→B : commence sur dernière syllabe "partent", monochrome complet en 45-60f (1.5-2s)
- Boccaccio : médaillon portrait fixe en A/seg3_02, pas personnage récurrent
- Graphique mortalité : style registre médiéval tracé plume (JAMAIS infographie moderne), barres stroke-dasharray
- ALERTE : Martin, Isaac, Renaud ABSENTS de ce segment — ne pas les introduire

### 2026-02-21 - Serie Chronique Enluminee
- Style valide (4 reviewers) : "Chronique enluminee animee", SVG pur, zero PixelLab
- Palette : bleu royal #2D3A8C, or #C9A227, parchemin #F5E6C8, vermillon #C1392B, encre #1A1008
- 5 archetypes : Pierre (laboureur), Martin (pretre), Isaac (preteur), Guillaume (seigneur), Agnes (guerisseuse)
- Code existant couvre 5/5 archetypes via EnlumCharacters.tsx (Renaud + Agnes ajoutes)

---

## SVG Enluminure : Règles Critiques (apprises 2026-02-21)
- Proportion medievale : tete = 1/5 hauteur (headR=38 pour totalH=220). NE PAS changer.
- Identification par forme UNIQUEMENT : l'accessoire distinctif doit etre visible en silhouette pure.
- 5 couleurs max par personnage, 20 couleurs max pour tous les 5 ensemble.
- feColorMatrix saturate + bg-color interpolation = technique de transition enluminure->gravure validee.
- path morphing = INTERDIT dans Remotion (utiliser rotate() sur pivot articulation a la place).
- Banderoles : uniquement latin historique ou texte du script. Jamais du francais moderne invente.

## Palette canonique SVG Projet (IMMUABLE)
```
PARCHMENT = #F5E6C8   (source : ParcheminMapProto.tsx — référence absolue)
INK       = #1A1008
GOLD      = #C9A227
VERMILLON = #C1392B
SKY_BLUE  = #2D3A8C
```
TopDownVillage #f0e6c8 et CharacterSheet #f4e8c8 DIVERGENT — harmoniser sur #F5E6C8 avant assemblage.

## Recurring Questions Aziz Should Answer
- Where should text appear on screen? (size, position, animation)
- How many characters on screen for crowd scenes?
- Reference images for visual style targets?
- Same background across adjacent scenes with color grade, or different backgrounds?

## Checkpoint Preview Rule (OBLIGATOIRE)
Claude DOIT générer un preview PIL + lire avec Read tool AVANT d'envoyer tout render à Aziz.
Aziz a demandé explicitement : "est-ce que tu preview comme auparavant avant de m'envoyer ?"

## Error Pattern Tracker (actif — SVG epoch)
| Pattern | Count | Last Seen | Status |
|---------|-------|-----------|--------|
| Confabulated scene content | 3 | 2026-02-17 | Catch — always check scenes.json |
| Incremental patch spiral | 3+ | 2026-02-18 | Circuit breaker rule active |
| Narrative closure faible (Kimi) | 3× | 2026-02-22 | P1 BLOQUANT : état navire au climax |
| Palette PARCHMENT tripartite | 1 | 2026-02-22 | Harmoniser sur #F5E6C8 avant assemblage |
| Grain blend multiply | 1 | 2026-02-22 | Utiliser overlay à la place |
