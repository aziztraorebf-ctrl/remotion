# RUNBOOK Vague 2 Phase 3 — Cahier des charges + investigation autonome

> Cree 2026-05-02. Source de verite operationnelle pour Phase 3 (Hook + Carte + Caravane + Deformation + Typo).
> Si conflit avec `VAGUE-2-LOCKED.md` : LOCKED prime sur le contenu narratif, ce runbook prime sur le processus.
> Branche : `feat/atlas-shaka-zulu-vague1`.

---

## Ordre execution valide

**B → D → C → E → A**

- B : Carte d3-geo Shaka (infrastructure pivot)
- D : Deformation S4 (test stress filtre + carte tot)
- C : Caravane impi S3 (test combine PixelLab + d3-geo)
- E : Typo 4 actes S2 (independant)
- A : Hook (cher, async, depend de la carte finalisee)

---

## Regles transversales

### Autonomie OUI (sans demander Aziz)
- Mini-render 5s apres chaque composant
- ffprobe sur output (duree, fps, codec)
- Read 3 frames espacees (debut/milieu/fin) pour validation visuelle
- Comparaison palette attendue (bordeaux/parchemin/or)
- Commit apres chaque bloc qui passe les criteres
- Swap couleur dans la palette validee (ex: bordeaux #8B1A1A → #B91C1C deja validé Kimi vague 2)
- Reduction de scope si perf casse (ex: 4 sprites → 2 sprites caravane), avec note dans le commit
- Mini-render 150s complet des que B+D+C+E passent (avec placeholder noir 5s pour Hook A)
- Recharger fonts via `@remotion/google-fonts` si fallback detecte
- Simplifier topojson si feTurbulence rame

### STOP + attendre Aziz
- 3 iterations echouees sur le meme probleme
- Cout API >50% du cap budget du bloc
- Decision creative (couleur HORS palette validee, recadrage majeur, choix narratif)
- Conflit code vs `VAGUE-2-LOCKED.md`
- Asset manquant inattendu (Natural Earth path bouge, sprites supprimes, etc.)
- **Cap dur Hook (A) : $2.00 Gemini+Seedance cumule**

### Cap iterations par bloc
- B / D / E : 3 essais composant + 2 essais render
- C : 3 essais (gotcha sprites = priorite absolue, regle 12)
- A : 3 essais Gemini + 2 essais Seedance + 2 essais transition

---

## BLOC B — Carte d3-geo Shaka

**Estim** : 30-45 min Claude. **Dep** : aucune. **Cout API** : $0.

### Criteres d'acceptation
- [ ] Carte KwaZulu-Natal centree, lisible mobile (test 375x667 mental)
- [ ] Palette parchemin #F5E6C8 / bordeaux #8B1A1A / or #D4A857 appliquee
- [ ] Filtre `feTurbulence` parchemin sur `<g>` carte uniquement (pas composition entiere)
- [ ] Frontieres modernes affichees (Natural Earth 50m)
- [ ] Props `expansion: 'territoire' | 'expansion' | 'mourning'` fonctionnel
- [ ] Mini-render 5s OK, render <3s/frame
- [ ] Cormorant Garamond + Inter charges via `@remotion/google-fonts`
- [ ] Commit pousse sur la branche

### Failure modes + investigation autonome

| # | Probleme | Detection | Action autonome | Cap |
|---|----------|-----------|-----------------|-----|
| B1 | feTurbulence ralentit render >5s/frame | `time` sur mini-render | Simplifier topojson (presimplify 0.01→0.05), retirer filtre `<g>` global → halo uniquement | 2 essais |
| B2 | Projection geoAzimuthalEqualArea mal centree | Read frame 0, KwaZulu hors cadre | Recentrer (-28.5, 31.0)→(lat ajuste), ajuster scale 1500-3500 | 3 essais |
| B3 | GeoJSON Natural Earth path absent | try/catch + ls | STOP — chemin Mansa Moussa peut avoir bouge, demander Aziz | 0 |
| B4 | Fonts Cormorant/Inter pas chargees | Read frame, texte invisible/Times fallback | Switch `@remotion/google-fonts` import direct ; verifier `loadFont()` appele dans composant | 2 essais |
| B5 | Couleurs palette pas appliquees (CSS scoping React) | Read frame, compare palette | Inline styles SVG au lieu de classes CSS | 2 essais |
| B6 | d3-geo render saccade en mode `expansion` | Mini-render 5s scrubbe | Interpolate continu sur toute la plage, pas de segments | 2 essais |

### Commande validation
```bash
npx remotion render src/projects/shaka-zulu/index.ts MapShakaZuluTest \
  /tmp/B-map-test.mp4 --frames=0-150 --concurrency=1 --gl=angle
ffprobe /tmp/B-map-test.mp4
```

---

## BLOC D — Deformation S4

**Estim** : 20-30 min Claude. **Dep** : Bloc B done. **Cout API** : $0.

### Criteres d'acceptation
- [ ] Filtre `mourning-warp` (feTurbulence anime) lie a spring Remotion
- [ ] Cercles concentriques SVG depuis palais uMgungundlovu (-28.84, 31.46)
- [ ] Onde Echo Maternel : 3 cercles cascades 0s/0.4s/0.8s
- [ ] AUCUN Gemini ici (lockdown LOCKED)
- [ ] Mini-render 5s OK
- [ ] PaperGrain compatible avec mourning-warp (pas de double feTurbulence visible)

### Failure modes + investigation autonome

| # | Probleme | Detection | Action autonome | Cap |
|---|----------|-----------|-----------------|-----|
| D1 | feTurbulence baseFrequency anime crash GPU | render timeout >2 min | Reduire numOctaves 4→2, clamp baseFrequency >0.001 | 2 essais |
| D2 | Cercles concentriques hors carte (palais mal projete) | Read frame milieu, cercles invisibles | Hardcode coords palais via projection.invert ou lire coords brutes (-28.84, 31.46) | 2 essais |
| D3 | Spring mourning-warp saccade | Scan frames espacees | Damping 100→200, stiffness 80→120 | 2 essais |
| D4 | PaperGrain + mourning-warp = effet flou ecrasant | Read frame avec/sans PaperGrain | Desactiver PaperGrain sur S4 uniquement, justifier "intensite emotionnelle" | 1 essai |

### Commande validation
```bash
npx remotion render src/projects/shaka-zulu/index.ts MourningWarpTest \
  /tmp/D-warp-test.mp4 --frames=0-150 --concurrency=1 --gl=angle
```

---

## BLOC C — Caravane impi S3

**Estim** : 30 min Claude. **Dep** : Bloc B done. **Cout API** : $0 (sprites existants).

### Criteres d'acceptation
- [ ] Sprites warrior + Shaka issus de `public/atlas-shaka-zulu/characters/.../animations/walk-east/` (PAS archive)
- [ ] Verification visuelle 2-3 frames AVANT loop (gotcha regle 12)
- [ ] Path Bezier d'expansion KwaZulu (3-4 points cles)
- [ ] interpolate lat/lon → x/y via projection
- [ ] Caravane parcourt territoire en 8-12s
- [ ] Mini-render 5s combine sprites + d3-geo + PaperGrain (Piege #3 Grok)
- [ ] Pas de pixellisation visible des sprites apres filtres

### Failure modes + investigation autonome

| # | Probleme | Detection | Action autonome | Cap |
|---|----------|-----------|-----------------|-----|
| C1 | **Sprites archive = 6 designs ≠ walk cycle** (REGLE 12, deja brule) | Read 3 frames espacees, comparer pixels visages/equipement | Si designs differents → 1 frame statique unique, PAS de loop. Annoncer dans commit. | 0 (regle absolue) |
| C2 | Sprite raster + filtre SVG = pixellisation | Read frame, zoom mental | Desactiver PaperGrain sur sprites uniquement (`<g filter="none">` autour) | 2 essais |
| C3 | Path Bezier sort de la carte | Read frame milieu+fin, sprite invisible | Clamp coords aux bounds GeoJSON Zulu (lat -29.5/-27.5, lon 30/32.5) | 3 essais |
| C4 | 4 sprites simultanes ralentissent render >5s/frame | Mini-render mesure | Reduire a 2 sprites (lieutenant + Shaka), justifier dans commit | 1 essai → reduction immediate |
| C5 | Fps walk cycle saccade (12fps default) | Scan frames | Tester 8fps ou 16fps, choisir le plus naturel | 2 essais |
| C6 | Walk-east sprite faisant face est mais caravane va sud | Direction visuelle frame | Charger walk-south si dispo, sinon flipper sprite via `transform: scaleX(-1)` ou rotation legere | 2 essais |

### Commande validation
```bash
ls public/atlas-shaka-zulu/characters/*/animations/walk-east/  # verifier sprites canoniques
npx remotion render src/projects/shaka-zulu/index.ts ImpiCaravaneTest \
  /tmp/C-caravane-test.mp4 --frames=0-300 --concurrency=1 --gl=angle
```

---

## BLOC E — Typo 4 actes S2

**Estim** : 25-35 min Claude. **Dep** : aucune. **Cout API** : $0.

### Criteres d'acceptation
- [ ] 4 reveals sequentiels : iklwa / bouclier / cornes / Gqokli Hill
- [ ] Synchros sur timestamps ElevenLabs forced-alignment S2
- [ ] Cormorant Garamond, reveal via `clip-path` ou `stroke-dasharray`
- [ ] Spring sur opacity + translateY
- [ ] Mini-render 5s OK
- [ ] Pas de chevauchement avec narration S3

### Failure modes + investigation autonome

| # | Probleme | Detection | Action autonome | Cap |
|---|----------|-----------|-----------------|-----|
| E1 | Timestamps ElevenLabs S2 absents/desynchros | Read JSON forced-alignment | STOP — relancer alignment, ne pas guesser | 0 |
| E2 | stroke-dasharray Cormorant ne fonctionne pas | Read frame, texte fige ou invisible | Fallback `clip-path: inset(0 100% 0 0)` reveal horizontal anime | 2 essais |
| E3 | 4 reveals chevauchent narration S3 | Comparer endFrame vs S3 startFrame | Reduire duree reveal individuel (60f→40f), garder positions | 2 essais |
| E4 | Reveals trop synchrones, lecture difficile | Scan frames mid-S2 | Ajouter offset 4-8 frames entre actes | 2 essais |

### Commande validation
```bash
cat src/projects/shaka-zulu/timing.ts | grep -A 5 "S2"  # verifier timestamps
npx remotion render src/projects/shaka-zulu/index.ts ActesTypoS2Test \
  /tmp/E-typo-test.mp4 --concurrency=1 --gl=angle
```

---

## BLOC A — Hook

**Estim** : 45-60 min Claude + 2-3 min attente Seedance. **Dep** : Bloc B done. **Cout API cap** : **$2.00 dur**.

### Criteres d'acceptation
- [ ] Image Gemini "Shaka adulte de dos contemplant KwaZulu-Natal" paper-craft
- [ ] AUCUNE particule doree/poussiere (R-NO-PARTICLES)
- [ ] Diversite + ethnicite zoulou explicite dans prompt
- [ ] Visualisation Claude perso AVANT Kimi review
- [ ] Clip Seedance 5s avec mouvement subtil (R-VIVANT-PARTOUT)
- [ ] Typo "Il est ne paria" Cormorant Garamond stroke-dasharray
- [ ] Transition Depliage Parchemin (rotateX clip + frontieres d3-geo dessinees autour)
- [ ] Mini-render Hook+transition+B reviewed Kimi
- [ ] Cout cumule <= $2.00

### Validation OBLIGATOIRE avec Aziz (pas autonome)
- Prompt Gemini final → Aziz valide AVANT generation
- Image Gemini → Aziz valide AVANT prompt Seedance
- Prompt Seedance final → Aziz valide AVANT generation
- Render final Hook → Aziz valide AVANT merge

### Failure modes + investigation autonome

| # | Probleme | Detection | Action autonome | Cap |
|---|----------|-----------|-----------------|-----|
| A1 | Image Gemini drift BD (visage generique non africain, particules dorees) | Visualisation perso + Kimi | Re-prompt avec template narratif strict + R-NO-PARTICLES + ethnicite explicite | 3 essais Gemini |
| A2 | Seedance clip statique ("frozen", R-VIVANT-PARTOUT) | Visualisation + ffprobe motion | Re-prompt mouvement explicite (vent dans cape, regard qui balaye horizon) | 2 essais Seedance |
| A3 | Transition Depliage Parchemin saccade (rotateX + d3-geo simultane) | Mini-render transition isolee | Etendre duree 1s→1.5s, separer rotateX (premier 50%) et frontieres dessin (second 50%) | 2 essais |
| A4 | Typo "Il est ne paria" pas synchro voix | Compare vs forced-alignment | Ajuster timing, JAMAIS contenu (LOCKED) | 2 essais |
| A5 | Cap budget atteint avant validation | Compteur cout cumule | **STOP DUR a $2.00**, presenter etat actuel a Aziz | 0 |

### Commandes validation
```bash
# Apres image Gemini
ls public/atlas-shaka-zulu/hook/  # verifier output
# Apres Seedance
ffprobe public/atlas-shaka-zulu/hook/shaka-hook-5s.mp4
# Apres Hook complet
npx remotion render src/projects/shaka-zulu/index.ts HookShakaTest \
  /tmp/A-hook-test.mp4 --concurrency=1 --gl=angle
```

---

## Mini-render 150s final (apres B+D+C+E)

**Declencheur autonome** : des que B+D+C+E sont commit et leurs mini-renders OK.

**Setup** :
- Hook (A) = placeholder noir 5s avec texte "HOOK PENDING"
- Render complet 150s @30fps (4500 frames)
- Output : `public/atlas-shaka-zulu/renders/vague2-phase3/full-150s-WIP.mp4`
- Upload Vercel Blob (ou base64 si store_suspended persiste) → URL pour Aziz

**Verifications autonomes apres render** :
- ffprobe : duree ~150s, fps 30, codec h264
- Read 5 frames espacees (0s, 30s, 75s, 110s, 145s)
- Verifier transitions segments (Hook→S1→S2→S3→S4→CTA) pas de glitch
- Verifier audio sync (mini-extraction segment milieu via ffmpeg)

**Si OK** : commit + presenter URL + brief 3 lignes a Aziz pour decision Hook.
**Si KO** : STOP, identifier bloc cassant, re-investiguer.

---

## Checklist commit par bloc

Apres chaque bloc qui passe :
1. `git add` fichiers du bloc uniquement (pas les autres blocs en cours)
2. Message commit format : `feat(shaka-zulu): vague 2 phase 3 — bloc <X> <description courte>`
3. Inclure dans le body : criteres atteints, failure modes rencontres, choix d'autonomie pris
4. Push sur `feat/atlas-shaka-zulu-vague1`

---

## Cas STOP rencontres (a remplir au fil du runbook)

> Liste vivante. Si je dois STOP autonome, je note ici avant de presenter a Aziz.

### BLOC B — Resolu en autonomie (3 essais B2)

- Essai 1 : `.center()` → carte hors cadre coin haut-gauche. Fix : `.rotate([-lon, lat_positif])`.
- Essai 2 : scale 2800 trop eleve pour portrait 9:16. Reduit a 1600.
- Essai 3 : `translate([W/2, H*0.62])` + `rotate([-31, 29])` → KwaZulu centre. VALIDE v5.
- **Lecon CWD** : toujours `cd /Users/clawdbot/Workspace/remotion` avant npx remotion render. Le `&&` bash herite le CWD du premier cd — danger si precompute tourne dans un sous-dossier.
- Perf B1 : 0.14s/frame, topojson simplification non necessaire.
- Statut : VALIDE. Commit fait.

---

## Notes finales

- Ce runbook est consultable a tout moment, je le relis avant chaque bloc
- Si une situation n'est pas couverte ici, je presume STOP et j'attends Aziz
- Le runbook peut etre mis a jour en cours de session si nouveau failure mode emerge (ajouter ligne dans tableau du bloc concerne)
