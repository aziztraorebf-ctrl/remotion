---
name: Apprentissages session Atlas Mansa Moussa V1 (2026-04-29)
description: Lecons techniques + decisions strategiques + patterns valides en session courante. A relire avant V2.
type: project
---

# Apprentissages session Atlas Mansa Moussa V1

> Session : 2026-04-29
> Duree session : ~10h continues
> Cout total : $0.52
> Livrable : Mansa Moussa V1 81s 1080x1920 satisfaisante

---

## 1. APPRENTISSAGES TECHNIQUES MAJEURS

### 1.1 Historical Basemaps GitHub — empires medievaux GeoJSON
**Source** : https://github.com/aourednik/historical-basemaps (GPL-3.0)
**Decouverte** : fichiers `world_<annee>.geojson` (1300, 1400, 1500...) contiennent polygones empires historiques avec property `NAME`.
**Pour Mansa Moussa** : `world_1300.geojson` -> "Mali" = 52 points apogee Empire pre-Mansa Moussa (Atlantique -> Niger). `world_1400` = Empire post-declin (commence lon 2.94, perte cote Atlantique).
**Pattern visuel valide** : empire historique fill dore opacity 0.30 + stroke pointille 14-7 dasharray glow. Mali moderne par-dessus en indigo opacity 0.55 + stroke plein dore.
**Reutilisable** : Songhai 1500, Ghana 1100, Aksoum, Kanem-Bornou, Almoravides, Almohades, etc.
**Memoire dediee** : `feedback_historical-basemaps-empires-medievaux.md`

### 1.2 Mapbox-gl runtime saccades projection switch
**Probleme observe** : switch globe -> mercator a zoom 4.2 cree 1-3 frames de saccade visible. V1 fait ce switch plusieurs fois (Tombouctou, Caire, CTA dezoom).
**Mitigations testees** :
- Crossfade indigo (V5-V7 Tombouctou) : retire en V8 = double clipping pire que saut natif
- Easing.inOut(Easing.cubic) : pas suffisant
**Solution radicale identifiee** : abandonner Mapbox-gl runtime pour V2 hybride statique.

### 1.3 Gemini avec image de reference (char-ref)
**Pattern valide** : envoyer 1-2 images de reference + prompt "use as STYLE GUIDE only, generate DIFFERENT character".
**Mitigation risque "Gemini reproduit l'original"** : prompt explicite "DIFFERENT face", elements differenciateurs visibles (couronne plus elaboree, pepite or, robes terracotta vs bleu).
**Code** :
```python
contents=[
    types.Part.from_bytes(data=ref1_bytes, mime_type="image/png"),
    types.Part.from_bytes(data=ref2_bytes, mime_type="image/png"),
    PROMPT
]
```
**Validation** : portraits A v2 + B v2 generes avec char-ref Abou Bakari = coherence canon GeoAfrique parfaite.

### 1.4 fal.ai Minimax music v2.6 — endpoint status change
**Bug observe** : pattern `generate-music-v2.py` (Tombouctou) hardcodait `/v2.6/requests/{id}/status` avec GET = HTTP 405 Method Not Allowed.
**Cause racine** : fal.ai a change le routing. L'endpoint status retourne maintenant explicitement `status_url` dans submit response, sans v2.6 dans path.
**Fix** : utiliser `data.get("status_url")` retourne par submit, ne JAMAIS hardcoder.
**Memoire dediee** : `feedback_minimax-fal-api-status-endpoint.md`

### 1.5 Kimi K2.5 max_tokens insuffisant
**Bug observe** : avec `max_tokens=4096`, Kimi epuise tout le budget en `reasoning_content` interne et ne produit pas de `content` final (`finish_reason: length`).
**Fix** : augmenter `max_tokens` a 16384 minimum pour pre-composition reviews. Coût reste raisonnable (~$0.015 pour ~5400 tokens output).
**Note** : K2.5 force `temperature=1` (autres valeurs rejetees avec HTTP 400).

### 1.6 ElevenLabs eleven_v3 tags audio
**Tags valides observes en pretest** : `[mysterious]` `[fast]` `[curious]` `[serious]` `[dramatic]` `[confident]`.
**Pattern** : placer tags inline dans le texte, retirer les tags AVANT forced-alignment (regex `\[\w+\]\s*` car non prononces).
**Settings canonique Atlas** : `stability=0.22, similarity_boost=0.55, style=0.55` avec voix Narratrice GeoAfrique v2 (`z3gESu49naEZW8Af2Upm`).
**Tags non testes** : `[whispers]`, `[shouts]`, `[laughs]`, `[sighs]`, `[excited]`, `[sarcastic]`, `[loud]`, `[soft]`. Possible champ d'experimentation V2.

---

## 2. DECISIONS STRATEGIQUES PRISES

