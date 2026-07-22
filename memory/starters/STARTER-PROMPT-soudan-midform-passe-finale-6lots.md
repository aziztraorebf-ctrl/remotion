> ⛔⛔ **PÉRIMÉ (2026-07-21 nuit)** — LES 6 LOTS SONT FAITS (codés+commités+validés sur branche
> `feat/soudan-passe-finale-6lots`). Ce starter décrivait le travail À FAIRE ; conservé pour trace.
> **→ POUR LA SUITE (assemblage), LIRE : [STARTER-PROMPT-soudan-midform-ASSEMBLAGE-FINAL.md](STARTER-PROMPT-soudan-midform-ASSEMBLAGE-FINAL.md)**

# STARTER — Soudan mid-form, PASSE FINALE (6 lots) issue de la passe LLM downstream

> Session dediee : appliquer les 6 lots d'amelioration issus de la passe LLM (Gemini+Kimi, diagnostic +
> 2 prospectifs) sur le mid-form Soudan complet. Rapports bruts : `memory/episodes/soudan-midform/da-briefs-passe-llm-2026-07-21/`
> (01 a 06). Convergence Gemini/Kimi TRES forte = signal fiable, mais LLM=SIGNAL jamais juge : verifier chaque
> effet contre le code reel, appliquer, STOP (pas de boucle review->fix->review).

## ETAT A LA REPRISE (verifier code+render avant d'agir)

- **Mid-form 6 actes ASSEMBLE** (v1, narration seule) : `out/episodes/soudan-midform/wip/soudan-midform-ASSEMBLAGE-v1-6actes.mp4`
  (625.8s = 10min26) + `-compressed.mp4` (720p 30.6mo, envoyee au LLM). Ordre A1(hook 57s)+A2+A3-globe+A4-v14+A5+A6.
- **Acte 4 = v14 Phase 2** (`wip/acte4-v14-phase2-full.mp4`), **Acte 3 corrige jetons** (`wip/acte3-globe-jetons-fix-full.mp4`).
  ⚠️ NI l'un NI l'autre PROMU FINAL (attendaient cette passe). ⚠️ Acte 1 jamais promu PRET-PUBLICATION (recupere catbox `qc5dgq`).
- **Contrainte cadre (rappelee par Aziz, NON-NEGOCIABLE)** : moteur = D3.js/SVG 2D frame-driven. PAS d'After Effects,
  PAS de GEO layers, PAS de 3D volumetrique, PAS de particules physiques. Tout effet = trace SVG / gradient /
  opacite animee / transform geometrique / mouvement camera D3 (rotate projection, scale). **LA LISIBILITE DE
  L'ACTION PRIME TOUJOURS** — un effet qui encombre/distrait = rejete. Elegance sobre documentaire.

## DEJA FAIT (NE PAS RE-CODER — verifie dans le code)
Flux qui coulent (stroke-dashoffset), glows territoriaux RSF/SAF, ondes de choc (Kosti+B6), graticule tactique,
navire proportionnel, respiration Nil, geoplaques B6, jetons-portraits Hemedti/al-Burhan.

## LES 6 LOTS (priorises, implementation SVG/D3 precise)

### LOT 1 — LANGAGE DU GLOBE (le coeur, priorite haute)
1. **Souffle de frontiere** : quand on nomme un pays (Turquie ~3:40, Egypte ~4:10, Russie ~4:43), dupliquer le
   `<path>` de sa frontiere, animer stroke-width 1->10px + stroke-opacity 0.8->0 en ~800ms (ease-out) = onde
   lumineuse qui epouse le pays. Ne masque pas le drapeau. Fichiers globe actes 3-6.
2. **Anneaux de siege El-Fasher** (~7:36, Acte 5) : 3 cercles concentriques (stroke rouge, fill none) qui
   grandissent+s'estompent en cascade (decalage 0.3s) + point central clignotant = effet radar/SOS. Priorite n1 Kimi.
3. **Inner glow atmospherique** : superposer au globe un `<circle>` taille projection, radialGradient transparent
   au centre -> sombre/bleute au bord (opacity ~0.3) = illusion sphere 3D. Deja faisable. TOUS les actes globe.
4. **Convoi de points** le long des arcs : 2-3 `<circle>` r=3px qui filent le long du path (getPointAtLength /
   interpolation D3), couleur par camp. Complete les fleches sans les remplacer. + epaisseur variable des flux
   (principal 4px / secondaire 2px).
5. **Grain de texture SVG** : `<filter feTurbulence fractalNoise baseFrequency=0.6 numOctaves=3>` sur rect couvrant
   le globe, opacity 0.05 = rendu "papier/dossier premium". Deja faisable. Discret.

### LOT 2 — CAMERA D3 (briser la fixite)
1. **Dolly-in** : montee de scale + recentrage sur Port-Soudan (~5:07) et El-Fasher (~7:36). Intention = enjeu
   strategique. Deja faisable (on a camAt, ajouter des keyframes de scale).
