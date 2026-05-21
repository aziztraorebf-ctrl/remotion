---
name: NEXT SESSION - Mansa Moussa V2 Vector Iter2 (production complete + fixes Iter1)
description: Brief self-contained pour reprendre apres validation S3 mini-render Iter1. 3 sources de feedback (Aziz + Claude + Gemini) consolidees + plan production 5 scenes restantes.
type: project
---

# NEXT SESSION — Mansa Moussa V2 Vector Iter2

> Cree : 2026-04-30 fin session V2 vector pivot
> Statut : S3 mini-render Iter1 livre + reviewed (Aziz visuel + Gemini API)
> Pipeline valide : 100% Remotion + d3-geo SVG paths + Natural Earth GeoJSON + chibi PNG overlays
> Verdict Gemini : "PROCEED WITH MODIFICATIONS — fix components first, then batch-produce the rest"
> Cout cumule V2 jusqu'a present : $0.355 ($0.07 parchemin abandonne + $0.07 carte test abandonnee + $0.07 chibi A + $0.14 chibi B/C abandonne + $0.005 review Gemini)

---

## ETAT ACTUEL — CE QUI EST FAIT ET VALIDE

### Pipeline V2 valide (NE PAS REOUVRIR)
- Mapbox runtime ABANDONNE definitivement (saccades + manque flexibilite)
- Cartes parchemin Gemini ABANDONNE (drift frontieres + style decoratif)
- Mapbox satellite + filtre sepia ABANDONNE (rendu "fade")
- **PIPELINE FINAL : d3-geo + Natural Earth + Historical Basemaps GeoJSON projete en SVG paths + overlays Remotion**

### Decouvertes techniques cles
- **`d3-geo` precompute** : `node scripts-atlas/precompute-atlas-v2-data.mjs` -> `src/atlas-v2-data.json` (3 datasets : globe orthographic + Mercator wide Mali->Mecque + Mercator narrow West Africa + Mercator Caire)
- **PNG transparency Gemini** : Gemini retourne RGB sans alpha, fond gris (212,212,212) qui parait transparent dans Read mais ne l'est PAS. Fix : `scripts-atlas/fix-chibi-transparency.py` (chroma-key + crop bbox + RGBA)
- **Audio offset narration** : `<Audio src startFrom={Math.round(34 * fps)}>` pour test mid-narration
- **Composition viewBox SVG** : viewBox='0 0 720 1280' + `transform="translate(...) scale(...)"` pour camera moves au lieu de toucher viewBox

### Assets generes V2 (TOUS REUTILISABLES Iter2)
- `public/atlas-mansa-moussa/v2/chibi/caravane-A.png` (frame walk pose A, transparent OK, 755x855 cropped)
- `public/atlas-mansa-moussa/v2/chibi/caravane-B.png` (frame walk pose B - **A NE PAS UTILISER en Iter2**, voir bug)
- `public/atlas-mansa-moussa/v2/chibi/caravane-C.png` (frame walk pose C - **A NE PAS UTILISER en Iter2**)
- `src/atlas-v2-data.json` (1.2 MB, 188 ortho + 103 wide + 103 narrow + 103 caire countries)

### Composition test S3 (a reutiliser comme template)
- `src/AtlasV2SceneS3Test.tsx` — Scene S3 Climax Hadj 16s avec audio
- Composants reutilisables : `Cartouche`, `CaravaneAnim`, `SubtleStars`
- URL Vercel render Iter1 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/scene-s3-iter1-O3VOqZW1gGzXlcBNmkeZU3wg0muj3x.mp4

---

## FIXES PRIORITAIRES ITER2 (3 sources convergentes)

### CRITIQUE — Bloquants pour batch-production
1. **CAMEL WALK CYCLE - ABANDONNER A-B-C, garder seulement frame A**
   - Aziz: "Le mouvement, ne marche pas vraiment. Une patte se plie en boucle, les autres ne bougent pas"
   - Claude: bbox different par frame (755x855 vs 857x966 vs 1024x1024) -> redimensionnement = effet pop
   - Gemini: "frames don't have exact same pixel dimensions, needs interpolate XY + Math.floor frame swap"
   - **Fix simple** : retirer le walk cycle, garder caravane-A.png seul + hopping vertical Math.abs(sin)
   - Code : remplacer `walkCycle = [...]` par `chibiSrc = "caravane-A.png"` const