### 2.1 Pivot architectural V2 hybride
**Decision** : abandon Mapbox-gl runtime, passage 100% Remotion compositing statique (cartes pre-rendues + overlays SVG/PNG + animations transform).
**Why** : flexibilite creative + fluidite 60fps + identite marque + reutilisabilite cross-episodes.
**Reference visuelle** : Hundred Years War Short (https://youtube.com/shorts/-VWk5IDn3CA) telecharge dans `research/reference-shorts/ref-france-england.webm`.
**Pattern observe documente** dans `NEXT-SESSION-mansa-moussa-v2-hybride.md`.

### 2.2 Long format Atlas accepte (80s+)
**Decision Aziz** : Atlas long format ~5 min sera quasi gratuit (Mapbox gratuit + Remotion local + Vercel Blob gratuit), seul ElevenLabs scale lineairement. Donc duree script = liberte creative.
**Pour Mansa Moussa** : 80s valide. Pour episode 3 et au-dela, possibilite explorer 3-5 min.

### 2.3 Style canon personnages humains GeoAfrique = BD flat
**Correction d'erreur** : V1 portrait A initial genere en "paper-craft sepia" (style mosquee Sankoré V8) = INCOHERENT avec personnages canon GeoAfrique.
**Realite** : Sonjata + Abou Bakari = BD flat moderne (aplats clean, pas de texture papier). C'est le canon pour personnages humains.
**Paper-craft reste valide** pour : architectures (mosquee), decors, paysages.
**Application V2** : portraits Mansa Moussa A v2 + B v2 generes avec char-ref Abou Bakari = coherent canon.

### 2.4 Cross-fade portraits A -> B en CTA finale (Q1 Kimi)
**Logique narrative** : A (gros plan calme) sur "Mansa Moussa" #1 a 67.84s + B (trône majestueux) sur "Mansa Moussa" #2 a 80.14s (punch finale).
**Implementation** : opacity interpolate avec timing pourcentage.
**Adopte V1** : valide visuellement frames 70s + 80s.

### 2.5 Q2/Q3 Kimi pre-composition adoptees
- Q2 (scene plate) : micro-zooms scene 2 sur chiffres-choc (boost 0.15-0.30 sur "moitie", "Tombouctou", "Sankore"). Pattern code `microZoomBoost(frame)` reutilisable.
- Q3 (moment 1 "La moitie.") : freeze bearing + dolly-in zoom 0->0.4 + cartouche ½ geant 130px Cormorant.
- Q3 (moment 2 "Un seul homme...") : desaturation 70% map filter + music duck 0.04->0.01.
Tous adoptes V1, fonctionnent.

### 2.6 Particules or hook (R-NO-PARTICLES exception narrative)
**Regle generale** : pas de particules decoratives (memoire `feedback_no-particles.md`).
**Exception narrative validee** : sur "s'effondrer" du Hook (1-3s), 8 particules SVG cercles dores qui tombent verticalement. Justification : narrative pas decorative (l'or qui tombe = sujet du Short).
**Adopte V1** : valide frame 1.5s.

### 2.7 Aziz mobile = uploads Vercel Blob obligatoires
**Confirme cette session** : tout asset/render local doit etre uploade sur Vercel Blob et URL fournie. Aziz ne peut pas voir les chemins locaux.
**Memoire dediee deja** : `feedback_aziz-mobile-uploads-vercel.md`

### 2.8 Attribution cartographique = description, pas footer permanent
**Constat** : V1 avait footer permanent "Traces : Natural Earth · Historical Basemaps (GPL-3.0)" et logo Mapbox visible.
**Verite legale** :
- Natural Earth = domaine public, AUCUNE attribution requise
- Historical Basemaps GPL-3.0 = credit dans description YouTube suffit
- Mapbox ToS = autorise attribution dans description / cartel credits 1-2s a la fin
**Pour V2** : retirer footer permanent + cartel credits 2s en fin de Short + bloc description YouTube prepare.

---

## 3. PATTERNS PRODUCTION VALIDES (REUTILISABLES)

### 3.1 Pre-composition Kimi review (etape obligatoire avant code)
**Pattern** : envoi brief strict text-only (script + alignment + contexte session + hard caps) -> Kimi K2.5 -> 3 questions precises (composition par scene, scene plate, traitement [serious]) -> synthese filtre Claude -> validation Aziz -> code.
**Cout** : ~$0.015.
**ROI** : evite 60-90 min re-render si scene foire.
**A integrer** dans `atlas-template-v1.md` section 4 nouvelle entree "Pre-composition review Kimi".

### 3.2 Pre-tests ElevenLabs avant narration complete
**Pattern** : tester 4-5 mots a risque (noms propres, prononciations FR ambigues) sur ~10s pretest avant narration 80s. Cout pretest ~$0.005.
**Adopte session courante** : Rockefeller, Bezos, Musk, Mansa, Moussa testes ; tags [confident][fast][dramatic] testes en pretest 2.

### 3.3 Validation BLOQUANTE avant call paye
**Pattern** : Claude liste prompts/parametres precis -> Aziz valide -> Claude lance.
**Memoire dediee** : `feedback_validation-bloquante-avant-paid-call.md`

### 3.4 Review Claude visuelle AVANT envoi Kimi/Aziz
**Pattern** : Claude utilise Read tool sur image/video pour analyser visuellement -> identifie morphing/drift/artefacts -> AVANT envoyer Kimi avec brief precis -> AVANT presenter Aziz.
**Pattern adopte session** : 9 frames extraites du render V1 reviewees Claude avant upload Vercel.

### 3.5 timing.ts derive de forced-alignment.json
**Pattern** : extraire timestamps mots-cles depuis JSON alignment -> creer `T = { start: sec(0), maliAppears: sec(4.02), ... }` typescript.
**Disambiguation** : si meme mot apparait plusieurs fois (`douze` x4 dans Mansa Moussa), iterer avec contexte mot avant/apres pour identifier la bonne occurrence.

---

## 4. ASSETS CREES SESSION (REUTILISABLES V2)

### Audio (TOUS reutilisables)
- `narration-v3.mp3` (81.04s) + `narration-v3-alignment.json`
- 4 SFX : B-impact-stamp, C-caravane-ink-draw, D-cartouche-thud, E-vent-sahara
- Musique : C-mande-contemplatif.mp3 (Minimax v2.6)

### Visuels (TOUS reutilisables)
- `gizeh-medallion.png` (paper-craft Gizeh fond indigo)
- `mansa-portrait-A-v2-canonique.png` (gros plan, char-ref Abou Bakari)
- `mansa-portrait-B-v2-canonique-trone.png` (trône, double char-ref)
- Backups V1 : `mansa-portrait-A-papercraft.png` + `mansa-portrait-B-bdflat.png` (initiaux non canoniques, garder en archive)

### GeoJSON (TOUS reutilisables)
- `src/mali-polygon.json` (Mali moderne Natural Earth 50m)
- `src/mali-empire-1300-polygon.json` (Empire Mali 1300 Historical Basemaps)
- `src/egypt-polygon.json` (Egypte Natural Earth 50m)
- `data/world_1300.geojson` + `world_1400.geojson` (sources empires medievaux pour futurs episodes)
- `data/ne_50m_countries.geojson` (Natural Earth complet, deja telecharge)

### Code (composition V1)
- `src/AtlasMansaMoussaShowcase.tsx` (V1 Mapbox-gl runtime - reference architecturale)
- `src/AtlasEmpireHaloTest.tsx` (mini-test concept Empire halo)
- `src/timing-mansa-moussa.ts` (timing derive forced-alignment)

### Scripts production
- `scripts-atlas/script-mali-mansa-moussa-v3.md` (script LOCKED final)
- `scripts-atlas/generate-mansa-moussa-narration.py`
- `scripts-atlas/forced-alignment-mansa-moussa.py`
- `scripts-atlas/generate-sfx-mansa-moussa.py`
- `scripts-atlas/generate-music-mansa-moussa.py` (avec fix endpoint fal.ai)
- `scripts-atlas/generate-mansa-portrait-A-v2.py` (avec char-ref)
- `scripts-atlas/generate-mansa-portrait-B-v2.py` (avec 2 char-refs)
- `scripts-atlas/kimi-precomposition-mansa-moussa.py` (pattern pre-composition review)

### Recherche
- `quebec-jacques-poc/research/FACT-CHECK-MANSA-MOUSSA.md` (9 chiffres verifies, 2 corrections)
- `research/reference-shorts/ref-france-england.webm` (video reference V2)
- `research/reference-shorts/frames/` (13 frames analysees)

---

## 5. ERREURS A NE PAS REPRODUIRE V2

1. **Hardcoder URL endpoints fal.ai** -> toujours utiliser `status_url` retourne par submit
2. **max_tokens trop bas Kimi K2.5** -> minimum 16384
3. **Confondre paper-craft sepia (architectures) avec canon personnages humains (BD flat)** -> portraits humains = toujours BD flat avec char-ref canon
4. **Halo radial circulaire pour empire** -> pas geographiquement honnete, audience puriste va detecter. Utiliser GeoJSON academique (Historical Basemaps).
5. **Polygone manuel pour empire historique** -> JAMAIS, toujours source academique
6. **Footer attribution permanent** -> credit dans description suffit, cartel 2s fin Short max
7. **Switch globe<->mercator multiple en runtime** -> saccades inevitables, abandonner pour V2 statique
8. **Lancer call paye sans pretest mots a risque** -> coût pretest negligeable, evite re-narration

---

## 6. METRIQUES SESSION

- **Duree session** : ~10h continues
- **Cout total** : $0.52 (sous budget Atlas typique $0.40-0.50, leger depassement absorbé par tests A/B canon)
- **Render time final** : 12 min (estime 30-60 min, plus rapide que prevu)
- **Mots narration** : ~167 (densite 2.06 mots/s)
- **Frames render** : 2446 frames @ 30fps = 81.04s
- **Resolution** : 1080x1920 (Short 9:16)
- **Decisions strategiques** : 8 prises et documentees
- **Bugs identifies + fixes** : 2 (fal.ai endpoint + Kimi max_tokens)
- **Memoires creees** : 3 (`feedback_historical-basemaps-empires-medievaux.md`, `feedback_minimax-fal-api-status-endpoint.md`, ce dossier `atlas-mansa-moussa/`)