2. **Derive/rotation lente** pendant les syntheses (B6 4 puissances ~6:24, rotation projection ~+5deg/10s).
3. **Pull-out** dezoom sur l'ONU/UA (Acte 6 ~8:25) = souligner l'impuissance par l'immensite du globe.

### LOT 3 — MUSCLER LE DEBUT (0:00-2:30, Actes 1-2 Mapbox)
1. **Accroche revelation** (0:00-0:15) : mines dorees qui pulsent (halo radial, scale-pop overshoot) AVANT le
   jeton Hemedti. Zoom cinematique D3/Mapbox rapide (ease-out).
2. **Fracture RSF/SAF** (~1:26) : tracer une ligne de faille SVG (path craquele) qui coupe le pays N->S + leger
   voile rouge(ouest)/bleu(est), snap net (pas de fade mou). ⚠️ PAS de vibration/shake (Aziz a exclu le shake).
3. Transition 2019->2021 (~0:57) : marquer par flash bref + micro-zoom au lieu du fondu.

### LOT 4 — LISIBILITE JETONS
1. Jetons-visages **+30-50%** au debut (0:33-1:15) + contour blanc 2-3px + ombre portee (feDropShadow). Taille
   constante en pixels ECRAN (compenser le zoom camera, cf navire Acte 4).
2. **Pont visuel** aux croisements de flux (~3:48) : sous le stroke colore, un stroke couleur-de-fond plus epais
   (6px) qui "coupe" la ligne du dessous.
3. Cercles de faction plus epais, couleurs plus saturees (RSF #D32F2F / SAF #1976D2).

### LOT 5 — DENSIFICATION CHIFFRES + ONU
1. Empire de l'or (~2:48) : barres verticales dorees croissantes OU halo dore qui s'etend sous Hemedti + compteur.
2. **Salle ONU/UA incarnee** (~8:08-9:11) : drapeaux clippes dans les sieges (`<clipPath>`) + table fer-a-cheval
   (path) + **VETO RUSSE** (jeton s'agrandit, croix rouge, autres sieges assombris). Fort consensus.
3. Bilan humain (~10:00) : grille symbolique (~135 points, 13 s'eteignent = ratio deplaces). Sobre.
4. ⚠️ "50 millions" (~0:29) dot-density le long du Nil : RETENU MAIS a doser (risque surcharge — lisibilite prime).

### LOT 6 — AUDIO (musique + SFX, convergence precise)
- **MUSIQUE Minimax** (`fal-ai/minimax-music/v2.6`, instrumental) — style "thriller geopolitique minimaliste".
  Prompt Gemini pret : `Tense geopolitical documentary background music, pulsing analog synth bass, sparse low
  cello drones, ticking clock percussion, brooding, neutral, investigative, no melody, minimal, steady 75 BPM.`
  Evolution : 0:00-1:25 minimal (drone+tic-tac) · 1:26 basse pulsante (guerre) · 8:08 nappe suspendue (ONU) ·
  10:00 silence 2s puis violoncelle seul grave. Volume : voix a -6dB de headroom, musique = nappe jamais melodie.
- **SFX** (7 stingers ponctuels <2s, sons mats "renseignement", PAS hollywoodiens, sur les keyframes) :
  0:06 mines=ting metallique · 1:26 fracture=craquement+bass drop sub · 3:09 connexion Dubai=bip modem/sonar ·
  4:44 Russie=klaxon bateau+gresillement radio · 6:03 drone strike=bourdonnement croissant puis impact mat +
  cut son 1s · 8:55 veto russe=clank metallique+silence 1s · 10:00 bilan=vent+craquement bois.
  Generer via `scripts/generate-sfx-elevenlabs.py`. Mix : voix reine.

## METHODE
- Attaquer par lot, render classique par acte touche (D3 = PAS render-mapbox.sh ; Actes 1-2 Mapbox = render-mapbox.sh).
- Verifier CODE+FRAMES soi-meme avant de conclure. Deleguer les lots independants a des agents worktree (superviser).
  ⚠️ Gotcha worktree cette session : les worktrees d'agents peuvent naitre sur une branche perimee -> l'agent doit
  verifier `git merge-base --is-ancestor` puis `git merge --ff-only feat/soudan-acte4-globe-3registres`, et copier
  les mp3 audio gitignores depuis le repo principal. Sinon faire les fichiers isoles en direct (comme Kosti LOT 4b).
- Re-assembler apres chaque lot majeur, comparer a `soudan-midform-ASSEMBLAGE-v1`. Audio EN DERNIER (une fois le
  visuel fige) : generer musique+SFX -> mixer sur l'assemblage final -> promouvoir 6/6.
- APRES : promouvoir Acte 3+4 FINAL, promouvoir Acte 1 (jamais fait), assemblage final AVEC audio, promotion mid-form complet.

## RAPPORTS SOURCES (relire avant de coder un lot)
`memory/episodes/soudan-midform/da-briefs-passe-llm-2026-07-21/` : 01/02 diagnostic (G/K), 03/04 prospectif A globe
(G/K), 05/06 prospectif B execution+audio (G/K). Briefs envoyes = `_brief-*.txt`.