2. **PNG TRANSPARENT BOX FLICKER - artefact lie au cycle (autoresoud avec fix #1)**
   - Aziz: "le carre transparent apparait et disparait, n'arrete pas de popper"
   - Cause : swap entre 3 PNG de bbox differents = flash visible
   - **Fix** : se resout automatiquement quand on enleve le walk cycle (frame A seul)

3. **LABEL OVERFLOW + CLIPPING**
   - Aziz: "LA MECQUE ne rentre pas dans le carre, LE CAIRE coupe le point pulse"
   - Gemini: "use padding instead of fixed width OR measure text dynamically"
   - **Fix** : changer `text.length * 14 + 24` -> `text.length * 16 + 36` ; ajouter offsetY=-30 minimum + reduire pulse outer ring r 6+28 -> 4+18

4. **PATH CARAVANE DEJA ENTIER A FRAME 0**
   - Gemini: "the path from Mali to Cairo is already fully visible at 0:03"
   - Cause Claude : `strokeDashoffset = pathTotalLength * (1 - t)` mais `t` est computed de `startFrame -> endFrame`, pas de la position chibi
   - **Fix** : synchroniser `dashOffset` avec position du chibi (lui aussi dependant de t) -> dashOffset = lenAccumulatedToCurrentSegment

### IMPORTANT — Polissage perceptible
5. **OCEAN ENCORE TROP FONCE** (Aziz + Gemini convergents)
   - Aziz : "barely visible, peut-etre eclaircir encore plus"
   - Gemini : "indigo too heavy, looks like black void on mobile, lighten 10-15%"
   - **Fix** : `oceanDeep #1F3855` -> `#3A5A7E` (ou `#2E4A6A` pour intermediaire)

6. **AUDIO-VISUAL SYNC "60 000"** (Gemini reperage)
   - Gemini : "60,000 number appears slightly AFTER the spoken word"
   - **Fix** : avancer `BEATS.soixanteHommes` de 0.1-0.15s (de 43.46s a ~43.30s)

7. **CARTOUCHES TRANSITION SAUTE** (Claude)
   - Disparition brutale "DOUZE ANS" -> "60 000"
   - **Fix** : ajouter fadeOut 10 frames (cartouche disappears smoothly avant suivant)

### NICE TO HAVE — Si temps disponible
8. **CARAVAN SILHOUETTES (60 000 hommes visualization)** (Gemini)
   - Ajouter 2-3 silhouettes camel semi-transparentes trailing derriere main chibi
   - Effet "procession massive" plutot que "voyageur solo"
   - **Cout** : $0 (reutiliser caravane-A.png en duplique opacity 0.4 + 0.25)

9. **TEXTURE OVERLAY SUBTILE** (Gemini)
   - Mix-blend-mode multiply opacity 0.1 paper texture sur whole composition
   - Donne le "Atlas feel" papier ancien sans deteriorer la lisibilite
   - **Cout** : reutiliser `parchment-mande.png` deja genere ($0)

10. **MALI OUTLINE NOIR MAT au lieu de cream** (Claude)
    - Mali fill cream + outline cream + Empire 1300 hatching cream = trop similaire
    - Outline noir mat dur (#1A1A1A) separe les niveaux

### CRITIQUE NEW POUR PRODUCTION COMPLETE
11. **SOUS-TITRES KARAOKE** (Gemini priorite #1, manquant total)
    - "biggest missing piece, Jacques a dit lives and dies by centered high-impact word-level highlighting"
    - **Pattern reutilisable** : `memory/templates/subtitles-shorts.md` (Sonjata)
    - **Source mots+timestamps** : `narration-v3-alignment.json` (deja existant)
    - **Theme couleur** : or `#D4A574` (palette V1)
    - **Implementation** : composant `AtlasSubtitlesKaraoke.tsx` partage entre toutes les scenes

---

## PIECES VALIDEES (NE PAS TOUCHER)

Ces elements fonctionnent et doivent etre conserves tels quels en Iter2 :

- ✅ Pipeline d3-geo + Natural Earth + Historical Basemaps GeoJSON
- ✅ Palette terracotta land + cream Mali fill + cream hatching Empire 1300 + indigo ocean (a eclaircir d'un cran seulement)
- ✅ Pulse markers ring blanc + dot dore stroke noir
- ✅ Cartouches Cormorant Garamond + spring entry + wobble subtil
- ✅ Camera motion : drift sinusoidal + scale pendulum (1.0 -> 1.18 -> 1.0)
- ✅ Audio offset narration via `<Audio startFrom>`
- ✅ SFX D-cartouche-thud sur chiffres-choc (60 000, 12 000, 80 chameaux)
- ✅ Hopping vertical sur chibi (Math.abs(sin(frame*0.4))*5)
- ✅ Empire Mali 1300 hatching cream sur land terracotta (excellent contraste)
- ✅ Layout cartouches haut/bas (140 + 1140) sans chevauchement avec labels villes (apres fix)

---

## PLAN PRODUCTION ITER2 (recommandation Gemini : "fix components first, then batch")

### Phase 1 - Fix S3 components (1h, $0)
- Appliquer fixes #1-7 dans `AtlasV2SceneS3Test.tsx`
- Re-render mini-test S3 avec fixes
- Validation rapide visuelle Claude + Aziz (1 cycle)

### Phase 2 - Componentize for reuse (1h, $0)
- Extraire composants reutilisables :
  - `<AtlasGlobe>` (vue ortho avec rotation + halo)
  - `<AtlasMercator>` (vue Mercator avec scale + drift)
  - `<AtlasLabel>` (pill auto-width + spring entry)
  - `<AtlasCartouche>` (Cormorant + wobble + fadeOut)
  - `<AtlasPulseMarker>` (ring + dot + stroke)
  - `<AtlasCaravane>` (chibi + path + hopping)
  - `<AtlasSubtitlesKaraoke>` (word-by-word from alignment.json)
- Fichier : `src/atlas-v2-components.tsx` partage entre toutes scenes

### Phase 3 - Batch produce 5 scenes restantes (3-4h, $0)
Audio narration v3 + 4 SFX + musique Mande Contemplatif + portraits A/B v2 + medaillon Gizeh = TOUS reutilisables V1.

| Scene | Duree | Camera | Elements |
|-------|-------|--------|----------|
| Hook 0-4s | 120 frames | Globe ortho rotation | Particules or scene 1 ("effondrer") |
| S1 Setup 4-16s | 360 frames | Globe -> Mercator narrow West Africa | Mali appears + Empire 1300 reveal |
| S2 Densite 16-34s | 540 frames | Zoom progressif Mali->Tombouctou | Cartouches "moitie/Tombouctou/Sankore" |
| S3 Climax Hadj 34-50s | 480 frames | Mercator wide Mali->Mecque (DEJA TEMPLATE) | Caravane + 4 cartouches |
| S4 Consequence 50-62s | 360 frames | Mercator Caire close-up | Egypte rouge effondrement + medaillon Gizeh |
| S5 CTA 62-81s | 570 frames | Retour globe ortho | Portraits A v2 -> B v2 cross-fade |

### Phase 4 - Sous-titres karaoke (1h, $0)
- Composant `AtlasSubtitlesKaraoke.tsx` adapte de `memory/templates/subtitles-shorts.md`
- Source : `narration-v3-alignment.json`
- Theme couleur : or `#D4A574`
- Disable sur scene CTA portraits

### Phase 5 - Mini-renders validation par scene (30 min, $0)
- Render chaque scene independamment 5-10s avec audio
- Validation rapide Aziz scene par scene (eviter render full debugage)

### Phase 6 - Render final + upload Vercel (20 min, $0)
- Composition complete `AtlasMansaMoussaShowcaseV2Vector.tsx`
- Render full 81s @ 30fps 720x1280
- Compression CRF 28 si > 50MB
- Upload Vercel `atlas-mansa-moussa/v2/showcase-v2-final.mp4`
- Comparaison cote-a-cote V1 vs V2 pour validation finale

**Cout total Phase 1-6 : $0** (zero call API additionnel, tous les assets sont generes ou code).
**Temps total : 7-8h.**

---

## STARTER PROMPT NEXT SESSION

```
Charge la memoire de session :
1. MEMORY.md (auto-charge)
2. memory/atlas-mansa-moussa/NEXT-SESSION-mansa-moussa-v2-vector-iter2.md (ce brief)
3. memory/atlas-mansa-moussa/LEARNINGS-V2-VECTOR-PIPELINE.md (apprentissages techniques V2 vectoriel)

Session Atlas Mansa Moussa V2 Iter2.

Pipeline valide : d3-geo + Natural Earth + Remotion vectoriel.
S3 mini-render Iter1 reviewed par Aziz (visuel) + Gemini (technique).
Verdict Gemini : "PROCEED WITH MODIFICATIONS — fix components first, then batch".

Action prioritaire :
1. Phase 1 - Fix 7 critiques dans AtlasV2SceneS3Test.tsx (camel cycle, label overflow, ocean lighter, etc.)
2. Re-render S3 mini-test pour validation
3. Si OK -> Phase 2 componentize + Phase 3 produire 5 scenes restantes (Hook, S1, S2, S4, CTA)

Cout estime restant : ~$0 (tous assets pretrs).
Temps estime : 7-8h.

Audio + portraits + medaillon + GeoJSON + timing.ts = TOUS reutilisables.

URL S3 Iter1 reference : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/v2/scene-s3-test/scene-s3-iter1-O3VOqZW1gGzXlcBNmkeZU3wg0muj3x.mp4
```

---

## RISQUES IDENTIFIES (a anticiper Iter2)

1. **Path strokeDashoffset sync avec chibi** : si le bug "path deja entier" persiste apres fix, considerer separer le path en N segments avec apparition individuelle (Niani-Tombouctou, Tombouctou-Sahara, Sahara-Caire, Caire-Mecque)
2. **Sous-titres karaoke + cartouches simultanes** : pourrait creer pollution visuelle, prevoir hide subtitles quand cartouche active OU position cartouche differente de subtitles
3. **Render time 81s full** : avec 188 ortho countries + 103 mercator = beaucoup de SVG paths. Estimer 8-15 min render. Si > 20 min, considerer simplifier (filtrer pays Africa+Europe+Arabie seulement)

---

## DECISIONS VALIDEES SESSION COURANTE (NE PAS REOUVRIR)

1. **Pipeline final** : d3-geo + Remotion vectoriel (PAS Mapbox, PAS After Effects+GEOlayers)
2. **Style cartes** : terracotta land + indigo ocean + cream Mali + halo dore + ciel etoile (palette V1 conservee)
3. **Walk cycle camel ABANDONNE** : frame A seul + hopping vertical suffit
4. **Sous-titres karaoke OBLIGATOIRES** : couleur or, source forced-alignment, theme V1
5. **Production batch 5 scenes apres fix S3 components** (recommandation Gemini suivie)
6. **V1 Mansa Moussa Mapbox archive** : ne pas publier, garder comme reference architecturale

---

## METRIQUES SESSION COURANTE

- Duree session : ~6h
- Cout total session : $0.355 ($0.21 testage approches abandonnees + $0.14 chibi B/C abandonne + $0.005 review Gemini)
- Renders test : 5 (parchment overlay 6 variantes, vector test, globe test, S3 first, S3 Iter1)
- Decouvertes techniques cles : 5 (d3-geo pipeline, PNG transparency Gemini bug, audio offset narration, walk cycle Gemini bug, palette V1 reproductible 100% en code)
- Memoires creees : 2 (ce brief + LEARNINGS-V2-VECTOR-PIPELINE.md)
